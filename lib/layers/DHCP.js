import { OsiModelLayers } from './osi.js';
import { macToString, macFromString } from './mac.js';
import { makeLayer, attach } from './define.js';
import { ipv4Address } from './addr.js';

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
const DHCP_PAD_OPTION = 0;
const DHCP_END_OPTION = 255;

const DHCP = (() => {
  const { Layer, proto, baseLength } = makeLayer('DHCP', `
    //@NE Dynamic Host Configuration Protocol, RFC 2131. Hands out addresses and network settings. Recognised under UDP on ports 67 and 68.
    struct DHCPHeader {
      // dhcp.BOOT_REQUEST from a client, dhcp.BOOT_REPLY from a server.
      uint8_t opCode;
      // Kind of hardware address, 1 for Ethernet.
      uint8_t hardwareType;
      // Length of the hardware address, 6 for Ethernet.
      uint8_t hardwareAddressLength;
      // Relay agents passed.
      uint8_t hops;
      // Identifier shared by the messages of one exchange.
      uint32_t transactionId;
      // Seconds since the client started.
      uint16_t secondsElapsed;
      // Bit 15 asks for a broadcast reply.
      uint16_t flags;
      // Address the client already has.
      uint32_t clientIpAddress;
      // Address offered to the client.
      uint32_t yourIpAddress;
      // Address of the next server to use.
      uint32_t serverIpAddress;
      // Address of the relay agent.
      uint32_t gatewayIpAddress;
      // Hardware address of the client.
      uint8_t clientHardwareAddress[16];
      // Optional server host name.
      uint8_t serverName[64];
      // Optional boot file name.
      uint8_t bootFilename[128];
      // Always dhcp.MAGIC_NUMBER.
      uint32_t magicNumber;
    };
  `, {
    osi: OsiModelLayers.Application,
    length: ($) => $._buf.length,
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
    skipTypes: [DHCP_PAD_OPTION, DHCP_END_OPTION],
    lengthIsTotal: false,
    align: null,
  });

  proto.nextProto = function nextProto(layers) {
    return new layers.Payload(this._buf.subarray(this.length));
  };

  return Layer;
})();

attach.docs(DHCP, {
  fields: {
    options: 'List of { type, value } options, types are dhcp.OPTION_*.',
  },
  constants: [
    {
      title: 'Ports',
      values: {
        SERVER_PORT: 67,
        CLIENT_PORT: 68,
      },
    },
    {
      title: 'Operations',
      field: 'opCode',
      values: {
        BOOT_REQUEST: 1,
        BOOT_REPLY: 2,
      },
    },
    {
      title: 'Options',
      field: 'options[].type',
      values: {
        OPTION_SUBNET_MASK: 1,
        OPTION_ROUTER: 3,
        OPTION_DNS_SERVERS: 6,
        OPTION_HOST_NAME: 12,
        OPTION_REQUESTED_ADDRESS: 50,
        OPTION_LEASE_TIME: 51,
        OPTION_MESSAGE_TYPE: 53,
        OPTION_SERVER_IDENTIFIER: 54,
        OPTION_PARAMETER_REQUEST_LIST: 55,
        OPTION_CLIENT_IDENTIFIER: 61,
      },
    },
    {
      title: 'Values of OPTION_MESSAGE_TYPE',
      values: {
        DISCOVER: 1,
        OFFER: 2,
        REQUEST: 3,
        DECLINE: 4,
        ACK: 5,
        NAK: 6,
        RELEASE: 7,
        INFORM: 8,
      },
    },
    {
      title: 'Other',
      values: {
        MAGIC_NUMBER: 0x63825363,
      },
    },
  ],
});

export { DHCP };
export default { DHCP };
