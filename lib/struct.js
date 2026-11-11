import { fromConfig } from 'struct-compile';

const changeMeta = (struct, meta) => {
  const { config } = struct.prototype;
  return fromConfig({ ...config, meta });
}

const toBE = struct => changeMeta(struct, { BE: true });

const addField = (proto, field) => {
  proto.config.fields[field] = { d: [] };
}

export { toBE, addField };
export default { toBE, addField };
