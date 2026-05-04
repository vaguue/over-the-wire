const { OsiModelLayers } = require('./osi');
const { IPProtocolTypes } = require('./enums');
const { inetPton, inetNtop } = require('#lib/converters');
const { AF_INET6 } = require('#lib/socket');
const { makeLayer, attach, byField } = require('./define');

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
    //@NE
    struct IPv6Header {
      uint32_t flowLabel:20, trafficClass:8, version:4;
      uint16_t payloadLength;
      uint8_t nextHeader;
      uint8_t hopLimit;
      uint8_t src[16];
      uint8_t dst[16];
    } __attribute__(packed);
  `, {
    osi: OsiModelLayers.Network,
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
    payloadLength: ($) => $.next?.length ?? 0,
    nextHeader: dispatcher.reverseDefault(IPProtocolTypes.RAW),
  });

  return Layer;
})();

module.exports = { IPv6 };
