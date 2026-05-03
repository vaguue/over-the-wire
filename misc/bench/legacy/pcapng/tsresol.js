const { TimeStamp } = require('#lib/timestamp');

const _defaultResol = 1e6;

function getResol(tsresol) {
  let resol = null;

  if (tsresol) {
    const resolValue = Buffer.from(tsresol).readInt8();
    const flag = (1 << 31);
    if (resolValue & flag) {
      resol = Math.round(1 / Math.pow(2, -1 * (resolValue & (~flag))));
    }
    else {
      resol = Math.round(1 / Math.pow(10, -1 * (resolValue & (~flag))));
    }
  }

  return resol;
}


function serialize(tsresol, ts, defaultResol = _defaultResol) {
  const resol = getResol(tsresol ?? ts.tsresol) ?? defaultResol;

  const value = ts.ns * BigInt(resol) / BigInt(1e9);
  timestamp_high = Number((value & BigInt(0xffffffff00000000)) >> 32n);
  timestamp_low = Number(value & BigInt(0x00000000ffffffff));

  return { timestamp_high, timestamp_low };
}

function parse(tsresol, { timestamp_high, timestamp_low }, defaultResol = _defaultResol) {
  const resol = getResol(tsresol) ?? defaultResol;

  const ns = ((BigInt(timestamp_high) << 32n) + BigInt(timestamp_low)) * BigInt(1e9) / BigInt(resol);

  const res = new TimeStamp({
    s: Number(ns / BigInt(1e9)),
    ns: Number(ns % BigInt(1e9)),
  });

  //ugly move to keep the same tsresol
  res.tsresol = tsresol ?? Buffer.from([0x06, 0x00, 0x00, 0x00]);

  return res;
}

module.exports = { serialize, parse };
