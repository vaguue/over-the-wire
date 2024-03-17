const { strict: assert } = require('node:assert');
const test = require('node:test');

const { inetPton, inetNtop, htonl, ntohl, htons, ntohs } = require('#lib/converters');
const socket = require('#lib/socket');

test('Address family', async (t) => {
  const ipv4 = '192.168.1.1';
  assert.equal(Buffer.compare(inetPton(ipv4), Buffer.from([0xc0, 0xa8, 0x01, 0x01])), 0);
  assert.equal(inetNtop(inetPton(ipv4)), ipv4);

  const ipv6 = 'e2fd:8a06:db3b:4cd0:a9da:30c7:c5de:9be8';
  assert.equal(Buffer.compare(inetPton(ipv6), Buffer.from([0xe2, 0xfd, 0x8a, 0x06, 0xdb, 0x3b, 0x4c, 0xd0, 0xa9, 0xda, 0x30, 0xc7, 0xc5, 0xde, 0x9b, 0xe8])), 0);
  assert.equal(inetNtop(socket.AF_INET6, inetPton(ipv6)), ipv6);

  assert.equal(ntohs(htons(0xAABB)), 0xAABB);
  assert.equal(ntohl(htonl(0xAABB)), 0xAABB);
});
