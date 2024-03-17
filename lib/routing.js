const os = require('node:os');
const fs = require('node:fs');
const readline = require('node:readline');
const { inetPton, inetNtop } = require('#lib/converters');

const platform = os.platform();

if (platform === 'linux') {
  const rl = readline.createInterface({
    input: fs.createReadStream('/proc/net/route'),
    crlfDelay: Infinity,
  });

  async function getRoutingTable() {
    const res = {};
    let fst = true;
    for await (const line of rl) {
      if (fst) {
        fst = false;
        continue;
      }

      const [iface, destination, gateway, flags,,,, mask] = line.split(/\s/).filter(e => e.length > 0);

      if (!res[iface]) {
        res[iface] = [];
      }

      res[iface].push({
        destination: inetNtop(parseInt(destination, 16)),
        gateway: inetNtop(parseInt(gateway, 16)),
        flags: parseInt(flags, 16),
        mask: inetNtop(parseInt(mask, 16)),
      });
    }
    return res;
  }

  module.exports = { getRoutingTable };
}
else {
  const { getRoutingTable: getRoutingTableCxx } = require('./bindings');

  module.exports = {
    async getRoutingTable() {
      return new Promise((resolve, reject) => {
        getRoutingTableCxx(res => {
          if (res instanceof Error) {
            reject(res);
          }
          resolve(res);
        });
      });
    },
  }
}
