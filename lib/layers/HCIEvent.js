import { OsiModelLayers } from '#lib/layers/osi';
import { bytesOf, readerOver, decodeBySchema, defineDecodedFields } from '#lib/layers/bluetooth';

const HEADER_LENGTH = 2;

const Events = {
  DISCONNECTION_COMPLETE: 0x05,
  COMMAND_COMPLETE: 0x0e,
  COMMAND_STATUS: 0x0f,
  NUMBER_OF_COMPLETED_PACKETS: 0x13,
  LE_META: 0x3e,
};

const Subevents = {
  CONNECTION_COMPLETE: 0x01,
  ADVERTISING_REPORT: 0x02,
  ENHANCED_CONNECTION_COMPLETE: 0x0a,
  EXTENDED_ADVERTISING_REPORT: 0x0d,
};

const AdvertisingData = {
  FLAGS: 0x01,
  INCOMPLETE_16_BIT_SERVICES: 0x02,
  COMPLETE_16_BIT_SERVICES: 0x03,
  SHORTENED_LOCAL_NAME: 0x08,
  COMPLETE_LOCAL_NAME: 0x09,
  TX_POWER_LEVEL: 0x0a,
  SERVICE_DATA: 0x16,
  MANUFACTURER_DATA: 0xff,
};

const eventNames = Object.fromEntries(Object.entries(Events).map(([name, value]) => [value, name]));
const subeventNames = Object.fromEntries(Object.entries(Subevents).map(([name, value]) => [value, name]));

const schemas = {
  [Events.DISCONNECTION_COMPLETE]: [['status', 'uint8'], ['handle', 'uint16'], ['reason', 'uint8']],
  [Events.COMMAND_COMPLETE]: [['allowedCommandPackets', 'uint8'], ['commandOpcode', 'uint16'], ['returnParameters', 'rest']],
  [Events.COMMAND_STATUS]: [['status', 'uint8'], ['allowedCommandPackets', 'uint8'], ['commandOpcode', 'uint16']],
};

const connectionComplete = [
  ['status', 'uint8'],
  ['handle', 'uint16'],
  ['role', 'uint8'],
  ['peerAddressType', 'uint8'],
  ['peerAddress', 'address'],
];

const structuresOf = (data) => {
  const structures = [];
  let position = 0;

  while (position < data.length) {
    const length = data[position];

    if (length === 0 || position + 1 + length > data.length) {
      break;
    }

    structures.push({ type: data[position + 1], value: data.subarray(position + 2, position + 1 + length) });
    position += 1 + length;
  }

  return structures;
};

const nameIn = (structures) => {
  const named = structures.find(({ type }) => type === AdvertisingData.COMPLETE_LOCAL_NAME)
    ?? structures.find(({ type }) => type === AdvertisingData.SHORTENED_LOCAL_NAME);

  return named === undefined ? null : named.value.toString();
};

const describedReport = (report) => {
  const structures = structuresOf(report.data);
  return { ...report, name: nameIn(structures), structures };
};

const legacyReports = (read) => {
  const reports = [];
  const count = read.uint8();

  for (let index = 0; index < count; index++) {
    const eventType = read.uint8();
    const addressType = read.uint8();
    const address = read.address();
    const data = read.take(read.uint8());
    const rssi = read.int8();

    reports.push(describedReport({ eventType, addressType, address, rssi, data }));
  }

  return reports;
};

const extendedReports = (read) => {
  const reports = [];
  const count = read.uint8();

  for (let index = 0; index < count; index++) {
    const eventType = read.uint16();
    const addressType = read.uint8();
    const address = read.address();
    const primaryPhy = read.uint8();
    const secondaryPhy = read.uint8();
    const advertisingSet = read.uint8();
    const txPower = read.int8();
    const rssi = read.int8();
    const periodicInterval = read.uint16();
    const directAddressType = read.uint8();
    const directAddress = read.address();
    const data = read.take(read.uint8());

    reports.push(describedReport({
      eventType,
      addressType,
      address,
      rssi,
      txPower,
      primaryPhy,
      secondaryPhy,
      advertisingSet,
      periodicInterval,
      directAddressType,
      directAddress,
      data,
    }));
  }

  return reports;
};

