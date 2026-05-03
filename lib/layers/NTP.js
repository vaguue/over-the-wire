const { compile } = require('struct-compile');
const { OsiModelLayers } = require('./osi');
const mixins = require('./mixins');

// Byte 0 of an NTP packet packs LI(2) | VN(3) | Mode(3) MSB->LSB. struct-compile
// places the first declared field in the lowest bits, so the order is reversed
// to keep the on-wire MSB ordering correct (mode in low 3 bits, then vn, then li).
const { NTPHeader } = compile(`
  //@NE
  struct NTPHeader {
    uint8_t mode:3, vn:3, li:2;
    uint8_t stratum;
    int8_t  poll;
    int8_t  precision;
    uint32_t rootDelay;
    uint32_t rootDispersion;
    uint32_t referenceId;
    uint8_t  referenceTimestamp[8];
    uint8_t  originTimestamp[8];
    uint8_t  receiveTimestamp[8];
    uint8_t  transmitTimestamp[8];
  } __attribute__(packed);
`);

const { length: baseLength } = NTPHeader.prototype.config;

// Number of seconds between the NTP epoch (1 Jan 1900) and the Unix epoch
// (1 Jan 1970). Used to convert NTP 64-bit timestamps to JS Date.
const NTP_EPOCH_OFFSET = 2208988800;

const tsFields = ['referenceTimestamp', 'originTimestamp', 'receiveTimestamp', 'transmitTimestamp'];
const tsOffsets = {
  referenceTimestamp: 16,
  originTimestamp: 24,
  receiveTimestamp: 32,
  transmitTimestamp: 40,
};

/**
 * Convert a JS Date to an NTP 64-bit timestamp written into `buf` at `offset`.
 * @param {Buffer} buf
 * @param {number} offset
 * @param {Date|number|null} dateOrMs - Date instance, ms-since-epoch, or null/0 to write zeros.
 */
function writeNtpTimestamp(buf, offset, dateOrMs) {
  if (dateOrMs == null || dateOrMs === 0) {
    buf.writeUInt32BE(0, offset);
    buf.writeUInt32BE(0, offset + 4);
    return;
  }
  const ms = dateOrMs instanceof Date ? dateOrMs.getTime() : Number(dateOrMs);
  const totalSeconds = ms / 1000 + NTP_EPOCH_OFFSET;
  const sec = Math.floor(totalSeconds);
  const frac = Math.floor((totalSeconds - sec) * 0x100000000);
  buf.writeUInt32BE(sec >>> 0, offset);
  buf.writeUInt32BE(frac >>> 0, offset + 4);
}

/**
 * Read an NTP 64-bit timestamp from `buf` at `offset` and return a JS Date.
 * @returns {Date|null} `null` for the all-zero "unspecified" timestamp.
 */
function readNtpTimestamp(buf, offset) {
  const sec = buf.readUInt32BE(offset);
  const frac = buf.readUInt32BE(offset + 4);
  if (sec === 0 && frac === 0) return null;
  const ms = (sec - NTP_EPOCH_OFFSET) * 1000 + Math.round(frac / 0x100000000 * 1000);
  return new Date(ms);
}

/**
 * NTP (Network Time Protocol) layer
 * @class
 * @implements {Layer}
 * @property {number} li - Leap indicator (0..3).
 * @property {number} vn - Version number (typically 3 or 4).
 * @property {number} mode - Mode (1=symmetric active, 3=client, 4=server, 5=broadcast).
 * @property {number} stratum - Stratum level (0=unspecified, 1=primary, 2-15=secondary).
 * @property {number} poll - Poll interval as signed log2 seconds.
 * @property {number} precision - Precision as signed log2 seconds.
 * @property {number} rootDelay - 32-bit fixed-point root delay.
 * @property {number} rootDispersion - 32-bit fixed-point root dispersion.
 * @property {number} referenceId - Reference identifier (4 bytes; IPv4 or 4-char ASCII).
 * @property {Date|null} referenceTimestamp - Time at which the local clock was last set.
 * @property {Date|null} originTimestamp - Time at the client when the request was sent.
 * @property {Date|null} receiveTimestamp - Time at the server when the request was received.
 * @property {Date|null} transmitTimestamp - Time at the server when the response was sent.
 */
class NTP extends NTPHeader {
  name = 'NTP';

  /**
   * @param {Buffer|Object} data - Input buffer or object with protocol fields.
   * @param {Object} opts - Options for the layer.
   */
  constructor(data = {}, opts = {}) {
    if (Buffer.isBuffer(data)) {
      super(data);
    }
    else {
      super(Buffer.alloc(NTP.toAlloc(data)));
      this.merge(data);
    }
    mixins.ctor(this, data, opts);

    this.length = opts.allocated ?? baseLength;
  }

  static toAlloc = () => baseLength;

  static osi = OsiModelLayers.Application;
  osi = OsiModelLayers.Application;

  get referenceTimestamp() { return readNtpTimestamp(this._buf, tsOffsets.referenceTimestamp); }
  set referenceTimestamp(v) { writeNtpTimestamp(this._buf, tsOffsets.referenceTimestamp, v); }

  get originTimestamp() { return readNtpTimestamp(this._buf, tsOffsets.originTimestamp); }
  set originTimestamp(v) { writeNtpTimestamp(this._buf, tsOffsets.originTimestamp, v); }

  get receiveTimestamp() { return readNtpTimestamp(this._buf, tsOffsets.receiveTimestamp); }
  set receiveTimestamp(v) { writeNtpTimestamp(this._buf, tsOffsets.receiveTimestamp, v); }

  get transmitTimestamp() { return readNtpTimestamp(this._buf, tsOffsets.transmitTimestamp); }
  set transmitTimestamp(v) { writeNtpTimestamp(this._buf, tsOffsets.transmitTimestamp, v); }

  // struct-compile coerces Date instances to strings when writing the raw
  // 8-byte timestamp arrays, which would corrupt the buffer. We strip
  // timestamp fields out of `data` before calling super.merge and route them
  // through the virtual setters which encode NTP 64-bit format properly.
  merge(data) {
    if (data == null) return;
    if (Buffer.isBuffer(data)) {
      super.merge(data);
      return;
    }
    const stripped = { ...data };
    for (const f of tsFields) delete stripped[f];
    super.merge(stripped);
    for (const f of tsFields) {
      if (data[f] !== undefined) this[f] = data[f];
    }
  }

  // Build the object manually instead of calling super.toObject(): the latter
  // would walk the struct field list and invoke our timestamp getters
  // (returning Date), which struct-compile then tries to treat as byte arrays.
  toObject() {
    return {
      li: this.li,
      vn: this.vn,
      mode: this.mode,
      stratum: this.stratum,
      poll: this.poll,
      precision: this.precision,
      rootDelay: this.rootDelay,
      rootDispersion: this.rootDispersion,
      referenceId: this.referenceId,
      referenceTimestamp: this.referenceTimestamp,
      originTimestamp: this.originTimestamp,
      receiveTimestamp: this.receiveTimestamp,
      transmitTimestamp: this.transmitTimestamp,
    };
  }

  defaults(obj = {}, layers) {
    if (obj.li === undefined) this.li = 0;
    if (obj.vn === undefined) this.vn = 4;
    if (obj.mode === undefined) this.mode = 3;
    if (obj.stratum === undefined) this.stratum = 0;
  }

  nextProto(layers) {
    return null;
  }
};

module.exports = { NTP };
