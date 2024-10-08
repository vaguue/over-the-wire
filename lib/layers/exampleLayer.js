const { OsiModelLayers } = require('./osi');
const mixins = require('#lib/layers/mixins');

/**
 * Interface for classes that protocol layers.
 *
 * @interface
 */
class Layer {
  /**
   * @param {Buffer|Object} data - Input buffer or object with protocol fields.
   * @param {Object} opts - Options for the layer.
   */
  constructor(data = {}, opts = {}) {
    /**
     * Underlying buffer synced with the properties.
     * @type {Buffer}
     */
    this.buffer;

    //best to use existing mixins
    mixins.ctor(this, data, opts);
    /**
     * Number of bytes occupied by the layer.
     * @type {number}
     */
    this.length = opts.allocated ?? 0;
    /**
     * @private
     * Should be the same as the class name.
     * @type {string}
     */
    this.name = 'Layer';
    /**
     * Respective protocol OSI layer.
     * @type {OsiModelLayers}
     */
    this.osi = OsiModelLayers.Unknown;

    /**
     * @private
     * Previous layer.
     * @type {Layer}
     */
    this.prev;

    /**
     * @private
     * Next layer.
     * @type {Layer}
     */
    this.next;
  }

  /** 
   * @private
  */
  static toAlloc = () => 0;

  /**
   * @private
   * Sets default properties for the layer based on user input and existing layers.
   * @param {Object} obj - User-defined properties.
   * @param {Object} layers - All available protocol layers.
   */
  defaults(obj, layers) {
    // Implementation
  }

  /**
   * @private
   * Receives an object with input properties
   * @param {Object} obj - User-defined properties.
   */
  merge(obj) {
    // Implementation
  }

  /**
   * @private
   * Determines the next protocol based on the current layer and existing layers.
   * @param {Object} layers - All available protocol layers.
   * @returns {Layer} The next layer's protocol.
   */
  nextProto(layers) {
    // Implementation
    return new Layer(this.buffer.subarray(this.length)); // Placeholder return
  }

  /**
   * Returns an object with all protcol fields without owning the underlying buffer.
   * Useful to read all the data and use it without having to deal with binary representation.
   * @returns {Object} - All protocol fields
   */
  toObject() {
    return {};
  }
}

module.exports = { Layer };
