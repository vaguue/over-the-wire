const { BlockReader } = require('#lib/pcapFile/reader');

const {
  BT_SHB,
  BT_IDB,
  BT_EPB,
  BT_SPB,
} = require('#lib/pcapFile/structs').pcapng;

const { SectionBlockReader } = require('./sectionBlock');
const { InterfaceDescriptionBlockReader } = require('./interfaceDescription');
const { EnhancedPacketBlockReader } = require('./enhancedPacket');
const { SimplePacketBlockReader } = require('./simplePacket');
const { EmptyReader } = require('./empty');

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

module.exports = { PcapNGReader };
