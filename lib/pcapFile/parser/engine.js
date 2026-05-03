'use strict';

const {
  READ_U8,
  READ_U16,
  READ_U32,
  READ_I32,
  READ_U32_LE,
  READ_BYTES,
  READ_STRUCT,
  SKIP,
  HAS_BYTES,
  SET_ENDIAN,
  PUSH,
  EMIT_EVENT,
  CONTEXT,
} = require('./ops');

/*
 * Cooperative driver for generator-based parsers.
 *
 * The engine pulls ops out of a sync generator and serves them from a
 * `ByteSource`. When data is short, the engine parks (remembers the pending
 * op) and returns control. The next `feed()` + `drive()` resumes from the
 * exact same yield point — generator state lives in the V8 frame.
 *
 * Backpressure: if `transform.push()` returns false, the engine parks until
 * the consumer reads, at which point the Transform's `_read` resumes us.
 */
class Engine {
  constructor(genFn, source, transform, ctx) {
    this.source = source;
    this.transform = transform;
    this.context = ctx;
    this.gen = genFn(ctx);
    this.midParse = true;
    this.eof = false;
    this.parkedBack = false;
    this.pending = null;
    this.lastResult = undefined;
  }

  drive() {
    const src = this.source;
    const gen = this.gen;
    let last = this.lastResult;

    for (;;) {
      let op;
      if (this.pending !== null) {
        op = this.pending;
        this.pending = null;
      } else {
        const r = gen.next(last);
        if (r.done) {
          this.midParse = false;
          this.lastResult = undefined;
          return;
        }
        op = r.value;
      }

      switch (op.tag) {
        case READ_U32: {
          if (src.available < 4) {
            if (this.eof) throw makeTruncated(src, 'u32');
            this.pending = op;
            this.lastResult = last;
            return;
          }
          last = src.readU32();
          break;
        }
        case READ_U16: {
          if (src.available < 2) {
            if (this.eof) throw makeTruncated(src, 'u16');
            this.pending = op;
            this.lastResult = last;
            return;
          }
          last = src.readU16();
          break;
        }
        case READ_U8: {
          if (src.available < 1) {
            if (this.eof) throw makeTruncated(src, 'u8');
            this.pending = op;
            this.lastResult = last;
            return;
          }
          last = src.readU8();
          break;
        }
        case READ_I32: {
          if (src.available < 4) {
            if (this.eof) throw makeTruncated(src, 'i32');
            this.pending = op;
            this.lastResult = last;
            return;
          }
          last = src.readI32();
          break;
        }
        case READ_U32_LE: {
          if (src.available < 4) {
            if (this.eof) throw makeTruncated(src, 'u32le');
            this.pending = op;
            this.lastResult = last;
            return;
          }
          last = src.readU32LE();
          break;
        }
        case READ_BYTES: {
          if (src.available < op.n) {
            if (this.eof) throw makeTruncated(src, `bytes(${op.n})`);
            this.pending = op;
            this.lastResult = last;
            return;
          }
          last = src.take(op.n);
          break;
        }
        case READ_STRUCT: {
          const n = op.size;
          if (src.available < n) {
            if (this.eof) throw makeTruncated(src, `struct(${n})`);
            this.pending = op;
            this.lastResult = last;
            return;
          }
          const buf = src.take(n);
          last = src.endian === 'LE' ? op.decodeLE(buf, 0) : op.decodeBE(buf, 0);
          break;
        }
        case SKIP: {
          if (src.available < op.n) {
            if (this.eof) throw makeTruncated(src, `skip(${op.n})`);
            this.pending = op;
            this.lastResult = last;
            return;
          }
          src.skip(op.n);
          last = undefined;
          break;
        }
        case HAS_BYTES: {
          if (src.available >= op.n) { last = true; break; }
          if (this.eof) { last = false; break; }
          this.pending = op;
          this.lastResult = last;
          return;
        }
        case SET_ENDIAN: {
          src.endian = op.e;
          last = undefined;
          break;
        }
        case PUSH: {
          if (!this.transform.push(op.value)) {
            this.parkedBack = true;
            this.lastResult = undefined;
            return;
          }
          last = undefined;
          break;
        }
        case EMIT_EVENT: {
          this.transform.emit(op.event, op.value);
          last = undefined;
          break;
        }
        case CONTEXT: {
          last = this.context;
          break;
        }
        default:
          throw new Error(`Unknown op tag: ${op && op.tag}`);
      }
    }
  }
}

function makeTruncated(src, what) {
  return new Error(`truncated input at byte ${src.consumed}: needed more for ${what}`);
}

module.exports = { Engine };
