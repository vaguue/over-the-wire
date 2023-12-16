const { Duplex } = require('stream');
const { PcapDeviceStream } = require('./bindings');
const pick = require('./pick');

const getOptions = obj => pick(obj, 
  'capture', 
  'parse', 
  'iface',
  'mode',
  'direction',
  'packetBufferTimeoutMs',
  'packetBufferSize',
  'snapshotLength',
  'nflogGroup'
);

class PcapDevice extends Duplex {
  constructor(options) {
    super({ objectMode: true });

    this.options = getOptions(options);
    this.options.capture = this.options.capture ?? true;

    this.pcapInternal = new PcapDeviceStream({
      ...this.options,
      push: this.push.bind(this),
    });
  }

  _read(size) {
    if (!this.options.capture) {
      this.push(null);
    }
  }

  _write(chunk, encoding, callback) {
    return this.pcapInternal._write(chunk, callback);
  }

  _final(callback) {
    delete this.pcapInternal;
    callback();
  }

  get stats() {
    return this.pcapInternal.stats;
  }
}

module.exports = PcapDevice;
