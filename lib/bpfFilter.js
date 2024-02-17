const { BpfFilter: BpfFilterCxx } = require('./bindings');
const { Packet } = require('./packet');

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

module.exports = BpfFilter;
