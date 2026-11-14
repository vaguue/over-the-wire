`dig`: a DNS query built packet by packet and sent straight to a resolver, with the answer section printed.

```javascript
import otw from 'over-the-wire';

const TYPE_A = 1;
const DNS_PORT = 53;

const name = process.argv[2] ?? 'example.com';
const resolver = process.argv[3] ?? '8.8.8.8';

const wire = otw();
const capture = await wire.capture(wire.filter().udp({ port: DNS_PORT }));

const id = Math.floor(Math.random() * 0xffff);
const sourcePort = 40000 + Math.floor(Math.random() * 20000);

const query = await wire.packet()
  .ipv4({ dst: resolver })
  .udp({ src: sourcePort, dst: DNS_PORT })
  .dns({ id, rd: 1, questions: [{ name, type: TYPE_A }] });

const response = wire.filter()
  .ipv4({ src: resolver })
  .udp({ src: DNS_PORT, dst: sourcePort })
  .dns({ id });

const sentAt = Date.now();
capture.write(query);
const answer = await capture.expect(response, { timeout: 2000 });

if (answer === null) {
  console.log(';; no response from the resolver');
}
else {
  const { answers, rcode } = answer.layers.DNS;

  console.log(`;; status: ${rcode}, answers: ${answers.length}, query time: ${Date.now() - sentAt} ms`);

  for (const record of answers) {
    console.log(`${record.name}\t${record.ttl}\tIN\t${record.type}\t${record.rdata}`);
  }
}

capture.destroy();
```

The host has no socket on the source port, so it answers the resolver's reply with an ICMP "port unreachable". That is harmless here.
