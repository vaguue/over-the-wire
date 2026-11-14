import { OsiModelLayers } from './osi.js';

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
  static docs = {
    title: 'Raw bytes',
    summary: 'The bytes no other layer recognised, or the bytes you put after the last header.',
    fields: {
      data: 'Buffer with the bytes.',
    },
    constants: [],
    example: "wire.packet().ipv4({ dst: '10.0.0.2' }).udp({ src: 40000, dst: 9 }).payload({ data: Buffer.from('hello') })",
  };
  osi = OsiModelLayers.Application;

  toObject() {
    return { data: this.data };
  }

  get buffer() {
    return this.data;
  }

  set buffer(buf) {
    this.data = buf;
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

export { Payload };
export default { Payload };
