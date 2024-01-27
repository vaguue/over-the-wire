const { compile } = require('struct-compile');
const { macToString, macFromString } = require('./mac');
const { OsiModelLayers } = require('./osi');
const { ETHERTYPE } = require('./enums');

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

  nextProto(layers) {
    switch (this.type) {
    case ETHERTYPE.IP:
      return new layers.IPv4(this._buf.subarray(this.length), this);
    case ETHERTYPE.IPV6:
      return new layers.IPv6(this._buf.subarray(this.length), this);
    case ETHERTYPE.ARP:
      return new layers.ARP(this._buf.subarray(this.length), this);
    case ETHERTYPE.VLAN:
    case ETHERTYPE.IEEE_802_1AD:
      return new layers.Vlan(this._buf.subarray(this.length), this);
    case ETHERTYPE.PPPOES:
      return new layers.PPPoESession(this._buf.subarray(this.length), this);
    case ETHERTYPE.PPPOED:
      return new layers.PPPoEDiscovery(this._buf.subarray(this.length), this);
    case ETHERTYPE.MPLS:
      return new layers.Mpls(this._buf.subarray(this.length), this);
    case ETHERTYPE.WAKE_ON_LAN:
      return new layers.WakeOnLanLayer(this._buf.subarray(this.length), this);
    default:
      return new layers.Payload(this._buf.subarray(this.length), this);
    }
  }

  defaults(obj) {
    if (!obj.type) {
      this.type = ETHERTYPE.IP;
    }
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
