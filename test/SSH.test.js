import { strict as assert } from 'node:assert';
import test from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import net from 'node:net';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import otw, { Packet, FilterBuilder, layers, ssh, tcp } from '#lib/index';
import { SSH } from '#lib/layers/SSH';

const ETHERNET = { linktype: 1 };
const LOOPBACK = '127.0.0.1';
const PACKAGE_ROOT = path.dirname(fileURLToPath(import.meta.resolve('over-the-wire/package.json')));
const SSHD_LOCATIONS = ['/usr/sbin/sshd', '/usr/bin/sshd', '/usr/local/sbin/sshd', '/opt/homebrew/sbin/sshd'];

const offer = {
  type: ssh.MSG_KEXINIT,
  kexAlgorithms: ['curve25519-sha256'],
  serverHostKeyAlgorithms: ['ssh-ed25519', 'rsa-sha2-512'],
  encryptionClientToServer: ['aes128-ctr'],
  encryptionServerToClient: ['aes128-ctr'],
  macClientToServer: ['hmac-sha2-256'],
  macServerToClient: ['hmac-sha2-256'],
  compressionClientToServer: ['none'],
  compressionServerToClient: ['none'],
};

const segmentCarrying = (bytes, ports = { src: 40000, dst: ssh.PORT }) => {
  const built = new Packet({ iface: ETHERNET })
    .ethernet()
    .ipv4({ src: '10.0.0.1', dst: '10.0.0.2' })
    .tcp({ ...ports, flags: { psh: 1, ack: 1 } })
    .payload({ data: bytes });

  return new Packet({ buffer: built.buffer, iface: ETHERNET });
};

test('the identification line is built and read back', () => {
  const line = new SSH({ softwareVersion: 'probe_1.0', comments: 'hello there' });

  assert.equal(line.buffer.toString(), 'SSH-2.0-probe_1.0 hello there\r\n');
  assert.equal(new SSH().buffer.toString(), 'SSH-2.0-over_the_wire\r\n');
  assert.equal(new SSH({ identification: 'SSH-1.99-old' }).identification, 'SSH-1.99-old');

  const read = new SSH(Buffer.from('SSH-2.0-OpenSSH_9.6p1 Ubuntu-3ubuntu13\r\n'));

  assert.equal(read.isIdentification, true);
  assert.equal(read.identification, 'SSH-2.0-OpenSSH_9.6p1 Ubuntu-3ubuntu13');
  assert.equal(read.protocolVersion, '2.0');
  assert.equal(read.softwareVersion, 'OpenSSH_9.6p1');
  assert.equal(read.comments, 'Ubuntu-3ubuntu13');
  assert.equal(read.complete, true);
  assert.equal(new SSH(Buffer.from('SSH-2.0-cut')).complete, false);
});

test('a key exchange offer is framed by the rules of the binary packet', () => {
  const message = new SSH(offer);
  const { buffer } = message;

  assert.equal(buffer.length % 8, 0);
  assert.equal(buffer.readUInt32BE(0), buffer.length - 4);
  assert.ok(buffer[4] >= 4);
  assert.equal(buffer[5], ssh.MSG_KEXINIT);

  const read = new SSH(buffer);

  assert.equal(read.type, ssh.MSG_KEXINIT);
  assert.equal(read.typeName, 'KEXINIT');
  assert.equal(read.encrypted, false);
  assert.equal(read.complete, true);
  assert.equal(read.cookie.length, 16);
  assert.deepEqual(read.kexAlgorithms, ['curve25519-sha256']);
  assert.deepEqual(read.serverHostKeyAlgorithms, ['ssh-ed25519', 'rsa-sha2-512']);
  assert.deepEqual(read.languagesClientToServer, []);
  assert.equal(read.firstKexPacketFollows, false);
  assert.equal(read.payload.length, buffer.length - 4 - 1 - read.paddingLength);
  assert.equal(read.payload[0], ssh.MSG_KEXINIT);
  assert.notDeepEqual(new SSH(offer).cookie, read.cookie);
});

