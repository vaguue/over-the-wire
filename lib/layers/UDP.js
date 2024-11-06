const { compile } = require('struct-compile');
const { OsiModelLayers } = require('./osi');
const { IPProtocolTypes } = require('./enums');
const { checksums } = require('#lib/bindings');
const child = require('./child');
const mixins = require('./mixins');

const { UDPHeader } = compile(`
  //@NE
  struct UDPHeader {
    /** Source port */
    uint16_t src;
    /** Destination port */
    uint16_t dst;
    /** Length of header and payload in bytes */
    uint16_t totalLength;
    /**  Error-checking of the header and data */
    uint16_t checksum;
  };
`);

const { length: baseLength } = UDPHeader.prototype.config;

/**
 * UDP protocol layer
 * @class
 * @property {number} src - Source UDP port.
 * @property {number} dst - Destination UDP port.
 * @property {number} totalLength - This field specifies the length in bytes of the UDP datagram (the header fields and Data field) in octets.
 * @property {number} checksum - The 16-bit checksum field is used for error-checking of the header and data.
 * @implements {Layer}
 */
class UDP extends UDPHeader {
  name = 'UDP';

  constructor(data = {}, opts = {}) {
    super(data);
    mixins.ctor(this, data, opts);

    this.length = opts.allocated ?? this.totalLength * 4;

    /**
     * TLV options;
     * @type {Iterable.<TLVOption>}
     */
    this.options;
  }

  static toAlloc = (data) => baseLength;

  static osi = OsiModelLayers.Transport;
  osi = OsiModelLayers.Transport;

  /**
   * Retrieves all fields of the UDP layer.
   * @example
   * udp.toObject();
   * // {
   * //   src: 52622,
   * //   dst: 24043,
   * //   seq: 3994458414,
   * //   totalLength: 2048,
   * //   checksum: 3346,
   * // }
   * @returns {Object} The UDP layer fields as an object.
   */
  toObject() {
    return super.toObject();
  }

  /**
   * Calculates and updates the checksum for the UDP layer.
   * This method mutates the object by setting the `checksum` property
   * based on the current state of the `buffer` and `prev` field.
   */
  calculateChecksum() {
    console.log({
      data: this.buffer,
      addrType: this.prev?.name ?? 'IPv4',
      src: this.prev?.src,
      dst: this.prev?.dst,
      protocolType: IPProtocolTypes.UDP,
    })
    this.checksum = checksums.pseudo({
      data: this.buffer,
      addrType: this.prev?.name ?? 'IPv4',
      src: this.prev?.src,
      dst: this.prev?.dst,
      protocolType: IPProtocolTypes.UDP,
    });
  }

  defaults(obj = {}, layers) {
    if (!obj.totalLength) {
      this.totalLength = this.length / 4;
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

module.exports = { UDP };
