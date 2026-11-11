import { strict as assert } from 'node:assert';
import test from 'node:test';

import { ARP } from '#lib/layers/ARP';

test('Arp', async (t) => {
  const arp = new ARP(Buffer.from('0001080006040001424242424242c0a80182000000000000c0a80102', 'hex'));
  assert.deepEqual(arp.toObject(), {
    hardwareType: 1,
    protocolType: 2048,
    hardwareLength: 6,
    protocolLength: 4,
    opcode: 'who-has',
    hardwareSrc: '42:42:42:42:42:42',
    protocolSrc: '192.168.1.130',
    hardwareDst: '00:00:00:00:00:00',
    protocolDst: '192.168.1.2'
  });

  assert.deepEqual(arp.toObject(), new ARP(arp.toObject()).toObject());
  assert.deepEqual(new ARP(arp.toObject()).buffer, arp.buffer);
});
