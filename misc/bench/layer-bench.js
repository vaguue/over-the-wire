'use strict';

/*
 * Layer-level microbenchmark.
 *
 * Measures parse + build throughput for representative chains exercising
 * different parts of lib/layers/define.js:
 *   - Ethernet -> IPv4 -> TCP   (parse + build)        - byField dispatch
 *   - Ethernet -> IPv6 -> TCP   (parse + build)        - byField dispatch
 *   - Ethernet -> IPv4 -> UDP -> DNS (parse only)      - byPort dispatch
 *
 * Used to validate that the Monk-style refactor (lib/layers/define.js +
 * factory IIFEs across all 14 layers) keeps hot-path performance close
 * to the previous handwritten classes. Apple M-series baseline (n=300k,
 * runs=5, refactored vs legacy):
 *
 *   Parse Eth -> IPv4 -> TCP         ~1.51M / ~1.62M ops/s   (-7%)
 *   Parse Eth -> IPv6 -> TCP         ~1.61M / ~1.79M ops/s   (-10%)
 *   Parse Eth -> IPv4 -> UDP -> DNS  ~1.30M / ~1.37M ops/s   (-5%)
 *   Build Eth -> IPv4 -> Payload     ~212k  / ~227k  ops/s   (-7%)
 *   Build Eth -> IPv6 -> Payload     ~247k  / ~246k  ops/s   (parity)
 *
 * To re-derive the comparison:
 *   git stash push -- lib/layers
 *   node --expose-gc misc/bench/layer-bench.js     # baseline numbers
 *   git stash pop
 *   node --expose-gc misc/bench/layer-bench.js     # refactored numbers
 *
 * Usage:
 *   node --expose-gc misc/bench/layer-bench.js
 *   BENCH_PARSE_N=2000000 node --expose-gc misc/bench/layer-bench.js
 */

const os = require('node:os');
const defaults = require('#lib/defaults');
const { Packet } = require('#lib/packet');

const PARSE_N = Number(process.env.BENCH_PARSE_N || 500_000);
const BUILD_N = Number(process.env.BENCH_BUILD_N || 100_000);
const RUNS = Number(process.env.BENCH_RUNS || 5);

// --- Sample buffer construction ----------------------------------------

function makeIPv4TCPBuffer() {
  const eth = Buffer.from('aabbccddeeff112233445566' + '0800', 'hex');
  const ip = Buffer.alloc(20);
  ip.writeUInt8(0x45, 0);              // v=4, ihl=5
  ip.writeUInt16BE(40, 2);              // total length 20+20
  ip.writeUInt8(64, 8);                 // ttl
  ip.writeUInt8(6, 9);                  // protocol = TCP
  ip.writeUInt32BE(0x0a000001, 12);     // src
  ip.writeUInt32BE(0x0a000002, 16);     // dst
  const tcp = Buffer.alloc(20);
  tcp.writeUInt16BE(50000, 0);          // src port
  tcp.writeUInt16BE(443, 2);            // dst port
  tcp.writeUInt32BE(0xdeadbeef, 4);     // seq
  tcp.writeUInt32BE(0xcafebabe, 8);     // ack
  tcp.writeUInt8(0x50, 12);             // dataOffset=5
  tcp.writeUInt8(0x18, 13);             // flags PSH+ACK
  tcp.writeUInt16BE(65535, 14);         // window
  return Buffer.concat([eth, ip, tcp]);
}

function makeIPv4UDPDNSBuffer() {
  const eth = Buffer.from('aabbccddeeff112233445566' + '0800', 'hex');
  // Minimal DNS query for "example.com" type A.
  const qname = Buffer.from([7, 101, 120, 97, 109, 112, 108, 101, 3, 99, 111, 109, 0]);
  const dnsTail = Buffer.from([0, 1, 0, 1]); // qtype=A, qclass=IN
  const dnsHdr = Buffer.alloc(12);
  dnsHdr.writeUInt16BE(0x1234, 0);     // id
  dnsHdr.writeUInt16BE(0x0100, 2);     // flags: standard query
  dnsHdr.writeUInt16BE(1, 4);          // qdCount = 1
  const dns = Buffer.concat([dnsHdr, qname, dnsTail]);
  const udp = Buffer.alloc(8);
  udp.writeUInt16BE(50000, 0);
  udp.writeUInt16BE(53, 2);            // dst port = DNS
  udp.writeUInt16BE(8 + dns.length, 4);
  const ip = Buffer.alloc(20);
  ip.writeUInt8(0x45, 0);
  ip.writeUInt16BE(20 + 8 + dns.length, 2);
  ip.writeUInt8(64, 8);
  ip.writeUInt8(17, 9);                // protocol = UDP
  ip.writeUInt32BE(0x0a000001, 12);
  ip.writeUInt32BE(0x0a000002, 16);
  return Buffer.concat([eth, ip, udp, dns]);
}

function makeIPv6TCPBuffer() {
  const eth = Buffer.from('aabbccddeeff112233445566' + '86dd', 'hex');
  const ip = Buffer.alloc(40);
  ip.writeUInt32BE(0x60000000, 0);      // v=6, tc=0, fl=0
  ip.writeUInt16BE(20, 4);              // payload length = TCP header
  ip.writeUInt8(6, 6);                  // next header = TCP
  ip.writeUInt8(64, 7);                 // hop limit
  // src/dst left as zeroes
  const tcp = Buffer.alloc(20);
  tcp.writeUInt16BE(50000, 0);
  tcp.writeUInt16BE(443, 2);
  tcp.writeUInt32BE(0xdeadbeef, 4);
  tcp.writeUInt32BE(0xcafebabe, 8);
  tcp.writeUInt8(0x50, 12);
  tcp.writeUInt8(0x18, 13);
  tcp.writeUInt16BE(65535, 14);
  return Buffer.concat([eth, ip, tcp]);
}

