import { LiveDevice } from './liveDevice.js';
import socket from './socket.js';
import { BpfFilter } from './bpfFilter.js';
import { LinkLayerType } from './enums.js';
import { createReadStream, createWriteStream, constants } from './pcapFile/index.js';
import { Packet } from './packet.js';
import { getArpTable } from './arp.js';
import { getRoutingTable } from './routing.js';
import { getOpenPorts } from '#lib/ports';
import { gatewayFor } from './gateway.js';
import converters from './converters.js';
import { SocketStream } from '#lib/socketStream';
import { otw, Wire } from '#lib/wire';
import { registerLayer } from '#lib/registry';
import { FilterBuilder } from '#lib/filter';
import { PacketBuilder } from '#lib/packetBuilder';
import { SocketBuilder } from '#lib/socketBuilder';
import { namespaces, protocols } from '#lib/protocols';
import { sendOverHttp } from '#lib/http';

/**
 * System-level utilities for network configuration, ARP tables, routing, and data conversions.
 * @module system
 */
const system = {
  ...converters,
  getArpTable,
  getRoutingTable,
  getOpenPorts,
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
  SocketBuilder,
  Wire,
  registerLayer,
  protocols,
  sendOverHttp,
  system,
  pcap: Pcap,
  ...namespaces(),
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
  SocketBuilder,
  Wire,
  registerLayer,
  protocols,
  sendOverHttp,
  system,
  Pcap as pcap,
};

export {
  ethernet,
  vlan,
  arp,
  ipv4,
  ipv6,
  icmp,
  icmpv6,
  tcp,
  udp,
  dns,
  dhcp,
  ntp,
  gre,
  loopback,
  payload,
  http,
} from '#lib/protocols';

export default otw;
