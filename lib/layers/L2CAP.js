import { OsiModelLayers } from '#lib/layers/osi';
import { makeLayer, attach, byField } from '#lib/layers/define';
import { lengthAfter } from '#lib/layers/mixins';

const Channels = {
  SIGNALING: 0x0001,
  ATT: 0x0004,
  LE_SIGNALING: 0x0005,
  SECURITY_MANAGER: 0x0006,
};

const L2CAP = (() => {
  const { Layer, proto } = makeLayer('L2CAP', `
    //@LE Logical Link Control and Adaptation Protocol, basic frame. Multiplexes channels over one Bluetooth connection.
    struct L2CAPHeader {
      // Bytes of payload after this header. Filled automatically.
      uint16_t payloadLength;
      // Channel identifier, one of l2cap.CID_*. Filled from the layer that follows.
      uint16_t cid;
    } __attribute__((packed));
  `, {
    osi: OsiModelLayers.DataLink,
  });

  const dispatcher = byField('cid', {
    [Channels.ATT]: 'ATT',
  });

  attach.dispatch(proto, dispatcher);

  attach.defaults(proto, {
    payloadLength: ($) => lengthAfter($),
    cid: dispatcher.reverseDefault(Channels.ATT),
  });

  return Layer;
})();

attach.docs(L2CAP, {
  constants: [
    {
      title: 'Fixed channels',
      field: 'cid',
      values: Object.fromEntries(Object.entries(Channels).map(([name, value]) => [`CID_${name}`, value])),
    },
  ],
  example: 'wire.filter().l2cap({ cid: l2cap.CID_ATT })',
});

export { L2CAP, Channels };
export default { L2CAP };
