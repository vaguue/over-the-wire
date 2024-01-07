const { PcapInputStream, PcapOutputStream } = require('./pcap');

const createReadStream = ({ format = 'pcap', ...options } = {}) => {
  if (format == 'pcap') {
    return new PcapInputStream(options);
  }
  else {
    throw new Error(`Unknown format ${format}`);
  }
}

const createWriteStream = ({ format = 'pcap', ...options } = {}) => {
  if (format == 'pcap') {
    return new PcapOutputStream(options);
  }
  else {
    throw new Error(`Unknown format ${format}`);
  }
}

module.exports = { createReadStream, createWriteStream };
