const { strict: assert } = require('node:assert');
const test = require('node:test');

const { extendAt, shrinkAt } = require('#lib/buffer');
const { Ethernet } = require('#lib/layers/Ethernet');

test('Ethernet', async (t) => {
  const eth = new Ethernet(Buffer.from('00ebd8f4bbe75ce91e9dfc40080045000073000040', 'hex'));
  console.log(eth.toObject());
  eth.src = eth.dst;
  assert.deepEqual(eth.toObject(), { dst: '00:eb:d8:f4:bb:e7', src: '00:eb:d8:f4:bb:e7', type: 2048 });
});
