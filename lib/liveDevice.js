import { Duplex } from 'stream';
import bindings from '#lib/bindings';
const { PcapDevice: LiveDeviceCxx } = bindings;
import { pick } from '#lib/pick';
import { Packet } from '#lib/packet';
import { PacketBuilder } from '#lib/packetBuilder';
import { installExpect } from '#lib/expect';

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

/**
 * @typedef {Object} LiveDeviceOptions
 * @property {string} [mode] - The mode of the device, either "promiscuous" or "normal".
 * @property {string} [direction] - The direction of packet capture, either "inout", "in", or "out".
 * @property {number} [packetBufferTimeoutMs] - The packet buffer timeout in milliseconds.
 * @property {number} [packetBufferSize] - The size of the packet buffer.
 * @property {number} [snapshotLength] - The snapshot length for packet capture.
 * @property {number} [nflogGroup] - The NFLOG group.
 * @property {string} [iface] - The network interface name.
 * @property {string} [filter] - The filter string for packet capture.
 */


/**
 * @typedef {Object} DeviceStats
 * @property {number} packetsDrop - The number of packets dropped.
 * @property {number} packetsDropByInterface - The number of packets dropped by the interface.
 * @property {number} packetsRecv - The number of packets received.
 */

/**
 * @typedef {Object} InterfaceInfo
 * @property {string} name - The name of the network interface.
 * @property {string} description - The description of the network interface.
 * @property {string} mac - The MAC address of the network interface.
 * @property {string} gateway - The gateway address of the network interface.
 * @property {number} mtu - The Maximum Transmission Unit size.
 * @property {string} linktype - The link type of the network interface.
 * @property {string[]} dnsServers - The DNS servers associated with the network interface.
 * @property {string[]} addresses - The IP addresses associated with the network interface.
 */

/**
 * @class
 * @memberof module:pcap
 * Duplex stream for capturing and injecting packets on a specific device.
 * @extends stream.Duplex
 */
class LiveDevice extends Duplex {
  /**
   * Creates an instance of LiveDevice.
   * @param {LiveDeviceOptions} options - The options for the LiveDevice instance.
   */
  constructor(options = {}) {
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

    this.options.push = (buffer) => {
      if (!this._ifaceCached) {
        this._ifaceCached = this.iface;
      }

      const res = this.push(new Packet({ buffer, iface: this._ifaceCached }));

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

    if (!this.pcapInternal) {
      return callback();
    }

    try {
      this.pcapInternal.open();
    } catch (err) {
      return callback(err);
    }

    this.isOpen = true;
    if (this.options.filter) {
      this.pcapInternal.setFilter(this.options.filter);
    }
    callback();
  }

  _read(size) {
    if (this.options.capture === false) {
      this.push(null);
    } else if (!this.capturing) {
      this.pcapInternal.startCapture();
      this.capturing = true;
    }
  }

  _write(chunk, encoding, callback) {
    if (chunk instanceof PacketBuilder) {
      return this.pcapInternal._write(chunk.build().buffer, callback);
    }

    if (chunk instanceof Packet) {
      return this.pcapInternal._write(chunk.buffer, callback);
    }
    if (Buffer.isBuffer(chunk) || ArrayBuffer.isView(chunk)) {
      if (chunk.length > 0) {
        return this.pcapInternal._write(chunk, callback);
      } else {
        callback();
      }
    } else {
      callback(new Error('Invalid argument - expected Packet | Buffer | TypedArray'));
    }
  }

  _writev(chunks, callback) {
    const buffers = chunks.map(({ chunk }) => {
      if (chunk instanceof PacketBuilder) {
        return chunk.build().buffer;
      }

      if (chunk instanceof Packet) {
        return chunk.buffer;
      }

      return chunk;
    });

    return this.pcapInternal._write(buffers, callback);
  }

  _destroy(err, callback) {
    if (this.pcapInternal) {
      this.pcapInternal._destroy();
    }
    callback(err);
  }

  _final(callback) {
    this.pcapInternal._destroy();
    delete this.pcapInternal;
    callback();
  }

  /**
   * The statistics of the device.
   * @throws {Error} If the device is not open.
   * @type {DeviceStats}
   */
  get stats() {
    if (!this.isOpen) {
      throw new Error('Device is not open');
    }
    return this.pcapInternal.stats;
  }

  /**
   * The filter for the device.
   * @type {string}
   */
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

  /**
   * The interface information for the device.
   * @type {InterfaceInfo}
   */
  get iface() {
    return this.pcapInternal.interfaceInfo;
  }
}

installExpect(LiveDevice);

export { LiveDevice };
export default { LiveDevice };
