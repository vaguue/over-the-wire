import { layers, linktype } from '#lib/layers/index';
import { Packet, installLayerMethods } from '#lib/packet';
import { PacketBuilder } from '#lib/packetBuilder';
import { FilterBuilder } from '#lib/filter';

const registerLayer = (Layer) => {
  if (typeof Layer !== 'function' || typeof Layer.name !== 'string' || Layer.name.length === 0) {
    throw new Error('A layer has to be a named class');
  }

  layers[Layer.name] = Layer;

  if (Layer.linktype !== undefined) {
    linktype[Layer.linktype] = Layer;
  }

  installLayerMethods(Packet, Layer);
  installLayerMethods(PacketBuilder, Layer);
  installLayerMethods(FilterBuilder, Layer);

  return Layer;
};

export { registerLayer };
export default { registerLayer };
