const stream = require('stream');
const { compile } = require('struct-compile');


const { PcapFileHeader, PacketHeader } = compile(`
  struct PcapFileHeader {
    uint32_t magic;
    uint16_t version_major;
    uint16_t version_minor;
    int32_t thiszone;
    uint32_t sigfigs;
    uint32_t snaplen;
    uint32_t linktype;
  };

  struct PacketHeader {
    uint32_t tv_sec;
    uint32_t tv_usec;
    uint32_t caplen;
    uint32_t len;
  };
`);
