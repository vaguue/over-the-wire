const { OsiModelLayers } = require('./osi');

/**
 * Raw payload
 * @class
 * @implements {Layer}
 */
class Payload {
  name = 'Payload';

  constructor(data = {}, { prev = null, allocated = null } = {}) {
    this.prev = prev;
    this.next = null;

    if (allocated !== null) {
      this.length = allocated;
    }

    if (Buffer.isBuffer(data)) {
      this.data = data;
      if (!(this.length >= 0)) {
        this.lenght = this.data.length;
      }
    }
  }

  static toAlloc = (data) => data?.data?.length ?? 0;
  static osi = OsiModelLayers.Application;
  osi = OsiModelLayers.Application;

  toObject() {
    return {
      data: this.data,
    };
  }

  get buffer() {
    return this.data;
  }
  
  defaults(obj = {}) {}

  merge(obj) {
    if (obj.data) {
      if (obj.data.length > this.length) {
        this.buffer = this.extendAt(this.length, Math.abs(obj.data.length - this.length));
      }
      else if (obj.data.length < this.length) {
        this.buffer = this.shrinkAt(this.length, Math.abs(obj.data.length - this.length));
      }
      obj.data.copy(this.data);
      this.length = this.data.length;
    }
  }

  nextProto(layers) {
    return null;
  }
};

module.exports = { Payload };
