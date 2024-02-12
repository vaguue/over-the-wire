const { compile } = require('struct-compile');
const { OsiModelLayers } = require('./osi');
const { IPProtocolTypes } = require('./enums');
const { AF_INET, inetPton, inetNtop, ntohs } = require('../socket');
const { checksums } = require('../bindings');
const child = require('./child');
const mixins = require('./mixins');
const { omit } = require('../pick');

const { TCPHeader } = compile(`
  //@NE
  struct TCPHeader {
    // Source TCP port 
    uint16_t src;
    // Destination TCP port 
    uint16_t dst;
    // Sequence number 
    uint32_t seq;
    // Acknowledgment number 
    uint32_t ack;

    // @LE
    uint16_t 
      reservedFlag:4,
      dataOffset:4,

      finFlag:1,
      synFlag:1,
      rstFlag:1,
      pshFlag:1,
      ackFlag:1,
      urgFlag:1,
      eceFlag:1,
      cwrFlag:1;

    // The size of the receive window, which specifies the number of window size units (by default, bytes) 
    uint16_t	windowSize;
    // The 16-bit checksum field is used for error-checking of the header and data 
    uint16_t	checksum;
    // If the URG flag is set, then this 16-bit field is an offset from the sequence number indicating the last urgent data byte 
    uint16_t	urgentPointer;
  } __attribute__((packed));
`);

const { length: baseLength } = TCPHeader.config;

const flagNames = ['reserved', 'cwr', 'ece', 'urg', 'ack', 'psh', 'rst', 'syn', 'fin'];
const flagKeys = flagNames.map(e => e + 'Flag');

/**
 * TCP protocol layer
 * @class
 * @implements {Layer}
 */
class TCP extends TCPHeader {
  name = 'TCP';

  constructor(data, opts = {}) {
    super(data);
    mixins.ctor(this, opts);

    if (!Buffer.isBuffer(data)) {
      if (data.options) {
        this.options = data.options;
      }
      if (data.flags) {
        this.flags = data.flags;
      }
    }

    this.length = this.dataOffset * 4;

    /**
     * TLV options;
     * @type {Iterable.<TLVOption>}
     */
    this.options;
  }

  static toAlloc = baseLength;
  static osi = OsiModelLayers.Transport;
  osi = OsiModelLayers.Transport;

  _prepareFlags() {
    const res = {};
    for (const flag of flagNames) {
      res[flag] = this[flag + 'Flag'];
    }
    return res;
  }

  get flags() {
    const self = this;
    return new Proxy(Object.seal(this._prepareFlags()), {
      get(target, prop, receiver) {
        return target[prop];
      },
      set(target, prop, value) {
        target[prop] = value;
        const internalKey = prop + 'Flag';
        if (self[internalKey] !== undefined) {
          self[internalKey] = value;
        }
      },
    });
  }

  set flags(obj) {
    for (const flag of flagNames) {
      if (obj[flag] !== undefined) {
        this[flag + 'Flag'] = obj[flag];
      }
    }
  }

  toObject() {
    return {
      ...omit(super.toObject(), ...flagKeys),
      flags: this.flags,
      options: [...this.options],
    };
  }

  /**
   * Calculates and updates the checksum for the TCP layer.
   * This method mutates the object by setting the `checksum` property
   * based on the current state of the `buffer` and `prev` field.
   */
  calculateChecksum() {
    this.checksum = checksums.pseudo({
      data: this.buffer,
      addrType: this.prev?.name ?? 'IPv4',
      src: this.prev?.src,
      dst: this.prev?.dst,
      protocolType: IPProtocolTypes.TCP,
    });
  }

  defaults(obj = {}, layers) {
    if (!obj.windowSize) {
      this.windowSize = 2048;
    }
    if (!obj.urgentPointer) {
      this.urgentPointer = 0;
    }
    if (!obj.dataOffset) {
      this.dataOffset = this.length / 4;
    }
    if (!obj.checksum) {
      this.calculateChecksum();
    }
  }

  nextProto(layers) {
    return new layers.Payload(this._buf.subarray(this.length));
  }
};

mixins.withOptions(TCP.prototype, { baseLength, skipTypes: [0x1, 0x0], lengthIsTotal: true });

module.exports = { TCP };
