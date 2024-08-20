const { compile } = require('struct-compile');
const { OsiModelLayers } = require('./osi');
const { IPProtocolTypes } = require('./enums');
const { AF_INET, inetPton, inetNtop, ntohs } = require('#lib/socket');
const { checksums } = require('#lib/bindings');
const child = require('./child');
const mixins = require('./mixins');
const { omit } = require('#lib/pick');
const { addField } = require('#lib/struct');

const { UDPHeader } = compile(`
  //@NE
  struct UDPHeader {
    // Source UDP port 
    uint16_t src;
    // Destination UDP port 
    uint16_t dst;
    // Length
    uint16_t length;
    // Checksum
    uint16_t checksum;

  } __attribute__((packed));
`);

/**
 * UDP protocol layer
 * @class
 * @property {number} src - Source UDP port.
 * @property {number} dst - Destination UDP port.
 * @property {number} length - Length.
 * @property {number} checksum - Checksum.
 * @implements {Layer}
 */
class UDP extends UDPHeader {
  name = 'UDP';

};

module.exports = { UDP };
