const { OsiModelLayers } = require('./osi');

/**
 * Raw payload layer - terminates a layer chain with the bytes that
 * none of the parent layers' dispatchers recognised.
 *
 * Not built via makeLayer because it doesn't wrap a struct-compile
 * header; it just owns a Buffer.
 *
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
        this.length = this.data.length;
      }
    }
  }

  static toAlloc = (data) => data?.data?.length ?? 0;
  static osi = OsiModelLayers.Application;
  osi = OsiModelLayers.Application;

  toObject() {
    return { data: this.data };
  }

  get buffer() {
    return this.data;
  }

  defaults() {}

  merge(obj) {
    if (obj && obj.data) {
      if (this.data) {
        obj.data.copy(this.data);
      }
      else {
        this.data = Buffer.from(obj.data);
      }
      this.length = obj.data.length;
    }
  }

  nextProto() {
    return null;
  }
}

module.exports = { Payload };
