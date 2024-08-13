const { compile, alignOffset } = require('struct-compile');
const { LinkLayerType } = require("#lib/enums");
const mixins = require("#lib/layers/mixins");
const { OsiModelLayers} = require("#lib/layers/osi");
const { macToString, macFromString } = require("#lib/layers/mac");
const { inetPton, inetNtop } = require('#lib/converters');

const OPCODE = {
  1: 'who-has',
  2: 'is-at'
};

const OPCODE_LOOKUP = Object.entries(OPCODE).reduce((acc, [numCode, stringCode]) => {
  acc[stringCode] = numCode;
  return acc;
}, {});

const { ARPHeader } = compile(`
  //@NE
  struct ARPHeader {
    // Hardware type (HTYPE)
    uint16_t hardwareType;
    // Protocol type (PTYPE)
    uint16_t protocolType;
    // Hardware address length (HLEN)
    uint8_t hardwareSize;
    // Protocol length (PLEN)
    uint8_t protocolSize;
    // Specifies the operation that the sender is performing: 1 (::ARP_REQUEST) for request, 2 (::ARP_REPLY) for reply
    uint16_t opcode;
    // Sender hardware address (SHA)
    uint8_t hardwareSrc[6];
    // @LE Sender protocol address (SPA)
    uint32_t protocolSrc;
    // Target hardware address (THA)
    uint8_t hardwareDst[6];
    // @LE Target protocol address (TPA)
    uint32_t protocolDst;
  } __attribute__(packed);
`);

/**
 * ARP protocol layer
 * @class
 * @implements {Layer}
 * @property {number} hardwareType - Hardware type (HTYPE)
 * @property {number} protocolType - Protocol type (PTYPE)
 * @property {number} hardwareSize - Hardware address length (HLEN)
 * @property {number} protocolSize - Protocol length (PLEN)
 * @property {'who-has' | 'is-at'} opcode - Specifies the operation that the sender is performing: 1 (::ARP_REQUEST) for request, 2 (::ARP_REPLY) for reply
 * @property {string} hardwareSrc - Sender hardware address (SHA)
 * @property {string} protocolSrc - Sender protocol address (SPA)
 * @property {string} hardwareDst - Target hardware address (THA)
 * @property {string} protocolDst - Target protocol address (TPA)
 */
class ARP extends ARPHeader {
  name = 'ARP';

  /**
   * @param {Buffer|Object} data - Input buffer or object with protocol fields.
   * @param {LayerOptions} opts - Options for the layer.
   */
  constructor(data = {}, opts = {}) {
    super(data);
    mixins.ctor(this, data, opts);
  }

  static toAlloc = () => ARPHeader.config.length;

  static osi = OsiModelLayers.DataLink;
  osi = OsiModelLayers.DataLink;

  /**
   * The source mac address in human-readable format.
   * @type {string}
   */
  get hardwareSrc() {
    return macToString(super.hardwareSrc);
  }

  set hardwareSrc(val) {
    super.hardwareSrc = macFromString(val);
  }

  /**
   * The destination mac address in human-readable format.
   * @type {string}
   */
  get hardwareDst() {
    return macToString(super.hardwareDst);
  }

  set hardwareDst(val) {
    super.hardwareDst = macFromString(val);
  }

  /**
   * The source internet address in human-readable format.
   * @type {string}
   */
  get protocolSrc() {
    return inetNtop(super.protocolSrc);
  }

  set protocolSrc(val) {
    super.protocolSrc = inetPton(val);
  }

  /**
   * The destination internet address in human-readable format.
   * @type {string}
   */
  get protocolDst() {
    return inetNtop(super.protocolDst);
  }

  set protocolDst(val) {
    super.protocolDst = inetPton(val);
  }

  /**
   * @return {'who-has' | 'is-at'}
   */
  get opcode() {
    return OPCODE[super.opcode];
  }

  set opcode(val) {
    super.opcode = OPCODE_LOOKUP[val];
  }

  toObject() {
    return {
      ...super.toObject(),
      hardwareSrc: this.hardwareSrc,
      hardwareDst: this.hardwareDst,
      protocolSrc: this.protocolSrc,
      protocolDst: this.protocolDst,
      opcode: this.opcode,
    };
  }

  defaults(obj, layers) {}

  nextProto(layers) {
    return layers.Payload(this.buffer.subarray(this.length), { ...this.opts, prev: this });
  }
};

module.exports = { ARP };
