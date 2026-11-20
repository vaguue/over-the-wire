import { strict as assert } from 'node:assert';
import test from 'node:test';
import os from 'node:os';
import { spawnSync } from 'node:child_process';

import otw, { Wire, SocketStream, icmp } from '#lib/index';
import socketModule from '#lib/socket';
import { SocketBuilder, ipSockets } from '#lib/socketBuilder';

const LOOPBACK = '127.0.0.1';
const firstPort = 20000 + (process.pid % 20000);

const loopbackInterface = () => {
  const [name] = Object.entries(os.networkInterfaces()).find(([, entries]) => entries.some(({ internal }) => internal));
  return name;
};

const withoutConstants = (...names) => {
  const constants = {};

  for (const [name, value] of Object.entries(socketModule)) {
    if (typeof value == 'number' && !names.includes(name)) {
      constants[name] = value;
    }
  }

  return constants;
};

test('wire.socket() describes a socket and opens it when awaited', async () => {
  const wire = otw();
  const description = wire.socket().inet().dgram().bind({ ip: LOOPBACK, port: firstPort });

  assert.ok(description instanceof SocketBuilder);
  assert.equal(String(description), 'inet dgram');

  const server = await description;
  const client = await wire.s.inet().dgram().to({ ip: LOOPBACK, port: firstPort });

  try {
    assert.ok(server instanceof SocketStream);
    assert.deepEqual(server.unsupported, []);
    assert.throws(() => description.raw(), /already opened/);

    const request = server.expect(() => true, { timeout: 2000 });
    client.write(Buffer.from('ping'));

    const received = await request;
    assert.equal(received.buffer.toString(), 'ping');
    assert.equal(received.peer.ip, LOOPBACK);

    const reply = client.expect(() => true, { timeout: 2000 });
    server.write({ data: Buffer.from('pong'), to: received.peer });

    assert.equal((await reply).buffer.toString(), 'pong');
  }
  finally {
    wire.close();
  }

  assert.ok(server.destroyed);
  assert.ok(client.destroyed);
  assert.equal(wire.openSockets.size, 0);
});

test('the constants live on the wire and only the ones this system has', () => {
  const wire = otw();

  assert.equal(wire.sockets.AF_INET, socketModule.AF_INET);
  assert.equal(wire.sockets.IPPROTO_ICMP, socketModule.IPPROTO_ICMP);
  assert.equal(typeof wire.sockets.SOL_SOCKET, 'number');
  assert.equal(typeof wire.sockets.SO_BROADCAST, 'number');
  assert.ok(Object.isFrozen(wire.sockets));

  const elsewhere = otw({ system: { platform: 'win32', socketConstants: withoutConstants('SO_REUSEPORT', 'AF_INET6') } });

  assert.equal(elsewhere.sockets.SO_REUSEPORT, undefined);
  assert.ok(elsewhere.socketCatalogue.missing.includes('SO_REUSEPORT'));
  assert.equal(elsewhere.socket().supports('reusePort'), false);
  assert.equal(elsewhere.socket().supports('inet6'), false);
  assert.equal(elsewhere.socket().supports('broadcast'), true);
});

test('the wire decides which sockets can be described', () => {
  class NarrowWire extends Wire {}

  NarrowWire.socketKinds = {
    ...ipSockets,
    families: { inet: 'AF_INET' },
    protocols: { udp: 'IPPROTO_UDP' },
  };

  const narrow = new NarrowWire().socket();
  const usual = otw().socket();

  assert.equal(typeof narrow.inet, 'function');
  assert.equal(narrow.inet6, undefined);
  assert.equal(narrow.icmp, undefined);
  assert.equal(typeof usual.inet6, 'function');
  assert.equal(typeof usual.icmp, 'function');
});

test('an option this system does not have is reported on the socket instead of thrown', async () => {
  const wire = otw({ system: { platform: 'win32', socketConstants: withoutConstants('SO_REUSEPORT') } });
  const socket = await wire.socket().inet().dgram().reusePort().broadcast();

  try {
    assert.deepEqual(socket.unsupported, [
      { option: 'reusePort', reason: 'SO_REUSEPORT is not defined on win32' },
    ]);
  }
  finally {
    wire.close();
  }
});

test('an option the system refuses is reported the same way and the socket still works', async () => {
  const wire = otw();
  const NO_SUCH_OPTION = 0x7ffe;
  const port = firstPort + 1;

  const socket = await wire.socket()
    .inet()
    .dgram()
    .option(wire.sockets.SOL_SOCKET, NO_SUCH_OPTION, 1)
    .ipv6Only()
    .reuseAddress()
    .bind({ ip: LOOPBACK, port });

  try {
    assert.deepEqual(socket.unsupported.map(({ option }) => option), [`${wire.sockets.SOL_SOCKET}/${NO_SUCH_OPTION}`, 'ipv6Only']);
    assert.ok(socket.unsupported.every(({ reason }) => reason.length > 0));
    assert.equal(socket.socket.getsockopt(wire.sockets.SOL_SOCKET, wire.sockets.SO_REUSEADDR) !== 0, true);

    const echoed = socket.expect(() => true, { timeout: 2000 });
    socket.write({ data: Buffer.from('still works'), to: { ip: LOOPBACK, port } });

    assert.equal((await echoed).buffer.toString(), 'still works');
  }
  finally {
    wire.close();
  }
});

