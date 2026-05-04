const { compile } = require('struct-compile');
const { checksums } = require('#lib/bindings');
const mixins = require('./mixins');

/**
 * Creates a Layer class on top of a struct-compile-generated header.
 *
 * The generated constructor follows the immutable-packet pattern shared
 * by every layer: take a Buffer or an object, allocate the header buffer
 * via toAlloc when given an object, run mixins.ctor for prev/next links,
 * and then set this.length.
 *
 * Returns { Layer, proto, Header, baseLength } so that mixins (attach.*)
 * can wire additional behaviour into the prototype after construction.
 *
 * @param {string} name - Layer name (used for class.name and instance.name).
 * @param {string} structSrc - struct-compile source string.
 * @param {Object} [meta]
 * @param {number} [meta.osi] - OsiModelLayers value.
 * @param {number} [meta.linktype] - LinkLayerType value (for L2 layers).
 * @param {Function|false} [meta.length] - `(self) => number` for runtime
 *   length (e.g. headerLength*4). `false` to skip the assignment entirely
 *   when the layer installs its own length getter on the prototype
 *   (ICMP/ICMPv6, where length depends on `type`). Defaults to baseLength.
 * @param {Function} [meta.toAlloc] - `(data) => number` for allocation
 *   size when constructing from an object. Defaults to constant baseLength.
 *   `attach.options.tlv8` wraps this to add the serialized options length.
 */
function makeLayer(name, structSrc, { osi, linktype, length, toAlloc } = {}) {
  const compiled = compile(structSrc);
  const headerKey = Object.keys(compiled).find(k => k.endsWith('Header')) ?? Object.keys(compiled)[0];
  const Header = compiled[headerKey];
  const baseLength = Header.prototype.config.length;

  // Pick a constructor variant once, at module load. Per-call branching on
  // `typeof length === 'function'` made the makeLayer ctor megamorphic
  // across layers and cost ~12% on parse hot paths in benchmarks; binding
  // the right path into a separate ctor body keeps each Layer's call site
  // monomorphic.
  let Layer;
  if (length === false) {
    Layer = class extends Header {
      constructor(data = {}, opts = {}) {
        if (Buffer.isBuffer(data)) super(data);
        else { super(Buffer.alloc(Layer.toAlloc(data))); this.merge(data); }
        mixins.ctor(this, data, opts);
      }
      defaults() {}
      nextProto() { return null; }
    };
  }
  else if (typeof length === 'function') {
    const lengthFn = length;
    Layer = class extends Header {
      constructor(data = {}, opts = {}) {
        if (Buffer.isBuffer(data)) super(data);
        else { super(Buffer.alloc(Layer.toAlloc(data))); this.merge(data); }
        mixins.ctor(this, data, opts);
        this.length = opts.allocated ?? lengthFn(this);
      }
      defaults() {}
      nextProto() { return null; }
    };
  }
  else {
    Layer = class extends Header {
      constructor(data = {}, opts = {}) {
        if (Buffer.isBuffer(data)) super(data);
        else { super(Buffer.alloc(Layer.toAlloc(data))); this.merge(data); }
        mixins.ctor(this, data, opts);
        this.length = opts.allocated ?? baseLength;
      }
      defaults() {}
      nextProto() { return null; }
    };
  }

  Object.defineProperty(Layer, 'name', { value: name });
  Layer.prototype.name = name;
  Layer.osi = osi;
  Layer.prototype.osi = osi;
  if (linktype !== undefined) Layer.linktype = linktype;
  Layer.toAlloc = toAlloc ?? (() => baseLength);

  return { Layer, proto: Layer.prototype, Header, baseLength };
}

