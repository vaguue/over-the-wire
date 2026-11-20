import { LinkLayerType } from '#lib/enums';
import { OsiModelLayers } from '#lib/layers/osi';
import { makeLayer, attach, byField } from '#lib/layers/define';

const PacketTypes = {
  COMMAND: 1,
  ACL: 2,
  SCO: 3,
  EVENT: 4,
  ISO: 5,
};

const Directions = {
  SENT: 0,
  RECEIVED: 1,
};

const HCI = (() => {
  const { Layer, proto } = makeLayer('HCI', `
    // Bluetooth Host Controller Interface, UART transport (H4). The one byte in front of every packet between a host and its Bluetooth controller. It is the link layer of Bluetooth captures.
    struct HCIHeader {
      // Kind of packet that follows, one of hci.TYPE_*. Filled from the layer that follows.
      uint8_t type;
    } __attribute__(packed);
  `, {
    osi: OsiModelLayers.DataLink,
    linktype: LinkLayerType.LINKTYPE_BLUETOOTH_HCI_H4,
  });

  const dispatcher = byField('type', {
    [PacketTypes.COMMAND]: 'HCICommand',
    [PacketTypes.ACL]: 'ACL',
    [PacketTypes.EVENT]: 'HCIEvent',
  });

  attach.dispatch(proto, dispatcher);

  attach.defaults(proto, {
    type: dispatcher.reverseDefault(PacketTypes.ACL),
  });

  return Layer;
})();

attach.docs(HCI, {
  constants: [
    {
      title: 'Packet types',
      field: 'type',
      values: Object.fromEntries(Object.entries(PacketTypes).map(([name, value]) => [`TYPE_${name}`, value])),
    },
  ],
  example: 'wire.packet().hci().acl({ handle: 0x40 }).l2cap().att({ opcode: att.READ_REQUEST, handle: 0x25 })',
});

const HCIDirection = (() => {
  const { Layer, proto } = makeLayer('HCIDirection', `
    // Direction header of Linux Bluetooth captures, LINKTYPE_BLUETOOTH_HCI_H4_WITH_PHDR. Four bytes in front of the HCI packet that tell whether the host sent or received it.
    struct HCIDirectionHeader {
      //@BE One of hcidirection.SENT and hcidirection.RECEIVED.
      uint32_t direction;
    } __attribute__(packed);
  `, {
    osi: OsiModelLayers.DataLink,
    linktype: LinkLayerType.LINKTYPE_BLUETOOTH_HCI_H4_WITH_PHDR,
  });

  proto.nextProto = function nextProto(layers) {
    return new layers.HCI(this._buf.subarray(this.length), { ...this.opts, prev: this });
  };

  attach.virtualField(proto, 'received', {
    get() {
      return this.direction === Directions.RECEIVED;
    },
    set(received) {
      this.direction = received ? Directions.RECEIVED : Directions.SENT;
    },
  });

  attach.toObjectExtras(proto, ['received']);

  return Layer;
})();

attach.docs(HCIDirection, {
  fields: {
    received: 'Whether the host received the packet, as a boolean view of direction.',
  },
  constants: [
    {
      title: 'Directions',
      field: 'direction',
      values: Directions,
    },
  ],
  example: 'wire.filter().hcidirection({ direction: hcidirection.RECEIVED })',
});

export { HCI, HCIDirection, PacketTypes, Directions };
export default { HCI, HCIDirection };
