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
import { HCI, HCIDirection } from '#lib/layers/HCI';
import { HCICommand } from '#lib/layers/HCICommand';
import { HCIEvent } from '#lib/layers/HCIEvent';
import { ACL } from '#lib/layers/ACL';
import { L2CAP } from '#lib/layers/L2CAP';
import { ATT } from '#lib/layers/ATT';

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
  HCIDirection,
  HCI,
  HCICommand,
  HCIEvent,
  ACL,
  L2CAP,
  ATT,
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
