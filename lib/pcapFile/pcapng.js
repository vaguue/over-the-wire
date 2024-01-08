const { Transform } = require('stream');
const { compile, alignOffset } = require('struct-compile');

const { toBE } = require('../struct');
const pick = require('../pick');

const OPT_ENDOFOPT = 0;  /* end of options */
const OPT_COMMENT = 1;  /* comment string */

const BT_SHB = 0x0A0D0D0A;
const BT_SHB_INSANE_MAX = 1024 * 1024;  /* 1MB should be enough */

/*
 * Byte-order magic value.
 */
const BYTE_ORDER_MAGIC = 0x1A2B3C4D;
const BYTE_ORDER_MAGIC_SWAP = 0x4D3C2B1A;

/*
 * Current version number.  If major_version isn't PCAP_NG_VERSION_MAJOR,
 * or if minor_version isn't PCAP_NG_VERSION_MINOR or 2, that means that
 * this code can't read the file.
 */
const PCAP_NG_VERSION_MAJOR = 1;
const PCAP_NG_VERSION_MINOR = 0;

/*
 * Interface Description Block.
 */
const BT_IDB = 0x00000001;

/*
 * Options in the IDB.
 */
const IF_NAME = 2;  /* interface name string */
const IF_DESCRIPTION = 3;  /* interface description string */
const IF_IPV4ADDR = 4;  /* interface's IPv4 address and netmask */
const IF_IPV6ADDR = 5;  /* interface's IPv6 address and prefix length */
const IF_MACADDR = 6;  /* interface's MAC address */
const IF_EUIADDR = 7;  /* interface's EUI address */
const IF_SPEED = 8;  /* interface's speed, in bits/s */
const IF_TSRESOL = 9;  /* interface's time stamp resolution */
const IF_TZONE = 10;  /* interface's time zone */
const IF_FILTER = 11;  /* filter used when capturing on interface */
const IF_OS = 12;  /* string OS on which capture on this interface was done */
const IF_FCSLEN = 13;  /* FCS length for this interface */
const IF_TSOFFSET = 14;  /* time stamp offset for this interface */

/*
 * Enhanced Packet Block.
 */
const BT_EPB = 0x00000006;

/*
 * Simple Packet Block.
 */
const BT_SPB = 0x00000003;

/*
 * Packet Block.
 */
const BT_PB = 0x00000002;

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
    uint32_t  len;
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

const structs = [
  structsInit, //LE
  Object.keys(structsInit).reduce((res, key) => ({ ...res, [key]: toBE(structsInit[key]) }), {}), //BE
];

const blockTrailerLength = structs[0].BlockTrailer.config.length;
const blockHeaderLength = structs[0].BlockHeader.config.length;
const additionalLength = blockTrailerLength + blockHeaderLength;

class BlockReader /*extends Writable*/ {
  constructor(inputStream, blockHdr) {
    //super({ objectMode: true });
    this.inputStream = inputStream;
    this.blockHdr = blockHdr;
  }
}

class OptionReader {
  constructor(inputStream) {
    this.inputStream = inputStream;
    this.reset();
  }

  reset() {
    this.optionHdrReader = this.inputStream._structs.OptionHeader.createSingleReader({ toObject: true });
    this.readLength = 0;
    this.bufs = [];
    this.optionHdr = null;
  }

  write(chunk) {
    let buf = chunk;
    while (buf?.length > 0) {
      if (!this.optionHdr) {
        this.optionHdrReader.write(buf);
        if (this.optionHdrReader.finished) {
          this.optionHdr = this.optionHdrReader.result;
          this.optionLength = alignOffset(this.optionHdr.option_length, 4);
          this.remaining = buf = this.optionHdrReader.remaining;
        }
      }
      else  {
        this.bufs.push(buf);
        this.readLength += buf.length;
        if (this.readLength >= this.optionLength) {
          const optionBuf = Buffer.concat(this.bufs);
          this.remaining = optionBuf.slice(this.optionLength);
          this.optionBuf = optionBuf.slice(0, this.optionHdr.option_length);
          this.readLength = this.inputStream._structs.OptionHeader.config.length + this.optionLength;
          this.finished = true;
        }
        buf = null;
      }
    }
  }

  get result() {
    return {
      ...this.optionHdr,
      buf: this.optionBuf.toString(),
    };
  }
};

class SectionBlockReader extends BlockReader {
  type = 'section-header';
  
  constructor(...args) {
    super(...args);
    this.blockReader = this.inputStream._structs.SectionHeaderBlock.createSingleReader({ toObject: false });
    this.optionReader = new OptionReader(this.inputStream);
    this.options = [];
    this.readLength = 0;
    this.verifiedLength = false;
    this.remaining = Buffer.from('');
  }

