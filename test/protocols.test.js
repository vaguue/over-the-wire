import { strict as assert } from 'node:assert';
import test from 'node:test';

import otw, { Packet, PacketBuilder, FilterBuilder, Pcap, pcap, protocols, registerLayer, icmp, icmpv6, dns, tcp, udp, arp, ethernet, ipv4, ipv6 } from '#lib/index';
import { layers } from '#lib/layers/index';
import { protocolFor } from '#lib/protocols';
import { makeLayer, attach, constantName } from '#lib/layers/define';
import { renderDocs } from '#lib/cli/docs';

const ETHERNET = { linktype: 1 };

test('protocol namespaces carry the numbers the fields take', () => {
  assert.equal(icmp.ECHO_REQUEST, 8);
  assert.equal(icmp.ECHO_REPLY, 0);
  assert.equal(icmp.TIME_EXCEEDED, 11);
  assert.equal(icmp.CODE_PORT_UNREACHABLE, 3);
  assert.equal(icmpv6.ECHO_REQUEST, 128);
  assert.equal(dns.TYPE_A, 1);
  assert.equal(dns.TYPE_AAAA, 28);
  assert.equal(dns.PORT, 53);
  assert.equal(tcp.PORT_SSH, 22);
  assert.equal(udp.PORT_DNS, 53);
  assert.equal(arp.WHO_HAS, 'who-has');
  assert.equal(ethernet.BROADCAST, 'ff:ff:ff:ff:ff:ff');
  assert.equal(ethernet.TYPE_IPV4, 0x0800);
  assert.equal(ethernet.TYPE_IEEE_802_1AD, 0x88a8);
  assert.equal(ipv4.PROTOCOL_TCP, 6);
  assert.equal(ipv6.NEXT_HEADER_ICMPV6, 58);
});

test('namespaces are frozen and reachable from the default export', () => {
  assert.ok(Object.isFrozen(icmp));
  assert.equal(otw.icmp, icmp);
  assert.equal(otw.dns, dns);
});

test('every namespace describes a registered layer and only fields that exist or are documented', () => {
  for (const protocol of Object.values(protocols)) {
    assert.equal(typeof layers[protocol.layer], 'function', protocol.layer);
    assert.equal(typeof Packet.prototype[protocol.name], 'function', protocol.name);
    assert.ok(protocol.summary.length > 0);
  }
});

test('constant names are derived from the existing enums', () => {
  assert.equal(constantName('EchoRequest'), 'ECHO_REQUEST');
  assert.equal(constantName('MTUProbe'), 'MTU_PROBE');
  assert.equal(constantName('IEEE_802_1AD'), 'IEEE_802_1AD');
});

test('constants build and match packets', () => {
  const request = new Packet({ iface: ETHERNET })
    .ethernet({ dst: ethernet.BROADCAST })
    .ipv4({ src: '10.0.0.1', dst: '10.0.0.2' })
    .icmp({ type: icmp.ECHO_REQUEST, id: 1, sequence: 1 });

  const parsed = new Packet({ buffer: request.buffer, iface: ETHERNET });

  assert.equal(parsed.layers.ICMP.typeName, 'EchoRequest');
  assert.equal(parsed.layers.IPv4.protocol, ipv4.PROTOCOL_ICMP);
  assert.equal(parsed.layers.Ethernet.type, ethernet.TYPE_IPV4);
  assert.ok(new FilterBuilder().icmp({ type: [icmp.ECHO_REQUEST, icmp.ECHO_REPLY] }).matches(parsed));
  assert.ok(!new FilterBuilder().icmp({ type: icmp.TIME_EXCEEDED }).matches(parsed));
});

test('an ICMP layer described without a type is an echo request', () => {
  const built = new Packet({ iface: ETHERNET })
    .ethernet()
    .ipv4({ src: '10.0.0.1', dst: '10.0.0.2' })
    .icmp({ id: 7, sequence: 2 });

  const { type, id, sequence } = built.layers.ICMP.toObject();

  assert.deepEqual({ type, id, sequence }, { type: icmp.ECHO_REQUEST, id: 7, sequence: 2 });
  assert.equal(new Packet({ iface: ETHERNET }).ethernet().ipv4().icmp().layers.ICMP.type, icmp.ECHO_REQUEST);
});

