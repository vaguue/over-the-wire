const { compile } = require('struct-compile');
const { toBE } = require('../struct');

function initPcap() {
  /*
   * Byte-order magic value.
   */
  const BYTE_ORDER_MAGIC = 0xA1B2C3D4;
  const BYTE_ORDER_MAGIC_SWAPPED = 0xD4C3B2A1;

  const { PcapFileHeader, PacketHeader } = compile(`
    //@LE
    struct PcapFileHeader {
      uint32_t magic;
      uint16_t version_major;
      uint16_t version_minor;
      int32_t thiszone;
      uint32_t sigfigs;
      uint32_t snaplen;
      uint32_t linktype;
    };

    //@LE
    struct PacketHeader {
      uint32_t tv_sec;
      uint32_t tv_usec;
      uint32_t caplen;
      uint32_t len;
    };
  `);

  const PcapFileHeaderBE = toBE(PcapFileHeader);
  const PacketHeaderBE = toBE(PacketHeader);

  return {
    PcapFileHeader, 
    PacketHeader, 
    PcapFileHeaderBE, 
    PacketHeaderBE, 
    BYTE_ORDER_MAGIC, 
    BYTE_ORDER_MAGIC_SWAPPED 
  };
}

function initPcapNG() {
  const res = {};

  res.BT_SHB = 0x0A0D0D0A;
  /*
   * Byte-order magic value.
   */
  res.BYTE_ORDER_MAGIC = 0x1A2B3C4D;
  res.BYTE_ORDER_MAGIC_SWAP = 0x4D3C2B1A;

  /*
   * Current version number.  If major_version isn't PCAP_NG_VERSION_MAJOR,
   * or if minor_version isn't PCAP_NG_VERSION_MINOR or 2, that means that
   * this code can't read the file.
   */
  res.PCAP_NG_VERSION_MAJOR = 1;
  res.PCAP_NG_VERSION_MINOR = 0;

  /*
   * Interface Description Block.
   */
  res.BT_IDB = 0x00000001;

  res.constants = {};
  /*
   * Options in the IDB.
   */
  res.constants.IF_NAME = 2;  /* interface name string */
  res.constants.IF_DESCRIPTION = 3;  /* interface description string */
  res.constants.IF_IPV4ADDR = 4;  /* interface's IPv4 address and netmask */
  res.constants.IF_IPV6ADDR = 5;  /* interface's IPv6 address and prefix length */
  res.constants.IF_MACADDR = 6;  /* interface's MAC address */
  res.constants.IF_EUIADDR = 7;  /* interface's EUI address */
  res.constants.IF_SPEED = 8;  /* interface's speed, in bits/s */
  res.constants.IF_TSRESOL = 9;  /* interface's time stamp resolution */
  res.constants.IF_TZONE = 10;  /* interface's time zone */
  res.constants.IF_FILTER = 11;  /* filter used when capturing on interface */
  res.constants.IF_OS = 12;  /* string OS on which capture on this interface was done */
  res.constants.IF_FCSLEN = 13;  /* FCS length for this interface */
  res.constants.IF_TSOFFSET = 14;  /* time stamp offset for this interface */

  res.constants.OPT_EOFOPT        = 0;
  res.constants.OPT_COMMENT       = 1;
  res.constants.OPT_SHB_HARDWARE  = 2;
  res.constants.OPT_SHB_OS        = 3;
  res.constants.OPT_SHB_USERAPPL  = 4;
  res.constants.OPT_EPB_FLAGS     = 2;
  res.constants.OPT_EPB_HASH      = 3;
  res.constants.OPT_EPB_DROPCOUNT = 4;

  /*
   * Enhanced Packet Block.
   */
  res.BT_EPB = 0x00000006;

  /*
   * Simple Packet Block.
   */
  res.BT_SPB = 0x00000003;

  /*
   * Packet Block.
   */
  res.BT_PB = 0x00000002;

  const structsInit = compile(`
    //@LE
    struct BlockHeader {
      uint32_t block_type;
      uint32_t total_length;
    };

    //@LE
    struct BlockTrailer {
      uint32_t total_length;
    };

    //@LE
    struct OptionHeader {
      uint16_t option_code;
      uint16_t option_length;
    };

    //@LE
    struct SectionHeaderBlock {
      uint32_t  byte_order_magic;
      uint16_t  major_version;
      uint16_t  minor_version;
      int64_t  section_length;
    };

    //@LE
    struct InterfaceDescriptionBlock {
      uint16_t  linktype;
      uint16_t  reserved;
      uint32_t  snaplen;
      /* followed by options and trailer */
    };

    //@LE
    struct EnhancedPacketBlock {
      uint32_t  interface_id;
      uint32_t  timestamp_high;
      uint32_t  timestamp_low;
      uint32_t  caplen;
      uint32_t  len;
      /* followed by packet data, options, and trailer */
    };

    //@LE
    struct SimplePacketBlock {
      uint32_t  caplen;
      /* followed by packet data and trailer */
    };

    //@LE
    struct PacketBlock {
      uint16_t  interface_id;
      uint16_t  drops_count;
      uint32_t  timestamp_high;
      uint32_t  timestamp_low;
      uint32_t  caplen;
      uint32_t  len;
      /* followed by packet data, options, and trailer */
    };
  `);

  res.structs = [
    structsInit, //LE
    Object.keys(structsInit).reduce((res, key) => ({ ...res, [key]: toBE(structsInit[key]) }), {}), //BE
  ];

  return res;
};

module.exports = {
  pcap: initPcap(),
  pcapng: initPcapNG(),
};
