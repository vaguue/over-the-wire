const { strict: assert } = require('node:assert');
const test = require('node:test');

const defaults = require('#lib/defaults');
const { NTP } = require('#lib/layers/NTP');
const { Packet } = require('#lib/packet');

test('NTP zeroed buffer', async () => {
  const ntp = new NTP(Buffer.alloc(48));
  assert.equal(ntp.length, 48);
  const obj = ntp.toObject();
  assert.equal(obj.li, 0);
  assert.equal(obj.vn, 0);
  assert.equal(obj.mode, 0);
  assert.equal(obj.transmitTimestamp, null);
});

test('NTP byte 0 packs LI/VN/Mode in MSB order', async () => {
  const ntp = new NTP({ li: 3, vn: 4, mode: 5 });
  // 11 (li) | 100 (vn=4) | 101 (mode=5) -> 11100101 = 0xe5
  assert.equal(ntp.buffer[0], 0xe5);
});

test('NTP timestamp Date round-trip preserves milliseconds', async () => {
  const now = new Date('2024-01-15T12:34:56.789Z');
  const built = new NTP({
    li: 0,
    vn: 4,
    mode: 3,
    stratum: 0,
    transmitTimestamp: now,
  });

  const parsed = new NTP(built.buffer);
  assert.equal(parsed.transmitTimestamp.getTime(), now.getTime());
});

test('Packet dispatches Ethernet -> IPv4 -> UDP -> NTP via port 123', async () => {
  // Build via the Packet API and re-parse as a sanity check of UDP port dispatch.
  const transmit = new Date('2024-06-01T00:00:00.000Z');

  const built = new NTP({ li: 0, vn: 4, mode: 4, stratum: 1, transmitTimestamp: transmit });

  // Manually compose: Eth + IPv4 + UDP(src=123,dst=12345) + NTP-bytes
  const ipHeader = Buffer.from('45000054000000004011000000000000000000000', 'hex'); // placeholder
  // Rebuild a proper UDP+NTP datagram. UDP totalLength = 8 + 48 = 56 = 0x0038.
  const udp = Buffer.from('007b' + '3039' + '0038' + '0000', 'hex'); // src=123 dst=12345
  const ip = Buffer.concat([
    Buffer.from('45000054', 'hex'), // ver/IHL/TOS/totalLen=84(20+64) - 0x54 = 84
    Buffer.from('00000000', 'hex'), // id, fragOffset
    Buffer.from('40110000', 'hex'), // ttl=64, proto=17 (UDP), checksum=0
    Buffer.from('0a0000010a000002', 'hex'), // src/dst IP
  ]);
  const eth = Buffer.from('424242424242aaaaaaaaaaaa0800', 'hex');
  // Total expected: eth(14) + ip(20) + udp(8) + ntp(48) = 90; ip totalLength should be 76 (20+8+48).
  const ipFixed = Buffer.from('45000004c000000000040110000000a0000010a000002', 'hex'); // ignore, build below

  const ipv4Buf = Buffer.alloc(20);
  ipv4Buf.writeUInt8(0x45, 0);                  // ver=4 IHL=5
  ipv4Buf.writeUInt8(0, 1);                     // TOS
  ipv4Buf.writeUInt16BE(20 + 8 + 48, 2);        // totalLength
  ipv4Buf.writeUInt8(64, 8);                    // TTL
  ipv4Buf.writeUInt8(17, 9);                    // protocol = UDP
  ipv4Buf.writeUInt32BE(0x0a000001 >>> 0, 12);  // src IP
  ipv4Buf.writeUInt32BE(0x0a000002 >>> 0, 16);  // dst IP

  const buf = Buffer.concat([eth, ipv4Buf, udp, built.buffer]);

  const pkt = new Packet({ buffer: buf, iface: defaults });
  pkt.layers;

  const chain = [];
  let cur = pkt._layersHead;
  while (cur) { chain.push(cur.name); cur = cur.next; }
  assert.deepEqual(chain, ['Ethernet', 'IPv4', 'UDP', 'NTP']);

  assert.equal(pkt.layers.NTP.transmitTimestamp.getTime(), transmit.getTime());
});
