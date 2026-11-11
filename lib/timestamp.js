const isBigInt = v => typeof v == 'bigint';
const nullToBool = v => v !== null;
const sign = v => {
  if (typeof v == 'bigint') {
    return v == 0n ? 0 : (v < 0n ? -1 : 1);
  }

  return v == 0 ? 0 : (v < 0 ? -1 : 1);
}

const toNanoseconds = (value, nanosecondsPerUnit) => {
  if (value === null || value === undefined) {
    return 0n;
  }

  if (typeof value == 'bigint') {
    return value * BigInt(nanosecondsPerUnit);
  }

  const whole = Math.trunc(value);
  const fraction = value - whole;

  return BigInt(whole) * BigInt(nanosecondsPerUnit) + BigInt(Math.round(fraction * nanosecondsPerUnit));
};

class TimeStamp {
  constructor({ s = null, ms = null, ns = null } = {}) {
    if (s === null && ms === null && ns === null) {
      return TimeStamp.now();
    }

    if (isBigInt(s) || isBigInt(ms) || isBigInt(ns)) {
      this.useBigInt = true;
    }
    else {
      this.useBigInt = false;
    }

    this._s = s;
    this._ms = ms;
    this._ns = ns;
  }

  clone() {
    return new TimeStamp({
      s: this._s,
      ms: this._ms,
      ns: this._ns,
    });
  }

  compare(ts) {
    return sign(this.ns - ts.ns);
  }

  static now(unit = 'ms') {
    if (unit == 's') {
      return new TimeStamp({ s: Date.now() / 1e3 });
    }

    if (unit == 'ms') {
      return new TimeStamp({ ms: Date.now() });
    }

    if (unit == 'ns') {
      const now = performance.timeOrigin + performance.now();
      const ms = Math.floor(now);
      const ns = Math.floor((now - ms) * 1e6);
      return new TimeStamp({ ms: Math.floor(now), ns });
    }
  }

  get s() {
    if (this.useBigInt) {
      return Number(BigInt(this._s ?? 0) + BigInt(this._ms ?? 0) / BigInt(1e3) + BigInt(this._ns ?? 0) / BigInt(1e9));
    }

    return (this._s ?? 0) + (this._ms ?? 0) / 1e3 + (this._ns ?? 0) / 1e9;
  }

  get ms() {
    if (this.useBigInt) {
      return Number(BigInt(this._s ?? 0) * BigInt(1e3) + BigInt(this._ms ?? 0) + BigInt(this._ns ?? 0) / BigInt(1e6));
    }

    return (this._s ?? 0) * 1e3 + (this._ms ?? 0) + (this._ns ?? 0) / 1e6;
  }

  get ns() {
    return toNanoseconds(this._s, 1e9) + toNanoseconds(this._ms, 1e6) + toNanoseconds(this._ns, 1);
  }

  //TODO seems like a not so optimal solution
  packedIn(units) {
    const { s = false, ms = false, ns = false } = units;
    const res = {};

    if (
      nullToBool(this._s) === s &&
      nullToBool(this._ms) === ms &&
      nullToBool(this._ns) === ns
    ) {
      if (s) {
        res.s = this._s;
      }
      if (ms) {
        res.ms = this._ms;
      }
      if (ns) {
        res.ns = this._ns;
      }

      return res;
    }

    let min = this.ns;

    if (s) {
      res.s = Number(min / BigInt(1e9));
      min = min % BigInt(1e9);
    }
    if (ms) {
      res.ms = Number(min / BigInt(1e6));
      min = min % BigInt(1e6);
    }
    if (ns) {
      res.ns = Number(min);
    }

    return res;
  }

  toDate() {
    return new Date(this.ms);
  }
};

module.exports = { TimeStamp };
