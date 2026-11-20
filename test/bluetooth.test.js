import { strict as assert } from 'node:assert';
import test from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import otw, { Packet, PacketBuilder, FilterBuilder, BluetoothWire, LinkLayerType, hci, hcidirection, hcicommand, hcievent, acl, l2cap, att } from '#lib/index';
import { addressToString, addressFromString, uuidToString, uuidFromString } from '#lib/layers/bluetooth';

const PACKAGE_ROOT = path.dirname(fileURLToPath(import.meta.resolve('over-the-wire/package.json')));

const H4 = { linktype: LinkLayerType.LINKTYPE_BLUETOOTH_HCI_H4 };
const H4_WITH_DIRECTION = { linktype: LinkLayerType.LINKTYPE_BLUETOOTH_HCI_H4_WITH_PHDR };

const hex = (text) => {
  return Buffer.from(text.replace(/\s+/g, ''), 'hex');
};

const WRITE_REQUEST = hex('02 40 20 0a 00 06 00 04 00 12 25 00 01 02 03');

const ADVERTISING_REPORT = hex(`
  04 3e 17
  02 01
  00 00 66 55 44 33 22 11
  0b 02 01 06 07 09 53 65 6e 73 6f 72
  c4
`);

const reportsFrom = (packet) => {
  return packet.layers.HCIEvent.advertisingReports;
};

test('addresses and UUIDs are little-endian on the wire', () => {
  assert.equal(addressToString(hex('66 55 44 33 22 11')), '11:22:33:44:55:66');
  assert.deepEqual(addressFromString('11:22:33:44:55:66'), hex('66 55 44 33 22 11'));
  assert.equal(uuidToString(hex('00 2a')), '2a00');
  assert.deepEqual(uuidFromString('2a00'), hex('00 2a'));
  assert.equal(uuidToString(uuidFromString('6e400001-b5a3-f393-e0a9-e50e24dcca9e')), '6e400001-b5a3-f393-e0a9-e50e24dcca9e');
});

test('an ATT write is read out of an HCI capture', () => {
  const packet = new Packet({ buffer: WRITE_REQUEST, iface: H4 });

  assert.deepEqual(Object.keys(packet.layers), ['HCI', 'ACL', 'L2CAP', 'ATT']);
  assert.equal(packet.layers.HCI.type, hci.TYPE_ACL);
  assert.deepEqual(packet.layers.ACL.toObject(), { handle: 0x40, packetBoundary: acl.BOUNDARY_FIRST_FLUSHABLE, broadcast: 0, dataLength: 10 });
  assert.deepEqual(packet.layers.L2CAP.toObject(), { payloadLength: 6, cid: l2cap.CID_ATT });
  assert.equal(packet.layers.ATT.opcode, att.WRITE_REQUEST);
  assert.equal(packet.layers.ATT.opcodeName, 'WRITE_REQUEST');
  assert.equal(packet.layers.ATT.handle, 0x25);
  assert.deepEqual(packet.layers.ATT.value, hex('01 02 03'));
  assert.equal(packet.layers.ATT.complete, true);
});

test('the same write is built from a description, lengths and types filled in', () => {
  const built = new Packet({ iface: H4 })
    .hci()
    .acl({ handle: 0x40, packetBoundary: acl.BOUNDARY_FIRST_FLUSHABLE })
    .l2cap()
    .att({ opcode: att.WRITE_REQUEST, handle: 0x25, value: hex('01 02 03') });

  assert.deepEqual(built.buffer, WRITE_REQUEST);
});

test('advertising reports give the address, the signal and the name', () => {
  const packet = new Packet({ buffer: ADVERTISING_REPORT, iface: H4 });

  assert.deepEqual(Object.keys(packet.layers), ['HCI', 'HCIEvent']);
  assert.equal(packet.layers.HCIEvent.code, hcievent.LE_META);
  assert.equal(packet.layers.HCIEvent.subevent, hcievent.SUBEVENT_ADVERTISING_REPORT);
  assert.equal(packet.layers.HCIEvent.complete, true);

  const [report] = reportsFrom(packet);

  assert.equal(reportsFrom(packet).length, 1);
  assert.equal(report.address, '11:22:33:44:55:66');
  assert.equal(report.rssi, -60);
  assert.equal(report.name, 'Sensor');
  assert.deepEqual(report.structures.map(({ type }) => type), [hcievent.AD_FLAGS, hcievent.AD_COMPLETE_LOCAL_NAME]);
});

