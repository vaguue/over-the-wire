import { strict as assert } from 'node:assert';
import test from 'node:test';
import net from 'node:net';
import nodeHttp from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import otw, { Packet, FilterBuilder, http, tcp } from '#lib/index';
import { HTTP } from '#lib/layers/HTTP';

const STARTUP_CAPTURE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data', 'startup.pcapng');

const ETHERNET = { linktype: 1 };

const segmentCarrying = (description, ports = { src: 40000, dst: http.PORT }) => {
  const built = new Packet({ iface: ETHERNET })
    .ethernet()
    .ipv4({ src: '10.0.0.1', dst: '10.0.0.2' })
    .tcp({ ...ports, flags: { psh: 1, ack: 1 } })
    .http(description);

  return new Packet({ buffer: built.buffer, iface: ETHERNET });
};

test('a request is built and read back', () => {
  const parsed = segmentCarrying({
    method: http.METHOD_GET,
    path: '/index.html?q=1',
    headers: { Host: 'example.com', 'User-Agent': 'over-the-wire' },
  });

  assert.deepEqual(Object.keys(parsed.layers), ['Ethernet', 'IPv4', 'TCP', 'HTTP']);

  const request = parsed.layers.HTTP;

  assert.equal(request.buffer.toString(), 'GET /index.html?q=1 HTTP/1.1\r\nHost: example.com\r\nUser-Agent: over-the-wire\r\n\r\n');
  assert.equal(request.isRequest, true);
  assert.equal(request.isResponse, false);
  assert.equal(request.method, 'GET');
  assert.equal(request.path, '/index.html?q=1');
  assert.equal(request.version, '1.1');
  assert.deepEqual(request.headers, { host: 'example.com', 'user-agent': 'over-the-wire' });
  assert.equal(request.body.length, 0);
  assert.equal(request.complete, true);
});

test('a described status makes a response, with its reason and the length of its body', () => {
  const parsed = segmentCarrying({
    status: http.STATUS_NOT_FOUND,
    headers: { 'Content-Type': 'text/plain', 'Set-Cookie': ['a=1', 'b=2'], Via: '1.1 first' },
    body: 'nothing here',
  }, { src: http.PORT, dst: 40000 });

  const response = parsed.layers.HTTP;

  assert.deepEqual(response.toObject(), {
    isRequest: false,
    isResponse: true,
    version: '1.1',
    status: 404,
    reason: 'Not Found',
    headers: {
      'content-type': 'text/plain',
      'set-cookie': ['a=1', 'b=2'],
      via: '1.1 first',
      'content-length': '12',
    },
    body: Buffer.from('nothing here'),
    complete: true,
  });
});

test('defaults: GET / HTTP/1.1, and a given length is kept', () => {
  assert.equal(new HTTP().buffer.toString(), 'GET / HTTP/1.1\r\n\r\n');
  assert.equal(
    new HTTP({ method: 'POST', headers: { 'Content-Length': 3 }, body: 'abcdef' }).buffer.toString(),
    'POST / HTTP/1.1\r\nContent-Length: 3\r\n\r\nabcdef',
  );
});

test('repeated header fields are joined, a head cut by the segment is told apart', () => {
  const whole = Buffer.from('HTTP/1.1 200 OK\r\nVary: Accept\r\nVary: Origin\r\nX-Long: value\r\n\r\nbody');
  const cut = whole.subarray(0, whole.indexOf('X-Long') + 8);

  assert.deepEqual(new HTTP(whole).headers, { vary: 'Accept, Origin', 'x-long': 'value' });
  assert.equal(new HTTP(whole).body.toString(), 'body');

  const partial = new HTTP(cut);

  assert.equal(partial.complete, false);
  assert.equal(partial.status, 200);
  assert.equal(partial.headers.vary, 'Accept, Origin');
  assert.equal(partial.body.length, 0);
});

