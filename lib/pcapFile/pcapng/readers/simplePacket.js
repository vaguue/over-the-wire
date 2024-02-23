const { alignOffset } = require('struct-compile');

const { BlockReader, BufferReader } = require('#lib/pcapFile/reader');

const { blockTrailerLength, blockHeaderLength, additionalLength } = require('../const');

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
      this.reader = null;
    }
  }

  get result() {
    return new Packet({
      buffer: this.pkt.subarray(0, this.block.caplen),
    });
  }
}

module.exports = { SimplePacketBlockReader };
