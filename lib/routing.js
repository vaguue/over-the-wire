import os from 'node:os';
import fs from 'node:fs';
import readline from 'node:readline';
import converters from '#lib/converters';
const { inetNtop } = converters;
import bindings from '#lib/bindings';
import { RouteFlags } from '#lib/enums';

const { socket, getRoutingTable: getRoutingTableCxx } = bindings;

const platform = os.platform();

/**
 * A single entry in the system routing table.
 * @typedef {Object} RouteEntry
 * @property {string} destination - The destination IP, network, or 'default'.
 * @property {number} prefixLength - The network mask prefix length (e.g., 24, 64).
 * @property {string} gateway - The gateway IP address.
 * @property {number} metric - Route metric value.
 * @property {string[]} flags - Array of route flags (e.g., ['U', 'G', 'H']).
 * @property {string} family - The address family ('AF_INET' or 'AF_INET6').
 */

/**
 * Retrieves the system's IP routing table.
 *
 * @async
 * @function getRoutingTable
 * @memberof module:system
 * @returns {Promise<Object<string, RouteEntry[]>>} An object mapping interface names to arrays of route entries.
 */

const linuxRouteFlagLetters = () => {
  return [
    [RouteFlags.RTF_UP, 'U'],
    [RouteFlags.RTF_GATEWAY, 'G'],
    [RouteFlags.RTF_HOST, 'H'],
    [RouteFlags.RTF_REJECT, 'R'],
    [RouteFlags.RTF_DYNAMIC, 'D'],
    [RouteFlags.RTF_MODIFIED, 'M'],
    [RouteFlags.RTF_MULTICAST, 'm'],
  ];
};

const parseFlags = (value) => {
  return linuxRouteFlagLetters()
    .filter(([mask]) => (value & mask) !== 0)
    .map(([, letter]) => letter);
};

const hexToIPv6 = hex => {
  if (!hex || hex.length !== 32) return '';
  const buf = Buffer.alloc(16);
  for (let i = 0; i < 16; i++) buf[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return inetNtop(socket.AF_INET6, buf);
};

const withZone = (a, i) => (a && a.startsWith('fe80::') ? `${a}%${i}` : a);

const prefixFromMask = m =>
  m
    .split('.')
    .map(o => parseInt(o, 10).toString(2))
    .reduce((s, b) => s + [...b].filter(x => x === '1').length, 0);

async function ipv4Routes() {
  const out = {};
  const rl = readline.createInterface({
    input: fs.createReadStream('/proc/net/route'),
    crlfDelay: Infinity,
  });
  let skip = true;
  for await (const line of rl) {
    if (skip) {
      skip = false;
      continue;
    }
    const [
      iface,
      dstHex,
      gwHex,
      flHex,
      ,
      ,
      metricStr,
      maskHex,
    ] = line.trim().split(/\s+/);

    const dstIp = inetNtop(parseInt(dstHex, 16));
    const gwIp = inetNtop(parseInt(gwHex, 16));
    const maskIp = inetNtop(parseInt(maskHex, 16));

    const flags = parseFlags(parseInt(flHex, 16));
    const gateway = gwIp;
    const prefix = dstIp === '0.0.0.0' ? 0 : prefixFromMask(maskIp);
    const destination = prefix === 0 ? 'default' : dstIp;

    if (!out[iface]) out[iface] = [];
    out[iface].push({
      destination,
      prefixLength: prefix,
      gateway,
      metric: parseInt(metricStr, 10),
      flags,
      family: 'AF_INET',
    });
  }
  return out;
}

async function ipv6Routes() {
  const hasIpv6Routes = await fs.promises
    .access('/proc/net/ipv6_route')
    .then(() => true)
    .catch(() => false);

  if (!hasIpv6Routes) {
    return {};
  }

  const out = {};
  const rl = readline.createInterface({
    input: fs.createReadStream('/proc/net/ipv6_route'),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const p = line.trim().split(/\s+/);
    if (p.length < 10) continue;
    const [dstHex, plenHex, , , gwHex, metricHex, , , flHex, iface] = p;

    const dstIp = hexToIPv6(dstHex);
    const gwIp = hexToIPv6(gwHex);
    const prefix = parseInt(plenHex, 16);
    const flags = parseFlags(parseInt(flHex, 16));
    const gateway = withZone(gwIp, iface);
    const destination = prefix === 0 ? 'default' : withZone(dstIp, iface);

    if (!out[iface]) out[iface] = [];
    out[iface].push({
      destination,
      prefixLength: prefix,
      gateway,
      metric: parseInt(metricHex, 16),
      flags,
      family: 'AF_INET6',
    });
  }
  return out;
}

async function readRoutingTableFromProc() {
  const [v4, v6] = await Promise.all([ipv4Routes(), ipv6Routes()]);
  const merged = { ...v4 };
  for (const [i, lst] of Object.entries(v6)) {
    merged[i] = merged[i] ? merged[i].concat(lst) : lst;
  }
  return merged;
}

const readRoutingTableFromNative = () => {
  return new Promise((resolve, reject) => {
    getRoutingTableCxx((res) => {
      if (res instanceof Error) {
        reject(res);
        return;
      }
      resolve(res);
    });
  });
};

const getRoutingTable = platform === 'linux' ? readRoutingTableFromProc : readRoutingTableFromNative;

export { getRoutingTable };
export default { getRoutingTable };
