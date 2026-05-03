'use strict';

const { TimeStamp } = require('#lib/timestamp');

/*
 * Helpers for the pcapng `if_tsresol` option.
 *
 * The option is a single byte:
 *   bit 7  – set ⇒ 2^-(bits 0..6) seconds per tick
 *           clear ⇒ 10^-(bits 0..6) seconds per tick
 *
 * For a given interface this byte never changes, so we precompute
 * everything we'll need at parse/encode time once and stash it in a
 * `Tsresol` cache object. The reader fast path for power-of-ten
 * resolutions (μs, ns, ms — basically every real pcapng file) does long
 * division in Number land without ever touching BigInt: the quotient
 * (seconds since epoch) and remainder (sub-second ticks) both fit in 2^53
 * with room to spare. The unusual power-of-two resolutions go through a
 * BigInt fallback.
 */

const BIG_1E9   = 1000000000n;
const BIG_2_32  = 0x100000000n;
const BIG_LOMSK = 0xffffffffn;
const TWO16     = 0x10000;
const TWO32     = 0x100000000;
const DEFAULT_TSRESOL_BYTE = 0x06;

function build(rawByte) {
  const isPow2 = (rawByte & 0x80) !== 0;
  const exp    = rawByte & 0x7f;
  const ticksPerSec = isPow2 ? Math.pow(2, exp) : Math.pow(10, exp);
  const nsPerTick   = 1e9 / ticksPerSec;
  const fastPath    = !isPow2 && Number.isInteger(nsPerTick) && nsPerTick >= 1;
  return {
    rawByte,
    ticksPerSec,
    ticksPerSecBig: BigInt(Math.round(ticksPerSec)),
    nsPerTick,
    fastPath,
    raw: Buffer.from([rawByte, 0, 0, 0]),
  };
}

const DEFAULT = build(DEFAULT_TSRESOL_BYTE);

function fromBuffer(buf) {
  if (buf == null) return DEFAULT;
  const byte = typeof buf === 'string' ? buf.charCodeAt(0) : buf[0];
  return build(byte);
}

function toTimestamp(tsr, high, low) {
  if (tsr.fastPath) {
    const D = tsr.ticksPerSec;

    const q1 = Math.floor(high / D);
    let   r  = high - q1 * D;

    const lh = (low >>> 16);
    const ll = low & 0xffff;

    let   u  = r * TWO16 + lh;
    const q2 = Math.floor(u / D);
    r = u - q2 * D;

    let   v  = r * TWO16 + ll;
    const q3 = Math.floor(v / D);
    r = v - q3 * D;

    const sec = q1 * TWO32 + q2 * TWO16 + q3;
    const ns  = r * tsr.nsPerTick;

    const ts = new TimeStamp({ s: sec, ns });
    ts.tsresol = tsr.raw;
    return ts;
  }

  const T  = BigInt(high) * BIG_2_32 + BigInt(low);
  const ns = T * BIG_1E9 / tsr.ticksPerSecBig;
  const s  = Number(ns / BIG_1E9);
  const r  = Number(ns - BigInt(s) * BIG_1E9);
  const ts = new TimeStamp({ s, ns: r });
  ts.tsresol = tsr.raw;
  return ts;
}

function fromTimestamp(tsr, ts) {
  const value = ts.ns * tsr.ticksPerSecBig / BIG_1E9;
  return {
    timestamp_high: Number(value >> 32n),
    timestamp_low:  Number(value & BIG_LOMSK),
  };
}

/*
 * Legacy buffer-driven API kept around for the standalone Tsresol tests
 * and any external consumers. Internally it builds an ad-hoc cache for the
 * single call — fine for one-off use, would be wasteful per packet.
 */
function serialize(tsresolBuf, ts) {
  return fromTimestamp(fromBuffer(tsresolBuf), ts);
}

function parse(tsresolBuf, body) {
  return toTimestamp(fromBuffer(tsresolBuf), body.timestamp_high, body.timestamp_low);
}

module.exports = {
  DEFAULT,
  build,
  fromBuffer,
  toTimestamp,
  fromTimestamp,
  serialize,
  parse,
};
