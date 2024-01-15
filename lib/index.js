const PcapDevice = require('./pcapDevice');
const socket = require('./socket');
const BpfFilter = require('./bpfFilter');
const { LinkLayerType } = require('./enums');
const { createReadStream, createWriteStream, constants } = require('./pcapFile');

module.exports = { 
  Pcap: {
    LiveDevice: PcapDevice,
    createReadStream, 
    createWriteStream, 
    constants,
  },
  socket,
  LinkLayerType,
  BpfFilter,
};
