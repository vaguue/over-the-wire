'use strict';

/*
 * PcapNG reader/writer microbenchmark — same shape as pcap-bench.js, but
 * synthesises a large pcapng by replicating example2.pcapng's bytes after
 * its initial Section/IDB blocks.
 */

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { Readable, Writable } = require('node:stream');
const { pipeline } = require('node:stream/promises');

const legacy = require('./pcapng.legacy');
const next   = require('../../lib/pcapFile/pcapng');

const SAMPLE_PATH = path.resolve(__dirname, '../../test/data/example2.pcapng');
const TARGET_BYTES = Number(process.env.BENCH_BYTES || 200 * 1024 * 1024);
const CHUNK_SIZE   = Number(process.env.BENCH_CHUNK || 64 * 1024);
const RUNS         = Number(process.env.BENCH_RUNS || 3);

/*
 * Build a synthetic pcapng of roughly TARGET_BYTES by replicating the
 * sample file's *block* stream. We keep one full copy as the prelude
 * (which contains SHB + IDBs + EPBs) and append the EPB-tail repeatedly.
 *
 * To keep things simple we just concat the entire sample file N times —
 * that produces multiple sections, which both readers handle.
 */
function buildSyntheticPcapng() {
  const sample = fs.readFileSync(SAMPLE_PATH);
  const repeats = Math.max(1, Math.floor(TARGET_BYTES / sample.length));
  const pieces = [];
  for (let i = 0; i < repeats; i++) pieces.push(sample);
  return { buffer: Buffer.concat(pieces), repeats };
}

function chunked(buffer, size) {
  const out = [];
  for (let off = 0; off < buffer.length; off += size) {
    out.push(buffer.subarray(off, Math.min(buffer.length, off + size)));
  }
  return out;
}

class CountingSink extends Writable {
  constructor() { super({ objectMode: true }); this.count = 0; }
  _write(_p, _e, cb) { this.count++; cb(); }
}

class CountingByteSink extends Writable {
  constructor() { super(); this.bytes = 0; }
  _write(c, _e, cb) { this.bytes += c.length; cb(); }
}

async function timeReader(impl, chunks) {
  if (global.gc) global.gc();
  const before = process.memoryUsage().rss;
  const t0 = process.hrtime.bigint();
  const reader = new impl.PcapNGInputStream();
  const sink = new CountingSink();
  await pipeline(Readable.from(chunks, { objectMode: false }), reader, sink);
  const t1 = process.hrtime.bigint();
  const after = process.memoryUsage().rss;
  return {
    elapsedMs: Number(t1 - t0) / 1e6,
    rssDeltaMB: (after - before) / (1024 * 1024),
    packets: sink.count,
  };
}

async function preloadPackets(impl, chunks) {
  const reader = new impl.PcapNGInputStream();
  const out = [];
  const sink = new Writable({
    objectMode: true,
    write(p, _e, cb) { out.push(p); cb(); },
  });
  await pipeline(Readable.from(chunks, { objectMode: false }), reader, sink);
  return out;
}

async function timeWriterOnly(impl, packets) {
  if (global.gc) global.gc();
  const before = process.memoryUsage().rss;
  const t0 = process.hrtime.bigint();
  const writer = new impl.PcapNGOutputStream();
  const sink = new CountingByteSink();
  await pipeline(Readable.from(packets, { objectMode: true }), writer, sink);
  const t1 = process.hrtime.bigint();
  const after = process.memoryUsage().rss;
  return {
    elapsedMs: Number(t1 - t0) / 1e6,
    rssDeltaMB: (after - before) / (1024 * 1024),
    bytes: sink.bytes,
    packets: packets.length,
  };
}

async function timeRoundtrip(readerImpl, writerImpl, chunks) {
  if (global.gc) global.gc();
  const before = process.memoryUsage().rss;
  const t0 = process.hrtime.bigint();
  const reader = new readerImpl.PcapNGInputStream();
  const writer = new writerImpl.PcapNGOutputStream();
  const sink = new CountingByteSink();
  await pipeline(Readable.from(chunks, { objectMode: false }), reader, writer, sink);
  const t1 = process.hrtime.bigint();
  const after = process.memoryUsage().rss;
  return {
    elapsedMs: Number(t1 - t0) / 1e6,
    rssDeltaMB: (after - before) / (1024 * 1024),
    bytes: sink.bytes,
  };
}

