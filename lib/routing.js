const os = require('node:os');
const fs = require('node:fs');
const readline = require('node:readline');
const { inetPton, inetNtop } = require('#lib/converters');

const platform = os.platform();


/**
 * Retrieves the routing table for all interfaces.
 *
 * @async
 * @function getRoutingTable
 * @returns {Promise<Object>} An object where the keys are interface names and the values are arrays of routing table records.
 * Each routing table record is represented by an object with `destination`, `gateway`, and `mask` properties.
 * 
 * @example
 * const routingTable = await getRoutingTable();
 * // routingTable = {
 * //   eth0: [
 * //     { destination: '0.0.0.0', gateway: '192.168.1.1', mask: '0.0.0.0' },
 * //     { destination: '192.168.1.0', gateway: '0.0.0.0', mask: '255.255.255.0' }
 * //   ],
 * //   wlan0: [
 * //     { destination: '10.0.0.0', gateway: '10.0.0.1', mask: '255.255.255.0' }
 * //   ]
 * // }
 */

if (platform === 'linux') {
  async function getRoutingTable() {
    const rl = readline.createInterface({
      input: fs.createReadStream('/proc/net/route'),
      crlfDelay: Infinity,
    });

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
