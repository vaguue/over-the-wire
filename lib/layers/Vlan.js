import { OsiModelLayers } from './osi.js';
import { ETHERTYPE } from './enums.js';
import { makeLayer, attach, byField } from './define.js';

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
    //@NE VLAN tag, IEEE 802.1Q. A tag between the Ethernet header and the network layer that assigns the frame to a virtual network.
    struct VlanHeader {
      // Network identifier, 0 to 4095.
      uint16_t vid:12;
      // Drop eligible indicator.
      uint16_t dei:1;
      // Priority code point, 0 to 7.
      uint16_t pcp:3;
      // Protocol of the next layer, one of ethernet.TYPE_*.
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

export { Vlan };
export default { Vlan };
