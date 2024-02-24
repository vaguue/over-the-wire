const { LinkLayerType } = require('#lib/enums');
const defaults = require('#lib/defaults');
const { layers, linktype } = require('#lib/layers/index');
const { shrinkAt, extendAt } = require('#lib/buffer');
const { TimeStamp } = require('#lib/timestamp');

class Packet {
  constructor(data, opts = {}) {
    this._toBuild = [];
    this._layers = {};
    this._layersHead = null;
    this._layersTail = null;
    this._origLength = null;

    this.shrinkAt = this.shrinkAt.bind(this._buffer);
    this.extendAt = this.shrinkAt.bind(this._buffer);

    if (data instanceof Packet) {
      this._buffer = Buffer.from(data.buffer);
      this._origLength = data._origLength;

      this.iface = { ...data.iface };
      this.linktype = data.linktype;

      if (opts.copy) {
        this.timestamp = TimeStamp.now();
      }
      else {
        this.timestamp = data.timestamp.clone();
      }

      this._toBuild = [ ...data._toBuild ];
      this._layersHead = null;
      this._layersTail = null;
    }
    else if (typeof data == 'object') {
      const { buffer = null, iface = { ...defaults }, timestamp = TimeStamp.now(), origLength = null } = data;

      this._buffer = buffer;
      this._origLength = origLength;

      this.iface = iface;
      this.linktype = this.iface?.linktype ?? LinkLayerType.LINKTYPE_ETHERNET;

      this.timestamp = timestamp;

      this._needsParse = this._buffer?.length > 0;
    }

    if (data?.comment) {
      this.comment = data.comment;
    }
  }


  equals(pkt) {
    if (!pkt instanceof Packet) {
      return false;
    }

    if (this.iface?.linktype !== pkt.iface?.linktype) {
      return false;
    }

    if (this.iface?.name !== pkt.iface?.name) {
      return false;
    }

    if (this.iface?.mtu !== pkt.iface?.mtu) {
      return false;
    }

    if (this.comment !== pkt.comment) {
      return false;
    }

    if (this.timestamp.compare(pkt.timestamp) !== 0) {
      return false;
    }

    if (Buffer.compare(this.buffer, pkt.buffer) !== 0) {
      return false;
    }

    return true;
  }

  get _needsBuild() {
    return this._toBuild.length > 0;
  }

  _build() {
    if (!this._needsBuild) {
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

    this._origLength = null;
  }

  get origLength() {
    return this._origLength ?? this.length;
  }

  get length() {
    return this.buffer.length;
  }

  _parse() {
    let buf = this._buffer;
    let prev = null;
    let Layer = linktype[this.linktype] ?? layers.Payload;

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

  copy() {
    return new Packet(this, { copy: true });
  }
}

for (const [name, layer] of Object.entries(layers)) {
  Packet.prototype[name] = function(data) {
    this._toBuild.push({ layer, data });
    this.needsBuild = true;
  }
}

module.exports = { Packet };
