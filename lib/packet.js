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
 *   .ethernet({ dst: 'ff:ff:ff:ff:ff:ff', src: '00:11:22:33:44:55' })
 *   .ipv4({ src: '192.168.1.1', dst: '8.8.8.8', timeToLive: 64 })
 *   .icmp({ type: 8, code: 0, id: 12345, sequence: 1 });
 *
 * @example
 * // Parse existing packet
 * const packet = new Packet({ buffer: rawBuffer });
 * console.log(packet.layers.IPv4.src);
 */
const isTruncatedLayerError = (err) => {
  return err instanceof Error && err.message.startsWith('Invalid buffer length');
};

class Packet extends LayersList {
  constructor(data, opts = {}) {
    super({});
    this._toBuild = [];

    this._defaultOpts = {
      shrinkAt: this.shrinkAt,
      extendAt: this.extendAt,
    };

    if (data instanceof Packet) {
      const builtSourceBuffer = data.buffer;
      const origLength = data._origLength;

      this._buffer = builtSourceBuffer ? Buffer.from(builtSourceBuffer) : null;
      this._origLength = origLength;

      this.iface = { ...data.iface };
      this.linktype = data.linktype;

      if (opts.copy) {
        this.timestamp = TimeStamp.now();
      }
      else {
        this.timestamp = data.timestamp.clone();
      }

      if (data._needsParse) {
        this._needsParse = true;
      }
      else {
        let offset = 0;
        data._eachLayer(l => {
          this._createLayer(layers[l.name], this._buffer.subarray(offset), { allocated: l.length });
          offset += l.length;
        });
      }
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
    if (!(pkt instanceof Packet)) {
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

    const pending = this._toBuild;
    this._toBuild = [];

    let toAlloc = 0;
    const sizes = [];

    for (const { Layer, data } of pending) {
      const size = Layer.toAlloc(data);
      toAlloc += size;
      sizes.push(size);
    }

    const newBuffer = Buffer.alloc(toAlloc);
    let curBuffer = newBuffer;

    if (Buffer.isBuffer(this._buffer)) {
      this._buffer = Buffer.concat([this._buffer, newBuffer]);
      curBuffer = this._buffer;

      this._eachLayer(l => {
        l.buffer = curBuffer;
        curBuffer = curBuffer.subarray(l.length);
      });
    }
    else {
      this._buffer = newBuffer;
    }

    const built = [];

    for (let i = 0; i < pending.length; i++) {
      const { Layer, data } = pending[i];
      const layer = this._createLayer(Layer, curBuffer, { allocated: sizes[i] });

      layer.merge(data);
      curBuffer = curBuffer.subarray(layer.length);
      built.push(layer);
    }

    for (let innermostFirst = built.length - 1; innermostFirst >= 0; innermostFirst--) {
      built[innermostFirst].defaults(pending[innermostFirst].data);
    }

    for (let innermostFirst = built.length - 1; innermostFirst >= 0; innermostFirst--) {
      if (typeof built[innermostFirst].checksums == 'function') {
        built[innermostFirst].checksums(pending[innermostFirst].data);
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
    const Layer = linktype[this.linktype] ?? layers.Payload;

    let layer;

    try {
      layer = new Layer(buf, {
        shrinkAt: this.shrinkAt,
        extendAt: this.extendAt,
        prev: null,
      });
    }
    catch (err) {
      if (!isTruncatedLayerError(err)) {
        throw err;
      }
      layer = new layers.Payload(buf, { prev: null });
    }

    let remaining = buf.length;

    while (layer !== null && remaining > 0) {
      this._addLayer(layer);
      remaining -= layer.length;

      try {
        layer = layer.nextProto(layers);
      }
      catch (err) {
        if (!isTruncatedLayerError(err)) {
          throw err;
        }
        layer = remaining > 0 ? new layers.Payload(buf.subarray(buf.length - remaining), { prev: layer }) : null;
      }
    }

    this._dropLayerCreatedPastTheEnd();

    this._needsParse = false;
  }

  _dropLayerCreatedPastTheEnd() {
    if (this._layersTail !== null) {
      this._layersTail.next = null;
    }
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

    for (const [name, layer] of Object.entries(this._layers)) {
      layers[name] = Array.isArray(layer) ? layer.map(l => l.toObject()) : layer.toObject();
    }

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
  const addLayerToBuild = function(data = {}) {
    this._toBuild.push({ Layer, data });
    return this;
  };

  Packet.prototype[name.toLowerCase()] = addLayerToBuild;
  Packet.prototype[name] = addLayerToBuild;
}

module.exports = { Packet };
