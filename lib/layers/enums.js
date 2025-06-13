/**
 * Enum for Ethernet child protocols.
 * @readonly
 * @enum {number}
 */
module.exports.ETHERTYPE = {
  /** Internet protocol */
  IP: 0x0800,
  /** Address resolution */
  ARP: 0x0806,
  /** Transparent Ethernet Bridging */
  ETHBRIDGE: 0x6558,
  /** Reverse ARP */
  REVARP: 0x8035,
  /** AppleTalk protocol */
  AT: 0x809B,
  /** AppleTalk ARP */
  AARP: 0x80F3,
  /** IEEE 802.1Q VLAN tagging */
  VLAN: 0x8100,
  /** IPX */
  IPX: 0x8137,
  /** IP protocol version 6 */
  IPV6: 0x86dd,
  /** used to test interfaces */
  LOOPBACK: 0x9000,
  /** PPPoE discovery */
  PPPOED: 0x8863,
  /** PPPoE session */
  PPPOES: 0x8864,
  /** MPLS */
  MPLS: 0x8847,
  /** Point-to-point protocol (PPP) */
  PPP: 0x880B,
  /** RDMA over Converged Ethernet (RoCEv1) */
  ROCEV1: 0x8915,
  /** IEEE 802.1ad Provider Bridge, Q-in-Q */
  IEEE_802_1AD: 0x88A8,
  /** Wake on LAN */
  WAKE_ON_LAN: 0x0842,
};

/**
 * Enum for IPv4 child protocols.
 * @readonly
 * @enum {number}
 */
module.exports.IPProtocolTypes = {
  /** Dummy protocol for TCP */
  IP: 0,
  /** IPv6 Hop-by-Hop options */
  HOPOPTS: 0,
  /** Internet Control Message Protocol */
  ICMP: 1,
  /** Internet Gateway Management Protocol */
  IGMP: 2,
  /** IPIP tunnels (older KA9Q tunnels use 94) */
  IPIP: 4,
  /** Transmission Control Protocol */
  TCP: 6,
  /** Exterior Gateway Protocol */
  EGP: 8,
  /** PUP protocol */
  PUP: 12,
  /** User Datagram Protocol */
  UDP: 17,
  /** XNS IDP protocol */
  IDP: 22,
  /** IPv6 header */
  IPV6: 41,
  /** IPv6 Routing header */
  ROUTING: 43,
  /** IPv6 fragmentation header */
  FRAGMENT: 44,
  /** GRE protocol */
  GRE: 47,
  /** encapsulating security payload */
  ESP: 50,
  /** authentication header */
  AH: 51,
  /** ICMPv6 */
  ICMPV6: 58,
  /** IPv6 no next header */
  NONE: 59,
  /** IPv6 Destination options */
  DSTOPTS: 60,
  /** VRRP protocol */
  VRRP: 112,
  /** Raw IP packets */
  RAW: 255,
  /** Maximum value */
  MAX: 256,
};


/**
 * Enum for IPv4 options.
 * @readonly
 * @enum {number}
 */
module.exports.IPv4OptionTypes =
{
  /** End of Options List */
  EndOfOptionsList: 0,
  /** No Operation */
  NOP: 1,
  /** Record Route */
  RecordRoute: 7,
  /** MTU Probe */
  MTUProbe: 11,
  /** MTU Reply */
  MTUReply: 12,
  /** Quick-Start */
  QuickStart: 25,
  /** Timestamp */
  Timestamp: 68,
  /** Traceroute */
  Traceroute: 82,
  /** Security */
  Security: 130,
  /** Loose Source Route */
  LooseSourceRoute: 131,
  /** Extended Security */
  ExtendedSecurity: 133,
  /** Commercial Security */
  CommercialSecurity: 134,
  /** Stream ID */
  StreamID: 136,
  /** Strict Source Route */
  StrictSourceRoute: 137,
  /** Extended Internet Protocol */
  ExtendedInternetProtocol: 145,
  /** Address Extension */
  AddressExtension: 147,
  /** Router Alert */
  RouterAlert: 148,
  /** Selective Directed Broadcast */
  SelectiveDirectedBroadcast: 149,
  /** Dynamic Packet State */
  DynamicPacketState: 151,
  /** Upstream Multicast Pkt. */
  UpstreamMulticastPkt: 152,
  /** Unknown IPv4 option */
  Unknown: 153,
};

/**
 * Enum for ICMP message types.
 * @readonly
 * @enum {number}
 */
module.exports.ICMPTypes = {
  /** Echo Reply */
  EchoReply: 0,
  /** Destination Unreachable */
  DestinationUnreachable: 3,
  /** Source Quench */
  SourceQuench: 4,
  /** Redirect Message */
  Redirect: 5,
  /** Echo Request */
  EchoRequest: 8,
  /** Time Exceeded */
  TimeExceeded: 11,
  /** Parameter Problem */
  ParameterProblem: 12,
  /** Timestamp Request */
  TimestampRequest: 13,
  /** Timestamp Reply */
  TimestampReply: 14,
  /** Information Request */
  InformationRequest: 15,
  /** Information Reply */
  InformationReply: 16,
  /** Address Mask Request */
  AddressMaskRequest: 17,
  /** Address Mask Reply */
  AddressMaskReply: 18,
};

/**
 * ICMPv6 message types
 * @enum {number}
 */
const ICMPv6Types = {
  /** Unknown ICMPv6 message */
  Unknown: 0,
  /** Destination Unreachable Message */
  DestinationUnreachable: 1,
  /** Packet Too Big Message */
  PacketTooBig: 2,
  /** Time Exceeded Message */
  TimeExceeded: 3,
  /** Parameter Problem Message */
  ParameterProblem: 4,
  /** Echo Request Message */
  EchoRequest: 128,
  /** Echo Reply Message */
  EchoReply: 129,
  /** Multicast Listener Query Message */
  MulticastListenerQuery: 130,
  /** Multicast Listener Report Message */
  MulticastListenerReport: 131,
  /** Multicast Listener Done Message */
  MulticastListenerDone: 132,
  /** Router Solicitation Message */
  RouterSolicitation: 133,
  /** Router Advertisement Message */
  RouterAdvertisement: 134,
  /** Neighbor Solicitation Message */
  NeighborSolicitation: 135,
  /** Neighbor Advertisement Message */
  NeighborAdvertisement: 136,
  /** Redirect Message */
  RedirectMessage: 137
};

module.exports = {
  // ... existing code ...
  ICMPv6Types,
  // ... existing code ...
};
