const { strict: assert } = require('node:assert');
const test = require('node:test');

const defaults = require('#lib/defaults');
const { Packet } = require('#lib/packet');
const { BpfFilter } = require('#lib/bpfFilter');

const pktBuf = () => 
  Buffer.from('424242424242424242424242080045000034000040004006a79ac0a80165a5162c06cd8e5debee16992ebea89919801008000d1200000101080a52d3c650dd04cdd6', 'hex');

test('BPF filter', async (t) => {
  assert.throws(() => new BpfFilter('hello how are you'));

  const pkt = new Packet({
    buffer: pktBuf(),
  });

  console.time('match tcp');
  assert.ok(new BpfFilter('tcp port 52622').match(pkt));
  console.timeEnd('match tcp');

  console.time('negative match tcp');
  assert.ok(!(new BpfFilter('tcp port 80').match(pkt)));
  console.timeEnd('negative match tcp');

  console.time('match ip');
  assert.ok(new BpfFilter('ip src 192.168.1.101').match(pkt));
  console.timeEnd('match ip');

  console.time('negative match ip');
  assert.ok(!new BpfFilter('ip src 127.0.0.1').match(pkt));
  console.timeEnd('negative match ip');
});
