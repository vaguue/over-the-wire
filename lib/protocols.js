import { layers } from '#lib/layers/index';

const META_TAG = /@\w+/g;
const TITLE_END = '. ';

const protocols = {};

const textOf = (comment) => {
  return (comment ?? '').replace(META_TAG, '').trim();
};

const typeOfField = (compiled) => {
  if (compiled?.type === undefined) {
    return 'computed';
  }

  if (compiled.bits !== undefined) {
    return `${compiled.type}:${compiled.bits}`;
  }

  return `${compiled.type}${compiled.d.map(size => `[${size}]`).join('')}`;
};

const headingOf = (Layer) => {
  const heading = textOf(Layer.comments?.main);
  const titleEnd = heading.indexOf(TITLE_END);

  if (heading.length === 0) {
    return { title: Layer.docs?.title ?? Layer.name, summary: Layer.docs?.summary ?? '' };
  }

  if (titleEnd === -1) {
    return { title: heading.replace(/\.$/, ''), summary: '' };
  }

  return { title: heading.slice(0, titleEnd), summary: heading.slice(titleEnd + TITLE_END.length) };
};

const fieldsOf = (Layer) => {
  const compiled = Layer.prototype.config?.fields ?? {};
  const comments = Layer.comments ?? {};
  const described = Layer.docs?.fields ?? {};
  const names = [...new Set([...Object.keys(compiled), ...Object.keys(described)])];

  return names.map((name) => {
    return {
      name,
      type: typeOfField(compiled[name]),
      description: described[name] ?? textOf(comments[name]),
    };
  });
};

const describeLayer = (Layer) => {
  const name = Layer.name.toLowerCase();
  const constants = Layer.docs?.constants ?? [];
  const namespace = {};

  for (const group of constants) {
    Object.assign(namespace, group.values);
  }

  protocols[name] = {
    name,
    layer: Layer.name,
    ...headingOf(Layer),
    fields: fieldsOf(Layer),
    constants,
    example: Layer.docs?.example ?? null,
    namespace: Object.freeze(namespace),
  };

  return protocols[name];
};

const protocolFor = (requestedName) => {
  return protocols[String(requestedName).toLowerCase()] ?? null;
};

const namespaces = () => {
  return Object.fromEntries(Object.values(protocols).map(({ name, namespace }) => [name, namespace]));
};

for (const Layer of Object.values(layers)) {
  describeLayer(Layer);
}

const { ethernet, vlan, arp, ipv4, ipv6, icmp, icmpv6, tcp, udp, dns, dhcp, ntp, gre, loopback, payload, hcidirection, hci, hcicommand, hcievent, acl, l2cap, att } = namespaces();

export {
  protocols,
  namespaces,
  describeLayer,
  protocolFor,
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
  hcidirection,
  hci,
  hcicommand,
  hcievent,
  acl,
  l2cap,
  att,
};
