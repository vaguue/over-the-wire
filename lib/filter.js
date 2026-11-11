import net from 'node:net';

import { installLayerMethods } from '#lib/packet';
import { layers } from '#lib/layers/index';
import { BpfFilter } from '#lib/bpfFilter';
import converters from '#lib/converters';
import socket from '#lib/socket';

const { inetPton } = converters;
const { AF_INET6 } = socket;

const TIMESTAMP_IS_IRRELEVANT = [0, 0];

const notExpressible = (message) => {
  const err = new Error(message);
  err.code = 'ENOTEXPRESSIBLE';
  return err;
};

const keyword = (prefix) => ({ kind: 'keyword', prefix });
const numeric = (expression) => ({ kind: 'numeric', expression });

const transportFields = (protocol) => ({
  src: keyword(`${protocol} src port`),
  dst: keyword(`${protocol} dst port`),
  port: keyword(`${protocol} port`),
});

const TCP_FLAG_NAMES = {
  fin: 'tcp-fin',
  syn: 'tcp-syn',
  rst: 'tcp-rst',
  psh: 'tcp-push',
  ack: 'tcp-ack',
  urg: 'tcp-urg',
  ece: 'tcp-ece',
  cwr: 'tcp-cwr',
};

const pcapVocabulary = {
  Ethernet: {
    presence: null,
    fields: {
      src: keyword('ether src'),
      dst: keyword('ether dst'),
      host: keyword('ether host'),
      type: keyword('ether proto'),
    },
  },
  ARP: {
    presence: 'arp',
    fields: {},
  },
  Vlan: {
    presence: 'vlan',
    fields: {},
  },
  IPv4: {
    presence: 'ip',
    fields: {
      src: keyword('ip src'),
      dst: keyword('ip dst'),
      host: keyword('ip host'),
      protocol: keyword('ip proto'),
      timeToLive: numeric('ip[8]'),
      typeOfService: numeric('ip[1]'),
    },
  },
  IPv6: {
    presence: 'ip6',
    fields: {
      src: keyword('ip6 src'),
      dst: keyword('ip6 dst'),
      host: keyword('ip6 host'),
      nextHeader: keyword('ip6 proto'),
      hopLimit: numeric('ip6[7]'),
    },
  },
  TCP: {
    presence: 'tcp',
    fields: transportFields('tcp'),
  },
  UDP: {
    presence: 'udp',
    fields: transportFields('udp'),
  },
  ICMP: {
    presence: 'icmp',
    fields: {
      type: numeric('icmp[icmptype]'),
      code: numeric('icmp[icmpcode]'),
    },
  },
  ICMPv6: {
    presence: 'icmp6',
    fields: {
      type: numeric('ip6[40]'),
      code: numeric('ip6[41]'),
    },
  },
};

const COMPARISONS = {
  eq: { symbol: '=', holds: (actual, expected) => sameValue(actual, expected) },
  ne: { symbol: '!=', holds: (actual, expected) => !sameValue(actual, expected) },
  lt: { symbol: '<', holds: (actual, expected) => actual < expected },
  lte: { symbol: '<=', holds: (actual, expected) => actual <= expected },
  gt: { symbol: '>', holds: (actual, expected) => actual > expected },
  gte: { symbol: '>=', holds: (actual, expected) => actual >= expected },
};

const isComparison = (expected) => {
  if (expected === null || typeof expected !== 'object' || Array.isArray(expected) || Buffer.isBuffer(expected)) {
    return false;
  }

  const operators = Object.keys(expected);
  return operators.length > 0 && operators.every(operator => COMPARISONS[operator] !== undefined);
};

const sameValue = (actual, expected) => {
  if (typeof actual == 'string' && typeof expected == 'string') {
    if (net.isIPv6(actual) && net.isIPv6(expected)) {
      return inetPton(AF_INET6, actual).equals(inetPton(AF_INET6, expected));
    }

    return actual.toLowerCase() === expected.toLowerCase();
  }

  return actual == expected;
};

const holds = (actual, expected) => {
  if (typeof expected == 'function') {
    return Boolean(expected(actual));
  }

  if (Array.isArray(expected)) {
    return expected.some(alternative => holds(actual, alternative));
  }

  if (isComparison(expected)) {
    return Object.entries(expected).every(([operator, operand]) => COMPARISONS[operator].holds(actual, operand));
  }

  return sameValue(actual, expected);
};

const eitherEnd = (layer, expected) => {
  return holds(layer.src, expected) || holds(layer.dst, expected);
};

const fieldHolds = (layer, field, expected) => {
  if (field === 'host' || field === 'port') {
    return eitherEnd(layer, expected);
  }

  if (field === 'flags' && expected !== null && typeof expected == 'object') {
    const actualFlags = layer.flags;
    return Object.entries(expected).every(([flag, value]) => holds(actualFlags[flag], value));
  }

  return holds(layer[field], expected);
};

const layerMatches = (term, packet) => {
  const found = packet.layers[term.layer];

  if (found === undefined) {
    return false;
  }

  const candidates = Array.isArray(found) ? found : [found];

  return candidates.some((layer) => {
    return Object.entries(term.fields).every(([field, expected]) => fieldHolds(layer, field, expected));
  });
};

