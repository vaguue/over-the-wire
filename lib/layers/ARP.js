import { OsiModelLayers } from './osi.js';
import { ETHERTYPE } from './enums.js';
import { makeLayer, attach } from './define.js';
import { macAddress, ipv4Address } from './addr.js';

const OPCODE = {
  1: 'who-has',
  2: 'is-at',
};

const OPCODE_LOOKUP = Object.entries(OPCODE).reduce((acc, [numCode, stringCode]) => {
  acc[stringCode] = Number(numCode);
  return acc;
}, {});

/**
 * ARP protocol layer
 * @class
 * @implements {Layer}
 * @property {number} hardwareType - Hardware type (HTYPE)
 * @property {number} protocolType - Protocol type (PTYPE)
 * @property {number} hardwareLength - Hardware address length (HLEN)
 * @property {number} protocolLength - Protocol length (PLEN)
 * @property {'who-has' | 'is-at'} opcode - Operation: 1 (request) for `who-has`, 2 (reply) for `is-at`.
 * @property {string} hardwareSrc - Sender hardware address (SHA)
 * @property {string} protocolSrc - Sender protocol address (SPA)
 * @property {string} hardwareDst - Target hardware address (THA)
 * @property {string} protocolDst - Target protocol address (TPA)
 */
const ARP = (() => {
  const { Layer, proto } = makeLayer('ARP', `
    //@NE Address Resolution Protocol, RFC 826. Finds the hardware address that owns an IPv4 address on the local network.
    struct ARPHeader {
      // Kind of hardware address, arp.HARDWARE_ETHERNET by default.
      uint16_t hardwareType;
      // Kind of protocol address, IPv4 by default.
      uint16_t protocolType;
      // Length of a hardware address in bytes.
      uint8_t hardwareLength;
      // Length of a protocol address in bytes.
      uint8_t protocolLength;
      // arp.WHO_HAS for a request, arp.IS_AT for a reply.
      uint16_t opcode;
      // Hardware address of the sender.
      uint8_t hardwareSrc[6];
      //@LE IPv4 address of the sender.
      uint32_t protocolSrc;
      // Hardware address of the target, zeros in a request.
      uint8_t hardwareDst[6];
      //@LE IPv4 address being asked about.
      uint32_t protocolDst;
    } __attribute__(packed);
  `, {
    osi: OsiModelLayers.DataLink,
  });

  attach.virtualField(proto, 'hardwareSrc', macAddress(8));
  attach.virtualField(proto, 'hardwareDst', macAddress(18));
  attach.virtualField(proto, 'protocolSrc', ipv4Address(14));
  attach.virtualField(proto, 'protocolDst', ipv4Address(24));
  attach.virtualField(proto, 'opcode', {
    get() { return OPCODE[this._buf.readUInt16BE(6)]; },
    set(v) { this._buf.writeUInt16BE(Number(OPCODE_LOOKUP[v]) | 0, 6); },
  });
  attach.toObjectExtras(proto, ['hardwareSrc', 'hardwareDst', 'protocolSrc', 'protocolDst', 'opcode']);

  attach.defaults(proto, {
    hardwareType: 1,
    hardwareLength: 6,
    protocolType: ETHERTYPE.IP,
    protocolLength: 4,
  });

  return Layer;
})();

attach.docs(ARP, {
  constants: [
    {
      title: 'Operations',
      field: 'opcode',
      values: {
        WHO_HAS: 'who-has',
        IS_AT: 'is-at',
      },
    },
    {
      title: 'Hardware types',
      field: 'hardwareType',
      values: {
        HARDWARE_ETHERNET: 1,
      },
    },
  ],
  example: "wire.filter().arp({ opcode: arp.IS_AT, protocolSrc: '192.168.1.1' })",
});

export { ARP };
export default { ARP };
