import { OsiModelLayers } from './osi.js';
import { IPProtocolTypes } from './enums.js';
import { addField } from '#lib/struct';
import { makeLayer, attach } from './define.js';

const flagNames = ['reserved', 'cwr', 'ece', 'urg', 'ack', 'psh', 'rst', 'syn', 'fin'];
const flagKeys = flagNames.map(e => e + 'Flag');

/**
 * @typedef {Object} TCPFlags
 * @property {number} reserved - Reserved flag (0 or 1).
 * @property {number} cwr - Congestion Window Reduced.
 * @property {number} ece - ECN-Echo.
 * @property {number} urg - Urgent pointer field significant.
 * @property {number} ack - Acknowledgment field significant.
 * @property {number} psh - Push Function.
 * @property {number} rst - Reset the connection.
 * @property {number} syn - Synchronize sequence numbers.
 * @property {number} fin - No more data from sender.
 */

/**
 * TCP protocol layer
 * @class
 * @property {number} src - Source TCP port.
 * @property {number} dst - Destination TCP port.
 * @property {number} seq - Sequence number.
 * @property {number} ack - Acknowledgment number.
 * @property {number} windowSize - Receive window size.
 * @property {number} checksum - Header + data checksum.
 * @property {number} urgentPointer - Urgent data byte offset (when URG is set).
 * @property {TCPFlags} flags - TCP flags.
 * @implements {Layer}
 */
const TCP = (() => {
  const { Layer, proto, baseLength } = makeLayer('TCP', `
    //@NE Transmission Control Protocol, RFC 9293. Reliable byte streams between ports. Packets built here are single segments: the host stack does not know about them and does not keep the connection.
    struct TCPHeader {
      // Source port.
      uint16_t src;
      // Destination port.
      uint16_t dst;
      // Sequence number.
      uint32_t seq;
      // Acknowledgment number.
      uint32_t ack;
      //@LE
      uint16_t reservedFlag:4;
      //@LE Header length in 32-bit words. Filled automatically.
      uint16_t dataOffset:4;
      //@LE
      uint16_t finFlag:1;
      //@LE
      uint16_t synFlag:1;
      //@LE
      uint16_t rstFlag:1;
      //@LE
      uint16_t pshFlag:1;
      //@LE
      uint16_t ackFlag:1;
      //@LE
      uint16_t urgFlag:1;
      //@LE
      uint16_t eceFlag:1;
      //@LE
      uint16_t cwrFlag:1;
      // Receive window. 2048 by default.
      uint16_t windowSize;
      // Checksum over the segment and the IP pseudo header. Filled automatically.
      uint16_t checksum;
      // Offset of urgent data when the urg flag is set.
      uint16_t urgentPointer;
    } __attribute__((packed));
  `, {
    osi: OsiModelLayers.Transport,
    length: ($) => $.dataOffset * 4,
  });

  // The `flags` virtual field exposes the 9 *Flag bit fields as a single
  // mutable object. Reads delegate to struct setters/getters via prototype
  // chain so writes through the Proxy stay in sync with the underlying
  // bit-packed field.
  attach.virtualField(proto, 'flags', {
    get() {
      const self = this;
      const target = {};
      for (const flag of flagNames) target[flag] = self[flag + 'Flag'];
      return new Proxy(Object.seal(target), {
        get(t, prop) { return t[prop]; },
        set(t, prop, value) {
          t[prop] = value;
          const internalKey = prop + 'Flag';
          if (self[internalKey] !== undefined) self[internalKey] = value;
          return true;
        },
      });
    },
    set(obj) {
      for (const flag of flagNames) {
        if (obj[flag] !== undefined) this[flag + 'Flag'] = obj[flag];
      }
    },
  });

  // TLV options (NOP/EOL skipped, length-is-total-record per RFC 793).
  attach.options.tlv8(Layer, proto, {
    baseLength,
    skipTypes: [0x1, 0x0],
    lengthIsTotal: true,
  });

  // Wrap toObject again to omit raw *Flag keys and project them onto a
  // single `flags` object. attach.options.tlv8 already added `options`.
  const previousToObject = proto.toObject;
  proto.toObject = function() {
    const obj = previousToObject.call(this);
    for (const k of flagKeys) delete obj[k];
    obj.flags = this.flags;
    return obj;
  };

  attach.checksum.pseudo(proto, IPProtocolTypes.TCP);

  // TCP terminates the layer chain with a raw Payload over its body. Mirrors
  // the legacy class which never inspected the application protocol.
  proto.nextProto = function nextProto(layers) {
    return new layers.Payload(this._buf.subarray(this.length));
  };

  attach.defaults(proto, {
    windowSize: 2048,
    urgentPointer: 0,
    dataOffset: ($) => $.length / 4,
  });

  // struct-compile registers `flags` as a virtual field for downstream
  // tooling that walks `proto.config.fields`.
  addField(proto, 'flags');

  return Layer;
})();

attach.docs(TCP, {
  fields: {
    flags: 'Object with syn, ack, fin, rst, psh, urg, ece, cwr set to 0 or 1.',
    options: 'List of { type, value } options, types are tcp.OPTION_*.',
  },
  constants: [
    {
      title: 'Options',
      field: 'options[].type',
      values: {
        OPTION_END: 0,
        OPTION_NOP: 1,
        OPTION_MSS: 2,
        OPTION_WINDOW_SCALE: 3,
        OPTION_SACK_PERMITTED: 4,
        OPTION_SACK: 5,
        OPTION_TIMESTAMP: 8,
      },
    },
    {
      title: 'Well-known ports',
      field: 'src, dst',
      values: {
        PORT_FTP: 21,
        PORT_SSH: 22,
        PORT_TELNET: 23,
        PORT_SMTP: 25,
        PORT_DNS: 53,
        PORT_HTTP: 80,
        PORT_HTTPS: 443,
      },
    },
  ],
  example: "wire.packet().ipv4({ dst: '192.168.1.1' }).tcp({ src: 40000, dst: tcp.PORT_SSH, flags: { syn: 1 } })",
});

export { TCP };
export default { TCP };