test('the other messages of the exchange keep their fields', () => {
  const publicKey = Buffer.alloc(32, 7);
  const init = new SSH(new SSH({ type: ssh.MSG_KEX_ECDH_INIT, publicKey }).buffer);
  const reply = new SSH(new SSH({ type: ssh.MSG_KEX_ECDH_REPLY, hostKey: Buffer.from('key'), publicKey, signature: Buffer.from('signed') }).buffer);
  const goodbye = new SSH(new SSH({ type: ssh.MSG_DISCONNECT, reason: ssh.DISCONNECT_BY_APPLICATION, description: 'done' }).buffer);
  const newKeys = new SSH(new SSH({ type: ssh.MSG_NEWKEYS }).buffer);
  const unknown = new SSH(new SSH({ type: ssh.MSG_REQUEST_SUCCESS, data: Buffer.from([1, 2, 3]) }).buffer);

  assert.deepEqual(init.publicKey, publicKey);
  assert.equal(reply.hostKey.toString(), 'key');
  assert.equal(reply.signature.toString(), 'signed');
  assert.deepEqual({ reason: goodbye.reason, description: goodbye.description }, { reason: 11, description: 'done' });
  assert.equal(newKeys.typeName, 'NEWKEYS');
  assert.equal(newKeys.buffer.length, 16);
  assert.deepEqual([...unknown.data], [1, 2, 3]);
  assert.equal(goodbye.toObject().typeName, 'DISCONNECT');
});

test('the header of a binary packet is a struct, absent from what is not a packet', () => {
  const newKeys = new SSH({ type: ssh.MSG_NEWKEYS });

  assert.equal(newKeys.packetLength, 12);
  assert.equal(newKeys.paddingLength, 10);
  assert.equal(newKeys.type, ssh.MSG_NEWKEYS);
  assert.equal(SSH.prototype.config.length, 6);

  const line = new SSH({ softwareVersion: 'probe_1.0' });

  assert.equal(line.type, undefined);
  assert.equal(line.packetLength, undefined);
  assert.deepEqual(Object.keys(line.toObject()), ['isIdentification', 'encrypted', 'complete', 'identification', 'protocolVersion', 'softwareVersion', 'comments']);
  assert.throws(() => new SSH(Buffer.from('SSH')), /Invalid buffer length/);
});

test('logging in: the fields after the method follow the method', () => {
  const login = { type: ssh.MSG_USERAUTH_REQUEST, user: 'deploy', service: 'ssh-connection' };
  const byPassword = new SSH(new SSH({ ...login, method: 'password', password: 'secret' }).buffer);
  const askingAboutKey = new SSH({ ...login, method: 'publickey', hasSignature: true, algorithm: 'ssh-ed25519', publicKey: Buffer.from('blob') });
  const signedRequest = new SSH(new SSH({ ...login, method: 'publickey', hasSignature: true, algorithm: 'ssh-ed25519', publicKey: Buffer.from('blob'), signature: Buffer.from('sig') }).buffer);
  const refused = new SSH(new SSH({ type: ssh.MSG_USERAUTH_FAILURE, methods: ['publickey', 'password'] }).buffer);

  assert.deepEqual(
    { user: byPassword.user, service: byPassword.service, method: byPassword.method, password: byPassword.password, changesPassword: byPassword.changesPassword },
    { user: 'deploy', service: 'ssh-connection', method: 'password', password: 'secret', changesPassword: false },
  );

  assert.equal(new SSH(askingAboutKey.buffer).signature, undefined);
  assert.equal(signedRequest.signature.toString(), 'sig');
  assert.equal(signedRequest.algorithm, 'ssh-ed25519');
  assert.deepEqual([...signedRequest.payload.subarray(0, askingAboutKey.payload.length)], [...askingAboutKey.payload]);
  assert.deepEqual(refused.methods, ['publickey', 'password']);
  assert.equal(refused.partialSuccess, false);
});

test('channels: a session, a command, its output and its exit status', () => {
  const open = new SSH(new SSH({ type: ssh.MSG_CHANNEL_OPEN, channelType: 'session', senderChannel: 3, windowSize: 2097152, maximumPacketSize: 32768 }).buffer);
  const exec = new SSH(new SSH({ type: ssh.MSG_CHANNEL_REQUEST, recipientChannel: 5, request: 'exec', wantReply: true, command: 'uptime' }).buffer);
  const output = new SSH(new SSH({ type: ssh.MSG_CHANNEL_DATA, recipientChannel: 3, data: Buffer.from('up 12 days') }).buffer);
  const errors = new SSH(new SSH({ type: ssh.MSG_CHANNEL_EXTENDED_DATA, recipientChannel: 3, dataType: ssh.EXTENDED_DATA_STDERR, data: Buffer.from('oops') }).buffer);
  const exit = new SSH(new SSH({ type: ssh.MSG_CHANNEL_REQUEST, recipientChannel: 3, request: 'exit-status', exitStatus: 7 }).buffer);
  const unknownRequest = new SSH(new SSH({ type: ssh.MSG_CHANNEL_REQUEST, recipientChannel: 3, request: 'keepalive@openssh.com', wantReply: true, data: Buffer.from([9]) }).buffer);

  assert.deepEqual(
    { channelType: open.channelType, senderChannel: open.senderChannel, windowSize: open.windowSize, maximumPacketSize: open.maximumPacketSize },
    { channelType: 'session', senderChannel: 3, windowSize: 2097152, maximumPacketSize: 32768 },
  );

  assert.deepEqual({ request: exec.request, wantReply: exec.wantReply, command: exec.command }, { request: 'exec', wantReply: true, command: 'uptime' });
  assert.equal(output.data.toString(), 'up 12 days');
  assert.equal(errors.dataType, 1);
  assert.equal(errors.data.toString(), 'oops');
  assert.equal(exit.exitStatus, 7);
  assert.equal(exit.complete, true);
  assert.deepEqual([...unknownRequest.data], [9]);
});

