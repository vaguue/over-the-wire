'use strict';

/*
 * Pcap reader/writer microbenchmark.
 *
 * Generates a synthetic large pcap in /tmp by replicating the bytes of
 * test/data/example1.pcap many times, then runs both the legacy and new
 * implementations against it. Reports throughput in MB/s and Mpps and
 * peak RSS during each run.
 */

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { Readable, Writable } = require('node:stream');
const { pipeline } = require('node:stream/promises');

const legacy = require('./legacy/pcap');
const next   = require('../../lib/pcapFile/pcap');

const SAMPLE_PATH = path.resolve(__dirname, '../../test/data/example1.pcap');
const TARGET_BYTES = Number(process.env.BENCH_BYTES || 200 * 1024 * 1024); // 200 MiB
const CHUNK_SIZE   = Number(process.env.BENCH_CHUNK || 64 * 1024);          // 64 KiB
const RUNS         = Number(process.env.BENCH_RUNS || 3);

function buildSyntheticPcap() {
  const sample = fs.readFileSync(SAMPLE_PATH);
  const FILE_HDR_LEN = 24;
  const header = sample.subarray(0, FILE_HDR_LEN);
  const body = sample.subarray(FILE_HDR_LEN);
  const repeats = Math.max(1, Math.floor((TARGET_BYTES - FILE_HDR_LEN) / body.length));
  const pieces = [header];
  for (let i = 0; i < repeats; i++) pieces.push(body);
  const out = Buffer.concat(pieces);
  return { buffer: out, sampleBytes: sample.length, repeats };
}

function chunked(buffer, size) {
  const out = [];
  for (let off = 0; off < buffer.length; off += size) {
    out.push(buffer.subarray(off, Math.min(buffer.length, off + size)));
  }
  return out;
}

class CountingSink extends Writable {
  constructor() {
    super({ objectMode: true });
    this.count = 0;
  }
  _write(_pkt, _enc, cb) {
    this.count++;
    cb();
  }
}

class CountingByteSink extends Writable {
  constructor() {
    super();
    this.bytes = 0;
  }
  _write(chunk, _enc, cb) {
    this.bytes += chunk.length;
    cb();
  }
}

async function timeReader(impl, chunks) {
  if (global.gc) global.gc();
  const before = process.memoryUsage().rss;
  const t0 = process.hrtime.bigint();

  const src = Readable.from(chunks, { objectMode: false });
  const reader = impl.PcapInputStream
    ? new impl.PcapInputStream()
    : impl.createReadStream();
  const sink = new CountingSink();

  await pipeline(src, reader, sink);

  const t1 = process.hrtime.bigint();
  const after = process.memoryUsage().rss;
  return {
    elapsedMs: Number(t1 - t0) / 1e6,
    rssDeltaMB: (after - before) / (1024 * 1024),
    packets: sink.count,
  };
}

async function timeWriter(readerImpl, writerImpl, chunks) {
  if (global.gc) global.gc();
  const before = process.memoryUsage().rss;
  const t0 = process.hrtime.bigint();

  const src = Readable.from(chunks, { objectMode: false });
  const reader = new readerImpl.PcapInputStream();
  const writer = new writerImpl.PcapOutputStream({ snaplen: 262144 });
  const sink = new CountingByteSink();

  await pipeline(src, reader, writer, sink);

  const t1 = process.hrtime.bigint();
  const after = process.memoryUsage().rss;
  return {
    elapsedMs: Number(t1 - t0) / 1e6,
    rssDeltaMB: (after - before) / (1024 * 1024),
    bytes: sink.bytes,
  };
}

async function preloadPackets(impl, chunks) {
  const src = Readable.from(chunks, { objectMode: false });
  const reader = new impl.PcapInputStream();
  const out = [];
  const sink = new Writable({
    objectMode: true,
    write(p, _e, cb) { out.push(p); cb(); },
  });
  await pipeline(src, reader, sink);
  return out;
}

async function timeWriterOnly(impl, packets) {
  if (global.gc) global.gc();
  const before = process.memoryUsage().rss;
  const t0 = process.hrtime.bigint();

  const src = Readable.from(packets, { objectMode: true });
  const writer = new impl.PcapOutputStream({ snaplen: 262144 });
  const sink = new CountingByteSink();

  await pipeline(src, writer, sink);

  const t1 = process.hrtime.bigint();
  const after = process.memoryUsage().rss;
  return {
    elapsedMs: Number(t1 - t0) / 1e6,
    rssDeltaMB: (after - before) / (1024 * 1024),
    bytes: sink.bytes,
    packets: packets.length,
  };
}

