const { BlockReader } = require('#lib/pcapFile/reader');

const { OptionReader } = require('./option');
const { blockTrailerLength, blockHeaderLength, additionalLength } = require('../const');

const {
  PCAP_NG_VERSION_MAJOR,
  PCAP_NG_VERSION_MINOR,
  BYTE_ORDER_MAGIC,
  BYTE_ORDER_MAGIC_SWAP,
} = require('#lib/pcapFile/structs').pcapng;

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

module.exports = { SectionBlockReader };