const rawMatches = (term, packet) => {
  const linktype = packet.linktype;

  if (term.compiled === undefined) {
    term.compiled = new Map();
  }

  if (!term.compiled.has(linktype)) {
    term.compiled.set(linktype, new BpfFilter(term.expression, linktype));
  }

  return term.compiled.get(linktype).match(packet.buffer, TIMESTAMP_IS_IRRELEVANT, linktype);
};

const treeMatches = (term, packet) => {
  if (term.kind === 'all') {
    return term.terms.every(inner => treeMatches(inner, packet));
  }

  if (term.kind === 'any') {
    return term.terms.some(inner => treeMatches(inner, packet));
  }

  if (term.kind === 'not') {
    return !treeMatches(term.term, packet);
  }

  if (term.kind === 'raw') {
    return rawMatches(term, packet);
  }

  return layerMatches(term, packet);
};

const anyOf = (alternatives) => {
  if (alternatives.length === 1) {
    return alternatives[0];
  }

  return `(${alternatives.join(' or ')})`;
};

const keywordExpression = (layer, field, { prefix }, expected) => {
  const values = Array.isArray(expected) ? expected : [expected];

  for (const value of values) {
    if (typeof value != 'string' && typeof value != 'number') {
      throw notExpressible(`${layer}.${field} can only be compared for equality in a capture filter`);
    }
  }

  return anyOf(values.map(value => `${prefix} ${value}`));
};

const numericExpression = (layer, field, { expression }, expected) => {
  if (Array.isArray(expected)) {
    return anyOf(expected.map(value => numericExpression(layer, field, { expression }, value)));
  }

  if (isComparison(expected)) {
    return Object.entries(expected)
      .map(([operator, operand]) => `${expression} ${COMPARISONS[operator].symbol} ${operand}`)
      .join(' and ');
  }

  if (typeof expected != 'number') {
    throw notExpressible(`${layer}.${field} has to be a number in a capture filter`);
  }

  return `${expression} = ${expected}`;
};

const tcpFlagsExpression = (expected) => {
  return Object.entries(expected).map(([flag, value]) => {
    const name = TCP_FLAG_NAMES[flag];

    if (name === undefined) {
      throw notExpressible(`TCP flag "${flag}" has no capture filter name`);
    }

    return `tcp[tcpflags] & ${name} ${value ? '!=' : '='} 0`;
  });
};

const layerExpression = (term) => {
  const vocabulary = pcapVocabulary[term.layer];

  if (vocabulary === undefined) {
    throw notExpressible(`${term.layer} cannot be expressed in a capture filter`);
  }

  const parts = [];

  if (vocabulary.presence !== null) {
    parts.push(vocabulary.presence);
  }

  for (const [field, expected] of Object.entries(term.fields)) {
    if (term.layer === 'TCP' && field === 'flags') {
      parts.push(...tcpFlagsExpression(expected));
      continue;
    }

    const known = vocabulary.fields[field];

    if (known === undefined) {
      throw notExpressible(`${term.layer}.${field} cannot be expressed in a capture filter`);
    }

    if (known.kind === 'keyword') {
      parts.push(keywordExpression(term.layer, field, known, expected));
    }
    else {
      parts.push(numericExpression(term.layer, field, known, expected));
    }
  }

  return parts.join(' and ');
};

const grouped = (expression) => {
  return expression.includes(' ') ? `(${expression})` : expression;
};

const treeExpression = (term) => {
  if (term.kind === 'all') {
    return term.terms.map(treeExpression).filter(part => part.length > 0).join(' and ');
  }

  if (term.kind === 'any') {
    return `(${term.terms.map(inner => grouped(treeExpression(inner))).join(' or ')})`;
  }

  if (term.kind === 'not') {
    return `not ${grouped(treeExpression(term.term))}`;
  }

  if (term.kind === 'raw') {
    return `(${term.expression})`;
  }

  return layerExpression(term);
};

class FilterBuilder {
  constructor() {
    this.terms = [];
  }

  static from(description) {
    if (description instanceof FilterBuilder) {
      return description;
    }

    const filter = new FilterBuilder();

    if (typeof description == 'function') {
      description(filter);
      return filter;
    }

    if (typeof description == 'string') {
      return filter.raw(description);
    }

    throw new Error('Expected a filter, a function describing one, or a capture filter expression');
  }

  add(Layer, fields = {}) {
    this.terms.push({ kind: 'layer', layer: Layer.name, fields });
    return this;
  }

  raw(expression) {
    this.terms.push({ kind: 'raw', expression });
    return this;
  }

  or(alternative) {
    this.terms = [{
      kind: 'any',
      terms: [this.toTree(), FilterBuilder.from(alternative).toTree()],
    }];
    return this;
  }

  not(excluded) {
    this.terms.push({ kind: 'not', term: FilterBuilder.from(excluded).toTree() });
    return this;
  }

  toTree() {
    return { kind: 'all', terms: [...this.terms] };
  }

  toString() {
    return treeExpression(this.toTree());
  }

  get expressible() {
    try {
      this.toString();
      return true;
    }
    catch (err) {
      if (err.code !== 'ENOTEXPRESSIBLE') {
        throw err;
      }
      return false;
    }
  }

  matches(packet) {
    return treeMatches(this.toTree(), packet);
  }
}

for (const Layer of Object.values(layers)) {
  installLayerMethods(FilterBuilder, Layer);
}

export { FilterBuilder };
export default { FilterBuilder };
