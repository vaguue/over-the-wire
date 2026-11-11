const { strict: assert } = require('node:assert');
const test = require('node:test');

const defaults = require('#lib/defaults');
const { Packet } = require('#lib/packet');

const pktBuf = () => 
  Buffer.from('424242424242424242424242080045000034000040004006a79ac0a80165a5162c06cd8e5debee16992ebea89919801008000d1200000101080a52d3c650dd04cdd6', 'hex');

test('Packet parsing', async (t) => {
  const buffer = pktBuf();
  const pkt = new Packet({ buffer, iface: defaults });

  assert.deepEqual(pkt.toObject(), {
    iface: {
      snaplen: 65535,
      linktype: 1
    },
    layers: {
      Ethernet: {
        dst: '42:42:42:42:42:42',
        src: '42:42:42:42:42:42',
        type: 2048
      },
      IPv4: {
        headerLength: 5,
        version: 4,
        typeOfService: 0,
        totalLength: 52,
        id: 0,
        fragmentOffsetRaw: 64,
        timeToLive: 64,
        protocol: 6,
        checksum: 42906,
        src: '192.168.1.101',
        dst: '165.22.44.6',
        fragmentInfo: {
          isFragment: false,
          value: 0,
          flags: 64
        },
        options: []
      },
      TCP: {
        src: 52622,
        dst: 24043,
        seq: 3994458414,
        ack: 3198720281,
        dataOffset: 8,
        windowSize: 2048,
        checksum: 3346,
        urgentPointer: 0,
        flags: {
          reserved: 0,
          cwr: 0,
          ece: 0,
          urg: 0,
          ack: 1,
          psh: 0,
          rst: 0,
          syn: 0,
          fin: 0
        },
        options: [
          { type: 1 },
          { type: 1 },
          {
            type: 8,
            recLength: 10,
            value: Buffer.from([82, 211, 198, 80, 221, 4, 205, 214]),
          }
        ]
      }
    }
  });

});

test('Packet clone and compare', t => {
  const pkt = new Packet({ 
    buffer: pktBuf(),
    iface: defaults,
  });

  assert.ok(pkt.equals(pkt.clone()));
});

test('Packet building', t => {
  const pkt = new Packet({ iface: { linktype: 1, mtu: 1500 } })
                  .ethernet({ src: '42:42:42:42:42:42', dst: '42:42:42:42:42:42' })
                  .ipv4({ dst: '192.168.1.1' })
                  .payload({ data: Buffer.from('kek') });

  assert.equal(Buffer.compare(pkt.buffer, Buffer.from([0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x08, 0x00, 0x45, 0x00, 0x00, 0x17, 0x00, 0x00, 0x00, 0x00, 0x40, 0xff, 0xb8, 0x3f, 0x00, 0x00, 0x00, 0x00, 0xc0, 0xa8, 0x01, 0x01, 0x6b, 0x65, 0x6b])), 0);

  assert.deepEqual(pkt.toObject()?.layers, {
    Ethernet: { dst: '42:42:42:42:42:42', src: '42:42:42:42:42:42', type: 2048 },
    IPv4: {
      headerLength: 5,
      version: 4,
      typeOfService: 0,
      totalLength: 23,
      id: 0,
      fragmentOffsetRaw: 0,
      timeToLive: 64,
      protocol: 255,
      checksum: 47167,
      src: '0.0.0.0',
      dst: '192.168.1.1',
      fragmentInfo: { isFragment: false, value: 0, flags: 0 },
      options: []
    },
    Payload: { data: Buffer.from([0x6b, 0x65, 0x6b]) }
  })
});

test('Packet building and cloning', t => {
  const pkt = new Packet({ iface: { linktype: 1, mtu: 1500 } })
                  .ethernet({ src: '42:42:42:42:42:42', dst: '42:42:42:42:42:42' })
                  .ipv4({ dst: '192.168.1.1' })
                  .payload({ data: Buffer.from('kek') });

  const newPkt = pkt.clone();

  assert.deepEqual(pkt.toObject(), newPkt.toObject());
})

const base = () => new Packet({ iface: { linktype: 1, mtu: 1500 } })
  .ethernet({ src: '42:42:42:42:42:42', dst: '42:42:42:42:42:42' })
  .ipv4({ src: '10.0.0.1', dst: '10.0.0.2' });

