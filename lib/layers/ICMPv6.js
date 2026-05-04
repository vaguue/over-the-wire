const { compile } = require('struct-compile');
const { OsiModelLayers } = require('./osi');
const { ICMPv6Types } = require('./enums');
const { makeLayer, attach, byField } = require('./define');

/**
 * ICMPv6 protocol layer
 * @class
 * @implements {Layer}
 * @property {number} type - ICMPv6 message type (see ICMPv6Types).
 * @property {number} code - ICMPv6 message code.
 * @property {number} checksum - ICMPv6 checksum.
 */
const ICMPv6 = (() => {
  const { ICMPv6EchoHeader } = compile(`
    //@NE
    struct ICMPv6EchoHeader {
      uint16_t id;
      uint16_t sequence;
    } __attribute__(packed);
  `);
  const { ICMPv6DestUnreachableHeader } = compile(`
    //@NE
    struct ICMPv6DestUnreachableHeader {
      uint32_t unused;
    } __attribute__(packed);
  `);
  const { ICMPv6TimeExceededHeader } = compile(`
    //@NE
    struct ICMPv6TimeExceededHeader {
      uint32_t unused;
    } __attribute__(packed);
  `);
  const { ICMPv6ParamProblemHeader } = compile(`
    //@NE
    struct ICMPv6ParamProblemHeader {
      uint32_t pointer;
    } __attribute__(packed);
  `);

  const tailLengthFor = (type) => {
    switch (type) {
      case ICMPv6Types.EchoRequest:
      case ICMPv6Types.EchoReply:
        return ICMPv6EchoHeader.prototype.config.length;
      case ICMPv6Types.DestinationUnreachable:
        return ICMPv6DestUnreachableHeader.prototype.config.length;
      case ICMPv6Types.TimeExceeded:
        return ICMPv6TimeExceededHeader.prototype.config.length;
      case ICMPv6Types.ParameterProblem:
        return ICMPv6ParamProblemHeader.prototype.config.length;
      default:
        return 0;
    }
  };

  const { Layer, proto, baseLength } = makeLayer('ICMPv6', `
    //@NE
    struct ICMPv6Header {
      uint8_t type;
      uint8_t code;
      uint16_t checksum;
    } __attribute__(packed);
  `, {
    osi: OsiModelLayers.Network,
    length: false,
    toAlloc: (data) => baseLength + tailLengthFor(data && data.type),
  });
  Layer.toAlloc = (data) => baseLength + tailLengthFor(data && data.type);

  Object.defineProperty(proto, 'length', {
    get() {
      try { return baseLength + tailLengthFor(this.type); }
      catch (_e) { return baseLength; }
    },
    configurable: true,
  });

  attach.virtualField(proto, 'typeName', {
    get() { return Object.entries(ICMPv6Types).find(([, v]) => v === this.type)?.[0] || 'Unknown'; },
  });
  attach.virtualField(proto, 'isEchoRequest', { get() { return this.type === ICMPv6Types.EchoRequest; } });
  attach.virtualField(proto, 'isEchoReply', { get() { return this.type === ICMPv6Types.EchoReply; } });
  attach.virtualField(proto, 'isDestinationUnreachable', { get() { return this.type === ICMPv6Types.DestinationUnreachable; } });
  attach.virtualField(proto, 'isTimeExceeded', { get() { return this.type === ICMPv6Types.TimeExceeded; } });
  attach.virtualField(proto, 'isParameterProblem', { get() { return this.type === ICMPv6Types.ParameterProblem; } });

  const baseMerge = proto.merge;
  proto.merge = function(data) {
    baseMerge.call(this, data);
    if (Buffer.isBuffer(data)) return;
    const tail = this._buf.subarray(baseLength);
    if (this.isEchoRequest || this.isEchoReply) new ICMPv6EchoHeader(tail).merge(data);
    else if (this.isDestinationUnreachable) new ICMPv6DestUnreachableHeader(tail).merge(data);
    else if (this.isTimeExceeded) new ICMPv6TimeExceededHeader(tail).merge(data);
    else if (this.isParameterProblem) new ICMPv6ParamProblemHeader(tail).merge(data);
  };

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
    };
    const tail = this._buf.subarray(baseLength);
    if (this.isEchoRequest || this.isEchoReply) {
      const h = new ICMPv6EchoHeader(tail);
      return { ...base, id: h.id, sequence: h.sequence };
    }
    if (this.isDestinationUnreachable) {
      const h = new ICMPv6DestUnreachableHeader(tail);
      return { ...base, unused: h.unused };
    }
    if (this.isTimeExceeded) {
      const h = new ICMPv6TimeExceededHeader(tail);
      return { ...base, unused: h.unused };
    }
    if (this.isParameterProblem) {
      const h = new ICMPv6ParamProblemHeader(tail);
      return { ...base, pointer: h.pointer };
    }
    return base;
  };

  // Empty table -> always Payload via byField fallback. ICMPv6 checksum is
  // an IPv6 pseudo-header concern handled (or not) by the IPv6 layer.
  attach.dispatch(proto, byField('type', {}));

  attach.defaults(proto, {
    type: ICMPv6Types.EchoRequest,
    code: 0,
  });

  return Layer;
})();

module.exports = { ICMPv6 };
