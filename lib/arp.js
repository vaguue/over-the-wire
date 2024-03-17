const os = require('node:os');
const fs = require('node:fs');
const readline = require('node:readline');

const platform = os.platform();

if (platform === 'linux') {
  const rl = readline.createInterface({
    input: fs.createReadStream('/proc/net/arp'),
    crlfDelay: Infinity,
  });

  async function getArpTable() {
    const res = {};
    let fst = true;
    for await (const line of rl) {
      if (fst) {
        fst = false;
        continue;
      }
      const [ipAddr, hwType, flags, hwAddr, _, device] = line.split(/\s/).filter(e => e.length > 0);
      if (!res[device]) {
        res[device] = [];
      }
      res[device].push({ ipAddr, hwType: Number(hwType), flags: Number(flags), hwAddr });
    }
    return res;
  }

  module.exports = { getArpTable };
}
else {
  const { getArpTable: getArpTableCxx } = require('./bindings');

  module.exports = {
    async getArpTable() {
      return new Promise((resolve, reject) => {
        getArpTableCxx(res => {
          if (res instanceof Error) {
            reject(res);
          }
          resolve(res);
        });
      });
    },
  }
}
