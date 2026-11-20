import crypto from 'node:crypto';

import { OsiModelLayers } from '#lib/layers/osi';

const PORT = 22;
const IDENTIFICATION_START = Buffer.from('SSH-');
const DEFAULT_IDENTIFICATION = 'SSH-2.0-over_the_wire';
const LINE_FEED = 0x0a;
const LENGTH_FIELD = 4;
const PADDING_LENGTH_FIELD = 1;
const TYPE_FIELD = 1;
const MINIMUM_PADDING = 4;
const BLOCK_SIZE = 8;
const LARGEST_PACKET = 35000;
const COOKIE_LENGTH = 16;
const EMPTY = Buffer.alloc(0);

const MessageTypes = {
  DISCONNECT: 1,
  IGNORE: 2,
  UNIMPLEMENTED: 3,
  DEBUG: 4,
  SERVICE_REQUEST: 5,
  SERVICE_ACCEPT: 6,
  EXT_INFO: 7,
  KEXINIT: 20,
  NEWKEYS: 21,
  KEX_ECDH_INIT: 30,
  KEX_ECDH_REPLY: 31,
  USERAUTH_REQUEST: 50,
  USERAUTH_FAILURE: 51,
  USERAUTH_SUCCESS: 52,
  USERAUTH_BANNER: 53,
  GLOBAL_REQUEST: 80,
  REQUEST_SUCCESS: 81,
  REQUEST_FAILURE: 82,
  CHANNEL_OPEN: 90,
  CHANNEL_OPEN_CONFIRMATION: 91,
  CHANNEL_OPEN_FAILURE: 92,
  CHANNEL_WINDOW_ADJUST: 93,
  CHANNEL_DATA: 94,
  CHANNEL_EXTENDED_DATA: 95,
  CHANNEL_EOF: 96,
  CHANNEL_CLOSE: 97,
  CHANNEL_REQUEST: 98,
  CHANNEL_SUCCESS: 99,
  CHANNEL_FAILURE: 100,
};

const DisconnectReasons = {
  HOST_NOT_ALLOWED_TO_CONNECT: 1,
  PROTOCOL_ERROR: 2,
  KEY_EXCHANGE_FAILED: 3,
  MAC_ERROR: 5,
  SERVICE_NOT_AVAILABLE: 7,
  PROTOCOL_VERSION_NOT_SUPPORTED: 8,
  HOST_KEY_NOT_VERIFIABLE: 9,
  CONNECTION_LOST: 10,
  BY_APPLICATION: 11,
  TOO_MANY_CONNECTIONS: 12,
  AUTH_CANCELLED_BY_USER: 13,
  NO_MORE_AUTH_METHODS_AVAILABLE: 14,
};

const typeNames = Object.fromEntries(Object.entries(MessageTypes).map(([name, value]) => [value, name]));

const KEXINIT_LISTS = [
  'kexAlgorithms',
  'serverHostKeyAlgorithms',
  'encryptionClientToServer',
  'encryptionServerToClient',
  'macClientToServer',
  'macServerToClient',
  'compressionClientToServer',
  'compressionServerToClient',
  'languagesClientToServer',
  'languagesServerToClient',
];

const schemas = {
  [MessageTypes.DISCONNECT]: [['reason', 'uint32'], ['description', 'text'], ['language', 'text']],
  [MessageTypes.IGNORE]: [['data', 'string']],
  [MessageTypes.UNIMPLEMENTED]: [['sequence', 'uint32']],
  [MessageTypes.DEBUG]: [['alwaysDisplay', 'boolean'], ['message', 'text'], ['language', 'text']],
  [MessageTypes.SERVICE_REQUEST]: [['service', 'text']],
  [MessageTypes.SERVICE_ACCEPT]: [['service', 'text']],
  [MessageTypes.KEXINIT]: [
    ['cookie', 'cookie'],
    ...KEXINIT_LISTS.map(name => [name, 'nameList']),
    ['firstKexPacketFollows', 'boolean'],
    ['reserved', 'uint32'],
  ],
  [MessageTypes.NEWKEYS]: [],
  [MessageTypes.KEX_ECDH_INIT]: [['publicKey', 'string']],
  [MessageTypes.KEX_ECDH_REPLY]: [['hostKey', 'string'], ['publicKey', 'string'], ['signature', 'string']],
};

const UNKNOWN_MESSAGE = [['data', 'rest']];

