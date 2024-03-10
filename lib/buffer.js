/**
 * @param buf {Buffer}
 * @param at {number}
 * @param size {number}
 * @return {Buffer}
 */
const extendAt = (buf, at, size) => {
  return Buffer.concat([buf.subarray(0, at), Buffer.alloc(size), buf.subarray(at)]);
};

/**
 * @param buf {Buffer}
 * @param at {number}
 * @param size {number}
 * @return {Buffer}
 */
const shrinkAt = (buf, at, size) => {
  return Buffer.concat([buf.subarray(0, at), buf.subarray(at + size)]);
};

function fromNumber(num){
  const bufAr = [];

  do {
    bufAr.push(num & 0xff);
  } while((num >>= 8) > 0);
  
  return Buffer.from(bufAr.reverse())
}

module.exports = { extendAt, shrinkAt, fromNumber };
