const { OsiModelLayers } = require('./osi');
const { IPProtocolTypes } = require('./enums');
const { addField } = require('#lib/struct');
const { makeLayer, attach } = require('./define');

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
    //@NE
    struct TCPHeader {
      uint16_t src;
      uint16_t dst;
      uint32_t seq;
      uint32_t ack;
      //@LE
      uint16_t
        reservedFlag:4,
        dataOffset:4,
        finFlag:1,
        synFlag:1,
        rstFlag:1,
        pshFlag:1,
        ackFlag:1,
        urgFlag:1,
        eceFlag:1,
        cwrFlag:1;
      uint16_t windowSize;
      uint16_t checksum;
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

module.exports = { TCP };
