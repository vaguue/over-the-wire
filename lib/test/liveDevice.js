const os = require('os');
const { Pcap, BpfFilter } = require('..');
require('./traceMemory');

const { LiveDevice } = Pcap;

const dev = new LiveDevice({
  iface: 'en0',
  direction: 'inout',
});

const selfAddr = os.networkInterfaces().en0[1].address;
//dev.filter = `ip dst not ${selfAddr}`;

const filter = new BpfFilter(`dst host ${selfAddr}`);
console.log('filter', filter.value, filter.linkType);

console.log('iface', dev.iface);
//dev.on('data', (data) => {
  //console.log('match', filter.match(data));
  /*if (filter.match(data)) {
    console.log('data', data.toString('hex'));
    dev.write(data);
  }
  else {
    console.log('not for me');
  }*/
//});

dev.on('error', (err) => {
  console.log(err);
});

const pkt = Buffer.from('7824afccade05ce91e9dfc400800450000340000400040068e56c0a801855fa38a9dd27401bb42875cf60f95f1c78011002e761a00000101080a085d88787c11d214' , 'hex');
dev.write(pkt);
dev.write(new Uint8Array(pkt));

/*console.log({
  capture: dev.capture,
  parse: dev.parse,
  iface: dev.iface,
  mode: dev.mode,
  direction: dev.direction,
  packetBufferTimeoutMs: dev.packetBufferTimeoutMs,
  packetBufferSize: dev.packetBufferSize,
  snapshotLength: dev.snapshotLength,
  nflogGroup: dev.nflogGroup,
  filter: dev.filter,
});*/
