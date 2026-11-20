import crypto from 'node:crypto';

import { OsiModelLayers } from '#lib/layers/osi';
import { makeLayer, attach } from '#lib/layers/define';

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
  USERAUTH_PK_OK: 60,
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

const authenticationBy = {
  password: [['changesPassword', 'boolean'], ['password', 'text']],
  publickey: [['hasSignature', 'boolean'], ['algorithm', 'text'], ['publicKey', 'string'], ['signature', 'optionalString']],
};

const channelRequests = {
  exec: [['command', 'text']],
  subsystem: [['subsystem', 'text']],
  env: [['variable', 'text'], ['value', 'text']],
  'exit-status': [['exitStatus', 'uint32']],
  'exit-signal': [['signal', 'text'], ['coreDumped', 'boolean'], ['message', 'text'], ['language', 'text']],
};

const REST = [['data', 'rest']];

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
  [MessageTypes.USERAUTH_REQUEST]: [['user', 'text'], ['service', 'text'], ['method', 'text'], ['method', authenticationBy]],
  [MessageTypes.USERAUTH_FAILURE]: [['methods', 'nameList'], ['partialSuccess', 'boolean']],
  [MessageTypes.USERAUTH_SUCCESS]: [],
  [MessageTypes.USERAUTH_BANNER]: [['message', 'text'], ['language', 'text']],
  [MessageTypes.USERAUTH_PK_OK]: [['algorithm', 'text'], ['publicKey', 'string']],
  [MessageTypes.GLOBAL_REQUEST]: [['request', 'text'], ['wantReply', 'boolean'], ['data', 'rest']],
  [MessageTypes.CHANNEL_OPEN]: [['channelType', 'text'], ['senderChannel', 'uint32'], ['windowSize', 'uint32'], ['maximumPacketSize', 'uint32'], ['data', 'rest']],
  [MessageTypes.CHANNEL_OPEN_CONFIRMATION]: [['recipientChannel', 'uint32'], ['senderChannel', 'uint32'], ['windowSize', 'uint32'], ['maximumPacketSize', 'uint32'], ['data', 'rest']],
  [MessageTypes.CHANNEL_OPEN_FAILURE]: [['recipientChannel', 'uint32'], ['reason', 'uint32'], ['description', 'text'], ['language', 'text']],
  [MessageTypes.CHANNEL_WINDOW_ADJUST]: [['recipientChannel', 'uint32'], ['bytesToAdd', 'uint32']],
  [MessageTypes.CHANNEL_DATA]: [['recipientChannel', 'uint32'], ['data', 'string']],
  [MessageTypes.CHANNEL_EXTENDED_DATA]: [['recipientChannel', 'uint32'], ['dataType', 'uint32'], ['data', 'string']],
  [MessageTypes.CHANNEL_EOF]: [['recipientChannel', 'uint32']],
  [MessageTypes.CHANNEL_CLOSE]: [['recipientChannel', 'uint32']],
  [MessageTypes.CHANNEL_REQUEST]: [['recipientChannel', 'uint32'], ['request', 'text'], ['wantReply', 'boolean'], ['request', channelRequests]],
  [MessageTypes.CHANNEL_SUCCESS]: [['recipientChannel', 'uint32']],
  [MessageTypes.CHANNEL_FAILURE]: [['recipientChannel', 'uint32']],
};

const fieldsOf = function* (type, valueOf) {
  for (const [name, kind] of schemas[type] ?? REST) {
    if (typeof kind == 'string') {
      yield [name, kind];
    }
    else {
      yield* kind[valueOf(name)] ?? REST;
    }
  }
};

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
  optionalString: (value) => value === undefined ? EMPTY : string(value),
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
    optionalString: () => position < bytes.length ? decoders.string() : undefined,
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