const uint32 = (value) => {
  const encoded = Buffer.alloc(4);
  encoded.writeUInt32BE(value >>> 0);
  return encoded;
};

const string = (value) => {
  const bytes = Buffer.isBuffer(value) ? value : Buffer.from(value ?? '');
  return Buffer.concat([uint32(bytes.length), bytes]);
};

const nameList = (names) => {
  return string((names ?? []).join(','));
};

const mpint = (magnitude) => {
  let firstSignificant = 0;

  while (firstSignificant < magnitude.length && magnitude[firstSignificant] === 0) {
    firstSignificant++;
  }

  const significant = magnitude.subarray(firstSignificant);
  const needsSignByte = significant.length > 0 && (significant[0] & 0x80) !== 0;

  return string(needsSignByte ? Buffer.concat([Buffer.alloc(1), significant]) : significant);
};

const encoders = {
  uint32: (value) => uint32(value ?? 0),
  boolean: (value) => Buffer.from([value ? 1 : 0]),
  string: (value) => string(value ?? EMPTY),
  text: (value) => string(value ?? ''),
  nameList: (value) => nameList(value),
  cookie: (value) => value ?? crypto.randomBytes(COOKIE_LENGTH),
  rest: (value) => value ?? EMPTY,
};

const truncated = () => {
  const err = new Error('The SSH message ends before its fields do');
  err.code = 'ETRUNCATED';
  return err;
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

  const decoders = {
    uint32: () => take(4).readUInt32BE(0),
    boolean: () => take(1)[0] !== 0,
    string: () => take(decoders.uint32()),
    text: () => decoders.string().toString(),
    nameList: () => {
      const names = decoders.text();
      return names.length === 0 ? [] : names.split(',');
    },
    cookie: () => take(COOKIE_LENGTH),
    rest: () => take(bytes.length - position),
  };

  return decoders;
};

const paddingLengthFor = (payloadLength, blockSize) => {
  const unpadded = LENGTH_FIELD + PADDING_LENGTH_FIELD + payloadLength;
  const toBlockBoundary = (blockSize - (unpadded % blockSize)) % blockSize;

  return toBlockBoundary < MINIMUM_PADDING ? toBlockBoundary + blockSize : toBlockBoundary;
};

const identificationFrom = ({ identification, softwareVersion, protocolVersion = '2.0', comments }) => {
  if (identification !== undefined) {
    return identification;
  }

  if (softwareVersion === undefined) {
    return DEFAULT_IDENTIFICATION;
  }

  return `SSH-${protocolVersion}-${softwareVersion}${comments ? ` ${comments}` : ''}`;
};

const serialize = (data = {}) => {
  if (data.type === undefined) {
    return Buffer.from(`${identificationFrom(data)}\r\n`, 'latin1');
  }

  const schema = schemas[data.type] ?? UNKNOWN_MESSAGE;

  const payload = Buffer.concat([
    Buffer.from([data.type]),
    ...schema.map(([name, kind]) => encoders[kind](data[name])),
  ]);

  const padding = data.padding ?? crypto.randomBytes(paddingLengthFor(payload.length, data.blockSize ?? BLOCK_SIZE));
  const header = Buffer.alloc(LENGTH_FIELD + PADDING_LENGTH_FIELD);

  header.writeUInt32BE(PADDING_LENGTH_FIELD + payload.length + padding.length);
  header[LENGTH_FIELD] = padding.length;

  return Buffer.concat([header, payload, padding]);
};

const startsIdentification = (bytes) => {
  return bytes.length >= IDENTIFICATION_START.length
    && bytes.compare(IDENTIFICATION_START, 0, IDENTIFICATION_START.length, 0, IDENTIFICATION_START.length) === 0;
};

const looksLikeAPlainPacket = (bytes) => {
  if (bytes.length < LENGTH_FIELD + PADDING_LENGTH_FIELD + TYPE_FIELD) {
    return false;
  }

  const packetLength = bytes.readUInt32BE(0);
  const paddingLength = bytes[LENGTH_FIELD];

  return packetLength <= LARGEST_PACKET
    && (packetLength + LENGTH_FIELD) % BLOCK_SIZE === 0
    && paddingLength >= MINIMUM_PADDING
    && paddingLength + PADDING_LENGTH_FIELD + TYPE_FIELD <= packetLength
    && typeNames[bytes[LENGTH_FIELD + PADDING_LENGTH_FIELD]] !== undefined;
};

