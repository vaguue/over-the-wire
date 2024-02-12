const lookupChild = (dict) => (layers, val, self) => new (layers[dict[val] ?? 'Payload'] ?? layers.Payload)(self.buffer.subarray(self.length), { ...self.opts, prev: self });

const lookupKey = (dict) => {
  const reverted = Object.entries(dict).reduce((res, [k, v]) => res.set(v, Number.isNaN(Number(k)) ? k : Number(k)), new Map);
  return (layers, obj) => {
    return reverted.get(obj.name) ?? null;
  };
}

module.exports = { lookupChild, lookupKey };
