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

test('DNS parse SRV record', async () => {
  // Q: _sip._tcp.example.com (SRV)
  // A: priority=10, weight=20, port=5060, target=sipserver.example.com
  // We avoid pointer compression here for clarity; rdata target is a literal name.
  const sipHex = Buffer.from('_sip').toString('hex');     // 5f736970
  const tcpHex = Buffer.from('_tcp').toString('hex');     // 5f746370
  const srvHex = Buffer.from('sipserver').toString('hex'); // 73697073657276 6572

  // qname: _sip._tcp.example.com (length-prefixed labels + null)
  const qnameHex =
    '04' + sipHex +
    '04' + tcpHex +
    '07' + exampleHex +
    '03' + comHex +
    '00';

  // rdata: priority(2) weight(2) port(2) + target name
  // target = sipserver.example.com (uncompressed)
  const targetHex =
    '09' + srvHex +
    '07' + exampleHex +
    '03' + comHex +
    '00';
  const rdataHex = '000a' + '0014' + '13c4' + targetHex; // pri=10, wt=20, port=5060
  const rdlength = rdataHex.length / 2;

  // header: id=1234, flags=8180, qd=1, an=1, ns=0, ar=0
  const buf = Buffer.from(
    '1234' + '8180' + '0001' + '0001' + '0000' + '0000' +
    qnameHex + '0021' + '0001' +
    qnameHex + '0021' + '0001' + '00000078' +
    rdlength.toString(16).padStart(4, '0') +
    rdataHex,
    'hex'
  );

  const dns = new DNS(buf);
  assert.equal(dns.questions[0].type, DNS.TYPES.SRV);
  assert.equal(dns.answers.length, 1);
  assert.deepEqual(dns.answers[0].rdata, {
    priority: 10,
    weight: 20,
    port: 5060,
    target: 'sipserver.example.com',
  });
});

test('DNS build SRV record and parse back', async () => {
  const built = new DNS({
    id: 0xcafe,
    qr: 1, rd: 1, ra: 1,
    questions: [{ name: '_sip._tcp.example.com', type: DNS.TYPES.SRV, class: 1 }],
    answers: [{
      name: '_sip._tcp.example.com',
      type: DNS.TYPES.SRV,
      class: 1,
      ttl: 120,
      rdata: { priority: 10, weight: 20, port: 5060, target: 'sipserver.example.com' },
    }],
  });

  const parsed = new DNS(built.buffer);
  assert.equal(parsed.answers[0].type, DNS.TYPES.SRV);
  assert.deepEqual(parsed.answers[0].rdata, {
    priority: 10,
    weight: 20,
    port: 5060,
    target: 'sipserver.example.com',
  });
});

test('DNS parse EDNS0 OPT pseudo-RR with options', async () => {
  // Build query manually: header + question + OPT in additional.
  // OPT name=root(1 byte 0x00), type=41, class=4096, ttl flags(DO=1, ext-rcode=0, ver=0),
  // rdata = one option: code=0x000a (COOKIE), data=8 bytes 0x01..0x08
  const qnameHex = '07' + exampleHex + '03' + comHex + '00';
  const optRdata = '000a' + '0008' + '0102030405060708';
  const optRdlength = (optRdata.length / 2).toString(16).padStart(4, '0');
  const buf = Buffer.from(
    '1234' + '0100' + '0001' + '0000' + '0000' + '0001' +
    qnameHex + '0001' + '0001' +
    '00' +              // root name
    '0029' +            // type=41 (OPT)
    '1000' +            // class = UDP payload size 4096
    '00008000' +        // ttl: ext-rcode=0, version=0, DO=1, Z=0
    optRdlength +
    optRdata,
    'hex'
  );

  const dns = new DNS(buf);
  assert.equal(dns.arCount, 1);
  const opt = dns.opt;
  assert.ok(opt, 'opt should not be null');
  assert.equal(opt.udpPayloadSize, 4096);
  assert.equal(opt.extendedRcode, 0);
  assert.equal(opt.version, 0);
  assert.equal(opt.doFlag, 1);
  assert.equal(opt.options.length, 1);
  assert.equal(opt.options[0].code, 0x000a);
  assert.deepEqual(opt.options[0].data, Buffer.from('0102030405060708', 'hex'));
});

test('DNS build query with EDNS0 via DNS.opt() helper', async () => {
  const built = new DNS({
    id: 0xbeef,
    rd: 1,
    questions: [{ name: 'example.com', type: 1, class: 1 }],
    additional: [DNS.opt({
      udpPayloadSize: 4096,
      doFlag: 1,
      options: [{ code: 0x000a, data: Buffer.from('aabbccddeeff0011', 'hex') }],
    })],
  });

  const parsed = new DNS(built.buffer);
  assert.equal(parsed.qdCount, 1);
  assert.equal(parsed.arCount, 1);
  assert.deepEqual(parsed.questions, [{ name: 'example.com', type: 1, class: 1 }]);

  const opt = parsed.opt;
  assert.ok(opt);
  assert.equal(opt.udpPayloadSize, 4096);
  assert.equal(opt.doFlag, 1);
  assert.equal(opt.version, 0);
  assert.equal(opt.options.length, 1);
  assert.equal(opt.options[0].code, 0x000a);
  assert.deepEqual(opt.options[0].data, Buffer.from('aabbccddeeff0011', 'hex'));
});

test('DNS opt getter returns null when no OPT RR is present', async () => {
  const dns = new DNS({
    id: 1,
    rd: 1,
    questions: [{ name: 'example.com', type: 1, class: 1 }],
  });
  assert.equal(dns.opt, null);
});

test('Packet dispatches Ethernet -> IPv4 -> UDP -> DNS via mDNS port 5353', async () => {
  const dns = new DNS({
    id: 0,
    qr: 1,
    aa: 1,
    questions: [],
    answers: [{
      name: '_airplay._tcp.local',
      type: DNS.TYPES.PTR,
      class: 1,
      ttl: 4500,
      rdata: 'Living Room Apple TV._airplay._tcp.local',
    }],
  });

  const dnsBuf = dns.buffer;
  const udpBuf = Buffer.alloc(8);
  udpBuf.writeUInt16BE(5353, 0);             // src = mDNS
  udpBuf.writeUInt16BE(5353, 2);             // dst = mDNS
  udpBuf.writeUInt16BE(8 + dnsBuf.length, 4);
  udpBuf.writeUInt16BE(0, 6);

  const ipBuf = Buffer.alloc(20);
  ipBuf.writeUInt8(0x45, 0);
  ipBuf.writeUInt16BE(20 + 8 + dnsBuf.length, 2);
  ipBuf.writeUInt8(255, 8);                  // typical TTL=255 for mDNS
  ipBuf.writeUInt8(17, 9);
  ipBuf.writeUInt32BE(0x0a000001, 12);
  ipBuf.writeUInt32BE(0xe00000fb, 16);       // 224.0.0.251

  const eth = Buffer.from('01005e0000fb424242424242' + '0800', 'hex');
  const buf = Buffer.concat([eth, ipBuf, udpBuf, dnsBuf]);

  const pkt = new Packet({ buffer: buf, iface: defaults });
  pkt.layers;

  const chain = [];
  let cur = pkt._layersHead;
  while (cur) { chain.push(cur.name); cur = cur.next; }
  assert.deepEqual(chain, ['Ethernet', 'IPv4', 'UDP', 'DNS']);
  assert.equal(pkt.layers.DNS.answers[0].type, DNS.TYPES.PTR);
  assert.equal(pkt.layers.DNS.answers[0].rdata, 'Living Room Apple TV._airplay._tcp.local');
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
