const net = require('node:net');
const ip  = require('ip');

const { getArpTable }     = require('./arp');
const { getRoutingTable } = require('./routing');

gatewayFor('216.58.209.78').then(console.log).catch(console.error);
gatewayFor('127.0.0.1').then(console.log).catch(console.error);

module.exports = gatewayFor;

async function gatewayFor(dstIp = null) {
  const [routes, arp, ndp = {}] = await Promise.all([
    getRoutingTable(),
    getArpTable(),
  ]);

  const flat = Object.entries(routes).flatMap(([iface, list]) =>
    list.map(r => ({
      iface,
      ...r,
      family: net.isIP((r.destination === 'default' ? r.gateway : r.destination) || '') || 4,
      mask:    normalMask(r.mask, r.destination)    // ← поправка №1
    }))
  );

  const route = selectRoute(dstIp, flat);
  if (!route) return null;

  const isV4   = route.family === 4;
  const GW0    = isV4 ? '0.0.0.0' : '::';
  const nextIp =
    !route.gateway || route.gateway === GW0 ? (dstIp ?? '') : route.gateway; // ← поправка №2

  const mac = findMac(nextIp, route.iface, isV4 ? arp : ndp);
  return { iface: route.iface, ip: nextIp, mac: mac || undefined };
}

/*──────────────────── helpers ────────────────────*/

// Пустая маска → маска host-route ( /32 либо /128 )
function normalMask(mask, destination) {
  if (mask && mask !== '') return mask;
  return net.isIP(destination) === 4
    ? '255.255.255.255'
    : 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff';
}

function selectRoute(dstIp, routes) {
  if (dstIp === null)
    return routes.find(r => r.destination === 'default') || null;

  const v4   = net.isIP(dstIp) === 4;
  const dLng = v4 ? ip.toLong(dstIp) : null;

  let best = null, bestPlen = -1;
  for (const r of routes) {
    if (v4 !== (r.family === 4)) continue;
    if (!inSubnet(dstIp, r.destination, r.mask, v4, dLng)) continue;

    const plen = maskLen(r.mask, v4);
    if (plen > bestPlen) { best = r; bestPlen = plen; }
  }
  return best;
}

function maskLen(mask, v4) {
  return v4
    ? ip.subnet('0.0.0.0', mask).subnetMaskLength
    : mask.split(':')
        .map(h => parseInt(h || '0', 16).toString(2).padStart(16, '0'))
        .join('')
        .indexOf('0');
}

function inSubnet(dst, netIp, mask, v4, dLng) {
  if (netIp === 'default') return true;
  if (v4) {
    const base = ip.toLong(netIp);
    const mLng = ip.toLong(mask);
    return (dLng & mLng) === (base & mLng);
  }
  return ip.cidrSubnet(`${netIp}/${maskLen(mask, false)}`).contains(dst);
}

function findMac(ipAddr, iface, table) {
  if (!ipAddr || !table?.[iface]) return null;
  const e = table[iface].find(t => t.ipAddr === ipAddr);
  return e?.hwAddr || null;
}
