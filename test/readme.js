import fs from 'node:fs';
import dns from 'node:dns/promises';

import otw from '../lib/index.js';

const ECHO_REQUEST = 8;
const ECHO_REPLY = 0;
const TIME_EXCEEDED = 11;
const MAX_HOPS = 30;
const ANSWER_TIMEOUT_MS = 1000;

const traceroute = async (host) => {
  const { address: target } = await dns.lookup(host, { family: 4 });

  const wire = otw();
  const capture = await wire.capture(wire.filter().icmp());

  const dump = otw.Pcap.createWriteStream({ format: 'pcapng' });
  dump.pipe(fs.createWriteStream('traceroute.pcapng'));
  capture.pipe(dump);

  const id = Math.floor(Math.random() * 0xffff);

  console.log(`traceroute to ${host} (${target}), ${MAX_HOPS} hops max`);

  for (let timeToLive = 1; timeToLive <= MAX_HOPS; timeToLive++) {
    const probe = await wire.packet()
      .ipv4({ dst: target, timeToLive })
      .icmp({ type: ECHO_REQUEST, id, sequence: timeToLive });

    const addressedToUs = wire.filter()
      .ipv4({ dst: probe.layers.IPv4.src })
      .icmp({ type: [ECHO_REPLY, TIME_EXCEEDED] });

    const sentAt = Date.now();
    capture.write(probe);
    const answer = await capture.expect(addressedToUs, { timeout: ANSWER_TIMEOUT_MS });

    if (answer === null) {
      console.log(`${timeToLive}  *`);
      continue;
    }

    console.log(`${timeToLive}  ${answer.layers.IPv4.src}  ${Date.now() - sentAt} ms`);

    if (answer.layers.ICMP.type === ECHO_REPLY) {
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
