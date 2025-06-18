const { LiveDevice } = require('./liveDevice');
const socket = require('./socket');
const { BpfFilter } = require('./bpfFilter');
const { LinkLayerType } = require('./enums');
const { createReadStream, createWriteStream, constants } = require('./pcapFile');
const { Packet } = require('./packet');
const { getArpTable } = require('./arp');
const { getRoutingTable } = require('./routing');
const { gatewayFor } = require('./gateway');
const converters = require('./converters');

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
  system: {
    ...converters,
    getArpTable,
    getRoutingTable,
    gatewayFor,
  },
};
