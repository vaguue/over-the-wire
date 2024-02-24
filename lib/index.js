const { LiveDevice } = require('./liveDevice');
const socket = require('./socket');
const { BpfFilter } = require('./bpfFilter');
const { LinkLayerType } = require('./enums');
const { createReadStream, createWriteStream, constants } = require('./pcapFile');
const { Packet } = require('./packet');

module.exports = { 
  Pcap: {
    LiveDevice,
    createReadStream, 
    createWriteStream, 
    constants,
  },
  socket,
  LinkLayerType,
  BpfFilter,
  Packet,
};
