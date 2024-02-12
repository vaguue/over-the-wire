const { fromConfig } = require('struct-compile');

const changeMeta = (struct, meta) => {
  const { config } = struct.prototype;
  return fromConfig({ ...config, meta });
}

const toBE = struct => changeMeta(struct, { BE: true });

module.exports = { toBE };