test('extended advertising reports are read the same way', () => {
  const extended = hex(`
    04 3e 25
    0d 01
    13 00 01 66 55 44 33 22 11
    01 00 ff 7f c4 00 00 00 00 00 00 00 00 00
    0b 02 01 06 07 08 53 65 6e 73 6f 72
  `);

  const [report] = reportsFrom(new Packet({ buffer: extended, iface: H4 }));

  assert.equal(report.address, '11:22:33:44:55:66');
  assert.equal(report.addressType, 1);
  assert.equal(report.rssi, -60);
  assert.equal(report.name, 'Sensor');
});

test('a report cut short is told apart instead of throwing', () => {
  const cut = new Packet({ buffer: ADVERTISING_REPORT.subarray(0, 12), iface: H4 });

  assert.equal(cut.layers.HCIEvent.complete, false);
  assert.deepEqual(cut.layers.HCIEvent.advertisingReports, []);
});

test('commands and the events that answer them', () => {
  const scan = new Packet({ iface: H4 }).hci().hcicommand({ opcode: hcicommand.LE_SET_SCAN_ENABLE, parameters: hex('01 00') });

  assert.deepEqual(scan.buffer, hex('01 0c 20 02 01 00'));

  const command = new Packet({ buffer: scan.buffer, iface: H4 }).layers.HCICommand;

  assert.equal(command.opcodeName, 'LE_SET_SCAN_ENABLE');
  assert.equal(command.ogf, hcicommand.OGF_LE_CONTROLLER);
  assert.equal(command.ocf, 0x000c);
  assert.deepEqual(command.parameters, hex('01 00'));

  const answered = new Packet({ buffer: hex('04 0e 04 01 0c 20 00'), iface: H4 }).layers.HCIEvent;

  assert.equal(answered.codeName, 'COMMAND_COMPLETE');
  assert.equal(answered.commandOpcode, hcicommand.LE_SET_SCAN_ENABLE);
  assert.deepEqual(answered.returnParameters, hex('00'));

  const connected = new Packet({ buffer: hex('04 3e 13 01 00 40 00 00 00 66 55 44 33 22 11 18 00 00 00 48 00 00'), iface: H4 }).layers.HCIEvent;

  assert.equal(connected.subeventName, 'CONNECTION_COMPLETE');
  assert.equal(connected.handle, 0x40);
  assert.equal(connected.peerAddress, '11:22:33:44:55:66');

  const dropped = new Packet({ buffer: hex('04 05 04 00 40 00 13'), iface: H4 }).layers.HCIEvent;

  assert.deepEqual({ handle: dropped.handle, reason: dropped.reason }, { handle: 0x40, reason: 0x13 });
});

test('the operations GATT is made of', () => {
  const read = (bytes) => {
    return new Packet({ buffer: Buffer.concat([hex('02 40 20'), Buffer.from([bytes.length + 4, 0, bytes.length, 0, 4, 0]), bytes]), iface: H4 }).layers.ATT;
  };

  const discovery = read(hex('10 01 00 ff ff 00 28'));
  const notification = read(hex('1b 2a 00 48 49'));
  const refused = read(hex('01 0a 25 00 02'));
  const mtu = read(hex('02 f7 00'));

  assert.deepEqual({ name: discovery.opcodeName, from: discovery.startHandle, to: discovery.endHandle, uuid: discovery.uuid }, { name: 'READ_BY_GROUP_TYPE_REQUEST', from: 1, to: 0xffff, uuid: '2800' });
  assert.deepEqual({ handle: notification.handle, value: notification.value.toString() }, { handle: 0x2a, value: 'HI' });
  assert.deepEqual({ request: refused.requestOpcode, handle: refused.handle, error: refused.errorCode }, { request: att.READ_REQUEST, handle: 0x25, error: att.ERROR_READ_NOT_PERMITTED });
  assert.equal(mtu.mtu, 247);
});

test('a continuation fragment and other channels stay payloads', () => {
  const continuation = new Packet({ buffer: hex('02 40 10 03 00 aa bb cc'), iface: H4 });
  const securityManager = new Packet({ buffer: hex('02 40 20 06 00 02 00 06 00 01 02'), iface: H4 });

  assert.deepEqual(Object.keys(continuation.layers), ['HCI', 'ACL', 'Payload']);
  assert.deepEqual(Object.keys(securityManager.layers), ['HCI', 'ACL', 'L2CAP', 'Payload']);
  assert.equal(securityManager.layers.L2CAP.cid, l2cap.CID_SECURITY_MANAGER);
});

