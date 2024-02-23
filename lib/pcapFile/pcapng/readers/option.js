const { alignOffset } = require('struct-compile');

const { BlockReader, BufferReader } = require('#lib/pcapFile/reader');

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
      this.readLength = this.inputStream._structs.OptionHeader.prototype.config.length + this.optionLength;

      this.reader = null;
    }
  }

  get result() {
    return {
      ...this.optionHdr,
      buffer: this.optionBuf.toString(),
    };
  }
};

module.exports = { OptionReader };
