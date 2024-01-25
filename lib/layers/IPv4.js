const { compile } = require('struct-compile');
const { OsiModelLayers } = require('./osi');
const { AF_INET, inetPton, inetNtop } = require('../socket');
const { checksums } = require('../bindings');

const { IPv4Header } = compile(`
  //@NE
  struct IPv4Header {
    //IP header length, has the value of 5 for IPv4
    uint8_t headerLength:4;

    //IP version number, has the value of 4 for IPv4
    uint8_t version:4;

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

    //@LE IPv4 address of the sender of the packet 
    uint32_t src;

    //@LE IPv4 address of the receiver of the packet 
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

  get src() {
    return inetNtop(AF_INET, super.src);
  }

  set src(val) {
    super.src = inetPton(AF_INET, val);
  }

  get dst() {
    return inetNtop(AF_INET, super.dst);
  }

  set dst(val) {
    super.dst = inetPton(AF_INET, val);
  }

  next(layers) {

  }

  defaults(obj) {

  }
};

function test() {
  const ip = new IPv4(Buffer.from('450000730000400040068cd2c0a80167cebd1ce6e33d5debb394ef8ddd9ed0568018080', 'hex'));
  console.log('ip', ip.toObject());
  ip.dst = '192.168.1.1';
  console.log('ip', ip.toObject());
  console.log(checksums.ip(ip.buffer));
}

if (require.main === module) {
  test();
}

module.exports = { IPv4, test };
