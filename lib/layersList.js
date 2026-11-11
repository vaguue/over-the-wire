class LayersList {
  constructor(opts = {}) {
    this._layers = opts._layers ?? {};
    this._layersHead = opts._layersHead ?? null;
    this._layersTail = opts._layersTail ?? null;
    this._layersCount = opts._layersCount ?? 0;
  }

  _addLayer(newLayer) {
    const tail = this._layersTail;

    if (newLayer.prev !== tail) {
      newLayer.prev = tail;
    }
    if (newLayer.next !== null) {
      newLayer.next = null;
    }

    if (tail === null) {
      this._layersHead = newLayer;
    }
    else if (tail.next !== newLayer) {
      tail.next = newLayer;
    }

    this._layersTail = newLayer;
    this._layersCount++;

    const { name } = newLayer;
    const existing = this._layers[name];

    if (existing === undefined) {
      this._layers[name] = newLayer;
    }
    else if (Array.isArray(existing)) {
      existing.push(newLayer);
    }
    else {
      this._layers[name] = [existing, newLayer];
    }

    return newLayer;
  }

  _createLayer(Layer, buffer, opts = {}) {
    const newLayer = new Layer(buffer, {
      prev: this._layersTail,
      ...(this._defaultOpts ?? {}),
      ...opts,
    });

    return this._addLayer(newLayer);
  }

  _eachLayer(fn) {
    let cur = this._layersHead;
    let i = 0;
    while (cur !== null) {
      fn(cur, i++);
      cur = cur.next;
    }
  }

  _eachLayerReverse(fn) {
    let cur = this._layersTail;
    let i = 0;
    while (cur !== null) {
      fn(cur, i++);
      cur = cur.prev;
    }
  }
}

export { LayersList };
export default { LayersList };
