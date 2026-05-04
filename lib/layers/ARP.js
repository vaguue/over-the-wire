const { OsiModelLayers } = require('./osi');
const { ETHERTYPE } = require('./enums');
const { makeLayer, attach } = require('./define');
const { macAddress, ipv4Address } = require('./addr');

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
    //@NE
    struct ARPHeader {
      uint16_t hardwareType;
      uint16_t protocolType;
      uint8_t hardwareLength;
      uint8_t protocolLength;
      uint16_t opcode;
      uint8_t hardwareSrc[6];
      //@LE
      uint32_t protocolSrc;
      uint8_t hardwareDst[6];
      //@LE
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

module.exports = { ARP };