const decodeReports = (parameters, readReports) => {
  try {
    return { advertisingReports: readReports(readerOver(parameters)), complete: true };
  }
  catch (err) {
    if (err.code !== 'ETRUNCATED') {
      throw err;
    }

    return { advertisingReports: [], complete: false };
  }
};

const decodeMeta = (parameters) => {
  const subevent = parameters[0];
  const body = parameters.subarray(1);
  const described = { subevent, subeventName: subeventNames[subevent] };

  if (subevent === Subevents.ADVERTISING_REPORT) {
    return { ...described, ...decodeReports(body, legacyReports) };
  }

  if (subevent === Subevents.EXTENDED_ADVERTISING_REPORT) {
    return { ...described, ...decodeReports(body, extendedReports) };
  }

  if (subevent === Subevents.CONNECTION_COMPLETE || subevent === Subevents.ENHANCED_CONNECTION_COMPLETE) {
    return { ...described, ...decodeBySchema(connectionComplete, body) };
  }

  return { ...described, complete: true };
};

const serialize = (data = {}) => {
  const parameters = bytesOf(data.parameters);
  return Buffer.concat([Buffer.from([data.code ?? Events.COMMAND_COMPLETE, parameters.length]), parameters]);
};

/**
 * HCI event packet
 * @class
 * @implements {Layer}
 * @property {number} code - Event code.
 * @property {string} codeName - Read only: name of the event code.
 * @property {Buffer} parameters - Event parameters.
 * @property {Object[]} advertisingReports - LE advertising reports: address, rssi, name and data of every advertiser heard.
 */
class HCIEvent {
  name = 'HCIEvent';

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
    title: 'HCI event',
    summary: 'What the Bluetooth controller tells its host: a command finished, a device was heard advertising, a connection opened or closed. Recognised under HCI as packet type 4.',
    fields: {
      code: 'Event code, one of hcievent.*. COMMAND_COMPLETE by default.',
      codeName: 'Read only: name of the event code.',
      parameterLength: 'Read only: bytes of parameters. Filled automatically.',
      parameters: 'Buffer with the event parameters.',
      subevent: 'LE_META: which Low Energy event this is, one of hcievent.SUBEVENT_*.',
      subeventName: 'Read only: name of the subevent.',
      advertisingReports: 'Advertising reports: list of { address, addressType, rssi, name, eventType, data, structures }.',
      status: 'Command status, connection and disconnection events: 0 for success.',
      handle: 'Connection and disconnection events: the connection handle.',
      reason: 'DISCONNECTION_COMPLETE: why the link went down.',
      peerAddress: 'Connection events: address of the other device.',
      commandOpcode: 'COMMAND_COMPLETE and COMMAND_STATUS: the command this answers.',
      returnParameters: 'COMMAND_COMPLETE: what the command returned.',
      complete: 'Read only: every field of the event is inside these bytes.',
    },
    constants: [
      {
        title: 'Event codes',
        field: 'code',
        values: Events,
      },
      {
        title: 'Low Energy subevents',
        field: 'subevent',
        values: Object.fromEntries(Object.entries(Subevents).map(([name, value]) => [`SUBEVENT_${name}`, value])),
      },
      {
        title: 'Advertising data types',
        field: 'advertisingReports[].structures[].type',
        values: Object.fromEntries(Object.entries(AdvertisingData).map(([name, value]) => [`AD_${name}`, value])),
      },
    ],
    example: 'wire.filter().hcievent({ subevent: hcievent.SUBEVENT_ADVERTISING_REPORT })',
  };

  parsed() {
    if (this.decoded === null) {
      const bytes = this.buffer.subarray(0, this.length);
      const code = bytes[0];
      const parameters = bytes.subarray(HEADER_LENGTH);
      const details = code === Events.LE_META ? decodeMeta(parameters) : decodeBySchema(schemas[code] ?? [], parameters);

      this.decoded = {
        code,
        codeName: eventNames[code],
        parameterLength: bytes[1] ?? 0,
        parameters,
        ...details,
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

defineDecodedFields(HCIEvent, [
  'code',
  'codeName',
  'parameterLength',
  'parameters',
  'subevent',
  'subeventName',
  'advertisingReports',
  'status',
  'handle',
  'reason',
  'role',
  'peerAddressType',
  'peerAddress',
  'allowedCommandPackets',
  'commandOpcode',
  'returnParameters',
  'complete',
]);

export { HCIEvent, Events, Subevents, AdvertisingData };
export default { HCIEvent };
