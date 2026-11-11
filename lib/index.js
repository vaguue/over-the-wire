import { LiveDevice } from './liveDevice.js';
import socket from './socket.js';
import { BpfFilter } from './bpfFilter.js';
import { LinkLayerType } from './enums.js';
import { createReadStream, createWriteStream, constants } from './pcapFile/index.js';
import { Packet } from './packet.js';
import { getArpTable } from './arp.js';
import { getRoutingTable } from './routing.js';
import { gatewayFor } from './gateway.js';
import converters from './converters.js';
import { SocketStream } from '#lib/socketStream';
import { otw, Wire } from '#lib/wire';
import { registerLayer } from '#lib/registry';
import { FilterBuilder } from '#lib/filter';
import { PacketBuilder } from '#lib/packetBuilder';

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

const Pcap = {
  LiveDevice,
  createReadStream,
  createWriteStream,
  constants,
};

Object.assign(otw, {
  Pcap,
  socket,
  SocketStream,
  LinkLayerType,
  BpfFilter,
  Packet,
  PacketBuilder,
  FilterBuilder,
  Wire,
  registerLayer,
  system,
});

export {
  otw,
  Pcap,
  socket,
  SocketStream,
  LinkLayerType,
  BpfFilter,
  Packet,
  PacketBuilder,
  FilterBuilder,
  Wire,
  registerLayer,
  system,
};

export default otw;
