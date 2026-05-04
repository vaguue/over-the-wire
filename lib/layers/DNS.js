const { OsiModelLayers } = require('./osi');
const { inetPton, inetNtop } = require('#lib/converters');
const { AF_INET, AF_INET6 } = require('#lib/socket');
const { parseName, serializeName, nameLength } = require('./dnsLabel');
const { makeLayer, attach } = require('./define');

const TYPE_A = 1;
const TYPE_NS = 2;
const TYPE_CNAME = 5;
const TYPE_PTR = 12;
const TYPE_MX = 15;
const TYPE_TXT = 16;
const TYPE_AAAA = 28;
const TYPE_SRV = 33;
const TYPE_OPT = 41;

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
    case TYPE_SRV: {
      if (rdlength < 7) return rdataBuf;
      const priority = rdataBuf.readUInt16BE(0);
      const weight = rdataBuf.readUInt16BE(2);
      const port = rdataBuf.readUInt16BE(4);
      const target = parseName(message, rdataOffset + 6).name;
      return { priority, weight, port, target };
    }
    case TYPE_OPT: {
      // RFC 6891 sec 6.1.2 - OPT RDATA is a stream of {option-code, option-length, option-data}.
      const opts = [];
      let p = 0;
      while (p + 4 <= rdataBuf.length) {
        const code = rdataBuf.readUInt16BE(p);
        const len = rdataBuf.readUInt16BE(p + 2);
        p += 4;
        if (p + len > rdataBuf.length) break;
        opts.push({ code, data: Buffer.from(rdataBuf.slice(p, p + len)) });
        p += len;
      }
      return opts;
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
    case TYPE_SRV: {
      const head = Buffer.alloc(6);
      head.writeUInt16BE(rdata.priority ?? 0, 0);
      head.writeUInt16BE(rdata.weight ?? 0, 2);
      head.writeUInt16BE(rdata.port ?? 0, 4);
      return Buffer.concat([head, serializeName(rdata.target ?? '')]);
    }
    case TYPE_OPT: {
      const arr = Array.isArray(rdata) ? rdata : [];
      const parts = [];
      for (const o of arr) {
        const data = Buffer.isBuffer(o.data) ? o.data : Buffer.from(o.data ?? []);
        const head = Buffer.alloc(4);
        head.writeUInt16BE(o.code ?? 0, 0);
        head.writeUInt16BE(data.length, 2);
        parts.push(head, data);
      }
      return parts.length ? Buffer.concat(parts) : Buffer.alloc(0);
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
 * DNS protocol layer (RFC 1035) - read-write with one important caveat:
 * write-side name compression is not implemented in v1. Built buffers will
 * therefore be longer than typical wireshark-captured frames, but parse-side
 * compression (resolving 0xC0xx pointers) is fully supported.
 *
 * Supported RR types with structured rdata: A, AAAA, NS, CNAME, PTR, MX,
 * TXT, SRV, OPT (EDNS0). Other types expose `rdata` as a raw Buffer.
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
const DNS = (() => {
  // DNS header bit layout (bytes 2-3, MSB->LSB on the wire):
  //   QR(1) Opcode(4) AA(1) TC(1) RD(1) RA(1) Z(3) RCODE(4)
  // struct-compile places the first declared field in the lowest bit, so
  // declarations below are reversed relative to the RFC layout.
  const { Layer, proto, baseLength } = makeLayer('DNS', `
    //@NE
    struct DNSHeader {
      uint16_t id;
      uint16_t rcode:4, z:3, ra:1, rd:1, tc:1, aa:1, opcode:4, qr:1;
      uint16_t qdCount;
      uint16_t anCount;
      uint16_t nsCount;
      uint16_t arCount;
    } __attribute__(packed);
  `, {
    osi: OsiModelLayers.Application,
    length: ($) => $._buf.length,
    toAlloc: (data) => calcLength(data),
  });

  /**
   * Total serialized DNS message length for a given object, with no name
   * compression. Used by Packet._build via Layer.toAlloc.
   */
  function calcLength(data) {
    if (!data) return baseLength;
    let len = baseLength;
    for (const q of data.questions ?? []) len += questionLength(q);
    for (const rr of data.answers ?? []) len += rrLength(rr);
    for (const rr of data.authority ?? []) len += rrLength(rr);
    for (const rr of data.additional ?? []) len += rrLength(rr);
    return len;
  }
  Layer.toAlloc = calcLength;

  // Walk `count` entries starting at `bodyOffset` (relative to body start,
  // i.e. baseLength bytes after the buffer start). Used by all section
  // getters.
  proto._parseSection = function _parseSection(bodyOffset, count, kind) {
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
  };

  // Sections are parsed lazily on each access so the underlying buffer
  // remains the source of truth. Each getter walks earlier sections to
  // find its starting offset; this matches the legacy implementation
  // verbatim and stays cheap because parseName itself short-circuits on
  // compressed pointers.
  attach.virtualField(proto, 'questions', {
    get() { return this._parseSection(0, this.qdCount, 'q').items; },
  });
  attach.virtualField(proto, 'answers', {
    get() {
      const q = this._parseSection(0, this.qdCount, 'q');
      return this._parseSection(q.next, this.anCount, 'rr').items;
    },
  });
  attach.virtualField(proto, 'authority', {
    get() {
      const q = this._parseSection(0, this.qdCount, 'q');
      const an = this._parseSection(q.next, this.anCount, 'rr');
      return this._parseSection(an.next, this.nsCount, 'rr').items;
    },
  });
  attach.virtualField(proto, 'additional', {
    get() {
      const q = this._parseSection(0, this.qdCount, 'q');
      const an = this._parseSection(q.next, this.anCount, 'rr');
      const ns = this._parseSection(an.next, this.nsCount, 'rr');
      return this._parseSection(ns.next, this.arCount, 'rr').items;
    },
  });

  /**
   * High-level view of the EDNS0 OPT pseudo-RR (RFC 6891) embedded in the
   * additional section. Returns null when no OPT record is present.
   *
   * The OPT RR repurposes standard RR fields:
   *   - class -> sender's UDP payload size
   *   - ttl   -> [extendedRcode(8) | version(8) | DO(1) | Z(15)]
   *   - rdata -> stream of {code, data} options (parsed elsewhere)
   */
  attach.virtualField(proto, 'opt', {
    get() {
      for (const rr of this.additional) {
        if (rr.type === TYPE_OPT) {
          const ttl = rr.ttl >>> 0;
          return {
            udpPayloadSize: rr.class,
            extendedRcode: (ttl >>> 24) & 0xff,
            version: (ttl >>> 16) & 0xff,
            doFlag: (ttl >>> 15) & 0x1,
            options: Array.isArray(rr.rdata) ? rr.rdata : [],
          };
        }
      }
      return null;
    },
  });

  // The struct-compile merge handles header fields. We then patch counts
  // from the section arrays' lengths and serialize sections (no
  // compression) into the body.
  const baseMerge = proto.merge;
  proto.merge = function(data) {
    if (data == null) return;
    if (Buffer.isBuffer(data)) {
      baseMerge.call(this, data);
      return;
    }

    const stripped = { ...data };
    delete stripped.questions;
    delete stripped.answers;
    delete stripped.authority;
    delete stripped.additional;
    baseMerge.call(this, stripped);

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
  };

  attach.toObjectExtras(proto, ['questions', 'answers', 'authority', 'additional']);

  attach.defaults(proto, {
    qr: 0,
    opcode: 0,
  });

  return Layer;
})();

/**
 * Construct an EDNS0 OPT pseudo-RR suitable for placing in the `additional`
 * section. All fields default to sensible values: 4096-byte UDP buffer,
 * version 0, DO flag clear, no options.
 *
 * @param {Object} [opt]
 * @param {number} [opt.udpPayloadSize=4096]
 * @param {number} [opt.extendedRcode=0]
 * @param {number} [opt.version=0]
 * @param {number} [opt.doFlag=0]
 * @param {Array.<{code: number, data: Buffer|Array}>} [opt.options=[]]
 * @returns {{name: string, type: number, class: number, ttl: number, rdata: Array}}
 */
DNS.opt = function makeOpt(opt = {}) {
  const ttl = (
    ((opt.extendedRcode ?? 0) & 0xff) * 0x1000000 +
    ((opt.version ?? 0) & 0xff) * 0x10000 +
    ((opt.doFlag ?? 0) & 0x1) * 0x8000
  ) >>> 0;
  return {
    name: '',
    type: TYPE_OPT,
    class: opt.udpPayloadSize ?? 4096,
    ttl,
    rdata: opt.options ?? [],
  };
};

DNS.TYPES = {
  A: TYPE_A,
  NS: TYPE_NS,
  CNAME: TYPE_CNAME,
  PTR: TYPE_PTR,
  MX: TYPE_MX,
  TXT: TYPE_TXT,
  AAAA: TYPE_AAAA,
  SRV: TYPE_SRV,
  OPT: TYPE_OPT,
};

module.exports = { DNS };
