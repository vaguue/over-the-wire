const { compile } = require('struct-compile');
const { OsiModelLayers } = require('./osi');
const { ICMPTypes } = require('./enums');
const { makeLayer, attach, byField } = require('./define');

/**
 * ICMP protocol layer
 * @class
 * @implements {Layer}
 * @property {number} type - ICMP message type (see ICMPTypes)
 * @property {number} code - ICMP message code
 * @property {number} checksum - ICMP checksum
 * @property {string} typeName - Human-readable name of the ICMP message type
 * @property {boolean} isEchoRequest - True for type=8 (EchoRequest).
 * @property {boolean} isEchoReply - True for type=0 (EchoReply).
 * @property {boolean} isDestinationUnreachable - True for type=3.
 * @property {boolean} isTimeExceeded - True for type=11.
 * @property {boolean} isParameterProblem - True for type=12.
 * @property {boolean} isTimestampRequest - True for type=13.
 * @property {boolean} isTimestampReply - True for type=14.
 */
const ICMP = (() => {
  // Sub-headers attached to the base 4-byte ICMP header by message type.
  // Compiled inside the IIFE so they don't leak into the module export.
  const { ICMPEchoHeader } = compile(`
    //@NE
    struct ICMPEchoHeader {
      uint16_t id;
      uint16_t sequence;
      uint64_t timestamp;
    } __attribute__(packed);
  `);
  const { ICMPTimestampHeader } = compile(`
    //@NE
    struct ICMPTimestampHeader {
      uint16_t id;
      uint16_t sequence;
      uint32_t originateTimestamp;
      uint32_t receiveTimestamp;
      uint32_t transmitTimestamp;
    } __attribute__(packed);
  `);
  const { ICMPDestUnreachableHeader } = compile(`
    //@NE
    struct ICMPDestUnreachableHeader {
      uint16_t unused;
      uint16_t nextHopMTU;
    } __attribute__(packed);
  `);
  const { ICMPTimeExceededHeader } = compile(`
    //@NE
    struct ICMPTimeExceededHeader {
      uint32_t unused;
    } __attribute__(packed);
  `);
  const { ICMPParamProblemHeader } = compile(`
    //@NE
    struct ICMPParamProblemHeader {
      uint8_t errorOctetPointer;
      uint8_t unused[3];
    } __attribute__(packed);
  `);

  // Total header size as a function of `type`. Defaults to base 4 bytes
  // (just type/code/checksum) when the message type doesn't carry a
  // structured tail.
  const tailLengthFor = (type) => {
    switch (type) {
      case ICMPTypes.EchoRequest:
      case ICMPTypes.EchoReply:
        return ICMPEchoHeader.prototype.config.length;
      case ICMPTypes.TimestampRequest:
      case ICMPTypes.TimestampReply:
        return ICMPTimestampHeader.prototype.config.length;
      case ICMPTypes.DestinationUnreachable:
        return ICMPDestUnreachableHeader.prototype.config.length;
      case ICMPTypes.TimeExceeded:
        return ICMPTimeExceededHeader.prototype.config.length;
      case ICMPTypes.ParameterProblem:
        return ICMPParamProblemHeader.prototype.config.length;
      default:
        return 0;
    }
  };

  const { Layer, proto, baseLength } = makeLayer('ICMP', `
    //@NE
    struct ICMPHeader {
      uint8_t type;
      uint8_t code;
      uint16_t checksum;
    } __attribute__(packed);
  `, {
    osi: OsiModelLayers.Network,
    length: false,
    toAlloc: (data) => baseLengthFor(data),
  });

  // Bootstrap: makeLayer reads `toAlloc` once and turns it into the static
  // method, so the closure must already be defined when the IIFE runs.
  // We capture baseLength via the destructure above and route through this
  // tiny helper to keep the call site declarative.
  function baseLengthFor(data) {
    return baseLength + tailLengthFor(data && data.type);
  }
  Layer.toAlloc = (data) => baseLengthFor(data);

  // Type-driven length getter on the prototype. Recomputed on every access
  // so changing `type` updates `length` (matches the legacy class).
  Object.defineProperty(proto, 'length', {
    get() {
      try { return baseLength + tailLengthFor(this.type); }
      catch (_e) { return baseLength; }
    },
    configurable: true,
  });

  attach.virtualField(proto, 'typeName', {
    get() { return Object.entries(ICMPTypes).find(([, v]) => v === this.type)?.[0] || 'Unknown'; },
  });
  attach.virtualField(proto, 'isEchoRequest', { get() { return this.type === ICMPTypes.EchoRequest; } });
  attach.virtualField(proto, 'isEchoReply', { get() { return this.type === ICMPTypes.EchoReply; } });
  attach.virtualField(proto, 'isDestinationUnreachable', { get() { return this.type === ICMPTypes.DestinationUnreachable; } });
  attach.virtualField(proto, 'isTimeExceeded', { get() { return this.type === ICMPTypes.TimeExceeded; } });
  attach.virtualField(proto, 'isParameterProblem', { get() { return this.type === ICMPTypes.ParameterProblem; } });
  attach.virtualField(proto, 'isTimestampRequest', { get() { return this.type === ICMPTypes.TimestampRequest; } });
  attach.virtualField(proto, 'isTimestampReply', { get() { return this.type === ICMPTypes.TimestampReply; } });

  // After struct-compile sets the base type/code/checksum, dispatch to the
  // matching sub-header to populate the type-specific tail.
  const baseMerge = proto.merge;
  proto.merge = function(data) {
    baseMerge.call(this, data);
    if (Buffer.isBuffer(data)) return;
    const tail = this._buf.subarray(baseLength);
    if (this.isEchoRequest || this.isEchoReply) new ICMPEchoHeader(tail).merge(data);
    else if (this.isTimestampRequest || this.isTimestampReply) new ICMPTimestampHeader(tail).merge(data);
    else if (this.isDestinationUnreachable) new ICMPDestUnreachableHeader(tail).merge(data);
    else if (this.isTimeExceeded) new ICMPTimeExceededHeader(tail).merge(data);
    else if (this.isParameterProblem) new ICMPParamProblemHeader(tail).merge(data);
  };

  // Custom toObject mirrors merge: base header + type marker + the
  // type-specific tail header's fields.
  const baseToObject = proto.toObject;
  proto.toObject = function() {
    const base = {
      ...baseToObject.call(this),
      typeName: this.typeName,
      isEchoRequest: this.isEchoRequest,
      isEchoReply: this.isEchoReply,
      isDestinationUnreachable: this.isDestinationUnreachable,
      isTimeExceeded: this.isTimeExceeded,
      isParameterProblem: this.isParameterProblem,
      isTimestampRequest: this.isTimestampRequest,
      isTimestampReply: this.isTimestampReply,
    };
    const tail = this._buf.subarray(baseLength);
    if (this.isEchoRequest || this.isEchoReply) {
      const h = new ICMPEchoHeader(tail);
      return { ...base, id: h.id, sequence: h.sequence, timestamp: h.timestamp };
    }
    if (this.isTimestampRequest || this.isTimestampReply) {
      const h = new ICMPTimestampHeader(tail);
      return {
        ...base,
        id: h.id,
        sequence: h.sequence,
        originateTimestamp: h.originateTimestamp,
        receiveTimestamp: h.receiveTimestamp,
        transmitTimestamp: h.transmitTimestamp,
      };
    }
    if (this.isDestinationUnreachable) {
      const h = new ICMPDestUnreachableHeader(tail);
      return { ...base, unused: h.unused, nextHopMTU: h.nextHopMTU };
    }
    if (this.isTimeExceeded) {
      const h = new ICMPTimeExceededHeader(tail);
      return { ...base, unused: h.unused };
    }
    if (this.isParameterProblem) {
      const h = new ICMPParamProblemHeader(tail);
      return { ...base, errorOctetPointer: h.errorOctetPointer, unused: h.unused };
    }
    return base;
  };

  attach.checksum.ip(proto);

  // No structured child protocols: empty table -> always Payload via
  // byField's fallback.
  attach.dispatch(proto, byField('type', {}));

  attach.defaults(proto, {
    type: ICMPTypes.EchoRequest,
    code: 0,
  });

  return Layer;
})();

module.exports = { ICMP };
