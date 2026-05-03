const { compile } = require('struct-compile');
const { OsiModelLayers } = require('./osi');
const { inetPton, inetNtop } = require('#lib/converters');
const { AF_INET, AF_INET6 } = require('#lib/socket');
const mixins = require('./mixins');
const { parseName, serializeName, nameLength } = require('./dnsLabel');

// DNS header bit layout (bytes 2-3, MSB->LSB on the wire):
//   QR(1) Opcode(4) AA(1) TC(1) RD(1) RA(1) Z(3) RCODE(4)
// struct-compile places the first declared field in the lowest bit, so the
// declarations below are reversed relative to the RFC layout.
const { DNSHeader } = compile(`
  //@NE
  struct DNSHeader {
    uint16_t id;
    uint16_t rcode:4, z:3, ra:1, rd:1, tc:1, aa:1, opcode:4, qr:1;
    uint16_t qdCount;
    uint16_t anCount;
    uint16_t nsCount;
    uint16_t arCount;
  } __attribute__(packed);
`);

const { length: baseLength } = DNSHeader.prototype.config;

const TYPE_A = 1;
const TYPE_NS = 2;
const TYPE_CNAME = 5;
const TYPE_PTR = 12;
const TYPE_MX = 15;
const TYPE_TXT = 16;
const TYPE_AAAA = 28;

function parseRdata(message, type, rdataOffset, rdlength) {
  const rdataBuf = message.slice(rdataOffset, rdataOffset + rdlength);
  switch (type) {
    case TYPE_A:
      return rdataBuf.length === 4 ? inetNtop(AF_INET, rdataBuf) : rdataBuf;
    case TYPE_AAAA:
      return rdataBuf.length === 16 ? inetNtop(AF_INET6, rdataBuf.subarray()) : rdataBuf;
    case TYPE_NS:
    case TYPE_CNAME:
    case TYPE_PTR:
      return parseName(message, rdataOffset).name;
    case TYPE_MX: {
      if (rdlength < 3) return rdataBuf;
      const preference = rdataBuf.readUInt16BE(0);
      const exchange = parseName(message, rdataOffset + 2).name;
      return { preference, exchange };
    }
    case TYPE_TXT: {
      const strs = [];
      let p = 0;
      while (p < rdataBuf.length) {
        const l = rdataBuf[p];
        p++;
        if (p + l > rdataBuf.length) break;
        strs.push(rdataBuf.slice(p, p + l).toString('ascii'));
        p += l;
      }
      return strs.length === 1 ? strs[0] : strs;
    }
    default:
      return rdataBuf;
  }
}

function serializeRdata(type, rdata) {
  switch (type) {
    case TYPE_A:
      return inetPton(AF_INET, rdata);
    case TYPE_AAAA:
      return inetPton(AF_INET6, rdata);
    case TYPE_NS:
    case TYPE_CNAME:
    case TYPE_PTR:
      return serializeName(rdata);
    case TYPE_MX: {
      const pref = Buffer.alloc(2);
      pref.writeUInt16BE(rdata.preference, 0);
      return Buffer.concat([pref, serializeName(rdata.exchange)]);
    }
    case TYPE_TXT: {
      const arr = Array.isArray(rdata) ? rdata : [rdata];
      const parts = [];
      for (const s of arr) {
        const b = Buffer.from(String(s), 'ascii');
        if (b.length > 255) throw new Error('DNS TXT: string too long');
        parts.push(Buffer.from([b.length]), b);
      }
      return Buffer.concat(parts);
    }
    default:
      return Buffer.isBuffer(rdata) ? rdata : Buffer.from(rdata ?? []);
  }
}

function serializeQuestion(q) {
  const name = serializeName(q.name);
  const tail = Buffer.alloc(4);
  tail.writeUInt16BE(q.type ?? TYPE_A, 0);
  tail.writeUInt16BE(q.class ?? 1, 2);
  return Buffer.concat([name, tail]);
}

function serializeRR(rr) {
  const name = serializeName(rr.name);
  const rdata = serializeRdata(rr.type, rr.rdata);
  const tail = Buffer.alloc(10);
  tail.writeUInt16BE(rr.type, 0);
  tail.writeUInt16BE(rr.class ?? 1, 2);
  tail.writeUInt32BE(rr.ttl ?? 0, 4);
  tail.writeUInt16BE(rdata.length, 8);
  return Buffer.concat([name, tail, rdata]);
}

function rrLength(rr) {
  return serializeRR(rr).length;
}

function questionLength(q) {
  return nameLength(q.name) + 4;
}

/**
 * Calculates the total serialized DNS message length for a given object,
 * with no name compression. Used by Packet._build via toAlloc.
 */
function calcLength(data) {
  let len = baseLength;
  for (const q of data.questions ?? []) len += questionLength(q);
  for (const rr of data.answers ?? []) len += rrLength(rr);
  for (const rr of data.authority ?? []) len += rrLength(rr);
  for (const rr of data.additional ?? []) len += rrLength(rr);
  return len;
}

