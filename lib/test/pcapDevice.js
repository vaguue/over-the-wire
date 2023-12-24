const fs = require('fs');
const { PcapDevice } = require('..');

const logFn = './render-log/memory.log';

try {
  fs.unlinkSync(logFn);
} catch(err) {

}

const dev = new PcapDevice({
  capture: true,
  parse: false,
  iface: 'en0',
  direction: 'out',
});

dev.filter = 'ip dst not 192.168.1.133';

dev.on('data', (data) => {
  console.log('data', data.toString('hex'));
  console.log('stats', dev.stats);
  fs.appendFile(logFn, JSON.stringify(process.memoryUsage()) + '\n', () => {});
  dev.write(data);
});

dev.on('error', (err) => {
  console.log(err);
});

const pkt = Buffer.from('7824afccade05ce91e9dfc400800450000340000400040068e56c0a801855fa38a9dd27401bb42875cf60f95f1c78011002e761a00000101080a085d88787c11d214' , 'hex');
dev.write(pkt);
dev.write([pkt]);
dev.write(new Uint8Array(pkt));
dev.write([new Uint8Array(pkt), pkt]);

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
