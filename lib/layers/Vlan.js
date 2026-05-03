const { compile } = require('struct-compile');
const { OsiModelLayers } = require('./osi');
const { ETHERTYPE } = require('./enums');
const child = require('./child');
const mixins = require('./mixins');

const { VlanHeader } = compile(`
  //@NE
  struct VlanHeader {
    // 12-bit VLAN identifier
    uint16_t vid:12;
    // Drop Eligible Indicator
    uint16_t dei:1;
    // Priority Code Point
    uint16_t pcp:3;
    // EtherType of the encapsulated payload
    uint16_t etherType;
  } __attribute__(packed);
`);

const { length: baseLength } = VlanHeader.prototype.config;

const childProto = {
  [ETHERTYPE.IP]: 'IPv4',
  [ETHERTYPE.IPV6]: 'IPv6',
  [ETHERTYPE.ARP]: 'ARP',
  [ETHERTYPE.VLAN]: 'Vlan',
  [ETHERTYPE.IEEE_802_1AD]: 'Vlan',
  [ETHERTYPE.MPLS]: 'Mpls',
  [ETHERTYPE.PPPOES]: 'PPPoESession',
  [ETHERTYPE.PPPOED]: 'PPPoEDiscovery',
  [ETHERTYPE.WAKE_ON_LAN]: 'WakeOnLanLayer',
};

const lookupChild = child.lookupChild(childProto);
const lookupKey = child.lookupKey(childProto);

/**
 * IEEE 802.1Q VLAN tag layer
 * @class
 * @implements {Layer}
 * @property {number} vid - 12-bit VLAN identifier (0..4095).
 * @property {number} dei - Drop Eligible Indicator (0 or 1).
 * @property {number} pcp - Priority Code Point (0..7).
 * @property {number} etherType - EtherType of the encapsulated payload.
 */
class Vlan extends VlanHeader {
  name = 'Vlan';

  /**
   * @param {Buffer|Object} data - Input buffer or object with protocol fields.
   * @param {Object} opts - Options for the layer.
   */
  constructor(data = {}, opts = {}) {
    if (Buffer.isBuffer(data)) {
      super(data);
    }
    else {
      super(Buffer.alloc(Vlan.toAlloc(data)));
      this.merge(data);
    }
    mixins.ctor(this, data, opts);

    this.length = opts.allocated ?? baseLength;
  }

  static toAlloc = () => baseLength;

  static osi = OsiModelLayers.DataLink;
  osi = OsiModelLayers.DataLink;

  defaults(obj = {}, layers) {
    if (obj.pcp === undefined) {
      this.pcp = 0;
    }
    if (obj.dei === undefined) {
      this.dei = 0;
    }
    if (!obj.etherType) {
      if (this.next) {
        this.etherType = lookupKey(layers, this.next) ?? ETHERTYPE.IP;
      }
      else {
        this.etherType = ETHERTYPE.IP;
      }
    }
  }

  nextProto(layers) {
    return lookupChild(layers, this.etherType, this);
  }
};

module.exports = { Vlan };
