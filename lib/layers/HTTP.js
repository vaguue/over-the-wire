import http from 'node:http';

import { OsiModelLayers } from '#lib/layers/osi';

const LINE_END = '\r\n';
const HEAD_END = Buffer.from('\r\n\r\n');
const RESPONSE_START = Buffer.from('HTTP/1.');
const SPACE = 0x20;
const LONGEST_METHOD = Math.max(...http.METHODS.map(method => method.length));
const METHODS = new Set(http.METHODS);
const DEFAULT_VERSION = '1.1';
const REPEATABLE_HEADER = 'set-cookie';
const EMPTY = Buffer.alloc(0);

const isUppercaseLetter = (byte) => {
  return byte >= 0x41 && byte <= 0x5a;
};

const startsWithMethod = (payload) => {
  if (!isUppercaseLetter(payload[0])) {
    return false;
  }

  const searchEnd = Math.min(payload.length, LONGEST_METHOD + 1);

  for (let position = 1; position < searchEnd; position++) {
    if (payload[position] === SPACE) {
      return METHODS.has(payload.latin1Slice(0, position));
    }
  }

  return false;
};

const startsResponse = (payload) => {
  return payload.compare(RESPONSE_START, 0, RESPONSE_START.length, 0, RESPONSE_START.length) === 0;
};

const headersFrom = (lines) => {
  const headers = {};

  for (const line of lines) {
    const colon = line.indexOf(':');

    if (colon < 1) {
      continue;
    }

    const name = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();

    if (name === REPEATABLE_HEADER) {
      headers[name] = [...(headers[name] ?? []), value];
    }
    else if (headers[name] === undefined) {
      headers[name] = value;
    }
    else {
      headers[name] = `${headers[name]}, ${value}`;
    }
  }

  return headers;
};

const parseHead = (buffer) => {
  const headEnd = buffer.indexOf(HEAD_END);
  const complete = headEnd !== -1;
  const [startLine, ...headerLines] = buffer.latin1Slice(0, complete ? headEnd : buffer.length).split(LINE_END);
  const body = complete ? buffer.subarray(headEnd + HEAD_END.length) : EMPTY;
  const headers = headersFrom(headerLines);

  if (startLine.startsWith('HTTP/')) {
    const [protocol, status, ...reason] = startLine.split(' ');

    return {
      isRequest: false,
      version: protocol.slice('HTTP/'.length),
      status: Number(status),
      reason: reason.join(' '),
      headers,
      body,
      complete,
    };
  }

  const [method, path = '', protocol = ''] = startLine.split(' ');

  return {
    isRequest: true,
    method,
    path,
    version: protocol.slice('HTTP/'.length),
    headers,
    body,
    complete,
  };
};

const bodyBytes = (body) => {
  if (body === undefined || body === null) {
    return EMPTY;
  }

  return Buffer.isBuffer(body) ? body : Buffer.from(body);
};

const serialize = (data = {}) => {
  const version = data.version ?? DEFAULT_VERSION;
  const body = bodyBytes(data.body);
  const isResponse = data.status !== undefined;

  const startLine = isResponse
    ? `HTTP/${version} ${data.status} ${data.reason ?? http.STATUS_CODES[data.status] ?? ''}`.trimEnd()
    : `${data.method ?? 'GET'} ${data.path ?? '/'} HTTP/${version}`;

  const lines = [startLine];
  let lengthIsGiven = false;

  for (const [name, value] of Object.entries(data.headers ?? {})) {
    const lowerName = name.toLowerCase();

    if (lowerName === 'content-length' || lowerName === 'transfer-encoding') {
      lengthIsGiven = true;
    }

    for (const single of Array.isArray(value) ? value : [value]) {
      lines.push(`${name}: ${single}`);
    }
  }

  if (body.length > 0 && !lengthIsGiven) {
    lines.push(`Content-Length: ${body.length}`);
  }

  return Buffer.concat([Buffer.from(`${lines.join(LINE_END)}${LINE_END}${LINE_END}`, 'latin1'), body]);
};

