import { TLV_8, TLVPadding_8, TLVIterator, TLVSerialize, TLVLength } from './TLV.js';

const ctor = (self, data, opts) => {
  self.opts = opts;
  self.prev = opts.prev ?? null;
  self.next = null;

  if (self.prev) {
    self.prev.next = self;
  }
};

const lengthAfter = (layer) => {
  let res = 0;
  for (let cur = layer.next; cur != null; cur = cur.next) {
    res += cur.length;
  }
  return res;
};

const TLV_HEADER_LENGTH = 2;

const complementOptions = (options, lengthIsTotal) => {
  const res = [];

  for (const opt of options) {
    if (opt.recLength) {
      res.push({ ...opt });
    }
    else {
      const valueLength = opt?.value?.length ?? 0;
      res.push({ ...opt, recLength: lengthIsTotal ? valueLength + TLV_HEADER_LENGTH : valueLength });
    }
  }

  return res;
};

const withOptions = (proto, { baseLength, skipTypes = [], lengthIsTotal = false, align = 4 }) => {
  Object.defineProperty(proto, 'options', {
    get() {
      return new TLVIterator(TLV_8, this._buf.subarray(baseLength, this.length), { skipTypes, lengthIsTotal });
    },
    set(opts) {
      const serialized = TLVSerialize(TLV_8, TLVPadding_8, complementOptions(opts, lengthIsTotal), { skipTypes, lengthIsTotal, align });
      serialized.copy(this._buf, baseLength);

      if (this.config.fields.headerLength !== undefined) {
        this.headerLength = (baseLength + serialized.length) / 4;
      }
    },
  });

  proto.optionsLength = function(opts) {
    if (!opts) {
      return 0;
    }
    return TLVLength(TLV_8, TLVPadding_8, complementOptions(opts, lengthIsTotal), { skipTypes, lengthIsTotal, align });
  };

  proto._hasOptions = true;
};

export { ctor, withOptions, lengthAfter };
export default { ctor, withOptions, lengthAfter };
