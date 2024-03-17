const { socket } = require('#lib/bindings');
const { isIPv4, isIPv6 } = require('net');

function defaultFamily(addr) {
  if (isIPv4(addr)) {
    return socket.AF_INET;
  }
  else if (isIPv6(addr)) {
    return socket.AF_INET6;
  }

  throw new Error(`Uknown addr type ${addr}`);
}

function updateDomain(obj, addr) {
  obj.domain = defaultFamily(addr);
}

module.exports = { defaultFamily, updateDomain };
