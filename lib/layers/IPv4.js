const { compile } = require('struct-compile');
const { OsiModelLayers } = require('./osi');
const { IPProtocolTypes, IPv4OptionTypes } = require('./enums');
const { AF_INET, inetPton, inetNtop, ntohs } = require('../socket');
const { checksums } = require('../bindings');
const child = require('./child');
const mixins = require('./mixins');

const IP_DONT_FRAGMENT  = 0x40;
const IP_MORE_FRAGMENTS = 0x20;

const { IPv4Header } = compile(`
  //@NE
  struct IPv4Header {
    //IP header length, has the value of 5 for IPv4
    uint8_t headerLength:4;

    //IP version number, has the value of 4 for IPv4
    uint8_t version:4;

    //type of service, same as Differentiated Services Code Point (DSCP)
    uint8_t typeOfService;

    //Entire packet (fragment) size, including header and data, in bytes
    uint16_t totalLength;

    //Identification field. Primarily used for uniquely identifying the group of fragments of a single IP datagram
    uint16_t id;

    //Fragment offset field, measured in units of eight-byte blocks (64 bits) @LE
    uint16_t fragmentOffsetRaw;

    //An eight-bit time to live field helps prevent datagrams from persisting (e.g. going in circles) on an internet.  In practice, the field has become a hop count 
    uint8_t timeToLive;

    //Defines the protocol used in the data portion of the IP datagram. Must be one of ::IPProtocolTypes 
    uint8_t protocol;

    //Error-checking of the header 
    uint16_t checksum;

    //@LE IPv4 address of the sender of the packet 
    uint32_t src;

    //@LE IPv4 address of the receiver of the packet 
    uint32_t dst;

    /*The options start here.*/
  } __attribute__(packed);
`);

const { length: baseLength } = IPv4Header.config;

const childProto = {
  [IPProtocolTypes.UDP]: 'UDP',
  [IPProtocolTypes.TCP]: 'TCP',
  [IPProtocolTypes.ICMP]: 'ICMP',
  [IPProtocolTypes.GRE]: 'GRE',
  [IPProtocolTypes.IGMP]: 'IGMP',
  [IPProtocolTypes.AH]: 'AuthenticationHeader',
  [IPProtocolTypes.ESP]: 'ESP',
  [IPProtocolTypes.IPV6]: 'IPv6',
  [IPProtocolTypes.VRRP]: 'VRRP',
};

const lookupChild = child.lookupChild(childProto);
const lookupKey = child.lookupKey(childProto);

class IPv4 extends IPv4Header {
  name = 'IPv4';

  constructor(buf, opts = {}) {
    super(buf);
    mixins.ctor(this, opts);
    this.length = this.headerLength * 4;
  }

  static length = baseLength;
  static osi = OsiModelLayers.Network;
  static OptionTypes = IPv4OptionTypes;
  osi = OsiModelLayers.Network;

  get src() {
    return inetNtop(AF_INET, super.src);
  }

  set src(val) {
    super.src = inetPton(AF_INET, val);
  }

  get dst() {
    return inetNtop(AF_INET, super.dst);
  }

  set dst(val) {
    super.dst = inetPton(AF_INET, val);
  }

  calculateChecksum() {
    this.checksum = checksums.ip(this.buffer.subarray(0, this.length));
  }

  get fragmentOffsetFlags() {
    return super.fragmentOffsetRaw & 0xE0;
  }

  get isFragment() {
    return ((this.fragmentOffsetFlags & IP_MORE_FRAGMENTS) != 0 || this.fragmentOffsetValue != 0);
  }

  get isFirstFragment() {
    return isFragment() && (this.fragmentOffsetValue == 0);
  }

  get isLastFragment() {
    return this.isFragment && ((this.fragmentOffsetFlags & IP_MORE_FRAGMENTS) == 0);
  }

  get fragmentOffsetValue() {
    return ntohs(super.fragmentOffsetRaw & 0xFF1F) * 8;
  }

  toObject() {
    return {
      ...super.toObject(),
      fragmentInfo: {
        isFragment: this.isFragment,
        value: this.fragmentOffsetValue,
        flags: this.fragmentOffsetFlags,
      }
    };
  }

  defaults(obj = {}, layers) {
    if (!obj.headerLength) {
      this.headerLength = this.length / 4;
    }
    if (!obj.version) {
      this.version = 4;
    }
    if (!obj.typeOfService) {
      this.typeOfService = 0;
    }
    if (!obj.id) {
      this.id = 0;
    }
    if (!obj.timeToLive) {
      this.timeToLive = 64;
    }
    if (!obj.totalLength) {
      this.totalLength = this.length + (this.next?.length ?? 0);
    }
    if (!obj.protocol) {
      if (!this.next) {
        this.protocol = IPProtocolTypes.RAW;
      }
      this.protocol = lookupKey(layers, this.next) ?? IPProtocolTypes.RAW;
    }
    if (!obj.checksum) {
      this.calculateChecksum();
    }
  }

  nextProto(layers) {
    if (this.isFragment) {
      return new layers.Payload(this._buf.subarray(this.length), this);
    }

    if (this.protocol == IPProtocolTypes.IPIP) {
      const { version } = this;
      if (version == 4) {
        return new layers.IPv4(this._buf.subarray(this.length), this);
      }
      else if (version == 6) {
        return new layers.IPv6(this._buf.subarray(this.length), this);
      }
      else {
        throw new Error(`Invalid IP version ${version}`);
      }
    }

    return lookupChild(layers, this.protocol, this);
  }
};

mixins.withOptions(IPv4.prototype, baseLength);

module.exports = { IPv4 };
