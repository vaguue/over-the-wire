const extendAt = (buf, at, size) => {
  return Buffer.concat([buf.subarray(0, at), Buffer.alloc(size), buf.subarray(at)]);
}

const shrinkAt = (buf, at, size) => {
  return Buffer.concat([buf.subarray(0, at), buf.subarray(at + size)]);
}

function fromNumber(num){
  const buffArr = [];

  do {
    buffArr.push(num & 0xff);
  } while((num >>= 8) > 0);

  return Buffer.from(buffArr.reverse())
}

module.exports = { extendAt, shrinkAt, fromNumber };