test('Packet building keeps user-provided checksums', t => {
  const pkt = new Packet({ iface: { linktype: 1 } })
    .ethernet({})
    .ipv4({ src: '10.0.0.1', dst: '10.0.0.2', checksum: 0x1234 })
    .udp({ src: 1, dst: 2, checksum: 0x4321 });

  assert.equal(pkt.layers.IPv4.checksum, 0x1234);
  assert.equal(pkt.layers.UDP.checksum, 0x4321);

  // and still computes the ones that aren't provided
  const computed = base().udp({ src: 1, dst: 2 });
  assert.notEqual(computed.layers.IPv4.checksum, 0);
  assert.notEqual(computed.layers.UDP.checksum, 0);
});

test('Packet building: lengths cover all the following layers', t => {
  const v4 = base().udp({ src: 1, dst: 2 }).payload({ data: Buffer.from('hello') });
  assert.equal(v4.layers.IPv4.totalLength, 20 + 8 + 5);
  assert.equal(v4.layers.UDP.totalLength, 8 + 5);
  assert.equal(v4.buffer.length, 14 + 20 + 8 + 5);

  const v6 = new Packet({ iface: { linktype: 1 } })
    .ethernet({})
    .ipv6({ src: '2001:db8::1', dst: '2001:db8::2' })
    .udp({ src: 1, dst: 2 })
    .payload({ data: Buffer.from('hello') });
  assert.equal(v6.layers.IPv6.payloadLength, 8 + 5);

  // a layer builder can be called without arguments
  assert.equal(base().udp().buffer.length, 14 + 20 + 8);
});

test('Packet building: the same protocol twice', t => {
  const pkt = new Packet({ iface: { linktype: 1 } })
    .ethernet({})
    .ipv4({ src: '1.1.1.1', dst: '2.2.2.2', protocol: 4 })
    .ipv4({ src: '3.3.3.3', dst: '4.4.4.4' })
    .udp({ src: 1, dst: 2 });

  const [outer, inner] = pkt.layers.IPv4;
  assert.equal(outer.totalLength, 20 + 20 + 8);
  assert.equal(inner.totalLength, 20 + 8);
  assert.equal(outer.next, inner);
  assert.equal(inner.prev, outer);

  // parsing gives the same structure as building
  const parsed = new Packet({ buffer: pkt.buffer, iface: { linktype: 1 } });
  assert.ok(Array.isArray(parsed.layers.IPv4));
  assert.deepEqual(parsed.layers.IPv4.map(l => l.src), ['1.1.1.1', '3.3.3.3']);
  assert.equal(parsed.layers.Ethernet.next, parsed.layers.IPv4[0]);
  assert.equal(parsed.layers.IPv4[1].prev, parsed.layers.IPv4[0]);
  assert.deepEqual(parsed.toObject().layers, pkt.toObject().layers);
  assert.equal(parsed.toObject().layers.IPv4.length, 2);
});

test('Packet layers list stays consistent', t => {
  const pkt = base().udp({ src: 1, dst: 2 });
  pkt.buffer;

  assert.equal(pkt._layersCount, 3);
  assert.equal(pkt._layersHead, pkt.layers.Ethernet);
  assert.equal(pkt._layersTail, pkt.layers.UDP);
  assert.equal(pkt.layers.UDP.next, null);

  const names = [];
  pkt._eachLayerReverse(l => names.push(l.name));
  assert.deepEqual(names, ['UDP', 'IPv4', 'Ethernet']);

  const parsed = new Packet({ buffer: pkt.buffer, iface: { linktype: 1 } });
  assert.deepEqual(Object.keys(parsed.layers), ['Ethernet', 'IPv4', 'UDP']);
  assert.equal(parsed._layersCount, 3);
  assert.equal(parsed._layersTail, parsed.layers.UDP);
  assert.equal(parsed._layersTail.next, null);
  assert.deepEqual(Object.keys(parsed.toObject().layers), ['Ethernet', 'IPv4', 'UDP']);
});

