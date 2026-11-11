import { LinkLayerType } from '#lib/enums';
import socket from '#lib/socket';
const { AF_INET, AF_INET6 } = socket;
import { OsiModelLayers } from '#lib/layers/osi';
import { makeLayer, attach, byField } from '#lib/layers/define';

const AF_INET6_ON_OTHER_SYSTEMS = [24, 28, 30];

const Loopback = (() => {
  const { Layer, proto } = makeLayer('Loopback', `
    struct LoopbackHeader {
      uint32_t family;
    } __attribute__(packed);
  `, {
    osi: OsiModelLayers.DataLink,
    linktype: LinkLayerType.LINKTYPE_NULL,
  });

  const carriedProtocols = { [AF_INET]: 'IPv4', [AF_INET6]: 'IPv6' };

  for (const family of AF_INET6_ON_OTHER_SYSTEMS) {
    carriedProtocols[family] = 'IPv6';
  }

  attach.dispatch(proto, byField('family', carriedProtocols));

  attach.defaults(proto, {
    family: ($) => $.next?.name === 'IPv6' ? AF_INET6 : AF_INET,
  });

  return Layer;
})();

export { Loopback };
export default { Loopback };