function fmtRate(bytes, ms) {
  return ((bytes / (ms / 1000)) / (1024 * 1024)).toFixed(1) + ' MiB/s';
}

function fmtMpps(packets, ms) {
  return (packets / (ms * 1000)).toFixed(2) + ' Mpps';
}

async function bestOf(label, runs, fn) {
  const results = [];
  for (let i = 0; i < runs; i++) {
    const r = await fn();
    results.push(r);
  }
  const best = results.reduce((a, b) => (a.elapsedMs <= b.elapsedMs ? a : b));
  return { label, runs: results, best };
}

(async () => {
  console.log('### Pcap parser/writer benchmark');
  const cpuModel = (os.cpus()[0] && os.cpus()[0].model) || 'unknown CPU';
  console.log(`node ${process.version}, ${os.platform()}/${os.arch()}, ${cpuModel}`);
  console.log(`runs=${RUNS}, chunk=${CHUNK_SIZE}, target=${(TARGET_BYTES / (1024 * 1024)).toFixed(0)} MiB\n`);

  console.log('Building synthetic pcap...');
  const { buffer, repeats } = buildSyntheticPcap();
  console.log(`  source: ${(buffer.length / (1024 * 1024)).toFixed(1)} MiB, repeats=${repeats}`);

  const chunks = chunked(buffer, CHUNK_SIZE);
  console.log(`  chunks: ${chunks.length} of ${CHUNK_SIZE} bytes\n`);

  // --- READER ---
  const legacyR = await bestOf('legacy reader', RUNS, () => timeReader(legacy, chunks));
  const nextR   = await bestOf('next   reader', RUNS, () => timeReader(next,   chunks));

  console.log('Reader:');
  for (const x of [legacyR, nextR]) {
    const b = x.best;
    console.log(
      `  ${x.label.padEnd(15)} `
      + `time=${b.elapsedMs.toFixed(1).padStart(7)} ms `
      + `rate=${fmtRate(buffer.length, b.elapsedMs).padStart(11)} `
      + `pps=${fmtMpps(b.packets, b.elapsedMs).padStart(10)} `
      + `pkts=${b.packets} `
      + `rssΔ=${b.rssDeltaMB.toFixed(1)} MB`
    );
  }
  console.log(`  speedup: ${(legacyR.best.elapsedMs / nextR.best.elapsedMs).toFixed(2)}x\n`);

  // --- ROUNDTRIP (reader → writer) ---
  const legacyW = await bestOf('legacy r+w   ', RUNS, () => timeWriter(legacy, legacy, chunks));
  const nextW   = await bestOf('next   r+w   ', RUNS, () => timeWriter(next,   next,   chunks));

  console.log('Reader+Writer roundtrip:');
  for (const x of [legacyW, nextW]) {
    const b = x.best;
    console.log(
      `  ${x.label.padEnd(15)} `
      + `time=${b.elapsedMs.toFixed(1).padStart(7)} ms `
      + `rate=${fmtRate(buffer.length, b.elapsedMs).padStart(11)} `
      + `out=${(b.bytes / (1024 * 1024)).toFixed(1)} MiB `
      + `rssΔ=${b.rssDeltaMB.toFixed(1)} MB`
    );
  }
  console.log(`  speedup: ${(legacyW.best.elapsedMs / nextW.best.elapsedMs).toFixed(2)}x\n`);

  // --- WRITER ONLY ---
  // Same Packet array fed to both writers.
  console.log('Pre-loading packets for isolated writer bench...');
  const packets = await preloadPackets(next, chunks);
  console.log(`  loaded ${packets.length} packets\n`);

  const legacyWO = await bestOf('legacy writer  ', RUNS, () => timeWriterOnly(legacy, packets));
  const nextWO   = await bestOf('next   writer  ', RUNS, () => timeWriterOnly(next,   packets));

  console.log('Writer (Packet objects → bytes):');
  for (const x of [legacyWO, nextWO]) {
    const b = x.best;
    console.log(
      `  ${x.label.padEnd(15)} `
      + `time=${b.elapsedMs.toFixed(1).padStart(7)} ms `
      + `rate=${fmtRate(b.bytes, b.elapsedMs).padStart(11)} `
      + `pps=${fmtMpps(b.packets, b.elapsedMs).padStart(10)} `
      + `rssΔ=${b.rssDeltaMB.toFixed(1)} MB`
    );
  }
  console.log(`  speedup: ${(legacyWO.best.elapsedMs / nextWO.best.elapsedMs).toFixed(2)}x\n`);
})();
