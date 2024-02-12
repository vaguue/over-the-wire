const { strict: assert } = require('node:assert');
const test = require('node:test');

const { extendAt, shrinkAt } = require('#lib/buffer');
const { IPv4 } = require('#lib/layers/IPv4');

test('IPv4', async (t) => {
  const buf = Buffer.from('450000730000400040068cd2c0a80167cebd1ce6e33d5debb394ef8d', 'hex');
  const ip = new IPv4(buf, {
    shrinkAt(...args) {
      return shrinkAt(buf, ...args);
    },
    extendAt(...args) {
      return extendAt(buf, ...args);
    },
  });

  assert.deepEqual(
    ip.toObject(),
    {
      headerLength: 5,
      version: 4,
      typeOfService: 0,
      totalLength: 115,
      id: 0,
      fragmentOffsetRaw: 64,
      timeToLive: 64,
      protocol: 6,
      checksum: 36050,
      src: '192.168.1.103',
      dst: '206.189.28.230',
      fragmentInfo: { isFragment: false, value: 0, flags: 64 },
      options: [],
    }
  );

  assert.equal(ip.length, 20);

  const { checksum } = ip;
  ip.checksum = 0;
  ip.calculateChecksum();
  assert.equal(ip.checksum, checksum);
  assert.equal(ip.buffer, buf);

  ip.dst = '192.168.1.1';
  assert.equal(ip.dst, '192.168.1.1');

  let options = [
    { type: 1, recLength: 4, value: Buffer.from([0xaa, 0xaa, 0xaa, 0xaa]) },
    { type: 2, recLength: 2, value: Buffer.from([0xbb, 0xbb]) },
    { type: 0, recLength: 0, value: Buffer.from([]) }
  ];

  ip.options = options;

  assert.deepEqual([...ip.options], options);
  assert.equal(ip.length, 32);

  options = [
    { type: 1, recLength: 4, value: Buffer.from([0xaa, 0xaa, 0xaa, 0xaa]) },
    { type: 0, recLength: 0, value: Buffer.from([]) }
  ];

  ip.options = options;

  assert.deepEqual([...ip.options], options);

  assert.deepEqual(ip.toObject(), new IPv4(ip.toObject()).toObject());
  assert.deepEqual(new IPv4(ip.toObject()).buffer, ip.buffer);
});
