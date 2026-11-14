import { layers } from '#lib/layers/index';
import { ETHERTYPE, IPProtocolTypes, IPv4OptionTypes, ICMPTypes, ICMPv6Types } from '#lib/layers/enums';

const constantName = (name) => {
  if (name === name.toUpperCase()) {
    return name;
  }

  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .toUpperCase();
};

const constantsFrom = (source, { prefix = '', skip = [] } = {}) => {
  const constants = {};

  for (const [name, value] of Object.entries(source)) {
    if (!skip.includes(name)) {
      constants[`${prefix}${constantName(name)}`] = value;
    }
  }

  return constants;
};

const protocols = {};

const describeProtocol = ({ name, layer, title, reference = null, summary, fields = {}, constants = [], example = null }) => {
  const namespace = {};

  for (const group of constants) {
    Object.assign(namespace, group.values);
  }

  protocols[name] = {
    name,
    layer,
    title,
    reference,
    summary,
    fields,
    constants,
    example,
    namespace: Object.freeze(namespace),
  };

  return protocols[name].namespace;
};

const protocolFor = (requestedName) => {
  const wanted = String(requestedName).toLowerCase();

  return Object.values(protocols).find(({ name, layer }) => {
    return name === wanted || layer.toLowerCase() === wanted;
  }) ?? null;
};

const ethernet = describeProtocol({
  name: 'ethernet',
  layer: 'Ethernet',
  title: 'Ethernet II frame',
  reference: 'IEEE 802.3',
  summary: 'The link layer of wired and Wi-Fi interfaces as the capture device presents them. An awaited builder adds it by itself when the interface needs it.',
  fields: {
    dst: 'Destination hardware address. Resolved from the neighbour table when awaited.',
    src: 'Source hardware address. The address of the interface when awaited.',
    type: 'Protocol of the next layer. Filled from the layer that follows.',
  },
  constants: [
    {
      title: 'Addresses',
      values: {
        BROADCAST: 'ff:ff:ff:ff:ff:ff',
      },
    },
    {
      title: 'Next layer',
      field: 'type',
      values: {
        TYPE_IPV4: ETHERTYPE.IP,
        ...constantsFrom(ETHERTYPE, { prefix: 'TYPE_' }),
      },
    },
  ],
  example: "wire.packet().ethernet({ dst: ethernet.BROADCAST }).arp({ opcode: arp.WHO_HAS, protocolDst: '192.168.1.1' })",
});

const vlan = describeProtocol({
  name: 'vlan',
  layer: 'Vlan',
  title: 'VLAN tag',
  reference: 'IEEE 802.1Q',
  summary: 'A tag between the Ethernet header and the network layer that assigns the frame to a virtual network.',
  fields: {
    vid: 'Network identifier, 0 to 4095.',
    dei: 'Drop eligible indicator.',
    pcp: 'Priority code point, 0 to 7.',
    etherType: 'Protocol of the next layer, one of ethernet.TYPE_*.',
  },
});

const arp = describeProtocol({
  name: 'arp',
  layer: 'ARP',
  title: 'Address Resolution Protocol',
  reference: 'RFC 826',
  summary: 'Finds the hardware address that owns an IPv4 address on the local network.',
  fields: {
    hardwareType: 'Kind of hardware address, arp.HARDWARE_ETHERNET by default.',
    protocolType: 'Kind of protocol address, IPv4 by default.',
    hardwareLength: 'Length of a hardware address in bytes.',
    protocolLength: 'Length of a protocol address in bytes.',
    opcode: 'arp.WHO_HAS for a request, arp.IS_AT for a reply.',
    hardwareSrc: 'Hardware address of the sender.',
    protocolSrc: 'IPv4 address of the sender.',
    hardwareDst: 'Hardware address of the target, zeros in a request.',
    protocolDst: 'IPv4 address being asked about.',
  },
  constants: [
    {
      title: 'Operations',
      field: 'opcode',
      values: {
        WHO_HAS: 'who-has',
        IS_AT: 'is-at',
      },
    },
    {
      title: 'Hardware types',
      field: 'hardwareType',
      values: {
        HARDWARE_ETHERNET: 1,
      },
    },
  ],
  example: "wire.filter().arp({ opcode: arp.IS_AT, protocolSrc: '192.168.1.1' })",
});

