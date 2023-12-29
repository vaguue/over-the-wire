const { socket } = require('./bindings');
module.exports = socket;

const net = require('net');

const { SockAddr: SockAddrCxx } = socket;

function updateDomain(obj, addr) {
  if (net.isIPv4(addr)) {
    obj.domain = socket.AF_INET;
  }
  else if (net.isIPv6(addr)) {
    obj.domain = socket.AF_INET6;
  }
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

socket.SockAddr = SockAddr;
