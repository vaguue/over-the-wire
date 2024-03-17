const { strict: assert } = require('node:assert');
const test = require('node:test');

const { getRoutingTable } = require('#lib/routing');

test('getRoutingTable', async (t) => {
  const table = await getRoutingTable();
  assert.equal(typeof table, 'object');
  Object.keys(table).forEach(iface => {
    table[iface].forEach(rec => {
      assert.equal(typeof rec.destination, 'string');
      assert.equal(typeof rec.gateway, 'string');
      assert.equal(typeof rec.mask, 'string');
    });
  });
});
