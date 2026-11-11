const { strict: assert } = require('node:assert');
const test = require('node:test');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const { pipeline } = require('node:stream/promises');
const { createHash, randomUUID } = require('node:crypto');
const exec = require('util').promisify(require('node:child_process').exec);

const { createReadStream, createWriteStream } = require('#lib/pcapFile/index');
const { Packet } = require('#lib/packet');
const { fromNumber } = require('#lib/buffer');

const Tsresol = require('#lib/pcapFile/tsresol');
const { TimeStamp } = require('#lib/timestamp');

test('Tsresol', t => {
  const now = TimeStamp.now();
  const resoled = Tsresol.serialize(null, now);
  assert.equal(now.compare(Tsresol.parse(null, resoled)), 0);
});

test('Pcap read', (t, done) => {
  const pcap = createReadStream({ format: 'pcap' });
  const input = fs.createReadStream(path.resolve(__dirname, 'data/example1.pcap'));
  
  input.pipe(pcap);

  console.time('Pcap parsing');

  pcap.on('header', hdr => {
    assert.deepEqual(hdr, {
      magic: 2712847316,
      version_major: 2,
      version_minor: 4,
      thiszone: 0,
      sigfigs: 0,
      snaplen: 262144,
      linktype: 1
    });
  });

  let pktCount = 0;

  pcap.on('data', pkt => {
    pktCount++;
    assert.ok(pkt instanceof Packet);
  });

  pcap.on('end', () => {
    assert.equal(pktCount, 125);
    console.timeEnd('Pcap parsing');
    done();
  });
});

test('Pcap write', async (t) => {
  const pcapIn = createReadStream({ format: 'pcap' });
  const pcapOut = createWriteStream({ format: 'pcap', snaplen: 262144 });

  const input = fs.createReadStream(path.resolve(__dirname, 'data/example1.pcap'));

  const origHash = createHash('sha256');
  const resultHash = createHash('sha256');
  
  await pipeline(
    input,
    async function*(source) {
      for await (const chunk of source) {
        origHash.write(chunk);
        yield chunk;
      }
    },
    pcapIn,
    pcapOut,
    async function*(source) {
      for await (const chunk of source) {
        resultHash.write(chunk);
        yield chunk;
      }
    },
  );

  origHash.end();
  resultHash.end();

  assert.equal(origHash.digest('hex'), resultHash.digest('hex'));
});

test('Pcapng read', (t, done) => {
  const pcapng = createReadStream({ format: 'pcapng' });
  const input = fs.createReadStream(path.resolve(__dirname, 'data/example2.pcapng'));
  
  input.pipe(pcapng);

  console.time('Pcapng parsing');

  pcapng.on('interface-description', hdr => {
    if (hdr.linktype == 1) {
      assert.deepEqual(hdr, {
        linktype: 1,
        reserved: 0,
        snaplen: 262144,
        options: [
          { option_code: 2, option_length: 2, buffer: 'lo\x00\x00' },
          { option_code: 9, option_length: 1, buffer: '\t\x00\x00\x00' },
          {
            option_code: 11,
            option_length: 14,
            buffer: '\x00tcp port 3306\x00\x00'
          },
          {
            option_code: 12,
            option_length: 19,
            buffer: 'Linux 3.18.1-1-ARCH\x00'
          },
          { option_code: 0, option_length: 0, buffer: '' }
        ]
      });
    }
    else if (hdr.linktype == 113) {
      assert.deepEqual(hdr, { linktype: 113, reserved: 0, snaplen: 0, options: [] });
    }
  });

  pcapng.on('section-header', hdr => {
    assert.deepEqual(hdr, {
      byte_order_magic: 439041101,
      major_version: 1,
      minor_version: 0,
      section_length: -1n,
      options: [
        {
          option_code: 1,
          option_length: 226,
          buffer: 'CLIENT_RANDOM E39B5BF4903C68684E8512FB2F60213E9EE843A0810B4982B607914D8092D482 95A5D39B02693BC1FB39254B179E9293007F6D37C66172B1EE4EF0D5E25CE1DABE878B6143DC3B266883E51A75E99DF9                                                   \x00\x00'
        },
        {
          option_code: 3,
          option_length: 19,
          buffer: 'Linux 3.18.1-1-ARCH\x00'
        },
        {
          option_code: 4,
          option_length: 57,
          buffer: 'Dumpcap (Wireshark) 1.99.1 (Git Rev Unknown from unknown)\x00\x00\x00'
        },
        { option_code: 0, option_length: 0, buffer: '' }
      ]
    });
  });

  let pktCount = 0;

  pcapng.on('data', pkt => {
    pktCount++;
    assert.ok(pkt instanceof Packet);
  });

  pcapng.on('end', () => {
    assert.equal(pktCount, 159);
    console.timeEnd('Pcapng parsing')
    done();
  });
});

