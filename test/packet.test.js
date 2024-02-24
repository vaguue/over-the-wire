const { strict: assert } = require('node:assert');
const test = require('node:test');

const defaults = require('#lib/defaults');
const { Packet } = require('#lib/packet');

const pktBuf = () => 
  Buffer.from('424242424242424242424242080045000034000040004006a79ac0a80165a5162c06cd8e5debee16992ebea89919801008000d1200000101080a52d3c650dd04cdd6', 'hex');

test('Packet parsing', async (t) => {
  const buffer = pktBuf();
  const pkt = new Packet({ buffer, iface: defaults });

  assert.deepEqual(pkt.toObject(), {
    iface: {
      snaplen: 65535,
      linktype: 1
    },
    layers: {
      Ethernet: {
        dst: '42:42:42:42:42:42',
        src: '42:42:42:42:42:42',
        type: 2048
      },
      IPv4: {
        headerLength: 5,
        version: 4,
        typeOfService: 0,
        totalLength: 52,
        id: 0,
        fragmentOffsetRaw: 64,
        timeToLive: 64,
        protocol: 6,
        checksum: 42906,
        src: '192.168.1.101',
        dst: '165.22.44.6',
        fragmentInfo: {
          isFragment: false,
          value: 0,
          flags: 64
        },
        options: []
      },
      TCP: {
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
          {
            type: 8,
            recLength: 10,
            value: Buffer.from([82, 211, 198, 80, 221, 4, 205, 214]),
          }
        ]
      }
    }
  });

});

test('Packet clone and compare', t => {
  const pkt = new Packet({ 
    buffer: pktBuf(),
    iface: defaults,
  });

  assert.ok(pkt.equals(pkt.clone()));
});
