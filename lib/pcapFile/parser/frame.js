'use strict';

/**
 * Growable scratch buffer used by writers to assemble a complete output
 * frame and push it downstream as a single chunk.
 */
class FrameBuilder {
  constructor(initialSize = 4096) {
    this.buf = Buffer.allocUnsafe(initialSize);
    this.off = 0;
    this.endian = 'LE';
  }

  ensure(n) {
    if (this.off + n <= this.buf.length) return;
    let newSize = this.buf.length * 2;
    while (newSize < this.off + n) newSize *= 2;
    const nb = Buffer.allocUnsafe(newSize);
    if (this.off > 0) this.buf.copy(nb, 0, 0, this.off);
    this.buf = nb;
  }

  u8(v) {
    this.ensure(1);
    this.buf[this.off++] = v & 0xff;
  }

  u16(v) {
    this.ensure(2);
    if (this.endian === 'LE') this.buf.writeUInt16LE((v >>> 0), this.off);
    else this.buf.writeUInt16BE((v >>> 0), this.off);
    this.off += 2;
  }

  u32(v) {
    this.ensure(4);
    if (this.endian === 'LE') this.buf.writeUInt32LE((v >>> 0), this.off);
    else this.buf.writeUInt32BE((v >>> 0), this.off);
    this.off += 4;
  }

  i32(v) {
    this.ensure(4);
    if (this.endian === 'LE') this.buf.writeInt32LE(v | 0, this.off);
    else this.buf.writeInt32BE(v | 0, this.off);
    this.off += 4;
  }

  raw(b) {
    if (b.length === 0) return;
    this.ensure(b.length);
    b.copy(this.buf, this.off);
    this.off += b.length;
  }

  zeros(n) {
    if (n <= 0) return;
    this.ensure(n);
    this.buf.fill(0, this.off, this.off + n);
    this.off += n;
  }

  /**
   * Returns the assembled frame and resets the builder. The returned Buffer
   * is a `subarray` of the internal buffer — safe to push downstream because
   * a fresh buffer is allocated for the next frame.
   */
  flush() {
    const out = this.off > 0
      ? this.buf.subarray(0, this.off)
      : Buffer.alloc(0);
    this.buf = Buffer.allocUnsafe(Math.max(4096, this.buf.length));
    this.off = 0;
    return out;
  }
}

module.exports = { FrameBuilder };
