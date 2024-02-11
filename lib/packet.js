const { LinkLayerType } = require('./enums');
const defaults = require('./defaults');
const { layers, linktype } = require('./layers');
const { shrinkAt, extendAt } = require('./buffer');

class Packet {
  constructor(data) {
    this._toBuild = [];
    this._layers = {};
    this._layersHead = null;
    this._layersTail = null;

    if (data instanceof Packet) {
      this.buffer = Buffer.from(data.buffer);
      this.iface = { ...data.iface };
      //this.layers = data.layers.clone();
      this.linktype = data.linktype;
      this.layersReady = data.layersReady;
    }
    else if (typeof data == 'object') {
      const { buffer = null, iface = { ...defaults } } = data;
      this._buffer = buffer;
      this.iface = iface;
      this.linktype = this.iface?.linktype ?? LinkLayerType.LINKTYPE_ETHERNET;
      this._needsParsing = this._buffer?.length > 0;
    }
  }

  _parse() {
    let buf = this._buffer;
    let prev = null;
    let Layer = linktype[this.linktype];
    const shrinkAt = this.shrinkAt.bind(this);
    const extendAt = this.shrinkAt.bind(this);

    let newLayer = new Layer(this._buffer, {
      shrinkAt, extendAt, prev,
    });

    this._layersHead = newLayer;

    while (newLayer !== null && buf.length > 0) {
      this._layers[newLayer.name] = newLayer;
      buf = buf.subarray(newLayer.length);
      prev = newLayer;

      newLayer = newLayer.nextProto(layers);
    }

    this._layersTail = newLayer;
  }

  get layers() {
    if (this._needsParsing) {
      this._parse();
    }
    return this._layers;
  }

  toObject() {
    this.layers;
    const layers = {};
    let cur = this._layersHead;

    while (cur !== null) {
      layers[cur.name] = cur.toObject();
      cur = cur.next;
    }

    return {
      iface: this.iface,
      layers,
    };
  }

  shrinkAt(...args) {
    return shrinkAt(this.buffer, ...args);
  }

  extendAt(...args) {
    return extendAt(this.buffer, ...args);
  }

  get buffer() {
    if (this._buffer === null) {
      this._build();
    }
    return this._buffer;
  }

  clone() {
    return new Packet(this);
  }
}

module.exports = { Packet };
