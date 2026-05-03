const { compile } = require('struct-compile');
const { OsiModelLayers } = require('./osi');
const { ETHERTYPE } = require('./enums');
const child = require('./child');
const mixins = require('./mixins');

// First 16 bits on the wire: C R K S s Recur(3) Flags(5) Ver(3).
// struct-compile places the first declared field in the lowest bits, so the
// declaration order below is reversed compared to the RFC bit layout to keep
// the on-wire MSB ordering correct.
const { GREHeader } = compile(`
  //@NE
  struct GREHeader {
    uint16_t version:3, flags:5, recurControl:3, strictRouteFlag:1,
             sequenceFlag:1, keyFlag:1, routingFlag:1, checksumFlag:1;
    uint16_t protocol;
  } __attribute__(packed);
`);

const { length: baseLength } = GREHeader.prototype.config;

// GRE encapsulates an EtherType payload, so the dispatcher reuses
// EtherType -> layer mapping (a subset is enough for typical tunnels).
const childProto = {
  [ETHERTYPE.IP]: 'IPv4',
  [ETHERTYPE.IPV6]: 'IPv6',
  [ETHERTYPE.ARP]: 'ARP',
  [ETHERTYPE.VLAN]: 'Vlan',
  [ETHERTYPE.IEEE_802_1AD]: 'Vlan',
  [ETHERTYPE.MPLS]: 'Mpls',
};

const lookupChild = child.lookupChild(childProto);
const lookupKey = child.lookupKey(childProto);

const optionsSize = (data) => {
  let n = 0;
  if (data.checksumFlag || data.checksum !== undefined) n += 4;
  if (data.keyFlag || data.key !== undefined) n += 4;
  if (data.sequenceFlag || data.sequence !== undefined) n += 4;
  return n;
};

/**
 * Generic Routing Encapsulation (GRE) layer
 * @class
 * @implements {Layer}
 * @property {number} version - Version number, must be 0 for standard GRE.
 * @property {number} protocol - EtherType of the encapsulated protocol.
 * @property {number} checksumFlag - Indicates that the checksum field is present.
 * @property {number} keyFlag - Indicates that the key field is present.
 * @property {number} sequenceFlag - Indicates that the sequence number field is present.
 */
class GRE extends GREHeader {
  name = 'GRE';

  /**
   * @param {Buffer|Object} data - Input buffer or object with protocol fields.
   * @param {Object} opts - Options for the layer.
   */
  constructor(data = {}, opts = {}) {
    if (Buffer.isBuffer(data)) {
      super(data);
    }
    else {
      super(Buffer.alloc(GRE.toAlloc(data)));
      // Auto-set flags when caller passes optional fields without explicit flags.
      if (data.checksum !== undefined && data.checksumFlag === undefined) data.checksumFlag = 1;
      if (data.key !== undefined && data.keyFlag === undefined) data.keyFlag = 1;
      if (data.sequence !== undefined && data.sequenceFlag === undefined) data.sequenceFlag = 1;
      this.merge(data);
    }
    mixins.ctor(this, data, opts);

    this.length = opts.allocated ?? this._headerSize();
  }

  static toAlloc = (data) => baseLength + optionsSize(data);

  static osi = OsiModelLayers.Network;
  osi = OsiModelLayers.Network;

  _headerSize() {
    return baseLength
      + (this.checksumFlag ? 4 : 0)
      + (this.keyFlag ? 4 : 0)
      + (this.sequenceFlag ? 4 : 0);
  }

  _checksumOffset() {
    return this.checksumFlag ? baseLength : -1;
  }

  _keyOffset() {
    if (!this.keyFlag) return -1;
    return baseLength + (this.checksumFlag ? 4 : 0);
  }

  _sequenceOffset() {
    if (!this.sequenceFlag) return -1;
    return baseLength + (this.checksumFlag ? 4 : 0) + (this.keyFlag ? 4 : 0);
  }

  /**
   * 16-bit checksum (only present when checksumFlag is set).
   * @type {number|null}
   */
  get checksum() {
    const off = this._checksumOffset();
    return off < 0 ? null : this._buf.readUInt16BE(off);
  }

  set checksum(val) {
    const off = this._checksumOffset();
    if (off < 0) throw new Error('GRE: cannot set checksum without checksumFlag');
    this._buf.writeUInt16BE(val & 0xffff, off);
  }

  /**
   * 32-bit key (only present when keyFlag is set).
   * @type {number|null}
   */
  get key() {
    const off = this._keyOffset();
    return off < 0 ? null : this._buf.readUInt32BE(off);
  }

  set key(val) {
    const off = this._keyOffset();
    if (off < 0) throw new Error('GRE: cannot set key without keyFlag');
    this._buf.writeUInt32BE(val >>> 0, off);
  }

  /**
   * 32-bit sequence number (only present when sequenceFlag is set).
   * @type {number|null}
   */
  get sequence() {
    const off = this._sequenceOffset();
    return off < 0 ? null : this._buf.readUInt32BE(off);
  }

  set sequence(val) {
    const off = this._sequenceOffset();
    if (off < 0) throw new Error('GRE: cannot set sequence without sequenceFlag');
    this._buf.writeUInt32BE(val >>> 0, off);
  }

  // Override merge to write optional fields after struct-compile sets bit-flags.
  merge(data) {
    super.merge(data);
    if (data?.checksum !== undefined && this.checksumFlag) this.checksum = data.checksum;
    if (data?.key !== undefined && this.keyFlag) this.key = data.key;
    if (data?.sequence !== undefined && this.sequenceFlag) this.sequence = data.sequence;
  }

  toObject() {
    const out = super.toObject();
    if (this.checksumFlag) out.checksum = this.checksum;
    if (this.keyFlag) out.key = this.key;
    if (this.sequenceFlag) out.sequence = this.sequence;
    return out;
  }

  defaults(obj = {}, layers) {
    if (obj.version === undefined) {
      this.version = 0;
    }
    if (!obj.protocol) {
      if (this.next) {
        this.protocol = lookupKey(layers, this.next) ?? ETHERTYPE.IP;
      }
      else {
        this.protocol = ETHERTYPE.IP;
      }
    }
  }

  nextProto(layers) {
    return lookupChild(layers, this.protocol, this);
  }
};

module.exports = { GRE };
