`ssh user@host command`: a programmable SSH client. It exchanges keys with the server, checks that the server owns its host key, switches to encryption, logs in, runs one command and prints what the command printed. Every message is an `SSH` layer that you describe and send yourself, so any step can be changed: another offer, a malformed message, a different order.

The TCP connection and the cryptography are Node's. The login is an Ed25519 key without a passphrase (`~/.ssh/id_ed25519`, or the file in `SSH_KEY`), or the password in `SSH_PASSWORD`.

```javascript
import fs from 'node:fs';
import os from 'node:os';
import net from 'node:net';
import path from 'node:path';
import crypto from 'node:crypto';

import { layers, ssh } from 'over-the-wire';

const { SSH } = layers;

const CIPHER = 'aes256-gcm@openssh.com';
const KEY_LENGTH = 32;
const NONCE_LENGTH = 12;
const TAG_LENGTH = 16;
const BLOCK_SIZE = 16;
const LENGTH_FIELD = 4;
const WINDOW_SIZE = 2 ** 21;
const LARGEST_DATA = 2 ** 15;
const OUR_CHANNEL = 0;
const KEY_FILE_START = 'openssh-key-v1\0';

const [destination, ...commandWords] = process.argv.slice(2);
const [user, address] = destination.includes('@') ? destination.split('@') : [os.userInfo().username, destination];
const [host, port = ssh.PORT] = address.split(':');
const command = commandWords.join(' ');

const connection = net.connect(Number(port), host);
const incoming = connection[Symbol.asyncIterator]();
let unread = Buffer.alloc(0);
let sealing = null;
let opening = null;

const giveUp = (reason) => {
  connection.destroy();
  return new Error(reason);
};

const nextNonce = (direction) => {
  const nonce = Buffer.from(direction.nonce);
  direction.nonce.writeBigUInt64BE(direction.nonce.readBigUInt64BE(LENGTH_FIELD) + 1n, LENGTH_FIELD);
  return nonce;
};

const sealed = (packet) => {
  const cipher = crypto.createCipheriv('aes-256-gcm', sealing.key, nextNonce(sealing));
  const length = packet.subarray(0, LENGTH_FIELD);
  cipher.setAAD(length);
  return Buffer.concat([length, cipher.update(packet.subarray(LENGTH_FIELD)), cipher.final(), cipher.getAuthTag()]);
};

const opened = (packet, tag) => {
  const decipher = crypto.createDecipheriv('aes-256-gcm', opening.key, nextNonce(opening));
  const length = packet.subarray(0, LENGTH_FIELD);
  decipher.setAAD(length);
  decipher.setAuthTag(tag);
  return new SSH(Buffer.concat([length, decipher.update(packet.subarray(LENGTH_FIELD)), decipher.final()]));
};

const send = (description) => {
  if (sealing === null) {
    const message = new SSH(description);
    connection.write(message.buffer);
    return message;
  }

  const message = new SSH({ ...description, blockSize: BLOCK_SIZE, blockCoversLength: false });
  connection.write(sealed(message.buffer));
  return message;
};

const notForUs = [ssh.MSG_IGNORE, ssh.MSG_DEBUG, ssh.MSG_EXT_INFO, ssh.MSG_GLOBAL_REQUEST, ssh.MSG_USERAUTH_BANNER, ssh.MSG_CHANNEL_WINDOW_ADJUST];

const receive = async () => {
  for (;;) {
    const { message, trailer, rest } = SSH.take(unread, { trailerLength: opening === null ? 0 : TAG_LENGTH });

    if (message === null) {
      const { value, done } = await incoming.next();

      if (done) {
        throw giveUp('The server closed the connection');
      }

      unread = Buffer.concat([unread, value]);
      continue;
    }

    unread = rest;
    const readable = opening === null ? message : opened(message.buffer, trailer);

    if (readable.type === ssh.MSG_DISCONNECT) {
      throw giveUp(`The server disconnected: ${readable.description}`);
    }

    if (!notForUs.includes(readable.type)) {
      return readable;
    }
  }
};

const expectType = async (type, otherwise) => {
  const message = await receive();

  if (message.type !== type) {
    throw giveUp(otherwise(message));
  }

  return message;
};

const ours = send({ softwareVersion: 'over_the_wire' });
const theirs = await receive();

const ourOffer = send({
  type: ssh.MSG_KEXINIT,
  kexAlgorithms: ['curve25519-sha256'],
  serverHostKeyAlgorithms: ['ssh-ed25519'],
  encryptionClientToServer: [CIPHER],
  encryptionServerToClient: [CIPHER],
  macClientToServer: ['hmac-sha2-256'],
  macServerToClient: ['hmac-sha2-256'],
  compressionClientToServer: ['none'],
  compressionServerToClient: ['none'],
});

const theirOffer = await receive();

const ephemeral = crypto.generateKeyPairSync('x25519');
const ourPublicKey = Buffer.from(ephemeral.publicKey.export({ format: 'jwk' }).x, 'base64url');

send({ type: ssh.MSG_KEX_ECDH_INIT, publicKey: ourPublicKey });

const reply = await expectType(ssh.MSG_KEX_ECDH_REPLY, () => 'The server did not answer the key exchange');

const theirPublicKey = crypto.createPublicKey({
  key: { kty: 'OKP', crv: 'X25519', x: reply.publicKey.toString('base64url') },
  format: 'jwk',
});

const sharedSecret = SSH.mpint(crypto.diffieHellman({ privateKey: ephemeral.privateKey, publicKey: theirPublicKey }));

const exchangeHash = crypto.createHash('sha256')
  .update(SSH.string(ours.identification))
  .update(SSH.string(theirs.identification))
  .update(SSH.string(ourOffer.payload))
  .update(SSH.string(theirOffer.payload))
  .update(SSH.string(reply.hostKey))
  .update(SSH.string(ourPublicKey))
  .update(SSH.string(reply.publicKey))
  .update(sharedSecret)
  .digest();

const [hostKeyType, hostKeyBytes] = SSH.strings(reply.hostKey);
const [, hostSignature] = SSH.strings(reply.signature);

const hostKey = crypto.createPublicKey({
  key: { kty: 'OKP', crv: 'Ed25519', x: hostKeyBytes.toString('base64url') },
  format: 'jwk',
});

if (!crypto.verify(null, exchangeHash, hostKey, hostSignature)) {
  throw giveUp('The server does not own the host key it presented');
}

const fingerprint = crypto.createHash('sha256').update(reply.hostKey).digest('base64').replace(/=+$/, '');
console.error(`${theirs.softwareVersion}, host key ${hostKeyType} SHA256:${fingerprint}`);

await expectType(ssh.MSG_NEWKEYS, () => 'The server did not switch to the new keys');
send({ type: ssh.MSG_NEWKEYS });

const derived = (letter, length) => {
  return crypto.createHash('sha256').update(sharedSecret).update(exchangeHash).update(letter).update(exchangeHash).digest().subarray(0, length);
};

sealing = { key: derived('C', KEY_LENGTH), nonce: derived('A', NONCE_LENGTH) };
opening = { key: derived('D', KEY_LENGTH), nonce: derived('B', NONCE_LENGTH) };

send({ type: ssh.MSG_SERVICE_REQUEST, service: 'ssh-userauth' });
await expectType(ssh.MSG_SERVICE_ACCEPT, () => 'The server does not offer authentication');

const userKeyFrom = (file) => {
  const container = Buffer.from(fs.readFileSync(file, 'utf8').replace(/-----[A-Z ]+-----|\s/g, ''), 'base64').subarray(KEY_FILE_START.length);
  const [cipherName, kdfName, kdfOptions] = SSH.strings(container);
  const keysStart = [cipherName, kdfName, kdfOptions].reduce((offset, field) => offset + LENGTH_FIELD + field.length, LENGTH_FIELD);
  const [publicBlob, privateSection] = SSH.strings(container.subarray(keysStart));
  const [keyType, publicBytes, seedAndPublic] = SSH.strings(privateSection.subarray(2 * LENGTH_FIELD));

  if (cipherName.toString() !== 'none' || keyType.toString() !== 'ssh-ed25519') {
    throw giveUp(`${file} has to be an Ed25519 key without a passphrase`);
  }

  const privateKey = crypto.createPrivateKey({
    key: { kty: 'OKP', crv: 'Ed25519', x: publicBytes.toString('base64url'), d: seedAndPublic.subarray(0, KEY_LENGTH).toString('base64url') },
    format: 'jwk',
  });

  return { publicBlob, privateKey };
};

const login = { type: ssh.MSG_USERAUTH_REQUEST, user, service: 'ssh-connection' };

if (process.env.SSH_PASSWORD !== undefined) {
  send({ ...login, method: 'password', password: process.env.SSH_PASSWORD });
}
else {
  const { publicBlob, privateKey } = userKeyFrom(process.env.SSH_KEY ?? path.join(os.homedir(), '.ssh', 'id_ed25519'));
  const request = { ...login, method: 'publickey', hasSignature: true, algorithm: 'ssh-ed25519', publicKey: publicBlob };
  const signed = crypto.sign(null, Buffer.concat([SSH.string(exchangeHash), new SSH(request).payload]), privateKey);

  send({ ...request, signature: Buffer.concat([SSH.string('ssh-ed25519'), SSH.string(signed)]) });
}

await expectType(ssh.MSG_USERAUTH_SUCCESS, ({ methods = [] }) => `Not logged in as ${user}, the server accepts: ${methods.join(', ')}`);

send({ type: ssh.MSG_CHANNEL_OPEN, channelType: 'session', senderChannel: OUR_CHANNEL, windowSize: WINDOW_SIZE, maximumPacketSize: LARGEST_DATA });

const { senderChannel: theirChannel } = await expectType(ssh.MSG_CHANNEL_OPEN_CONFIRMATION, ({ description }) => `No session: ${description}`);

send({ type: ssh.MSG_CHANNEL_REQUEST, recipientChannel: theirChannel, request: 'exec', wantReply: true, command });

let exitStatus = null;

for (;;) {
  const { type, data, dataType, request, exitStatus: reported } = (await receive()).toObject();

  if (type === ssh.MSG_CHANNEL_FAILURE) {
    throw giveUp('The server refused to run the command');
  }

  if (type === ssh.MSG_CHANNEL_CLOSE) {
    break;
  }

  if (type === ssh.MSG_CHANNEL_REQUEST && request === 'exit-status') {
    exitStatus = reported;
  }

  if (type === ssh.MSG_CHANNEL_DATA || type === ssh.MSG_CHANNEL_EXTENDED_DATA) {
    const output = dataType === ssh.EXTENDED_DATA_STDERR ? process.stderr : process.stdout;
    output.write(data);
    send({ type: ssh.MSG_CHANNEL_WINDOW_ADJUST, recipientChannel: theirChannel, bytesToAdd: data.length });
  }
}

send({ type: ssh.MSG_CHANNEL_CLOSE, recipientChannel: theirChannel });
send({ type: ssh.MSG_DISCONNECT, reason: ssh.DISCONNECT_BY_APPLICATION, description: 'done' });
connection.end();

process.exitCode = exitStatus ?? 255;
```