test('it is recognised by content on any port, and other payloads stay payloads', () => {
  const onAnotherPort = segmentCarrying({ method: 'DELETE', path: '/thing' }, { src: 51000, dst: 3000 });
  assert.equal(onAnotherPort.layers.HTTP.method, 'DELETE');

  const notHttp = new Packet({ iface: ETHERNET })
    .ethernet()
    .ipv4({ src: '10.0.0.1', dst: '10.0.0.2' })
    .tcp({ src: 40000, dst: http.PORT })
    .payload({ data: Buffer.from('GETTING something that is not a request') });

  const withoutData = new Packet({ iface: ETHERNET })
    .ethernet()
    .ipv4({ src: '10.0.0.1', dst: '10.0.0.2' })
    .tcp({ src: 40000, dst: http.PORT, flags: { syn: 1 } });

  assert.deepEqual(Object.keys(new Packet({ buffer: notHttp.buffer, iface: ETHERNET }).layers), ['Ethernet', 'IPv4', 'TCP', 'Payload']);
  assert.deepEqual(Object.keys(new Packet({ buffer: withoutData.buffer, iface: ETHERNET }).layers), ['Ethernet', 'IPv4', 'TCP']);

  assert.equal(HTTP.recognises(Buffer.from('HTTP/1.0 301 Moved')), true);
  assert.equal(HTTP.recognises(Buffer.from('SSH-2.0-OpenSSH_9.6')), false);
  assert.equal(HTTP.recognises(Buffer.from('GE')), false);
});

test('filters match requests and responses in the process', () => {
  const request = segmentCarrying({ method: 'POST', path: '/login', headers: { Host: 'example.com' } });
  const failure = segmentCarrying({ status: 503 }, { src: http.PORT, dst: 40000 });

  const posts = new FilterBuilder().tcp({ port: http.PORT }).http({ method: http.METHOD_POST });
  const serverErrors = new FilterBuilder().http({ status: { gte: 500 } });
  const toExample = new FilterBuilder().http({ headers: ({ host }) => host === 'example.com' });

  assert.ok(posts.matches(request));
  assert.ok(!posts.matches(failure));
  assert.ok(serverErrors.matches(failure));
  assert.ok(!serverErrors.matches(request));
  assert.ok(toExample.matches(request));
  assert.equal(posts.expressible, false);
});

test('the namespace and the builders know the layer', () => {
  assert.equal(http.PORT, 80);
  assert.equal(http.METHOD_GET, 'GET');
  assert.equal(http.STATUS_OK, 200);
  assert.equal(otw.http, http);
  assert.equal(tcp.PORT_HTTP, http.PORT);

  const described = otw().packet().ipv4({ src: '10.0.0.1', dst: '10.0.0.2' }).tcp({ src: 1, dst: 80 }).http({ path: '/a' });

  assert.equal(described.layers.HTTP.path, '/a');
});

test('Node understands the requests built here, and its responses are read here', async () => {
  const seen = [];

  const server = nodeHttp.createServer((request, response) => {
    seen.push({ method: request.method, url: request.url, agent: request.headers['user-agent'] });
    response.writeHead(200, { 'Content-Type': 'text/plain', Connection: 'close' });
    response.end('hello from node');
  });

  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });

  try {
    const { port } = server.address();
    const connection = net.connect(port, '127.0.0.1');
    const received = [];

    const closed = new Promise((resolve, reject) => {
      connection.on('data', (chunk) => {
        received.push(chunk);
      });
      connection.on('error', reject);
      connection.on('close', resolve);
    });

    connection.write(new HTTP({
      method: http.METHOD_GET,
      path: '/from-the-layer',
      headers: { Host: `127.0.0.1:${port}`, 'User-Agent': 'over-the-wire' },
    }).buffer);

    await closed;

    const response = new HTTP(Buffer.concat(received));

    assert.deepEqual(seen, [{ method: 'GET', url: '/from-the-layer', agent: 'over-the-wire' }]);
    assert.equal(response.status, http.STATUS_OK);
    assert.equal(response.reason, 'OK');
    assert.equal(response.headers['content-type'], 'text/plain');
    assert.equal(response.complete, true);
    assert.ok(response.body.toString().includes('hello from node'));
  }
  finally {
    server.close();
  }
});

test('requests and responses are found in a real capture', async () => {
  const reader = otw.pcap.createReadStream({ format: 'pcapng' });
  const messages = [];

  fs.createReadStream(STARTUP_CAPTURE).pipe(reader);

  for await (const packet of reader) {
    const message = packet.layers.HTTP;

    if (message !== undefined) {
      messages.push(message.isRequest ? `${message.method} ${message.path}` : `${message.status} ${message.reason}`);
    }
  }

  assert.equal(messages.length, 28);
  assert.deepEqual(messages.slice(0, 2), ['GET /ping', '301 Moved Permanently']);
});
