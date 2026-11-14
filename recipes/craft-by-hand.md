Without `await` nothing is looked up: the packet is exactly what you describe, including values a normal stack would never send.

```javascript
import otw from 'over-the-wire';

const { Packet } = otw;

const packet = new Packet({ iface: { linktype: otw.LinkLayerType.LINKTYPE_ETHERNET } })
  .ethernet({ src: 'aa:bb:cc:dd:ee:ff', dst: 'ff:ff:ff:ff:ff:ff' })
  .ipv4({ src: '10.0.0.1', dst: '10.0.0.255', timeToLive: 1, checksum: 0x1234 })
  .udp({ src: 9, dst: 9 })
  .payload({ data: Buffer.from('raw') });

console.log(packet.buffer.toString('hex'));
console.log(packet.toObject());
```

Lengths and checksums are computed unless you provide them. To send it, write it to a device: `(await otw().capture()).write(packet)`.