const ipv4 = describeProtocol({
  name: 'ipv4',
  layer: 'IPv4',
  title: 'Internet Protocol version 4',
  reference: 'RFC 791',
  summary: 'Carries a packet between hosts. An awaited builder fills the source address, picks the interface from the routing table and adds the link layer.',
  fields: {
    version: 'Always 4.',
    headerLength: 'Header length in 32-bit words. Filled automatically.',
    typeOfService: 'DSCP and ECN bits.',
    totalLength: 'Header plus everything after it, in bytes. Filled automatically.',
    id: 'Identification used to reassemble fragments.',
    fragmentOffsetRaw: 'Fragment flags and offset as one raw field.',
    timeToLive: 'Hops the packet may still travel. 64 by default.',
    protocol: 'Protocol of the next layer, one of ipv4.PROTOCOL_*. Filled from the layer that follows.',
    checksum: 'Header checksum. Filled automatically.',
    src: 'Source address. The address of the outgoing interface when awaited.',
    dst: 'Destination address.',
    options: 'List of { type, value } options, types are ipv4.OPTION_*.',
  },
  constants: [
    {
      title: 'Next layer',
      field: 'protocol',
      values: constantsFrom(IPProtocolTypes, { prefix: 'PROTOCOL_', skip: ['IP', 'MAX'] }),
    },
    {
      title: 'Options',
      field: 'options[].type',
      values: constantsFrom(IPv4OptionTypes, { prefix: 'OPTION_', skip: ['Unknown'] }),
    },
    {
      title: 'Addresses',
      values: {
        BROADCAST: '255.255.255.255',
        LOOPBACK: '127.0.0.1',
        ANY: '0.0.0.0',
      },
    },
  ],
  example: "wire.packet().ipv4({ dst: '8.8.8.8', timeToLive: 3 }).icmp({ type: icmp.ECHO_REQUEST })",
});

const ipv6 = describeProtocol({
  name: 'ipv6',
  layer: 'IPv6',
  title: 'Internet Protocol version 6',
  reference: 'RFC 8200',
  summary: 'Carries a packet between hosts over 128-bit addresses.',
  fields: {
    version: 'Always 6.',
    trafficClass: 'DSCP and ECN bits.',
    flowLabel: 'Label shared by the packets of one flow, 20 bits.',
    payloadLength: 'Bytes after the header. Filled automatically.',
    nextHeader: 'Protocol of the next layer, one of ipv6.NEXT_HEADER_*. Filled from the layer that follows.',
    hopLimit: 'Hops the packet may still travel.',
    src: 'Source address.',
    dst: 'Destination address.',
  },
  constants: [
    {
      title: 'Next layer',
      field: 'nextHeader',
      values: constantsFrom(IPProtocolTypes, { prefix: 'NEXT_HEADER_', skip: ['IP', 'MAX', 'RAW'] }),
    },
    {
      title: 'Addresses',
      values: {
        LOOPBACK: '::1',
        ANY: '::',
        ALL_NODES: 'ff02::1',
        ALL_ROUTERS: 'ff02::2',
      },
    },
  ],
  example: "wire.packet().ipv6({ dst: ipv6.ALL_NODES }).icmpv6({ type: icmpv6.ECHO_REQUEST })",
});

