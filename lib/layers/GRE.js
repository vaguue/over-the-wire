const { OsiModelLayers } = require('./osi');
const { ETHERTYPE } = require('./enums');
const { makeLayer, attach, byField } = require('./define');

// Optional GRE header section size based on which optional fields are
// present (or implied by data passed to the ctor).
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
const GRE = (() => {
  // First 16 bits on the wire: C R K S s Recur(3) Flags(5) Ver(3).
  // struct-compile places the first declared field in the lowest bits, so
  // the declaration order below is reversed compared to the RFC bit
  // layout to keep the on-wire MSB ordering correct.
  const { Layer, proto, baseLength } = makeLayer('GRE', `
    //@NE
    struct GREHeader {
      uint16_t version:3, flags:5, recurControl:3, strictRouteFlag:1,
               sequenceFlag:1, keyFlag:1, routingFlag:1, checksumFlag:1;
      uint16_t protocol;
    } __attribute__(packed);
  `, {
    osi: OsiModelLayers.Network,
    length: ($) => baseLength
      + ($.checksumFlag ? 4 : 0)
      + ($.keyFlag ? 4 : 0)
      + ($.sequenceFlag ? 4 : 0),
    toAlloc: (data) => baseLength + optionsSize(data),
  });

  const checksumOffset = (self) => self.checksumFlag ? baseLength : -1;
  const keyOffset = (self) => self.keyFlag
    ? baseLength + (self.checksumFlag ? 4 : 0)
    : -1;
  const sequenceOffset = (self) => self.sequenceFlag
    ? baseLength + (self.checksumFlag ? 4 : 0) + (self.keyFlag ? 4 : 0)
    : -1;

  attach.virtualField(proto, 'checksum', {
    get() {
      const off = checksumOffset(this);
      return off < 0 ? null : this._buf.readUInt16BE(off);
    },
    set(val) {
      const off = checksumOffset(this);
      if (off < 0) throw new Error('GRE: cannot set checksum without checksumFlag');
      this._buf.writeUInt16BE(val & 0xffff, off);
    },
  });
  attach.virtualField(proto, 'key', {
    get() {
      const off = keyOffset(this);
      return off < 0 ? null : this._buf.readUInt32BE(off);
    },
    set(val) {
      const off = keyOffset(this);
      if (off < 0) throw new Error('GRE: cannot set key without keyFlag');
      this._buf.writeUInt32BE(val >>> 0, off);
    },
  });
  attach.virtualField(proto, 'sequence', {
    get() {
      const off = sequenceOffset(this);
      return off < 0 ? null : this._buf.readUInt32BE(off);
    },
    set(val) {
      const off = sequenceOffset(this);
      if (off < 0) throw new Error('GRE: cannot set sequence without sequenceFlag');
      this._buf.writeUInt32BE(val >>> 0, off);
    },
  });

  // Wrap merge so that:
  //  1. before super.merge, auto-set *Flag fields when caller passes the
  //     optional value without an explicit flag (so struct-compile writes
  //     the flag bits);
  //  2. after super.merge, write the optional values via our virtualField
  //     setters at the now-correct offsets.
  const baseMerge = proto.merge;
  proto.merge = function(data) {
    if (data && !Buffer.isBuffer(data)) {
      if (data.checksum !== undefined && data.checksumFlag === undefined) data.checksumFlag = 1;
      if (data.key !== undefined && data.keyFlag === undefined) data.keyFlag = 1;
      if (data.sequence !== undefined && data.sequenceFlag === undefined) data.sequenceFlag = 1;
    }
    baseMerge.call(this, data);
    if (data && !Buffer.isBuffer(data)) {
      if (data.checksum !== undefined && this.checksumFlag) this.checksum = data.checksum;
      if (data.key !== undefined && this.keyFlag) this.key = data.key;
      if (data.sequence !== undefined && this.sequenceFlag) this.sequence = data.sequence;
    }
  };

  // toObject must include optional fields when their flag is set; raw
  // struct-compile output skips them because they live outside the fixed
  // base header.
  const baseToObject = proto.toObject;
  proto.toObject = function() {
    const out = baseToObject.call(this);
    if (this.checksumFlag) out.checksum = this.checksum;
    if (this.keyFlag) out.key = this.key;
    if (this.sequenceFlag) out.sequence = this.sequence;
    return out;
  };

  // GRE encapsulates an EtherType payload: reuse a subset of the
  // EtherType -> layer mapping (typical tunnels).
  const dispatcher = byField('protocol', {
    [ETHERTYPE.IP]: 'IPv4',
    [ETHERTYPE.IPV6]: 'IPv6',
    [ETHERTYPE.ARP]: 'ARP',
    [ETHERTYPE.VLAN]: 'Vlan',
    [ETHERTYPE.IEEE_802_1AD]: 'Vlan',
    [ETHERTYPE.MPLS]: 'Mpls',
  });
  attach.dispatch(proto, dispatcher);

  attach.defaults(proto, {
    version: 0,
    protocol: dispatcher.reverseDefault(ETHERTYPE.IP),
  });

  return Layer;
})();

module.exports = { GRE };
