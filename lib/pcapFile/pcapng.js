const { Transform } = require('stream');
const { alignOffset } = require('struct-compile');

const {
  BYTE_ORDER_MAGIC,
  BYTE_ORDER_MAGIC_SWAP,
  structs,
  BT_SHB,
  BT_IDB,
  BT_EPB,
  BT_SPB,
  constants,
} = require('./structs').pcapng;

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
  console.log(blockHdr.toObject());
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

class PcapOutputStream extends Transform {
  constructor(opts) {
    super({ ...opts, writableObjectMode: true });

    const snaplen = opts.snaplen ?? 3000;
    const linktype = opts.linktype ?? LinkLayerType.LINKTYPE_ETHERNET;

    const hdr = new PcapFileHeader({
      magic: BYTE_ORDER_MAGIC,
      version_major: 2,
      version_minor: 4,
      thiszone: 0,
      sigfigs: 0,
      snaplen,
      linktype,
    });

    this.push(hdr.buffer);
  }

  _transform(chunk, encoding, callback) {
    if (Buffer.isBuffer(chunk)) {
      const now = Date.now();
      const pktHdr = new PacketHeader({
        tv_sec: Math.floor(now / 1000),
        tv_usec: now % 1000,
        caplen: chunk.length,
        len: chunk.length,
      });

      this.push(pktHdr.buffer);
      this.push(chunk);

      callback();
    }
    else if (
      typeof chunk == 'object' && 
      chunk.hasOwnProperty('tv_sec') &&
      chunk.hasOwnProperty('tv_usec') &&
      chunk.hasOwnProperty('caplen') &&
      chunk.hasOwnProperty('len') &&
      chunk.hasOwnProperty('buf')
    ) {
      this.push(new PacketHeader(chunk).buffer);
      this.push(chunk.buf);

      callback();
    }
    else {
      callback(new Error(`Invalid argument: ${chunk}`));
    }
  }
};

module.exports = { PcapNGInputStream, constants };
