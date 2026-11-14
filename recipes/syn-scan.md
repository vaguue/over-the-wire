`nmap -sS`: a TCP SYN scan. A SYN+ACK means the port is open, a RST means it is closed, silence means filtered. Only scan hosts you are allowed to.

```javascript
import otw from 'over-the-wire';

const target = process.argv[2];
const ports = (process.argv[3] ?? '22,80,443').split(',').map(Number);

const wire = otw();
const capture = await wire.capture(wire.filter().ipv4({ host: target }).tcp());

const sourcePort = 40000 + Math.floor(Math.random() * 20000);

for (const port of ports) {
  const syn = await wire.packet()
    .ipv4({ dst: target })
    .tcp({ src: sourcePort, dst: port, seq: Math.floor(Math.random() * 0xffffffff), flags: { syn: 1 } });

  const response = wire.filter()
    .ipv4({ src: target })
    .tcp({ src: port, dst: sourcePort });

  capture.write(syn);
  const answer = await capture.expect(response, { timeout: 1000 });

  if (answer === null) {
    console.log(`${port}/tcp filtered`);
    continue;
  }

  const { syn: synFlag, ack, rst } = answer.layers.TCP.flags;

  if (synFlag && ack) {
    console.log(`${port}/tcp open`);
  }
  else if (rst) {
    console.log(`${port}/tcp closed`);
  }
  else {
    console.log(`${port}/tcp unexpected answer`);
  }
}

capture.destroy();
```

The host's own TCP stack does not know about the connection attempt, so it resets an open port's SYN+ACK by itself. No connection is left half-open.
