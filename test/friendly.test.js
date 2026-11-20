import { strict as assert } from 'node:assert';
import test from 'node:test';
import { PassThrough } from 'node:stream';
import { inspect } from 'node:util';

import otw, { Packet, Wire, icmp, arp, ethernet } from '#lib/index';
import { answerTo } from '#lib/answers';
import { startRepl, keepSettledValue } from '#lib/cli/repl';
import { SPIDER, PAINT, logo, banner } from '#lib/cli/logo';

const ETHERNET = { linktype: 1 };
const US = '192.168.1.10';
const THEM = '140.82.121.4';
const ROUTER = '192.168.1.1';

const packet = () => {
  return new Packet({ iface: ETHERNET }).ethernet();
};

const reparsed = (built) => {
  return new Packet({ buffer: built.buffer, iface: ETHERNET });
};

const fakeSystem = () => {
  const lookups = [];

  return {
    lookups,
    system: {
      platform: 'darwin',
      async lookup(host, { family }) {
        lookups.push(`${host} ${family}`);

        if (host === 'github.com' && family === 4) {
          return { address: THEM, family };
        }

        throw new Error(`getaddrinfo ENOTFOUND ${host}`);
      },
      async provokeNeighbourDiscovery() {},
      async getRoutingTable() {
        return {
          en0: [{ destination: 'default', gateway: ROUTER, prefixLength: 0, family: 'AF_INET', flags: ['U', 'G'], metric: 0 }],
        };
      },
      async getArpTable() {
        return { en0: [{ ipAddr: ROUTER, hwAddr: 'aa:aa:aa:aa:aa:01' }] };
      },
      networkInterfaces() {
        return { en0: [{ address: US, family: 'IPv4', mac: 'bb:bb:bb:bb:bb:10', internal: false }] };
      },
    },
  };
};

test('a destination can be a host name', async () => {
  const { system, lookups } = fakeSystem();
  const wire = otw({ system });

  const first = await wire.packet().ipv4({ dst: 'github.com' }).icmp();
  const second = await wire.packet().ipv4({ dst: 'github.com' }).icmp();
  const literal = await wire.packet().ipv4({ dst: '8.8.8.8' }).icmp();

  assert.equal(first.layers.IPv4.dst, THEM);
  assert.equal(first.layers.IPv4.src, US);
  assert.equal(second.layers.IPv4.dst, THEM);
  assert.equal(literal.layers.IPv4.dst, '8.8.8.8');
  assert.deepEqual(lookups, ['github.com 4']);

  await assert.rejects(wire.packet().ipv4({ dst: 'no.such.host.example' }).icmp().exec(), {
    code: 'ENOTFOUND',
    message: /no\.such\.host\.example has no IPv4 address/,
  });
});

test('the answer to an echo request is its reply, or an error report about it', () => {
  const request = reparsed(packet().ipv4({ src: US, dst: THEM }).icmp({ type: icmp.ECHO_REQUEST, id: 7, sequence: 3 }));
  const isAnswer = answerTo(request);

  const reply = reparsed(packet().ipv4({ src: THEM, dst: US }).icmp({ type: icmp.ECHO_REPLY, id: 7, sequence: 3 }));
  const otherSequence = reparsed(packet().ipv4({ src: THEM, dst: US }).icmp({ type: icmp.ECHO_REPLY, id: 7, sequence: 4 }));
  const fromSomeoneElse = reparsed(packet().ipv4({ src: '1.1.1.1', dst: US }).icmp({ type: icmp.ECHO_REPLY, id: 7, sequence: 3 }));
  const expiredOnTheWay = reparsed(packet().ipv4({ src: '10.9.9.9', dst: US }).icmp({ type: icmp.TIME_EXCEEDED }));
  const unrelated = reparsed(packet().ipv4({ src: THEM, dst: US }).udp({ src: 53, dst: 40000 }));

  assert.equal(isAnswer(reply), true);
  assert.equal(isAnswer(otherSequence), false);
  assert.equal(isAnswer(fromSomeoneElse), false);
  assert.equal(isAnswer(expiredOnTheWay), true);
  assert.equal(isAnswer(unrelated), false);
  assert.equal(isAnswer(request), false);
});

