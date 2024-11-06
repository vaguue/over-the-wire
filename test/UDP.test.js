const { strict: assert } = require('node:assert');
const test = require('node:test');

const { extendAt, shrinkAt } = require('#lib/buffer');
const { UDP } = require('#lib/layers/UDP');

test('UDP', async (t) => {
  
  const buf = Buffer.from('01bbfbda001f096845785986219a31c939c38f0093b888f6b9de8ceaa67f61', 'hex');
  const opts = {
    shrinkAt(...args) {
      return shrinkAt(buf, ...args);
    },
    extendAt(...args) {
      return extendAt(buf, ...args);
    },
    prev: {
      src: '188.114.96.7',
      dst: '172.20.10.6',
      name: 'IPv4',
    }
  };

  const udp = new UDP(buf, opts);

  assert.deepEqual(udp.toObject(), {
    src: 443,
    dst: 64474,
    totalLength: 31,
    checksum: 0x0968,
  });

  const { buffer, checksum } = udp;

  udp.checksum = 0;
  udp.calculateChecksum();

  assert.equal(udp.checksum, checksum);
  assert.equal(Buffer.compare(udp.buffer, buffer), 0);

  assert.deepEqual(new UDP(udp.toObject()).toObject(), udp.toObject());
  //assert.deepEqual(new UDP(udp.toObject()).buffer, udp.buffer);
});
