const macToString = buf => buf.toJSON().data.map(e => e.toString(16).padStart(2, '0')).join(':');

const macFromString = str => {
  const parts = str.split(':');
  if (parts.length !== 6 || !parts.every(o => o.length > 0 && o.length <= 2 && /^[0-9a-fA-F]+$/.test(o))) {
    throw new Error(`Invalid MAC address: ${str}`);
  }
  return Buffer.from(parts.map(o => o.padStart(2, '0')).join(''), 'hex');
};

module.exports = { macToString, macFromString };
