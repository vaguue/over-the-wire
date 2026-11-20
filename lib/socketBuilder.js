import os from 'node:os';

const ipSockets = {
  title: 'Sockets of an IP network',
  families: {
    inet: 'AF_INET',
    inet6: 'AF_INET6',
  },
  types: {
    raw: 'SOCK_RAW',
    dgram: 'SOCK_DGRAM',
  },
  protocols: {
    icmp: 'IPPROTO_ICMP',
    icmpv6: 'IPPROTO_ICMPV6',
    udp: 'IPPROTO_UDP',
    tcp: 'IPPROTO_TCP',
    gre: 'IPPROTO_GRE',
    rawIp: 'IPPROTO_RAW',
  },
  options: {
    broadcast: [{ level: 'SOL_SOCKET', name: 'SO_BROADCAST' }],
    reuseAddress: [{ level: 'SOL_SOCKET', name: 'SO_REUSEADDR' }],
    reusePort: [{ level: 'SOL_SOCKET', name: 'SO_REUSEPORT' }],
    dontRoute: [{ level: 'SOL_SOCKET', name: 'SO_DONTROUTE' }],
    keepAlive: [{ level: 'SOL_SOCKET', name: 'SO_KEEPALIVE' }],
    receiveBuffer: [{ level: 'SOL_SOCKET', name: 'SO_RCVBUF' }],
    sendBuffer: [{ level: 'SOL_SOCKET', name: 'SO_SNDBUF' }],
    mark: [{ level: 'SOL_SOCKET', name: 'SO_MARK' }],
    priority: [{ level: 'SOL_SOCKET', name: 'SO_PRIORITY' }],
    headerIncluded: [
      { family: 'inet', level: 'IPPROTO_IP', name: 'IP_HDRINCL' },
      { family: 'inet6', level: 'IPPROTO_IPV6', name: 'IPV6_HDRINCL' },
    ],
    timeToLive: [
      { family: 'inet', level: 'IPPROTO_IP', name: 'IP_TTL' },
      { family: 'inet6', level: 'IPPROTO_IPV6', name: 'IPV6_UNICAST_HOPS' },
    ],
    typeOfService: [
      { family: 'inet', level: 'IPPROTO_IP', name: 'IP_TOS' },
      { family: 'inet6', level: 'IPPROTO_IPV6', name: 'IPV6_TCLASS' },
    ],
    dontFragment: [
      { family: 'inet', level: 'IPPROTO_IP', name: 'IP_MTU_DISCOVER', enabled: 'IP_PMTUDISC_PROBE', disabled: 'IP_PMTUDISC_DONT' },
      { family: 'inet', level: 'IPPROTO_IP', name: 'IP_DONTFRAG' },
      { family: 'inet', level: 'IPPROTO_IP', name: 'IP_DONTFRAGMENT' },
    ],
    ipv6Only: [{ family: 'inet6', level: 'IPPROTO_IPV6', name: 'IPV6_V6ONLY' }],
  },
  descriptorFlags: {
    blocking: { read: 'F_GETFL', write: 'F_SETFL', flag: 'O_NONBLOCK', enabledWhen: 'cleared' },
    closeOnExec: { read: 'F_GETFD', write: 'F_SETFD', flag: 'FD_CLOEXEC', enabledWhen: 'set' },
  },
  interfaceBinding: [
    { level: 'SOL_SOCKET', name: 'SO_BINDTODEVICE', value: 'name' },
    { family: 'inet', level: 'IPPROTO_IP', name: 'IP_BOUND_IF', value: 'index' },
    { family: 'inet6', level: 'IPPROTO_IPV6', name: 'IPV6_BOUND_IF', value: 'index' },
  ],
  defaults: {
    family: 'inet',
    type: 'dgram',
  },
};

const ENABLED = 1;
const DISABLED = 0;

const socketError = (code, message) => {
  const err = new Error(message);
  err.code = code;
  return err;
};

