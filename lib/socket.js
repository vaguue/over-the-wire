import bindings from '#lib/bindings';
const { socket } = bindings;
import { defaultFamily, updateDomain } from '#lib/af';

const { SockAddr: SockAddrCxx } = socket;

class SockAddr extends SockAddrCxx {
  constructor(obj) {
    super(obj);
    if (this.domain == -1) {
      updateDomain(this, obj.ip);
    }
  }

  get ip() {
    return super.ip;
  }

  set ip(val) {
    if (this.domain == -1) {
      updateDomain(this, val);
    }
    super.ip = val;
  }
};

socket.SockAddr = SockAddr;

export default socket;
