const buffer = require('../buffer');
const { TLV_8, TLVPadding_8, TLVIterator, TLVSerialize, TLVLength } = require('./TLV');

const ctor = (self, data, opts) => {
  const { prev = null, extendAt, shrinkAt } = opts;
  self.opts = opts;
  self.prev = prev;
  self.next = null;
  self.extendAt = extendAt ?? ((...args) => buffer.extendAt(self.buffer, ...args));
  self.shrinkAt = shrinkAt ?? ((...args) => buffer.shrinkAt(self.buffer, ...args));
  if (prev) {
    prev.next = self;
  }

  if (self._hasOptions) {
    if (!Buffer.isBuffer(data)) {
      if (data.options) {
        self.options = data.options;
      }
    }
  }
}

const complementOptions = options => {
  const res = [];

  for (const opt of options) {
    if (opt.recLength) {
      res.push({ ...opt });
    }
    else {
      res.push({ ...opt, recLength: opt?.value?.length ?? 0 });
    }
  }

  return res;
}

const withOptions = (proto, { baseLength, skipTypes = [], lengthIsTotal = false }) => {
  Object.defineProperty(proto, 'options', {
    get() {
      const { length } = this;
      return new TLVIterator(TLV_8, this._buf.subarray(baseLength, length), { skipTypes, lengthIsTotal });
    },
    set(opts) {
      const { length } = this;
      const serialized = TLVSerialize(TLV_8, TLVPadding_8, complementOptions(opts), { skipTypes, lengthIsTotal, align: 4 });
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

  proto.optionsLength = function(opts) {
    if (!opts) return 0;
    return TLVLength(TLV_8, TLVPadding_8, complementOptions(opts), { skipTypes, lengthIsTotal, align: 4 });
  };

  proto._hasOptions = true;
};

module.exports = { ctor, withOptions };