const constantNamesOf = (kinds) => {
  const names = new Set([
    ...Object.values(kinds.families),
    ...Object.values(kinds.types),
    ...Object.values(kinds.protocols),
  ]);

  for (const way of [...Object.values(kinds.options).flat(), ...kinds.interfaceBinding]) {
    for (const constant of [way.level, way.name, way.enabled, way.disabled]) {
      if (typeof constant == 'string') {
        names.add(constant);
      }
    }
  }

  for (const { read, write, flag } of Object.values(kinds.descriptorFlags)) {
    names.add(read);
    names.add(write);
    names.add(flag);
  }

  return [...names];
};

const groupOf = (title, method, names, available) => {
  return {
    title,
    method,
    values: Object.fromEntries(Object.entries(names).map(([shortName, constant]) => [shortName, { constant, value: available[constant] }])),
  };
};

const describeSockets = (kinds, platformConstants, platform = os.platform()) => {
  const constants = {};
  const missing = [];

  for (const name of constantNamesOf(kinds)) {
    if (typeof platformConstants[name] == 'number') {
      constants[name] = platformConstants[name];
    }
    else {
      missing.push(name);
    }
  }

  return {
    title: kinds.title,
    platform,
    kinds,
    constants: Object.freeze(constants),
    missing,
    groups: [
      groupOf('Address families', 'family', kinds.families, constants),
      groupOf('Socket types', 'type', kinds.types, constants),
      groupOf('Protocols', 'protocol', kinds.protocols, constants),
    ],
  };
};

const waysFor = (ways, family) => {
  return ways.filter(way => way.family === undefined || way.family === family);
};

const wayIsDefined = (way, constants) => {
  return [way.level, way.name, way.enabled, way.disabled].every(constant => typeof constant != 'string' || constants[constant] !== undefined);
};

const valueForSetsockopt = (value) => {
  if (value === true) {
    return ENABLED;
  }

  if (value === false) {
    return DISABLED;
  }

  if (typeof value == 'string') {
    return Buffer.from(`${value}\0`);
  }

  return value;
};

class SocketBuilder {
  constructor(wire) {
    this.wire = wire;
    this.catalogue = wire.socketCatalogue;
    this.description = {
      family: null,
      type: null,
      protocol: null,
      bufferSize: undefined,
      bind: null,
      connect: null,
      to: null,
      options: [],
      descriptorFlags: [],
    };
    this.opening = null;
  }

  describe(changes) {
    if (this.opening !== null) {
      throw new Error('This socket was already opened, start a new one with socket()');
    }

    Object.assign(this.description, changes);
    return this;
  }

  protocol(number) {
    return this.describe({ protocol: number });
  }

  bufferSize(bytes) {
    return this.describe({ bufferSize: bytes });
  }

  bind(address) {
    return this.describe({ bind: address });
  }

  connect(address) {
    return this.describe({ connect: address });
  }

  to(address) {
    return this.describe({ to: address });
  }

  option(level, name, value = ENABLED) {
    return this.describe({ options: [...this.description.options, { level, name, value }] });
  }

  namedOption(option, value = true) {
    return this.describe({ options: [...this.description.options, { option, value }] });
  }

  descriptorFlag(flag, enabled = true) {
    return this.describe({ descriptorFlags: [...this.description.descriptorFlags, { flag, enabled }] });
  }

  constant(name) {
    return this.catalogue.constants[name];
  }

  chosen() {
    const { kinds } = this.catalogue;
    const family = this.description.family ?? kinds.defaults.family;
    const type = this.description.type ?? kinds.defaults.type;
    const protocol = this.description.protocol ?? 0;

    return { family, type, protocol };
  }

  requiredConstant(name, what) {
    const value = this.constant(name);

    if (value === undefined) {
      throw socketError('ENOTSUPPORTED', `${what} sockets are not available on ${this.catalogue.platform}: ${name} is not defined`);
    }

    return value;
  }