const icmp = describeProtocol({
  name: 'icmp',
  layer: 'ICMP',
  title: 'Internet Control Message Protocol',
  reference: 'RFC 792',
  summary: 'Error reports and diagnostics of IPv4: echo for ping, time exceeded for traceroute, unreachable destinations. The fields after the checksum depend on the message type.',
  fields: {
    type: 'Message type. icmp.ECHO_REQUEST by default.',
    code: 'Detail of the type, for example icmp.CODE_PORT_UNREACHABLE.',
    checksum: 'Checksum over the whole message. Filled automatically.',
    id: 'Echo and timestamp messages: identifier shared by a request and its reply.',
    sequence: 'Echo and timestamp messages: sequence number.',
    timestamp: 'Echo messages: 64-bit timestamp carried in the body.',
    nextHopMTU: 'Destination unreachable: the size that would have fitted.',
    errorOctetPointer: 'Parameter problem: offset of the offending byte.',
    typeName: 'Read only: name of the message type.',
  },
  constants: [
    {
      title: 'Message types',
      field: 'type',
      values: constantsFrom(ICMPTypes),
    },
    {
      title: 'Codes of DESTINATION_UNREACHABLE',
      field: 'code',
      values: {
        CODE_NETWORK_UNREACHABLE: 0,
        CODE_HOST_UNREACHABLE: 1,
        CODE_PROTOCOL_UNREACHABLE: 2,
        CODE_PORT_UNREACHABLE: 3,
        CODE_FRAGMENTATION_NEEDED: 4,
        CODE_SOURCE_ROUTE_FAILED: 5,
        CODE_ADMINISTRATIVELY_PROHIBITED: 13,
      },
    },
    {
      title: 'Codes of TIME_EXCEEDED',
      field: 'code',
      values: {
        CODE_TTL_EXCEEDED: 0,
        CODE_REASSEMBLY_TIME_EXCEEDED: 1,
      },
    },
  ],
  example: "wire.send(wire.packet().ipv4({ dst: '8.8.8.8' }).icmp({ type: icmp.ECHO_REQUEST })).expect(wire.filter().icmp({ type: icmp.ECHO_REPLY }))",
});

const icmpv6 = describeProtocol({
  name: 'icmpv6',
  layer: 'ICMPv6',
  title: 'Internet Control Message Protocol for IPv6',
  reference: 'RFC 4443',
  summary: 'Error reports, echo and neighbour discovery of IPv6.',
  fields: {
    type: 'Message type.',
    code: 'Detail of the type.',
    checksum: 'Checksum over the message and the IPv6 pseudo header. Filled automatically.',
    id: 'Echo messages: identifier shared by a request and its reply.',
    sequence: 'Echo messages: sequence number.',
  },
  constants: [
    {
      title: 'Message types',
      field: 'type',
      values: constantsFrom(ICMPv6Types, { skip: ['Unknown'] }),
    },
  ],
  example: "wire.filter().icmpv6({ type: [icmpv6.NEIGHBOR_SOLICITATION, icmpv6.NEIGHBOR_ADVERTISEMENT] })",
});

const tcp = describeProtocol({
  name: 'tcp',
  layer: 'TCP',
  title: 'Transmission Control Protocol',
  reference: 'RFC 9293',
  summary: 'Reliable byte streams between ports. Packets built here are single segments: the host stack does not know about them and does not keep the connection.',
  fields: {
    src: 'Source port.',
    dst: 'Destination port.',
    seq: 'Sequence number.',
    ack: 'Acknowledgment number.',
    dataOffset: 'Header length in 32-bit words. Filled automatically.',
    flags: 'Object with syn, ack, fin, rst, psh, urg, ece, cwr set to 0 or 1.',
    windowSize: 'Receive window. 2048 by default.',
    checksum: 'Checksum over the segment and the IP pseudo header. Filled automatically.',
    urgentPointer: 'Offset of urgent data when the urg flag is set.',
    options: 'List of { type, value } options, types are tcp.OPTION_*.',
  },
  constants: [
    {
      title: 'Options',
      field: 'options[].type',
      values: {
        OPTION_END: 0,
        OPTION_NOP: 1,
        OPTION_MSS: 2,
        OPTION_WINDOW_SCALE: 3,
        OPTION_SACK_PERMITTED: 4,
        OPTION_SACK: 5,
        OPTION_TIMESTAMP: 8,
      },
    },
    {
      title: 'Well-known ports',
      field: 'src, dst',
      values: {
        PORT_FTP: 21,
        PORT_SSH: 22,
        PORT_TELNET: 23,
        PORT_SMTP: 25,
        PORT_DNS: 53,
        PORT_HTTP: 80,
        PORT_HTTPS: 443,
      },
    },
  ],
  example: "wire.packet().ipv4({ dst: '192.168.1.1' }).tcp({ src: 40000, dst: tcp.PORT_SSH, flags: { syn: 1 } })",
});

