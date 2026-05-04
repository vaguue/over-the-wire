const net = require('node:net');

const { toLong, cidrContains } = require('./ip');
const { getRoutingTable } = require('./routing');

async function check() {
  await gatewayFor('216.58.209.78').then(console.log).catch(console.error);
  await gatewayFor('127.0.0.1').then(console.log).catch(console.error);
  await gatewayFor('2a00:1450:4001:810::200e').then(console.log).catch(console.error);
  await gatewayFor('::1').then(console.log).catch(console.error);
}
//check();

/**
 * Result object containing gateway and interface information.
 * @typedef {Object} GatewayInfo
 * @property {string} iface - The name of the network interface (e.g., 'eth0', 'wlan0').
 * @property {string} ip - The next-hop gateway IP address, or the destination IP itself if on-link.
 * @property {string} family - The address family ('AF_INET' for IPv4 or 'AF_INET6' for IPv6).
 */

/**
 * Determines the appropriate gateway IP address and network interface required to reach a specific destination IP.
 * If no destination IP is provided, it returns the default gateway.
 *
 * @async
 * @function gatewayFor
 * @memberof module:system
 * @param {string|null}[dstIp=null] - The target IP address (IPv4 or IPv6) to route to.
 * @returns {Promise<GatewayInfo|null>} An object with gateway details, or null if no route is found.
 *
 * @example
 * const { system } = require('over-the-wire');
 *
 * // Find route to Google's IPv4
 * const gw4 = await system.gatewayFor('216.58.209.78');
 * console.log(gw4); // { iface: 'eth0', ip: '192.168.1.1', family: 'AF_INET' }
 *
 * // Find route to Google's IPv6
 * const gw6 = await system.gatewayFor('2a00:1450:4001:810::200e');
 * console.log(gw6); // { iface: 'eth0', ip: 'fe80::1', family: 'AF_INET6' }
 */
async function gatewayFor(dstIp = null) {
  const routes = await getRoutingTable();

  const flat = Object.entries(routes).flatMap(([iface, list]) =>
    list.map(r => ({
      iface,
      ...r,
      af: r.family,
      family: [{ name: 'AF_INET', value: 4 }, { name: 'AF_INET6', value: 6 }].find(e => e.name == r.family)?.value ?? 0,
    }))
  );

  const route = selectRoute(dstIp, flat);
  if (!route) return null;

  const isV4 = route.family === 4;
  const gwZero = isV4 ? '0.0.0.0' : '::';
  const nextIp = route.onLink || !route.gateway || route.gateway === gwZero ? (dstIp ?? '') : route.gateway;

  return { iface: route.iface, ip: nextIp, family: route.af };
}

module.exports = { gatewayFor };

/**
 * Selects the best matching route for a given destination IP based on prefix length and metric.
 *
 * @private
 * @param {string|null} dstIp - The target IP address.
 * @param {Array<Object>} routes - A flattened array of routing table entries.
 * @returns {Object|null} The best route object, or null if no route matches.
 */
function selectRoute(dstIp, routes) {
  if (dstIp === null) {
    const defaults = routes.filter(r => r.destination === 'default');
    if (!defaults.length) return null;
    return defaults.reduce((best, r) =>
      r.metric < best.metric || (r.metric === best.metric && r.family === 4 && best.family === 6) ? r : best
    );
  }

  const v4 = net.isIP(dstIp) === 4;
  const dLng = v4 ? toLong(dstIp) : null;

  let best = null, bestLen = -1, bestMetric = Infinity;
  for (const r of routes) {
    if (v4 !== (r.family === 4)) continue;
    if (!inSubnet(dstIp, r.destination, r.prefixLength, v4, dLng)) continue;

    if (r.prefixLength > bestLen || (r.prefixLength === bestLen && r.metric < bestMetric)) {
      best = r; bestLen = r.prefixLength; bestMetric = r.metric;
    }
  }
  return best;
}

/**
 * Checks if an IP address belongs to a specific subnet.
 *
 * @private
 * @param {string} dst - The target IP address.
 * @param {string} netIp - The network IP address (or 'default').
 * @param {number} preLen - The prefix length (subnet mask).
 * @param {boolean} v4 - True if evaluating an IPv4 address, false for IPv6.
 * @param {number|null} dLng - The target IP address converted to a long integer (IPv4 only).
 * @returns {boolean} True if the IP is within the subnet, false otherwise.
 */
function inSubnet(dst, netIp, preLen, v4, dLng) {
  if (netIp === 'default') return true;
  if (v4) {
    const base = toLong(netIp);
    const mask = preLen ? (~0 << (32 - preLen)) >>> 0 : 0;
    return (dLng & mask) === (base & mask);
  }

  return cidrContains(`${netIp.split('%')[0]}/${preLen}`, dst);
}
