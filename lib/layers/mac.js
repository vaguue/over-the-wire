const macToString = buf => buf.toJSON().data.map(e => e.toString(16).padStart(2, '0')).join(':');
const macFromString = str => Buffer.from(str.replaceAll(':', ''), 'hex');

module.exports = { macToString, macFromString };