const udp = describeProtocol({
  name: 'udp',
  layer: 'UDP',
  title: 'User Datagram Protocol',
  reference: 'RFC 768',
  summary: 'Datagrams between ports with no delivery guarantees. DNS, DHCP and NTP are recognised on their well-known ports.',
  fields: {
    src: 'Source port.',
    dst: 'Destination port.',
    totalLength: 'Header plus data in bytes. Filled automatically.',
    checksum: 'Checksum over the datagram and the IP pseudo header. Filled automatically.',
  },
  constants: [
    {
      title: 'Well-known ports',
      field: 'src, dst',
      values: {
        PORT_DISCARD: 9,
        PORT_DNS: 53,
        PORT_DHCP_SERVER: 67,
        PORT_DHCP_CLIENT: 68,
        PORT_NTP: 123,
        PORT_MDNS: 5353,
      },
    },
  ],
  example: "wire.filter().udp({ port: udp.PORT_DNS })",
});

const dns = describeProtocol({
  name: 'dns',
  layer: 'DNS',
  title: 'Domain Name System',
  reference: 'RFC 1035',
  summary: 'Queries and responses of the name system. Recognised under UDP on ports 53 and 5353.',
  fields: {
    id: 'Identifier shared by a query and its response.',
    qr: '0 for a query, 1 for a response.',
    opcode: 'Kind of query, dns.OPCODE_QUERY by default.',
    aa: 'The answer comes from an authoritative server.',
    tc: 'The message was truncated.',
    rd: 'Recursion desired.',
    ra: 'Recursion available.',
    rcode: 'Response code, one of dns.RCODE_*.',
    qdCount: 'Number of questions. Filled from the questions list.',
    anCount: 'Number of answers. Filled from the answers list.',
    nsCount: 'Number of authority records. Filled from the authority list.',
    arCount: 'Number of additional records. Filled from the additional list.',
    questions: 'List of { name, type, class }.',
    answers: 'List of { name, type, class, ttl, rdata }.',
    authority: 'List of records in the authority section.',
    additional: 'List of records in the additional section.',
  },
  constants: [
    {
      title: 'Ports',
      values: {
        PORT: 53,
        MDNS_PORT: 5353,
      },
    },
    {
      title: 'Record types',
      field: 'questions[].type',
      values: constantsFrom(layers.DNS.TYPES, { prefix: 'TYPE_' }),
    },
    {
      title: 'Classes',
      field: 'questions[].class',
      values: {
        CLASS_IN: 1,
        CLASS_CH: 3,
        CLASS_ANY: 255,
      },
    },
    {
      title: 'Operations',
      field: 'opcode',
      values: {
        OPCODE_QUERY: 0,
        OPCODE_STATUS: 2,
        OPCODE_NOTIFY: 4,
        OPCODE_UPDATE: 5,
      },
    },
    {
      title: 'Response codes',
      field: 'rcode',
      values: {
        RCODE_NO_ERROR: 0,
        RCODE_FORMAT_ERROR: 1,
        RCODE_SERVER_FAILURE: 2,
        RCODE_NAME_ERROR: 3,
        RCODE_NOT_IMPLEMENTED: 4,
        RCODE_REFUSED: 5,
      },
    },
  ],
  example: "wire.packet().ipv4({ dst: '8.8.8.8' }).udp({ src: 40000, dst: dns.PORT }).dns({ rd: 1, questions: [{ name: 'example.com', type: dns.TYPE_A }] })",
});

