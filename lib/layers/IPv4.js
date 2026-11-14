import { OsiModelLayers } from './osi.js';
import { IPProtocolTypes, IPv4OptionTypes } from './enums.js';
import converters from '#lib/converters';
const { ntohs } = converters;
import { makeLayer, attach, byField, constantsFrom } from './define.js';
import { ipv4Address } from './addr.js';
import { lengthAfter } from '#lib/layers/mixins';
import { LinkLayerType } from '#lib/enums';

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
    //@NE Internet Protocol version 4, RFC 791. Carries a packet between hosts. An awaited builder fills the source address, picks the interface from the routing table and adds the link layer.
    struct IPv4Header {
      // Header length in 32-bit words. Filled automatically.
      uint8_t headerLength:4;
      // Always 4.
      uint8_t version:4;
      // DSCP and ECN bits.
      uint8_t typeOfService;
      // Header plus everything after it, in bytes. Filled automatically.
      uint16_t totalLength;
      // Identification used to reassemble fragments.
      uint16_t id;
      //@LE Fragment flags and offset as one raw field.
      uint16_t fragmentOffsetRaw;
      // Hops the packet may still travel. 64 by default.
      uint8_t timeToLive;
      // Protocol of the next layer, one of ipv4.PROTOCOL_*. Filled from the layer that follows.
      uint8_t protocol;
      // Header checksum. Filled automatically.
      uint16_t checksum;
      // Source address. The address of the outgoing interface when awaited.
      uint32_t src;
      // Destination address.
      uint32_t dst;
    } __attribute__(packed);
  `, {
    osi: OsiModelLayers.Network,
    linktype: LinkLayerType.LINKTYPE_IPV4,
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
      return this.isFragment
        && ((this.fragmentOffsetFlags & IP_MORE_FRAGMENTS) === 0);
    },
  });
  attach.virtualField(proto, 'fragmentOffsetValue', {
    get() { return ntohs(this.fragmentOffsetRaw & 0xFF1F) * 8; },
  });

  attach.options.tlv8(Layer, proto, {
    baseLength,
    skipTypes: [IPv4OptionTypes.NOP, IPv4OptionTypes.EndOfOptionsList],
    lengthIsTotal: true,
  });

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
      return new layers.Payload(this._buf.subarray(this.length), { ...this.opts, prev: this });
    }
    if (this.protocol === IPProtocolTypes.IPIP) {
      const v = this.version;
      if (v === 4) return new layers.IPv4(this._buf.subarray(this.length), { ...this.opts, prev: this });
      if (v === 6) return new layers.IPv6(this._buf.subarray(this.length), { ...this.opts, prev: this });
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
    totalLength: ($) => $.length + lengthAfter($),
    protocol: dispatcher.reverseDefault(IPProtocolTypes.RAW),
  });

  Layer.OptionTypes = IPv4OptionTypes;

  return Layer;
})();

attach.docs(IPv4, {
  fields: {
    options: 'List of { type, value } options, types are ipv4.OPTION_*.',
  },
  constants: [
    {
      title: 'Next layer',
      field: 'protocol',
      values: constantsFrom(IPProtocolTypes, { prefix: 'PROTOCOL_', skip: ['IP', 'MAX'] }),
    },
    {
      title: 'Options',
      field: 'options[].type',
      values: constantsFrom(IPv4OptionTypes, { prefix: 'OPTION_', skip: ['Unknown'] }),
    },
    {
      title: 'Addresses',
      values: {
        BROADCAST: '255.255.255.255',
        LOOPBACK: '127.0.0.1',
        ANY: '0.0.0.0',
      },
    },
  ],
  example: "wire.packet().ipv4({ dst: '8.8.8.8', timeToLive: 3 }).icmp({ type: icmp.ECHO_REQUEST })",
});

export { IPv4 };
export default { IPv4 };
