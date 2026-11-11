const { Duplex } = require('node:stream');

const socket = require('#lib/socket');
const { Packet } = require('#lib/packet');
const { LinkLayerType } = require('#lib/enums');
const { TimeStamp } = require('#lib/timestamp');

const { Socket, SockAddr } = socket;

const PAYLOAD_WITHOUT_HEADERS = LinkLayerType.LINKTYPE_USER0;

const linktypeDeliveredBy = ({ domain, type }) => {
  if (domain === socket.AF_INET && type === socket.SOCK_RAW) {
    return LinkLayerType.LINKTYPE_IPV4;
  }

  return PAYLOAD_WITHOUT_HEADERS;
};

const toSockAddr = (address) => {
  if (address === undefined || address === null) {
    return undefined;
  }

  if (address instanceof SockAddr) {
    return address;
  }

  return new SockAddr(address);
};

const peerFromSockAddr = (address) => {
  if (!address) {
    return null;
  }

  return {
    ip: address.ip,
    port: address.port,
    domain: address.domain,
  };
};

class SocketStream extends Duplex {
  constructor({ domain, type, protocol = 0, bufferSize, bind, connect, to, ...streamOptions } = {}) {
    super({ ...streamOptions, objectMode: true });

    this.domain = domain;
    this.type = type;
    this.protocol = protocol;
    this.iface = { linktype: linktypeDeliveredBy({ domain, type }) };
    this.defaultDestination = toSockAddr(to);
    this.receiving = false;
    this.settleQueuedWrites = null;

    const socketOptions = { domain, type, protocol };

    if (bufferSize !== undefined) {
      socketOptions.bufferSize = bufferSize;
    }

    this.socket = new Socket(socketOptions);

    this.socket.on('data', (buffer, sender) => {
      this.deliver(buffer, sender);
    });

    this.socket.on('drain', () => {
      this.settleWrites(null);
    });

    this.socket.on('error', (message) => {
      this.failWith(new Error(String(message)));
    });

    if (bind) {
      this.bind(bind);
    }

    if (connect) {
      this.connect(connect);
    }
  }

  bind(address) {
    this.socket.bind(toSockAddr(address));
    return this;
  }

  connect(address) {
    this.socket.connect(toSockAddr(address));
    this.connected = true;
    return this;
  }

  deliver(buffer, sender) {
    const packet = new Packet({
      buffer,
      iface: this.iface,
      timestamp: TimeStamp.now('ns'),
      peer: peerFromSockAddr(sender),
    });

    const consumerKeepsUp = this.push(packet);

    if (!consumerKeepsUp) {
      this.socket.pause();
      this.receiving = false;
    }
  }

  settleWrites(err) {
    const settle = this.settleQueuedWrites;

    if (settle === null) {
      return;
    }

    this.settleQueuedWrites = null;
    settle(err);
  }

  failWith(err) {
    if (this.settleQueuedWrites !== null) {
      this.settleWrites(err);
      return;
    }

    this.destroy(err);
  }

  destinationFor(chunk) {
    if (this.connected) {
      return undefined;
    }

    const destination = toSockAddr(chunk.to ?? chunk.peer) ?? this.defaultDestination;

    if (destination === undefined) {
      throw new Error('No destination: connect the socket, pass "to" to the stream, or write { data, to }');
    }

    return destination;
  }

  bytesOf(chunk) {
    if (chunk instanceof Packet) {
      return chunk.buffer;
    }

    if (Buffer.isBuffer(chunk) || ArrayBuffer.isView(chunk)) {
      return chunk;
    }

    if (chunk && (Buffer.isBuffer(chunk.data) || ArrayBuffer.isView(chunk.data))) {
      return chunk.data;
    }

    throw new Error('Invalid argument - expected Packet | Buffer | TypedArray | { data, to }');
  }

  _read() {
    if (!this.receiving) {
      this.receiving = true;
      this.socket.resume();
    }
  }

  _write(chunk, encoding, callback) {
    this._writev([{ chunk }], callback);
  }

  _writev(chunks, callback) {
    let batch;

    try {
      batch = chunks.map(({ chunk }) => [this.bytesOf(chunk), this.destinationFor(chunk)]);
    }
    catch (err) {
      callback(err);
      return;
    }

    this.settleQueuedWrites = callback;

    try {
      this.socket.write(batch);
    }
    catch (err) {
      this.settleWrites(err);
    }
  }

  _destroy(err, callback) {
    this.socket.close();
    callback(err);
  }
}

module.exports = { SocketStream, PAYLOAD_WITHOUT_HEADERS };
