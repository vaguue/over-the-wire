const { Ethernet } = require('./Ethernet');
const { IPv4 } = require('./IPv4');
const { TCP } = require('./TCP');
const { Payload } = require('./Payload');

const layers = {
  IPv4,
  Ethernet,
  Payload,
  TCP,
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