const dhcp = describeProtocol({
  name: 'dhcp',
  layer: 'DHCP',
  title: 'Dynamic Host Configuration Protocol',
  reference: 'RFC 2131',
  summary: 'Hands out addresses and network settings. Recognised under UDP on ports 67 and 68.',
  fields: {
    opCode: 'dhcp.BOOT_REQUEST from a client, dhcp.BOOT_REPLY from a server.',
    hardwareType: 'Kind of hardware address, 1 for Ethernet.',
    hardwareAddressLength: 'Length of the hardware address, 6 for Ethernet.',
    hops: 'Relay agents passed.',
    transactionId: 'Identifier shared by the messages of one exchange.',
    secondsElapsed: 'Seconds since the client started.',
    flags: 'Bit 15 asks for a broadcast reply.',
    clientIpAddress: 'Address the client already has.',
    yourIpAddress: 'Address offered to the client.',
    serverIpAddress: 'Address of the next server to use.',
    gatewayIpAddress: 'Address of the relay agent.',
    clientHardwareAddress: 'Hardware address of the client.',
    serverName: 'Optional server host name.',
    bootFilename: 'Optional boot file name.',
    magicNumber: 'Always dhcp.MAGIC_NUMBER.',
    options: 'List of { type, value } options, types are dhcp.OPTION_*.',
  },
  constants: [
    {
      title: 'Ports',
      values: {
        SERVER_PORT: 67,
        CLIENT_PORT: 68,
      },
    },
    {
      title: 'Operations',
      field: 'opCode',
      values: {
        BOOT_REQUEST: 1,
        BOOT_REPLY: 2,
      },
    },
    {
      title: 'Options',
      field: 'options[].type',
      values: {
        OPTION_SUBNET_MASK: 1,
        OPTION_ROUTER: 3,
        OPTION_DNS_SERVERS: 6,
        OPTION_HOST_NAME: 12,
        OPTION_REQUESTED_ADDRESS: 50,
        OPTION_LEASE_TIME: 51,
        OPTION_MESSAGE_TYPE: 53,
        OPTION_SERVER_IDENTIFIER: 54,
        OPTION_PARAMETER_REQUEST_LIST: 55,
        OPTION_CLIENT_IDENTIFIER: 61,
      },
    },
    {
      title: 'Values of OPTION_MESSAGE_TYPE',
      values: {
        DISCOVER: 1,
        OFFER: 2,
        REQUEST: 3,
        DECLINE: 4,
        ACK: 5,
        NAK: 6,
        RELEASE: 7,
        INFORM: 8,
      },
    },
    {
      title: 'Other',
      values: {
        MAGIC_NUMBER: 0x63825363,
      },
    },
  ],
});

const ntp = describeProtocol({
  name: 'ntp',
  layer: 'NTP',
  title: 'Network Time Protocol',
  reference: 'RFC 5905',
  summary: 'Clock synchronisation. Recognised under UDP on port 123.',
  fields: {
    li: 'Leap indicator.',
    vn: 'Protocol version, 3 or 4.',
    mode: 'Role of the sender, one of ntp.MODE_*.',
    stratum: 'Distance from a reference clock.',
    poll: 'Poll interval as a power of two of seconds.',
    precision: 'Clock precision as a power of two of seconds.',
    rootDelay: 'Round-trip delay to the reference clock.',
    rootDispersion: 'Dispersion to the reference clock.',
    referenceId: 'Identifier of the reference clock.',
    referenceTimestamp: 'Date the clock was last set.',
    originTimestamp: 'Date the request left the client.',
    receiveTimestamp: 'Date the request reached the server.',
    transmitTimestamp: 'Date the message was sent.',
  },
  constants: [
    {
      title: 'Ports',
      values: {
        PORT: 123,
      },
    },
    {
      title: 'Modes',
      field: 'mode',
      values: {
        MODE_SYMMETRIC_ACTIVE: 1,
        MODE_SYMMETRIC_PASSIVE: 2,
        MODE_CLIENT: 3,
        MODE_SERVER: 4,
        MODE_BROADCAST: 5,
      },
    },
  ],
  example: "wire.packet().ipv4({ dst: '162.159.200.1' }).udp({ src: 40000, dst: ntp.PORT }).ntp({ vn: 4, mode: ntp.MODE_CLIENT })",
});

const gre = describeProtocol({
  name: 'gre',
  layer: 'GRE',
  title: 'Generic Routing Encapsulation',
  reference: 'RFC 2784, RFC 2890',
  summary: 'A tunnel header that carries another network protocol inside IP.',
  fields: {
    version: 'Always 0 for standard GRE.',
    protocol: 'Protocol of the carried packet, one of ethernet.TYPE_*.',
    checksumFlag: 'The checksum field is present.',
    keyFlag: 'The key field is present.',
    sequenceFlag: 'The sequence number field is present.',
    checksum: 'Optional checksum.',
    key: 'Optional tunnel key.',
    sequence: 'Optional sequence number.',
  },
});

const loopback = describeProtocol({
  name: 'loopback',
  layer: 'Loopback',
  title: 'BSD loopback header',
  reference: 'LINKTYPE_NULL',
  summary: 'The four-byte header that loopback and tunnel interfaces of macOS, the BSDs and Windows put in front of a packet. An awaited builder adds it by itself.',
  fields: {
    family: 'Address family of the packet that follows, in host byte order.',
  },
});

const namespaces = {
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
};

export {
  protocols,
  namespaces,
  describeProtocol,
  protocolFor,
  constantsFrom,
  constantName,
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
};
