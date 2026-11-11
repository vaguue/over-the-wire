import { strict as assert } from 'node:assert';
import test from 'node:test';

import otw from '#lib/index';
import { Packet } from '#lib/packet';
import { PacketBuilder } from '#lib/packetBuilder';

const GATEWAY = '192.168.1.1';
const GATEWAY_MAC = 'aa:aa:aa:aa:aa:01';
const NEIGHBOUR = '192.168.1.50';
const NEIGHBOUR_MAC = 'aa:aa:aa:aa:aa:50';
const OWN_ADDRESS = '192.168.1.10';
const OWN_MAC = 'bb:bb:bb:bb:bb:10';

const fakeSystem = () => {
  const calls = { routes: 0, neighbours: 0, provoked: [] };
  const discoveredAfterProvoking = {};

  const system = {
    platform: 'darwin',
    discoveredAfterProvoking,
    async provokeNeighbourDiscovery(address, iface) {
      calls.provoked.push(`${address} on ${iface}`);
    },
    async getRoutingTable() {
      calls.routes++;
      return {
        en0: [
          { destination: 'default', gateway: GATEWAY, prefixLength: 0, family: 'AF_INET', flags: ['U', 'G'], metric: 0 },
          { destination: '192.168.1.0', gateway: '0.0.0.0', prefixLength: 24, family: 'AF_INET', flags: ['U'], metric: 0 },
        ],
        utun0: [
          { destination: '10.8.0.0', gateway: '0.0.0.0', prefixLength: 16, family: 'AF_INET', flags: ['U'], metric: 0 },
        ],
        lo0: [
          { destination: '127.0.0.0', gateway: '0.0.0.0', prefixLength: 8, family: 'AF_INET', flags: ['U'], metric: 0 },
        ],
      };
    },
    async getArpTable() {
      calls.neighbours++;
      const answeredSinceProvoked = calls.provoked
        .map(provoked => discoveredAfterProvoking[provoked.split(' ')[0]])
        .filter(entry => entry !== undefined);

      return {
        en0: [
          { ipAddr: GATEWAY, hwAddr: GATEWAY_MAC },
          { ipAddr: NEIGHBOUR, hwAddr: NEIGHBOUR_MAC },
          { ipAddr: '192.168.1.77', hwAddr: '(incomplete)' },
          { ipAddr: 'fe80::aaaa', hwAddr: 'aa:aa:aa:aa:aa:06' },
          ...answeredSinceProvoked,
        ],
      };
    },
    networkInterfaces() {
      return {
        en0: [
          { address: 'fe80::1', family: 'IPv6', mac: OWN_MAC, internal: false },
          { address: OWN_ADDRESS, family: 'IPv4', mac: OWN_MAC, internal: false },
        ],
        utun0: [
          { address: '10.8.0.2', family: 'IPv4', mac: '00:00:00:00:00:00', internal: false },
        ],
        lo0: [
          { address: '127.0.0.1', family: 'IPv4', mac: '00:00:00:00:00:00', internal: true },
        ],
      };
    },
  };

  return { system, calls };
};

test('otw() is callable and still carries the existing exports', () => {
  assert.equal(typeof otw, 'function');
  assert.equal(otw.Packet, Packet);
  assert.equal(typeof otw.Pcap.createReadStream, 'function');
  assert.ok(otw() instanceof otw.Wire);
});

test('awaiting a packet fills in what the host stack would', async () => {
  const { system } = fakeSystem();
  const wire = otw({ system });

  const builder = wire.packet()
    .ipv4({ dst: '8.8.8.8' })
    .icmp({ type: 8, id: 1, sequence: 1 });

  assert.ok(builder instanceof PacketBuilder);

  const pkt = await builder;

  assert.ok(pkt instanceof Packet);
  assert.equal(typeof pkt.then, 'undefined');
  assert.deepEqual(Object.keys(pkt.layers), ['Ethernet', 'IPv4', 'ICMP']);
  assert.equal(pkt.layers.Ethernet.src, OWN_MAC);
  assert.equal(pkt.layers.Ethernet.dst, GATEWAY_MAC);
  assert.equal(pkt.layers.Ethernet.type, 0x0800);
  assert.equal(pkt.layers.IPv4.src, OWN_ADDRESS);
  assert.equal(pkt.layers.IPv4.dst, '8.8.8.8');
  assert.equal(pkt.layers.IPv4.protocol, 1);
  assert.equal(pkt.iface.name, 'en0');
});

