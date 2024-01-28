const { TLV_8, TLVIterator, TLVSerialize } = require('./TLV');

const ctor = (self, opts) => {
  const { prev = null, extendAt, shrinkAt } = opts;
  self.opts = opts;
  self.prev = prev;
  self.extendAt = extendAt;
  self.shrinkAt = shrinkAt;
  if (prev) {
    prev.next = self;
  }
}

const withOptions = (proto, baseLength) => {
  Object.defineProperty(proto, 'options', {
    get() {
      const { length } = this;
      return new TLVIterator(TLV_8, this._buf.subarray(baseLength, length));
    },
    set(opts) {
      const { length } = this;
      const serialized = TLVSerialize(TLV_8, opts, 4);
      const diff = serialized.length - (length - baseLength);
      this.length += diff;
      if (diff > 0) {
        this.buffer = this.extendAt(length, diff);
      }
      else if (diff < 0) {
        this.buffer = this.shrinkAt(length, diff);
      }
      serialized.copy(this._buf, baseLength);
      this.headerLength = (baseLength + serialized.length) / 4;
    },
  });
};

module.exports = { ctor, withOptions };
