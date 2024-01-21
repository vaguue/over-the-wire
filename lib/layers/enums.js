module.exports.ETHERTYPE = {};

module.exports.ETHERTYPE.IP = 0x0800;
	/** Address resolution */
module.exports.ETHERTYPE.ARP = 0x0806;
	/** Transparent Ethernet Bridging */
module.exports.ETHERTYPE.ETHBRIDGE = 0x6558;
	/** Reverse ARP */
module.exports.ETHERTYPE.REVARP = 0x8035;
	/** AppleTalk protocol */
module.exports.ETHERTYPE.AT = 0x809B;
	/** AppleTalk ARP */
module.exports.ETHERTYPE.AARP = 0x80F3;
	/** IEEE 802.1Q VLAN tagging */
module.exports.ETHERTYPE.VLAN = 0x8100;
	/** IPX */
module.exports.ETHERTYPE.IPX = 0x8137;
	/** IP protocol version 6 */
module.exports.ETHERTYPE.IPV6 = 0x86dd;
	/** used to test interfaces */
module.exports.ETHERTYPE.LOOPBACK = 0x9000;
	/** PPPoE discovery */
module.exports.ETHERTYPE.PPPOED = 0x8863;
	/** PPPoE session */
module.exports.ETHERTYPE.PPPOES = 0x8864;
	/** MPLS */
module.exports.ETHERTYPE.MPLS = 0x8847;
	/** Point-to-point protocol (PPP) */
module.exports.ETHERTYPE.PPP = 0x880B;
	/** RDMA over Converged Ethernet (RoCEv1) */
module.exports.ETHERTYPE.ROCEV1 = 0x8915;
	/** IEEE 802.1ad Provider Bridge, Q-in-Q */
module.exports.ETHERTYPE.IEEE_802_1AD = 0x88A8;
	/** Wake on LAN */
module.exports.ETHERTYPE.WAKE_ON_LAN = 0x0842;


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
 * An enum for supported IPv4 option types
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
