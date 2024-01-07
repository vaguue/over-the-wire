const os = require('os');
const { PcapDevice, BpfFilter } = require('..');
require('./traceMemory');

const dev = new PcapDevice({
  capture: true,
  parse: false,
  iface: 'en0',
  direction: 'inout',
});

const selfAddr = os.networkInterfaces().en0[1].address;
//dev.filter = `ip dst not ${selfAddr}`;

const filter = new BpfFilter(`dst host ${selfAddr}`);
console.log('filter', filter.value, filter.linkType);

console.log('stats', dev.devStats);
dev.on('data', (data) => {
  //wconsole.log('match', filter.match(data));
  if (filter.match(data)) {
    //console.log('data', data.toString('hex'));
    //dev.write(data);
  }
  else {
    console.log('not for me');
  }
});

dev.on('error', (err) => {
  console.log(err);
});

const pkt = Buffer.from('7824afccade05ce91e9dfc400800450000340000400040068e56c0a801855fa38a9dd27401bb42875cf60f95f1c78011002e761a00000101080a085d88787c11d214' , 'hex');
dev.write(pkt);
dev.write(new Uint8Array(pkt));

console.log(dev.devStats);
console.log(
  dev.capture, 
  dev.parse, 
  dev.iface,
  dev.mode,
  dev.direction,
  dev.packetBufferTimeoutMs,
  dev.packetBufferSize,
  dev.snapshotLength,
  dev.nflogGroup,
  dev.filter
);
