`ping` through a socket: the system builds the IP header and routes the packet, the script only describes the ICMP message. An ICMP datagram socket needs no capture privileges on macOS, and on Linux for the groups listed in `net.ipv4.ping_group_range`.

```javascript
import otw, { icmp } from 'over-the-wire';

const COUNT = 4;
const IPV4_HEADER_LENGTH = 20;

const target = process.argv[2] ?? '8.8.8.8';

const wire = otw();
const socket = await wire.socket().inet().dgram().icmp().to({ ip: target });

for (const { option, reason } of socket.unsupported) {
  console.log(`running without ${option}: ${reason}`);
}

const messageOf = ({ buffer }) => {
  return buffer[0] >> 4 === 4 ? buffer.subarray(IPV4_HEADER_LENGTH) : buffer;
};

for (let sequence = 1; sequence <= COUNT; sequence++) {
  const isTheReply = (packet) => {
    const message = messageOf(packet);
    return message[0] === icmp.ECHO_REPLY && message.readUInt16BE(6) === sequence;
  };

  const sentAt = process.hrtime.bigint();
  const answered = socket.expect(isTheReply, { timeout: 1000 });
  socket.write(wire.packet().icmp({ type: icmp.ECHO_REQUEST, id: process.pid & 0xffff, sequence }));
  const answer = await answered;

  if (answer === null) {
    console.log(`Request timeout for icmp_seq ${sequence}`);
    continue;
  }

  const elapsedMs = Number(process.hrtime.bigint() - sentAt) / 1e6;
  console.log(`${messageOf(answer).length} bytes from ${answer.peer.ip}: icmp_seq=${sequence} time=${elapsedMs.toFixed(3)} ms`);

  await new Promise((resolve) => {
    setTimeout(resolve, Math.max(0, 1000 - elapsedMs));
  });
}

wire.close();
```

macOS hands the reply over with its IP header, Linux without it and with its own identifier, which is why the reply is recognised by sequence number.
