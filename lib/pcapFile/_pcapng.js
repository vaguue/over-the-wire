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
} = require('./structs').pcapng;

const { BlockReader, BufferReader } = require('./reader');

const blockTrailerLength = structs[0].BlockTrailer.config.length;
const blockHeaderLength = structs[0].BlockHeader.config.length;
const additionalLength = blockTrailerLength + blockHeaderLength;

class OptionReader extends BlockReader {
  constructor(...args) {
    super(...args);
    this.reset();
  }

  reset() {
    this.optionHdrReader = this.inputStream._structs.OptionHeader.createSingleReader({ toObject: true });
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
      this.stage == 1;
    }
    else if (this.stage == 1) {
      this.block = this.blockReader.result;
      if (this.block.byte_order_magic == BYTE_ORDER_MAGIC_SWAP) {
        this.inputStream._toggleEndianness();
        this.inputStream._defaultReaders();
        this.block = new this.inpusStream._structs.SectionHeaderBlock(this.block.buffer);
        this.options.blockHdr = new this.inpusStream._structs.BlockHeader(this.options.blockHdr.buffer);
      }
      if (this.block.byte_order_magic != BYTE_ORDER_MAGIC) {
        throw new Error(`Invalid byte_order_magic: ${this.block.byte_order_magic}`);
      }
      this.blockLength = this.options.blockHdr.total_length - additionalLength;
      this.readLength += this.block.length;
    }
  }

  write(chunk) {
    let buf = chunk;
    while (buf?.length > 0) {
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
        this.inputStream.interfaces.push(this.result);
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
    this.remaining = Buffer.from('');
    this.blockLength = this.blockHdr.total_length - additionalLength;
    this.pkt = [];
    this.pktLen = 0;
    this.pktToRead = 0;
  }

  write(chunk) {
    let buf = chunk;
    while (buf?.length > 0) {
      if (!this.block) {
        this.blockReader.write(buf);
        if (this.blockReader.finished) {
          this.block = this.blockReader.result;
          this.remaining = buf = this.blockReader.remaining;
          this.readLength += this.block.length;
          this.pktToRead = alignOffset(this.block.caplen, 4);
        }
      }
      else if (this.pktLen < this.pktToRead) {
        this.pkt.push(buf);
        this.pktLen += buf.length;
        if (this.pktLen >= this.pktToRead) {
          const pktBuf = Buffer.concat(this.pkt);
          this.pkt = pktBuf.slice(0, this.pktToRead);
          this.remaining = buf = pktBuf.subarray(this.pktToRead)
          this.readLength += this.pktToRead;
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
      pkt: this.pkt.subarray(0, this.block.caplen),
      options: this.options,
    }
  }
}

class SimplePacketBlockReader extends BlockReader {
  push = true;

  constructor(...args) {
    super(...args);
    this.blockReader = this.inputStream._structs.SimplePacketBlock.createSingleReader({ toObject: false });
    this.remaining = Buffer.from('');
    this.blockLength = this.blockHdr.total_length - additionalLength;
    this.pkt = [];
    this.pktLen = 0;
    this.pktToRead = 0;
  }

  write(chunk) {
    let buf = chunk;
    while (buf?.length > 0) {
      if (!this.block) {
        this.blockReader.write(buf);
        if (this.blockReader.finished) {
          this.block = this.blockReader.result;
          this.remaining = buf = this.blockReader.remaining;
          this.readLength += this.block.length;
          this.pktToRead = alignOffset(this.block.caplen, 4);
        }
      }
      else if (this.pktLen < this.pktToRead) {
        this.pkt.push(buf);
        this.pktLen += buf.length;
        if (this.pktLen >= this.pktToRead) {
          const pktBuf = Buffer.concat(this.pkt);
          this.pkt = pktBuf.slice(0, this.pktToRead);
          this.remaining = buf = pktBuf.subarray(this.pktToRead)
          this.readLength += this.pktToRead;
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
      pkt: this.pkt.subarray(0, this.block.caplen),
      options: this.options,
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

  write(chunk) {
    if (this.readLength + chunk.length >= this.toRead) {
      this.remaining = chunk.subarray(this.toRead - this.readLength);
      this.finished = true;
    }
    else {
      this.readLength += chunk.length;
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
          if (this.blockReader.type) {
            this.emit(this.blockReader.type, this.block);
          }
          else if (this.blockReader.push) {
            this.push(this.block);
          }
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