test('Pcapng write', async (t) => {
  const pcapIn = createReadStream({ format: 'pcapng' });
  const pcapInAfter = createReadStream({ format: 'pcapng' });
  const pcapOut = createWriteStream({ format: 'pcapng' });

  const input = fs.createReadStream(path.resolve(__dirname, 'data/example2.pcapng'));

  const origHash = createHash('sha256');
  const resultHash = createHash('sha256');

  const dumpPacket = (hash, pkt) => {
    hash.write(pkt.buffer);

    const ms = Buffer.from(pkt.timestamp.ms.toString());
    hash.write(ms);

    if (pkt.comment) {
      hash.write(Buffer.from(pkt.comment));
    }
  };

  await pipeline(
    input,
    pcapIn,
    async function*(source) {
      for await (const pkt of source) {
        dumpPacket(origHash, pkt);
        yield pkt;
      }
    },
    pcapOut,
    pcapInAfter,
    async function*(source) {
      for await (const pkt of source) {
        dumpPacket(resultHash, pkt);
      }
    },
  );

  origHash.end();
  resultHash.end();

  assert.equal(origHash.digest('hex'), resultHash.digest('hex'));
});

test('Tshark check', async (t) => {
  const pcapIn = createReadStream({ format: 'pcapng' });
  const pcapOut = createWriteStream({ format: 'pcapng' });

  const inputPath = path.resolve(__dirname, 'data/example2.pcapng');
  const outputPath = path.resolve(os.tmpdir(), `${randomUUID()}.pcapng`);

  const input = fs.createReadStream(inputPath);
  const output = fs.createWriteStream(outputPath);

  await pipeline(
    input,
    pcapIn,
    pcapOut,
    output,
  );

  let stdoutOrig = null, stdoutResult = null;

  try {
    const tshark = path.resolve(__dirname, 'tshark.sh');
    stdoutOrig = await exec(`${tshark} ${inputPath}`).then(res => res.stdout);
    stdoutResult = await exec(`${tshark} ${outputPath}`).then(res => res.stdout);
  } catch(err) {
    console.error(`[!] Error checking tshark ${err}`);
  } finally {
    assert.equal(stdoutOrig, stdoutResult);
  }
});

const collect = (stream) => new Promise((resolve, reject) => {
  const chunks = [];
  stream.on('data', chunk => chunks.push(chunk));
  stream.on('end', () => resolve(chunks));
  stream.on('error', reject);
});

const ethernetFrame = (size) => Buffer.concat([
  Buffer.from('aabbccddeeff112233445566' + '0800', 'hex'),
  Buffer.alloc(size - 14, 0x41),
]);

test('Pcap timestamps are seconds and microseconds', async () => {
  const fileHeader = Buffer.alloc(24);
  fileHeader.writeUInt32LE(0xa1b2c3d4, 0);
  fileHeader.writeUInt16LE(2, 4);
  fileHeader.writeUInt16LE(4, 6);
  fileHeader.writeUInt32LE(65535, 16);
  fileHeader.writeUInt32LE(1, 20);

  const record = Buffer.alloc(16);
  record.writeUInt32LE(1700000000, 0);
  record.writeUInt32LE(500000, 4);
  record.writeUInt32LE(4, 8);
  record.writeUInt32LE(4, 12);

  const reader = createReadStream({ format: 'pcap' });
  const packets = collect(reader);
  reader.end(Buffer.concat([fileHeader, record, Buffer.from('deadbeef', 'hex')]));

  const [pkt] = await packets;
  assert.equal(pkt.timestamp.ms, 1700000000500);

  const writer = createWriteStream({ format: 'pcap' });
  const written = collect(writer);
  writer.write(pkt);
  writer.end();

  const file = Buffer.concat(await written);
  assert.equal(file.readUInt32LE(24), 1700000000);
  assert.equal(file.readUInt32LE(24 + 4), 500000);
});

test('Pcap write: snap length is not taken from the interface MTU', async () => {
  const writer = createWriteStream({ format: 'pcap' });
  const written = collect(writer);

  writer.write(new Packet({ buffer: ethernetFrame(1514), iface: { linktype: 1, mtu: 1500 } }));
  writer.write(new Packet({ buffer: ethernetFrame(60), iface: {} }));
  writer.end();

  const file = Buffer.concat(await written);
  assert.equal(file.readUInt32LE(16), 65535);
  assert.equal(file.readUInt32LE(24 + 8), 1514);
});

test('Pcapng write: raw buffers get an interface description first', async () => {
  const writer = createWriteStream({ format: 'pcapng' });
  const written = collect(writer);

  writer.write(ethernetFrame(61));
  writer.end();

  const file = Buffer.concat(await written);
  const sectionHeaderLength = file.readUInt32LE(4);
  assert.equal(file.readUInt32LE(sectionHeaderLength), 1);

  const reader = createReadStream({ format: 'pcapng' });
  const packets = collect(reader);
  reader.end(file);

  const [pkt] = await packets;
  assert.equal(pkt.buffer.length, 61);
  assert.equal(pkt.linktype, 1);
});

test('Pcapng write: comments and packets without interface details', async () => {
  const writer = createWriteStream({ format: 'pcapng' });
  const written = collect(writer);

  const commented = new Packet({ buffer: ethernetFrame(60), iface: { linktype: 1, name: 'en0' }, comment: 'привет' });
  writer.write(commented);
  writer.write(new Packet({ buffer: ethernetFrame(60), iface: {} }));
  writer.end();

  const reader = createReadStream({ format: 'pcapng' });
  const packets = collect(reader);
  reader.end(Buffer.concat(await written));

  const [first, second] = await packets;
  assert.equal(first.comment, 'привет');
  assert.equal(first.iface.name, 'en0');
  assert.equal(second.buffer.length, 60);
});
