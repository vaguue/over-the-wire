const { PcapInputStream, PcapOutputStream } = require('./pcap');
const { PcapNGInputStream, PcapNGOutputStream, constants } = require('./pcapng');

const createReadStream = ({ format = 'pcap', ...options } = {}) => {
  if (format == 'pcap') {
    return new PcapInputStream(options);
  }
  else if (format == 'pcapng') {
    return new PcapNGInputStream(options);
  }
  else {
    throw new Error(`Unknown format ${format}`);
  }
}

const createWriteStream = ({ format = 'pcap', ...options } = {}) => {
  if (format == 'pcap') {
    return new PcapOutputStream(options);
  }
  if (format == 'pcapng') {
    return new PcapNGOutputStream(options);
  }
  else {
    throw new Error(`Unknown format ${format}`);
  }
}

module.exports = { createReadStream, createWriteStream, constants };