test('the answer to a TCP or UDP packet comes back between the same ports', () => {
  const syn = reparsed(packet().ipv4({ src: US, dst: THEM }).tcp({ src: 40000, dst: 443, flags: { syn: 1 } }));
  const synAck = reparsed(packet().ipv4({ src: THEM, dst: US }).tcp({ src: 443, dst: 40000, flags: { syn: 1, ack: 1 } }));
  const otherConnection = reparsed(packet().ipv4({ src: THEM, dst: US }).tcp({ src: 443, dst: 40001, flags: { syn: 1, ack: 1 } }));

  assert.equal(answerTo(syn)(synAck), true);
  assert.equal(answerTo(syn)(otherConnection), false);

  const query = reparsed(packet().ipv4({ src: US, dst: '8.8.8.8' }).udp({ src: 40000, dst: 9 }));
  const refused = reparsed(packet().ipv4({ src: '8.8.8.8', dst: US }).icmp({ type: icmp.DESTINATION_UNREACHABLE, code: icmp.CODE_PORT_UNREACHABLE }));
  const echoed = reparsed(packet().ipv4({ src: '8.8.8.8', dst: US }).udp({ src: 9, dst: 40000 }));

  assert.equal(answerTo(query)(refused), true);
  assert.equal(answerTo(query)(echoed), true);
  assert.equal(answerTo(query)(synAck), false);
});

test('the answer to an ARP request tells who has the address', () => {
  const whoHas = reparsed(new Packet({ iface: ETHERNET })
    .ethernet({ dst: ethernet.BROADCAST })
    .arp({ opcode: arp.WHO_HAS, protocolSrc: US, protocolDst: ROUTER }));

  const isAt = reparsed(packet().arp({ opcode: arp.IS_AT, protocolSrc: ROUTER, protocolDst: US, hardwareSrc: 'aa:aa:aa:aa:aa:01' }));
  const someoneElse = reparsed(packet().arp({ opcode: arp.IS_AT, protocolSrc: '192.168.1.77', protocolDst: US }));

  assert.equal(answerTo(whoHas)(isAt), true);
  assert.equal(answerTo(whoHas)(someoneElse), false);
  assert.equal(answerTo(whoHas)(whoHas), false);
});

test('send().expect() without a filter waits for the answer to what was sent', async () => {
  const { system } = fakeSystem();
  let device;

  const wire = otw({
    system: {
      ...system,
      openDevice: () => {
        device = new PassThrough({ objectMode: true });

        device.expect = function(matches, { timeout = 1000 } = {}) {
          return new Promise((resolve) => {
            const timer = setTimeout(() => {
              resolve(null);
            }, timeout);

            this.on('data', (candidate) => {
              if (matches(candidate)) {
                clearTimeout(timer);
                resolve(candidate);
              }
            });
          });
        };

        return device;
      },
    },
  });

  const request = wire.packet().ipv4({ dst: 'github.com' }).icmp({ type: icmp.ECHO_REQUEST, id: 9, sequence: 1 });
  const waiting = wire.send(request).expect(undefined, { timeout: 2000 });

  await wire.send(request);

  const noise = reparsed(packet().ipv4({ src: '1.1.1.1', dst: US }).udp({ src: 53, dst: 40000 }));
  const reply = reparsed(packet().ipv4({ src: THEM, dst: US }).icmp({ type: icmp.ECHO_REPLY, id: 9, sequence: 1 }));

  device.write(noise);
  device.write(reply);

  const answer = await waiting;

  assert.equal(answer.layers.IPv4.src, THEM);
  assert.equal(answer.layers.ICMP.type, icmp.ECHO_REPLY);

  device.destroy();
});

