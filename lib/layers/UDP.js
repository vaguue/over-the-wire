import { OsiModelLayers } from './osi.js';
import { IPProtocolTypes } from './enums.js';
import { makeLayer, attach, byPort } from './define.js';
import { lengthAfter } from '#lib/layers/mixins';

/**
 * UDP protocol layer
 * @class
 * @property {number} src - Source UDP port.
 * @property {number} dst - Destination UDP port.
 * @property {number} totalLength - Length in bytes of the UDP datagram (header + data).
 * @property {number} checksum - 16-bit checksum field for error-checking.
 * @implements {Layer}
 */
const UDP = (() => {
  const { Layer, proto } = makeLayer('UDP', `
    //@NE User Datagram Protocol, RFC 768. Datagrams between ports with no delivery guarantees. DNS, DHCP and NTP are recognised on their well-known ports.
    struct UDPHeader {
      // Source port.
      uint16_t src;
      // Destination port.
      uint16_t dst;
      // Header plus data in bytes. Filled automatically.
      uint16_t totalLength;
      // Checksum over the datagram and the IP pseudo header. Filled automatically.
      uint16_t checksum;
    };
  `, {
    osi: OsiModelLayers.Transport,
  });

  // Well-known UDP port -> child layer name. Either source or destination
  // matches; destination wins when both match (typical client-to-server).
  attach.dispatch(proto, byPort({
    53: 'DNS',
    67: 'DHCP',
    68: 'DHCP',
    123: 'NTP',
    5353: 'DNS', // mDNS reuses the DNS message format (RFC 6762).
  }));

  attach.checksum.pseudo(proto, IPProtocolTypes.UDP);

  attach.defaults(proto, {
    totalLength: ($) => $.length + lengthAfter($),
  });

  return Layer;
})();

attach.docs(UDP, {
  constants: [
    {
      title: 'Well-known ports',
      field: 'src, dst',
      values: {
        PORT_DISCARD: 9,
        PORT_DNS: 53,
        PORT_DHCP_SERVER: 67,
        PORT_DHCP_CLIENT: 68,
        PORT_NTP: 123,
        PORT_MDNS: 5353,
      },
    },
  ],
  example: "wire.filter().udp({ port: udp.PORT_DNS })",
});

export { UDP };
export default { UDP };