test('on-link destinations use their own link-layer address', async () => {
  const { system } = fakeSystem();
  const pkt = await otw({ system }).packet().ipv4({ dst: NEIGHBOUR }).udp({ src: 1, dst: 2 });

  assert.equal(pkt.layers.Ethernet.dst, NEIGHBOUR_MAC);
});

test('explicit fields win over resolution', async () => {
  const { system } = fakeSystem();

  const pkt = await otw({ system }).packet()
    .ethernet({ dst: '11:11:11:11:11:11' })
    .ipv4({ src: '1.2.3.4', dst: '8.8.8.8' })
    .udp({ src: 1, dst: 2 });

  assert.equal(pkt.layers.Ethernet.dst, '11:11:11:11:11:11');
  assert.equal(pkt.layers.Ethernet.src, OWN_MAC);
  assert.equal(pkt.layers.IPv4.src, '1.2.3.4');
});

test('broadcast and multicast need no neighbour lookup', async () => {
  const { system, calls } = fakeSystem();
  const wire = otw({ system });

  const broadcast = await wire.packet().ipv4({ dst: '255.255.255.255' }).udp({ src: 68, dst: 67 });
  const multicast = await wire.packet().ipv4({ dst: '224.0.0.251' }).udp({ src: 5353, dst: 5353 });

  assert.equal(broadcast.layers.Ethernet.dst, 'ff:ff:ff:ff:ff:ff');
  assert.equal(multicast.layers.Ethernet.dst, '01:00:5e:00:00:fb');
  assert.equal(calls.neighbours, 0);
});

test('without await the packet is built exactly as written', () => {
  const { system, calls } = fakeSystem();

  const builder = otw({ system }).packet()
    .ipv4({ dst: '8.8.8.8' })
    .udp({ src: 1, dst: 2 });

  const pkt = builder.build();

  assert.deepEqual(Object.keys(pkt.layers), ['IPv4', 'UDP']);
  assert.equal(pkt.layers.IPv4.src, '0.0.0.0');
  assert.equal(builder.buffer.length, 20 + 8);
  assert.equal(calls.routes + calls.neighbours, 0);
});

test('a builder resolves once and cannot be extended afterwards', async () => {
  const { system, calls } = fakeSystem();
  const builder = otw({ system }).packet().ipv4({ dst: '8.8.8.8' });

  const first = await builder;
  const second = await builder.exec();

  assert.equal(first, second);
  assert.equal(calls.routes, 1);
  assert.throws(() => builder.udp({ src: 1, dst: 2 }), /already resolved/);
});

test('lookups are cached per context until flushed', async () => {
  const { system, calls } = fakeSystem();
  const wire = otw({ system });

  await wire.packet().ipv4({ dst: '8.8.8.8' });
  await wire.packet().ipv4({ dst: NEIGHBOUR });
  assert.equal(calls.routes, 1);
  assert.equal(calls.neighbours, 1);

  wire.flush();
  await wire.packet().ipv4({ dst: '8.8.8.8' });
  assert.equal(calls.routes, 2);
  assert.equal(calls.neighbours, 2);
});

test('resolution failures say what is missing', async () => {
  const { system, calls } = fakeSystem();
  const wire = otw({ system, neighbourTimeoutMs: 60 });

  await assert.rejects(wire.packet().ipv4({ dst: '192.168.1.99' }).exec(), { code: 'ENONEIGHBOUR' });
  assert.deepEqual(calls.provoked, ['192.168.1.99 on en0']);
  await assert.rejects(otw({ system, iface: 'en9' }).packet().ipv4({ dst: '8.8.8.8' }).exec(), { code: 'ENOROUTE' });
});

test('a context bound to an interface routes through it', async () => {
  const { system } = fakeSystem();
  const pkt = await otw({ system, iface: 'en0' }).packet().ipv4({ dst: '10.8.0.9' }).udp({ src: 1, dst: 2 });

  assert.equal(pkt.iface.name, 'en0');
  assert.equal(pkt.layers.Ethernet.dst, GATEWAY_MAC);
});

test('packets without an IP destination resolve to what was written', async () => {
  const { system, calls } = fakeSystem();

  const pkt = await otw({ system }).packet()
    .ethernet({ src: OWN_MAC, dst: 'ff:ff:ff:ff:ff:ff' })
    .arp({ opcode: 'who-has', hardwareSrc: OWN_MAC, protocolSrc: OWN_ADDRESS, protocolDst: GATEWAY });

  assert.deepEqual(Object.keys(pkt.layers), ['Ethernet', 'ARP']);
  assert.equal(calls.routes + calls.neighbours, 0);
});

