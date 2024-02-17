const { strict: assert } = require('node:assert');
const test = require('node:test');

const { TimeStamp } = require('#lib/timestamp');

const closeEqual = (a, b, threshold = 1e-3) => Math.abs(a - b) < threshold;

test('TimeStamp', async (t) => {
  const ts = new TimeStamp({ s: 1000, ms: 1000, ns: 123 });

  assert.equal(ts.s, 1001.000000123);
  assert.equal(ts.ns, 1001000000123n);
  assert.deepEqual(ts.packedIn({ s: true, ms: true }), { s: 1001, ms: 0 });
  assert.deepEqual(ts.packedIn({ s: true, ns: true }), { s: 1001, ns: 123 });

  const dateNow = Date.now();
  await new Promise((resolve) => setTimeout(resolve, 100));
  const now = TimeStamp.now('ns');

  assert.ok(closeEqual(now.ms / now.s, 1e3));
  assert.ok(closeEqual(Number(now.ns / BigInt(Math.floor(now.ms))), 1e6));
  assert.ok(new Date(TimeStamp.now('ns').ms).getTime() > dateNow);

  assert.equal(typeof new TimeStamp({ ns: BigInt(1e9) }).ns, 'bigint');
  assert.equal(typeof new TimeStamp({ ns: BigInt(1e9) }).s, 'number');
  assert.equal(typeof new TimeStamp({ ns: BigInt(1e9) }).ms, 'number');

  assert.equal(typeof new TimeStamp().ms, 'number');
  assert.equal(typeof TimeStamp.now('s').ms, 'number');
});
