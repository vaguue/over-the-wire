const { LinkLayerType } = require('#lib/enums');
const defaults = require('#lib/defaults');
const { layers, linktype } = require('#lib/layers/index');
const { shrinkAt, extendAt } = require('#lib/buffer');
const { TimeStamp } = require('#lib/timestamp');
const { LayersList } = require('#lib/layersList');

class Packet extends LayersList {
  constructor(data, opts = {}) {
    super({});
    this._toBuild = [];

    this.shrinkAt = this.shrinkAt.bind(this._buffer);
    this.extendAt = this.shrinkAt.bind(this._buffer);

    this._defaultOpts = {
      shrinkAt: this.shrinkAt,
      extendAt: this.shrinkAt,
    };

    if (data instanceof Packet) {
      this._buffer = Buffer.from(data.buffer);
      this._origLength = data._origLength;
      this._layersCount = data._layersCount;

      this.iface = { ...data.iface };
      this.linktype = data.linktype;

      if (opts.copy) {
        this.timestamp = TimeStamp.now();
      }
      else {
        this.timestamp = data.timestamp.clone();
      }

      this._toBuild = [...data._toBuild];

      data._eachLayer(l => {
        this._createLayer(layers[l.name], Buffer.from(l.buffer));
      });
    }
    else if (typeof data == 'object') {
      const { buffer = null, iface = { ...defaults }, timestamp = TimeStamp.now(), origLength = null } = data;

      this._buffer = buffer;
      this._origLength = origLength;
      this._layersCount = 0;

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

  [Symbol.for('nodejs.util.inspect.custom')]() {
    return `<Packet iface=${this.iface.name ?? this.iface.linktype}` +
            (this._buffer ? ' | ' + this._buffer.length + ' bytes' : '') +
            (this.comment ? '| ' + this.comment : '') +
            '>';
  }

  _build() {
    if (!this._needsBuild) {
      return;
    }

    let toAlloc = 0;
    const allocArray = [];

    for (const { Layer, data } of this._toBuild) {
      const allocUnit = Layer.toAlloc(data);
      toAlloc += allocUnit;
      allocArray.push(allocUnit);
    }

    let newBuffer = Buffer.alloc(toAlloc);
    let curBuffer;

    if (Buffer.isBuffer(this._buffer)) {
      this._buffer = Buffer.concat([this._buffer, newBuffer]);
      curBuffer = this._buffer;

      this._eachLayer(l => {
        l.buffer = curBuffer;
        curBuffer = curBuffer.subarray(l.length);
      });
    }
    else {
      curBuffer = newBuffer;
      this._buffer = curBuffer;
    }

    const initCount = this._layersCount;

    this._genLayers((prev, i) => {
      const obj = this._toBuild[i];

      if (!obj) {
        return null;
      }

      const { Layer, data } = obj;

      const res = this._createLayer(Layer, curBuffer, { allocated: allocArray[i] });

      res.merge(data);

      curBuffer = curBuffer.subarray(res.length);

      return res;
    });

    this._eachLayer((l, i) => {
      if (i < initCount) return;
      l.defaults(this._toBuild[i - initCount]);
    });

    this._eachLayer((l, i) => {
      if (i < initCount) return;
      if (typeof l.checksums == 'function') {
        l.checksums(this._toBuild[i - initCount]);
      }
    });

    this._toBuild = [];
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
      this._layersCount++;
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
      this._parse();
    }
    if (this._needsBuild) {
      this._build();
    }
    return this._layers;
  }

  toObject() {
    this.layers;

    const layers = {};

    this._eachLayer(l => {
      layers[l.name] = l.toObject();
    });

    return {
      iface: { ...this.iface },
      layers,
    };
  }

  shrinkAt(...args) {
    throw new Error('Buffer shrinking not yet implemented, try creating new packet');
    //return shrinkAt(this.buffer, ...args);
  }

  extendAt(...args) {
    throw new Error('Buffer extending not yet implemented, try creating new packet');
    //return extendAt(this.buffer, ...args);
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

for (const [name, Layer] of Object.entries(layers)) {
  Packet.prototype[name] = function(data) {
    this._toBuild.push({ Layer, data });
    this.needsBuild = true;
    return this;
  }
}

module.exports = { Packet };
