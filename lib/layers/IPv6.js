import { OsiModelLayers } from './osi.js';
import { IPProtocolTypes } from './enums.js';
import converters from '#lib/converters';
const { inetPton, inetNtop } = converters;
import socket from '#lib/socket';
const { AF_INET6 } = socket;
import { makeLayer, attach, byField, constantsFrom } from './define.js';
import { lengthAfter } from '#lib/layers/mixins';
import { LinkLayerType } from '#lib/enums';

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
const IPv6 = (() => {
  const { Layer, proto } = makeLayer('IPv6', `
    //@NE Internet Protocol version 6, RFC 8200. Carries a packet between hosts over 128-bit addresses.
    struct IPv6Header {
      // Label shared by the packets of one flow, 20 bits.
      uint32_t flowLabel:20;
      // DSCP and ECN bits.
      uint32_t trafficClass:8;
      // Always 6.
      uint32_t version:4;
      // Bytes after the header. Filled automatically.
      uint16_t payloadLength;
      // Protocol of the next layer, one of ipv6.NEXT_HEADER_*. Filled from the layer that follows.
      uint8_t nextHeader;
      // Hops the packet may still travel.
      uint8_t hopLimit;
      // Source address.
      uint8_t src[16];
      // Destination address.
      uint8_t dst[16];
    } __attribute__(packed);
  `, {
    osi: OsiModelLayers.Network,
    linktype: LinkLayerType.LINKTYPE_IPV6,
  });

  attach.virtualField(proto, 'src', {
    get() { return inetNtop(AF_INET6, this._buf.subarray(8, 24)); },
    set(v) { inetPton(AF_INET6, v).copy(this._buf, 8); },
  });
  attach.virtualField(proto, 'dst', {
    get() { return inetNtop(AF_INET6, this._buf.subarray(24, 40)); },
    set(v) { inetPton(AF_INET6, v).copy(this._buf, 24); },
  });
  attach.toObjectExtras(proto, ['src', 'dst']);

  const dispatcher = byField('nextHeader', {
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
  });
  attach.dispatch(proto, dispatcher);
  attach.defaults(proto, {
    version: 6,
    hopLimit: 64,
    trafficClass: 0,
    flowLabel: 0,
    payloadLength: ($) => lengthAfter($),
    nextHeader: dispatcher.reverseDefault(IPProtocolTypes.RAW),
  });

  return Layer;
})();

attach.docs(IPv6, {
  constants: [
    {
      title: 'Next layer',
      field: 'nextHeader',
      values: constantsFrom(IPProtocolTypes, { prefix: 'NEXT_HEADER_', skip: ['IP', 'MAX', 'RAW'] }),
    },
    {
      title: 'Addresses',
      values: {
        LOOPBACK: '::1',
        ANY: '::',
        ALL_NODES: 'ff02::1',
        ALL_ROUTERS: 'ff02::2',
      },
    },
  ],
  example: "wire.packet().ipv6({ dst: ipv6.ALL_NODES }).icmpv6({ type: icmpv6.ECHO_REQUEST })",
});

export { IPv6 };
export default { IPv6 };
