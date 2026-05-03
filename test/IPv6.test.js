const { strict: assert } = require('node:assert');
const test = require('node:test');

const defaults = require('#lib/defaults');
const { IPv6 } = require('#lib/layers/IPv6');
const { Packet } = require('#lib/packet');

test('IPv6 parse, toObject and roundtrip', async () => {
  // 40-byte IPv6 header: v=6, tc=0, fl=0, payloadLen=32, nextHeader=6 (TCP), hopLimit=64
  const buf = Buffer.from('60000000002006403fffffffffffffff00000000000000013ffe05010410000002a002fffefe0026', 'hex');
  const ip = new IPv6(buf);

  assert.deepEqual(ip.toObject(), {
    flowLabel: 0,
    trafficClass: 0,
    version: 6,
    payloadLength: 32,
    nextHeader: 6,
    hopLimit: 64,
    src: '3fff:ffff:ffff:ffff::1',
    dst: '3ffe:501:410:0:2a0:2ff:fefe:26',
  });

  assert.equal(ip.length, 40);

  const ip2 = new IPv6(ip.toObject());
  assert.deepEqual(ip2.toObject(), ip.toObject());
  assert.equal(Buffer.compare(ip2.buffer, ip.buffer), 0);
});

test('IPv6 traffic class and flow label round-trip', async () => {
  const ip = new IPv6({
    version: 6,
    trafficClass: 0xab,
    flowLabel: 0x12345,
    payloadLength: 0,
    nextHeader: 59,
    hopLimit: 32,
    src: '::1',
    dst: '::2',
  });

  assert.equal(ip.version, 6);
  assert.equal(ip.trafficClass, 0xab);
  assert.equal(ip.flowLabel, 0x12345);
  // First 4 bytes encode v|tc|fl
  assert.equal(ip.buffer[0], 0x6a);
  assert.equal(ip.buffer[1], 0xb1);
  assert.equal(ip.buffer[2], 0x23);
  assert.equal(ip.buffer[3], 0x45);
});

test('Packet dispatches Ethernet -> IPv6 -> TCP', async () => {
  const buf = Buffer.from(
    '424242424242aaaaaaaaaaaa86dd' +
    '60000000001406403fffffffffffffff00000000000000013ffe05010410000002a002fffefe0026' +
    '01bb01bb000000000000000050020000000000000',
    'hex'
  );

  const pkt = new Packet({ buffer: buf, iface: defaults });
  const obj = pkt.toObject().layers;

  assert.equal(obj.Ethernet.type, 0x86dd);
  assert.equal(obj.IPv6.src, '3fff:ffff:ffff:ffff::1');
  assert.equal(obj.IPv6.dst, '3ffe:501:410:0:2a0:2ff:fefe:26');
  assert.equal(obj.IPv6.nextHeader, 6);
  assert.equal(obj.TCP.src, 443);
  assert.equal(obj.TCP.dst, 443);
  assert.equal(obj.TCP.flags.syn, 1);
});

test('Packet dispatches Ethernet -> IPv6 -> ICMPv6 echo request', async () => {
  // Ethernet (eth dst+src+type=86dd) + IPv6 (nextHeader=58 ICMPv6, payloadLen=8) + ICMPv6 echo req
  const buf = Buffer.from(
    '424242424242aaaaaaaaaaaa86dd' +
    '600000000008' + '3a' + '403fffffffffffffff00000000000000013ffe05010410000002a002fffefe0026' +
    '8000abcd000100ff',
    'hex'
  );

  const pkt = new Packet({ buffer: buf, iface: defaults });
  assert.equal(pkt.layers.IPv6.nextHeader, 58);
  assert.ok(pkt.layers.ICMPv6, 'ICMPv6 layer should be parsed');
  assert.equal(pkt.layers.ICMPv6.type, 128);
  assert.equal(pkt.layers.ICMPv6.isEchoRequest, true);
});