```
$ SSH_KEY=./user_key node ssh.js root@127.0.0.1:2222 'uname -sr; uptime'
OpenSSH_9.2p1, host key ssh-ed25519 SHA256:cobLzBwqL+CMvHY4Kd/yF+HH3GpzIw1FaY9ytx9ljGk
Linux 6.12.76-linuxkit
 22:37:56 up 0 min,  0 user,  load average: 0.23, 0.05, 0.02
```

The first line goes to stderr, the output of the command to stdout and stderr as the command wrote it, and the exit status of the command becomes the exit status of the script.

- The algorithms are fixed: `curve25519-sha256`, an `ssh-ed25519` host key, `aes256-gcm@openssh.com`. A server without one of them answers the offer with a disconnect, which the script prints. With that cipher the length of a packet stays readable and the rest is sealed, so `SSH.take` cuts the stream and leaves the 16 byte tag in `trailer`.
- The host key is proven, not trusted: the signature shows the server owns the key, and the fingerprint on the first line is the one `ssh-keygen -lf` prints. Compare it yourself, nothing is read from `known_hosts`.
- The exchange hash covers both identification lines and both `KEXINIT` payloads byte for byte, and the login signature covers the request, so a successful run proves the messages built here are exactly what the server read.
- In a capture the same layer reads the unencrypted part of the conversation: `packet.layers.SSH` under TCP port 22, one entry per message when a segment carries several.
