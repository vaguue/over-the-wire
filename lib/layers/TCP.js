const { compile } = require('struct-compile');
const { OsiModelLayers } = require('./osi');
const { TLV_8, TLVIterator, TLVSerialize } = require('./TLV');
const { IPProtocolTypes, IPv4OptionTypes } = require('./enums');
const { AF_INET, inetPton, inetNtop, ntohs } = require('../socket');
const { checksums } = require('../bindings');
const child = require('./child');
const mixins = require('./mixins');

const { TCPHeader } = compile(`
  //@NE
  struct TCPHeader {
    // Source TCP port 
    uint16_t src;
    // Destination TCP port 
    uint16_t dst;
    // Sequence number 
    uint32_t seq;
    // Acknowledgment number 
    uint32_t ack;

    // Specifies the size of the TCP header in 32-bit words 
    uint16_t dataOffset:4,
    reservedFlag:4,
    // CWR flag 
    cwrFlag:1,
    // ECE flag 
    eceFlag:1,
    // URG flag 
    urgFlag:1,
    // ACK flag 
    ackFlag:1,
    // PSH flag 
    pshFlag:1,
    // RST flag 
    rstFlag:1,
    // SYN flag 
    synFlag:1,
    // FIN flag 
    finFlag:1;

    // The size of the receive window, which specifies the number of window size units (by default, bytes) 
    uint16_t	windowSize;
    // The 16-bit checksum field is used for error-checking of the header and data 
    uint16_t	checksum;
    // If the URG flag is set, then this 16-bit field is an offset from the sequence number indicating the last urgent data byte 
    uint16_t	urgentPointer;
  } __attribute__((packed));
`);

const { length: baseLength } = TCPHeader.config;

const flagNames = ['reserved', 'cwr', 'ece', 'urg', 'ack', 'psh', 'rst', 'syn', 'fin'];

/**
 * TCP protocol layer
 * @class
 * @implements {Layer}
 */
class TCP extends TCPHeader {
  name = 'TCP';

  constructor(buf, opts = {}) {
    super(buf);
    mixins.ctor(this, opts);
    this.length = this.offset * 4;
  }

  static length = baseLength;
  static osi = OsiModelLayers.Transport;
  osi = OsiModelLayers.Transport;

  _prepareFlags() {
    const res = {};
    for (const flag of flagNames) {
      res[flag] = this[flag + 'Flag'];
    }
    return res;
  }

  get flags() {
    const self = this;
    return new Proxy(Object.seal(this._prepareFlags()), {
      get(target, prop, receiver) {
        return target[prop];
      },
      set(target, prop, value) {
        target[prop] = value;
        const internalKey = prop + 'Flag';
        if (self[internalKey] !== undefined) {
          self[internalKey] = value;
        }
      },
    });
  }

  set flags(obj) {
    for (const flag of flagNames) {
      if (obj[flag] !== undefined) {
        this[flag + 'Flag'] = obj[flag];
      }
    }
  }

  calculateChecksum() {

  }

  defaults(obj = {}, layers) {
    if (!obj.dataOffset) {
      this.dataOffset = this.length / 4;
    }
    if (!obj.checksum) {
      this.calculateChecksum();
    }
  }

  nextProto(layers) {
    return layers.Payload(this._buf.subarray(this.length));
  }
};

mixins.withOptions(TCP.prototype, baseLength);

module.exports = { TCP };