const wholeMessageLength = (bytes) => {
  if (startsIdentification(bytes)) {
    const lineEnd = bytes.indexOf(LINE_FEED);
    return lineEnd === -1 ? null : lineEnd + 1;
  }

  if (bytes.length < LENGTH_FIELD) {
    return null;
  }

  const length = LENGTH_FIELD + bytes.readUInt32BE(0);
  return length <= bytes.length ? length : null;
};

const lengthInside = (bytes) => {
  if (startsIdentification(bytes) || looksLikeAPlainPacket(bytes)) {
    return wholeMessageLength(bytes) ?? bytes.length;
  }

  return bytes.length;
};

const decodeIdentification = (bytes) => {
  const identification = bytes.latin1Slice(0, bytes.length).replace(/\r?\n$/, '');
  const [, protocolVersion = '', softwareVersion = '', comments = ''] = identification.match(/^SSH-([^-]*)-(\S*)(?: (.*))?$/) ?? [];

  return {
    isIdentification: true,
    encrypted: false,
    complete: bytes.includes(LINE_FEED),
    identification,
    protocolVersion,
    softwareVersion,
    comments,
  };
};

const decodeFields = (type, body) => {
  const read = readerOver(body);
  const fields = {};

  try {
    for (const [name, kind] of schemas[type] ?? UNKNOWN_MESSAGE) {
      fields[name] = read[kind]();
    }
  }
  catch (err) {
    if (err.code !== 'ETRUNCATED') {
      throw err;
    }

    return { fields, complete: false };
  }

  return { fields, complete: true };
};

const decodePacket = (bytes) => {
  const packetLength = bytes.readUInt32BE(0);
  const paddingLength = bytes[LENGTH_FIELD];
  const payloadStart = LENGTH_FIELD + PADDING_LENGTH_FIELD;
  const payloadEnd = LENGTH_FIELD + packetLength - paddingLength;
  const payload = bytes.subarray(payloadStart, Math.min(payloadEnd, bytes.length));
  const type = payload[0];
  const { fields, complete } = decodeFields(type, payload.subarray(TYPE_FIELD));

  return {
    isIdentification: false,
    encrypted: false,
    complete: complete && bytes.length >= LENGTH_FIELD + packetLength,
    packetLength,
    paddingLength,
    type,
    typeName: typeNames[type],
    payload,
    ...fields,
  };
};

const decode = (bytes) => {
  if (startsIdentification(bytes)) {
    return decodeIdentification(bytes);
  }

  if (looksLikeAPlainPacket(bytes)) {
    return decodePacket(bytes);
  }

  return {
    isIdentification: false,
    encrypted: true,
    complete: true,
    data: bytes,
  };
};

const decodedFields = [
  'isIdentification',
  'encrypted',
  'complete',
  'identification',
  'protocolVersion',
  'softwareVersion',
  'comments',
  'packetLength',
  'paddingLength',
  'type',
  'typeName',
  'payload',
  'cookie',
  ...KEXINIT_LISTS,
  'firstKexPacketFollows',
  'reserved',
  'publicKey',
  'hostKey',
  'signature',
  'reason',
  'description',
  'language',
  'service',
  'sequence',
  'alwaysDisplay',
  'message',
  'data',
];

/**
 * SSH transport layer message
 * @class
 * @implements {Layer}
 * @property {boolean} isIdentification - Whether this is the identification line.
 * @property {string} identification - The identification line without its line end.
 * @property {string} softwareVersion - Software part of the identification line.
 * @property {number} type - Message number of a binary packet.
 * @property {string} typeName - Name of the message number.
 * @property {Buffer} payload - Message number and fields, the bytes that enter the exchange hash.
 * @property {boolean} encrypted - Whether the bytes are not a readable packet.
 * @property {boolean} complete - Whether the whole message is inside these bytes.
 * @property {string[]} kexAlgorithms - KEXINIT: key exchange algorithms.
 * @property {string[]} serverHostKeyAlgorithms - KEXINIT: host key algorithms.
 * @property {Buffer} publicKey - Key exchange: ephemeral public key.
 * @property {Buffer} hostKey - Key exchange reply: host key blob.
 * @property {Buffer} signature - Key exchange reply: signature over the exchange hash.
 */
class SSH {
  name = 'SSH';

