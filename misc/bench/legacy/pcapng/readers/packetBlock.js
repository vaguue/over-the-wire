const { BlockReader } = require('../../reader');

class PacketBlockReader extends BlockReader {
  constructor(...args) {
    super(...args);
  }
}

module.exports = { PacketBlockReader };
