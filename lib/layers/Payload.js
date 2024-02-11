const { OsiModelLayers } = require('./osi');

/**
 * Raw payload
 * @class
 * @implements {Layer}
 */
class Payload {
  name = 'Payload';

  constructor(buf, prev = null) {
    this.prev = prev;
    this.data = buf;
  }

  static length = 0;
  static osi = OsiModelLayers.Application;
  osi = OsiModelLayers.Application;

  get length() {
    return this.data?.length ?? 0;
  }
  
  defaults(obj = {}) {}

  nextProto(layers) {
    return null;
  }
};

module.exports = { Payload };
