import otw, { Wire, Packet, pcap, system } from '#lib/index';
import { namespaces } from '#lib/protocols';
import { renderDocs } from '#lib/cli/docs';
import { colorsWanted } from '#lib/cli/style';

const printDocs = (name) => {
  console.log(renderDocs(name, { color: colorsWanted() }));
};

const openSession = ({ iface = null } = {}) => {
  Wire.defaults.iface = iface;

  const wire = otw();

  return {
    wire,
    globals: {
      wire,
      otw,
      Packet,
      pcap,
      system,
      docs: printDocs,
      ...namespaces(),
    },
  };
};

const installGlobals = (globals, target = globalThis) => {
  for (const [name, value] of Object.entries(globals)) {
    Object.defineProperty(target, name, {
      value,
      writable: true,
      configurable: true,
      enumerable: false,
    });
  }
};

export { openSession, installGlobals, printDocs };