const fmtRate = (b, ms) => ((b / (ms / 1000)) / (1024 * 1024)).toFixed(1) + ' MiB/s';
const fmtMpps = (n, ms) => (n / (ms * 1000)).toFixed(2) + ' Mpps';

async function bestOf(label, runs, fn) {
  const arr = [];
  for (let i = 0; i < runs; i++) arr.push(await fn());
  return { label, best: arr.reduce((a, b) => (a.elapsedMs <= b.elapsedMs ? a : b)) };
}

(async () => {
  console.log('### PcapNG parser/writer benchmark');
  const cpuModel = (os.cpus()[0] && os.cpus()[0].model) || 'unknown CPU';
  console.log(`node ${process.version}, ${os.platform()}/${os.arch()}, ${cpuModel}`);
  console.log(`runs=${RUNS}, chunk=${CHUNK_SIZE}, target=${(TARGET_BYTES / (1024 * 1024)).toFixed(0)} MiB\n`);

  console.log('Building synthetic pcapng...');
  const { buffer, repeats } = buildSyntheticPcapng();
  console.log(`  source: ${(buffer.length / (1024 * 1024)).toFixed(1)} MiB, repeats=${repeats}`);
  const chunks = chunked(buffer, CHUNK_SIZE);
  console.log(`  chunks: ${chunks.length} of ${CHUNK_SIZE} bytes\n`);

  const lr = await bestOf('legacy reader  ', RUNS, () => timeReader(legacy, chunks));
  const nr = await bestOf('next   reader  ', RUNS, () => timeReader(next,   chunks));
  console.log('Reader:');
  for (const x of [lr, nr]) {
    const b = x.best;
    console.log(
      `  ${x.label} `
      + `time=${b.elapsedMs.toFixed(1).padStart(7)} ms `
      + `rate=${fmtRate(buffer.length, b.elapsedMs).padStart(11)} `
      + `pps=${fmtMpps(b.packets, b.elapsedMs).padStart(10)} `
      + `pkts=${b.packets} `
      + `rssΔ=${b.rssDeltaMB.toFixed(1)} MB`
    );
  }
  console.log(`  speedup: ${(lr.best.elapsedMs / nr.best.elapsedMs).toFixed(2)}x\n`);

  const lrt = await bestOf('legacy r+w     ', RUNS, () => timeRoundtrip(legacy, legacy, chunks));
  const nrt = await bestOf('next   r+w     ', RUNS, () => timeRoundtrip(next,   next,   chunks));
  console.log('Reader+Writer roundtrip:');
  for (const x of [lrt, nrt]) {
    const b = x.best;
    console.log(
      `  ${x.label} `
      + `time=${b.elapsedMs.toFixed(1).padStart(7)} ms `
      + `rate=${fmtRate(buffer.length, b.elapsedMs).padStart(11)} `
      + `out=${(b.bytes / (1024 * 1024)).toFixed(1)} MiB `
      + `rssΔ=${b.rssDeltaMB.toFixed(1)} MB`
    );
  }
  console.log(`  speedup: ${(lrt.best.elapsedMs / nrt.best.elapsedMs).toFixed(2)}x\n`);

  console.log('Pre-loading packets for isolated writer bench...');
  const packets = await preloadPackets(next, chunks);
  console.log(`  loaded ${packets.length} packets\n`);

  const lw = await bestOf('legacy writer  ', RUNS, () => timeWriterOnly(legacy, packets));
  const nw = await bestOf('next   writer  ', RUNS, () => timeWriterOnly(next,   packets));
  console.log('Writer (Packet objects → bytes):');
  for (const x of [lw, nw]) {
    const b = x.best;
    console.log(
      `  ${x.label} `
      + `time=${b.elapsedMs.toFixed(1).padStart(7)} ms `
      + `rate=${fmtRate(b.bytes, b.elapsedMs).padStart(11)} `
      + `pps=${fmtMpps(b.packets, b.elapsedMs).padStart(10)} `
      + `rssΔ=${b.rssDeltaMB.toFixed(1)} MB`
    );
  }
  console.log(`  speedup: ${(lw.best.elapsedMs / nw.best.elapsedMs).toFixed(2)}x\n`);
})();