test('a packet sealed by an AEAD cipher: padded without the length, taken with its tag', () => {
  const plain = new SSH({ type: ssh.MSG_SERVICE_REQUEST, service: 'ssh-userauth', blockSize: 16, blockCoversLength: false });

  assert.equal(plain.packetLength % 16, 0);
  assert.equal(new SSH(plain.buffer).service, 'ssh-userauth');
  assert.equal(new SSH(plain.buffer).encrypted, false);

  const tag = Buffer.alloc(16, 0xee);
  const following = new SSH({ type: ssh.MSG_NEWKEYS }).buffer;
  const stream = Buffer.concat([plain.buffer, tag, following]);
  const taken = SSH.take(stream, { trailerLength: tag.length });

  assert.deepEqual([...taken.message.buffer], [...plain.buffer]);
  assert.deepEqual(taken.trailer, tag);
  assert.deepEqual(taken.rest, following);

  const waiting = SSH.take(stream.subarray(0, plain.buffer.length + 3), { trailerLength: tag.length });

  assert.equal(waiting.message, null);
  assert.equal(waiting.rest.length, plain.buffer.length + 3);
  assert.deepEqual(SSH.strings(Buffer.concat([SSH.string('ssh-ed25519'), SSH.string(Buffer.from([1, 2]))])).map(String), ['ssh-ed25519', '\u0001\u0002']);
});

test('the encodings of the exchange hash', () => {
  assert.deepEqual([...SSH.string('ab')], [0, 0, 0, 2, 0x61, 0x62]);
  assert.deepEqual([...SSH.nameList(['a', 'b'])], [0, 0, 0, 3, 0x61, 0x2c, 0x62]);
  assert.deepEqual([...SSH.mpint(Buffer.from([0x00, 0x00, 0x7f]))], [0, 0, 0, 1, 0x7f]);
  assert.deepEqual([...SSH.mpint(Buffer.from([0x80, 0x01]))], [0, 0, 0, 3, 0x00, 0x80, 0x01]);
  assert.deepEqual([...SSH.mpint(Buffer.alloc(2))], [0, 0, 0, 0]);
});

test('a byte stream is cut into whole messages and the unfinished rest', () => {
  const identification = new SSH({ softwareVersion: 'server_1' }).buffer;
  const kexinit = new SSH(offer).buffer;
  const newKeys = new SSH({ type: ssh.MSG_NEWKEYS }).buffer;
  const stream = Buffer.concat([identification, kexinit, newKeys]);

  const whole = SSH.split(stream);

  assert.deepEqual(whole.messages.map(message => message.typeName ?? message.identification), ['SSH-2.0-server_1', 'KEXINIT', 'NEWKEYS']);
  assert.equal(whole.rest.length, 0);

  const cut = SSH.split(stream.subarray(0, identification.length + kexinit.length + 3));

  assert.equal(cut.messages.length, 2);
  assert.equal(cut.rest.length, 3);
  assert.deepEqual(SSH.split(Buffer.from('SSH-2.0-no line end yet')).messages, []);
});