test('registered layers join both builders', async () => {
  class Heartbeat {
    name = 'Heartbeat';

    constructor(data = {}, { prev = null, allocated = null } = {}) {
      this.prev = prev;
      this.next = null;
      this.length = allocated ?? 1;
      this.buffer = Buffer.isBuffer(data) ? data : null;
    }

    static toAlloc = () => 1;

    merge(data) {
      this.buffer[0] = data.beat ?? 0;
    }

    defaults() {}

    nextProto() {
      return null;
    }

    toObject() {
      return { beat: this.buffer[0] };
    }
  }

  otw.registerLayer(Heartbeat);

  const { system } = fakeSystem();
  const resolved = await otw({ system }).packet().ipv4({ dst: '8.8.8.8' }).heartbeat({ beat: 7 });
  const direct = new Packet({ iface: { linktype: 1 } }).ethernet({}).heartbeat({ beat: 9 });

  assert.equal(resolved.toObject().layers.Heartbeat.beat, 7);
  assert.equal(direct.buffer[14], 9);
});

test('an unknown neighbour is resolved by the kernel and then read back', async () => {
  const { system, calls } = fakeSystem();
  system.discoveredAfterProvoking['192.168.1.77'] = { ipAddr: '192.168.1.77', hwAddr: 'aa:aa:aa:aa:aa:77' };

  const pkt = await otw({ system }).packet().ipv4({ dst: '192.168.1.77' }).udp({ src: 1, dst: 2 });

  assert.equal(pkt.layers.Ethernet.dst, 'aa:aa:aa:aa:aa:77');
  assert.deepEqual(calls.provoked, ['192.168.1.77 on en0']);
});

test('known neighbours are not provoked', async () => {
  const { system, calls } = fakeSystem();
  await otw({ system }).packet().ipv4({ dst: NEIGHBOUR });

  assert.deepEqual(calls.provoked, []);
});

test('the link layer follows the kind of interface', async () => {
  const { system } = fakeSystem();
  const wire = otw({ system });

  const tunnelled = await wire.packet().ipv4({ dst: '10.8.0.9' }).udp({ src: 1, dst: 2 });
  assert.deepEqual(Object.keys(tunnelled.layers), ['Loopback', 'IPv4', 'UDP']);
  assert.equal(tunnelled.layers.Loopback.family, 2);
  assert.equal(tunnelled.layers.IPv4.src, '10.8.0.2');
  assert.equal(tunnelled.buffer.readUInt32LE(0), 2);

  const local = await wire.packet().ipv4({ dst: '127.0.0.1' }).udp({ src: 1, dst: 2 });
  assert.deepEqual(Object.keys(local.layers), ['Loopback', 'IPv4', 'UDP']);

  const reparsed = new Packet({ buffer: local.buffer, iface: local.iface });
  assert.deepEqual(Object.keys(reparsed.layers), ['Loopback', 'IPv4', 'UDP']);

  const onLinux = otw({ system: { ...system, platform: 'linux' } });

  const linuxTunnel = await onLinux.packet().ipv4({ dst: '10.8.0.9' }).udp({ src: 1, dst: 2 });
  assert.deepEqual(Object.keys(linuxTunnel.layers), ['IPv4', 'UDP']);

  const linuxLoopback = await onLinux.packet().ipv4({ dst: '127.0.0.1' }).udp({ src: 1, dst: 2 });
  assert.deepEqual(Object.keys(linuxLoopback.layers), ['Ethernet', 'IPv4', 'UDP']);
  assert.equal(linuxLoopback.layers.Ethernet.dst, '00:00:00:00:00:00');
});

test('IPv6 destinations', async () => {
  const { system } = fakeSystem();
  system.getRoutingTable = async () => ({
    en0: [
      { destination: 'default', gateway: 'fe80::aaaa%en0', prefixLength: 0, family: 'AF_INET6', flags: ['U', 'G'], metric: 0 },
    ],
  });

  const wire = otw({ system });

  const routed = await wire.packet().ipv6({ dst: '2001:db8::1' }).udp({ src: 1, dst: 2 });
  assert.deepEqual(Object.keys(routed.layers), ['Ethernet', 'IPv6', 'UDP']);
  assert.equal(routed.layers.Ethernet.dst, 'aa:aa:aa:aa:aa:06');
  assert.equal(routed.layers.IPv6.src, 'fe80::1');

  const multicast = await wire.packet().ipv6({ dst: 'ff02::fb' }).udp({ src: 5353, dst: 5353 });
  assert.equal(multicast.layers.Ethernet.dst, '33:33:00:00:00:fb');
});
