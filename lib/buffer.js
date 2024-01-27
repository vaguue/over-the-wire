const extendAt = (buf, at, size) => {
  return Buffer.concat([buf.subarray(0, at), Buffer.alloc(size), buf.subarray(at)]);
}

const shrinkAt = (buf, at, size) => {
  return Buffer.concat([buf.subarray(0, at), buf.subarray(at + size)]);
}

module.exports = { extendAt, shrinkAt };
