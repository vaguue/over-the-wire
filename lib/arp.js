const os = require('node:os');
const fs = require('node:fs');
const readline = require('node:readline');

const platform = os.platform();


/**
 * Retrieves the ARP (Address Resolution Protocol) table for all interfaces.
 *
 * @async
 * @function getArpTable
 * @returns {Promise<Object>} An object where the keys are interface names and the values are arrays of ARP records.
 * Each ARP record is represented by an object with `ipAddr` (IP address) and `hwAddr` (hardware address) properties.
 * 
 * @example
 * const arpTable = await getArpTable();
 * // arpTable = {
 * //   eth0: [
 * //     { ipAddr: '192.168.1.1', hwAddr: '00:1A:2B:3C:4D:5E' },
 * //     { ipAddr: '192.168.1.2', hwAddr: '00:1A:2B:3C:4D:5F' }
 * //   ],
 * //   wlan0: [
 * //     { ipAddr: '192.168.1.3', hwAddr: '00:1A:2B:3C:4D:60' }
 * //   ]
 * // }
 */

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