test('Linux captures carry the direction in front', () => {
  const received = new Packet({ buffer: Buffer.concat([hex('00 00 00 01'), ADVERTISING_REPORT]), iface: H4_WITH_DIRECTION });

  assert.deepEqual(Object.keys(received.layers), ['HCIDirection', 'HCI', 'HCIEvent']);
  assert.equal(received.layers.HCIDirection.direction, hcidirection.RECEIVED);
  assert.equal(received.layers.HCIDirection.received, true);

  const sent = new Packet({ iface: H4_WITH_DIRECTION })
    .hcidirection({ direction: hcidirection.SENT })
    .hci()
    .acl({ handle: 0x40, packetBoundary: acl.BOUNDARY_FIRST_FLUSHABLE })
    .l2cap()
    .att({ opcode: att.WRITE_REQUEST, handle: 0x25, value: hex('01 02 03') });

  assert.deepEqual(sent.buffer, Buffer.concat([hex('00 00 00 00'), WRITE_REQUEST]));
});

test('filters match Bluetooth layers in the process', () => {
  const write = new Packet({ buffer: WRITE_REQUEST, iface: H4 });
  const report = new Packet({ buffer: ADVERTISING_REPORT, iface: H4 });

  const writesToTheHandle = new FilterBuilder().acl({ handle: 0x40 }).att({ opcode: [att.WRITE_REQUEST, att.WRITE_COMMAND], handle: 0x25 });
  const nearby = new FilterBuilder().hcievent({ advertisingReports: reports => reports.some(({ rssi }) => rssi > -70) });

  assert.ok(writesToTheHandle.matches(write));
  assert.ok(!writesToTheHandle.matches(report));
  assert.ok(nearby.matches(report));
  assert.equal(writesToTheHandle.expressible, false);
});

test('otw(iface) chooses a wire kind by the interface name', async () => {
  const wire = otw('bluetooth0');

  assert.ok(wire instanceof BluetoothWire);
  assert.equal(wire.adapter, 'hci0');
  assert.equal(wire.iface, 'bluetooth0');
  assert.equal(otw('hci0').iface, 'bluetooth0');
  assert.equal(otw('hci1').iface, 'bluetooth1');
  assert.equal(otw('bluetooth2').adapter, 'hci2');
  assert.ok(!(otw() instanceof BluetoothWire));
  assert.ok(!(otw('en0') instanceof BluetoothWire));
  assert.equal(otw('en0').iface, 'en0');
  assert.ok(!(otw({ iface: 'eth0' }) instanceof BluetoothWire));

  const described = wire.packet().hci().acl({ handle: 0x40, packetBoundary: acl.BOUNDARY_FIRST_FLUSHABLE }).l2cap().att({ opcode: att.WRITE_REQUEST, handle: 0x25, value: hex('01 02 03') });

  assert.ok(described instanceof PacketBuilder);

  const packet = await described;

  assert.deepEqual(packet.buffer, WRITE_REQUEST);
  assert.equal(packet.linktype, LinkLayerType.LINKTYPE_BLUETOOTH_HCI_H4);
  assert.ok(wire.filter().att({ handle: 0x25 }).matches(packet));
});

test('what the system cannot do with Bluetooth is a rejection with a reason', async () => {
  const opened = [];

  const onLinux = otw({
    iface: 'hci2',
    system: {
      platform: 'linux',
      openDevice: (options) => {
        opened.push(options);
        return { destroy() {} };
      },
    },
  });

  assert.equal(onLinux.supports('capture'), true);
  assert.equal(onLinux.supports('send'), false);

  await onLinux.capture(onLinux.filter().att());

  assert.deepEqual(opened, [{ iface: 'bluetooth2' }]);
  await assert.rejects(Promise.resolve(onLinux.send(new Packet({ buffer: WRITE_REQUEST, iface: H4 }))), { code: 'ENOTSUPPORTED', message: /HCI socket/ });

  const withoutAdapter = otw({
    iface: 'bluetooth0',
    system: {
      platform: 'linux',
      openDevice: () => {
        throw new Error('Could not find device');
      },
    },
  });

  await assert.rejects(withoutAdapter.capture(), { code: 'ENODEVICE', message: /No capture device bluetooth0: Could not find device/ });

  const onMac = otw({ iface: 'bluetooth0', system: { platform: 'darwin' } });
  const onWindows = otw({ iface: 'bluetooth0', system: { platform: 'win32' } });

  assert.equal(onMac.supports('capture'), false);
  await assert.rejects(onMac.capture(), { code: 'ENOTSUPPORTED', message: /PacketLogger/ });
  await assert.rejects(onWindows.capture(), { code: 'ENOTSUPPORTED', message: /Npcap/ });
});

