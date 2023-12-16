const fs = require('fs');
const { PcapDevice } = require('..');

const dev = new PcapDevice({
  capture: true,
  parse: false,
  iface: 'en0',
  direction: 'out',
});

dev.on('data', (data) => {
  console.log('data', data);
  dev.write(data);
});

dev.on('error', (err) => {
  console.log('error', err);
});

console.log(dev.stats);
