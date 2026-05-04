const { OsiModelLayers } = require('./osi');
const { IPProtocolTypes } = require('./enums');
const { macToString, macFromString } = require('./mac');
const { makeLayer, attach } = require('./define');
const { ipv4Address } = require('./addr');

// C-string accessor over a fixed-size byte slot: read trims at the first
// null byte; write zero-fills the slot before copying the new value so
// stale bytes from a previous longer string don't leak through.
const fixedString = (offset, size) => ({
  get() {
    const slice = this._buf.subarray(offset, offset + size);
    const nullIdx = slice.indexOf(0);
    return slice.subarray(0, nullIdx >= 0 ? nullIdx : size).toString();
  },
  set(v) {
    const buf = Buffer.from(String(v));
    this._buf.fill(0, offset, offset + size);
    buf.copy(this._buf, offset, 0, Math.min(buf.length, size));
  },
});

/**
 * DHCP protocol layer
 * @class
 * @property {number} opCode - BootP opcode.
 * @property {number} hardwareType - Hardware type (1 = Ethernet).
 * @property {number} hardwareAddressLength - Hardware address length (6 = MAC).
 * @property {number} hops - Hop count.
 * @property {number} transactionId - DHCP transaction ID.
 * @property {string} clientIpAddress - Client IPv4 address (string form).
 * @property {string} yourIpAddress - Your IPv4 address (string form).
 * @property {number} serverIpAddress - Server IPv4 address as raw uint32.
 * @property {string} gatewayIpAddress - Gateway IPv4 address (string form).
 * @property {string} clientHardwareAddress - Client hardware address (MAC, first 6 bytes of 16).
 * @property {string} serverName - BootP server name (C-string).
 * @property {string} bootFilename - BootP boot file name (C-string).
 * @property {number} magicNumber - DHCP magic number (0x63825363).
 * @implements {Layer}
 */
const DHCP = (() => {
  const { Layer, proto, baseLength } = makeLayer('DHCP', `
    //@NE
    struct DHCPHeader {
      uint8_t opCode;
      uint8_t hardwareType;
      uint8_t hardwareAddressLength;
      uint8_t hops;
      uint32_t transactionId;
      uint16_t secondsElapsed;
      uint16_t flags;
      uint32_t clientIpAddress;
      uint32_t yourIpAddress;
      uint32_t serverIpAddress;
      uint32_t gatewayIpAddress;
      uint8_t clientHardwareAddress[16];
      uint8_t serverName[64];
      uint8_t bootFilename[128];
      uint32_t magicNumber;
    };
  `, {
    osi: OsiModelLayers.Transport,
    length: ($) => $.totalLength * 4,
  });

  attach.virtualField(proto, 'clientIpAddress', ipv4Address(12));
  attach.virtualField(proto, 'yourIpAddress', ipv4Address(16));
  attach.virtualField(proto, 'gatewayIpAddress', ipv4Address(24));

  attach.virtualField(proto, 'clientHardwareAddress', {
    get() { return macToString(this._buf.subarray(28, 34)); },
    set(v) {
      macFromString(v).copy(this._buf, 28);
      this._buf.fill(0, 34, 44);
    },
  });
  attach.virtualField(proto, 'serverName', fixedString(44, 64));
  attach.virtualField(proto, 'bootFilename', fixedString(108, 128));

  attach.toObjectExtras(proto, ['clientHardwareAddress', 'serverName', 'bootFilename']);

  attach.options.tlv8(Layer, proto, {
    baseLength,
    skipTypes: [0x1, 0x0],
    lengthIsTotal: true,
  });

  attach.checksum.pseudo(proto, IPProtocolTypes.DHCP);

  proto.nextProto = function nextProto(layers) {
    return new layers.Payload(this._buf.subarray(this.length));
  };

  attach.defaults(proto, {
    totalLength: ($) => $.length / 4,
  });

  return Layer;
})();

module.exports = { DHCP };
