const { compile } = require('struct-compile');
const { OsiModelLayers } = require('./osi');
const { ICMPv6Types } = require('./enums');
const child = require('./child');
const mixins = require('./mixins');

const { ICMPv6Header } = compile(`
  //@NE
  struct ICMPv6Header {
    uint8_t type;
    uint8_t code;
    uint16_t checksum;
  } __attribute__(packed);
`);

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

const childProto = {};
const lookupChild = child.lookupChild(childProto);
const lookupKey = child.lookupKey(childProto);

/**
 * ICMPv6 protocol layer
 * @class
 * @implements {Layer}
 * @property {number} type - ICMPv6 message type (see ICMPv6Types)
 * @property {number} code - ICMPv6 message code
 * @property {number} checksum - ICMPv6 checksum
 */
class ICMPv6 extends ICMPv6Header {
  name = 'ICMPv6';
  static osi = OsiModelLayers.Network;
  osi = OsiModelLayers.Network;

  /**
   * @param {Buffer|Object} data - Input buffer or object with protocol fields
   * @param {Object} opts - Options for the layer
   */
  constructor(data = {}, opts = {}) {
    const isObj = typeof data == 'object' && !Buffer.isBuffer(data);
    if (isObj) {
      super(data, { toAlloc: ICMPv6.toAlloc(data) });
    }
    else {
      super(data);
    }

    mixins.ctor(this, data, opts);

    if (isObj) {
      this.merge(data);
    }
  }

  _customPayload() {
    return this._buf.subarray(ICMPv6Header.prototype.config.length);
  }

  merge(data) {
    super.merge(data);

    const tailBuffer = this._customPayload();

    if (this.isEchoRequest || this.isEchoReply) {
      const echo = new ICMPv6EchoHeader(tailBuffer);
      echo.merge(data);
    } else if (this.isDestinationUnreachable) {
      const unreachable = new ICMPv6DestUnreachableHeader(tailBuffer);
      unreachable.merge(data);
    } else if (this.isTimeExceeded) {
      const timeExceeded = new ICMPv6TimeExceededHeader(tailBuffer);
      timeExceeded.merge(data);
    } else if (this.isParameterProblem) {
      const paramProblem = new ICMPv6ParamProblemHeader(tailBuffer);
      paramProblem.merge(data);
    }
  }

  static _toAllocForType(type) {
    let customPayloadLength = 0;
    switch (type) {
      case ICMPv6Types.EchoRequest:
      case ICMPv6Types.EchoReply:
        customPayloadLength = ICMPv6EchoHeader.prototype.config.length;
        break;
      case ICMPv6Types.DestinationUnreachable:
        customPayloadLength = ICMPv6DestUnreachableHeader.prototype.config.length;
        break;
      case ICMPv6Types.TimeExceeded:
        customPayloadLength = ICMPv6TimeExceededHeader.prototype.config.length;
        break;
      case ICMPv6Types.ParameterProblem:
        customPayloadLength = ICMPv6ParamProblemHeader.prototype.config.length;
        break;
    }

    return customPayloadLength + ICMPv6Header.prototype.config.length;
  }

  /**
   * Get the required allocation size based on ICMPv6 message type
   * @param {Object} data - The data object containing type and other fields
   * @returns {number} Required allocation size
   */
  static toAlloc(data) {
    return ICMPv6._toAllocForType(data.type);
  }

  get length() {
    try {
      return ICMPv6._toAllocForType(this.type);
    } catch(err) {
      return super.length;
    }
  }

  /**
   * Get the name of the ICMPv6 message type
   * @returns {string} Name of the ICMPv6 message type
   */
  get typeName() {
    return Object.entries(ICMPv6Types).find(([_, value]) => value === this.type)?.[0] || 'Unknown';
  }

  /**
   * Check if this is an Echo Request message
   * @returns {boolean}
   */
  get isEchoRequest() {
    return this.type === ICMPv6Types.EchoRequest;
  }

  /**
   * Check if this is an Echo Reply message
   * @returns {boolean}
   */
  get isEchoReply() {
    return this.type === ICMPv6Types.EchoReply;
  }

  /**
   * Check if this is a Destination Unreachable message
   * @returns {boolean}
   */
  get isDestinationUnreachable() {
    return this.type === ICMPv6Types.DestinationUnreachable;
  }

  /**
   * Check if this is a Time Exceeded message
   * @returns {boolean}
   */
  get isTimeExceeded() {
    return this.type === ICMPv6Types.TimeExceeded;
  }

  /**
   * Check if this is a Parameter Problem message
   * @returns {boolean}
   */
  get isParameterProblem() {
    return this.type === ICMPv6Types.ParameterProblem;
  }

  toObject() {
    const base = {
      ...super.toObject(),
      typeName: this.typeName,
      isEchoRequest: this.isEchoRequest,
      isEchoReply: this.isEchoReply,
      isDestinationUnreachable: this.isDestinationUnreachable,
      isTimeExceeded: this.isTimeExceeded,
      isParameterProblem: this.isParameterProblem
    };

    const tailBuffer = this._customPayload();

    if (this.isEchoRequest || this.isEchoReply) {
      const echo = new ICMPv6EchoHeader(tailBuffer);
      return {
        ...base,
        id: echo.id,
        sequence: echo.sequence
      };
    }

    if (this.isDestinationUnreachable) {
      const unreachable = new ICMPv6DestUnreachableHeader(tailBuffer);
      return {
        ...base,
        unused: unreachable.unused
      };
    }

    if (this.isTimeExceeded) {
      const timeExceeded = new ICMPv6TimeExceededHeader(tailBuffer);
      return {
        ...base,
        unused: timeExceeded.unused
      };
    }

    if (this.isParameterProblem) {
      const paramProblem = new ICMPv6ParamProblemHeader(tailBuffer);
      return {
        ...base,
        pointer: paramProblem.pointer
      };
    }

    return base;
  }

  defaults(obj, layers) {
    if (!obj.type) {
      this.type = ICMPv6Types.EchoRequest;
    }
    if (!obj.code) {
      this.code = 0;
    }
  }

  nextProto(layers) {
    return lookupChild(layers, this.type, this);
  }
}

module.exports = { ICMPv6 }; 