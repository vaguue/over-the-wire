import structsModule from '../structs.js';
const { structs } = structsModule.pcapng;

const blockTrailerLength = structs[0].BlockTrailer.prototype.config.length;
const blockHeaderLength = structs[0].BlockHeader.prototype.config.length;
const additionalLength = blockTrailerLength + blockHeaderLength;

export { blockTrailerLength, blockHeaderLength, additionalLength };
export default {
  blockTrailerLength,
  blockHeaderLength,
  additionalLength,
};
