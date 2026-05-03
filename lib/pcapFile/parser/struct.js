'use strict';

const { READ_STRUCT } = require('./ops');

/*
 * Struct codegen.
 *
 * `struct({ field: type, ... })` returns an op-like descriptor that the
 * engine reads as a single block of bytes and then decodes via a
 * pre-compiled function. Two functions are generated, one for LE and one for
 * BE, picked at parse time based on the source's current endianness.
 *
 * Symmetric `encodeLE`/`encodeBE` are also generated for writers, plus a
 * convenience `write(frame, value)` that targets a FrameBuilder.
 */

const u8 = {
  size: 1,
  readLE:  (o) => `b[o+${o}]`,
  readBE:  (o) => `b[o+${o}]`,
  writeLE: (o, v) => `b[o+${o}]=(${v})&0xff`,
  writeBE: (o, v) => `b[o+${o}]=(${v})&0xff`,
};

const u16 = {
  size: 2,
  readLE:  (o) => `b.readUInt16LE(o+${o})`,
  readBE:  (o) => `b.readUInt16BE(o+${o})`,
  writeLE: (o, v) => `b.writeUInt16LE((${v})>>>0,o+${o})`,
  writeBE: (o, v) => `b.writeUInt16BE((${v})>>>0,o+${o})`,
};

const u32 = {
  size: 4,
  readLE:  (o) => `b.readUInt32LE(o+${o})`,
  readBE:  (o) => `b.readUInt32BE(o+${o})`,
  writeLE: (o, v) => `b.writeUInt32LE((${v})>>>0,o+${o})`,
  writeBE: (o, v) => `b.writeUInt32BE((${v})>>>0,o+${o})`,
};

const i32 = {
  size: 4,
  readLE:  (o) => `b.readInt32LE(o+${o})`,
  readBE:  (o) => `b.readInt32BE(o+${o})`,
  writeLE: (o, v) => `b.writeInt32LE((${v})|0,o+${o})`,
  writeBE: (o, v) => `b.writeInt32BE((${v})|0,o+${o})`,
};

const i64le = {
  size: 8,
  readLE:  (o) => `b.readBigInt64LE(o+${o})`,
  readBE:  (o) => `b.readBigInt64BE(o+${o})`,
  writeLE: (o, v) => `b.writeBigInt64LE(BigInt(${v}),o+${o})`,
  writeBE: (o, v) => `b.writeBigInt64BE(BigInt(${v}),o+${o})`,
};

function struct(fields) {
  const entries = Object.entries(fields);

  let size = 0;
  let readSrcLE = 'return {';
  let readSrcBE = 'return {';
  let writeSrcLE = '';
  let writeSrcBE = '';

  for (const [name, type] of entries) {
    const key = JSON.stringify(name);
    readSrcLE  += `${key}:${type.readLE(size)},`;
    readSrcBE  += `${key}:${type.readBE(size)},`;
    writeSrcLE += `${type.writeLE(size, `v[${key}]`)};`;
    writeSrcBE += `${type.writeBE(size, `v[${key}]`)};`;
    size += type.size;
  }

  readSrcLE += '}';
  readSrcBE += '}';

  const decodeLE = new Function('b', 'o', readSrcLE);
  const decodeBE = new Function('b', 'o', readSrcBE);
  const encodeLE = new Function('b', 'o', 'v', writeSrcLE);
  const encodeBE = new Function('b', 'o', 'v', writeSrcBE);

  return {
    tag: READ_STRUCT,
    size,
    decodeLE,
    decodeBE,
    encodeLE,
    encodeBE,
    write(frame, value) {
      frame.ensure(size);
      const enc = frame.endian === 'LE' ? encodeLE : encodeBE;
      enc(frame.buf, frame.off, value);
      frame.off += size;
    },
  };
}

module.exports = { struct, u8, u16, u32, i32, i64le };
