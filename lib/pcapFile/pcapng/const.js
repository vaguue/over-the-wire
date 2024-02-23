const { structs } = require('#lib/pcapFile/structs').pcapng;

const blockTrailerLength = structs[0].BlockTrailer.prototype.config.length;
const blockHeaderLength = structs[0].BlockHeader.prototype.config.length;
const additionalLength = blockTrailerLength + blockHeaderLength;

module.exports = {
  blockTrailerLength,
  blockHeaderLength,
  additionalLength,
};
