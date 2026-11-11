import os from 'node:os';
import net from 'node:net';
import dgram from 'node:dgram';

import { getRoutingTable } from '#lib/routing';
import { getArpTable } from '#lib/arp';
import { gatewayFor } from '#lib/gateway';
import { PacketBuilder } from '#lib/packetBuilder';
import { LiveDevice } from '#lib/liveDevice';
import { FilterBuilder } from '#lib/filter';
import { Packet } from '#lib/packet';
import converters from '#lib/converters';
const { inetPton } = converters;
import socketModule from '#lib/socket';
const { AF_INET6 } = socketModule;

const DEFAULT_CACHE_MS = 5000;
const DEFAULT_NEIGHBOUR_TIMEOUT_MS = 1000;
const NEIGHBOUR_POLL_INTERVAL_MS = 25;
const DISCARD_PORT = 9;
const UNSET_MAC = '00:00:00:00:00:00';
const MAC_PATTERN = /^([0-9a-f]{1,2}:){5}[0-9a-f]{1,2}$/i;

const isUsableMac = (mac) => {
  return typeof mac == 'string' && MAC_PATTERN.test(mac) && mac !== UNSET_MAC;
};

const withoutZone = (address) => {
  return address.split('%')[0];
};

const sameAddress = (left, right) => {
  const leftAddress = withoutZone(left);
  const rightAddress = withoutZone(right);

  if (net.isIPv6(leftAddress) && net.isIPv6(rightAddress)) {
    return inetPton(AF_INET6, leftAddress).equals(inetPton(AF_INET6, rightAddress));
  }

  return leftAddress === rightAddress;
};

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const letTheKernelResolve = (address, iface) => {
  return new Promise((resolve) => {
    const isIpv6 = net.isIPv6(address);
    const socket = dgram.createSocket(isIpv6 ? 'udp6' : 'udp4');
    const needsScope = isIpv6 && address.toLowerCase().startsWith('fe80');
    const target = needsScope ? `${address}%${iface}` : address;

    const finish = () => {
      socket.close();
      resolve();
    };

    socket.once('error', finish);
    socket.send(Buffer.alloc(1), DISCARD_PORT, target, finish);
  });
};

class Wire {
  constructor({ iface = null, cacheMs = DEFAULT_CACHE_MS, neighbourTimeoutMs = DEFAULT_NEIGHBOUR_TIMEOUT_MS, system = {} } = {}) {
    this.iface = iface;
    this.cacheMs = cacheMs;
    this.neighbourTimeoutMs = neighbourTimeoutMs;
    this.system = {
      platform: os.platform(),
      getRoutingTable,
      getArpTable,
      networkInterfaces: os.networkInterfaces,
      provokeNeighbourDiscovery: letTheKernelResolve,
      openDevice: (options) => new LiveDevice(options),
      ...system,
    };
    this.devices = new Map();
    this.lookups = new Map();
  }

  cachedLookup(name, load) {
    const cached = this.lookups.get(name);

    if (cached !== undefined && Date.now() - cached.startedAt < this.cacheMs) {
      return cached.result;
    }

    const result = load();
    this.lookups.set(name, { startedAt: Date.now(), result });

    result.catch(() => {
      if (this.lookups.get(name)?.result === result) {
        this.lookups.delete(name);
      }
    });

    return result;
  }

  flush() {
    this.lookups.clear();
    return this;
  }

  routingTable() {
    return this.cachedLookup('routes', () => this.system.getRoutingTable());
  }

  arpTable() {
    return this.cachedLookup('neighbours', () => this.system.getArpTable());
  }

  async route(destination = null, { iface = null } = {}) {
    const routes = await this.routingTable();
    const route = await gatewayFor(destination, { iface: iface ?? this.iface, routes });

    if (route === null) {
      const err = new Error(`No route to ${destination ?? 'the default gateway'}`);
      err.code = 'ENOROUTE';
      throw err;
    }

    return route;
  }

  async knownNeighbour(address, iface) {
    const table = await this.arpTable();
    const entry = (table[iface] ?? []).find(({ ipAddr, hwAddr }) => isUsableMac(hwAddr) && sameAddress(ipAddr, address));
    return entry?.hwAddr ?? null;
  }