// Property names appearing on the wire are validated to be plain JS
// identifiers so we can splice them into generated code without
// quoting/bracket notation. Every protocol layer in this project follows
// that constraint, but assert it explicitly so a future field name with
// a dash or digit-prefix doesn't silently produce a syntax error.
const IDENT_RE = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
function assertIdent(s) {
  if (!IDENT_RE.test(s)) {
    throw new Error(`define.js: ${JSON.stringify(s)} is not a valid JS identifier`);
  }
  return s;
}

const attach = {
  /**
   * Adds a getter/setter pair on the prototype for a virtual field that's
   * computed (rather than stored verbatim) - e.g. macToString, inetNtop.
   */
  virtualField(proto, name, { get, set }) {
    Object.defineProperty(proto, name, {
      get,
      set,
      enumerable: true,
      configurable: true,
    });
  },

  /**
   * Wraps proto.toObject (or its parent's via the prototype chain) to
   * overwrite the listed fields with the values returned by their virtual
   * getters. struct-compile's default toObject expands fixed-size byte
   * arrays via multiDimGet, so virtual fields like 'src' would otherwise
   * appear as a per-character array of the formatted string.
   */
  toObjectExtras(proto, fieldNames) {
    const previous = proto.toObject;
    proto.toObject = function() {
      const obj = previous.call(this);
      for (const name of fieldNames) {
        obj[name] = this[name];
      }
      return obj;
    };
  },

  /**
   * Generates proto.defaults(obj, layers) via codegen so that property
   * access compiles to literal-named loads/stores (`this.version`)
   * rather than keyed access (`this[key]`). Closure-iterating a table
   * with `for (const key in table)` measurably regresses build-path perf
   * because V8's keyed-IC cannot inline as tightly as named-property IC.
   *
   * Each entry in `table`:
   *   - primitive value -> `if (obj.x === undefined) this.x = <literal>;`
   *   - function ($, layers) -> `if (obj.x === undefined) this.x = fns[i](this, layers);`
   */
  defaults(proto, table) {
    const fns = [];
    const lines = [];
    for (const key of Object.keys(table)) {
      assertIdent(key);
      const v = table[key];
      if (typeof v === 'function') {
        const idx = fns.length;
        fns.push(v);
        lines.push(`if (obj.${key} === undefined) this.${key} = __fns[${idx}](this, layers);`);
      }
      else {
        lines.push(`if (obj.${key} === undefined) this.${key} = ${JSON.stringify(v)};`);
      }
    }
    proto.defaults = new Function(
      '__fns',
      `return function defaults(obj, layers) {\n  if (obj == null) obj = {};\n  ${lines.join('\n  ')}\n};`,
    )(fns);
  },

  /**
   * Installs the dispatcher's apply() to wire proto.nextProto.
   */
  dispatch(proto, dispatcher) {
    dispatcher.apply(proto);
  },

  /**
   * TLV options helpers and L4 checksum helpers are namespaced for
   * readability at call sites: `attach.options.tlv8(...)`,
   * `attach.checksum.ip(proto)`, `attach.checksum.pseudo(proto, type)`.
   */
  options: {
    /**
     * Wires variable-length 8-bit-type-and-length TLV options. Wraps
     * mixins.withOptions (which provides the `options` getter/setter
     * and `optionsLength` helper) and additionally:
     *   - bumps Layer.toAlloc to include the serialized options length;
     *   - chains proto.merge so that data.options is written via the
     *     options setter after the struct fields are merged;
     *   - chains proto.toObject to expose options as a plain array.
     *
     * @param {Function} Layer - The layer class returned by makeLayer.
     * @param {Object} proto - Layer.prototype (returned by makeLayer).
     * @param {Object} cfg - { baseLength, skipTypes?, lengthIsTotal? }.
     */
    tlv8(Layer, proto, { baseLength, skipTypes, lengthIsTotal }) {
      mixins.withOptions(proto, { baseLength, skipTypes, lengthIsTotal });

      const previousToAlloc = Layer.toAlloc;
      Layer.toAlloc = (data) =>
        previousToAlloc(data) + proto.optionsLength(data && data.options);

      const previousMerge = proto.merge;
      proto.merge = function(data) {
        previousMerge.call(this, data);
        if (data && !Buffer.isBuffer(data) && data.options) {
          this.options = data.options;
        }
      };

      const previousToObject = proto.toObject;
      proto.toObject = function() {
        return { ...previousToObject.call(this), options: [...this.options] };
      };
    },
  },

  /**
   * IP-style checksum (IPv4 header, ICMP) and pseudo-header L4 checksum
   * (TCP/UDP) installers. Both define proto.calculateChecksum and
   * proto.checksums(obj) so Packet._build's checksum pass picks them up.
   */
  checksum: {
    ip(proto) {
      proto.calculateChecksum = function() {
        this.checksum = checksums.ip(this.buffer.subarray(0, this.length));
      };
      proto.checksums = function(obj) {
        if (!obj.checksum) {
          this.calculateChecksum();
        }
      };
    },
    pseudo(proto, protocolType) {
      proto.calculateChecksum = function() {
        this.checksum = checksums.pseudo({
          data: this.buffer,
          addrType: this.prev?.name ?? 'IPv4',
          src: this.prev?.src,
          dst: this.prev?.dst,
          protocolType,
        });
      };
      proto.checksums = function(obj) {
        if (!obj.checksum) {
          this.calculateChecksum();
        }
      };
    },
  },
};

