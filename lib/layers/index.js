import { Ethernet } from './Ethernet.js';
import { IPv4 } from './IPv4.js';
import { IPv6 } from './IPv6.js';
import { TCP } from './TCP.js';
import { UDP } from './UDP.js';
import { ARP } from './ARP.js';
import { Payload } from './Payload.js';
import { ICMP } from './ICMP.js';
import { ICMPv6 } from './ICMPv6.js';
import { DHCP } from './DHCP.js';
import { Vlan } from './Vlan.js';
import { GRE } from './GRE.js';
import { NTP } from './NTP.js';
import { DNS } from './DNS.js';
import { Loopback } from '#lib/layers/Loopback';

const layers = {
  IPv4,
  IPv6,
  Ethernet,
  Payload,
  TCP,
  UDP,
  ARP,
  ICMP,
  ICMPv6,
  DHCP,
  Vlan,
  GRE,
  NTP,
  DNS,
  Loopback,
};

const linktype = {};

for (const cls of Object.values(layers)) {
  if (cls.linktype !== undefined) {
    linktype[cls.linktype] = cls;
  }
}

export { layers, linktype };
export default {
  layers,
  linktype,
};
