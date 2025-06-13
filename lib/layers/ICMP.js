const { compile } = require('struct-compile');

const { checksums } = require('#lib/bindings');

const { OsiModelLayers } = require('./osi');
const { ICMPTypes } = require('./enums');
const child = require('./child');
const mixins = require('./mixins');

const { ICMPHeader } = compile(`
  //@NE
  struct ICMPHeader {
    uint8_t type;
    uint8_t code;
    uint16_t checksum;
  } __attribute__(packed);
`);

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

const childProto = {};
const lookupChild = child.lookupChild(childProto);
const lookupKey = child.lookupKey(childProto);

/**
 * ICMP protocol layer
 * @class
 * @implements {Layer}
 * @property {number} type - ICMP message type (see ICMPTypes)
 * @property {number} code - ICMP message code
 * @property {number} checksum - ICMP checksum
 */
class ICMP extends ICMPHeader {
  name = 'ICMP';
  static osi = OsiModelLayers.Network;
  osi = OsiModelLayers.Network;

  /**
   * @param {Buffer|Object} data - Input buffer or object with protocol fields
   * @param {Object} opts - Options for the layer
   */
  constructor(data = {}, opts = {}) {
    const isObj = typeof data == 'object' && !Buffer.isBuffer(data);
    if (isObj) {
      super(data, { toAlloc: ICMP.toAlloc(data) });
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
    return this._buf.subarray(ICMPHeader.prototype.config.length);
  }

  merge(data) {
    super.merge(data);

    const tailBuffer = this._customPayload();

    if (this.isEchoRequest || this.isEchoReply) {
      const echo = new ICMPEchoHeader(tailBuffer);
      echo.merge(data);
    } else if (this.isTimestampRequest || this.isTimestampReply) {
      const timestamp = new ICMPTimestampHeader(tailBuffer);
      timestamp.merge(data);
    } else if (this.isDestinationUnreachable) {
      const unreachable = new ICMPDestUnreachableHeader(tailBuffer);
      unreachable.merge(data);
    } else if (this.isTimeExceeded) {
      const timeExceeded = new ICMPTimeExceededHeader(tailBuffer);
      timeExceeded.merge(data);
    } else if (this.isParameterProblem) {
      const paramProblem = new ICMPParamProblemHeader(tailBuffer);
      paramProblem.merge(data);
    }
  }

  static _toAllocForType(type) {
    let customPayloadLength = 0;
    switch (type) {
      case ICMPTypes.EchoRequest:
      case ICMPTypes.EchoReply:
        customPayloadLength = ICMPEchoHeader.prototype.config.length;
        break;
      case ICMPTypes.TimestampRequest:
      case ICMPTypes.TimestampReply:
        customPayloadLength = ICMPTimestampHeader.prototype.config.length;
        break;
      case ICMPTypes.DestinationUnreachable:
        customPayloadLength = ICMPDestUnreachableHeader.prototype.config.length;
        break;
      case ICMPTypes.TimeExceeded:
        customPayloadLength = ICMPTimeExceededHeader.prototype.config.length;
        break;
      case ICMPTypes.ParameterProblem:
        customPayloadLength = ICMPParamProblemHeader.prototype.config.length;
        break;
    }

    return customPayloadLength + ICMPHeader.prototype.config.length;
  }

  /**
   * Get the required allocation size based on ICMP message type
   * @param {Object} data - The data object containing type and other fields
   * @returns {number} Required allocation size
   */
  static toAlloc(data) {
    return ICMP._toAllocForType(data.type);
  }

  get length() {
    try {
      return ICMP._toAllocForType(this.type);
    } catch(err) {
      return super.length;
    }
  }

  /**
   * Get the name of the ICMP message type
   * @returns {string} Name of the ICMP message type
   */
  get typeName() {
    return Object.entries(ICMPTypes).find(([_, value]) => value === this.type)?.[0] || 'Unknown';
  }

  /**
   * Check if this is an Echo Request message
   * @returns {boolean}
   */
  get isEchoRequest() {
    return this.type === ICMPTypes.EchoRequest;
  }

  /**
   * Check if this is an Echo Reply message
   * @returns {boolean}
   */
  get isEchoReply() {
    return this.type === ICMPTypes.EchoReply;
  }

  /**
   * Check if this is a Destination Unreachable message
   * @returns {boolean}
   */
  get isDestinationUnreachable() {
    return this.type === ICMPTypes.DestinationUnreachable;
  }

  /**
   * Check if this is a Time Exceeded message
   * @returns {boolean}
   */
  get isTimeExceeded() {
    return this.type === ICMPTypes.TimeExceeded;
  }

  /**
   * Check if this is a Parameter Problem message
   * @returns {boolean}
   */
  get isParameterProblem() {
    return this.type === ICMPTypes.ParameterProblem;
  }

  /**
   * Check if this is a Timestamp Request message
   * @returns {boolean}
   */
  get isTimestampRequest() {
    return this.type === ICMPTypes.TimestampRequest;
  }

  /**
   * Check if this is a Timestamp Reply message
   * @returns {boolean}
   */
  get isTimestampReply() {
    return this.type === ICMPTypes.TimestampReply;
  }

  toObject() {
    const base = {
      ...super.toObject(),
      typeName: this.typeName,
      isEchoRequest: this.isEchoRequest,
      isEchoReply: this.isEchoReply,
      isDestinationUnreachable: this.isDestinationUnreachable,
      isTimeExceeded: this.isTimeExceeded,
      isParameterProblem: this.isParameterProblem,
      isTimestampRequest: this.isTimestampRequest,
      isTimestampReply: this.isTimestampReply
    };

    const tailBuffer = this._customPayload();

    if (this.isEchoRequest || this.isEchoReply) {
      const echo = new ICMPEchoHeader(tailBuffer);
      return {
        ...base,
        id: echo.id,
        sequence: echo.sequence,
        timestamp: echo.timestamp
      };
    }

    if (this.isTimestampRequest || this.isTimestampReply) {
      const timestamp = new ICMPTimestampHeader(tailBuffer);
      return {
        ...base,
        id: timestamp.id,
        sequence: timestamp.sequence,
        originateTimestamp: timestamp.originateTimestamp,
        receiveTimestamp: timestamp.receiveTimestamp,
        transmitTimestamp: timestamp.transmitTimestamp
      };
    }

    if (this.isDestinationUnreachable) {
      const unreachable = new ICMPDestUnreachableHeader(tailBuffer);
      return {
        ...base,
        unused: unreachable.unused,
        nextHopMTU: unreachable.nextHopMTU
      };
    }

    if (this.isTimeExceeded) {
      const timeExceeded = new ICMPTimeExceededHeader(tailBuffer);
      return {
        ...base,
        unused: timeExceeded.unused
      };
    }

    if (this.isParameterProblem) {
      const paramProblem = new ICMPParamProblemHeader(tailBuffer);
      return {
        ...base,
        errorOctetPointer: paramProblem.errorOctetPointer,
        unused: paramProblem.unused
      };
    }

    return base;
  }

  /**
   * Calculates and updates the checksum for the IPv4 layer.
   * This method mutates the object by setting the `checksum` property
   * based on the current state of the `buffer`.
   */
  calculateChecksum() {
    this.checksum = checksums.ip(this.buffer.subarray(0, this.length));
  }

  checksums(obj) {
    if (!obj.checksum) {
      this.calculateChecksum();
    }
  }

  defaults(obj, layers) {
    if (!obj.type) {
      this.type = ICMPTypes.EchoRequest;
    }
    if (!obj.code) {
      this.code = 0;
    }
  }

  nextProto(layers) {
    return lookupChild(layers, this.type, this);
  }
}

module.exports = { ICMP }; 
