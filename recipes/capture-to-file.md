```javascript
import fs from 'node:fs';
import otw from 'over-the-wire';

const wire = otw({ iface: 'en0' });

const capture = await wire.capture(wire.filter().tcp({ port: 443 }));
const file = otw.Pcap.createWriteStream({ format: 'pcapng' });

capture.pipe(file).pipe(fs.createWriteStream('https.pcapng'));

setTimeout(() => {
  capture.destroy();
  file.end();
}, 10000);
```

The result opens in Wireshark and tcpdump. Use `format: 'pcap'` for the classic format.
