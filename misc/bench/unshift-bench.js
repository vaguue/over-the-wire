import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable, Writable, PassThrough } from 'node:stream';
import { pipeline } from 'node:stream/promises';

import { PcapInputStream } from '#lib/pcapFile/pcap';
import { TimeStamp } from '#lib/timestamp';
import { Packet } from '#lib/packet';

const PACKAGE_ROOT = path.dirname(fileURLToPath(import.meta.resolve('over-the-wire/package.json')));
const SAMPLE_PATH = path.join(PACKAGE_ROOT, 'test', 'data', 'example1.pcap');
const BYTES_PER_MIB = 1024 * 1024;

const FILE_HEADER_LENGTH = 24;
const PACKET_HEADER_LENGTH = 16;
const NANOSECONDS_PER_MICROSECOND = 1000;
const EMPTY = Buffer.alloc(0);

const MAGICS = {
  0xA1B2C3D4: { littleEndian: true, nanoseconds: false },
  0xA1B23C4D: { littleEndian: true, nanoseconds: true },
  0xD4C3B2A1: { littleEndian: false, nanoseconds: false },
  0x4D3CB2A1: { littleEndian: false, nanoseconds: true },
};

class PcapUnshiftInputStream extends Readable {
  constructor(source) {
    super({ objectMode: true });

    this.source = source;
    this.format = null;
    this.iface = null;
    this.sourceEnded = false;
    this.consumed = 0;

    source.on('readable', () => {
      this.parse();
    });

    source.on('end', () => {
      this.sourceEnded = true;
      this.push(null);
    });

    source.on('error', (err) => {
      this.destroy(err);
    });
  }

  _read() {
    this.parse();
  }

  takeExactly(length) {
    const taken = this.source.read(length);

    if (taken === null) {
      return null;
    }

    if (taken.length < length) {
      throw new Error(`truncated input at byte ${this.consumed}: needed ${length} bytes, the stream ended with ${taken.length}`);
    }

    this.consumed += length;
    return taken;
  }

  giveBack(taken) {
    this.consumed -= taken.length;
    this.source.unshift(taken);
  }

  readUInt32(buffer, offset) {
    return this.format.littleEndian ? buffer.readUInt32LE(offset) : buffer.readUInt32BE(offset);
  }

  parseFileHeader() {
    const header = this.takeExactly(FILE_HEADER_LENGTH);

    if (header === null) {
      return false;
    }

    const magic = header.readUInt32LE(0);
    this.format = MAGICS[magic];

    if (this.format === undefined) {
      throw new Error(`Unknown magic number: 0x${magic.toString(16)}`);
    }

    this.iface = { linktype: this.readUInt32(header, 20) };
    return true;
  }

  parsePackets() {
    for (;;) {
      const header = this.takeExactly(PACKET_HEADER_LENGTH);

      if (header === null) {
        return;
      }

      const capturedLength = this.readUInt32(header, 8);
      const body = capturedLength === 0 ? EMPTY : this.takeExactly(capturedLength);

      if (body === null) {
        this.giveBack(header);
        return;
      }

      const seconds = this.readUInt32(header, 0);
      const fraction = this.readUInt32(header, 4);

      const consumerKeepsUp = this.push(new Packet({
        buffer: body,
        iface: this.iface,
        timestamp: new TimeStamp({ s: seconds, ns: this.format.nanoseconds ? fraction : fraction * NANOSECONDS_PER_MICROSECOND }),
      }));

      if (!consumerKeepsUp) {
        return;
      }
    }
  }

  parse() {
    if (this.sourceEnded || this.destroyed) {
      return;
    }

    try {
      if (this.format === null && !this.parseFileHeader()) {
        return;
      }

      this.parsePackets();
    }
    catch (err) {
      this.destroy(err);
    }
  }
}


const TARGET_BYTES = Number(process.env.BENCH_BYTES ?? 64 * BYTES_PER_MIB);
const RUNS = Number(process.env.BENCH_RUNS ?? 3);
const CHUNK_SIZES = (process.env.BENCH_CHUNKS ?? '65536,1500,64').split(',').map(Number);
const SMALL_CHUNK = 1024;
const SMALL_CHUNK_SHARE = 16;

const syntheticCapture = (targetBytes) => {
  const sample = fs.readFileSync(SAMPLE_PATH);
  const header = sample.subarray(0, FILE_HEADER_LENGTH);
  const body = sample.subarray(FILE_HEADER_LENGTH);
  const repeats = Math.max(1, Math.floor((targetBytes - FILE_HEADER_LENGTH) / body.length));

  return Buffer.concat([header, ...Array.from({ length: repeats }, () => body)]);
};

const inChunksOf = (buffer, size) => {
  const chunks = [];

  for (let offset = 0; offset < buffer.length; offset += size) {
    chunks.push(buffer.subarray(offset, Math.min(buffer.length, offset + size)));
  }

  return chunks;
};

const countingSink = () => {
  const sink = new Writable({
    objectMode: true,
    write(packet, encoding, callback) {
      sink.packets++;
      callback();
    },
  });

  sink.packets = 0;
  return sink;
};

const readers = {
  'engine (current)': async (chunks) => {
    const sink = countingSink();
    await pipeline(Readable.from(chunks, { objectMode: false }), new PcapInputStream(), sink);
    return sink.packets;
  },
  'read(n) + unshift, wrapping the source': async (chunks) => {
    const sink = countingSink();
    await pipeline(new PcapUnshiftInputStream(Readable.from(chunks, { objectMode: false })), sink);
    return sink.packets;
  },
  'read(n) + unshift, piped into': async (chunks) => {
    const sink = countingSink();
    const piped = Readable.from(chunks, { objectMode: false }).pipe(new PassThrough());
    await pipeline(new PcapUnshiftInputStream(piped), sink);
    return sink.packets;
  },
};

const bestOf = async (read, chunks) => {
  let best = null;

  for (let run = 0; run < RUNS; run++) {
    if (global.gc) {
      global.gc();
    }

    const startedAt = process.hrtime.bigint();
    const packets = await read(chunks);
    const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1e6;

    if (best === null || elapsedMs < best.elapsedMs) {
      best = { elapsedMs, packets };
    }
  }

  return best;
};

console.log(`node ${process.version}, ${os.platform()}/${os.arch()}, ${os.cpus()[0]?.model ?? 'unknown CPU'}`);
console.log(`best of ${RUNS} runs\n`);

for (const chunkSize of CHUNK_SIZES) {
  const capture = syntheticCapture(chunkSize < SMALL_CHUNK ? TARGET_BYTES / SMALL_CHUNK_SHARE : TARGET_BYTES);
  const chunks = inChunksOf(capture, chunkSize);

  console.log(`chunks of ${chunkSize} bytes, capture of ${(capture.length / BYTES_PER_MIB).toFixed(0)} MiB`);

  for (const [name, read] of Object.entries(readers)) {
    const { elapsedMs, packets } = await bestOf(read, chunks);
    const rate = capture.length / BYTES_PER_MIB / (elapsedMs / 1000);

    console.log(`  ${name.padEnd(40)} ${elapsedMs.toFixed(1).padStart(8)} ms  ${rate.toFixed(1).padStart(8)} MiB/s  ${(packets / elapsedMs / 1000).toFixed(2).padStart(6)} Mpps  ${packets} packets`);
  }

  console.log('');
}
