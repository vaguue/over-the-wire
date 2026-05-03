const { compile } = require('struct-compile');
const { OsiModelLayers } = require('./osi');
const { IPProtocolTypes } = require('./enums');
const { inetPton, inetNtop } = require('#lib/converters');
const { AF_INET6 } = require('#lib/socket');
const child = require('./child');
const mixins = require('./mixins');

const { IPv6Header } = compile(`
  //@NE
  struct IPv6Header {
    // First 32 bits: version (4) | trafficClass (8) | flowLabel (20)
    uint32_t flowLabel:20, trafficClass:8, version:4;

    // Length of payload following the IPv6 header, in bytes
    uint16_t payloadLength;

    // Identifies the type of header immediately following this header. Must be one of ::IPProtocolTypes
    uint8_t nextHeader;

    // Decremented by 1 by each forwarding node; packet discarded when reaches 0
    uint8_t hopLimit;

    // 128-bit source address
    uint8_t src[16];

    // 128-bit destination address
    uint8_t dst[16];
  } __attribute__(packed);
`);

const { length: baseLength } = IPv6Header.prototype.config;

const childProto = {
  [IPProtocolTypes.UDP]: 'UDP',
  [IPProtocolTypes.TCP]: 'TCP',
  [IPProtocolTypes.ICMP]: 'ICMP',
  [IPProtocolTypes.ICMPV6]: 'ICMPv6',
  [IPProtocolTypes.GRE]: 'GRE',
  [IPProtocolTypes.IGMP]: 'IGMP',
  [IPProtocolTypes.AH]: 'AuthenticationHeader',
  [IPProtocolTypes.ESP]: 'ESP',
  [IPProtocolTypes.IPV6]: 'IPv6',
  [IPProtocolTypes.VRRP]: 'VRRP',
};

const lookupChild = child.lookupChild(childProto);
const lookupKey = child.lookupKey(childProto);

/**
 * IPv6 protocol layer
 * @class
 * @implements {Layer}
 * @property {number} version - IP version, has the value of 6 for IPv6.
 * @property {number} trafficClass - Traffic class (DSCP + ECN), 8 bits.
 * @property {number} flowLabel - Flow label, 20 bits.
 * @property {number} payloadLength - Length of payload following the header in bytes.
 * @property {number} nextHeader - Next header type. Must be one of ::IPProtocolTypes.
 * @property {number} hopLimit - Hop limit, decremented by each forwarder.
 * @property {string} src - IPv6 source address in human-readable form.
 * @property {string} dst - IPv6 destination address in human-readable form.
 */
class IPv6 extends IPv6Header {
  name = 'IPv6';

  /**
   * @param {Buffer|Object} data - Input buffer or object with protocol fields.
   * @param {Object} opts - Options for the layer.
   */
  constructor(data = {}, opts = {}) {
    if (Buffer.isBuffer(data)) {
      super(data);
    }
    else {
      super(Buffer.alloc(IPv6.toAlloc(data)));
      this.merge(data);
    }
    mixins.ctor(this, data, opts);

    this.length = opts.allocated ?? baseLength;
  }

  static toAlloc = () => baseLength;

  static osi = OsiModelLayers.Network;
  osi = OsiModelLayers.Network;

  /**
   * The source IP address in human-readable format.
   * @type {string}
   */
  get src() {
    // struct-compile returns a "bound" view that breaks native helpers; subarray()
    // gives a real zero-copy Buffer view over the same memory.
    return inetNtop(AF_INET6, super.src.subarray());
  }

  set src(val) {
    super.src = inetPton(AF_INET6, val);
  }

  /**
   * The destination IP address in human-readable format.
   * @type {string}
   */
  get dst() {
    return inetNtop(AF_INET6, super.dst.subarray());
  }

  set dst(val) {
    super.dst = inetPton(AF_INET6, val);
  }

  toObject() {
    return {
      ...super.toObject(),
      src: this.src,
      dst: this.dst,
    };
  }

  defaults(obj = {}, layers) {
    if (!obj.version) {
      this.version = 6;
    }
    if (!obj.hopLimit) {
      this.hopLimit = 64;
    }
    if (!obj.trafficClass) {
      this.trafficClass = 0;
    }
    if (!obj.flowLabel) {
      this.flowLabel = 0;
    }
    if (!obj.payloadLength) {
      this.payloadLength = this.next?.length ?? 0;
    }
    if (!obj.nextHeader) {
      if (!this.next) {
        this.nextHeader = IPProtocolTypes.RAW;
      }
      else {
        this.nextHeader = lookupKey(layers, this.next) ?? IPProtocolTypes.RAW;
      }
    }
  }

  nextProto(layers) {
    return lookupChild(layers, this.nextHeader, this);
  }
};

module.exports = { IPv6 };
