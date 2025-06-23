function toLong(addr) {
  return addr.split('.').reduce((a, o) => ((a << 8) + (+o & 255)) >>> 0, 0);
}

function prefixMask(len) {
  return len ? (0xffffffff << (32 - len)) >>> 0 : 0;
}

function ipv4Contains(cidr, ip) {
  const [net, len] = cidr.split('/');
  const mask = prefixMask(+len);
  return (toLong(ip) & mask) === (toLong(net) & mask);
}

function v6buf(a) {
  if (a === '::') return Buffer.alloc(16);
  const [h, t] = a.split('::');
  const head = h ? h.split(':') : [];
  const tail = t ? t.split(':') : [];
  const miss = 8 - head.length - tail.length;
  const parts = [...head, ...Array(miss).fill('0'), ...tail].map(x => parseInt(x || '0', 16));
  const b = Buffer.alloc(16);
  parts.forEach((p, i) => b.writeUInt16BE(p, i * 2));
  return b;
}

function ipv6Contains(cidr, ip) {
  const [net, lenStr] = cidr.split('/');
  const len = +lenStr;
  const a = v6buf(ip);
  const n = v6buf(net);
  const bytes = len >> 3;
  const bits = len & 7;
  for (let i = 0; i < bytes; i++) if (a[i] !== n[i]) return false;
  if (!bits) return true;
  const mask = (0xff << (8 - bits)) & 0xff;
  return (a[bytes] & mask) === (n[bytes] & mask);
}

function cidrContains(cidr, ip) {
  return cidr.includes(':') ? ipv6Contains(cidr, ip) : ipv4Contains(cidr, ip);
}

module.exports = { toLong, cidrContains };
