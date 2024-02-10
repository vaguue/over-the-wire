const { compile, alignOffset } = require('struct-compile');

/**
 * @typedef {Object} TLVOption
 * @property {number} type - The TLV option type.
 * @property {number} length - The length of the TLV option value.
 * @property {Buffer} value - The TLV option value.
 */

const { TLVRecord_8 } = compile(`
  struct TLVRecord_8 {
    // Record type
    uint8_t type;
    // Record length in bytes
    uint8_t recLength;
    // Record value (variable size)
    uint8_t value[];
  };
`);

class TLV_8 extends TLVRecord_8 {
  constructor(...args) {
    super(...args);
    if (typeof args[0] == 'object' && args[0]?.value) {
      this.value = args[0].value;
      this._buf = Buffer.concat([this._buf, args[0].value]);
    }
    else {
      this.value = this._buf.subarray(this.length, this.length + this.recLength);
    }
    this.length += this.recLength;
  }
};

class TLVIterator {
  constructor(Cls, buf) {
    this.Cls = Cls;
    this.buf = buf;
    this.pos = 0;
  }

  next() {
    try {
      if (this.pos < this.buf.length) {
        const res = new this.Cls(this.buf.subarray(this.pos));
        this.pos += res.length;
        return { done: false, value: res.toObject() };
      }
    } catch(err) {}
    return { done: true };
  }

  [Symbol.iterator]() {
    return this;
  }
}

function TLVSerialize(Cls, opts, align = null) {
  let res = Buffer.concat(opts.map(e => new Cls(e).buffer));
  if (align !== null && res.length % align > 0) {
    res = Buffer.concat([res, Buffer.alloc(alignOffset(res.length, align) - res.length)]);
  }
  return res;
}

function test() {
  const buf = Buffer.from([0x01, 0x04, 0xAA, 0xAA, 0xAA, 0xAA, 0x02, 0x02, 0xBB, 0xBB]);
  const tlvOption = new TLV_8(buf);
  console.log('tlbOption', tlvOption.toObject());
  console.log('tlbOption.length', tlvOption.length);

  const opts = [...new TLVIterator(TLV_8, buf)];
  console.log(opts);
  console.log(TLVSerialize(TLV_8, opts, 4));
}

if (require.main === module) {
  test();
}

module.exports = { TLV_8, TLVIterator, TLVSerialize };
