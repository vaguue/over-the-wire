const { strict: assert } = require('node:assert');
const test = require('node:test');
const { DHCP } = require('#lib/layers/DHCP');

const dhcpBuf = Buffer.from([
  0x01, // opCode: BootRequest
  0x01, // hardwareType: Ethernet
  0x06, // hardwareAddressLength: 6
  0x00, // hops
  0xde, 0xad, 0xbe, 0xef, // transactionId
  0x00, 0x00, // secondsElapsed
  0x00, 0x00, // flags
  0x00, 0x00, 0x00, 0x00, // clientIpAddress
  0x00, 0x00, 0x00, 0x00, // yourIpAddress
  0x00, 0x00, 0x00, 0x00, // serverIpAddress
  0x00, 0x00, 0x00, 0x00, // gatewayIpAddress
  0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0,0,0,0,0,0,0,0,0,0, // clientHardwareAddress (MAC + padding)
  ...[...Buffer.from('my-server').toJSON().data, ...new Array(55).fill(0)], // serverName
  ...[...Buffer.from('my-bootfile').toJSON().data, ...new Array(117).fill(0)], // bootFilename
  0x63, 0x82, 0x53, 0x63 // magicNumber
]);

test('DHCP parse from buffer and roundtrip', async () => {
  const dhcp = new DHCP(dhcpBuf);
  assert.equal(dhcp.opCode, 1);
  assert.equal(dhcp.hardwareType, 1);
  assert.equal(dhcp.hardwareAddressLength, 6);
  assert.equal(dhcp.transactionId, 0xdeadbeef);
  assert.equal(dhcp.magicNumber, 0x63825363);

  const reparsed = new DHCP(dhcp.toObject());
  assert.equal(Buffer.compare(reparsed.buffer, dhcp.buffer), 0);
  assert.deepEqual(reparsed.toObject(), dhcp.toObject());
}); 

test('DHCP create with options', async () => {
  const dhcp = new DHCP({
    opCode: 1,
    hardwareType: 1,
    hardwareAddressLength: 6,
    hops: 0,
    transactionId: 3735928559,
    secondsElapsed: 0,
    flags: 0,
    clientIpAddress: '0.0.0.0',
    yourIpAddress: '0.0.0.0',
    serverIpAddress: 0,
    gatewayIpAddress: '0.0.0.0',
    clientHardwareAddress: '00:11:22:33:44:55',
    serverName: 'my-server',
    bootFilename: 'my-bootfile',
    magicNumber: 1669485411,
    options: [
      { type: 1 },
      { type: 1 },
      { type: 8, recLength: 10, value: Buffer.from([0x52, 0xd3, 0xc6, 0x50, 0xdd, 0x04, 0xcd, 0xd6]) }
    ],
  });

  dhcp.clientIpAddress = '42.42.42.42';
  dhcp.yourIpAddress = '1.2.3.4';

  const targetBuf = Buffer.from([1, 1, 6, 0, 222, 173, 190, 239, 0, 0, 0, 0, 42, 42, 42, 42, 1, 2, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 34, 51, 68, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 109, 121, 45, 115, 101, 114, 118, 101, 114, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 109, 121, 45, 98, 111, 111, 116, 102, 105, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99, 130, 83, 99, 1, 1, 8, 10, 82, 211, 198, 80, 221, 4, 205, 214]);

  assert.equal(Buffer.compare(dhcp.buffer, targetBuf), 0);
}); 
