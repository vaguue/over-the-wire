const { LinkLayerType } = require('./enums');
const defaults = require('./defaults');
const { layers, linktype } = require('./layers');
const { shrinkAt, extendAt } = require('./buffer');
const { TimeStamp } = require('./timestamp');

class Packet {
  constructor(data) {
    this._toBuild = [];
    this._layers = {};
    this._layersHead = null;
    this._layersTail = null;

    this.shrinkAt = this.shrinkAt.bind(this._buffer);
    this.extendAt = this.shrinkAt.bind(this._buffer);

    if (data instanceof Packet) {
      this.buffer = Buffer.from(data.buffer);
      this.iface = { ...data.iface };
      this.linktype = data.linktype;
      this.layersReady = data.layersReady;
      this.timestamp = TimeStamp.now();

      this._toBuild = [ ...data._toBuild ];
      this._layersHead = null;
      this._layersTail = null;
    }
    else if (typeof data == 'object') {
      const { buffer = null, iface = { ...defaults }, timestamp = TimeStamp.now() } = data;
      this._buffer = buffer;
      this.iface = iface;
      this.linktype = this.iface?.linktype ?? LinkLayerType.LINKTYPE_ETHERNET;
      this.timestamp = timestamp;
      this._needsParse = this._buffer?.length > 0;
    }
  }

  _build() {
    if (!(this._toBuild?.length > 0)) {
      this._needsBuild = false;
      return;
    }

    let toAlloc = 0;

    for (const { layer, ...build } of this._toBuild) {
      toAlloc += layer.toAlloc;
    }

    let buffer = Buffer.alloc(toAlloc);

    if (Buffer.isBuffer(this._buffer)) {
      this._buffer = Buffer.concat(this._buffer, buffer);

      if (this._layersHead !== null) {
        let cur = this._layersHead;
        while (cur !== null) {
          cur.buffer = this._buffer;
          cur = cur.next;
        }
      }
    }

    for (const { layer, ...build } of this._toBuild) {
      if (this._layersTail) {
        this._layersTail = new layer(buffer, {
          shrinkAt: this.shrinkAt,
          extendAt: this.extendAt,
          prev: null,
        });

        if (!this._layersHead) {
          this._layersHead = this._layersTail;
        }

        this._layersTail.merge(build);
      }
      else {
        this._layersTail.next = new layer(build, {
          shrinkAt: this.shrinkAt,
          extendAt: this.extendAt,
          prev: this._layersTail,
        });

        this._layersTail.next.merge(build);

        this._layersTail = this._layersTail.next;
      }
    }

    this._needsBuild = false;
  }

  _parse() {
    let buf = this._buffer;
    let prev = null;
    let Layer = linktype[this.linktype];

    let newLayer = new Layer(this._buffer, {
      shrinkAt: this.shrinkAt,
      extendAt: this.extendAt,
      prev,
    });

    this._layersHead = newLayer;

    while (newLayer !== null && buf.length > 0) {
      this._layers[newLayer.name] = newLayer;
      buf = buf.subarray(newLayer.length);
      prev = newLayer;

      newLayer = newLayer.nextProto(layers);
    }

    this._layersTail = newLayer;

    this._needsParse = false;
  }

  get layers() {
    if (this._needsParse) {
      console.time('parse');
      this._parse();
      console.timeEnd('parse');
    }
    if (this._needsBuild) {
      this._build();
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
    if (this._needsBuild) {
      this._build();
    }
    return this._buffer;
  }

  clone() {
    return new Packet(this);
  }
}

for (const [name, layer] of Object.entries(layers)) {
  Packet.prototype[name] = function(data) {
    this._toBuild.push({ layer, data });
    this.needsBuild = true;
  }
}

module.exports = { Packet };