test('Packet building: adding layers after a build', t => {
  const pkt = base();
  assert.equal(pkt.buffer.length, 14 + 20);

  pkt.udp({ src: 1, dst: 2 }).payload({ data: Buffer.from('abc') });
  assert.equal(pkt.buffer.length, 14 + 20 + 8 + 3);

  assert.deepEqual(Object.keys(pkt.layers), ['Ethernet', 'IPv4', 'UDP', 'Payload']);
  assert.equal(pkt._layersHead, pkt.layers.Ethernet);
  assert.equal(pkt._layersCount, 4);
  assert.equal(pkt.layers.IPv4.next, pkt.layers.UDP);

  // every layer is a view over the packet buffer
  pkt.layers.IPv4.timeToLive = 9;
  pkt.layers.UDP.dst = 0x1234;
  assert.equal(pkt.buffer[14 + 8], 9);
  assert.equal(pkt.buffer.readUInt16BE(14 + 20 + 2), 0x1234);
  assert.equal(pkt.buffer.subarray(14 + 20 + 8).toString(), 'abc');
});

test('Packet clone', async t => {
  await t.test('of a packet that was never parsed', () => {
    const pkt = new Packet({ buffer: pktBuf(), iface: defaults });
    const clone = pkt.clone();
    assert.deepEqual(Object.keys(clone.layers), ['Ethernet', 'IPv4', 'TCP']);
    assert.deepEqual(clone.toObject(), pkt.toObject());
  });

  await t.test('layers are views over the cloned buffer', () => {
    const pkt = new Packet({ buffer: pktBuf(), iface: defaults });
    pkt.layers;
    const clone = pkt.clone();

    assert.deepEqual(Object.keys(clone.layers), ['Ethernet', 'IPv4', 'TCP']);
    assert.equal(clone._layersCount, 3);

    clone.layers.IPv4.timeToLive = 7;
    clone.layers.TCP.dst = 80;
    assert.equal(clone.buffer[14 + 8], 7);
    assert.equal(clone.buffer.readUInt16BE(14 + 20 + 2), 80);

    // the original is untouched
    assert.equal(pkt.layers.IPv4.timeToLive, 64);
    assert.deepEqual(pkt.buffer, pktBuf());
  });

  await t.test('of a built packet', () => {
    const pkt = base().udp({ src: 1, dst: 2 }).payload({ data: Buffer.from('abc') });
    const clone = pkt.clone();
    assert.deepEqual(clone.buffer, pkt.buffer);
    assert.deepEqual(clone.toObject(), pkt.toObject());
    assert.equal(clone.layers.Payload.length, 3);
  });
});

test('Packet equals', t => {
  const pkt = new Packet({ buffer: pktBuf(), iface: defaults });
  assert.equal(pkt.equals({}), false);
  assert.equal(pkt.equals(null), false);
  assert.equal(pkt.equals(pkt.clone()), true);
});

test('IPv4 fragment helpers', t => {
  const pkt = base().payload({ data: Buffer.from('abc') });
  assert.equal(pkt.layers.IPv4.isFragment, false);
  assert.equal(pkt.layers.IPv4.isFirstFragment, false);
  assert.equal(pkt.layers.IPv4.isLastFragment, false);
});

test('Packet builder methods are lowercase, PascalCase still works', t => {
  const lower = new Packet({ iface: { linktype: 1 } })
    .ethernet({ src: '42:42:42:42:42:42' })
    .ipv4({ src: '10.0.0.1', dst: '10.0.0.2' })
    .udp({ src: 1, dst: 2 });

  const pascal = new Packet({ iface: { linktype: 1 } })
    .Ethernet({ src: '42:42:42:42:42:42' })
    .IPv4({ src: '10.0.0.1', dst: '10.0.0.2' })
    .UDP({ src: 1, dst: 2 });

  assert.deepEqual(lower.buffer, pascal.buffer);
  // layers keep the protocol's own name
  assert.deepEqual(Object.keys(lower.layers), ['Ethernet', 'IPv4', 'UDP']);

  for (const name of ['ethernet', 'ipv4', 'ipv6', 'tcp', 'udp', 'arp', 'icmp', 'icmpv6', 'dhcp', 'vlan', 'gre', 'ntp', 'dns', 'payload']) {
    assert.equal(typeof Packet.prototype[name], 'function', name);
  }
});

