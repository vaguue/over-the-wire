const { Ethernet } = require('./Ethernet');
const { IPv4 } = require('./IPv4');
const { TCP } = require('./TCP');
const { ARP } = require('./ARP');
const { Payload } = require('./Payload');
const { ICMP } = require('./ICMP');
const { DHCP } = require('./DHCP');

const layers = {
  IPv4,
  Ethernet,
  Payload,
  TCP,
  ARP,
  ICMP,
  DHCP,
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
