const { strict: assert } = require('node:assert');
const test = require('node:test');

const defaults = require('#lib/defaults');
const { DNS } = require('#lib/layers/DNS');
const { Packet } = require('#lib/packet');

const exampleHex = Buffer.from('example').toString('hex'); // 6578616d706c65
const comHex = Buffer.from('com').toString('hex');         // 636f6d

test('DNS parse simple A query', async () => {
  const buf = Buffer.from('1234' + '0100' + '0001000000000000' + '07' + exampleHex + '03' + comHex + '00' + '0001' + '0001', 'hex');
  const dns = new DNS(buf);

  assert.equal(dns.id, 0x1234);
  assert.equal(dns.qr, 0);
  assert.equal(dns.rd, 1);
  assert.equal(dns.qdCount, 1);
  assert.equal(dns.anCount, 0);

  assert.deepEqual(dns.questions, [
    { name: 'example.com', type: 1, class: 1 },
  ]);
});

test('DNS parse response with pointer compression', async () => {
  // Header: id=0x1234, flags=0x8180 (response, RD, RA), qd=1, an=1
  // Question: example.com, A, IN
  // Answer: 0xC00C points back to question name; type=A, class=IN, ttl=300, rdlen=4, IP=93.184.216.34
  const buf = Buffer.from(
    '1234' + '8180' + '0001' + '0001' + '0000' + '0000' +
    '07' + exampleHex + '03' + comHex + '00' + '0001' + '0001' +
    'c00c' + '0001' + '0001' + '0000012c' + '0004' + '5db8d822',
    'hex'
  );
  const dns = new DNS(buf);

  assert.equal(dns.qr, 1);
  assert.equal(dns.ra, 1);
  assert.deepEqual(dns.questions[0], { name: 'example.com', type: 1, class: 1 });
  assert.equal(dns.answers.length, 1);
  assert.equal(dns.answers[0].name, 'example.com');
  assert.equal(dns.answers[0].type, 1);
  assert.equal(dns.answers[0].ttl, 300);
  assert.equal(dns.answers[0].rdata, '93.184.216.34');
});

test('DNS parse CNAME chain with pointer in rdata', async () => {
  // Q: www.example.com (A) ; A: www.example.com -> CNAME -> example.com -> A 93.184.216.34
  const wwwHex = Buffer.from('www').toString('hex');
  const buf = Buffer.from(
    '1234' + '8180' + '0001' + '0002' + '0000' + '0000' +
    // Question (offset 12): www.example.com, A, IN  (= 21 bytes)
    '03' + wwwHex + '07' + exampleHex + '03' + comHex + '00' + '0001' + '0001' +
    // Answer 1: name pointer 0xC00C (-> www.example.com), CNAME, IN, TTL, rdlen=12, rdata = pointer 0xC010 (-> example.com offset 16)
    'c00c' + '0005' + '0001' + '00000258' + '0002' + 'c010' +
    // Answer 2: name pointer 0xC010 (-> example.com), A, IN, TTL, rdlen=4, rdata=93.184.216.34
    'c010' + '0001' + '0001' + '0000012c' + '0004' + '5db8d822',
    'hex'
  );

  const dns = new DNS(buf);
  assert.equal(dns.answers.length, 2);
  assert.equal(dns.answers[0].name, 'www.example.com');
  assert.equal(dns.answers[0].type, 5); // CNAME
  assert.equal(dns.answers[0].rdata, 'example.com');
  assert.equal(dns.answers[1].name, 'example.com');
  assert.equal(dns.answers[1].type, 1);
  assert.equal(dns.answers[1].rdata, '93.184.216.34');
});

test('DNS build query and parse back without compression', async () => {
  const built = new DNS({
    id: 0xbeef,
    rd: 1,
    questions: [{ name: 'foo.bar.com', type: 1, class: 1 }],
  });

  const parsed = new DNS(built.buffer);
  assert.equal(parsed.id, 0xbeef);
  assert.equal(parsed.rd, 1);
  assert.deepEqual(parsed.questions, [{ name: 'foo.bar.com', type: 1, class: 1 }]);
  assert.equal(parsed.answers.length, 0);
});

test('DNS build response with A, AAAA, MX, TXT and parse back', async () => {
  const built = new DNS({
    id: 0x4242,
    qr: 1, rd: 1, ra: 1,
    questions: [{ name: 'example.com', type: 1, class: 1 }],
    answers: [
      { name: 'example.com', type: DNS.TYPES.A, ttl: 60, rdata: '1.2.3.4' },
      { name: 'example.com', type: DNS.TYPES.AAAA, ttl: 60, rdata: '2001:db8::1' },
      { name: 'example.com', type: DNS.TYPES.MX, ttl: 3600, rdata: { preference: 10, exchange: 'mail.example.com' } },
      { name: 'example.com', type: DNS.TYPES.TXT, ttl: 60, rdata: 'v=spf1 -all' },
    ],
  });

  const parsed = new DNS(built.buffer);
  assert.equal(parsed.qr, 1);
  assert.equal(parsed.anCount, 4);
  const ans = parsed.answers;
  assert.equal(ans[0].rdata, '1.2.3.4');
  assert.equal(ans[1].rdata, '2001:db8::1');
  assert.deepEqual(ans[2].rdata, { preference: 10, exchange: 'mail.example.com' });
  assert.equal(ans[3].rdata, 'v=spf1 -all');
});

test('Packet dispatches Ethernet -> IPv4 -> UDP -> DNS via port 53', async () => {
  const dns = new DNS({
    id: 0x4242,
    rd: 1,
    questions: [{ name: 'example.com', type: 1, class: 1 }],
  });

  const dnsBuf = dns.buffer;
  const udpBuf = Buffer.alloc(8);
  udpBuf.writeUInt16BE(50000, 0);            // src ephemeral
  udpBuf.writeUInt16BE(53, 2);               // dst = DNS
  udpBuf.writeUInt16BE(8 + dnsBuf.length, 4); // total length
  udpBuf.writeUInt16BE(0, 6);                // checksum 0

  const ipBuf = Buffer.alloc(20);
  ipBuf.writeUInt8(0x45, 0);
  ipBuf.writeUInt16BE(20 + 8 + dnsBuf.length, 2);
  ipBuf.writeUInt8(64, 8);
  ipBuf.writeUInt8(17, 9);
  ipBuf.writeUInt32BE(0x0a000001, 12);
  ipBuf.writeUInt32BE(0x0a000002, 16);

  const eth = Buffer.from('424242424242aaaaaaaaaaaa0800', 'hex');
  const buf = Buffer.concat([eth, ipBuf, udpBuf, dnsBuf]);

  const pkt = new Packet({ buffer: buf, iface: defaults });
  pkt.layers;

  const chain = [];
  let cur = pkt._layersHead;
  while (cur) { chain.push(cur.name); cur = cur.next; }
  assert.deepEqual(chain, ['Ethernet', 'IPv4', 'UDP', 'DNS']);
  assert.deepEqual(pkt.layers.DNS.questions, [{ name: 'example.com', type: 1, class: 1 }]);
});
