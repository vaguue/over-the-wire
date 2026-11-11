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
    //@NE
    struct UDPHeader {
      uint16_t src;
      uint16_t dst;
      uint16_t totalLength;
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

export { UDP };
export default { UDP };
