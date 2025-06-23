const os = require('node:os');
const fs = require('node:fs');
const readline = require('node:readline');

const { inetPton, inetNtop } = require('#lib/converters');
const { socket } = require('#lib/bindings');

const platform = os.platform();

/**
 * Retrieves the routing table for all interfaces (IPv4 and IPv6).
 *
 * @async
 * @function getRoutingTable
 * @returns {Promise<Object>} An object where the keys are interface names and the values are arrays of routing table records.
 * Each routing table record is represented by an object with `destination`, `gateway`, `mask`, and `flags` properties.
 *
 * IPv4 entries are extracted from `/proc/net/route`.
 * IPv6 entries are extracted from `/proc/net/ipv6_route`.
 */

if (platform === 'linux') {
  const { RouteFlags } = require('./enums');

  const routeFlagBits = [
    [RouteFlags.RTF_UP, 'U'],
    [RouteFlags.RTF_GATEWAY, 'G'],
    [RouteFlags.RTF_HOST, 'H'],
    [RouteFlags.RTF_REJECT, 'R'],
    [RouteFlags.RTF_DYNAMIC, 'D'],
    [RouteFlags.RTF_MODIFIED, 'M'],
    [RouteFlags.RTF_MULTICAST, 'm'],
    [RouteFlags.RTF_DONE, 'd'],
    [RouteFlags.RTF_CLONING, 'C'],
    [RouteFlags.RTF_XRESOLVE, 'X'],
    [RouteFlags.RTF_LLINFO, 'L'],
    [RouteFlags.RTF_STATIC, 'S'],
    [RouteFlags.RTF_PROTO1, '1'],
    [RouteFlags.RTF_PROTO2, '2'],
    [RouteFlags.RTF_WASCLONED, 'W'],
    [RouteFlags.RTF_PRCLONING, 'c'],
    [RouteFlags.RTF_PROTO3, '3'],
    [RouteFlags.RTF_BLACKHOLE, 'B'],
    [RouteFlags.RTF_BROADCAST, 'b'],
    [RouteFlags.RTF_IFSCOPE, 'I'],
    [RouteFlags.RTF_IFREF, 'i'],
    [RouteFlags.RTF_PROXY, 'Y'],
    [RouteFlags.RTF_ROUTER, 'r'],
  ];

  if ('RTF_GLOBAL' in RouteFlags) {
    routeFlagBits.push([RouteFlags.RTF_GLOBAL, 'g']);
  }

  function parseRouteFlags(flagValue) {
    return routeFlagBits
      .filter(([mask]) => (flagValue & mask) !== 0)
      .map(([, ch]) => ch)
      .join('');
  }

  function hexToIPv6(hex) {
    if (!hex || hex.length !== 32) return '';
    const bytes = Buffer.alloc(16);
    for (let i = 0; i < 16; i++) {
      bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    return inetNtop(socket.AF_INET6, bytes);
  }

  function withZone(addr, iface) {
    return addr && addr.startsWith('fe80::') ? `${addr}%${iface}` : addr;
  }

  async function parseIPv4Routes() {
    const rl = readline.createInterface({
      input: fs.createReadStream('/proc/net/route'),
      crlfDelay: Infinity,
    });

    const res = {};
    let first = true;
    for await (const line of rl) {
      if (first) {
        first = false;
        continue;
      }
      const [iface, destination, gateway, flags,,,, mask] = line.trim().split(/\s+/);
      if (!res[iface]) res[iface] = [];
      res[iface].push({
        destination: inetNtop(parseInt(destination, 16)),
        gateway: inetNtop(parseInt(gateway, 16)),
        flags: parseRouteFlags(parseInt(flags, 16)),
        mask: inetNtop(parseInt(mask, 16)),
        family: 'AF_INET',
      });
    }
    return res;
  }

  /**
   * Parse /proc/net/ipv6_route.
   * File layout (kernel ≥2.6):
   *   dest(32hex) dest_plen src(32hex) src_plen gateway(32hex) metric refcnt use flags iface
   * We are interested in dest, dest_plen, gateway, flags, iface.
   */
  async function parseIPv6Routes() {
    if (!fs.existsSync('/proc/net/ipv6_route')) return {};

    const rl = readline.createInterface({
      input: fs.createReadStream('/proc/net/ipv6_route'),
      crlfDelay: Infinity,
    });

    const res = {};
    for await (const line of rl) {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 10) continue;

      const [destHex, destPlenHex,, , gatewayHex,, , , flagsHex, iface] = parts;

      const prefixLen = parseInt(destPlenHex, 16);
      const destAddr = hexToIPv6(destHex);
      const gwAddr = hexToIPv6(gatewayHex);
      const destination = prefixLen === 0 ? 'default' : `${withZone(destAddr, iface)}/${prefixLen}`;

      if (!res[iface]) res[iface] = [];
      res[iface].push({
        destination,
        gateway: withZone(gwAddr, iface),
        mask: '',
        flags: parseRouteFlags(parseInt(flagsHex, 16)),
        family: 'AF_INET6',
      });
    }
    return res;
  }

  async function getRoutingTable() {
    const [v4, v6] = await Promise.all([parseIPv4Routes(), parseIPv6Routes()]);

    const merged = { ...v4 };
    for (const [iface, routes] of Object.entries(v6)) {
      if (!merged[iface]) merged[iface] = [];
      merged[iface].push(...routes);
    }
    return merged;
  }

  module.exports = { getRoutingTable };
} else {
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
  };
}

//module.exports.getRoutingTable().then(console.log)
