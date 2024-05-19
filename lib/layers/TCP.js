const { compile } = require('struct-compile');
const { OsiModelLayers } = require('./osi');
const { IPProtocolTypes } = require('./enums');
const { AF_INET, inetPton, inetNtop, ntohs } = require('#lib/socket');
const { checksums } = require('#lib/bindings');
const child = require('./child');
const mixins = require('./mixins');
const { omit } = require('#lib/pick');
const { addField } = require('#lib/struct');

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

const { length: baseLength } = TCPHeader.prototype.config;

const flagNames = ['reserved', 'cwr', 'ece', 'urg', 'ack', 'psh', 'rst', 'syn', 'fin'];
const flagKeys = flagNames.map(e => e + 'Flag');


/**
 * @typedef {Object} TCPFlags
 * @property {number} reserved - Reserved flag (0 or 1).
 * @property {number} cwr - Congestion Window Reduced (0 or 1).
 * @property {number} ece - ECN-Echo (0 или 1).
 * @property {number} urg - Urgent pointer field significant (0 или 1).
 * @property {number} ack - Acknowledgment field significant (0 или 1).
 * @property {number} psh - Push Function (0 или 1).
 * @property {number} rst - Reset the connection (0 или 1).
 * @property {number} syn - Synchronize sequence numbers (0 или 1).
 * @property {number} fin - No more data from sender (0 или 1).
 */

/**
 * TCP protocol layer
 * @class
 * @property {number} osi - OSI model layer.
 * @property {Flags} flags - The flags object.
 * @property {number} src - Source TCP port.
 * @property {number} dst - Destination TCP port.
 * @property {number} seq - Sequence number.
 * @property {number} ack - Acknowledgment number.
 * @property {number} windowSize - The size of the receive window, which specifies the number of window size units (by default, bytes).
 * @property {number} checksum - The 16-bit checksum field is used for error-checking of the header and data.
 * @property {number} urgentPointer - If the URG flag is set, then this 16-bit field is an offset from the sequence number indicating the last urgent data byte.
 * @property {TCPFlags} flags - TCP flags.
 * @implements {Layer}
 */
class TCP extends TCPHeader {
  name = 'TCP';

  constructor(data, opts = {}) {
    super(data);
    mixins.ctor(this, data, opts);

    this.length = opts.allocated ?? this.dataOffset * 4;

    /**
     * TLV options;
     * @type {Iterable.<TLVOption>}
     */
    this.options;
  }

  static toAlloc = (data) => baseLength + TCP.prototype.optionsLength(data.options);
  static osi = OsiModelLayers.Transport;
  osi = OsiModelLayers.Transport;

  _prepareFlags() {
    const res = {};
    for (const flag of flagNames) {
      res[flag] = this[flag + 'Flag'];
    }
    return res;
  }

  /**
   * Get the flags object. Changes to this object will update the associated buffer.
   * @type {TCPFlags}
   */
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

  /**
   * Retrieves all fields of the TCP layer.
   * @example
   * tcp.toObject();
   * // {
   * //   src: 52622,
   * //   dst: 24043,
   * //   seq: 3994458414,
   * //   ack: 3198720281,
   * //   dataOffset: 8,
   * //   windowSize: 2048,
   * //   checksum: 3346,
   * //   urgentPointer: 0,
   * //   flags: {
   * //     reserved: 0,
   * //     cwr: 0,
   * //     ece: 0,
   * //     urg: 0,
   * //     ack: 1,
   * //     psh: 0,
   * //     rst: 0,
   * //     syn: 0,
   * //     fin: 0
   * //   },
   * //   options: [
   * //     { type: 1 },
   * //     { type: 1 },
   * //     { type: 8, recLength: 10, value: Buffer.from([0x52, 0xd3, 0xc6, 0x50, 0xdd, 0x04, 0xcd, 0xd6]) }
   * //   ],
   * // }
   * @returns {Object} The TCP layer fields as an object.
   */
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
  }

  checksums(obj) {
    if (!obj.checksum) {
      this.calculateChecksum();
    }
  }

  nextProto(layers) {
    return new layers.Payload(this._buf.subarray(this.length));
  }
};

addField(TCP.prototype, 'flags');

mixins.withOptions(TCP.prototype, { baseLength, skipTypes: [0x1, 0x0], lengthIsTotal: true });

module.exports = { TCP };
