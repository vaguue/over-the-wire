const { macToString, macFromString } = require('./mac');
const { inetPton, inetNtop } = require('#lib/converters');
const { AF_INET, AF_INET6 } = require('#lib/socket');

/**
 * Descriptor factories for `attach.virtualField`. Centralise the
 * MAC/IPv4/IPv6 read/write boilerplate so per-protocol IIFEs read as a
 * declarative list of accessors instead of repeating byte-buffer slicing.
 *
 * Each factory takes the byte offset of the address inside the layer's
 * underlying buffer (`this._buf`) and returns `{ get, set }`.
 */

const macAddress = (offset) => ({
  get() { return macToString(this._buf.subarray(offset, offset + 6)); },
  set(v) { macFromString(v).copy(this._buf, offset); },
});

const ipv4Address = (offset) => ({
  get() { return inetNtop(AF_INET, this._buf.subarray(offset, offset + 4)); },
  set(v) { inetPton(AF_INET, v).copy(this._buf, offset); },
});

const ipv6Address = (offset) => ({
  get() { return inetNtop(AF_INET6, this._buf.subarray(offset, offset + 16)); },
  set(v) { inetPton(AF_INET6, v).copy(this._buf, offset); },
});

module.exports = { macAddress, ipv4Address, ipv6Address };
