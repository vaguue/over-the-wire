import net from 'node:net';

import { Packet, installLayerMethods } from '#lib/packet';
import { layers } from '#lib/layers/index';
import { LinkLayerType } from '#lib/enums';
import converters from '#lib/converters';
const { inetPton } = converters;
import socket from '#lib/socket';
const { AF_INET6 } = socket;

const ETHERNET_BROADCAST = 'ff:ff:ff:ff:ff:ff';
const IPV4_BROADCAST = '255.255.255.255';


const resolutionError = (code, message) => {
  const err = new Error(message);
  err.code = code;
  return err;
};



const toHexPair = (byte) => {
  return byte.toString(16).padStart(2, '0');
};

const ipv6MulticastMac = (address) => {
  const lastFourBytes = inetPton(AF_INET6, address).subarray(12);
  return ['33', '33', ...[...lastFourBytes].map(toHexPair)].join(':');
};

const isIpv6Multicast = (address) => {
  return address.toLowerCase().startsWith('ff');
};

const ipv4MulticastMac = (address) => {
  const [, second, third, fourth] = address.split('.').map(Number);
  return ['01', '00', '5e', toHexPair(second & 0x7f), toHexPair(third), toHexPair(fourth)].join(':');
};

const isIpv4Multicast = (address) => {
  const firstOctet = Number(address.split('.')[0]);
  return firstOctet >= 224 && firstOctet <= 239;
};

const isNetworkLayer = ({ Layer }) => {
  return Layer === layers.IPv4 || Layer === layers.IPv6;
};

const linktypeStartingAt = (Layer) => {
  return Layer?.linktype ?? LinkLayerType.LINKTYPE_ETHERNET;
};

class PacketBuilder {
  constructor(wire, { iface = null } = {}) {
    this.wire = wire;
    this.iface = iface ?? wire?.iface ?? null;
    this.specs = [];
    this.execution = null;
  }

  add(Layer, data = {}) {
    if (this.execution !== null) {
      throw new Error('This packet was already resolved, start a new one with packet()');
    }

    this.specs.push({ Layer, data });
    return this;
  }

  packetFrom(specs, iface) {
    const packet = new Packet({ iface });

    for (const { Layer, data } of specs) {
      packet.add(Layer, data);
    }

    return packet;
  }

  build() {
    const iface = { linktype: linktypeStartingAt(this.specs[0]?.Layer) };

    if (this.iface !== null) {
      iface.name = this.iface;
    }

    return this.packetFrom(this.specs, iface);
  }

  get buffer() {
    return this.build().buffer;
  }

  get layers() {
    return this.build().layers;
  }

  exec() {
    if (this.execution === null) {
      this.execution = this.resolve();
    }

    return this.execution;
  }

  then(onResolved, onRejected) {
    return this.exec().then(onResolved, onRejected);
  }

  catch(onRejected) {
    return this.exec().catch(onRejected);
  }

  finally(onSettled) {
    return this.exec().finally(onSettled);
  }

  async resolve() {
    const specs = this.specs.map(({ Layer, data }) => ({ Layer, data: { ...data } }));
    const network = specs.find(isNetworkLayer);

    if (network === undefined || network.data.dst === undefined) {
      return this.packetFrom(specs, this.build().iface);
    }

    const route = await this.wire.route(network.data.dst, { iface: this.iface });
    const local = this.wire.addresses(route.iface);

    if (network.data.src === undefined) {
      network.data.src = this.sourceAddress(network, local, route);
    }

    const linkLayer = this.wire.linkLayerOf(route.iface);

    if (specs[0] === network) {
      if (linkLayer === 'loopback') {
        specs.unshift({ Layer: layers.Loopback, data: {} });
      }

      if (linkLayer === 'ethernet' || linkLayer === 'ethernet-without-addresses') {
        specs.unshift({ Layer: layers.Ethernet, data: {} });
      }
    }

    const link = specs[0].Layer === layers.Ethernet ? specs[0] : null;

    if (link !== null && linkLayer === 'ethernet') {
      if (link.data.src === undefined) {
        link.data.src = local.mac;
      }

      if (link.data.dst === undefined) {
        link.data.dst = await this.linkDestination(network, route);
      }
    }

    return this.packetFrom(specs, {
      name: route.iface,
      linktype: linktypeStartingAt(specs[0].Layer),
    });
  }

  sourceAddress(network, local, route) {
    const address = network.Layer === layers.IPv4 ? local.ipv4 : local.ipv6;

    if (address === undefined) {
      throw resolutionError('ENOADDRESS', `Interface ${route.iface} has no ${network.Layer.name} address`);
    }

    return address;
  }

  async linkDestination(network, route) {
    const destination = network.data.dst;

    if (network.Layer === layers.IPv4) {
      if (destination === IPV4_BROADCAST) {
        return ETHERNET_BROADCAST;
      }

      if (isIpv4Multicast(destination)) {
        return ipv4MulticastMac(destination);
      }
    }

    if (network.Layer === layers.IPv6 && isIpv6Multicast(destination)) {
      return ipv6MulticastMac(destination);
    }

    const nextHop = net.isIP(route.ip) ? route.ip : destination;
    const mac = await this.wire.neighbour(nextHop, route.iface);

    if (mac === null) {
      throw resolutionError(
        'ENONEIGHBOUR',
        `${nextHop} did not answer on ${route.iface}, so its link-layer address is unknown`
      );
    }

    return mac;
  }
}

for (const Layer of Object.values(layers)) {
  installLayerMethods(PacketBuilder, Layer);
}

export { PacketBuilder };
export default { PacketBuilder };
