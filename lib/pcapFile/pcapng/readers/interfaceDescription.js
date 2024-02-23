const { BlockReader } = require('#lib/pcapFile/reader');

const { OptionReader } = require('./option');
const { blockTrailerLength, blockHeaderLength, additionalLength } = require('../const');

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

module.exports = { InterfaceDescriptionBlockReader };
