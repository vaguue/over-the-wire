'use strict';

const { Transform } = require('stream');

const {
  ByteSource,
  Engine,
  struct,
  fields,
  u32,
  bytes,
  hasBytes,
  skip,
  push,
  emit,
  setEndian,
} = require('./parser');

const { TimeStamp } = require('#lib/timestamp');
const { Packet } = require('#lib/packet');
const defaults = require('#lib/defaults');

const Tsresol = require('./tsresol');

const { u16, u32: f_u32, i64le } = fields;

const SHB_BLOCK_TYPE = 0x0A0D0D0A;
const IDB_BLOCK_TYPE = 0x00000001;
const SPB_BLOCK_TYPE = 0x00000003;
const EPB_BLOCK_TYPE = 0x00000006;

const BYTE_ORDER_MAGIC      = 0x1A2B3C4D;
const BYTE_ORDER_MAGIC_SWAP = 0x4D3C2B1A;

const PCAP_NG_VERSION_MAJOR = 1;
const PCAP_NG_VERSION_MINOR = 0;

const APP_NAME = 'https://github.com/vaguue/over-the-wire';

/*
 * pcapng option codes (subset we actually act on; the rest of the OPT_*
 * namespace is exported through `constants` for the public API).
 */
const OPT_EOFOPT       = 0;
const OPT_COMMENT      = 1;
const OPT_SHB_HARDWARE = 2;
const OPT_SHB_OS       = 3;
const OPT_SHB_USERAPPL = 4;
const OPT_IF_NAME      = 2;
const OPT_IF_TSRESOL   = 9;
const OPT_EPB_FLAGS    = 2;
const OPT_EPB_HASH     = 3;
const OPT_EPB_DROPCOUNT = 4;

const constants = Object.freeze({
  OPT_EOFOPT,
  OPT_COMMENT,
  OPT_IF_NAME,
  OPT_IF_DESCRIPTION: 3,
  OPT_IF_IPV4ADDR:    4,
  OPT_IF_IPV6ADDR:    5,
  OPT_IF_MACADDR:     6,
  OPT_IF_EUIADDR:     7,
  OPT_IF_SPEED:       8,
  OPT_IF_TSRESOL,
  OPT_IF_TZONE:       10,
  OPT_IF_FILTER:      11,
  OPT_IF_OS:          12,
  OPT_IF_FCSLEN:      13,
  OPT_IF_TSOFFSET:    14,
  OPT_SHB_HARDWARE,
  OPT_SHB_OS,
  OPT_SHB_USERAPPL,
  OPT_EPB_FLAGS,
  OPT_EPB_HASH,
  OPT_EPB_DROPCOUNT,
});


const BlockHeader = struct({
  block_type:   f_u32,
  total_length: f_u32,
});

const SHBBody = struct({
  byte_order_magic: f_u32,
  major_version:    u16,
  minor_version:    u16,
  section_length:   i64le,
});

const IDBBody = struct({
  linktype: u16,
  reserved: u16,
  snaplen:  f_u32,
});

const EPBBody = struct({
  interface_id:   f_u32,
  timestamp_high: f_u32,
  timestamp_low:  f_u32,
  caplen:         f_u32,
  len:            f_u32,
});

const SPBBody = struct({
  caplen: f_u32,
});

const OptionHeader = struct({
  option_code:   u16,
  option_length: u16,
});

const ALIGN = 4;
const alignUp = (n) => (n + ALIGN - 1) & ~(ALIGN - 1);

/* ------------------------------------------------------------------ reader */

function* readOptions(remaining) {
  const opts = [];
  while (remaining > 0) {
    const oh = yield OptionHeader;
    const padded = alignUp(oh.option_length);
    const buf = yield bytes(padded);
    opts.push({
      option_code:   oh.option_code,
      option_length: oh.option_length,
      buffer:        buf.toString(),
    });
    remaining -= OptionHeader.size + padded;
    if (oh.option_code === 0 && oh.option_length === 0) {
      if (remaining > 0) yield skip(remaining);
      break;
    }
  }
  return opts;
}

