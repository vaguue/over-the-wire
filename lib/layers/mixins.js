const { TLV_8, TLVPadding_8, TLVIterator, TLVSerialize, TLVLength } = require('./TLV');

const ctor = (self, data, opts) => {
  self.opts = opts;
  self.prev = opts.prev ?? null;
  self.next = null;

  if (self.prev) {
    self.prev.next = self;
  }
};

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
};

const withOptions = (proto, { baseLength, skipTypes = [], lengthIsTotal = false }) => {
  Object.defineProperty(proto, 'options', {
    get() {
      return new TLVIterator(TLV_8, this._buf.subarray(baseLength, this.length), { skipTypes, lengthIsTotal });
    },
    set(opts) {
      const serialized = TLVSerialize(TLV_8, TLVPadding_8, complementOptions(opts), { skipTypes, lengthIsTotal, align: 4 });
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
