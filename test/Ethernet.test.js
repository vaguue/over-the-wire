const { strict: assert } = require('node:assert');
const test = require('node:test');

const { Ethernet } = require('#lib/layers/Ethernet');
const { macFromString, macToString } = require('#lib/layers/mac');

test('Ethernet', async (t) => {
  const eth = new Ethernet(Buffer.from('1111111111112222222222220800', 'hex'));
  eth.src = eth.dst;
  assert.deepEqual(eth.toObject(), { dst: '11:11:11:11:11:11', src: '11:11:11:11:11:11', type: 2048 });

  assert.deepEqual(eth.toObject(), new Ethernet(eth.toObject()).toObject());
  assert.deepEqual(new Ethernet(eth.toObject()).buffer, eth.buffer);
});

test('macFromString accepts short octets (macOS arp -a output)', () => {
  // macOS' arp prints octets without leading zeroes; the parser must
  // restore them so the resulting buffer matches the canonical form.
  const canonical = macFromString('70:0b:01:41:6b:45');
  const short     = macFromString('70:b:1:41:6b:45');

  assert.equal(canonical.length, 6);
  assert.equal(short.length, 6);
  assert.deepEqual(short, canonical);
  assert.equal(macToString(short), '70:0b:01:41:6b:45');
});

test('macFromString rejects malformed input', () => {
  assert.throws(() => macFromString('70:0b:01:41:6b'),       /Invalid MAC address/);
  assert.throws(() => macFromString('70:0b:01:41:6b:45:00'), /Invalid MAC address/);
  assert.throws(() => macFromString('70:0b:01:41:6b:zz'),    /Invalid MAC address/);
  assert.throws(() => macFromString('70:0b:01:41:6b:'),      /Invalid MAC address/);
});

test('Ethernet accepts MAC strings with short octets', () => {
  const eth = new Ethernet({ src: '70:b:1:41:6b:45', dst: '0:0:0:0:0:0' });
  assert.equal(eth.src, '70:0b:01:41:6b:45');
  assert.equal(eth.dst, '00:00:00:00:00:00');
});