// --- Timing utilities --------------------------------------------------

function hrnow() {
  return process.hrtime.bigint();
}

function elapsedMs(start) {
  return Number(hrnow() - start) / 1e6;
}

function bestOf(runs, fn) {
  const results = [];
  for (let i = 0; i < runs; i++) {
    if (global.gc) global.gc();
    results.push(fn());
  }
  return results.reduce((a, b) => (a.elapsedMs <= b.elapsedMs ? a : b));
}

// --- Workloads ---------------------------------------------------------

function parseChain(buf, n) {
  const t0 = hrnow();
  let acc = 0;
  for (let i = 0; i < n; i++) {
    const pkt = new Packet({ buffer: buf, iface: defaults });
    pkt.layers;
    acc += pkt.layers.Ethernet.type | 0;
  }
  const ms = elapsedMs(t0);
  return { elapsedMs: ms, opsPerSec: (n / ms) * 1000, sink: acc };
}

function parseDNSChain(buf, n) {
  // Exercises byPort dispatch (UDP -> DNS by port 53).
  const t0 = hrnow();
  let acc = 0;
  for (let i = 0; i < n; i++) {
    const pkt = new Packet({ buffer: buf, iface: defaults });
    pkt.layers;
    acc += pkt.layers.DNS.qdCount | 0;
  }
  const ms = elapsedMs(t0);
  return { elapsedMs: ms, opsPerSec: (n / ms) * 1000, sink: acc };
}

function buildIPv4Chain(n) {
  const t0 = hrnow();
  let acc = 0;
  for (let i = 0; i < n; i++) {
    const pkt = new Packet({ iface: defaults })
      .Ethernet({ src: 'aa:bb:cc:dd:ee:ff', dst: '11:22:33:44:55:66' })
      .IPv4({ src: '10.0.0.1', dst: '10.0.0.2', protocol: 6 })
      .Payload({ data: Buffer.from('hello world') });
    acc += pkt.buffer.length;
  }
  const ms = elapsedMs(t0);
  return { elapsedMs: ms, opsPerSec: (n / ms) * 1000, sink: acc };
}

function buildIPv6Chain(n) {
  const t0 = hrnow();
  let acc = 0;
  for (let i = 0; i < n; i++) {
    const pkt = new Packet({ iface: defaults })
      .Ethernet({ src: 'aa:bb:cc:dd:ee:ff', dst: '11:22:33:44:55:66' })
      .IPv6({ src: '2001:db8::1', dst: '2001:db8::2', nextHeader: 59 })
      .Payload({ data: Buffer.from('hello world') });
    acc += pkt.buffer.length;
  }
  const ms = elapsedMs(t0);
  return { elapsedMs: ms, opsPerSec: (n / ms) * 1000, sink: acc };
}

// --- Reporter ----------------------------------------------------------

function fmt(num, width = 14) {
  return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',').padStart(width, ' ');
}

function report(label, result, n) {
  console.log(
    `  ${label.padEnd(35)} ` +
    `time=${result.elapsedMs.toFixed(1).padStart(8)} ms ` +
    `ops/s=${fmt(result.opsPerSec)} ` +
    `(n=${n})`
  );
}

// --- Main --------------------------------------------------------------

(function main() {
  console.log('### Layer microbenchmark (parse + build)');
  const cpu = (os.cpus()[0] && os.cpus()[0].model) || 'unknown CPU';
  console.log(`node ${process.version}, ${os.platform()}/${os.arch()}, ${cpu}`);
  console.log(`runs=${RUNS}, parseN=${PARSE_N}, buildN=${BUILD_N}\n`);

  const ipv4Buf = makeIPv4TCPBuffer();
  const ipv6Buf = makeIPv6TCPBuffer();
  const dnsBuf = makeIPv4UDPDNSBuffer();

  // Warmup so V8 has its ICs settled before we measure.
  parseChain(ipv4Buf, 5_000);
  parseChain(ipv6Buf, 5_000);
  parseDNSChain(dnsBuf, 5_000);
  buildIPv4Chain(2_000);
  buildIPv6Chain(2_000);

  console.log('Parse hot path:');
  report(
    'Ethernet -> IPv4 -> TCP',
    bestOf(RUNS, () => parseChain(ipv4Buf, PARSE_N)),
    PARSE_N
  );
  report(
    'Ethernet -> IPv6 -> TCP',
    bestOf(RUNS, () => parseChain(ipv6Buf, PARSE_N)),
    PARSE_N
  );
  report(
    'Ethernet -> IPv4 -> UDP -> DNS',
    bestOf(RUNS, () => parseDNSChain(dnsBuf, PARSE_N)),
    PARSE_N
  );

  console.log('\nBuild path:');
  report(
    'Ethernet -> IPv4 -> Payload',
    bestOf(RUNS, () => buildIPv4Chain(BUILD_N)),
    BUILD_N
  );
  report(
    'Ethernet -> IPv6 -> Payload',
    bestOf(RUNS, () => buildIPv6Chain(BUILD_N)),
    BUILD_N
  );
})();
