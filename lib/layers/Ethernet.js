import { LinkLayerType } from '../enums.js';
import { ETHERTYPE } from './enums.js';
import { OsiModelLayers } from './osi.js';
import { macToString, macFromString } from './mac.js';
import { makeLayer, attach, byField } from './define.js';

/**
 * Ethernet protocol layer
 * @class
 * @implements {Layer}
 * @property {string} src - Source MAC address.
 * @property {string} dst - Destination MAC address.
 * @property {number} type - Protocol type.
 */
const Ethernet = (() => {
  const { Layer, proto } = makeLayer('Ethernet', `
    //@NE
    struct EthernetHeader {
      uint8_t dst[6];
      uint8_t src[6];
      uint16_t type;
    } __attribute__(packed);
  `, {
    osi: OsiModelLayers.DataLink,
    linktype: LinkLayerType.LINKTYPE_ETHERNET,
  });

  attach.virtualField(proto, 'dst', {
    get() { return macToString(this._buf.subarray(0, 6)); },
    set(v) { macFromString(v).copy(this._buf, 0); },
  });
  attach.virtualField(proto, 'src', {
    get() { return macToString(this._buf.subarray(6, 12)); },
    set(v) { macFromString(v).copy(this._buf, 6); },
  });
  attach.toObjectExtras(proto, ['src', 'dst']);

  const dispatcher = byField('type', {
    [ETHERTYPE.IP]: 'IPv4',
    [ETHERTYPE.IPV6]: 'IPv6',
    [ETHERTYPE.ARP]: 'ARP',
    [ETHERTYPE.VLAN]: 'Vlan',
    [ETHERTYPE.IEEE_802_1AD]: 'Vlan',
    [ETHERTYPE.PPPOES]: 'PPPoESession',
    [ETHERTYPE.PPPOED]: 'PPPoEDiscovery',
    [ETHERTYPE.MPLS]: 'Mpls',
    [ETHERTYPE.WAKE_ON_LAN]: 'WakeOnLanLayer',
  });
  attach.dispatch(proto, dispatcher);
  attach.defaults(proto, {
    type: dispatcher.reverseDefault(ETHERTYPE.IP),
  });

  return Layer;
})();

export { Ethernet };
export default { Ethernet };
