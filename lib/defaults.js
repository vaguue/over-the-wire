import { LinkLayerType } from './enums.js';

const defaults = {
  snaplen: 65535,
  linktype: LinkLayerType.LINKTYPE_ETHERNET,
};

export const { snaplen, linktype } = defaults;
export default defaults;
