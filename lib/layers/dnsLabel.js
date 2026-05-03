// RFC 1035 §3.1 / §4.1.4 - DNS name encoding and pointer compression.
// `message` is the full DNS payload (everything after the UDP header), so that
// pointers can be resolved against absolute offsets.

const MAX_JUMPS = 32;

/**
 * Parse a domain name starting at `offset` in `message`.
 * @param {Buffer} message
 * @param {number} offset
 * @returns {{name: string, next: number}} `next` is the offset right after the
 *   name in the original (uncompressed) stream; not where pointer-following
 *   landed.
 */
function parseName(message, offset) {
  const labels = [];
  let cur = offset;
  let nextOffset = -1;
  let jumps = 0;

  while (true) {
    if (cur >= message.length) throw new Error('DNS: name parse out of bounds');
    const b = message[cur];

    if (b === 0) {
      cur++;
      break;
    }

    if ((b & 0xC0) === 0xC0) {
      if (cur + 1 >= message.length) throw new Error('DNS: bad pointer');
      const ptr = ((b & 0x3F) << 8) | message[cur + 1];
      if (nextOffset === -1) nextOffset = cur + 2;
      cur = ptr;
      jumps++;
      if (jumps > MAX_JUMPS) throw new Error('DNS: too many name pointers');
      continue;
    }

    if ((b & 0xC0) !== 0) throw new Error('DNS: invalid label flags');

    const len = b;
    cur++;
    if (cur + len > message.length) throw new Error('DNS: label out of bounds');
    labels.push(message.slice(cur, cur + len).toString('ascii'));
    cur += len;
  }

  return {
    name: labels.join('.'),
    next: nextOffset === -1 ? cur : nextOffset,
  };
}

/**
 * Serialize a domain name without compression. Trailing dots and empty input
 * both serialize to the single null byte (the root name).
 */
function serializeName(name) {
  if (!name) return Buffer.from([0]);
  const labels = name.split('.').filter(l => l.length > 0);
  const parts = [];
  for (const l of labels) {
    if (l.length > 63) throw new Error('DNS: label too long');
    parts.push(Buffer.from([l.length]));
    parts.push(Buffer.from(l, 'ascii'));
  }
  parts.push(Buffer.from([0]));
  return Buffer.concat(parts);
}

/** Length of a serialized (uncompressed) name. */
function nameLength(name) {
  if (!name) return 1;
  let total = 1;
  for (const l of name.split('.')) {
    if (l.length === 0) continue;
    total += 1 + l.length;
  }
  return total;
}

module.exports = { parseName, serializeName, nameLength };
