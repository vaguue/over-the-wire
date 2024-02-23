const { alignOffset } = require('struct-compile');

const { Packet } = require('#lib/packet');
const { BlockReader, BufferReader } = require('#lib/pcapFile/reader');
const { pick } = require('#lib/pick');

const { OptionReader } = require('./option');

const { blockTrailerLength, blockHeaderLength, additionalLength } = require('../const');

const { constants } = require('#lib/pcapFile/structs').pcapng;

const Tsresol = require('../tsresol');

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
      this.buffer = this.reader.result;
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
    const block = this.block.toObject();
    const iface = this.inputStream.interfaces[block.interface_id] ?? {};
    const commentOpt = this.options.find(e => e.option_code == constants.OPT_COMMENT);

    return new Packet({
      iface: pick(iface, 'linktype', 'name'),
      buffer: this.buffer.subarray(0, this.block.caplen),
      timestamp: Tsresol.parse(iface.tsresol, block),
      ...(commentOpt && { comment: commentOpt.buffer.toString().split('\0')[0] }),
    });
  }
}

module.exports = { EnhancedPacketBlockReader };
