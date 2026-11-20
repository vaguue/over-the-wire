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
    broadcast: { level: 'SOL_SOCKET', name: 'SO_BROADCAST' },
    reuseAddress: { level: 'SOL_SOCKET', name: 'SO_REUSEADDR' },
    reusePort: { level: 'SOL_SOCKET', name: 'SO_REUSEPORT' },
    dontRoute: { level: 'SOL_SOCKET', name: 'SO_DONTROUTE' },
    receiveBuffer: { level: 'SOL_SOCKET', name: 'SO_RCVBUF' },
    sendBuffer: { level: 'SOL_SOCKET', name: 'SO_SNDBUF' },
    mark: { level: 'SOL_SOCKET', name: 'SO_MARK' },
    priority: { level: 'SOL_SOCKET', name: 'SO_PRIORITY' },
    headerIncluded: {
      inet: { level: 'IPPROTO_IP', name: 'IP_HDRINCL' },
      inet6: { level: 'IPPROTO_IPV6', name: 'IPV6_HDRINCL' },
    },
    timeToLive: {
      inet: { level: 'IPPROTO_IP', name: 'IP_TTL' },
      inet6: { level: 'IPPROTO_IPV6', name: 'IPV6_UNICAST_HOPS' },
    },
    typeOfService: {
      inet: { level: 'IPPROTO_IP', name: 'IP_TOS' },
      inet6: { level: 'IPPROTO_IPV6', name: 'IPV6_TCLASS' },
    },
    ipv6Only: { level: 'IPPROTO_IPV6', name: 'IPV6_V6ONLY' },
  },
  interfaceBinding: [
    { level: 'SOL_SOCKET', name: 'SO_BINDTODEVICE', value: 'name' },
    { inet: { level: 'IPPROTO_IP', name: 'IP_BOUND_IF' }, inet6: { level: 'IPPROTO_IPV6', name: 'IPV6_BOUND_IF' }, value: 'index' },
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

const optionChoices = (option) => {
  return option.level === undefined ? Object.values(option).filter(choice => typeof choice == 'object') : [option];
};

const constantNamesOf = (kinds) => {
  const names = new Set([
    ...Object.values(kinds.families),
    ...Object.values(kinds.types),
    ...Object.values(kinds.protocols),
  ]);

  for (const option of [...Object.values(kinds.options), ...kinds.interfaceBinding]) {
    for (const { level, name } of optionChoices(option)) {
      names.add(level);
      names.add(name);
    }
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

const optionFor = (option, family) => {
  return option.level === undefined ? option[family] : option;
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
      blocking: false,
      bufferSize: undefined,
      bind: null,
      connect: null,
      to: null,
      options: [],
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

  blocking(enabled = true) {
    return this.describe({ blocking: enabled });
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

  namedOption(option, value = ENABLED) {
    return this.describe({ options: [...this.description.options, { option, value }] });
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

  resolved() {
    const { kinds } = this.catalogue;
    const { family, type, protocol } = this.chosen();

    return {
      domain: this.requiredConstant(kinds.families[family], family),
      type: this.requiredConstant(kinds.types[type], type),
      protocol: typeof protocol == 'string' ? this.requiredConstant(kinds.protocols[protocol], protocol) : protocol,
    };
  }

  whyOptionIsRefused(socket, choice, value) {
    if (choice === undefined) {
      return `not defined for ${this.chosen().family} sockets`;
    }

    const level = typeof choice.level == 'string' ? this.constant(choice.level) : choice.level;
    const name = typeof choice.name == 'string' ? this.constant(choice.name) : choice.name;

    if (level === undefined || name === undefined) {
      const absent = level === undefined ? choice.level : choice.name;
      return `${absent} is not defined on ${this.catalogue.platform}`;
    }

    try {
      socket.setsockopt(level, name, valueForSetsockopt(value));
    }
    catch (err) {
      return err.message;
    }

    return null;
  }

  setOption(stream, label, choice, value) {
    const reason = this.whyOptionIsRefused(stream.socket, choice, value);

    if (reason !== null) {
      stream.unsupported.push({ option: label, reason });
    }
  }

  bindToInterface(stream) {
    const iface = this.wire.iface;

    if (iface === null || iface === undefined) {
      return;
    }

    const { family } = this.chosen();
    const refusals = [];

    for (const way of this.catalogue.kinds.interfaceBinding) {
      const value = way.value === 'name' ? iface : this.wire.interfaceIndex(iface);

      if (value === null) {
        refusals.push(`the index of ${iface} is unknown`);
        continue;
      }

      const reason = this.whyOptionIsRefused(stream.socket, optionFor(way, family), value);

      if (reason === null) {
        stream.boundToInterface = iface;
        return;
      }

      refusals.push(reason);
    }

    stream.unsupported.push({ option: 'iface', reason: refusals.join('; ') });
  }

  open() {
    const { domain, type, protocol } = this.resolved();
    const { blocking, bufferSize, bind, connect, to, options } = this.description;
    const { family } = this.chosen();
    let stream;

    try {
      stream = this.wire.system.openSocket({ domain, type, protocol, blocking, bufferSize, to });
    }
    catch (err) {
      throw socketError('ESOCKET', `Could not open a ${this.toString()} socket: ${err.message}`);
    }

    stream.unsupported = [];

    if (blocking && stream.socket.blocking !== true) {
      stream.unsupported.push({ option: 'blocking', reason: `blocking sockets are not available on ${this.catalogue.platform}` });
    }

    for (const { option, level, name, value } of options) {
      if (option === undefined) {
        this.setOption(stream, `${level}/${name}`, { level, name }, value);
      }
      else {
        this.setOption(stream, option, optionFor(this.catalogue.kinds.options[option], family), value);
      }
    }

    this.bindToInterface(stream);

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
    const named = kinds.families[feature] ?? kinds.types[feature] ?? kinds.protocols[feature];

    if (named !== undefined) {
      return constants[named] !== undefined;
    }

    const option = kinds.options[feature];

    if (option === undefined) {
      return false;
    }

    const choice = optionFor(option, this.chosen().family);
    return choice !== undefined && constants[choice.level] !== undefined && constants[choice.name] !== undefined;
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

  return WireSocketBuilder;
};

export { SocketBuilder, builderFor, describeSockets, ipSockets };
export default { SocketBuilder, builderFor, describeSockets, ipSockets };