  constructor(data = {}, { prev = null, allocated = null } = {}) {
    this.prev = prev;
    this.next = null;
    this.decoded = null;
    this.buffer = Buffer.isBuffer(data) ? data : serialize(data);
    this.length = allocated ?? lengthInside(this.buffer);
  }

  static osi = OsiModelLayers.Application;
  osi = OsiModelLayers.Application;

  static toAlloc = (data) => serialize(data).length;

  static string = string;
  static nameList = nameList;
  static mpint = mpint;
  static uint32 = uint32;

  static recognises(payload, tcp) {
    return startsIdentification(payload) || tcp?.src === PORT || tcp?.dst === PORT;
  }

  static split(stream) {
    const messages = [];
    let rest = stream;

    for (;;) {
      const length = rest.length === 0 ? null : wholeMessageLength(rest);

      if (length === null) {
        return { messages, rest };
      }

      messages.push(new SSH(rest.subarray(0, length), { allocated: length }));
      rest = rest.subarray(length);
    }
  }

  static docs = {
    title: 'Secure Shell',
    summary: 'SSH transport layer, RFC 4253. The identification line and the binary packets of the key exchange, one message per layer. Recognised under TCP on port 22 and wherever a segment starts with an identification line. After NEWKEYS the packets are encrypted and read as opaque bytes.',
    fields: {
      identification: 'Identification line, SSH-2.0-over_the_wire by default. Describing no type makes the message an identification line.',
      softwareVersion: 'Identification line: the software part, as an alternative to writing the whole line.',
      type: 'Binary packet: the message number, one of ssh.MSG_*.',
      typeName: 'Read only: name of the message number.',
      payload: 'Read only: message number and fields. These are the bytes that enter the exchange hash.',
      packetLength: 'Read only: length of the packet after the length field. Filled automatically.',
      paddingLength: 'Read only: length of the padding. Filled automatically.',
      padding: 'Padding bytes. Random by default.',
      cookie: 'KEXINIT: 16 random bytes. Random by default.',
      kexAlgorithms: 'KEXINIT: list of key exchange algorithm names.',
      serverHostKeyAlgorithms: 'KEXINIT: list of host key algorithm names.',
      encryptionClientToServer: 'KEXINIT: list of cipher names, with encryptionServerToClient for the other direction.',
      macClientToServer: 'KEXINIT: list of MAC names, with macServerToClient for the other direction.',
      compressionClientToServer: 'KEXINIT: list of compression names, with compressionServerToClient for the other direction.',
      publicKey: 'KEX_ECDH_INIT and KEX_ECDH_REPLY: the ephemeral public key.',
      hostKey: 'KEX_ECDH_REPLY: the host key blob.',
      signature: 'KEX_ECDH_REPLY: the signature over the exchange hash.',
      reason: 'DISCONNECT: one of ssh.DISCONNECT_*.',
      description: 'DISCONNECT: text for a person.',
      service: 'SERVICE_REQUEST and SERVICE_ACCEPT: the service name.',
      data: 'Any other message: the bytes after the message number. Encrypted packets: all the bytes.',
      encrypted: 'Read only: the bytes are not a readable packet.',
      complete: 'Read only: the whole message is inside these bytes.',
    },
    constants: [
      {
        title: 'Ports',
        values: {
          PORT,
        },
      },
      {
        title: 'Message numbers',
        field: 'type',
        values: Object.fromEntries(Object.entries(MessageTypes).map(([name, value]) => [`MSG_${name}`, value])),
      },
      {
        title: 'Disconnect reasons',
        field: 'reason',
        values: Object.fromEntries(Object.entries(DisconnectReasons).map(([name, value]) => [`DISCONNECT_${name}`, value])),
      },
    ],
    example: "wire.packet().ipv4({ dst: '192.168.1.1' }).tcp({ src: 40000, dst: ssh.PORT, flags: { psh: 1, ack: 1 } }).ssh({ softwareVersion: 'probe_1.0' })",
  };

  parsed() {
    if (this.decoded === null) {
      this.decoded = decode(this.buffer.subarray(0, this.length));
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

  nextProto(layers) {
    const following = this.buffer.subarray(this.length);
    return following.length > 0 ? new layers.SSH(following, { prev: this }) : null;
  }
}

for (const field of decodedFields) {
  Object.defineProperty(SSH.prototype, field, {
    configurable: true,
    get() {
      return this.parsed()[field];
    },
  });
}

export { SSH, MessageTypes, DisconnectReasons };
export default { SSH };
