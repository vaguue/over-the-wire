`tcpdump`: print one line per packet matching a capture filter expression.

```javascript
import otw from 'over-the-wire';

const expression = process.argv.slice(2).join(' ');

const endpoints = (packet) => {
  const network = packet.layers.IPv4 ?? packet.layers.IPv6;
  const transport = packet.layers.TCP ?? packet.layers.UDP;

  if (network === undefined || Array.isArray(network)) {
    return '';
  }

  if (transport === undefined) {
    return `${network.src} > ${network.dst}`;
  }

  return `${network.src}.${transport.src} > ${network.dst}.${transport.dst}`;
};

const wire = otw();
const capture = await wire.capture(expression);

console.log(`listening on ${capture.iface.name}`);

for await (const packet of capture) {
  const time = packet.timestamp.toDate().toISOString().slice(11, 23);
  const protocols = Object.keys(packet.layers).join(' ');

  console.log(`${time} ${protocols} ${endpoints(packet)} length ${packet.length}`);
}
```

Run it as `node tcpdump.js udp port 53`. Stop it with Ctrl-C.
