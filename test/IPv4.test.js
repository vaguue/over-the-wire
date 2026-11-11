const { strict: assert } = require('node:assert');
const test = require('node:test');

const { IPv4 } = require('#lib/layers/IPv4');

test('IPv4', async (t) => {
  const buf = Buffer.from('450000730000400040068cd2c0a80167cebd1ce6e33d5debb394ef8d', 'hex');
  const ip = new IPv4(buf);

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

  const optionsA = [
    { type: 7, recLength: 7, value: Buffer.from([4, 0, 0, 0, 0]) },
    { type: 1 },
  ];

  const ipA = new IPv4({ ...ip.toObject(), options: optionsA });
  assert.deepEqual([...ipA.options], optionsA);
  assert.equal(ipA.length, 28);
  assert.equal(ipA.headerLength, 7);
  assert.equal(ipA.buffer.subarray(20, 28).toString('hex'), '0707040000000001');

  const optionsB = [
    { type: 0x94, recLength: 4, value: Buffer.from([0, 0]) },
  ];

  const ipB = new IPv4({ ...ip.toObject(), options: optionsB });
  assert.deepEqual([...ipB.options], optionsB);

  assert.deepEqual(ipB.toObject(), new IPv4(ipB.toObject()).toObject());
  assert.deepEqual(new IPv4(ipB.toObject()).buffer, ipB.buffer);
});

test('IPv4 options from a real header (router alert)', () => {
  const buf = Buffer.from('46c0002000004000010241d5c0a80167e0000016' + '94040000', 'hex');
  const ip = new IPv4(buf);

  assert.equal(ip.length, 24);
  assert.deepEqual([...ip.options], [{ type: 0x94, recLength: 4, value: Buffer.from([0, 0]) }]);
});

test('IPv4 options are padded to a 32-bit boundary', () => {
  const ip = new IPv4({ src: '10.0.0.1', dst: '10.0.0.2', options: [{ type: 7, value: Buffer.from([4]) }] });

  assert.equal(ip.buffer.length, 24);
  assert.equal(ip.headerLength, 6);
  assert.equal(ip.buffer.subarray(20).toString('hex'), '07030400');
});
