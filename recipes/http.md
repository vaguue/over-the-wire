`tcpdump -A 'tcp port 80'`, readable: the head of every HTTP request and response that crosses the interface. Sending stays with Node: `fetch` speaks HTTP, the capture shows what it put on the wire.

```javascript
import otw, { http } from 'over-the-wire';

const url = process.argv[2] ?? 'http://example.com/';
const port = Number(new URL(url).port || http.PORT);

const wire = otw();
const capture = await wire.capture(wire.filter().tcp({ port }));

capture.on('data', (packet) => {
  const message = packet.layers.HTTP;

  if (message === undefined) {
    return;
  }

  const { src, dst } = packet.layers.IPv4 ?? packet.layers.IPv6;

  const line = message.isRequest
    ? `${message.method} ${message.headers.host ?? ''}${message.path}`
    : `${message.status} ${message.reason} (${message.headers['content-type'] ?? 'no content type'})`;

  console.log(`${src} > ${dst}  ${line}`);
});

const response = await fetch(url, { redirect: 'manual', headers: { connection: 'close' } });
await response.arrayBuffer();

console.log(`fetch got ${response.status}`);

setTimeout(() => {
  capture.destroy();
}, 500);
```

The `HTTP` layer reads one TCP segment: the start line, the header fields and the part of the body that came with them. `message.complete` tells whether the header fields ended inside the segment. It does not follow a connection, so a body in several segments, TLS and HTTP/2 stay with `fetch` and `node:http`.

The same layer builds a message by hand, for the cases where the exact bytes matter:

```javascript
const request = wire.packet()
  .ipv4({ dst: '203.0.113.10' })
  .tcp({ src: 40000, dst: http.PORT, seq, ack, flags: { psh: 1, ack: 1 } })
  .http({ method: http.METHOD_GET, path: '/', headers: { Host: 'example.com' } });
```
