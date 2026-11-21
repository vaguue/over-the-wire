import { strict as assert } from 'node:assert';
import test from 'node:test';
import net from 'node:net';
import dgram from 'node:dgram';

import { system } from '#lib/index';
import { getOpenPorts } from '#lib/ports';
import { renderPorts } from '#lib/cli/ports';

const LOOPBACK = '127.0.0.1';

const listeningTcp = () => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(0, LOOPBACK, () => {
      resolve(server);
    });
  });
};

const boundUdp = () => {
  return new Promise((resolve) => {
    const socket = dgram.createSocket('udp4');
    socket.bind(0, LOOPBACK, () => {
      resolve(socket);
    });
  });
};

test('getOpenPorts lists the sockets this process listens on', async () => {
  const server = await listeningTcp();
  const socket = await boundUdp();

  try {
    const ports = await getOpenPorts();
    const ours = ports.filter(({ pid }) => pid === process.pid);

    const tcp = ours.find(({ protocol, port }) => protocol === 'tcp' && port === server.address().port);
    const udp = ours.find(({ protocol, port }) => protocol === 'udp' && port === socket.address().port);

    assert.deepEqual({ family: tcp.family, address: tcp.address }, { family: 'IPv4', address: LOOPBACK });
    assert.deepEqual({ family: udp.family, address: udp.address }, { family: 'IPv4', address: LOOPBACK });
    assert.equal(typeof tcp.process, 'string');
    assert.ok(tcp.process.length > 0);

    for (const { protocol, family, address, port, pid } of ports) {
      assert.ok(['tcp', 'udp'].includes(protocol));
      assert.ok(['IPv4', 'IPv6'].includes(family));
      assert.notEqual(net.isIP(address), 0, address);
      assert.ok(port > 0 && port < 65536);
      assert.ok(pid === null || Number.isInteger(pid));
    }
  }
  finally {
    server.close();
    socket.close();
  }
});

test('getOpenPorts is sorted by port, keeps one protocol on request and is part of system', async () => {
  const server = await listeningTcp();
  const socket = await boundUdp();

  try {
    const everything = await system.getOpenPorts();
    const onlyUdp = await getOpenPorts({ protocol: 'udp' });

    assert.deepEqual(everything.map(({ port }) => port), everything.map(({ port }) => port).sort((left, right) => left - right));
    assert.ok(onlyUdp.every(({ protocol }) => protocol === 'udp'));
    assert.ok(onlyUdp.some(({ port }) => port === socket.address().port));
    assert.ok(!onlyUdp.some(({ port, pid }) => pid === process.pid && port === server.address().port));
  }
  finally {
    server.close();
    socket.close();
  }
});

test('a closed listener is no longer reported', async () => {
  const server = await listeningTcp();
  const { port } = server.address();

  await new Promise((resolve) => {
    server.close(resolve);
  });

  const ports = await getOpenPorts({ protocol: 'tcp' });

  assert.ok(!ports.some(found => found.pid === process.pid && found.port === port));
});

test('the listing is a table with one row per socket', () => {
  const listing = renderPorts([
    { protocol: 'tcp', family: 'IPv4', address: '0.0.0.0', port: 22, pid: 812, process: 'sshd' },
    { protocol: 'udp', family: 'IPv6', address: '::', port: 5353, pid: null, process: null },
  ]);

  assert.deepEqual(listing.split('\n'), [
    'PROTO  ADDRESS  PORT  PID  PROCESS',
    'tcp    0.0.0.0  22    812  sshd',
    'udp6   ::       5353  -    -',
  ]);

  assert.equal(renderPorts([]), 'No open ports found.');
});
