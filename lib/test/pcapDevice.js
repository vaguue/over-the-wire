const fs = require('fs');
const { PcapDevice } = require('..');

const dev = new PcapDevice({
  capture: true,
  parse: false,
  iface: 'en0',
  direction: 'out',
});

dev.setFilter('ip dst not 192.168.1.133');

dev.on('data', (data) => {
  console.log('data', data);
  fs.appendFileSync('memory.log', JSON.stringify(process.memoryUsage()) + '\n');
  dev.write(data);
});

dev.on('error', (err) => {
  console.log('error', err);
});

async function main() {
  while (true) {
    await new Promise((resolve, reject) => setTimeout(resolve, 10));
    console.log('kek');
  }
}

main().catch(console.error);

console.log(dev.stats);
