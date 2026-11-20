Find the largest packet that reaches a host without being fragmented (`tracepath`, `ping -M do`). A raw ICMP socket with the "don't fragment" option does it without capturing: the system routes and fills in the IP header, and the socket also receives the "fragmentation needed" errors of the routers on the way, which carry the size that would have fitted.

```javascript
import otw, { icmp } from 'over-the-wire';

const SMALLEST_IPV4_MTU = 68;
const IPV4_HEADER_LENGTH = 20;
const ICMP_ECHO_HEADER_LENGTH = 16;
const FRAGMENTATION_NEEDED = 4;

const target = process.argv[2];
const startFrom = Number(process.argv[3] ?? 1500);

const wire = otw();
const description = wire.socket().inet().raw().icmp().dontFragment().to({ ip: target });

if (!description.supports()) {
  console.log(`no raw ICMP sockets for this process: ${description.availability().reason}`);
  process.exit(1);
}

const socket = await description;

for (const { option, reason } of socket.unsupported) {
  console.log(`running without ${option}: ${reason}`);
}

const id = process.pid & 0xffff;
let sequence = 0;

const probe = async (size) => {
  sequence++;
  const probed = sequence;

  const concernsTheProbe = (packet) => {
    const message = packet.layers.ICMP?.toObject();

    if (message === undefined) {
      return false;
    }

    const isTheReply = message.isEchoReply && message.id === id && message.sequence === probed;
    const isTheRefusal = message.isDestinationUnreachable && message.code === FRAGMENTATION_NEEDED;
    return isTheReply || isTheRefusal;
  };

  const answered = socket.expect(concernsTheProbe, { timeout: 1000 });
  const data = Buffer.alloc(size - IPV4_HEADER_LENGTH - ICMP_ECHO_HEADER_LENGTH);
  socket.write(wire.packet().icmp({ type: icmp.ECHO_REQUEST, id, sequence: probed }).payload({ data }));
  const answer = await answered;

  if (answer === null) {
    return { fits: false, saidBy: null, nextHopMtu: 0 };
  }

  const message = answer.layers.ICMP.toObject();

  if (message.isEchoReply) {
    return { fits: true, saidBy: answer.layers.IPv4.src, nextHopMtu: 0 };
  }

  return { fits: false, saidBy: answer.layers.IPv4.src, nextHopMtu: message.nextHopMTU };
};

let fits = SMALLEST_IPV4_MTU;
let tooBig = startFrom + 1;
let size = startFrom;

while (tooBig - fits > 1) {
  const { fits: itFits, saidBy, nextHopMtu } = await probe(size);
  const hinted = nextHopMtu > fits && nextHopMtu < size;

  if (itFits) {
    console.log(`${size} bytes: delivered`);
    fits = size;
  }
  else if (saidBy === null) {
    console.log(`${size} bytes: no answer`);
    tooBig = size;
  }
  else {
    console.log(`${size} bytes: ${saidBy} says fragmentation is needed, the next hop takes ${nextHopMtu}`);
    tooBig = hinted ? nextHopMtu + 1 : size;
  }

  size = hinted ? nextHopMtu : Math.floor((fits + tooBig) / 2);
}

console.log(`path MTU to ${target}: ${fits} bytes`);

wire.close();
```

```
# node path-mtu.js 10.0.2.2
1500 bytes: 10.0.1.1 says fragmentation is needed, the next hop takes 1300
1300 bytes: delivered
path MTU to 10.0.2.2: 1300 bytes
```

- `dontFragment()` is `IP_MTU_DISCOVER` on Linux, `IP_DONTFRAG` on macOS and `IP_DONTFRAGMENT` on Windows: the wire picks the one the system has. If none works the socket still opens and says so in `socket.unsupported`.
- `supports()` asks the system before anything is sent. Raw sockets need root, or `CAP_NET_RAW` on Linux.
- A router that drops the packet silently shows as "no answer", and the search goes on by halving.
