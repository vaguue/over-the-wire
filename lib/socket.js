const { socket } = require('#lib/bindings');
const { defaultFamily, updateDomain } = require('#lib/af');

const { SockAddr: SockAddrCxx } = socket;

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

module.exports = socket;