  resolved({ family, type, protocol } = this.chosen()) {
    const { kinds } = this.catalogue;

    return {
      domain: this.requiredConstant(kinds.families[family], family),
      type: this.requiredConstant(kinds.types[type], type),
      protocol: typeof protocol == 'string' ? this.requiredConstant(kinds.protocols[protocol], protocol) : protocol,
    };
  }

  availability(changes = {}) {
    const choice = { ...this.chosen(), ...changes };

    try {
      return this.wire.socketAvailability(this.resolved(choice));
    }
    catch (err) {
      return { available: false, reason: err.message };
    }
  }

  valueOf(way, value) {
    if (value === true && way.enabled !== undefined) {
      return this.constant(way.enabled);
    }

    if (value === false && way.disabled !== undefined) {
      return this.constant(way.disabled);
    }

    return valueForSetsockopt(value);
  }

  whyWayIsRefused(socket, way, value) {
    const absent = [way.level, way.name, way.enabled, way.disabled].find(constant => typeof constant == 'string' && this.constant(constant) === undefined);

    if (absent !== undefined) {
      return `${absent} is not defined on ${this.catalogue.platform}`;
    }

    const level = typeof way.level == 'string' ? this.constant(way.level) : way.level;
    const name = typeof way.name == 'string' ? this.constant(way.name) : way.name;

    try {
      socket.setsockopt(level, name, this.valueOf(way, value));
    }
    catch (err) {
      return err.message;
    }

    return null;
  }

  whyOptionIsRefused(socket, ways, valueFor) {
    const candidates = waysFor(ways, this.chosen().family);

    if (candidates.length === 0) {
      return `not defined for ${this.chosen().family} sockets`;
    }

    const refusals = [];

    for (const way of candidates) {
      const value = valueFor(way);
      const reason = value === null ? 'the index of the interface is unknown' : this.whyWayIsRefused(socket, way, value);

      if (reason === null) {
        return null;
      }

      refusals.push(reason);
    }

    return refusals.join('; ');
  }

  whyDescriptorFlagIsRefused(socket, name, enabled) {
    const { read, write, flag, enabledWhen } = this.catalogue.kinds.descriptorFlags[name];
    const absent = [read, write, flag].find(constant => this.constant(constant) === undefined);

    if (absent !== undefined) {
      return `${absent} is not defined on ${this.catalogue.platform}`;
    }

    const shouldBeSet = enabled === (enabledWhen === 'set');

    try {
      const current = socket.fcntl(this.constant(read));
      const wanted = shouldBeSet ? current | this.constant(flag) : current & ~this.constant(flag);
      socket.fcntl(this.constant(write), wanted);
    }
    catch (err) {
      return err.message;
    }

    return null;
  }

  configure(stream) {
    const { options, descriptorFlags } = this.description;
    const { kinds } = this.catalogue;

    for (const { option, level, name, value } of options) {
      const label = option ?? `${level}/${name}`;
      const ways = option === undefined ? [{ level, name }] : kinds.options[option];
      const reason = this.whyOptionIsRefused(stream.socket, ways, () => value);

      if (reason !== null) {
        stream.unsupported.push({ option: label, reason });
      }
    }

    for (const { flag, enabled } of descriptorFlags) {
      const reason = this.whyDescriptorFlagIsRefused(stream.socket, flag, enabled);

      if (reason !== null) {
        stream.unsupported.push({ option: flag, reason });
      }
    }

    const iface = this.wire.iface;

    if (iface === null || iface === undefined) {
      return;
    }

    const reason = this.whyOptionIsRefused(stream.socket, kinds.interfaceBinding, (way) => {
      return way.value === 'name' ? iface : this.wire.interfaceIndex(iface);
    });

    if (reason === null) {
      stream.boundToInterface = iface;
    }
    else {
      stream.unsupported.push({ option: 'iface', reason });
    }
  }

