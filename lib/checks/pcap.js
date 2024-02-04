const fs = require('fs');
const { Pcap } = require('..');

async function dump() {
  const dev = new Pcap.LiveDevice({
    iface: 'en0',
    direction: 'inout',
  });

  const dump = Pcap.createWriteStream({ format: 'pcapng', interfaces: [dev.iface] });
  dump.pipe(fs.createWriteStream('dump.pcapng'));

  dev.on('data', pkt => {
    dump.write(pkt);
  });
}

async function parse() {
  const dump = Pcap.createReadStream({ format: 'pcapng' });
  fs.createReadStream('dump.pcapng').pipe(dump);

  dump.on('section-header', hdr => {
    console.log('section-header', hdr);
  });

  dump.on('interface-description', hdr => {
    console.log('interface-description', hdr);
  });

  dump.on('data', pkt => {
    console.log('pkt', pkt);
  });
}

parse().catch(console.error);
