import { strict as assert } from 'node:assert';
import test from 'node:test';
import os from 'node:os';

import { LiveDevice } from '#lib/liveDevice';
import { Packet } from '#lib/packet';

test('LiveDevice', (t) => {
  const [ifaceName] = Object.entries(os.networkInterfaces()).find(([name, data]) => {
    if (data.some(e => e.internal)) return true;
    return false;
  }) ?? [];

  if (!ifaceName) return;

  try {
    const dev = new LiveDevice({ iface: 'anpi1' });

    dev.on('error', err => {
      console.log('caught error', err.message);
    });

    const { iface } = dev;

    console.log('iface', iface);

    assert.ok(iface.hasOwnProperty('name'));
    assert.ok(iface.hasOwnProperty('description'));
    assert.ok(iface.hasOwnProperty('mac'));
    assert.ok(iface.hasOwnProperty('gateway'));
    assert.ok(iface.hasOwnProperty('mtu'));
    assert.ok(iface.hasOwnProperty('linktype'));
    assert.ok(iface.hasOwnProperty('dnsServers'));
    assert.ok(iface.hasOwnProperty('addresses'));

    dev.destroy();
  } catch(err) {
    console.log('try-catch', err);
  }
});
