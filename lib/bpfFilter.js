const { BpfFilter: BpfFilterCxx } = require('#lib/bindings');
const { Packet } = require('#lib/packet');

class BpfFilter extends BpfFilterCxx {
  constructor(...args) {
    super(...args);
  }

  match(pkt, ...args) {
    if (pkt instanceof Packet) {
      return super.match(pkt.buffer, ...args);
    }
    return super.match(pkt, ...args);
  }
}

module.exports = { BpfFilter };
