An HTTP request sent over a TCP connection the library builds itself, segment by segment, with no socket from the operating system in the path. The library does the handshake, the sequence numbers and the acknowledgements; Node's own HTTP machinery writes the request and parses the response, driven in a Sans-IO way through `wire.http()` so it never touches a socket.

This is the point of the project: the request leaves on a TCP segment this code crafted, so the segment can be anything a normal stack would never send.

The operating system does not know about this connection, so when the peer's SYN+ACK reaches its kernel it answers with a RST and tears the connection down before the exchange finishes. The connection is kept alive by dropping those resets, once:

```
# Linux, for the duration of the run
iptables -A OUTPUT -p tcp --dport 8080 --tcp-flags RST RST -j DROP
```

```javascript
import otw, { tcp } from 'over-the-wire';

const url = new URL(process.argv[2] ?? 'http://127.0.0.1:8080/');
const host = url.hostname;
const port = Number(url.port || tcp.PORT_HTTP);
const WINDOW = 65535;
const TIMEOUT_MS = 4000;

const wire = otw();
const { iface } = await wire.route(host);
const sourcePort = 40000 + Math.floor(Math.random() * 20000);

const theirSegments = wire.filter().ipv4({ src: host }).tcp({ src: port, dst: sourcePort });
const capture = await wire.capture({ iface, filter: theirSegments });

const connection = {
  sequence: Math.floor(Math.random() * 0xffffffff),
  acknowledged: 0,
};

const segment = (flags, payload) => {
  const description = wire.packet()
    .ipv4({ dst: host })
    .tcp({ src: sourcePort, dst: port, seq: connection.sequence, ack: connection.acknowledged, windowSize: WINDOW, flags });

  return payload === undefined ? description : description.payload({ data: payload });
};

const send = async (flags, payload) => {
  capture.write(await segment(flags, payload));
  connection.sequence = (connection.sequence + (payload?.length ?? 0)) >>> 0;
};

const nextFromServer = async () => {
  const packet = await capture.expect(theirSegments, { timeout: TIMEOUT_MS });

  if (packet === null) {
    throw new Error(`No answer from ${host}:${port}`);
  }

  return packet.layers.TCP;
};

const synAck = await (async () => {
  await send({ syn: 1 });
  connection.sequence = (connection.sequence + 1) >>> 0;
  const answer = await nextFromServer();

  if (!(answer.flags.syn && answer.flags.ack)) {
    throw new Error('The server did not accept the connection');
  }

  return answer;
})();

connection.acknowledged = (synAck.seq + 1) >>> 0;
await send({ ack: 1 });

const exchange = wire.http(url, {
  method: process.env.HTTP_METHOD ?? 'GET',
  headers: { host: url.host },
  body: process.env.HTTP_BODY,
});

for await (const bytes of exchange.bytesToSend()) {
  await send({ psh: 1, ack: 1 }, bytes);
}

const acknowledge = (upTo) => {
  connection.acknowledged = upTo;
  return send({ ack: 1 });
};

for (;;) {
  const incoming = await nextFromServer();
  const body = incoming.next?.buffer ?? Buffer.alloc(0);

  if (body.length > 0) {
    exchange.deliver(body);
    await acknowledge((incoming.seq + body.length) >>> 0);
  }

  if (incoming.flags.fin) {
    exchange.end();
    await acknowledge((incoming.seq + body.length + 1) >>> 0);
    await send({ fin: 1, ack: 1 });
    break;
  }
}

const response = await exchange.response;

console.log(`${response.status} ${response.reason} (HTTP/${response.httpVersion})`);

for (const [name, value] of Object.entries(response.headers)) {
  console.log(`${name}: ${value}`);
}

console.log('');
console.log(response.body.toString());

capture.destroy();
wire.close();
```

```
$ sudo iptables -A OUTPUT -p tcp --dport 8080 --tcp-flags RST RST -j DROP
$ node http.js http://10.0.0.2:8080/hello
200 OK (HTTP/1.1)
content-type: text/plain
date: Fri, 20 Nov 2026 22:48:09 GMT
connection: close
transfer-encoding: chunked

method=GET path=/hello body=""
```

- `wire.http(url, options)` is the Sans-IO driver. It returns the request as bytes to put on the wire (`bytesToSend()`), takes the response bytes back (`deliver`), and resolves `response` once Node's parser has read the whole message. It opens no socket of its own, so the bytes can travel however this code decides to send them.
- The request here asks for `connection: close`, so the server ends the body by closing: the final `FIN` marks the end, which is simpler than following `Content-Length` and chunked encoding by hand. That part stays Node's.
- This is a single connection with one segment in flight and no retransmission, which is enough for a request and a short reply on a local network. It is not a TCP stack.
- To watch an ordinary request instead of crafting one, capture the traffic of a `fetch` and read each segment with the `HTTP` layer: `packet.layers.HTTP` under TCP, with `message.method`, `message.status`, `message.headers`. See the layer in `otw docs http`.
