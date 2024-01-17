//TODO more block types
const assert = require('assert');
const { Transform } = require('stream');
const { alignOffset } = require('struct-compile');

const { LinkLayerType } = require('../enums');

const {
  PCAP_NG_VERSION_MAJOR,
  PCAP_NG_VERSION_MINOR,
  BYTE_ORDER_MAGIC,
  BYTE_ORDER_MAGIC_SWAP,
  structs,
  BT_SHB,
  BT_IDB,
  BT_EPB,
  BT_SPB,
  constants,
} = require('./structs').pcapng;

const defaults = require('./defaults');
const { BlockReader, BufferReader } = require('./reader');

const blockTrailerLength = structs[0].BlockTrailer.config.length;
const blockHeaderLength = structs[0].BlockHeader.config.length;
const additionalLength = blockTrailerLength + blockHeaderLength;

class OptionReader extends BlockReader {
  constructor(...args) {
    super(...args);
    this.optionHdrReader = this.inputStream._structs.OptionHeader.createSingleReader({ toObject: true });
    this.reset();
  }

  reset() {
    this.optionHdrReader.reset();
    this.readLength = 0;
    this.optionHdr = null;
    this.resetBlockReader();
  }

  nextStage() {
    if (this.stage == 0) {
      this.reader = this.optionHdrReader;
      this.stage = 1;
    }
    else if (this.stage == 1) {
      this.optionHdr = this.optionHdrReader.result;
      this.optionLength = alignOffset(this.optionHdr.option_length, 4);

      this.reader = new BufferReader(this.optionLength);
      this.stage = 2;
    }
    else if (this.stage == 2) {
      this.optionBuf = this.reader.result;
      this.readLength = this.inputStream._structs.OptionHeader.config.length + this.optionLength;

      this.reader = null;
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
  }

  nextStage() {
    if (this.stage == 0) {
      this.reader = this.blockReader;
      this.stage = 1;
    }
    else if (this.stage == 1) {
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
      this.readLength += this.block.length;

      if (this.readLength < this.blockLength) {
        this.reader = this.optionReader;
        this.stage = 2;
      }
      else {
        this.reader = null;
      }
    }
    else if (this.stage == 2) {
      this.options.push(this.optionReader.result);
      this.readLength += this.optionReader.readLength;
      this.optionReader.reset();

      if (this.readLength < this.blockLength) {
        this.reader = this.optionReader;
        this.stage = 2;
      }
      else {
        this.reader = null;
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
  }

  nextStage() {
    if (this.stage == 0) {
      this.reader = this.blockReader;
      this.stage = 1;
    }
    else if (this.stage == 1) {
      this.block = this.blockReader.result;
      this.blockLength = this.blockHdr.total_length - additionalLength;
      this.readLength += this.block.length;
      if (this.readLength < this.blockLength) {
        this.reader = this.optionReader;
        this.stage = 2;
      }
      else {
        this.reader = null;
      }
    }
    else if (this.stage == 2) {
      this.options.push(this.optionReader.result);
      this.readLength += this.optionReader.readLength;
      this.optionReader.reset();

      if (this.readLength < this.blockLength) {
        this.reader = this.optionReader;
        this.stage = 2;
      }
      else {
        this.reader = null;
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
  push = true;

  constructor(...args) {
    super(...args);
    this.blockReader = this.inputStream._structs.EnhancedPacketBlock.createSingleReader({ toObject: false });
    this.optionReader = new OptionReader(this.inputStream);
    this.options = [];
    this.readLength = 0;
    this.blockLength = this.blockHdr.total_length - additionalLength;
    this.pktToRead = 0;
  }

  nextStage() {
    if (this.stage == 0) {
      this.reader = this.blockReader;
      this.stage = 1;
    }
    else if (this.stage == 1) {
      this.block = this.blockReader.result;
      this.readLength += this.block.length;
      this.pktToRead = alignOffset(this.block.caplen, 4);

      this.reader = new BufferReader(this.pktToRead);
      this.stage = 2;
    }
    else if (this.stage == 2) {
      this.buf = this.reader.result;
      this.readLength += this.pktToRead;
      if (this.readLength < this.blockLength) {
        this.reader = this.optionReader;
        this.stage = 3;
      }
      else {
        this.reader = null;
      }
    }
    else if (this.stage == 3) {
      this.options.push(this.optionReader.result);
      this.readLength += this.optionReader.readLength;
      this.optionReader.reset();
      if (this.readLength < this.blockLength) {
        this.reader = this.optionReader;
        this.stage = 3;
      }
      else {
        this.reader = null;
      }
    }
  }

  get result() {
    return {
      ...this.block.toObject(),
      buf: this.buf.subarray(0, this.block.caplen),
      options: this.options,
    }
  }
}

class SimplePacketBlockReader extends BlockReader {
  push = true;

  constructor(...args) {
    super(...args);
    this.blockReader = this.inputStream._structs.SimplePacketBlock.createSingleReader({ toObject: false });
    this.blockLength = this.blockHdr.total_length - additionalLength;
    this.pktToRead = 0;
  }

  nextStage() {
    if (this.stage == 0) {
      this.reader = this.blockReader;
      this.stage = 1;
    }
    else if (this.stage == 1) {
      this.block = this.blockReader.result;
      this.readLength += this.block.length;
      this.pktToRead = alignOffset(this.block.caplen, 4);

      this.reader = new BufferReader(this.pktToRead);
      this.stage = 2;
    }
    else if (this.stage == 2) {
      this.pkt = this.reader.result;
      this.readLength += this.pktToRead;
    }
  }

  get result() {
    return {
      ...this.block.toObject(),
      pkt: this.pkt.subarray(0, this.block.caplen),
    }
  }
}

class PacketBlockReader extends BlockReader {
  constructor(...args) {
    super(...args);
  }
}

class EmptyReader extends BlockReader {
  type = null;

  constructor(...args) {
    super(...args);
    this.readLength = 0;
    this.toRead = this.blockHdr.total_length - additionalLength;
  }

  nextStage() {
    if (this.stage == 0) {
      this.reader = new BufferReader(this.toRead);
      this.stage = 1;
    }
    else {
      this.reader = null;
    }
  }

  get result() {
    return {};
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
    /*case BT_PB:
      return new PacketBlockReader(inputStream, blockHdr);*/
    default:
      return new EmptyReader(inputStream, blockHdr);
  }
};

class PcapNGReader extends BlockReader {
  root = true;
  constructor(...args) {
    super(...args);
  }

  nextStage() {
    if (this.stage == 0) {
      this.inputStream.hdrReader.reset();
      this.reader = this.inputStream.hdrReader;
      this.stage = 1;
    }
    else if (this.stage == 1) {
      this.hdr = this.reader.result;
      this.reader.reset();

      this.reader = getBlockReader(this.inputStream, this.hdr);
      this.stage = 2;
    }
    else if (this.stage == 2) {
      this.block = this.reader.result;
      if (this.reader.type) {
        this.inputStream.emit(this.reader.type, this.block);
      }
      else if (this.reader.push) {
        this.inputStream.push(this.block);
      }

      this.reader = this.inputStream.trailerReader;
      this.stage = 3;
    }
    else if (this.stage == 3) {
      this.trailer = this.reader.result;
      if (this.trailer.total_length != this.hdr.total_length) {
        throw new Error(`Inavlid block trailer with value ${this.trailer.total_length}`);
      }
      this.inputStream.trailerReader.reset();
      this.hdr = null;
      this.block = null;
      this.trailer = null;

      this.reader = this.inputStream.hdrReader;
      this.stage = 1;
    }
  }
}

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
    this.interfaces = [];

    this.reader = new PcapNGReader(this);
  }

  _toggleEndianness() {
    this.structsIdx ^= 1;
  }

  get _structs() {
    return structs[this.structsIdx];
  }

  _defaultReaders() {
    this.hdrReader = this._structs.BlockHeader.createSingleReader({ toObject: false });
    this.trailerReader = this._structs.BlockTrailer.createSingleReader({ toObject: true });
  }

  _transform(chunk, encoding, callback) {
    try {
      this.reader.write(chunk);
    } catch(err) {
      return callback(err);
    }

    return callback();
  }
};

const { 
  BlockHeader,
  BlockTrailer,
  SectionHeaderBlock,
  OptionHeader,
  InterfaceDescriptionBlock,
  EnhancedPacketBlock,
  SimplePacketBlock 
} = structs[0];

function alignedBuf(src) {
  const res = Buffer.alloc(alignOffset(src.length, 4));
  if (Buffer.isBuffer(src)) {
    src.copy(res);
  }
  else if (typeof src == 'string') {
    res.write(src);
  }
  else {
    throw new Error(`Invalid alignedBuf argument ${src}`);
  }

  return res;
}

function getOpt({ option_code, option_length, buf }) {
  const optHdr = new OptionHeader({
    option_code,
    option_length: option_length,
  });

  const optBuf = alignedBuf(buf);
  const stack = new Error().stack
  return Buffer.concat([optHdr.buffer, optBuf]);
}

const appName = 'https://github.com/vaguue/over-the-wire';

class PcapNGOutputStream extends Transform {
  constructor(opts) {
    super({ ...opts, writableObjectMode: true });
    this._initHdr();
    this.interfaces = opts.interfaces ?? [];

    if (this.interfaces?.length > 0) {
      this.interfaces.forEach(iface => {
        this.iface(iface);
      });
    }
  }

  _initHdr() {
    const appOpt = getOpt({
      option_code: constants.OPT_SHB_USERAPPL,
      option_length: appName.length,
      buf: appName,
    });

    const endOpt = getOpt({
      option_code: 0,
      option_length: 0,
      buf: '',
    });

    const section_length = SectionHeaderBlock.config.length + appOpt.length + endOpt.length;

    const hdr = new SectionHeaderBlock({
      byte_order_magic: BYTE_ORDER_MAGIC,
      major_version: PCAP_NG_VERSION_MAJOR,
      minor_version: PCAP_NG_VERSION_MINOR,
      section_length,
    });

    const total_length = section_length + additionalLength;

    const blockHdr = new BlockHeader({
      block_type: BT_SHB,
      total_length,
    });

    this.push(blockHdr.buffer);
    this.push(hdr.buffer);
    this.push(appOpt);
    this.push(endOpt);
    this.push(new BlockTrailer({ total_length }).buffer);
  }

  _parseOptions(options) {
    const resOpt = [...options];
    if (resOpt.length == 0 || resOpt[resOpt.length - 1].option_code != 0) {
      resOpt.push(getOpt({ option_code: 0, option_length: 0, buf: '' }));
    }

    const optSerialized = options.map(opt => getOpt(opt));
    const optLen = optSerialized.reduce((res, e) => res + e.length, 0);
    return { optSerialized, optLen };
  }

  iface({ linktype, snaplen = defaults.snaplen, options = [] }) {
    const iface = new InterfaceDescriptionBlock({
      linktype: 1,
      reserved: 0,
      snaplen,
    });

    const { optSerialized, optLen } = this._parseOptions(options);
    const total_length = additionalLength + optLen + iface.length;

    this.push(new BlockHeader({
      block_type: BT_IDB,
      total_length,
    }).buffer);
    this.push(iface.buffer);
    optSerialized.forEach(optBuf => this.push(optBuf));
    this.push(new BlockTrailer({ total_length }).buffer);

    this.interfaces.push({ linktype, snaplen, options });
    return this.interfaces.length - 1;
  }

  simplePacket(buf) {
    if (this.interfaces.length == 0) {
      this.iface({ 
        snaplen: defaults.snaplen,
        linktype: defaults.linktype,
        options: [],
      });
    }
    const simplePacketHeader = new SimplePacketBlock({ caplen: buf.length });
    const total_length = simplePacketHeader.length + buf.length + additionalLength;
    this.push(new BlockHeader({
      block_type: BT_SPB,
      total_length,
    }).buffer);
    this.push(simplePacketHeader.buffer);
    this.push(alignedBuf(buf));
    this.push(new BlockTrailer({ total_length }).buffer);
  }

  _findIfaceIndex(iface) {
    return this.interfaces.findIndex(e => {
      try {
        assert.deepEqual(e, iface);
        return true;
      } catch(err) {
        return false;
      }
    });
  }

  enhancedPacket({ options = [], ...obj }) {
    const { buf } = obj;
    if (!buf) {
      throw new Error('Expected EnhancedPacket to have buf property');
    }
    const { optSerialized, optLen } = this._parseOptions(options);
    let interface_id;
    if (obj.hasOwnProperty('interface_id')) {
      interface_id = obj.interface_id;
    }
    else if (obj.hasOwnProperty('interface')) {
      interface_id = this._findIfaceIndex(obj.interface);
      if (interface_id == -1) {
        interface_id = this._iface(obj.interface);
      }
    }
    else {
      throw new Error('Expected EnhancedPacket to have either interface_id or interface property');
    }

    let timestamp_high, timestamp_low;

    if (obj.hasOwnProperty('timestamp_high') && obj.hasOwnProperty('timestamp_low')) {
      timestamp_high = obj.timestamp_high;
      timestamp_low = obj.timestamp_low;
    }
    else {
      let resol;
      const tsresol = this.interfaces[interface_id].options.find(e => e.option_code == constants.OPT_IF_TSRESOL)?.buf;
      if (tsresol) {
        const resolValue = Buffer.from(tsresol).readInt32LE();
        const flag = (1 << 31);
        if (resolValue & flag) {
          resol = Math.round(1 / Math.pow(2, -1 * (resolValue & (~flag))));
        }
        else {
          resol = Math.round(1 / Math.pow(10, -1 * (resolValue & (~flag))));
        }

      }
      else {
        resol = 1e9;
      }

      const value = process.hrtime.bigint() * BigInt(1e9) / BigInt(resol);
      timestamp_high = parseInt(((value & BigInt(0xffffffff00000000)) >> 32n).toString());
      timestamp_low = parseInt((value & BigInt(0x00000000ffffffff)).toString());
    }

    const packetHeader = new EnhancedPacketBlock({ 
      interface_id,
      caplen: obj.caplen ?? buf.length,
      len: obj.len ?? buf.length,
      timestamp_high, timestamp_low,
    });

    const total_length = packetHeader.length + buf.length + optLen + additionalLength;

    this.push(new BlockHeader({
      block_type: BT_EPB,
      total_length,
    }).buffer);
    this.push(packetHeader.buffer);
    this.push(alignedBuf(buf));
    optSerialized.forEach(optBuf => this.push(optBuf));
    this.push(new BlockTrailer({ total_length }).buffer);
  }

  _transform(chunk, encoding, callback) {
    try {
      if (Buffer.isBuffer(chunk)) {
        this.simplePacket(chunk);
      }
      else if (typeof chunk == 'object') {
        this.enhancedPacket(chunk);
      }
      else {
        throw new Error(`Invalid argument: ${chunk}`);
      }
    } catch(err) {
      return callback(err);
    }

    callback();
  }
};

module.exports = { PcapNGInputStream, PcapNGOutputStream, constants };
