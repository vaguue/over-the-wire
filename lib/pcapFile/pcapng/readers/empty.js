const { BlockReader, BufferReader } = require('#lib/pcapFile/reader');
const { blockTrailerLength, blockHeaderLength, additionalLength } = require('../const');

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

module.exports = { EmptyReader };