test('protocols are found by namespace or layer name', () => {
  assert.equal(protocolFor('ICMP').name, 'icmp');
  assert.equal(protocolFor('ipv4').layer, 'IPv4');
  assert.equal(protocolFor('nothing'), null);
});

test('a registered layer is described by its struct comments', () => {
  const { Layer } = makeLayer('Heartbeat', `
    //@NE Heartbeat, made up for the test. Tells the other side we are alive.
    struct HeartbeatHeader {
      // What is being said, one of heartbeat.KIND_*.
      uint8_t kind;
      //@LE Counter that grows with every beat.
      uint16_t counter:12;
      uint8_t reserved[3];
    } __attribute__(packed);
  `);

  attach.docs(Layer, {
    fields: { age: 'Read only: seconds since the first beat.' },
    constants: [{ title: 'Kinds', field: 'kind', values: { KIND_PING: 1, KIND_PONG: 2 } }],
  });

  registerLayer(Layer);

  const described = protocols.heartbeat;

  assert.equal(described.title, 'Heartbeat, made up for the test');
  assert.equal(described.summary, 'Tells the other side we are alive.');
  assert.deepEqual(described.fields, [
    { name: 'kind', type: 'uint8_t', description: 'What is being said, one of heartbeat.KIND_*.' },
    { name: 'counter', type: 'uint16_t:12', description: 'Counter that grows with every beat.' },
    { name: 'reserved', type: 'uint8_t[3]', description: '' },
    { name: 'age', type: 'computed', description: 'Read only: seconds since the first beat.' },
  ]);
  assert.deepEqual(described.namespace, { KIND_PING: 1, KIND_PONG: 2 });
  assert.match(renderDocs('heartbeat'), /heartbeat\.KIND_PONG\s+2/);

  delete protocols.heartbeat;
});

test('a layer without comments is still described from its struct', () => {
  const { Layer } = makeLayer('Bare', `
    struct BareHeader {
      uint32_t value;
    };
  `);

  registerLayer(Layer);

  assert.equal(protocols.bare.title, 'Bare');
  assert.deepEqual(protocols.bare.fields, [{ name: 'value', type: 'uint32_t', description: '' }]);
  assert.deepEqual(protocols.bare.namespace, {});

  delete protocols.bare;
});

test('pcap is the lowercase name of the capture file and device namespace', () => {
  assert.equal(pcap, Pcap);
  assert.equal(otw.pcap, otw.Pcap);
});

test('short names are the same functions as the long ones', () => {
  const wire = otw();

  assert.ok(wire.p instanceof PacketBuilder);
  assert.notEqual(wire.p, wire.p);
  assert.ok(wire.f instanceof FilterBuilder);
  assert.equal(wire.p.ipv4({ src: '10.0.0.1', dst: '10.0.0.2' }).udp({ src: 1, dst: 2 }).buffer.length, 28);
  assert.equal(String(wire.f.icmp({ type: icmp.ECHO_REPLY })), 'icmp and icmp[icmptype] = 0');
  assert.equal(wire.c, wire.capture);
  assert.equal(wire.s, wire.send);

  const sending = wire.s(new Packet({ iface: ETHERNET }).ethernet());

  assert.equal(sending.ex, sending.expect);
});

test('packets and filters print a one-line summary', async () => {
  const { inspect } = await import('node:util');

  const built = new Packet({ iface: ETHERNET })
    .ethernet({ src: 'aa:aa:aa:aa:aa:01', dst: 'aa:aa:aa:aa:aa:02' })
    .ipv4({ src: '10.0.0.1', dst: '10.0.0.2' })
    .udp({ src: 40000, dst: dns.PORT });

  assert.equal(inspect(built), '<Packet 42 bytes | Ethernet aa:aa:aa:aa:aa:01 > aa:aa:aa:aa:aa:02 / IPv4 10.0.0.1 > 10.0.0.2 / UDP 40000 > 53>');
  assert.equal(inspect(new Packet()), '<Packet 0 bytes>');
  assert.equal(inspect(new FilterBuilder().udp({ port: dns.PORT })), '<Filter udp and udp port 53>');
});
