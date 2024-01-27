const { compile } = require('struct-compile');
const { OsiModelLayers } = require('./osi');
const { TLV_8, TLVIterator, TLVSerialize } = require('./TLV');
const { IPv4OptionTypes, IPProtocolTypes } = require('./enums');
const { AF_INET, inetPton, inetNtop, ntohs } = require('../socket');
const { checksums } = require('../bindings');
const { extendAt, shrinkAt } = require('../buffer');

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
    uint16_t fragmentOffset;

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

class IPv4 extends IPv4Header {
  constructor(buf, { prev = null, extendAt, shrinkAt }) {
    super(buf);
    this.prev = prev;
    this.extendAt = extendAt;
    this.shrinkAt = shrinkAt;
    this.length = this.headerLength * 4;
    if (prev) {
      prev.next = this;
    }
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

  get fragmentFlags() {
    return this.fragmentOffset & 0xE0;
  }

  get isFragment() {
    return ((this.fragmentFlags & IP_MORE_FRAGMENTS) != 0 || this.fragmentOffset != 0);
  }

  get isFirstFragment() {
    return isFragment() && (this.fragmentOffset() == 0);
  }

  get isLastFragment() {
    return this.isFragment && ((this.fragmentFlags & IP_MORE_FRAGMENTS) == 0);
  }

  get fragmentOffset() {
    return ntohs(super.fragmentOffset & 0xFF1F) * 8;
  }

  defaults(obj = {}) {
    if (!obj.headerLength) {
      this.headerLength = 5;
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
      this.timeToLive = 4;
    }
    if (!obj.totalLength) {
      this.totalLength = this.length + (this.next?.length ?? 0);
    }
    if (!obj.checksum) {
      this.calculateChecksum();
    }
  }

  get options() {
    return new TLVIterator(TLV_8, this._buf.subarray(baseLength, this.headerLength * 4));
  }
  
  set options(opts) {
    const serialized = TLVSerialize(TLV_8, opts, 4);
    const diff = serialized.length - (this.headerLength * 4 - baseLength);
    if (diff > 0) {
      this.buffer = this.extendAt(this.headerLength * 4, diff);
    }
    else if (diff < 0) {
      this.buffer = this.shrinkAt(this.headerLength * 4, diff);
    }
    serialized.copy(this._buf, baseLength);
    this.headerLength = (baseLength + serialized.length) / 4;
  }

  nextProto(layers) {
    if (this.isFragment) {
      return new layers.Payload(this._buf.subarray(this.length), this);
    }
    switch (this.type) {
      case IPProtocolTypes.UDP:
        return new layers.UDP(this._buf.subarray(this.length), this);
      case IPProtocolTypes.TCP:
        return new layers.TCP(this._buf.subarray(this.length), this);
      case IPProtocolTypes.ICMP:
        return new layers.ICMP(this._buf.subarray(this.length), this);
      case IPProtocolTypes.IPIP:
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
      case IPProtocolTypes.GRE:
        return new layers.GRE(this._buf.subarray(this.length), this);
      case IPProtocolTypes.IGMP:
        return new layers.IGMP(this._buf.subarray(this.length), this);
      case IPProtocolTypes.AH:
        return new layers.AuthenticationHeader(this._buf.subarray(this.length), this);
      case IPProtocolTypes.ESP:
        return new layers.ESP(this._buf.subarray(this.length), this);
      case IPProtocolTypes.IPV6:
        return new layers.IPv6(this._buf.subarray(this.length), this);
      case IPProtocolTypes.VRRP:
        return new layers.VRRP(this._buf.subarray(this.length), this);
      default:
        return new layers.Payload(this._buf.subarray(this.length), this);
    }
  }
};

function test() {
  const buf = Buffer.from('450000730000400040068cd2c0a80167cebd1ce6e33d5debb394ef8ddd9ed0568018080', 'hex');
  const ip = new IPv4(buf, {
    shrinkAt(...args) {
      return shrinkAt(buf, ...args);
    },
    extendAt(...args) {
      return extendAt(buf, ...args);
    },
  });
  console.log('ip', ip.toObject());
  console.log('ip.length', ip.length);
  ip.checksum = 0;
  console.log(ip.buffer.subarray(0, baseLength));
  ip.calculateChecksum();
  console.log(ip.toObject());
  console.log(ip.isFragment);
  ip.dst = '192.168.1.1';
  console.log('ip', ip.toObject());
  console.log(ip.buffer);
  console.log([...ip.options], ip.buffer);
  ip.options = [
    { type: 1, recLength: 4, value: Buffer.from([0xaa, 0xaa, 0xaa, 0xaa]) },
    { type: 2, recLength: 2, value: Buffer.from([0xbb, 0xbb]) }
  ];
  console.log([...ip.options], ip.buffer);
  ip.options = [
    { type: 1, recLength: 4, value: Buffer.from([0xaa, 0xaa, 0xaa, 0xaa]) },
  ];
  console.log([...ip.options], ip.buffer);
}

if (require.main === module) {
  test();
}

module.exports = { IPv4, test };
