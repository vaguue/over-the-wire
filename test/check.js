const path = require('node:path');
const fs = require('node:fs');

const { createReadStream, createWriteStream } = require('#lib/pcapFile/index');
const { Packet } = require('#lib/packet');

async function stats(pcapFile) {
  console.log('[*] Info from', pcapFile);
  const pcapng = createReadStream({ format: 'pcapng' });
  const input = fs.createReadStream(path.resolve(__dirname, `data/${pcapFile}`));

  input.pipe(pcapng);

  const srcSet = new Set;
  const dstSet = new Set;

  let resolve, reject;

  const p = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  pcapng.on('data', pkt => {
    if (pkt.layers.IPv4) {
      srcSet.add(pkt.layers.IPv4.src);
      dstSet.add(pkt.layers.IPv4.dst);
    }
    else {
      console.log(Object.keys(pkt.layers));
    }
  });

  pcapng.on('end', () => {
    console.log({ srcSet, dstSet });
    resolve();
  });

  await p;
}

async function main() {
  await stats('startup.pcapng');
  await stats('during-auth.pcapng');
}

main().catch(console.error);
