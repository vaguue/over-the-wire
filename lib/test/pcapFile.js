const path = require('path');
const fs = require('fs');
const pcapFile = require('../pcapFile');

async function main() {
  const pcap = pcapFile.createReadStream();
  let outPcap;

  fs.createReadStream(path.resolve(__dirname, 'example1.pcap')).pipe(pcap);

  pcap.on('header', hdr => {
    console.log('header', hdr);
    outPcap = pcapFile.createWriteStream(hdr);
    outPcap.pipe(fs.createWriteStream(path.resolve(__dirname, 'out1.pcap')));
  });

  pcap.on('data', pkt => {
    console.log('input packet', pkt);
    outPcap.write(pkt);
  });

  pcap.on('error', err => {
    console.error('error', err);
  });
}

main().catch(err => console.error('[!]', err));
