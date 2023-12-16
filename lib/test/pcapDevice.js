const fs = require('fs');
const { PcapDevice } = require('..');

const dev = new PcapDevice({
  capture: true,
  parse: false,
  iface: 'en0',
  direction: 'out',
  filter: 'ip dst 192.168.1.133',
});

dev.on('data', (data) => {
  console.log('data', data);
  dev.write(data);
});

dev.on('error', (err) => {
  console.log('error', err);
});

console.log(dev.stats);
