import { Wire } from '#lib/wire';

const ADAPTER_PATTERN = /^(?:hci|bluetooth)(\d+)$/;

const limitations = {
  linux: {
    capture: null,
    send: 'libpcap cannot inject on Bluetooth devices. Sending needs an HCI socket, which wire.socket() does not open yet.',
  },
  darwin: {
    capture: 'macOS gives applications no access to HCI: there is no capture device for Bluetooth. Record with PacketLogger and read the file.',
    send: 'macOS gives applications no access to HCI: only CoreBluetooth can talk to a device.',
  },
  win32: {
    capture: 'Windows has no capture device for Bluetooth: Npcap does not see the Bluetooth stack.',
    send: 'Windows has no HCI sockets: only its own Bluetooth APIs can talk to a device.',
  },
};

const unsupportedEverywhereElse = {
  capture: 'Bluetooth capture is only available on Linux.',
  send: 'Sending Bluetooth packets is not available on this system.',
};

const notSupported = (message) => {
  const err = new Error(message);
  err.code = 'ENOTSUPPORTED';
  return err;
};

const adapterNumber = (iface) => {
  const [, number] = (iface ?? '').match(ADAPTER_PATTERN) ?? [];
  return number;
};

const captureDeviceOf = (iface) => {
  const number = adapterNumber(iface);
  return number === undefined ? iface : `bluetooth${number}`;
};

class BluetoothWire extends Wire {
  static claims(iface) {
    return adapterNumber(iface) !== undefined;
  }

  constructor({ iface = 'bluetooth0', ...options } = {}) {
    const number = adapterNumber(iface);

    super({ ...options, iface: `bluetooth${number}` });

    this.adapter = `hci${number}`;
    this.limitations = limitations[this.system.platform] ?? unsupportedEverywhereElse;
  }

  supports(operation) {
    return this.limitations[operation] === null;
  }

  async defaultInterface() {
    return this.iface;
  }

  async capture(filterOrOptions = {}) {
    if (!this.supports('capture')) {
      throw notSupported(this.limitations.capture);
    }

    try {
      return await super.capture(filterOrOptions);
    }
    catch (err) {
      const noDevice = new Error(`No capture device ${this.iface}: ${err.message}. Either the adapter ${this.adapter} is absent or this libpcap has no Bluetooth support.`);
      noDevice.code = 'ENODEVICE';
      throw noDevice;
    }
  }

  async deviceFor() {
    throw notSupported(this.limitations.send);
  }
}

Wire.kinds.push(BluetoothWire);

export { BluetoothWire, captureDeviceOf };
export default { BluetoothWire };
