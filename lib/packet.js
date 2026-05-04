const { LinkLayerType } = require('#lib/enums');
const defaults = require('#lib/defaults');
const { layers, linktype } = require('#lib/layers/index');
const { shrinkAt, extendAt } = require('#lib/buffer');
const { TimeStamp } = require('#lib/timestamp');
const { LayersList } = require('#lib/layersList');


/**
 * Represents a network packet with protocol layer support
 * Provides fluent interface for packet crafting and parsing
 *
 * @class
 * @extends LayersList
 *
 * @param {Object} [data] - Packet data, options object, or existing packet
 * @param {Buffer} [data.buffer] - Raw packet buffer for parsing existing packets
 * @param {Object} [data.iface] - Network interface configuration
 *
 * @example
 *
 * // Create an ICMP echo request packet
 * const packet = new Packet({ iface: 'eth0' })
 *   .Ethernet({ dst: 'ff:ff:ff:ff:ff:ff', src: '00:11:22:33:44:55' })
 *   .IPv4({ src: '192.168.1.1', dst: '8.8.8.8', timeToLive: 64 })
 *   .ICMP({ type: 8, code: 0, id: 12345, sequence: 1 });
 *
 * @example
 * // Parse existing packet
 * const packet = new Packet({ buffer: rawBuffer });
 * console.log(packet.layers.IPv4.src);
 */
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

  /**
   * Compares this packet with another packet for equality
   *
   * @param {Packet} pkt - The packet to compare with
   * @returns {boolean} True if packets are identical (same interface, timestamp, and buffer content)
   *
   * @example
   * const packet1 = new Packet({ buffer: data });
   * const packet2 = new Packet({ buffer: data });
   * if (packet1.equals(packet2)) {
   *   console.log('Packets are identical');
   * }
   */
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
      l.defaults(this._toBuild[i - initCount].data);
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

  /**
   * Converts the packet to a plain JavaScript object
   *
   * @returns {Object} Plain object representation
   * @returns {Object} returns.iface - Interface configuration
   * @returns {Object} returns.layers - Layer objects with their fields
   *
   * @example
   * const obj = packet.toObject();
   * console.log(obj.layers.IPv4.src);
   */
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

  /**
   * Raw buffer containing the complete packet data
   * Automatically builds packet if layers were added
   *
   * @returns {Buffer} Complete packet buffer
   */
  get buffer() {
    if (this._needsBuild) {
      this._build();
    }
    return this._buffer;
  }

  /**
   * Creates a deep clone of the packet
   * Preserves all layers, timestamps, and interface settings
   *
   * @returns {Packet} New packet instance identical to this one
   */
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
