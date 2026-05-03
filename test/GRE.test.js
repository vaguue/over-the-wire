const { strict: assert } = require('node:assert');
const test = require('node:test');

const defaults = require('#lib/defaults');
const { GRE } = require('#lib/layers/GRE');
const { Packet } = require('#lib/packet');

test('GRE plain header parse', async () => {
  const buf = Buffer.from('00000800', 'hex');
  const g = new GRE(buf);

  assert.equal(g.version, 0);
  assert.equal(g.protocol, 0x0800);
  assert.equal(g.checksumFlag, 0);
  assert.equal(g.keyFlag, 0);
  assert.equal(g.sequenceFlag, 0);
  assert.equal(g.length, 4);
  assert.equal(g.checksum, null);
  assert.equal(g.key, null);
  assert.equal(g.sequence, null);
});

test('GRE with key + sequence parse and roundtrip', async () => {
  // K=1 (bit 2 from MSB), S=1 (bit 3) -> byte 0 = 0x30
  const buf = Buffer.from('30000800deadbeef12345678', 'hex');
  const g = new GRE(buf);

  assert.equal(g.keyFlag, 1);
  assert.equal(g.sequenceFlag, 1);
  assert.equal(g.key, 0xdeadbeef);
  assert.equal(g.sequence, 0x12345678);
  assert.equal(g.length, 12);

  const built = new GRE({
    protocol: 0x0800,
    key: 0xdeadbeef,
    sequence: 0x12345678,
  });
  assert.equal(Buffer.compare(built.buffer, buf), 0);
});

test('GRE with checksum field present', async () => {
  // C=1 -> byte 0 = 0x80; checksum = 0x1234, reserved1 = 0x0000
  const buf = Buffer.from('800008001234' + '0000', 'hex');
  const g = new GRE(buf);

  assert.equal(g.checksumFlag, 1);
  assert.equal(g.checksum, 0x1234);
  assert.equal(g.length, 8);
});

test('Packet dispatches Ethernet -> IPv4 -> GRE -> IPv4', async () => {
  // outer Eth + outer IPv4 (proto=47 GRE) + GRE (no flags, inner=0x0800) + inner minimal IPv4
  const outerIp = '4500002800000000402f0000' + '0a000001' + '0a000002';
  const gre = '00000800';
  const innerIp = '4500001400000000400000000000000000000000';
  const buf = Buffer.from('424242424242aaaaaaaaaaaa0800' + outerIp + gre + innerIp, 'hex');

  const pkt = new Packet({ buffer: buf, iface: defaults });
  pkt.layers;

  // Walk chain to identify both IPv4 layers.
  const chain = [];
  let cur = pkt._layersHead;
  while (cur) { chain.push(cur.name); cur = cur.next; }

  assert.deepEqual(chain, ['Ethernet', 'IPv4', 'GRE', 'IPv4']);
});
