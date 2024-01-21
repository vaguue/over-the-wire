const { compile } = require('struct-compile');
const { OsiModelLayers } = require('./osi');

const { IPv4Header } = compile(`
  //@NE
  struct IPv4Header {
    //IP version number, has the value of 4 for IPv4
    uint8_t version:4,

    //IP header length, has the value of 5 for IPv4
    headerLength:4;

    //type of service, same as Differentiated Services Code Point (DSCP)
    uint8_t typeOfService;

    //Entire packet (fragment) size, including header and data, in bytes
    uint16_t fragmentLength;

    //Identification field. Primarily used for uniquely identifying the group of fragments of a single IP datagram
    uint16_t id;

    //Fragment offset field, measured in units of eight-byte blocks (64 bits) 
    uint16_t fragmentOffset;

    //An eight-bit time to live field helps prevent datagrams from persisting (e.g. going in circles) on an internet.  In practice, the field has become a hop count 
    uint8_t timeToLive;

    //Defines the protocol used in the data portion of the IP datagram. Must be one of ::IPProtocolTypes 
    uint8_t protocol;

    //Error-checking of the header 
    uint16_t checksum;

    //IPv4 address of the sender of the packet 
    uint32_t src;

    //IPv4 address of the receiver of the packet 
    uint32_t dst;

    /*The options start here.*/
  } __attribute__(packed);
`);

class IPv4 extends IPv4Header {
  constructor(structArg, prev = null) {
    super(structArg);
    this.prev = prev;
  }

  static length = IPv4Header.config.length;
  static osi = OsiModelLayers.Network;
  osi = OsiModelLayers.Network;

  next(layers) {

  }
};

function test() {

}

if (require.main === module) {
  test();
}

module.exports = { IPv4, test };
