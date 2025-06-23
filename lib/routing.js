const os = require('node:os');
const fs = require('node:fs');
const readline = require('node:readline');
const { inetNtop } = require('#lib/converters');
const { socket } = require('#lib/bindings');

const platform = os.platform();

/**
 * getRoutingTable() → {
 *   [iface]: [{
 *     destination,                // 'default' | string
 *     prefixLength,               // number
 *     gateway,                    // IP | null
 *     flags                       // string[]
 *   }]
 * }
 */
if (platform === 'linux') {
  const { RouteFlags } = require('./enums');

  const flagBits = [
    [RouteFlags.RTF_UP, 'U'],
    [RouteFlags.RTF_GATEWAY, 'G'],
    [RouteFlags.RTF_HOST, 'H'],
    [RouteFlags.RTF_REJECT, 'R'],
    [RouteFlags.RTF_DYNAMIC, 'D'],
    [RouteFlags.RTF_MODIFIED, 'M'],
    [RouteFlags.RTF_MULTICAST, 'm'],
  ];

  const parseFlags = v => flagBits.filter(([m]) => (v & m) !== 0).map(([, c]) => c);

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
    if (!fs.promises
      .access('/proc/net/ipv6_route')
      .then(() => true)
      .catch(() => false)
    ) {
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

  async function getRoutingTable() {
    const [v4, v6] = await Promise.all([ipv4Routes(), ipv6Routes()]);
    const merged = { ...v4 };
    for (const [i, lst] of Object.entries(v6)) {
      merged[i] = merged[i] ? merged[i].concat(lst) : lst;
    }
    return merged;
  }

  module.exports = { getRoutingTable };
} else {
  const { getRoutingTable: getRoutingTableCxx } = require('./bindings');
  module.exports = {
    async getRoutingTable() {
      return new Promise((res, rej) => {
        getRoutingTableCxx(r => (r instanceof Error ? rej(r) : res(r)));
      });
    },
  };
}
