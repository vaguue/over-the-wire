import { OsiModelLayers } from '#lib/layers/osi';
import { makeLayer, attach } from '#lib/layers/define';
import { lengthAfter } from '#lib/layers/mixins';

const PacketBoundaries = {
  FIRST_NON_FLUSHABLE: 0,
  CONTINUATION: 1,
  FIRST_FLUSHABLE: 2,
};

const ACL = (() => {
  const { Layer, proto } = makeLayer('ACL', `
    //@LE HCI ACL data packet. Carries L2CAP between a host and its controller for one connection.
    struct ACLHeader {
      // Connection handle the controller gave to the link.
      uint16_t handle:12;
      // Whether this starts an L2CAP frame or continues one, one of acl.BOUNDARY_*.
      uint16_t packetBoundary:2;
      // Broadcast flag.
      uint16_t broadcast:2;
      // Bytes of data after this header. Filled automatically.
      uint16_t dataLength;
    } __attribute__((packed));
  `, {
    osi: OsiModelLayers.DataLink,
  });

  proto.nextProto = function nextProto(layers) {
    const data = this._buf.subarray(this.length);
    const Carried = this.packetBoundary === PacketBoundaries.CONTINUATION ? layers.Payload : layers.L2CAP;

    return new Carried(data, { ...this.opts, prev: this });
  };

  attach.defaults(proto, {
    dataLength: ($) => lengthAfter($),
  });

  return Layer;
})();

attach.docs(ACL, {
  constants: [
    {
      title: 'Packet boundary',
      field: 'packetBoundary',
      values: Object.fromEntries(Object.entries(PacketBoundaries).map(([name, value]) => [`BOUNDARY_${name}`, value])),
    },
  ],
  example: 'wire.filter().acl({ handle: 0x40 })',
});

export { ACL, PacketBoundaries };
export default { ACL };
