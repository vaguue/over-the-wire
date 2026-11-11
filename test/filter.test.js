import { strict as assert } from 'node:assert';
import test from 'node:test';
import { Duplex } from 'node:stream';

import otw, { Packet, FilterBuilder, BpfFilter } from '#lib/index';
import { installExpect } from '#lib/expect';

const ETHERNET = { linktype: 1 };

const udpPacket = ({ src = '10.0.0.1', dst = '10.0.0.2', sport = 40000, dport = 51820, timeToLive = 64 } = {}) => {
  const built = new Packet({ iface: ETHERNET })
    .ethernet({ src: 'aa:aa:aa:aa:aa:01', dst: 'aa:aa:aa:aa:aa:02' })
    .ipv4({ src, dst, timeToLive })
    .udp({ src: sport, dst: dport })
    .payload({ data: Buffer.from('hello') });

  return new Packet({ buffer: built.buffer, iface: ETHERNET });
};

const tcpSyn = () => {
  const built = new Packet({ iface: ETHERNET })
    .ethernet({})
    .ipv4({ src: '10.0.0.1', dst: '10.0.0.2' })
    .tcp({ src: 40000, dst: 443, flags: { syn: 1 } });

  return new Packet({ buffer: built.buffer, iface: ETHERNET });
};

const compilesAndAgrees = (filter, packet, expected) => {
  const expression = filter.toString();
  const compiled = new BpfFilter(expression);

  assert.equal(compiled.match(packet), expected, `kernel filter "${expression}"`);
  assert.equal(filter.matches(packet), expected, `in-process "${expression}"`);
};

test('filters mirror the packet builder', () => {
  const wire = otw();
  const filter = wire.filter().ipv4({ src: '10.0.0.1' }).udp({ dst: 51820 });

  assert.ok(filter instanceof FilterBuilder);
  assert.equal(filter.toString(), 'ip and ip src 10.0.0.1 and udp and udp dst port 51820');

  compilesAndAgrees(filter, udpPacket(), true);
  compilesAndAgrees(filter, udpPacket({ src: '10.0.0.9' }), false);
  compilesAndAgrees(filter, tcpSyn(), false);
});

test('host and port match either direction', () => {
  const filter = new FilterBuilder().ipv4({ host: '10.0.0.2' }).udp({ port: 51820 });

  compilesAndAgrees(filter, udpPacket(), true);
  compilesAndAgrees(filter, udpPacket({ src: '10.0.0.2', dst: '10.0.0.1', sport: 51820, dport: 40000 }), true);
  compilesAndAgrees(filter, udpPacket({ dst: '10.0.0.3' }), false);
});

test('alternatives, comparisons and flags', () => {
  const ports = new FilterBuilder().tcp({ dst: [80, 443], flags: { syn: 1, ack: 0 } });
  assert.equal(ports.toString(), 'tcp and (tcp dst port 80 or tcp dst port 443) and tcp[tcpflags] & tcp-syn != 0 and tcp[tcpflags] & tcp-ack = 0');
  compilesAndAgrees(ports, tcpSyn(), true);
  compilesAndAgrees(ports, udpPacket(), false);

  const lowTtl = new FilterBuilder().ipv4({ timeToLive: { lt: 5 } });
  assert.equal(lowTtl.toString(), 'ip and ip[8] < 5');
  compilesAndAgrees(lowTtl, udpPacket({ timeToLive: 3 }), true);
  compilesAndAgrees(lowTtl, udpPacket({ timeToLive: 64 }), false);
});

test('or, not and raw expressions compose', () => {
  const filter = new FilterBuilder()
    .udp({ dst: 53 })
    .or((alternative) => {
      alternative.udp({ dst: 51820 });
    })
    .not((excluded) => {
      excluded.ipv4({ src: '10.0.0.66' });
    });

  assert.equal(filter.toString(), '((udp and udp dst port 53) or (udp and udp dst port 51820)) and not (ip and ip src 10.0.0.66)');
  compilesAndAgrees(filter, udpPacket(), true);
  compilesAndAgrees(filter, udpPacket({ src: '10.0.0.66' }), false);
  compilesAndAgrees(filter, udpPacket({ dport: 9999 }), false);

  const withRaw = new FilterBuilder().raw('udp[8:2] = 0x6865').udp({ dst: 51820 });
  compilesAndAgrees(withRaw, udpPacket(), true);

  const fromString = FilterBuilder.from('udp dst port 51820');
  assert.equal(fromString.matches(udpPacket()), true);
  assert.equal(fromString.matches(tcpSyn()), false);
});

test('fields a capture filter cannot express still match in process', () => {
  const filter = new FilterBuilder().ipv4({ id: 0 }).udp({ totalLength: (length) => length > 8 });

  assert.equal(filter.expressible, false);
  assert.throws(() => filter.toString(), { code: 'ENOTEXPRESSIBLE' });
  assert.equal(filter.matches(udpPacket()), true);

  assert.equal(new FilterBuilder().ipv4({ src: '10.0.0.1' }).expressible, true);
  assert.equal(new FilterBuilder().toString(), '');
  assert.equal(new FilterBuilder().matches(udpPacket()), true);
});

test('addresses compare by value', () => {
  const built = new Packet({ iface: ETHERNET })
    .ethernet({ src: 'AA:BB:CC:00:00:01' })
    .ipv6({ src: '2001:db8::1', dst: '2001:db8::2' })
    .udp({ src: 1, dst: 2 });
  const packet = new Packet({ buffer: built.buffer, iface: ETHERNET });

  assert.equal(new FilterBuilder().ethernet({ src: 'aa:bb:cc:00:00:01' }).matches(packet), true);
  assert.equal(new FilterBuilder().ipv6({ src: '2001:0db8:0000::0001' }).matches(packet), true);
  assert.equal(new FilterBuilder().ipv6({ host: '2001:db8::3' }).matches(packet), false);
});

