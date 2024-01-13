const path = require('path');
const fs = require('fs');
const { Pcap } = require('..');
const { pipeline } = require('stream/promises');

async function pcap() {
  const pcap = Pcap.createReadStream();
  let outPcap;

  console.time('pcap');

  pcap.on('header', hdr => {
    console.log('header', hdr);
    outPcap = Pcap.createWriteStream(hdr);
    outPcap.pipe(fs.createWriteStream(path.resolve(__dirname, 'out1.pcap')));
  });

  pcap.on('data', pkt => {
    console.log('input packet', pkt);
    outPcap.write(pkt);
  });

  pcap.on('error', err => {
    console.error('error', err);
  });

  await pipeline(fs.createReadStream(path.resolve(__dirname, 'example1.pcap'), { /*highWaterMark: 200*/ }), pcap);
  console.timeEnd('pcap');
}

async function pcapng() {
  const pcapng = Pcap.createReadStream({ format: 'pcapng' });
 
  //fs.createReadStream(path.resolve(__dirname, 'pcapng-example.pcapng')).pipe(pcapng);
  fs.createReadStream(path.resolve(__dirname, 'tfp_capture.pcapng')).pipe(pcapng);

  pcapng.on('data', pkt => {
    console.log('input packet', pkt);
  });

  pcapng.on('section-header', hdr => {
    console.log('section-header', hdr);
  });

  pcapng.on('interface-description', hdr => {
    console.log('interface-description', hdr);
  });

  pcapng.on('error', err => {
    console.error('error', err);
  });
}

//pcap().catch(err => console.error('[!]', err));
pcapng().catch(err => console.error('[!]', err));
