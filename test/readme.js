import fs from 'node:fs';
import dns from 'node:dns/promises';

import otw, { icmp } from 'over-the-wire';

const MAX_HOPS = 30;
const ANSWER_TIMEOUT_MS = 1000;

const traceroute = async (host) => {
  const { address: target } = await dns.lookup(host, { family: 4 });

  const wire = otw();
  const capture = await wire.capture(wire.filter().icmp());

  const dump = otw.pcap.createWriteStream({ format: 'pcapng' });
  dump.pipe(fs.createWriteStream('traceroute.pcapng'));
  capture.pipe(dump);

  const id = Math.floor(Math.random() * 0xffff);

  console.log(`traceroute to ${host} (${target}), ${MAX_HOPS} hops max`);

  for (let timeToLive = 1; timeToLive <= MAX_HOPS; timeToLive++) {
    const probe = await wire.packet()
      .ipv4({ dst: target, timeToLive })
      .icmp({ type: icmp.ECHO_REQUEST, id, sequence: timeToLive });

    const addressedToUs = wire.filter()
      .ipv4({ dst: probe.layers.IPv4.src })
      .icmp({ type: [icmp.ECHO_REPLY, icmp.TIME_EXCEEDED] });

    const sentAt = Date.now();
    capture.write(probe);
    const answer = await capture.expect(addressedToUs, { timeout: ANSWER_TIMEOUT_MS });

    if (answer === null) {
      console.log(`${timeToLive}  *`);
      continue;
    }

    console.log(`${timeToLive}  ${answer.layers.IPv4.src}  ${Date.now() - sentAt} ms`);

    if (answer.layers.ICMP.type === icmp.ECHO_REPLY) {
      break;
    }
  }

  capture.destroy();
  dump.end();
};

traceroute(process.argv[2] ?? '8.8.8.8').catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