test('a Bluetooth capture file is written and read back', async () => {
  const frames = [
    Buffer.concat([hex('00 00 00 01'), ADVERTISING_REPORT]),
    Buffer.concat([hex('00 00 00 00'), WRITE_REQUEST]),
  ];

  const writer = otw.pcap.createWriteStream({ format: 'pcapng' });
  const reader = otw.pcap.createReadStream({ format: 'pcapng' });

  writer.pipe(reader);

  for (const buffer of frames) {
    writer.write(new Packet({ buffer, iface: H4_WITH_DIRECTION }));
  }

  writer.end();

  const summaries = [];

  for await (const packet of reader) {
    summaries.push(Object.keys(packet.layers).join(' / '));
  }

  assert.deepEqual(summaries, ['HCIDirection / HCI / HCIEvent', 'HCIDirection / HCI / ACL / L2CAP / ATT']);
});

test('tshark reads the packets built here the same way', async (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'otw-bluetooth-'));
  const file = path.join(directory, 'built.pcap');

  try {
    const writer = otw.pcap.createWriteStream({ format: 'pcap' });
    const written = new Promise((resolve) => {
      writer.pipe(fs.createWriteStream(file)).on('finish', resolve);
    });

    writer.write(new Packet({ iface: H4_WITH_DIRECTION })
      .hcidirection({ direction: hcidirection.SENT })
      .hci()
      .acl({ handle: 0x40, packetBoundary: acl.BOUNDARY_FIRST_NON_FLUSHABLE })
      .l2cap()
      .att({ opcode: att.WRITE_REQUEST, handle: 0x25, value: hex('01 02 03') }));

    writer.write(new Packet({ buffer: Buffer.concat([hex('00 00 00 01'), ADVERTISING_REPORT]), iface: H4_WITH_DIRECTION }));
    writer.end();

    await written;

    const fields = ['bthci_acl.chandle', 'btl2cap.cid', 'btatt.opcode', 'btatt.handle', 'btatt.value', 'bthci_evt.code', 'bthci_evt.le_meta_subevent', 'bthci_evt.bd_addr', 'btcommon.eir_ad.entry.device_name'];
    const dissected = spawnSync('tshark', ['-r', file, '-T', 'fields', '-E', 'separator=|', ...fields.flatMap(field => ['-e', field])], { encoding: 'utf8' });

    if (dissected.error !== undefined || dissected.status !== 0) {
      t.skip('tshark is not installed');
      return;
    }

    const [write, report] = dissected.stdout.trim().split('\n').map(line => line.split('|'));

    assert.deepEqual(write.slice(0, 5), ['0x0040', '0x0004', '0x12', '0x0025', '010203']);
    assert.deepEqual(report.slice(5), ['0x3e', '0x02', '11:22:33:44:55:66', 'Sensor']);
  }
  finally {
    fs.rmSync(directory, { recursive: true });
  }
});

test('the recipe lists the advertisers of a capture file', async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'otw-bluetooth-'));
  const capture = path.join(directory, 'scan.pcap');
  const script = path.join(directory, 'advertisers.mjs');

  try {
    const recipe = fs.readFileSync(path.join(PACKAGE_ROOT, 'recipes', 'bluetooth-advertisers.md'), 'utf8');
    const [, code] = recipe.match(/```javascript\n([\s\S]*?)```/);

    fs.writeFileSync(script, code);

    const unnamed = Buffer.from(ADVERTISING_REPORT);
    unnamed[5 + 2] = 0x99;
    unnamed.fill(0, 17, 23);
    unnamed[15] = 0x01;

    const writer = otw.pcap.createWriteStream({ format: 'pcap' });
    const written = new Promise((resolve) => {
      writer.pipe(fs.createWriteStream(capture)).on('finish', resolve);
    });

    for (const report of [ADVERTISING_REPORT, ADVERTISING_REPORT, unnamed]) {
      writer.write(new Packet({ buffer: Buffer.concat([hex('00 00 00 01'), report]), iface: H4_WITH_DIRECTION }));
    }

    writer.end();
    await written;

    const listing = spawnSync(process.execPath, [path.join(PACKAGE_ROOT, 'bin', 'otw.js'), script, capture], { encoding: 'utf8', timeout: 20000 });

    assert.equal(listing.status, 0, listing.stderr);
    assert.deepEqual(listing.stdout.trim().split('\n'), [
      '11:22:33:44:55:66   -60 dBm  Sensor',
      '11:22:33:44:55:99   -60 dBm',
    ]);
  }
  finally {
    fs.rmSync(directory, { recursive: true });
  }
});
