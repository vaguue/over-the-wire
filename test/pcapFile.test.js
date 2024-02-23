const { strict: assert } = require('node:assert');
const test = require('node:test');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const { pipeline } = require('node:stream/promises');
const { createHash } = require('node:crypto');

const { createReadStream, createWriteStream } = require('#lib/pcapFile/index');
const { Packet } = require('#lib/packet');
const { fromNumber } = require('#lib/buffer');
const { omit } = require('#lib/pick');

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
    hash.write(fromNumber(pkt.timestamp.ms));
    if (pkt.comment) {
      hash.write(Buffer.from(pkt.comment));
    }
  };

  const dumpIdb = (hash, idb) => {
    hash.write(fromNumber(idb.linktype));
  }

  pcapIn.on('interface-description', hdr => dumpIdb(origHash, hdr));
  pcapInAfter.on('interface-description', hdr => dumpIdb(resultHash, hdr));

  const orig = [];
  const result = [];

  await pipeline(
    input,
    pcapIn,
    async function*(source) {
      for await (const pkt of source) {
        orig.push(pkt);
        dumpPacket(origHash, pkt);
        yield pkt;
      }
    },
    pcapOut,
    pcapInAfter,
    async function*(source) {
      for await (const pkt of source) {
        result.push(pkt);
        dumpPacket(resultHash, pkt);
      }
    },
  );

  console.log(orig.length, result.length);
  for (let i = 0; i < result.length; ++i) {
    if (!orig[i].equals(result[i])) {
      //console.log('here', orig[i], result[i]);
    }
  }

  origHash.end();
  resultHash.end();

  assert.equal(origHash.digest('hex'), resultHash.digest('hex'));
});