/**
 * HTTP/1.x message head, as far as it fits one TCP segment.
 * @class
 * @implements {Layer}
 * @property {boolean} isRequest - Whether the segment starts a request.
 * @property {boolean} isResponse - Whether the segment starts a response.
 * @property {string} method - Request method.
 * @property {string} path - Request target.
 * @property {string} version - Protocol version, '1.1'.
 * @property {number} status - Response status code.
 * @property {string} reason - Response reason phrase.
 * @property {Object} headers - Header fields by lowercase name.
 * @property {Buffer} body - The part of the body carried by this segment.
 * @property {boolean} complete - Whether the head ends inside this segment.
 */
class HTTP {
  name = 'HTTP';

  constructor(data = {}, { prev = null, allocated = null } = {}) {
    this.prev = prev;
    this.next = null;
    this.head = null;
    this.buffer = Buffer.isBuffer(data) ? data : serialize(data);
    this.length = allocated ?? this.buffer.length;
  }

  static osi = OsiModelLayers.Application;
  osi = OsiModelLayers.Application;

  static toAlloc = (data) => serialize(data).length;

  static recognises(payload) {
    if (payload.length < RESPONSE_START.length) {
      return false;
    }

    return startsResponse(payload) || startsWithMethod(payload);
  }

  static docs = {
    title: 'Hypertext Transfer Protocol',
    summary: 'HTTP/1.x, RFC 9112. The start line and the header fields of a message, as far as they fit one TCP segment. Recognised under TCP on any port by the way the segment starts. Whole exchanges, bodies in several segments, TLS and HTTP/2 are the job of fetch and node:http.',
    fields: {
      method: 'Request: the method, one of http.METHOD_*. GET by default.',
      path: 'Request: the request target. / by default.',
      status: 'Response: the status code. Describing a status makes the message a response.',
      reason: 'Response: the reason phrase. Filled from the status code.',
      version: 'Protocol version. 1.1 by default.',
      headers: 'Header fields. Read by lowercase name, written as given.',
      body: 'Buffer with the part of the body in this segment. Content-Length is filled automatically.',
      isRequest: 'Read only: the segment starts a request.',
      isResponse: 'Read only: the segment starts a response.',
      complete: 'Read only: the header fields end inside this segment.',
    },
    constants: [
      {
        title: 'Ports',
        values: {
          PORT: 80,
          PORT_ALTERNATIVE: 8080,
        },
      },
      {
        title: 'Methods',
        field: 'method',
        values: Object.fromEntries(['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'CONNECT', 'TRACE'].map(method => [`METHOD_${method}`, method])),
      },
      {
        title: 'Status codes',
        field: 'status',
        values: {
          STATUS_OK: 200,
          STATUS_NO_CONTENT: 204,
          STATUS_MOVED_PERMANENTLY: 301,
          STATUS_FOUND: 302,
          STATUS_NOT_MODIFIED: 304,
          STATUS_BAD_REQUEST: 400,
          STATUS_UNAUTHORIZED: 401,
          STATUS_FORBIDDEN: 403,
          STATUS_NOT_FOUND: 404,
          STATUS_TOO_MANY_REQUESTS: 429,
          STATUS_INTERNAL_SERVER_ERROR: 500,
          STATUS_BAD_GATEWAY: 502,
          STATUS_SERVICE_UNAVAILABLE: 503,
        },
      },
    ],
    example: "wire.filter().tcp({ port: http.PORT }).http({ method: http.METHOD_GET })",
  };

  parsed() {
    if (this.head === null) {
      this.head = parseHead(this.buffer.subarray(0, this.length));
    }

    return this.head;
  }

  get isRequest() {
    return this.parsed().isRequest;
  }

  get isResponse() {
    return !this.parsed().isRequest;
  }

  get method() {
    return this.parsed().method;
  }

  get path() {
    return this.parsed().path;
  }

  get version() {
    return this.parsed().version;
  }

  get status() {
    return this.parsed().status;
  }

  get reason() {
    return this.parsed().reason;
  }

  get headers() {
    return this.parsed().headers;
  }

  get body() {
    return this.parsed().body;
  }

  get complete() {
    return this.parsed().complete;
  }

  toObject() {
    const { isRequest, ...fields } = this.parsed();
    return { isRequest, isResponse: !isRequest, ...fields };
  }

  merge(data) {
    serialize(data).copy(this.buffer);
    this.head = null;
  }

  defaults() {}

  nextProto() {
    return null;
  }
}

export { HTTP };
export default { HTTP };
