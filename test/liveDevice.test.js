const { strict: assert } = require('node:assert');
const test = require('node:test');
const os = require('node:os');

const { LiveDevice } = require('#lib/liveDevice');
const { Packet } = require('#lib/packet');

test('LiveDevice', (t) => {
  const [ifaceName] = Object.entries(os.networkInterfaces()).find(([name, data]) => {
    if (data.some(e => e.internal)) return true;
    return false;
  }) ?? [];

  console.log('os.networkInterfaces()', os.networkInterfaces());
  console.log('ifaceName', ifaceName);

  if (!ifaceName) return;

  const dev = new LiveDevice({ iface: ifaceName });

  const { iface } = dev;

  assert.ok(iface.hasOwnProperty('name'));
  assert.ok(iface.hasOwnProperty('description'));
  assert.ok(iface.hasOwnProperty('mac'));
  assert.ok(iface.hasOwnProperty('gateway'));
  assert.ok(iface.hasOwnProperty('mtu'));
  assert.ok(iface.hasOwnProperty('linktype'));
  assert.ok(iface.hasOwnProperty('dnsServers'));
  assert.ok(iface.hasOwnProperty('addresses'));

  dev.destroy();
});
