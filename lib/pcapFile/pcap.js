'use strict';

const { Transform } = require('stream');

const {
  ByteSource,
  Engine,
  cstruct,
  u32le,
  setEndian,
  bytes,
  hasBytes,
  push,
  emit,
} = require('./parser');

const { TimeStamp } = require('#lib/timestamp');
const { Packet } = require('#lib/packet');
const defaults = require('#lib/defaults');

const BYTE_ORDER_MAGIC              = 0xA1B2C3D4;
const BYTE_ORDER_MAGIC_NANO         = 0xA1B23C4D;
const BYTE_ORDER_MAGIC_SWAPPED      = 0xD4C3B2A1;
const BYTE_ORDER_MAGIC_SWAPPED_NANO = 0x4D3CB2A1;

/*
 * The wire-level header is parsed in two halves: the magic comes first as
 * a forced little-endian 32-bit read, then the rest is decoded with the
 * endianness implied by the magic. `PcapFileHeaderFull` is the same shape
 * but used by the writer in one shot.
 */
const { PcapFileHeaderTail, PcapFileHeaderFull, PacketHeader } = cstruct(`
  //@LE
  struct __attribute__((__packed__)) PcapFileHeaderTail {
    uint16_t version_major;
    uint16_t version_minor;
    int32_t  thiszone;
    uint32_t sigfigs;
    uint32_t snaplen;
    uint32_t linktype;
  };

  //@LE
  struct __attribute__((__packed__)) PcapFileHeaderFull {
    uint32_t magic;
    uint16_t version_major;
    uint16_t version_minor;
    int32_t  thiszone;
    uint32_t sigfigs;
    uint32_t snaplen;
    uint32_t linktype;
  };

  //@LE
  struct __attribute__((__packed__)) PacketHeader {
    uint32_t tv_sec;
    uint32_t tv_usec;
    uint32_t caplen;
    uint32_t len;
  };
`);

function* parsePcap(ctx) {
  const magic = yield u32le;

  let endian, nano;
  switch (magic) {
    case BYTE_ORDER_MAGIC:              endian = 'LE'; nano = false; break;
    case BYTE_ORDER_MAGIC_NANO:         endian = 'LE'; nano = true;  break;
    case BYTE_ORDER_MAGIC_SWAPPED:      endian = 'BE'; nano = false; break;
    case BYTE_ORDER_MAGIC_SWAPPED_NANO: endian = 'BE'; nano = true;  break;
    default:
      throw new Error(`Unknown magic number: 0x${magic.toString(16)}`);
  }

  yield setEndian(endian);

  const tail = yield PcapFileHeaderTail;
  const hdr = {
    magic,
    version_major: tail.version_major,
    version_minor: tail.version_minor,
    thiszone:      tail.thiszone,
    sigfigs:       tail.sigfigs,
    snaplen:       tail.snaplen,
    linktype:      tail.linktype,
  };

  yield emit('header', hdr);

  ctx.linktype = hdr.linktype;
  ctx.timeUnit = nano ? 'ns' : 'ms';
  ctx.iface = { linktype: hdr.linktype };

  const iface = ctx.iface;
  const usingNs = nano;

  while (true) {
    const more = yield hasBytes(16);
    if (!more) return;

    const ph = yield PacketHeader;
    const buf = yield bytes(ph.caplen);

    const ts = usingNs
      ? new TimeStamp({ s: ph.tv_sec, ns: ph.tv_usec })
      : new TimeStamp({ s: ph.tv_sec, ms: ph.tv_usec });

    yield push(new Packet({
      buffer: buf,
      iface,
      timestamp: ts,
    }));
  }
}

class PcapInputStream extends Transform {
  constructor(opts = {}) {
    super({ ...opts, readableObjectMode: true });
    this.source = new ByteSource();
    const ctx = { linktype: null, timeUnit: 'ms', iface: null };
    this.engine = new Engine(parsePcap, this.source, this, ctx);
  }

  _transform(chunk, _enc, cb) {
    this.source.feed(chunk);
    try {
      this.engine.drive();
    } catch (err) {
      return cb(err);
    }
    cb();
  }

  _read(size) {
    if (this.engine.parkedBack) {
      this.engine.parkedBack = false;
      try {
        this.engine.drive();
      } catch (err) {
        this.destroy(err);
        return;
      }
    }
    return super._read(size);
  }

  _flush(cb) {
    this.engine.eof = true;
    try {
      this.engine.drive();
    } catch (err) {
      return cb(err);
    }
    cb();
  }
}

/*
 * Per-packet packet header is written into a fresh 16-byte Buffer rather
 * than into a shared FrameBuilder so that we can `push()` the body buffer
 * downstream without copying it. Two pushes per packet, zero body memcpy.
 */
const PKT_HDR_SIZE = PacketHeader.size;

class PcapOutputStream extends Transform {
  constructor({ timeUnit = 'ms', iface = null, snaplen = null, ...opts } = {}) {
    super({ ...opts, writableObjectMode: true });

    this.timeUnit = timeUnit;
    this.snaplen = snaplen ?? iface?.mtu ?? defaults.snaplen;
    this.linktype = iface?.linktype ?? defaults.linktype;
    this.hdrDone = false;
  }

  _writeHeader(chunk) {
    let snaplen, linktype;

    if (chunk instanceof Packet && chunk.iface) {
      snaplen = chunk.iface.mtu;
      linktype = chunk.iface.linktype;
    }

    snaplen = snaplen || this.snaplen;
    linktype = linktype ?? this.linktype;
    this.linktype = linktype;

    const buf = Buffer.allocUnsafe(PcapFileHeaderFull.size);
    PcapFileHeaderFull.encodeLE(buf, 0, {
      magic: this.timeUnit === 'ms' ? BYTE_ORDER_MAGIC : BYTE_ORDER_MAGIC_NANO,
      version_major: 2,
      version_minor: 4,
      thiszone: 0,
      sigfigs: 0,
      snaplen,
      linktype,
    });
    this.push(buf);

    this.hdrDone = true;
  }

  _transform(chunk, _enc, cb) {
    try {
      if (!this.hdrDone) this._writeHeader(chunk);

      let ts, buffer;
      if (Buffer.isBuffer(chunk)) {
        ts = TimeStamp.now(this.timeUnit);
        buffer = chunk;
      } else if (chunk instanceof Packet) {
        if (chunk.iface?.linktype !== this.linktype) {
          return cb(new Error(`Packet's linktype (${chunk.iface?.linktype}) does not match stream's (${this.linktype})`));
        }
        ts = chunk.timestamp;
        buffer = chunk.buffer;
      } else {
        return cb(new Error(`Invalid argument: ${chunk}`));
      }

      let tv_sec, tv_usec;
      if (this.timeUnit === 'ns') {
        const p = ts.packedIn({ s: true, ns: true });
        tv_sec = p.s; tv_usec = p.ns;
      } else {
        const p = ts.packedIn({ s: true, ms: true });
        tv_sec = p.s; tv_usec = p.ms;
      }

      const hdrBuf = Buffer.allocUnsafe(PKT_HDR_SIZE);
      PacketHeader.encodeLE(hdrBuf, 0, {
        tv_sec,
        tv_usec,
        caplen: buffer.length,
        len: buffer.length,
      });
      this.push(hdrBuf);
      this.push(buffer);
    } catch (err) {
      return cb(err);
    }
    cb();
  }
}

module.exports = { PcapInputStream, PcapOutputStream };
