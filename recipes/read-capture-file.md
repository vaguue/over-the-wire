```javascript
import fs from 'node:fs';
import otw from 'over-the-wire';

const packets = fs.createReadStream('https.pcapng')
  .pipe(otw.Pcap.createReadStream({ format: 'pcapng' }));

const handshakes = new otw.FilterBuilder().tcp({ flags: { syn: 1, ack: 0 } });

for await (const packet of packets) {
  if (handshakes.matches(packet)) {
    console.log(packet.timestamp.toDate(), packet.layers.IPv4.src, '->', packet.layers.IPv4.dst);
  }
}
```

Filters work the same on packets from a file, a device or a socket.
