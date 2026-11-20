`ssh-keyscan`, with proof: a programmable SSH client that goes as far as the key exchange. It reads what the server offers, performs a `curve25519-sha256` exchange, checks the server's signature over the exchange hash and prints the host key fingerprint, the same one `ssh-keygen -lf` shows. Nothing is authenticated or executed on the server.

The messages are `SSH` layers. The TCP connection is Node's.

```javascript
import net from 'node:net';
import crypto from 'node:crypto';

import { layers, ssh } from 'over-the-wire';

const { SSH } = layers;

const host = process.argv[2] ?? '127.0.0.1';
const port = Number(process.argv[3] ?? ssh.PORT);
const TIMEOUT_MS = 5000;

const connection = net.connect(port, host);
const received = [];
let unread = Buffer.alloc(0);
let wakeReader = null;

connection.on('data', (chunk) => {
  const { messages, rest } = SSH.split(Buffer.concat([unread, chunk]));
  unread = rest;
  received.push(...messages);
  wakeReader?.();
});

const nextMessage = async () => {
  const deadline = setTimeout(() => {
    connection.destroy(new Error(`No answer from ${host}:${port} within ${TIMEOUT_MS} ms`));
  }, TIMEOUT_MS);

  while (received.length === 0) {
    await new Promise((resolve, reject) => {
      wakeReader = resolve;
      connection.once('error', reject);
      connection.once('close', () => reject(new Error('The server closed the connection')));
    });
  }

  clearTimeout(deadline);

  const message = received.shift();

  if (message.type === ssh.MSG_DISCONNECT) {
    throw new Error(`The server disconnected: ${message.description}`);
  }

  return message;
};

const send = (description) => {
  const message = new SSH(description);
  connection.write(message.buffer);
  return message;
};

const ours = send({ softwareVersion: 'over_the_wire_keyscan' });
const theirs = await nextMessage();

const ourOffer = send({
  type: ssh.MSG_KEXINIT,
  kexAlgorithms: ['curve25519-sha256'],
  serverHostKeyAlgorithms: ['ssh-ed25519'],
  encryptionClientToServer: ['aes128-ctr'],
  encryptionServerToClient: ['aes128-ctr'],
  macClientToServer: ['hmac-sha2-256'],
  macServerToClient: ['hmac-sha2-256'],
  compressionClientToServer: ['none'],
  compressionServerToClient: ['none'],
});

const theirOffer = await nextMessage();

const ephemeral = crypto.generateKeyPairSync('x25519');
const ourPublicKey = Buffer.from(ephemeral.publicKey.export({ format: 'jwk' }).x, 'base64url');

send({ type: ssh.MSG_KEX_ECDH_INIT, publicKey: ourPublicKey });

const reply = await nextMessage();
const newKeys = await nextMessage();

const theirPublicKey = crypto.createPublicKey({
  key: { kty: 'OKP', crv: 'X25519', x: reply.publicKey.toString('base64url') },
  format: 'jwk',
});

const sharedSecret = crypto.diffieHellman({ privateKey: ephemeral.privateKey, publicKey: theirPublicKey });

const exchangeHash = crypto.createHash('sha256')
  .update(SSH.string(ours.identification))
  .update(SSH.string(theirs.identification))
  .update(SSH.string(ourOffer.payload))
  .update(SSH.string(theirOffer.payload))
  .update(SSH.string(reply.hostKey))
  .update(SSH.string(ourPublicKey))
  .update(SSH.string(reply.publicKey))
  .update(SSH.mpint(sharedSecret))
  .digest();

const lengthPrefixed = (blob) => {
  const fields = [];

  for (let offset = 0; offset < blob.length;) {
    const length = blob.readUInt32BE(offset);
    fields.push(blob.subarray(offset + 4, offset + 4 + length));
    offset += 4 + length;
  }

  return fields;
};

const [keyType, keyBytes] = lengthPrefixed(reply.hostKey);
const [, signatureBytes] = lengthPrefixed(reply.signature);

const hostKey = crypto.createPublicKey({
  key: { kty: 'OKP', crv: 'Ed25519', x: keyBytes.toString('base64url') },
  format: 'jwk',
});

const signedByTheHostKey = crypto.verify(null, exchangeHash, hostKey, signatureBytes);
const fingerprint = crypto.createHash('sha256').update(reply.hostKey).digest('base64').replace(/=+$/, '');

console.log(`server      ${theirs.softwareVersion}`);
console.log(`host key    ${keyType} SHA256:${fingerprint}`);
console.log(`signature   ${signedByTheHostKey ? 'verified' : 'DOES NOT MATCH'}`);
console.log(`new keys    ${newKeys.type === ssh.MSG_NEWKEYS ? 'accepted' : 'missing'}`);
console.log(`kex         ${theirOffer.kexAlgorithms.join(' ')}`);
console.log(`host keys   ${theirOffer.serverHostKeyAlgorithms.join(' ')}`);
console.log(`ciphers     ${theirOffer.encryptionServerToClient.join(' ')}`);
console.log(`macs        ${theirOffer.macServerToClient.join(' ')}`);

send({ type: ssh.MSG_DISCONNECT, reason: ssh.DISCONNECT_BY_APPLICATION, description: 'done' });
connection.end();

process.exitCode = signedByTheHostKey ? 0 : 1;
```

The exchange hash covers both identification lines and both `KEXINIT` payloads byte for byte, so a verified signature also proves that the messages built here are exactly what the server read.

A server without an Ed25519 host key answers the offer with a disconnect, which the script prints. The same layer reads these messages out of a capture: `packet.layers.SSH` under TCP port 22, one entry per message when a segment carries several.
