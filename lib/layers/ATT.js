import { OsiModelLayers } from '#lib/layers/osi';
import { decodeBySchema, encodeBySchema, defineDecodedFields } from '#lib/layers/bluetooth';

const Opcodes = {
  ERROR_RESPONSE: 0x01,
  EXCHANGE_MTU_REQUEST: 0x02,
  EXCHANGE_MTU_RESPONSE: 0x03,
  FIND_INFORMATION_REQUEST: 0x04,
  FIND_INFORMATION_RESPONSE: 0x05,
  READ_BY_TYPE_REQUEST: 0x08,
  READ_BY_TYPE_RESPONSE: 0x09,
  READ_REQUEST: 0x0a,
  READ_RESPONSE: 0x0b,
  READ_BLOB_REQUEST: 0x0c,
  READ_BLOB_RESPONSE: 0x0d,
  READ_BY_GROUP_TYPE_REQUEST: 0x10,
  READ_BY_GROUP_TYPE_RESPONSE: 0x11,
  WRITE_REQUEST: 0x12,
  WRITE_RESPONSE: 0x13,
  HANDLE_VALUE_NOTIFICATION: 0x1b,
  HANDLE_VALUE_INDICATION: 0x1d,
  HANDLE_VALUE_CONFIRMATION: 0x1e,
  WRITE_COMMAND: 0x52,
};

const Errors = {
  INVALID_HANDLE: 0x01,
  READ_NOT_PERMITTED: 0x02,
  WRITE_NOT_PERMITTED: 0x03,
  INSUFFICIENT_AUTHENTICATION: 0x05,
  REQUEST_NOT_SUPPORTED: 0x06,
  ATTRIBUTE_NOT_FOUND: 0x0a,
  INSUFFICIENT_ENCRYPTION: 0x0f,
};

const opcodeNames = Object.fromEntries(Object.entries(Opcodes).map(([name, value]) => [value, name]));

const handleRange = [['startHandle', 'uint16'], ['endHandle', 'uint16']];
const handleAndValue = [['handle', 'uint16'], ['value', 'rest']];
const lengthAndData = [['entryLength', 'uint8'], ['data', 'rest']];

const schemas = {
  [Opcodes.ERROR_RESPONSE]: [['requestOpcode', 'uint8'], ['handle', 'uint16'], ['errorCode', 'uint8']],
  [Opcodes.EXCHANGE_MTU_REQUEST]: [['mtu', 'uint16']],
  [Opcodes.EXCHANGE_MTU_RESPONSE]: [['mtu', 'uint16']],
  [Opcodes.FIND_INFORMATION_REQUEST]: handleRange,
  [Opcodes.FIND_INFORMATION_RESPONSE]: [['format', 'uint8'], ['data', 'rest']],
  [Opcodes.READ_BY_TYPE_REQUEST]: [...handleRange, ['uuid', 'uuid']],
  [Opcodes.READ_BY_TYPE_RESPONSE]: lengthAndData,
  [Opcodes.READ_REQUEST]: [['handle', 'uint16']],
  [Opcodes.READ_RESPONSE]: [['value', 'rest']],
  [Opcodes.READ_BLOB_REQUEST]: [['handle', 'uint16'], ['offset', 'uint16']],
  [Opcodes.READ_BLOB_RESPONSE]: [['value', 'rest']],
  [Opcodes.READ_BY_GROUP_TYPE_REQUEST]: [...handleRange, ['uuid', 'uuid']],
  [Opcodes.READ_BY_GROUP_TYPE_RESPONSE]: lengthAndData,
  [Opcodes.WRITE_REQUEST]: handleAndValue,
  [Opcodes.WRITE_RESPONSE]: [],
  [Opcodes.HANDLE_VALUE_NOTIFICATION]: handleAndValue,
  [Opcodes.HANDLE_VALUE_INDICATION]: handleAndValue,
  [Opcodes.HANDLE_VALUE_CONFIRMATION]: [],
  [Opcodes.WRITE_COMMAND]: handleAndValue,
};