/**
 * DNS protocol layer (RFC 1035) - read-write with one important caveat:
 * write-side name compression is not implemented in v1. Built buffers will
 * therefore be longer than typical wireshark-captured frames, but parse-side
 * compression (resolving 0xC0xx pointers) is fully supported.
 *
 * Supported RR types with structured rdata: A, AAAA, NS, CNAME, PTR, MX, TXT.
 * Other types expose `rdata` as a raw Buffer.
 *
 * @class
 * @implements {Layer}
 * @property {number} id - Transaction identifier.
 * @property {number} qr - Query/response flag (0 = query, 1 = response).
 * @property {number} opcode - 4-bit query opcode.
 * @property {number} aa - Authoritative answer flag.
 * @property {number} tc - Truncation flag.
 * @property {number} rd - Recursion desired flag.
 * @property {number} ra - Recursion available flag.
 * @property {number} rcode - 4-bit response code.
 * @property {number} qdCount - Number of questions.
 * @property {number} anCount - Number of answers.
 * @property {number} nsCount - Number of authority records.
 * @property {number} arCount - Number of additional records.
 */
class DNS extends DNSHeader {
  name = 'DNS';

  /**
   * @param {Buffer|Object} data - Input buffer or object with protocol fields.
   * @param {Object} opts - Options for the layer.
   */
  constructor(data = {}, opts = {}) {
    if (Buffer.isBuffer(data)) {
      super(data);
    }
    else {
      super(Buffer.alloc(DNS.toAlloc(data)));
      this.merge(data);
    }
    mixins.ctor(this, data, opts);

    this.length = opts.allocated ?? this._buf.length;
  }

  static toAlloc = (data) => calcLength(data);

  static osi = OsiModelLayers.Application;
  osi = OsiModelLayers.Application;

  // Sections are parsed lazily on each access so the underlying buffer
  // remains the source of truth.
  get questions() {
    return this._parseSection(0, this.qdCount, 'q').items;
  }

  get answers() {
    const q = this._parseSection(0, this.qdCount, 'q');
    return this._parseSection(q.next, this.anCount, 'rr').items;
  }

  get authority() {
    const q = this._parseSection(0, this.qdCount, 'q');
    const an = this._parseSection(q.next, this.anCount, 'rr');
    return this._parseSection(an.next, this.nsCount, 'rr').items;
  }

  get additional() {
    const q = this._parseSection(0, this.qdCount, 'q');
    const an = this._parseSection(q.next, this.anCount, 'rr');
    const ns = this._parseSection(an.next, this.nsCount, 'rr');
    return this._parseSection(ns.next, this.arCount, 'rr').items;
  }

  // Walk `count` entries starting at `bodyOffset` (relative to body start, i.e.
  // baseLength bytes after the buffer start). Used by all section getters.
  _parseSection(bodyOffset, count, kind) {
    const message = this._buf;
    const items = [];
    let cur = baseLength + bodyOffset;
    for (let i = 0; i < count; i++) {
      if (kind === 'q') {
        const { name, next } = parseName(message, cur);
        if (next + 4 > message.length) throw new Error('DNS: question truncated');
        items.push({
          name,
          type: message.readUInt16BE(next),
          class: message.readUInt16BE(next + 2),
        });
        cur = next + 4;
      }
      else {
        const { name, next: afterName } = parseName(message, cur);
        if (afterName + 10 > message.length) throw new Error('DNS: RR header truncated');
        const type = message.readUInt16BE(afterName);
        const cls = message.readUInt16BE(afterName + 2);
        const ttl = message.readUInt32BE(afterName + 4);
        const rdlength = message.readUInt16BE(afterName + 8);
        const rdataOffset = afterName + 10;
        if (rdataOffset + rdlength > message.length) throw new Error('DNS: RR data truncated');
        items.push({
          name,
          type,
          class: cls,
          ttl,
          rdata: parseRdata(message, type, rdataOffset, rdlength),
        });
        cur = rdataOffset + rdlength;
      }
    }
    return { items, next: cur - baseLength };
  }

  // The struct-compile merge handles header fields. We then serialize sections
  // (no compression) into the body.
  merge(data) {
    if (data == null) return;
    if (Buffer.isBuffer(data)) {
      super.merge(data);
      return;
    }

    const stripped = { ...data };
    delete stripped.questions;
    delete stripped.answers;
    delete stripped.authority;
    delete stripped.additional;
    super.merge(stripped);

    if (data.questions) this.qdCount = data.questions.length;
    if (data.answers) this.anCount = data.answers.length;
    if (data.authority) this.nsCount = data.authority.length;
    if (data.additional) this.arCount = data.additional.length;

    let cursor = baseLength;
    for (const q of data.questions ?? []) {
      const buf = serializeQuestion(q);
      buf.copy(this._buf, cursor);
      cursor += buf.length;
    }
    for (const rr of data.answers ?? []) {
      const buf = serializeRR(rr);
      buf.copy(this._buf, cursor);
      cursor += buf.length;
    }
    for (const rr of data.authority ?? []) {
      const buf = serializeRR(rr);
      buf.copy(this._buf, cursor);
      cursor += buf.length;
    }
    for (const rr of data.additional ?? []) {
      const buf = serializeRR(rr);
      buf.copy(this._buf, cursor);
      cursor += buf.length;
    }
  }

  toObject() {
    return {
      ...super.toObject(),
      questions: this.questions,
      answers: this.answers,
      authority: this.authority,
      additional: this.additional,
    };
  }

  defaults(obj = {}, layers) {
    if (obj.qr === undefined) this.qr = 0;
    if (obj.opcode === undefined) this.opcode = 0;
  }

  nextProto(layers) {
    return null;
  }
};

DNS.TYPES = {
  A: TYPE_A,
  NS: TYPE_NS,
  CNAME: TYPE_CNAME,
  PTR: TYPE_PTR,
  MX: TYPE_MX,
  TXT: TYPE_TXT,
  AAAA: TYPE_AAAA,
};

module.exports = { DNS };
