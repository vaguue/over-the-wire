const { LinkLayerType } = require('../enums');
const defaults = require('defaults');

class Packet {
  constructor(...args) {
    if (args[0] instanceof Packet) {
      this.buffer = Buffer.from(args[0].buffer);
      this.iface = { ...args[0].iface };
      this.layers = args[0].layers.clone();
      this.linktype = args[0].linktype;
    }
    else {
      const [buffer = null, iface = null] = args;
      this.buffer = buffer;
      this.iface = iface;
      this.linktype = this.iface?.linktype ?? LinkLayerType.LINKTYPE_ETHERNET;
    }
  }

  get buffer() {
    if (this.buffer === null) {
      this._build();
    }
    return this.buffer;
  }

  get iface() {
    if (this.iface !== null) {
      return this.iface;
    }
    return defaults;
  }

  clone() {
    return new Packet(this);
  }
}

module.exports = { Packet };
