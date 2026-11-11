import os from 'node:os';
import fs from 'node:fs';
import readline from 'node:readline';
import bindings from './bindings.js';
const { getArpTable: getArpTableCxx } = bindings;

const platform = os.platform();


/**
 * Retrieves the ARP (Address Resolution Protocol) table for all interfaces.
 *
 * @async
 * @memberof module:system
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

async function readArpTableFromProc() {
  const rl = readline.createInterface({
    input: fs.createReadStream('/proc/net/arp'),
    crlfDelay: Infinity,
  });

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

const readArpTableFromNative = () => {
  return new Promise((resolve, reject) => {
    getArpTableCxx((res) => {
      if (res instanceof Error) {
        reject(res);
        return;
      }
      resolve(res);
    });
  });
};

const getArpTable = platform === 'linux' ? readArpTableFromProc : readArpTableFromNative;

export { getArpTable };
export default { getArpTable };
