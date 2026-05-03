const { Ethernet } = require('./Ethernet');
const { IPv4 } = require('./IPv4');
const { IPv6 } = require('./IPv6');
const { TCP } = require('./TCP');
const { UDP } = require('./UDP');
const { ARP } = require('./ARP');
const { Payload } = require('./Payload');
const { ICMP } = require('./ICMP');
const { ICMPv6 } = require('./ICMPv6');
const { DHCP } = require('./DHCP');
const { Vlan } = require('./Vlan');
const { GRE } = require('./GRE');
const { NTP } = require('./NTP');
const { DNS } = require('./DNS');

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
};

const linktype = {};

for (const cls of Object.values(layers)) {
  if (cls.linktype) {
    linktype[cls.linktype] = cls;
  }
}

module.exports = {
  layers,
  linktype,
};
