class LayersList {
  constructor(opts = {}) {
    this._layers = opts._layers ?? {};
    this._layersHead = opts._layersHead ?? null;
    this._layersTail = opts._layersTail ?? null;
    this._layersCount = opts._layersCount ?? 0;
  }

  _addLayer(newLayer) {
    if (!this._layersHead) {
      this._layersTail = this._layersHead = newLayer;
    }
    else if (this._layersTail) {
      this._layersTail.next = newLayer;
    }

    this._layersTail = newLayer;

    const { name } = newLayer;

    if (!this._layers[name]) {
      this._layers[name] = newLayer;
    }
    else if (Array.isArray(this._layers[name])) {
      this._layers[name].push(newLayer);
    }
    else {
      this._layers[name] = [this._layers[name], newLayer];
    }

    this.layersCount++;

    return newLayer;
  }

  _createLayer(Layer, buffer, opts = {}) {
    const prev = this._layersTail;

    const newLayer = new Layer(buffer, {
      prev,
      ...(this._defaultOpts ?? {}),
      ...opts,
    });

    return this._addLayer(newLayer);
  }

  _genLayers(fn) {
    let i = 0;

    if (this._layersTail === null) {
      this._layersTail = this._layersHead = fn(null, i++);

      if (this._layersTail === null) {
        return;
      }
      else {
        this._layersCount++;
      }
    }

    do {
      const newLayer = fn(this._layersTail, i++);
      this._layersTail.next = newLayer;
      this._layersTail = newLayer;

      if (!this._layersTail !== null) {
        this._layersCount++;
      }
    } while(this._layersTail !== null);
  }

  _eachLayer(fn) {
    let cur = this._layersHead;
    let i = 0;
    while (cur !== null) {
      fn(cur, i++);
      cur = cur.next;
    }
  }
}

module.exports = { LayersList };
