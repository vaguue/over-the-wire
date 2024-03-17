const { strict: assert } = require('node:assert');
const test = require('node:test');

const { defaultFamily, updateDomain } = require('#lib/af');
const { socket } = require('#lib/bindings');

test('Address family', async (t) => {
  assert.equal(defaultFamily('192.168.1.1'), socket.AF_INET);
  assert.equal(defaultFamily('e61a:6e95:fad2:a2c9:7f09:7ab7:e009:b719'), socket.AF_INET6);
  assert.throws(() => defaultFamily('kek'));

  const obj = {};
  updateDomain(obj, '192.168.1.1');
  assert.equal(obj.domain, socket.AF_INET);
});
