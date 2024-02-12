const { strict: assert } = require('node:assert');
const test = require('node:test');

const { TLV_8, TLVIterator, TLVSerialize, TLVPadding_8 } = require('#lib/layers/TLV');

test('TLV', async (t) => {
  const buf = Buffer.from([0x01, 0x04, 0xAA, 0xAA, 0xAA, 0xAA, 0x02, 0x02, 0xBB, 0xBB]);
  const tlvOption = new TLV_8(buf);

  assert.deepEqual(tlvOption.toObject(), { type: 1, recLength: 4, value: Buffer.from([0xaa, 0xaa,  0xaa, 0xaa]) });
  assert.equal(tlvOption.length, 6);

  const opts = [...new TLVIterator(TLV_8, buf)];

  assert.deepEqual(opts, [
    { type: 1, recLength: 4, value: Buffer.from([0xaa, 0xaa, 0xaa, 0xaa]) },
    { type: 2, recLength: 2, value: Buffer.from([0xbb, 0xbb]) }
  ]);

  assert.deepEqual(TLVSerialize(TLV_8, TLVPadding_8, opts, 4), Buffer.from([0x01, 0x04, 0xaa, 0xaa, 0xaa, 0xaa, 0x02, 0x02, 0xbb, 0xbb, 0x00, 0x00]))
});
