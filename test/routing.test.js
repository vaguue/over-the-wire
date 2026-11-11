import { strict as assert } from 'node:assert';
import test from 'node:test';

import { getRoutingTable } from '#lib/routing';

test('getRoutingTable', async (t) => {
  const table = await getRoutingTable();
  console.log('[*] Routing table', JSON.stringify(table, null, 2));
  assert.equal(typeof table, 'object');
  Object.keys(table).forEach(iface => {
    table[iface].forEach(rec => {
      assert.equal(typeof rec.destination, 'string');
      assert.equal(typeof rec.gateway, 'string');
      assert.equal(typeof rec.prefixLength, 'number');
    });
  });
});