/**
 * Forward dispatcher by a header field.
 *
 * @param {string} fieldName - Field on the layer instance whose value
 *   selects the next layer class via `table`.
 * @param {Object.<number, string>} table - Map field-value -> layer-name.
 *
 * Returns:
 *   - apply(proto): wires proto.nextProto to look up the next layer class
 *     in the runtime `layers` map by table[this[fieldName]]. Falls back
 *     to layers.Payload when the value is unknown. The function body is
 *     generated via new Function so that `this.${fieldName}` is a named
 *     property load (LdaNamedProperty) rather than a keyed one.
 *   - reverseDefault(fallback): builds a defaults-table function that, on
 *     build, picks the field value back from this.next.name. Removes the
 *     duplication between forward (parse) and reverse (build) maps that
 *     was previously split between child.lookupChild / child.lookupKey.
 */
function byField(fieldName, table) {
  assertIdent(fieldName);
  const reverse = new Map(
    Object.entries(table).map(([k, v]) => [v, Number.isNaN(Number(k)) ? k : Number(k)])
  );

  return {
    apply(proto) {
      proto.nextProto = new Function(
        '__table',
        `return function nextProto(layers) {
  const Cls = layers[__table[this.${fieldName}]] ?? layers.Payload;
  return new Cls(this.buffer.subarray(this.length), { ...this.opts, prev: this });
};`,
      )(table);
    },
    reverseDefault(fallback) {
      return ($, _layers) => $.next ? (reverse.get($.next.name) ?? fallback) : fallback;
    },
  };
}

/**
 * Port-based dispatcher (UDP). Looks up the child layer class by
 * destination port first, then source port, and bounds the slice by
 * `this.totalLength` so trailing Ethernet padding doesn't bleed into
 * the child layer.
 *
 * Codegen hardcodes the `this.dst` / `this.src` / `this.totalLength`
 * named property loads for V8 inline-cache friendliness.
 *
 * No reverseDefault: there's no canonical inverse mapping (which port
 * a UDP datagram should advertise depends on direction).
 */
function byPort(table) {
  return {
    apply(proto) {
      proto.nextProto = new Function(
        '__table',
        `return function nextProto(layers) {
  const Cls = layers[__table[this.dst]] ?? layers[__table[this.src]] ?? layers.Payload;
  const end = Math.min(this._buf.length, this.totalLength);
  return new Cls(this._buf.subarray(this.length, end), { ...this.opts, prev: this });
};`,
      )(table);
    },
  };
}

module.exports = { makeLayer, attach, byField, byPort };
