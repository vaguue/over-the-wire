const lookupChild = (dict) => (layers, val, self) => new (dict[val]?.(layers) ?? layers.Payload)(self.buffer.subarray(self.length), { ...self.opts, prev: self });

const lookupKey = (dict) => (layers, obj) => {
  for (const [k, v] of Object.entries(childProto)) {
    if (obj instanceof v(layers)) {
      return k;
    }
  }
  return null;
};

module.exports = { lookupChild, lookupKey };
