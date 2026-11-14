`arping`: ask who has an address on the local network and print the hardware address that answers.

```javascript
import otw from 'over-the-wire';

const target = process.argv[2];

const wire = otw();
const { iface } = await wire.route(target);
const { mac, ipv4 } = wire.addresses(iface);

const capture = await wire.capture({ iface, filter: wire.filter().arp() });

const request = wire.packet({ iface })
  .ethernet({ src: mac, dst: 'ff:ff:ff:ff:ff:ff' })
  .arp({ opcode: 'who-has', hardwareSrc: mac, protocolSrc: ipv4, protocolDst: target });

const reply = wire.filter().arp({ opcode: 'is-at', protocolSrc: target });

const sentAt = process.hrtime.bigint();
capture.write(request);
const answer = await capture.expect(reply, { timeout: 1000 });

if (answer === null) {
  console.log(`no answer from ${target} on ${iface}`);
}
else {
  const elapsedMs = Number(process.hrtime.bigint() - sentAt) / 1e6;
  console.log(`${target} is at ${answer.layers.ARP.hardwareSrc} on ${iface}, ${elapsedMs.toFixed(3)} ms`);
}

capture.destroy();
```

The request has no IP layer, so there is nothing to resolve: it is written to the device exactly as described.
