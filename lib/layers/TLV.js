const { compile, alignOffset } = require('struct-compile');

/**
 * @typedef {Object} TLVOption
 * @property {number} type - The TLV option type.
 * @property {number} length - The length of the TLV option value.
 * @property {Buffer} value - The TLV option value.
 */

const { TLVRecord_8, TLVPadding_8 } = compile(`
  struct TLVRecord_8 {
    // Record type
    uint8_t type;
    // Record length in bytes
    uint8_t recLength;
    // Record value (variable size)
    uint8_t value[];
  };

  struct TLVPadding_8 {
    // Record type
    uint8_t type;
  };
`);

class TLV_8 extends TLVRecord_8 {
  constructor(data = {}, opts = {}) {
    super(data);
    if (!Buffer.isBuffer(data) && typeof data == 'object' && data?.value) {
      this.value = data.value;
      this._buf = Buffer.concat([this._buf, data.value]);
    }
    else {
      this.value = this._buf.subarray(this.length, this.recLength + (opts.lengthIsTotal ? 0 : this.length));
    }
    
    if (opts.lengthIsTotal) {
      this.length = this.recLength;
    }
    else {
      this.length += this.recLength;
    }
  }
};

class TLVIterator {
  constructor(Cls, buf, { skipTypes = [], lengthIsTotal = false } = {}) {
    this.Cls = Cls;
    this.buf = buf;
    this.pos = 0;
    this.skipTypes = skipTypes;
    this.lengthIsTotal = lengthIsTotal;
  }

  next() {
    try {
      if (this.pos < this.buf.length) {
        const res = new this.Cls(this.buf.subarray(this.pos), { lengthIsTotal: this.lengthIsTotal });
        if (this.skipTypes.includes(res.type)) {
          this.pos += 1;
          return { done: false, value: { type: res.type } };
        }
        else {
          this.pos += res.length;
          return { done: false, value: res.toObject() };
        }
      }
    } catch(err) {}
    return { done: true };
  }

  [Symbol.iterator]() {
    return this;
  }
}

function TLVSerialize(Cls, PaddingCls, opts, { skipTypes = [], lengthIsTotal = false, align = null } = {}) {
  let res = Buffer
    .concat(opts
      .map(e => skipTypes.includes(e.type) ? 
        new PaddingCls(e).buffer : 
        new Cls(e, { lengthIsTotal }).buffer
      )
    );

  if (align !== null && res.length % align > 0) {
    res = Buffer.concat([res, Buffer.alloc(alignOffset(res.length, align) - res.length)]);
  }

  return res;
}

function TLVLength(Cls, PaddingCls, opts, { skipTypes = [], lengthIsTotal = false, align = null } = {}) {
  let res = 0;

  for (const opt of opts) {
    if (skipTypes.includes(e.type)) {
      res += PaddingCls.prototype.config.length;
    }
    else {
      if (lengthIsTotal) {
        res += opt.recLength;
      }
      else {
        res += opt.recLength + Cls.prototype.config.length;
      }
    }
  }

  if (align !== null && res.length % align > 0) {
    res = alignOffset(res, align);
  }

  return res;
}

module.exports = { TLV_8, TLVPadding_8, TLVIterator, TLVSerialize, TLVLength };