test('under TCP every message of a segment is its own layer', () => {
  const serverHello = Buffer.concat([new SSH({ softwareVersion: 'OpenSSH_9.6' }).buffer, new SSH(offer).buffer]);
  const parsed = segmentCarrying(serverHello, { src: ssh.PORT, dst: 40000 });

  assert.deepEqual(Object.keys(parsed.layers), ['Ethernet', 'IPv4', 'TCP', 'SSH']);
  assert.equal(parsed.layers.SSH.length, 2);
  assert.equal(parsed.layers.SSH[0].softwareVersion, 'OpenSSH_9.6');
  assert.deepEqual(parsed.layers.SSH[1].kexAlgorithms, ['curve25519-sha256']);

  const onAnotherPort = segmentCarrying(new SSH({ softwareVersion: 'elsewhere' }).buffer, { src: 40000, dst: 2222 });
  assert.deepEqual(Object.keys(onAnotherPort.layers), ['Ethernet', 'IPv4', 'TCP', 'Payload']);

  const withoutData = new Packet({ iface: ETHERNET })
    .ethernet()
    .ipv4({ src: '10.0.0.1', dst: '10.0.0.2' })
    .tcp({ src: 40000, dst: ssh.PORT, flags: { ack: 1 } });

  assert.equal(new Packet({ buffer: withoutData.buffer, iface: ETHERNET }).layers.SSH, undefined);
});

test('what cannot be read as a packet is kept as encrypted bytes', () => {
  const ciphertext = Buffer.from('9f3c1a7be2d44c0188f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3', 'hex');
  const parsed = segmentCarrying(ciphertext);

  assert.equal(parsed.layers.SSH.encrypted, true);
  assert.equal(parsed.layers.SSH.type, undefined);
  assert.deepEqual(parsed.layers.SSH.data, ciphertext);

  const kexinit = new SSH(offer).buffer;
  const cutShort = new SSH(kexinit.subarray(0, 40));

  assert.equal(cutShort.encrypted, false);
  assert.equal(cutShort.typeName, 'KEXINIT');
  assert.equal(cutShort.complete, false);
});

test('packets, filters and the namespace know the layer', () => {
  assert.equal(ssh.PORT, 22);
  assert.equal(ssh.PORT, tcp.PORT_SSH);
  assert.equal(ssh.MSG_KEXINIT, 20);
  assert.equal(ssh.DISCONNECT_BY_APPLICATION, 11);
  assert.equal(layers.SSH, SSH);
  assert.equal(otw.layers.SSH, SSH);

  const built = new Packet({ iface: ETHERNET })
    .ethernet()
    .ipv4({ src: '10.0.0.1', dst: '10.0.0.2' })
    .tcp({ src: 40000, dst: ssh.PORT, flags: { psh: 1, ack: 1 } })
    .ssh(offer);

  const parsed = new Packet({ buffer: built.buffer, iface: ETHERNET });

  assert.equal(parsed.layers.SSH.typeName, 'KEXINIT');
  assert.ok(new FilterBuilder().tcp({ port: ssh.PORT }).ssh({ type: ssh.MSG_KEXINIT }).matches(parsed));
  assert.ok(!new FilterBuilder().ssh({ type: ssh.MSG_NEWKEYS }).matches(parsed));
  assert.ok(new FilterBuilder().ssh({ kexAlgorithms: names => names.includes('curve25519-sha256') }).matches(parsed));
});

const freePort = () => {
  return new Promise((resolve) => {
    const probe = net.createServer();

    probe.listen(0, LOOPBACK, () => {
      const { port } = probe.address();

      probe.close(() => {
        resolve(port);
      });
    });
  });
};

const startThrowawayServer = async (directory) => {
  const sshd = SSHD_LOCATIONS.find(location => fs.existsSync(location));
  const hostKey = path.join(directory, 'host_key');
  const userKey = path.join(directory, 'user_key');
  const strangerKey = path.join(directory, 'stranger_key');
  const keygen = [hostKey, userKey, strangerKey].map(file => spawnSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-f', file], { encoding: 'utf8' }));

  if (sshd === undefined || keygen.some(({ status }) => status !== 0)) {
    return { unavailable: 'sshd and ssh-keygen are needed' };
  }

  const port = await freePort();

  const server = spawn(sshd, [
    '-D', '-e',
    '-f', '/dev/null',
    '-h', hostKey,
    '-p', String(port),
    '-o', `ListenAddress=${LOOPBACK}`,
    '-o', 'PidFile=none',
    '-o', `AuthorizedKeysFile=${userKey}.pub`,
    '-o', 'StrictModes=no',
    '-o', 'PasswordAuthentication=no',
  ]);

  const log = [];

  const listening = await new Promise((resolve) => {
    server.stderr.on('data', (chunk) => {
      log.push(chunk.toString());

      if (log.join('').includes('Server listening')) {
        resolve(true);
      }
    });

    server.once('exit', () => {
      resolve(false);
    });
  });

  if (!listening) {
    return { unavailable: `sshd did not start: ${log.join('').trim()}` };
  }

  const fingerprint = spawnSync('ssh-keygen', ['-lf', `${hostKey}.pub`], { encoding: 'utf8' }).stdout.split(' ')[1];

  return { server, port, fingerprint, log, userKey, strangerKey };
};

const recipeScript = (directory) => {
  const recipe = fs.readFileSync(path.join(PACKAGE_ROOT, 'recipes', 'ssh.md'), 'utf8');
  const [, code] = recipe.match(/```javascript\n([\s\S]*?)```/);
  const script = path.join(directory, 'ssh.mjs');

  fs.writeFileSync(script, code);
  return script;
};

const runRecipe = (directory, port, command, env = {}) => {
  return spawnSync(process.execPath, [
    path.join(PACKAGE_ROOT, 'bin', 'otw.js'),
    recipeScript(directory),
    `${os.userInfo().username}@${LOOPBACK}:${port}`,
    command,
  ], {
    encoding: 'utf8',
    timeout: 30000,
    maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, ...env },
  });
};