test('Packet parsing a truncated capture', t => {
  const full = base().udp({ src: 1, dst: 2 }).payload({ data: Buffer.from('abc') }).buffer;

  const cutInsideIp = new Packet({ buffer: full.subarray(0, 20), iface: { linktype: 1 } });
  assert.deepEqual(Object.keys(cutInsideIp.layers), ['Ethernet', 'Payload']);
  assert.equal(cutInsideIp.layers.Payload.length, 6);

  const cutInsideEthernet = new Packet({ buffer: full.subarray(0, 5), iface: { linktype: 1 } });
  assert.deepEqual(Object.keys(cutInsideEthernet.layers), ['Payload']);

  const cutInsideUdp = new Packet({ buffer: full.subarray(0, 14 + 20 + 3), iface: { linktype: 1 } });
  assert.deepEqual(Object.keys(cutInsideUdp.layers), ['Ethernet', 'IPv4', 'Payload']);
  assert.doesNotThrow(() => cutInsideUdp.toObject());
});

test('Packet building: a single VLAN tag uses 802.1Q', t => {
  const pkt = new Packet({ iface: { linktype: 1 } })
    .ethernet({})
    .vlan({ vid: 5 })
    .ipv4({ src: '10.0.0.1', dst: '10.0.0.2' });

  assert.equal(pkt.layers.Ethernet.type, 0x8100);
  assert.equal(pkt.layers.Vlan.etherType, 0x0800);
});

const internetChecksumIsValid = (...buffers) => {
  const bytes = Buffer.concat(buffers);
  const padded = bytes.length % 2 === 0 ? bytes : Buffer.concat([bytes, Buffer.alloc(1)]);
  let sum = 0;

  for (let offset = 0; offset < padded.length; offset += 2) {
    sum += padded.readUInt16BE(offset);
  }

  while (sum > 0xffff) {
    sum = (sum & 0xffff) + (sum >>> 16);
  }

  return sum === 0xffff;
};

test('Packet building: ICMP checksum covers the payload', t => {
  for (const data of ['abc', 'abcd', '']) {
    const pkt = base()
      .icmp({ type: 8, id: 1, sequence: 2 })
      .payload({ data: Buffer.from(data) });

    assert.ok(internetChecksumIsValid(pkt.buffer.subarray(14 + 20)), `payload "${data}"`);
  }
});

test('Packet building: ICMPv6 checksum', t => {
  const pkt = new Packet({ iface: { linktype: 1 } })
    .ethernet({})
    .ipv6({ src: '2001:db8::1', dst: '2001:db8::2' })
    .icmpv6({ type: 128, id: 1, sequence: 2 })
    .payload({ data: Buffer.from('abc') });

  const message = pkt.buffer.subarray(14 + 40);
  const pseudoHeader = Buffer.alloc(40);
  pkt.buffer.copy(pseudoHeader, 0, 14 + 8, 14 + 40);
  pseudoHeader.writeUInt32BE(message.length, 32);
  pseudoHeader[39] = 58;

  assert.notEqual(pkt.layers.ICMPv6.checksum, 0);
  assert.ok(internetChecksumIsValid(pseudoHeader, message));
  assert.equal(pkt.layers.IPv6.nextHeader, 58);
});

test('Packet building: recalculating a checksum ignores the old value', t => {
  const pkt = base().udp({ src: 1, dst: 2 }).payload({ data: Buffer.from('abc') });
  const { checksum: ipChecksum } = pkt.layers.IPv4;
  const { checksum: udpChecksum } = pkt.layers.UDP;

  pkt.layers.IPv4.calculateChecksum();
  pkt.layers.UDP.calculateChecksum();

  assert.equal(pkt.layers.IPv4.checksum, ipChecksum);
  assert.equal(pkt.layers.UDP.checksum, udpChecksum);
});

test('Packet building: a transport layer without an IP layer below it', t => {
  const pkt = new Packet({ iface: { linktype: 1 } })
    .ethernet({})
    .udp({ src: 1, dst: 2 });

  assert.equal(pkt.buffer.length, 14 + 8);
  assert.equal(pkt.layers.UDP.checksum, 0);
});
