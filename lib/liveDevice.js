const { Duplex } = require('stream');
const { PcapDevice: LiveDeviceCxx} = require('./bindings');
const pick = require('./pick');

const optionsKeys = [
  'capture', 
  'parse', 
  'mode',
  'direction',
  'packetBufferTimeoutMs',
  'packetBufferSize',
  'snapshotLength',
  'nflogGroup',
];

const manualOptionsKeys = ['filter', 'iface'];

const getOptions = obj => pick(obj, ...optionsKeys, ...manualOptionsKeys);

class LiveDevice extends Duplex {
  constructor(options) {
    super({ objectMode: true });

    this.options = getOptions(options);
    this.isOpen = false;
    this.capturing = false;
    this.optionsChanged = false;

    optionsKeys.forEach(opt => {
      Object.defineProperty(this, opt, {
        get() {
          return this.options[opt];
        },
        set(val) {
          this.optionsChanged = true;
          return this.options[opt] = val;
        },
      });
    });

    this.options.push = (...args) => {
      const res = this.push(...args);
      if (!res) {
        this.pcapInternal.stopCapture();
        this.capturing = false;
      }
    };

    this.pcapInternal = new LiveDeviceCxx(this.options);
  }

  _construct(callback) {
    if (this.optionsChanged) {
      this.pcapInternal.setConfig(this.options);
    }
    this.pcapInternal.open();
    this.isOpen = true;
    if (this.options.filter) {
      this.pcapInternal.setFilter(this.options.filter);
    }
    callback();
  }


  _read(size) {
    if (this.options.capture === false) {
      this.push(null);
    }
    else if (!this.capturing) {
      this.pcapInternal.startCapture();
      this.capturing = true;
    }
  }

  _write(chunk, encoding, callback) {
    if (Buffer.isBuffer(chunk) || ArrayBuffer.isView(chunk)) {
      if (chunk.length > 0) {
        return this.pcapInternal._write(chunk, callback);
      }
      else {
        callback();
      }
    }
    else {
      callback(new Error('Invalid argument - expected Buffer | TypedArray | [Buffer] | [TypedArray]'));
    }
  }

  _writev(chunks, callback) {
    return this.pcapInternal._write(chunks.map(e => e.chunk), callback);
  }

  _destroy(err, callback) {
    if (this.pcapInternal) {
      this.pcapInternal._destroy();
    }
    callback(err);
  }

  _final(callback) {
    delete this.pcapInternal;
  }

  get stats() {
    if (!this.isOpen) {
      throw new Error('Device is not open');
    }
    return this.pcapInternal.stats;
  }

  set filter(filter) {
    this.options.filter = filter;
    if (this.isOpen) {
      this.pcapInternal.setFilter(filter);
    }

    return filter;
  }

  get filter() {
    return this.options.filter;
  }

  set iface(iface) {
    this.options.iface = iface;
  }

  get iface() {
    return this.pcapInternal.interfaceInfo;
  }
}

module.exports = LiveDevice;