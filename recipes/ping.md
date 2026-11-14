`ping`: ICMP echo requests, one per second, with the round-trip time of each answer.

```javascript
import otw from 'over-the-wire';

const ECHO_REQUEST = 8;
const ECHO_REPLY = 0;
const COUNT = 4;

const target = process.argv[2] ?? '8.8.8.8';

const wire = otw();
const capture = await wire.capture(wire.filter().icmp());

const id = Math.floor(Math.random() * 0xffff);
let received = 0;

for (let sequence = 1; sequence <= COUNT; sequence++) {
  const request = await wire.packet()
    .ipv4({ dst: target })
    .icmp({ type: ECHO_REQUEST, id, sequence });

  const reply = wire.filter()
    .ipv4({ src: target })
    .icmp({ type: ECHO_REPLY });

  const sentAt = process.hrtime.bigint();
  capture.write(request);
  const answer = await capture.expect(reply, { timeout: 1000 });

  if (answer === null) {
    console.log(`Request timeout for icmp_seq ${sequence}`);
    continue;
  }

  received++;
  const elapsedMs = Number(process.hrtime.bigint() - sentAt) / 1e6;
  const { timeToLive, totalLength, length: headerLength } = answer.layers.IPv4;

  console.log(`${totalLength - headerLength} bytes from ${target}: icmp_seq=${sequence} ttl=${timeToLive} time=${elapsedMs.toFixed(3)} ms`);

  await new Promise((resolve) => {
    setTimeout(resolve, Math.max(0, 1000 - elapsedMs));
  });
}

console.log(`${COUNT} packets transmitted, ${received} packets received`);

capture.destroy();
```
