const { strict: assert } = require('node:assert');
const test = require('node:test');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const { pipeline } = require('node:stream/promises');
const { createHash } = require('node:crypto');

const { createReadStream, createWriteStream } = require('#lib/pcapFile/index');
const { Packet } = require('#lib/packet');

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
