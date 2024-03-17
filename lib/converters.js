const { socket } = require('#lib/bindings');
const { converters } = require('#lib/bindings');
const { defaultFamily } = require('#lib/af');

const { inetNtop, inetPton } = converters;

converters.inetNtop = (...args) => {
  if (args.length == 1) {
    const [addr] = args;
    try {
      return inetNtop(socket.AF_INET, addr);
    } catch(err) {
      return inetNtop(socket.AF_INET6, addr);
    }
  }
  return inetNtop(...args);
};

converters.inetPton = (...args) => {
  if (args.length == 1) {
    const [addr] = args;
    return inetPton(defaultFamily(addr), addr);
  }
  return inetPton(...args);
}

module.exports = converters;
