const { OsiModelLayers } = require('./osi');
const { IPProtocolTypes, IPv4OptionTypes } = require('./enums');
const { ntohs } = require('#lib/converters');
const { makeLayer, attach, byField } = require('./define');
const { ipv4Address } = require('./addr');

const IP_MORE_FRAGMENTS = 0x20;

/**
 * IPv4 protocol layer
 * @class
 * @implements {Layer}
 * @property {number} headerLength - IP header length, has the value of 5 for IPv4.
 * @property {number} version - IP version number, has the value of 4 for IPv4.
 * @property {number} typeOfService - Type of service / DSCP.
 * @property {number} totalLength - Entire packet (fragment) size, including header and data, in bytes.
 * @property {number} id - Identification field used for fragmentation.
 * @property {number} fragmentOffsetRaw - Fragment offset field (raw, includes flags) @LE.
 * @property {number} timeToLive - Hop count.
 * @property {number} protocol - Encapsulated protocol number (one of IPProtocolTypes).
 * @property {number} checksum - Header checksum.
 * @property {string} src - IPv4 address of the sender.
 * @property {string} dst - IPv4 address of the receiver.
 */
const IPv4 = (() => {
  const { Layer, proto, baseLength } = makeLayer('IPv4', `
    //@NE
    struct IPv4Header {
      uint8_t headerLength:4;
      uint8_t version:4;
      uint8_t typeOfService;
      uint16_t totalLength;
      uint16_t id;
      //@LE
      uint16_t fragmentOffsetRaw;
      uint8_t timeToLive;
      uint8_t protocol;
      uint16_t checksum;
      uint32_t src;
      uint32_t dst;
    } __attribute__(packed);
  `, {
    osi: OsiModelLayers.Network,
    length: ($) => $.headerLength * 4,
  });

  attach.virtualField(proto, 'src', ipv4Address(12));
  attach.virtualField(proto, 'dst', ipv4Address(16));
  attach.toObjectExtras(proto, ['src', 'dst']);

  attach.virtualField(proto, 'fragmentOffsetFlags', {
    get() { return this.fragmentOffsetRaw & 0xE0; },
  });
  attach.virtualField(proto, 'isFragment', {
    get() {
      return ((this.fragmentOffsetFlags & IP_MORE_FRAGMENTS) !== 0)
        || this.fragmentOffsetValue !== 0;
    },
  });
  attach.virtualField(proto, 'isFirstFragment', {
    get() { return this.isFragment && (this.fragmentOffsetValue === 0); },
  });
  attach.virtualField(proto, 'isLastFragment', {
    get() {
      return this.isFragment()
        && ((this.fragmentOffsetFlags & IP_MORE_FRAGMENTS) === 0);
    },
  });
  attach.virtualField(proto, 'fragmentOffsetValue', {
    get() { return ntohs(this.fragmentOffsetRaw & 0xFF1F) * 8; },
  });

  attach.options.tlv8(Layer, proto, { baseLength });

  const previousToObject = proto.toObject;
  proto.toObject = function() {
    return {
      ...previousToObject.call(this),
      fragmentInfo: {
        isFragment: this.isFragment,
        value: this.fragmentOffsetValue,
        flags: this.fragmentOffsetFlags,
      },
    };
  };

  attach.checksum.ip(proto);

  const dispatcher = byField('protocol', {
    [IPProtocolTypes.UDP]: 'UDP',
    [IPProtocolTypes.TCP]: 'TCP',
    [IPProtocolTypes.ICMP]: 'ICMP',
    [IPProtocolTypes.GRE]: 'GRE',
    [IPProtocolTypes.IGMP]: 'IGMP',
    [IPProtocolTypes.AH]: 'AuthenticationHeader',
    [IPProtocolTypes.ESP]: 'ESP',
    [IPProtocolTypes.IPV6]: 'IPv6',
    [IPProtocolTypes.VRRP]: 'VRRP',
  });
  attach.dispatch(proto, dispatcher);

  const baseNextProto = proto.nextProto;

  proto.nextProto = function nextProto(layers) {
    if (this.isFragment) {
      return new layers.Payload(this._buf.subarray(this.length), this);
    }
    if (this.protocol === IPProtocolTypes.IPIP) {
      const v = this.version;
      if (v === 4) return new layers.IPv4(this._buf.subarray(this.length), this);
      if (v === 6) return new layers.IPv6(this._buf.subarray(this.length), this);
      throw new Error(`Invalid IP version ${v}`);
    }
    return baseNextProto.call(this, layers);
  };

  attach.defaults(proto, {
    version: 4,
    headerLength: ($) => $.length / 4,
    typeOfService: 0,
    id: 0,
    timeToLive: 64,
    totalLength: ($) => $.length + ($.next?.length ?? 0),
    protocol: dispatcher.reverseDefault(IPProtocolTypes.RAW),
  });

  Layer.OptionTypes = IPv4OptionTypes;

  return Layer;
})();

module.exports = { IPv4 };