test('a socket that cannot exist rejects with a code', async () => {
  const withoutIpv6 = otw({ system: { platform: 'plan9', socketConstants: withoutConstants('AF_INET6') } });

  await assert.rejects(withoutIpv6.socket().inet6().dgram().exec(), {
    code: 'ENOTSUPPORTED',
    message: 'inet6 sockets are not available on plan9: AF_INET6 is not defined',
  });

  const refusedBySystem = otw({
    system: {
      openSocket: () => {
        throw new Error('Operation not permitted');
      },
    },
  });

  await assert.rejects(refusedBySystem.socket().inet().raw().icmp().exec(), {
    code: 'ESOCKET',
    message: 'Could not open a inet raw icmp socket: Operation not permitted',
  });
});

test('raw sockets open for a privileged user and reject otherwise', async () => {
  const wire = otw();

  try {
    const socket = await wire.socket().inet().raw().icmp().headerIncluded(false);
    assert.equal(socket.iface.linktype, otw.LinkLayerType.LINKTYPE_IPV4);
  }
  catch (err) {
    assert.equal(err.code, 'ESOCKET');
  }
  finally {
    wire.close();
  }
});

test('blocking sockets hand every write to the system before write returns', async (t) => {
  const wire = otw();
  const port = firstPort + 2;
  const receiver = await wire.socket().inet().dgram().bind({ ip: LOOPBACK, port });
  const sender = await wire.socket().inet().dgram().blocking().to({ ip: LOOPBACK, port });

  try {
    if (process.platform === 'win32') {
      assert.deepEqual(sender.unsupported.map(({ option }) => option), ['blocking']);
      t.skip('blocking sockets are not available on Windows');
      return;
    }

    assert.equal(sender.socket.blocking, true);
    assert.equal(receiver.socket.blocking, false);
    assert.deepEqual(sender.unsupported, []);

    const received = [];
    const everythingArrived = new Promise((resolve) => {
      receiver.on('data', (packet) => {
        received.push(packet.buffer.toString());

        if (received.length === 3) {
          resolve();
        }
      });
    });

    const sentBeforeReturning = [];
    const writeToSystem = sender.socket.write.bind(sender.socket);

    sender.socket.write = (batch) => {
      const everythingWasSent = writeToSystem(batch);
      sentBeforeReturning.push(everythingWasSent);
      return everythingWasSent;
    };

    sender.write(Buffer.from('one'));
    sender.write(Buffer.from('two'));
    sender.write(Buffer.from('three'));

    assert.deepEqual(sentBeforeReturning, [true, true, true]);

    await everythingArrived;
    assert.deepEqual(received.sort(), ['one', 'three', 'two']);
  }
  finally {
    wire.close();
  }
});

test('a wire bound to an interface binds its sockets to it when the system allows', async () => {
  const iface = loopbackInterface();
  const wire = otw({ iface });
  const socket = await wire.socket().inet().dgram();

  try {
    const refused = socket.unsupported.find(({ option }) => option === 'iface');

    if (refused === undefined) {
      assert.equal(socket.boundToInterface, iface);
    }
    else {
      assert.ok(refused.reason.length > 0);
      assert.equal(socket.boundToInterface, undefined);
    }
  }
  finally {
    wire.close();
  }
});

test('ping without capture privileges: an ICMP datagram socket', async (t) => {
  const wire = otw();
  let socket;

  try {
    socket = await wire.socket().inet().dgram().icmp().to({ ip: LOOPBACK });
  }
  catch (err) {
    assert.equal(err.code, 'ESOCKET');
    t.skip(`ICMP datagram sockets are not allowed here: ${err.message}`);
    return;
  }

  try {
    const IPV4_HEADER_LENGTH = 20;
    const sequence = 7;

    const isOurReply = ({ buffer }) => {
      const message = buffer[0] >> 4 === 4 ? buffer.subarray(IPV4_HEADER_LENGTH) : buffer;
      return message[0] === icmp.ECHO_REPLY && message.readUInt16BE(6) === sequence;
    };

    const answered = socket.expect(isOurReply, { timeout: 2000 });
    socket.write(wire.packet().icmp({ type: icmp.ECHO_REQUEST, id: process.pid & 0xffff, sequence }));

    assert.notEqual(await answered, null);
  }
  finally {
    wire.close();
  }
});

test('a listener that throws is an uncaught exception, not an abort of the process', () => {
  const script = `
    import otw from '#lib/index';

    const wire = otw();
    const port = ${firstPort + 3};
    const socket = await wire.socket().inet().dgram().bind({ ip: '${LOOPBACK}', port });

    process.on('uncaughtException', (err) => {
      console.log('caught: ' + err.message);
      wire.close();
    });

    socket.on('data', () => {
      throw new Error('listener failed');
    });

    socket.write({ data: Buffer.from('x'), to: { ip: '${LOOPBACK}', port } });
  `;

  const result = spawnSync(process.execPath, ['--input-type=module', '-e', script], { encoding: 'utf8', timeout: 10000 });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), 'caught: listener failed');
});