function* readSHB(ctx, totalLength) {
  const bodyLen = totalLength - BlockHeader.size - 4;
  const body = yield SHBBody;

  if (body.byte_order_magic === BYTE_ORDER_MAGIC_SWAP) {
    throw new Error('Big-endian pcapng files are not supported in this build');
  }
  if (body.byte_order_magic !== BYTE_ORDER_MAGIC) {
    throw new Error(`Invalid byte_order_magic: 0x${body.byte_order_magic.toString(16)}`);
  }

  const opts = yield* readOptions(bodyLen - SHBBody.size);

  const trailer = yield u32;
  if (trailer !== totalLength) {
    throw new Error(`SHB trailer mismatch: got ${trailer}, want ${totalLength}`);
  }

  yield emit('section-header', {
    byte_order_magic: body.byte_order_magic,
    major_version:    body.major_version,
    minor_version:    body.minor_version,
    section_length:   body.section_length,
    options:          opts,
  });

  ctx.interfaces.length = 0;
}

function* readIDB(ctx, totalLength) {
  const bodyLen = totalLength - BlockHeader.size - 4;
  const body = yield IDBBody;
  const opts = yield* readOptions(bodyLen - IDBBody.size);

  const trailer = yield u32;
  if (trailer !== totalLength) {
    throw new Error(`IDB trailer mismatch: got ${trailer}, want ${totalLength}`);
  }

  let tsresolBuf = null;
  let name = '';
  for (let i = 0; i < opts.length; i++) {
    const o = opts[i];
    if (o.option_code === OPT_IF_TSRESOL && tsresolBuf === null) tsresolBuf = o.buffer;
    else if (o.option_code === OPT_IF_NAME && name === '') name = o.buffer.replaceAll('\0', '');
  }

  ctx.interfaces.push({
    linktype: body.linktype,
    name,
    tsr: Tsresol.fromBuffer(tsresolBuf),
  });

  yield emit('interface-description', {
    linktype: body.linktype,
    reserved: body.reserved,
    snaplen:  body.snaplen,
    options:  opts,
  });
}

function* readEPB(ctx, totalLength) {
  const bodyLen = totalLength - BlockHeader.size - 4;
  const body = yield EPBBody;
  const padded = alignUp(body.caplen);
  const buf = yield bytes(padded);

  const optsLen = bodyLen - EPBBody.size - padded;
  const opts = optsLen > 0 ? yield* readOptions(optsLen) : [];

  const trailer = yield u32;
  if (trailer !== totalLength) {
    throw new Error(`EPB trailer mismatch: got ${trailer}, want ${totalLength}`);
  }

  const iface = ctx.interfaces[body.interface_id];
  let comment;
  if (opts.length > 0) {
    for (let i = 0; i < opts.length; i++) {
      if (opts[i].option_code === OPT_COMMENT) {
        comment = opts[i].buffer.split('\0')[0];
        break;
      }
    }
  }

  const tsr = iface ? iface.tsr : Tsresol.DEFAULT;
  const pkt = new Packet({
    iface: iface ? { linktype: iface.linktype, name: iface.name } : {},
    buffer: buf.subarray(0, body.caplen),
    timestamp: Tsresol.toTimestamp(tsr, body.timestamp_high, body.timestamp_low),
    ...(comment !== undefined && { comment }),
    ...(body.caplen !== body.len && { origLength: body.len }),
  });

  yield push(pkt);
}

function* readSPB(_ctx, totalLength) {
  const body = yield SPBBody;
  const padded = alignUp(body.caplen);
  const buf = yield bytes(padded);

  const trailer = yield u32;
  if (trailer !== totalLength) {
    throw new Error(`SPB trailer mismatch: got ${trailer}, want ${totalLength}`);
  }

  yield push(new Packet({
    buffer: buf.subarray(0, body.caplen),
    timestamp: TimeStamp.now(),
  }));
}

function* readUnknownBlock(_ctx, totalLength) {
  const bodyLen = totalLength - BlockHeader.size - 4;
  if (bodyLen > 0) yield skip(bodyLen);

  const trailer = yield u32;
  if (trailer !== totalLength) {
    throw new Error(`Unknown block trailer mismatch: got ${trailer}, want ${totalLength}`);
  }
}

