const { OsiModelLayers } = require('./osi');
const { ETHERTYPE } = require('./enums');
const { makeLayer, attach, byField } = require('./define');

/**
 * IEEE 802.1Q VLAN tag layer
 * @class
 * @implements {Layer}
 * @property {number} vid - 12-bit VLAN identifier (0..4095).
 * @property {number} dei - Drop Eligible Indicator (0 or 1).
 * @property {number} pcp - Priority Code Point (0..7).
 * @property {number} etherType - EtherType of the encapsulated payload.
 */
const Vlan = (() => {
  const { Layer, proto } = makeLayer('Vlan', `
    //@NE
    struct VlanHeader {
      uint16_t vid:12;
      uint16_t dei:1;
      uint16_t pcp:3;
      uint16_t etherType;
    } __attribute__(packed);
  `, {
    osi: OsiModelLayers.DataLink,
  });

  const dispatcher = byField('etherType', {
    [ETHERTYPE.IP]: 'IPv4',
    [ETHERTYPE.IPV6]: 'IPv6',
    [ETHERTYPE.ARP]: 'ARP',
    [ETHERTYPE.VLAN]: 'Vlan',
    [ETHERTYPE.IEEE_802_1AD]: 'Vlan',
    [ETHERTYPE.MPLS]: 'Mpls',
    [ETHERTYPE.PPPOES]: 'PPPoESession',
    [ETHERTYPE.PPPOED]: 'PPPoEDiscovery',
    [ETHERTYPE.WAKE_ON_LAN]: 'WakeOnLanLayer',
  });
  attach.dispatch(proto, dispatcher);
  attach.defaults(proto, {
    pcp: 0,
    dei: 0,
    etherType: dispatcher.reverseDefault(ETHERTYPE.IP),
  });

  return Layer;
})();

module.exports = { Vlan };
