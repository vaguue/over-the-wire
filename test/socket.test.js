import { strict as assert } from 'node:assert';
import test from 'node:test';

import socketModule from '#lib/socket';
const { Socket, SockAddr, AF_INET, SOCK_DGRAM } = socketModule;
import { SocketStream } from '#lib/socketStream';
import { Packet } from '#lib/packet';
import { LinkLayerType } from '#lib/enums';

const LOOPBACK = '127.0.0.1';
const firstPort = 40000 + (process.pid % 20000);

const nextEvent = (emitter, name, timeoutMs = 2000) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => {
    reject(new Error(`No "${name}" event within ${timeoutMs} ms`));
  }, timeoutMs);

  emitter.once(name, (...args) => {
    clearTimeout(timer);
    resolve(args);
  });
});

test('UDP sockets over loopback', async () => {
  const server = new Socket(AF_INET, SOCK_DGRAM, 0);
  const client = new Socket(AF_INET, SOCK_DGRAM, 0);
  const errors = [];

  server.on('error', err => errors.push(err));
  client.on('error', err => errors.push(err));

  server.bind(new SockAddr({ ip: LOOPBACK, port: firstPort }));
  client.bind(new SockAddr({ ip: LOOPBACK, port: firstPort + 1 }));

  server.resume();
  client.resume();

  try {
    const received = nextEvent(server, 'data');
    client.write(Buffer.from('ping'), new SockAddr({ ip: LOOPBACK, port: firstPort }));

    const [request, sender] = await received;
    assert.equal(request.toString(), 'ping');
    assert.equal(sender.ip, LOOPBACK);
    assert.equal(sender.port, firstPort + 1);

    server.connect(new SockAddr({ ip: LOOPBACK, port: firstPort + 1 }));

    const replied = nextEvent(client, 'data');
    server.write(Buffer.from('pong'));

    const [reply, replier] = await replied;
    assert.equal(reply.toString(), 'pong');
    assert.equal(replier.port, firstPort);

    assert.deepEqual(errors, []);
  }
  finally {
    server.close();
    client.close();
  }

  assert.throws(() => client.write(Buffer.from('late'), new SockAddr({ ip: LOOPBACK, port: firstPort })), /closed/);
  assert.doesNotThrow(() => client.close());
});

test('Socket write needs a destination unless connected', () => {
  const socket = new Socket(AF_INET, SOCK_DGRAM, 0);

  try {
    assert.throws(() => socket.write(Buffer.from('x')), /SockAddr/);
    assert.throws(() => socket.write('not a buffer', new SockAddr({ ip: LOOPBACK, port: firstPort })), /Buffer/);
  }
  finally {
    socket.close();
  }
});

test('SocketStream: packets over loopback UDP', async () => {

  const serverPort = firstPort + 10;
  const clientPort = firstPort + 11;

  const server = new SocketStream({
    domain: AF_INET,
    type: SOCK_DGRAM,
    bind: { ip: LOOPBACK, port: serverPort },
  });

  const client = new SocketStream({
    domain: AF_INET,
    type: SOCK_DGRAM,
    bind: { ip: LOOPBACK, port: clientPort },
    to: { ip: LOOPBACK, port: serverPort },
  });

  try {
    const requests = [];
    const twoRequests = new Promise((resolve) => {
      server.on('data', (pkt) => {
        requests.push(pkt);
        if (requests.length === 2) {
          resolve();
        }
      });
    });

    client.cork();
    client.write(Buffer.from('first'));
    client.write({ data: Buffer.from('second'), to: { ip: LOOPBACK, port: serverPort } });
    client.uncork();

    await twoRequests;

    const [first, second] = requests;
    assert.ok(first instanceof Packet);
    assert.deepEqual(requests.map(pkt => pkt.buffer.toString()).sort(), ['first', 'second']);
    assert.equal(first.peer.ip, LOOPBACK);
    assert.equal(first.peer.port, clientPort);
    assert.deepEqual(Object.keys(first.layers), ['Payload']);
    assert.equal(typeof second.timestamp.ns, 'bigint');

    const reply = nextEvent(client, 'data');
    const replyPacket = new Packet({ buffer: Buffer.from('reply'), iface: server.iface, peer: first.peer });
    await new Promise((resolve, reject) => {
      server.write(replyPacket, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });

    const [received] = await reply;
    assert.equal(received.buffer.toString(), 'reply');
    assert.equal(received.peer.port, serverPort);
  }
  finally {
    server.destroy();
    client.destroy();
  }
});

test('SocketStream: writing without a destination fails that write', async () => {

  const stream = new SocketStream({ domain: AF_INET, type: SOCK_DGRAM });
  const failure = nextEvent(stream, 'error');

  stream.write(Buffer.from('nowhere'));

  const [err] = await failure;
  assert.match(err.message, /No destination/);
  stream.destroy();
});

test('Packets that start at the IP header', () => {

  const built = new Packet({ iface: { linktype: 1 } })
    .ethernet({})
    .ipv4({ src: '10.0.0.1', dst: '10.0.0.2' })
    .udp({ src: 1, dst: 2 });

  const fromRawSocket = new Packet({
    buffer: built.buffer.subarray(14),
    iface: { linktype: LinkLayerType.LINKTYPE_IPV4 },
  });

  assert.deepEqual(Object.keys(fromRawSocket.layers), ['IPv4', 'UDP']);
  assert.equal(fromRawSocket.layers.IPv4.dst, '10.0.0.2');
});
