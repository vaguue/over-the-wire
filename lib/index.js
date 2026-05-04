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

/**
 * System-level utilities for network configuration, ARP tables, routing, and data conversions.
 * @module system
 */
const system = {
  ...converters,
  getArpTable,
  getRoutingTable,
  gatewayFor,
};

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
  system,
};