const UNKNOWN_OPCODE = [['data', 'rest']];
const OPCODE_FIELD = 1;

const serialize = (data = {}) => {
  const opcode = data.opcode ?? Opcodes.READ_REQUEST;
  return Buffer.concat([Buffer.from([opcode]), ...encodeBySchema(schemas[opcode] ?? UNKNOWN_OPCODE, data)]);
};

/**
 * Attribute Protocol PDU
 * @class
 * @implements {Layer}
 * @property {number} opcode - Operation.
 * @property {string} opcodeName - Read only: name of the operation.
 * @property {number} handle - Attribute handle.
 * @property {Buffer} value - Attribute value.
 */
class ATT {
  name = 'ATT';

  constructor(data = {}, { prev = null, allocated = null } = {}) {
    this.prev = prev;
    this.next = null;
    this.decoded = null;
    this.buffer = Buffer.isBuffer(data) ? data : serialize(data);
    this.length = allocated ?? this.buffer.length;
  }

  static osi = OsiModelLayers.Application;
  osi = OsiModelLayers.Application;

  static toAlloc = (data) => serialize(data).length;

  static docs = {
    title: 'Attribute Protocol',
    summary: 'ATT, Bluetooth Core Specification volume 3 part F. The requests, responses and notifications that GATT is made of: reading and writing the attributes of a Bluetooth Low Energy device. Recognised under L2CAP on channel 4.',
    fields: {
      opcode: 'Operation, one of att.*. READ_REQUEST by default.',
      opcodeName: 'Read only: name of the operation.',
      handle: 'Handle of the attribute the operation is about.',
      value: 'Buffer with the attribute value: what is written, read or notified.',
      startHandle: 'Discovery requests: first handle of the range.',
      endHandle: 'Discovery requests: last handle of the range.',
      uuid: 'Discovery requests: attribute type, 2a00 or a full UUID.',
      mtu: 'EXCHANGE_MTU_*: the largest PDU the sender accepts.',
      requestOpcode: 'ERROR_RESPONSE: the operation that failed.',
      errorCode: 'ERROR_RESPONSE: one of att.ERROR_*.',
      data: 'Discovery responses and unknown operations: the bytes after the fixed fields.',
      complete: 'Read only: every field of the operation is inside these bytes.',
    },
    constants: [
      {
        title: 'Operations',
        field: 'opcode',
        values: Opcodes,
      },
      {
        title: 'Error codes',
        field: 'errorCode',
        values: Object.fromEntries(Object.entries(Errors).map(([name, value]) => [`ERROR_${name}`, value])),
      },
    ],
    example: "wire.packet().hci().acl({ handle: 0x40 }).l2cap().att({ opcode: att.WRITE_REQUEST, handle: 0x25, value: Buffer.from([1]) })",
  };

  parsed() {
    if (this.decoded === null) {
      const bytes = this.buffer.subarray(0, this.length);
      const opcode = bytes[0];

      this.decoded = {
        opcode,
        opcodeName: opcodeNames[opcode],
        ...decodeBySchema(schemas[opcode] ?? UNKNOWN_OPCODE, bytes.subarray(OPCODE_FIELD)),
      };
    }

    return this.decoded;
  }

  toObject() {
    return { ...this.parsed() };
  }

  merge(data) {
    serialize(data).copy(this.buffer);
    this.decoded = null;
  }

  defaults() {}

  nextProto() {
    return null;
  }
}

defineDecodedFields(ATT, [
  'opcode',
  'opcodeName',
  'handle',
  'value',
  'startHandle',
  'endHandle',
  'uuid',
  'mtu',
  'offset',
  'format',
  'entryLength',
  'requestOpcode',
  'errorCode',
  'data',
  'complete',
]);

export { ATT, Opcodes, Errors };
export default { ATT };
