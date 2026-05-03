'use strict';

const EMPTY = Buffer.alloc(0);

/**
 * Streaming byte source.
 *
 * Holds an unbounded queue of incoming Buffer chunks plus a read cursor.
 * Tries to serve reads as zero-copy `subarray` from the head chunk; only
 * stitches a fresh Buffer when a value spans more than one chunk.
 *
 * Endianness is a single field on the source so that field decoders can
 * pick the right `readUIntXxLE/BE` without parameterising every primitive.
 */
class ByteSource {
  constructor() {
    this.queue = [];
    this.head = null;
    this.headOff = 0;
    this.available = 0;
    this.consumed = 0;
    this.endian = 'LE';
  }

  feed(chunk) {
    if (chunk === null || chunk.length === 0) return;
    if (this.head === null) {
      this.head = chunk;
      this.headOff = 0;
    } else {
      this.queue.push(chunk);
    }
    this.available += chunk.length;
  }

  ensure(n) {
    return this.available >= n;
  }

  _advanceHead() {
    if (this.head !== null && this.headOff >= this.head.length) {
      this.head = this.queue.length > 0 ? this.queue.shift() : null;
      this.headOff = 0;
    }
  }

  skip(n) {
    if (this.available < n) throw new RangeError('skip past available');
    this.available -= n;
    this.consumed += n;
    while (n > 0) {
      const left = this.head.length - this.headOff;
      if (left > n) {
        this.headOff += n;
        return;
      }
      n -= left;
      this.head = this.queue.length > 0 ? this.queue.shift() : null;
      this.headOff = 0;
    }
  }

  /**
   * Take exactly n bytes. Returns a Buffer view (zero-copy when possible).
   * Caller must have verified ensure(n) beforehand.
   */
  take(n) {
    if (n === 0) return EMPTY;
    const head = this.head;
    const off = this.headOff;
    const left = head.length - off;
    this.available -= n;
    this.consumed += n;

    if (left >= n) {
      const out = head.subarray(off, off + n);
      this.headOff = off + n;
      this._advanceHead();
      return out;
    }

    const out = Buffer.allocUnsafe(n);
    head.copy(out, 0, off, head.length);
    let written = left;
    this.head = this.queue.length > 0 ? this.queue.shift() : null;
    this.headOff = 0;

    while (written < n) {
      const cur = this.head;
      const need = n - written;
      if (cur.length <= need) {
        cur.copy(out, written);
        written += cur.length;
        this.head = this.queue.length > 0 ? this.queue.shift() : null;
        this.headOff = 0;
      } else {
        cur.copy(out, written, 0, need);
        this.headOff = need;
        written = n;
      }
    }

    return out;
  }

  /** Read a UInt8 with current endianness (endianness has no effect on u8). */
  readU8() {
    if (this.available < 1) throw new RangeError('readU8 past available');
    const v = this.head[this.headOff];
    this.headOff += 1;
    this.available -= 1;
    this.consumed += 1;
    this._advanceHead();
    return v;
  }

  readU16() {
    if (this.head.length - this.headOff >= 2) {
      const v = this.endian === 'LE'
        ? this.head.readUInt16LE(this.headOff)
        : this.head.readUInt16BE(this.headOff);
      this.headOff += 2;
      this.available -= 2;
      this.consumed += 2;
      this._advanceHead();
      return v;
    }
    const buf = this.take(2);
    return this.endian === 'LE' ? buf.readUInt16LE(0) : buf.readUInt16BE(0);
  }

  readU32() {
    if (this.head.length - this.headOff >= 4) {
      const v = this.endian === 'LE'
        ? this.head.readUInt32LE(this.headOff)
        : this.head.readUInt32BE(this.headOff);
      this.headOff += 4;
      this.available -= 4;
      this.consumed += 4;
      this._advanceHead();
      return v;
    }
    const buf = this.take(4);
    return this.endian === 'LE' ? buf.readUInt32LE(0) : buf.readUInt32BE(0);
  }

  readI32() {
    if (this.head.length - this.headOff >= 4) {
      const v = this.endian === 'LE'
        ? this.head.readInt32LE(this.headOff)
        : this.head.readInt32BE(this.headOff);
      this.headOff += 4;
      this.available -= 4;
      this.consumed += 4;
      this._advanceHead();
      return v;
    }
    const buf = this.take(4);
    return this.endian === 'LE' ? buf.readInt32LE(0) : buf.readInt32BE(0);
  }

  /** Forced LE u32 read regardless of current endianness — used for magic bytes. */
  readU32LE() {
    if (this.head.length - this.headOff >= 4) {
      const v = this.head.readUInt32LE(this.headOff);
      this.headOff += 4;
      this.available -= 4;
      this.consumed += 4;
      this._advanceHead();
      return v;
    }
    const buf = this.take(4);
    return buf.readUInt32LE(0);
  }
}

module.exports = { ByteSource };