  async neighbour(address, iface) {
    const alreadyKnown = await this.knownNeighbour(address, iface);

    if (alreadyKnown !== null) {
      return alreadyKnown;
    }

    await this.system.provokeNeighbourDiscovery(address, iface);

    const deadline = Date.now() + this.neighbourTimeoutMs;

    for (;;) {
      this.lookups.delete('neighbours');
      const discovered = await this.knownNeighbour(address, iface);

      if (discovered !== null) {
        return discovered;
      }

      if (Date.now() >= deadline) {
        return null;
      }

      await sleep(NEIGHBOUR_POLL_INTERVAL_MS);
    }
  }

  linkLayerOf(iface) {
    const entries = this.system.networkInterfaces()[iface] ?? [];

    if (entries.some(({ mac }) => isUsableMac(mac))) {
      return 'ethernet';
    }

    if (this.system.platform === 'linux') {
      return entries.some(({ internal }) => internal) ? 'ethernet-without-addresses' : 'none';
    }

    return 'loopback';
  }

  addresses(iface) {
    const entries = this.system.networkInterfaces()[iface] ?? [];

    return {
      mac: entries.find(({ mac }) => mac !== undefined)?.mac,
      ipv4: entries.find(({ family }) => family === 'IPv4')?.address,
      ipv6: entries.find(({ family }) => family === 'IPv6')?.address,
    };
  }

  packet(options = {}) {
    return new PacketBuilder(this, options);
  }

  filter() {
    return new FilterBuilder();
  }

  async defaultInterface() {
    return this.iface ?? (await this.route(null)).iface;
  }

  async capture(filterOrOptions = {}) {
    const describesFilter = filterOrOptions instanceof FilterBuilder || typeof filterOrOptions == 'string';
    const options = describesFilter ? { filter: filterOrOptions } : { ...filterOrOptions };

    if (options.filter instanceof FilterBuilder) {
      const filter = options.filter;
      delete options.filter;

      if (filter.expressible && filter.toString().length > 0) {
        options.filter = filter.toString();
      }
    }

    const iface = options.iface ?? await this.defaultInterface();
    return this.system.openDevice({ ...options, iface });
  }

  async deviceFor(requestedIface) {
    const iface = requestedIface ?? await this.defaultInterface();

    if (!this.devices.has(iface)) {
      this.devices.set(iface, this.system.openDevice({ iface }));
    }

    return this.devices.get(iface);
  }

  send(packet) {
    return new Sending(this, packet);
  }

  close() {
    for (const device of this.devices.values()) {
      device.destroy();
    }

    this.devices.clear();
    return this;
  }
}

const writeTo = (device, packet) => {
  return new Promise((resolve, reject) => {
    device.write(packet, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

class Sending {
  constructor(wire, description) {
    this.wire = wire;
    this.description = description;
    this.resolution = null;
    this.delivery = null;
  }

  resolvedPacket() {
    if (this.resolution === null) {
      this.resolution = this.description instanceof PacketBuilder
        ? this.description.exec()
        : Promise.resolve(this.description);
    }

    return this.resolution;
  }

  async write() {
    const packet = await this.resolvedPacket();
    const device = await this.wire.deviceFor(packet.iface?.name);
    await writeTo(device, packet);
    return packet;
  }

  deliver() {
    if (this.delivery === null) {
      this.delivery = this.write();
    }

    return this.delivery;
  }

  then(onDelivered, onFailed) {
    return this.deliver().then(onDelivered, onFailed);
  }

  catch(onFailed) {
    return this.deliver().catch(onFailed);
  }

  finally(onSettled) {
    return this.deliver().finally(onSettled);
  }

  async expect(filter, options) {
    const packet = await this.resolvedPacket();
    const device = await this.wire.deviceFor(packet.iface?.name);
    const described = filter === undefined || typeof filter == 'function' ? filter : FilterBuilder.from(filter);
    const sentBytes = packet instanceof Packet ? packet.buffer : packet;

    const isAnAnswer = (candidate) => {
      if (candidate.buffer.equals(sentBytes)) {
        return false;
      }

      if (described === undefined) {
        return true;
      }

      return typeof described == 'function' ? described(candidate) : described.matches(candidate);
    };

    const answer = device.expect(isAnAnswer, options);
    await this.deliver();
    return answer;
  }
}

const otw = (options = {}) => {
  return new Wire(options);
};

export { otw, Wire, Sending };
export default { otw, Wire };