const paddingLengthFor = (payloadLength, blockSize, blockCoversLength) => {
  const unpadded = (blockCoversLength ? LENGTH_FIELD : 0) + PADDING_LENGTH_FIELD + payloadLength;
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

  const payload = Buffer.concat([
    Buffer.from([data.type]),
    ...[...fieldsOf(data.type, name => data[name])].map(([name, kind]) => encoders[kind](data[name])),
  ]);

  const padding = data.padding ?? crypto.randomBytes(paddingLengthFor(payload.length, data.blockSize ?? BLOCK_SIZE, data.blockCoversLength ?? true));
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
    && ((packetLength + LENGTH_FIELD) % BLOCK_SIZE === 0 || packetLength % BLOCK_SIZE === 0)
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
    for (const [name, kind] of fieldsOf(type, name => fields[name])) {
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

const messageFields = [
  'isIdentification',
  'encrypted',
  'complete',
  'identification',
  'protocolVersion',
  'softwareVersion',
  'comments',
  'typeName',
  'payload',
  ...new Set(Object.values(schemas).flat().flatMap(([name, kind]) => {
    return typeof kind == 'string' ? [name] : Object.values(kind).flat().map(([variantField]) => variantField);
  })),
  'data',
];

const stringsOf = (blob) => {
  const strings = [];
  let rest = blob;

  while (rest.length >= LENGTH_FIELD) {
    const end = LENGTH_FIELD + rest.readUInt32BE(0);
    strings.push(rest.subarray(LENGTH_FIELD, end));
    rest = rest.subarray(end);
  }

  return strings;
};

/**
 * SSH transport layer message
 * @class
 * @implements {Layer}
 * @property {boolean} isIdentification - Whether this is the identification line.
 * @property {string} identification - The identification line without its line end.
 * @property {string} softwareVersion - Software part of the identification line.
 * @property {number} packetLength - Length of a binary packet after the length field.
 * @property {number} paddingLength - Length of the padding of a binary packet.
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
const SSH = (() => {
  const { Layer, proto } = makeLayer('SSH', `
    //@NE Secure Shell, RFC 4253 and 4254. The identification line and the binary packets of the transport: key exchange, authentication, channels. One message per layer. Recognised under TCP on port 22. On the wire the packets after NEWKEYS are encrypted and read as opaque bytes; a client that decrypts them reads them with the same layer.
    struct SSHHeader {
      // Binary packet: length of the packet after this field. Filled automatically.
      uint32_t packetLength;
      // Binary packet: length of the padding. Filled automatically.
      uint8_t paddingLength;
      // Binary packet: the message number, one of ssh.MSG_*. Describing no type makes the message an identification line.
      uint8_t type;
    } __attribute__(packed);
  `, {
    osi: OsiModelLayers.Application,
    length: ($) => lengthInside($._buf),
    toAlloc: (data) => serialize(data).length,
  });

  const { packetLength, paddingLength, type } = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(proto));

  const onlyInAPlainPacket = (field) => {
    attach.virtualField(proto, field.name, {
      get() {
        return looksLikeAPlainPacket(this._buf) ? field.descriptor.get.call(this) : undefined;
      },
      set(value) {
        field.descriptor.set.call(this, value);
      },
    });
  };

  onlyInAPlainPacket({ name: 'packetLength', descriptor: packetLength });
  onlyInAPlainPacket({ name: 'paddingLength', descriptor: paddingLength });
  onlyInAPlainPacket({ name: 'type', descriptor: type });

  for (const field of messageFields) {
    attach.virtualField(proto, field, {
      get() {
        return decode(this._buf.subarray(0, this.length))[field];
      },
    });
  }

  proto.merge = function(data) {
    serialize(data).copy(this._buf);
  };

  proto.toObject = function() {
    return decode(this._buf.subarray(0, this.length));
  };

  proto.nextProto = function nextProto(layers) {
    const following = this._buf.subarray(this.length);
    return following.length > 0 ? new layers.SSH(following, { ...this.opts, prev: this }) : null;
  };

  Layer.string = string;
  Layer.nameList = nameList;
  Layer.mpint = mpint;
  Layer.uint32 = uint32;
  Layer.strings = stringsOf;

  Layer.take = (stream, { trailerLength = 0 } = {}) => {
    const length = stream.length === 0 ? null : wholeMessageLength(stream);
    const isIdentification = length !== null && startsIdentification(stream);
    const end = length === null || isIdentification ? length : length + trailerLength;

    if (end === null || end > stream.length) {
      return { message: null, trailer: EMPTY, rest: stream };
    }

    return {
      message: new Layer(stream.subarray(0, length), { allocated: length }),
      trailer: stream.subarray(length, end),
      rest: stream.subarray(end),
    };
  };

  Layer.split = (stream) => {
    const messages = [];
    let rest = stream;

    for (;;) {
      const taken = Layer.take(rest);

      if (taken.message === null) {
        return { messages, rest };
      }

      messages.push(taken.message);
      rest = taken.rest;
    }
  };

  return Layer;
})();

attach.docs(SSH, {
  title: 'Secure Shell',
  fields: {
    identification: 'Identification line, SSH-2.0-over_the_wire by default.',
    softwareVersion: 'Identification line: the software part, as an alternative to writing the whole line.',
    typeName: 'Read only: name of the message number.',
    payload: 'Read only: message number and fields. These are the bytes that enter the exchange hash and a signature.',
    padding: 'Padding bytes. Random by default.',
    blockSize: 'Write only: the padding fills the packet up to a multiple of this. 8 by default.',
    blockCoversLength: 'Write only: whether the length field counts towards the block, true by default. False for the AEAD ciphers, which leave the length in the clear.',
    cookie: 'KEXINIT: 16 random bytes. Random by default.',
    kexAlgorithms: 'KEXINIT: list of key exchange algorithm names.',
    serverHostKeyAlgorithms: 'KEXINIT: list of host key algorithm names.',
    encryptionClientToServer: 'KEXINIT: list of cipher names, with encryptionServerToClient for the other direction.',
    macClientToServer: 'KEXINIT: list of MAC names, with macServerToClient for the other direction.',
    compressionClientToServer: 'KEXINIT: list of compression names, with compressionServerToClient for the other direction.',
    publicKey: 'KEX_ECDH_INIT and KEX_ECDH_REPLY: the ephemeral public key. USERAUTH_REQUEST by publickey: the key blob of the user.',
    hostKey: 'KEX_ECDH_REPLY: the host key blob.',
    signature: 'KEX_ECDH_REPLY: the signature over the exchange hash. USERAUTH_REQUEST by publickey: the signature of the user, left out to ask whether the key is acceptable.',
    reason: 'DISCONNECT: one of ssh.DISCONNECT_*.',
    description: 'DISCONNECT: text for a person.',
    service: 'SERVICE_REQUEST, SERVICE_ACCEPT and USERAUTH_REQUEST: the service name.',
    user: 'USERAUTH_REQUEST: the user name.',
    method: 'USERAUTH_REQUEST: none, password or publickey. The fields after it follow the method.',
    password: 'USERAUTH_REQUEST by password.',
    methods: 'USERAUTH_FAILURE: the methods that can continue.',
    channelType: 'CHANNEL_OPEN: session for a command or a shell.',
    senderChannel: 'CHANNEL_OPEN and its confirmation: the channel number of the sender.',
    recipientChannel: 'Every other channel message: the channel number of the receiver.',
    windowSize: 'CHANNEL_OPEN and its confirmation: how many bytes of data the sender accepts before a CHANNEL_WINDOW_ADJUST.',
    maximumPacketSize: 'CHANNEL_OPEN and its confirmation: the largest data message the sender accepts.',
    request: 'CHANNEL_REQUEST and GLOBAL_REQUEST: the request name. exec, exit-status and others bring their own fields.',
    wantReply: 'CHANNEL_REQUEST and GLOBAL_REQUEST: whether a success or failure message is expected.',
    command: 'CHANNEL_REQUEST exec: the command line.',
    exitStatus: 'CHANNEL_REQUEST exit-status: the exit code of the command.',
    data: 'CHANNEL_DATA: bytes of the channel. A message without a description here: the bytes after the message number. Encrypted packets: all the bytes.',
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
    {
      title: 'Data types of CHANNEL_EXTENDED_DATA',
      field: 'dataType',
      values: {
        EXTENDED_DATA_STDERR: 1,
      },
    },
  ],
  example: "wire.packet().ipv4({ dst: '192.168.1.1' }).tcp({ src: 40000, dst: ssh.PORT, flags: { psh: 1, ack: 1 } }).ssh({ softwareVersion: 'probe_1.0' })",
});

export { SSH, MessageTypes, DisconnectReasons };
export default { SSH };
