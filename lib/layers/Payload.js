const { OsiModelLayers } = require('./osi');

/**
 * Raw payload
 * @class
 * @implements {Layer}
 */
class Payload {
  name = 'Payload';

  constructor(data, { prev = null } = {}) {
    this.prev = prev;
    if (Buffer.isBuffer(data)) {
      this.data = data;
      this.length = this.data.length;
    }
  }

  static toAlloc = 0;
  static osi = OsiModelLayers.Application;
  osi = OsiModelLayers.Application;

  toObject() {
    return {
      data: this.data,
    };
  }
  
  defaults(obj = {}) {}

  nextProto(layers) {
    return null;
  }
};

module.exports = { Payload };
