const { strict: assert } = require('node:assert');
const test = require('node:test');

const { extendAt, shrinkAt } = require('#lib/buffer');
const { Ethernet } = require('#lib/layers/Ethernet');

test('Ethernet', async (t) => {
  const eth = new Ethernet(Buffer.from('1111111111112222222222220800', 'hex'));
  eth.src = eth.dst;
  assert.deepEqual(eth.toObject(), { dst: '11:11:11:11:11:11', src: '11:11:11:11:11:11', type: 2048 });

  assert.deepEqual(eth.toObject(), new Ethernet(eth.toObject()).toObject());
  assert.deepEqual(new Ethernet(eth.toObject()).buffer, eth.buffer);
});
