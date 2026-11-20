import http from 'node:http';
import { Duplex } from 'node:stream';

const SOCKET_NO_OPS = ['setNoDelay', 'setTimeout', 'setKeepAlive', 'ref', 'unref'];

const ownedTransport = (onWrite) => {
  const transport = new Duplex({
    read() {},
    write(chunk, encoding, callback) {
      onWrite(chunk);
      callback();
    },
  });

  for (const name of SOCKET_NO_OPS) {
    transport[name] = () => {
      return transport;
    };
  }

  transport.encrypted = false;

  return transport;
};

const collectBody = (message) => {
  return new Promise((resolve, reject) => {
    const parts = [];

    message.on('data', (part) => {
      parts.push(part);
    });

    message.on('end', () => {
      resolve(Buffer.concat(parts));
    });

    message.on('error', reject);
  });
};

const readableResponse = async (message) => {
  const body = await collectBody(message);

  return {
    httpVersion: message.httpVersion,
    status: message.statusCode,
    reason: message.statusMessage,
    headers: message.headers,
    rawHeaders: message.rawHeaders,
    trailers: message.trailers,
    body,
  };
};

const sendOverHttp = (target, { method = 'GET', headers = {}, body = null, keepAlive = false } = {}) => {
  const outbound = [];
  let notifyOutbound = null;

  const transport = ownedTransport((chunk) => {
    outbound.push(chunk);

    if (notifyOutbound !== null) {
      const resume = notifyOutbound;
      notifyOutbound = null;
      resume();
    }
  });

  const requestHeaders = keepAlive ? headers : { connection: 'close', ...headers };

  const request = http.request(target, {
    method,
    headers: requestHeaders,
    createConnection: () => {
      return transport;
    },
  });

  let sendingFinished = false;

  const response = new Promise((resolve, reject) => {
    request.on('response', (message) => {
      resolve(readableResponse(message));
    });

    request.on('error', reject);
    transport.on('error', reject);
  });

  request.on('finish', () => {
    sendingFinished = true;

    if (notifyOutbound !== null) {
      const resume = notifyOutbound;
      notifyOutbound = null;
      resume();
    }
  });

  if (body !== null) {
    request.end(body);
  }
  else {
    request.end();
  }

  const bytesToSend = async function* () {
    for (;;) {
      while (outbound.length > 0) {
        yield outbound.shift();
      }

      if (sendingFinished) {
        return;
      }

      await new Promise((resume) => {
        notifyOutbound = resume;
      });
    }
  };

  let assembled = null;

  const requestBytes = () => {
    if (assembled === null) {
      assembled = (async () => {
        const chunks = [];

        for await (const chunk of bytesToSend()) {
          chunks.push(chunk);
        }

        return Buffer.concat(chunks);
      })();
    }

    return assembled;
  };

  return {
    transport,
    request,
    bytesToSend,
    requestBytes,
    deliver: (bytes) => {
      transport.push(bytes);
    },
    end: () => {
      transport.push(null);
    },
    destroy: (err) => {
      transport.destroy(err);
    },
    response,
  };
};

export { sendOverHttp, ownedTransport, readableResponse };
export default { sendOverHttp, ownedTransport, readableResponse };