  write(chunk) {
    let buf = chunk;
    while (buf?.length > 0) {
      if (!this.block) {
        this.blockReader.write(buf);
        if (this.blockReader.finished) {
          this.block = this.blockReader.result;
          if (this.block.byte_order_magic == BYTE_ORDER_MAGIC_SWAP) {
            this.inputStream._toggleEndianness();
            this.inputStream._defaultReaders();
            this.block = new this.inpusStream._structs.SectionHeaderBlock(this.block.buffer);
            this.blockHdr = new this.inpusStream._structs.BlockHeader(this.blockHdr.buffer);
          }
          if (this.block.byte_order_magic != BYTE_ORDER_MAGIC) {
            throw new Error(`Invalid byte_order_magic: ${this.block.byte_order_magic}`);
          }
          this.blockLength = this.blockHdr.total_length - additionalLength;
          this.remaining = buf = this.blockReader.remaining;
          this.verifiedLength = true;
          this.readLength += this.block.length;
        }
      }
      else if (this.readLength < this.blockLength) {
        this.optionReader.write(buf);
        if (this.optionReader.finished) {
          this.options.push(this.optionReader.result);
          this.readLength += this.optionReader.readLength;
          this.remaining = buf = this.optionReader.remaining;
          this.optionReader.reset();
        }
      }
      else {
        this.finished = true;
        buf = null;
      }
    }
  }

  get result() {
    return { 
      ...this.block.toObject(),
      options: this.options,
    };
  }
}

class InterfaceDescriptionBlockReader extends BlockReader {
  type = 'interface-description';

  constructor(...args) {
    super(...args);
    this.blockReader = this.inputStream._structs.InterfaceDescriptionBlock.createSingleReader({ toObject: false });
    this.optionReader = new OptionReader(this.inputStream);
    this.options = [];
    this.readLength = 0;
    this.verifiedLength = false;
    this.remaining = Buffer.from('');
  }

  write(chunk) {
    let buf = chunk;
    while (buf?.length > 0) {
      if (!this.block) {
        this.blockReader.write(buf);
        if (this.blockReader.finished) {
          this.block = this.blockReader.result;
          this.blockLength = this.blockHdr.total_length - additionalLength;
          this.remaining = buf = this.blockReader.remaining;
          this.readLength += this.block.length;
        }
      }
      else if (this.readLength < this.blockLength) {
        this.optionReader.write(buf);
        if (this.optionReader.finished) {
          this.options.push(this.optionReader.result);
          this.readLength += this.optionReader.readLength;
          this.remaining = buf = this.optionReader.remaining;
          this.optionReader.reset();
        }
      }
      else {
        this.finished = true;
        buf = null;
      }
    }
  }

  get result() {
    return { 
      ...this.block.toObject(),
      options: this.options,
    };
  }
}

class EnhancedPacketBlockReader extends BlockReader {
  constructor(...args) {
    super(...args);
  }
}

class SimplePacketBlockReader extends BlockReader {
  constructor(...args) {
    super(...args);
  }
}

class PacketBlockReader extends BlockReader {
  constructor(...args) {
    super(...args);
  }
}

function getBlockReader(inputStream, blockHdr) {
  const { block_type } = blockHdr;
  switch(block_type) {
    case BT_SHB:
      return new SectionBlockReader(inputStream, blockHdr);
    case BT_IDB:
      return new InterfaceDescriptionBlockReader(inputStream, blockHdr);
    case BT_EPB:
      return new EnhancedPacketBlockReader(inputStream, blockHdr);
    case BT_SPB:
      return new SimplePacketBlockReader(inputStream, blockHdr);
    case BT_PB:
      return new PacketBlockReader(inputStream, blockHdr);
    default:
      throw new Error(`Unknown block type: ${block_type}`);
  }
};

class PcapNGInputStream extends Transform {
  constructor(opts) {
    super({ ...opts, objectMode: true });
    this.structsIdx = 0;

    this._defaultReaders();
    this.hdr = null;
    this.block = null;
    this.trailer = null;

    this.blockReader = null;
    this.blockLength = null;
  }

  _toggleEndianness() {
    this.structsIdx ^= 1;
  }

  get _structs() {
    return structs[this.structsIdx];
  }

  _defaultReaders() {
    this.hdrReader = this._structs.BlockHeader.createSingleReader({ toObject: false, selfEnd: false });
    this.trailerReader = this._structs.BlockTrailer.createSingleReader({ toObject: true, selfEnd: false });
  }

  _endDefaultReaders() {
    if (this.hdrReader && !this.hdrReader.closed) {
      this.hdrReader.end();
    }
    if (this.trailerReader && !this.hdrReader.closed) {
      this.trailerReader.end();
    }
  }

  _transform(chunk, encoding, callback) {
    let buf = chunk;
    while (buf?.length) {
      if (!this.hdr) {
        this.hdrReader.write(buf);
        if (this.hdrReader.finished) {
          this.hdr = this.hdrReader.result;
          console.log('hdr', this.hdr.toObject());
          this.blockReader = getBlockReader(this, this.hdr);
          buf = this.hdrReader.remaining;
          this.hdrReader.reset();
        }
      }
      else if (!this.block) {
        try {
          this.blockReader.write(buf);
        } catch(err) {
          return callback(err);
        }
        if (this.blockReader.finished) {
          this.block = this.blockReader.result;
          this.emit(this.blockReader.type, this.block);
          buf = this.blockReader.remaining;
        }
      }
      else if (!this.trailer) {
        this.trailerReader.write(buf);
        if (this.trailerReader.finished) {
          this.trailer = this.trailerReader.result;
          if (this.trailer.total_length != this.hdr.total_length) {
            return callback(new Error(`Inavlid block trailer with value ${this.trailer.total_length}`));
          }
          buf = this.trailerReader.remaining;
          this.trailerReader.reset();
          this.hdr = null;
          this.block = null;
          this.trailer = null;
        }
      }
    }

    callback();
  }

  _final(callback) {

  }
};

module.exports = { PcapNGInputStream };
