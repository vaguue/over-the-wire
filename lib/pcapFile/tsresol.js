const { TimeStamp } = require('../timestamp');

function getResol(tsresol) {
  let resol = null;

  if (tsresol) {
    const resolValue = Buffer.from(tsresol).readInt32LE();
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


function serialize(tsresol, ts, defaultResol = 1e6) {
  const resol = getResol(tsresol) ?? defaultResol;

  const value = ts.ns * BigInt(resol) / BigInt(1e9);
  timestamp_high = parseInt(((value & BigInt(0xffffffff00000000)) >> 32n).toString());
  timestamp_low = parseInt((value & BigInt(0x00000000ffffffff)).toString());

  return { timestamp_high, timestamp_low };
}

function parse(tsresol, { timestamp_high, timestamp_low }, defaultResol = 1e6) {
  const resol = getResol(tsresol) ?? defaultResol;

  const ns = ((BigInt(timestamp_high) << 32n) + BigInt(timestamp_low)) * BigInt(1e9) / BigInt(resol);

  return new TimeStamp({
    s: Number(ns / BigInt(1e9)),
    ns: Number(ns % BigInt(1e9)),
  });
}

module.exports = { serialize, parse };