test('a real sshd: the recipe logs in, runs a command and prints its output', async (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'otw-ssh-'));
  const { unavailable, server, port, fingerprint, log, userKey, strangerKey } = await startThrowawayServer(directory);

  if (unavailable !== undefined) {
    fs.rmSync(directory, { recursive: true });
    t.skip(unavailable);
    return;
  }

  try {
    const ran = runRecipe(directory, port, 'echo over $((40 + 2)) wires; echo to stderr >&2; exit 7', { SSH_KEY: userKey });

    assert.equal(ran.stdout, 'over 42 wires\n', ran.stderr);
    assert.equal(ran.status, 7);

    const [aboutTheServer, ...errorOutput] = ran.stderr.trim().split('\n');

    assert.match(aboutTheServer, /^OpenSSH_\S+, host key ssh-ed25519 SHA256:/);
    assert.ok(aboutTheServer.endsWith(fingerprint));
    assert.deepEqual(errorOutput, ['to stderr']);

    const large = runRecipe(directory, port, 'head -c 5000000 /dev/zero | tr "\\0" x', { SSH_KEY: userKey });

    assert.equal(large.status, 0, large.stderr);
    assert.equal(large.stdout.length, 5000000);
    assert.ok(/^x+$/.test(large.stdout));

    const stranger = runRecipe(directory, port, 'echo never', { SSH_KEY: strangerKey });

    assert.equal(stranger.stdout, '');
    assert.notEqual(stranger.status, 0);
    assert.match(stranger.stderr, /Not logged in as .+, the server accepts: publickey/);

    await new Promise((resolve) => {
      setTimeout(resolve, 200);
    });

    assert.match(log.join(''), /disconnect from 127\.0\.0\.1 port \d+:11: done/);
  }
  finally {
    server.kill();
    fs.rmSync(directory, { recursive: true });
  }
});

test('a real sshd: its first segment is read by the layer', async (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'otw-ssh-'));
  const { unavailable, server, port } = await startThrowawayServer(directory);

  if (unavailable !== undefined) {
    fs.rmSync(directory, { recursive: true });
    t.skip(unavailable);
    return;
  }

  try {
    const connection = net.connect(port, LOOPBACK);
    let unread = Buffer.alloc(0);
    const messages = [];

    const twoMessages = new Promise((resolve, reject) => {
      connection.on('error', reject);
      connection.on('data', (chunk) => {
        const cut = SSH.split(Buffer.concat([unread, chunk]));
        unread = cut.rest;
        messages.push(...cut.messages);

        if (messages.length >= 2) {
          resolve();
        }
      });
    });

    connection.write(new SSH({ softwareVersion: 'over_the_wire_test' }).buffer);
    connection.write(new SSH(offer).buffer);

    await twoMessages;
    connection.destroy();

    const [identification, kexinit] = messages;

    assert.match(identification.softwareVersion, /^OpenSSH_/);
    assert.equal(kexinit.type, ssh.MSG_KEXINIT);
    assert.equal(kexinit.complete, true);
    assert.ok(kexinit.kexAlgorithms.includes('curve25519-sha256'));
    assert.deepEqual(kexinit.serverHostKeyAlgorithms, ['ssh-ed25519']);
    assert.ok(kexinit.compressionServerToClient.includes('none'));
  }
  finally {
    server.kill();
    fs.rmSync(directory, { recursive: true });
  }
});
