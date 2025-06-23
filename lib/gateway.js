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

module.exports = { gatewayFor };

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

function inSubnet(dst, netIp, preLen, v4, dLng) {
  if (netIp === 'default') return true;
  if (v4) {
    const base = toLong(netIp);
    const mask = preLen ? (~0 << (32 - preLen)) >>> 0 : 0;
    return (dLng & mask) === (base & mask);
  }

  return cidrContains(`${netIp.split('%')[0]}/${preLen}`, dst);
}
