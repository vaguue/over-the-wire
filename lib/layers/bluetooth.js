const ADDRESS_LENGTH = 6;
const SHORT_UUID_LENGTH = 2;
const FULL_UUID_LENGTH = 16;
const FULL_UUID_GROUPS = [8, 4, 4, 4, 12];
const EMPTY = Buffer.alloc(0);

const truncated = () => {
  const err = new Error('The message ends before its fields do');
  err.code = 'ETRUNCATED';
  return err;
};

const addressToString = (bytes) => {
  return [...bytes].reverse().map(byte => byte.toString(16).padStart(2, '0')).join(':');
};

const addressFromString = (address) => {
  return Buffer.from(address.split(':').reverse().map(pair => parseInt(pair, 16)));
};

const uuidToString = (bytes) => {
  const hex = Buffer.from(bytes).reverse().toString('hex');

  if (bytes.length !== FULL_UUID_LENGTH) {
    return hex;
  }

  const groups = [];
  let position = 0;

  for (const size of FULL_UUID_GROUPS) {
    groups.push(hex.slice(position, position + size));
    position += size;
  }

  return groups.join('-');
};

const uuidFromString = (uuid) => {
  return Buffer.from(uuid.replace(/-/g, ''), 'hex').reverse();
};

const bytesOf = (value) => {
  if (value === undefined || value === null) {
    return EMPTY;
  }

  return Buffer.isBuffer(value) ? value : Buffer.from(value);
};

const encoders = {
  uint8: (value) => Buffer.from([value ?? 0]),
  int8: (value) => Buffer.from([(value ?? 0) & 0xff]),
  uint16: (value) => {
    const encoded = Buffer.alloc(2);
    encoded.writeUInt16LE(value ?? 0);
    return encoded;
  },
  address: (value) => addressFromString(value ?? '00:00:00:00:00:00'),
  uuid: (value) => uuidFromString(value ?? '0000'),
  rest: (value) => bytesOf(value),
};

const readerOver = (bytes) => {
  let position = 0;

  const take = (length) => {
    if (position + length > bytes.length) {
      throw truncated();
    }

    const taken = bytes.subarray(position, position + length);
    position += length;
    return taken;
  };

  return {
    take,
    remaining: () => bytes.length - position,
    uint8: () => take(1)[0],
    int8: () => take(1).readInt8(0),
    uint16: () => take(2).readUInt16LE(0),
    address: () => addressToString(take(ADDRESS_LENGTH)),
    uuid: () => uuidToString(take(bytes.length - position === FULL_UUID_LENGTH ? FULL_UUID_LENGTH : SHORT_UUID_LENGTH)),
    rest: () => take(bytes.length - position),
  };
};

const decodeBySchema = (schema, bytes) => {
  const read = readerOver(bytes);
  const fields = {};

  try {
    for (const [name, kind] of schema) {
      fields[name] = read[kind]();
    }
  }
  catch (err) {
    if (err.code !== 'ETRUNCATED') {
      throw err;
    }

    return { ...fields, complete: false };
  }

  return { ...fields, complete: true };
};

const encodeBySchema = (schema, data) => {
  return schema.map(([name, kind]) => encoders[kind](data[name]));
};

const defineDecodedFields = (Layer, names) => {
  for (const name of names) {
    Object.defineProperty(Layer.prototype, name, {
      configurable: true,
      get() {
        return this.parsed()[name];
      },
    });
  }
};

export {
  addressToString,
  addressFromString,
  uuidToString,
  uuidFromString,
  bytesOf,
  readerOver,
  decodeBySchema,
  encodeBySchema,
  defineDecodedFields,
  EMPTY,
};
