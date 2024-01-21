const { socket } = require('./bindings');
module.exports = socket;

const net = require('net');

const { SockAddr: SockAddrCxx } = socket;

function defaultFamily(addr) {
  if (net.isIPv4(addr)) {
    return socket.AF_INET;
  }
  else if (net.isIPv6(addr)) {
    return socket.AF_INET6;
  }

  throw new Error(`Uknown addr type ${addr}`);
}

function updateDomain(obj, addr) {
  obj.domain = defaultFamily(addr);
}

class SockAddr extends SockAddrCxx {
  constructor(obj) {
    super(obj);
    if (this.domain == -1) {
      updateDomain(this, obj.ip);
    }
  }

  set ip(val) {
    if (this.domain == -1) {
      updateDomain(this, val);
    }
    this.ip = ip;
  }
};

const { inetNtop, inetPton } = socket;

socket.inetNtop = (...args) => {
  if (args.length == 1) {
    const [addr] = args;
    try {
      return inetNtop(socket.AF_INET, addr);
    } catch(err) {
      return inetNtop(socket.AF_INET6, addr);
    }
  }
  return inetPton(...args);
};

socket.inetPton = (...args) => {
  if (args.length == 1) {
    const [addr] = args;
    return inetPton(defaultFamily(addr), addr);
  }
  return inetPton(...args);
}

socket.SockAddr = SockAddr;
