const { compile } = require('struct-compile');
const { macToString, macFromString } = require('./mac');
const { OsiModelLayers } = require('./osi');
const { ETHERTYPE } = require('./enums');
const child = require('./child');

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
  [ETHERTYPE.IP]: layers => layers.IPv4,
  [ETHERTYPE.IPV6]: layers => layers.IPv6,
  [ETHERTYPE.ARP]: layers => layers.ARP,
  [ETHERTYPE.VLAN]: layers => layers.Vlan,
  [ETHERTYPE.IEEE_802_1AD]: layers => layers.Vlan,
  [ETHERTYPE.PPPOES]: layers => layers.PPPoESession,
  [ETHERTYPE.PPPOED]: layers => layers.PPPoEDiscovery,
  [ETHERTYPE.MPLS]: layers => layers.Mpls,
  [ETHERTYPE.WAKE_ON_LAN]: layers => layers.WakeOnLanLayer,
};

const lookupChild = child.lookupChild(childProto);
const lookupKey = child.lookupKey(childProto);

class Ethernet extends EthernetHeader {
  constructor(structArg, { prev = null, extendAt, shrinkAt } = {}) {
    super(structArg);
    this.prev = prev;
    if (prev) {
      prev.next = this;
    }
  }

  static length = EthernetHeader.config.length;
  static osi = OsiModelLayers.DataLink;
  osi = OsiModelLayers.DataLink;

  get src() {
    return macToString(super.src);
  }

  set src(val) {
    super.src = macFromString(val);
  }

  get dst() {
    return macToString(super.dst);
  }

  set dst(val) {
    super.dst = macFromString(val);
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
    return lookupChild(this.type);
  }
};

function test() {
  const eth = new Ethernet(Buffer.from('00ebd8f4bbe75ce91e9dfc40080045000073000040', 'hex'));
  eth.src = eth.dst;
  console.log('after change', eth.src, eth.dst, eth.type.toString(16));
}

if (require.main === module) {
  test();
}

module.exports = { Ethernet, test };
