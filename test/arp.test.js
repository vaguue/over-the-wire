const { strict: assert } = require('node:assert');
const test = require('node:test');

const { getArpTable } = require('#lib/arp');

test('getArpTable', async (t) => {
  const arp = await getArpTable();
  assert.equal(typeof arp, 'object');
  Object.keys(arp).forEach(iface => {
    arp[iface].forEach(rec => {
      assert.equal(typeof rec.ipAddr, 'string');
      assert.equal(typeof rec.hwAddr, 'string');
    });
  });
});
