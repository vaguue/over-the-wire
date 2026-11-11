import { strict as assert } from 'node:assert';
import test from 'node:test';

import { TimeStamp } from '#lib/timestamp';

const closeEqual = (a, b, threshold = 1e-3) => Math.abs(a - b) < threshold;

const sleep = (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms));

test('TimeStamp', async (t) => {
  const ts = new TimeStamp({ s: 1000, ms: 1000, ns: 123 });

  assert.equal(ts.s, 1001.000000123);
  assert.equal(ts.ns, 1001000000123n);
  assert.deepEqual(ts.packedIn({ s: true, ms: true }), { s: 1001, ms: 0 });
  assert.deepEqual(ts.packedIn({ s: true, ns: true }), { s: 1001, ns: 123 });

  const dateNow = Date.now();
  await sleep();
  const now = TimeStamp.now('ns');

  assert.ok(closeEqual(now.ms / now.s, 1e3));
  assert.ok(closeEqual(Number(now.ns / BigInt(Math.floor(now.ms))), 1e6));
  assert.ok(new Date(TimeStamp.now('ns').ms).getTime() > dateNow);

  assert.equal(typeof new TimeStamp({ ns: BigInt(1e9) }).ns, 'bigint');
  assert.equal(typeof new TimeStamp({ ns: BigInt(1e9) }).s, 'number');
  assert.equal(typeof new TimeStamp({ ns: BigInt(1e9) }).ms, 'number');

  assert.equal(typeof new TimeStamp().ms, 'number');
  assert.equal(typeof TimeStamp.now('s').ms, 'number');

  await sleep();

  assert.ok(now.compare(TimeStamp.now()) < 0);
  assert.equal(now.compare(now.clone()), 0);
});

test('TimeStamp with fractional seconds', () => {
  const ts = new TimeStamp({ s: 1.5 });

  assert.equal(ts.ns, 1500000000n);
  assert.equal(ts.compare(new TimeStamp({ ms: 1500 })), 0);
  assert.equal(ts.compare(new TimeStamp({ ms: 1501 })), -1);
  assert.deepEqual(ts.packedIn({ s: true, ns: true }), { s: 1, ns: 500000000 });

  assert.equal(typeof TimeStamp.now('s').ns, 'bigint');
  assert.equal(new TimeStamp({ s: 2n, ns: 5n }).ns, 2000000005n);
});
