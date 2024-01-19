const fs = require('fs');
const { Pcap } = require('..');

const dev = new Pcap.LiveDevice({
  iface: 'en0',
  direction: 'inout',
});

const dump = Pcap.createWriteStream({ format: 'pcapng', interfaces: [dev.iface] });
dump.pipe(fs.createWriteStream('dump.pcapng'));

dev.on('data', pkt => {
  dump.write(pkt);
});
