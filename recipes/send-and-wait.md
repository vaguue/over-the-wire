Describe a packet from the IP layer up, let the host fill in the rest, send it and wait for the answer.

```javascript
import otw from 'over-the-wire';

const wire = otw();

const probe = wire.packet()
  .ipv4({ dst: '203.0.113.10' })
  .udp({ src: 40000, dst: 51820 })
  .payload({ data: Buffer.from('hello') });

const reply = await wire
  .send(probe)
  .expect(wire.filter().udp({ src: 51820 }), { timeout: 2000 });

console.log(reply === null ? 'no reply' : reply.toObject());

wire.close();
```

`await` resolves the interface, the source addresses and the next hop's link-layer address. Anything set explicitly is kept as written.
