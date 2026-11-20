`hcitool lescan`, from a capture: every Bluetooth Low Energy device heard advertising, with its signal strength and name. Give it a capture file, or run it without one on Linux to watch the `bluetooth0` adapter live.

```javascript
import fs from 'node:fs';

import otw from 'over-the-wire';

const file = process.argv[2];
const wire = otw('bluetooth0');

const fromFile = (path) => {
  const format = path.endsWith('.pcapng') ? 'pcapng' : 'pcap';
  return fs.createReadStream(path).pipe(otw.pcap.createReadStream({ format }));
};

const packets = file === undefined ? await wire.capture() : fromFile(file);
const namesHeard = new Map();

packets.on('data', (packet) => {
  for (const { address, rssi, name } of packet.layers.HCIEvent?.advertisingReports ?? []) {
    const isNew = !namesHeard.has(address);
    const gotItsName = name !== null && namesHeard.get(address) === null;

    if (isNew || gotItsName) {
      console.log(`${address}  ${String(rssi).padStart(4)} dBm  ${name ?? ''}`.trimEnd());
      namesHeard.set(address, name);
    }
  }
});
```

A capture to read comes from `tcpdump -i bluetooth0 -w scan.pcap` on Linux, or from Wireshark on the `bluetooth0` interface.

Live capture is Linux only, needs the privileges tcpdump needs, and only shows advertising while something makes the adapter scan, for example `bluetoothctl scan on`. macOS and Windows give applications no access to HCI, so there `wire.capture()` rejects with `ENOTSUPPORTED` and the reason; capture files are read everywhere.
