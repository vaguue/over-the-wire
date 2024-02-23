const { BlockReader } = require('#lib/pcapFile/reader');

class PacketBlockReader extends BlockReader {
  constructor(...args) {
    super(...args);
  }
}

module.exports = { PacketBlockReader };
