Watch a real client talk to a server and tell whether the server answers. Nothing is sent by the script.

```javascript
import otw from 'over-the-wire';

const wire = otw();

const server = '203.0.113.10';
const port = 51820;

const capture = await wire.capture(wire.filter().ipv4({ host: server }).udp({ port }));

const outgoing = await capture.expect(wire.filter().ipv4({ dst: server }), { timeout: 30000 });

if (outgoing === null) {
  console.log('nothing was sent to the server');
}
else {
  const incoming = await capture.expect(wire.filter().ipv4({ src: server }), { timeout: 5000 });
  console.log(incoming === null ? 'no reply within 5s' : 'the server answered');
}

capture.destroy();
```

Both waits read from the same capture, so a reply that arrives right after the request is not missed.