  open() {
    const { domain, type, protocol } = this.resolved();
    const { bufferSize, bind, connect, to } = this.description;
    let stream;

    try {
      stream = this.wire.system.openSocket({ domain, type, protocol, bufferSize, to });
    }
    catch (err) {
      this.wire.rememberSocketAvailability({ domain, type, protocol }, err.message);
      throw socketError('ESOCKET', `Could not open a ${this.toString()} socket: ${err.message}`);
    }

    this.wire.rememberSocketAvailability({ domain, type, protocol }, null);
    stream.unsupported = [];
    this.configure(stream);

    try {
      if (bind !== null) {
        stream.bind(bind);
      }

      if (connect !== null) {
        stream.connect(connect);
      }
    }
    catch (err) {
      stream.destroy();
      throw socketError('ESOCKET', `Could not address a ${this.toString()} socket: ${err.message}`);
    }

    this.wire.track(stream);
    return stream;
  }

  exec() {
    if (this.opening === null) {
      this.opening = new Promise((resolve) => {
        resolve(this.open());
      });
    }

    return this.opening;
  }

  then(onOpened, onFailed) {
    return this.exec().then(onOpened, onFailed);
  }

  catch(onFailed) {
    return this.exec().catch(onFailed);
  }

  finally(onSettled) {
    return this.exec().finally(onSettled);
  }

  supports(feature) {
    const { kinds, constants } = this.catalogue;

    if (feature === undefined) {
      return this.availability().available;
    }

    if (kinds.families[feature] !== undefined) {
      return this.availability({ family: feature }).available;
    }

    if (kinds.types[feature] !== undefined) {
      return this.availability({ type: feature }).available;
    }

    if (kinds.protocols[feature] !== undefined) {
      return this.availability({ protocol: feature }).available;
    }

    if (kinds.descriptorFlags[feature] !== undefined) {
      const { read, write, flag } = kinds.descriptorFlags[feature];
      return [read, write, flag].every(constant => constants[constant] !== undefined);
    }

    const ways = kinds.options[feature];

    if (ways === undefined) {
      return false;
    }

    return waysFor(ways, this.chosen().family).some(way => wayIsDefined(way, constants));
  }

  toString() {
    const { family, type, protocol } = this.chosen();
    return [family, type, protocol === 0 ? null : protocol].filter(part => part !== null).join(' ');
  }

  [Symbol.for('nodejs.util.inspect.custom')]() {
    return `<Socket description | ${this.toString()}>`;
  }
}

const builderFor = (catalogue) => {
  const { kinds } = catalogue;

  class WireSocketBuilder extends SocketBuilder {}

  for (const family of Object.keys(kinds.families)) {
    WireSocketBuilder.prototype[family] = function() {
      return this.describe({ family });
    };
  }

  for (const type of Object.keys(kinds.types)) {
    WireSocketBuilder.prototype[type] = function() {
      return this.describe({ type });
    };
  }

  for (const protocol of Object.keys(kinds.protocols)) {
    WireSocketBuilder.prototype[protocol] = function() {
      return this.describe({ protocol });
    };
  }

  for (const option of Object.keys(kinds.options)) {
    WireSocketBuilder.prototype[option] = function(value) {
      return this.namedOption(option, value);
    };
  }

  for (const flag of Object.keys(kinds.descriptorFlags)) {
    WireSocketBuilder.prototype[flag] = function(enabled) {
      return this.descriptorFlag(flag, enabled);
    };
  }

  return WireSocketBuilder;
};

const probeSocket = (Socket) => {
  return ({ domain, type, protocol }) => {
    try {
      new Socket({ domain, type, protocol }).close();
    }
    catch (err) {
      return err.message;
    }

    return null;
  };
};

export { SocketBuilder, builderFor, describeSockets, ipSockets, probeSocket, waysFor, wayIsDefined };
export default { SocketBuilder, builderFor, describeSockets, ipSockets, probeSocket, waysFor, wayIsDefined };
