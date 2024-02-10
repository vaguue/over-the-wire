const { strict: assert } = require('node:assert');
const test = require('node:test');

const { extendAt, shrinkAt } = require('#lib/buffer');
const { TCP } = require('#lib/layers/TCP');

test('TCP', async (t) => {
  const buf = Buffer.from('cd8e5debee16992ebea89919801008000d1200000101080a52d3c650dd04cdd6', 'hex');
  const opts = {
    shrinkAt(...args) {
      return shrinkAt(buf, ...args);
    },
    extendAt(...args) {
      return extendAt(buf, ...args);
    },
    prev: {
      src: '192.168.1.101',
      dst: '165.22.44.6',
      name: 'IPv4',
    }
  };

  const tcp = new TCP(buf, opts);

  assert.deepEqual(tcp.toObject(), {
    src: 52622,
    dst: 24043,
    seq: 3994458414,
    ack: 3198720281,
    dataOffset: 8,
    windowSize: 2048,
    checksum: 3346,
    urgentPointer: 0,
    flags: {
      reserved: 0,
      cwr: 0,
      ece: 0,
      urg: 0,
      ack: 1,
      psh: 0,
      rst: 0,
      syn: 0,
      fin: 0
    },
    options: [
      { type: 1 },
      { type: 1 },
      { type: 8, recLength: 10, value: Buffer.from([0x52, 0xd3, 0xc6, 0x50, 0xdd, 0x04, 0xcd, 0xd6]) }
    ],
  });

  const { buffer, checksum } = tcp;

  tcp.checksum = 0;
  tcp.calculateChecksum();

  assert.equal(tcp.checksum, checksum);
  assert.equal(Buffer.compare(tcp.buffer, buffer), 0);

  tcp.flags.syn = 1;

  assert.equal(new TCP(tcp.buffer, opts).flags.syn, 1);
});