test('the shell keeps the settled value of a plain assignment', async () => {
  const context = {};
  const pending = Promise.resolve('settled');

  context.r = pending;
  keepSettledValue('r = somethingAsync()', context, pending, 'settled');
  assert.equal(context.r, 'settled');

  context.other = pending;
  keepSettledValue('r == other', context, pending, 'changed');
  keepSettledValue('other.then(x => x)', context, pending, 'changed');
  assert.equal(context.other, pending);
  assert.equal(context.r, 'settled');

  const input = new PassThrough();
  const output = new PassThrough();
  const printed = [];

  output.on('data', (chunk) => {
    printed.push(chunk.toString());
  });

  const { finished } = startRepl({ iface: 'lo0', version: '0.0.0', input, output });

  input.write('answer = Promise.resolve({ value: 41 })\n');
  input.write('answer.value + 1\n');
  input.write('.exit\n');

  await finished;

  assert.ok(printed.join('').includes('42'));

  Wire.defaults.iface = null;

  for (const name of ['wire', 'otw', 'docs', 'pcap', 'icmp', 'dns', 'tcp', 'udp', 'answer']) {
    delete globalThis[name];
  }
});

test('the logo is the spider of the project, drawn in block characters', () => {
  const BLOCKS = / ▘▝▀▖▌▞▛▗▚▐▜▄▙▟█/;
  const width = SPIDER[0].length;

  assert.equal(SPIDER.length, PAINT.length);
  assert.ok(SPIDER.every(row => row.length === width));
  assert.ok(PAINT.every(row => row.length === width));
  assert.ok(SPIDER.every(row => [...row].every(glyph => BLOCKS.source.includes(glyph))));
  assert.ok(PAINT.every(row => /^[ kgr]*$/.test(row)));

  const inks = PAINT.join('');

  assert.ok(inks.includes('g'));
  assert.ok(inks.includes('k'));
  assert.ok(inks.includes('r'));

  SPIDER.forEach((row, rowIndex) => {
    [...row].forEach((glyph, column) => {
      assert.equal(glyph === ' ', PAINT[rowIndex][column] === ' ', `row ${rowIndex}, column ${column}`);
    });
  });
});

test('the banner shows the logo with or without colours', () => {
  const plain = banner({ version: '1.2.3', iface: 'en0' });
  const painted = banner({ version: '1.2.3', iface: 'en0', color: true });
  const RED = '\x1b[31m';
  const DIM = '\x1b[2m';

  assert.ok(!plain.includes('\x1b['));
  assert.deepEqual(logo().map(row => row.trimEnd()), plain.split('\n').map(line => line.slice(0, SPIDER[0].length).trimEnd()));
  assert.ok(plain.includes('over-the-wire 1.2.3'));
  assert.ok(plain.includes('on en0'));
  assert.ok(plain.includes("p = wire.p.ipv4({ dst: 'github.com' }).icmp()"));
  assert.ok(plain.includes('r.ipv4.src'));
  assert.ok(!banner({ version: '1.2.3' }).includes('on '));
  assert.ok(painted.includes(RED));
  assert.ok(painted.includes(DIM));
  assert.equal(painted.split('\n').length, SPIDER.length);
});

test('layers and the wire print as what they mean, not as what they are made of', () => {
  const built = reparsed(packet().ipv4({ src: US, dst: THEM }).tcp({ src: 40000, dst: 443, flags: { syn: 1 } }).payload({ data: Buffer.from('hi') }));

  assert.equal(inspect(built.layers.Ethernet), "Ethernet { dst: '00:00:00:00:00:00', src: '00:00:00:00:00:00', type: 2048 }");
  assert.match(inspect(built.layers.IPv4), /^IPv4 \{[\s\S]*src: '192\.168\.1\.10',\s+dst: '140\.82\.121\.4'/);
  assert.match(inspect(built.layers.TCP), /flags: \{[^}]*syn: 1/);
  assert.ok(!inspect(built.layers).includes('_buf'));
  assert.ok(!inspect(built.layers).includes('Proxy'));
  assert.equal(inspect(built.layers.Payload), 'Payload { data: <Buffer 68 69> }');

  assert.equal(inspect(otw()), '<Wire interface chosen by the routing table>');
  assert.equal(inspect(otw({ iface: 'en0' })), '<Wire en0>');
});
