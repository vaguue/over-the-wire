import { strict as assert } from 'node:assert';
import test from 'node:test';

import { gatewayFor } from '#lib/gateway';

const routes = {
  bridge100: [
    { destination: 'default', gateway: 'link#26', prefixLength: 0, family: 'AF_LINK', flags: ['U', 'C', 'S', 'I'] },
    { destination: '192.168.64.0', gateway: 'link#26', prefixLength: 24, family: 'AF_INET', flags: ['U', 'C'] },
  ],
  en0: [
    { destination: 'default', gateway: '192.168.1.1', prefixLength: 0, family: 'AF_INET', flags: ['U', 'G', 'S'] },
    { destination: 'default', gateway: 'fe80::1', prefixLength: 0, family: 'AF_INET6', flags: ['U', 'G'] },
  ],
};

test('a link-level default route is not the default gateway', async () => {
  assert.deepEqual(await gatewayFor(null, { routes }), { iface: 'en0', ip: '192.168.1.1', family: 'AF_INET' });
});

test('a link-level default route does not carry IP destinations', async () => {
  assert.equal((await gatewayFor('8.8.8.8', { routes })).iface, 'en0');
  assert.equal((await gatewayFor('2001:4860:4860::8888', { routes })).iface, 'en0');
  assert.equal((await gatewayFor('192.168.64.7', { routes })).iface, 'bridge100');
});
