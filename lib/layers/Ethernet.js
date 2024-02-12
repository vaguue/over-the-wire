const { LinkLayerType } = require('../enums');
const { compile } = require('struct-compile');
const { macToString, macFromString } = require('./mac');
const { OsiModelLayers } = require('./osi');
const { ETHERTYPE } = require('./enums');
const child = require('./child');
const mixins = require('./mixins');

const { EthernetHeader } = compile(`
  //@NE
  struct EthernetHeader {
    //destination MAC
    uint8_t dst[6];

    //source MAC
    uint8_t src[6];

    //underlying protocol
    uint16_t type;
  } __attribute__(packed);
`);

const childProto = {
  [ETHERTYPE.IP]: 'IPv4',
  [ETHERTYPE.IPV6]: 'IPv6',
  [ETHERTYPE.ARP]: 'ARP',
  [ETHERTYPE.VLAN]: 'Vlan',
  [ETHERTYPE.IEEE_802_1AD]: 'Vlan',
  [ETHERTYPE.PPPOES]: 'PPPoESession',
  [ETHERTYPE.PPPOED]: 'PPPoEDiscovery',
  [ETHERTYPE.MPLS]: 'Mpls',
  [ETHERTYPE.WAKE_ON_LAN]: 'WakeOnLanLayer',
};

const lookupChild = child.lookupChild(childProto);
const lookupKey = child.lookupKey(childProto);

/**
 * Ethernet protocol layer
 * @class
 * @implements {Layer}
 */
class Ethernet extends EthernetHeader {
  static linktype = LinkLayerType.LINKTYPE_ETHERNET;
  name = 'Ethernet';

  /**
   * @param {Buffer|Object} data - Input buffer or object with protocol fields.
   * @param {Object} opts - Options for the layer.
   */
  constructor(data, opts = {}) {
    super(data);
    mixins.ctor(this, data, opts);
  }

  static toAlloc = EthernetHeader.prototype.config.length;

  static osi = OsiModelLayers.DataLink;
  osi = OsiModelLayers.DataLink;

  /**
   * The source mac address in human-readable format.
   * @type {string}
   */
  get src() {
    return macToString(super.src);
  }

  set src(val) {
    super.src = macFromString(val);
  }

  /**
   * The destination mac address in human-readable format.
   * @type {string}
   */
  get dst() {
    return macToString(super.dst);
  }

  set dst(val) {
    super.dst = macFromString(val);
  }

  toObject() {
    return {
      ...super.toObject(),
      src: this.src,
      dst: this.dst,
    };
  }

  defaults(obj, layers) {
    if (!obj.type) {
      if (this.next) {
        this.type = lookupKey(layers, this.next);
      }
      else {
        this.type = ETHERTYPE.IP;
      }
    }
  }

  nextProto(layers) {
    return lookupChild(layers, this.type, this);
  }
};

module.exports = { Ethernet };