class FakeDevice extends Duplex {
  constructor(options = {}) {
    super({ objectMode: true });
    this.options = options;
    this.written = [];
    this.onWrite = () => {};
  }

  _read() {}

  _write(chunk, encoding, callback) {
    this.written.push(chunk);
    callback();
    this.onWrite(chunk);
  }
}

installExpect(FakeDevice);

test('expect resolves with the next matching packet, in order, or null on timeout', async () => {
  const device = new FakeDevice();
  const toServer = new FilterBuilder().ipv4({ dst: '10.0.0.2' });
  const fromServer = new FilterBuilder().ipv4({ src: '10.0.0.2' });

  const outgoing = device.expect(toServer, { timeout: 500 });
  device.push(tcpSyn());
  const request = udpPacket({ sport: 1111 });
  device.push(request);
  device.push(udpPacket({ src: '10.0.0.2', dst: '10.0.0.1', sport: 51820, dport: 1111 }));

  assert.equal((await outgoing).layers.IPv4.dst, '10.0.0.2');

  const incoming = await device.expect(fromServer, { timeout: 500 });
  assert.equal(incoming.layers.UDP.src, 51820);

  assert.equal(await device.expect(fromServer, { timeout: 30 }), null);

  const stillWaiting = device.expect(fromServer, { timeout: 200 });
  await assert.rejects(device.expect(toServer), /still waiting/);
  device.push(udpPacket({ src: '10.0.0.2', dst: '10.0.0.1' }));
  assert.notEqual(await stillWaiting, null);
});

const fakeSystem = () => {
  const devices = [];

  return {
    devices,
    platform: 'darwin',
    async getRoutingTable() {
      return {
        en0: [
          { destination: 'default', gateway: '10.0.0.254', prefixLength: 0, family: 'AF_INET', flags: ['U', 'G'], metric: 0 },
        ],
      };
    },
    async getArpTable() {
      return { en0: [{ ipAddr: '10.0.0.254', hwAddr: 'aa:aa:aa:aa:aa:fe' }] };
    },
    networkInterfaces() {
      return { en0: [{ address: '10.0.0.1', family: 'IPv4', mac: 'aa:aa:aa:aa:aa:01', internal: false }] };
    },
    async provokeNeighbourDiscovery() {},
    openDevice(options) {
      const device = new FakeDevice(options);
      devices.push(device);
      return device;
    },
  };
};

test('send resolves the packet and writes it to the interface it routes through', async () => {
  const system = fakeSystem();
  const wire = otw({ system });

  const sent = await wire.send(wire.packet().ipv4({ dst: '203.0.113.10' }).udp({ src: 40000, dst: 51820 }));

  assert.ok(sent instanceof Packet);
  assert.equal(system.devices.length, 1);
  assert.equal(system.devices[0].options.iface, 'en0');
  assert.equal(system.devices[0].written[0], sent);
  assert.equal(sent.layers.Ethernet.dst, 'aa:aa:aa:aa:aa:fe');

  await wire.send(wire.packet().ipv4({ dst: '203.0.113.11' }));
  assert.equal(system.devices.length, 1);

  wire.close();
  assert.equal(system.devices[0].destroyed, true);
});

test('send().expect() waits for the answer and ignores the packet it sent', async () => {
  const system = fakeSystem();
  const wire = otw({ system });
  const device = await wire.deviceFor('en0');

  device.onWrite = (written) => {
    device.push(new Packet({ buffer: written.buffer, iface: ETHERNET }));

    const answer = new Packet({ iface: ETHERNET })
      .ethernet({})
      .ipv4({ src: '203.0.113.10', dst: '10.0.0.1' })
      .udp({ src: 51820, dst: 40000 })
      .payload({ data: Buffer.from('response') });

    device.push(new Packet({ buffer: answer.buffer, iface: ETHERNET }));
  };

  const handshake = wire.packet()
    .ipv4({ dst: '203.0.113.10' })
    .udp({ src: 40000, dst: 51820 })
    .payload({ data: Buffer.from('initiation') });

  const reply = await wire.send(handshake).expect(wire.filter().udp({ port: 51820 }), { timeout: 500 });

  assert.equal(reply.layers.IPv4.src, '203.0.113.10');
  assert.equal(reply.layers.Payload.data.toString(), 'response');

  device.onWrite = () => {};
  const unanswered = await wire.send(wire.packet().ipv4({ dst: '203.0.113.10' }).udp({ src: 1, dst: 2 }))
    .expect(wire.filter().udp({ src: 2 }), { timeout: 30 });

  assert.equal(unanswered, null);
});

test('capture takes a filter and compiles it when it can', async () => {
  const system = fakeSystem();
  const wire = otw({ system });

  const compiled = await wire.capture(wire.filter().udp({ port: 51820 }));
  assert.equal(compiled.options.filter, 'udp and udp port 51820');
  assert.equal(compiled.options.iface, 'en0');

  const inProcessOnly = await wire.capture(wire.filter().ipv4({ id: 7 }));
  assert.equal(inProcessOnly.options.filter, undefined);

  const withOptions = await wire.capture({ iface: 'en5', filter: 'icmp' });
  assert.deepEqual(withOptions.options, { iface: 'en5', filter: 'icmp' });
});