function* parsePcapNG(ctx) {
  yield setEndian('LE');
  ctx.interfaces = [];

  while (yield hasBytes(BlockHeader.size)) {
    const hdr = yield BlockHeader;
    switch (hdr.block_type) {
      case SHB_BLOCK_TYPE: yield* readSHB(ctx, hdr.total_length); break;
      case IDB_BLOCK_TYPE: yield* readIDB(ctx, hdr.total_length); break;
      case EPB_BLOCK_TYPE: yield* readEPB(ctx, hdr.total_length); break;
      case SPB_BLOCK_TYPE: yield* readSPB(ctx, hdr.total_length); break;
      default:             yield* readUnknownBlock(ctx, hdr.total_length); break;
    }
  }
}

class PcapNGInputStream extends Transform {
  constructor(opts = {}) {
    super({ ...opts, objectMode: true });
    this.source = new ByteSource();
    this.engine = new Engine(parsePcapNG, this.source, this, { interfaces: [] });
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

/* ------------------------------------------------------------------ writer */

/*
 * Compute the wire size of a serialised options list. `option_length` is the
 * source of truth for each option's data size; the `buffer` field may be
 * larger (e.g. when read back from the parser, where padding is included).
 * An end-of-options terminator is added if the caller's list doesn't end
 * with one.
 */
function optionsWireSize(opts) {
  let len = 0;
  for (const o of opts) len += OptionHeader.size + alignUp(o.option_length);
  if (opts.length === 0) return 0;
  if (opts[opts.length - 1].option_code !== 0) len += OptionHeader.size;
  return len;
}

function encodeOptionsAt(buf, offset, opts) {
  for (const o of opts) {
    buf.writeUInt16LE(o.option_code, offset);   offset += 2;
    buf.writeUInt16LE(o.option_length, offset); offset += 2;
    if (o.option_length > 0) {
      const data = Buffer.isBuffer(o.buffer) ? o.buffer : Buffer.from(o.buffer);
      data.copy(buf, offset, 0, o.option_length);
      const padded = alignUp(o.option_length);
      if (padded > o.option_length) buf.fill(0, offset + o.option_length, offset + padded);
      offset += padded;
    }
  }
  if (opts.length > 0 && opts[opts.length - 1].option_code !== 0) {
    buf.writeUInt16LE(0, offset); offset += 2;
    buf.writeUInt16LE(0, offset); offset += 2;
  }
  return offset;
}

class PcapNGOutputStream extends Transform {
  constructor(opts = {}) {
    super({ ...opts, writableObjectMode: true });
    this.interfaces = [];
    this._writeSectionHeader();
  }

  _writeSectionHeader() {
    const opts = [{
      option_code:   OPT_SHB_USERAPPL,
      option_length: APP_NAME.length,
      buffer:        Buffer.from(APP_NAME),
    }];

    const optsLen = optionsWireSize(opts);
    const totalLen = BlockHeader.size + SHBBody.size + optsLen + 4;

    const buf = Buffer.allocUnsafe(totalLen);
    BlockHeader.encodeLE(buf, 0, { block_type: SHB_BLOCK_TYPE, total_length: totalLen });
    SHBBody.encodeLE(buf, BlockHeader.size, {
      byte_order_magic: BYTE_ORDER_MAGIC,
      major_version:    PCAP_NG_VERSION_MAJOR,
      minor_version:    PCAP_NG_VERSION_MINOR,
      section_length:   -1n,
    });
    const optsOff = BlockHeader.size + SHBBody.size;
    encodeOptionsAt(buf, optsOff, opts);
    buf.writeUInt32LE(totalLen, totalLen - 4);

    this.push(buf);
  }

  iface({ linktype, snaplen = defaults.snaplen, tsresol = null, name = null }) {
    const tsr = tsresol == null
      ? Tsresol.build(0x09)              // ns by default for new interfaces
      : Tsresol.fromBuffer(tsresol);

    const opts = [];
    if (name && name.length > 0) {
      opts.push({
        option_code:   OPT_IF_NAME,
        option_length: name.length,
        buffer:        Buffer.from(name),
      });
    }
    opts.push({
      option_code:   OPT_IF_TSRESOL,
      option_length: 1,
      buffer:        tsr.raw,
    });

    const optsLen = optionsWireSize(opts);
    const totalLen = BlockHeader.size + IDBBody.size + optsLen + 4;

    const buf = Buffer.allocUnsafe(totalLen);
    BlockHeader.encodeLE(buf, 0, { block_type: IDB_BLOCK_TYPE, total_length: totalLen });
    IDBBody.encodeLE(buf, BlockHeader.size, { linktype, reserved: 0, snaplen });
    encodeOptionsAt(buf, BlockHeader.size + IDBBody.size, opts);
    buf.writeUInt32LE(totalLen, totalLen - 4);

    this.push(buf);

    this.interfaces.push({ linktype, snaplen, name, tsr });
    return this.interfaces.length - 1;
  }

  _findIfaceIndex(iface) {
    for (let i = 0; i < this.interfaces.length; i++) {
      const e = this.interfaces[i];
      if (e.linktype !== iface.linktype) continue;
      if (iface.name && e.name && iface.name !== e.name) continue;
      return i;
    }
    return -1;
  }

  enhancedPacket(pkt) {
    const buffer = pkt.buffer;
    if (!buffer) throw new Error('Expected EnhancedPacket to have buffer property');
    if (!pkt.iface) throw new Error('Expected EnhancedPacket to have iface property');

    let interface_id = this._findIfaceIndex(pkt.iface);
    if (interface_id === -1) {
      interface_id = this.iface({
        ...pkt.iface,
        ...(pkt.timestamp.tsresol && { tsresol: pkt.timestamp.tsresol }),
      });
    }

    const tsr = this.interfaces[interface_id].tsr;
    const { timestamp_high, timestamp_low } = Tsresol.fromTimestamp(tsr, pkt.timestamp);

    const opts = [];
    if (pkt.comment) {
      opts.push({
        option_code:   OPT_COMMENT,
        option_length: pkt.comment.length,
        buffer:        Buffer.from(pkt.comment),
      });
    }

    const padded   = alignUp(buffer.length);
    const optsLen  = optionsWireSize(opts);
    const totalLen = BlockHeader.size + EPBBody.size + padded + optsLen + 4;

    /*
     * Header (block header + EPB body) is small and gets allocated fresh
     * every packet; the body buffer is pushed by reference (no memcpy);
     * trailer/options ride along in a small tail buffer.
     */
    const headSize = BlockHeader.size + EPBBody.size;
    const head = Buffer.allocUnsafe(headSize);
    BlockHeader.encodeLE(head, 0, { block_type: EPB_BLOCK_TYPE, total_length: totalLen });
    EPBBody.encodeLE(head, BlockHeader.size, {
      interface_id,
      timestamp_high,
      timestamp_low,
      caplen: buffer.length,
      len:    pkt.origLength ?? buffer.length,
    });
    this.push(head);
    this.push(buffer);

    const tailLen = (padded - buffer.length) + optsLen + 4;
    const tail = Buffer.allocUnsafe(tailLen);
    let off = 0;
    if (padded > buffer.length) {
      tail.fill(0, 0, padded - buffer.length);
      off = padded - buffer.length;
    }
    off = encodeOptionsAt(tail, off, opts);
    tail.writeUInt32LE(totalLen, off);
    this.push(tail);
  }

  simplePacket(buffer) {
    const padded   = alignUp(buffer.length);
    const totalLen = BlockHeader.size + SPBBody.size + padded + 4;

    const headSize = BlockHeader.size + SPBBody.size;
    const head = Buffer.allocUnsafe(headSize);
    BlockHeader.encodeLE(head, 0, { block_type: SPB_BLOCK_TYPE, total_length: totalLen });
    SPBBody.encodeLE(head, BlockHeader.size, { caplen: buffer.length });
    this.push(head);
    this.push(buffer);

    const tailLen = (padded - buffer.length) + 4;
    const tail = Buffer.allocUnsafe(tailLen);
    if (padded > buffer.length) tail.fill(0, 0, padded - buffer.length);
    tail.writeUInt32LE(totalLen, tailLen - 4);
    this.push(tail);
  }

  _transform(chunk, _enc, cb) {
    try {
      if (Buffer.isBuffer(chunk)) {
        this.simplePacket(chunk);
      } else if (chunk instanceof Packet) {
        this.enhancedPacket(chunk);
      } else {
        throw new Error(`Invalid argument: ${chunk}`);
      }
    } catch (err) {
      return cb(err);
    }
    cb();
  }
}

module.exports = { PcapNGInputStream, PcapNGOutputStream, constants };
