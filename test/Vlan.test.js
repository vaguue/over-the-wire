const { strict: assert } = require('node:assert');
const test = require('node:test');

const defaults = require('#lib/defaults');
const { Vlan } = require('#lib/layers/Vlan');
const { Packet } = require('#lib/packet');

test('Vlan parse and roundtrip', async () => {
  // pcp=3, dei=0, vid=100, etherType=0x0800
  const buf = Buffer.from('60640800', 'hex');
  const v = new Vlan(buf);

  assert.equal(v.vid, 100);
  assert.equal(v.dei, 0);
  assert.equal(v.pcp, 3);
  assert.equal(v.etherType, 0x0800);

  const v2 = new Vlan({ pcp: 3, dei: 0, vid: 100, etherType: 0x0800 });
  assert.equal(Buffer.compare(v.buffer, v2.buffer), 0);
});

test('Packet dispatches Ethernet -> Vlan -> IPv4', async () => {
  // dst+src+0x8100 (vlan) + vlan(pcp=0,dei=0,vid=10) + 0x0800 + minimal IPv4 (20 bytes, all zero)
  const buf = Buffer.from(
    '424242424242aaaaaaaaaaaa8100' +
    '000a' + '0800' +
    '4500001400000000400000000000000000000000',
    'hex'
  );

  const pkt = new Packet({ buffer: buf, iface: defaults });
  const obj = pkt.toObject().layers;

  assert.equal(obj.Ethernet.type, 0x8100);
  assert.equal(obj.Vlan.vid, 10);
  assert.equal(obj.Vlan.etherType, 0x0800);
  assert.equal(obj.IPv4.version, 4);
});

test('Q-in-Q nested Vlan', async () => {
  // 0x88a8 outer + vlan(vid=20) + 0x8100 inner + vlan(vid=30) + 0x0800 + minimal IPv4
  const buf = Buffer.from(
    '424242424242aaaaaaaaaaaa88a8' +
    '0014' + '8100' +
    '001e' + '0800' +
    '4500001400000000400000000000000000000000',
    'hex'
  );

  const pkt = new Packet({ buffer: buf, iface: defaults });
  pkt.layers;

  // Walk the chain explicitly: the dictionary `pkt.layers.Vlan` only holds the
  // last instance with that name, so for nested same-name layers we follow
  // `prev`/`next` to enumerate them.
  const vlans = [];
  let cur = pkt._layersHead;
  while (cur) {
    if (cur.name === 'Vlan') vlans.push(cur);
    cur = cur.next;
  }

  assert.equal(vlans.length, 2);
  assert.equal(vlans[0].vid, 20);
  assert.equal(vlans[0].etherType, 0x8100);
  assert.equal(vlans[1].vid, 30);
  assert.equal(vlans[1].etherType, 0x0800);
  assert.ok(pkt.layers.IPv4);
});
