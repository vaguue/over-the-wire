const { compile } = require('struct-compile');
const { OsiModelLayers } = require('./osi');
const { IPProtocolTypes } = require('./enums');
const { inetPton, inetNtop, ntohs } = require('#lib/converters');
const { AF_INET } = require('#lib/socket');
const { checksums } = require('#lib/bindings');
const child = require('./child');
const mixins = require('./mixins');
const { macToString, macFromString } = require('./mac');

const { DHCPHeader } = compile(`
  //@NE
  struct DHCPHeader {
    /** BootP opcode */
    uint8_t opCode;
    /** Hardware type, set to 1 (Ethernet) by default */
    uint8_t hardwareType;
    /** Hardware address length, set to 6 (MAC address length) by default */
    uint8_t hardwareAddressLength;
    /** Hop count */
    uint8_t hops;
    /** DHCP/BootP transaction ID */
    uint32_t transactionId;
    /** The elapsed time, in seconds since the client sent its first BOOTREQUEST message */
    uint16_t secondsElapsed;
    /** BootP flags */
    uint16_t flags;
    /** Client IPv4 address */
    uint32_t clientIpAddress;
    /** Your IPv4 address */
    uint32_t yourIpAddress;
    /** Server IPv4 address */
    uint32_t serverIpAddress;
    /** Gateway IPv4 address */
    uint32_t gatewayIpAddress;
    /** Client hardware address, by default contains the MAC address (only 6 first bytes are used) */
    uint8_t clientHardwareAddress[16];
    /** BootP server name */
    uint8_t serverName[64];
    /** BootP boot file name */
    uint8_t bootFilename[128];
    /** DHCP magic number (set to the default value of 0x63538263) */
    uint32_t magicNumber;
  };
`);

const { length: baseLength } = DHCPHeader.prototype.config;

/**
 * DHCP protocol layer
 * @class
 * @property {number} src - Source DHCP port.
 * @property {number} dst - Destination DHCP port.
 * @property {number} totalLength - This field specifies the length in bytes of the DHCP datagram (the header fields and Data field) in octets.
 * @property {number} checksum - The 16-bit checksum field is used for error-checking of the header and data.
 * @implements {Layer}
 */
class DHCP extends DHCPHeader {
  name = 'DHCP';

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

  /**
   * The destination IP address in human-readable format.
   * @type {string}
   */
  get clientIpAddress() {
    return inetNtop(AF_INET, super.clientIpAddress);
  }

  set clientIpAddress(val) {
    super.clientIpAddress = inetPton(AF_INET, val);
  }

  /**
   * The destination IP address in human-readable format.
   * @type {string}
   */
  get yourIpAddress() {
    return inetNtop(AF_INET, super.yourIpAddress);
  }

  set yourIpAddress(val) {
    super.yourIpAddress = inetPton(AF_INET, val);
  }

  /**
   * The destination IP address in human-readable format.
   * @type {string}
   */
  get gatewayIpAddress() {
    return inetNtop(AF_INET, super.gatewayIpAddress);
  }

  set gatewayIpAddress(val) {
    super.gatewayIpAddress = inetPton(AF_INET, val);
  }

  /**
   * Usually the client MAC
   * @type {string}
   */
  get clientHardwareAddress() {
    return macToString(super.clientHardwareAddress.slice(0, 6));
  }

  set clientHardwareAddress(val) {
    super.clientHardwareAddress = Buffer.concat([macFromString(val), Buffer.from(Array.from({ length: 10 }, () => 0))]);
  }

  /**
   * BootP server name.
   * @type {string}
   */
  get serverName() {
    const buf = Buffer.from(super.serverName);
    return buf.subarray(0, buf.indexOf(0)).toString();
  }

  set serverName(val) {
    const buf = Buffer.from(val);
    super.serverName = Buffer.concat([buf, Buffer.alloc(64 - buf.length)]);
  }

  /**
   * BootP boot file name.
   * @type {string}
   */
  get bootFilename() {
    const buf = Buffer.from(super.bootFilename);
    return buf.subarray(0, buf.indexOf(0)).toString();
  }

  set bootFilename(val) {
    const buf = Buffer.from(val);
    super.bootFilename = Buffer.concat([buf, Buffer.alloc(64 - buf.length)]);
  }

  static toAlloc = (data) => baseLength;

  static osi = OsiModelLayers.Transport;
  osi = OsiModelLayers.Transport;

  /**
   * Retrieves all fields of the DHCP layer.
   * @example
   * udp.toObject();
   * // {
   * //   src: 52622,
   * //   dst: 24043,
   * //   seq: 3994458414,
   * //   totalLength: 2048,
   * //   checksum: 3346,
   * // }
   * @returns {Object} The DHCP layer fields as an object.
   */
  toObject() {
    return {
      ...super.toObject(),
      clientHardwareAddress: this.clientHardwareAddress,
      serverName: this.serverName,
      bootFilename: this.bootFilename,
    };
  }

  /**
   * Calculates and updates the checksum for the DHCP layer.
   * This method mutates the object by setting the `checksum` property
   * based on the current state of the `buffer` and `prev` field.
   */
  calculateChecksum() {
    this.checksum = checksums.pseudo({
      data: this.buffer,
      addrType: this.prev?.name ?? 'IPv4',
      src: this.prev?.src,
      dst: this.prev?.dst,
      protocolType: IPProtocolTypes.DHCP,
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

mixins.withOptions(DHCP.prototype, { baseLength, skipTypes: [0x1, 0x0], lengthIsTotal: true });

module.exports = { DHCP };
