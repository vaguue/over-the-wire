import bindings from '#lib/bindings';
const { BpfFilter: BpfFilterCxx } = bindings;
import { Packet } from '#lib/packet';

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

export { BpfFilter };
export default { BpfFilter };
