import { OsiModelLayers } from '#lib/layers/osi';
import { bytesOf, defineDecodedFields } from '#lib/layers/bluetooth';

const HEADER_LENGTH = 3;
const OCF_BITS = 10;
const OCF_MASK = 0x03ff;

const Groups = {
  LINK_CONTROL: 0x01,
  LINK_POLICY: 0x02,
  CONTROLLER: 0x03,
  INFORMATIONAL: 0x04,
  STATUS: 0x05,
  LE_CONTROLLER: 0x08,
  VENDOR: 0x3f,
};

const opcodeOf = (ogf, ocf) => {
  return (ogf << OCF_BITS) | ocf;
};

const Commands = {
  RESET: opcodeOf(Groups.CONTROLLER, 0x0003),
  DISCONNECT: opcodeOf(Groups.LINK_CONTROL, 0x0006),
  LE_SET_ADVERTISING_ENABLE: opcodeOf(Groups.LE_CONTROLLER, 0x000a),
  LE_SET_SCAN_PARAMETERS: opcodeOf(Groups.LE_CONTROLLER, 0x000b),
  LE_SET_SCAN_ENABLE: opcodeOf(Groups.LE_CONTROLLER, 0x000c),
  LE_CREATE_CONNECTION: opcodeOf(Groups.LE_CONTROLLER, 0x000d),
};

const commandNames = Object.fromEntries(Object.entries(Commands).map(([name, value]) => [value, name]));

const serialize = (data = {}) => {
  const parameters = bytesOf(data.parameters);
  const opcode = data.opcode ?? opcodeOf(data.ogf ?? 0, data.ocf ?? 0);
  const header = Buffer.alloc(HEADER_LENGTH);

  header.writeUInt16LE(opcode);
  header[2] = parameters.length;

  return Buffer.concat([header, parameters]);
};

/**
 * HCI command packet
 * @class
 * @implements {Layer}
 * @property {number} opcode - Command, group and number in one value.
 * @property {number} ogf - Opcode group field.
 * @property {number} ocf - Opcode command field.
 * @property {Buffer} parameters - Command parameters.
 */
class HCICommand {
  name = 'HCICommand';

  constructor(data = {}, { prev = null, allocated = null } = {}) {
    this.prev = prev;
    this.next = null;
    this.decoded = null;
    this.buffer = Buffer.isBuffer(data) ? data : serialize(data);
    this.length = allocated ?? this.buffer.length;
  }

  static osi = OsiModelLayers.DataLink;
  osi = OsiModelLayers.DataLink;

  static toAlloc = (data) => serialize(data).length;

  static docs = {
    title: 'HCI command',
    summary: 'A command from the host to its Bluetooth controller: start scanning, connect, reset. Recognised under HCI as packet type 1.',
    fields: {
      opcode: 'The command, one of hcicommand.*, or build it from ogf and ocf.',
      ogf: 'Opcode group, one of hcicommand.OGF_*.',
      ocf: 'Number of the command inside its group.',
      opcodeName: 'Read only: name of the command when it is a known one.',
      parameterLength: 'Read only: bytes of parameters. Filled automatically.',
      parameters: 'Buffer with the command parameters.',
    },
    constants: [
      {
        title: 'Commands',
        field: 'opcode',
        values: Commands,
      },
      {
        title: 'Opcode groups',
        field: 'ogf',
        values: Object.fromEntries(Object.entries(Groups).map(([name, value]) => [`OGF_${name}`, value])),
      },
    ],
    example: 'wire.packet().hci().hcicommand({ opcode: hcicommand.LE_SET_SCAN_ENABLE, parameters: Buffer.from([1, 0]) })',
  };

  parsed() {
    if (this.decoded === null) {
      const bytes = this.buffer.subarray(0, this.length);
      const opcode = bytes.length >= 2 ? bytes.readUInt16LE(0) : 0;

      this.decoded = {
        opcode,
        opcodeName: commandNames[opcode],
        ogf: opcode >> OCF_BITS,
        ocf: opcode & OCF_MASK,
        parameterLength: bytes[2] ?? 0,
        parameters: bytes.subarray(HEADER_LENGTH),
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

defineDecodedFields(HCICommand, ['opcode', 'opcodeName', 'ogf', 'ocf', 'parameterLength', 'parameters']);

export { HCICommand, Commands, Groups };
export default { HCICommand };
