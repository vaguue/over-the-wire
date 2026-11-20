const importMetaUrl = require('node:url').pathToFileURL(process.execPath).href;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// lib/bindings.js
var import_node_module, LINKED_BINDING, bindings, bindings_default;
var init_bindings = __esm({
  "lib/bindings.js"() {
    import_node_module = require("node:module");
    LINKED_BINDING = "over_the_wire";
    globalThis.require = (0, import_node_module.createRequire)(process.execPath);
    bindings = process._linkedBinding(LINKED_BINDING);
    bindings_default = bindings;
  }
});

// lib/enums.js
var LinkLayerType, RouteFlags;
var init_enums = __esm({
  "lib/enums.js"() {
    init_bindings();
    ({ LinkLayerType, RouteFlags } = bindings_default);
  }
});

// lib/layers/enums.js
var ETHERTYPE, IPProtocolTypes, IPv4OptionTypes, ICMPTypes, ICMPv6Types;
var init_enums2 = __esm({
  "lib/layers/enums.js"() {
    ETHERTYPE = {
      /** Internet protocol */
      IP: 2048,
      /** Address resolution */
      ARP: 2054,
      /** Transparent Ethernet Bridging */
      ETHBRIDGE: 25944,
      /** Reverse ARP */
      REVARP: 32821,
      /** AppleTalk protocol */
      AT: 32923,
      /** AppleTalk ARP */
      AARP: 33011,
      /** IEEE 802.1Q VLAN tagging */
      VLAN: 33024,
      /** IPX */
      IPX: 33079,
      /** IP protocol version 6 */
      IPV6: 34525,
      /** used to test interfaces */
      LOOPBACK: 36864,
      /** PPPoE discovery */
      PPPOED: 34915,
      /** PPPoE session */
      PPPOES: 34916,
      /** MPLS */
      MPLS: 34887,
      /** Point-to-point protocol (PPP) */
      PPP: 34827,
      /** RDMA over Converged Ethernet (RoCEv1) */
      ROCEV1: 35093,
      /** IEEE 802.1ad Provider Bridge, Q-in-Q */
      IEEE_802_1AD: 34984,
      /** Wake on LAN */
      WAKE_ON_LAN: 2114
    };
    IPProtocolTypes = {
      /** Dummy protocol for TCP */
      IP: 0,
      /** IPv6 Hop-by-Hop options */
      HOPOPTS: 0,
      /** Internet Control Message Protocol */
      ICMP: 1,
      /** Internet Gateway Management Protocol */
      IGMP: 2,
      /** IPIP tunnels (older KA9Q tunnels use 94) */
      IPIP: 4,
      /** Transmission Control Protocol */
      TCP: 6,
      /** Exterior Gateway Protocol */
      EGP: 8,
      /** PUP protocol */
      PUP: 12,
      /** User Datagram Protocol */
      UDP: 17,
      /** XNS IDP protocol */
      IDP: 22,
      /** IPv6 header */
      IPV6: 41,
      /** IPv6 Routing header */
      ROUTING: 43,
      /** IPv6 fragmentation header */
      FRAGMENT: 44,
      /** GRE protocol */
      GRE: 47,
      /** encapsulating security payload */
      ESP: 50,
      /** authentication header */
      AH: 51,
      /** ICMPv6 */
      ICMPV6: 58,
      /** IPv6 no next header */
      NONE: 59,
      /** IPv6 Destination options */
      DSTOPTS: 60,
      /** VRRP protocol */
      VRRP: 112,
      /** Raw IP packets */
      RAW: 255,
      /** Maximum value */
      MAX: 256
    };
    IPv4OptionTypes = {
      /** End of Options List */
      EndOfOptionsList: 0,
      /** No Operation */
      NOP: 1,
      /** Record Route */
      RecordRoute: 7,
      /** MTU Probe */
      MTUProbe: 11,
      /** MTU Reply */
      MTUReply: 12,
      /** Quick-Start */
      QuickStart: 25,
      /** Timestamp */
      Timestamp: 68,
      /** Traceroute */
      Traceroute: 82,
      /** Security */
      Security: 130,
      /** Loose Source Route */
      LooseSourceRoute: 131,
      /** Extended Security */
      ExtendedSecurity: 133,
      /** Commercial Security */
      CommercialSecurity: 134,
      /** Stream ID */
      StreamID: 136,
      /** Strict Source Route */
      StrictSourceRoute: 137,
      /** Extended Internet Protocol */
      ExtendedInternetProtocol: 145,
      /** Address Extension */
      AddressExtension: 147,
      /** Router Alert */
      RouterAlert: 148,
      /** Selective Directed Broadcast */
      SelectiveDirectedBroadcast: 149,
      /** Dynamic Packet State */
      DynamicPacketState: 151,
      /** Upstream Multicast Pkt. */
      UpstreamMulticastPkt: 152,
      /** Unknown IPv4 option */
      Unknown: 153
    };
    ICMPTypes = {
      /** Echo Reply */
      EchoReply: 0,
      /** Destination Unreachable */
      DestinationUnreachable: 3,
      /** Source Quench */
      SourceQuench: 4,
      /** Redirect Message */
      Redirect: 5,
      /** Echo Request */
      EchoRequest: 8,
      /** Time Exceeded */
      TimeExceeded: 11,
      /** Parameter Problem */
      ParameterProblem: 12,
      /** Timestamp Request */
      TimestampRequest: 13,
      /** Timestamp Reply */
      TimestampReply: 14,
      /** Information Request */
      InformationRequest: 15,
      /** Information Reply */
      InformationReply: 16,
      /** Address Mask Request */
      AddressMaskRequest: 17,
      /** Address Mask Reply */
      AddressMaskReply: 18
    };
    ICMPv6Types = {
      /** Unknown ICMPv6 message */
      Unknown: 0,
      /** Destination Unreachable Message */
      DestinationUnreachable: 1,
      /** Packet Too Big Message */
      PacketTooBig: 2,
      /** Time Exceeded Message */
      TimeExceeded: 3,
      /** Parameter Problem Message */
      ParameterProblem: 4,
      /** Echo Request Message */
      EchoRequest: 128,
      /** Echo Reply Message */
      EchoReply: 129,
      /** Multicast Listener Query Message */
      MulticastListenerQuery: 130,
      /** Multicast Listener Report Message */
      MulticastListenerReport: 131,
      /** Multicast Listener Done Message */
      MulticastListenerDone: 132,
      /** Router Solicitation Message */
      RouterSolicitation: 133,
      /** Router Advertisement Message */
      RouterAdvertisement: 134,
      /** Neighbor Solicitation Message */
      NeighborSolicitation: 135,
      /** Neighbor Advertisement Message */
      NeighborAdvertisement: 136,
      /** Redirect Message */
      RedirectMessage: 137
    };
  }
});

// lib/layers/osi.js
var OsiModelLayers;
var init_osi = __esm({
  "lib/layers/osi.js"() {
    OsiModelLayers = {
      /** Physical layer (layer 1) */
      Physical: 1,
      /** Data link layer (layer 2) */
      DataLink: 2,
      /** Network layer (layer 3) */
      Network: 3,
      /** Transport layer (layer 4) */
      Transport: 4,
      /** Session layer (layer 5) */
      Sesion: 5,
      /** Presentation layer (layer 6) */
      Presentation: 6,
      /** Application layer (layer 7) */
      Application: 7,
      /** Unknown / null layer */
      Unknown: 8
    };
  }
});

// lib/layers/mac.js
var macToString, macFromString;
var init_mac = __esm({
  "lib/layers/mac.js"() {
    macToString = (buf) => buf.toJSON().data.map((e) => e.toString(16).padStart(2, "0")).join(":");
    macFromString = (str) => {
      const parts = str.split(":");
      if (parts.length !== 6 || !parts.every((o) => o.length > 0 && o.length <= 2 && /^[0-9a-fA-F]+$/.test(o))) {
        throw new Error(`Invalid MAC address: ${str}`);
      }
      return Buffer.from(parts.map((o) => o.padStart(2, "0")).join(""), "hex");
    };
  }
});

// node_modules/chevrotain/lib/src/version.js
var init_version = __esm({
  "node_modules/chevrotain/lib/src/version.js"() {
  }
});

// node_modules/lodash-es/_freeGlobal.js
var freeGlobal, freeGlobal_default;
var init_freeGlobal = __esm({
  "node_modules/lodash-es/_freeGlobal.js"() {
    freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    freeGlobal_default = freeGlobal;
  }
});

// node_modules/lodash-es/_root.js
var freeSelf, root, root_default;
var init_root = __esm({
  "node_modules/lodash-es/_root.js"() {
    init_freeGlobal();
    freeSelf = typeof self == "object" && self && self.Object === Object && self;
    root = freeGlobal_default || freeSelf || Function("return this")();
    root_default = root;
  }
});

// node_modules/lodash-es/_Symbol.js
var Symbol2, Symbol_default;
var init_Symbol = __esm({
  "node_modules/lodash-es/_Symbol.js"() {
    init_root();
    Symbol2 = root_default.Symbol;
    Symbol_default = Symbol2;
  }
});

// node_modules/lodash-es/_getRawTag.js
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
  try {
    value[symToStringTag] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}
var objectProto, hasOwnProperty, nativeObjectToString, symToStringTag, getRawTag_default;
var init_getRawTag = __esm({
  "node_modules/lodash-es/_getRawTag.js"() {
    init_Symbol();
    objectProto = Object.prototype;
    hasOwnProperty = objectProto.hasOwnProperty;
    nativeObjectToString = objectProto.toString;
    symToStringTag = Symbol_default ? Symbol_default.toStringTag : void 0;
    getRawTag_default = getRawTag;
  }
});

// node_modules/lodash-es/_objectToString.js
function objectToString(value) {
  return nativeObjectToString2.call(value);
}
var objectProto2, nativeObjectToString2, objectToString_default;
var init_objectToString = __esm({
  "node_modules/lodash-es/_objectToString.js"() {
    objectProto2 = Object.prototype;
    nativeObjectToString2 = objectProto2.toString;
    objectToString_default = objectToString;
  }
});

// node_modules/lodash-es/_baseGetTag.js
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag2 && symToStringTag2 in Object(value) ? getRawTag_default(value) : objectToString_default(value);
}
var nullTag, undefinedTag, symToStringTag2, baseGetTag_default;
var init_baseGetTag = __esm({
  "node_modules/lodash-es/_baseGetTag.js"() {
    init_Symbol();
    init_getRawTag();
    init_objectToString();
    nullTag = "[object Null]";
    undefinedTag = "[object Undefined]";
    symToStringTag2 = Symbol_default ? Symbol_default.toStringTag : void 0;
    baseGetTag_default = baseGetTag;
  }
});

// node_modules/lodash-es/isObjectLike.js
function isObjectLike(value) {
  return value != null && typeof value == "object";
}
var isObjectLike_default;
var init_isObjectLike = __esm({
  "node_modules/lodash-es/isObjectLike.js"() {
    isObjectLike_default = isObjectLike;
  }
});

// node_modules/lodash-es/isSymbol.js
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike_default(value) && baseGetTag_default(value) == symbolTag;
}
var symbolTag, isSymbol_default;
var init_isSymbol = __esm({
  "node_modules/lodash-es/isSymbol.js"() {
    init_baseGetTag();
    init_isObjectLike();
    symbolTag = "[object Symbol]";
    isSymbol_default = isSymbol;
  }
});

// node_modules/lodash-es/_arrayMap.js
function arrayMap(array, iteratee) {
  var index = -1, length = array == null ? 0 : array.length, result = Array(length);
  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}
var arrayMap_default;
var init_arrayMap = __esm({
  "node_modules/lodash-es/_arrayMap.js"() {
    arrayMap_default = arrayMap;
  }
});

// node_modules/lodash-es/isArray.js
var isArray, isArray_default;
var init_isArray = __esm({
  "node_modules/lodash-es/isArray.js"() {
    isArray = Array.isArray;
    isArray_default = isArray;
  }
});

// node_modules/lodash-es/_baseToString.js
function baseToString(value) {
  if (typeof value == "string") {
    return value;
  }
  if (isArray_default(value)) {
    return arrayMap_default(value, baseToString) + "";
  }
  if (isSymbol_default(value)) {
    return symbolToString ? symbolToString.call(value) : "";
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY ? "-0" : result;
}
var INFINITY, symbolProto, symbolToString, baseToString_default;
var init_baseToString = __esm({
  "node_modules/lodash-es/_baseToString.js"() {
    init_Symbol();
    init_arrayMap();
    init_isArray();
    init_isSymbol();
    INFINITY = 1 / 0;
    symbolProto = Symbol_default ? Symbol_default.prototype : void 0;
    symbolToString = symbolProto ? symbolProto.toString : void 0;
    baseToString_default = baseToString;
  }
});

// node_modules/lodash-es/_trimmedEndIndex.js
function trimmedEndIndex(string) {
  var index = string.length;
  while (index-- && reWhitespace.test(string.charAt(index))) {
  }
  return index;
}
var reWhitespace, trimmedEndIndex_default;
var init_trimmedEndIndex = __esm({
  "node_modules/lodash-es/_trimmedEndIndex.js"() {
    reWhitespace = /\s/;
    trimmedEndIndex_default = trimmedEndIndex;
  }
});

// node_modules/lodash-es/_baseTrim.js
function baseTrim(string) {
  return string ? string.slice(0, trimmedEndIndex_default(string) + 1).replace(reTrimStart, "") : string;
}
var reTrimStart, baseTrim_default;
var init_baseTrim = __esm({
  "node_modules/lodash-es/_baseTrim.js"() {
    init_trimmedEndIndex();
    reTrimStart = /^\s+/;
    baseTrim_default = baseTrim;
  }
});

// node_modules/lodash-es/isObject.js
function isObject(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var isObject_default;
var init_isObject = __esm({
  "node_modules/lodash-es/isObject.js"() {
    isObject_default = isObject;
  }
});

// node_modules/lodash-es/toNumber.js
function toNumber(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol_default(value)) {
    return NAN;
  }
  if (isObject_default(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject_default(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = baseTrim_default(value);
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
var NAN, reIsBadHex, reIsBinary, reIsOctal, freeParseInt, toNumber_default;
var init_toNumber = __esm({
  "node_modules/lodash-es/toNumber.js"() {
    init_baseTrim();
    init_isObject();
    init_isSymbol();
    NAN = 0 / 0;
    reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    reIsBinary = /^0b[01]+$/i;
    reIsOctal = /^0o[0-7]+$/i;
    freeParseInt = parseInt;
    toNumber_default = toNumber;
  }
});

// node_modules/lodash-es/toFinite.js
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber_default(value);
  if (value === INFINITY2 || value === -INFINITY2) {
    var sign2 = value < 0 ? -1 : 1;
    return sign2 * MAX_INTEGER;
  }
  return value === value ? value : 0;
}
var INFINITY2, MAX_INTEGER, toFinite_default;
var init_toFinite = __esm({
  "node_modules/lodash-es/toFinite.js"() {
    init_toNumber();
    INFINITY2 = 1 / 0;
    MAX_INTEGER = 17976931348623157e292;
    toFinite_default = toFinite;
  }
});

// node_modules/lodash-es/toInteger.js
function toInteger(value) {
  var result = toFinite_default(value), remainder = result % 1;
  return result === result ? remainder ? result - remainder : result : 0;
}
var toInteger_default;
var init_toInteger = __esm({
  "node_modules/lodash-es/toInteger.js"() {
    init_toFinite();
    toInteger_default = toInteger;
  }
});

// node_modules/lodash-es/identity.js
function identity(value) {
  return value;
}
var identity_default;
var init_identity = __esm({
  "node_modules/lodash-es/identity.js"() {
    identity_default = identity;
  }
});

// node_modules/lodash-es/isFunction.js
function isFunction2(value) {
  if (!isObject_default(value)) {
    return false;
  }
  var tag = baseGetTag_default(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
var asyncTag, funcTag, genTag, proxyTag, isFunction_default;
var init_isFunction = __esm({
  "node_modules/lodash-es/isFunction.js"() {
    init_baseGetTag();
    init_isObject();
    asyncTag = "[object AsyncFunction]";
    funcTag = "[object Function]";
    genTag = "[object GeneratorFunction]";
    proxyTag = "[object Proxy]";
    isFunction_default = isFunction2;
  }
});

// node_modules/lodash-es/_coreJsData.js
var coreJsData, coreJsData_default;
var init_coreJsData = __esm({
  "node_modules/lodash-es/_coreJsData.js"() {
    init_root();
    coreJsData = root_default["__core-js_shared__"];
    coreJsData_default = coreJsData;
  }
});

// node_modules/lodash-es/_isMasked.js
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
var maskSrcKey, isMasked_default;
var init_isMasked = __esm({
  "node_modules/lodash-es/_isMasked.js"() {
    init_coreJsData();
    maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData_default && coreJsData_default.keys && coreJsData_default.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    })();
    isMasked_default = isMasked;
  }
});

// node_modules/lodash-es/_toSource.js
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {
    }
    try {
      return func + "";
    } catch (e) {
    }
  }
  return "";
}
var funcProto, funcToString, toSource_default;
var init_toSource = __esm({
  "node_modules/lodash-es/_toSource.js"() {
    funcProto = Function.prototype;
    funcToString = funcProto.toString;
    toSource_default = toSource;
  }
});

// node_modules/lodash-es/_baseIsNative.js
function baseIsNative(value) {
  if (!isObject_default(value) || isMasked_default(value)) {
    return false;
  }
  var pattern = isFunction_default(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource_default(value));
}
var reRegExpChar, reIsHostCtor, funcProto2, objectProto3, funcToString2, hasOwnProperty2, reIsNative, baseIsNative_default;
var init_baseIsNative = __esm({
  "node_modules/lodash-es/_baseIsNative.js"() {
    init_isFunction();
    init_isMasked();
    init_isObject();
    init_toSource();
    reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    reIsHostCtor = /^\[object .+?Constructor\]$/;
    funcProto2 = Function.prototype;
    objectProto3 = Object.prototype;
    funcToString2 = funcProto2.toString;
    hasOwnProperty2 = objectProto3.hasOwnProperty;
    reIsNative = RegExp(
      "^" + funcToString2.call(hasOwnProperty2).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    );
    baseIsNative_default = baseIsNative;
  }
});

// node_modules/lodash-es/_getValue.js
function getValue(object, key) {
  return object == null ? void 0 : object[key];
}
var getValue_default;
var init_getValue = __esm({
  "node_modules/lodash-es/_getValue.js"() {
    getValue_default = getValue;
  }
});

// node_modules/lodash-es/_getNative.js
function getNative(object, key) {
  var value = getValue_default(object, key);
  return baseIsNative_default(value) ? value : void 0;
}
var getNative_default;
var init_getNative = __esm({
  "node_modules/lodash-es/_getNative.js"() {
    init_baseIsNative();
    init_getValue();
    getNative_default = getNative;
  }
});

// node_modules/lodash-es/_WeakMap.js
var WeakMap2, WeakMap_default;
var init_WeakMap = __esm({
  "node_modules/lodash-es/_WeakMap.js"() {
    init_getNative();
    init_root();
    WeakMap2 = getNative_default(root_default, "WeakMap");
    WeakMap_default = WeakMap2;
  }
});

// node_modules/lodash-es/_baseCreate.js
var objectCreate, baseCreate, baseCreate_default;
var init_baseCreate = __esm({
  "node_modules/lodash-es/_baseCreate.js"() {
    init_isObject();
    objectCreate = Object.create;
    baseCreate = /* @__PURE__ */ (function() {
      function object() {
      }
      return function(proto) {
        if (!isObject_default(proto)) {
          return {};
        }
        if (objectCreate) {
          return objectCreate(proto);
        }
        object.prototype = proto;
        var result = new object();
        object.prototype = void 0;
        return result;
      };
    })();
    baseCreate_default = baseCreate;
  }
});

// node_modules/lodash-es/_apply.js
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}
var apply_default;
var init_apply = __esm({
  "node_modules/lodash-es/_apply.js"() {
    apply_default = apply;
  }
});

// node_modules/lodash-es/noop.js
function noop() {
}
var noop_default;
var init_noop = __esm({
  "node_modules/lodash-es/noop.js"() {
    noop_default = noop;
  }
});

// node_modules/lodash-es/_copyArray.js
function copyArray(source, array) {
  var index = -1, length = source.length;
  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}
var copyArray_default;
var init_copyArray = __esm({
  "node_modules/lodash-es/_copyArray.js"() {
    copyArray_default = copyArray;
  }
});

// node_modules/lodash-es/_shortOut.js
function shortOut(func) {
  var count = 0, lastCalled = 0;
  return function() {
    var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(void 0, arguments);
  };
}
var HOT_COUNT, HOT_SPAN, nativeNow, shortOut_default;
var init_shortOut = __esm({
  "node_modules/lodash-es/_shortOut.js"() {
    HOT_COUNT = 800;
    HOT_SPAN = 16;
    nativeNow = Date.now;
    shortOut_default = shortOut;
  }
});

// node_modules/lodash-es/constant.js
function constant(value) {
  return function() {
    return value;
  };
}
var constant_default;
var init_constant = __esm({
  "node_modules/lodash-es/constant.js"() {
    constant_default = constant;
  }
});

// node_modules/lodash-es/_defineProperty.js
var defineProperty, defineProperty_default;
var init_defineProperty = __esm({
  "node_modules/lodash-es/_defineProperty.js"() {
    init_getNative();
    defineProperty = (function() {
      try {
        var func = getNative_default(Object, "defineProperty");
        func({}, "", {});
        return func;
      } catch (e) {
      }
    })();
    defineProperty_default = defineProperty;
  }
});

// node_modules/lodash-es/_baseSetToString.js
var baseSetToString, baseSetToString_default;
var init_baseSetToString = __esm({
  "node_modules/lodash-es/_baseSetToString.js"() {
    init_constant();
    init_defineProperty();
    init_identity();
    baseSetToString = !defineProperty_default ? identity_default : function(func, string) {
      return defineProperty_default(func, "toString", {
        "configurable": true,
        "enumerable": false,
        "value": constant_default(string),
        "writable": true
      });
    };
    baseSetToString_default = baseSetToString;
  }
});

// node_modules/lodash-es/_setToString.js
var setToString, setToString_default;
var init_setToString = __esm({
  "node_modules/lodash-es/_setToString.js"() {
    init_baseSetToString();
    init_shortOut();
    setToString = shortOut_default(baseSetToString_default);
    setToString_default = setToString;
  }
});

// node_modules/lodash-es/_arrayEach.js
function arrayEach(array, iteratee) {
  var index = -1, length = array == null ? 0 : array.length;
  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}
var arrayEach_default;
var init_arrayEach = __esm({
  "node_modules/lodash-es/_arrayEach.js"() {
    arrayEach_default = arrayEach;
  }
});

// node_modules/lodash-es/_baseFindIndex.js
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
  while (fromRight ? index-- : ++index < length) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}
var baseFindIndex_default;
var init_baseFindIndex = __esm({
  "node_modules/lodash-es/_baseFindIndex.js"() {
    baseFindIndex_default = baseFindIndex;
  }
});

// node_modules/lodash-es/_baseIsNaN.js
function baseIsNaN(value) {
  return value !== value;
}
var baseIsNaN_default;
var init_baseIsNaN = __esm({
  "node_modules/lodash-es/_baseIsNaN.js"() {
    baseIsNaN_default = baseIsNaN;
  }
});

// node_modules/lodash-es/_strictIndexOf.js
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1, length = array.length;
  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}
var strictIndexOf_default;
var init_strictIndexOf = __esm({
  "node_modules/lodash-es/_strictIndexOf.js"() {
    strictIndexOf_default = strictIndexOf;
  }
});

// node_modules/lodash-es/_baseIndexOf.js
function baseIndexOf(array, value, fromIndex) {
  return value === value ? strictIndexOf_default(array, value, fromIndex) : baseFindIndex_default(array, baseIsNaN_default, fromIndex);
}
var baseIndexOf_default;
var init_baseIndexOf = __esm({
  "node_modules/lodash-es/_baseIndexOf.js"() {
    init_baseFindIndex();
    init_baseIsNaN();
    init_strictIndexOf();
    baseIndexOf_default = baseIndexOf;
  }
});

// node_modules/lodash-es/_arrayIncludes.js
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf_default(array, value, 0) > -1;
}
var arrayIncludes_default;
var init_arrayIncludes = __esm({
  "node_modules/lodash-es/_arrayIncludes.js"() {
    init_baseIndexOf();
    arrayIncludes_default = arrayIncludes;
  }
});

// node_modules/lodash-es/_isIndex.js
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
}
var MAX_SAFE_INTEGER, reIsUint, isIndex_default;
var init_isIndex = __esm({
  "node_modules/lodash-es/_isIndex.js"() {
    MAX_SAFE_INTEGER = 9007199254740991;
    reIsUint = /^(?:0|[1-9]\d*)$/;
    isIndex_default = isIndex;
  }
});

// node_modules/lodash-es/_baseAssignValue.js
function baseAssignValue(object, key, value) {
  if (key == "__proto__" && defineProperty_default) {
    defineProperty_default(object, key, {
      "configurable": true,
      "enumerable": true,
      "value": value,
      "writable": true
    });
  } else {
    object[key] = value;
  }
}
var baseAssignValue_default;
var init_baseAssignValue = __esm({
  "node_modules/lodash-es/_baseAssignValue.js"() {
    init_defineProperty();
    baseAssignValue_default = baseAssignValue;
  }
});

// node_modules/lodash-es/eq.js
function eq(value, other) {
  return value === other || value !== value && other !== other;
}
var eq_default;
var init_eq = __esm({
  "node_modules/lodash-es/eq.js"() {
    eq_default = eq;
  }
});

// node_modules/lodash-es/_assignValue.js
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty3.call(object, key) && eq_default(objValue, value)) || value === void 0 && !(key in object)) {
    baseAssignValue_default(object, key, value);
  }
}
var objectProto4, hasOwnProperty3, assignValue_default;
var init_assignValue = __esm({
  "node_modules/lodash-es/_assignValue.js"() {
    init_baseAssignValue();
    init_eq();
    objectProto4 = Object.prototype;
    hasOwnProperty3 = objectProto4.hasOwnProperty;
    assignValue_default = assignValue;
  }
});

// node_modules/lodash-es/_copyObject.js
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});
  var index = -1, length = props.length;
  while (++index < length) {
    var key = props[index];
    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
    if (newValue === void 0) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue_default(object, key, newValue);
    } else {
      assignValue_default(object, key, newValue);
    }
  }
  return object;
}
var copyObject_default;
var init_copyObject = __esm({
  "node_modules/lodash-es/_copyObject.js"() {
    init_assignValue();
    init_baseAssignValue();
    copyObject_default = copyObject;
  }
});

// node_modules/lodash-es/_overRest.js
function overRest(func, start, transform) {
  start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
  return function() {
    var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply_default(func, this, otherArgs);
  };
}
var nativeMax, overRest_default;
var init_overRest = __esm({
  "node_modules/lodash-es/_overRest.js"() {
    init_apply();
    nativeMax = Math.max;
    overRest_default = overRest;
  }
});

// node_modules/lodash-es/_baseRest.js
function baseRest(func, start) {
  return setToString_default(overRest_default(func, start, identity_default), func + "");
}
var baseRest_default;
var init_baseRest = __esm({
  "node_modules/lodash-es/_baseRest.js"() {
    init_identity();
    init_overRest();
    init_setToString();
    baseRest_default = baseRest;
  }
});

// node_modules/lodash-es/isLength.js
function isLength(value) {
  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER2;
}
var MAX_SAFE_INTEGER2, isLength_default;
var init_isLength = __esm({
  "node_modules/lodash-es/isLength.js"() {
    MAX_SAFE_INTEGER2 = 9007199254740991;
    isLength_default = isLength;
  }
});

// node_modules/lodash-es/isArrayLike.js
function isArrayLike(value) {
  return value != null && isLength_default(value.length) && !isFunction_default(value);
}
var isArrayLike_default;
var init_isArrayLike = __esm({
  "node_modules/lodash-es/isArrayLike.js"() {
    init_isFunction();
    init_isLength();
    isArrayLike_default = isArrayLike;
  }
});

// node_modules/lodash-es/_isIterateeCall.js
function isIterateeCall(value, index, object) {
  if (!isObject_default(object)) {
    return false;
  }
  var type = typeof index;
  if (type == "number" ? isArrayLike_default(object) && isIndex_default(index, object.length) : type == "string" && index in object) {
    return eq_default(object[index], value);
  }
  return false;
}
var isIterateeCall_default;
var init_isIterateeCall = __esm({
  "node_modules/lodash-es/_isIterateeCall.js"() {
    init_eq();
    init_isArrayLike();
    init_isIndex();
    init_isObject();
    isIterateeCall_default = isIterateeCall;
  }
});

// node_modules/lodash-es/_createAssigner.js
function createAssigner(assigner) {
  return baseRest_default(function(object, sources) {
    var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
    customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
    if (guard && isIterateeCall_default(sources[0], sources[1], guard)) {
      customizer = length < 3 ? void 0 : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}
var createAssigner_default;
var init_createAssigner = __esm({
  "node_modules/lodash-es/_createAssigner.js"() {
    init_baseRest();
    init_isIterateeCall();
    createAssigner_default = createAssigner;
  }
});

// node_modules/lodash-es/_isPrototype.js
function isPrototype(value) {
  var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto5;
  return value === proto;
}
var objectProto5, isPrototype_default;
var init_isPrototype = __esm({
  "node_modules/lodash-es/_isPrototype.js"() {
    objectProto5 = Object.prototype;
    isPrototype_default = isPrototype;
  }
});

// node_modules/lodash-es/_baseTimes.js
function baseTimes(n, iteratee) {
  var index = -1, result = Array(n);
  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}
var baseTimes_default;
var init_baseTimes = __esm({
  "node_modules/lodash-es/_baseTimes.js"() {
    baseTimes_default = baseTimes;
  }
});

// node_modules/lodash-es/_baseIsArguments.js
function baseIsArguments(value) {
  return isObjectLike_default(value) && baseGetTag_default(value) == argsTag;
}
var argsTag, baseIsArguments_default;
var init_baseIsArguments = __esm({
  "node_modules/lodash-es/_baseIsArguments.js"() {
    init_baseGetTag();
    init_isObjectLike();
    argsTag = "[object Arguments]";
    baseIsArguments_default = baseIsArguments;
  }
});

// node_modules/lodash-es/isArguments.js
var objectProto6, hasOwnProperty4, propertyIsEnumerable, isArguments, isArguments_default;
var init_isArguments = __esm({
  "node_modules/lodash-es/isArguments.js"() {
    init_baseIsArguments();
    init_isObjectLike();
    objectProto6 = Object.prototype;
    hasOwnProperty4 = objectProto6.hasOwnProperty;
    propertyIsEnumerable = objectProto6.propertyIsEnumerable;
    isArguments = baseIsArguments_default(/* @__PURE__ */ (function() {
      return arguments;
    })()) ? baseIsArguments_default : function(value) {
      return isObjectLike_default(value) && hasOwnProperty4.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
    };
    isArguments_default = isArguments;
  }
});

// node_modules/lodash-es/stubFalse.js
function stubFalse() {
  return false;
}
var stubFalse_default;
var init_stubFalse = __esm({
  "node_modules/lodash-es/stubFalse.js"() {
    stubFalse_default = stubFalse;
  }
});

// node_modules/lodash-es/isBuffer.js
var freeExports, freeModule, moduleExports, Buffer2, nativeIsBuffer, isBuffer, isBuffer_default;
var init_isBuffer = __esm({
  "node_modules/lodash-es/isBuffer.js"() {
    init_root();
    init_stubFalse();
    freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
    freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
    moduleExports = freeModule && freeModule.exports === freeExports;
    Buffer2 = moduleExports ? root_default.Buffer : void 0;
    nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
    isBuffer = nativeIsBuffer || stubFalse_default;
    isBuffer_default = isBuffer;
  }
});

// node_modules/lodash-es/_baseIsTypedArray.js
function baseIsTypedArray(value) {
  return isObjectLike_default(value) && isLength_default(value.length) && !!typedArrayTags[baseGetTag_default(value)];
}
var argsTag2, arrayTag, boolTag, dateTag, errorTag, funcTag2, mapTag, numberTag, objectTag, regexpTag, setTag, stringTag, weakMapTag, arrayBufferTag, dataViewTag, float32Tag, float64Tag, int8Tag, int16Tag, int32Tag, uint8Tag, uint8ClampedTag, uint16Tag, uint32Tag, typedArrayTags, baseIsTypedArray_default;
var init_baseIsTypedArray = __esm({
  "node_modules/lodash-es/_baseIsTypedArray.js"() {
    init_baseGetTag();
    init_isLength();
    init_isObjectLike();
    argsTag2 = "[object Arguments]";
    arrayTag = "[object Array]";
    boolTag = "[object Boolean]";
    dateTag = "[object Date]";
    errorTag = "[object Error]";
    funcTag2 = "[object Function]";
    mapTag = "[object Map]";
    numberTag = "[object Number]";
    objectTag = "[object Object]";
    regexpTag = "[object RegExp]";
    setTag = "[object Set]";
    stringTag = "[object String]";
    weakMapTag = "[object WeakMap]";
    arrayBufferTag = "[object ArrayBuffer]";
    dataViewTag = "[object DataView]";
    float32Tag = "[object Float32Array]";
    float64Tag = "[object Float64Array]";
    int8Tag = "[object Int8Array]";
    int16Tag = "[object Int16Array]";
    int32Tag = "[object Int32Array]";
    uint8Tag = "[object Uint8Array]";
    uint8ClampedTag = "[object Uint8ClampedArray]";
    uint16Tag = "[object Uint16Array]";
    uint32Tag = "[object Uint32Array]";
    typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag2] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag2] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    baseIsTypedArray_default = baseIsTypedArray;
  }
});

// node_modules/lodash-es/_baseUnary.js
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}
var baseUnary_default;
var init_baseUnary = __esm({
  "node_modules/lodash-es/_baseUnary.js"() {
    baseUnary_default = baseUnary;
  }
});

// node_modules/lodash-es/_nodeUtil.js
var freeExports2, freeModule2, moduleExports2, freeProcess, nodeUtil, nodeUtil_default;
var init_nodeUtil = __esm({
  "node_modules/lodash-es/_nodeUtil.js"() {
    init_freeGlobal();
    freeExports2 = typeof exports == "object" && exports && !exports.nodeType && exports;
    freeModule2 = freeExports2 && typeof module == "object" && module && !module.nodeType && module;
    moduleExports2 = freeModule2 && freeModule2.exports === freeExports2;
    freeProcess = moduleExports2 && freeGlobal_default.process;
    nodeUtil = (function() {
      try {
        var types = freeModule2 && freeModule2.require && freeModule2.require("util").types;
        if (types) {
          return types;
        }
        return freeProcess && freeProcess.binding && freeProcess.binding("util");
      } catch (e) {
      }
    })();
    nodeUtil_default = nodeUtil;
  }
});

// node_modules/lodash-es/isTypedArray.js
var nodeIsTypedArray, isTypedArray, isTypedArray_default;
var init_isTypedArray = __esm({
  "node_modules/lodash-es/isTypedArray.js"() {
    init_baseIsTypedArray();
    init_baseUnary();
    init_nodeUtil();
    nodeIsTypedArray = nodeUtil_default && nodeUtil_default.isTypedArray;
    isTypedArray = nodeIsTypedArray ? baseUnary_default(nodeIsTypedArray) : baseIsTypedArray_default;
    isTypedArray_default = isTypedArray;
  }
});

// node_modules/lodash-es/_arrayLikeKeys.js
function arrayLikeKeys(value, inherited) {
  var isArr = isArray_default(value), isArg = !isArr && isArguments_default(value), isBuff = !isArr && !isArg && isBuffer_default(value), isType = !isArr && !isArg && !isBuff && isTypedArray_default(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes_default(value.length, String) : [], length = result.length;
  for (var key in value) {
    if ((inherited || hasOwnProperty5.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
    (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
    isIndex_default(key, length)))) {
      result.push(key);
    }
  }
  return result;
}
var objectProto7, hasOwnProperty5, arrayLikeKeys_default;
var init_arrayLikeKeys = __esm({
  "node_modules/lodash-es/_arrayLikeKeys.js"() {
    init_baseTimes();
    init_isArguments();
    init_isArray();
    init_isBuffer();
    init_isIndex();
    init_isTypedArray();
    objectProto7 = Object.prototype;
    hasOwnProperty5 = objectProto7.hasOwnProperty;
    arrayLikeKeys_default = arrayLikeKeys;
  }
});

// node_modules/lodash-es/_overArg.js
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}
var overArg_default;
var init_overArg = __esm({
  "node_modules/lodash-es/_overArg.js"() {
    overArg_default = overArg;
  }
});

// node_modules/lodash-es/_nativeKeys.js
var nativeKeys, nativeKeys_default;
var init_nativeKeys = __esm({
  "node_modules/lodash-es/_nativeKeys.js"() {
    init_overArg();
    nativeKeys = overArg_default(Object.keys, Object);
    nativeKeys_default = nativeKeys;
  }
});

// node_modules/lodash-es/_baseKeys.js
function baseKeys(object) {
  if (!isPrototype_default(object)) {
    return nativeKeys_default(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty6.call(object, key) && key != "constructor") {
      result.push(key);
    }
  }
  return result;
}
var objectProto8, hasOwnProperty6, baseKeys_default;
var init_baseKeys = __esm({
  "node_modules/lodash-es/_baseKeys.js"() {
    init_isPrototype();
    init_nativeKeys();
    objectProto8 = Object.prototype;
    hasOwnProperty6 = objectProto8.hasOwnProperty;
    baseKeys_default = baseKeys;
  }
});

// node_modules/lodash-es/keys.js
function keys(object) {
  return isArrayLike_default(object) ? arrayLikeKeys_default(object) : baseKeys_default(object);
}
var keys_default;
var init_keys = __esm({
  "node_modules/lodash-es/keys.js"() {
    init_arrayLikeKeys();
    init_baseKeys();
    init_isArrayLike();
    keys_default = keys;
  }
});

// node_modules/lodash-es/assign.js
var objectProto9, hasOwnProperty7, assign, assign_default;
var init_assign = __esm({
  "node_modules/lodash-es/assign.js"() {
    init_assignValue();
    init_copyObject();
    init_createAssigner();
    init_isArrayLike();
    init_isPrototype();
    init_keys();
    objectProto9 = Object.prototype;
    hasOwnProperty7 = objectProto9.hasOwnProperty;
    assign = createAssigner_default(function(object, source) {
      if (isPrototype_default(source) || isArrayLike_default(source)) {
        copyObject_default(source, keys_default(source), object);
        return;
      }
      for (var key in source) {
        if (hasOwnProperty7.call(source, key)) {
          assignValue_default(object, key, source[key]);
        }
      }
    });
    assign_default = assign;
  }
});

// node_modules/lodash-es/_nativeKeysIn.js
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}
var nativeKeysIn_default;
var init_nativeKeysIn = __esm({
  "node_modules/lodash-es/_nativeKeysIn.js"() {
    nativeKeysIn_default = nativeKeysIn;
  }
});

// node_modules/lodash-es/_baseKeysIn.js
function baseKeysIn(object) {
  if (!isObject_default(object)) {
    return nativeKeysIn_default(object);
  }
  var isProto = isPrototype_default(object), result = [];
  for (var key in object) {
    if (!(key == "constructor" && (isProto || !hasOwnProperty8.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}
var objectProto10, hasOwnProperty8, baseKeysIn_default;
var init_baseKeysIn = __esm({
  "node_modules/lodash-es/_baseKeysIn.js"() {
    init_isObject();
    init_isPrototype();
    init_nativeKeysIn();
    objectProto10 = Object.prototype;
    hasOwnProperty8 = objectProto10.hasOwnProperty;
    baseKeysIn_default = baseKeysIn;
  }
});

// node_modules/lodash-es/keysIn.js
function keysIn(object) {
  return isArrayLike_default(object) ? arrayLikeKeys_default(object, true) : baseKeysIn_default(object);
}
var keysIn_default;
var init_keysIn = __esm({
  "node_modules/lodash-es/keysIn.js"() {
    init_arrayLikeKeys();
    init_baseKeysIn();
    init_isArrayLike();
    keysIn_default = keysIn;
  }
});

// node_modules/lodash-es/_isKey.js
function isKey(value, object) {
  if (isArray_default(value)) {
    return false;
  }
  var type = typeof value;
  if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol_default(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}
var reIsDeepProp, reIsPlainProp, isKey_default;
var init_isKey = __esm({
  "node_modules/lodash-es/_isKey.js"() {
    init_isArray();
    init_isSymbol();
    reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
    reIsPlainProp = /^\w*$/;
    isKey_default = isKey;
  }
});

// node_modules/lodash-es/_nativeCreate.js
var nativeCreate, nativeCreate_default;
var init_nativeCreate = __esm({
  "node_modules/lodash-es/_nativeCreate.js"() {
    init_getNative();
    nativeCreate = getNative_default(Object, "create");
    nativeCreate_default = nativeCreate;
  }
});

// node_modules/lodash-es/_hashClear.js
function hashClear() {
  this.__data__ = nativeCreate_default ? nativeCreate_default(null) : {};
  this.size = 0;
}
var hashClear_default;
var init_hashClear = __esm({
  "node_modules/lodash-es/_hashClear.js"() {
    init_nativeCreate();
    hashClear_default = hashClear;
  }
});

// node_modules/lodash-es/_hashDelete.js
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
var hashDelete_default;
var init_hashDelete = __esm({
  "node_modules/lodash-es/_hashDelete.js"() {
    hashDelete_default = hashDelete;
  }
});

// node_modules/lodash-es/_hashGet.js
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate_default) {
    var result = data[key];
    return result === HASH_UNDEFINED ? void 0 : result;
  }
  return hasOwnProperty9.call(data, key) ? data[key] : void 0;
}
var HASH_UNDEFINED, objectProto11, hasOwnProperty9, hashGet_default;
var init_hashGet = __esm({
  "node_modules/lodash-es/_hashGet.js"() {
    init_nativeCreate();
    HASH_UNDEFINED = "__lodash_hash_undefined__";
    objectProto11 = Object.prototype;
    hasOwnProperty9 = objectProto11.hasOwnProperty;
    hashGet_default = hashGet;
  }
});

// node_modules/lodash-es/_hashHas.js
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate_default ? data[key] !== void 0 : hasOwnProperty10.call(data, key);
}
var objectProto12, hasOwnProperty10, hashHas_default;
var init_hashHas = __esm({
  "node_modules/lodash-es/_hashHas.js"() {
    init_nativeCreate();
    objectProto12 = Object.prototype;
    hasOwnProperty10 = objectProto12.hasOwnProperty;
    hashHas_default = hashHas;
  }
});

// node_modules/lodash-es/_hashSet.js
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate_default && value === void 0 ? HASH_UNDEFINED2 : value;
  return this;
}
var HASH_UNDEFINED2, hashSet_default;
var init_hashSet = __esm({
  "node_modules/lodash-es/_hashSet.js"() {
    init_nativeCreate();
    HASH_UNDEFINED2 = "__lodash_hash_undefined__";
    hashSet_default = hashSet;
  }
});

// node_modules/lodash-es/_Hash.js
function Hash(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
var Hash_default;
var init_Hash = __esm({
  "node_modules/lodash-es/_Hash.js"() {
    init_hashClear();
    init_hashDelete();
    init_hashGet();
    init_hashHas();
    init_hashSet();
    Hash.prototype.clear = hashClear_default;
    Hash.prototype["delete"] = hashDelete_default;
    Hash.prototype.get = hashGet_default;
    Hash.prototype.has = hashHas_default;
    Hash.prototype.set = hashSet_default;
    Hash_default = Hash;
  }
});

// node_modules/lodash-es/_listCacheClear.js
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}
var listCacheClear_default;
var init_listCacheClear = __esm({
  "node_modules/lodash-es/_listCacheClear.js"() {
    listCacheClear_default = listCacheClear;
  }
});

// node_modules/lodash-es/_assocIndexOf.js
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_default(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}
var assocIndexOf_default;
var init_assocIndexOf = __esm({
  "node_modules/lodash-es/_assocIndexOf.js"() {
    init_eq();
    assocIndexOf_default = assocIndexOf;
  }
});

// node_modules/lodash-es/_listCacheDelete.js
function listCacheDelete(key) {
  var data = this.__data__, index = assocIndexOf_default(data, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}
var arrayProto, splice, listCacheDelete_default;
var init_listCacheDelete = __esm({
  "node_modules/lodash-es/_listCacheDelete.js"() {
    init_assocIndexOf();
    arrayProto = Array.prototype;
    splice = arrayProto.splice;
    listCacheDelete_default = listCacheDelete;
  }
});

// node_modules/lodash-es/_listCacheGet.js
function listCacheGet(key) {
  var data = this.__data__, index = assocIndexOf_default(data, key);
  return index < 0 ? void 0 : data[index][1];
}
var listCacheGet_default;
var init_listCacheGet = __esm({
  "node_modules/lodash-es/_listCacheGet.js"() {
    init_assocIndexOf();
    listCacheGet_default = listCacheGet;
  }
});

// node_modules/lodash-es/_listCacheHas.js
function listCacheHas(key) {
  return assocIndexOf_default(this.__data__, key) > -1;
}
var listCacheHas_default;
var init_listCacheHas = __esm({
  "node_modules/lodash-es/_listCacheHas.js"() {
    init_assocIndexOf();
    listCacheHas_default = listCacheHas;
  }
});

// node_modules/lodash-es/_listCacheSet.js
function listCacheSet(key, value) {
  var data = this.__data__, index = assocIndexOf_default(data, key);
  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}
var listCacheSet_default;
var init_listCacheSet = __esm({
  "node_modules/lodash-es/_listCacheSet.js"() {
    init_assocIndexOf();
    listCacheSet_default = listCacheSet;
  }
});

// node_modules/lodash-es/_ListCache.js
function ListCache(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
var ListCache_default;
var init_ListCache = __esm({
  "node_modules/lodash-es/_ListCache.js"() {
    init_listCacheClear();
    init_listCacheDelete();
    init_listCacheGet();
    init_listCacheHas();
    init_listCacheSet();
    ListCache.prototype.clear = listCacheClear_default;
    ListCache.prototype["delete"] = listCacheDelete_default;
    ListCache.prototype.get = listCacheGet_default;
    ListCache.prototype.has = listCacheHas_default;
    ListCache.prototype.set = listCacheSet_default;
    ListCache_default = ListCache;
  }
});

// node_modules/lodash-es/_Map.js
var Map2, Map_default;
var init_Map = __esm({
  "node_modules/lodash-es/_Map.js"() {
    init_getNative();
    init_root();
    Map2 = getNative_default(root_default, "Map");
    Map_default = Map2;
  }
});

// node_modules/lodash-es/_mapCacheClear.js
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    "hash": new Hash_default(),
    "map": new (Map_default || ListCache_default)(),
    "string": new Hash_default()
  };
}
var mapCacheClear_default;
var init_mapCacheClear = __esm({
  "node_modules/lodash-es/_mapCacheClear.js"() {
    init_Hash();
    init_ListCache();
    init_Map();
    mapCacheClear_default = mapCacheClear;
  }
});

// node_modules/lodash-es/_isKeyable.js
function isKeyable(value) {
  var type = typeof value;
  return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
var isKeyable_default;
var init_isKeyable = __esm({
  "node_modules/lodash-es/_isKeyable.js"() {
    isKeyable_default = isKeyable;
  }
});

// node_modules/lodash-es/_getMapData.js
function getMapData(map2, key) {
  var data = map2.__data__;
  return isKeyable_default(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
var getMapData_default;
var init_getMapData = __esm({
  "node_modules/lodash-es/_getMapData.js"() {
    init_isKeyable();
    getMapData_default = getMapData;
  }
});

// node_modules/lodash-es/_mapCacheDelete.js
function mapCacheDelete(key) {
  var result = getMapData_default(this, key)["delete"](key);
  this.size -= result ? 1 : 0;
  return result;
}
var mapCacheDelete_default;
var init_mapCacheDelete = __esm({
  "node_modules/lodash-es/_mapCacheDelete.js"() {
    init_getMapData();
    mapCacheDelete_default = mapCacheDelete;
  }
});

// node_modules/lodash-es/_mapCacheGet.js
function mapCacheGet(key) {
  return getMapData_default(this, key).get(key);
}
var mapCacheGet_default;
var init_mapCacheGet = __esm({
  "node_modules/lodash-es/_mapCacheGet.js"() {
    init_getMapData();
    mapCacheGet_default = mapCacheGet;
  }
});

// node_modules/lodash-es/_mapCacheHas.js
function mapCacheHas(key) {
  return getMapData_default(this, key).has(key);
}
var mapCacheHas_default;
var init_mapCacheHas = __esm({
  "node_modules/lodash-es/_mapCacheHas.js"() {
    init_getMapData();
    mapCacheHas_default = mapCacheHas;
  }
});

// node_modules/lodash-es/_mapCacheSet.js
function mapCacheSet(key, value) {
  var data = getMapData_default(this, key), size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}
var mapCacheSet_default;
var init_mapCacheSet = __esm({
  "node_modules/lodash-es/_mapCacheSet.js"() {
    init_getMapData();
    mapCacheSet_default = mapCacheSet;
  }
});

// node_modules/lodash-es/_MapCache.js
function MapCache(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
var MapCache_default;
var init_MapCache = __esm({
  "node_modules/lodash-es/_MapCache.js"() {
    init_mapCacheClear();
    init_mapCacheDelete();
    init_mapCacheGet();
    init_mapCacheHas();
    init_mapCacheSet();
    MapCache.prototype.clear = mapCacheClear_default;
    MapCache.prototype["delete"] = mapCacheDelete_default;
    MapCache.prototype.get = mapCacheGet_default;
    MapCache.prototype.has = mapCacheHas_default;
    MapCache.prototype.set = mapCacheSet_default;
    MapCache_default = MapCache;
  }
});

// node_modules/lodash-es/memoize.js
function memoize(func, resolver) {
  if (typeof func != "function" || resolver != null && typeof resolver != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache_default)();
  return memoized;
}
var FUNC_ERROR_TEXT, memoize_default;
var init_memoize = __esm({
  "node_modules/lodash-es/memoize.js"() {
    init_MapCache();
    FUNC_ERROR_TEXT = "Expected a function";
    memoize.Cache = MapCache_default;
    memoize_default = memoize;
  }
});

// node_modules/lodash-es/_memoizeCapped.js
function memoizeCapped(func) {
  var result = memoize_default(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });
  var cache = result.cache;
  return result;
}
var MAX_MEMOIZE_SIZE, memoizeCapped_default;
var init_memoizeCapped = __esm({
  "node_modules/lodash-es/_memoizeCapped.js"() {
    init_memoize();
    MAX_MEMOIZE_SIZE = 500;
    memoizeCapped_default = memoizeCapped;
  }
});

// node_modules/lodash-es/_stringToPath.js
var rePropName, reEscapeChar, stringToPath, stringToPath_default;
var init_stringToPath = __esm({
  "node_modules/lodash-es/_stringToPath.js"() {
    init_memoizeCapped();
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
    reEscapeChar = /\\(\\)?/g;
    stringToPath = memoizeCapped_default(function(string) {
      var result = [];
      if (string.charCodeAt(0) === 46) {
        result.push("");
      }
      string.replace(rePropName, function(match, number, quote, subString) {
        result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
      });
      return result;
    });
    stringToPath_default = stringToPath;
  }
});

// node_modules/lodash-es/toString.js
function toString(value) {
  return value == null ? "" : baseToString_default(value);
}
var toString_default;
var init_toString = __esm({
  "node_modules/lodash-es/toString.js"() {
    init_baseToString();
    toString_default = toString;
  }
});

// node_modules/lodash-es/_castPath.js
function castPath(value, object) {
  if (isArray_default(value)) {
    return value;
  }
  return isKey_default(value, object) ? [value] : stringToPath_default(toString_default(value));
}
var castPath_default;
var init_castPath = __esm({
  "node_modules/lodash-es/_castPath.js"() {
    init_isArray();
    init_isKey();
    init_stringToPath();
    init_toString();
    castPath_default = castPath;
  }
});

// node_modules/lodash-es/_toKey.js
function toKey(value) {
  if (typeof value == "string" || isSymbol_default(value)) {
    return value;
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY3 ? "-0" : result;
}
var INFINITY3, toKey_default;
var init_toKey = __esm({
  "node_modules/lodash-es/_toKey.js"() {
    init_isSymbol();
    INFINITY3 = 1 / 0;
    toKey_default = toKey;
  }
});

// node_modules/lodash-es/_baseGet.js
function baseGet(object, path3) {
  path3 = castPath_default(path3, object);
  var index = 0, length = path3.length;
  while (object != null && index < length) {
    object = object[toKey_default(path3[index++])];
  }
  return index && index == length ? object : void 0;
}
var baseGet_default;
var init_baseGet = __esm({
  "node_modules/lodash-es/_baseGet.js"() {
    init_castPath();
    init_toKey();
    baseGet_default = baseGet;
  }
});

// node_modules/lodash-es/get.js
function get(object, path3, defaultValue) {
  var result = object == null ? void 0 : baseGet_default(object, path3);
  return result === void 0 ? defaultValue : result;
}
var get_default;
var init_get = __esm({
  "node_modules/lodash-es/get.js"() {
    init_baseGet();
    get_default = get;
  }
});

// node_modules/lodash-es/_arrayPush.js
function arrayPush(array, values2) {
  var index = -1, length = values2.length, offset = array.length;
  while (++index < length) {
    array[offset + index] = values2[index];
  }
  return array;
}
var arrayPush_default;
var init_arrayPush = __esm({
  "node_modules/lodash-es/_arrayPush.js"() {
    arrayPush_default = arrayPush;
  }
});

// node_modules/lodash-es/_isFlattenable.js
function isFlattenable(value) {
  return isArray_default(value) || isArguments_default(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
}
var spreadableSymbol, isFlattenable_default;
var init_isFlattenable = __esm({
  "node_modules/lodash-es/_isFlattenable.js"() {
    init_Symbol();
    init_isArguments();
    init_isArray();
    spreadableSymbol = Symbol_default ? Symbol_default.isConcatSpreadable : void 0;
    isFlattenable_default = isFlattenable;
  }
});

// node_modules/lodash-es/_baseFlatten.js
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1, length = array.length;
  predicate || (predicate = isFlattenable_default);
  result || (result = []);
  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush_default(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}
var baseFlatten_default;
var init_baseFlatten = __esm({
  "node_modules/lodash-es/_baseFlatten.js"() {
    init_arrayPush();
    init_isFlattenable();
    baseFlatten_default = baseFlatten;
  }
});

// node_modules/lodash-es/flatten.js
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten_default(array, 1) : [];
}
var flatten_default;
var init_flatten = __esm({
  "node_modules/lodash-es/flatten.js"() {
    init_baseFlatten();
    flatten_default = flatten;
  }
});

// node_modules/lodash-es/_getPrototype.js
var getPrototype, getPrototype_default;
var init_getPrototype = __esm({
  "node_modules/lodash-es/_getPrototype.js"() {
    init_overArg();
    getPrototype = overArg_default(Object.getPrototypeOf, Object);
    getPrototype_default = getPrototype;
  }
});

// node_modules/lodash-es/_baseSlice.js
function baseSlice(array, start, end) {
  var index = -1, length = array.length;
  if (start < 0) {
    start = -start > length ? 0 : length + start;
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : end - start >>> 0;
  start >>>= 0;
  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}
var baseSlice_default;
var init_baseSlice = __esm({
  "node_modules/lodash-es/_baseSlice.js"() {
    baseSlice_default = baseSlice;
  }
});

// node_modules/lodash-es/_arrayReduce.js
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1, length = array == null ? 0 : array.length;
  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}
var arrayReduce_default;
var init_arrayReduce = __esm({
  "node_modules/lodash-es/_arrayReduce.js"() {
    arrayReduce_default = arrayReduce;
  }
});

// node_modules/lodash-es/_stackClear.js
function stackClear() {
  this.__data__ = new ListCache_default();
  this.size = 0;
}
var stackClear_default;
var init_stackClear = __esm({
  "node_modules/lodash-es/_stackClear.js"() {
    init_ListCache();
    stackClear_default = stackClear;
  }
});

// node_modules/lodash-es/_stackDelete.js
function stackDelete(key) {
  var data = this.__data__, result = data["delete"](key);
  this.size = data.size;
  return result;
}
var stackDelete_default;
var init_stackDelete = __esm({
  "node_modules/lodash-es/_stackDelete.js"() {
    stackDelete_default = stackDelete;
  }
});

// node_modules/lodash-es/_stackGet.js
function stackGet(key) {
  return this.__data__.get(key);
}
var stackGet_default;
var init_stackGet = __esm({
  "node_modules/lodash-es/_stackGet.js"() {
    stackGet_default = stackGet;
  }
});

// node_modules/lodash-es/_stackHas.js
function stackHas(key) {
  return this.__data__.has(key);
}
var stackHas_default;
var init_stackHas = __esm({
  "node_modules/lodash-es/_stackHas.js"() {
    stackHas_default = stackHas;
  }
});

// node_modules/lodash-es/_stackSet.js
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache_default) {
    var pairs = data.__data__;
    if (!Map_default || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache_default(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}
var LARGE_ARRAY_SIZE, stackSet_default;
var init_stackSet = __esm({
  "node_modules/lodash-es/_stackSet.js"() {
    init_ListCache();
    init_Map();
    init_MapCache();
    LARGE_ARRAY_SIZE = 200;
    stackSet_default = stackSet;
  }
});

// node_modules/lodash-es/_Stack.js
function Stack(entries) {
  var data = this.__data__ = new ListCache_default(entries);
  this.size = data.size;
}
var Stack_default;
var init_Stack = __esm({
  "node_modules/lodash-es/_Stack.js"() {
    init_ListCache();
    init_stackClear();
    init_stackDelete();
    init_stackGet();
    init_stackHas();
    init_stackSet();
    Stack.prototype.clear = stackClear_default;
    Stack.prototype["delete"] = stackDelete_default;
    Stack.prototype.get = stackGet_default;
    Stack.prototype.has = stackHas_default;
    Stack.prototype.set = stackSet_default;
    Stack_default = Stack;
  }
});

// node_modules/lodash-es/_baseAssign.js
function baseAssign(object, source) {
  return object && copyObject_default(source, keys_default(source), object);
}
var baseAssign_default;
var init_baseAssign = __esm({
  "node_modules/lodash-es/_baseAssign.js"() {
    init_copyObject();
    init_keys();
    baseAssign_default = baseAssign;
  }
});

// node_modules/lodash-es/_baseAssignIn.js
function baseAssignIn(object, source) {
  return object && copyObject_default(source, keysIn_default(source), object);
}
var baseAssignIn_default;
var init_baseAssignIn = __esm({
  "node_modules/lodash-es/_baseAssignIn.js"() {
    init_copyObject();
    init_keysIn();
    baseAssignIn_default = baseAssignIn;
  }
});

// node_modules/lodash-es/_cloneBuffer.js
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
  buffer.copy(result);
  return result;
}
var freeExports3, freeModule3, moduleExports3, Buffer3, allocUnsafe, cloneBuffer_default;
var init_cloneBuffer = __esm({
  "node_modules/lodash-es/_cloneBuffer.js"() {
    init_root();
    freeExports3 = typeof exports == "object" && exports && !exports.nodeType && exports;
    freeModule3 = freeExports3 && typeof module == "object" && module && !module.nodeType && module;
    moduleExports3 = freeModule3 && freeModule3.exports === freeExports3;
    Buffer3 = moduleExports3 ? root_default.Buffer : void 0;
    allocUnsafe = Buffer3 ? Buffer3.allocUnsafe : void 0;
    cloneBuffer_default = cloneBuffer;
  }
});

// node_modules/lodash-es/_arrayFilter.js
function arrayFilter(array, predicate) {
  var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}
var arrayFilter_default;
var init_arrayFilter = __esm({
  "node_modules/lodash-es/_arrayFilter.js"() {
    arrayFilter_default = arrayFilter;
  }
});

// node_modules/lodash-es/stubArray.js
function stubArray() {
  return [];
}
var stubArray_default;
var init_stubArray = __esm({
  "node_modules/lodash-es/stubArray.js"() {
    stubArray_default = stubArray;
  }
});

// node_modules/lodash-es/_getSymbols.js
var objectProto13, propertyIsEnumerable2, nativeGetSymbols, getSymbols, getSymbols_default;
var init_getSymbols = __esm({
  "node_modules/lodash-es/_getSymbols.js"() {
    init_arrayFilter();
    init_stubArray();
    objectProto13 = Object.prototype;
    propertyIsEnumerable2 = objectProto13.propertyIsEnumerable;
    nativeGetSymbols = Object.getOwnPropertySymbols;
    getSymbols = !nativeGetSymbols ? stubArray_default : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter_default(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable2.call(object, symbol);
      });
    };
    getSymbols_default = getSymbols;
  }
});

// node_modules/lodash-es/_copySymbols.js
function copySymbols(source, object) {
  return copyObject_default(source, getSymbols_default(source), object);
}
var copySymbols_default;
var init_copySymbols = __esm({
  "node_modules/lodash-es/_copySymbols.js"() {
    init_copyObject();
    init_getSymbols();
    copySymbols_default = copySymbols;
  }
});

// node_modules/lodash-es/_getSymbolsIn.js
var nativeGetSymbols2, getSymbolsIn, getSymbolsIn_default;
var init_getSymbolsIn = __esm({
  "node_modules/lodash-es/_getSymbolsIn.js"() {
    init_arrayPush();
    init_getPrototype();
    init_getSymbols();
    init_stubArray();
    nativeGetSymbols2 = Object.getOwnPropertySymbols;
    getSymbolsIn = !nativeGetSymbols2 ? stubArray_default : function(object) {
      var result = [];
      while (object) {
        arrayPush_default(result, getSymbols_default(object));
        object = getPrototype_default(object);
      }
      return result;
    };
    getSymbolsIn_default = getSymbolsIn;
  }
});

// node_modules/lodash-es/_copySymbolsIn.js
function copySymbolsIn(source, object) {
  return copyObject_default(source, getSymbolsIn_default(source), object);
}
var copySymbolsIn_default;
var init_copySymbolsIn = __esm({
  "node_modules/lodash-es/_copySymbolsIn.js"() {
    init_copyObject();
    init_getSymbolsIn();
    copySymbolsIn_default = copySymbolsIn;
  }
});

// node_modules/lodash-es/_baseGetAllKeys.js
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_default(object) ? result : arrayPush_default(result, symbolsFunc(object));
}
var baseGetAllKeys_default;
var init_baseGetAllKeys = __esm({
  "node_modules/lodash-es/_baseGetAllKeys.js"() {
    init_arrayPush();
    init_isArray();
    baseGetAllKeys_default = baseGetAllKeys;
  }
});

// node_modules/lodash-es/_getAllKeys.js
function getAllKeys(object) {
  return baseGetAllKeys_default(object, keys_default, getSymbols_default);
}
var getAllKeys_default;
var init_getAllKeys = __esm({
  "node_modules/lodash-es/_getAllKeys.js"() {
    init_baseGetAllKeys();
    init_getSymbols();
    init_keys();
    getAllKeys_default = getAllKeys;
  }
});

// node_modules/lodash-es/_getAllKeysIn.js
function getAllKeysIn(object) {
  return baseGetAllKeys_default(object, keysIn_default, getSymbolsIn_default);
}
var getAllKeysIn_default;
var init_getAllKeysIn = __esm({
  "node_modules/lodash-es/_getAllKeysIn.js"() {
    init_baseGetAllKeys();
    init_getSymbolsIn();
    init_keysIn();
    getAllKeysIn_default = getAllKeysIn;
  }
});

// node_modules/lodash-es/_DataView.js
var DataView, DataView_default;
var init_DataView = __esm({
  "node_modules/lodash-es/_DataView.js"() {
    init_getNative();
    init_root();
    DataView = getNative_default(root_default, "DataView");
    DataView_default = DataView;
  }
});

// node_modules/lodash-es/_Promise.js
var Promise2, Promise_default;
var init_Promise = __esm({
  "node_modules/lodash-es/_Promise.js"() {
    init_getNative();
    init_root();
    Promise2 = getNative_default(root_default, "Promise");
    Promise_default = Promise2;
  }
});

// node_modules/lodash-es/_Set.js
var Set2, Set_default;
var init_Set = __esm({
  "node_modules/lodash-es/_Set.js"() {
    init_getNative();
    init_root();
    Set2 = getNative_default(root_default, "Set");
    Set_default = Set2;
  }
});

// node_modules/lodash-es/_getTag.js
var mapTag2, objectTag2, promiseTag, setTag2, weakMapTag2, dataViewTag2, dataViewCtorString, mapCtorString, promiseCtorString, setCtorString, weakMapCtorString, getTag, getTag_default;
var init_getTag = __esm({
  "node_modules/lodash-es/_getTag.js"() {
    init_DataView();
    init_Map();
    init_Promise();
    init_Set();
    init_WeakMap();
    init_baseGetTag();
    init_toSource();
    mapTag2 = "[object Map]";
    objectTag2 = "[object Object]";
    promiseTag = "[object Promise]";
    setTag2 = "[object Set]";
    weakMapTag2 = "[object WeakMap]";
    dataViewTag2 = "[object DataView]";
    dataViewCtorString = toSource_default(DataView_default);
    mapCtorString = toSource_default(Map_default);
    promiseCtorString = toSource_default(Promise_default);
    setCtorString = toSource_default(Set_default);
    weakMapCtorString = toSource_default(WeakMap_default);
    getTag = baseGetTag_default;
    if (DataView_default && getTag(new DataView_default(new ArrayBuffer(1))) != dataViewTag2 || Map_default && getTag(new Map_default()) != mapTag2 || Promise_default && getTag(Promise_default.resolve()) != promiseTag || Set_default && getTag(new Set_default()) != setTag2 || WeakMap_default && getTag(new WeakMap_default()) != weakMapTag2) {
      getTag = function(value) {
        var result = baseGetTag_default(value), Ctor = result == objectTag2 ? value.constructor : void 0, ctorString = Ctor ? toSource_default(Ctor) : "";
        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString:
              return dataViewTag2;
            case mapCtorString:
              return mapTag2;
            case promiseCtorString:
              return promiseTag;
            case setCtorString:
              return setTag2;
            case weakMapCtorString:
              return weakMapTag2;
          }
        }
        return result;
      };
    }
    getTag_default = getTag;
  }
});

// node_modules/lodash-es/_initCloneArray.js
function initCloneArray(array) {
  var length = array.length, result = new array.constructor(length);
  if (length && typeof array[0] == "string" && hasOwnProperty11.call(array, "index")) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}
var objectProto14, hasOwnProperty11, initCloneArray_default;
var init_initCloneArray = __esm({
  "node_modules/lodash-es/_initCloneArray.js"() {
    objectProto14 = Object.prototype;
    hasOwnProperty11 = objectProto14.hasOwnProperty;
    initCloneArray_default = initCloneArray;
  }
});

// node_modules/lodash-es/_Uint8Array.js
var Uint8Array2, Uint8Array_default;
var init_Uint8Array = __esm({
  "node_modules/lodash-es/_Uint8Array.js"() {
    init_root();
    Uint8Array2 = root_default.Uint8Array;
    Uint8Array_default = Uint8Array2;
  }
});

// node_modules/lodash-es/_cloneArrayBuffer.js
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array_default(result).set(new Uint8Array_default(arrayBuffer));
  return result;
}
var cloneArrayBuffer_default;
var init_cloneArrayBuffer = __esm({
  "node_modules/lodash-es/_cloneArrayBuffer.js"() {
    init_Uint8Array();
    cloneArrayBuffer_default = cloneArrayBuffer;
  }
});

// node_modules/lodash-es/_cloneDataView.js
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer_default(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}
var cloneDataView_default;
var init_cloneDataView = __esm({
  "node_modules/lodash-es/_cloneDataView.js"() {
    init_cloneArrayBuffer();
    cloneDataView_default = cloneDataView;
  }
});

// node_modules/lodash-es/_cloneRegExp.js
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}
var reFlags, cloneRegExp_default;
var init_cloneRegExp = __esm({
  "node_modules/lodash-es/_cloneRegExp.js"() {
    reFlags = /\w*$/;
    cloneRegExp_default = cloneRegExp;
  }
});

// node_modules/lodash-es/_cloneSymbol.js
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}
var symbolProto2, symbolValueOf, cloneSymbol_default;
var init_cloneSymbol = __esm({
  "node_modules/lodash-es/_cloneSymbol.js"() {
    init_Symbol();
    symbolProto2 = Symbol_default ? Symbol_default.prototype : void 0;
    symbolValueOf = symbolProto2 ? symbolProto2.valueOf : void 0;
    cloneSymbol_default = cloneSymbol;
  }
});

// node_modules/lodash-es/_cloneTypedArray.js
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer_default(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
var cloneTypedArray_default;
var init_cloneTypedArray = __esm({
  "node_modules/lodash-es/_cloneTypedArray.js"() {
    init_cloneArrayBuffer();
    cloneTypedArray_default = cloneTypedArray;
  }
});

// node_modules/lodash-es/_initCloneByTag.js
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag2:
      return cloneArrayBuffer_default(object);
    case boolTag2:
    case dateTag2:
      return new Ctor(+object);
    case dataViewTag3:
      return cloneDataView_default(object, isDeep);
    case float32Tag2:
    case float64Tag2:
    case int8Tag2:
    case int16Tag2:
    case int32Tag2:
    case uint8Tag2:
    case uint8ClampedTag2:
    case uint16Tag2:
    case uint32Tag2:
      return cloneTypedArray_default(object, isDeep);
    case mapTag3:
      return new Ctor();
    case numberTag2:
    case stringTag2:
      return new Ctor(object);
    case regexpTag2:
      return cloneRegExp_default(object);
    case setTag3:
      return new Ctor();
    case symbolTag2:
      return cloneSymbol_default(object);
  }
}
var boolTag2, dateTag2, mapTag3, numberTag2, regexpTag2, setTag3, stringTag2, symbolTag2, arrayBufferTag2, dataViewTag3, float32Tag2, float64Tag2, int8Tag2, int16Tag2, int32Tag2, uint8Tag2, uint8ClampedTag2, uint16Tag2, uint32Tag2, initCloneByTag_default;
var init_initCloneByTag = __esm({
  "node_modules/lodash-es/_initCloneByTag.js"() {
    init_cloneArrayBuffer();
    init_cloneDataView();
    init_cloneRegExp();
    init_cloneSymbol();
    init_cloneTypedArray();
    boolTag2 = "[object Boolean]";
    dateTag2 = "[object Date]";
    mapTag3 = "[object Map]";
    numberTag2 = "[object Number]";
    regexpTag2 = "[object RegExp]";
    setTag3 = "[object Set]";
    stringTag2 = "[object String]";
    symbolTag2 = "[object Symbol]";
    arrayBufferTag2 = "[object ArrayBuffer]";
    dataViewTag3 = "[object DataView]";
    float32Tag2 = "[object Float32Array]";
    float64Tag2 = "[object Float64Array]";
    int8Tag2 = "[object Int8Array]";
    int16Tag2 = "[object Int16Array]";
    int32Tag2 = "[object Int32Array]";
    uint8Tag2 = "[object Uint8Array]";
    uint8ClampedTag2 = "[object Uint8ClampedArray]";
    uint16Tag2 = "[object Uint16Array]";
    uint32Tag2 = "[object Uint32Array]";
    initCloneByTag_default = initCloneByTag;
  }
});

// node_modules/lodash-es/_initCloneObject.js
function initCloneObject(object) {
  return typeof object.constructor == "function" && !isPrototype_default(object) ? baseCreate_default(getPrototype_default(object)) : {};
}
var initCloneObject_default;
var init_initCloneObject = __esm({
  "node_modules/lodash-es/_initCloneObject.js"() {
    init_baseCreate();
    init_getPrototype();
    init_isPrototype();
    initCloneObject_default = initCloneObject;
  }
});

// node_modules/lodash-es/_baseIsMap.js
function baseIsMap(value) {
  return isObjectLike_default(value) && getTag_default(value) == mapTag4;
}
var mapTag4, baseIsMap_default;
var init_baseIsMap = __esm({
  "node_modules/lodash-es/_baseIsMap.js"() {
    init_getTag();
    init_isObjectLike();
    mapTag4 = "[object Map]";
    baseIsMap_default = baseIsMap;
  }
});

// node_modules/lodash-es/isMap.js
var nodeIsMap, isMap, isMap_default;
var init_isMap = __esm({
  "node_modules/lodash-es/isMap.js"() {
    init_baseIsMap();
    init_baseUnary();
    init_nodeUtil();
    nodeIsMap = nodeUtil_default && nodeUtil_default.isMap;
    isMap = nodeIsMap ? baseUnary_default(nodeIsMap) : baseIsMap_default;
    isMap_default = isMap;
  }
});

// node_modules/lodash-es/_baseIsSet.js
function baseIsSet(value) {
  return isObjectLike_default(value) && getTag_default(value) == setTag4;
}
var setTag4, baseIsSet_default;
var init_baseIsSet = __esm({
  "node_modules/lodash-es/_baseIsSet.js"() {
    init_getTag();
    init_isObjectLike();
    setTag4 = "[object Set]";
    baseIsSet_default = baseIsSet;
  }
});

// node_modules/lodash-es/isSet.js
var nodeIsSet, isSet, isSet_default;
var init_isSet = __esm({
  "node_modules/lodash-es/isSet.js"() {
    init_baseIsSet();
    init_baseUnary();
    init_nodeUtil();
    nodeIsSet = nodeUtil_default && nodeUtil_default.isSet;
    isSet = nodeIsSet ? baseUnary_default(nodeIsSet) : baseIsSet_default;
    isSet_default = isSet;
  }
});

// node_modules/lodash-es/_baseClone.js
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== void 0) {
    return result;
  }
  if (!isObject_default(value)) {
    return value;
  }
  var isArr = isArray_default(value);
  if (isArr) {
    result = initCloneArray_default(value);
    if (!isDeep) {
      return copyArray_default(value, result);
    }
  } else {
    var tag = getTag_default(value), isFunc = tag == funcTag3 || tag == genTag2;
    if (isBuffer_default(value)) {
      return cloneBuffer_default(value, isDeep);
    }
    if (tag == objectTag3 || tag == argsTag3 || isFunc && !object) {
      result = isFlat || isFunc ? {} : initCloneObject_default(value);
      if (!isDeep) {
        return isFlat ? copySymbolsIn_default(value, baseAssignIn_default(result, value)) : copySymbols_default(value, baseAssign_default(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag_default(value, tag, isDeep);
    }
  }
  stack || (stack = new Stack_default());
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);
  if (isSet_default(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap_default(value)) {
    value.forEach(function(subValue, key2) {
      result.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
    });
  }
  var keysFunc = isFull ? isFlat ? getAllKeysIn_default : getAllKeys_default : isFlat ? keysIn_default : keys_default;
  var props = isArr ? void 0 : keysFunc(value);
  arrayEach_default(props || value, function(subValue, key2) {
    if (props) {
      key2 = subValue;
      subValue = value[key2];
    }
    assignValue_default(result, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
  });
  return result;
}
var CLONE_DEEP_FLAG, CLONE_FLAT_FLAG, CLONE_SYMBOLS_FLAG, argsTag3, arrayTag2, boolTag3, dateTag3, errorTag2, funcTag3, genTag2, mapTag5, numberTag3, objectTag3, regexpTag3, setTag5, stringTag3, symbolTag3, weakMapTag3, arrayBufferTag3, dataViewTag4, float32Tag3, float64Tag3, int8Tag3, int16Tag3, int32Tag3, uint8Tag3, uint8ClampedTag3, uint16Tag3, uint32Tag3, cloneableTags, baseClone_default;
var init_baseClone = __esm({
  "node_modules/lodash-es/_baseClone.js"() {
    init_Stack();
    init_arrayEach();
    init_assignValue();
    init_baseAssign();
    init_baseAssignIn();
    init_cloneBuffer();
    init_copyArray();
    init_copySymbols();
    init_copySymbolsIn();
    init_getAllKeys();
    init_getAllKeysIn();
    init_getTag();
    init_initCloneArray();
    init_initCloneByTag();
    init_initCloneObject();
    init_isArray();
    init_isBuffer();
    init_isMap();
    init_isObject();
    init_isSet();
    init_keys();
    init_keysIn();
    CLONE_DEEP_FLAG = 1;
    CLONE_FLAT_FLAG = 2;
    CLONE_SYMBOLS_FLAG = 4;
    argsTag3 = "[object Arguments]";
    arrayTag2 = "[object Array]";
    boolTag3 = "[object Boolean]";
    dateTag3 = "[object Date]";
    errorTag2 = "[object Error]";
    funcTag3 = "[object Function]";
    genTag2 = "[object GeneratorFunction]";
    mapTag5 = "[object Map]";
    numberTag3 = "[object Number]";
    objectTag3 = "[object Object]";
    regexpTag3 = "[object RegExp]";
    setTag5 = "[object Set]";
    stringTag3 = "[object String]";
    symbolTag3 = "[object Symbol]";
    weakMapTag3 = "[object WeakMap]";
    arrayBufferTag3 = "[object ArrayBuffer]";
    dataViewTag4 = "[object DataView]";
    float32Tag3 = "[object Float32Array]";
    float64Tag3 = "[object Float64Array]";
    int8Tag3 = "[object Int8Array]";
    int16Tag3 = "[object Int16Array]";
    int32Tag3 = "[object Int32Array]";
    uint8Tag3 = "[object Uint8Array]";
    uint8ClampedTag3 = "[object Uint8ClampedArray]";
    uint16Tag3 = "[object Uint16Array]";
    uint32Tag3 = "[object Uint32Array]";
    cloneableTags = {};
    cloneableTags[argsTag3] = cloneableTags[arrayTag2] = cloneableTags[arrayBufferTag3] = cloneableTags[dataViewTag4] = cloneableTags[boolTag3] = cloneableTags[dateTag3] = cloneableTags[float32Tag3] = cloneableTags[float64Tag3] = cloneableTags[int8Tag3] = cloneableTags[int16Tag3] = cloneableTags[int32Tag3] = cloneableTags[mapTag5] = cloneableTags[numberTag3] = cloneableTags[objectTag3] = cloneableTags[regexpTag3] = cloneableTags[setTag5] = cloneableTags[stringTag3] = cloneableTags[symbolTag3] = cloneableTags[uint8Tag3] = cloneableTags[uint8ClampedTag3] = cloneableTags[uint16Tag3] = cloneableTags[uint32Tag3] = true;
    cloneableTags[errorTag2] = cloneableTags[funcTag3] = cloneableTags[weakMapTag3] = false;
    baseClone_default = baseClone;
  }
});

// node_modules/lodash-es/clone.js
function clone(value) {
  return baseClone_default(value, CLONE_SYMBOLS_FLAG2);
}
var CLONE_SYMBOLS_FLAG2, clone_default;
var init_clone = __esm({
  "node_modules/lodash-es/clone.js"() {
    init_baseClone();
    CLONE_SYMBOLS_FLAG2 = 4;
    clone_default = clone;
  }
});

// node_modules/lodash-es/compact.js
function compact(array) {
  var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
  while (++index < length) {
    var value = array[index];
    if (value) {
      result[resIndex++] = value;
    }
  }
  return result;
}
var compact_default;
var init_compact = __esm({
  "node_modules/lodash-es/compact.js"() {
    compact_default = compact;
  }
});

// node_modules/lodash-es/_setCacheAdd.js
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED3);
  return this;
}
var HASH_UNDEFINED3, setCacheAdd_default;
var init_setCacheAdd = __esm({
  "node_modules/lodash-es/_setCacheAdd.js"() {
    HASH_UNDEFINED3 = "__lodash_hash_undefined__";
    setCacheAdd_default = setCacheAdd;
  }
});

// node_modules/lodash-es/_setCacheHas.js
function setCacheHas(value) {
  return this.__data__.has(value);
}
var setCacheHas_default;
var init_setCacheHas = __esm({
  "node_modules/lodash-es/_setCacheHas.js"() {
    setCacheHas_default = setCacheHas;
  }
});

// node_modules/lodash-es/_SetCache.js
function SetCache(values2) {
  var index = -1, length = values2 == null ? 0 : values2.length;
  this.__data__ = new MapCache_default();
  while (++index < length) {
    this.add(values2[index]);
  }
}
var SetCache_default;
var init_SetCache = __esm({
  "node_modules/lodash-es/_SetCache.js"() {
    init_MapCache();
    init_setCacheAdd();
    init_setCacheHas();
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd_default;
    SetCache.prototype.has = setCacheHas_default;
    SetCache_default = SetCache;
  }
});

// node_modules/lodash-es/_arraySome.js
function arraySome(array, predicate) {
  var index = -1, length = array == null ? 0 : array.length;
  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}
var arraySome_default;
var init_arraySome = __esm({
  "node_modules/lodash-es/_arraySome.js"() {
    arraySome_default = arraySome;
  }
});

// node_modules/lodash-es/_cacheHas.js
function cacheHas(cache, key) {
  return cache.has(key);
}
var cacheHas_default;
var init_cacheHas = __esm({
  "node_modules/lodash-es/_cacheHas.js"() {
    cacheHas_default = cacheHas;
  }
});

// node_modules/lodash-es/_equalArrays.js
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache_default() : void 0;
  stack.set(array, other);
  stack.set(other, array);
  while (++index < arrLength) {
    var arrValue = array[index], othValue = other[index];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== void 0) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    if (seen) {
      if (!arraySome_default(other, function(othValue2, othIndex) {
        if (!cacheHas_default(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
          return seen.push(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
      result = false;
      break;
    }
  }
  stack["delete"](array);
  stack["delete"](other);
  return result;
}
var COMPARE_PARTIAL_FLAG, COMPARE_UNORDERED_FLAG, equalArrays_default;
var init_equalArrays = __esm({
  "node_modules/lodash-es/_equalArrays.js"() {
    init_SetCache();
    init_arraySome();
    init_cacheHas();
    COMPARE_PARTIAL_FLAG = 1;
    COMPARE_UNORDERED_FLAG = 2;
    equalArrays_default = equalArrays;
  }
});

// node_modules/lodash-es/_mapToArray.js
function mapToArray(map2) {
  var index = -1, result = Array(map2.size);
  map2.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}
var mapToArray_default;
var init_mapToArray = __esm({
  "node_modules/lodash-es/_mapToArray.js"() {
    mapToArray_default = mapToArray;
  }
});

// node_modules/lodash-es/_setToArray.js
function setToArray(set) {
  var index = -1, result = Array(set.size);
  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}
var setToArray_default;
var init_setToArray = __esm({
  "node_modules/lodash-es/_setToArray.js"() {
    setToArray_default = setToArray;
  }
});

// node_modules/lodash-es/_equalByTag.js
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag5:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;
    case arrayBufferTag4:
      if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array_default(object), new Uint8Array_default(other))) {
        return false;
      }
      return true;
    case boolTag4:
    case dateTag4:
    case numberTag4:
      return eq_default(+object, +other);
    case errorTag3:
      return object.name == other.name && object.message == other.message;
    case regexpTag4:
    case stringTag4:
      return object == other + "";
    case mapTag6:
      var convert = mapToArray_default;
    case setTag6:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG2;
      convert || (convert = setToArray_default);
      if (object.size != other.size && !isPartial) {
        return false;
      }
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG2;
      stack.set(object, other);
      var result = equalArrays_default(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack["delete"](object);
      return result;
    case symbolTag4:
      if (symbolValueOf2) {
        return symbolValueOf2.call(object) == symbolValueOf2.call(other);
      }
  }
  return false;
}
var COMPARE_PARTIAL_FLAG2, COMPARE_UNORDERED_FLAG2, boolTag4, dateTag4, errorTag3, mapTag6, numberTag4, regexpTag4, setTag6, stringTag4, symbolTag4, arrayBufferTag4, dataViewTag5, symbolProto3, symbolValueOf2, equalByTag_default;
var init_equalByTag = __esm({
  "node_modules/lodash-es/_equalByTag.js"() {
    init_Symbol();
    init_Uint8Array();
    init_eq();
    init_equalArrays();
    init_mapToArray();
    init_setToArray();
    COMPARE_PARTIAL_FLAG2 = 1;
    COMPARE_UNORDERED_FLAG2 = 2;
    boolTag4 = "[object Boolean]";
    dateTag4 = "[object Date]";
    errorTag3 = "[object Error]";
    mapTag6 = "[object Map]";
    numberTag4 = "[object Number]";
    regexpTag4 = "[object RegExp]";
    setTag6 = "[object Set]";
    stringTag4 = "[object String]";
    symbolTag4 = "[object Symbol]";
    arrayBufferTag4 = "[object ArrayBuffer]";
    dataViewTag5 = "[object DataView]";
    symbolProto3 = Symbol_default ? Symbol_default.prototype : void 0;
    symbolValueOf2 = symbolProto3 ? symbolProto3.valueOf : void 0;
    equalByTag_default = equalByTag;
  }
});

// node_modules/lodash-es/_equalObjects.js
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG3, objProps = getAllKeys_default(object), objLength = objProps.length, othProps = getAllKeys_default(other), othLength = othProps.length;
  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty12.call(other, key))) {
      return false;
    }
  }
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);
  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key], othValue = other[key];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
    }
    if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == "constructor");
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor, othCtor = other.constructor;
    if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack["delete"](object);
  stack["delete"](other);
  return result;
}
var COMPARE_PARTIAL_FLAG3, objectProto15, hasOwnProperty12, equalObjects_default;
var init_equalObjects = __esm({
  "node_modules/lodash-es/_equalObjects.js"() {
    init_getAllKeys();
    COMPARE_PARTIAL_FLAG3 = 1;
    objectProto15 = Object.prototype;
    hasOwnProperty12 = objectProto15.hasOwnProperty;
    equalObjects_default = equalObjects;
  }
});

// node_modules/lodash-es/_baseIsEqualDeep.js
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray_default(object), othIsArr = isArray_default(other), objTag = objIsArr ? arrayTag3 : getTag_default(object), othTag = othIsArr ? arrayTag3 : getTag_default(other);
  objTag = objTag == argsTag4 ? objectTag4 : objTag;
  othTag = othTag == argsTag4 ? objectTag4 : othTag;
  var objIsObj = objTag == objectTag4, othIsObj = othTag == objectTag4, isSameTag = objTag == othTag;
  if (isSameTag && isBuffer_default(object)) {
    if (!isBuffer_default(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack_default());
    return objIsArr || isTypedArray_default(object) ? equalArrays_default(object, other, bitmask, customizer, equalFunc, stack) : equalByTag_default(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG4)) {
    var objIsWrapped = objIsObj && hasOwnProperty13.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty13.call(other, "__wrapped__");
    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
      stack || (stack = new Stack_default());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack_default());
  return equalObjects_default(object, other, bitmask, customizer, equalFunc, stack);
}
var COMPARE_PARTIAL_FLAG4, argsTag4, arrayTag3, objectTag4, objectProto16, hasOwnProperty13, baseIsEqualDeep_default;
var init_baseIsEqualDeep = __esm({
  "node_modules/lodash-es/_baseIsEqualDeep.js"() {
    init_Stack();
    init_equalArrays();
    init_equalByTag();
    init_equalObjects();
    init_getTag();
    init_isArray();
    init_isBuffer();
    init_isTypedArray();
    COMPARE_PARTIAL_FLAG4 = 1;
    argsTag4 = "[object Arguments]";
    arrayTag3 = "[object Array]";
    objectTag4 = "[object Object]";
    objectProto16 = Object.prototype;
    hasOwnProperty13 = objectProto16.hasOwnProperty;
    baseIsEqualDeep_default = baseIsEqualDeep;
  }
});

// node_modules/lodash-es/_baseIsEqual.js
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || !isObjectLike_default(value) && !isObjectLike_default(other)) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep_default(value, other, bitmask, customizer, baseIsEqual, stack);
}
var baseIsEqual_default;
var init_baseIsEqual = __esm({
  "node_modules/lodash-es/_baseIsEqual.js"() {
    init_baseIsEqualDeep();
    init_isObjectLike();
    baseIsEqual_default = baseIsEqual;
  }
});

// node_modules/lodash-es/_baseIsMatch.js
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length, length = index, noCustomizer = !customizer;
  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0], objValue = object[key], srcValue = data[1];
    if (noCustomizer && data[2]) {
      if (objValue === void 0 && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack_default();
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === void 0 ? baseIsEqual_default(srcValue, objValue, COMPARE_PARTIAL_FLAG5 | COMPARE_UNORDERED_FLAG3, customizer, stack) : result)) {
        return false;
      }
    }
  }
  return true;
}
var COMPARE_PARTIAL_FLAG5, COMPARE_UNORDERED_FLAG3, baseIsMatch_default;
var init_baseIsMatch = __esm({
  "node_modules/lodash-es/_baseIsMatch.js"() {
    init_Stack();
    init_baseIsEqual();
    COMPARE_PARTIAL_FLAG5 = 1;
    COMPARE_UNORDERED_FLAG3 = 2;
    baseIsMatch_default = baseIsMatch;
  }
});

// node_modules/lodash-es/_isStrictComparable.js
function isStrictComparable(value) {
  return value === value && !isObject_default(value);
}
var isStrictComparable_default;
var init_isStrictComparable = __esm({
  "node_modules/lodash-es/_isStrictComparable.js"() {
    init_isObject();
    isStrictComparable_default = isStrictComparable;
  }
});

// node_modules/lodash-es/_getMatchData.js
function getMatchData(object) {
  var result = keys_default(object), length = result.length;
  while (length--) {
    var key = result[length], value = object[key];
    result[length] = [key, value, isStrictComparable_default(value)];
  }
  return result;
}
var getMatchData_default;
var init_getMatchData = __esm({
  "node_modules/lodash-es/_getMatchData.js"() {
    init_isStrictComparable();
    init_keys();
    getMatchData_default = getMatchData;
  }
});

// node_modules/lodash-es/_matchesStrictComparable.js
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
  };
}
var matchesStrictComparable_default;
var init_matchesStrictComparable = __esm({
  "node_modules/lodash-es/_matchesStrictComparable.js"() {
    matchesStrictComparable_default = matchesStrictComparable;
  }
});

// node_modules/lodash-es/_baseMatches.js
function baseMatches(source) {
  var matchData = getMatchData_default(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable_default(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch_default(object, source, matchData);
  };
}
var baseMatches_default;
var init_baseMatches = __esm({
  "node_modules/lodash-es/_baseMatches.js"() {
    init_baseIsMatch();
    init_getMatchData();
    init_matchesStrictComparable();
    baseMatches_default = baseMatches;
  }
});

// node_modules/lodash-es/_baseHasIn.js
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}
var baseHasIn_default;
var init_baseHasIn = __esm({
  "node_modules/lodash-es/_baseHasIn.js"() {
    baseHasIn_default = baseHasIn;
  }
});

// node_modules/lodash-es/_hasPath.js
function hasPath(object, path3, hasFunc) {
  path3 = castPath_default(path3, object);
  var index = -1, length = path3.length, result = false;
  while (++index < length) {
    var key = toKey_default(path3[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength_default(length) && isIndex_default(key, length) && (isArray_default(object) || isArguments_default(object));
}
var hasPath_default;
var init_hasPath = __esm({
  "node_modules/lodash-es/_hasPath.js"() {
    init_castPath();
    init_isArguments();
    init_isArray();
    init_isIndex();
    init_isLength();
    init_toKey();
    hasPath_default = hasPath;
  }
});

// node_modules/lodash-es/hasIn.js
function hasIn(object, path3) {
  return object != null && hasPath_default(object, path3, baseHasIn_default);
}
var hasIn_default;
var init_hasIn = __esm({
  "node_modules/lodash-es/hasIn.js"() {
    init_baseHasIn();
    init_hasPath();
    hasIn_default = hasIn;
  }
});

// node_modules/lodash-es/_baseMatchesProperty.js
function baseMatchesProperty(path3, srcValue) {
  if (isKey_default(path3) && isStrictComparable_default(srcValue)) {
    return matchesStrictComparable_default(toKey_default(path3), srcValue);
  }
  return function(object) {
    var objValue = get_default(object, path3);
    return objValue === void 0 && objValue === srcValue ? hasIn_default(object, path3) : baseIsEqual_default(srcValue, objValue, COMPARE_PARTIAL_FLAG6 | COMPARE_UNORDERED_FLAG4);
  };
}
var COMPARE_PARTIAL_FLAG6, COMPARE_UNORDERED_FLAG4, baseMatchesProperty_default;
var init_baseMatchesProperty = __esm({
  "node_modules/lodash-es/_baseMatchesProperty.js"() {
    init_baseIsEqual();
    init_get();
    init_hasIn();
    init_isKey();
    init_isStrictComparable();
    init_matchesStrictComparable();
    init_toKey();
    COMPARE_PARTIAL_FLAG6 = 1;
    COMPARE_UNORDERED_FLAG4 = 2;
    baseMatchesProperty_default = baseMatchesProperty;
  }
});

// node_modules/lodash-es/_baseProperty.js
function baseProperty(key) {
  return function(object) {
    return object == null ? void 0 : object[key];
  };
}
var baseProperty_default;
var init_baseProperty = __esm({
  "node_modules/lodash-es/_baseProperty.js"() {
    baseProperty_default = baseProperty;
  }
});

// node_modules/lodash-es/_basePropertyDeep.js
function basePropertyDeep(path3) {
  return function(object) {
    return baseGet_default(object, path3);
  };
}
var basePropertyDeep_default;
var init_basePropertyDeep = __esm({
  "node_modules/lodash-es/_basePropertyDeep.js"() {
    init_baseGet();
    basePropertyDeep_default = basePropertyDeep;
  }
});

// node_modules/lodash-es/property.js
function property(path3) {
  return isKey_default(path3) ? baseProperty_default(toKey_default(path3)) : basePropertyDeep_default(path3);
}
var property_default;
var init_property = __esm({
  "node_modules/lodash-es/property.js"() {
    init_baseProperty();
    init_basePropertyDeep();
    init_isKey();
    init_toKey();
    property_default = property;
  }
});

// node_modules/lodash-es/_baseIteratee.js
function baseIteratee(value) {
  if (typeof value == "function") {
    return value;
  }
  if (value == null) {
    return identity_default;
  }
  if (typeof value == "object") {
    return isArray_default(value) ? baseMatchesProperty_default(value[0], value[1]) : baseMatches_default(value);
  }
  return property_default(value);
}
var baseIteratee_default;
var init_baseIteratee = __esm({
  "node_modules/lodash-es/_baseIteratee.js"() {
    init_baseMatches();
    init_baseMatchesProperty();
    init_identity();
    init_isArray();
    init_property();
    baseIteratee_default = baseIteratee;
  }
});

// node_modules/lodash-es/_arrayAggregator.js
function arrayAggregator(array, setter, iteratee, accumulator) {
  var index = -1, length = array == null ? 0 : array.length;
  while (++index < length) {
    var value = array[index];
    setter(accumulator, value, iteratee(value), array);
  }
  return accumulator;
}
var arrayAggregator_default;
var init_arrayAggregator = __esm({
  "node_modules/lodash-es/_arrayAggregator.js"() {
    arrayAggregator_default = arrayAggregator;
  }
});

// node_modules/lodash-es/_createBaseFor.js
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}
var createBaseFor_default;
var init_createBaseFor = __esm({
  "node_modules/lodash-es/_createBaseFor.js"() {
    createBaseFor_default = createBaseFor;
  }
});

// node_modules/lodash-es/_baseFor.js
var baseFor, baseFor_default;
var init_baseFor = __esm({
  "node_modules/lodash-es/_baseFor.js"() {
    init_createBaseFor();
    baseFor = createBaseFor_default();
    baseFor_default = baseFor;
  }
});

// node_modules/lodash-es/_baseForOwn.js
function baseForOwn(object, iteratee) {
  return object && baseFor_default(object, iteratee, keys_default);
}
var baseForOwn_default;
var init_baseForOwn = __esm({
  "node_modules/lodash-es/_baseForOwn.js"() {
    init_baseFor();
    init_keys();
    baseForOwn_default = baseForOwn;
  }
});

// node_modules/lodash-es/_createBaseEach.js
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike_default(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
    while (fromRight ? index-- : ++index < length) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}
var createBaseEach_default;
var init_createBaseEach = __esm({
  "node_modules/lodash-es/_createBaseEach.js"() {
    init_isArrayLike();
    createBaseEach_default = createBaseEach;
  }
});

// node_modules/lodash-es/_baseEach.js
var baseEach, baseEach_default;
var init_baseEach = __esm({
  "node_modules/lodash-es/_baseEach.js"() {
    init_baseForOwn();
    init_createBaseEach();
    baseEach = createBaseEach_default(baseForOwn_default);
    baseEach_default = baseEach;
  }
});

// node_modules/lodash-es/_baseAggregator.js
function baseAggregator(collection, setter, iteratee, accumulator) {
  baseEach_default(collection, function(value, key, collection2) {
    setter(accumulator, value, iteratee(value), collection2);
  });
  return accumulator;
}
var baseAggregator_default;
var init_baseAggregator = __esm({
  "node_modules/lodash-es/_baseAggregator.js"() {
    init_baseEach();
    baseAggregator_default = baseAggregator;
  }
});

// node_modules/lodash-es/_createAggregator.js
function createAggregator(setter, initializer) {
  return function(collection, iteratee) {
    var func = isArray_default(collection) ? arrayAggregator_default : baseAggregator_default, accumulator = initializer ? initializer() : {};
    return func(collection, setter, baseIteratee_default(iteratee, 2), accumulator);
  };
}
var createAggregator_default;
var init_createAggregator = __esm({
  "node_modules/lodash-es/_createAggregator.js"() {
    init_arrayAggregator();
    init_baseAggregator();
    init_baseIteratee();
    init_isArray();
    createAggregator_default = createAggregator;
  }
});

// node_modules/lodash-es/defaults.js
var objectProto17, hasOwnProperty14, defaults, defaults_default;
var init_defaults = __esm({
  "node_modules/lodash-es/defaults.js"() {
    init_baseRest();
    init_eq();
    init_isIterateeCall();
    init_keysIn();
    objectProto17 = Object.prototype;
    hasOwnProperty14 = objectProto17.hasOwnProperty;
    defaults = baseRest_default(function(object, sources) {
      object = Object(object);
      var index = -1;
      var length = sources.length;
      var guard = length > 2 ? sources[2] : void 0;
      if (guard && isIterateeCall_default(sources[0], sources[1], guard)) {
        length = 1;
      }
      while (++index < length) {
        var source = sources[index];
        var props = keysIn_default(source);
        var propsIndex = -1;
        var propsLength = props.length;
        while (++propsIndex < propsLength) {
          var key = props[propsIndex];
          var value = object[key];
          if (value === void 0 || eq_default(value, objectProto17[key]) && !hasOwnProperty14.call(object, key)) {
            object[key] = source[key];
          }
        }
      }
      return object;
    });
    defaults_default = defaults;
  }
});

// node_modules/lodash-es/isArrayLikeObject.js
function isArrayLikeObject(value) {
  return isObjectLike_default(value) && isArrayLike_default(value);
}
var isArrayLikeObject_default;
var init_isArrayLikeObject = __esm({
  "node_modules/lodash-es/isArrayLikeObject.js"() {
    init_isArrayLike();
    init_isObjectLike();
    isArrayLikeObject_default = isArrayLikeObject;
  }
});

// node_modules/lodash-es/_arrayIncludesWith.js
function arrayIncludesWith(array, value, comparator) {
  var index = -1, length = array == null ? 0 : array.length;
  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}
var arrayIncludesWith_default;
var init_arrayIncludesWith = __esm({
  "node_modules/lodash-es/_arrayIncludesWith.js"() {
    arrayIncludesWith_default = arrayIncludesWith;
  }
});

// node_modules/lodash-es/_baseDifference.js
function baseDifference(array, values2, iteratee, comparator) {
  var index = -1, includes2 = arrayIncludes_default, isCommon = true, length = array.length, result = [], valuesLength = values2.length;
  if (!length) {
    return result;
  }
  if (iteratee) {
    values2 = arrayMap_default(values2, baseUnary_default(iteratee));
  }
  if (comparator) {
    includes2 = arrayIncludesWith_default;
    isCommon = false;
  } else if (values2.length >= LARGE_ARRAY_SIZE2) {
    includes2 = cacheHas_default;
    isCommon = false;
    values2 = new SetCache_default(values2);
  }
  outer:
    while (++index < length) {
      var value = array[index], computed = iteratee == null ? value : iteratee(value);
      value = comparator || value !== 0 ? value : 0;
      if (isCommon && computed === computed) {
        var valuesIndex = valuesLength;
        while (valuesIndex--) {
          if (values2[valuesIndex] === computed) {
            continue outer;
          }
        }
        result.push(value);
      } else if (!includes2(values2, computed, comparator)) {
        result.push(value);
      }
    }
  return result;
}
var LARGE_ARRAY_SIZE2, baseDifference_default;
var init_baseDifference = __esm({
  "node_modules/lodash-es/_baseDifference.js"() {
    init_SetCache();
    init_arrayIncludes();
    init_arrayIncludesWith();
    init_arrayMap();
    init_baseUnary();
    init_cacheHas();
    LARGE_ARRAY_SIZE2 = 200;
    baseDifference_default = baseDifference;
  }
});

// node_modules/lodash-es/difference.js
var difference, difference_default;
var init_difference = __esm({
  "node_modules/lodash-es/difference.js"() {
    init_baseDifference();
    init_baseFlatten();
    init_baseRest();
    init_isArrayLikeObject();
    difference = baseRest_default(function(array, values2) {
      return isArrayLikeObject_default(array) ? baseDifference_default(array, baseFlatten_default(values2, 1, isArrayLikeObject_default, true)) : [];
    });
    difference_default = difference;
  }
});

// node_modules/lodash-es/last.js
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : void 0;
}
var last_default;
var init_last = __esm({
  "node_modules/lodash-es/last.js"() {
    last_default = last;
  }
});

// node_modules/lodash-es/drop.js
function drop(array, n, guard) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  n = guard || n === void 0 ? 1 : toInteger_default(n);
  return baseSlice_default(array, n < 0 ? 0 : n, length);
}
var drop_default;
var init_drop = __esm({
  "node_modules/lodash-es/drop.js"() {
    init_baseSlice();
    init_toInteger();
    drop_default = drop;
  }
});

// node_modules/lodash-es/dropRight.js
function dropRight(array, n, guard) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  n = guard || n === void 0 ? 1 : toInteger_default(n);
  n = length - n;
  return baseSlice_default(array, 0, n < 0 ? 0 : n);
}
var dropRight_default;
var init_dropRight = __esm({
  "node_modules/lodash-es/dropRight.js"() {
    init_baseSlice();
    init_toInteger();
    dropRight_default = dropRight;
  }
});

// node_modules/lodash-es/_castFunction.js
function castFunction(value) {
  return typeof value == "function" ? value : identity_default;
}
var castFunction_default;
var init_castFunction = __esm({
  "node_modules/lodash-es/_castFunction.js"() {
    init_identity();
    castFunction_default = castFunction;
  }
});

// node_modules/lodash-es/forEach.js
function forEach(collection, iteratee) {
  var func = isArray_default(collection) ? arrayEach_default : baseEach_default;
  return func(collection, castFunction_default(iteratee));
}
var forEach_default;
var init_forEach = __esm({
  "node_modules/lodash-es/forEach.js"() {
    init_arrayEach();
    init_baseEach();
    init_castFunction();
    init_isArray();
    forEach_default = forEach;
  }
});

// node_modules/lodash-es/_arrayEvery.js
function arrayEvery(array, predicate) {
  var index = -1, length = array == null ? 0 : array.length;
  while (++index < length) {
    if (!predicate(array[index], index, array)) {
      return false;
    }
  }
  return true;
}
var arrayEvery_default;
var init_arrayEvery = __esm({
  "node_modules/lodash-es/_arrayEvery.js"() {
    arrayEvery_default = arrayEvery;
  }
});

// node_modules/lodash-es/_baseEvery.js
function baseEvery(collection, predicate) {
  var result = true;
  baseEach_default(collection, function(value, index, collection2) {
    result = !!predicate(value, index, collection2);
    return result;
  });
  return result;
}
var baseEvery_default;
var init_baseEvery = __esm({
  "node_modules/lodash-es/_baseEvery.js"() {
    init_baseEach();
    baseEvery_default = baseEvery;
  }
});

// node_modules/lodash-es/every.js
function every(collection, predicate, guard) {
  var func = isArray_default(collection) ? arrayEvery_default : baseEvery_default;
  if (guard && isIterateeCall_default(collection, predicate, guard)) {
    predicate = void 0;
  }
  return func(collection, baseIteratee_default(predicate, 3));
}
var every_default;
var init_every = __esm({
  "node_modules/lodash-es/every.js"() {
    init_arrayEvery();
    init_baseEvery();
    init_baseIteratee();
    init_isArray();
    init_isIterateeCall();
    every_default = every;
  }
});

// node_modules/lodash-es/_baseFilter.js
function baseFilter(collection, predicate) {
  var result = [];
  baseEach_default(collection, function(value, index, collection2) {
    if (predicate(value, index, collection2)) {
      result.push(value);
    }
  });
  return result;
}
var baseFilter_default;
var init_baseFilter = __esm({
  "node_modules/lodash-es/_baseFilter.js"() {
    init_baseEach();
    baseFilter_default = baseFilter;
  }
});

// node_modules/lodash-es/filter.js
function filter(collection, predicate) {
  var func = isArray_default(collection) ? arrayFilter_default : baseFilter_default;
  return func(collection, baseIteratee_default(predicate, 3));
}
var filter_default;
var init_filter = __esm({
  "node_modules/lodash-es/filter.js"() {
    init_arrayFilter();
    init_baseFilter();
    init_baseIteratee();
    init_isArray();
    filter_default = filter;
  }
});

// node_modules/lodash-es/_createFind.js
function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!isArrayLike_default(collection)) {
      var iteratee = baseIteratee_default(predicate, 3);
      collection = keys_default(collection);
      predicate = function(key) {
        return iteratee(iterable[key], key, iterable);
      };
    }
    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : void 0;
  };
}
var createFind_default;
var init_createFind = __esm({
  "node_modules/lodash-es/_createFind.js"() {
    init_baseIteratee();
    init_isArrayLike();
    init_keys();
    createFind_default = createFind;
  }
});

// node_modules/lodash-es/findIndex.js
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger_default(fromIndex);
  if (index < 0) {
    index = nativeMax2(length + index, 0);
  }
  return baseFindIndex_default(array, baseIteratee_default(predicate, 3), index);
}
var nativeMax2, findIndex_default;
var init_findIndex = __esm({
  "node_modules/lodash-es/findIndex.js"() {
    init_baseFindIndex();
    init_baseIteratee();
    init_toInteger();
    nativeMax2 = Math.max;
    findIndex_default = findIndex;
  }
});

// node_modules/lodash-es/find.js
var find, find_default;
var init_find = __esm({
  "node_modules/lodash-es/find.js"() {
    init_createFind();
    init_findIndex();
    find = createFind_default(findIndex_default);
    find_default = find;
  }
});

// node_modules/lodash-es/head.js
function head(array) {
  return array && array.length ? array[0] : void 0;
}
var head_default;
var init_head = __esm({
  "node_modules/lodash-es/head.js"() {
    head_default = head;
  }
});

// node_modules/lodash-es/first.js
var init_first = __esm({
  "node_modules/lodash-es/first.js"() {
    init_head();
  }
});

// node_modules/lodash-es/_baseMap.js
function baseMap(collection, iteratee) {
  var index = -1, result = isArrayLike_default(collection) ? Array(collection.length) : [];
  baseEach_default(collection, function(value, key, collection2) {
    result[++index] = iteratee(value, key, collection2);
  });
  return result;
}
var baseMap_default;
var init_baseMap = __esm({
  "node_modules/lodash-es/_baseMap.js"() {
    init_baseEach();
    init_isArrayLike();
    baseMap_default = baseMap;
  }
});

// node_modules/lodash-es/map.js
function map(collection, iteratee) {
  var func = isArray_default(collection) ? arrayMap_default : baseMap_default;
  return func(collection, baseIteratee_default(iteratee, 3));
}
var map_default;
var init_map = __esm({
  "node_modules/lodash-es/map.js"() {
    init_arrayMap();
    init_baseIteratee();
    init_baseMap();
    init_isArray();
    map_default = map;
  }
});

// node_modules/lodash-es/flatMap.js
function flatMap(collection, iteratee) {
  return baseFlatten_default(map_default(collection, iteratee), 1);
}
var flatMap_default;
var init_flatMap = __esm({
  "node_modules/lodash-es/flatMap.js"() {
    init_baseFlatten();
    init_map();
    flatMap_default = flatMap;
  }
});

// node_modules/lodash-es/groupBy.js
var objectProto18, hasOwnProperty15, groupBy, groupBy_default;
var init_groupBy = __esm({
  "node_modules/lodash-es/groupBy.js"() {
    init_baseAssignValue();
    init_createAggregator();
    objectProto18 = Object.prototype;
    hasOwnProperty15 = objectProto18.hasOwnProperty;
    groupBy = createAggregator_default(function(result, value, key) {
      if (hasOwnProperty15.call(result, key)) {
        result[key].push(value);
      } else {
        baseAssignValue_default(result, key, [value]);
      }
    });
    groupBy_default = groupBy;
  }
});

// node_modules/lodash-es/_baseHas.js
function baseHas(object, key) {
  return object != null && hasOwnProperty16.call(object, key);
}
var objectProto19, hasOwnProperty16, baseHas_default;
var init_baseHas = __esm({
  "node_modules/lodash-es/_baseHas.js"() {
    objectProto19 = Object.prototype;
    hasOwnProperty16 = objectProto19.hasOwnProperty;
    baseHas_default = baseHas;
  }
});

// node_modules/lodash-es/has.js
function has(object, path3) {
  return object != null && hasPath_default(object, path3, baseHas_default);
}
var has_default;
var init_has = __esm({
  "node_modules/lodash-es/has.js"() {
    init_baseHas();
    init_hasPath();
    has_default = has;
  }
});

// node_modules/lodash-es/isString.js
function isString(value) {
  return typeof value == "string" || !isArray_default(value) && isObjectLike_default(value) && baseGetTag_default(value) == stringTag5;
}
var stringTag5, isString_default;
var init_isString = __esm({
  "node_modules/lodash-es/isString.js"() {
    init_baseGetTag();
    init_isArray();
    init_isObjectLike();
    stringTag5 = "[object String]";
    isString_default = isString;
  }
});

// node_modules/lodash-es/_baseValues.js
function baseValues(object, props) {
  return arrayMap_default(props, function(key) {
    return object[key];
  });
}
var baseValues_default;
var init_baseValues = __esm({
  "node_modules/lodash-es/_baseValues.js"() {
    init_arrayMap();
    baseValues_default = baseValues;
  }
});

// node_modules/lodash-es/values.js
function values(object) {
  return object == null ? [] : baseValues_default(object, keys_default(object));
}
var values_default;
var init_values = __esm({
  "node_modules/lodash-es/values.js"() {
    init_baseValues();
    init_keys();
    values_default = values;
  }
});

// node_modules/lodash-es/includes.js
function includes(collection, value, fromIndex, guard) {
  collection = isArrayLike_default(collection) ? collection : values_default(collection);
  fromIndex = fromIndex && !guard ? toInteger_default(fromIndex) : 0;
  var length = collection.length;
  if (fromIndex < 0) {
    fromIndex = nativeMax3(length + fromIndex, 0);
  }
  return isString_default(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf_default(collection, value, fromIndex) > -1;
}
var nativeMax3, includes_default;
var init_includes = __esm({
  "node_modules/lodash-es/includes.js"() {
    init_baseIndexOf();
    init_isArrayLike();
    init_isString();
    init_toInteger();
    init_values();
    nativeMax3 = Math.max;
    includes_default = includes;
  }
});

// node_modules/lodash-es/indexOf.js
function indexOf(array, value, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger_default(fromIndex);
  if (index < 0) {
    index = nativeMax4(length + index, 0);
  }
  return baseIndexOf_default(array, value, index);
}
var nativeMax4, indexOf_default;
var init_indexOf = __esm({
  "node_modules/lodash-es/indexOf.js"() {
    init_baseIndexOf();
    init_toInteger();
    nativeMax4 = Math.max;
    indexOf_default = indexOf;
  }
});

// node_modules/lodash-es/isEmpty.js
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike_default(value) && (isArray_default(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer_default(value) || isTypedArray_default(value) || isArguments_default(value))) {
    return !value.length;
  }
  var tag = getTag_default(value);
  if (tag == mapTag7 || tag == setTag7) {
    return !value.size;
  }
  if (isPrototype_default(value)) {
    return !baseKeys_default(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty17.call(value, key)) {
      return false;
    }
  }
  return true;
}
var mapTag7, setTag7, objectProto20, hasOwnProperty17, isEmpty_default;
var init_isEmpty = __esm({
  "node_modules/lodash-es/isEmpty.js"() {
    init_baseKeys();
    init_getTag();
    init_isArguments();
    init_isArray();
    init_isArrayLike();
    init_isBuffer();
    init_isPrototype();
    init_isTypedArray();
    mapTag7 = "[object Map]";
    setTag7 = "[object Set]";
    objectProto20 = Object.prototype;
    hasOwnProperty17 = objectProto20.hasOwnProperty;
    isEmpty_default = isEmpty;
  }
});

// node_modules/lodash-es/_baseIsRegExp.js
function baseIsRegExp(value) {
  return isObjectLike_default(value) && baseGetTag_default(value) == regexpTag5;
}
var regexpTag5, baseIsRegExp_default;
var init_baseIsRegExp = __esm({
  "node_modules/lodash-es/_baseIsRegExp.js"() {
    init_baseGetTag();
    init_isObjectLike();
    regexpTag5 = "[object RegExp]";
    baseIsRegExp_default = baseIsRegExp;
  }
});

// node_modules/lodash-es/isRegExp.js
var nodeIsRegExp, isRegExp, isRegExp_default;
var init_isRegExp = __esm({
  "node_modules/lodash-es/isRegExp.js"() {
    init_baseIsRegExp();
    init_baseUnary();
    init_nodeUtil();
    nodeIsRegExp = nodeUtil_default && nodeUtil_default.isRegExp;
    isRegExp = nodeIsRegExp ? baseUnary_default(nodeIsRegExp) : baseIsRegExp_default;
    isRegExp_default = isRegExp;
  }
});

// node_modules/lodash-es/isUndefined.js
function isUndefined(value) {
  return value === void 0;
}
var isUndefined_default;
var init_isUndefined = __esm({
  "node_modules/lodash-es/isUndefined.js"() {
    isUndefined_default = isUndefined;
  }
});

// node_modules/lodash-es/negate.js
function negate(predicate) {
  if (typeof predicate != "function") {
    throw new TypeError(FUNC_ERROR_TEXT2);
  }
  return function() {
    var args = arguments;
    switch (args.length) {
      case 0:
        return !predicate.call(this);
      case 1:
        return !predicate.call(this, args[0]);
      case 2:
        return !predicate.call(this, args[0], args[1]);
      case 3:
        return !predicate.call(this, args[0], args[1], args[2]);
    }
    return !predicate.apply(this, args);
  };
}
var FUNC_ERROR_TEXT2, negate_default;
var init_negate = __esm({
  "node_modules/lodash-es/negate.js"() {
    FUNC_ERROR_TEXT2 = "Expected a function";
    negate_default = negate;
  }
});

// node_modules/lodash-es/_baseSet.js
function baseSet(object, path3, value, customizer) {
  if (!isObject_default(object)) {
    return object;
  }
  path3 = castPath_default(path3, object);
  var index = -1, length = path3.length, lastIndex = length - 1, nested = object;
  while (nested != null && ++index < length) {
    var key = toKey_default(path3[index]), newValue = value;
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      return object;
    }
    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : void 0;
      if (newValue === void 0) {
        newValue = isObject_default(objValue) ? objValue : isIndex_default(path3[index + 1]) ? [] : {};
      }
    }
    assignValue_default(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}
var baseSet_default;
var init_baseSet = __esm({
  "node_modules/lodash-es/_baseSet.js"() {
    init_assignValue();
    init_castPath();
    init_isIndex();
    init_isObject();
    init_toKey();
    baseSet_default = baseSet;
  }
});

// node_modules/lodash-es/_basePickBy.js
function basePickBy(object, paths, predicate) {
  var index = -1, length = paths.length, result = {};
  while (++index < length) {
    var path3 = paths[index], value = baseGet_default(object, path3);
    if (predicate(value, path3)) {
      baseSet_default(result, castPath_default(path3, object), value);
    }
  }
  return result;
}
var basePickBy_default;
var init_basePickBy = __esm({
  "node_modules/lodash-es/_basePickBy.js"() {
    init_baseGet();
    init_baseSet();
    init_castPath();
    basePickBy_default = basePickBy;
  }
});

// node_modules/lodash-es/pickBy.js
function pickBy(object, predicate) {
  if (object == null) {
    return {};
  }
  var props = arrayMap_default(getAllKeysIn_default(object), function(prop) {
    return [prop];
  });
  predicate = baseIteratee_default(predicate);
  return basePickBy_default(object, props, function(value, path3) {
    return predicate(value, path3[0]);
  });
}
var pickBy_default;
var init_pickBy = __esm({
  "node_modules/lodash-es/pickBy.js"() {
    init_arrayMap();
    init_baseIteratee();
    init_basePickBy();
    init_getAllKeysIn();
    pickBy_default = pickBy;
  }
});

// node_modules/lodash-es/_baseReduce.js
function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
  eachFunc(collection, function(value, index, collection2) {
    accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection2);
  });
  return accumulator;
}
var baseReduce_default;
var init_baseReduce = __esm({
  "node_modules/lodash-es/_baseReduce.js"() {
    baseReduce_default = baseReduce;
  }
});

// node_modules/lodash-es/reduce.js
function reduce(collection, iteratee, accumulator) {
  var func = isArray_default(collection) ? arrayReduce_default : baseReduce_default, initAccum = arguments.length < 3;
  return func(collection, baseIteratee_default(iteratee, 4), accumulator, initAccum, baseEach_default);
}
var reduce_default;
var init_reduce = __esm({
  "node_modules/lodash-es/reduce.js"() {
    init_arrayReduce();
    init_baseEach();
    init_baseIteratee();
    init_baseReduce();
    init_isArray();
    reduce_default = reduce;
  }
});

// node_modules/lodash-es/reject.js
function reject(collection, predicate) {
  var func = isArray_default(collection) ? arrayFilter_default : baseFilter_default;
  return func(collection, negate_default(baseIteratee_default(predicate, 3)));
}
var reject_default;
var init_reject = __esm({
  "node_modules/lodash-es/reject.js"() {
    init_arrayFilter();
    init_baseFilter();
    init_baseIteratee();
    init_isArray();
    init_negate();
    reject_default = reject;
  }
});

// node_modules/lodash-es/_baseSome.js
function baseSome(collection, predicate) {
  var result;
  baseEach_default(collection, function(value, index, collection2) {
    result = predicate(value, index, collection2);
    return !result;
  });
  return !!result;
}
var baseSome_default;
var init_baseSome = __esm({
  "node_modules/lodash-es/_baseSome.js"() {
    init_baseEach();
    baseSome_default = baseSome;
  }
});

// node_modules/lodash-es/some.js
function some(collection, predicate, guard) {
  var func = isArray_default(collection) ? arraySome_default : baseSome_default;
  if (guard && isIterateeCall_default(collection, predicate, guard)) {
    predicate = void 0;
  }
  return func(collection, baseIteratee_default(predicate, 3));
}
var some_default;
var init_some = __esm({
  "node_modules/lodash-es/some.js"() {
    init_arraySome();
    init_baseIteratee();
    init_baseSome();
    init_isArray();
    init_isIterateeCall();
    some_default = some;
  }
});

// node_modules/lodash-es/_createSet.js
var INFINITY4, createSet, createSet_default;
var init_createSet = __esm({
  "node_modules/lodash-es/_createSet.js"() {
    init_Set();
    init_noop();
    init_setToArray();
    INFINITY4 = 1 / 0;
    createSet = !(Set_default && 1 / setToArray_default(new Set_default([, -0]))[1] == INFINITY4) ? noop_default : function(values2) {
      return new Set_default(values2);
    };
    createSet_default = createSet;
  }
});

// node_modules/lodash-es/_baseUniq.js
function baseUniq(array, iteratee, comparator) {
  var index = -1, includes2 = arrayIncludes_default, length = array.length, isCommon = true, result = [], seen = result;
  if (comparator) {
    isCommon = false;
    includes2 = arrayIncludesWith_default;
  } else if (length >= LARGE_ARRAY_SIZE3) {
    var set = iteratee ? null : createSet_default(array);
    if (set) {
      return setToArray_default(set);
    }
    isCommon = false;
    includes2 = cacheHas_default;
    seen = new SetCache_default();
  } else {
    seen = iteratee ? [] : result;
  }
  outer:
    while (++index < length) {
      var value = array[index], computed = iteratee ? iteratee(value) : value;
      value = comparator || value !== 0 ? value : 0;
      if (isCommon && computed === computed) {
        var seenIndex = seen.length;
        while (seenIndex--) {
          if (seen[seenIndex] === computed) {
            continue outer;
          }
        }
        if (iteratee) {
          seen.push(computed);
        }
        result.push(value);
      } else if (!includes2(seen, computed, comparator)) {
        if (seen !== result) {
          seen.push(computed);
        }
        result.push(value);
      }
    }
  return result;
}
var LARGE_ARRAY_SIZE3, baseUniq_default;
var init_baseUniq = __esm({
  "node_modules/lodash-es/_baseUniq.js"() {
    init_SetCache();
    init_arrayIncludes();
    init_arrayIncludesWith();
    init_cacheHas();
    init_createSet();
    init_setToArray();
    LARGE_ARRAY_SIZE3 = 200;
    baseUniq_default = baseUniq;
  }
});

// node_modules/lodash-es/uniq.js
function uniq(array) {
  return array && array.length ? baseUniq_default(array) : [];
}
var uniq_default;
var init_uniq = __esm({
  "node_modules/lodash-es/uniq.js"() {
    init_baseUniq();
    uniq_default = uniq;
  }
});

// node_modules/lodash-es/lodash.js
var init_lodash = __esm({
  "node_modules/lodash-es/lodash.js"() {
    init_assign();
    init_clone();
    init_compact();
    init_defaults();
    init_difference();
    init_drop();
    init_dropRight();
    init_every();
    init_filter();
    init_find();
    init_first();
    init_flatMap();
    init_flatten();
    init_forEach();
    init_groupBy();
    init_has();
    init_identity();
    init_includes();
    init_indexOf();
    init_isArray();
    init_isEmpty();
    init_isFunction();
    init_isObject();
    init_isRegExp();
    init_isString();
    init_isUndefined();
    init_keys();
    init_last();
    init_map();
    init_noop();
    init_pickBy();
    init_reduce();
    init_reject();
    init_some();
    init_uniq();
    init_values();
  }
});

// node_modules/@chevrotain/utils/lib/src/print.js
function PRINT_ERROR(msg) {
  if (console && console.error) {
    console.error(`Error: ${msg}`);
  }
}
function PRINT_WARNING(msg) {
  if (console && console.warn) {
    console.warn(`Warning: ${msg}`);
  }
}
var init_print = __esm({
  "node_modules/@chevrotain/utils/lib/src/print.js"() {
  }
});

// node_modules/@chevrotain/utils/lib/src/timer.js
function timer(func) {
  const start = (/* @__PURE__ */ new Date()).getTime();
  const val = func();
  const end = (/* @__PURE__ */ new Date()).getTime();
  const total = end - start;
  return { time: total, value: val };
}
var init_timer = __esm({
  "node_modules/@chevrotain/utils/lib/src/timer.js"() {
  }
});

// node_modules/@chevrotain/utils/lib/src/to-fast-properties.js
function toFastProperties(toBecomeFast) {
  function FakeConstructor() {
  }
  FakeConstructor.prototype = toBecomeFast;
  const fakeInstance = new FakeConstructor();
  function fakeAccess() {
    return typeof fakeInstance.bar;
  }
  fakeAccess();
  fakeAccess();
  if (1)
    return toBecomeFast;
  (0, eval)(toBecomeFast);
}
var init_to_fast_properties = __esm({
  "node_modules/@chevrotain/utils/lib/src/to-fast-properties.js"() {
  }
});

// node_modules/@chevrotain/utils/lib/src/api.js
var init_api = __esm({
  "node_modules/@chevrotain/utils/lib/src/api.js"() {
    init_print();
    init_timer();
    init_to_fast_properties();
  }
});

// node_modules/@chevrotain/gast/lib/src/model.js
function tokenLabel(tokType) {
  if (hasTokenLabel(tokType)) {
    return tokType.LABEL;
  } else {
    return tokType.name;
  }
}
function hasTokenLabel(obj) {
  return isString_default(obj.LABEL) && obj.LABEL !== "";
}
function serializeGrammar(topRules) {
  return map_default(topRules, serializeProduction);
}
function serializeProduction(node) {
  function convertDefinition(definition) {
    return map_default(definition, serializeProduction);
  }
  if (node instanceof NonTerminal) {
    const serializedNonTerminal = {
      type: "NonTerminal",
      name: node.nonTerminalName,
      idx: node.idx
    };
    if (isString_default(node.label)) {
      serializedNonTerminal.label = node.label;
    }
    return serializedNonTerminal;
  } else if (node instanceof Alternative) {
    return {
      type: "Alternative",
      definition: convertDefinition(node.definition)
    };
  } else if (node instanceof Option) {
    return {
      type: "Option",
      idx: node.idx,
      definition: convertDefinition(node.definition)
    };
  } else if (node instanceof RepetitionMandatory) {
    return {
      type: "RepetitionMandatory",
      idx: node.idx,
      definition: convertDefinition(node.definition)
    };
  } else if (node instanceof RepetitionMandatoryWithSeparator) {
    return {
      type: "RepetitionMandatoryWithSeparator",
      idx: node.idx,
      separator: serializeProduction(new Terminal({ terminalType: node.separator })),
      definition: convertDefinition(node.definition)
    };
  } else if (node instanceof RepetitionWithSeparator) {
    return {
      type: "RepetitionWithSeparator",
      idx: node.idx,
      separator: serializeProduction(new Terminal({ terminalType: node.separator })),
      definition: convertDefinition(node.definition)
    };
  } else if (node instanceof Repetition) {
    return {
      type: "Repetition",
      idx: node.idx,
      definition: convertDefinition(node.definition)
    };
  } else if (node instanceof Alternation) {
    return {
      type: "Alternation",
      idx: node.idx,
      definition: convertDefinition(node.definition)
    };
  } else if (node instanceof Terminal) {
    const serializedTerminal = {
      type: "Terminal",
      name: node.terminalType.name,
      label: tokenLabel(node.terminalType),
      idx: node.idx
    };
    if (isString_default(node.label)) {
      serializedTerminal.terminalLabel = node.label;
    }
    const pattern = node.terminalType.PATTERN;
    if (node.terminalType.PATTERN) {
      serializedTerminal.pattern = isRegExp_default(pattern) ? pattern.source : pattern;
    }
    return serializedTerminal;
  } else if (node instanceof Rule) {
    return {
      type: "Rule",
      name: node.name,
      orgText: node.orgText,
      definition: convertDefinition(node.definition)
    };
  } else {
    throw Error("non exhaustive match");
  }
}
var AbstractProduction, NonTerminal, Rule, Alternative, Option, RepetitionMandatory, RepetitionMandatoryWithSeparator, Repetition, RepetitionWithSeparator, Alternation, Terminal;
var init_model = __esm({
  "node_modules/@chevrotain/gast/lib/src/model.js"() {
    init_lodash();
    AbstractProduction = class {
      get definition() {
        return this._definition;
      }
      set definition(value) {
        this._definition = value;
      }
      constructor(_definition) {
        this._definition = _definition;
      }
      accept(visitor) {
        visitor.visit(this);
        forEach_default(this.definition, (prod) => {
          prod.accept(visitor);
        });
      }
    };
    NonTerminal = class extends AbstractProduction {
      constructor(options) {
        super([]);
        this.idx = 1;
        assign_default(this, pickBy_default(options, (v) => v !== void 0));
      }
      set definition(definition) {
      }
      get definition() {
        if (this.referencedRule !== void 0) {
          return this.referencedRule.definition;
        }
        return [];
      }
      accept(visitor) {
        visitor.visit(this);
      }
    };
    Rule = class extends AbstractProduction {
      constructor(options) {
        super(options.definition);
        this.orgText = "";
        assign_default(this, pickBy_default(options, (v) => v !== void 0));
      }
    };
    Alternative = class extends AbstractProduction {
      constructor(options) {
        super(options.definition);
        this.ignoreAmbiguities = false;
        assign_default(this, pickBy_default(options, (v) => v !== void 0));
      }
    };
    Option = class extends AbstractProduction {
      constructor(options) {
        super(options.definition);
        this.idx = 1;
        assign_default(this, pickBy_default(options, (v) => v !== void 0));
      }
    };
    RepetitionMandatory = class extends AbstractProduction {
      constructor(options) {
        super(options.definition);
        this.idx = 1;
        assign_default(this, pickBy_default(options, (v) => v !== void 0));
      }
    };
    RepetitionMandatoryWithSeparator = class extends AbstractProduction {
      constructor(options) {
        super(options.definition);
        this.idx = 1;
        assign_default(this, pickBy_default(options, (v) => v !== void 0));
      }
    };
    Repetition = class extends AbstractProduction {
      constructor(options) {
        super(options.definition);
        this.idx = 1;
        assign_default(this, pickBy_default(options, (v) => v !== void 0));
      }
    };
    RepetitionWithSeparator = class extends AbstractProduction {
      constructor(options) {
        super(options.definition);
        this.idx = 1;
        assign_default(this, pickBy_default(options, (v) => v !== void 0));
      }
    };
    Alternation = class extends AbstractProduction {
      get definition() {
        return this._definition;
      }
      set definition(value) {
        this._definition = value;
      }
      constructor(options) {
        super(options.definition);
        this.idx = 1;
        this.ignoreAmbiguities = false;
        this.hasPredicates = false;
        assign_default(this, pickBy_default(options, (v) => v !== void 0));
      }
    };
    Terminal = class {
      constructor(options) {
        this.idx = 1;
        assign_default(this, pickBy_default(options, (v) => v !== void 0));
      }
      accept(visitor) {
        visitor.visit(this);
      }
    };
  }
});

// node_modules/@chevrotain/gast/lib/src/visitor.js
var GAstVisitor;
var init_visitor = __esm({
  "node_modules/@chevrotain/gast/lib/src/visitor.js"() {
    init_model();
    GAstVisitor = class {
      visit(node) {
        const nodeAny = node;
        switch (nodeAny.constructor) {
          case NonTerminal:
            return this.visitNonTerminal(nodeAny);
          case Alternative:
            return this.visitAlternative(nodeAny);
          case Option:
            return this.visitOption(nodeAny);
          case RepetitionMandatory:
            return this.visitRepetitionMandatory(nodeAny);
          case RepetitionMandatoryWithSeparator:
            return this.visitRepetitionMandatoryWithSeparator(nodeAny);
          case RepetitionWithSeparator:
            return this.visitRepetitionWithSeparator(nodeAny);
          case Repetition:
            return this.visitRepetition(nodeAny);
          case Alternation:
            return this.visitAlternation(nodeAny);
          case Terminal:
            return this.visitTerminal(nodeAny);
          case Rule:
            return this.visitRule(nodeAny);
          /* c8 ignore next 2 */
          default:
            throw Error("non exhaustive match");
        }
      }
      /* c8 ignore next */
      visitNonTerminal(node) {
      }
      /* c8 ignore next */
      visitAlternative(node) {
      }
      /* c8 ignore next */
      visitOption(node) {
      }
      /* c8 ignore next */
      visitRepetition(node) {
      }
      /* c8 ignore next */
      visitRepetitionMandatory(node) {
      }
      /* c8 ignore next 3 */
      visitRepetitionMandatoryWithSeparator(node) {
      }
      /* c8 ignore next */
      visitRepetitionWithSeparator(node) {
      }
      /* c8 ignore next */
      visitAlternation(node) {
      }
      /* c8 ignore next */
      visitTerminal(node) {
      }
      /* c8 ignore next */
      visitRule(node) {
      }
    };
  }
});

// node_modules/@chevrotain/gast/lib/src/helpers.js
function isSequenceProd(prod) {
  return prod instanceof Alternative || prod instanceof Option || prod instanceof Repetition || prod instanceof RepetitionMandatory || prod instanceof RepetitionMandatoryWithSeparator || prod instanceof RepetitionWithSeparator || prod instanceof Terminal || prod instanceof Rule;
}
function isOptionalProd(prod, alreadyVisited = []) {
  const isDirectlyOptional = prod instanceof Option || prod instanceof Repetition || prod instanceof RepetitionWithSeparator;
  if (isDirectlyOptional) {
    return true;
  }
  if (prod instanceof Alternation) {
    return some_default(prod.definition, (subProd) => {
      return isOptionalProd(subProd, alreadyVisited);
    });
  } else if (prod instanceof NonTerminal && includes_default(alreadyVisited, prod)) {
    return false;
  } else if (prod instanceof AbstractProduction) {
    if (prod instanceof NonTerminal) {
      alreadyVisited.push(prod);
    }
    return every_default(prod.definition, (subProd) => {
      return isOptionalProd(subProd, alreadyVisited);
    });
  } else {
    return false;
  }
}
function isBranchingProd(prod) {
  return prod instanceof Alternation;
}
function getProductionDslName(prod) {
  if (prod instanceof NonTerminal) {
    return "SUBRULE";
  } else if (prod instanceof Option) {
    return "OPTION";
  } else if (prod instanceof Alternation) {
    return "OR";
  } else if (prod instanceof RepetitionMandatory) {
    return "AT_LEAST_ONE";
  } else if (prod instanceof RepetitionMandatoryWithSeparator) {
    return "AT_LEAST_ONE_SEP";
  } else if (prod instanceof RepetitionWithSeparator) {
    return "MANY_SEP";
  } else if (prod instanceof Repetition) {
    return "MANY";
  } else if (prod instanceof Terminal) {
    return "CONSUME";
  } else {
    throw Error("non exhaustive match");
  }
}
var init_helpers = __esm({
  "node_modules/@chevrotain/gast/lib/src/helpers.js"() {
    init_lodash();
    init_model();
  }
});

// node_modules/@chevrotain/gast/lib/src/api.js
var init_api2 = __esm({
  "node_modules/@chevrotain/gast/lib/src/api.js"() {
    init_model();
    init_visitor();
    init_helpers();
  }
});

// node_modules/chevrotain/lib/src/parse/grammar/rest.js
function restForRepetitionWithSeparator(repSepProd, currRest, prevRest) {
  const repSepRest = [
    new Option({
      definition: [
        new Terminal({ terminalType: repSepProd.separator })
      ].concat(repSepProd.definition)
    })
  ];
  const fullRepSepRest = repSepRest.concat(currRest, prevRest);
  return fullRepSepRest;
}
var RestWalker;
var init_rest = __esm({
  "node_modules/chevrotain/lib/src/parse/grammar/rest.js"() {
    init_lodash();
    init_api2();
    RestWalker = class {
      walk(prod, prevRest = []) {
        forEach_default(prod.definition, (subProd, index) => {
          const currRest = drop_default(prod.definition, index + 1);
          if (subProd instanceof NonTerminal) {
            this.walkProdRef(subProd, currRest, prevRest);
          } else if (subProd instanceof Terminal) {
            this.walkTerminal(subProd, currRest, prevRest);
          } else if (subProd instanceof Alternative) {
            this.walkFlat(subProd, currRest, prevRest);
          } else if (subProd instanceof Option) {
            this.walkOption(subProd, currRest, prevRest);
          } else if (subProd instanceof RepetitionMandatory) {
            this.walkAtLeastOne(subProd, currRest, prevRest);
          } else if (subProd instanceof RepetitionMandatoryWithSeparator) {
            this.walkAtLeastOneSep(subProd, currRest, prevRest);
          } else if (subProd instanceof RepetitionWithSeparator) {
            this.walkManySep(subProd, currRest, prevRest);
          } else if (subProd instanceof Repetition) {
            this.walkMany(subProd, currRest, prevRest);
          } else if (subProd instanceof Alternation) {
            this.walkOr(subProd, currRest, prevRest);
          } else {
            throw Error("non exhaustive match");
          }
        });
      }
      walkTerminal(terminal, currRest, prevRest) {
      }
      walkProdRef(refProd, currRest, prevRest) {
      }
      walkFlat(flatProd, currRest, prevRest) {
        const fullOrRest = currRest.concat(prevRest);
        this.walk(flatProd, fullOrRest);
      }
      walkOption(optionProd, currRest, prevRest) {
        const fullOrRest = currRest.concat(prevRest);
        this.walk(optionProd, fullOrRest);
      }
      walkAtLeastOne(atLeastOneProd, currRest, prevRest) {
        const fullAtLeastOneRest = [
          new Option({ definition: atLeastOneProd.definition })
        ].concat(currRest, prevRest);
        this.walk(atLeastOneProd, fullAtLeastOneRest);
      }
      walkAtLeastOneSep(atLeastOneSepProd, currRest, prevRest) {
        const fullAtLeastOneSepRest = restForRepetitionWithSeparator(atLeastOneSepProd, currRest, prevRest);
        this.walk(atLeastOneSepProd, fullAtLeastOneSepRest);
      }
      walkMany(manyProd, currRest, prevRest) {
        const fullManyRest = [
          new Option({ definition: manyProd.definition })
        ].concat(currRest, prevRest);
        this.walk(manyProd, fullManyRest);
      }
      walkManySep(manySepProd, currRest, prevRest) {
        const fullManySepRest = restForRepetitionWithSeparator(manySepProd, currRest, prevRest);
        this.walk(manySepProd, fullManySepRest);
      }
      walkOr(orProd, currRest, prevRest) {
        const fullOrRest = currRest.concat(prevRest);
        forEach_default(orProd.definition, (alt) => {
          const prodWrapper = new Alternative({ definition: [alt] });
          this.walk(prodWrapper, fullOrRest);
        });
      }
    };
  }
});

// node_modules/chevrotain/lib/src/parse/grammar/first.js
function first(prod) {
  if (prod instanceof NonTerminal) {
    return first(prod.referencedRule);
  } else if (prod instanceof Terminal) {
    return firstForTerminal(prod);
  } else if (isSequenceProd(prod)) {
    return firstForSequence(prod);
  } else if (isBranchingProd(prod)) {
    return firstForBranching(prod);
  } else {
    throw Error("non exhaustive match");
  }
}
function firstForSequence(prod) {
  let firstSet = [];
  const seq = prod.definition;
  let nextSubProdIdx = 0;
  let hasInnerProdsRemaining = seq.length > nextSubProdIdx;
  let currSubProd;
  let isLastInnerProdOptional = true;
  while (hasInnerProdsRemaining && isLastInnerProdOptional) {
    currSubProd = seq[nextSubProdIdx];
    isLastInnerProdOptional = isOptionalProd(currSubProd);
    firstSet = firstSet.concat(first(currSubProd));
    nextSubProdIdx = nextSubProdIdx + 1;
    hasInnerProdsRemaining = seq.length > nextSubProdIdx;
  }
  return uniq_default(firstSet);
}
function firstForBranching(prod) {
  const allAlternativesFirsts = map_default(prod.definition, (innerProd) => {
    return first(innerProd);
  });
  return uniq_default(flatten_default(allAlternativesFirsts));
}
function firstForTerminal(terminal) {
  return [terminal.terminalType];
}
var init_first2 = __esm({
  "node_modules/chevrotain/lib/src/parse/grammar/first.js"() {
    init_lodash();
    init_api2();
  }
});

// node_modules/chevrotain/lib/src/parse/constants.js
var IN;
var init_constants = __esm({
  "node_modules/chevrotain/lib/src/parse/constants.js"() {
    IN = "_~IN~_";
  }
});

// node_modules/chevrotain/lib/src/parse/grammar/follow.js
function computeAllProdsFollows(topProductions) {
  const reSyncFollows = {};
  forEach_default(topProductions, (topProd) => {
    const currRefsFollow = new ResyncFollowsWalker(topProd).startWalking();
    assign_default(reSyncFollows, currRefsFollow);
  });
  return reSyncFollows;
}
function buildBetweenProdsFollowPrefix(inner, occurenceInParent) {
  return inner.name + occurenceInParent + IN;
}
var ResyncFollowsWalker;
var init_follow = __esm({
  "node_modules/chevrotain/lib/src/parse/grammar/follow.js"() {
    init_rest();
    init_first2();
    init_lodash();
    init_constants();
    init_api2();
    ResyncFollowsWalker = class extends RestWalker {
      constructor(topProd) {
        super();
        this.topProd = topProd;
        this.follows = {};
      }
      startWalking() {
        this.walk(this.topProd);
        return this.follows;
      }
      walkTerminal(terminal, currRest, prevRest) {
      }
      walkProdRef(refProd, currRest, prevRest) {
        const followName = buildBetweenProdsFollowPrefix(refProd.referencedRule, refProd.idx) + this.topProd.name;
        const fullRest = currRest.concat(prevRest);
        const restProd = new Alternative({ definition: fullRest });
        const t_in_topProd_follows = first(restProd);
        this.follows[followName] = t_in_topProd_follows;
      }
    };
  }
});

// node_modules/@chevrotain/regexp-to-ast/lib/src/utils.js
function cc(char) {
  return char.charCodeAt(0);
}
function insertToSet(item, set) {
  if (Array.isArray(item)) {
    item.forEach(function(subItem) {
      set.push(subItem);
    });
  } else {
    set.push(item);
  }
}
function addFlag(flagObj, flagKey) {
  if (flagObj[flagKey] === true) {
    throw "duplicate flag " + flagKey;
  }
  const x = flagObj[flagKey];
  flagObj[flagKey] = true;
}
function ASSERT_EXISTS(obj) {
  if (obj === void 0) {
    throw Error("Internal Error - Should never get here!");
  }
  return true;
}
function ASSERT_NEVER_REACH_HERE() {
  throw Error("Internal Error - Should never get here!");
}
function isCharacter(obj) {
  return obj["type"] === "Character";
}
var init_utils = __esm({
  "node_modules/@chevrotain/regexp-to-ast/lib/src/utils.js"() {
  }
});

// node_modules/@chevrotain/regexp-to-ast/lib/src/character-classes.js
var digitsCharCodes, wordCharCodes, whitespaceCodes;
var init_character_classes = __esm({
  "node_modules/@chevrotain/regexp-to-ast/lib/src/character-classes.js"() {
    init_utils();
    digitsCharCodes = [];
    for (let i = cc("0"); i <= cc("9"); i++) {
      digitsCharCodes.push(i);
    }
    wordCharCodes = [cc("_")].concat(digitsCharCodes);
    for (let i = cc("a"); i <= cc("z"); i++) {
      wordCharCodes.push(i);
    }
    for (let i = cc("A"); i <= cc("Z"); i++) {
      wordCharCodes.push(i);
    }
    whitespaceCodes = [
      cc(" "),
      cc("\f"),
      cc("\n"),
      cc("\r"),
      cc("	"),
      cc("\v"),
      cc("	"),
      cc("\xA0"),
      cc("\u1680"),
      cc("\u2000"),
      cc("\u2001"),
      cc("\u2002"),
      cc("\u2003"),
      cc("\u2004"),
      cc("\u2005"),
      cc("\u2006"),
      cc("\u2007"),
      cc("\u2008"),
      cc("\u2009"),
      cc("\u200A"),
      cc("\u2028"),
      cc("\u2029"),
      cc("\u202F"),
      cc("\u205F"),
      cc("\u3000"),
      cc("\uFEFF")
    ];
  }
});

// node_modules/@chevrotain/regexp-to-ast/lib/src/regexp-parser.js
var hexDigitPattern, decimalPattern, decimalPatternNoZero, RegExpParser;
var init_regexp_parser = __esm({
  "node_modules/@chevrotain/regexp-to-ast/lib/src/regexp-parser.js"() {
    init_utils();
    init_character_classes();
    hexDigitPattern = /[0-9a-fA-F]/;
    decimalPattern = /[0-9]/;
    decimalPatternNoZero = /[1-9]/;
    RegExpParser = class {
      constructor() {
        this.idx = 0;
        this.input = "";
        this.groupIdx = 0;
      }
      saveState() {
        return {
          idx: this.idx,
          input: this.input,
          groupIdx: this.groupIdx
        };
      }
      restoreState(newState) {
        this.idx = newState.idx;
        this.input = newState.input;
        this.groupIdx = newState.groupIdx;
      }
      pattern(input) {
        this.idx = 0;
        this.input = input;
        this.groupIdx = 0;
        this.consumeChar("/");
        const value = this.disjunction();
        this.consumeChar("/");
        const flags = {
          type: "Flags",
          loc: { begin: this.idx, end: input.length },
          global: false,
          ignoreCase: false,
          multiLine: false,
          unicode: false,
          sticky: false
        };
        while (this.isRegExpFlag()) {
          switch (this.popChar()) {
            case "g":
              addFlag(flags, "global");
              break;
            case "i":
              addFlag(flags, "ignoreCase");
              break;
            case "m":
              addFlag(flags, "multiLine");
              break;
            case "u":
              addFlag(flags, "unicode");
              break;
            case "y":
              addFlag(flags, "sticky");
              break;
          }
        }
        if (this.idx !== this.input.length) {
          throw Error("Redundant input: " + this.input.substring(this.idx));
        }
        return {
          type: "Pattern",
          flags,
          value,
          loc: this.loc(0)
        };
      }
      disjunction() {
        const alts = [];
        const begin = this.idx;
        alts.push(this.alternative());
        while (this.peekChar() === "|") {
          this.consumeChar("|");
          alts.push(this.alternative());
        }
        return { type: "Disjunction", value: alts, loc: this.loc(begin) };
      }
      alternative() {
        const terms = [];
        const begin = this.idx;
        while (this.isTerm()) {
          terms.push(this.term());
        }
        return { type: "Alternative", value: terms, loc: this.loc(begin) };
      }
      term() {
        if (this.isAssertion()) {
          return this.assertion();
        } else {
          return this.atom();
        }
      }
      assertion() {
        const begin = this.idx;
        switch (this.popChar()) {
          case "^":
            return {
              type: "StartAnchor",
              loc: this.loc(begin)
            };
          case "$":
            return { type: "EndAnchor", loc: this.loc(begin) };
          // '\b' or '\B'
          case "\\":
            switch (this.popChar()) {
              case "b":
                return {
                  type: "WordBoundary",
                  loc: this.loc(begin)
                };
              case "B":
                return {
                  type: "NonWordBoundary",
                  loc: this.loc(begin)
                };
            }
            throw Error("Invalid Assertion Escape");
          // '(?=' or '(?!'
          case "(":
            this.consumeChar("?");
            let type;
            switch (this.popChar()) {
              case "=":
                type = "Lookahead";
                break;
              case "!":
                type = "NegativeLookahead";
                break;
            }
            ASSERT_EXISTS(type);
            const disjunction = this.disjunction();
            this.consumeChar(")");
            return {
              type,
              value: disjunction,
              loc: this.loc(begin)
            };
        }
        return ASSERT_NEVER_REACH_HERE();
      }
      quantifier(isBacktracking = false) {
        let range = void 0;
        const begin = this.idx;
        switch (this.popChar()) {
          case "*":
            range = {
              atLeast: 0,
              atMost: Infinity
            };
            break;
          case "+":
            range = {
              atLeast: 1,
              atMost: Infinity
            };
            break;
          case "?":
            range = {
              atLeast: 0,
              atMost: 1
            };
            break;
          case "{":
            const atLeast = this.integerIncludingZero();
            switch (this.popChar()) {
              case "}":
                range = {
                  atLeast,
                  atMost: atLeast
                };
                break;
              case ",":
                let atMost;
                if (this.isDigit()) {
                  atMost = this.integerIncludingZero();
                  range = {
                    atLeast,
                    atMost
                  };
                } else {
                  range = {
                    atLeast,
                    atMost: Infinity
                  };
                }
                this.consumeChar("}");
                break;
            }
            if (isBacktracking === true && range === void 0) {
              return void 0;
            }
            ASSERT_EXISTS(range);
            break;
        }
        if (isBacktracking === true && range === void 0) {
          return void 0;
        }
        if (ASSERT_EXISTS(range)) {
          if (this.peekChar(0) === "?") {
            this.consumeChar("?");
            range.greedy = false;
          } else {
            range.greedy = true;
          }
          range.type = "Quantifier";
          range.loc = this.loc(begin);
          return range;
        }
      }
      atom() {
        let atom;
        const begin = this.idx;
        switch (this.peekChar()) {
          case ".":
            atom = this.dotAll();
            break;
          case "\\":
            atom = this.atomEscape();
            break;
          case "[":
            atom = this.characterClass();
            break;
          case "(":
            atom = this.group();
            break;
        }
        if (atom === void 0 && this.isPatternCharacter()) {
          atom = this.patternCharacter();
        }
        if (ASSERT_EXISTS(atom)) {
          atom.loc = this.loc(begin);
          if (this.isQuantifier()) {
            atom.quantifier = this.quantifier();
          }
          return atom;
        }
        return ASSERT_NEVER_REACH_HERE();
      }
      dotAll() {
        this.consumeChar(".");
        return {
          type: "Set",
          complement: true,
          value: [cc("\n"), cc("\r"), cc("\u2028"), cc("\u2029")]
        };
      }
      atomEscape() {
        this.consumeChar("\\");
        switch (this.peekChar()) {
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            return this.decimalEscapeAtom();
          case "d":
          case "D":
          case "s":
          case "S":
          case "w":
          case "W":
            return this.characterClassEscape();
          case "f":
          case "n":
          case "r":
          case "t":
          case "v":
            return this.controlEscapeAtom();
          case "c":
            return this.controlLetterEscapeAtom();
          case "0":
            return this.nulCharacterAtom();
          case "x":
            return this.hexEscapeSequenceAtom();
          case "u":
            return this.regExpUnicodeEscapeSequenceAtom();
          default:
            return this.identityEscapeAtom();
        }
      }
      decimalEscapeAtom() {
        const value = this.positiveInteger();
        return { type: "GroupBackReference", value };
      }
      characterClassEscape() {
        let set;
        let complement = false;
        switch (this.popChar()) {
          case "d":
            set = digitsCharCodes;
            break;
          case "D":
            set = digitsCharCodes;
            complement = true;
            break;
          case "s":
            set = whitespaceCodes;
            break;
          case "S":
            set = whitespaceCodes;
            complement = true;
            break;
          case "w":
            set = wordCharCodes;
            break;
          case "W":
            set = wordCharCodes;
            complement = true;
            break;
        }
        if (ASSERT_EXISTS(set)) {
          return { type: "Set", value: set, complement };
        }
        return ASSERT_NEVER_REACH_HERE();
      }
      controlEscapeAtom() {
        let escapeCode;
        switch (this.popChar()) {
          case "f":
            escapeCode = cc("\f");
            break;
          case "n":
            escapeCode = cc("\n");
            break;
          case "r":
            escapeCode = cc("\r");
            break;
          case "t":
            escapeCode = cc("	");
            break;
          case "v":
            escapeCode = cc("\v");
            break;
        }
        if (ASSERT_EXISTS(escapeCode)) {
          return { type: "Character", value: escapeCode };
        }
        return ASSERT_NEVER_REACH_HERE();
      }
      controlLetterEscapeAtom() {
        this.consumeChar("c");
        const letter = this.popChar();
        if (/[a-zA-Z]/.test(letter) === false) {
          throw Error("Invalid ");
        }
        const letterCode = letter.toUpperCase().charCodeAt(0) - 64;
        return { type: "Character", value: letterCode };
      }
      nulCharacterAtom() {
        this.consumeChar("0");
        return { type: "Character", value: cc("\0") };
      }
      hexEscapeSequenceAtom() {
        this.consumeChar("x");
        return this.parseHexDigits(2);
      }
      regExpUnicodeEscapeSequenceAtom() {
        this.consumeChar("u");
        return this.parseHexDigits(4);
      }
      identityEscapeAtom() {
        const escapedChar = this.popChar();
        return { type: "Character", value: cc(escapedChar) };
      }
      classPatternCharacterAtom() {
        switch (this.peekChar()) {
          // istanbul ignore next
          case "\n":
          // istanbul ignore next
          case "\r":
          // istanbul ignore next
          case "\u2028":
          // istanbul ignore next
          case "\u2029":
          // istanbul ignore next
          case "\\":
          // istanbul ignore next
          case "]":
            throw Error("TBD");
          default:
            const nextChar = this.popChar();
            return { type: "Character", value: cc(nextChar) };
        }
      }
      characterClass() {
        const set = [];
        let complement = false;
        this.consumeChar("[");
        if (this.peekChar(0) === "^") {
          this.consumeChar("^");
          complement = true;
        }
        while (this.isClassAtom()) {
          const from = this.classAtom();
          const isFromSingleChar = from.type === "Character";
          if (isCharacter(from) && this.isRangeDash()) {
            this.consumeChar("-");
            const to = this.classAtom();
            const isToSingleChar = to.type === "Character";
            if (isCharacter(to)) {
              if (to.value < from.value) {
                throw Error("Range out of order in character class");
              }
              set.push({ from: from.value, to: to.value });
            } else {
              insertToSet(from.value, set);
              set.push(cc("-"));
              insertToSet(to.value, set);
            }
          } else {
            insertToSet(from.value, set);
          }
        }
        this.consumeChar("]");
        return { type: "Set", complement, value: set };
      }
      classAtom() {
        switch (this.peekChar()) {
          // istanbul ignore next
          case "]":
          // istanbul ignore next
          case "\n":
          // istanbul ignore next
          case "\r":
          // istanbul ignore next
          case "\u2028":
          // istanbul ignore next
          case "\u2029":
            throw Error("TBD");
          case "\\":
            return this.classEscape();
          default:
            return this.classPatternCharacterAtom();
        }
      }
      classEscape() {
        this.consumeChar("\\");
        switch (this.peekChar()) {
          // Matches a backspace.
          // (Not to be confused with \b word boundary outside characterClass)
          case "b":
            this.consumeChar("b");
            return { type: "Character", value: cc("\b") };
          case "d":
          case "D":
          case "s":
          case "S":
          case "w":
          case "W":
            return this.characterClassEscape();
          case "f":
          case "n":
          case "r":
          case "t":
          case "v":
            return this.controlEscapeAtom();
          case "c":
            return this.controlLetterEscapeAtom();
          case "0":
            return this.nulCharacterAtom();
          case "x":
            return this.hexEscapeSequenceAtom();
          case "u":
            return this.regExpUnicodeEscapeSequenceAtom();
          default:
            return this.identityEscapeAtom();
        }
      }
      group() {
        let capturing = true;
        this.consumeChar("(");
        switch (this.peekChar(0)) {
          case "?":
            this.consumeChar("?");
            this.consumeChar(":");
            capturing = false;
            break;
          default:
            this.groupIdx++;
            break;
        }
        const value = this.disjunction();
        this.consumeChar(")");
        const groupAst = {
          type: "Group",
          capturing,
          value
        };
        if (capturing) {
          groupAst["idx"] = this.groupIdx;
        }
        return groupAst;
      }
      positiveInteger() {
        let number = this.popChar();
        if (decimalPatternNoZero.test(number) === false) {
          throw Error("Expecting a positive integer");
        }
        while (decimalPattern.test(this.peekChar(0))) {
          number += this.popChar();
        }
        return parseInt(number, 10);
      }
      integerIncludingZero() {
        let number = this.popChar();
        if (decimalPattern.test(number) === false) {
          throw Error("Expecting an integer");
        }
        while (decimalPattern.test(this.peekChar(0))) {
          number += this.popChar();
        }
        return parseInt(number, 10);
      }
      patternCharacter() {
        const nextChar = this.popChar();
        switch (nextChar) {
          // istanbul ignore next
          case "\n":
          // istanbul ignore next
          case "\r":
          // istanbul ignore next
          case "\u2028":
          // istanbul ignore next
          case "\u2029":
          // istanbul ignore next
          case "^":
          // istanbul ignore next
          case "$":
          // istanbul ignore next
          case "\\":
          // istanbul ignore next
          case ".":
          // istanbul ignore next
          case "*":
          // istanbul ignore next
          case "+":
          // istanbul ignore next
          case "?":
          // istanbul ignore next
          case "(":
          // istanbul ignore next
          case ")":
          // istanbul ignore next
          case "[":
          // istanbul ignore next
          case "|":
            throw Error("TBD");
          default:
            return { type: "Character", value: cc(nextChar) };
        }
      }
      isRegExpFlag() {
        switch (this.peekChar(0)) {
          case "g":
          case "i":
          case "m":
          case "u":
          case "y":
            return true;
          default:
            return false;
        }
      }
      isRangeDash() {
        return this.peekChar() === "-" && this.isClassAtom(1);
      }
      isDigit() {
        return decimalPattern.test(this.peekChar(0));
      }
      isClassAtom(howMuch = 0) {
        switch (this.peekChar(howMuch)) {
          case "]":
          case "\n":
          case "\r":
          case "\u2028":
          case "\u2029":
            return false;
          default:
            return true;
        }
      }
      isTerm() {
        return this.isAtom() || this.isAssertion();
      }
      isAtom() {
        if (this.isPatternCharacter()) {
          return true;
        }
        switch (this.peekChar(0)) {
          case ".":
          case "\\":
          // atomEscape
          case "[":
          // characterClass
          // TODO: isAtom must be called before isAssertion - disambiguate
          case "(":
            return true;
          default:
            return false;
        }
      }
      isAssertion() {
        switch (this.peekChar(0)) {
          case "^":
          case "$":
            return true;
          // '\b' or '\B'
          case "\\":
            switch (this.peekChar(1)) {
              case "b":
              case "B":
                return true;
              default:
                return false;
            }
          // '(?=' or '(?!'
          case "(":
            return this.peekChar(1) === "?" && (this.peekChar(2) === "=" || this.peekChar(2) === "!");
          default:
            return false;
        }
      }
      isQuantifier() {
        const prevState = this.saveState();
        try {
          return this.quantifier(true) !== void 0;
        } catch (e) {
          return false;
        } finally {
          this.restoreState(prevState);
        }
      }
      isPatternCharacter() {
        switch (this.peekChar()) {
          case "^":
          case "$":
          case "\\":
          case ".":
          case "*":
          case "+":
          case "?":
          case "(":
          case ")":
          case "[":
          case "|":
          case "/":
          case "\n":
          case "\r":
          case "\u2028":
          case "\u2029":
            return false;
          default:
            return true;
        }
      }
      parseHexDigits(howMany) {
        let hexString = "";
        for (let i = 0; i < howMany; i++) {
          const hexChar = this.popChar();
          if (hexDigitPattern.test(hexChar) === false) {
            throw Error("Expecting a HexDecimal digits");
          }
          hexString += hexChar;
        }
        const charCode = parseInt(hexString, 16);
        return { type: "Character", value: charCode };
      }
      peekChar(howMuch = 0) {
        return this.input[this.idx + howMuch];
      }
      popChar() {
        const nextChar = this.peekChar(0);
        this.consumeChar(void 0);
        return nextChar;
      }
      consumeChar(char) {
        if (char !== void 0 && this.input[this.idx] !== char) {
          throw Error("Expected: '" + char + "' but found: '" + this.input[this.idx] + "' at offset: " + this.idx);
        }
        if (this.idx >= this.input.length) {
          throw Error("Unexpected end of input");
        }
        this.idx++;
      }
      loc(begin) {
        return { begin, end: this.idx };
      }
    };
  }
});

// node_modules/@chevrotain/regexp-to-ast/lib/src/base-regexp-visitor.js
var BaseRegExpVisitor;
var init_base_regexp_visitor = __esm({
  "node_modules/@chevrotain/regexp-to-ast/lib/src/base-regexp-visitor.js"() {
    BaseRegExpVisitor = class {
      visitChildren(node) {
        for (const key in node) {
          const child = node[key];
          if (node.hasOwnProperty(key)) {
            if (child.type !== void 0) {
              this.visit(child);
            } else if (Array.isArray(child)) {
              child.forEach((subChild) => {
                this.visit(subChild);
              }, this);
            }
          }
        }
      }
      visit(node) {
        switch (node.type) {
          case "Pattern":
            this.visitPattern(node);
            break;
          case "Flags":
            this.visitFlags(node);
            break;
          case "Disjunction":
            this.visitDisjunction(node);
            break;
          case "Alternative":
            this.visitAlternative(node);
            break;
          case "StartAnchor":
            this.visitStartAnchor(node);
            break;
          case "EndAnchor":
            this.visitEndAnchor(node);
            break;
          case "WordBoundary":
            this.visitWordBoundary(node);
            break;
          case "NonWordBoundary":
            this.visitNonWordBoundary(node);
            break;
          case "Lookahead":
            this.visitLookahead(node);
            break;
          case "NegativeLookahead":
            this.visitNegativeLookahead(node);
            break;
          case "Character":
            this.visitCharacter(node);
            break;
          case "Set":
            this.visitSet(node);
            break;
          case "Group":
            this.visitGroup(node);
            break;
          case "GroupBackReference":
            this.visitGroupBackReference(node);
            break;
          case "Quantifier":
            this.visitQuantifier(node);
            break;
        }
        this.visitChildren(node);
      }
      visitPattern(node) {
      }
      visitFlags(node) {
      }
      visitDisjunction(node) {
      }
      visitAlternative(node) {
      }
      // Assertion
      visitStartAnchor(node) {
      }
      visitEndAnchor(node) {
      }
      visitWordBoundary(node) {
      }
      visitNonWordBoundary(node) {
      }
      visitLookahead(node) {
      }
      visitNegativeLookahead(node) {
      }
      // atoms
      visitCharacter(node) {
      }
      visitSet(node) {
      }
      visitGroup(node) {
      }
      visitGroupBackReference(node) {
      }
      visitQuantifier(node) {
      }
    };
  }
});

// node_modules/@chevrotain/regexp-to-ast/lib/src/api.js
var init_api3 = __esm({
  "node_modules/@chevrotain/regexp-to-ast/lib/src/api.js"() {
    init_regexp_parser();
    init_base_regexp_visitor();
  }
});

// node_modules/chevrotain/lib/src/scan/reg_exp_parser.js
function getRegExpAst(regExp) {
  const regExpStr = regExp.toString();
  if (regExpAstCache.hasOwnProperty(regExpStr)) {
    return regExpAstCache[regExpStr];
  } else {
    const regExpAst = regExpParser.pattern(regExpStr);
    regExpAstCache[regExpStr] = regExpAst;
    return regExpAst;
  }
}
function clearRegExpParserCache() {
  regExpAstCache = {};
}
var regExpAstCache, regExpParser;
var init_reg_exp_parser = __esm({
  "node_modules/chevrotain/lib/src/scan/reg_exp_parser.js"() {
    init_api3();
    regExpAstCache = {};
    regExpParser = new RegExpParser();
  }
});

// node_modules/chevrotain/lib/src/scan/reg_exp.js
function getOptimizedStartCodesIndices(regExp, ensureOptimizations = false) {
  try {
    const ast = getRegExpAst(regExp);
    const firstChars = firstCharOptimizedIndices(ast.value, {}, ast.flags.ignoreCase);
    return firstChars;
  } catch (e) {
    if (e.message === complementErrorMessage) {
      if (ensureOptimizations) {
        PRINT_WARNING(`${failedOptimizationPrefixMsg}	Unable to optimize: < ${regExp.toString()} >
	Complement Sets cannot be automatically optimized.
	This will disable the lexer's first char optimizations.
	See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#COMPLEMENT for details.`);
      }
    } else {
      let msgSuffix = "";
      if (ensureOptimizations) {
        msgSuffix = "\n	This will disable the lexer's first char optimizations.\n	See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#REGEXP_PARSING for details.";
      }
      PRINT_ERROR(`${failedOptimizationPrefixMsg}
	Failed parsing: < ${regExp.toString()} >
	Using the @chevrotain/regexp-to-ast library
	Please open an issue at: https://github.com/chevrotain/chevrotain/issues` + msgSuffix);
    }
  }
  return [];
}
function firstCharOptimizedIndices(ast, result, ignoreCase) {
  switch (ast.type) {
    case "Disjunction":
      for (let i = 0; i < ast.value.length; i++) {
        firstCharOptimizedIndices(ast.value[i], result, ignoreCase);
      }
      break;
    case "Alternative":
      const terms = ast.value;
      for (let i = 0; i < terms.length; i++) {
        const term = terms[i];
        switch (term.type) {
          case "EndAnchor":
          // A group back reference cannot affect potential starting char.
          // because if a back reference is the first production than automatically
          // the group being referenced has had to come BEFORE so its codes have already been added
          case "GroupBackReference":
          // assertions do not affect potential starting codes
          case "Lookahead":
          case "NegativeLookahead":
          case "StartAnchor":
          case "WordBoundary":
          case "NonWordBoundary":
            continue;
        }
        const atom = term;
        switch (atom.type) {
          case "Character":
            addOptimizedIdxToResult(atom.value, result, ignoreCase);
            break;
          case "Set":
            if (atom.complement === true) {
              throw Error(complementErrorMessage);
            }
            forEach_default(atom.value, (code) => {
              if (typeof code === "number") {
                addOptimizedIdxToResult(code, result, ignoreCase);
              } else {
                const range = code;
                if (ignoreCase === true) {
                  for (let rangeCode = range.from; rangeCode <= range.to; rangeCode++) {
                    addOptimizedIdxToResult(rangeCode, result, ignoreCase);
                  }
                } else {
                  for (let rangeCode = range.from; rangeCode <= range.to && rangeCode < minOptimizationVal; rangeCode++) {
                    addOptimizedIdxToResult(rangeCode, result, ignoreCase);
                  }
                  if (range.to >= minOptimizationVal) {
                    const minUnOptVal = range.from >= minOptimizationVal ? range.from : minOptimizationVal;
                    const maxUnOptVal = range.to;
                    const minOptIdx = charCodeToOptimizedIndex(minUnOptVal);
                    const maxOptIdx = charCodeToOptimizedIndex(maxUnOptVal);
                    for (let currOptIdx = minOptIdx; currOptIdx <= maxOptIdx; currOptIdx++) {
                      result[currOptIdx] = currOptIdx;
                    }
                  }
                }
              }
            });
            break;
          case "Group":
            firstCharOptimizedIndices(atom.value, result, ignoreCase);
            break;
          /* istanbul ignore next */
          default:
            throw Error("Non Exhaustive Match");
        }
        const isOptionalQuantifier = atom.quantifier !== void 0 && atom.quantifier.atLeast === 0;
        if (
          // A group may be optional due to empty contents /(?:)/
          // or if everything inside it is optional /((a)?)/
          atom.type === "Group" && isWholeOptional(atom) === false || // If this term is not a group it may only be optional if it has an optional quantifier
          atom.type !== "Group" && isOptionalQuantifier === false
        ) {
          break;
        }
      }
      break;
    /* istanbul ignore next */
    default:
      throw Error("non exhaustive match!");
  }
  return values_default(result);
}
function addOptimizedIdxToResult(code, result, ignoreCase) {
  const optimizedCharIdx = charCodeToOptimizedIndex(code);
  result[optimizedCharIdx] = optimizedCharIdx;
  if (ignoreCase === true) {
    handleIgnoreCase(code, result);
  }
}
function handleIgnoreCase(code, result) {
  const char = String.fromCharCode(code);
  const upperChar = char.toUpperCase();
  if (upperChar !== char) {
    const optimizedCharIdx = charCodeToOptimizedIndex(upperChar.charCodeAt(0));
    result[optimizedCharIdx] = optimizedCharIdx;
  } else {
    const lowerChar = char.toLowerCase();
    if (lowerChar !== char) {
      const optimizedCharIdx = charCodeToOptimizedIndex(lowerChar.charCodeAt(0));
      result[optimizedCharIdx] = optimizedCharIdx;
    }
  }
}
function findCode(setNode, targetCharCodes) {
  return find_default(setNode.value, (codeOrRange) => {
    if (typeof codeOrRange === "number") {
      return includes_default(targetCharCodes, codeOrRange);
    } else {
      const range = codeOrRange;
      return find_default(targetCharCodes, (targetCode) => range.from <= targetCode && targetCode <= range.to) !== void 0;
    }
  });
}
function isWholeOptional(ast) {
  const quantifier = ast.quantifier;
  if (quantifier && quantifier.atLeast === 0) {
    return true;
  }
  if (!ast.value) {
    return false;
  }
  return isArray_default(ast.value) ? every_default(ast.value, isWholeOptional) : isWholeOptional(ast.value);
}
function canMatchCharCode(charCodes, pattern) {
  if (pattern instanceof RegExp) {
    const ast = getRegExpAst(pattern);
    const charCodeFinder = new CharCodeFinder(charCodes);
    charCodeFinder.visit(ast);
    return charCodeFinder.found;
  } else {
    return find_default(pattern, (char) => {
      return includes_default(charCodes, char.charCodeAt(0));
    }) !== void 0;
  }
}
var complementErrorMessage, failedOptimizationPrefixMsg, CharCodeFinder;
var init_reg_exp = __esm({
  "node_modules/chevrotain/lib/src/scan/reg_exp.js"() {
    init_api3();
    init_lodash();
    init_api();
    init_reg_exp_parser();
    init_lexer();
    complementErrorMessage = "Complement Sets are not supported for first char optimization";
    failedOptimizationPrefixMsg = 'Unable to use "first char" lexer optimizations:\n';
    CharCodeFinder = class extends BaseRegExpVisitor {
      constructor(targetCharCodes) {
        super();
        this.targetCharCodes = targetCharCodes;
        this.found = false;
      }
      visitChildren(node) {
        if (this.found === true) {
          return;
        }
        switch (node.type) {
          case "Lookahead":
            this.visitLookahead(node);
            return;
          case "NegativeLookahead":
            this.visitNegativeLookahead(node);
            return;
        }
        super.visitChildren(node);
      }
      visitCharacter(node) {
        if (includes_default(this.targetCharCodes, node.value)) {
          this.found = true;
        }
      }
      visitSet(node) {
        if (node.complement) {
          if (findCode(node, this.targetCharCodes) === void 0) {
            this.found = true;
          }
        } else {
          if (findCode(node, this.targetCharCodes) !== void 0) {
            this.found = true;
          }
        }
      }
    };
  }
});

// node_modules/chevrotain/lib/src/scan/lexer.js
function analyzeTokenTypes(tokenTypes, options) {
  options = defaults_default(options, {
    useSticky: SUPPORT_STICKY,
    debug: false,
    safeMode: false,
    positionTracking: "full",
    lineTerminatorCharacters: ["\r", "\n"],
    tracer: (msg, action) => action()
  });
  const tracer = options.tracer;
  tracer("initCharCodeToOptimizedIndexMap", () => {
    initCharCodeToOptimizedIndexMap();
  });
  let onlyRelevantTypes;
  tracer("Reject Lexer.NA", () => {
    onlyRelevantTypes = reject_default(tokenTypes, (currType) => {
      return currType[PATTERN] === Lexer.NA;
    });
  });
  let hasCustom = false;
  let allTransformedPatterns;
  tracer("Transform Patterns", () => {
    hasCustom = false;
    allTransformedPatterns = map_default(onlyRelevantTypes, (currType) => {
      const currPattern = currType[PATTERN];
      if (isRegExp_default(currPattern)) {
        const regExpSource = currPattern.source;
        if (regExpSource.length === 1 && // only these regExp meta characters which can appear in a length one regExp
        regExpSource !== "^" && regExpSource !== "$" && regExpSource !== "." && !currPattern.ignoreCase) {
          return regExpSource;
        } else if (regExpSource.length === 2 && regExpSource[0] === "\\" && // not a meta character
        !includes_default([
          "d",
          "D",
          "s",
          "S",
          "t",
          "r",
          "n",
          "t",
          "0",
          "c",
          "b",
          "B",
          "f",
          "v",
          "w",
          "W"
        ], regExpSource[1])) {
          return regExpSource[1];
        } else {
          return options.useSticky ? addStickyFlag(currPattern) : addStartOfInput(currPattern);
        }
      } else if (isFunction_default(currPattern)) {
        hasCustom = true;
        return { exec: currPattern };
      } else if (typeof currPattern === "object") {
        hasCustom = true;
        return currPattern;
      } else if (typeof currPattern === "string") {
        if (currPattern.length === 1) {
          return currPattern;
        } else {
          const escapedRegExpString = currPattern.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
          const wrappedRegExp = new RegExp(escapedRegExpString);
          return options.useSticky ? addStickyFlag(wrappedRegExp) : addStartOfInput(wrappedRegExp);
        }
      } else {
        throw Error("non exhaustive match");
      }
    });
  });
  let patternIdxToType;
  let patternIdxToGroup;
  let patternIdxToLongerAltIdxArr;
  let patternIdxToPushMode;
  let patternIdxToPopMode;
  tracer("misc mapping", () => {
    patternIdxToType = map_default(onlyRelevantTypes, (currType) => currType.tokenTypeIdx);
    patternIdxToGroup = map_default(onlyRelevantTypes, (clazz) => {
      const groupName = clazz.GROUP;
      if (groupName === Lexer.SKIPPED) {
        return void 0;
      } else if (isString_default(groupName)) {
        return groupName;
      } else if (isUndefined_default(groupName)) {
        return false;
      } else {
        throw Error("non exhaustive match");
      }
    });
    patternIdxToLongerAltIdxArr = map_default(onlyRelevantTypes, (clazz) => {
      const longerAltType = clazz.LONGER_ALT;
      if (longerAltType) {
        const longerAltIdxArr = isArray_default(longerAltType) ? map_default(longerAltType, (type) => indexOf_default(onlyRelevantTypes, type)) : [indexOf_default(onlyRelevantTypes, longerAltType)];
        return longerAltIdxArr;
      }
    });
    patternIdxToPushMode = map_default(onlyRelevantTypes, (clazz) => clazz.PUSH_MODE);
    patternIdxToPopMode = map_default(onlyRelevantTypes, (clazz) => has_default(clazz, "POP_MODE"));
  });
  let patternIdxToCanLineTerminator;
  tracer("Line Terminator Handling", () => {
    const lineTerminatorCharCodes = getCharCodes(options.lineTerminatorCharacters);
    patternIdxToCanLineTerminator = map_default(onlyRelevantTypes, (tokType) => false);
    if (options.positionTracking !== "onlyOffset") {
      patternIdxToCanLineTerminator = map_default(onlyRelevantTypes, (tokType) => {
        if (has_default(tokType, "LINE_BREAKS")) {
          return !!tokType.LINE_BREAKS;
        } else {
          return checkLineBreaksIssues(tokType, lineTerminatorCharCodes) === false && canMatchCharCode(lineTerminatorCharCodes, tokType.PATTERN);
        }
      });
    }
  });
  let patternIdxToIsCustom;
  let patternIdxToShort;
  let emptyGroups;
  let patternIdxToConfig;
  tracer("Misc Mapping #2", () => {
    patternIdxToIsCustom = map_default(onlyRelevantTypes, isCustomPattern);
    patternIdxToShort = map_default(allTransformedPatterns, isShortPattern);
    emptyGroups = reduce_default(onlyRelevantTypes, (acc, clazz) => {
      const groupName = clazz.GROUP;
      if (isString_default(groupName) && !(groupName === Lexer.SKIPPED)) {
        acc[groupName] = [];
      }
      return acc;
    }, {});
    patternIdxToConfig = map_default(allTransformedPatterns, (x, idx) => {
      return {
        pattern: allTransformedPatterns[idx],
        longerAlt: patternIdxToLongerAltIdxArr[idx],
        canLineTerminator: patternIdxToCanLineTerminator[idx],
        isCustom: patternIdxToIsCustom[idx],
        short: patternIdxToShort[idx],
        group: patternIdxToGroup[idx],
        push: patternIdxToPushMode[idx],
        pop: patternIdxToPopMode[idx],
        tokenTypeIdx: patternIdxToType[idx],
        tokenType: onlyRelevantTypes[idx]
      };
    });
  });
  let canBeOptimized = true;
  let charCodeToPatternIdxToConfig = [];
  if (!options.safeMode) {
    tracer("First Char Optimization", () => {
      charCodeToPatternIdxToConfig = reduce_default(onlyRelevantTypes, (result, currTokType, idx) => {
        if (typeof currTokType.PATTERN === "string") {
          const charCode = currTokType.PATTERN.charCodeAt(0);
          const optimizedIdx = charCodeToOptimizedIndex(charCode);
          addToMapOfArrays(result, optimizedIdx, patternIdxToConfig[idx]);
        } else if (isArray_default(currTokType.START_CHARS_HINT)) {
          let lastOptimizedIdx;
          forEach_default(currTokType.START_CHARS_HINT, (charOrInt) => {
            const charCode = typeof charOrInt === "string" ? charOrInt.charCodeAt(0) : charOrInt;
            const currOptimizedIdx = charCodeToOptimizedIndex(charCode);
            if (lastOptimizedIdx !== currOptimizedIdx) {
              lastOptimizedIdx = currOptimizedIdx;
              addToMapOfArrays(result, currOptimizedIdx, patternIdxToConfig[idx]);
            }
          });
        } else if (isRegExp_default(currTokType.PATTERN)) {
          if (currTokType.PATTERN.unicode) {
            canBeOptimized = false;
            if (options.ensureOptimizations) {
              PRINT_ERROR(`${failedOptimizationPrefixMsg}	Unable to analyze < ${currTokType.PATTERN.toString()} > pattern.
	The regexp unicode flag is not currently supported by the regexp-to-ast library.
	This will disable the lexer's first char optimizations.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNICODE_OPTIMIZE`);
            }
          } else {
            const optimizedCodes = getOptimizedStartCodesIndices(currTokType.PATTERN, options.ensureOptimizations);
            if (isEmpty_default(optimizedCodes)) {
              canBeOptimized = false;
            }
            forEach_default(optimizedCodes, (code) => {
              addToMapOfArrays(result, code, patternIdxToConfig[idx]);
            });
          }
        } else {
          if (options.ensureOptimizations) {
            PRINT_ERROR(`${failedOptimizationPrefixMsg}	TokenType: <${currTokType.name}> is using a custom token pattern without providing <start_chars_hint> parameter.
	This will disable the lexer's first char optimizations.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_OPTIMIZE`);
          }
          canBeOptimized = false;
        }
        return result;
      }, []);
    });
  }
  return {
    emptyGroups,
    patternIdxToConfig,
    charCodeToPatternIdxToConfig,
    hasCustom,
    canBeOptimized
  };
}
function validatePatterns(tokenTypes, validModesNames) {
  let errors = [];
  const missingResult = findMissingPatterns(tokenTypes);
  errors = errors.concat(missingResult.errors);
  const invalidResult = findInvalidPatterns(missingResult.valid);
  const validTokenTypes = invalidResult.valid;
  errors = errors.concat(invalidResult.errors);
  errors = errors.concat(validateRegExpPattern(validTokenTypes));
  errors = errors.concat(findInvalidGroupType(validTokenTypes));
  errors = errors.concat(findModesThatDoNotExist(validTokenTypes, validModesNames));
  errors = errors.concat(findUnreachablePatterns(validTokenTypes));
  return errors;
}
function validateRegExpPattern(tokenTypes) {
  let errors = [];
  const withRegExpPatterns = filter_default(tokenTypes, (currTokType) => isRegExp_default(currTokType[PATTERN]));
  errors = errors.concat(findEndOfInputAnchor(withRegExpPatterns));
  errors = errors.concat(findStartOfInputAnchor(withRegExpPatterns));
  errors = errors.concat(findUnsupportedFlags(withRegExpPatterns));
  errors = errors.concat(findDuplicatePatterns(withRegExpPatterns));
  errors = errors.concat(findEmptyMatchRegExps(withRegExpPatterns));
  return errors;
}
function findMissingPatterns(tokenTypes) {
  const tokenTypesWithMissingPattern = filter_default(tokenTypes, (currType) => {
    return !has_default(currType, PATTERN);
  });
  const errors = map_default(tokenTypesWithMissingPattern, (currType) => {
    return {
      message: "Token Type: ->" + currType.name + "<- missing static 'PATTERN' property",
      type: LexerDefinitionErrorType.MISSING_PATTERN,
      tokenTypes: [currType]
    };
  });
  const valid = difference_default(tokenTypes, tokenTypesWithMissingPattern);
  return { errors, valid };
}
function findInvalidPatterns(tokenTypes) {
  const tokenTypesWithInvalidPattern = filter_default(tokenTypes, (currType) => {
    const pattern = currType[PATTERN];
    return !isRegExp_default(pattern) && !isFunction_default(pattern) && !has_default(pattern, "exec") && !isString_default(pattern);
  });
  const errors = map_default(tokenTypesWithInvalidPattern, (currType) => {
    return {
      message: "Token Type: ->" + currType.name + "<- static 'PATTERN' can only be a RegExp, a Function matching the {CustomPatternMatcherFunc} type or an Object matching the {ICustomPattern} interface.",
      type: LexerDefinitionErrorType.INVALID_PATTERN,
      tokenTypes: [currType]
    };
  });
  const valid = difference_default(tokenTypes, tokenTypesWithInvalidPattern);
  return { errors, valid };
}
function findEndOfInputAnchor(tokenTypes) {
  class EndAnchorFinder extends BaseRegExpVisitor {
    constructor() {
      super(...arguments);
      this.found = false;
    }
    visitEndAnchor(node) {
      this.found = true;
    }
  }
  const invalidRegex = filter_default(tokenTypes, (currType) => {
    const pattern = currType.PATTERN;
    try {
      const regexpAst = getRegExpAst(pattern);
      const endAnchorVisitor = new EndAnchorFinder();
      endAnchorVisitor.visit(regexpAst);
      return endAnchorVisitor.found;
    } catch (e) {
      return end_of_input.test(pattern.source);
    }
  });
  const errors = map_default(invalidRegex, (currType) => {
    return {
      message: "Unexpected RegExp Anchor Error:\n	Token Type: ->" + currType.name + "<- static 'PATTERN' cannot contain end of input anchor '$'\n	See chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS	for details.",
      type: LexerDefinitionErrorType.EOI_ANCHOR_FOUND,
      tokenTypes: [currType]
    };
  });
  return errors;
}
function findEmptyMatchRegExps(tokenTypes) {
  const matchesEmptyString = filter_default(tokenTypes, (currType) => {
    const pattern = currType.PATTERN;
    return pattern.test("");
  });
  const errors = map_default(matchesEmptyString, (currType) => {
    return {
      message: "Token Type: ->" + currType.name + "<- static 'PATTERN' must not match an empty string",
      type: LexerDefinitionErrorType.EMPTY_MATCH_PATTERN,
      tokenTypes: [currType]
    };
  });
  return errors;
}
function findStartOfInputAnchor(tokenTypes) {
  class StartAnchorFinder extends BaseRegExpVisitor {
    constructor() {
      super(...arguments);
      this.found = false;
    }
    visitStartAnchor(node) {
      this.found = true;
    }
  }
  const invalidRegex = filter_default(tokenTypes, (currType) => {
    const pattern = currType.PATTERN;
    try {
      const regexpAst = getRegExpAst(pattern);
      const startAnchorVisitor = new StartAnchorFinder();
      startAnchorVisitor.visit(regexpAst);
      return startAnchorVisitor.found;
    } catch (e) {
      return start_of_input.test(pattern.source);
    }
  });
  const errors = map_default(invalidRegex, (currType) => {
    return {
      message: "Unexpected RegExp Anchor Error:\n	Token Type: ->" + currType.name + "<- static 'PATTERN' cannot contain start of input anchor '^'\n	See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS	for details.",
      type: LexerDefinitionErrorType.SOI_ANCHOR_FOUND,
      tokenTypes: [currType]
    };
  });
  return errors;
}
function findUnsupportedFlags(tokenTypes) {
  const invalidFlags = filter_default(tokenTypes, (currType) => {
    const pattern = currType[PATTERN];
    return pattern instanceof RegExp && (pattern.multiline || pattern.global);
  });
  const errors = map_default(invalidFlags, (currType) => {
    return {
      message: "Token Type: ->" + currType.name + "<- static 'PATTERN' may NOT contain global('g') or multiline('m')",
      type: LexerDefinitionErrorType.UNSUPPORTED_FLAGS_FOUND,
      tokenTypes: [currType]
    };
  });
  return errors;
}
function findDuplicatePatterns(tokenTypes) {
  const found = [];
  let identicalPatterns = map_default(tokenTypes, (outerType) => {
    return reduce_default(tokenTypes, (result, innerType) => {
      if (outerType.PATTERN.source === innerType.PATTERN.source && !includes_default(found, innerType) && innerType.PATTERN !== Lexer.NA) {
        found.push(innerType);
        result.push(innerType);
        return result;
      }
      return result;
    }, []);
  });
  identicalPatterns = compact_default(identicalPatterns);
  const duplicatePatterns = filter_default(identicalPatterns, (currIdenticalSet) => {
    return currIdenticalSet.length > 1;
  });
  const errors = map_default(duplicatePatterns, (setOfIdentical) => {
    const tokenTypeNames = map_default(setOfIdentical, (currType) => {
      return currType.name;
    });
    const dupPatternSrc = head_default(setOfIdentical).PATTERN;
    return {
      message: `The same RegExp pattern ->${dupPatternSrc}<-has been used in all of the following Token Types: ${tokenTypeNames.join(", ")} <-`,
      type: LexerDefinitionErrorType.DUPLICATE_PATTERNS_FOUND,
      tokenTypes: setOfIdentical
    };
  });
  return errors;
}
function findInvalidGroupType(tokenTypes) {
  const invalidTypes = filter_default(tokenTypes, (clazz) => {
    if (!has_default(clazz, "GROUP")) {
      return false;
    }
    const group = clazz.GROUP;
    return group !== Lexer.SKIPPED && group !== Lexer.NA && !isString_default(group);
  });
  const errors = map_default(invalidTypes, (currType) => {
    return {
      message: "Token Type: ->" + currType.name + "<- static 'GROUP' can only be Lexer.SKIPPED/Lexer.NA/A String",
      type: LexerDefinitionErrorType.INVALID_GROUP_TYPE_FOUND,
      tokenTypes: [currType]
    };
  });
  return errors;
}
function findModesThatDoNotExist(tokenTypes, validModes) {
  const invalidModes = filter_default(tokenTypes, (clazz) => {
    return clazz.PUSH_MODE !== void 0 && !includes_default(validModes, clazz.PUSH_MODE);
  });
  const errors = map_default(invalidModes, (tokType) => {
    const msg = `Token Type: ->${tokType.name}<- static 'PUSH_MODE' value cannot refer to a Lexer Mode ->${tokType.PUSH_MODE}<-which does not exist`;
    return {
      message: msg,
      type: LexerDefinitionErrorType.PUSH_MODE_DOES_NOT_EXIST,
      tokenTypes: [tokType]
    };
  });
  return errors;
}
function findUnreachablePatterns(tokenTypes) {
  const errors = [];
  const canBeTested = reduce_default(tokenTypes, (result, tokType, idx) => {
    const pattern = tokType.PATTERN;
    if (pattern === Lexer.NA) {
      return result;
    }
    if (isString_default(pattern)) {
      result.push({ str: pattern, idx, tokenType: tokType });
    } else if (isRegExp_default(pattern) && noMetaChar(pattern)) {
      result.push({ str: pattern.source, idx, tokenType: tokType });
    }
    return result;
  }, []);
  forEach_default(tokenTypes, (tokType, testIdx) => {
    forEach_default(canBeTested, ({ str, idx, tokenType }) => {
      if (testIdx < idx && testTokenType(str, tokType.PATTERN)) {
        const msg = `Token: ->${tokenType.name}<- can never be matched.
Because it appears AFTER the Token Type ->${tokType.name}<-in the lexer's definition.
See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNREACHABLE`;
        errors.push({
          message: msg,
          type: LexerDefinitionErrorType.UNREACHABLE_PATTERN,
          tokenTypes: [tokType, tokenType]
        });
      }
    });
  });
  return errors;
}
function testTokenType(str, pattern) {
  if (isRegExp_default(pattern)) {
    const regExpArray = pattern.exec(str);
    return regExpArray !== null && regExpArray.index === 0;
  } else if (isFunction_default(pattern)) {
    return pattern(str, 0, [], {});
  } else if (has_default(pattern, "exec")) {
    return pattern.exec(str, 0, [], {});
  } else if (typeof pattern === "string") {
    return pattern === str;
  } else {
    throw Error("non exhaustive match");
  }
}
function noMetaChar(regExp) {
  const metaChars = [
    ".",
    "\\",
    "[",
    "]",
    "|",
    "^",
    "$",
    "(",
    ")",
    "?",
    "*",
    "+",
    "{"
  ];
  return find_default(metaChars, (char) => regExp.source.indexOf(char) !== -1) === void 0;
}
function addStartOfInput(pattern) {
  const flags = pattern.ignoreCase ? "i" : "";
  return new RegExp(`^(?:${pattern.source})`, flags);
}
function addStickyFlag(pattern) {
  const flags = pattern.ignoreCase ? "iy" : "y";
  return new RegExp(`${pattern.source}`, flags);
}
function performRuntimeChecks(lexerDefinition, trackLines, lineTerminatorCharacters) {
  const errors = [];
  if (!has_default(lexerDefinition, DEFAULT_MODE)) {
    errors.push({
      message: "A MultiMode Lexer cannot be initialized without a <" + DEFAULT_MODE + "> property in its definition\n",
      type: LexerDefinitionErrorType.MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE
    });
  }
  if (!has_default(lexerDefinition, MODES)) {
    errors.push({
      message: "A MultiMode Lexer cannot be initialized without a <" + MODES + "> property in its definition\n",
      type: LexerDefinitionErrorType.MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY
    });
  }
  if (has_default(lexerDefinition, MODES) && has_default(lexerDefinition, DEFAULT_MODE) && !has_default(lexerDefinition.modes, lexerDefinition.defaultMode)) {
    errors.push({
      message: `A MultiMode Lexer cannot be initialized with a ${DEFAULT_MODE}: <${lexerDefinition.defaultMode}>which does not exist
`,
      type: LexerDefinitionErrorType.MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST
    });
  }
  if (has_default(lexerDefinition, MODES)) {
    forEach_default(lexerDefinition.modes, (currModeValue, currModeName) => {
      forEach_default(currModeValue, (currTokType, currIdx) => {
        if (isUndefined_default(currTokType)) {
          errors.push({
            message: `A Lexer cannot be initialized using an undefined Token Type. Mode:<${currModeName}> at index: <${currIdx}>
`,
            type: LexerDefinitionErrorType.LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED
          });
        } else if (has_default(currTokType, "LONGER_ALT")) {
          const longerAlt = isArray_default(currTokType.LONGER_ALT) ? currTokType.LONGER_ALT : [currTokType.LONGER_ALT];
          forEach_default(longerAlt, (currLongerAlt) => {
            if (!isUndefined_default(currLongerAlt) && !includes_default(currModeValue, currLongerAlt)) {
              errors.push({
                message: `A MultiMode Lexer cannot be initialized with a longer_alt <${currLongerAlt.name}> on token <${currTokType.name}> outside of mode <${currModeName}>
`,
                type: LexerDefinitionErrorType.MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE
              });
            }
          });
        }
      });
    });
  }
  return errors;
}
function performWarningRuntimeChecks(lexerDefinition, trackLines, lineTerminatorCharacters) {
  const warnings = [];
  let hasAnyLineBreak = false;
  const allTokenTypes = compact_default(flatten_default(values_default(lexerDefinition.modes)));
  const concreteTokenTypes = reject_default(allTokenTypes, (currType) => currType[PATTERN] === Lexer.NA);
  const terminatorCharCodes = getCharCodes(lineTerminatorCharacters);
  if (trackLines) {
    forEach_default(concreteTokenTypes, (tokType) => {
      const currIssue = checkLineBreaksIssues(tokType, terminatorCharCodes);
      if (currIssue !== false) {
        const message = buildLineBreakIssueMessage(tokType, currIssue);
        const warningDescriptor = {
          message,
          type: currIssue.issue,
          tokenType: tokType
        };
        warnings.push(warningDescriptor);
      } else {
        if (has_default(tokType, "LINE_BREAKS")) {
          if (tokType.LINE_BREAKS === true) {
            hasAnyLineBreak = true;
          }
        } else {
          if (canMatchCharCode(terminatorCharCodes, tokType.PATTERN)) {
            hasAnyLineBreak = true;
          }
        }
      }
    });
  }
  if (trackLines && !hasAnyLineBreak) {
    warnings.push({
      message: "Warning: No LINE_BREAKS Found.\n	This Lexer has been defined to track line and column information,\n	But none of the Token Types can be identified as matching a line terminator.\n	See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#LINE_BREAKS \n	for details.",
      type: LexerDefinitionErrorType.NO_LINE_BREAKS_FLAGS
    });
  }
  return warnings;
}
function cloneEmptyGroups(emptyGroups) {
  const clonedResult = {};
  const groupKeys = keys_default(emptyGroups);
  forEach_default(groupKeys, (currKey) => {
    const currGroupValue = emptyGroups[currKey];
    if (isArray_default(currGroupValue)) {
      clonedResult[currKey] = [];
    } else {
      throw Error("non exhaustive match");
    }
  });
  return clonedResult;
}
function isCustomPattern(tokenType) {
  const pattern = tokenType.PATTERN;
  if (isRegExp_default(pattern)) {
    return false;
  } else if (isFunction_default(pattern)) {
    return true;
  } else if (has_default(pattern, "exec")) {
    return true;
  } else if (isString_default(pattern)) {
    return false;
  } else {
    throw Error("non exhaustive match");
  }
}
function isShortPattern(pattern) {
  if (isString_default(pattern) && pattern.length === 1) {
    return pattern.charCodeAt(0);
  } else {
    return false;
  }
}
function checkLineBreaksIssues(tokType, lineTerminatorCharCodes) {
  if (has_default(tokType, "LINE_BREAKS")) {
    return false;
  } else {
    if (isRegExp_default(tokType.PATTERN)) {
      try {
        canMatchCharCode(lineTerminatorCharCodes, tokType.PATTERN);
      } catch (e) {
        return {
          issue: LexerDefinitionErrorType.IDENTIFY_TERMINATOR,
          errMsg: e.message
        };
      }
      return false;
    } else if (isString_default(tokType.PATTERN)) {
      return false;
    } else if (isCustomPattern(tokType)) {
      return { issue: LexerDefinitionErrorType.CUSTOM_LINE_BREAK };
    } else {
      throw Error("non exhaustive match");
    }
  }
}
function buildLineBreakIssueMessage(tokType, details) {
  if (details.issue === LexerDefinitionErrorType.IDENTIFY_TERMINATOR) {
    return `Warning: unable to identify line terminator usage in pattern.
	The problem is in the <${tokType.name}> Token Type
	 Root cause: ${details.errMsg}.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#IDENTIFY_TERMINATOR`;
  } else if (details.issue === LexerDefinitionErrorType.CUSTOM_LINE_BREAK) {
    return `Warning: A Custom Token Pattern should specify the <line_breaks> option.
	The problem is in the <${tokType.name}> Token Type
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_LINE_BREAK`;
  } else {
    throw Error("non exhaustive match");
  }
}
function getCharCodes(charsOrCodes) {
  const charCodes = map_default(charsOrCodes, (numOrString) => {
    if (isString_default(numOrString)) {
      return numOrString.charCodeAt(0);
    } else {
      return numOrString;
    }
  });
  return charCodes;
}
function addToMapOfArrays(map2, key, value) {
  if (map2[key] === void 0) {
    map2[key] = [value];
  } else {
    map2[key].push(value);
  }
}
function charCodeToOptimizedIndex(charCode) {
  return charCode < minOptimizationVal ? charCode : charCodeToOptimizedIdxMap[charCode];
}
function initCharCodeToOptimizedIndexMap() {
  if (isEmpty_default(charCodeToOptimizedIdxMap)) {
    charCodeToOptimizedIdxMap = new Array(65536);
    for (let i = 0; i < 65536; i++) {
      charCodeToOptimizedIdxMap[i] = i > 255 ? 255 + ~~(i / 255) : i;
    }
  }
}
var PATTERN, DEFAULT_MODE, MODES, SUPPORT_STICKY, end_of_input, start_of_input, LineTerminatorOptimizedTester, minOptimizationVal, charCodeToOptimizedIdxMap;
var init_lexer = __esm({
  "node_modules/chevrotain/lib/src/scan/lexer.js"() {
    init_api3();
    init_lexer_public();
    init_lodash();
    init_api();
    init_reg_exp();
    init_reg_exp_parser();
    PATTERN = "PATTERN";
    DEFAULT_MODE = "defaultMode";
    MODES = "modes";
    SUPPORT_STICKY = typeof new RegExp("(?:)").sticky === "boolean";
    end_of_input = /[^\\][$]/;
    start_of_input = /[^\\[][\^]|^\^/;
    LineTerminatorOptimizedTester = {
      // implements /\n|\r\n?/g.test
      test: function(text) {
        const len = text.length;
        for (let i = this.lastIndex; i < len; i++) {
          const c = text.charCodeAt(i);
          if (c === 10) {
            this.lastIndex = i + 1;
            return true;
          } else if (c === 13) {
            if (text.charCodeAt(i + 1) === 10) {
              this.lastIndex = i + 2;
            } else {
              this.lastIndex = i + 1;
            }
            return true;
          }
        }
        return false;
      },
      lastIndex: 0
    };
    minOptimizationVal = 256;
    charCodeToOptimizedIdxMap = [];
  }
});

// node_modules/chevrotain/lib/src/scan/tokens.js
function tokenStructuredMatcher(tokInstance, tokConstructor) {
  const instanceType = tokInstance.tokenTypeIdx;
  if (instanceType === tokConstructor.tokenTypeIdx) {
    return true;
  } else {
    return tokConstructor.isParent === true && tokConstructor.categoryMatchesMap[instanceType] === true;
  }
}
function tokenStructuredMatcherNoCategories(token, tokType) {
  return token.tokenTypeIdx === tokType.tokenTypeIdx;
}
function augmentTokenTypes(tokenTypes) {
  const tokenTypesAndParents = expandCategories(tokenTypes);
  assignTokenDefaultProps(tokenTypesAndParents);
  assignCategoriesMapProp(tokenTypesAndParents);
  assignCategoriesTokensProp(tokenTypesAndParents);
  forEach_default(tokenTypesAndParents, (tokType) => {
    tokType.isParent = tokType.categoryMatches.length > 0;
  });
}
function expandCategories(tokenTypes) {
  let result = clone_default(tokenTypes);
  let categories = tokenTypes;
  let searching = true;
  while (searching) {
    categories = compact_default(flatten_default(map_default(categories, (currTokType) => currTokType.CATEGORIES)));
    const newCategories = difference_default(categories, result);
    result = result.concat(newCategories);
    if (isEmpty_default(newCategories)) {
      searching = false;
    } else {
      categories = newCategories;
    }
  }
  return result;
}
function assignTokenDefaultProps(tokenTypes) {
  forEach_default(tokenTypes, (currTokType) => {
    if (!hasShortKeyProperty(currTokType)) {
      tokenIdxToClass[tokenShortNameIdx] = currTokType;
      currTokType.tokenTypeIdx = tokenShortNameIdx++;
    }
    if (hasCategoriesProperty(currTokType) && !isArray_default(currTokType.CATEGORIES)) {
      currTokType.CATEGORIES = [currTokType.CATEGORIES];
    }
    if (!hasCategoriesProperty(currTokType)) {
      currTokType.CATEGORIES = [];
    }
    if (!hasExtendingTokensTypesProperty(currTokType)) {
      currTokType.categoryMatches = [];
    }
    if (!hasExtendingTokensTypesMapProperty(currTokType)) {
      currTokType.categoryMatchesMap = {};
    }
  });
}
function assignCategoriesTokensProp(tokenTypes) {
  forEach_default(tokenTypes, (currTokType) => {
    currTokType.categoryMatches = [];
    forEach_default(currTokType.categoryMatchesMap, (val, key) => {
      currTokType.categoryMatches.push(tokenIdxToClass[key].tokenTypeIdx);
    });
  });
}
function assignCategoriesMapProp(tokenTypes) {
  forEach_default(tokenTypes, (currTokType) => {
    singleAssignCategoriesToksMap([], currTokType);
  });
}
function singleAssignCategoriesToksMap(path3, nextNode) {
  forEach_default(path3, (pathNode) => {
    nextNode.categoryMatchesMap[pathNode.tokenTypeIdx] = true;
  });
  forEach_default(nextNode.CATEGORIES, (nextCategory) => {
    const newPath = path3.concat(nextNode);
    if (!includes_default(newPath, nextCategory)) {
      singleAssignCategoriesToksMap(newPath, nextCategory);
    }
  });
}
function hasShortKeyProperty(tokType) {
  return has_default(tokType, "tokenTypeIdx");
}
function hasCategoriesProperty(tokType) {
  return has_default(tokType, "CATEGORIES");
}
function hasExtendingTokensTypesProperty(tokType) {
  return has_default(tokType, "categoryMatches");
}
function hasExtendingTokensTypesMapProperty(tokType) {
  return has_default(tokType, "categoryMatchesMap");
}
function isTokenType(tokType) {
  return has_default(tokType, "tokenTypeIdx");
}
var tokenShortNameIdx, tokenIdxToClass;
var init_tokens = __esm({
  "node_modules/chevrotain/lib/src/scan/tokens.js"() {
    init_lodash();
    tokenShortNameIdx = 1;
    tokenIdxToClass = {};
  }
});

// node_modules/chevrotain/lib/src/scan/lexer_errors_public.js
var defaultLexerErrorProvider;
var init_lexer_errors_public = __esm({
  "node_modules/chevrotain/lib/src/scan/lexer_errors_public.js"() {
    defaultLexerErrorProvider = {
      buildUnableToPopLexerModeMessage(token) {
        return `Unable to pop Lexer Mode after encountering Token ->${token.image}<- The Mode Stack is empty`;
      },
      buildUnexpectedCharactersMessage(fullText, startOffset, length, line, column) {
        return `unexpected character: ->${fullText.charAt(startOffset)}<- at offset: ${startOffset}, skipped ${length} characters.`;
      }
    };
  }
});

// node_modules/chevrotain/lib/src/scan/lexer_public.js
var LexerDefinitionErrorType, DEFAULT_LEXER_CONFIG, Lexer;
var init_lexer_public = __esm({
  "node_modules/chevrotain/lib/src/scan/lexer_public.js"() {
    init_lexer();
    init_lodash();
    init_api();
    init_tokens();
    init_lexer_errors_public();
    init_reg_exp_parser();
    (function(LexerDefinitionErrorType2) {
      LexerDefinitionErrorType2[LexerDefinitionErrorType2["MISSING_PATTERN"] = 0] = "MISSING_PATTERN";
      LexerDefinitionErrorType2[LexerDefinitionErrorType2["INVALID_PATTERN"] = 1] = "INVALID_PATTERN";
      LexerDefinitionErrorType2[LexerDefinitionErrorType2["EOI_ANCHOR_FOUND"] = 2] = "EOI_ANCHOR_FOUND";
      LexerDefinitionErrorType2[LexerDefinitionErrorType2["UNSUPPORTED_FLAGS_FOUND"] = 3] = "UNSUPPORTED_FLAGS_FOUND";
      LexerDefinitionErrorType2[LexerDefinitionErrorType2["DUPLICATE_PATTERNS_FOUND"] = 4] = "DUPLICATE_PATTERNS_FOUND";
      LexerDefinitionErrorType2[LexerDefinitionErrorType2["INVALID_GROUP_TYPE_FOUND"] = 5] = "INVALID_GROUP_TYPE_FOUND";
      LexerDefinitionErrorType2[LexerDefinitionErrorType2["PUSH_MODE_DOES_NOT_EXIST"] = 6] = "PUSH_MODE_DOES_NOT_EXIST";
      LexerDefinitionErrorType2[LexerDefinitionErrorType2["MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE"] = 7] = "MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE";
      LexerDefinitionErrorType2[LexerDefinitionErrorType2["MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY"] = 8] = "MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY";
      LexerDefinitionErrorType2[LexerDefinitionErrorType2["MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST"] = 9] = "MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST";
      LexerDefinitionErrorType2[LexerDefinitionErrorType2["LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED"] = 10] = "LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED";
      LexerDefinitionErrorType2[LexerDefinitionErrorType2["SOI_ANCHOR_FOUND"] = 11] = "SOI_ANCHOR_FOUND";
      LexerDefinitionErrorType2[LexerDefinitionErrorType2["EMPTY_MATCH_PATTERN"] = 12] = "EMPTY_MATCH_PATTERN";
      LexerDefinitionErrorType2[LexerDefinitionErrorType2["NO_LINE_BREAKS_FLAGS"] = 13] = "NO_LINE_BREAKS_FLAGS";
      LexerDefinitionErrorType2[LexerDefinitionErrorType2["UNREACHABLE_PATTERN"] = 14] = "UNREACHABLE_PATTERN";
      LexerDefinitionErrorType2[LexerDefinitionErrorType2["IDENTIFY_TERMINATOR"] = 15] = "IDENTIFY_TERMINATOR";
      LexerDefinitionErrorType2[LexerDefinitionErrorType2["CUSTOM_LINE_BREAK"] = 16] = "CUSTOM_LINE_BREAK";
      LexerDefinitionErrorType2[LexerDefinitionErrorType2["MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE"] = 17] = "MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE";
    })(LexerDefinitionErrorType || (LexerDefinitionErrorType = {}));
    DEFAULT_LEXER_CONFIG = {
      deferDefinitionErrorsHandling: false,
      positionTracking: "full",
      lineTerminatorsPattern: /\n|\r\n?/g,
      lineTerminatorCharacters: ["\n", "\r"],
      ensureOptimizations: false,
      safeMode: false,
      errorMessageProvider: defaultLexerErrorProvider,
      traceInitPerf: false,
      skipValidations: false,
      recoveryEnabled: true
    };
    Object.freeze(DEFAULT_LEXER_CONFIG);
    Lexer = class {
      constructor(lexerDefinition, config = DEFAULT_LEXER_CONFIG) {
        this.lexerDefinition = lexerDefinition;
        this.lexerDefinitionErrors = [];
        this.lexerDefinitionWarning = [];
        this.patternIdxToConfig = {};
        this.charCodeToPatternIdxToConfig = {};
        this.modes = [];
        this.emptyGroups = {};
        this.trackStartLines = true;
        this.trackEndLines = true;
        this.hasCustom = false;
        this.canModeBeOptimized = {};
        this.TRACE_INIT = (phaseDesc, phaseImpl) => {
          if (this.traceInitPerf === true) {
            this.traceInitIndent++;
            const indent = new Array(this.traceInitIndent + 1).join("	");
            if (this.traceInitIndent < this.traceInitMaxIdent) {
              console.log(`${indent}--> <${phaseDesc}>`);
            }
            const { time, value } = timer(phaseImpl);
            const traceMethod = time > 10 ? console.warn : console.log;
            if (this.traceInitIndent < this.traceInitMaxIdent) {
              traceMethod(`${indent}<-- <${phaseDesc}> time: ${time}ms`);
            }
            this.traceInitIndent--;
            return value;
          } else {
            return phaseImpl();
          }
        };
        if (typeof config === "boolean") {
          throw Error("The second argument to the Lexer constructor is now an ILexerConfig Object.\na boolean 2nd argument is no longer supported");
        }
        this.config = assign_default({}, DEFAULT_LEXER_CONFIG, config);
        const traceInitVal = this.config.traceInitPerf;
        if (traceInitVal === true) {
          this.traceInitMaxIdent = Infinity;
          this.traceInitPerf = true;
        } else if (typeof traceInitVal === "number") {
          this.traceInitMaxIdent = traceInitVal;
          this.traceInitPerf = true;
        }
        this.traceInitIndent = -1;
        this.TRACE_INIT("Lexer Constructor", () => {
          let actualDefinition;
          let hasOnlySingleMode = true;
          this.TRACE_INIT("Lexer Config handling", () => {
            if (this.config.lineTerminatorsPattern === DEFAULT_LEXER_CONFIG.lineTerminatorsPattern) {
              this.config.lineTerminatorsPattern = LineTerminatorOptimizedTester;
            } else {
              if (this.config.lineTerminatorCharacters === DEFAULT_LEXER_CONFIG.lineTerminatorCharacters) {
                throw Error("Error: Missing <lineTerminatorCharacters> property on the Lexer config.\n	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#MISSING_LINE_TERM_CHARS");
              }
            }
            if (config.safeMode && config.ensureOptimizations) {
              throw Error('"safeMode" and "ensureOptimizations" flags are mutually exclusive.');
            }
            this.trackStartLines = /full|onlyStart/i.test(this.config.positionTracking);
            this.trackEndLines = /full/i.test(this.config.positionTracking);
            if (isArray_default(lexerDefinition)) {
              actualDefinition = {
                modes: { defaultMode: clone_default(lexerDefinition) },
                defaultMode: DEFAULT_MODE
              };
            } else {
              hasOnlySingleMode = false;
              actualDefinition = clone_default(lexerDefinition);
            }
          });
          if (this.config.skipValidations === false) {
            this.TRACE_INIT("performRuntimeChecks", () => {
              this.lexerDefinitionErrors = this.lexerDefinitionErrors.concat(performRuntimeChecks(actualDefinition, this.trackStartLines, this.config.lineTerminatorCharacters));
            });
            this.TRACE_INIT("performWarningRuntimeChecks", () => {
              this.lexerDefinitionWarning = this.lexerDefinitionWarning.concat(performWarningRuntimeChecks(actualDefinition, this.trackStartLines, this.config.lineTerminatorCharacters));
            });
          }
          actualDefinition.modes = actualDefinition.modes ? actualDefinition.modes : {};
          forEach_default(actualDefinition.modes, (currModeValue, currModeName) => {
            actualDefinition.modes[currModeName] = reject_default(currModeValue, (currTokType) => isUndefined_default(currTokType));
          });
          const allModeNames = keys_default(actualDefinition.modes);
          forEach_default(actualDefinition.modes, (currModDef, currModName) => {
            this.TRACE_INIT(`Mode: <${currModName}> processing`, () => {
              this.modes.push(currModName);
              if (this.config.skipValidations === false) {
                this.TRACE_INIT(`validatePatterns`, () => {
                  this.lexerDefinitionErrors = this.lexerDefinitionErrors.concat(validatePatterns(currModDef, allModeNames));
                });
              }
              if (isEmpty_default(this.lexerDefinitionErrors)) {
                augmentTokenTypes(currModDef);
                let currAnalyzeResult;
                this.TRACE_INIT(`analyzeTokenTypes`, () => {
                  currAnalyzeResult = analyzeTokenTypes(currModDef, {
                    lineTerminatorCharacters: this.config.lineTerminatorCharacters,
                    positionTracking: config.positionTracking,
                    ensureOptimizations: config.ensureOptimizations,
                    safeMode: config.safeMode,
                    tracer: this.TRACE_INIT
                  });
                });
                this.patternIdxToConfig[currModName] = currAnalyzeResult.patternIdxToConfig;
                this.charCodeToPatternIdxToConfig[currModName] = currAnalyzeResult.charCodeToPatternIdxToConfig;
                this.emptyGroups = assign_default({}, this.emptyGroups, currAnalyzeResult.emptyGroups);
                this.hasCustom = currAnalyzeResult.hasCustom || this.hasCustom;
                this.canModeBeOptimized[currModName] = currAnalyzeResult.canBeOptimized;
              }
            });
          });
          this.defaultMode = actualDefinition.defaultMode;
          if (!isEmpty_default(this.lexerDefinitionErrors) && !this.config.deferDefinitionErrorsHandling) {
            const allErrMessages = map_default(this.lexerDefinitionErrors, (error) => {
              return error.message;
            });
            const allErrMessagesString = allErrMessages.join("-----------------------\n");
            throw new Error("Errors detected in definition of Lexer:\n" + allErrMessagesString);
          }
          forEach_default(this.lexerDefinitionWarning, (warningDescriptor) => {
            PRINT_WARNING(warningDescriptor.message);
          });
          this.TRACE_INIT("Choosing sub-methods implementations", () => {
            if (SUPPORT_STICKY) {
              this.chopInput = identity_default;
              this.match = this.matchWithTest;
            } else {
              this.updateLastIndex = noop_default;
              this.match = this.matchWithExec;
            }
            if (hasOnlySingleMode) {
              this.handleModes = noop_default;
            }
            if (this.trackStartLines === false) {
              this.computeNewColumn = identity_default;
            }
            if (this.trackEndLines === false) {
              this.updateTokenEndLineColumnLocation = noop_default;
            }
            if (/full/i.test(this.config.positionTracking)) {
              this.createTokenInstance = this.createFullToken;
            } else if (/onlyStart/i.test(this.config.positionTracking)) {
              this.createTokenInstance = this.createStartOnlyToken;
            } else if (/onlyOffset/i.test(this.config.positionTracking)) {
              this.createTokenInstance = this.createOffsetOnlyToken;
            } else {
              throw Error(`Invalid <positionTracking> config option: "${this.config.positionTracking}"`);
            }
            if (this.hasCustom) {
              this.addToken = this.addTokenUsingPush;
              this.handlePayload = this.handlePayloadWithCustom;
            } else {
              this.addToken = this.addTokenUsingMemberAccess;
              this.handlePayload = this.handlePayloadNoCustom;
            }
          });
          this.TRACE_INIT("Failed Optimization Warnings", () => {
            const unOptimizedModes = reduce_default(this.canModeBeOptimized, (cannotBeOptimized, canBeOptimized, modeName) => {
              if (canBeOptimized === false) {
                cannotBeOptimized.push(modeName);
              }
              return cannotBeOptimized;
            }, []);
            if (config.ensureOptimizations && !isEmpty_default(unOptimizedModes)) {
              throw Error(`Lexer Modes: < ${unOptimizedModes.join(", ")} > cannot be optimized.
	 Disable the "ensureOptimizations" lexer config flag to silently ignore this and run the lexer in an un-optimized mode.
	 Or inspect the console log for details on how to resolve these issues.`);
            }
          });
          this.TRACE_INIT("clearRegExpParserCache", () => {
            clearRegExpParserCache();
          });
          this.TRACE_INIT("toFastProperties", () => {
            toFastProperties(this);
          });
        });
      }
      tokenize(text, initialMode = this.defaultMode) {
        if (!isEmpty_default(this.lexerDefinitionErrors)) {
          const allErrMessages = map_default(this.lexerDefinitionErrors, (error) => {
            return error.message;
          });
          const allErrMessagesString = allErrMessages.join("-----------------------\n");
          throw new Error("Unable to Tokenize because Errors detected in definition of Lexer:\n" + allErrMessagesString);
        }
        return this.tokenizeInternal(text, initialMode);
      }
      // There is quite a bit of duplication between this and "tokenizeInternalLazy"
      // This is intentional due to performance considerations.
      // this method also used quite a bit of `!` none null assertions because it is too optimized
      // for `tsc` to always understand it is "safe"
      tokenizeInternal(text, initialMode) {
        let i, j, k, matchAltImage, longerAlt, matchedImage, payload2, altPayload, imageLength, group, tokType, newToken, errLength, droppedChar, msg, match;
        const orgText = text;
        const orgLength = orgText.length;
        let offset = 0;
        let matchedTokensIndex = 0;
        const guessedNumberOfTokens = this.hasCustom ? 0 : Math.floor(text.length / 10);
        const matchedTokens = new Array(guessedNumberOfTokens);
        const errors = [];
        let line = this.trackStartLines ? 1 : void 0;
        let column = this.trackStartLines ? 1 : void 0;
        const groups = cloneEmptyGroups(this.emptyGroups);
        const trackLines = this.trackStartLines;
        const lineTerminatorPattern = this.config.lineTerminatorsPattern;
        let currModePatternsLength = 0;
        let patternIdxToConfig = [];
        let currCharCodeToPatternIdxToConfig = [];
        const modeStack = [];
        const emptyArray = [];
        Object.freeze(emptyArray);
        let getPossiblePatterns;
        function getPossiblePatternsSlow() {
          return patternIdxToConfig;
        }
        function getPossiblePatternsOptimized(charCode) {
          const optimizedCharIdx = charCodeToOptimizedIndex(charCode);
          const possiblePatterns = currCharCodeToPatternIdxToConfig[optimizedCharIdx];
          if (possiblePatterns === void 0) {
            return emptyArray;
          } else {
            return possiblePatterns;
          }
        }
        const pop_mode = (popToken) => {
          if (modeStack.length === 1 && // if we have both a POP_MODE and a PUSH_MODE this is in-fact a "transition"
          // So no error should occur.
          popToken.tokenType.PUSH_MODE === void 0) {
            const msg2 = this.config.errorMessageProvider.buildUnableToPopLexerModeMessage(popToken);
            errors.push({
              offset: popToken.startOffset,
              line: popToken.startLine,
              column: popToken.startColumn,
              length: popToken.image.length,
              message: msg2
            });
          } else {
            modeStack.pop();
            const newMode = last_default(modeStack);
            patternIdxToConfig = this.patternIdxToConfig[newMode];
            currCharCodeToPatternIdxToConfig = this.charCodeToPatternIdxToConfig[newMode];
            currModePatternsLength = patternIdxToConfig.length;
            const modeCanBeOptimized = this.canModeBeOptimized[newMode] && this.config.safeMode === false;
            if (currCharCodeToPatternIdxToConfig && modeCanBeOptimized) {
              getPossiblePatterns = getPossiblePatternsOptimized;
            } else {
              getPossiblePatterns = getPossiblePatternsSlow;
            }
          }
        };
        function push_mode(newMode) {
          modeStack.push(newMode);
          currCharCodeToPatternIdxToConfig = this.charCodeToPatternIdxToConfig[newMode];
          patternIdxToConfig = this.patternIdxToConfig[newMode];
          currModePatternsLength = patternIdxToConfig.length;
          currModePatternsLength = patternIdxToConfig.length;
          const modeCanBeOptimized = this.canModeBeOptimized[newMode] && this.config.safeMode === false;
          if (currCharCodeToPatternIdxToConfig && modeCanBeOptimized) {
            getPossiblePatterns = getPossiblePatternsOptimized;
          } else {
            getPossiblePatterns = getPossiblePatternsSlow;
          }
        }
        push_mode.call(this, initialMode);
        let currConfig;
        const recoveryEnabled = this.config.recoveryEnabled;
        while (offset < orgLength) {
          matchedImage = null;
          const nextCharCode = orgText.charCodeAt(offset);
          const chosenPatternIdxToConfig = getPossiblePatterns(nextCharCode);
          const chosenPatternsLength = chosenPatternIdxToConfig.length;
          for (i = 0; i < chosenPatternsLength; i++) {
            currConfig = chosenPatternIdxToConfig[i];
            const currPattern = currConfig.pattern;
            payload2 = null;
            const singleCharCode = currConfig.short;
            if (singleCharCode !== false) {
              if (nextCharCode === singleCharCode) {
                matchedImage = currPattern;
              }
            } else if (currConfig.isCustom === true) {
              match = currPattern.exec(orgText, offset, matchedTokens, groups);
              if (match !== null) {
                matchedImage = match[0];
                if (match.payload !== void 0) {
                  payload2 = match.payload;
                }
              } else {
                matchedImage = null;
              }
            } else {
              this.updateLastIndex(currPattern, offset);
              matchedImage = this.match(currPattern, text, offset);
            }
            if (matchedImage !== null) {
              longerAlt = currConfig.longerAlt;
              if (longerAlt !== void 0) {
                const longerAltLength = longerAlt.length;
                for (k = 0; k < longerAltLength; k++) {
                  const longerAltConfig = patternIdxToConfig[longerAlt[k]];
                  const longerAltPattern = longerAltConfig.pattern;
                  altPayload = null;
                  if (longerAltConfig.isCustom === true) {
                    match = longerAltPattern.exec(orgText, offset, matchedTokens, groups);
                    if (match !== null) {
                      matchAltImage = match[0];
                      if (match.payload !== void 0) {
                        altPayload = match.payload;
                      }
                    } else {
                      matchAltImage = null;
                    }
                  } else {
                    this.updateLastIndex(longerAltPattern, offset);
                    matchAltImage = this.match(longerAltPattern, text, offset);
                  }
                  if (matchAltImage && matchAltImage.length > matchedImage.length) {
                    matchedImage = matchAltImage;
                    payload2 = altPayload;
                    currConfig = longerAltConfig;
                    break;
                  }
                }
              }
              break;
            }
          }
          if (matchedImage !== null) {
            imageLength = matchedImage.length;
            group = currConfig.group;
            if (group !== void 0) {
              tokType = currConfig.tokenTypeIdx;
              newToken = this.createTokenInstance(matchedImage, offset, tokType, currConfig.tokenType, line, column, imageLength);
              this.handlePayload(newToken, payload2);
              if (group === false) {
                matchedTokensIndex = this.addToken(matchedTokens, matchedTokensIndex, newToken);
              } else {
                groups[group].push(newToken);
              }
            }
            text = this.chopInput(text, imageLength);
            offset = offset + imageLength;
            column = this.computeNewColumn(column, imageLength);
            if (trackLines === true && currConfig.canLineTerminator === true) {
              let numOfLTsInMatch = 0;
              let foundTerminator;
              let lastLTEndOffset;
              lineTerminatorPattern.lastIndex = 0;
              do {
                foundTerminator = lineTerminatorPattern.test(matchedImage);
                if (foundTerminator === true) {
                  lastLTEndOffset = lineTerminatorPattern.lastIndex - 1;
                  numOfLTsInMatch++;
                }
              } while (foundTerminator === true);
              if (numOfLTsInMatch !== 0) {
                line = line + numOfLTsInMatch;
                column = imageLength - lastLTEndOffset;
                this.updateTokenEndLineColumnLocation(newToken, group, lastLTEndOffset, numOfLTsInMatch, line, column, imageLength);
              }
            }
            this.handleModes(currConfig, pop_mode, push_mode, newToken);
          } else {
            const errorStartOffset = offset;
            const errorLine = line;
            const errorColumn = column;
            let foundResyncPoint = recoveryEnabled === false;
            while (foundResyncPoint === false && offset < orgLength) {
              text = this.chopInput(text, 1);
              offset++;
              for (j = 0; j < currModePatternsLength; j++) {
                const currConfig2 = patternIdxToConfig[j];
                const currPattern = currConfig2.pattern;
                const singleCharCode = currConfig2.short;
                if (singleCharCode !== false) {
                  if (orgText.charCodeAt(offset) === singleCharCode) {
                    foundResyncPoint = true;
                  }
                } else if (currConfig2.isCustom === true) {
                  foundResyncPoint = currPattern.exec(orgText, offset, matchedTokens, groups) !== null;
                } else {
                  this.updateLastIndex(currPattern, offset);
                  foundResyncPoint = currPattern.exec(text) !== null;
                }
                if (foundResyncPoint === true) {
                  break;
                }
              }
            }
            errLength = offset - errorStartOffset;
            column = this.computeNewColumn(column, errLength);
            msg = this.config.errorMessageProvider.buildUnexpectedCharactersMessage(orgText, errorStartOffset, errLength, errorLine, errorColumn);
            errors.push({
              offset: errorStartOffset,
              line: errorLine,
              column: errorColumn,
              length: errLength,
              message: msg
            });
            if (recoveryEnabled === false) {
              break;
            }
          }
        }
        if (!this.hasCustom) {
          matchedTokens.length = matchedTokensIndex;
        }
        return {
          tokens: matchedTokens,
          groups,
          errors
        };
      }
      handleModes(config, pop_mode, push_mode, newToken) {
        if (config.pop === true) {
          const pushMode = config.push;
          pop_mode(newToken);
          if (pushMode !== void 0) {
            push_mode.call(this, pushMode);
          }
        } else if (config.push !== void 0) {
          push_mode.call(this, config.push);
        }
      }
      chopInput(text, length) {
        return text.substring(length);
      }
      updateLastIndex(regExp, newLastIndex) {
        regExp.lastIndex = newLastIndex;
      }
      // TODO: decrease this under 600 characters? inspect stripping comments option in TSC compiler
      updateTokenEndLineColumnLocation(newToken, group, lastLTIdx, numOfLTsInMatch, line, column, imageLength) {
        let lastCharIsLT, fixForEndingInLT;
        if (group !== void 0) {
          lastCharIsLT = lastLTIdx === imageLength - 1;
          fixForEndingInLT = lastCharIsLT ? -1 : 0;
          if (!(numOfLTsInMatch === 1 && lastCharIsLT === true)) {
            newToken.endLine = line + fixForEndingInLT;
            newToken.endColumn = column - 1 + -fixForEndingInLT;
          }
        }
      }
      computeNewColumn(oldColumn, imageLength) {
        return oldColumn + imageLength;
      }
      createOffsetOnlyToken(image, startOffset, tokenTypeIdx, tokenType) {
        return {
          image,
          startOffset,
          tokenTypeIdx,
          tokenType
        };
      }
      createStartOnlyToken(image, startOffset, tokenTypeIdx, tokenType, startLine, startColumn) {
        return {
          image,
          startOffset,
          startLine,
          startColumn,
          tokenTypeIdx,
          tokenType
        };
      }
      createFullToken(image, startOffset, tokenTypeIdx, tokenType, startLine, startColumn, imageLength) {
        return {
          image,
          startOffset,
          endOffset: startOffset + imageLength - 1,
          startLine,
          endLine: startLine,
          startColumn,
          endColumn: startColumn + imageLength - 1,
          tokenTypeIdx,
          tokenType
        };
      }
      addTokenUsingPush(tokenVector, index, tokenToAdd) {
        tokenVector.push(tokenToAdd);
        return index;
      }
      addTokenUsingMemberAccess(tokenVector, index, tokenToAdd) {
        tokenVector[index] = tokenToAdd;
        index++;
        return index;
      }
      handlePayloadNoCustom(token, payload2) {
      }
      handlePayloadWithCustom(token, payload2) {
        if (payload2 !== null) {
          token.payload = payload2;
        }
      }
      matchWithTest(pattern, text, offset) {
        const found = pattern.test(text);
        if (found === true) {
          return text.substring(offset, pattern.lastIndex);
        }
        return null;
      }
      matchWithExec(pattern, text) {
        const regExpArray = pattern.exec(text);
        return regExpArray !== null ? regExpArray[0] : null;
      }
    };
    Lexer.SKIPPED = "This marks a skipped Token pattern, this means each token identified by it willbe consumed and then thrown into oblivion, this can be used to for example to completely ignore whitespace.";
    Lexer.NA = /NOT_APPLICABLE/;
  }
});

// node_modules/chevrotain/lib/src/scan/tokens_public.js
function tokenLabel2(tokType) {
  if (hasTokenLabel2(tokType)) {
    return tokType.LABEL;
  } else {
    return tokType.name;
  }
}
function hasTokenLabel2(obj) {
  return isString_default(obj.LABEL) && obj.LABEL !== "";
}
function createToken(config) {
  return createTokenInternal(config);
}
function createTokenInternal(config) {
  const pattern = config.pattern;
  const tokenType = {};
  tokenType.name = config.name;
  if (!isUndefined_default(pattern)) {
    tokenType.PATTERN = pattern;
  }
  if (has_default(config, PARENT)) {
    throw "The parent property is no longer supported.\nSee: https://github.com/chevrotain/chevrotain/issues/564#issuecomment-349062346 for details.";
  }
  if (has_default(config, CATEGORIES)) {
    tokenType.CATEGORIES = config[CATEGORIES];
  }
  augmentTokenTypes([tokenType]);
  if (has_default(config, LABEL)) {
    tokenType.LABEL = config[LABEL];
  }
  if (has_default(config, GROUP)) {
    tokenType.GROUP = config[GROUP];
  }
  if (has_default(config, POP_MODE)) {
    tokenType.POP_MODE = config[POP_MODE];
  }
  if (has_default(config, PUSH_MODE)) {
    tokenType.PUSH_MODE = config[PUSH_MODE];
  }
  if (has_default(config, LONGER_ALT)) {
    tokenType.LONGER_ALT = config[LONGER_ALT];
  }
  if (has_default(config, LINE_BREAKS)) {
    tokenType.LINE_BREAKS = config[LINE_BREAKS];
  }
  if (has_default(config, START_CHARS_HINT)) {
    tokenType.START_CHARS_HINT = config[START_CHARS_HINT];
  }
  return tokenType;
}
function createTokenInstance(tokType, image, startOffset, endOffset, startLine, endLine, startColumn, endColumn) {
  return {
    image,
    startOffset,
    endOffset,
    startLine,
    endLine,
    startColumn,
    endColumn,
    tokenTypeIdx: tokType.tokenTypeIdx,
    tokenType: tokType
  };
}
function tokenMatcher(token, tokType) {
  return tokenStructuredMatcher(token, tokType);
}
var PARENT, CATEGORIES, LABEL, GROUP, PUSH_MODE, POP_MODE, LONGER_ALT, LINE_BREAKS, START_CHARS_HINT, EOF;
var init_tokens_public = __esm({
  "node_modules/chevrotain/lib/src/scan/tokens_public.js"() {
    init_lodash();
    init_lexer_public();
    init_tokens();
    PARENT = "parent";
    CATEGORIES = "categories";
    LABEL = "label";
    GROUP = "group";
    PUSH_MODE = "push_mode";
    POP_MODE = "pop_mode";
    LONGER_ALT = "longer_alt";
    LINE_BREAKS = "line_breaks";
    START_CHARS_HINT = "start_chars_hint";
    EOF = createToken({ name: "EOF", pattern: Lexer.NA });
    augmentTokenTypes([EOF]);
  }
});

// node_modules/chevrotain/lib/src/parse/errors_public.js
var defaultParserErrorProvider, defaultGrammarResolverErrorProvider, defaultGrammarValidatorErrorProvider;
var init_errors_public = __esm({
  "node_modules/chevrotain/lib/src/parse/errors_public.js"() {
    init_tokens_public();
    init_lodash();
    init_api2();
    defaultParserErrorProvider = {
      buildMismatchTokenMessage({ expected, actual, previous, ruleName }) {
        const hasLabel = hasTokenLabel2(expected);
        const expectedMsg = hasLabel ? `--> ${tokenLabel2(expected)} <--` : `token of type --> ${expected.name} <--`;
        const msg = `Expecting ${expectedMsg} but found --> '${actual.image}' <--`;
        return msg;
      },
      buildNotAllInputParsedMessage({ firstRedundant, ruleName }) {
        return "Redundant input, expecting EOF but found: " + firstRedundant.image;
      },
      buildNoViableAltMessage({ expectedPathsPerAlt, actual, previous, customUserDescription, ruleName }) {
        const errPrefix = "Expecting: ";
        const actualText = head_default(actual).image;
        const errSuffix = "\nbut found: '" + actualText + "'";
        if (customUserDescription) {
          return errPrefix + customUserDescription + errSuffix;
        } else {
          const allLookAheadPaths = reduce_default(expectedPathsPerAlt, (result, currAltPaths) => result.concat(currAltPaths), []);
          const nextValidTokenSequences = map_default(allLookAheadPaths, (currPath) => `[${map_default(currPath, (currTokenType) => tokenLabel2(currTokenType)).join(", ")}]`);
          const nextValidSequenceItems = map_default(nextValidTokenSequences, (itemMsg, idx) => `  ${idx + 1}. ${itemMsg}`);
          const calculatedDescription = `one of these possible Token sequences:
${nextValidSequenceItems.join("\n")}`;
          return errPrefix + calculatedDescription + errSuffix;
        }
      },
      buildEarlyExitMessage({ expectedIterationPaths, actual, customUserDescription, ruleName }) {
        const errPrefix = "Expecting: ";
        const actualText = head_default(actual).image;
        const errSuffix = "\nbut found: '" + actualText + "'";
        if (customUserDescription) {
          return errPrefix + customUserDescription + errSuffix;
        } else {
          const nextValidTokenSequences = map_default(expectedIterationPaths, (currPath) => `[${map_default(currPath, (currTokenType) => tokenLabel2(currTokenType)).join(",")}]`);
          const calculatedDescription = `expecting at least one iteration which starts with one of these possible Token sequences::
  <${nextValidTokenSequences.join(" ,")}>`;
          return errPrefix + calculatedDescription + errSuffix;
        }
      }
    };
    Object.freeze(defaultParserErrorProvider);
    defaultGrammarResolverErrorProvider = {
      buildRuleNotFoundError(topLevelRule, undefinedRule) {
        const msg = "Invalid grammar, reference to a rule which is not defined: ->" + undefinedRule.nonTerminalName + "<-\ninside top level rule: ->" + topLevelRule.name + "<-";
        return msg;
      }
    };
    defaultGrammarValidatorErrorProvider = {
      buildDuplicateFoundError(topLevelRule, duplicateProds) {
        function getExtraProductionArgument2(prod) {
          if (prod instanceof Terminal) {
            return prod.terminalType.name;
          } else if (prod instanceof NonTerminal) {
            return prod.nonTerminalName;
          } else {
            return "";
          }
        }
        const topLevelName = topLevelRule.name;
        const duplicateProd = head_default(duplicateProds);
        const index = duplicateProd.idx;
        const dslName = getProductionDslName(duplicateProd);
        const extraArgument = getExtraProductionArgument2(duplicateProd);
        const hasExplicitIndex = index > 0;
        let msg = `->${dslName}${hasExplicitIndex ? index : ""}<- ${extraArgument ? `with argument: ->${extraArgument}<-` : ""}
                  appears more than once (${duplicateProds.length} times) in the top level rule: ->${topLevelName}<-.                  
                  For further details see: https://chevrotain.io/docs/FAQ.html#NUMERICAL_SUFFIXES 
                  `;
        msg = msg.replace(/[ \t]+/g, " ");
        msg = msg.replace(/\s\s+/g, "\n");
        return msg;
      },
      buildNamespaceConflictError(rule) {
        const errMsg = `Namespace conflict found in grammar.
The grammar has both a Terminal(Token) and a Non-Terminal(Rule) named: <${rule.name}>.
To resolve this make sure each Terminal and Non-Terminal names are unique
This is easy to accomplish by using the convention that Terminal names start with an uppercase letter
and Non-Terminal names start with a lower case letter.`;
        return errMsg;
      },
      buildAlternationPrefixAmbiguityError(options) {
        const pathMsg = map_default(options.prefixPath, (currTok) => tokenLabel2(currTok)).join(", ");
        const occurrence = options.alternation.idx === 0 ? "" : options.alternation.idx;
        const errMsg = `Ambiguous alternatives: <${options.ambiguityIndices.join(" ,")}> due to common lookahead prefix
in <OR${occurrence}> inside <${options.topLevelRule.name}> Rule,
<${pathMsg}> may appears as a prefix path in all these alternatives.
See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#COMMON_PREFIX
For Further details.`;
        return errMsg;
      },
      buildAlternationAmbiguityError(options) {
        const pathMsg = map_default(options.prefixPath, (currtok) => tokenLabel2(currtok)).join(", ");
        const occurrence = options.alternation.idx === 0 ? "" : options.alternation.idx;
        let currMessage = `Ambiguous Alternatives Detected: <${options.ambiguityIndices.join(" ,")}> in <OR${occurrence}> inside <${options.topLevelRule.name}> Rule,
<${pathMsg}> may appears as a prefix path in all these alternatives.
`;
        currMessage = currMessage + `See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#AMBIGUOUS_ALTERNATIVES
For Further details.`;
        return currMessage;
      },
      buildEmptyRepetitionError(options) {
        let dslName = getProductionDslName(options.repetition);
        if (options.repetition.idx !== 0) {
          dslName += options.repetition.idx;
        }
        const errMsg = `The repetition <${dslName}> within Rule <${options.topLevelRule.name}> can never consume any tokens.
This could lead to an infinite loop.`;
        return errMsg;
      },
      // TODO: remove - `errors_public` from nyc.config.js exclude
      //       once this method is fully removed from this file
      buildTokenNameError(options) {
        return "deprecated";
      },
      buildEmptyAlternationError(options) {
        const errMsg = `Ambiguous empty alternative: <${options.emptyChoiceIdx + 1}> in <OR${options.alternation.idx}> inside <${options.topLevelRule.name}> Rule.
Only the last alternative may be an empty alternative.`;
        return errMsg;
      },
      buildTooManyAlternativesError(options) {
        const errMsg = `An Alternation cannot have more than 256 alternatives:
<OR${options.alternation.idx}> inside <${options.topLevelRule.name}> Rule.
 has ${options.alternation.definition.length + 1} alternatives.`;
        return errMsg;
      },
      buildLeftRecursionError(options) {
        const ruleName = options.topLevelRule.name;
        const pathNames = map_default(options.leftRecursionPath, (currRule) => currRule.name);
        const leftRecursivePath = `${ruleName} --> ${pathNames.concat([ruleName]).join(" --> ")}`;
        const errMsg = `Left Recursion found in grammar.
rule: <${ruleName}> can be invoked from itself (directly or indirectly)
without consuming any Tokens. The grammar path that causes this is: 
 ${leftRecursivePath}
 To fix this refactor your grammar to remove the left recursion.
see: https://en.wikipedia.org/wiki/LL_parser#Left_factoring.`;
        return errMsg;
      },
      // TODO: remove - `errors_public` from nyc.config.js exclude
      //       once this method is fully removed from this file
      buildInvalidRuleNameError(options) {
        return "deprecated";
      },
      buildDuplicateRuleNameError(options) {
        let ruleName;
        if (options.topLevelRule instanceof Rule) {
          ruleName = options.topLevelRule.name;
        } else {
          ruleName = options.topLevelRule;
        }
        const errMsg = `Duplicate definition, rule: ->${ruleName}<- is already defined in the grammar: ->${options.grammarName}<-`;
        return errMsg;
      }
    };
  }
});

// node_modules/chevrotain/lib/src/parse/grammar/resolver.js
function resolveGrammar(topLevels, errMsgProvider) {
  const refResolver = new GastRefResolverVisitor(topLevels, errMsgProvider);
  refResolver.resolveRefs();
  return refResolver.errors;
}
var GastRefResolverVisitor;
var init_resolver = __esm({
  "node_modules/chevrotain/lib/src/parse/grammar/resolver.js"() {
    init_parser();
    init_lodash();
    init_api2();
    GastRefResolverVisitor = class extends GAstVisitor {
      constructor(nameToTopRule, errMsgProvider) {
        super();
        this.nameToTopRule = nameToTopRule;
        this.errMsgProvider = errMsgProvider;
        this.errors = [];
      }
      resolveRefs() {
        forEach_default(values_default(this.nameToTopRule), (prod) => {
          this.currTopLevel = prod;
          prod.accept(this);
        });
      }
      visitNonTerminal(node) {
        const ref = this.nameToTopRule[node.nonTerminalName];
        if (!ref) {
          const msg = this.errMsgProvider.buildRuleNotFoundError(this.currTopLevel, node);
          this.errors.push({
            message: msg,
            type: ParserDefinitionErrorType.UNRESOLVED_SUBRULE_REF,
            ruleName: this.currTopLevel.name,
            unresolvedRefName: node.nonTerminalName
          });
        } else {
          node.referencedRule = ref;
        }
      }
    };
  }
});

// node_modules/chevrotain/lib/src/parse/grammar/interpreter.js
function possiblePathsFrom(targetDef, maxLength, currPath = []) {
  currPath = clone_default(currPath);
  let result = [];
  let i = 0;
  function remainingPathWith(nextDef) {
    return nextDef.concat(drop_default(targetDef, i + 1));
  }
  function getAlternativesForProd(definition) {
    const alternatives = possiblePathsFrom(remainingPathWith(definition), maxLength, currPath);
    return result.concat(alternatives);
  }
  while (currPath.length < maxLength && i < targetDef.length) {
    const prod = targetDef[i];
    if (prod instanceof Alternative) {
      return getAlternativesForProd(prod.definition);
    } else if (prod instanceof NonTerminal) {
      return getAlternativesForProd(prod.definition);
    } else if (prod instanceof Option) {
      result = getAlternativesForProd(prod.definition);
    } else if (prod instanceof RepetitionMandatory) {
      const newDef = prod.definition.concat([
        new Repetition({
          definition: prod.definition
        })
      ]);
      return getAlternativesForProd(newDef);
    } else if (prod instanceof RepetitionMandatoryWithSeparator) {
      const newDef = [
        new Alternative({ definition: prod.definition }),
        new Repetition({
          definition: [new Terminal({ terminalType: prod.separator })].concat(prod.definition)
        })
      ];
      return getAlternativesForProd(newDef);
    } else if (prod instanceof RepetitionWithSeparator) {
      const newDef = prod.definition.concat([
        new Repetition({
          definition: [new Terminal({ terminalType: prod.separator })].concat(prod.definition)
        })
      ]);
      result = getAlternativesForProd(newDef);
    } else if (prod instanceof Repetition) {
      const newDef = prod.definition.concat([
        new Repetition({
          definition: prod.definition
        })
      ]);
      result = getAlternativesForProd(newDef);
    } else if (prod instanceof Alternation) {
      forEach_default(prod.definition, (currAlt) => {
        if (isEmpty_default(currAlt.definition) === false) {
          result = getAlternativesForProd(currAlt.definition);
        }
      });
      return result;
    } else if (prod instanceof Terminal) {
      currPath.push(prod.terminalType);
    } else {
      throw Error("non exhaustive match");
    }
    i++;
  }
  result.push({
    partialPath: currPath,
    suffixDef: drop_default(targetDef, i)
  });
  return result;
}
function nextPossibleTokensAfter(initialDef, tokenVector, tokMatcher, maxLookAhead) {
  const EXIT_NON_TERMINAL = "EXIT_NONE_TERMINAL";
  const EXIT_NON_TERMINAL_ARR = [EXIT_NON_TERMINAL];
  const EXIT_ALTERNATIVE = "EXIT_ALTERNATIVE";
  let foundCompletePath = false;
  const tokenVectorLength = tokenVector.length;
  const minimalAlternativesIndex = tokenVectorLength - maxLookAhead - 1;
  const result = [];
  const possiblePaths = [];
  possiblePaths.push({
    idx: -1,
    def: initialDef,
    ruleStack: [],
    occurrenceStack: []
  });
  while (!isEmpty_default(possiblePaths)) {
    const currPath = possiblePaths.pop();
    if (currPath === EXIT_ALTERNATIVE) {
      if (foundCompletePath && last_default(possiblePaths).idx <= minimalAlternativesIndex) {
        possiblePaths.pop();
      }
      continue;
    }
    const currDef = currPath.def;
    const currIdx = currPath.idx;
    const currRuleStack = currPath.ruleStack;
    const currOccurrenceStack = currPath.occurrenceStack;
    if (isEmpty_default(currDef)) {
      continue;
    }
    const prod = currDef[0];
    if (prod === EXIT_NON_TERMINAL) {
      const nextPath = {
        idx: currIdx,
        def: drop_default(currDef),
        ruleStack: dropRight_default(currRuleStack),
        occurrenceStack: dropRight_default(currOccurrenceStack)
      };
      possiblePaths.push(nextPath);
    } else if (prod instanceof Terminal) {
      if (currIdx < tokenVectorLength - 1) {
        const nextIdx = currIdx + 1;
        const actualToken = tokenVector[nextIdx];
        if (tokMatcher(actualToken, prod.terminalType)) {
          const nextPath = {
            idx: nextIdx,
            def: drop_default(currDef),
            ruleStack: currRuleStack,
            occurrenceStack: currOccurrenceStack
          };
          possiblePaths.push(nextPath);
        }
      } else if (currIdx === tokenVectorLength - 1) {
        result.push({
          nextTokenType: prod.terminalType,
          nextTokenOccurrence: prod.idx,
          ruleStack: currRuleStack,
          occurrenceStack: currOccurrenceStack
        });
        foundCompletePath = true;
      } else {
        throw Error("non exhaustive match");
      }
    } else if (prod instanceof NonTerminal) {
      const newRuleStack = clone_default(currRuleStack);
      newRuleStack.push(prod.nonTerminalName);
      const newOccurrenceStack = clone_default(currOccurrenceStack);
      newOccurrenceStack.push(prod.idx);
      const nextPath = {
        idx: currIdx,
        def: prod.definition.concat(EXIT_NON_TERMINAL_ARR, drop_default(currDef)),
        ruleStack: newRuleStack,
        occurrenceStack: newOccurrenceStack
      };
      possiblePaths.push(nextPath);
    } else if (prod instanceof Option) {
      const nextPathWithout = {
        idx: currIdx,
        def: drop_default(currDef),
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      };
      possiblePaths.push(nextPathWithout);
      possiblePaths.push(EXIT_ALTERNATIVE);
      const nextPathWith = {
        idx: currIdx,
        def: prod.definition.concat(drop_default(currDef)),
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      };
      possiblePaths.push(nextPathWith);
    } else if (prod instanceof RepetitionMandatory) {
      const secondIteration = new Repetition({
        definition: prod.definition,
        idx: prod.idx
      });
      const nextDef = prod.definition.concat([secondIteration], drop_default(currDef));
      const nextPath = {
        idx: currIdx,
        def: nextDef,
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      };
      possiblePaths.push(nextPath);
    } else if (prod instanceof RepetitionMandatoryWithSeparator) {
      const separatorGast = new Terminal({
        terminalType: prod.separator
      });
      const secondIteration = new Repetition({
        definition: [separatorGast].concat(prod.definition),
        idx: prod.idx
      });
      const nextDef = prod.definition.concat([secondIteration], drop_default(currDef));
      const nextPath = {
        idx: currIdx,
        def: nextDef,
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      };
      possiblePaths.push(nextPath);
    } else if (prod instanceof RepetitionWithSeparator) {
      const nextPathWithout = {
        idx: currIdx,
        def: drop_default(currDef),
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      };
      possiblePaths.push(nextPathWithout);
      possiblePaths.push(EXIT_ALTERNATIVE);
      const separatorGast = new Terminal({
        terminalType: prod.separator
      });
      const nthRepetition = new Repetition({
        definition: [separatorGast].concat(prod.definition),
        idx: prod.idx
      });
      const nextDef = prod.definition.concat([nthRepetition], drop_default(currDef));
      const nextPathWith = {
        idx: currIdx,
        def: nextDef,
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      };
      possiblePaths.push(nextPathWith);
    } else if (prod instanceof Repetition) {
      const nextPathWithout = {
        idx: currIdx,
        def: drop_default(currDef),
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      };
      possiblePaths.push(nextPathWithout);
      possiblePaths.push(EXIT_ALTERNATIVE);
      const nthRepetition = new Repetition({
        definition: prod.definition,
        idx: prod.idx
      });
      const nextDef = prod.definition.concat([nthRepetition], drop_default(currDef));
      const nextPathWith = {
        idx: currIdx,
        def: nextDef,
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      };
      possiblePaths.push(nextPathWith);
    } else if (prod instanceof Alternation) {
      for (let i = prod.definition.length - 1; i >= 0; i--) {
        const currAlt = prod.definition[i];
        const currAltPath = {
          idx: currIdx,
          def: currAlt.definition.concat(drop_default(currDef)),
          ruleStack: currRuleStack,
          occurrenceStack: currOccurrenceStack
        };
        possiblePaths.push(currAltPath);
        possiblePaths.push(EXIT_ALTERNATIVE);
      }
    } else if (prod instanceof Alternative) {
      possiblePaths.push({
        idx: currIdx,
        def: prod.definition.concat(drop_default(currDef)),
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      });
    } else if (prod instanceof Rule) {
      possiblePaths.push(expandTopLevelRule(prod, currIdx, currRuleStack, currOccurrenceStack));
    } else {
      throw Error("non exhaustive match");
    }
  }
  return result;
}
function expandTopLevelRule(topRule, currIdx, currRuleStack, currOccurrenceStack) {
  const newRuleStack = clone_default(currRuleStack);
  newRuleStack.push(topRule.name);
  const newCurrOccurrenceStack = clone_default(currOccurrenceStack);
  newCurrOccurrenceStack.push(1);
  return {
    idx: currIdx,
    def: topRule.definition,
    ruleStack: newRuleStack,
    occurrenceStack: newCurrOccurrenceStack
  };
}
var AbstractNextPossibleTokensWalker, NextAfterTokenWalker, AbstractNextTerminalAfterProductionWalker, NextTerminalAfterManyWalker, NextTerminalAfterManySepWalker, NextTerminalAfterAtLeastOneWalker, NextTerminalAfterAtLeastOneSepWalker;
var init_interpreter = __esm({
  "node_modules/chevrotain/lib/src/parse/grammar/interpreter.js"() {
    init_lodash();
    init_first2();
    init_rest();
    init_api2();
    AbstractNextPossibleTokensWalker = class extends RestWalker {
      constructor(topProd, path3) {
        super();
        this.topProd = topProd;
        this.path = path3;
        this.possibleTokTypes = [];
        this.nextProductionName = "";
        this.nextProductionOccurrence = 0;
        this.found = false;
        this.isAtEndOfPath = false;
      }
      startWalking() {
        this.found = false;
        if (this.path.ruleStack[0] !== this.topProd.name) {
          throw Error("The path does not start with the walker's top Rule!");
        }
        this.ruleStack = clone_default(this.path.ruleStack).reverse();
        this.occurrenceStack = clone_default(this.path.occurrenceStack).reverse();
        this.ruleStack.pop();
        this.occurrenceStack.pop();
        this.updateExpectedNext();
        this.walk(this.topProd);
        return this.possibleTokTypes;
      }
      walk(prod, prevRest = []) {
        if (!this.found) {
          super.walk(prod, prevRest);
        }
      }
      walkProdRef(refProd, currRest, prevRest) {
        if (refProd.referencedRule.name === this.nextProductionName && refProd.idx === this.nextProductionOccurrence) {
          const fullRest = currRest.concat(prevRest);
          this.updateExpectedNext();
          this.walk(refProd.referencedRule, fullRest);
        }
      }
      updateExpectedNext() {
        if (isEmpty_default(this.ruleStack)) {
          this.nextProductionName = "";
          this.nextProductionOccurrence = 0;
          this.isAtEndOfPath = true;
        } else {
          this.nextProductionName = this.ruleStack.pop();
          this.nextProductionOccurrence = this.occurrenceStack.pop();
        }
      }
    };
    NextAfterTokenWalker = class extends AbstractNextPossibleTokensWalker {
      constructor(topProd, path3) {
        super(topProd, path3);
        this.path = path3;
        this.nextTerminalName = "";
        this.nextTerminalOccurrence = 0;
        this.nextTerminalName = this.path.lastTok.name;
        this.nextTerminalOccurrence = this.path.lastTokOccurrence;
      }
      walkTerminal(terminal, currRest, prevRest) {
        if (this.isAtEndOfPath && terminal.terminalType.name === this.nextTerminalName && terminal.idx === this.nextTerminalOccurrence && !this.found) {
          const fullRest = currRest.concat(prevRest);
          const restProd = new Alternative({ definition: fullRest });
          this.possibleTokTypes = first(restProd);
          this.found = true;
        }
      }
    };
    AbstractNextTerminalAfterProductionWalker = class extends RestWalker {
      constructor(topRule, occurrence) {
        super();
        this.topRule = topRule;
        this.occurrence = occurrence;
        this.result = {
          token: void 0,
          occurrence: void 0,
          isEndOfRule: void 0
        };
      }
      startWalking() {
        this.walk(this.topRule);
        return this.result;
      }
    };
    NextTerminalAfterManyWalker = class extends AbstractNextTerminalAfterProductionWalker {
      walkMany(manyProd, currRest, prevRest) {
        if (manyProd.idx === this.occurrence) {
          const firstAfterMany = head_default(currRest.concat(prevRest));
          this.result.isEndOfRule = firstAfterMany === void 0;
          if (firstAfterMany instanceof Terminal) {
            this.result.token = firstAfterMany.terminalType;
            this.result.occurrence = firstAfterMany.idx;
          }
        } else {
          super.walkMany(manyProd, currRest, prevRest);
        }
      }
    };
    NextTerminalAfterManySepWalker = class extends AbstractNextTerminalAfterProductionWalker {
      walkManySep(manySepProd, currRest, prevRest) {
        if (manySepProd.idx === this.occurrence) {
          const firstAfterManySep = head_default(currRest.concat(prevRest));
          this.result.isEndOfRule = firstAfterManySep === void 0;
          if (firstAfterManySep instanceof Terminal) {
            this.result.token = firstAfterManySep.terminalType;
            this.result.occurrence = firstAfterManySep.idx;
          }
        } else {
          super.walkManySep(manySepProd, currRest, prevRest);
        }
      }
    };
    NextTerminalAfterAtLeastOneWalker = class extends AbstractNextTerminalAfterProductionWalker {
      walkAtLeastOne(atLeastOneProd, currRest, prevRest) {
        if (atLeastOneProd.idx === this.occurrence) {
          const firstAfterAtLeastOne = head_default(currRest.concat(prevRest));
          this.result.isEndOfRule = firstAfterAtLeastOne === void 0;
          if (firstAfterAtLeastOne instanceof Terminal) {
            this.result.token = firstAfterAtLeastOne.terminalType;
            this.result.occurrence = firstAfterAtLeastOne.idx;
          }
        } else {
          super.walkAtLeastOne(atLeastOneProd, currRest, prevRest);
        }
      }
    };
    NextTerminalAfterAtLeastOneSepWalker = class extends AbstractNextTerminalAfterProductionWalker {
      walkAtLeastOneSep(atleastOneSepProd, currRest, prevRest) {
        if (atleastOneSepProd.idx === this.occurrence) {
          const firstAfterfirstAfterAtLeastOneSep = head_default(currRest.concat(prevRest));
          this.result.isEndOfRule = firstAfterfirstAfterAtLeastOneSep === void 0;
          if (firstAfterfirstAfterAtLeastOneSep instanceof Terminal) {
            this.result.token = firstAfterfirstAfterAtLeastOneSep.terminalType;
            this.result.occurrence = firstAfterfirstAfterAtLeastOneSep.idx;
          }
        } else {
          super.walkAtLeastOneSep(atleastOneSepProd, currRest, prevRest);
        }
      }
    };
  }
});

// node_modules/chevrotain/lib/src/parse/grammar/lookahead.js
function getProdType(prod) {
  if (prod instanceof Option || prod === "Option") {
    return PROD_TYPE.OPTION;
  } else if (prod instanceof Repetition || prod === "Repetition") {
    return PROD_TYPE.REPETITION;
  } else if (prod instanceof RepetitionMandatory || prod === "RepetitionMandatory") {
    return PROD_TYPE.REPETITION_MANDATORY;
  } else if (prod instanceof RepetitionMandatoryWithSeparator || prod === "RepetitionMandatoryWithSeparator") {
    return PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR;
  } else if (prod instanceof RepetitionWithSeparator || prod === "RepetitionWithSeparator") {
    return PROD_TYPE.REPETITION_WITH_SEPARATOR;
  } else if (prod instanceof Alternation || prod === "Alternation") {
    return PROD_TYPE.ALTERNATION;
  } else {
    throw Error("non exhaustive match");
  }
}
function buildLookaheadFuncForOr(occurrence, ruleGrammar, maxLookahead, hasPredicates, dynamicTokensEnabled, laFuncBuilder) {
  const lookAheadPaths = getLookaheadPathsForOr(occurrence, ruleGrammar, maxLookahead);
  const tokenMatcher2 = areTokenCategoriesNotUsed(lookAheadPaths) ? tokenStructuredMatcherNoCategories : tokenStructuredMatcher;
  return laFuncBuilder(lookAheadPaths, hasPredicates, tokenMatcher2, dynamicTokensEnabled);
}
function buildLookaheadFuncForOptionalProd(occurrence, ruleGrammar, k, dynamicTokensEnabled, prodType, lookaheadBuilder) {
  const lookAheadPaths = getLookaheadPathsForOptionalProd(occurrence, ruleGrammar, prodType, k);
  const tokenMatcher2 = areTokenCategoriesNotUsed(lookAheadPaths) ? tokenStructuredMatcherNoCategories : tokenStructuredMatcher;
  return lookaheadBuilder(lookAheadPaths[0], tokenMatcher2, dynamicTokensEnabled);
}
function buildAlternativesLookAheadFunc(alts, hasPredicates, tokenMatcher2, dynamicTokensEnabled) {
  const numOfAlts = alts.length;
  const areAllOneTokenLookahead = every_default(alts, (currAlt) => {
    return every_default(currAlt, (currPath) => {
      return currPath.length === 1;
    });
  });
  if (hasPredicates) {
    return function(orAlts) {
      const predicates = map_default(orAlts, (currAlt) => currAlt.GATE);
      for (let t = 0; t < numOfAlts; t++) {
        const currAlt = alts[t];
        const currNumOfPaths = currAlt.length;
        const currPredicate = predicates[t];
        if (currPredicate !== void 0 && currPredicate.call(this) === false) {
          continue;
        }
        nextPath: for (let j = 0; j < currNumOfPaths; j++) {
          const currPath = currAlt[j];
          const currPathLength = currPath.length;
          for (let i = 0; i < currPathLength; i++) {
            const nextToken = this.LA(i + 1);
            if (tokenMatcher2(nextToken, currPath[i]) === false) {
              continue nextPath;
            }
          }
          return t;
        }
      }
      return void 0;
    };
  } else if (areAllOneTokenLookahead && !dynamicTokensEnabled) {
    const singleTokenAlts = map_default(alts, (currAlt) => {
      return flatten_default(currAlt);
    });
    const choiceToAlt = reduce_default(singleTokenAlts, (result, currAlt, idx) => {
      forEach_default(currAlt, (currTokType) => {
        if (!has_default(result, currTokType.tokenTypeIdx)) {
          result[currTokType.tokenTypeIdx] = idx;
        }
        forEach_default(currTokType.categoryMatches, (currExtendingType) => {
          if (!has_default(result, currExtendingType)) {
            result[currExtendingType] = idx;
          }
        });
      });
      return result;
    }, {});
    return function() {
      const nextToken = this.LA(1);
      return choiceToAlt[nextToken.tokenTypeIdx];
    };
  } else {
    return function() {
      for (let t = 0; t < numOfAlts; t++) {
        const currAlt = alts[t];
        const currNumOfPaths = currAlt.length;
        nextPath: for (let j = 0; j < currNumOfPaths; j++) {
          const currPath = currAlt[j];
          const currPathLength = currPath.length;
          for (let i = 0; i < currPathLength; i++) {
            const nextToken = this.LA(i + 1);
            if (tokenMatcher2(nextToken, currPath[i]) === false) {
              continue nextPath;
            }
          }
          return t;
        }
      }
      return void 0;
    };
  }
}
function buildSingleAlternativeLookaheadFunction(alt, tokenMatcher2, dynamicTokensEnabled) {
  const areAllOneTokenLookahead = every_default(alt, (currPath) => {
    return currPath.length === 1;
  });
  const numOfPaths = alt.length;
  if (areAllOneTokenLookahead && !dynamicTokensEnabled) {
    const singleTokensTypes = flatten_default(alt);
    if (singleTokensTypes.length === 1 && isEmpty_default(singleTokensTypes[0].categoryMatches)) {
      const expectedTokenType = singleTokensTypes[0];
      const expectedTokenUniqueKey = expectedTokenType.tokenTypeIdx;
      return function() {
        return this.LA(1).tokenTypeIdx === expectedTokenUniqueKey;
      };
    } else {
      const choiceToAlt = reduce_default(singleTokensTypes, (result, currTokType, idx) => {
        result[currTokType.tokenTypeIdx] = true;
        forEach_default(currTokType.categoryMatches, (currExtendingType) => {
          result[currExtendingType] = true;
        });
        return result;
      }, []);
      return function() {
        const nextToken = this.LA(1);
        return choiceToAlt[nextToken.tokenTypeIdx] === true;
      };
    }
  } else {
    return function() {
      nextPath: for (let j = 0; j < numOfPaths; j++) {
        const currPath = alt[j];
        const currPathLength = currPath.length;
        for (let i = 0; i < currPathLength; i++) {
          const nextToken = this.LA(i + 1);
          if (tokenMatcher2(nextToken, currPath[i]) === false) {
            continue nextPath;
          }
        }
        return true;
      }
      return false;
    };
  }
}
function initializeArrayOfArrays(size) {
  const result = new Array(size);
  for (let i = 0; i < size; i++) {
    result[i] = [];
  }
  return result;
}
function pathToHashKeys(path3) {
  let keys2 = [""];
  for (let i = 0; i < path3.length; i++) {
    const tokType = path3[i];
    const longerKeys = [];
    for (let j = 0; j < keys2.length; j++) {
      const currShorterKey = keys2[j];
      longerKeys.push(currShorterKey + "_" + tokType.tokenTypeIdx);
      for (let t = 0; t < tokType.categoryMatches.length; t++) {
        const categoriesKeySuffix = "_" + tokType.categoryMatches[t];
        longerKeys.push(currShorterKey + categoriesKeySuffix);
      }
    }
    keys2 = longerKeys;
  }
  return keys2;
}
function isUniquePrefixHash(altKnownPathsKeys, searchPathKeys, idx) {
  for (let currAltIdx = 0; currAltIdx < altKnownPathsKeys.length; currAltIdx++) {
    if (currAltIdx === idx) {
      continue;
    }
    const otherAltKnownPathsKeys = altKnownPathsKeys[currAltIdx];
    for (let searchIdx = 0; searchIdx < searchPathKeys.length; searchIdx++) {
      const searchKey = searchPathKeys[searchIdx];
      if (otherAltKnownPathsKeys[searchKey] === true) {
        return false;
      }
    }
  }
  return true;
}
function lookAheadSequenceFromAlternatives(altsDefs, k) {
  const partialAlts = map_default(altsDefs, (currAlt) => possiblePathsFrom([currAlt], 1));
  const finalResult = initializeArrayOfArrays(partialAlts.length);
  const altsHashes = map_default(partialAlts, (currAltPaths) => {
    const dict = {};
    forEach_default(currAltPaths, (item) => {
      const keys2 = pathToHashKeys(item.partialPath);
      forEach_default(keys2, (currKey) => {
        dict[currKey] = true;
      });
    });
    return dict;
  });
  let newData = partialAlts;
  for (let pathLength = 1; pathLength <= k; pathLength++) {
    const currDataset = newData;
    newData = initializeArrayOfArrays(currDataset.length);
    for (let altIdx = 0; altIdx < currDataset.length; altIdx++) {
      const currAltPathsAndSuffixes = currDataset[altIdx];
      for (let currPathIdx = 0; currPathIdx < currAltPathsAndSuffixes.length; currPathIdx++) {
        const currPathPrefix = currAltPathsAndSuffixes[currPathIdx].partialPath;
        const suffixDef = currAltPathsAndSuffixes[currPathIdx].suffixDef;
        const prefixKeys = pathToHashKeys(currPathPrefix);
        const isUnique = isUniquePrefixHash(altsHashes, prefixKeys, altIdx);
        if (isUnique || isEmpty_default(suffixDef) || currPathPrefix.length === k) {
          const currAltResult = finalResult[altIdx];
          if (containsPath(currAltResult, currPathPrefix) === false) {
            currAltResult.push(currPathPrefix);
            for (let j = 0; j < prefixKeys.length; j++) {
              const currKey = prefixKeys[j];
              altsHashes[altIdx][currKey] = true;
            }
          }
        } else {
          const newPartialPathsAndSuffixes = possiblePathsFrom(suffixDef, pathLength + 1, currPathPrefix);
          newData[altIdx] = newData[altIdx].concat(newPartialPathsAndSuffixes);
          forEach_default(newPartialPathsAndSuffixes, (item) => {
            const prefixKeys2 = pathToHashKeys(item.partialPath);
            forEach_default(prefixKeys2, (key) => {
              altsHashes[altIdx][key] = true;
            });
          });
        }
      }
    }
  }
  return finalResult;
}
function getLookaheadPathsForOr(occurrence, ruleGrammar, k, orProd) {
  const visitor = new InsideDefinitionFinderVisitor(occurrence, PROD_TYPE.ALTERNATION, orProd);
  ruleGrammar.accept(visitor);
  return lookAheadSequenceFromAlternatives(visitor.result, k);
}
function getLookaheadPathsForOptionalProd(occurrence, ruleGrammar, prodType, k) {
  const insideDefVisitor = new InsideDefinitionFinderVisitor(occurrence, prodType);
  ruleGrammar.accept(insideDefVisitor);
  const insideDef = insideDefVisitor.result;
  const afterDefWalker = new RestDefinitionFinderWalker(ruleGrammar, occurrence, prodType);
  const afterDef = afterDefWalker.startWalking();
  const insideFlat = new Alternative({ definition: insideDef });
  const afterFlat = new Alternative({ definition: afterDef });
  return lookAheadSequenceFromAlternatives([insideFlat, afterFlat], k);
}
function containsPath(alternative, searchPath) {
  compareOtherPath: for (let i = 0; i < alternative.length; i++) {
    const otherPath = alternative[i];
    if (otherPath.length !== searchPath.length) {
      continue;
    }
    for (let j = 0; j < otherPath.length; j++) {
      const searchTok = searchPath[j];
      const otherTok = otherPath[j];
      const matchingTokens = searchTok === otherTok || otherTok.categoryMatchesMap[searchTok.tokenTypeIdx] !== void 0;
      if (matchingTokens === false) {
        continue compareOtherPath;
      }
    }
    return true;
  }
  return false;
}
function isStrictPrefixOfPath(prefix, other) {
  return prefix.length < other.length && every_default(prefix, (tokType, idx) => {
    const otherTokType = other[idx];
    return tokType === otherTokType || otherTokType.categoryMatchesMap[tokType.tokenTypeIdx];
  });
}
function areTokenCategoriesNotUsed(lookAheadPaths) {
  return every_default(lookAheadPaths, (singleAltPaths) => every_default(singleAltPaths, (singlePath) => every_default(singlePath, (token) => isEmpty_default(token.categoryMatches))));
}
var PROD_TYPE, RestDefinitionFinderWalker, InsideDefinitionFinderVisitor;
var init_lookahead = __esm({
  "node_modules/chevrotain/lib/src/parse/grammar/lookahead.js"() {
    init_lodash();
    init_interpreter();
    init_rest();
    init_tokens();
    init_api2();
    (function(PROD_TYPE2) {
      PROD_TYPE2[PROD_TYPE2["OPTION"] = 0] = "OPTION";
      PROD_TYPE2[PROD_TYPE2["REPETITION"] = 1] = "REPETITION";
      PROD_TYPE2[PROD_TYPE2["REPETITION_MANDATORY"] = 2] = "REPETITION_MANDATORY";
      PROD_TYPE2[PROD_TYPE2["REPETITION_MANDATORY_WITH_SEPARATOR"] = 3] = "REPETITION_MANDATORY_WITH_SEPARATOR";
      PROD_TYPE2[PROD_TYPE2["REPETITION_WITH_SEPARATOR"] = 4] = "REPETITION_WITH_SEPARATOR";
      PROD_TYPE2[PROD_TYPE2["ALTERNATION"] = 5] = "ALTERNATION";
    })(PROD_TYPE || (PROD_TYPE = {}));
    RestDefinitionFinderWalker = class extends RestWalker {
      constructor(topProd, targetOccurrence, targetProdType) {
        super();
        this.topProd = topProd;
        this.targetOccurrence = targetOccurrence;
        this.targetProdType = targetProdType;
      }
      startWalking() {
        this.walk(this.topProd);
        return this.restDef;
      }
      checkIsTarget(node, expectedProdType, currRest, prevRest) {
        if (node.idx === this.targetOccurrence && this.targetProdType === expectedProdType) {
          this.restDef = currRest.concat(prevRest);
          return true;
        }
        return false;
      }
      walkOption(optionProd, currRest, prevRest) {
        if (!this.checkIsTarget(optionProd, PROD_TYPE.OPTION, currRest, prevRest)) {
          super.walkOption(optionProd, currRest, prevRest);
        }
      }
      walkAtLeastOne(atLeastOneProd, currRest, prevRest) {
        if (!this.checkIsTarget(atLeastOneProd, PROD_TYPE.REPETITION_MANDATORY, currRest, prevRest)) {
          super.walkOption(atLeastOneProd, currRest, prevRest);
        }
      }
      walkAtLeastOneSep(atLeastOneSepProd, currRest, prevRest) {
        if (!this.checkIsTarget(atLeastOneSepProd, PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR, currRest, prevRest)) {
          super.walkOption(atLeastOneSepProd, currRest, prevRest);
        }
      }
      walkMany(manyProd, currRest, prevRest) {
        if (!this.checkIsTarget(manyProd, PROD_TYPE.REPETITION, currRest, prevRest)) {
          super.walkOption(manyProd, currRest, prevRest);
        }
      }
      walkManySep(manySepProd, currRest, prevRest) {
        if (!this.checkIsTarget(manySepProd, PROD_TYPE.REPETITION_WITH_SEPARATOR, currRest, prevRest)) {
          super.walkOption(manySepProd, currRest, prevRest);
        }
      }
    };
    InsideDefinitionFinderVisitor = class extends GAstVisitor {
      constructor(targetOccurrence, targetProdType, targetRef) {
        super();
        this.targetOccurrence = targetOccurrence;
        this.targetProdType = targetProdType;
        this.targetRef = targetRef;
        this.result = [];
      }
      checkIsTarget(node, expectedProdName) {
        if (node.idx === this.targetOccurrence && this.targetProdType === expectedProdName && (this.targetRef === void 0 || node === this.targetRef)) {
          this.result = node.definition;
        }
      }
      visitOption(node) {
        this.checkIsTarget(node, PROD_TYPE.OPTION);
      }
      visitRepetition(node) {
        this.checkIsTarget(node, PROD_TYPE.REPETITION);
      }
      visitRepetitionMandatory(node) {
        this.checkIsTarget(node, PROD_TYPE.REPETITION_MANDATORY);
      }
      visitRepetitionMandatoryWithSeparator(node) {
        this.checkIsTarget(node, PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR);
      }
      visitRepetitionWithSeparator(node) {
        this.checkIsTarget(node, PROD_TYPE.REPETITION_WITH_SEPARATOR);
      }
      visitAlternation(node) {
        this.checkIsTarget(node, PROD_TYPE.ALTERNATION);
      }
    };
  }
});

// node_modules/chevrotain/lib/src/parse/grammar/checks.js
function validateLookahead(options) {
  const lookaheadValidationErrorMessages = options.lookaheadStrategy.validate({
    rules: options.rules,
    tokenTypes: options.tokenTypes,
    grammarName: options.grammarName
  });
  return map_default(lookaheadValidationErrorMessages, (errorMessage) => Object.assign({ type: ParserDefinitionErrorType.CUSTOM_LOOKAHEAD_VALIDATION }, errorMessage));
}
function validateGrammar(topLevels, tokenTypes, errMsgProvider, grammarName) {
  const duplicateErrors = flatMap_default(topLevels, (currTopLevel) => validateDuplicateProductions(currTopLevel, errMsgProvider));
  const termsNamespaceConflictErrors = checkTerminalAndNoneTerminalsNameSpace(topLevels, tokenTypes, errMsgProvider);
  const tooManyAltsErrors = flatMap_default(topLevels, (curRule) => validateTooManyAlts(curRule, errMsgProvider));
  const duplicateRulesError = flatMap_default(topLevels, (curRule) => validateRuleDoesNotAlreadyExist(curRule, topLevels, grammarName, errMsgProvider));
  return duplicateErrors.concat(termsNamespaceConflictErrors, tooManyAltsErrors, duplicateRulesError);
}
function validateDuplicateProductions(topLevelRule, errMsgProvider) {
  const collectorVisitor2 = new OccurrenceValidationCollector();
  topLevelRule.accept(collectorVisitor2);
  const allRuleProductions = collectorVisitor2.allProductions;
  const productionGroups = groupBy_default(allRuleProductions, identifyProductionForDuplicates);
  const duplicates = pickBy_default(productionGroups, (currGroup) => {
    return currGroup.length > 1;
  });
  const errors = map_default(values_default(duplicates), (currDuplicates) => {
    const firstProd = head_default(currDuplicates);
    const msg = errMsgProvider.buildDuplicateFoundError(topLevelRule, currDuplicates);
    const dslName = getProductionDslName(firstProd);
    const defError = {
      message: msg,
      type: ParserDefinitionErrorType.DUPLICATE_PRODUCTIONS,
      ruleName: topLevelRule.name,
      dslName,
      occurrence: firstProd.idx
    };
    const param = getExtraProductionArgument(firstProd);
    if (param) {
      defError.parameter = param;
    }
    return defError;
  });
  return errors;
}
function identifyProductionForDuplicates(prod) {
  return `${getProductionDslName(prod)}_#_${prod.idx}_#_${getExtraProductionArgument(prod)}`;
}
function getExtraProductionArgument(prod) {
  if (prod instanceof Terminal) {
    return prod.terminalType.name;
  } else if (prod instanceof NonTerminal) {
    return prod.nonTerminalName;
  } else {
    return "";
  }
}
function validateRuleDoesNotAlreadyExist(rule, allRules, className, errMsgProvider) {
  const errors = [];
  const occurrences = reduce_default(allRules, (result, curRule) => {
    if (curRule.name === rule.name) {
      return result + 1;
    }
    return result;
  }, 0);
  if (occurrences > 1) {
    const errMsg = errMsgProvider.buildDuplicateRuleNameError({
      topLevelRule: rule,
      grammarName: className
    });
    errors.push({
      message: errMsg,
      type: ParserDefinitionErrorType.DUPLICATE_RULE_NAME,
      ruleName: rule.name
    });
  }
  return errors;
}
function validateRuleIsOverridden(ruleName, definedRulesNames, className) {
  const errors = [];
  let errMsg;
  if (!includes_default(definedRulesNames, ruleName)) {
    errMsg = `Invalid rule override, rule: ->${ruleName}<- cannot be overridden in the grammar: ->${className}<-as it is not defined in any of the super grammars `;
    errors.push({
      message: errMsg,
      type: ParserDefinitionErrorType.INVALID_RULE_OVERRIDE,
      ruleName
    });
  }
  return errors;
}
function validateNoLeftRecursion(topRule, currRule, errMsgProvider, path3 = []) {
  const errors = [];
  const nextNonTerminals = getFirstNoneTerminal(currRule.definition);
  if (isEmpty_default(nextNonTerminals)) {
    return [];
  } else {
    const ruleName = topRule.name;
    const foundLeftRecursion = includes_default(nextNonTerminals, topRule);
    if (foundLeftRecursion) {
      errors.push({
        message: errMsgProvider.buildLeftRecursionError({
          topLevelRule: topRule,
          leftRecursionPath: path3
        }),
        type: ParserDefinitionErrorType.LEFT_RECURSION,
        ruleName
      });
    }
    const validNextSteps = difference_default(nextNonTerminals, path3.concat([topRule]));
    const errorsFromNextSteps = flatMap_default(validNextSteps, (currRefRule) => {
      const newPath = clone_default(path3);
      newPath.push(currRefRule);
      return validateNoLeftRecursion(topRule, currRefRule, errMsgProvider, newPath);
    });
    return errors.concat(errorsFromNextSteps);
  }
}
function getFirstNoneTerminal(definition) {
  let result = [];
  if (isEmpty_default(definition)) {
    return result;
  }
  const firstProd = head_default(definition);
  if (firstProd instanceof NonTerminal) {
    result.push(firstProd.referencedRule);
  } else if (firstProd instanceof Alternative || firstProd instanceof Option || firstProd instanceof RepetitionMandatory || firstProd instanceof RepetitionMandatoryWithSeparator || firstProd instanceof RepetitionWithSeparator || firstProd instanceof Repetition) {
    result = result.concat(getFirstNoneTerminal(firstProd.definition));
  } else if (firstProd instanceof Alternation) {
    result = flatten_default(map_default(firstProd.definition, (currSubDef) => getFirstNoneTerminal(currSubDef.definition)));
  } else if (firstProd instanceof Terminal) {
  } else {
    throw Error("non exhaustive match");
  }
  const isFirstOptional = isOptionalProd(firstProd);
  const hasMore = definition.length > 1;
  if (isFirstOptional && hasMore) {
    const rest = drop_default(definition);
    return result.concat(getFirstNoneTerminal(rest));
  } else {
    return result;
  }
}
function validateEmptyOrAlternative(topLevelRule, errMsgProvider) {
  const orCollector = new OrCollector();
  topLevelRule.accept(orCollector);
  const ors = orCollector.alternations;
  const errors = flatMap_default(ors, (currOr) => {
    const exceptLast = dropRight_default(currOr.definition);
    return flatMap_default(exceptLast, (currAlternative, currAltIdx) => {
      const possibleFirstInAlt = nextPossibleTokensAfter([currAlternative], [], tokenStructuredMatcher, 1);
      if (isEmpty_default(possibleFirstInAlt)) {
        return [
          {
            message: errMsgProvider.buildEmptyAlternationError({
              topLevelRule,
              alternation: currOr,
              emptyChoiceIdx: currAltIdx
            }),
            type: ParserDefinitionErrorType.NONE_LAST_EMPTY_ALT,
            ruleName: topLevelRule.name,
            occurrence: currOr.idx,
            alternative: currAltIdx + 1
          }
        ];
      } else {
        return [];
      }
    });
  });
  return errors;
}
function validateAmbiguousAlternationAlternatives(topLevelRule, globalMaxLookahead, errMsgProvider) {
  const orCollector = new OrCollector();
  topLevelRule.accept(orCollector);
  let ors = orCollector.alternations;
  ors = reject_default(ors, (currOr) => currOr.ignoreAmbiguities === true);
  const errors = flatMap_default(ors, (currOr) => {
    const currOccurrence = currOr.idx;
    const actualMaxLookahead = currOr.maxLookahead || globalMaxLookahead;
    const alternatives = getLookaheadPathsForOr(currOccurrence, topLevelRule, actualMaxLookahead, currOr);
    const altsAmbiguityErrors = checkAlternativesAmbiguities(alternatives, currOr, topLevelRule, errMsgProvider);
    const altsPrefixAmbiguityErrors = checkPrefixAlternativesAmbiguities(alternatives, currOr, topLevelRule, errMsgProvider);
    return altsAmbiguityErrors.concat(altsPrefixAmbiguityErrors);
  });
  return errors;
}
function validateTooManyAlts(topLevelRule, errMsgProvider) {
  const orCollector = new OrCollector();
  topLevelRule.accept(orCollector);
  const ors = orCollector.alternations;
  const errors = flatMap_default(ors, (currOr) => {
    if (currOr.definition.length > 255) {
      return [
        {
          message: errMsgProvider.buildTooManyAlternativesError({
            topLevelRule,
            alternation: currOr
          }),
          type: ParserDefinitionErrorType.TOO_MANY_ALTS,
          ruleName: topLevelRule.name,
          occurrence: currOr.idx
        }
      ];
    } else {
      return [];
    }
  });
  return errors;
}
function validateSomeNonEmptyLookaheadPath(topLevelRules, maxLookahead, errMsgProvider) {
  const errors = [];
  forEach_default(topLevelRules, (currTopRule) => {
    const collectorVisitor2 = new RepetitionCollector();
    currTopRule.accept(collectorVisitor2);
    const allRuleProductions = collectorVisitor2.allProductions;
    forEach_default(allRuleProductions, (currProd) => {
      const prodType = getProdType(currProd);
      const actualMaxLookahead = currProd.maxLookahead || maxLookahead;
      const currOccurrence = currProd.idx;
      const paths = getLookaheadPathsForOptionalProd(currOccurrence, currTopRule, prodType, actualMaxLookahead);
      const pathsInsideProduction = paths[0];
      if (isEmpty_default(flatten_default(pathsInsideProduction))) {
        const errMsg = errMsgProvider.buildEmptyRepetitionError({
          topLevelRule: currTopRule,
          repetition: currProd
        });
        errors.push({
          message: errMsg,
          type: ParserDefinitionErrorType.NO_NON_EMPTY_LOOKAHEAD,
          ruleName: currTopRule.name
        });
      }
    });
  });
  return errors;
}
function checkAlternativesAmbiguities(alternatives, alternation, rule, errMsgProvider) {
  const foundAmbiguousPaths = [];
  const identicalAmbiguities = reduce_default(alternatives, (result, currAlt, currAltIdx) => {
    if (alternation.definition[currAltIdx].ignoreAmbiguities === true) {
      return result;
    }
    forEach_default(currAlt, (currPath) => {
      const altsCurrPathAppearsIn = [currAltIdx];
      forEach_default(alternatives, (currOtherAlt, currOtherAltIdx) => {
        if (currAltIdx !== currOtherAltIdx && containsPath(currOtherAlt, currPath) && // ignore (skip) ambiguities with this "other" alternative
        alternation.definition[currOtherAltIdx].ignoreAmbiguities !== true) {
          altsCurrPathAppearsIn.push(currOtherAltIdx);
        }
      });
      if (altsCurrPathAppearsIn.length > 1 && !containsPath(foundAmbiguousPaths, currPath)) {
        foundAmbiguousPaths.push(currPath);
        result.push({
          alts: altsCurrPathAppearsIn,
          path: currPath
        });
      }
    });
    return result;
  }, []);
  const currErrors = map_default(identicalAmbiguities, (currAmbDescriptor) => {
    const ambgIndices = map_default(currAmbDescriptor.alts, (currAltIdx) => currAltIdx + 1);
    const currMessage = errMsgProvider.buildAlternationAmbiguityError({
      topLevelRule: rule,
      alternation,
      ambiguityIndices: ambgIndices,
      prefixPath: currAmbDescriptor.path
    });
    return {
      message: currMessage,
      type: ParserDefinitionErrorType.AMBIGUOUS_ALTS,
      ruleName: rule.name,
      occurrence: alternation.idx,
      alternatives: currAmbDescriptor.alts
    };
  });
  return currErrors;
}
function checkPrefixAlternativesAmbiguities(alternatives, alternation, rule, errMsgProvider) {
  const pathsAndIndices = reduce_default(alternatives, (result, currAlt, idx) => {
    const currPathsAndIdx = map_default(currAlt, (currPath) => {
      return { idx, path: currPath };
    });
    return result.concat(currPathsAndIdx);
  }, []);
  const errors = compact_default(flatMap_default(pathsAndIndices, (currPathAndIdx) => {
    const alternativeGast = alternation.definition[currPathAndIdx.idx];
    if (alternativeGast.ignoreAmbiguities === true) {
      return [];
    }
    const targetIdx = currPathAndIdx.idx;
    const targetPath = currPathAndIdx.path;
    const prefixAmbiguitiesPathsAndIndices = filter_default(pathsAndIndices, (searchPathAndIdx) => {
      return (
        // ignore (skip) ambiguities with this "other" alternative
        alternation.definition[searchPathAndIdx.idx].ignoreAmbiguities !== true && searchPathAndIdx.idx < targetIdx && // checking for strict prefix because identical lookaheads
        // will be be detected using a different validation.
        isStrictPrefixOfPath(searchPathAndIdx.path, targetPath)
      );
    });
    const currPathPrefixErrors = map_default(prefixAmbiguitiesPathsAndIndices, (currAmbPathAndIdx) => {
      const ambgIndices = [currAmbPathAndIdx.idx + 1, targetIdx + 1];
      const occurrence = alternation.idx === 0 ? "" : alternation.idx;
      const message = errMsgProvider.buildAlternationPrefixAmbiguityError({
        topLevelRule: rule,
        alternation,
        ambiguityIndices: ambgIndices,
        prefixPath: currAmbPathAndIdx.path
      });
      return {
        message,
        type: ParserDefinitionErrorType.AMBIGUOUS_PREFIX_ALTS,
        ruleName: rule.name,
        occurrence,
        alternatives: ambgIndices
      };
    });
    return currPathPrefixErrors;
  }));
  return errors;
}
function checkTerminalAndNoneTerminalsNameSpace(topLevels, tokenTypes, errMsgProvider) {
  const errors = [];
  const tokenNames = map_default(tokenTypes, (currToken) => currToken.name);
  forEach_default(topLevels, (currRule) => {
    const currRuleName = currRule.name;
    if (includes_default(tokenNames, currRuleName)) {
      const errMsg = errMsgProvider.buildNamespaceConflictError(currRule);
      errors.push({
        message: errMsg,
        type: ParserDefinitionErrorType.CONFLICT_TOKENS_RULES_NAMESPACE,
        ruleName: currRuleName
      });
    }
  });
  return errors;
}
var OccurrenceValidationCollector, OrCollector, RepetitionCollector;
var init_checks = __esm({
  "node_modules/chevrotain/lib/src/parse/grammar/checks.js"() {
    init_lodash();
    init_parser();
    init_api2();
    init_lookahead();
    init_interpreter();
    init_tokens();
    OccurrenceValidationCollector = class extends GAstVisitor {
      constructor() {
        super(...arguments);
        this.allProductions = [];
      }
      visitNonTerminal(subrule) {
        this.allProductions.push(subrule);
      }
      visitOption(option) {
        this.allProductions.push(option);
      }
      visitRepetitionWithSeparator(manySep) {
        this.allProductions.push(manySep);
      }
      visitRepetitionMandatory(atLeastOne) {
        this.allProductions.push(atLeastOne);
      }
      visitRepetitionMandatoryWithSeparator(atLeastOneSep) {
        this.allProductions.push(atLeastOneSep);
      }
      visitRepetition(many) {
        this.allProductions.push(many);
      }
      visitAlternation(or) {
        this.allProductions.push(or);
      }
      visitTerminal(terminal) {
        this.allProductions.push(terminal);
      }
    };
    OrCollector = class extends GAstVisitor {
      constructor() {
        super(...arguments);
        this.alternations = [];
      }
      visitAlternation(node) {
        this.alternations.push(node);
      }
    };
    RepetitionCollector = class extends GAstVisitor {
      constructor() {
        super(...arguments);
        this.allProductions = [];
      }
      visitRepetitionWithSeparator(manySep) {
        this.allProductions.push(manySep);
      }
      visitRepetitionMandatory(atLeastOne) {
        this.allProductions.push(atLeastOne);
      }
      visitRepetitionMandatoryWithSeparator(atLeastOneSep) {
        this.allProductions.push(atLeastOneSep);
      }
      visitRepetition(many) {
        this.allProductions.push(many);
      }
    };
  }
});

// node_modules/chevrotain/lib/src/parse/grammar/gast/gast_resolver_public.js
function resolveGrammar2(options) {
  const actualOptions = defaults_default(options, {
    errMsgProvider: defaultGrammarResolverErrorProvider
  });
  const topRulesTable = {};
  forEach_default(options.rules, (rule) => {
    topRulesTable[rule.name] = rule;
  });
  return resolveGrammar(topRulesTable, actualOptions.errMsgProvider);
}
function validateGrammar2(options) {
  options = defaults_default(options, {
    errMsgProvider: defaultGrammarValidatorErrorProvider
  });
  return validateGrammar(options.rules, options.tokenTypes, options.errMsgProvider, options.grammarName);
}
var init_gast_resolver_public = __esm({
  "node_modules/chevrotain/lib/src/parse/grammar/gast/gast_resolver_public.js"() {
    init_lodash();
    init_resolver();
    init_checks();
    init_errors_public();
  }
});

// node_modules/chevrotain/lib/src/parse/exceptions_public.js
function isRecognitionException(error) {
  return includes_default(RECOGNITION_EXCEPTION_NAMES, error.name);
}
var MISMATCHED_TOKEN_EXCEPTION, NO_VIABLE_ALT_EXCEPTION, EARLY_EXIT_EXCEPTION, NOT_ALL_INPUT_PARSED_EXCEPTION, RECOGNITION_EXCEPTION_NAMES, RecognitionException, MismatchedTokenException, NoViableAltException, NotAllInputParsedException, EarlyExitException;
var init_exceptions_public = __esm({
  "node_modules/chevrotain/lib/src/parse/exceptions_public.js"() {
    init_lodash();
    MISMATCHED_TOKEN_EXCEPTION = "MismatchedTokenException";
    NO_VIABLE_ALT_EXCEPTION = "NoViableAltException";
    EARLY_EXIT_EXCEPTION = "EarlyExitException";
    NOT_ALL_INPUT_PARSED_EXCEPTION = "NotAllInputParsedException";
    RECOGNITION_EXCEPTION_NAMES = [
      MISMATCHED_TOKEN_EXCEPTION,
      NO_VIABLE_ALT_EXCEPTION,
      EARLY_EXIT_EXCEPTION,
      NOT_ALL_INPUT_PARSED_EXCEPTION
    ];
    Object.freeze(RECOGNITION_EXCEPTION_NAMES);
    RecognitionException = class extends Error {
      constructor(message, token) {
        super(message);
        this.token = token;
        this.resyncedTokens = [];
        Object.setPrototypeOf(this, new.target.prototype);
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        }
      }
    };
    MismatchedTokenException = class extends RecognitionException {
      constructor(message, token, previousToken) {
        super(message, token);
        this.previousToken = previousToken;
        this.name = MISMATCHED_TOKEN_EXCEPTION;
      }
    };
    NoViableAltException = class extends RecognitionException {
      constructor(message, token, previousToken) {
        super(message, token);
        this.previousToken = previousToken;
        this.name = NO_VIABLE_ALT_EXCEPTION;
      }
    };
    NotAllInputParsedException = class extends RecognitionException {
      constructor(message, token) {
        super(message, token);
        this.name = NOT_ALL_INPUT_PARSED_EXCEPTION;
      }
    };
    EarlyExitException = class extends RecognitionException {
      constructor(message, token, previousToken) {
        super(message, token);
        this.previousToken = previousToken;
        this.name = EARLY_EXIT_EXCEPTION;
      }
    };
  }
});

// node_modules/chevrotain/lib/src/parse/parser/traits/recoverable.js
function attemptInRepetitionRecovery(prodFunc, args, lookaheadFunc, dslMethodIdx, prodOccurrence, nextToksWalker, notStuck) {
  const key = this.getKeyForAutomaticLookahead(dslMethodIdx, prodOccurrence);
  let firstAfterRepInfo = this.firstAfterRepMap[key];
  if (firstAfterRepInfo === void 0) {
    const currRuleName = this.getCurrRuleFullName();
    const ruleGrammar = this.getGAstProductions()[currRuleName];
    const walker = new nextToksWalker(ruleGrammar, prodOccurrence);
    firstAfterRepInfo = walker.startWalking();
    this.firstAfterRepMap[key] = firstAfterRepInfo;
  }
  let expectTokAfterLastMatch = firstAfterRepInfo.token;
  let nextTokIdx = firstAfterRepInfo.occurrence;
  const isEndOfRule = firstAfterRepInfo.isEndOfRule;
  if (this.RULE_STACK.length === 1 && isEndOfRule && expectTokAfterLastMatch === void 0) {
    expectTokAfterLastMatch = EOF;
    nextTokIdx = 1;
  }
  if (expectTokAfterLastMatch === void 0 || nextTokIdx === void 0) {
    return;
  }
  if (this.shouldInRepetitionRecoveryBeTried(expectTokAfterLastMatch, nextTokIdx, notStuck)) {
    this.tryInRepetitionRecovery(prodFunc, args, lookaheadFunc, expectTokAfterLastMatch);
  }
}
var EOF_FOLLOW_KEY, IN_RULE_RECOVERY_EXCEPTION, InRuleRecoveryException, Recoverable;
var init_recoverable = __esm({
  "node_modules/chevrotain/lib/src/parse/parser/traits/recoverable.js"() {
    init_tokens_public();
    init_lodash();
    init_exceptions_public();
    init_constants();
    init_parser();
    EOF_FOLLOW_KEY = {};
    IN_RULE_RECOVERY_EXCEPTION = "InRuleRecoveryException";
    InRuleRecoveryException = class extends Error {
      constructor(message) {
        super(message);
        this.name = IN_RULE_RECOVERY_EXCEPTION;
      }
    };
    Recoverable = class {
      initRecoverable(config) {
        this.firstAfterRepMap = {};
        this.resyncFollows = {};
        this.recoveryEnabled = has_default(config, "recoveryEnabled") ? config.recoveryEnabled : DEFAULT_PARSER_CONFIG.recoveryEnabled;
        if (this.recoveryEnabled) {
          this.attemptInRepetitionRecovery = attemptInRepetitionRecovery;
        }
      }
      getTokenToInsert(tokType) {
        const tokToInsert = createTokenInstance(tokType, "", NaN, NaN, NaN, NaN, NaN, NaN);
        tokToInsert.isInsertedInRecovery = true;
        return tokToInsert;
      }
      canTokenTypeBeInsertedInRecovery(tokType) {
        return true;
      }
      canTokenTypeBeDeletedInRecovery(tokType) {
        return true;
      }
      tryInRepetitionRecovery(grammarRule, grammarRuleArgs, lookAheadFunc, expectedTokType) {
        const reSyncTokType = this.findReSyncTokenType();
        const savedLexerState = this.exportLexerState();
        const resyncedTokens = [];
        let passedResyncPoint = false;
        const nextTokenWithoutResync = this.LA(1);
        let currToken = this.LA(1);
        const generateErrorMessage = () => {
          const previousToken = this.LA(0);
          const msg = this.errorMessageProvider.buildMismatchTokenMessage({
            expected: expectedTokType,
            actual: nextTokenWithoutResync,
            previous: previousToken,
            ruleName: this.getCurrRuleFullName()
          });
          const error = new MismatchedTokenException(msg, nextTokenWithoutResync, this.LA(0));
          error.resyncedTokens = dropRight_default(resyncedTokens);
          this.SAVE_ERROR(error);
        };
        while (!passedResyncPoint) {
          if (this.tokenMatcher(currToken, expectedTokType)) {
            generateErrorMessage();
            return;
          } else if (lookAheadFunc.call(this)) {
            generateErrorMessage();
            grammarRule.apply(this, grammarRuleArgs);
            return;
          } else if (this.tokenMatcher(currToken, reSyncTokType)) {
            passedResyncPoint = true;
          } else {
            currToken = this.SKIP_TOKEN();
            this.addToResyncTokens(currToken, resyncedTokens);
          }
        }
        this.importLexerState(savedLexerState);
      }
      shouldInRepetitionRecoveryBeTried(expectTokAfterLastMatch, nextTokIdx, notStuck) {
        if (notStuck === false) {
          return false;
        }
        if (this.tokenMatcher(this.LA(1), expectTokAfterLastMatch)) {
          return false;
        }
        if (this.isBackTracking()) {
          return false;
        }
        if (this.canPerformInRuleRecovery(expectTokAfterLastMatch, this.getFollowsForInRuleRecovery(expectTokAfterLastMatch, nextTokIdx))) {
          return false;
        }
        return true;
      }
      // Error Recovery functionality
      getFollowsForInRuleRecovery(tokType, tokIdxInRule) {
        const grammarPath = this.getCurrentGrammarPath(tokType, tokIdxInRule);
        const follows = this.getNextPossibleTokenTypes(grammarPath);
        return follows;
      }
      tryInRuleRecovery(expectedTokType, follows) {
        if (this.canRecoverWithSingleTokenInsertion(expectedTokType, follows)) {
          const tokToInsert = this.getTokenToInsert(expectedTokType);
          return tokToInsert;
        }
        if (this.canRecoverWithSingleTokenDeletion(expectedTokType)) {
          const nextTok = this.SKIP_TOKEN();
          this.consumeToken();
          return nextTok;
        }
        throw new InRuleRecoveryException("sad sad panda");
      }
      canPerformInRuleRecovery(expectedToken, follows) {
        return this.canRecoverWithSingleTokenInsertion(expectedToken, follows) || this.canRecoverWithSingleTokenDeletion(expectedToken);
      }
      canRecoverWithSingleTokenInsertion(expectedTokType, follows) {
        if (!this.canTokenTypeBeInsertedInRecovery(expectedTokType)) {
          return false;
        }
        if (isEmpty_default(follows)) {
          return false;
        }
        const mismatchedTok = this.LA(1);
        const isMisMatchedTokInFollows = find_default(follows, (possibleFollowsTokType) => {
          return this.tokenMatcher(mismatchedTok, possibleFollowsTokType);
        }) !== void 0;
        return isMisMatchedTokInFollows;
      }
      canRecoverWithSingleTokenDeletion(expectedTokType) {
        if (!this.canTokenTypeBeDeletedInRecovery(expectedTokType)) {
          return false;
        }
        const isNextTokenWhatIsExpected = this.tokenMatcher(this.LA(2), expectedTokType);
        return isNextTokenWhatIsExpected;
      }
      isInCurrentRuleReSyncSet(tokenTypeIdx) {
        const followKey = this.getCurrFollowKey();
        const currentRuleReSyncSet = this.getFollowSetFromFollowKey(followKey);
        return includes_default(currentRuleReSyncSet, tokenTypeIdx);
      }
      findReSyncTokenType() {
        const allPossibleReSyncTokTypes = this.flattenFollowSet();
        let nextToken = this.LA(1);
        let k = 2;
        while (true) {
          const foundMatch = find_default(allPossibleReSyncTokTypes, (resyncTokType) => {
            const canMatch = tokenMatcher(nextToken, resyncTokType);
            return canMatch;
          });
          if (foundMatch !== void 0) {
            return foundMatch;
          }
          nextToken = this.LA(k);
          k++;
        }
      }
      getCurrFollowKey() {
        if (this.RULE_STACK.length === 1) {
          return EOF_FOLLOW_KEY;
        }
        const currRuleShortName = this.getLastExplicitRuleShortName();
        const currRuleIdx = this.getLastExplicitRuleOccurrenceIndex();
        const prevRuleShortName = this.getPreviousExplicitRuleShortName();
        return {
          ruleName: this.shortRuleNameToFullName(currRuleShortName),
          idxInCallingRule: currRuleIdx,
          inRule: this.shortRuleNameToFullName(prevRuleShortName)
        };
      }
      buildFullFollowKeyStack() {
        const explicitRuleStack = this.RULE_STACK;
        const explicitOccurrenceStack = this.RULE_OCCURRENCE_STACK;
        return map_default(explicitRuleStack, (ruleName, idx) => {
          if (idx === 0) {
            return EOF_FOLLOW_KEY;
          }
          return {
            ruleName: this.shortRuleNameToFullName(ruleName),
            idxInCallingRule: explicitOccurrenceStack[idx],
            inRule: this.shortRuleNameToFullName(explicitRuleStack[idx - 1])
          };
        });
      }
      flattenFollowSet() {
        const followStack = map_default(this.buildFullFollowKeyStack(), (currKey) => {
          return this.getFollowSetFromFollowKey(currKey);
        });
        return flatten_default(followStack);
      }
      getFollowSetFromFollowKey(followKey) {
        if (followKey === EOF_FOLLOW_KEY) {
          return [EOF];
        }
        const followName = followKey.ruleName + followKey.idxInCallingRule + IN + followKey.inRule;
        return this.resyncFollows[followName];
      }
      // It does not make any sense to include a virtual EOF token in the list of resynced tokens
      // as EOF does not really exist and thus does not contain any useful information (line/column numbers)
      addToResyncTokens(token, resyncTokens) {
        if (!this.tokenMatcher(token, EOF)) {
          resyncTokens.push(token);
        }
        return resyncTokens;
      }
      reSyncTo(tokType) {
        const resyncedTokens = [];
        let nextTok = this.LA(1);
        while (this.tokenMatcher(nextTok, tokType) === false) {
          nextTok = this.SKIP_TOKEN();
          this.addToResyncTokens(nextTok, resyncedTokens);
        }
        return dropRight_default(resyncedTokens);
      }
      attemptInRepetitionRecovery(prodFunc, args, lookaheadFunc, dslMethodIdx, prodOccurrence, nextToksWalker, notStuck) {
      }
      getCurrentGrammarPath(tokType, tokIdxInRule) {
        const pathRuleStack = this.getHumanReadableRuleStack();
        const pathOccurrenceStack = clone_default(this.RULE_OCCURRENCE_STACK);
        const grammarPath = {
          ruleStack: pathRuleStack,
          occurrenceStack: pathOccurrenceStack,
          lastTok: tokType,
          lastTokOccurrence: tokIdxInRule
        };
        return grammarPath;
      }
      getHumanReadableRuleStack() {
        return map_default(this.RULE_STACK, (currShortName) => this.shortRuleNameToFullName(currShortName));
      }
    };
  }
});

// node_modules/chevrotain/lib/src/parse/grammar/keys.js
function getKeyForAutomaticLookahead(ruleIdx, dslMethodIdx, occurrence) {
  return occurrence | dslMethodIdx | ruleIdx;
}
var BITS_FOR_METHOD_TYPE, BITS_FOR_OCCURRENCE_IDX, BITS_FOR_ALT_IDX, OR_IDX, OPTION_IDX, MANY_IDX, AT_LEAST_ONE_IDX, MANY_SEP_IDX, AT_LEAST_ONE_SEP_IDX, BITS_START_FOR_ALT_IDX;
var init_keys2 = __esm({
  "node_modules/chevrotain/lib/src/parse/grammar/keys.js"() {
    BITS_FOR_METHOD_TYPE = 4;
    BITS_FOR_OCCURRENCE_IDX = 8;
    BITS_FOR_ALT_IDX = 8;
    OR_IDX = 1 << BITS_FOR_OCCURRENCE_IDX;
    OPTION_IDX = 2 << BITS_FOR_OCCURRENCE_IDX;
    MANY_IDX = 3 << BITS_FOR_OCCURRENCE_IDX;
    AT_LEAST_ONE_IDX = 4 << BITS_FOR_OCCURRENCE_IDX;
    MANY_SEP_IDX = 5 << BITS_FOR_OCCURRENCE_IDX;
    AT_LEAST_ONE_SEP_IDX = 6 << BITS_FOR_OCCURRENCE_IDX;
    BITS_START_FOR_ALT_IDX = 32 - BITS_FOR_ALT_IDX;
  }
});

// node_modules/chevrotain/lib/src/parse/grammar/llk_lookahead.js
var LLkLookaheadStrategy;
var init_llk_lookahead = __esm({
  "node_modules/chevrotain/lib/src/parse/grammar/llk_lookahead.js"() {
    init_lodash();
    init_errors_public();
    init_parser();
    init_checks();
    init_lookahead();
    LLkLookaheadStrategy = class {
      constructor(options) {
        var _a2;
        this.maxLookahead = (_a2 = options === null || options === void 0 ? void 0 : options.maxLookahead) !== null && _a2 !== void 0 ? _a2 : DEFAULT_PARSER_CONFIG.maxLookahead;
      }
      validate(options) {
        const leftRecursionErrors = this.validateNoLeftRecursion(options.rules);
        if (isEmpty_default(leftRecursionErrors)) {
          const emptyAltErrors = this.validateEmptyOrAlternatives(options.rules);
          const ambiguousAltsErrors = this.validateAmbiguousAlternationAlternatives(options.rules, this.maxLookahead);
          const emptyRepetitionErrors = this.validateSomeNonEmptyLookaheadPath(options.rules, this.maxLookahead);
          const allErrors = [
            ...leftRecursionErrors,
            ...emptyAltErrors,
            ...ambiguousAltsErrors,
            ...emptyRepetitionErrors
          ];
          return allErrors;
        }
        return leftRecursionErrors;
      }
      validateNoLeftRecursion(rules) {
        return flatMap_default(rules, (currTopRule) => validateNoLeftRecursion(currTopRule, currTopRule, defaultGrammarValidatorErrorProvider));
      }
      validateEmptyOrAlternatives(rules) {
        return flatMap_default(rules, (currTopRule) => validateEmptyOrAlternative(currTopRule, defaultGrammarValidatorErrorProvider));
      }
      validateAmbiguousAlternationAlternatives(rules, maxLookahead) {
        return flatMap_default(rules, (currTopRule) => validateAmbiguousAlternationAlternatives(currTopRule, maxLookahead, defaultGrammarValidatorErrorProvider));
      }
      validateSomeNonEmptyLookaheadPath(rules, maxLookahead) {
        return validateSomeNonEmptyLookaheadPath(rules, maxLookahead, defaultGrammarValidatorErrorProvider);
      }
      buildLookaheadForAlternation(options) {
        return buildLookaheadFuncForOr(options.prodOccurrence, options.rule, options.maxLookahead, options.hasPredicates, options.dynamicTokensEnabled, buildAlternativesLookAheadFunc);
      }
      buildLookaheadForOptional(options) {
        return buildLookaheadFuncForOptionalProd(options.prodOccurrence, options.rule, options.maxLookahead, options.dynamicTokensEnabled, getProdType(options.prodType), buildSingleAlternativeLookaheadFunction);
      }
    };
  }
});

// node_modules/chevrotain/lib/src/parse/parser/traits/looksahead.js
function collectMethods(rule) {
  collectorVisitor.reset();
  rule.accept(collectorVisitor);
  const dslMethods = collectorVisitor.dslMethods;
  collectorVisitor.reset();
  return dslMethods;
}
var LooksAhead, DslMethodsCollectorVisitor, collectorVisitor;
var init_looksahead = __esm({
  "node_modules/chevrotain/lib/src/parse/parser/traits/looksahead.js"() {
    init_lodash();
    init_parser();
    init_keys2();
    init_api2();
    init_llk_lookahead();
    LooksAhead = class {
      initLooksAhead(config) {
        this.dynamicTokensEnabled = has_default(config, "dynamicTokensEnabled") ? config.dynamicTokensEnabled : DEFAULT_PARSER_CONFIG.dynamicTokensEnabled;
        this.maxLookahead = has_default(config, "maxLookahead") ? config.maxLookahead : DEFAULT_PARSER_CONFIG.maxLookahead;
        this.lookaheadStrategy = has_default(config, "lookaheadStrategy") ? config.lookaheadStrategy : new LLkLookaheadStrategy({ maxLookahead: this.maxLookahead });
        this.lookAheadFuncsCache = /* @__PURE__ */ new Map();
      }
      preComputeLookaheadFunctions(rules) {
        forEach_default(rules, (currRule) => {
          this.TRACE_INIT(`${currRule.name} Rule Lookahead`, () => {
            const { alternation, repetition, option, repetitionMandatory, repetitionMandatoryWithSeparator, repetitionWithSeparator } = collectMethods(currRule);
            forEach_default(alternation, (currProd) => {
              const prodIdx = currProd.idx === 0 ? "" : currProd.idx;
              this.TRACE_INIT(`${getProductionDslName(currProd)}${prodIdx}`, () => {
                const laFunc = this.lookaheadStrategy.buildLookaheadForAlternation({
                  prodOccurrence: currProd.idx,
                  rule: currRule,
                  maxLookahead: currProd.maxLookahead || this.maxLookahead,
                  hasPredicates: currProd.hasPredicates,
                  dynamicTokensEnabled: this.dynamicTokensEnabled
                });
                const key = getKeyForAutomaticLookahead(this.fullRuleNameToShort[currRule.name], OR_IDX, currProd.idx);
                this.setLaFuncCache(key, laFunc);
              });
            });
            forEach_default(repetition, (currProd) => {
              this.computeLookaheadFunc(currRule, currProd.idx, MANY_IDX, "Repetition", currProd.maxLookahead, getProductionDslName(currProd));
            });
            forEach_default(option, (currProd) => {
              this.computeLookaheadFunc(currRule, currProd.idx, OPTION_IDX, "Option", currProd.maxLookahead, getProductionDslName(currProd));
            });
            forEach_default(repetitionMandatory, (currProd) => {
              this.computeLookaheadFunc(currRule, currProd.idx, AT_LEAST_ONE_IDX, "RepetitionMandatory", currProd.maxLookahead, getProductionDslName(currProd));
            });
            forEach_default(repetitionMandatoryWithSeparator, (currProd) => {
              this.computeLookaheadFunc(currRule, currProd.idx, AT_LEAST_ONE_SEP_IDX, "RepetitionMandatoryWithSeparator", currProd.maxLookahead, getProductionDslName(currProd));
            });
            forEach_default(repetitionWithSeparator, (currProd) => {
              this.computeLookaheadFunc(currRule, currProd.idx, MANY_SEP_IDX, "RepetitionWithSeparator", currProd.maxLookahead, getProductionDslName(currProd));
            });
          });
        });
      }
      computeLookaheadFunc(rule, prodOccurrence, prodKey, prodType, prodMaxLookahead, dslMethodName) {
        this.TRACE_INIT(`${dslMethodName}${prodOccurrence === 0 ? "" : prodOccurrence}`, () => {
          const laFunc = this.lookaheadStrategy.buildLookaheadForOptional({
            prodOccurrence,
            rule,
            maxLookahead: prodMaxLookahead || this.maxLookahead,
            dynamicTokensEnabled: this.dynamicTokensEnabled,
            prodType
          });
          const key = getKeyForAutomaticLookahead(this.fullRuleNameToShort[rule.name], prodKey, prodOccurrence);
          this.setLaFuncCache(key, laFunc);
        });
      }
      // this actually returns a number, but it is always used as a string (object prop key)
      getKeyForAutomaticLookahead(dslMethodIdx, occurrence) {
        const currRuleShortName = this.getLastExplicitRuleShortName();
        return getKeyForAutomaticLookahead(currRuleShortName, dslMethodIdx, occurrence);
      }
      getLaFuncFromCache(key) {
        return this.lookAheadFuncsCache.get(key);
      }
      /* istanbul ignore next */
      setLaFuncCache(key, value) {
        this.lookAheadFuncsCache.set(key, value);
      }
    };
    DslMethodsCollectorVisitor = class extends GAstVisitor {
      constructor() {
        super(...arguments);
        this.dslMethods = {
          option: [],
          alternation: [],
          repetition: [],
          repetitionWithSeparator: [],
          repetitionMandatory: [],
          repetitionMandatoryWithSeparator: []
        };
      }
      reset() {
        this.dslMethods = {
          option: [],
          alternation: [],
          repetition: [],
          repetitionWithSeparator: [],
          repetitionMandatory: [],
          repetitionMandatoryWithSeparator: []
        };
      }
      visitOption(option) {
        this.dslMethods.option.push(option);
      }
      visitRepetitionWithSeparator(manySep) {
        this.dslMethods.repetitionWithSeparator.push(manySep);
      }
      visitRepetitionMandatory(atLeastOne) {
        this.dslMethods.repetitionMandatory.push(atLeastOne);
      }
      visitRepetitionMandatoryWithSeparator(atLeastOneSep) {
        this.dslMethods.repetitionMandatoryWithSeparator.push(atLeastOneSep);
      }
      visitRepetition(many) {
        this.dslMethods.repetition.push(many);
      }
      visitAlternation(or) {
        this.dslMethods.alternation.push(or);
      }
    };
    collectorVisitor = new DslMethodsCollectorVisitor();
  }
});

// node_modules/chevrotain/lib/src/parse/cst/cst.js
function setNodeLocationOnlyOffset(currNodeLocation, newLocationInfo) {
  if (isNaN(currNodeLocation.startOffset) === true) {
    currNodeLocation.startOffset = newLocationInfo.startOffset;
    currNodeLocation.endOffset = newLocationInfo.endOffset;
  } else if (currNodeLocation.endOffset < newLocationInfo.endOffset === true) {
    currNodeLocation.endOffset = newLocationInfo.endOffset;
  }
}
function setNodeLocationFull(currNodeLocation, newLocationInfo) {
  if (isNaN(currNodeLocation.startOffset) === true) {
    currNodeLocation.startOffset = newLocationInfo.startOffset;
    currNodeLocation.startColumn = newLocationInfo.startColumn;
    currNodeLocation.startLine = newLocationInfo.startLine;
    currNodeLocation.endOffset = newLocationInfo.endOffset;
    currNodeLocation.endColumn = newLocationInfo.endColumn;
    currNodeLocation.endLine = newLocationInfo.endLine;
  } else if (currNodeLocation.endOffset < newLocationInfo.endOffset === true) {
    currNodeLocation.endOffset = newLocationInfo.endOffset;
    currNodeLocation.endColumn = newLocationInfo.endColumn;
    currNodeLocation.endLine = newLocationInfo.endLine;
  }
}
function addTerminalToCst(node, token, tokenTypeName) {
  if (node.children[tokenTypeName] === void 0) {
    node.children[tokenTypeName] = [token];
  } else {
    node.children[tokenTypeName].push(token);
  }
}
function addNoneTerminalToCst(node, ruleName, ruleResult) {
  if (node.children[ruleName] === void 0) {
    node.children[ruleName] = [ruleResult];
  } else {
    node.children[ruleName].push(ruleResult);
  }
}
var init_cst = __esm({
  "node_modules/chevrotain/lib/src/parse/cst/cst.js"() {
  }
});

// node_modules/chevrotain/lib/src/lang/lang_extensions.js
function defineNameProp(obj, nameValue) {
  Object.defineProperty(obj, NAME, {
    enumerable: false,
    configurable: true,
    writable: false,
    value: nameValue
  });
}
var NAME;
var init_lang_extensions = __esm({
  "node_modules/chevrotain/lib/src/lang/lang_extensions.js"() {
    NAME = "name";
  }
});

// node_modules/chevrotain/lib/src/parse/cst/cst_visitor.js
function defaultVisit(ctx, param) {
  const childrenNames = keys_default(ctx);
  const childrenNamesLength = childrenNames.length;
  for (let i = 0; i < childrenNamesLength; i++) {
    const currChildName = childrenNames[i];
    const currChildArray = ctx[currChildName];
    const currChildArrayLength = currChildArray.length;
    for (let j = 0; j < currChildArrayLength; j++) {
      const currChild = currChildArray[j];
      if (currChild.tokenTypeIdx === void 0) {
        this[currChild.name](currChild.children, param);
      }
    }
  }
}
function createBaseSemanticVisitorConstructor(grammarName, ruleNames) {
  const derivedConstructor = function() {
  };
  defineNameProp(derivedConstructor, grammarName + "BaseSemantics");
  const semanticProto = {
    visit: function(cstNode, param) {
      if (isArray_default(cstNode)) {
        cstNode = cstNode[0];
      }
      if (isUndefined_default(cstNode)) {
        return void 0;
      }
      return this[cstNode.name](cstNode.children, param);
    },
    validateVisitor: function() {
      const semanticDefinitionErrors = validateVisitor(this, ruleNames);
      if (!isEmpty_default(semanticDefinitionErrors)) {
        const errorMessages = map_default(semanticDefinitionErrors, (currDefError) => currDefError.msg);
        throw Error(`Errors Detected in CST Visitor <${this.constructor.name}>:
	${errorMessages.join("\n\n").replace(/\n/g, "\n	")}`);
      }
    }
  };
  derivedConstructor.prototype = semanticProto;
  derivedConstructor.prototype.constructor = derivedConstructor;
  derivedConstructor._RULE_NAMES = ruleNames;
  return derivedConstructor;
}
function createBaseVisitorConstructorWithDefaults(grammarName, ruleNames, baseConstructor) {
  const derivedConstructor = function() {
  };
  defineNameProp(derivedConstructor, grammarName + "BaseSemanticsWithDefaults");
  const withDefaultsProto = Object.create(baseConstructor.prototype);
  forEach_default(ruleNames, (ruleName) => {
    withDefaultsProto[ruleName] = defaultVisit;
  });
  derivedConstructor.prototype = withDefaultsProto;
  derivedConstructor.prototype.constructor = derivedConstructor;
  return derivedConstructor;
}
function validateVisitor(visitorInstance, ruleNames) {
  const missingErrors = validateMissingCstMethods(visitorInstance, ruleNames);
  return missingErrors;
}
function validateMissingCstMethods(visitorInstance, ruleNames) {
  const missingRuleNames = filter_default(ruleNames, (currRuleName) => {
    return isFunction_default(visitorInstance[currRuleName]) === false;
  });
  const errors = map_default(missingRuleNames, (currRuleName) => {
    return {
      msg: `Missing visitor method: <${currRuleName}> on ${visitorInstance.constructor.name} CST Visitor.`,
      type: CstVisitorDefinitionError.MISSING_METHOD,
      methodName: currRuleName
    };
  });
  return compact_default(errors);
}
var CstVisitorDefinitionError;
var init_cst_visitor = __esm({
  "node_modules/chevrotain/lib/src/parse/cst/cst_visitor.js"() {
    init_lodash();
    init_lang_extensions();
    (function(CstVisitorDefinitionError2) {
      CstVisitorDefinitionError2[CstVisitorDefinitionError2["REDUNDANT_METHOD"] = 0] = "REDUNDANT_METHOD";
      CstVisitorDefinitionError2[CstVisitorDefinitionError2["MISSING_METHOD"] = 1] = "MISSING_METHOD";
    })(CstVisitorDefinitionError || (CstVisitorDefinitionError = {}));
  }
});

// node_modules/chevrotain/lib/src/parse/parser/traits/tree_builder.js
var TreeBuilder;
var init_tree_builder = __esm({
  "node_modules/chevrotain/lib/src/parse/parser/traits/tree_builder.js"() {
    init_cst();
    init_lodash();
    init_cst_visitor();
    init_parser();
    TreeBuilder = class {
      initTreeBuilder(config) {
        this.CST_STACK = [];
        this.outputCst = config.outputCst;
        this.nodeLocationTracking = has_default(config, "nodeLocationTracking") ? config.nodeLocationTracking : DEFAULT_PARSER_CONFIG.nodeLocationTracking;
        if (!this.outputCst) {
          this.cstInvocationStateUpdate = noop_default;
          this.cstFinallyStateUpdate = noop_default;
          this.cstPostTerminal = noop_default;
          this.cstPostNonTerminal = noop_default;
          this.cstPostRule = noop_default;
        } else {
          if (/full/i.test(this.nodeLocationTracking)) {
            if (this.recoveryEnabled) {
              this.setNodeLocationFromToken = setNodeLocationFull;
              this.setNodeLocationFromNode = setNodeLocationFull;
              this.cstPostRule = noop_default;
              this.setInitialNodeLocation = this.setInitialNodeLocationFullRecovery;
            } else {
              this.setNodeLocationFromToken = noop_default;
              this.setNodeLocationFromNode = noop_default;
              this.cstPostRule = this.cstPostRuleFull;
              this.setInitialNodeLocation = this.setInitialNodeLocationFullRegular;
            }
          } else if (/onlyOffset/i.test(this.nodeLocationTracking)) {
            if (this.recoveryEnabled) {
              this.setNodeLocationFromToken = setNodeLocationOnlyOffset;
              this.setNodeLocationFromNode = setNodeLocationOnlyOffset;
              this.cstPostRule = noop_default;
              this.setInitialNodeLocation = this.setInitialNodeLocationOnlyOffsetRecovery;
            } else {
              this.setNodeLocationFromToken = noop_default;
              this.setNodeLocationFromNode = noop_default;
              this.cstPostRule = this.cstPostRuleOnlyOffset;
              this.setInitialNodeLocation = this.setInitialNodeLocationOnlyOffsetRegular;
            }
          } else if (/none/i.test(this.nodeLocationTracking)) {
            this.setNodeLocationFromToken = noop_default;
            this.setNodeLocationFromNode = noop_default;
            this.cstPostRule = noop_default;
            this.setInitialNodeLocation = noop_default;
          } else {
            throw Error(`Invalid <nodeLocationTracking> config option: "${config.nodeLocationTracking}"`);
          }
        }
      }
      setInitialNodeLocationOnlyOffsetRecovery(cstNode) {
        cstNode.location = {
          startOffset: NaN,
          endOffset: NaN
        };
      }
      setInitialNodeLocationOnlyOffsetRegular(cstNode) {
        cstNode.location = {
          // without error recovery the starting Location of a new CstNode is guaranteed
          // To be the next Token's startOffset (for valid inputs).
          // For invalid inputs there won't be any CSTOutput so this potential
          // inaccuracy does not matter
          startOffset: this.LA(1).startOffset,
          endOffset: NaN
        };
      }
      setInitialNodeLocationFullRecovery(cstNode) {
        cstNode.location = {
          startOffset: NaN,
          startLine: NaN,
          startColumn: NaN,
          endOffset: NaN,
          endLine: NaN,
          endColumn: NaN
        };
      }
      /**
           *  @see setInitialNodeLocationOnlyOffsetRegular for explanation why this work
      
           * @param cstNode
           */
      setInitialNodeLocationFullRegular(cstNode) {
        const nextToken = this.LA(1);
        cstNode.location = {
          startOffset: nextToken.startOffset,
          startLine: nextToken.startLine,
          startColumn: nextToken.startColumn,
          endOffset: NaN,
          endLine: NaN,
          endColumn: NaN
        };
      }
      cstInvocationStateUpdate(fullRuleName) {
        const cstNode = {
          name: fullRuleName,
          children: /* @__PURE__ */ Object.create(null)
        };
        this.setInitialNodeLocation(cstNode);
        this.CST_STACK.push(cstNode);
      }
      cstFinallyStateUpdate() {
        this.CST_STACK.pop();
      }
      cstPostRuleFull(ruleCstNode) {
        const prevToken = this.LA(0);
        const loc = ruleCstNode.location;
        if (loc.startOffset <= prevToken.startOffset === true) {
          loc.endOffset = prevToken.endOffset;
          loc.endLine = prevToken.endLine;
          loc.endColumn = prevToken.endColumn;
        } else {
          loc.startOffset = NaN;
          loc.startLine = NaN;
          loc.startColumn = NaN;
        }
      }
      cstPostRuleOnlyOffset(ruleCstNode) {
        const prevToken = this.LA(0);
        const loc = ruleCstNode.location;
        if (loc.startOffset <= prevToken.startOffset === true) {
          loc.endOffset = prevToken.endOffset;
        } else {
          loc.startOffset = NaN;
        }
      }
      cstPostTerminal(key, consumedToken) {
        const rootCst = this.CST_STACK[this.CST_STACK.length - 1];
        addTerminalToCst(rootCst, consumedToken, key);
        this.setNodeLocationFromToken(rootCst.location, consumedToken);
      }
      cstPostNonTerminal(ruleCstResult, ruleName) {
        const preCstNode = this.CST_STACK[this.CST_STACK.length - 1];
        addNoneTerminalToCst(preCstNode, ruleName, ruleCstResult);
        this.setNodeLocationFromNode(preCstNode.location, ruleCstResult.location);
      }
      getBaseCstVisitorConstructor() {
        if (isUndefined_default(this.baseCstVisitorConstructor)) {
          const newBaseCstVisitorConstructor = createBaseSemanticVisitorConstructor(this.className, keys_default(this.gastProductionsCache));
          this.baseCstVisitorConstructor = newBaseCstVisitorConstructor;
          return newBaseCstVisitorConstructor;
        }
        return this.baseCstVisitorConstructor;
      }
      getBaseCstVisitorConstructorWithDefaults() {
        if (isUndefined_default(this.baseCstVisitorWithDefaultsConstructor)) {
          const newConstructor = createBaseVisitorConstructorWithDefaults(this.className, keys_default(this.gastProductionsCache), this.getBaseCstVisitorConstructor());
          this.baseCstVisitorWithDefaultsConstructor = newConstructor;
          return newConstructor;
        }
        return this.baseCstVisitorWithDefaultsConstructor;
      }
      getLastExplicitRuleShortName() {
        const ruleStack = this.RULE_STACK;
        return ruleStack[ruleStack.length - 1];
      }
      getPreviousExplicitRuleShortName() {
        const ruleStack = this.RULE_STACK;
        return ruleStack[ruleStack.length - 2];
      }
      getLastExplicitRuleOccurrenceIndex() {
        const occurrenceStack = this.RULE_OCCURRENCE_STACK;
        return occurrenceStack[occurrenceStack.length - 1];
      }
    };
  }
});

// node_modules/chevrotain/lib/src/parse/parser/traits/lexer_adapter.js
var LexerAdapter;
var init_lexer_adapter = __esm({
  "node_modules/chevrotain/lib/src/parse/parser/traits/lexer_adapter.js"() {
    init_parser();
    LexerAdapter = class {
      initLexerAdapter() {
        this.tokVector = [];
        this.tokVectorLength = 0;
        this.currIdx = -1;
      }
      set input(newInput) {
        if (this.selfAnalysisDone !== true) {
          throw Error(`Missing <performSelfAnalysis> invocation at the end of the Parser's constructor.`);
        }
        this.reset();
        this.tokVector = newInput;
        this.tokVectorLength = newInput.length;
      }
      get input() {
        return this.tokVector;
      }
      // skips a token and returns the next token
      SKIP_TOKEN() {
        if (this.currIdx <= this.tokVector.length - 2) {
          this.consumeToken();
          return this.LA(1);
        } else {
          return END_OF_FILE;
        }
      }
      // Lexer (accessing Token vector) related methods which can be overridden to implement lazy lexers
      // or lexers dependent on parser context.
      LA(howMuch) {
        const soughtIdx = this.currIdx + howMuch;
        if (soughtIdx < 0 || this.tokVectorLength <= soughtIdx) {
          return END_OF_FILE;
        } else {
          return this.tokVector[soughtIdx];
        }
      }
      consumeToken() {
        this.currIdx++;
      }
      exportLexerState() {
        return this.currIdx;
      }
      importLexerState(newState) {
        this.currIdx = newState;
      }
      resetLexerState() {
        this.currIdx = -1;
      }
      moveToTerminatedState() {
        this.currIdx = this.tokVector.length - 1;
      }
      getLexerPosition() {
        return this.exportLexerState();
      }
    };
  }
});

// node_modules/chevrotain/lib/src/parse/parser/traits/recognizer_api.js
var RecognizerApi;
var init_recognizer_api = __esm({
  "node_modules/chevrotain/lib/src/parse/parser/traits/recognizer_api.js"() {
    init_lodash();
    init_exceptions_public();
    init_parser();
    init_errors_public();
    init_checks();
    init_api2();
    RecognizerApi = class {
      ACTION(impl) {
        return impl.call(this);
      }
      consume(idx, tokType, options) {
        return this.consumeInternal(tokType, idx, options);
      }
      subrule(idx, ruleToCall, options) {
        return this.subruleInternal(ruleToCall, idx, options);
      }
      option(idx, actionORMethodDef) {
        return this.optionInternal(actionORMethodDef, idx);
      }
      or(idx, altsOrOpts) {
        return this.orInternal(altsOrOpts, idx);
      }
      many(idx, actionORMethodDef) {
        return this.manyInternal(idx, actionORMethodDef);
      }
      atLeastOne(idx, actionORMethodDef) {
        return this.atLeastOneInternal(idx, actionORMethodDef);
      }
      CONSUME(tokType, options) {
        return this.consumeInternal(tokType, 0, options);
      }
      CONSUME1(tokType, options) {
        return this.consumeInternal(tokType, 1, options);
      }
      CONSUME2(tokType, options) {
        return this.consumeInternal(tokType, 2, options);
      }
      CONSUME3(tokType, options) {
        return this.consumeInternal(tokType, 3, options);
      }
      CONSUME4(tokType, options) {
        return this.consumeInternal(tokType, 4, options);
      }
      CONSUME5(tokType, options) {
        return this.consumeInternal(tokType, 5, options);
      }
      CONSUME6(tokType, options) {
        return this.consumeInternal(tokType, 6, options);
      }
      CONSUME7(tokType, options) {
        return this.consumeInternal(tokType, 7, options);
      }
      CONSUME8(tokType, options) {
        return this.consumeInternal(tokType, 8, options);
      }
      CONSUME9(tokType, options) {
        return this.consumeInternal(tokType, 9, options);
      }
      SUBRULE(ruleToCall, options) {
        return this.subruleInternal(ruleToCall, 0, options);
      }
      SUBRULE1(ruleToCall, options) {
        return this.subruleInternal(ruleToCall, 1, options);
      }
      SUBRULE2(ruleToCall, options) {
        return this.subruleInternal(ruleToCall, 2, options);
      }
      SUBRULE3(ruleToCall, options) {
        return this.subruleInternal(ruleToCall, 3, options);
      }
      SUBRULE4(ruleToCall, options) {
        return this.subruleInternal(ruleToCall, 4, options);
      }
      SUBRULE5(ruleToCall, options) {
        return this.subruleInternal(ruleToCall, 5, options);
      }
      SUBRULE6(ruleToCall, options) {
        return this.subruleInternal(ruleToCall, 6, options);
      }
      SUBRULE7(ruleToCall, options) {
        return this.subruleInternal(ruleToCall, 7, options);
      }
      SUBRULE8(ruleToCall, options) {
        return this.subruleInternal(ruleToCall, 8, options);
      }
      SUBRULE9(ruleToCall, options) {
        return this.subruleInternal(ruleToCall, 9, options);
      }
      OPTION(actionORMethodDef) {
        return this.optionInternal(actionORMethodDef, 0);
      }
      OPTION1(actionORMethodDef) {
        return this.optionInternal(actionORMethodDef, 1);
      }
      OPTION2(actionORMethodDef) {
        return this.optionInternal(actionORMethodDef, 2);
      }
      OPTION3(actionORMethodDef) {
        return this.optionInternal(actionORMethodDef, 3);
      }
      OPTION4(actionORMethodDef) {
        return this.optionInternal(actionORMethodDef, 4);
      }
      OPTION5(actionORMethodDef) {
        return this.optionInternal(actionORMethodDef, 5);
      }
      OPTION6(actionORMethodDef) {
        return this.optionInternal(actionORMethodDef, 6);
      }
      OPTION7(actionORMethodDef) {
        return this.optionInternal(actionORMethodDef, 7);
      }
      OPTION8(actionORMethodDef) {
        return this.optionInternal(actionORMethodDef, 8);
      }
      OPTION9(actionORMethodDef) {
        return this.optionInternal(actionORMethodDef, 9);
      }
      OR(altsOrOpts) {
        return this.orInternal(altsOrOpts, 0);
      }
      OR1(altsOrOpts) {
        return this.orInternal(altsOrOpts, 1);
      }
      OR2(altsOrOpts) {
        return this.orInternal(altsOrOpts, 2);
      }
      OR3(altsOrOpts) {
        return this.orInternal(altsOrOpts, 3);
      }
      OR4(altsOrOpts) {
        return this.orInternal(altsOrOpts, 4);
      }
      OR5(altsOrOpts) {
        return this.orInternal(altsOrOpts, 5);
      }
      OR6(altsOrOpts) {
        return this.orInternal(altsOrOpts, 6);
      }
      OR7(altsOrOpts) {
        return this.orInternal(altsOrOpts, 7);
      }
      OR8(altsOrOpts) {
        return this.orInternal(altsOrOpts, 8);
      }
      OR9(altsOrOpts) {
        return this.orInternal(altsOrOpts, 9);
      }
      MANY(actionORMethodDef) {
        this.manyInternal(0, actionORMethodDef);
      }
      MANY1(actionORMethodDef) {
        this.manyInternal(1, actionORMethodDef);
      }
      MANY2(actionORMethodDef) {
        this.manyInternal(2, actionORMethodDef);
      }
      MANY3(actionORMethodDef) {
        this.manyInternal(3, actionORMethodDef);
      }
      MANY4(actionORMethodDef) {
        this.manyInternal(4, actionORMethodDef);
      }
      MANY5(actionORMethodDef) {
        this.manyInternal(5, actionORMethodDef);
      }
      MANY6(actionORMethodDef) {
        this.manyInternal(6, actionORMethodDef);
      }
      MANY7(actionORMethodDef) {
        this.manyInternal(7, actionORMethodDef);
      }
      MANY8(actionORMethodDef) {
        this.manyInternal(8, actionORMethodDef);
      }
      MANY9(actionORMethodDef) {
        this.manyInternal(9, actionORMethodDef);
      }
      MANY_SEP(options) {
        this.manySepFirstInternal(0, options);
      }
      MANY_SEP1(options) {
        this.manySepFirstInternal(1, options);
      }
      MANY_SEP2(options) {
        this.manySepFirstInternal(2, options);
      }
      MANY_SEP3(options) {
        this.manySepFirstInternal(3, options);
      }
      MANY_SEP4(options) {
        this.manySepFirstInternal(4, options);
      }
      MANY_SEP5(options) {
        this.manySepFirstInternal(5, options);
      }
      MANY_SEP6(options) {
        this.manySepFirstInternal(6, options);
      }
      MANY_SEP7(options) {
        this.manySepFirstInternal(7, options);
      }
      MANY_SEP8(options) {
        this.manySepFirstInternal(8, options);
      }
      MANY_SEP9(options) {
        this.manySepFirstInternal(9, options);
      }
      AT_LEAST_ONE(actionORMethodDef) {
        this.atLeastOneInternal(0, actionORMethodDef);
      }
      AT_LEAST_ONE1(actionORMethodDef) {
        return this.atLeastOneInternal(1, actionORMethodDef);
      }
      AT_LEAST_ONE2(actionORMethodDef) {
        this.atLeastOneInternal(2, actionORMethodDef);
      }
      AT_LEAST_ONE3(actionORMethodDef) {
        this.atLeastOneInternal(3, actionORMethodDef);
      }
      AT_LEAST_ONE4(actionORMethodDef) {
        this.atLeastOneInternal(4, actionORMethodDef);
      }
      AT_LEAST_ONE5(actionORMethodDef) {
        this.atLeastOneInternal(5, actionORMethodDef);
      }
      AT_LEAST_ONE6(actionORMethodDef) {
        this.atLeastOneInternal(6, actionORMethodDef);
      }
      AT_LEAST_ONE7(actionORMethodDef) {
        this.atLeastOneInternal(7, actionORMethodDef);
      }
      AT_LEAST_ONE8(actionORMethodDef) {
        this.atLeastOneInternal(8, actionORMethodDef);
      }
      AT_LEAST_ONE9(actionORMethodDef) {
        this.atLeastOneInternal(9, actionORMethodDef);
      }
      AT_LEAST_ONE_SEP(options) {
        this.atLeastOneSepFirstInternal(0, options);
      }
      AT_LEAST_ONE_SEP1(options) {
        this.atLeastOneSepFirstInternal(1, options);
      }
      AT_LEAST_ONE_SEP2(options) {
        this.atLeastOneSepFirstInternal(2, options);
      }
      AT_LEAST_ONE_SEP3(options) {
        this.atLeastOneSepFirstInternal(3, options);
      }
      AT_LEAST_ONE_SEP4(options) {
        this.atLeastOneSepFirstInternal(4, options);
      }
      AT_LEAST_ONE_SEP5(options) {
        this.atLeastOneSepFirstInternal(5, options);
      }
      AT_LEAST_ONE_SEP6(options) {
        this.atLeastOneSepFirstInternal(6, options);
      }
      AT_LEAST_ONE_SEP7(options) {
        this.atLeastOneSepFirstInternal(7, options);
      }
      AT_LEAST_ONE_SEP8(options) {
        this.atLeastOneSepFirstInternal(8, options);
      }
      AT_LEAST_ONE_SEP9(options) {
        this.atLeastOneSepFirstInternal(9, options);
      }
      RULE(name, implementation, config = DEFAULT_RULE_CONFIG) {
        if (includes_default(this.definedRulesNames, name)) {
          const errMsg = defaultGrammarValidatorErrorProvider.buildDuplicateRuleNameError({
            topLevelRule: name,
            grammarName: this.className
          });
          const error = {
            message: errMsg,
            type: ParserDefinitionErrorType.DUPLICATE_RULE_NAME,
            ruleName: name
          };
          this.definitionErrors.push(error);
        }
        this.definedRulesNames.push(name);
        const ruleImplementation = this.defineRule(name, implementation, config);
        this[name] = ruleImplementation;
        return ruleImplementation;
      }
      OVERRIDE_RULE(name, impl, config = DEFAULT_RULE_CONFIG) {
        const ruleErrors = validateRuleIsOverridden(name, this.definedRulesNames, this.className);
        this.definitionErrors = this.definitionErrors.concat(ruleErrors);
        const ruleImplementation = this.defineRule(name, impl, config);
        this[name] = ruleImplementation;
        return ruleImplementation;
      }
      BACKTRACK(grammarRule, args) {
        return function() {
          this.isBackTrackingStack.push(1);
          const orgState = this.saveRecogState();
          try {
            grammarRule.apply(this, args);
            return true;
          } catch (e) {
            if (isRecognitionException(e)) {
              return false;
            } else {
              throw e;
            }
          } finally {
            this.reloadRecogState(orgState);
            this.isBackTrackingStack.pop();
          }
        };
      }
      // GAST export APIs
      getGAstProductions() {
        return this.gastProductionsCache;
      }
      getSerializedGastProductions() {
        return serializeGrammar(values_default(this.gastProductionsCache));
      }
    };
  }
});

// node_modules/chevrotain/lib/src/parse/parser/traits/recognizer_engine.js
var RecognizerEngine;
var init_recognizer_engine = __esm({
  "node_modules/chevrotain/lib/src/parse/parser/traits/recognizer_engine.js"() {
    init_lodash();
    init_keys2();
    init_exceptions_public();
    init_lookahead();
    init_interpreter();
    init_parser();
    init_recoverable();
    init_tokens_public();
    init_tokens();
    RecognizerEngine = class {
      initRecognizerEngine(tokenVocabulary, config) {
        this.className = this.constructor.name;
        this.shortRuleNameToFull = {};
        this.fullRuleNameToShort = {};
        this.ruleShortNameIdx = 256;
        this.tokenMatcher = tokenStructuredMatcherNoCategories;
        this.subruleIdx = 0;
        this.definedRulesNames = [];
        this.tokensMap = {};
        this.isBackTrackingStack = [];
        this.RULE_STACK = [];
        this.RULE_OCCURRENCE_STACK = [];
        this.gastProductionsCache = {};
        if (has_default(config, "serializedGrammar")) {
          throw Error("The Parser's configuration can no longer contain a <serializedGrammar> property.\n	See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_6-0-0\n	For Further details.");
        }
        if (isArray_default(tokenVocabulary)) {
          if (isEmpty_default(tokenVocabulary)) {
            throw Error("A Token Vocabulary cannot be empty.\n	Note that the first argument for the parser constructor\n	is no longer a Token vector (since v4.0).");
          }
          if (typeof tokenVocabulary[0].startOffset === "number") {
            throw Error("The Parser constructor no longer accepts a token vector as the first argument.\n	See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_4-0-0\n	For Further details.");
          }
        }
        if (isArray_default(tokenVocabulary)) {
          this.tokensMap = reduce_default(tokenVocabulary, (acc, tokType) => {
            acc[tokType.name] = tokType;
            return acc;
          }, {});
        } else if (has_default(tokenVocabulary, "modes") && every_default(flatten_default(values_default(tokenVocabulary.modes)), isTokenType)) {
          const allTokenTypes2 = flatten_default(values_default(tokenVocabulary.modes));
          const uniqueTokens = uniq_default(allTokenTypes2);
          this.tokensMap = reduce_default(uniqueTokens, (acc, tokType) => {
            acc[tokType.name] = tokType;
            return acc;
          }, {});
        } else if (isObject_default(tokenVocabulary)) {
          this.tokensMap = clone_default(tokenVocabulary);
        } else {
          throw new Error("<tokensDictionary> argument must be An Array of Token constructors, A dictionary of Token constructors or an IMultiModeLexerDefinition");
        }
        this.tokensMap["EOF"] = EOF;
        const allTokenTypes = has_default(tokenVocabulary, "modes") ? flatten_default(values_default(tokenVocabulary.modes)) : values_default(tokenVocabulary);
        const noTokenCategoriesUsed = every_default(allTokenTypes, (tokenConstructor) => isEmpty_default(tokenConstructor.categoryMatches));
        this.tokenMatcher = noTokenCategoriesUsed ? tokenStructuredMatcherNoCategories : tokenStructuredMatcher;
        augmentTokenTypes(values_default(this.tokensMap));
      }
      defineRule(ruleName, impl, config) {
        if (this.selfAnalysisDone) {
          throw Error(`Grammar rule <${ruleName}> may not be defined after the 'performSelfAnalysis' method has been called'
Make sure that all grammar rule definitions are done before 'performSelfAnalysis' is called.`);
        }
        const resyncEnabled = has_default(config, "resyncEnabled") ? config.resyncEnabled : DEFAULT_RULE_CONFIG.resyncEnabled;
        const recoveryValueFunc = has_default(config, "recoveryValueFunc") ? config.recoveryValueFunc : DEFAULT_RULE_CONFIG.recoveryValueFunc;
        const shortName = this.ruleShortNameIdx << BITS_FOR_METHOD_TYPE + BITS_FOR_OCCURRENCE_IDX;
        this.ruleShortNameIdx++;
        this.shortRuleNameToFull[shortName] = ruleName;
        this.fullRuleNameToShort[ruleName] = shortName;
        let invokeRuleWithTry;
        if (this.outputCst === true) {
          invokeRuleWithTry = function invokeRuleWithTry2(...args) {
            try {
              this.ruleInvocationStateUpdate(shortName, ruleName, this.subruleIdx);
              impl.apply(this, args);
              const cst = this.CST_STACK[this.CST_STACK.length - 1];
              this.cstPostRule(cst);
              return cst;
            } catch (e) {
              return this.invokeRuleCatch(e, resyncEnabled, recoveryValueFunc);
            } finally {
              this.ruleFinallyStateUpdate();
            }
          };
        } else {
          invokeRuleWithTry = function invokeRuleWithTryCst(...args) {
            try {
              this.ruleInvocationStateUpdate(shortName, ruleName, this.subruleIdx);
              return impl.apply(this, args);
            } catch (e) {
              return this.invokeRuleCatch(e, resyncEnabled, recoveryValueFunc);
            } finally {
              this.ruleFinallyStateUpdate();
            }
          };
        }
        const wrappedGrammarRule = Object.assign(invokeRuleWithTry, { ruleName, originalGrammarAction: impl });
        return wrappedGrammarRule;
      }
      invokeRuleCatch(e, resyncEnabledConfig, recoveryValueFunc) {
        const isFirstInvokedRule = this.RULE_STACK.length === 1;
        const reSyncEnabled = resyncEnabledConfig && !this.isBackTracking() && this.recoveryEnabled;
        if (isRecognitionException(e)) {
          const recogError = e;
          if (reSyncEnabled) {
            const reSyncTokType = this.findReSyncTokenType();
            if (this.isInCurrentRuleReSyncSet(reSyncTokType)) {
              recogError.resyncedTokens = this.reSyncTo(reSyncTokType);
              if (this.outputCst) {
                const partialCstResult = this.CST_STACK[this.CST_STACK.length - 1];
                partialCstResult.recoveredNode = true;
                return partialCstResult;
              } else {
                return recoveryValueFunc(e);
              }
            } else {
              if (this.outputCst) {
                const partialCstResult = this.CST_STACK[this.CST_STACK.length - 1];
                partialCstResult.recoveredNode = true;
                recogError.partialCstResult = partialCstResult;
              }
              throw recogError;
            }
          } else if (isFirstInvokedRule) {
            this.moveToTerminatedState();
            return recoveryValueFunc(e);
          } else {
            throw recogError;
          }
        } else {
          throw e;
        }
      }
      // Implementation of parsing DSL
      optionInternal(actionORMethodDef, occurrence) {
        const key = this.getKeyForAutomaticLookahead(OPTION_IDX, occurrence);
        return this.optionInternalLogic(actionORMethodDef, occurrence, key);
      }
      optionInternalLogic(actionORMethodDef, occurrence, key) {
        let lookAheadFunc = this.getLaFuncFromCache(key);
        let action;
        if (typeof actionORMethodDef !== "function") {
          action = actionORMethodDef.DEF;
          const predicate = actionORMethodDef.GATE;
          if (predicate !== void 0) {
            const orgLookaheadFunction = lookAheadFunc;
            lookAheadFunc = () => {
              return predicate.call(this) && orgLookaheadFunction.call(this);
            };
          }
        } else {
          action = actionORMethodDef;
        }
        if (lookAheadFunc.call(this) === true) {
          return action.call(this);
        }
        return void 0;
      }
      atLeastOneInternal(prodOccurrence, actionORMethodDef) {
        const laKey = this.getKeyForAutomaticLookahead(AT_LEAST_ONE_IDX, prodOccurrence);
        return this.atLeastOneInternalLogic(prodOccurrence, actionORMethodDef, laKey);
      }
      atLeastOneInternalLogic(prodOccurrence, actionORMethodDef, key) {
        let lookAheadFunc = this.getLaFuncFromCache(key);
        let action;
        if (typeof actionORMethodDef !== "function") {
          action = actionORMethodDef.DEF;
          const predicate = actionORMethodDef.GATE;
          if (predicate !== void 0) {
            const orgLookaheadFunction = lookAheadFunc;
            lookAheadFunc = () => {
              return predicate.call(this) && orgLookaheadFunction.call(this);
            };
          }
        } else {
          action = actionORMethodDef;
        }
        if (lookAheadFunc.call(this) === true) {
          let notStuck = this.doSingleRepetition(action);
          while (lookAheadFunc.call(this) === true && notStuck === true) {
            notStuck = this.doSingleRepetition(action);
          }
        } else {
          throw this.raiseEarlyExitException(prodOccurrence, PROD_TYPE.REPETITION_MANDATORY, actionORMethodDef.ERR_MSG);
        }
        this.attemptInRepetitionRecovery(this.atLeastOneInternal, [prodOccurrence, actionORMethodDef], lookAheadFunc, AT_LEAST_ONE_IDX, prodOccurrence, NextTerminalAfterAtLeastOneWalker);
      }
      atLeastOneSepFirstInternal(prodOccurrence, options) {
        const laKey = this.getKeyForAutomaticLookahead(AT_LEAST_ONE_SEP_IDX, prodOccurrence);
        this.atLeastOneSepFirstInternalLogic(prodOccurrence, options, laKey);
      }
      atLeastOneSepFirstInternalLogic(prodOccurrence, options, key) {
        const action = options.DEF;
        const separator = options.SEP;
        const firstIterationLookaheadFunc = this.getLaFuncFromCache(key);
        if (firstIterationLookaheadFunc.call(this) === true) {
          action.call(this);
          const separatorLookAheadFunc = () => {
            return this.tokenMatcher(this.LA(1), separator);
          };
          while (this.tokenMatcher(this.LA(1), separator) === true) {
            this.CONSUME(separator);
            action.call(this);
          }
          this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal, [
            prodOccurrence,
            separator,
            separatorLookAheadFunc,
            action,
            NextTerminalAfterAtLeastOneSepWalker
          ], separatorLookAheadFunc, AT_LEAST_ONE_SEP_IDX, prodOccurrence, NextTerminalAfterAtLeastOneSepWalker);
        } else {
          throw this.raiseEarlyExitException(prodOccurrence, PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR, options.ERR_MSG);
        }
      }
      manyInternal(prodOccurrence, actionORMethodDef) {
        const laKey = this.getKeyForAutomaticLookahead(MANY_IDX, prodOccurrence);
        return this.manyInternalLogic(prodOccurrence, actionORMethodDef, laKey);
      }
      manyInternalLogic(prodOccurrence, actionORMethodDef, key) {
        let lookaheadFunction = this.getLaFuncFromCache(key);
        let action;
        if (typeof actionORMethodDef !== "function") {
          action = actionORMethodDef.DEF;
          const predicate = actionORMethodDef.GATE;
          if (predicate !== void 0) {
            const orgLookaheadFunction = lookaheadFunction;
            lookaheadFunction = () => {
              return predicate.call(this) && orgLookaheadFunction.call(this);
            };
          }
        } else {
          action = actionORMethodDef;
        }
        let notStuck = true;
        while (lookaheadFunction.call(this) === true && notStuck === true) {
          notStuck = this.doSingleRepetition(action);
        }
        this.attemptInRepetitionRecovery(
          this.manyInternal,
          [prodOccurrence, actionORMethodDef],
          lookaheadFunction,
          MANY_IDX,
          prodOccurrence,
          NextTerminalAfterManyWalker,
          // The notStuck parameter is only relevant when "attemptInRepetitionRecovery"
          // is invoked from manyInternal, in the MANY_SEP case and AT_LEAST_ONE[_SEP]
          // An infinite loop cannot occur as:
          // - Either the lookahead is guaranteed to consume something (Single Token Separator)
          // - AT_LEAST_ONE by definition is guaranteed to consume something (or error out).
          notStuck
        );
      }
      manySepFirstInternal(prodOccurrence, options) {
        const laKey = this.getKeyForAutomaticLookahead(MANY_SEP_IDX, prodOccurrence);
        this.manySepFirstInternalLogic(prodOccurrence, options, laKey);
      }
      manySepFirstInternalLogic(prodOccurrence, options, key) {
        const action = options.DEF;
        const separator = options.SEP;
        const firstIterationLaFunc = this.getLaFuncFromCache(key);
        if (firstIterationLaFunc.call(this) === true) {
          action.call(this);
          const separatorLookAheadFunc = () => {
            return this.tokenMatcher(this.LA(1), separator);
          };
          while (this.tokenMatcher(this.LA(1), separator) === true) {
            this.CONSUME(separator);
            action.call(this);
          }
          this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal, [
            prodOccurrence,
            separator,
            separatorLookAheadFunc,
            action,
            NextTerminalAfterManySepWalker
          ], separatorLookAheadFunc, MANY_SEP_IDX, prodOccurrence, NextTerminalAfterManySepWalker);
        }
      }
      repetitionSepSecondInternal(prodOccurrence, separator, separatorLookAheadFunc, action, nextTerminalAfterWalker) {
        while (separatorLookAheadFunc()) {
          this.CONSUME(separator);
          action.call(this);
        }
        this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal, [
          prodOccurrence,
          separator,
          separatorLookAheadFunc,
          action,
          nextTerminalAfterWalker
        ], separatorLookAheadFunc, AT_LEAST_ONE_SEP_IDX, prodOccurrence, nextTerminalAfterWalker);
      }
      doSingleRepetition(action) {
        const beforeIteration = this.getLexerPosition();
        action.call(this);
        const afterIteration = this.getLexerPosition();
        return afterIteration > beforeIteration;
      }
      orInternal(altsOrOpts, occurrence) {
        const laKey = this.getKeyForAutomaticLookahead(OR_IDX, occurrence);
        const alts = isArray_default(altsOrOpts) ? altsOrOpts : altsOrOpts.DEF;
        const laFunc = this.getLaFuncFromCache(laKey);
        const altIdxToTake = laFunc.call(this, alts);
        if (altIdxToTake !== void 0) {
          const chosenAlternative = alts[altIdxToTake];
          return chosenAlternative.ALT.call(this);
        }
        this.raiseNoAltException(occurrence, altsOrOpts.ERR_MSG);
      }
      ruleFinallyStateUpdate() {
        this.RULE_STACK.pop();
        this.RULE_OCCURRENCE_STACK.pop();
        this.cstFinallyStateUpdate();
        if (this.RULE_STACK.length === 0 && this.isAtEndOfInput() === false) {
          const firstRedundantTok = this.LA(1);
          const errMsg = this.errorMessageProvider.buildNotAllInputParsedMessage({
            firstRedundant: firstRedundantTok,
            ruleName: this.getCurrRuleFullName()
          });
          this.SAVE_ERROR(new NotAllInputParsedException(errMsg, firstRedundantTok));
        }
      }
      subruleInternal(ruleToCall, idx, options) {
        let ruleResult;
        try {
          const args = options !== void 0 ? options.ARGS : void 0;
          this.subruleIdx = idx;
          ruleResult = ruleToCall.apply(this, args);
          this.cstPostNonTerminal(ruleResult, options !== void 0 && options.LABEL !== void 0 ? options.LABEL : ruleToCall.ruleName);
          return ruleResult;
        } catch (e) {
          throw this.subruleInternalError(e, options, ruleToCall.ruleName);
        }
      }
      subruleInternalError(e, options, ruleName) {
        if (isRecognitionException(e) && e.partialCstResult !== void 0) {
          this.cstPostNonTerminal(e.partialCstResult, options !== void 0 && options.LABEL !== void 0 ? options.LABEL : ruleName);
          delete e.partialCstResult;
        }
        throw e;
      }
      consumeInternal(tokType, idx, options) {
        let consumedToken;
        try {
          const nextToken = this.LA(1);
          if (this.tokenMatcher(nextToken, tokType) === true) {
            this.consumeToken();
            consumedToken = nextToken;
          } else {
            this.consumeInternalError(tokType, nextToken, options);
          }
        } catch (eFromConsumption) {
          consumedToken = this.consumeInternalRecovery(tokType, idx, eFromConsumption);
        }
        this.cstPostTerminal(options !== void 0 && options.LABEL !== void 0 ? options.LABEL : tokType.name, consumedToken);
        return consumedToken;
      }
      consumeInternalError(tokType, nextToken, options) {
        let msg;
        const previousToken = this.LA(0);
        if (options !== void 0 && options.ERR_MSG) {
          msg = options.ERR_MSG;
        } else {
          msg = this.errorMessageProvider.buildMismatchTokenMessage({
            expected: tokType,
            actual: nextToken,
            previous: previousToken,
            ruleName: this.getCurrRuleFullName()
          });
        }
        throw this.SAVE_ERROR(new MismatchedTokenException(msg, nextToken, previousToken));
      }
      consumeInternalRecovery(tokType, idx, eFromConsumption) {
        if (this.recoveryEnabled && // TODO: more robust checking of the exception type. Perhaps Typescript extending expressions?
        eFromConsumption.name === "MismatchedTokenException" && !this.isBackTracking()) {
          const follows = this.getFollowsForInRuleRecovery(tokType, idx);
          try {
            return this.tryInRuleRecovery(tokType, follows);
          } catch (eFromInRuleRecovery) {
            if (eFromInRuleRecovery.name === IN_RULE_RECOVERY_EXCEPTION) {
              throw eFromConsumption;
            } else {
              throw eFromInRuleRecovery;
            }
          }
        } else {
          throw eFromConsumption;
        }
      }
      saveRecogState() {
        const savedErrors = this.errors;
        const savedRuleStack = clone_default(this.RULE_STACK);
        return {
          errors: savedErrors,
          lexerState: this.exportLexerState(),
          RULE_STACK: savedRuleStack,
          CST_STACK: this.CST_STACK
        };
      }
      reloadRecogState(newState) {
        this.errors = newState.errors;
        this.importLexerState(newState.lexerState);
        this.RULE_STACK = newState.RULE_STACK;
      }
      ruleInvocationStateUpdate(shortName, fullName, idxInCallingRule) {
        this.RULE_OCCURRENCE_STACK.push(idxInCallingRule);
        this.RULE_STACK.push(shortName);
        this.cstInvocationStateUpdate(fullName);
      }
      isBackTracking() {
        return this.isBackTrackingStack.length !== 0;
      }
      getCurrRuleFullName() {
        const shortName = this.getLastExplicitRuleShortName();
        return this.shortRuleNameToFull[shortName];
      }
      shortRuleNameToFullName(shortName) {
        return this.shortRuleNameToFull[shortName];
      }
      isAtEndOfInput() {
        return this.tokenMatcher(this.LA(1), EOF);
      }
      reset() {
        this.resetLexerState();
        this.subruleIdx = 0;
        this.isBackTrackingStack = [];
        this.errors = [];
        this.RULE_STACK = [];
        this.CST_STACK = [];
        this.RULE_OCCURRENCE_STACK = [];
      }
    };
  }
});

// node_modules/chevrotain/lib/src/parse/parser/traits/error_handler.js
var ErrorHandler;
var init_error_handler = __esm({
  "node_modules/chevrotain/lib/src/parse/parser/traits/error_handler.js"() {
    init_exceptions_public();
    init_lodash();
    init_lookahead();
    init_parser();
    ErrorHandler = class {
      initErrorHandler(config) {
        this._errors = [];
        this.errorMessageProvider = has_default(config, "errorMessageProvider") ? config.errorMessageProvider : DEFAULT_PARSER_CONFIG.errorMessageProvider;
      }
      SAVE_ERROR(error) {
        if (isRecognitionException(error)) {
          error.context = {
            ruleStack: this.getHumanReadableRuleStack(),
            ruleOccurrenceStack: clone_default(this.RULE_OCCURRENCE_STACK)
          };
          this._errors.push(error);
          return error;
        } else {
          throw Error("Trying to save an Error which is not a RecognitionException");
        }
      }
      get errors() {
        return clone_default(this._errors);
      }
      set errors(newErrors) {
        this._errors = newErrors;
      }
      // TODO: consider caching the error message computed information
      raiseEarlyExitException(occurrence, prodType, userDefinedErrMsg) {
        const ruleName = this.getCurrRuleFullName();
        const ruleGrammar = this.getGAstProductions()[ruleName];
        const lookAheadPathsPerAlternative = getLookaheadPathsForOptionalProd(occurrence, ruleGrammar, prodType, this.maxLookahead);
        const insideProdPaths = lookAheadPathsPerAlternative[0];
        const actualTokens = [];
        for (let i = 1; i <= this.maxLookahead; i++) {
          actualTokens.push(this.LA(i));
        }
        const msg = this.errorMessageProvider.buildEarlyExitMessage({
          expectedIterationPaths: insideProdPaths,
          actual: actualTokens,
          previous: this.LA(0),
          customUserDescription: userDefinedErrMsg,
          ruleName
        });
        throw this.SAVE_ERROR(new EarlyExitException(msg, this.LA(1), this.LA(0)));
      }
      // TODO: consider caching the error message computed information
      raiseNoAltException(occurrence, errMsgTypes) {
        const ruleName = this.getCurrRuleFullName();
        const ruleGrammar = this.getGAstProductions()[ruleName];
        const lookAheadPathsPerAlternative = getLookaheadPathsForOr(occurrence, ruleGrammar, this.maxLookahead);
        const actualTokens = [];
        for (let i = 1; i <= this.maxLookahead; i++) {
          actualTokens.push(this.LA(i));
        }
        const previousToken = this.LA(0);
        const errMsg = this.errorMessageProvider.buildNoViableAltMessage({
          expectedPathsPerAlt: lookAheadPathsPerAlternative,
          actual: actualTokens,
          previous: previousToken,
          customUserDescription: errMsgTypes,
          ruleName: this.getCurrRuleFullName()
        });
        throw this.SAVE_ERROR(new NoViableAltException(errMsg, this.LA(1), previousToken));
      }
    };
  }
});

// node_modules/chevrotain/lib/src/parse/parser/traits/context_assist.js
var ContentAssist;
var init_context_assist = __esm({
  "node_modules/chevrotain/lib/src/parse/parser/traits/context_assist.js"() {
    init_interpreter();
    init_lodash();
    ContentAssist = class {
      initContentAssist() {
      }
      computeContentAssist(startRuleName, precedingInput) {
        const startRuleGast = this.gastProductionsCache[startRuleName];
        if (isUndefined_default(startRuleGast)) {
          throw Error(`Rule ->${startRuleName}<- does not exist in this grammar.`);
        }
        return nextPossibleTokensAfter([startRuleGast], precedingInput, this.tokenMatcher, this.maxLookahead);
      }
      // TODO: should this be a member method or a utility? it does not have any state or usage of 'this'...
      // TODO: should this be more explicitly part of the public API?
      getNextPossibleTokenTypes(grammarPath) {
        const topRuleName = head_default(grammarPath.ruleStack);
        const gastProductions = this.getGAstProductions();
        const topProduction = gastProductions[topRuleName];
        const nextPossibleTokenTypes = new NextAfterTokenWalker(topProduction, grammarPath).startWalking();
        return nextPossibleTokenTypes;
      }
    };
  }
});

// node_modules/chevrotain/lib/src/parse/parser/traits/gast_recorder.js
function recordProd(prodConstructor, mainProdArg, occurrence, handleSep = false) {
  assertMethodIdxIsValid(occurrence);
  const prevProd = last_default(this.recordingProdStack);
  const grammarAction = isFunction_default(mainProdArg) ? mainProdArg : mainProdArg.DEF;
  const newProd = new prodConstructor({ definition: [], idx: occurrence });
  if (handleSep) {
    newProd.separator = mainProdArg.SEP;
  }
  if (has_default(mainProdArg, "MAX_LOOKAHEAD")) {
    newProd.maxLookahead = mainProdArg.MAX_LOOKAHEAD;
  }
  this.recordingProdStack.push(newProd);
  grammarAction.call(this);
  prevProd.definition.push(newProd);
  this.recordingProdStack.pop();
  return RECORDING_NULL_OBJECT;
}
function recordOrProd(mainProdArg, occurrence) {
  assertMethodIdxIsValid(occurrence);
  const prevProd = last_default(this.recordingProdStack);
  const hasOptions = isArray_default(mainProdArg) === false;
  const alts = hasOptions === false ? mainProdArg : mainProdArg.DEF;
  const newOrProd = new Alternation({
    definition: [],
    idx: occurrence,
    ignoreAmbiguities: hasOptions && mainProdArg.IGNORE_AMBIGUITIES === true
  });
  if (has_default(mainProdArg, "MAX_LOOKAHEAD")) {
    newOrProd.maxLookahead = mainProdArg.MAX_LOOKAHEAD;
  }
  const hasPredicates = some_default(alts, (currAlt) => isFunction_default(currAlt.GATE));
  newOrProd.hasPredicates = hasPredicates;
  prevProd.definition.push(newOrProd);
  forEach_default(alts, (currAlt) => {
    const currAltFlat = new Alternative({ definition: [] });
    newOrProd.definition.push(currAltFlat);
    if (has_default(currAlt, "IGNORE_AMBIGUITIES")) {
      currAltFlat.ignoreAmbiguities = currAlt.IGNORE_AMBIGUITIES;
    } else if (has_default(currAlt, "GATE")) {
      currAltFlat.ignoreAmbiguities = true;
    }
    this.recordingProdStack.push(currAltFlat);
    currAlt.ALT.call(this);
    this.recordingProdStack.pop();
  });
  return RECORDING_NULL_OBJECT;
}
function getIdxSuffix(idx) {
  return idx === 0 ? "" : `${idx}`;
}
function assertMethodIdxIsValid(idx) {
  if (idx < 0 || idx > MAX_METHOD_IDX) {
    const error = new Error(
      // The stack trace will contain all the needed details
      `Invalid DSL Method idx value: <${idx}>
	Idx value must be a none negative value smaller than ${MAX_METHOD_IDX + 1}`
    );
    error.KNOWN_RECORDER_ERROR = true;
    throw error;
  }
}
var RECORDING_NULL_OBJECT, HANDLE_SEPARATOR, MAX_METHOD_IDX, RFT, RECORDING_PHASE_TOKEN, RECORDING_PHASE_CSTNODE, GastRecorder;
var init_gast_recorder = __esm({
  "node_modules/chevrotain/lib/src/parse/parser/traits/gast_recorder.js"() {
    init_lodash();
    init_api2();
    init_lexer_public();
    init_tokens();
    init_tokens_public();
    init_parser();
    init_keys2();
    RECORDING_NULL_OBJECT = {
      description: "This Object indicates the Parser is during Recording Phase"
    };
    Object.freeze(RECORDING_NULL_OBJECT);
    HANDLE_SEPARATOR = true;
    MAX_METHOD_IDX = Math.pow(2, BITS_FOR_OCCURRENCE_IDX) - 1;
    RFT = createToken({ name: "RECORDING_PHASE_TOKEN", pattern: Lexer.NA });
    augmentTokenTypes([RFT]);
    RECORDING_PHASE_TOKEN = createTokenInstance(
      RFT,
      "This IToken indicates the Parser is in Recording Phase\n	See: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details",
      // Using "-1" instead of NaN (as in EOF) because an actual number is less likely to
      // cause errors if the output of LA or CONSUME would be (incorrectly) used during the recording phase.
      -1,
      -1,
      -1,
      -1,
      -1,
      -1
    );
    Object.freeze(RECORDING_PHASE_TOKEN);
    RECORDING_PHASE_CSTNODE = {
      name: "This CSTNode indicates the Parser is in Recording Phase\n	See: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details",
      children: {}
    };
    GastRecorder = class {
      initGastRecorder(config) {
        this.recordingProdStack = [];
        this.RECORDING_PHASE = false;
      }
      enableRecording() {
        this.RECORDING_PHASE = true;
        this.TRACE_INIT("Enable Recording", () => {
          for (let i = 0; i < 10; i++) {
            const idx = i > 0 ? i : "";
            this[`CONSUME${idx}`] = function(arg1, arg2) {
              return this.consumeInternalRecord(arg1, i, arg2);
            };
            this[`SUBRULE${idx}`] = function(arg1, arg2) {
              return this.subruleInternalRecord(arg1, i, arg2);
            };
            this[`OPTION${idx}`] = function(arg1) {
              return this.optionInternalRecord(arg1, i);
            };
            this[`OR${idx}`] = function(arg1) {
              return this.orInternalRecord(arg1, i);
            };
            this[`MANY${idx}`] = function(arg1) {
              this.manyInternalRecord(i, arg1);
            };
            this[`MANY_SEP${idx}`] = function(arg1) {
              this.manySepFirstInternalRecord(i, arg1);
            };
            this[`AT_LEAST_ONE${idx}`] = function(arg1) {
              this.atLeastOneInternalRecord(i, arg1);
            };
            this[`AT_LEAST_ONE_SEP${idx}`] = function(arg1) {
              this.atLeastOneSepFirstInternalRecord(i, arg1);
            };
          }
          this[`consume`] = function(idx, arg1, arg2) {
            return this.consumeInternalRecord(arg1, idx, arg2);
          };
          this[`subrule`] = function(idx, arg1, arg2) {
            return this.subruleInternalRecord(arg1, idx, arg2);
          };
          this[`option`] = function(idx, arg1) {
            return this.optionInternalRecord(arg1, idx);
          };
          this[`or`] = function(idx, arg1) {
            return this.orInternalRecord(arg1, idx);
          };
          this[`many`] = function(idx, arg1) {
            this.manyInternalRecord(idx, arg1);
          };
          this[`atLeastOne`] = function(idx, arg1) {
            this.atLeastOneInternalRecord(idx, arg1);
          };
          this.ACTION = this.ACTION_RECORD;
          this.BACKTRACK = this.BACKTRACK_RECORD;
          this.LA = this.LA_RECORD;
        });
      }
      disableRecording() {
        this.RECORDING_PHASE = false;
        this.TRACE_INIT("Deleting Recording methods", () => {
          const that = this;
          for (let i = 0; i < 10; i++) {
            const idx = i > 0 ? i : "";
            delete that[`CONSUME${idx}`];
            delete that[`SUBRULE${idx}`];
            delete that[`OPTION${idx}`];
            delete that[`OR${idx}`];
            delete that[`MANY${idx}`];
            delete that[`MANY_SEP${idx}`];
            delete that[`AT_LEAST_ONE${idx}`];
            delete that[`AT_LEAST_ONE_SEP${idx}`];
          }
          delete that[`consume`];
          delete that[`subrule`];
          delete that[`option`];
          delete that[`or`];
          delete that[`many`];
          delete that[`atLeastOne`];
          delete that.ACTION;
          delete that.BACKTRACK;
          delete that.LA;
        });
      }
      //   Parser methods are called inside an ACTION?
      //   Maybe try/catch/finally on ACTIONS while disabling the recorders state changes?
      // @ts-expect-error -- noop place holder
      ACTION_RECORD(impl) {
      }
      // Executing backtracking logic will break our recording logic assumptions
      BACKTRACK_RECORD(grammarRule, args) {
        return () => true;
      }
      // LA is part of the official API and may be used for custom lookahead logic
      // by end users who may forget to wrap it in ACTION or inside a GATE
      LA_RECORD(howMuch) {
        return END_OF_FILE;
      }
      topLevelRuleRecord(name, def) {
        try {
          const newTopLevelRule = new Rule({ definition: [], name });
          newTopLevelRule.name = name;
          this.recordingProdStack.push(newTopLevelRule);
          def.call(this);
          this.recordingProdStack.pop();
          return newTopLevelRule;
        } catch (originalError) {
          if (originalError.KNOWN_RECORDER_ERROR !== true) {
            try {
              originalError.message = originalError.message + '\n	 This error was thrown during the "grammar recording phase" For more info see:\n	https://chevrotain.io/docs/guide/internals.html#grammar-recording';
            } catch (mutabilityError) {
              throw originalError;
            }
          }
          throw originalError;
        }
      }
      // Implementation of parsing DSL
      optionInternalRecord(actionORMethodDef, occurrence) {
        return recordProd.call(this, Option, actionORMethodDef, occurrence);
      }
      atLeastOneInternalRecord(occurrence, actionORMethodDef) {
        recordProd.call(this, RepetitionMandatory, actionORMethodDef, occurrence);
      }
      atLeastOneSepFirstInternalRecord(occurrence, options) {
        recordProd.call(this, RepetitionMandatoryWithSeparator, options, occurrence, HANDLE_SEPARATOR);
      }
      manyInternalRecord(occurrence, actionORMethodDef) {
        recordProd.call(this, Repetition, actionORMethodDef, occurrence);
      }
      manySepFirstInternalRecord(occurrence, options) {
        recordProd.call(this, RepetitionWithSeparator, options, occurrence, HANDLE_SEPARATOR);
      }
      orInternalRecord(altsOrOpts, occurrence) {
        return recordOrProd.call(this, altsOrOpts, occurrence);
      }
      subruleInternalRecord(ruleToCall, occurrence, options) {
        assertMethodIdxIsValid(occurrence);
        if (!ruleToCall || has_default(ruleToCall, "ruleName") === false) {
          const error = new Error(`<SUBRULE${getIdxSuffix(occurrence)}> argument is invalid expecting a Parser method reference but got: <${JSON.stringify(ruleToCall)}>
 inside top level rule: <${this.recordingProdStack[0].name}>`);
          error.KNOWN_RECORDER_ERROR = true;
          throw error;
        }
        const prevProd = last_default(this.recordingProdStack);
        const ruleName = ruleToCall.ruleName;
        const newNoneTerminal = new NonTerminal({
          idx: occurrence,
          nonTerminalName: ruleName,
          label: options === null || options === void 0 ? void 0 : options.LABEL,
          // The resolving of the `referencedRule` property will be done once all the Rule's GASTs have been created
          referencedRule: void 0
        });
        prevProd.definition.push(newNoneTerminal);
        return this.outputCst ? RECORDING_PHASE_CSTNODE : RECORDING_NULL_OBJECT;
      }
      consumeInternalRecord(tokType, occurrence, options) {
        assertMethodIdxIsValid(occurrence);
        if (!hasShortKeyProperty(tokType)) {
          const error = new Error(`<CONSUME${getIdxSuffix(occurrence)}> argument is invalid expecting a TokenType reference but got: <${JSON.stringify(tokType)}>
 inside top level rule: <${this.recordingProdStack[0].name}>`);
          error.KNOWN_RECORDER_ERROR = true;
          throw error;
        }
        const prevProd = last_default(this.recordingProdStack);
        const newNoneTerminal = new Terminal({
          idx: occurrence,
          terminalType: tokType,
          label: options === null || options === void 0 ? void 0 : options.LABEL
        });
        prevProd.definition.push(newNoneTerminal);
        return RECORDING_PHASE_TOKEN;
      }
    };
  }
});

// node_modules/chevrotain/lib/src/parse/parser/traits/perf_tracer.js
var PerformanceTracer;
var init_perf_tracer = __esm({
  "node_modules/chevrotain/lib/src/parse/parser/traits/perf_tracer.js"() {
    init_lodash();
    init_api();
    init_parser();
    PerformanceTracer = class {
      initPerformanceTracer(config) {
        if (has_default(config, "traceInitPerf")) {
          const userTraceInitPerf = config.traceInitPerf;
          const traceIsNumber = typeof userTraceInitPerf === "number";
          this.traceInitMaxIdent = traceIsNumber ? userTraceInitPerf : Infinity;
          this.traceInitPerf = traceIsNumber ? userTraceInitPerf > 0 : userTraceInitPerf;
        } else {
          this.traceInitMaxIdent = 0;
          this.traceInitPerf = DEFAULT_PARSER_CONFIG.traceInitPerf;
        }
        this.traceInitIndent = -1;
      }
      TRACE_INIT(phaseDesc, phaseImpl) {
        if (this.traceInitPerf === true) {
          this.traceInitIndent++;
          const indent = new Array(this.traceInitIndent + 1).join("	");
          if (this.traceInitIndent < this.traceInitMaxIdent) {
            console.log(`${indent}--> <${phaseDesc}>`);
          }
          const { time, value } = timer(phaseImpl);
          const traceMethod = time > 10 ? console.warn : console.log;
          if (this.traceInitIndent < this.traceInitMaxIdent) {
            traceMethod(`${indent}<-- <${phaseDesc}> time: ${time}ms`);
          }
          this.traceInitIndent--;
          return value;
        } else {
          return phaseImpl();
        }
      }
    };
  }
});

// node_modules/chevrotain/lib/src/parse/parser/utils/apply_mixins.js
function applyMixins(derivedCtor, baseCtors) {
  baseCtors.forEach((baseCtor) => {
    const baseProto = baseCtor.prototype;
    Object.getOwnPropertyNames(baseProto).forEach((propName) => {
      if (propName === "constructor") {
        return;
      }
      const basePropDescriptor = Object.getOwnPropertyDescriptor(baseProto, propName);
      if (basePropDescriptor && (basePropDescriptor.get || basePropDescriptor.set)) {
        Object.defineProperty(derivedCtor.prototype, propName, basePropDescriptor);
      } else {
        derivedCtor.prototype[propName] = baseCtor.prototype[propName];
      }
    });
  });
}
var init_apply_mixins = __esm({
  "node_modules/chevrotain/lib/src/parse/parser/utils/apply_mixins.js"() {
  }
});

// node_modules/chevrotain/lib/src/parse/parser/parser.js
var END_OF_FILE, DEFAULT_PARSER_CONFIG, DEFAULT_RULE_CONFIG, ParserDefinitionErrorType, Parser2, CstParser;
var init_parser = __esm({
  "node_modules/chevrotain/lib/src/parse/parser/parser.js"() {
    init_lodash();
    init_api();
    init_follow();
    init_tokens_public();
    init_errors_public();
    init_gast_resolver_public();
    init_recoverable();
    init_looksahead();
    init_tree_builder();
    init_lexer_adapter();
    init_recognizer_api();
    init_recognizer_engine();
    init_error_handler();
    init_context_assist();
    init_gast_recorder();
    init_perf_tracer();
    init_apply_mixins();
    init_checks();
    END_OF_FILE = createTokenInstance(EOF, "", NaN, NaN, NaN, NaN, NaN, NaN);
    Object.freeze(END_OF_FILE);
    DEFAULT_PARSER_CONFIG = Object.freeze({
      recoveryEnabled: false,
      maxLookahead: 3,
      dynamicTokensEnabled: false,
      outputCst: true,
      errorMessageProvider: defaultParserErrorProvider,
      nodeLocationTracking: "none",
      traceInitPerf: false,
      skipValidations: false
    });
    DEFAULT_RULE_CONFIG = Object.freeze({
      recoveryValueFunc: () => void 0,
      resyncEnabled: true
    });
    (function(ParserDefinitionErrorType2) {
      ParserDefinitionErrorType2[ParserDefinitionErrorType2["INVALID_RULE_NAME"] = 0] = "INVALID_RULE_NAME";
      ParserDefinitionErrorType2[ParserDefinitionErrorType2["DUPLICATE_RULE_NAME"] = 1] = "DUPLICATE_RULE_NAME";
      ParserDefinitionErrorType2[ParserDefinitionErrorType2["INVALID_RULE_OVERRIDE"] = 2] = "INVALID_RULE_OVERRIDE";
      ParserDefinitionErrorType2[ParserDefinitionErrorType2["DUPLICATE_PRODUCTIONS"] = 3] = "DUPLICATE_PRODUCTIONS";
      ParserDefinitionErrorType2[ParserDefinitionErrorType2["UNRESOLVED_SUBRULE_REF"] = 4] = "UNRESOLVED_SUBRULE_REF";
      ParserDefinitionErrorType2[ParserDefinitionErrorType2["LEFT_RECURSION"] = 5] = "LEFT_RECURSION";
      ParserDefinitionErrorType2[ParserDefinitionErrorType2["NONE_LAST_EMPTY_ALT"] = 6] = "NONE_LAST_EMPTY_ALT";
      ParserDefinitionErrorType2[ParserDefinitionErrorType2["AMBIGUOUS_ALTS"] = 7] = "AMBIGUOUS_ALTS";
      ParserDefinitionErrorType2[ParserDefinitionErrorType2["CONFLICT_TOKENS_RULES_NAMESPACE"] = 8] = "CONFLICT_TOKENS_RULES_NAMESPACE";
      ParserDefinitionErrorType2[ParserDefinitionErrorType2["INVALID_TOKEN_NAME"] = 9] = "INVALID_TOKEN_NAME";
      ParserDefinitionErrorType2[ParserDefinitionErrorType2["NO_NON_EMPTY_LOOKAHEAD"] = 10] = "NO_NON_EMPTY_LOOKAHEAD";
      ParserDefinitionErrorType2[ParserDefinitionErrorType2["AMBIGUOUS_PREFIX_ALTS"] = 11] = "AMBIGUOUS_PREFIX_ALTS";
      ParserDefinitionErrorType2[ParserDefinitionErrorType2["TOO_MANY_ALTS"] = 12] = "TOO_MANY_ALTS";
      ParserDefinitionErrorType2[ParserDefinitionErrorType2["CUSTOM_LOOKAHEAD_VALIDATION"] = 13] = "CUSTOM_LOOKAHEAD_VALIDATION";
    })(ParserDefinitionErrorType || (ParserDefinitionErrorType = {}));
    Parser2 = class _Parser {
      /**
       *  @deprecated use the **instance** method with the same name instead
       */
      static performSelfAnalysis(parserInstance2) {
        throw Error("The **static** `performSelfAnalysis` method has been deprecated.	\nUse the **instance** method with the same name instead.");
      }
      performSelfAnalysis() {
        this.TRACE_INIT("performSelfAnalysis", () => {
          let defErrorsMsgs;
          this.selfAnalysisDone = true;
          const className = this.className;
          this.TRACE_INIT("toFastProps", () => {
            toFastProperties(this);
          });
          this.TRACE_INIT("Grammar Recording", () => {
            try {
              this.enableRecording();
              forEach_default(this.definedRulesNames, (currRuleName) => {
                const wrappedRule = this[currRuleName];
                const originalGrammarAction = wrappedRule["originalGrammarAction"];
                let recordedRuleGast;
                this.TRACE_INIT(`${currRuleName} Rule`, () => {
                  recordedRuleGast = this.topLevelRuleRecord(currRuleName, originalGrammarAction);
                });
                this.gastProductionsCache[currRuleName] = recordedRuleGast;
              });
            } finally {
              this.disableRecording();
            }
          });
          let resolverErrors = [];
          this.TRACE_INIT("Grammar Resolving", () => {
            resolverErrors = resolveGrammar2({
              rules: values_default(this.gastProductionsCache)
            });
            this.definitionErrors = this.definitionErrors.concat(resolverErrors);
          });
          this.TRACE_INIT("Grammar Validations", () => {
            if (isEmpty_default(resolverErrors) && this.skipValidations === false) {
              const validationErrors = validateGrammar2({
                rules: values_default(this.gastProductionsCache),
                tokenTypes: values_default(this.tokensMap),
                errMsgProvider: defaultGrammarValidatorErrorProvider,
                grammarName: className
              });
              const lookaheadValidationErrors = validateLookahead({
                lookaheadStrategy: this.lookaheadStrategy,
                rules: values_default(this.gastProductionsCache),
                tokenTypes: values_default(this.tokensMap),
                grammarName: className
              });
              this.definitionErrors = this.definitionErrors.concat(validationErrors, lookaheadValidationErrors);
            }
          });
          if (isEmpty_default(this.definitionErrors)) {
            if (this.recoveryEnabled) {
              this.TRACE_INIT("computeAllProdsFollows", () => {
                const allFollows = computeAllProdsFollows(values_default(this.gastProductionsCache));
                this.resyncFollows = allFollows;
              });
            }
            this.TRACE_INIT("ComputeLookaheadFunctions", () => {
              var _a2, _b2;
              (_b2 = (_a2 = this.lookaheadStrategy).initialize) === null || _b2 === void 0 ? void 0 : _b2.call(_a2, {
                rules: values_default(this.gastProductionsCache)
              });
              this.preComputeLookaheadFunctions(values_default(this.gastProductionsCache));
            });
          }
          if (!_Parser.DEFER_DEFINITION_ERRORS_HANDLING && !isEmpty_default(this.definitionErrors)) {
            defErrorsMsgs = map_default(this.definitionErrors, (defError) => defError.message);
            throw new Error(`Parser Definition Errors detected:
 ${defErrorsMsgs.join("\n-------------------------------\n")}`);
          }
        });
      }
      constructor(tokenVocabulary, config) {
        this.definitionErrors = [];
        this.selfAnalysisDone = false;
        const that = this;
        that.initErrorHandler(config);
        that.initLexerAdapter();
        that.initLooksAhead(config);
        that.initRecognizerEngine(tokenVocabulary, config);
        that.initRecoverable(config);
        that.initTreeBuilder(config);
        that.initContentAssist();
        that.initGastRecorder(config);
        that.initPerformanceTracer(config);
        if (has_default(config, "ignoredIssues")) {
          throw new Error("The <ignoredIssues> IParserConfig property has been deprecated.\n	Please use the <IGNORE_AMBIGUITIES> flag on the relevant DSL method instead.\n	See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#IGNORING_AMBIGUITIES\n	For further details.");
        }
        this.skipValidations = has_default(config, "skipValidations") ? config.skipValidations : DEFAULT_PARSER_CONFIG.skipValidations;
      }
    };
    Parser2.DEFER_DEFINITION_ERRORS_HANDLING = false;
    applyMixins(Parser2, [
      Recoverable,
      LooksAhead,
      TreeBuilder,
      LexerAdapter,
      RecognizerEngine,
      RecognizerApi,
      ErrorHandler,
      ContentAssist,
      GastRecorder,
      PerformanceTracer
    ]);
    CstParser = class extends Parser2 {
      constructor(tokenVocabulary, config = DEFAULT_PARSER_CONFIG) {
        const configClone = clone_default(config);
        configClone.outputCst = true;
        super(tokenVocabulary, configClone);
      }
    };
  }
});

// node_modules/@chevrotain/cst-dts-gen/lib/src/model.js
var init_model2 = __esm({
  "node_modules/@chevrotain/cst-dts-gen/lib/src/model.js"() {
    init_api2();
  }
});

// node_modules/@chevrotain/cst-dts-gen/lib/src/generate.js
var init_generate = __esm({
  "node_modules/@chevrotain/cst-dts-gen/lib/src/generate.js"() {
  }
});

// node_modules/@chevrotain/cst-dts-gen/lib/src/api.js
var init_api4 = __esm({
  "node_modules/@chevrotain/cst-dts-gen/lib/src/api.js"() {
    init_model2();
    init_generate();
  }
});

// node_modules/chevrotain/lib/src/diagrams/render_public.js
var init_render_public = __esm({
  "node_modules/chevrotain/lib/src/diagrams/render_public.js"() {
    init_version();
  }
});

// node_modules/chevrotain/lib/src/api.js
var init_api5 = __esm({
  "node_modules/chevrotain/lib/src/api.js"() {
    init_version();
    init_parser();
    init_lexer_public();
    init_tokens_public();
    init_lookahead();
    init_llk_lookahead();
    init_errors_public();
    init_exceptions_public();
    init_lexer_errors_public();
    init_api2();
    init_api2();
    init_api4();
    init_render_public();
  }
});

// node_modules/struct-compile/src/strings.js
function trim(str) {
  return str.replaceAll("\n", " ").replace(/(\s)\s+/g, "$1").trim();
}
var isWhitespace, skipWhitespace, isCapital, toString2, trimWithEllipsis;
var init_strings = __esm({
  "node_modules/struct-compile/src/strings.js"() {
    isWhitespace = (c) => /\s/.test(c);
    skipWhitespace = (str, i) => {
      const n = str.length;
      while (i < n && isWhitespace(str[i])) {
        i++;
      }
      return i;
    };
    isCapital = (str) => str[0].toUpperCase() == str[0];
    toString2 = (obj) => {
      return obj.toString();
    };
    trimWithEllipsis = (str, n = 8) => {
      if (typeof str != "string") {
        return "";
      }
      if (str.length <= n) {
        return str;
      }
      return str.slice(0, n) + "...";
    };
  }
});

// node_modules/struct-compile/src/trie.js
var TrieNode, Trie;
var init_trie = __esm({
  "node_modules/struct-compile/src/trie.js"() {
    init_strings();
    TrieNode = class {
      constructor(value) {
        this.value = value;
        this.children = {};
        this.isEnd = false;
      }
    };
    Trie = class {
      constructor() {
        this.root = new TrieNode("");
      }
      add(text) {
        let current = this.root;
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (!current.children[ch]) {
            current.children[ch] = new TrieNode(ch);
          }
          current = current.children[ch];
        }
        current.isEnd = true;
      }
      search(text, startOffset) {
        const n = text.length;
        let current = this.root;
        let res = null;
        let i = skipWhitespace(text, startOffset);
        if (i == n) return res;
        for (; i < text.length; i++) {
          const ch = text[i];
          if (!current.children[ch]) {
            return res;
          }
          current = current.children[ch];
          if (isWhitespace(current.value)) {
            i = skipWhitespace(text, i) - 1;
          }
          if (current.isEnd) {
            if (i < text.length - 1 && /\w/.test(text[i + 1])) {
              continue;
            } else {
              res = [text.slice(startOffset, i + 1)];
            }
          }
        }
        return res;
      }
    };
  }
});

// node_modules/struct-compile/src/dataTypes.js
function matchType(str, startOffset) {
  return trie.search(str, startOffset);
}
var cDataTypes, typeKeywords, trie;
var init_dataTypes = __esm({
  "node_modules/struct-compile/src/dataTypes.js"() {
    init_trie();
    cDataTypes = {
      "char": { signed: true, length: 8 },
      "signed char": { signed: true, length: 8 },
      "unsigned char": { signed: false, length: 8 },
      "short": { signed: true, length: 16 },
      "unsigned short": { signed: false, length: 16 },
      "int": {
        signed: true,
        length: (arch) => arch.bits == 64 ? 32 : 16
      },
      "unsigned int": {
        signed: false,
        length: (arch) => arch.bits == 64 ? 32 : 16
      },
      "long": {
        signed: true,
        length: (arch) => arch.bits == 64 ? 64 : 32
      },
      "unsigned long": {
        signed: false,
        length: (arch) => arch.bits == 64 ? 64 : 32
      },
      "long long": { signed: true, length: 64 },
      "unsigned long long": { signed: false, length: 64 },
      "bool": { signed: false, length: 8 },
      "float": { signed: true, length: 32, floating: true, customKey: "Float" },
      "double": { signed: true, length: 64, floating: true, customKey: "Double" },
      "long double": {
        floating: true,
        signed: true,
        //length: (arch) => arch.bits == 64 ? 128 : 96,
        length: (arch) => {
          throw new Error("long double not supported");
        }
      },
      //stdint.h
      "int8_t": { signed: true, length: 8 },
      "uint8_t": { signed: false, length: 8 },
      "int16_t": { signed: true, length: 16 },
      "uint16_t": { signed: false, length: 16 },
      "int32_t": { signed: true, length: 32 },
      "uint32_t": { signed: false, length: 32 },
      "int64_t": { signed: true, length: 64 },
      "uint64_t": { signed: false, length: 64 },
      "int_least8_t": { signed: true, length: 8 },
      "uint_least8_t": { signed: false, length: 8 },
      "int_least16_t": { signed: true, length: 16 },
      "uint_least16_t": { signed: false, length: 16 },
      "int_least32_t": { signed: true, length: 32 },
      "uint_least32_t": { signed: false, length: 32 },
      "int_least64_t": { signed: true, length: 64 },
      "uint_least64_t": { signed: false, length: 64 },
      "int_fast8_t": { signed: true, length: 8 },
      "uint_fast8_t": { signed: false, length: 8 },
      "int_fast16_t": { signed: true, length: 16 },
      "uint_fast16_t": { signed: false, length: 16 },
      "int_fast32_t": { signed: true, length: 32 },
      "uint_fast32_t": { signed: false, length: 32 },
      "int_fast64_t": { signed: true, length: 64 },
      "uint_fast64_t": { signed: false, length: 64 },
      "intptr_t": {
        signed: true,
        length: (arch) => arch.bits == 64 ? 64 : 32
      },
      "uintptr_t": {
        signed: false,
        length: (arch) => arch.bits == 64 ? 64 : 32
      },
      "intmax_t": { signed: true, length: 64 },
      "uintmax_t": { signed: false, length: 64 },
      "void": { signed: false, length: 0 }
    };
    typeKeywords = Object.keys(cDataTypes);
    trie = new Trie();
    for (const key of typeKeywords) {
      trie.add(key);
    }
  }
});

// node_modules/struct-compile/src/lexer.js
var allTokens, addToken, tokens, StructLexer;
var init_lexer2 = __esm({
  "node_modules/struct-compile/src/lexer.js"() {
    init_api5();
    init_dataTypes();
    allTokens = [];
    addToken = (tk) => {
      const res = createToken(tk);
      allTokens.push(res);
      return res;
    };
    tokens = {};
    tokens.WhiteSpace = addToken({ name: "Whitespace", pattern: /[\s\n]+/, group: Lexer.SKIPPED });
    tokens.MultiLineComment = addToken({ name: "MultiLineComment", pattern: /\/\*.*?\*\//, group: Lexer.SKIPPED });
    tokens.Const = addToken({ name: "Const", pattern: /const\b/, group: Lexer.SKIPPED });
    tokens.Pointer = addToken({ name: "Pointer", pattern: /\*/ });
    tokens.Semicolon = addToken({ name: "Semicolon", pattern: /;/ });
    tokens.Colon = addToken({ name: "Colon", pattern: /:/ });
    tokens.OneLineComment = addToken({ name: "OneLineComment", pattern: /\/\/.*?\n/ });
    tokens.RoundBracketOpen = addToken({ name: "RoundBracketOpen", pattern: /\(/ });
    tokens.RoundBracketClose = addToken({ name: "RoundBracketClose", pattern: /\)/ });
    tokens.SquareBracketOpen = addToken({ name: "SquareBracketOpen", pattern: /\[/ });
    tokens.SquareBracketClose = addToken({ name: "SquareBracketClose", pattern: /\]/ });
    tokens.BracesOpen = addToken({ name: "BracesOpen", pattern: /\{/ });
    tokens.BracesClose = addToken({ name: "BracesClose", pattern: /\}/ });
    tokens.TypeKeyword = addToken({ name: "TypeKeyword", pattern: { exec: matchType }, line_breaks: true });
    tokens.Struct = addToken({ name: "Struct", pattern: /struct\b/ });
    tokens.Union = addToken({ name: "Union", pattern: /union\b/ });
    tokens.Attributes = addToken({ name: "Attributes", pattern: /__attribute__/ });
    tokens.CString = addToken({ name: "CString", pattern: /"([^"]*)"/ });
    tokens.Identifier = addToken({ name: "Identifier", pattern: /[_a-zA-Z][\w_]*/ });
    tokens.Comma = addToken({ name: "Comma", pattern: /,/ });
    tokens.Num = addToken({ name: "Num", pattern: /[0-9]+/ });
    tokens.AnyToken = addToken({ name: "AnyToken", pattern: /./ });
    StructLexer = new Lexer(allTokens);
  }
});

// node_modules/struct-compile/src/parser.js
function parseInput(text, method = "structs", verbose = false) {
  const lexingResult = StructLexer.tokenize(text);
  if (verbose) {
    console.log("[*] Lexing result", lexingResult.tokens);
  }
  parserInstance.input = lexingResult.tokens;
  const cstOutput = parserInstance[method]();
  return { cstOutput, text, lexingResult };
}
var StructParser, parserInstance;
var init_parser2 = __esm({
  "node_modules/struct-compile/src/parser.js"() {
    init_api5();
    init_lexer2();
    StructParser = class extends CstParser {
      constructor() {
        super(allTokens);
        const $ = this;
        this.initBracketLame(tokens.RoundBracketOpen, tokens.RoundBracketClose, "bracketExpression");
        this.initSquareBracket();
        this.initAttributesDecl();
        this.initMemberName();
        this.initNestedDecl();
        this.initMemberDecl();
        this.initStructDecl();
        this.initStructDecls();
        this.performSelfAnalysis();
      }
      initAnyTokenConsumer(name, except = []) {
        const $ = this;
        $.RULE(name, () => {
          $.OR([
            ...allTokens.filter((e) => !except.includes(e)).map((e) => ({ ALT: () => $.CONSUME(e) }))
          ]);
        });
      }
      initBracketLame(op, cl, name, additionalSubrules = []) {
        const $ = this;
        $.RULE(name, () => {
          $.CONSUME(op);
          $.MANY(() => {
            $.OR([
              { ALT: () => $.CONSUME(tokens.Identifier) },
              { ALT: () => $.CONSUME(tokens.Semicolon) },
              { ALT: () => $.CONSUME(tokens.CString) },
              { ALT: () => $.CONSUME(tokens.Comma) },
              { ALT: () => $.CONSUME(tokens.Num) },
              { ALT: () => $.SUBRULE($[name]) },
              ...additionalSubrules.map((e) => ({ ALT: () => $.SUBRULE($[e]) }))
            ]);
          });
          $.CONSUME(cl);
        });
      }
      initSquareBracket() {
        const $ = this;
        $.RULE("squareBracketExpression", () => {
          $.CONSUME(tokens.SquareBracketOpen);
          $.MANY(() => {
            $.CONSUME(tokens.Num);
          });
          $.CONSUME(tokens.SquareBracketClose);
        });
      }
      initMemberName() {
        const $ = this;
        $.RULE("memberName", () => {
          $.CONSUME(tokens.Identifier);
          $.OPTION1(() => {
            $.OR([
              {
                ALT: () => {
                  $.CONSUME(tokens.Colon);
                  $.CONSUME(tokens.Num);
                }
              },
              {
                ALT: () => {
                  $.MANY(() => {
                    $.SUBRULE($.squareBracketExpression);
                  });
                }
              }
            ]);
          });
        });
      }
      // `struct Name`, `union Name` or an inline `struct [Name] { ... }` used as a member type
      initNestedDecl() {
        const $ = this;
        $.RULE("nested", () => {
          $.OR([
            { ALT: () => $.CONSUME(tokens.Struct) },
            { ALT: () => $.CONSUME(tokens.Union) }
          ]);
          $.OPTION1(() => {
            $.SUBRULE1($.attributes);
          });
          $.OPTION2(() => {
            $.CONSUME(tokens.Identifier);
          });
          $.OPTION3(() => {
            $.CONSUME(tokens.BracesOpen);
            $.MANY(() => {
              $.SUBRULE($.member);
            });
            $.CONSUME(tokens.BracesClose);
            $.OPTION4(() => {
              $.SUBRULE2($.attributes);
            });
          });
        });
      }
      initMemberDecl() {
        const $ = this;
        $.RULE("member", () => {
          $.OPTION1(() => {
            $.CONSUME1(tokens.OneLineComment);
          });
          $.OR([
            { ALT: () => $.CONSUME(tokens.TypeKeyword) },
            { ALT: () => $.SUBRULE($.nested) }
          ]);
          $.MANY1(() => {
            $.CONSUME(tokens.Pointer);
          });
          $.OPTION2(() => {
            $.SUBRULE1($.memberName);
            $.MANY2(() => {
              $.CONSUME(tokens.Comma);
              $.SUBRULE2($.memberName);
            });
          });
          $.CONSUME(tokens.Semicolon);
        });
      }
      initAttributesDecl() {
        const $ = this;
        $.RULE("attributes", () => {
          $.CONSUME(tokens.Attributes);
          $.SUBRULE($.bracketExpression);
        });
      }
      initStructDecl() {
        const $ = this;
        $.RULE("struct", () => {
          $.OPTION1(() => {
            $.CONSUME(tokens.OneLineComment);
          });
          $.OR([
            { ALT: () => $.CONSUME(tokens.Struct) },
            { ALT: () => $.CONSUME(tokens.Union) }
          ]);
          $.OPTION2(() => {
            $.SUBRULE1($.attributes);
          });
          $.CONSUME(tokens.Identifier);
          $.CONSUME(tokens.BracesOpen);
          $.MANY(() => {
            $.SUBRULE($.member);
          });
          $.CONSUME(tokens.BracesClose);
          $.OPTION3(() => {
            $.SUBRULE2($.attributes);
          });
          $.CONSUME(tokens.Semicolon);
        });
      }
      initStructDecls() {
        const $ = this;
        $.RULE("structs", () => {
          $.MANY(() => {
            $.SUBRULE($.struct);
          });
        });
      }
    };
    parserInstance = new StructParser();
  }
});

// node_modules/struct-compile/src/visitor.js
function traverseResult(cstOutput) {
  return interpreter.visit(cstOutput);
}
var BaseCstVisitor, StructVisitor, interpreter;
var init_visitor2 = __esm({
  "node_modules/struct-compile/src/visitor.js"() {
    init_parser2();
    init_strings();
    BaseCstVisitor = parserInstance.getBaseCstVisitorConstructorWithDefaults();
    StructVisitor = class extends BaseCstVisitor {
      constructor() {
        super();
        this.metaRex = /@\w+/g;
        this.validateVisitor();
      }
      structs(ctx) {
        if (!ctx?.struct?.length) return [];
        const structs = Array.from({ length: ctx.struct.length }, (_, i) => this.visit(ctx.struct[i]));
        return structs;
      }
      struct(ctx) {
        const name = ctx.Identifier?.[0]?.image ?? null;
        const attributes = ctx.attributes ? this.visit(ctx.attributes) : null;
        const members = Array.from({ length: ctx.member.length ?? 0 }, (_, i) => this.visit(ctx.member[i]));
        const comment = ctx.OneLineComment?.[0]?.image ?? null;
        const meta = this._buildMeta(comment);
        const res = { name, attributes, members, meta };
        if (ctx.Union) {
          res.union = true;
        }
        return this._buildComment(res, comment);
      }
      // A struct / union used as a member type. No `members` means a reference by name.
      nested(ctx) {
        const res = {
          name: ctx.Identifier?.[0]?.image ?? null,
          attributes: ctx.attributes ? this.visit(ctx.attributes) : null,
          meta: {}
        };
        if (ctx.BracesOpen) {
          res.members = Array.from({ length: ctx.member?.length ?? 0 }, (_, i) => this.visit(ctx.member[i]));
        }
        if (ctx.Union) {
          res.union = true;
        }
        return res;
      }
      _buildComment(res, comment) {
        if (comment) {
          res.comment = comment.slice(comment.indexOf("//") + 2).trim();
        }
        return res;
      }
      _buildMeta(comment) {
        const meta = {};
        let match;
        while (match = this.metaRex.exec(comment)) {
          meta[match[0].slice(1)] = true;
        }
        return meta;
      }
      member(ctx) {
        const comment = ctx.OneLineComment?.[0]?.image ?? null;
        const vars = Array.from({ length: ctx?.memberName?.length ?? 0 }, (_, i) => this.visit(ctx.memberName[i]));
        const nested = ctx.nested ? this.visit(ctx.nested) : null;
        let type;
        if (nested) {
          type = nested.union ? "union" : "struct";
          if (nested.name) {
            type += ` ${nested.name}`;
          }
        } else {
          type = trim(ctx.TypeKeyword[0].image);
        }
        if (ctx.Pointer) {
          type += " ";
          type += ctx.Pointer.map((e) => e.image).join("");
        }
        const meta = this._buildMeta(comment);
        const res = { type, vars, meta };
        if (nested && !ctx.Pointer) {
          res.struct = nested;
        }
        return this._buildComment(res, comment);
      }
      memberName(ctx) {
        const name = ctx.Identifier[0].image;
        const d = Array.from(
          { length: ctx.squareBracketExpression?.length ?? 0 },
          (_, i) => this.visit(ctx.squareBracketExpression[i], { forMember: true })?.value
        );
        const res = {
          name,
          d
        };
        if (ctx.Colon) {
          const { Num } = ctx;
          res.bits = parseInt(Num[0].image);
        }
        return res;
      }
      attributes(ctx) {
        const tokens2 = this.visit(ctx.bracketExpression, { isAttr: true });
        const res = {};
        for (let i = 0; i < tokens2.length; ++i) {
          if (tokens2[i] == "packed" || tokens2[i] == "__packed__") {
            res.packed = true;
          }
          if (tokens2[i] == "aligned" || tokens2[i] == "__aligned__") {
            let num = 0;
            if (i < tokens2.length - 1 && !Number.isNaN(num = parseInt(tokens2[i + 1]))) {
              res.aligned = num;
            } else {
              res.aligned = true;
            }
          }
        }
        return res;
      }
      bracketExpression(ctx, params = {}) {
        if (params.isAttr) {
          const toLift = !params.isChild;
          params.isChild = true;
          let res = [];
          for (const key of Object.keys(ctx)) {
            if (key == "RoundBracketOpen" || key == "RoundBracketClose") continue;
            if (isCapital(key)) {
              res.push(...ctx[key].map((e) => ({ value: e, type: key, offset: e.startOffset })));
            } else {
              res.push(...Array.from({ length: ctx[key].length }, (_, i) => this.visit(ctx[key][i], params)));
            }
          }
          res = res.flat().sort((a, b) => a.offset - b.offset);
          if (toLift) {
            res = res.map((e) => e.value.image);
          }
          return res;
        } else {
          throw new Error("Unable to parse");
        }
      }
      squareBracketExpression(ctx, params = {}) {
        if (params.forMember) {
          const offset = ctx.SquareBracketOpen[0].startOffset;
          if (ctx.Num) {
            return {
              offset,
              value: parseInt(ctx.Num[0].image)
            };
          }
          return {
            offset,
            value: 0
          };
        } else {
          throw new Error("Unable to parse");
        }
      }
    };
    interpreter = new StructVisitor();
  }
});

// node_modules/struct-compile/src/array.js
var multiDimGet, multiDimSet;
var init_array = __esm({
  "node_modules/struct-compile/src/array.js"() {
    multiDimGet = (obj, d) => {
      const [length] = d;
      const newD = d.slice(1);
      if (newD.length == 0) {
        return Array.from({ length }, (_, i) => obj[i]);
      }
      return Array.from({ length }, (_, i) => multiDimGet(obj[i], newD));
    };
    multiDimSet = (obj, d, v) => {
      const [length] = d;
      const newD = d.slice(1);
      const n = Math.min(v.length, length);
      if (newD.length == 0) {
        for (let i = 0; i < n; ++i) {
          obj[i] = v[i];
        }
      }
      for (let i = 0; i < n; ++i) {
        if (Array.isArray(v[i])) {
          multiDimSet(obj[i], newD, v[i]);
        } else {
          obj[i] = v[i];
        }
      }
    };
  }
});

// node_modules/struct-compile/src/number.js
var maybeNumber, forSize;
var init_number = __esm({
  "node_modules/struct-compile/src/number.js"() {
    maybeNumber = (val) => {
      const tmp = parseInt(val);
      return Number.isNaN(tmp) ? val : tmp;
    };
    forSize = (size, val, floating = false) => {
      if (size > 32 && !floating) {
        return BigInt(val);
      }
      if (typeof val == "number" || typeof val == "bigint") {
        return val;
      }
      const mbNum = maybeNumber(val);
      if (typeof mbNum == "number") {
        return mbNum;
      }
      if (size == 8 && typeof val == "string" && val.length == 1) {
        return val.charCodeAt(0);
      }
      throw new Error(`Invalid value for setting: ${val}`);
    };
  }
});

// node_modules/struct-compile/src/reader.js
var import_node_stream, SingleStructReader, StructReader;
var init_reader = __esm({
  "node_modules/struct-compile/src/reader.js"() {
    import_node_stream = require("node:stream");
    SingleStructReader = class {
      constructor(options) {
        const { Struct, useSlice = false, toObject = false, selfEnd = true } = options;
        this.Struct = Struct;
        this.useSlice = useSlice;
        this.toObject = toObject;
        this.selfEnd = selfEnd;
        this.size = Struct.prototype.config.length;
        this.reset();
      }
      write(chunk) {
        this.bufs.push(chunk);
        this.currentSize += chunk.length;
        if (this.currentSize >= this.size) {
          this.buf = Buffer.concat(this.bufs);
          this.result = new this.Struct(this.useSlice ? this.buf.slice(0, this.size) : this.buf.subarray(0, this.size));
          if (this.toObject) {
            this.result = this.result.toObject();
          }
          this.finished = true;
          if (this.currentSize > this.size) {
            this.remaining = this.useSlice ? this.buf.slice(this.size) : this.buf.subarray(this.size);
          }
        }
      }
      reset() {
        this.currentSize = 0;
        this.bufs = [];
        this.finished = false;
        this.remaining = null;
      }
    };
    StructReader = class extends import_node_stream.Transform {
      constructor(options) {
        const { Struct, useSlice = false, toObject = true, ...other } = options;
        super({ ...other, objectMode: true });
        this.Struct = Struct;
        this.useSlice = useSlice;
        this.reader = new SingleStructReader({
          Struct,
          useSlice,
          toObject
        });
      }
      _transform(chunk, encoding, callback) {
        this.reader.write(chunk);
        while (this.reader.finished) {
          const { result, remaining } = this.reader;
          this.push(result);
          this.reader.reset();
          this.reader.write(remaining);
        }
        callback();
      }
    };
  }
});

// node_modules/struct-compile/src/createStruct/endianness.js
function endiannessFromMeta(defaultEndianness, meta) {
  let isBE = false;
  let isLE = false;
  if (meta.BE || meta.NE) {
    isBE = true;
  } else if (meta.LE) {
    isLE = true;
  }
  if (isBE && isLE) {
    throw new Error("Cannot have both BE and LE");
  }
  if (isBE) {
    return "BE";
  }
  if (isLE) {
    return "LE";
  }
  return defaultEndianness;
}
var init_endianness = __esm({
  "node_modules/struct-compile/src/createStruct/endianness.js"() {
  }
});

// node_modules/struct-compile/src/createStruct/layout.js
function alignOffset(offset, length) {
  if (offset == 0 || length == 0) return offset;
  const extra = length - 1 - (offset - 1) % length;
  return offset + extra;
}
function bitFieldStorageName(count) {
  return `_bitfield${count}`;
}
function getPropertyData(arch, { type, meta, vars, comment }) {
  let length, signed, customKey, floating = false;
  if (type.includes("*")) {
    length = arch.pointerSize * 8;
    signed = false;
  } else {
    ({ signed, length, customKey, floating = false } = cDataTypes[type]);
    if (typeof length == "function") {
      length = length(arch);
    }
  }
  return vars.map((v) => {
    const { name, d = [], bits } = v;
    const res = { name, meta, signed, length, floating, customKey, d, comment, bits, type };
    if (d.some((k) => k == 0)) {
      res.length = 0;
    }
    return res;
  });
}
function resolveAlignment(attributes, pointerSize) {
  let { packed = false, aligned } = attributes ?? {};
  let skipAlign = false;
  if (aligned === true) {
    aligned = pointerSize;
  } else if (aligned === void 0) {
    if (packed) {
      skipAlign = true;
    } else {
      aligned = -1;
    }
  } else {
    aligned = parseInt(aligned);
    if (Number.isNaN(aligned)) {
      throw new Error(`Invalid aligned value: ${aligned}`);
    }
  }
  return { packed, aligned, skipAlign };
}
function computeLayout(def, arch, compileNested) {
  const { attributes, members, meta, union = false } = def;
  const structEndianness = endiannessFromMeta(arch.endianness, meta);
  const { packed, skipAlign, aligned: initialAligned } = resolveAlignment(attributes, arch.pointerSize);
  let aligned = initialAligned;
  const fields = [];
  const units = [];
  const props = {};
  const comments = {};
  let offset = 0;
  let end = 0;
  let prev = null;
  let unit = null;
  let bitsOffset = 0;
  const place = (alignment) => {
    if (!packed) {
      offset = alignOffset(offset, alignment);
    }
    if (!skipAlign) {
      aligned = Math.max(aligned, alignment);
    }
    return offset;
  };
  const register = (name, prop, comment) => {
    if (props[name] !== void 0) {
      throw new Error(`Duplicate member names: ${name}`);
    }
    props[name] = prop;
    if (comment) {
      comments[name] = comment;
    }
  };
  const begin = () => {
    if (union) {
      offset = 0;
      prev = null;
    }
  };
  const finish = () => {
    end = Math.max(end, offset);
  };
  const addNested = (member2) => {
    const endianness = endiannessFromMeta(structEndianness, member2.meta);
    if (member2.vars.length == 0) {
      const inner = computeLayout(member2.struct, { ...arch, endianness }, compileNested);
      begin();
      const base = place(inner.align);
      for (const u of inner.units) {
        u.offset += base;
        u.name = bitFieldStorageName(units.length + 1);
        units.push(u);
      }
      for (const f of inner.fields) {
        register(f.name, inner.props[f.name], inner.comments[f.name]);
        if (f.offset !== void 0) {
          f.offset += base;
        }
        fields.push(f);
      }
      offset += inner.size;
      prev = null;
      finish();
      return;
    }
    const Inner = compileNested(member2.struct, endianness);
    for (const { name, d = [] } of member2.vars) {
      const empty = d.some((k) => k == 0);
      register(name, {
        name,
        meta: member2.meta,
        d,
        comment: member2.comment,
        type: member2.type,
        struct: Inner,
        length: empty ? 0 : Inner.size * 8
      }, member2.comment);
      begin();
      if (empty) {
        fields.push({ kind: "empty", name });
      } else {
        const count = d.reduce((a, b) => a * b, 1);
        const field = {
          kind: "struct",
          name,
          Inner,
          bytes: Inner.size,
          offset: place(Inner.align),
          d,
          count,
          total: count * Inner.size
        };
        offset += field.total;
        fields.push(field);
      }
      prev = null;
      finish();
    }
  };
  for (const member2 of members) {
    if (isNested(member2)) {
      addNested(member2);
      continue;
    }
    for (const prop of getPropertyData(arch, member2)) {
      const { name } = prop;
      register(name, prop, prop.comment);
      begin();
      const endianness = endiannessFromMeta(structEndianness, prop.meta);
      const base = {
        name,
        bytes: prop.length / 8,
        signed: !!prop.signed,
        floating: !!prop.floating,
        endianness
      };
      if (prop.bits > 0) {
        const fits = prev?.bits > 0 && prev.type == prop.type && prop.length - bitsOffset >= prop.bits;
        if (!fits) {
          unit = {
            ...base,
            name: bitFieldStorageName(units.length + 1),
            offset: place(base.bytes),
            members: []
          };
          offset += unit.bytes;
          bitsOffset = 0;
          units.push(unit);
        }
        const field = { kind: "bits", name, unit, bitOffset: bitsOffset, bits: prop.bits };
        unit.members.push(field);
        fields.push(field);
        bitsOffset += prop.bits;
      } else if (prop.length == 0) {
        fields.push({ kind: "empty", name });
      } else if (prop.d.length > 0) {
        const count = prop.d.reduce((a, b) => a * b, 1);
        const field = { ...base, kind: "array", offset: place(base.bytes), d: prop.d, count, total: count * base.bytes };
        offset += field.total;
        fields.push(field);
      } else {
        const field = { ...base, kind: "scalar", offset: place(base.bytes) };
        offset += field.bytes;
        fields.push(field);
      }
      prev = prop;
      finish();
    }
  }
  if (union) {
    for (const f of fields) {
      f.optional = true;
    }
  }
  return {
    fields,
    units,
    props,
    comments,
    size: skipAlign ? end : alignOffset(end, aligned),
    align: skipAlign ? 1 : Math.max(aligned, 1)
  };
}
var isNested;
var init_layout = __esm({
  "node_modules/struct-compile/src/createStruct/layout.js"() {
    init_dataTypes();
    init_endianness();
    isNested = (member2) => member2.struct !== void 0 && !member2.type.includes("*");
  }
});

// node_modules/struct-compile/src/createStruct/codegen.js
function methodName(action, { bytes: bytes2, signed, floating }, endianness) {
  if (floating) {
    return `${action}${bytes2 == 4 ? "Float" : "Double"}${endianness}`;
  }
  if (bytes2 == 8) {
    return `${action}Big${signed ? "" : "U"}Int64${endianness}`;
  }
  return `${action}${signed ? "" : "U"}Int${bytes2 * 8}${bytes2 > 1 ? endianness : ""}`;
}
function readExpr(f, b, pos, endianness, inline) {
  if (!inline || f.floating || f.bytes == 8) {
    return `${b}.${methodName("read", f, endianness)}(${pos(0)})`;
  }
  const byte = (i) => `${b}[${pos(endianness == "BE" ? f.bytes - 1 - i : i)}]`;
  if (f.bytes == 1) {
    return f.signed ? `(${byte(0)}<<24>>24)` : byte(0);
  }
  if (f.bytes == 2) {
    const expr2 = `(${byte(1)}<<8|${byte(0)})`;
    return f.signed ? `(${expr2}<<16>>16)` : expr2;
  }
  const expr = `${byte(3)}<<24|${byte(2)}<<16|${byte(1)}<<8|${byte(0)}`;
  return f.signed ? `(${expr})` : `((${expr})>>>0)`;
}
function convExpr(f, v, endianness) {
  const fallback = `$cv(${v},${f.bytes * 8},${f.floating},"${methodName("read", f, endianness)}")`;
  const fastType = !f.floating && f.bytes == 8 ? "bigint" : "number";
  return `(typeof ${v}==="${fastType}"?${v}:${fallback})`;
}
function writeStmt(f, b, pos, endianness, value, inline) {
  const method = `${b}.${methodName("write", f, endianness)}`;
  if (!inline || f.floating || f.bytes == 8) {
    return `${method}(${value},${pos(0)});`;
  }
  const fits = {
    1: f.signed ? "(w<<24>>24)" : "(w&255)",
    2: f.signed ? "(w<<16>>16)" : "(w&65535)",
    4: f.signed ? "(w|0)" : "(w>>>0)"
  }[f.bytes];
  const stores = [];
  for (let i = 0; i < f.bytes; ++i) {
    const at = pos(endianness == "BE" ? f.bytes - 1 - i : i);
    stores.push(`${b}[${at}]=${i == 0 ? "w" : `w>>>${i * 8}`};`);
  }
  return `{const w=${value};if(${fits}===w){${stores.join("")}}else ${method}(w,${pos(0)});}`;
}
function bitsGetExpr(f, u) {
  const { bits, bitOffset: off } = f;
  if (f.unit.bytes == 8) {
    return `(${u}>>${off}n&${(1n << BigInt(bits)) - 1n}n)`;
  }
  if (bits >= 32) {
    return u;
  }
  return off > 0 ? `(${u}>>>${off}&${bitMask(bits)})` : `(${u}&${bitMask(bits)})`;
}
function bitsSetExpr(f, u, v) {
  const { bits, bitOffset: off } = f;
  if (f.unit.bytes == 8) {
    const mask2 = (1n << BigInt(bits)) - 1n;
    return `(${u}&${~(mask2 << BigInt(off))}n|($big(${v})&${mask2}n)<<${off}n)`;
  }
  const mask = bitMask(bits);
  return `((${u}&${~(mask << off)}|(${v}&${mask})<<${off})>>>0)`;
}
function bitsPackExpr(unit, valueOf2) {
  if (unit.bytes == 8) {
    return unit.members.map((f) => `($big(${valueOf2(f)})&${(1n << BigInt(f.bits)) - 1n}n)<<${f.bitOffset}n`).join("|");
  }
  const packed = unit.members.map((f) => `(${valueOf2(f)}&${bitMask(f.bits)})<<${f.bitOffset}`).join("|");
  return `(${packed})>>>0`;
}
function arrayLiteral(f, element, level = 0, offset = f.offset) {
  const n = f.d[level];
  const items = [];
  if (level == f.d.length - 1) {
    for (let i = 0; i < n; ++i) {
      items.push(element(offset + i * f.bytes));
    }
  } else {
    const chunk = f.d.slice(level + 1).reduce((a, k) => a * k, f.bytes);
    for (let i = 0; i < n; ++i) {
      items.push(arrayLiteral(f, element, level + 1, offset + i * chunk));
    }
  }
  return `[${items.join(",")}]`;
}
function generate(layout, { inline }) {
  const { fields, units, size } = layout;
  const out = [];
  const emit2 = (line) => out.push(line);
  const descriptors = /* @__PURE__ */ new Map();
  const descriptor = (f, endianness) => {
    const e = f.bytes == 1 && !f.floating ? "LE" : endianness;
    const id = `$d${fields.indexOf(f)}${e}`;
    if (!descriptors.has(id)) {
      const pos = position("p", 0);
      descriptors.set(
        id,
        `const ${id}=$array(${JSON.stringify({ d: f.d, bytes: f.bytes, total: f.total })},function(b,p){return ${readExpr(f, "b", pos, e, inline)};},function(b,p,v){${writeStmt(f, "b", pos, e, convExpr(f, "v", e), inline)}});`
      );
    }
    return id;
  };
  const arrayRead = (f, b, base, endianness) => {
    if (f.count <= UNROLL_LIMIT) {
      return arrayLiteral(f, (offset) => readExpr(f, b, position(base, offset), endianness, inline));
    }
    return `$arrayGet(${b},${position(base, f.offset)()},${descriptor(f, endianness)})`;
  };
  const refs = {};
  const structRef = (f) => {
    const id = `$s${fields.indexOf(f)}`;
    refs[id] = f.Inner;
    return id;
  };
  const spec = (f) => JSON.stringify({ d: f.d, bytes: f.bytes, total: f.total });
  const structViewDescriptor = (f) => {
    const id = `$d${fields.indexOf(f)}V`;
    const S = structRef(f);
    if (!descriptors.has(id)) {
      descriptors.set(
        id,
        `const ${id}=$array(${spec(f)},function(b,p){return new ${S}(b.subarray(p,p+${f.bytes}));},function(b,p,v){$structSet(b,p,${S},v);});`
      );
    }
    return id;
  };
  const structCodecDescriptor = (f, suffix) => {
    const id = `$d${fields.indexOf(f)}C${suffix}`;
    const S = structRef(f);
    if (!descriptors.has(id)) {
      descriptors.set(
        id,
        `const ${id}=$array(${spec(f)},function(b,p){return ${S}.decode${suffix}(b,p);},function(b,p,v){${S}.encode${suffix}(b,p,v);});`
      );
    }
    return id;
  };
  const structRead = (f, b, base, suffix) => {
    const S = structRef(f);
    const element = (offset) => `${S}.decode${suffix}(${b},${position(base, offset)()})`;
    if (f.d.length == 0) {
      return element(f.offset);
    }
    if (f.count <= UNROLL_LIMIT) {
      return arrayLiteral(f, element);
    }
    return `$arrayGet(${b},${position(base, f.offset)()},${structCodecDescriptor(f, suffix)})`;
  };
  emit2(`function Struct(arg,opts){`);
  emit2(`if(arg===undefined){this._buf=$Buffer.alloc(this.length);}`);
  emit2(`else if(arg instanceof $Buffer){`);
  emit2(`if(arg.length<this.length)$short(this.length,arg.length);`);
  emit2(`this._buf=arg;}`);
  emit2(`else if(typeof arg==="object"){`);
  emit2(`const n=opts!==undefined&&opts.toAlloc!==undefined&&opts.toAlloc!==null?opts.toAlloc:this.length;`);
  emit2(`const internal=arg._structCompileInternal;`);
  emit2(`this._buf=internal!==undefined&&internal.zeroed===false?$Buffer.allocUnsafe(n):$Buffer.alloc(n);`);
  emit2(`merge.call(this,arg);}`);
  emit2(`}`);
  emit2(`const P=Struct.prototype;`);
  const accessors = [];
  const scalarAccessor = (f) => {
    const pos = position(null, f.offset);
    accessors.push(
      `${literalKey(f.name)}:{get(){const b=this._buf;return ${readExpr(f, "b", pos, f.endianness, inline)};},set(v){const b=this._buf;${writeStmt(f, "b", pos, f.endianness, convExpr(f, "v", f.endianness), inline)}}}`
    );
  };
  for (const unit of units) {
    scalarAccessor(unit);
  }
  for (const f of fields) {
    if (f.kind == "scalar") {
      scalarAccessor(f);
    } else if (f.kind == "array") {
      const id = descriptor(f, f.endianness);
      accessors.push(
        `${literalKey(f.name)}:{get(){return $arrayView(this._buf.subarray(${f.offset},${f.offset + f.total}),${id});},set(v){$arraySet(this._buf,${f.offset},${id},v);}}`
      );
    } else if (f.kind == "struct") {
      const S = structRef(f);
      const range = `${f.offset},${f.offset + f.total}`;
      if (f.d.length > 0) {
        const id = structViewDescriptor(f);
        accessors.push(
          `${literalKey(f.name)}:{get(){return $arrayView(this._buf.subarray(${range}),${id});},set(v){$arraySet(this._buf,${f.offset},${id},v);}}`
        );
      } else {
        accessors.push(
          `${literalKey(f.name)}:{get(){return new ${S}(this._buf.subarray(${range}));},set(v){$structSet(this._buf,${f.offset},${S},v);}}`
        );
      }
    } else if (f.kind == "bits") {
      const { unit } = f;
      const pos = position(null, unit.offset);
      const u = readExpr(unitSpec(unit), "b", pos, unit.endianness, inline);
      accessors.push(
        `${literalKey(f.name)}:{get(){const b=this._buf;return ${bitsGetExpr(f, u)};},set(v){const b=this._buf;${writeStmt(unitSpec(unit), "b", pos, unit.endianness, bitsSetExpr(f, u, "v"), inline)}}}`
      );
    }
  }
  const accessorsAt = out.length;
  emit2("");
  const objectItems = fields.map((f) => {
    let value = member("this", f.name);
    if (f.kind == "array") {
      value = arrayRead(f, "b", null, f.endianness);
    } else if (f.kind == "struct") {
      value = structRead(f, "b", null, "");
    }
    return `${literalKey(f.name)}:${value}`;
  });
  emit2(`P.toObject=function toObject(){`);
  if (fields.some((f) => f.kind == "array" || f.kind == "struct")) {
    emit2(`const b=this._buf;`);
  }
  emit2(`const r={${objectItems.join(",")}};`);
  emit2(`if($extras.length!==0)$extrasToObject(this,r);`);
  emit2(`return r;};`);
  emit2(`function merge(o){let v;`);
  for (const f of fields) {
    const target = member("this", f.name);
    const dims = layout.props[f.name].d;
    if (dims.length > 0) {
      emit2(`if((v=${member("o", f.name)})!==undefined){if(Array.isArray(v))$multiDimSet(${target},${JSON.stringify(dims)},v);else ${target}=v;}`);
    } else {
      emit2(`if((v=${member("o", f.name)})!==undefined)${target}=v;`);
    }
  }
  emit2(`if($extras.length!==0)$extrasMerge(this,o);`);
  emit2(`}`);
  emit2(`P.merge=merge;`);
  const stringItems = fields.filter((f) => f.kind != "struct" && layout.props[f.name].d.length == 0).map((f) => `+${JSON.stringify(` | ${f.name}: `)}+$str(${member("this", f.name)})`);
  emit2(`P.toString=function toString(){`);
  emit2(`return $head${stringItems.join("")}+($extras.length!==0?$extrasToString(this):"")+">";};`);
  const codec = (suffix, override) => {
    const e = (f) => override ?? f.endianness;
    const prelude = [];
    const items = [];
    for (const f of fields) {
      if (f.kind == "scalar") {
        items.push(`${literalKey(f.name)}:${readExpr(f, "b", position("o", f.offset), e(f), inline)}`);
      } else if (f.kind == "array") {
        items.push(`${literalKey(f.name)}:${arrayRead(f, "b", "o", e(f))}`);
      } else if (f.kind == "struct") {
        items.push(`${literalKey(f.name)}:${structRead(f, "b", "o", suffix)}`);
      } else if (f.kind == "bits") {
        const { unit } = f;
        const local = `u${units.indexOf(unit)}`;
        if (unit.members[0] === f) {
          prelude.push(`const ${local}=${readExpr(unitSpec(unit), "b", position("o", unit.offset), e(unit), inline)};`);
        }
        items.push(`${literalKey(f.name)}:${bitsGetExpr(f, local)}`);
      }
    }
    emit2(`Struct.decode${suffix}=function decode${suffix}(b,o){`);
    emit2(`if(o===undefined)o=0;`);
    if (inline) {
      emit2(`if(!(o>=0&&o+${size}<=b.length))$range(b,o);`);
    }
    emit2(prelude.join(""));
    emit2(`return{${items.join(",")}};};`);
    emit2(`Struct.encode${suffix}=function encode${suffix}(b,o,v){let t;`);
    if (inline) {
      emit2(`if(!(o>=0&&o+${size}<=b.length))$range(b,o);`);
    }
    const provided = (f, stmt) => f.optional ? `if((t=${member("v", f.name)})!==undefined){${stmt}}` : `t=${member("v", f.name)};${stmt}`;
    for (const f of fields) {
      if (f.kind == "scalar") {
        emit2(provided(f, writeStmt(f, "b", position("o", f.offset), e(f), convExpr(f, "t", e(f)), inline)));
      } else if (f.kind == "array") {
        emit2(`$arraySet(b,${position("o", f.offset)()},${descriptor(f, e(f))},${member("v", f.name)});`);
      } else if (f.kind == "struct") {
        const pos = position("o", f.offset)();
        if (f.d.length > 0) {
          emit2(`$arraySet(b,${pos},${structCodecDescriptor(f, suffix)},${member("v", f.name)});`);
        } else {
          emit2(provided(f, `${structRef(f)}.encode${suffix}(b,${pos},t);`));
        }
      } else if (f.kind == "bits" && f.optional) {
        const { unit } = f;
        const pos = position("o", unit.offset);
        const u = readExpr(unitSpec(unit), "b", pos, e(unit), inline);
        emit2(provided(f, writeStmt(unitSpec(unit), "b", pos, e(unit), bitsSetExpr(f, u, "t"), inline)));
      } else if (f.kind == "bits" && f.unit.members[0] === f) {
        const { unit } = f;
        const packed = bitsPackExpr(unit, (m) => member("v", m.name));
        emit2(writeStmt(unitSpec(unit), "b", position("o", unit.offset), e(unit), packed, inline));
      }
    }
    emit2(`};`);
  };
  codec("", null);
  codec("LE", "LE");
  codec("BE", "BE");
  emit2(`return Struct;`);
  out[accessorsAt] = [...descriptors.values()].join("\n") + `
Object.defineProperties(P,{${accessors.join(",\n")}});`;
  return { source: out.join("\n"), refs };
}
var IDENT_RE, isIdent, literalKey, member, position, unitSpec, bitMask, UNROLL_LIMIT;
var init_codegen = __esm({
  "node_modules/struct-compile/src/createStruct/codegen.js"() {
    IDENT_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
    isIdent = (name) => IDENT_RE.test(name) && name != "__proto__";
    literalKey = (name) => isIdent(name) ? name : `[${JSON.stringify(name)}]`;
    member = (obj, name) => isIdent(name) ? `${obj}.${name}` : `${obj}[${JSON.stringify(name)}]`;
    position = (base, offset) => (n = 0) => {
      const total = offset + n;
      if (base === null) return String(total);
      return total == 0 ? base : `${base}+${total}`;
    };
    unitSpec = (unit) => ({ bytes: unit.bytes, signed: false, floating: false });
    bitMask = (bits) => bits >= 32 ? -1 : 2 ** bits - 1;
    UNROLL_LIMIT = 32;
  }
});

// node_modules/struct-compile/src/createStruct/arrays.js
function arrayGet(buf, pos, desc, level = 0) {
  const { d, bytes: bytes2, read } = desc;
  const n = d[level];
  const res = new Array(n);
  if (level == d.length - 1) {
    for (let i = 0; i < n; ++i) {
      res[i] = read(buf, pos + i * bytes2);
    }
    return res;
  }
  const chunk = desc.chunks[level];
  for (let i = 0; i < n; ++i) {
    res[i] = arrayGet(buf, pos + i * chunk, desc, level + 1);
  }
  return res;
}
function arraySet(buf, pos, desc, val, level = 0) {
  if (val === void 0 || val === null) return;
  const size = level == 0 ? desc.total : desc.chunks[level - 1];
  if (val instanceof desc.BufferImpl) {
    val.copy(buf, pos, 0, Math.min(val.length, size));
  } else if (Array.isArray(val)) {
    const { d, bytes: bytes2, write } = desc;
    const n = Math.min(val.length, d[level]);
    if (level == d.length - 1) {
      for (let i = 0; i < n; ++i) {
        write(buf, pos + i * bytes2, val[i]);
      }
    } else {
      const chunk = desc.chunks[level];
      for (let i = 0; i < n; ++i) {
        arraySet(buf, pos + i * chunk, desc, val[i], level + 1);
      }
    }
  } else {
    buf.subarray(pos, pos + size).write(val.toString());
  }
}
function createHandler(desc, level) {
  const { d, bytes: bytes2, read, write } = desc;
  const k = d[level];
  const leaf = level == d.length - 1;
  const chunk = leaf ? bytes2 : desc.chunks[level];
  const checkIndex = (index) => {
    if (index < 0 || index >= k) {
      throw new Error(`Out of bounds value, expected index to be 0 <= index < ${k}`);
    }
  };
  return {
    get(target, _prop) {
      if (typeof _prop == "symbol") {
        return target[_prop];
      }
      const prop = maybeNumber(_prop);
      if (typeof prop == "number") {
        checkIndex(prop);
        if (leaf) {
          return read(target, prop * chunk);
        }
        return new Proxy(target.subarray(prop * chunk, (prop + 1) * chunk), desc.handlers[level + 1]);
      }
      const res = target[prop];
      return typeof res == "function" ? res.bind(target) : res;
    },
    set(target, _prop, val) {
      if (typeof _prop == "symbol") {
        target[_prop] = val;
        return true;
      }
      const prop = maybeNumber(_prop);
      if (typeof prop == "number") {
        checkIndex(prop);
        if (leaf) {
          write(target, prop * chunk, val);
        } else {
          arraySet(target, prop * chunk, desc, val, level + 1);
        }
        return true;
      }
      target[prop] = val;
      return true;
    }
  };
}
function createArrayDescriptor({ d, bytes: bytes2, total }, read, write, BufferImpl) {
  const desc = { d, bytes: bytes2, total, read, write, BufferImpl, chunks: [], handlers: [] };
  let chunk = total;
  for (let level = 0; level < d.length; ++level) {
    chunk /= d[level];
    desc.chunks.push(chunk);
  }
  for (let level = 0; level < d.length; ++level) {
    desc.handlers.push(createHandler(desc, level));
  }
  return desc;
}
function arrayView(buf, desc) {
  return new Proxy(buf, desc.handlers[0]);
}
var init_arrays = __esm({
  "node_modules/struct-compile/src/createStruct/arrays.js"() {
    init_number();
  }
});

// node_modules/struct-compile/src/createStruct/index.js
function resolve5(def, registry) {
  const members = def.members.map((member2) => {
    const nested = member2.struct;
    if (nested === void 0) {
      return member2;
    }
    if (nested.members === void 0) {
      const found = registry.get(nested.name);
      if (found === void 0) {
        throw new Error(`Unknown type: ${member2.type}`);
      }
      if (!!found.union != !!nested.union) {
        throw new Error(`${nested.name} is declared as a ${found.union ? "union" : "struct"}, but used as ${member2.type}`);
      }
      return { ...member2, struct: found };
    }
    return { ...member2, struct: resolve5(nested, registry) };
  });
  const res = { ...def, members, meta: def.meta ?? {} };
  if (def.name) {
    registry.set(def.name, res);
  }
  return res;
}
function createContext(arch, BufferImpl) {
  const registry = /* @__PURE__ */ new Map();
  const cache = /* @__PURE__ */ new Map();
  const compileResolved = (def, inherited) => {
    const endianness = endiannessFromMeta(inherited, def.meta);
    let variants = cache.get(def);
    if (variants === void 0) {
      cache.set(def, variants = {});
    }
    return variants[endianness] ??= build(def, { ...arch, endianness }, BufferImpl, compileResolved);
  };
  return {
    compile: (def) => compileResolved(resolve5(def, registry), arch.endianness)
  };
}
function build(def, arch, BufferImpl, compileNested) {
  const { attributes, members, meta, comment } = def;
  const name = def.name ?? (def.union ? "union" : "struct");
  const layout = computeLayout(def, arch, compileNested);
  const { size, props } = layout;
  const extras = [];
  const fields = new Proxy(props, {
    set(target, key, value) {
      if (typeof key == "string" && !(key in target)) {
        extras.push(key);
      }
      target[key] = value;
      return true;
    },
    deleteProperty(target, key) {
      const index = extras.indexOf(key);
      if (index >= 0) {
        extras.splice(index, 1);
      }
      return delete target[key];
    }
  });
  const helpers = {
    $Buffer: BufferImpl,
    $extras: extras,
    $head: `<${name}`,
    $multiDimSet: multiDimSet,
    $arrayGet: arrayGet,
    $arraySet: arraySet,
    $arrayView: arrayView,
    $structSet(buf, pos, Inner, val) {
      if (val === void 0 || val === null) return;
      if (val instanceof Inner) {
        val = val._buf;
      }
      if (val instanceof BufferImpl) {
        val.copy(buf, pos, 0, Math.min(val.length, Inner.size));
      } else {
        new Inner(buf.subarray(pos, pos + Inner.size)).merge(val);
      }
    },
    $array: (spec, read, write) => createArrayDescriptor(spec, read, write, BufferImpl),
    $short(expected, got) {
      throw new Error(`Invalid buffer length: expected at least ${expected} bytes, got ${got} bytes`);
    },
    $range(buf, offset) {
      throw new RangeError(`Out of range: ${name} takes ${size} bytes at offset ${offset}, buffer length is ${buf?.length}`);
    },
    $cv: (val, bits, floating, getter) => val instanceof BufferImpl ? val[getter]() : forSize(bits, val, floating),
    $big: (val) => typeof val == "bigint" ? val : BigInt(val ?? 0),
    $str: (val) => trimWithEllipsis(toString2(val)),
    $extrasToObject(self2, res) {
      for (const key of extras) {
        const { d } = props[key];
        res[key] = d?.length > 0 && d[0] != 0 ? multiDimGet(self2[key], d) : self2[key];
      }
    },
    $extrasMerge(self2, obj) {
      for (const key of extras) {
        const val = obj[key];
        if (val === void 0) continue;
        const { d } = props[key];
        if (d.length > 0 && Array.isArray(val)) {
          multiDimSet(self2[key], d, val);
        } else {
          self2[key] = val;
        }
      }
    },
    $extrasToString(self2) {
      let res = "";
      for (const key of extras) {
        if (props[key].d.length == 0) {
          res += ` | ${key}: ${trimWithEllipsis(toString2(self2[key]))}`;
        }
      }
      return res;
    }
  };
  const { source, refs } = generate(layout, { inline: isBytes(BufferImpl) });
  Object.assign(helpers, refs);
  const params = [...HELPERS, ...Object.keys(refs)];
  const Struct = new Function(...params, `"use strict";
${source}`)(...params.map((key) => helpers[key]));
  Object.defineProperty(Struct, "name", { value: name });
  Object.defineProperty(Struct.prototype, "config", { value: { ...def, name, fields, length: size } });
  Object.defineProperty(Struct.prototype, "BufferImpl", { value: BufferImpl });
  Object.defineProperty(Struct.prototype, "length", {
    value: size,
    writable: true,
    configurable: true
  });
  Object.defineProperty(Struct.prototype, "buffer", {
    get() {
      return this._buf;
    },
    set(val) {
      if (!(val instanceof BufferImpl)) {
        throw new Error(`Invalid buffer type: expected ${BufferImpl}`);
      }
      if (val.length < this.length) {
        throw new Error(`Invalid buffer length: expected at least ${this.length} bytes, got ${val.length} bytes`);
      }
      this._buf = val;
    }
  });
  Struct.size = size;
  Struct.align = layout.align;
  Struct.comments = layout.comments;
  if (comment) {
    Struct.comments.main = comment;
  }
  Struct.createSingleReader = function(options = {}) {
    return new SingleStructReader({ ...options, Struct });
  };
  Struct.createReader = function(options = {}) {
    return new StructReader({ ...options, Struct });
  };
  return Struct;
}
function createMany(structs, arch, BufferImpl) {
  if (!structs) return {};
  const context2 = createContext(arch, BufferImpl);
  const res = {};
  for (const def of structs) {
    res[def.name] = context2.compile(def);
  }
  return res;
}
var HELPERS, isBytes;
var init_createStruct = __esm({
  "node_modules/struct-compile/src/createStruct/index.js"() {
    init_strings();
    init_array();
    init_number();
    init_reader();
    init_layout();
    init_endianness();
    init_codegen();
    init_arrays();
    init_layout();
    HELPERS = [
      "$Buffer",
      "$short",
      "$range",
      "$cv",
      "$big",
      "$str",
      "$head",
      "$array",
      "$arrayGet",
      "$arraySet",
      "$arrayView",
      "$structSet",
      "$multiDimSet",
      "$extras",
      "$extrasToObject",
      "$extrasMerge",
      "$extrasToString"
    ];
    isBytes = (BufferImpl) => BufferImpl === Uint8Array || BufferImpl.prototype instanceof Uint8Array;
  }
});

// node_modules/struct-compile/src/currentArch.js
var import_os, is64, currentArch;
var init_currentArch = __esm({
  "node_modules/struct-compile/src/currentArch.js"() {
    import_os = __toESM(require("os"), 1);
    if (import_os.default.machine) {
      is64 = import_os.default.machine().includes("64");
    } else {
      const arch = import_os.default.arch();
      if (arch.includes("64") || arch == "mipsel") {
        is64 = true;
      } else {
        is64 = false;
      }
    }
    currentArch = {
      endianness: import_os.default.endianness(),
      pointerSize: is64 ? 8 : 4,
      bits: is64 ? 64 : 32
    };
  }
});

// node_modules/struct-compile/src/index.js
function compile(str, arch = currentArch, BufferImpl = Buffer) {
  return createMany(traverseResult(parseInput(str).cstOutput), arch, BufferImpl);
}
var init_src = __esm({
  "node_modules/struct-compile/src/index.js"() {
    init_parser2();
    init_visitor2();
    init_createStruct();
    init_currentArch();
    init_createStruct();
  }
});

// lib/layers/TLV.js
function TLVSerialize(Cls, PaddingCls, opts, { skipTypes = [], lengthIsTotal = false, align: align2 = null } = {}) {
  let res = Buffer.concat(
    opts.map(
      (e) => skipTypes.includes(e.type) ? new PaddingCls(e).buffer : new Cls(e, { lengthIsTotal }).buffer
    )
  );
  if (align2 !== null && res.length % align2 > 0) {
    res = Buffer.concat([res, Buffer.alloc(alignOffset(res.length, align2) - res.length)]);
  }
  return res;
}
function TLVLength(Cls, PaddingCls, opts, { skipTypes = [], lengthIsTotal = false, align: align2 = null } = {}) {
  let res = 0;
  for (const opt of opts) {
    if (skipTypes.includes(opt.type)) {
      res += PaddingCls.prototype.config.length;
    } else {
      if (lengthIsTotal) {
        res += opt.recLength;
      } else {
        res += opt.recLength + Cls.prototype.config.length;
      }
    }
  }
  if (align2 !== null && res % align2 > 0) {
    res = alignOffset(res, align2);
  }
  return res;
}
var TLVRecord_8, TLVPadding_8, TLV_8, TLVIterator;
var init_TLV = __esm({
  "lib/layers/TLV.js"() {
    init_src();
    ({ TLVRecord_8, TLVPadding_8 } = compile(`
  struct TLVRecord_8 {
    // Record type
    uint8_t type;
    // Record length in bytes
    uint8_t recLength;
    // Record value (variable size)
    uint8_t value[];
  };

  struct TLVPadding_8 {
    // Record type
    uint8_t type;
  };
`));
    TLV_8 = class extends TLVRecord_8 {
      constructor(data = {}, opts = {}) {
        super(data);
        if (!Buffer.isBuffer(data) && typeof data == "object" && data?.value) {
          this.value = data.value;
          this._buf = Buffer.concat([this._buf, data.value]);
        } else {
          this.value = this._buf.subarray(this.length, this.recLength + (opts.lengthIsTotal ? 0 : this.length));
        }
        if (opts.lengthIsTotal) {
          this.length = this.recLength;
        } else {
          this.length += this.recLength;
        }
      }
    };
    TLVIterator = class {
      constructor(Cls, buf, { skipTypes = [], lengthIsTotal = false } = {}) {
        this.Cls = Cls;
        this.buf = buf;
        this.pos = 0;
        this.skipTypes = skipTypes;
        this.lengthIsTotal = lengthIsTotal;
      }
      next() {
        if (this.pos >= this.buf.length) {
          return { done: true };
        }
        const type = this.buf[this.pos];
        if (this.skipTypes.includes(type)) {
          this.pos += 1;
          return { done: false, value: { type } };
        }
        try {
          const res = new this.Cls(this.buf.subarray(this.pos), { lengthIsTotal: this.lengthIsTotal });
          this.pos += res.length;
          return { done: false, value: res.toObject() };
        } catch (err) {
          return { done: true };
        }
      }
      [Symbol.iterator]() {
        return this;
      }
    };
  }
});

// lib/layers/mixins.js
var ctor, lengthAfter, TLV_HEADER_LENGTH, complementOptions, withOptions, mixins_default;
var init_mixins = __esm({
  "lib/layers/mixins.js"() {
    init_TLV();
    ctor = (self2, data, opts) => {
      self2.opts = opts;
      self2.prev = opts.prev ?? null;
      self2.next = null;
      if (self2.prev) {
        self2.prev.next = self2;
      }
    };
    lengthAfter = (layer) => {
      let res = 0;
      for (let cur = layer.next; cur != null; cur = cur.next) {
        res += cur.length;
      }
      return res;
    };
    TLV_HEADER_LENGTH = 2;
    complementOptions = (options, lengthIsTotal) => {
      const res = [];
      for (const opt of options) {
        if (opt.recLength) {
          res.push({ ...opt });
        } else {
          const valueLength = opt?.value?.length ?? 0;
          res.push({ ...opt, recLength: lengthIsTotal ? valueLength + TLV_HEADER_LENGTH : valueLength });
        }
      }
      return res;
    };
    withOptions = (proto, { baseLength, skipTypes = [], lengthIsTotal = false, align: align2 = 4 }) => {
      Object.defineProperty(proto, "options", {
        get() {
          return new TLVIterator(TLV_8, this._buf.subarray(baseLength, this.length), { skipTypes, lengthIsTotal });
        },
        set(opts) {
          const serialized = TLVSerialize(TLV_8, TLVPadding_8, complementOptions(opts, lengthIsTotal), { skipTypes, lengthIsTotal, align: align2 });
          serialized.copy(this._buf, baseLength);
          if (this.config.fields.headerLength !== void 0) {
            this.headerLength = (baseLength + serialized.length) / 4;
          }
        }
      });
      proto.optionsLength = function(opts) {
        if (!opts) {
          return 0;
        }
        return TLVLength(TLV_8, TLVPadding_8, complementOptions(opts, lengthIsTotal), { skipTypes, lengthIsTotal, align: align2 });
      };
      proto._hasOptions = true;
    };
    mixins_default = { ctor, withOptions, lengthAfter };
  }
});

// lib/layers/define.js
function makeLayer(name, structSrc, { osi, linktype: linktype3, length, toAlloc } = {}) {
  const compiled = compile(structSrc);
  const headerKey = Object.keys(compiled).find((k) => k.endsWith("Header")) ?? Object.keys(compiled)[0];
  const Header = compiled[headerKey];
  const baseLength = Header.prototype.config.length;
  let Layer;
  if (length === false) {
    Layer = class extends Header {
      constructor(data = {}, opts = {}) {
        if (Buffer.isBuffer(data)) super(data);
        else {
          super(Buffer.alloc(Layer.toAlloc(data)));
          this.merge(data);
        }
        mixins_default.ctor(this, data, opts);
      }
      defaults() {
      }
      nextProto() {
        return null;
      }
    };
  } else if (typeof length === "function") {
    const lengthFn = length;
    Layer = class extends Header {
      constructor(data = {}, opts = {}) {
        if (Buffer.isBuffer(data)) super(data);
        else {
          super(Buffer.alloc(Layer.toAlloc(data)));
          this.merge(data);
        }
        mixins_default.ctor(this, data, opts);
        this.length = opts.allocated ?? lengthFn(this);
      }
      defaults() {
      }
      nextProto() {
        return null;
      }
    };
  } else {
    Layer = class extends Header {
      constructor(data = {}, opts = {}) {
        if (Buffer.isBuffer(data)) super(data);
        else {
          super(Buffer.alloc(Layer.toAlloc(data)));
          this.merge(data);
        }
        mixins_default.ctor(this, data, opts);
        this.length = opts.allocated ?? baseLength;
      }
      defaults() {
      }
      nextProto() {
        return null;
      }
    };
  }
  Object.defineProperty(Layer, "name", { value: name });
  Layer.prototype.name = name;
  Layer.osi = osi;
  Layer.prototype.osi = osi;
  if (linktype3 !== void 0) Layer.linktype = linktype3;
  Layer.toAlloc = toAlloc ?? (() => baseLength);
  return { Layer, proto: Layer.prototype, Header, baseLength };
}
function assertIdent(s) {
  if (!IDENT_RE2.test(s)) {
    throw new Error(`define.js: ${JSON.stringify(s)} is not a valid JS identifier`);
  }
  return s;
}
function byField(fieldName, table2) {
  assertIdent(fieldName);
  const reverse = /* @__PURE__ */ new Map();
  for (const [key, layerName] of Object.entries(table2)) {
    if (!reverse.has(layerName)) {
      reverse.set(layerName, Number.isNaN(Number(key)) ? key : Number(key));
    }
  }
  return {
    apply(proto) {
      proto.nextProto = new Function(
        "__table",
        `return function nextProto(layers) {
  const Cls = layers[__table[this.${fieldName}]] ?? layers.Payload;
  return new Cls(this.buffer.subarray(this.length), { ...this.opts, prev: this });
};`
      )(table2);
    },
    reverseDefault(fallback) {
      return ($, _layers) => $.next ? reverse.get($.next.name) ?? fallback : fallback;
    }
  };
}
function byPort(table2) {
  return {
    apply(proto) {
      proto.nextProto = new Function(
        "__table",
        `return function nextProto(layers) {
  const Cls = layers[__table[this.dst]] ?? layers[__table[this.src]] ?? layers.Payload;
  const end = Math.min(this._buf.length, this.totalLength);
  return new Cls(this._buf.subarray(this.length, end), { ...this.opts, prev: this });
};`
      )(table2);
    }
  };
}
var checksums, IDENT_RE2, constantName, constantsFrom, attach;
var init_define = __esm({
  "lib/layers/define.js"() {
    init_src();
    init_bindings();
    init_mixins();
    ({ checksums } = bindings_default);
    IDENT_RE2 = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
    constantName = (name) => {
      if (name === name.toUpperCase()) {
        return name;
      }
      return name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").toUpperCase();
    };
    constantsFrom = (source, { prefix = "", skip: skip2 = [] } = {}) => {
      const constants2 = {};
      for (const [name, value] of Object.entries(source)) {
        if (!skip2.includes(name)) {
          constants2[`${prefix}${constantName(name)}`] = value;
        }
      }
      return constants2;
    };
    attach = {
      docs(Layer, { title = null, summary = null, fields = {}, constants: constants2 = [], example = null } = {}) {
        Layer.docs = { title, summary, fields, constants: constants2, example };
      },
      /**
       * Adds a getter/setter pair on the prototype for a virtual field that's
       * computed (rather than stored verbatim) - e.g. macToString, inetNtop.
       */
      virtualField(proto, name, { get: get2, set }) {
        Object.defineProperty(proto, name, {
          get: get2,
          set,
          enumerable: true,
          configurable: true
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
      defaults(proto, table2) {
        const fns = [];
        const lines = [];
        for (const key of Object.keys(table2)) {
          assertIdent(key);
          const v = table2[key];
          if (typeof v === "function") {
            const idx = fns.length;
            fns.push(v);
            lines.push(`if (obj.${key} === undefined) this.${key} = __fns[${idx}](this, layers);`);
          } else {
            lines.push(`if (obj.${key} === undefined) this.${key} = ${JSON.stringify(v)};`);
          }
        }
        proto.defaults = new Function(
          "__fns",
          `return function defaults(obj, layers) {
  if (obj == null) obj = {};
  ${lines.join("\n  ")}
};`
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
        tlv8(Layer, proto, { baseLength, skipTypes, lengthIsTotal, align: align2 }) {
          mixins_default.withOptions(proto, { baseLength, skipTypes, lengthIsTotal, align: align2 });
          const previousToAlloc = Layer.toAlloc;
          Layer.toAlloc = (data) => previousToAlloc(data) + proto.optionsLength(data && data.options);
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
        }
      },
      /**
       * IP-style checksum (IPv4 header, ICMP) and pseudo-header L4 checksum
       * (TCP/UDP) installers. Both define proto.calculateChecksum and
       * proto.checksums(obj) so Packet._build's checksum pass picks them up.
       */
      checksum: {
        ip(proto) {
          proto.calculateChecksum = function() {
            this.checksum = 0;
            this.checksum = checksums.ip(this.buffer.subarray(0, this.length));
          };
          proto.checksums = function(obj) {
            if (!obj.checksum) {
              this.calculateChecksum();
            }
          };
        },
        ipOverWholeMessage(proto) {
          proto.calculateChecksum = function() {
            this.checksum = 0;
            this.checksum = checksums.ip(this.buffer);
          };
          proto.checksums = function(obj) {
            if (!obj.checksum) {
              this.calculateChecksum();
            }
          };
        },
        pseudo(proto, protocolType) {
          proto.calculateChecksum = function() {
            const carrier = this.prev?.name;
            if (carrier !== "IPv4" && carrier !== "IPv6") {
              return;
            }
            this.checksum = 0;
            this.checksum = checksums.pseudo({
              data: this.buffer,
              addrType: carrier,
              src: this.prev.src,
              dst: this.prev.dst,
              protocolType
            });
          };
          proto.checksums = function(obj) {
            if (!obj.checksum) {
              this.calculateChecksum();
            }
          };
        }
      }
    };
  }
});

// lib/layers/Ethernet.js
var Ethernet;
var init_Ethernet = __esm({
  "lib/layers/Ethernet.js"() {
    init_enums();
    init_enums2();
    init_osi();
    init_mac();
    init_define();
    Ethernet = (() => {
      const { Layer, proto } = makeLayer("Ethernet", `
    //@NE Ethernet II frame, IEEE 802.3. The link layer of wired and Wi-Fi interfaces as the capture device presents them. An awaited builder adds it by itself when the interface needs it.
    struct EthernetHeader {
      // Destination hardware address. Resolved from the neighbour table when awaited.
      uint8_t dst[6];
      // Source hardware address. The address of the interface when awaited.
      uint8_t src[6];
      // Protocol of the next layer. Filled from the layer that follows.
      uint16_t type;
    } __attribute__(packed);
  `, {
        osi: OsiModelLayers.DataLink,
        linktype: LinkLayerType.LINKTYPE_ETHERNET
      });
      attach.virtualField(proto, "dst", {
        get() {
          return macToString(this._buf.subarray(0, 6));
        },
        set(v) {
          macFromString(v).copy(this._buf, 0);
        }
      });
      attach.virtualField(proto, "src", {
        get() {
          return macToString(this._buf.subarray(6, 12));
        },
        set(v) {
          macFromString(v).copy(this._buf, 6);
        }
      });
      attach.toObjectExtras(proto, ["src", "dst"]);
      const dispatcher = byField("type", {
        [ETHERTYPE.IP]: "IPv4",
        [ETHERTYPE.IPV6]: "IPv6",
        [ETHERTYPE.ARP]: "ARP",
        [ETHERTYPE.VLAN]: "Vlan",
        [ETHERTYPE.IEEE_802_1AD]: "Vlan",
        [ETHERTYPE.PPPOES]: "PPPoESession",
        [ETHERTYPE.PPPOED]: "PPPoEDiscovery",
        [ETHERTYPE.MPLS]: "Mpls",
        [ETHERTYPE.WAKE_ON_LAN]: "WakeOnLanLayer"
      });
      attach.dispatch(proto, dispatcher);
      attach.defaults(proto, {
        type: dispatcher.reverseDefault(ETHERTYPE.IP)
      });
      return Layer;
    })();
    attach.docs(Ethernet, {
      constants: [
        {
          title: "Addresses",
          values: {
            BROADCAST: "ff:ff:ff:ff:ff:ff"
          }
        },
        {
          title: "Next layer",
          field: "type",
          values: {
            TYPE_IPV4: ETHERTYPE.IP,
            ...constantsFrom(ETHERTYPE, { prefix: "TYPE_" })
          }
        }
      ],
      example: "wire.packet().ethernet({ dst: ethernet.BROADCAST }).arp({ opcode: arp.WHO_HAS, protocolDst: '192.168.1.1' })"
    });
  }
});

// lib/af.js
function defaultFamily(addr) {
  if ((0, import_net.isIPv4)(addr)) {
    return socket.AF_INET;
  } else if ((0, import_net.isIPv6)(addr)) {
    return socket.AF_INET6;
  }
  throw new Error(`Uknown addr type ${addr}`);
}
function updateDomain(obj, addr) {
  obj.domain = defaultFamily(addr);
}
var import_net, socket;
var init_af = __esm({
  "lib/af.js"() {
    init_bindings();
    import_net = require("net");
    ({ socket } = bindings_default);
  }
});

// lib/converters.js
var socket2, converters, inetNtop, inetPton, converters_default;
var init_converters = __esm({
  "lib/converters.js"() {
    init_bindings();
    init_af();
    ({ socket: socket2 } = bindings_default);
    ({ converters } = bindings_default);
    ({ inetNtop, inetPton } = converters);
    converters.inetNtop = (...args) => {
      if (args.length == 1) {
        const [addr] = args;
        try {
          return inetNtop(socket2.AF_INET, addr);
        } catch (err) {
          return inetNtop(socket2.AF_INET6, addr);
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
    };
    converters_default = converters;
  }
});

// lib/socket.js
var socket3, SockAddrCxx, SockAddr, socket_default;
var init_socket = __esm({
  "lib/socket.js"() {
    init_bindings();
    init_af();
    ({ socket: socket3 } = bindings_default);
    ({ SockAddr: SockAddrCxx } = socket3);
    SockAddr = class extends SockAddrCxx {
      constructor(obj) {
        super(obj);
        if (this.domain == -1) {
          updateDomain(this, obj.ip);
        }
      }
      get ip() {
        return super.ip;
      }
      set ip(val) {
        if (this.domain == -1) {
          updateDomain(this, val);
        }
        super.ip = val;
      }
    };
    socket3.SockAddr = SockAddr;
    socket_default = socket3;
  }
});

// lib/layers/addr.js
var inetPton2, inetNtop2, AF_INET, AF_INET6, macAddress, ipv4Address;
var init_addr = __esm({
  "lib/layers/addr.js"() {
    init_mac();
    init_converters();
    init_socket();
    ({ inetPton: inetPton2, inetNtop: inetNtop2 } = converters_default);
    ({ AF_INET, AF_INET6 } = socket_default);
    macAddress = (offset) => ({
      get() {
        return macToString(this._buf.subarray(offset, offset + 6));
      },
      set(v) {
        macFromString(v).copy(this._buf, offset);
      }
    });
    ipv4Address = (offset) => ({
      get() {
        return inetNtop2(AF_INET, this._buf.subarray(offset, offset + 4));
      },
      set(v) {
        inetPton2(AF_INET, v).copy(this._buf, offset);
      }
    });
  }
});

// lib/layers/IPv4.js
var ntohs, IP_MORE_FRAGMENTS, IPv4;
var init_IPv4 = __esm({
  "lib/layers/IPv4.js"() {
    init_osi();
    init_enums2();
    init_converters();
    init_define();
    init_addr();
    init_mixins();
    init_enums();
    ({ ntohs } = converters_default);
    IP_MORE_FRAGMENTS = 32;
    IPv4 = (() => {
      const { Layer, proto, baseLength } = makeLayer("IPv4", `
    //@NE Internet Protocol version 4, RFC 791. Carries a packet between hosts. An awaited builder fills the source address, picks the interface from the routing table and adds the link layer.
    struct IPv4Header {
      // Header length in 32-bit words. Filled automatically.
      uint8_t headerLength:4;
      // Always 4.
      uint8_t version:4;
      // DSCP and ECN bits.
      uint8_t typeOfService;
      // Header plus everything after it, in bytes. Filled automatically.
      uint16_t totalLength;
      // Identification used to reassemble fragments.
      uint16_t id;
      //@LE Fragment flags and offset as one raw field.
      uint16_t fragmentOffsetRaw;
      // Hops the packet may still travel. 64 by default.
      uint8_t timeToLive;
      // Protocol of the next layer, one of ipv4.PROTOCOL_*. Filled from the layer that follows.
      uint8_t protocol;
      // Header checksum. Filled automatically.
      uint16_t checksum;
      // Source address. The address of the outgoing interface when awaited.
      uint32_t src;
      // Destination address.
      uint32_t dst;
    } __attribute__(packed);
  `, {
        osi: OsiModelLayers.Network,
        linktype: LinkLayerType.LINKTYPE_IPV4,
        length: ($) => $.headerLength * 4
      });
      attach.virtualField(proto, "src", ipv4Address(12));
      attach.virtualField(proto, "dst", ipv4Address(16));
      attach.toObjectExtras(proto, ["src", "dst"]);
      attach.virtualField(proto, "fragmentOffsetFlags", {
        get() {
          return this.fragmentOffsetRaw & 224;
        }
      });
      attach.virtualField(proto, "isFragment", {
        get() {
          return (this.fragmentOffsetFlags & IP_MORE_FRAGMENTS) !== 0 || this.fragmentOffsetValue !== 0;
        }
      });
      attach.virtualField(proto, "isFirstFragment", {
        get() {
          return this.isFragment && this.fragmentOffsetValue === 0;
        }
      });
      attach.virtualField(proto, "isLastFragment", {
        get() {
          return this.isFragment && (this.fragmentOffsetFlags & IP_MORE_FRAGMENTS) === 0;
        }
      });
      attach.virtualField(proto, "fragmentOffsetValue", {
        get() {
          return ntohs(this.fragmentOffsetRaw & 65311) * 8;
        }
      });
      attach.options.tlv8(Layer, proto, {
        baseLength,
        skipTypes: [IPv4OptionTypes.NOP, IPv4OptionTypes.EndOfOptionsList],
        lengthIsTotal: true
      });
      const previousToObject = proto.toObject;
      proto.toObject = function() {
        return {
          ...previousToObject.call(this),
          fragmentInfo: {
            isFragment: this.isFragment,
            value: this.fragmentOffsetValue,
            flags: this.fragmentOffsetFlags
          }
        };
      };
      attach.checksum.ip(proto);
      const dispatcher = byField("protocol", {
        [IPProtocolTypes.UDP]: "UDP",
        [IPProtocolTypes.TCP]: "TCP",
        [IPProtocolTypes.ICMP]: "ICMP",
        [IPProtocolTypes.GRE]: "GRE",
        [IPProtocolTypes.IGMP]: "IGMP",
        [IPProtocolTypes.AH]: "AuthenticationHeader",
        [IPProtocolTypes.ESP]: "ESP",
        [IPProtocolTypes.IPV6]: "IPv6",
        [IPProtocolTypes.VRRP]: "VRRP"
      });
      attach.dispatch(proto, dispatcher);
      const baseNextProto = proto.nextProto;
      proto.nextProto = function nextProto(layers2) {
        if (this.isFragment) {
          return new layers2.Payload(this._buf.subarray(this.length), { ...this.opts, prev: this });
        }
        if (this.protocol === IPProtocolTypes.IPIP) {
          const v = this.version;
          if (v === 4) return new layers2.IPv4(this._buf.subarray(this.length), { ...this.opts, prev: this });
          if (v === 6) return new layers2.IPv6(this._buf.subarray(this.length), { ...this.opts, prev: this });
          throw new Error(`Invalid IP version ${v}`);
        }
        return baseNextProto.call(this, layers2);
      };
      attach.defaults(proto, {
        version: 4,
        headerLength: ($) => $.length / 4,
        typeOfService: 0,
        id: 0,
        timeToLive: 64,
        totalLength: ($) => $.length + lengthAfter($),
        protocol: dispatcher.reverseDefault(IPProtocolTypes.RAW)
      });
      Layer.OptionTypes = IPv4OptionTypes;
      return Layer;
    })();
    attach.docs(IPv4, {
      fields: {
        options: "List of { type, value } options, types are ipv4.OPTION_*."
      },
      constants: [
        {
          title: "Next layer",
          field: "protocol",
          values: constantsFrom(IPProtocolTypes, { prefix: "PROTOCOL_", skip: ["IP", "MAX"] })
        },
        {
          title: "Options",
          field: "options[].type",
          values: constantsFrom(IPv4OptionTypes, { prefix: "OPTION_", skip: ["Unknown"] })
        },
        {
          title: "Addresses",
          values: {
            BROADCAST: "255.255.255.255",
            LOOPBACK: "127.0.0.1",
            ANY: "0.0.0.0"
          }
        }
      ],
      example: "wire.packet().ipv4({ dst: '8.8.8.8', timeToLive: 3 }).icmp({ type: icmp.ECHO_REQUEST })"
    });
  }
});

// lib/layers/IPv6.js
var inetPton3, inetNtop3, AF_INET62, IPv6;
var init_IPv6 = __esm({
  "lib/layers/IPv6.js"() {
    init_osi();
    init_enums2();
    init_converters();
    init_socket();
    init_define();
    init_mixins();
    init_enums();
    ({ inetPton: inetPton3, inetNtop: inetNtop3 } = converters_default);
    ({ AF_INET6: AF_INET62 } = socket_default);
    IPv6 = (() => {
      const { Layer, proto } = makeLayer("IPv6", `
    //@NE Internet Protocol version 6, RFC 8200. Carries a packet between hosts over 128-bit addresses.
    struct IPv6Header {
      // Label shared by the packets of one flow, 20 bits.
      uint32_t flowLabel:20;
      // DSCP and ECN bits.
      uint32_t trafficClass:8;
      // Always 6.
      uint32_t version:4;
      // Bytes after the header. Filled automatically.
      uint16_t payloadLength;
      // Protocol of the next layer, one of ipv6.NEXT_HEADER_*. Filled from the layer that follows.
      uint8_t nextHeader;
      // Hops the packet may still travel.
      uint8_t hopLimit;
      // Source address.
      uint8_t src[16];
      // Destination address.
      uint8_t dst[16];
    } __attribute__(packed);
  `, {
        osi: OsiModelLayers.Network,
        linktype: LinkLayerType.LINKTYPE_IPV6
      });
      attach.virtualField(proto, "src", {
        get() {
          return inetNtop3(AF_INET62, this._buf.subarray(8, 24));
        },
        set(v) {
          inetPton3(AF_INET62, v).copy(this._buf, 8);
        }
      });
      attach.virtualField(proto, "dst", {
        get() {
          return inetNtop3(AF_INET62, this._buf.subarray(24, 40));
        },
        set(v) {
          inetPton3(AF_INET62, v).copy(this._buf, 24);
        }
      });
      attach.toObjectExtras(proto, ["src", "dst"]);
      const dispatcher = byField("nextHeader", {
        [IPProtocolTypes.UDP]: "UDP",
        [IPProtocolTypes.TCP]: "TCP",
        [IPProtocolTypes.ICMP]: "ICMP",
        [IPProtocolTypes.ICMPV6]: "ICMPv6",
        [IPProtocolTypes.GRE]: "GRE",
        [IPProtocolTypes.IGMP]: "IGMP",
        [IPProtocolTypes.AH]: "AuthenticationHeader",
        [IPProtocolTypes.ESP]: "ESP",
        [IPProtocolTypes.IPV6]: "IPv6",
        [IPProtocolTypes.VRRP]: "VRRP"
      });
      attach.dispatch(proto, dispatcher);
      attach.defaults(proto, {
        version: 6,
        hopLimit: 64,
        trafficClass: 0,
        flowLabel: 0,
        payloadLength: ($) => lengthAfter($),
        nextHeader: dispatcher.reverseDefault(IPProtocolTypes.RAW)
      });
      return Layer;
    })();
    attach.docs(IPv6, {
      constants: [
        {
          title: "Next layer",
          field: "nextHeader",
          values: constantsFrom(IPProtocolTypes, { prefix: "NEXT_HEADER_", skip: ["IP", "MAX", "RAW"] })
        },
        {
          title: "Addresses",
          values: {
            LOOPBACK: "::1",
            ANY: "::",
            ALL_NODES: "ff02::1",
            ALL_ROUTERS: "ff02::2"
          }
        }
      ],
      example: "wire.packet().ipv6({ dst: ipv6.ALL_NODES }).icmpv6({ type: icmpv6.ECHO_REQUEST })"
    });
  }
});

// lib/struct.js
var addField;
var init_struct = __esm({
  "lib/struct.js"() {
    init_src();
    addField = (proto, field) => {
      proto.config.fields[field] = { d: [] };
    };
  }
});

// lib/layers/TCP.js
var flagNames, flagKeys, TCP;
var init_TCP = __esm({
  "lib/layers/TCP.js"() {
    init_osi();
    init_enums2();
    init_struct();
    init_define();
    flagNames = ["reserved", "cwr", "ece", "urg", "ack", "psh", "rst", "syn", "fin"];
    flagKeys = flagNames.map((e) => e + "Flag");
    TCP = (() => {
      const { Layer, proto, baseLength } = makeLayer("TCP", `
    //@NE Transmission Control Protocol, RFC 9293. Reliable byte streams between ports. Packets built here are single segments: the host stack does not know about them and does not keep the connection.
    struct TCPHeader {
      // Source port.
      uint16_t src;
      // Destination port.
      uint16_t dst;
      // Sequence number.
      uint32_t seq;
      // Acknowledgment number.
      uint32_t ack;
      //@LE
      uint16_t reservedFlag:4;
      //@LE Header length in 32-bit words. Filled automatically.
      uint16_t dataOffset:4;
      //@LE
      uint16_t finFlag:1;
      //@LE
      uint16_t synFlag:1;
      //@LE
      uint16_t rstFlag:1;
      //@LE
      uint16_t pshFlag:1;
      //@LE
      uint16_t ackFlag:1;
      //@LE
      uint16_t urgFlag:1;
      //@LE
      uint16_t eceFlag:1;
      //@LE
      uint16_t cwrFlag:1;
      // Receive window. 2048 by default.
      uint16_t windowSize;
      // Checksum over the segment and the IP pseudo header. Filled automatically.
      uint16_t checksum;
      // Offset of urgent data when the urg flag is set.
      uint16_t urgentPointer;
    } __attribute__((packed));
  `, {
        osi: OsiModelLayers.Transport,
        length: ($) => $.dataOffset * 4
      });
      attach.virtualField(proto, "flags", {
        get() {
          const self2 = this;
          const target = {};
          for (const flag of flagNames) target[flag] = self2[flag + "Flag"];
          return new Proxy(Object.seal(target), {
            get(t, prop) {
              return t[prop];
            },
            set(t, prop, value) {
              t[prop] = value;
              const internalKey = prop + "Flag";
              if (self2[internalKey] !== void 0) self2[internalKey] = value;
              return true;
            }
          });
        },
        set(obj) {
          for (const flag of flagNames) {
            if (obj[flag] !== void 0) this[flag + "Flag"] = obj[flag];
          }
        }
      });
      attach.options.tlv8(Layer, proto, {
        baseLength,
        skipTypes: [1, 0],
        lengthIsTotal: true
      });
      const previousToObject = proto.toObject;
      proto.toObject = function() {
        const obj = previousToObject.call(this);
        for (const k of flagKeys) delete obj[k];
        obj.flags = this.flags;
        return obj;
      };
      attach.checksum.pseudo(proto, IPProtocolTypes.TCP);
      proto.nextProto = function nextProto(layers2) {
        return new layers2.Payload(this._buf.subarray(this.length));
      };
      attach.defaults(proto, {
        windowSize: 2048,
        urgentPointer: 0,
        dataOffset: ($) => $.length / 4
      });
      addField(proto, "flags");
      return Layer;
    })();
    attach.docs(TCP, {
      fields: {
        flags: "Object with syn, ack, fin, rst, psh, urg, ece, cwr set to 0 or 1.",
        options: "List of { type, value } options, types are tcp.OPTION_*."
      },
      constants: [
        {
          title: "Options",
          field: "options[].type",
          values: {
            OPTION_END: 0,
            OPTION_NOP: 1,
            OPTION_MSS: 2,
            OPTION_WINDOW_SCALE: 3,
            OPTION_SACK_PERMITTED: 4,
            OPTION_SACK: 5,
            OPTION_TIMESTAMP: 8
          }
        },
        {
          title: "Well-known ports",
          field: "src, dst",
          values: {
            PORT_FTP: 21,
            PORT_SSH: 22,
            PORT_TELNET: 23,
            PORT_SMTP: 25,
            PORT_DNS: 53,
            PORT_HTTP: 80,
            PORT_HTTPS: 443
          }
        }
      ],
      example: "wire.packet().ipv4({ dst: '192.168.1.1' }).tcp({ src: 40000, dst: tcp.PORT_SSH, flags: { syn: 1 } })"
    });
  }
});

// lib/layers/UDP.js
var UDP;
var init_UDP = __esm({
  "lib/layers/UDP.js"() {
    init_osi();
    init_enums2();
    init_define();
    init_mixins();
    UDP = (() => {
      const { Layer, proto } = makeLayer("UDP", `
    //@NE User Datagram Protocol, RFC 768. Datagrams between ports with no delivery guarantees. DNS, DHCP and NTP are recognised on their well-known ports.
    struct UDPHeader {
      // Source port.
      uint16_t src;
      // Destination port.
      uint16_t dst;
      // Header plus data in bytes. Filled automatically.
      uint16_t totalLength;
      // Checksum over the datagram and the IP pseudo header. Filled automatically.
      uint16_t checksum;
    };
  `, {
        osi: OsiModelLayers.Transport
      });
      attach.dispatch(proto, byPort({
        53: "DNS",
        67: "DHCP",
        68: "DHCP",
        123: "NTP",
        5353: "DNS"
        // mDNS reuses the DNS message format (RFC 6762).
      }));
      attach.checksum.pseudo(proto, IPProtocolTypes.UDP);
      attach.defaults(proto, {
        totalLength: ($) => $.length + lengthAfter($)
      });
      return Layer;
    })();
    attach.docs(UDP, {
      constants: [
        {
          title: "Well-known ports",
          field: "src, dst",
          values: {
            PORT_DISCARD: 9,
            PORT_DNS: 53,
            PORT_DHCP_SERVER: 67,
            PORT_DHCP_CLIENT: 68,
            PORT_NTP: 123,
            PORT_MDNS: 5353
          }
        }
      ],
      example: "wire.filter().udp({ port: udp.PORT_DNS })"
    });
  }
});

// lib/layers/ARP.js
var OPCODE, OPCODE_LOOKUP, ARP;
var init_ARP = __esm({
  "lib/layers/ARP.js"() {
    init_osi();
    init_enums2();
    init_define();
    init_addr();
    OPCODE = {
      1: "who-has",
      2: "is-at"
    };
    OPCODE_LOOKUP = Object.entries(OPCODE).reduce((acc, [numCode, stringCode]) => {
      acc[stringCode] = Number(numCode);
      return acc;
    }, {});
    ARP = (() => {
      const { Layer, proto } = makeLayer("ARP", `
    //@NE Address Resolution Protocol, RFC 826. Finds the hardware address that owns an IPv4 address on the local network.
    struct ARPHeader {
      // Kind of hardware address, arp.HARDWARE_ETHERNET by default.
      uint16_t hardwareType;
      // Kind of protocol address, IPv4 by default.
      uint16_t protocolType;
      // Length of a hardware address in bytes.
      uint8_t hardwareLength;
      // Length of a protocol address in bytes.
      uint8_t protocolLength;
      // arp.WHO_HAS for a request, arp.IS_AT for a reply.
      uint16_t opcode;
      // Hardware address of the sender.
      uint8_t hardwareSrc[6];
      //@LE IPv4 address of the sender.
      uint32_t protocolSrc;
      // Hardware address of the target, zeros in a request.
      uint8_t hardwareDst[6];
      //@LE IPv4 address being asked about.
      uint32_t protocolDst;
    } __attribute__(packed);
  `, {
        osi: OsiModelLayers.DataLink
      });
      attach.virtualField(proto, "hardwareSrc", macAddress(8));
      attach.virtualField(proto, "hardwareDst", macAddress(18));
      attach.virtualField(proto, "protocolSrc", ipv4Address(14));
      attach.virtualField(proto, "protocolDst", ipv4Address(24));
      attach.virtualField(proto, "opcode", {
        get() {
          return OPCODE[this._buf.readUInt16BE(6)];
        },
        set(v) {
          this._buf.writeUInt16BE(Number(OPCODE_LOOKUP[v]) | 0, 6);
        }
      });
      attach.toObjectExtras(proto, ["hardwareSrc", "hardwareDst", "protocolSrc", "protocolDst", "opcode"]);
      attach.defaults(proto, {
        hardwareType: 1,
        hardwareLength: 6,
        protocolType: ETHERTYPE.IP,
        protocolLength: 4
      });
      return Layer;
    })();
    attach.docs(ARP, {
      constants: [
        {
          title: "Operations",
          field: "opcode",
          values: {
            WHO_HAS: "who-has",
            IS_AT: "is-at"
          }
        },
        {
          title: "Hardware types",
          field: "hardwareType",
          values: {
            HARDWARE_ETHERNET: 1
          }
        }
      ],
      example: "wire.filter().arp({ opcode: arp.IS_AT, protocolSrc: '192.168.1.1' })"
    });
  }
});

// lib/layers/Payload.js
var Payload;
var init_Payload = __esm({
  "lib/layers/Payload.js"() {
    init_osi();
    Payload = class {
      name = "Payload";
      constructor(data = {}, { prev = null, allocated = null } = {}) {
        this.prev = prev;
        this.next = null;
        if (allocated !== null) {
          this.length = allocated;
        }
        if (Buffer.isBuffer(data)) {
          this.data = data;
          if (!(this.length >= 0)) {
            this.length = this.data.length;
          }
        }
      }
      static toAlloc = (data) => data?.data?.length ?? 0;
      static osi = OsiModelLayers.Application;
      static docs = {
        title: "Raw bytes",
        summary: "The bytes no other layer recognised, or the bytes you put after the last header.",
        fields: {
          data: "Buffer with the bytes."
        },
        constants: [],
        example: "wire.packet().ipv4({ dst: '10.0.0.2' }).udp({ src: 40000, dst: 9 }).payload({ data: Buffer.from('hello') })"
      };
      osi = OsiModelLayers.Application;
      toObject() {
        return { data: this.data };
      }
      get buffer() {
        return this.data;
      }
      set buffer(buf) {
        this.data = buf;
      }
      defaults() {
      }
      merge(obj) {
        if (obj && obj.data) {
          if (this.data) {
            obj.data.copy(this.data);
          } else {
            this.data = Buffer.from(obj.data);
          }
          this.length = obj.data.length;
        }
      }
      nextProto() {
        return null;
      }
    };
  }
});

// lib/layers/ICMP.js
var ICMP;
var init_ICMP = __esm({
  "lib/layers/ICMP.js"() {
    init_src();
    init_osi();
    init_enums2();
    init_define();
    ICMP = (() => {
      const { ICMPEchoHeader } = compile(`
    //@NE
    struct ICMPEchoHeader {
      uint16_t id;
      uint16_t sequence;
      uint64_t timestamp;
    } __attribute__(packed);
  `);
      const { ICMPEchoIdentityHeader } = compile(`
    //@NE
    struct ICMPEchoIdentityHeader {
      uint16_t id;
      uint16_t sequence;
    } __attribute__(packed);
  `);
      const { ICMPTimestampHeader } = compile(`
    //@NE
    struct ICMPTimestampHeader {
      uint16_t id;
      uint16_t sequence;
      uint32_t originateTimestamp;
      uint32_t receiveTimestamp;
      uint32_t transmitTimestamp;
    } __attribute__(packed);
  `);
      const { ICMPDestUnreachableHeader } = compile(`
    //@NE
    struct ICMPDestUnreachableHeader {
      uint16_t unused;
      uint16_t nextHopMTU;
    } __attribute__(packed);
  `);
      const { ICMPTimeExceededHeader } = compile(`
    //@NE
    struct ICMPTimeExceededHeader {
      uint32_t unused;
    } __attribute__(packed);
  `);
      const { ICMPParamProblemHeader } = compile(`
    //@NE
    struct ICMPParamProblemHeader {
      uint8_t errorOctetPointer;
      uint8_t unused[3];
    } __attribute__(packed);
  `);
      const tailLengthFor = (type) => {
        switch (type) {
          case ICMPTypes.EchoRequest:
          case ICMPTypes.EchoReply:
            return ICMPEchoHeader.prototype.config.length;
          case ICMPTypes.TimestampRequest:
          case ICMPTypes.TimestampReply:
            return ICMPTimestampHeader.prototype.config.length;
          case ICMPTypes.DestinationUnreachable:
            return ICMPDestUnreachableHeader.prototype.config.length;
          case ICMPTypes.TimeExceeded:
            return ICMPTimeExceededHeader.prototype.config.length;
          case ICMPTypes.ParameterProblem:
            return ICMPParamProblemHeader.prototype.config.length;
          default:
            return 0;
        }
      };
      const { Layer, proto, baseLength } = makeLayer("ICMP", `
    //@NE Internet Control Message Protocol, RFC 792. Error reports and diagnostics of IPv4: echo for ping, time exceeded for traceroute, unreachable destinations. The fields after the checksum depend on the message type.
    struct ICMPHeader {
      // Message type. icmp.ECHO_REQUEST by default.
      uint8_t type;
      // Detail of the type, for example icmp.CODE_PORT_UNREACHABLE.
      uint8_t code;
      // Checksum over the whole message. Filled automatically.
      uint16_t checksum;
    } __attribute__(packed);
  `, {
        osi: OsiModelLayers.Network,
        length: false,
        toAlloc: (data) => baseLengthFor(data)
      });
      function baseLengthFor(data) {
        return baseLength + tailLengthFor(data?.type ?? ICMPTypes.EchoRequest);
      }
      Layer.toAlloc = (data) => baseLengthFor(data);
      Object.defineProperty(proto, "length", {
        get() {
          try {
            return Math.min(baseLength + tailLengthFor(this.type), this._buf.length);
          } catch (_e) {
            return baseLength;
          }
        },
        configurable: true
      });
      attach.virtualField(proto, "typeName", {
        get() {
          return Object.entries(ICMPTypes).find(([, v]) => v === this.type)?.[0] || "Unknown";
        }
      });
      attach.virtualField(proto, "isEchoRequest", { get() {
        return this.type === ICMPTypes.EchoRequest;
      } });
      attach.virtualField(proto, "isEchoReply", { get() {
        return this.type === ICMPTypes.EchoReply;
      } });
      attach.virtualField(proto, "isDestinationUnreachable", { get() {
        return this.type === ICMPTypes.DestinationUnreachable;
      } });
      attach.virtualField(proto, "isTimeExceeded", { get() {
        return this.type === ICMPTypes.TimeExceeded;
      } });
      attach.virtualField(proto, "isParameterProblem", { get() {
        return this.type === ICMPTypes.ParameterProblem;
      } });
      attach.virtualField(proto, "isTimestampRequest", { get() {
        return this.type === ICMPTypes.TimestampRequest;
      } });
      attach.virtualField(proto, "isTimestampReply", { get() {
        return this.type === ICMPTypes.TimestampReply;
      } });
      const baseMerge = proto.merge;
      proto.merge = function(data) {
        if (Buffer.isBuffer(data)) {
          baseMerge.call(this, data);
          return;
        }
        baseMerge.call(this, { ...data, type: data.type ?? ICMPTypes.EchoRequest });
        const tail = this._buf.subarray(baseLength);
        if (this.isEchoRequest || this.isEchoReply) new ICMPEchoHeader(tail).merge(data);
        else if (this.isTimestampRequest || this.isTimestampReply) new ICMPTimestampHeader(tail).merge(data);
        else if (this.isDestinationUnreachable) new ICMPDestUnreachableHeader(tail).merge(data);
        else if (this.isTimeExceeded) new ICMPTimeExceededHeader(tail).merge(data);
        else if (this.isParameterProblem) new ICMPParamProblemHeader(tail).merge(data);
      };
      const baseToObject = proto.toObject;
      proto.toObject = function() {
        const base = {
          ...baseToObject.call(this),
          typeName: this.typeName,
          isEchoRequest: this.isEchoRequest,
          isEchoReply: this.isEchoReply,
          isDestinationUnreachable: this.isDestinationUnreachable,
          isTimeExceeded: this.isTimeExceeded,
          isParameterProblem: this.isParameterProblem,
          isTimestampRequest: this.isTimestampRequest,
          isTimestampReply: this.isTimestampReply
        };
        const tail = this._buf.subarray(baseLength);
        if (this.isEchoRequest || this.isEchoReply) {
          if (tail.length >= ICMPEchoHeader.size) {
            const h = new ICMPEchoHeader(tail);
            return { ...base, id: h.id, sequence: h.sequence, timestamp: h.timestamp };
          }
          if (tail.length >= ICMPEchoIdentityHeader.size) {
            const h = new ICMPEchoIdentityHeader(tail);
            return { ...base, id: h.id, sequence: h.sequence };
          }
          return base;
        }
        if (tail.length < tailLengthFor(this.type)) {
          return base;
        }
        if (this.isTimestampRequest || this.isTimestampReply) {
          const h = new ICMPTimestampHeader(tail);
          return {
            ...base,
            id: h.id,
            sequence: h.sequence,
            originateTimestamp: h.originateTimestamp,
            receiveTimestamp: h.receiveTimestamp,
            transmitTimestamp: h.transmitTimestamp
          };
        }
        if (this.isDestinationUnreachable) {
          const h = new ICMPDestUnreachableHeader(tail);
          return { ...base, unused: h.unused, nextHopMTU: h.nextHopMTU };
        }
        if (this.isTimeExceeded) {
          const h = new ICMPTimeExceededHeader(tail);
          return { ...base, unused: h.unused };
        }
        if (this.isParameterProblem) {
          const h = new ICMPParamProblemHeader(tail);
          const { errorOctetPointer, unused } = h.toObject();
          return { ...base, errorOctetPointer, unused };
        }
        return base;
      };
      attach.checksum.ipOverWholeMessage(proto);
      attach.dispatch(proto, byField("type", {}));
      attach.defaults(proto, {
        type: ICMPTypes.EchoRequest,
        code: 0
      });
      return Layer;
    })();
    attach.docs(ICMP, {
      fields: {
        id: "Echo and timestamp messages: identifier shared by a request and its reply.",
        sequence: "Echo and timestamp messages: sequence number.",
        timestamp: "Echo messages: 64-bit timestamp carried in the body.",
        nextHopMTU: "Destination unreachable: the size that would have fitted.",
        errorOctetPointer: "Parameter problem: offset of the offending byte.",
        typeName: "Read only: name of the message type."
      },
      constants: [
        {
          title: "Message types",
          field: "type",
          values: constantsFrom(ICMPTypes)
        },
        {
          title: "Codes of DESTINATION_UNREACHABLE",
          field: "code",
          values: {
            CODE_NETWORK_UNREACHABLE: 0,
            CODE_HOST_UNREACHABLE: 1,
            CODE_PROTOCOL_UNREACHABLE: 2,
            CODE_PORT_UNREACHABLE: 3,
            CODE_FRAGMENTATION_NEEDED: 4,
            CODE_SOURCE_ROUTE_FAILED: 5,
            CODE_ADMINISTRATIVELY_PROHIBITED: 13
          }
        },
        {
          title: "Codes of TIME_EXCEEDED",
          field: "code",
          values: {
            CODE_TTL_EXCEEDED: 0,
            CODE_REASSEMBLY_TIME_EXCEEDED: 1
          }
        }
      ],
      example: "wire.send(wire.packet().ipv4({ dst: '8.8.8.8' }).icmp({ type: icmp.ECHO_REQUEST })).expect(wire.filter().icmp({ type: icmp.ECHO_REPLY }))"
    });
  }
});

// lib/layers/ICMPv6.js
var ICMPv6;
var init_ICMPv6 = __esm({
  "lib/layers/ICMPv6.js"() {
    init_src();
    init_osi();
    init_enums2();
    init_define();
    ICMPv6 = (() => {
      const { ICMPv6EchoHeader } = compile(`
    //@NE
    struct ICMPv6EchoHeader {
      uint16_t id;
      uint16_t sequence;
    } __attribute__(packed);
  `);
      const { ICMPv6DestUnreachableHeader } = compile(`
    //@NE
    struct ICMPv6DestUnreachableHeader {
      uint32_t unused;
    } __attribute__(packed);
  `);
      const { ICMPv6TimeExceededHeader } = compile(`
    //@NE
    struct ICMPv6TimeExceededHeader {
      uint32_t unused;
    } __attribute__(packed);
  `);
      const { ICMPv6ParamProblemHeader } = compile(`
    //@NE
    struct ICMPv6ParamProblemHeader {
      uint32_t pointer;
    } __attribute__(packed);
  `);
      const tailLengthFor = (type) => {
        switch (type) {
          case ICMPv6Types.EchoRequest:
          case ICMPv6Types.EchoReply:
            return ICMPv6EchoHeader.prototype.config.length;
          case ICMPv6Types.DestinationUnreachable:
            return ICMPv6DestUnreachableHeader.prototype.config.length;
          case ICMPv6Types.TimeExceeded:
            return ICMPv6TimeExceededHeader.prototype.config.length;
          case ICMPv6Types.ParameterProblem:
            return ICMPv6ParamProblemHeader.prototype.config.length;
          default:
            return 0;
        }
      };
      const { Layer, proto, baseLength } = makeLayer("ICMPv6", `
    //@NE Internet Control Message Protocol for IPv6, RFC 4443. Error reports, echo and neighbour discovery of IPv6.
    struct ICMPv6Header {
      // Message type.
      uint8_t type;
      // Detail of the type.
      uint8_t code;
      // Checksum over the message and the IPv6 pseudo header. Filled automatically.
      uint16_t checksum;
    } __attribute__(packed);
  `, {
        osi: OsiModelLayers.Network,
        length: false,
        toAlloc: (data) => baseLength + tailLengthFor(data && data.type)
      });
      Layer.toAlloc = (data) => baseLength + tailLengthFor(data && data.type);
      Object.defineProperty(proto, "length", {
        get() {
          try {
            return Math.min(baseLength + tailLengthFor(this.type), this._buf.length);
          } catch (_e) {
            return baseLength;
          }
        },
        configurable: true
      });
      attach.virtualField(proto, "typeName", {
        get() {
          return Object.entries(ICMPv6Types).find(([, v]) => v === this.type)?.[0] || "Unknown";
        }
      });
      attach.virtualField(proto, "isEchoRequest", { get() {
        return this.type === ICMPv6Types.EchoRequest;
      } });
      attach.virtualField(proto, "isEchoReply", { get() {
        return this.type === ICMPv6Types.EchoReply;
      } });
      attach.virtualField(proto, "isDestinationUnreachable", { get() {
        return this.type === ICMPv6Types.DestinationUnreachable;
      } });
      attach.virtualField(proto, "isTimeExceeded", { get() {
        return this.type === ICMPv6Types.TimeExceeded;
      } });
      attach.virtualField(proto, "isParameterProblem", { get() {
        return this.type === ICMPv6Types.ParameterProblem;
      } });
      const baseMerge = proto.merge;
      proto.merge = function(data) {
        baseMerge.call(this, data);
        if (Buffer.isBuffer(data)) return;
        const tail = this._buf.subarray(baseLength);
        if (this.isEchoRequest || this.isEchoReply) new ICMPv6EchoHeader(tail).merge(data);
        else if (this.isDestinationUnreachable) new ICMPv6DestUnreachableHeader(tail).merge(data);
        else if (this.isTimeExceeded) new ICMPv6TimeExceededHeader(tail).merge(data);
        else if (this.isParameterProblem) new ICMPv6ParamProblemHeader(tail).merge(data);
      };
      const baseToObject = proto.toObject;
      proto.toObject = function() {
        const base = {
          ...baseToObject.call(this),
          typeName: this.typeName,
          isEchoRequest: this.isEchoRequest,
          isEchoReply: this.isEchoReply,
          isDestinationUnreachable: this.isDestinationUnreachable,
          isTimeExceeded: this.isTimeExceeded,
          isParameterProblem: this.isParameterProblem
        };
        const tail = this._buf.subarray(baseLength);
        if (tail.length < tailLengthFor(this.type)) {
          return base;
        }
        if (this.isEchoRequest || this.isEchoReply) {
          const h = new ICMPv6EchoHeader(tail);
          return { ...base, id: h.id, sequence: h.sequence };
        }
        if (this.isDestinationUnreachable) {
          const h = new ICMPv6DestUnreachableHeader(tail);
          return { ...base, unused: h.unused };
        }
        if (this.isTimeExceeded) {
          const h = new ICMPv6TimeExceededHeader(tail);
          return { ...base, unused: h.unused };
        }
        if (this.isParameterProblem) {
          const h = new ICMPv6ParamProblemHeader(tail);
          return { ...base, pointer: h.pointer };
        }
        return base;
      };
      attach.checksum.pseudo(proto, IPProtocolTypes.ICMPV6);
      attach.dispatch(proto, byField("type", {}));
      attach.defaults(proto, {
        type: ICMPv6Types.EchoRequest,
        code: 0
      });
      return Layer;
    })();
    attach.docs(ICMPv6, {
      fields: {
        id: "Echo messages: identifier shared by a request and its reply.",
        sequence: "Echo messages: sequence number."
      },
      constants: [
        {
          title: "Message types",
          field: "type",
          values: constantsFrom(ICMPv6Types, { skip: ["Unknown"] })
        }
      ],
      example: "wire.filter().icmpv6({ type: [icmpv6.NEIGHBOR_SOLICITATION, icmpv6.NEIGHBOR_ADVERTISEMENT] })"
    });
  }
});

// lib/layers/DHCP.js
var fixedString, DHCP_PAD_OPTION, DHCP_END_OPTION, DHCP;
var init_DHCP = __esm({
  "lib/layers/DHCP.js"() {
    init_osi();
    init_mac();
    init_define();
    init_addr();
    fixedString = (offset, size) => ({
      get() {
        const slice = this._buf.subarray(offset, offset + size);
        const nullIdx = slice.indexOf(0);
        return slice.subarray(0, nullIdx >= 0 ? nullIdx : size).toString();
      },
      set(v) {
        const buf = Buffer.from(String(v));
        this._buf.fill(0, offset, offset + size);
        buf.copy(this._buf, offset, 0, Math.min(buf.length, size));
      }
    });
    DHCP_PAD_OPTION = 0;
    DHCP_END_OPTION = 255;
    DHCP = (() => {
      const { Layer, proto, baseLength } = makeLayer("DHCP", `
    //@NE Dynamic Host Configuration Protocol, RFC 2131. Hands out addresses and network settings. Recognised under UDP on ports 67 and 68.
    struct DHCPHeader {
      // dhcp.BOOT_REQUEST from a client, dhcp.BOOT_REPLY from a server.
      uint8_t opCode;
      // Kind of hardware address, 1 for Ethernet.
      uint8_t hardwareType;
      // Length of the hardware address, 6 for Ethernet.
      uint8_t hardwareAddressLength;
      // Relay agents passed.
      uint8_t hops;
      // Identifier shared by the messages of one exchange.
      uint32_t transactionId;
      // Seconds since the client started.
      uint16_t secondsElapsed;
      // Bit 15 asks for a broadcast reply.
      uint16_t flags;
      // Address the client already has.
      uint32_t clientIpAddress;
      // Address offered to the client.
      uint32_t yourIpAddress;
      // Address of the next server to use.
      uint32_t serverIpAddress;
      // Address of the relay agent.
      uint32_t gatewayIpAddress;
      // Hardware address of the client.
      uint8_t clientHardwareAddress[16];
      // Optional server host name.
      uint8_t serverName[64];
      // Optional boot file name.
      uint8_t bootFilename[128];
      // Always dhcp.MAGIC_NUMBER.
      uint32_t magicNumber;
    };
  `, {
        osi: OsiModelLayers.Application,
        length: ($) => $._buf.length
      });
      attach.virtualField(proto, "clientIpAddress", ipv4Address(12));
      attach.virtualField(proto, "yourIpAddress", ipv4Address(16));
      attach.virtualField(proto, "gatewayIpAddress", ipv4Address(24));
      attach.virtualField(proto, "clientHardwareAddress", {
        get() {
          return macToString(this._buf.subarray(28, 34));
        },
        set(v) {
          macFromString(v).copy(this._buf, 28);
          this._buf.fill(0, 34, 44);
        }
      });
      attach.virtualField(proto, "serverName", fixedString(44, 64));
      attach.virtualField(proto, "bootFilename", fixedString(108, 128));
      attach.toObjectExtras(proto, ["clientHardwareAddress", "serverName", "bootFilename"]);
      attach.options.tlv8(Layer, proto, {
        baseLength,
        skipTypes: [DHCP_PAD_OPTION, DHCP_END_OPTION],
        lengthIsTotal: false,
        align: null
      });
      proto.nextProto = function nextProto(layers2) {
        return new layers2.Payload(this._buf.subarray(this.length));
      };
      return Layer;
    })();
    attach.docs(DHCP, {
      fields: {
        options: "List of { type, value } options, types are dhcp.OPTION_*."
      },
      constants: [
        {
          title: "Ports",
          values: {
            SERVER_PORT: 67,
            CLIENT_PORT: 68
          }
        },
        {
          title: "Operations",
          field: "opCode",
          values: {
            BOOT_REQUEST: 1,
            BOOT_REPLY: 2
          }
        },
        {
          title: "Options",
          field: "options[].type",
          values: {
            OPTION_SUBNET_MASK: 1,
            OPTION_ROUTER: 3,
            OPTION_DNS_SERVERS: 6,
            OPTION_HOST_NAME: 12,
            OPTION_REQUESTED_ADDRESS: 50,
            OPTION_LEASE_TIME: 51,
            OPTION_MESSAGE_TYPE: 53,
            OPTION_SERVER_IDENTIFIER: 54,
            OPTION_PARAMETER_REQUEST_LIST: 55,
            OPTION_CLIENT_IDENTIFIER: 61
          }
        },
        {
          title: "Values of OPTION_MESSAGE_TYPE",
          values: {
            DISCOVER: 1,
            OFFER: 2,
            REQUEST: 3,
            DECLINE: 4,
            ACK: 5,
            NAK: 6,
            RELEASE: 7,
            INFORM: 8
          }
        },
        {
          title: "Other",
          values: {
            MAGIC_NUMBER: 1669485411
          }
        }
      ]
    });
  }
});

// lib/layers/Vlan.js
var Vlan;
var init_Vlan = __esm({
  "lib/layers/Vlan.js"() {
    init_osi();
    init_enums2();
    init_define();
    Vlan = (() => {
      const { Layer, proto } = makeLayer("Vlan", `
    //@NE VLAN tag, IEEE 802.1Q. A tag between the Ethernet header and the network layer that assigns the frame to a virtual network.
    struct VlanHeader {
      // Network identifier, 0 to 4095.
      uint16_t vid:12;
      // Drop eligible indicator.
      uint16_t dei:1;
      // Priority code point, 0 to 7.
      uint16_t pcp:3;
      // Protocol of the next layer, one of ethernet.TYPE_*.
      uint16_t etherType;
    } __attribute__(packed);
  `, {
        osi: OsiModelLayers.DataLink
      });
      const dispatcher = byField("etherType", {
        [ETHERTYPE.IP]: "IPv4",
        [ETHERTYPE.IPV6]: "IPv6",
        [ETHERTYPE.ARP]: "ARP",
        [ETHERTYPE.VLAN]: "Vlan",
        [ETHERTYPE.IEEE_802_1AD]: "Vlan",
        [ETHERTYPE.MPLS]: "Mpls",
        [ETHERTYPE.PPPOES]: "PPPoESession",
        [ETHERTYPE.PPPOED]: "PPPoEDiscovery",
        [ETHERTYPE.WAKE_ON_LAN]: "WakeOnLanLayer"
      });
      attach.dispatch(proto, dispatcher);
      attach.defaults(proto, {
        pcp: 0,
        dei: 0,
        etherType: dispatcher.reverseDefault(ETHERTYPE.IP)
      });
      return Layer;
    })();
  }
});

// lib/layers/GRE.js
var optionsSize, GRE;
var init_GRE = __esm({
  "lib/layers/GRE.js"() {
    init_osi();
    init_enums2();
    init_define();
    optionsSize = (data) => {
      let n = 0;
      if (data.checksumFlag || data.checksum !== void 0) n += 4;
      if (data.keyFlag || data.key !== void 0) n += 4;
      if (data.sequenceFlag || data.sequence !== void 0) n += 4;
      return n;
    };
    GRE = (() => {
      const { Layer, proto, baseLength } = makeLayer("GRE", `
    //@NE Generic Routing Encapsulation, RFC 2784, RFC 2890. A tunnel header that carries another network protocol inside IP.
    struct GREHeader {
      // Always 0 for standard GRE.
      uint16_t version:3;
      uint16_t flags:5;
      uint16_t recurControl:3;
      uint16_t strictRouteFlag:1;
      // The sequence number field is present.
      uint16_t sequenceFlag:1;
      // The key field is present.
      uint16_t keyFlag:1;
      uint16_t routingFlag:1;
      // The checksum field is present.
      uint16_t checksumFlag:1;
      // Protocol of the carried packet, one of ethernet.TYPE_*.
      uint16_t protocol;
    } __attribute__(packed);
  `, {
        osi: OsiModelLayers.Network,
        length: ($) => baseLength + ($.checksumFlag ? 4 : 0) + ($.keyFlag ? 4 : 0) + ($.sequenceFlag ? 4 : 0),
        toAlloc: (data) => baseLength + optionsSize(data)
      });
      const checksumOffset = (self2) => self2.checksumFlag ? baseLength : -1;
      const keyOffset = (self2) => self2.keyFlag ? baseLength + (self2.checksumFlag ? 4 : 0) : -1;
      const sequenceOffset = (self2) => self2.sequenceFlag ? baseLength + (self2.checksumFlag ? 4 : 0) + (self2.keyFlag ? 4 : 0) : -1;
      attach.virtualField(proto, "checksum", {
        get() {
          const off = checksumOffset(this);
          return off < 0 ? null : this._buf.readUInt16BE(off);
        },
        set(val) {
          const off = checksumOffset(this);
          if (off < 0) throw new Error("GRE: cannot set checksum without checksumFlag");
          this._buf.writeUInt16BE(val & 65535, off);
        }
      });
      attach.virtualField(proto, "key", {
        get() {
          const off = keyOffset(this);
          return off < 0 ? null : this._buf.readUInt32BE(off);
        },
        set(val) {
          const off = keyOffset(this);
          if (off < 0) throw new Error("GRE: cannot set key without keyFlag");
          this._buf.writeUInt32BE(val >>> 0, off);
        }
      });
      attach.virtualField(proto, "sequence", {
        get() {
          const off = sequenceOffset(this);
          return off < 0 ? null : this._buf.readUInt32BE(off);
        },
        set(val) {
          const off = sequenceOffset(this);
          if (off < 0) throw new Error("GRE: cannot set sequence without sequenceFlag");
          this._buf.writeUInt32BE(val >>> 0, off);
        }
      });
      const baseMerge = proto.merge;
      proto.merge = function(data) {
        let withImpliedFlags = data;
        if (data && !Buffer.isBuffer(data)) {
          withImpliedFlags = { ...data };
          if (data.checksum !== void 0 && data.checksumFlag === void 0) {
            withImpliedFlags.checksumFlag = 1;
          }
          if (data.key !== void 0 && data.keyFlag === void 0) {
            withImpliedFlags.keyFlag = 1;
          }
          if (data.sequence !== void 0 && data.sequenceFlag === void 0) {
            withImpliedFlags.sequenceFlag = 1;
          }
        }
        baseMerge.call(this, withImpliedFlags);
        if (data && !Buffer.isBuffer(data)) {
          if (data.checksum !== void 0 && this.checksumFlag) this.checksum = data.checksum;
          if (data.key !== void 0 && this.keyFlag) this.key = data.key;
          if (data.sequence !== void 0 && this.sequenceFlag) this.sequence = data.sequence;
        }
      };
      const baseToObject = proto.toObject;
      proto.toObject = function() {
        const out = baseToObject.call(this);
        if (this.checksumFlag) out.checksum = this.checksum;
        if (this.keyFlag) out.key = this.key;
        if (this.sequenceFlag) out.sequence = this.sequence;
        return out;
      };
      const dispatcher = byField("protocol", {
        [ETHERTYPE.IP]: "IPv4",
        [ETHERTYPE.IPV6]: "IPv6",
        [ETHERTYPE.ARP]: "ARP",
        [ETHERTYPE.VLAN]: "Vlan",
        [ETHERTYPE.IEEE_802_1AD]: "Vlan",
        [ETHERTYPE.MPLS]: "Mpls"
      });
      attach.dispatch(proto, dispatcher);
      attach.defaults(proto, {
        version: 0,
        protocol: dispatcher.reverseDefault(ETHERTYPE.IP)
      });
      return Layer;
    })();
    attach.docs(GRE, {
      fields: {
        checksum: "Optional checksum.",
        key: "Optional tunnel key.",
        sequence: "Optional sequence number."
      }
    });
  }
});

// lib/layers/NTP.js
function writeNtpTimestamp(buf, offset, dateOrMs) {
  if (dateOrMs == null || dateOrMs === 0) {
    buf.writeUInt32BE(0, offset);
    buf.writeUInt32BE(0, offset + 4);
    return;
  }
  const ms = dateOrMs instanceof Date ? dateOrMs.getTime() : Number(dateOrMs);
  const totalSeconds = ms / 1e3 + NTP_EPOCH_OFFSET;
  const sec = Math.floor(totalSeconds);
  const frac = Math.floor((totalSeconds - sec) * 4294967296);
  buf.writeUInt32BE(sec >>> 0, offset);
  buf.writeUInt32BE(frac >>> 0, offset + 4);
}
function readNtpTimestamp(buf, offset) {
  const sec = buf.readUInt32BE(offset);
  const frac = buf.readUInt32BE(offset + 4);
  if (sec === 0 && frac === 0) return null;
  const ms = (sec - NTP_EPOCH_OFFSET) * 1e3 + Math.round(frac / 4294967296 * 1e3);
  return new Date(ms);
}
var NTP_EPOCH_OFFSET, tsFields, tsOffsets, ntpTimestamp, NTP;
var init_NTP = __esm({
  "lib/layers/NTP.js"() {
    init_osi();
    init_define();
    NTP_EPOCH_OFFSET = 2208988800;
    tsFields = ["referenceTimestamp", "originTimestamp", "receiveTimestamp", "transmitTimestamp"];
    tsOffsets = {
      referenceTimestamp: 16,
      originTimestamp: 24,
      receiveTimestamp: 32,
      transmitTimestamp: 40
    };
    ntpTimestamp = (offset) => ({
      get() {
        return readNtpTimestamp(this._buf, offset);
      },
      set(v) {
        writeNtpTimestamp(this._buf, offset, v);
      }
    });
    NTP = (() => {
      const { Layer, proto } = makeLayer("NTP", `
    //@NE Network Time Protocol, RFC 5905. Clock synchronisation. Recognised under UDP on port 123.
    struct NTPHeader {
      // Role of the sender, one of ntp.MODE_*.
      uint8_t mode:3;
      // Protocol version, 3 or 4.
      uint8_t vn:3;
      // Leap indicator.
      uint8_t li:2;
      // Distance from a reference clock.
      uint8_t stratum;
      // Poll interval as a power of two of seconds.
      int8_t  poll;
      // Clock precision as a power of two of seconds.
      int8_t  precision;
      // Round-trip delay to the reference clock.
      uint32_t rootDelay;
      // Dispersion to the reference clock.
      uint32_t rootDispersion;
      // Identifier of the reference clock.
      uint32_t referenceId;
      // Date the clock was last set.
      uint8_t  referenceTimestamp[8];
      // Date the request left the client.
      uint8_t  originTimestamp[8];
      // Date the request reached the server.
      uint8_t  receiveTimestamp[8];
      // Date the message was sent.
      uint8_t  transmitTimestamp[8];
    } __attribute__(packed);
  `, {
        osi: OsiModelLayers.Application
      });
      for (const f of tsFields) {
        attach.virtualField(proto, f, ntpTimestamp(tsOffsets[f]));
      }
      const baseMerge = proto.merge;
      proto.merge = function(data) {
        if (data == null) return;
        if (Buffer.isBuffer(data)) {
          baseMerge.call(this, data);
          return;
        }
        const stripped = { ...data };
        for (const f of tsFields) delete stripped[f];
        baseMerge.call(this, stripped);
        for (const f of tsFields) {
          if (data[f] !== void 0) this[f] = data[f];
        }
      };
      proto.toObject = function() {
        return {
          li: this.li,
          vn: this.vn,
          mode: this.mode,
          stratum: this.stratum,
          poll: this.poll,
          precision: this.precision,
          rootDelay: this.rootDelay,
          rootDispersion: this.rootDispersion,
          referenceId: this.referenceId,
          referenceTimestamp: this.referenceTimestamp,
          originTimestamp: this.originTimestamp,
          receiveTimestamp: this.receiveTimestamp,
          transmitTimestamp: this.transmitTimestamp
        };
      };
      attach.defaults(proto, {
        li: 0,
        vn: 4,
        mode: 3,
        stratum: 0
      });
      return Layer;
    })();
    attach.docs(NTP, {
      constants: [
        {
          title: "Ports",
          values: {
            PORT: 123
          }
        },
        {
          title: "Modes",
          field: "mode",
          values: {
            MODE_SYMMETRIC_ACTIVE: 1,
            MODE_SYMMETRIC_PASSIVE: 2,
            MODE_CLIENT: 3,
            MODE_SERVER: 4,
            MODE_BROADCAST: 5
          }
        }
      ],
      example: "wire.packet().ipv4({ dst: '162.159.200.1' }).udp({ src: 40000, dst: ntp.PORT }).ntp({ vn: 4, mode: ntp.MODE_CLIENT })"
    });
  }
});

// lib/layers/dnsLabel.js
function parseName(message, offset) {
  const labels = [];
  let cur = offset;
  let nextOffset = -1;
  let jumps = 0;
  while (true) {
    if (cur >= message.length) throw new Error("DNS: name parse out of bounds");
    const b = message[cur];
    if (b === 0) {
      cur++;
      break;
    }
    if ((b & 192) === 192) {
      if (cur + 1 >= message.length) throw new Error("DNS: bad pointer");
      const ptr = (b & 63) << 8 | message[cur + 1];
      if (nextOffset === -1) nextOffset = cur + 2;
      cur = ptr;
      jumps++;
      if (jumps > MAX_JUMPS) throw new Error("DNS: too many name pointers");
      continue;
    }
    if ((b & 192) !== 0) throw new Error("DNS: invalid label flags");
    const len = b;
    cur++;
    if (cur + len > message.length) throw new Error("DNS: label out of bounds");
    labels.push(message.slice(cur, cur + len).toString("ascii"));
    cur += len;
  }
  return {
    name: labels.join("."),
    next: nextOffset === -1 ? cur : nextOffset
  };
}
function serializeName(name) {
  if (!name) return Buffer.from([0]);
  const labels = name.split(".").filter((l) => l.length > 0);
  const parts = [];
  for (const l of labels) {
    if (l.length > 63) throw new Error("DNS: label too long");
    parts.push(Buffer.from([l.length]));
    parts.push(Buffer.from(l, "ascii"));
  }
  parts.push(Buffer.from([0]));
  return Buffer.concat(parts);
}
function nameLength(name) {
  if (!name) return 1;
  let total = 1;
  for (const l of name.split(".")) {
    if (l.length === 0) continue;
    total += 1 + l.length;
  }
  return total;
}
var MAX_JUMPS;
var init_dnsLabel = __esm({
  "lib/layers/dnsLabel.js"() {
    MAX_JUMPS = 32;
  }
});

// lib/layers/DNS.js
function parseRdata(message, type, rdataOffset, rdlength) {
  const rdataBuf = message.slice(rdataOffset, rdataOffset + rdlength);
  switch (type) {
    case TYPE_A:
      return rdataBuf.length === 4 ? inetNtop4(AF_INET2, rdataBuf) : rdataBuf;
    case TYPE_AAAA:
      return rdataBuf.length === 16 ? inetNtop4(AF_INET63, rdataBuf.subarray()) : rdataBuf;
    case TYPE_NS:
    case TYPE_CNAME:
    case TYPE_PTR:
      return parseName(message, rdataOffset).name;
    case TYPE_MX: {
      if (rdlength < 3) return rdataBuf;
      const preference = rdataBuf.readUInt16BE(0);
      const exchange = parseName(message, rdataOffset + 2).name;
      return { preference, exchange };
    }
    case TYPE_TXT: {
      const strs = [];
      let p = 0;
      while (p < rdataBuf.length) {
        const l = rdataBuf[p];
        p++;
        if (p + l > rdataBuf.length) break;
        strs.push(rdataBuf.slice(p, p + l).toString("ascii"));
        p += l;
      }
      return strs.length === 1 ? strs[0] : strs;
    }
    case TYPE_SRV: {
      if (rdlength < 7) return rdataBuf;
      const priority = rdataBuf.readUInt16BE(0);
      const weight = rdataBuf.readUInt16BE(2);
      const port = rdataBuf.readUInt16BE(4);
      const target = parseName(message, rdataOffset + 6).name;
      return { priority, weight, port, target };
    }
    case TYPE_OPT: {
      const opts = [];
      let p = 0;
      while (p + 4 <= rdataBuf.length) {
        const code = rdataBuf.readUInt16BE(p);
        const len = rdataBuf.readUInt16BE(p + 2);
        p += 4;
        if (p + len > rdataBuf.length) break;
        opts.push({ code, data: Buffer.from(rdataBuf.slice(p, p + len)) });
        p += len;
      }
      return opts;
    }
    default:
      return rdataBuf;
  }
}
function serializeRdata(type, rdata) {
  switch (type) {
    case TYPE_A:
      return inetPton4(AF_INET2, rdata);
    case TYPE_AAAA:
      return inetPton4(AF_INET63, rdata);
    case TYPE_NS:
    case TYPE_CNAME:
    case TYPE_PTR:
      return serializeName(rdata);
    case TYPE_MX: {
      const pref = Buffer.alloc(2);
      pref.writeUInt16BE(rdata.preference, 0);
      return Buffer.concat([pref, serializeName(rdata.exchange)]);
    }
    case TYPE_TXT: {
      const arr = Array.isArray(rdata) ? rdata : [rdata];
      const parts = [];
      for (const s of arr) {
        const b = Buffer.from(String(s), "ascii");
        if (b.length > 255) throw new Error("DNS TXT: string too long");
        parts.push(Buffer.from([b.length]), b);
      }
      return Buffer.concat(parts);
    }
    case TYPE_SRV: {
      const head2 = Buffer.alloc(6);
      head2.writeUInt16BE(rdata.priority ?? 0, 0);
      head2.writeUInt16BE(rdata.weight ?? 0, 2);
      head2.writeUInt16BE(rdata.port ?? 0, 4);
      return Buffer.concat([head2, serializeName(rdata.target ?? "")]);
    }
    case TYPE_OPT: {
      const arr = Array.isArray(rdata) ? rdata : [];
      const parts = [];
      for (const o of arr) {
        const data = Buffer.isBuffer(o.data) ? o.data : Buffer.from(o.data ?? []);
        const head2 = Buffer.alloc(4);
        head2.writeUInt16BE(o.code ?? 0, 0);
        head2.writeUInt16BE(data.length, 2);
        parts.push(head2, data);
      }
      return parts.length ? Buffer.concat(parts) : Buffer.alloc(0);
    }
    default:
      return Buffer.isBuffer(rdata) ? rdata : Buffer.from(rdata ?? []);
  }
}
function serializeQuestion(q) {
  const name = serializeName(q.name);
  const tail = Buffer.alloc(4);
  tail.writeUInt16BE(q.type ?? TYPE_A, 0);
  tail.writeUInt16BE(q.class ?? 1, 2);
  return Buffer.concat([name, tail]);
}
function serializeRR(rr) {
  const name = serializeName(rr.name);
  const rdata = serializeRdata(rr.type, rr.rdata);
  const tail = Buffer.alloc(10);
  tail.writeUInt16BE(rr.type, 0);
  tail.writeUInt16BE(rr.class ?? 1, 2);
  tail.writeUInt32BE(rr.ttl ?? 0, 4);
  tail.writeUInt16BE(rdata.length, 8);
  return Buffer.concat([name, tail, rdata]);
}
function rrLength(rr) {
  return serializeRR(rr).length;
}
function questionLength(q) {
  return nameLength(q.name) + 4;
}
var inetPton4, inetNtop4, AF_INET2, AF_INET63, TYPE_A, TYPE_NS, TYPE_CNAME, TYPE_PTR, TYPE_MX, TYPE_TXT, TYPE_AAAA, TYPE_SRV, TYPE_OPT, DNS;
var init_DNS = __esm({
  "lib/layers/DNS.js"() {
    init_osi();
    init_converters();
    init_socket();
    init_dnsLabel();
    init_define();
    ({ inetPton: inetPton4, inetNtop: inetNtop4 } = converters_default);
    ({ AF_INET: AF_INET2, AF_INET6: AF_INET63 } = socket_default);
    TYPE_A = 1;
    TYPE_NS = 2;
    TYPE_CNAME = 5;
    TYPE_PTR = 12;
    TYPE_MX = 15;
    TYPE_TXT = 16;
    TYPE_AAAA = 28;
    TYPE_SRV = 33;
    TYPE_OPT = 41;
    DNS = (() => {
      const { Layer, proto, baseLength } = makeLayer("DNS", `
    //@NE Domain Name System, RFC 1035. Queries and responses of the name system. Recognised under UDP on ports 53 and 5353.
    struct DNSHeader {
      // Identifier shared by a query and its response.
      uint16_t id;
      // Response code, one of dns.RCODE_*.
      uint16_t rcode:4;
      uint16_t z:3;
      // Recursion available.
      uint16_t ra:1;
      // Recursion desired.
      uint16_t rd:1;
      // The message was truncated.
      uint16_t tc:1;
      // The answer comes from an authoritative server.
      uint16_t aa:1;
      // Kind of query, dns.OPCODE_QUERY by default.
      uint16_t opcode:4;
      // 0 for a query, 1 for a response.
      uint16_t qr:1;
      // Number of questions. Filled from the questions list.
      uint16_t qdCount;
      // Number of answers. Filled from the answers list.
      uint16_t anCount;
      // Number of authority records. Filled from the authority list.
      uint16_t nsCount;
      // Number of additional records. Filled from the additional list.
      uint16_t arCount;
    } __attribute__(packed);
  `, {
        osi: OsiModelLayers.Application,
        length: ($) => $._buf.length,
        toAlloc: (data) => calcLength(data)
      });
      function calcLength(data) {
        if (!data) return baseLength;
        let len = baseLength;
        for (const q of data.questions ?? []) len += questionLength(q);
        for (const rr of data.answers ?? []) len += rrLength(rr);
        for (const rr of data.authority ?? []) len += rrLength(rr);
        for (const rr of data.additional ?? []) len += rrLength(rr);
        return len;
      }
      Layer.toAlloc = calcLength;
      proto._parseSection = function _parseSection(bodyOffset, count, kind) {
        const message = this._buf;
        const items = [];
        let cur = baseLength + bodyOffset;
        for (let i = 0; i < count; i++) {
          if (kind === "q") {
            const { name, next } = parseName(message, cur);
            if (next + 4 > message.length) throw new Error("DNS: question truncated");
            items.push({
              name,
              type: message.readUInt16BE(next),
              class: message.readUInt16BE(next + 2)
            });
            cur = next + 4;
          } else {
            const { name, next: afterName } = parseName(message, cur);
            if (afterName + 10 > message.length) throw new Error("DNS: RR header truncated");
            const type = message.readUInt16BE(afterName);
            const cls = message.readUInt16BE(afterName + 2);
            const ttl = message.readUInt32BE(afterName + 4);
            const rdlength = message.readUInt16BE(afterName + 8);
            const rdataOffset = afterName + 10;
            if (rdataOffset + rdlength > message.length) throw new Error("DNS: RR data truncated");
            items.push({
              name,
              type,
              class: cls,
              ttl,
              rdata: parseRdata(message, type, rdataOffset, rdlength)
            });
            cur = rdataOffset + rdlength;
          }
        }
        return { items, next: cur - baseLength };
      };
      attach.virtualField(proto, "questions", {
        get() {
          return this._parseSection(0, this.qdCount, "q").items;
        }
      });
      attach.virtualField(proto, "answers", {
        get() {
          const q = this._parseSection(0, this.qdCount, "q");
          return this._parseSection(q.next, this.anCount, "rr").items;
        }
      });
      attach.virtualField(proto, "authority", {
        get() {
          const q = this._parseSection(0, this.qdCount, "q");
          const an = this._parseSection(q.next, this.anCount, "rr");
          return this._parseSection(an.next, this.nsCount, "rr").items;
        }
      });
      attach.virtualField(proto, "additional", {
        get() {
          const q = this._parseSection(0, this.qdCount, "q");
          const an = this._parseSection(q.next, this.anCount, "rr");
          const ns = this._parseSection(an.next, this.nsCount, "rr");
          return this._parseSection(ns.next, this.arCount, "rr").items;
        }
      });
      attach.virtualField(proto, "opt", {
        get() {
          for (const rr of this.additional) {
            if (rr.type === TYPE_OPT) {
              const ttl = rr.ttl >>> 0;
              return {
                udpPayloadSize: rr.class,
                extendedRcode: ttl >>> 24 & 255,
                version: ttl >>> 16 & 255,
                doFlag: ttl >>> 15 & 1,
                options: Array.isArray(rr.rdata) ? rr.rdata : []
              };
            }
          }
          return null;
        }
      });
      const baseMerge = proto.merge;
      proto.merge = function(data) {
        if (data == null) return;
        if (Buffer.isBuffer(data)) {
          baseMerge.call(this, data);
          return;
        }
        const stripped = { ...data };
        delete stripped.questions;
        delete stripped.answers;
        delete stripped.authority;
        delete stripped.additional;
        baseMerge.call(this, stripped);
        if (data.questions) this.qdCount = data.questions.length;
        if (data.answers) this.anCount = data.answers.length;
        if (data.authority) this.nsCount = data.authority.length;
        if (data.additional) this.arCount = data.additional.length;
        let cursor = baseLength;
        for (const q of data.questions ?? []) {
          const buf = serializeQuestion(q);
          buf.copy(this._buf, cursor);
          cursor += buf.length;
        }
        for (const rr of data.answers ?? []) {
          const buf = serializeRR(rr);
          buf.copy(this._buf, cursor);
          cursor += buf.length;
        }
        for (const rr of data.authority ?? []) {
          const buf = serializeRR(rr);
          buf.copy(this._buf, cursor);
          cursor += buf.length;
        }
        for (const rr of data.additional ?? []) {
          const buf = serializeRR(rr);
          buf.copy(this._buf, cursor);
          cursor += buf.length;
        }
      };
      const sectionNames = ["questions", "answers", "authority", "additional"];
      const isMalformedMessageError = (err) => {
        return err instanceof Error && err.message.startsWith("DNS:");
      };
      const headerToObject = proto.toObject;
      proto.toObject = function() {
        const obj = headerToObject.call(this);
        for (const sectionName of sectionNames) {
          try {
            obj[sectionName] = this[sectionName];
          } catch (err) {
            if (!isMalformedMessageError(err)) {
              throw err;
            }
            obj[sectionName] = [];
          }
        }
        return obj;
      };
      attach.defaults(proto, {
        qr: 0,
        opcode: 0
      });
      return Layer;
    })();
    DNS.opt = function makeOpt(opt = {}) {
      const ttl = ((opt.extendedRcode ?? 0) & 255) * 16777216 + ((opt.version ?? 0) & 255) * 65536 + ((opt.doFlag ?? 0) & 1) * 32768 >>> 0;
      return {
        name: "",
        type: TYPE_OPT,
        class: opt.udpPayloadSize ?? 4096,
        ttl,
        rdata: opt.options ?? []
      };
    };
    DNS.TYPES = {
      A: TYPE_A,
      NS: TYPE_NS,
      CNAME: TYPE_CNAME,
      PTR: TYPE_PTR,
      MX: TYPE_MX,
      TXT: TYPE_TXT,
      AAAA: TYPE_AAAA,
      SRV: TYPE_SRV,
      OPT: TYPE_OPT
    };
    attach.docs(DNS, {
      fields: {
        questions: "List of { name, type, class }.",
        answers: "List of { name, type, class, ttl, rdata }.",
        authority: "List of records in the authority section.",
        additional: "List of records in the additional section."
      },
      constants: [
        {
          title: "Ports",
          values: {
            PORT: 53,
            MDNS_PORT: 5353
          }
        },
        {
          title: "Record types",
          field: "questions[].type",
          values: constantsFrom(DNS.TYPES, { prefix: "TYPE_" })
        },
        {
          title: "Classes",
          field: "questions[].class",
          values: {
            CLASS_IN: 1,
            CLASS_CH: 3,
            CLASS_ANY: 255
          }
        },
        {
          title: "Operations",
          field: "opcode",
          values: {
            OPCODE_QUERY: 0,
            OPCODE_STATUS: 2,
            OPCODE_NOTIFY: 4,
            OPCODE_UPDATE: 5
          }
        },
        {
          title: "Response codes",
          field: "rcode",
          values: {
            RCODE_NO_ERROR: 0,
            RCODE_FORMAT_ERROR: 1,
            RCODE_SERVER_FAILURE: 2,
            RCODE_NAME_ERROR: 3,
            RCODE_NOT_IMPLEMENTED: 4,
            RCODE_REFUSED: 5
          }
        }
      ],
      example: "wire.packet().ipv4({ dst: '8.8.8.8' }).udp({ src: 40000, dst: dns.PORT }).dns({ rd: 1, questions: [{ name: 'example.com', type: dns.TYPE_A }] })"
    });
  }
});

// lib/layers/Loopback.js
var AF_INET3, AF_INET64, AF_INET6_ON_OTHER_SYSTEMS, Loopback;
var init_Loopback = __esm({
  "lib/layers/Loopback.js"() {
    init_enums();
    init_socket();
    init_osi();
    init_define();
    ({ AF_INET: AF_INET3, AF_INET6: AF_INET64 } = socket_default);
    AF_INET6_ON_OTHER_SYSTEMS = [24, 28, 30];
    Loopback = (() => {
      const { Layer, proto } = makeLayer("Loopback", `
    // BSD loopback header, LINKTYPE_NULL. The four-byte header that loopback and tunnel interfaces of macOS, the BSDs and Windows put in front of a packet. An awaited builder adds it by itself.
    struct LoopbackHeader {
      // Address family of the packet that follows, in host byte order.
      uint32_t family;
    } __attribute__(packed);
  `, {
        osi: OsiModelLayers.DataLink,
        linktype: LinkLayerType.LINKTYPE_NULL
      });
      const carriedProtocols = { [AF_INET3]: "IPv4", [AF_INET64]: "IPv6" };
      for (const family of AF_INET6_ON_OTHER_SYSTEMS) {
        carriedProtocols[family] = "IPv6";
      }
      attach.dispatch(proto, byField("family", carriedProtocols));
      attach.defaults(proto, {
        family: ($) => $.next?.name === "IPv6" ? AF_INET64 : AF_INET3
      });
      return Layer;
    })();
  }
});

// lib/layers/index.js
var layers, linktype;
var init_layers = __esm({
  "lib/layers/index.js"() {
    init_Ethernet();
    init_IPv4();
    init_IPv6();
    init_TCP();
    init_UDP();
    init_ARP();
    init_Payload();
    init_ICMP();
    init_ICMPv6();
    init_DHCP();
    init_Vlan();
    init_GRE();
    init_NTP();
    init_DNS();
    init_Loopback();
    layers = {
      IPv4,
      IPv6,
      Ethernet,
      Payload,
      TCP,
      UDP,
      ARP,
      ICMP,
      ICMPv6,
      DHCP,
      Vlan,
      GRE,
      NTP,
      DNS,
      Loopback
    };
    linktype = {};
    for (const cls of Object.values(layers)) {
      if (cls.linktype !== void 0) {
        linktype[cls.linktype] = cls;
      }
    }
  }
});

// lib/protocols.js
var META_TAG, TITLE_END, protocols, textOf, typeOfField, headingOf, fieldsOf, describeLayer, protocolFor, namespaces, ethernet, vlan, arp, ipv4, ipv6, icmp, icmpv6, tcp, udp, dns, dhcp, ntp, gre, loopback, payload;
var init_protocols = __esm({
  "lib/protocols.js"() {
    init_layers();
    META_TAG = /@\w+/g;
    TITLE_END = ". ";
    protocols = {};
    textOf = (comment) => {
      return (comment ?? "").replace(META_TAG, "").trim();
    };
    typeOfField = (compiled) => {
      if (compiled?.type === void 0) {
        return "computed";
      }
      if (compiled.bits !== void 0) {
        return `${compiled.type}:${compiled.bits}`;
      }
      return `${compiled.type}${compiled.d.map((size) => `[${size}]`).join("")}`;
    };
    headingOf = (Layer) => {
      const heading = textOf(Layer.comments?.main);
      const titleEnd = heading.indexOf(TITLE_END);
      if (heading.length === 0) {
        return { title: Layer.docs?.title ?? Layer.name, summary: Layer.docs?.summary ?? "" };
      }
      if (titleEnd === -1) {
        return { title: heading.replace(/\.$/, ""), summary: "" };
      }
      return { title: heading.slice(0, titleEnd), summary: heading.slice(titleEnd + TITLE_END.length) };
    };
    fieldsOf = (Layer) => {
      const compiled = Layer.prototype.config?.fields ?? {};
      const comments = Layer.comments ?? {};
      const described = Layer.docs?.fields ?? {};
      const names = [.../* @__PURE__ */ new Set([...Object.keys(compiled), ...Object.keys(described)])];
      return names.map((name) => {
        return {
          name,
          type: typeOfField(compiled[name]),
          description: described[name] ?? textOf(comments[name])
        };
      });
    };
    describeLayer = (Layer) => {
      const name = Layer.name.toLowerCase();
      const constants2 = Layer.docs?.constants ?? [];
      const namespace = {};
      for (const group of constants2) {
        Object.assign(namespace, group.values);
      }
      protocols[name] = {
        name,
        layer: Layer.name,
        ...headingOf(Layer),
        fields: fieldsOf(Layer),
        constants: constants2,
        example: Layer.docs?.example ?? null,
        namespace: Object.freeze(namespace)
      };
      return protocols[name];
    };
    protocolFor = (requestedName) => {
      return protocols[String(requestedName).toLowerCase()] ?? null;
    };
    namespaces = () => {
      return Object.fromEntries(Object.values(protocols).map(({ name, namespace }) => [name, namespace]));
    };
    for (const Layer of Object.values(layers)) {
      describeLayer(Layer);
    }
    ({ ethernet, vlan, arp, ipv4, ipv6, icmp, icmpv6, tcp, udp, dns, dhcp, ntp, gre, loopback, payload } = namespaces());
  }
});

// lib/defaults.js
var defaults2, snaplen, linktype2, defaults_default2;
var init_defaults2 = __esm({
  "lib/defaults.js"() {
    init_enums();
    defaults2 = {
      snaplen: 65535,
      linktype: LinkLayerType.LINKTYPE_ETHERNET
    };
    ({ snaplen, linktype: linktype2 } = defaults2);
    defaults_default2 = defaults2;
  }
});

// lib/buffer.js
var init_buffer = __esm({
  "lib/buffer.js"() {
  }
});

// lib/timestamp.js
var isBigInt, nullToBool, sign, toNanoseconds, TimeStamp;
var init_timestamp = __esm({
  "lib/timestamp.js"() {
    isBigInt = (v) => typeof v == "bigint";
    nullToBool = (v) => v !== null;
    sign = (v) => {
      if (typeof v == "bigint") {
        return v == 0n ? 0 : v < 0n ? -1 : 1;
      }
      return v == 0 ? 0 : v < 0 ? -1 : 1;
    };
    toNanoseconds = (value, nanosecondsPerUnit) => {
      if (value === null || value === void 0) {
        return 0n;
      }
      if (typeof value == "bigint") {
        return value * BigInt(nanosecondsPerUnit);
      }
      const whole = Math.trunc(value);
      const fraction = value - whole;
      return BigInt(whole) * BigInt(nanosecondsPerUnit) + BigInt(Math.round(fraction * nanosecondsPerUnit));
    };
    TimeStamp = class _TimeStamp {
      constructor({ s = null, ms = null, ns = null } = {}) {
        if (s === null && ms === null && ns === null) {
          return _TimeStamp.now();
        }
        if (isBigInt(s) || isBigInt(ms) || isBigInt(ns)) {
          this.useBigInt = true;
        } else {
          this.useBigInt = false;
        }
        this._s = s;
        this._ms = ms;
        this._ns = ns;
      }
      clone() {
        return new _TimeStamp({
          s: this._s,
          ms: this._ms,
          ns: this._ns
        });
      }
      compare(ts) {
        return sign(this.ns - ts.ns);
      }
      static now(unit = "ms") {
        if (unit == "s") {
          return new _TimeStamp({ s: Date.now() / 1e3 });
        }
        if (unit == "ms") {
          return new _TimeStamp({ ms: Date.now() });
        }
        if (unit == "ns") {
          const now = performance.timeOrigin + performance.now();
          const ms = Math.floor(now);
          const ns = Math.floor((now - ms) * 1e6);
          return new _TimeStamp({ ms: Math.floor(now), ns });
        }
      }
      get s() {
        if (this.useBigInt) {
          return Number(BigInt(this._s ?? 0) + BigInt(this._ms ?? 0) / BigInt(1e3) + BigInt(this._ns ?? 0) / BigInt(1e9));
        }
        return (this._s ?? 0) + (this._ms ?? 0) / 1e3 + (this._ns ?? 0) / 1e9;
      }
      get ms() {
        if (this.useBigInt) {
          return Number(BigInt(this._s ?? 0) * BigInt(1e3) + BigInt(this._ms ?? 0) + BigInt(this._ns ?? 0) / BigInt(1e6));
        }
        return (this._s ?? 0) * 1e3 + (this._ms ?? 0) + (this._ns ?? 0) / 1e6;
      }
      get ns() {
        return toNanoseconds(this._s, 1e9) + toNanoseconds(this._ms, 1e6) + toNanoseconds(this._ns, 1);
      }
      //TODO seems like a not so optimal solution
      packedIn(units) {
        const { s = false, ms = false, ns = false } = units;
        const res = {};
        if (nullToBool(this._s) === s && nullToBool(this._ms) === ms && nullToBool(this._ns) === ns) {
          if (s) {
            res.s = this._s;
          }
          if (ms) {
            res.ms = this._ms;
          }
          if (ns) {
            res.ns = this._ns;
          }
          return res;
        }
        let min = this.ns;
        if (s) {
          res.s = Number(min / BigInt(1e9));
          min = min % BigInt(1e9);
        }
        if (ms) {
          res.ms = Number(min / BigInt(1e6));
          min = min % BigInt(1e6);
        }
        if (ns) {
          res.ns = Number(min);
        }
        return res;
      }
      toDate() {
        return new Date(this.ms);
      }
    };
  }
});

// lib/layersList.js
var LayersList;
var init_layersList = __esm({
  "lib/layersList.js"() {
    LayersList = class {
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
        } else if (tail.next !== newLayer) {
          tail.next = newLayer;
        }
        this._layersTail = newLayer;
        this._layersCount++;
        const { name } = newLayer;
        const existing = this._layers[name];
        if (existing === void 0) {
          this._layers[name] = newLayer;
        } else if (Array.isArray(existing)) {
          existing.push(newLayer);
        } else {
          this._layers[name] = [existing, newLayer];
        }
        return newLayer;
      }
      _createLayer(Layer, buffer, opts = {}) {
        const newLayer = new Layer(buffer, {
          prev: this._layersTail,
          ...this._defaultOpts ?? {},
          ...opts
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
    };
  }
});

// lib/packet.js
var isTruncatedLayerError, Packet, installLayerMethods;
var init_packet = __esm({
  "lib/packet.js"() {
    init_enums();
    init_defaults2();
    init_layers();
    init_buffer();
    init_timestamp();
    init_layersList();
    isTruncatedLayerError = (err) => {
      return err instanceof Error && err.message.startsWith("Invalid buffer length");
    };
    Packet = class _Packet extends LayersList {
      constructor(data, opts = {}) {
        super({});
        this._toBuild = [];
        this._defaultOpts = {
          shrinkAt: this.shrinkAt,
          extendAt: this.extendAt
        };
        if (data instanceof _Packet) {
          const builtSourceBuffer = data.buffer;
          const origLength = data._origLength;
          this._buffer = builtSourceBuffer ? Buffer.from(builtSourceBuffer) : null;
          this._origLength = origLength;
          this.iface = { ...data.iface };
          this.linktype = data.linktype;
          if (opts.copy) {
            this.timestamp = TimeStamp.now();
          } else {
            this.timestamp = data.timestamp.clone();
          }
          if (data._needsParse) {
            this._needsParse = true;
          } else {
            let offset = 0;
            data._eachLayer((l) => {
              this._createLayer(layers[l.name], this._buffer.subarray(offset), { allocated: l.length });
              offset += l.length;
            });
          }
        } else if (typeof data == "object") {
          const { buffer = null, iface = { ...defaults_default2 }, timestamp = TimeStamp.now(), origLength = null } = data;
          this._buffer = buffer;
          this._origLength = origLength;
          this._layersCount = 0;
          this.iface = iface;
          this.linktype = this.iface?.linktype ?? LinkLayerType.LINKTYPE_ETHERNET;
          this.timestamp = timestamp;
          this._needsParse = this._buffer?.length > 0;
        }
        if (data?.peer) {
          this.peer = data.peer;
        }
        if (data?.comment) {
          this.comment = data.comment;
        }
      }
      /**
       * Compares this packet with another packet for equality
       *
       * @param {Packet} pkt - The packet to compare with
       * @returns {boolean} True if packets are identical (same interface, timestamp, and buffer content)
       *
       * @example
       * const packet1 = new Packet({ buffer: data });
       * const packet2 = new Packet({ buffer: data });
       * if (packet1.equals(packet2)) {
       *   console.log('Packets are identical');
       * }
       */
      equals(pkt) {
        if (!(pkt instanceof _Packet)) {
          return false;
        }
        if (this.iface?.linktype !== pkt.iface?.linktype) {
          return false;
        }
        if (this.iface?.name !== pkt.iface?.name) {
          return false;
        }
        if (this.iface?.mtu !== pkt.iface?.mtu) {
          return false;
        }
        if (this.comment !== pkt.comment) {
          return false;
        }
        if (this.timestamp.compare(pkt.timestamp) !== 0) {
          return false;
        }
        if (Buffer.compare(this.buffer, pkt.buffer) !== 0) {
          return false;
        }
        return true;
      }
      get _needsBuild() {
        return this._toBuild.length > 0;
      }
      summary() {
        const described = [];
        this.layers;
        this._eachLayer((layer) => {
          const hasEndpoints = ["string", "number"].includes(typeof layer.src) && ["string", "number"].includes(typeof layer.dst);
          described.push(hasEndpoints ? `${layer.name} ${layer.src} > ${layer.dst}` : layer.name);
        });
        return described.join(" / ");
      }
      [/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")]() {
        const parts = [];
        const ifaceName = this.iface?.name;
        if (ifaceName !== void 0) {
          parts.push(ifaceName);
        }
        parts.push(`${this.buffer?.length ?? 0} bytes`);
        const layersSummary = this.summary();
        if (layersSummary.length > 0) {
          parts.push(layersSummary);
        }
        if (this.comment) {
          parts.push(this.comment);
        }
        return `<Packet ${parts.join(" | ")}>`;
      }
      _build() {
        if (!this._needsBuild) {
          return;
        }
        const pending = this._toBuild;
        this._toBuild = [];
        let toAlloc = 0;
        const sizes = [];
        for (const { Layer, data } of pending) {
          const size = Layer.toAlloc(data);
          toAlloc += size;
          sizes.push(size);
        }
        const newBuffer = Buffer.alloc(toAlloc);
        let curBuffer = newBuffer;
        if (Buffer.isBuffer(this._buffer)) {
          this._buffer = Buffer.concat([this._buffer, newBuffer]);
          curBuffer = this._buffer;
          this._eachLayer((l) => {
            l.buffer = curBuffer;
            curBuffer = curBuffer.subarray(l.length);
          });
        } else {
          this._buffer = newBuffer;
        }
        const built = [];
        for (let i = 0; i < pending.length; i++) {
          const { Layer, data } = pending[i];
          const layer = this._createLayer(Layer, curBuffer, { allocated: sizes[i] });
          layer.merge(data);
          curBuffer = curBuffer.subarray(layer.length);
          built.push(layer);
        }
        for (let innermostFirst = built.length - 1; innermostFirst >= 0; innermostFirst--) {
          built[innermostFirst].defaults(pending[innermostFirst].data);
        }
        for (let innermostFirst = built.length - 1; innermostFirst >= 0; innermostFirst--) {
          if (typeof built[innermostFirst].checksums == "function") {
            built[innermostFirst].checksums(pending[innermostFirst].data);
          }
        }
        this._origLength = null;
      }
      get origLength() {
        return this._origLength ?? this.length;
      }
      get length() {
        return this.buffer.length;
      }
      _parse() {
        let buf = this._buffer;
        const Layer = linktype[this.linktype] ?? layers.Payload;
        let layer;
        try {
          layer = new Layer(buf, {
            shrinkAt: this.shrinkAt,
            extendAt: this.extendAt,
            prev: null
          });
        } catch (err) {
          if (!isTruncatedLayerError(err)) {
            throw err;
          }
          layer = new layers.Payload(buf, { prev: null });
        }
        let remaining = buf.length;
        while (layer !== null && remaining > 0) {
          this._addLayer(layer);
          remaining -= layer.length;
          try {
            layer = layer.nextProto(layers);
          } catch (err) {
            if (!isTruncatedLayerError(err)) {
              throw err;
            }
            layer = remaining > 0 ? new layers.Payload(buf.subarray(buf.length - remaining), { prev: layer }) : null;
          }
        }
        this._dropLayerCreatedPastTheEnd();
        this._needsParse = false;
      }
      _dropLayerCreatedPastTheEnd() {
        if (this._layersTail !== null) {
          this._layersTail.next = null;
        }
      }
      get layers() {
        if (this._needsParse) {
          this._parse();
        }
        if (this._needsBuild) {
          this._build();
        }
        return this._layers;
      }
      /**
       * Converts the packet to a plain JavaScript object
       *
       * @returns {Object} Plain object representation
       * @returns {Object} returns.iface - Interface configuration
       * @returns {Object} returns.layers - Layer objects with their fields
       *
       * @example
       * const obj = packet.toObject();
       * console.log(obj.layers.IPv4.src);
       */
      toObject() {
        this.layers;
        const layers2 = {};
        for (const [name, layer] of Object.entries(this._layers)) {
          layers2[name] = Array.isArray(layer) ? layer.map((l) => l.toObject()) : layer.toObject();
        }
        return {
          iface: { ...this.iface },
          layers: layers2
        };
      }
      shrinkAt(...args) {
        throw new Error("Buffer shrinking not yet implemented, try creating new packet");
      }
      extendAt(...args) {
        throw new Error("Buffer extending not yet implemented, try creating new packet");
      }
      /**
       * Raw buffer containing the complete packet data
       * Automatically builds packet if layers were added
       *
       * @returns {Buffer} Complete packet buffer
       */
      get buffer() {
        if (this._needsBuild) {
          this._build();
        }
        return this._buffer;
      }
      /**
       * Creates a deep clone of the packet
       * Preserves all layers, timestamps, and interface settings
       *
       * @returns {Packet} New packet instance identical to this one
       */
      clone() {
        return new _Packet(this);
      }
      copy() {
        return new _Packet(this, { copy: true });
      }
    };
    Packet.prototype.add = function(Layer, data = {}) {
      this._toBuild.push({ Layer, data });
      return this;
    };
    installLayerMethods = (Builder, Layer) => {
      const addThisLayer = function(data = {}) {
        return this.add(Layer, data);
      };
      Builder.prototype[Layer.name.toLowerCase()] = addThisLayer;
      Builder.prototype[Layer.name] = addThisLayer;
    };
    for (const Layer of Object.values(layers)) {
      installLayerMethods(Packet, Layer);
    }
  }
});

// lib/bpfFilter.js
var BpfFilterCxx, BpfFilter;
var init_bpfFilter = __esm({
  "lib/bpfFilter.js"() {
    init_bindings();
    init_packet();
    ({ BpfFilter: BpfFilterCxx } = bindings_default);
    BpfFilter = class extends BpfFilterCxx {
      constructor(...args) {
        super(...args);
      }
      match(pkt, ...args) {
        if (pkt instanceof Packet) {
          return super.match(pkt.buffer, ...args);
        }
        return super.match(pkt, ...args);
      }
    };
  }
});

// lib/filter.js
var import_node_net, inetPton5, AF_INET65, TIMESTAMP_IS_IRRELEVANT, notExpressible, keyword, numeric, transportFields, TCP_FLAG_NAMES, pcapVocabulary, COMPARISONS, isComparison, sameValue, holds, eitherEnd, fieldHolds, layerMatches, rawMatches, treeMatches, anyOf, keywordExpression, numericExpression, tcpFlagsExpression, layerExpression, grouped, treeExpression, FilterBuilder;
var init_filter2 = __esm({
  "lib/filter.js"() {
    import_node_net = __toESM(require("node:net"), 1);
    init_packet();
    init_layers();
    init_bpfFilter();
    init_converters();
    init_socket();
    ({ inetPton: inetPton5 } = converters_default);
    ({ AF_INET6: AF_INET65 } = socket_default);
    TIMESTAMP_IS_IRRELEVANT = [0, 0];
    notExpressible = (message) => {
      const err = new Error(message);
      err.code = "ENOTEXPRESSIBLE";
      return err;
    };
    keyword = (prefix) => ({ kind: "keyword", prefix });
    numeric = (expression) => ({ kind: "numeric", expression });
    transportFields = (protocol) => ({
      src: keyword(`${protocol} src port`),
      dst: keyword(`${protocol} dst port`),
      port: keyword(`${protocol} port`)
    });
    TCP_FLAG_NAMES = {
      fin: "tcp-fin",
      syn: "tcp-syn",
      rst: "tcp-rst",
      psh: "tcp-push",
      ack: "tcp-ack",
      urg: "tcp-urg",
      ece: "tcp-ece",
      cwr: "tcp-cwr"
    };
    pcapVocabulary = {
      Ethernet: {
        presence: null,
        fields: {
          src: keyword("ether src"),
          dst: keyword("ether dst"),
          host: keyword("ether host"),
          type: keyword("ether proto")
        }
      },
      ARP: {
        presence: "arp",
        fields: {}
      },
      Vlan: {
        presence: "vlan",
        fields: {}
      },
      IPv4: {
        presence: "ip",
        fields: {
          src: keyword("ip src"),
          dst: keyword("ip dst"),
          host: keyword("ip host"),
          protocol: keyword("ip proto"),
          timeToLive: numeric("ip[8]"),
          typeOfService: numeric("ip[1]")
        }
      },
      IPv6: {
        presence: "ip6",
        fields: {
          src: keyword("ip6 src"),
          dst: keyword("ip6 dst"),
          host: keyword("ip6 host"),
          nextHeader: keyword("ip6 proto"),
          hopLimit: numeric("ip6[7]")
        }
      },
      TCP: {
        presence: "tcp",
        fields: transportFields("tcp")
      },
      UDP: {
        presence: "udp",
        fields: transportFields("udp")
      },
      ICMP: {
        presence: "icmp",
        fields: {
          type: numeric("icmp[icmptype]"),
          code: numeric("icmp[icmpcode]")
        }
      },
      ICMPv6: {
        presence: "icmp6",
        fields: {
          type: numeric("ip6[40]"),
          code: numeric("ip6[41]")
        }
      }
    };
    COMPARISONS = {
      eq: { symbol: "=", holds: (actual, expected) => sameValue(actual, expected) },
      ne: { symbol: "!=", holds: (actual, expected) => !sameValue(actual, expected) },
      lt: { symbol: "<", holds: (actual, expected) => actual < expected },
      lte: { symbol: "<=", holds: (actual, expected) => actual <= expected },
      gt: { symbol: ">", holds: (actual, expected) => actual > expected },
      gte: { symbol: ">=", holds: (actual, expected) => actual >= expected }
    };
    isComparison = (expected) => {
      if (expected === null || typeof expected !== "object" || Array.isArray(expected) || Buffer.isBuffer(expected)) {
        return false;
      }
      const operators = Object.keys(expected);
      return operators.length > 0 && operators.every((operator) => COMPARISONS[operator] !== void 0);
    };
    sameValue = (actual, expected) => {
      if (typeof actual == "string" && typeof expected == "string") {
        if (import_node_net.default.isIPv6(actual) && import_node_net.default.isIPv6(expected)) {
          return inetPton5(AF_INET65, actual).equals(inetPton5(AF_INET65, expected));
        }
        return actual.toLowerCase() === expected.toLowerCase();
      }
      return actual == expected;
    };
    holds = (actual, expected) => {
      if (typeof expected == "function") {
        return Boolean(expected(actual));
      }
      if (Array.isArray(expected)) {
        return expected.some((alternative) => holds(actual, alternative));
      }
      if (isComparison(expected)) {
        return Object.entries(expected).every(([operator, operand]) => COMPARISONS[operator].holds(actual, operand));
      }
      return sameValue(actual, expected);
    };
    eitherEnd = (layer, expected) => {
      return holds(layer.src, expected) || holds(layer.dst, expected);
    };
    fieldHolds = (layer, field, expected) => {
      if (field === "host" || field === "port") {
        return eitherEnd(layer, expected);
      }
      if (field === "flags" && expected !== null && typeof expected == "object") {
        const actualFlags = layer.flags;
        return Object.entries(expected).every(([flag, value]) => holds(actualFlags[flag], value));
      }
      return holds(layer[field], expected);
    };
    layerMatches = (term, packet) => {
      const found = packet.layers[term.layer];
      if (found === void 0) {
        return false;
      }
      const candidates = Array.isArray(found) ? found : [found];
      return candidates.some((layer) => {
        return Object.entries(term.fields).every(([field, expected]) => fieldHolds(layer, field, expected));
      });
    };
    rawMatches = (term, packet) => {
      const linktype3 = packet.linktype;
      if (term.compiled === void 0) {
        term.compiled = /* @__PURE__ */ new Map();
      }
      if (!term.compiled.has(linktype3)) {
        term.compiled.set(linktype3, new BpfFilter(term.expression, linktype3));
      }
      return term.compiled.get(linktype3).match(packet.buffer, TIMESTAMP_IS_IRRELEVANT, linktype3);
    };
    treeMatches = (term, packet) => {
      if (term.kind === "all") {
        return term.terms.every((inner) => treeMatches(inner, packet));
      }
      if (term.kind === "any") {
        return term.terms.some((inner) => treeMatches(inner, packet));
      }
      if (term.kind === "not") {
        return !treeMatches(term.term, packet);
      }
      if (term.kind === "raw") {
        return rawMatches(term, packet);
      }
      return layerMatches(term, packet);
    };
    anyOf = (alternatives) => {
      if (alternatives.length === 1) {
        return alternatives[0];
      }
      return `(${alternatives.join(" or ")})`;
    };
    keywordExpression = (layer, field, { prefix }, expected) => {
      const values2 = Array.isArray(expected) ? expected : [expected];
      for (const value of values2) {
        if (typeof value != "string" && typeof value != "number") {
          throw notExpressible(`${layer}.${field} can only be compared for equality in a capture filter`);
        }
      }
      return anyOf(values2.map((value) => `${prefix} ${value}`));
    };
    numericExpression = (layer, field, { expression }, expected) => {
      if (Array.isArray(expected)) {
        return anyOf(expected.map((value) => numericExpression(layer, field, { expression }, value)));
      }
      if (isComparison(expected)) {
        return Object.entries(expected).map(([operator, operand]) => `${expression} ${COMPARISONS[operator].symbol} ${operand}`).join(" and ");
      }
      if (typeof expected != "number") {
        throw notExpressible(`${layer}.${field} has to be a number in a capture filter`);
      }
      return `${expression} = ${expected}`;
    };
    tcpFlagsExpression = (expected) => {
      return Object.entries(expected).map(([flag, value]) => {
        const name = TCP_FLAG_NAMES[flag];
        if (name === void 0) {
          throw notExpressible(`TCP flag "${flag}" has no capture filter name`);
        }
        return `tcp[tcpflags] & ${name} ${value ? "!=" : "="} 0`;
      });
    };
    layerExpression = (term) => {
      const vocabulary = pcapVocabulary[term.layer];
      if (vocabulary === void 0) {
        throw notExpressible(`${term.layer} cannot be expressed in a capture filter`);
      }
      const parts = [];
      if (vocabulary.presence !== null) {
        parts.push(vocabulary.presence);
      }
      for (const [field, expected] of Object.entries(term.fields)) {
        if (term.layer === "TCP" && field === "flags") {
          parts.push(...tcpFlagsExpression(expected));
          continue;
        }
        const known = vocabulary.fields[field];
        if (known === void 0) {
          throw notExpressible(`${term.layer}.${field} cannot be expressed in a capture filter`);
        }
        if (known.kind === "keyword") {
          parts.push(keywordExpression(term.layer, field, known, expected));
        } else {
          parts.push(numericExpression(term.layer, field, known, expected));
        }
      }
      return parts.join(" and ");
    };
    grouped = (expression) => {
      return expression.includes(" ") ? `(${expression})` : expression;
    };
    treeExpression = (term) => {
      if (term.kind === "all") {
        return term.terms.map(treeExpression).filter((part) => part.length > 0).join(" and ");
      }
      if (term.kind === "any") {
        return `(${term.terms.map((inner) => grouped(treeExpression(inner))).join(" or ")})`;
      }
      if (term.kind === "not") {
        return `not ${grouped(treeExpression(term.term))}`;
      }
      if (term.kind === "raw") {
        return `(${term.expression})`;
      }
      return layerExpression(term);
    };
    FilterBuilder = class _FilterBuilder {
      constructor() {
        this.terms = [];
      }
      static from(description) {
        if (description instanceof _FilterBuilder) {
          return description;
        }
        const filter2 = new _FilterBuilder();
        if (typeof description == "function") {
          description(filter2);
          return filter2;
        }
        if (typeof description == "string") {
          return filter2.raw(description);
        }
        throw new Error("Expected a filter, a function describing one, or a capture filter expression");
      }
      add(Layer, fields = {}) {
        this.terms.push({ kind: "layer", layer: Layer.name, fields });
        return this;
      }
      raw(expression) {
        this.terms.push({ kind: "raw", expression });
        return this;
      }
      or(alternative) {
        this.terms = [{
          kind: "any",
          terms: [this.toTree(), _FilterBuilder.from(alternative).toTree()]
        }];
        return this;
      }
      not(excluded) {
        this.terms.push({ kind: "not", term: _FilterBuilder.from(excluded).toTree() });
        return this;
      }
      toTree() {
        return { kind: "all", terms: [...this.terms] };
      }
      toString() {
        return treeExpression(this.toTree());
      }
      [/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")]() {
        if (!this.expressible) {
          return `<Filter matched in process | ${this.terms.length} terms>`;
        }
        const expression = this.toString();
        return expression.length > 0 ? `<Filter ${expression}>` : "<Filter everything>";
      }
      get expressible() {
        try {
          this.toString();
          return true;
        } catch (err) {
          if (err.code !== "ENOTEXPRESSIBLE") {
            throw err;
          }
          return false;
        }
      }
      matches(packet) {
        return treeMatches(this.toTree(), packet);
      }
    };
    for (const Layer of Object.values(layers)) {
      installLayerMethods(FilterBuilder, Layer);
    }
  }
});

// lib/cli/style.js
var CODES, colorsWanted, paintWith;
var init_style = __esm({
  "lib/cli/style.js"() {
    CODES = {
      bold: [1, 22],
      dim: [2, 22],
      red: [31, 39],
      green: [32, 39],
      yellow: [33, 39],
      cyan: [36, 39]
    };
    colorsWanted = (stream = process.stdout) => {
      return Boolean(stream.isTTY) && process.env.NO_COLOR === void 0;
    };
    paintWith = (enabled) => {
      const paint = {};
      for (const [name, [open, close]] of Object.entries(CODES)) {
        paint[name] = (text) => {
          return enabled ? `\x1B[${open}m${text}\x1B[${close}m` : String(text);
        };
      }
      return paint;
    };
  }
});

// lib/cli/docs.js
var INDENT, formatValue, table, indented, renderProtocol, renderIndex, renderDocs;
var init_docs = __esm({
  "lib/cli/docs.js"() {
    init_protocols();
    init_filter2();
    init_style();
    INDENT = "  ";
    formatValue = (value) => {
      if (typeof value == "string") {
        return `'${value}'`;
      }
      if (value > 65535) {
        return `0x${value.toString(16)}`;
      }
      return String(value);
    };
    table = (rows) => {
      const widths = [];
      for (const row of rows) {
        row.forEach((cell, column) => {
          widths[column] = Math.max(widths[column] ?? 0, cell.length);
        });
      }
      return rows.map((row) => {
        return row.map((cell, column) => cell.padEnd(widths[column] + 2)).join("").trimEnd();
      });
    };
    indented = (lines, depth = 1) => {
      return lines.map((line) => `${INDENT.repeat(depth)}${line}`);
    };
    renderProtocol = (protocol, { color = false } = {}) => {
      const paint = paintWith(color);
      const lines = [];
      lines.push(`${paint.bold(protocol.layer)}  ${protocol.title}`);
      lines.push("");
      if (protocol.summary.length > 0) {
        lines.push(...indented([protocol.summary]));
        lines.push("");
      }
      const usage2 = [
        ["build", `wire.packet().${protocol.name}({ ... })`],
        ["match", `wire.filter().${protocol.name}({ ... })`],
        ["read", `packet.layers.${protocol.layer}`]
      ];
      if (Object.keys(protocol.namespace).length > 0) {
        usage2.push(["constants", `import { ${protocol.name} } from 'over-the-wire'`]);
      }
      lines.push(...indented(table(usage2)));
      lines.push("");
      lines.push(paint.bold("Fields"));
      lines.push(...indented(table(protocol.fields.map(({ name, type, description }) => {
        return [name, type, description];
      }))));
      for (const group of protocol.constants) {
        const field = group.field === void 0 ? "" : paint.dim(`  for ${group.field}`);
        lines.push("");
        lines.push(`${paint.bold(group.title)}${field}`);
        lines.push(...indented(table(Object.entries(group.values).map(([name, value]) => {
          return [`${protocol.name}.${name}`, formatValue(value)];
        }))));
      }
      const vocabulary = pcapVocabulary[protocol.layer];
      lines.push("");
      lines.push(paint.bold("Capture filter"));
      if (vocabulary === void 0) {
        lines.push(...indented(["Matched in the process after capture, not by the kernel."]));
      } else {
        const kernelFields = Object.keys(vocabulary.fields);
        const presence = vocabulary.presence === null ? "no keyword of its own" : `"${vocabulary.presence}"`;
        lines.push(...indented([
          `Compiled into the kernel filter: ${presence}${kernelFields.length > 0 ? `, fields ${kernelFields.join(", ")}` : ""}.`,
          "Any other field is matched in the process after capture."
        ]));
      }
      if (protocol.example !== null) {
        lines.push("");
        lines.push(paint.bold("Example"));
        lines.push(...indented([protocol.example]));
      }
      return lines.join("\n");
    };
    renderIndex = ({ color = false } = {}) => {
      const paint = paintWith(color);
      const rows = Object.values(protocols).map(({ name, title, namespace }) => {
        return [name, title, `${Object.keys(namespace).length} constants`];
      });
      return [
        paint.bold("Protocols"),
        ...indented(table(rows)),
        "",
        "otw docs <protocol> prints the fields and constants of one of them."
      ].join("\n");
    };
    renderDocs = (name, options = {}) => {
      if (name === void 0 || name === null) {
        return renderIndex(options);
      }
      const protocol = protocolFor(name);
      if (protocol === null) {
        const err = new Error(`Unknown protocol "${name}". Known: ${Object.keys(protocols).join(", ")}`);
        err.code = "EUNKNOWNPROTOCOL";
        throw err;
      }
      return renderProtocol(protocol, options);
    };
  }
});

// lib/pick.js
var has2, pick;
var init_pick = __esm({
  "lib/pick.js"() {
    has2 = (obj, k) => obj[k] !== void 0;
    pick = (obj, ...keys2) => keys2.reduce((res, e) => has2(obj, e) ? { ...res, [e]: obj[e] } : res, {});
  }
});

// lib/packetBuilder.js
var import_node_net2, inetPton6, AF_INET66, ETHERNET_BROADCAST, IPV4_BROADCAST, resolutionError, toHexPair, ipv6MulticastMac, isIpv6Multicast, ipv4MulticastMac, isIpv4Multicast, isNetworkLayer, linktypeStartingAt, PacketBuilder;
var init_packetBuilder = __esm({
  "lib/packetBuilder.js"() {
    import_node_net2 = __toESM(require("node:net"), 1);
    init_packet();
    init_layers();
    init_enums();
    init_converters();
    init_socket();
    ({ inetPton: inetPton6 } = converters_default);
    ({ AF_INET6: AF_INET66 } = socket_default);
    ETHERNET_BROADCAST = "ff:ff:ff:ff:ff:ff";
    IPV4_BROADCAST = "255.255.255.255";
    resolutionError = (code, message) => {
      const err = new Error(message);
      err.code = code;
      return err;
    };
    toHexPair = (byte) => {
      return byte.toString(16).padStart(2, "0");
    };
    ipv6MulticastMac = (address) => {
      const lastFourBytes = inetPton6(AF_INET66, address).subarray(12);
      return ["33", "33", ...[...lastFourBytes].map(toHexPair)].join(":");
    };
    isIpv6Multicast = (address) => {
      return address.toLowerCase().startsWith("ff");
    };
    ipv4MulticastMac = (address) => {
      const [, second, third, fourth] = address.split(".").map(Number);
      return ["01", "00", "5e", toHexPair(second & 127), toHexPair(third), toHexPair(fourth)].join(":");
    };
    isIpv4Multicast = (address) => {
      const firstOctet = Number(address.split(".")[0]);
      return firstOctet >= 224 && firstOctet <= 239;
    };
    isNetworkLayer = ({ Layer }) => {
      return Layer === layers.IPv4 || Layer === layers.IPv6;
    };
    linktypeStartingAt = (Layer) => {
      return Layer?.linktype ?? LinkLayerType.LINKTYPE_ETHERNET;
    };
    PacketBuilder = class {
      constructor(wire, { iface = null } = {}) {
        this.wire = wire;
        this.iface = iface ?? wire?.iface ?? null;
        this.specs = [];
        this.execution = null;
      }
      add(Layer, data = {}) {
        if (this.execution !== null) {
          throw new Error("This packet was already resolved, start a new one with packet()");
        }
        this.specs.push({ Layer, data });
        return this;
      }
      packetFrom(specs, iface) {
        const packet = new Packet({ iface });
        for (const { Layer, data } of specs) {
          packet.add(Layer, data);
        }
        return packet;
      }
      build() {
        const iface = { linktype: linktypeStartingAt(this.specs[0]?.Layer) };
        if (this.iface !== null) {
          iface.name = this.iface;
        }
        return this.packetFrom(this.specs, iface);
      }
      get buffer() {
        return this.build().buffer;
      }
      get layers() {
        return this.build().layers;
      }
      exec() {
        if (this.execution === null) {
          this.execution = this.resolve();
        }
        return this.execution;
      }
      then(onResolved, onRejected) {
        return this.exec().then(onResolved, onRejected);
      }
      catch(onRejected) {
        return this.exec().catch(onRejected);
      }
      finally(onSettled) {
        return this.exec().finally(onSettled);
      }
      async resolve() {
        const specs = this.specs.map(({ Layer, data }) => ({ Layer, data: { ...data } }));
        const network = specs.find(isNetworkLayer);
        if (network === void 0 || network.data.dst === void 0) {
          return this.packetFrom(specs, this.build().iface);
        }
        const route = await this.wire.route(network.data.dst, { iface: this.iface });
        const local = this.wire.addresses(route.iface);
        if (network.data.src === void 0) {
          network.data.src = this.sourceAddress(network, local, route);
        }
        const linkLayer = this.wire.linkLayerOf(route.iface);
        if (specs[0] === network) {
          if (linkLayer === "loopback") {
            specs.unshift({ Layer: layers.Loopback, data: {} });
          }
          if (linkLayer === "ethernet" || linkLayer === "ethernet-without-addresses") {
            specs.unshift({ Layer: layers.Ethernet, data: {} });
          }
        }
        const link = specs[0].Layer === layers.Ethernet ? specs[0] : null;
        if (link !== null && linkLayer === "ethernet") {
          if (link.data.src === void 0) {
            link.data.src = local.mac;
          }
          if (link.data.dst === void 0) {
            link.data.dst = await this.linkDestination(network, route);
          }
        }
        return this.packetFrom(specs, {
          name: route.iface,
          linktype: linktypeStartingAt(specs[0].Layer)
        });
      }
      sourceAddress(network, local, route) {
        const address = network.Layer === layers.IPv4 ? local.ipv4 : local.ipv6;
        if (address === void 0) {
          throw resolutionError("ENOADDRESS", `Interface ${route.iface} has no ${network.Layer.name} address`);
        }
        return address;
      }
      async linkDestination(network, route) {
        const destination = network.data.dst;
        if (network.Layer === layers.IPv4) {
          if (destination === IPV4_BROADCAST) {
            return ETHERNET_BROADCAST;
          }
          if (isIpv4Multicast(destination)) {
            return ipv4MulticastMac(destination);
          }
        }
        if (network.Layer === layers.IPv6 && isIpv6Multicast(destination)) {
          return ipv6MulticastMac(destination);
        }
        const nextHop = import_node_net2.default.isIP(route.ip) ? route.ip : destination;
        const mac = await this.wire.neighbour(nextHop, route.iface);
        if (mac === null) {
          throw resolutionError(
            "ENONEIGHBOUR",
            `${nextHop} did not answer on ${route.iface}, so its link-layer address is unknown`
          );
        }
        return mac;
      }
    };
    for (const Layer of Object.values(layers)) {
      installLayerMethods(PacketBuilder, Layer);
    }
  }
});

// lib/expect.js
var DEFAULT_TIMEOUT_MS, MAX_UNEXAMINED_PACKETS, toPredicate, installExpect;
var init_expect = __esm({
  "lib/expect.js"() {
    init_filter2();
    DEFAULT_TIMEOUT_MS = 1e3;
    MAX_UNEXAMINED_PACKETS = 4096;
    toPredicate = (filter2) => {
      if (filter2 === void 0 || filter2 === null) {
        return () => true;
      }
      if (typeof filter2 == "function") {
        return filter2;
      }
      const described = FilterBuilder.from(filter2);
      return (packet) => {
        return described.matches(packet);
      };
    };
    installExpect = (Stream) => {
      Stream.prototype.watch = function() {
        if (this.unexamined !== void 0) {
          return this;
        }
        this.unexamined = [];
        this.expectation = null;
        this.on("data", (packet) => {
          this.unexamined.push(packet);
          if (this.unexamined.length > MAX_UNEXAMINED_PACKETS) {
            this.unexamined.shift();
            if (this.expectation !== null && this.expectation.examinedCount > 0) {
              this.expectation.examinedCount--;
            }
          }
          this.settleExpectation();
        });
        return this;
      };
      Stream.prototype.settleExpectation = function() {
        const expectation = this.expectation;
        if (expectation === null) {
          return;
        }
        while (expectation.examinedCount < this.unexamined.length) {
          const packet = this.unexamined[expectation.examinedCount];
          expectation.examinedCount++;
          if (expectation.matches(packet)) {
            this.unexamined.splice(0, expectation.examinedCount);
            clearTimeout(expectation.timer);
            this.expectation = null;
            expectation.resolve(packet);
            return;
          }
        }
      };
      Stream.prototype.expect = function(filter2, { timeout = DEFAULT_TIMEOUT_MS } = {}) {
        if (this.expectation !== void 0 && this.expectation !== null) {
          return Promise.reject(new Error("Another expect() is still waiting on this stream"));
        }
        this.watch();
        return new Promise((resolve6) => {
          const expectation = {
            matches: toPredicate(filter2),
            examinedCount: 0,
            resolve: resolve6,
            timer: null
          };
          expectation.timer = setTimeout(() => {
            if (this.expectation === expectation) {
              this.expectation = null;
            }
            resolve6(null);
          }, timeout);
          this.expectation = expectation;
          this.settleExpectation();
        });
      };
      return Stream;
    };
  }
});

// lib/liveDevice.js
var import_stream, LiveDeviceCxx, optionsKeys, manualOptionsKeys, getOptions, LiveDevice;
var init_liveDevice = __esm({
  "lib/liveDevice.js"() {
    import_stream = require("stream");
    init_bindings();
    init_pick();
    init_packet();
    init_packetBuilder();
    init_expect();
    ({ PcapDevice: LiveDeviceCxx } = bindings_default);
    optionsKeys = [
      "capture",
      "parse",
      "mode",
      "direction",
      "packetBufferTimeoutMs",
      "packetBufferSize",
      "snapshotLength",
      "nflogGroup"
    ];
    manualOptionsKeys = ["filter", "iface"];
    getOptions = (obj) => pick(obj, ...optionsKeys, ...manualOptionsKeys);
    LiveDevice = class extends import_stream.Duplex {
      /**
       * Creates an instance of LiveDevice.
       * @param {LiveDeviceOptions} options - The options for the LiveDevice instance.
       */
      constructor(options = {}) {
        super({ objectMode: true });
        this.options = getOptions(options);
        this.isOpen = false;
        this.capturing = false;
        this.optionsChanged = false;
        optionsKeys.forEach((opt) => {
          Object.defineProperty(this, opt, {
            get() {
              return this.options[opt];
            },
            set(val) {
              this.optionsChanged = true;
              return this.options[opt] = val;
            }
          });
        });
        this.options.push = (buffer) => {
          if (!this._ifaceCached) {
            this._ifaceCached = this.iface;
          }
          const res = this.push(new Packet({ buffer, iface: this._ifaceCached }));
          if (!res) {
            this.pcapInternal.stopCapture();
            this.capturing = false;
          }
        };
        this.pcapInternal = new LiveDeviceCxx(this.options);
      }
      _construct(callback) {
        if (this.optionsChanged) {
          this.pcapInternal.setConfig(this.options);
        }
        if (!this.pcapInternal) {
          return callback();
        }
        try {
          this.pcapInternal.open();
        } catch (err) {
          return callback(err);
        }
        this.isOpen = true;
        if (this.options.filter) {
          this.pcapInternal.setFilter(this.options.filter);
        }
        callback();
      }
      _read(size) {
        if (this.options.capture === false) {
          this.push(null);
        } else if (!this.capturing) {
          this.pcapInternal.startCapture();
          this.capturing = true;
        }
      }
      _write(chunk, encoding, callback) {
        if (chunk instanceof PacketBuilder) {
          return this.pcapInternal._write(chunk.build().buffer, callback);
        }
        if (chunk instanceof Packet) {
          return this.pcapInternal._write(chunk.buffer, callback);
        }
        if (Buffer.isBuffer(chunk) || ArrayBuffer.isView(chunk)) {
          if (chunk.length > 0) {
            return this.pcapInternal._write(chunk, callback);
          } else {
            callback();
          }
        } else {
          callback(new Error("Invalid argument - expected Packet | Buffer | TypedArray"));
        }
      }
      _writev(chunks, callback) {
        const buffers = chunks.map(({ chunk }) => {
          if (chunk instanceof PacketBuilder) {
            return chunk.build().buffer;
          }
          if (chunk instanceof Packet) {
            return chunk.buffer;
          }
          return chunk;
        });
        return this.pcapInternal._write(buffers, callback);
      }
      _destroy(err, callback) {
        if (this.pcapInternal) {
          this.pcapInternal._destroy();
        }
        callback(err);
      }
      _final(callback) {
        this.pcapInternal._destroy();
        delete this.pcapInternal;
        callback();
      }
      /**
       * The statistics of the device.
       * @throws {Error} If the device is not open.
       * @type {DeviceStats}
       */
      get stats() {
        if (!this.isOpen) {
          throw new Error("Device is not open");
        }
        return this.pcapInternal.stats;
      }
      /**
       * The filter for the device.
       * @type {string}
       */
      set filter(filter2) {
        this.options.filter = filter2;
        if (this.isOpen) {
          this.pcapInternal.setFilter(filter2);
        }
        return filter2;
      }
      get filter() {
        return this.options.filter;
      }
      set iface(iface) {
        this.options.iface = iface;
      }
      /**
       * The interface information for the device.
       * @type {InterfaceInfo}
       */
      get iface() {
        return this.pcapInternal.interfaceInfo;
      }
    };
    installExpect(LiveDevice);
  }
});

// lib/pcapFile/parser/bytes.js
var EMPTY, ByteSource;
var init_bytes = __esm({
  "lib/pcapFile/parser/bytes.js"() {
    EMPTY = Buffer.alloc(0);
    ByteSource = class {
      constructor() {
        this.queue = [];
        this.head = null;
        this.headOff = 0;
        this.available = 0;
        this.consumed = 0;
        this.endian = "LE";
      }
      feed(chunk) {
        if (chunk === null || chunk.length === 0) return;
        if (this.head === null) {
          this.head = chunk;
          this.headOff = 0;
        } else {
          this.queue.push(chunk);
        }
        this.available += chunk.length;
      }
      ensure(n) {
        return this.available >= n;
      }
      _advanceHead() {
        if (this.head !== null && this.headOff >= this.head.length) {
          this.head = this.queue.length > 0 ? this.queue.shift() : null;
          this.headOff = 0;
        }
      }
      skip(n) {
        if (this.available < n) throw new RangeError("skip past available");
        this.available -= n;
        this.consumed += n;
        while (n > 0) {
          const left2 = this.head.length - this.headOff;
          if (left2 > n) {
            this.headOff += n;
            return;
          }
          n -= left2;
          this.head = this.queue.length > 0 ? this.queue.shift() : null;
          this.headOff = 0;
        }
      }
      /**
       * Take exactly n bytes. Returns a Buffer view (zero-copy when possible).
       * Caller must have verified ensure(n) beforehand.
       */
      take(n) {
        if (n === 0) return EMPTY;
        const head2 = this.head;
        const off = this.headOff;
        const left2 = head2.length - off;
        this.available -= n;
        this.consumed += n;
        if (left2 >= n) {
          const out2 = head2.subarray(off, off + n);
          this.headOff = off + n;
          this._advanceHead();
          return out2;
        }
        const out = Buffer.allocUnsafe(n);
        head2.copy(out, 0, off, head2.length);
        let written = left2;
        this.head = this.queue.length > 0 ? this.queue.shift() : null;
        this.headOff = 0;
        while (written < n) {
          const cur = this.head;
          const need = n - written;
          if (cur.length <= need) {
            cur.copy(out, written);
            written += cur.length;
            this.head = this.queue.length > 0 ? this.queue.shift() : null;
            this.headOff = 0;
          } else {
            cur.copy(out, written, 0, need);
            this.headOff = need;
            written = n;
          }
        }
        return out;
      }
      /** Read a UInt8 with current endianness (endianness has no effect on u8). */
      readU8() {
        if (this.available < 1) throw new RangeError("readU8 past available");
        const v = this.head[this.headOff];
        this.headOff += 1;
        this.available -= 1;
        this.consumed += 1;
        this._advanceHead();
        return v;
      }
      readU16() {
        if (this.head.length - this.headOff >= 2) {
          const v = this.endian === "LE" ? this.head.readUInt16LE(this.headOff) : this.head.readUInt16BE(this.headOff);
          this.headOff += 2;
          this.available -= 2;
          this.consumed += 2;
          this._advanceHead();
          return v;
        }
        const buf = this.take(2);
        return this.endian === "LE" ? buf.readUInt16LE(0) : buf.readUInt16BE(0);
      }
      readU32() {
        if (this.head.length - this.headOff >= 4) {
          const v = this.endian === "LE" ? this.head.readUInt32LE(this.headOff) : this.head.readUInt32BE(this.headOff);
          this.headOff += 4;
          this.available -= 4;
          this.consumed += 4;
          this._advanceHead();
          return v;
        }
        const buf = this.take(4);
        return this.endian === "LE" ? buf.readUInt32LE(0) : buf.readUInt32BE(0);
      }
      readI32() {
        if (this.head.length - this.headOff >= 4) {
          const v = this.endian === "LE" ? this.head.readInt32LE(this.headOff) : this.head.readInt32BE(this.headOff);
          this.headOff += 4;
          this.available -= 4;
          this.consumed += 4;
          this._advanceHead();
          return v;
        }
        const buf = this.take(4);
        return this.endian === "LE" ? buf.readInt32LE(0) : buf.readInt32BE(0);
      }
      /** Forced LE u32 read regardless of current endianness — used for magic bytes. */
      readU32LE() {
        if (this.head.length - this.headOff >= 4) {
          const v = this.head.readUInt32LE(this.headOff);
          this.headOff += 4;
          this.available -= 4;
          this.consumed += 4;
          this._advanceHead();
          return v;
        }
        const buf = this.take(4);
        return buf.readUInt32LE(0);
      }
    };
  }
});

// lib/pcapFile/parser/ops.js
var READ_U8, READ_U16, READ_U32, READ_I32, READ_U32_LE, READ_BYTES, READ_STRUCT, SKIP, HAS_BYTES, SET_ENDIAN, PUSH, EMIT_EVENT, CONTEXT;
var init_ops = __esm({
  "lib/pcapFile/parser/ops.js"() {
    READ_U8 = 1;
    READ_U16 = 2;
    READ_U32 = 3;
    READ_I32 = 4;
    READ_U32_LE = 5;
    READ_BYTES = 6;
    READ_STRUCT = 7;
    SKIP = 8;
    HAS_BYTES = 9;
    SET_ENDIAN = 10;
    PUSH = 11;
    EMIT_EVENT = 12;
    CONTEXT = 13;
  }
});

// lib/pcapFile/parser/engine.js
function makeTruncated(src, what) {
  return new Error(`truncated input at byte ${src.consumed}: needed more for ${what}`);
}
var Engine;
var init_engine = __esm({
  "lib/pcapFile/parser/engine.js"() {
    init_ops();
    Engine = class {
      constructor(genFn, source, transform, ctx) {
        this.source = source;
        this.transform = transform;
        this.context = ctx;
        this.gen = genFn(ctx);
        this.midParse = true;
        this.eof = false;
        this.parkedBack = false;
        this.pending = null;
        this.lastResult = void 0;
      }
      drive() {
        const src = this.source;
        const gen = this.gen;
        let last2 = this.lastResult;
        for (; ; ) {
          let op;
          if (this.pending !== null) {
            op = this.pending;
            this.pending = null;
          } else {
            const r = gen.next(last2);
            if (r.done) {
              this.midParse = false;
              this.lastResult = void 0;
              return;
            }
            op = r.value;
          }
          switch (op.tag) {
            case READ_U32: {
              if (src.available < 4) {
                if (this.eof) throw makeTruncated(src, "u32");
                this.pending = op;
                this.lastResult = last2;
                return;
              }
              last2 = src.readU32();
              break;
            }
            case READ_U16: {
              if (src.available < 2) {
                if (this.eof) throw makeTruncated(src, "u16");
                this.pending = op;
                this.lastResult = last2;
                return;
              }
              last2 = src.readU16();
              break;
            }
            case READ_U8: {
              if (src.available < 1) {
                if (this.eof) throw makeTruncated(src, "u8");
                this.pending = op;
                this.lastResult = last2;
                return;
              }
              last2 = src.readU8();
              break;
            }
            case READ_I32: {
              if (src.available < 4) {
                if (this.eof) throw makeTruncated(src, "i32");
                this.pending = op;
                this.lastResult = last2;
                return;
              }
              last2 = src.readI32();
              break;
            }
            case READ_U32_LE: {
              if (src.available < 4) {
                if (this.eof) throw makeTruncated(src, "u32le");
                this.pending = op;
                this.lastResult = last2;
                return;
              }
              last2 = src.readU32LE();
              break;
            }
            case READ_BYTES: {
              if (src.available < op.n) {
                if (this.eof) throw makeTruncated(src, `bytes(${op.n})`);
                this.pending = op;
                this.lastResult = last2;
                return;
              }
              last2 = src.take(op.n);
              break;
            }
            case READ_STRUCT: {
              const n = op.size;
              if (src.available < n) {
                if (this.eof) throw makeTruncated(src, `struct(${n})`);
                this.pending = op;
                this.lastResult = last2;
                return;
              }
              const buf = src.take(n);
              last2 = src.endian === "LE" ? op.decodeLE(buf, 0) : op.decodeBE(buf, 0);
              break;
            }
            case SKIP: {
              if (src.available < op.n) {
                if (this.eof) throw makeTruncated(src, `skip(${op.n})`);
                this.pending = op;
                this.lastResult = last2;
                return;
              }
              src.skip(op.n);
              last2 = void 0;
              break;
            }
            case HAS_BYTES: {
              if (src.available >= op.n) {
                last2 = true;
                break;
              }
              if (this.eof) {
                last2 = false;
                break;
              }
              this.pending = op;
              this.lastResult = last2;
              return;
            }
            case SET_ENDIAN: {
              src.endian = op.e;
              last2 = void 0;
              break;
            }
            case PUSH: {
              if (!this.transform.push(op.value)) {
                this.parkedBack = true;
                this.lastResult = void 0;
                return;
              }
              last2 = void 0;
              break;
            }
            case EMIT_EVENT: {
              this.transform.emit(op.event, op.value);
              last2 = void 0;
              break;
            }
            case CONTEXT: {
              last2 = this.context;
              break;
            }
            default:
              throw new Error(`Unknown op tag: ${op && op.tag}`);
          }
        }
      }
    };
  }
});

// lib/pcapFile/parser/frame.js
var init_frame = __esm({
  "lib/pcapFile/parser/frame.js"() {
  }
});

// lib/pcapFile/parser/struct.js
function wrap2(compiled) {
  return {
    tag: READ_STRUCT,
    size: compiled.size,
    decodeLE: compiled.decodeLE,
    decodeBE: compiled.decodeBE,
    encodeLE: compiled.encodeLE,
    encodeBE: compiled.encodeBE,
    write(frame, value) {
      frame.ensure(this.size);
      const enc = frame.endian === "LE" ? this.encodeLE : this.encodeBE;
      enc(frame.buf, frame.off, value);
      frame.off += this.size;
    }
  };
}
function cstruct(src) {
  const compiled = compile(src);
  const out = {};
  for (const name of Object.keys(compiled)) out[name] = wrap2(compiled[name]);
  return out;
}
var init_struct2 = __esm({
  "lib/pcapFile/parser/struct.js"() {
    init_src();
    init_ops();
  }
});

// lib/pcapFile/parser/primitives.js
var u8, u16, u32, i32, u32le, context, setEndian, bytes, skip, hasBytes, push, emit;
var init_primitives = __esm({
  "lib/pcapFile/parser/primitives.js"() {
    init_ops();
    u8 = Object.freeze({ tag: READ_U8 });
    u16 = Object.freeze({ tag: READ_U16 });
    u32 = Object.freeze({ tag: READ_U32 });
    i32 = Object.freeze({ tag: READ_I32 });
    u32le = Object.freeze({ tag: READ_U32_LE });
    context = Object.freeze({ tag: CONTEXT });
    setEndian = (e) => ({ tag: SET_ENDIAN, e });
    bytes = (n) => ({ tag: READ_BYTES, n });
    skip = (n) => ({ tag: SKIP, n });
    hasBytes = (n) => ({ tag: HAS_BYTES, n });
    push = (value) => ({ tag: PUSH, value });
    emit = (event, value) => ({ tag: EMIT_EVENT, event, value });
  }
});

// lib/pcapFile/parser/index.js
var init_parser3 = __esm({
  "lib/pcapFile/parser/index.js"() {
    init_bytes();
    init_engine();
    init_frame();
    init_struct2();
    init_primitives();
  }
});

// lib/pcapFile/pcap.js
function* parsePcap(ctx) {
  const magic = yield u32le;
  let endian, nano;
  switch (magic) {
    case BYTE_ORDER_MAGIC:
      endian = "LE";
      nano = false;
      break;
    case BYTE_ORDER_MAGIC_NANO:
      endian = "LE";
      nano = true;
      break;
    case BYTE_ORDER_MAGIC_SWAPPED:
      endian = "BE";
      nano = false;
      break;
    case BYTE_ORDER_MAGIC_SWAPPED_NANO:
      endian = "BE";
      nano = true;
      break;
    default:
      throw new Error(`Unknown magic number: 0x${magic.toString(16)}`);
  }
  yield setEndian(endian);
  const tail = yield PcapFileHeaderTail;
  const hdr = {
    magic,
    version_major: tail.version_major,
    version_minor: tail.version_minor,
    thiszone: tail.thiszone,
    sigfigs: tail.sigfigs,
    snaplen: tail.snaplen,
    linktype: tail.linktype
  };
  yield emit("header", hdr);
  ctx.linktype = hdr.linktype;
  ctx.timeUnit = nano ? "ns" : "ms";
  ctx.iface = { linktype: hdr.linktype };
  const iface = ctx.iface;
  const usingNs = nano;
  while (true) {
    const more = yield hasBytes(16);
    if (!more) return;
    const ph = yield PacketHeader;
    const buf = yield bytes(ph.caplen);
    const ts = usingNs ? new TimeStamp({ s: ph.tv_sec, ns: ph.tv_usec }) : new TimeStamp({ s: ph.tv_sec, ns: ph.tv_usec * NANOSECONDS_PER_MICROSECOND });
    yield push(new Packet({
      buffer: buf,
      iface,
      timestamp: ts
    }));
  }
}
var import_stream2, NANOSECONDS_PER_MICROSECOND, BYTE_ORDER_MAGIC, BYTE_ORDER_MAGIC_NANO, BYTE_ORDER_MAGIC_SWAPPED, BYTE_ORDER_MAGIC_SWAPPED_NANO, PcapFileHeaderTail, PcapFileHeaderFull, PacketHeader, PcapInputStream, PKT_HDR_SIZE, PcapOutputStream;
var init_pcap = __esm({
  "lib/pcapFile/pcap.js"() {
    import_stream2 = require("stream");
    init_parser3();
    init_timestamp();
    init_packet();
    init_defaults2();
    NANOSECONDS_PER_MICROSECOND = 1e3;
    BYTE_ORDER_MAGIC = 2712847316;
    BYTE_ORDER_MAGIC_NANO = 2712812621;
    BYTE_ORDER_MAGIC_SWAPPED = 3569595041;
    BYTE_ORDER_MAGIC_SWAPPED_NANO = 1295823521;
    ({ PcapFileHeaderTail, PcapFileHeaderFull, PacketHeader } = cstruct(`
  //@LE
  struct __attribute__((__packed__)) PcapFileHeaderTail {
    uint16_t version_major;
    uint16_t version_minor;
    int32_t  thiszone;
    uint32_t sigfigs;
    uint32_t snaplen;
    uint32_t linktype;
  };

  //@LE
  struct __attribute__((__packed__)) PcapFileHeaderFull {
    uint32_t magic;
    uint16_t version_major;
    uint16_t version_minor;
    int32_t  thiszone;
    uint32_t sigfigs;
    uint32_t snaplen;
    uint32_t linktype;
  };

  //@LE
  struct __attribute__((__packed__)) PacketHeader {
    uint32_t tv_sec;
    uint32_t tv_usec;
    uint32_t caplen;
    uint32_t len;
  };
`));
    PcapInputStream = class extends import_stream2.Transform {
      constructor(opts = {}) {
        super({ ...opts, readableObjectMode: true });
        this.source = new ByteSource();
        const ctx = { linktype: null, timeUnit: "ms", iface: null };
        this.engine = new Engine(parsePcap, this.source, this, ctx);
      }
      _transform(chunk, _enc, cb) {
        this.source.feed(chunk);
        try {
          this.engine.drive();
        } catch (err) {
          return cb(err);
        }
        cb();
      }
      _read(size) {
        if (this.engine.parkedBack) {
          this.engine.parkedBack = false;
          try {
            this.engine.drive();
          } catch (err) {
            this.destroy(err);
            return;
          }
        }
        return super._read(size);
      }
      _flush(cb) {
        this.engine.eof = true;
        try {
          this.engine.drive();
        } catch (err) {
          return cb(err);
        }
        cb();
      }
    };
    PKT_HDR_SIZE = PacketHeader.size;
    PcapOutputStream = class extends import_stream2.Transform {
      constructor({ timeUnit = "ms", iface = null, snaplen: snaplen2 = null, ...opts } = {}) {
        super({ ...opts, writableObjectMode: true });
        this.timeUnit = timeUnit;
        this.snaplen = snaplen2 ?? iface?.snaplen ?? defaults_default2.snaplen;
        this.linktype = iface?.linktype ?? defaults_default2.linktype;
        this.hdrDone = false;
      }
      _writeHeader(chunk) {
        let snaplen2, linktype3;
        if (chunk instanceof Packet) {
          snaplen2 = chunk.iface?.snaplen;
          linktype3 = chunk.linktype;
        }
        snaplen2 = snaplen2 || this.snaplen;
        linktype3 = linktype3 ?? this.linktype;
        this.linktype = linktype3;
        const buf = Buffer.allocUnsafe(PcapFileHeaderFull.size);
        PcapFileHeaderFull.encodeLE(buf, 0, {
          magic: this.timeUnit === "ms" ? BYTE_ORDER_MAGIC : BYTE_ORDER_MAGIC_NANO,
          version_major: 2,
          version_minor: 4,
          thiszone: 0,
          sigfigs: 0,
          snaplen: snaplen2,
          linktype: linktype3
        });
        this.push(buf);
        this.hdrDone = true;
      }
      _transform(chunk, _enc, cb) {
        try {
          if (!this.hdrDone) this._writeHeader(chunk);
          let ts, buffer;
          if (Buffer.isBuffer(chunk)) {
            ts = TimeStamp.now(this.timeUnit);
            buffer = chunk;
          } else if (chunk instanceof Packet) {
            if (chunk.linktype !== this.linktype) {
              return cb(new Error(`Packet's linktype (${chunk.linktype}) does not match stream's (${this.linktype})`));
            }
            ts = chunk.timestamp;
            buffer = chunk.buffer;
          } else {
            return cb(new Error(`Invalid argument: ${chunk}`));
          }
          let tv_sec, tv_usec;
          if (this.timeUnit === "ns") {
            const p = ts.packedIn({ s: true, ns: true });
            tv_sec = p.s;
            tv_usec = p.ns;
          } else {
            const p = ts.packedIn({ s: true, ns: true });
            tv_sec = p.s;
            tv_usec = Math.floor(p.ns / NANOSECONDS_PER_MICROSECOND);
          }
          const hdrBuf = Buffer.allocUnsafe(PKT_HDR_SIZE);
          PacketHeader.encodeLE(hdrBuf, 0, {
            tv_sec,
            tv_usec,
            caplen: buffer.length,
            len: buffer.length
          });
          this.push(hdrBuf);
          this.push(buffer);
        } catch (err) {
          return cb(err);
        }
        cb();
      }
    };
  }
});

// lib/pcapFile/tsresol.js
function build2(rawByte) {
  const isPow2 = (rawByte & 128) !== 0;
  const exp = rawByte & 127;
  const ticksPerSec = isPow2 ? Math.pow(2, exp) : Math.pow(10, exp);
  const nsPerTick = 1e9 / ticksPerSec;
  const fastPath = !isPow2 && Number.isInteger(nsPerTick) && nsPerTick >= 1;
  return {
    rawByte,
    ticksPerSec,
    ticksPerSecBig: BigInt(Math.round(ticksPerSec)),
    nsPerTick,
    fastPath,
    raw: Buffer.from([rawByte, 0, 0, 0])
  };
}
function fromBuffer(buf) {
  if (buf == null) return DEFAULT;
  const byte = typeof buf === "string" ? buf.charCodeAt(0) : buf[0];
  return build2(byte);
}
function toTimestamp(tsr, high, low) {
  if (tsr.fastPath) {
    const D = tsr.ticksPerSec;
    const q1 = Math.floor(high / D);
    let r2 = high - q1 * D;
    const lh = low >>> 16;
    const ll = low & 65535;
    let u = r2 * TWO16 + lh;
    const q2 = Math.floor(u / D);
    r2 = u - q2 * D;
    let v = r2 * TWO16 + ll;
    const q3 = Math.floor(v / D);
    r2 = v - q3 * D;
    const sec = q1 * TWO32 + q2 * TWO16 + q3;
    const ns2 = r2 * tsr.nsPerTick;
    const ts2 = new TimeStamp({ s: sec, ns: ns2 });
    ts2.tsresol = tsr.raw;
    return ts2;
  }
  const T = BigInt(high) * BIG_2_32 + BigInt(low);
  const ns = T * BIG_1E9 / tsr.ticksPerSecBig;
  const s = Number(ns / BIG_1E9);
  const r = Number(ns - BigInt(s) * BIG_1E9);
  const ts = new TimeStamp({ s, ns: r });
  ts.tsresol = tsr.raw;
  return ts;
}
function fromTimestamp(tsr, ts) {
  const value = ts.ns * tsr.ticksPerSecBig / BIG_1E9;
  return {
    timestamp_high: Number(value >> 32n),
    timestamp_low: Number(value & BIG_LOMSK)
  };
}
function serialize(tsresolBuf, ts) {
  return fromTimestamp(fromBuffer(tsresolBuf), ts);
}
function parse(tsresolBuf, body) {
  return toTimestamp(fromBuffer(tsresolBuf), body.timestamp_high, body.timestamp_low);
}
var BIG_1E9, BIG_2_32, BIG_LOMSK, TWO16, TWO32, DEFAULT_TSRESOL_BYTE, DEFAULT, tsresol_default;
var init_tsresol = __esm({
  "lib/pcapFile/tsresol.js"() {
    init_timestamp();
    BIG_1E9 = 1000000000n;
    BIG_2_32 = 0x100000000n;
    BIG_LOMSK = 0xffffffffn;
    TWO16 = 65536;
    TWO32 = 4294967296;
    DEFAULT_TSRESOL_BYTE = 6;
    DEFAULT = build2(DEFAULT_TSRESOL_BYTE);
    tsresol_default = {
      DEFAULT,
      build: build2,
      fromBuffer,
      toTimestamp,
      fromTimestamp,
      serialize,
      parse
    };
  }
});

// lib/pcapFile/pcapng.js
function* readOptions(remaining, rawOptionBuffers = null) {
  const opts = [];
  while (remaining > 0) {
    const oh = yield OptionHeader;
    const padded = alignUp(oh.option_length);
    const buf = yield bytes(padded);
    opts.push({
      option_code: oh.option_code,
      option_length: oh.option_length,
      buffer: buf.toString()
    });
    if (rawOptionBuffers !== null) {
      rawOptionBuffers.push(buf);
    }
    remaining -= OptionHeader.size + padded;
    if (oh.option_code === 0 && oh.option_length === 0) {
      if (remaining > 0) yield skip(remaining);
      break;
    }
  }
  return opts;
}
function* readSHB(ctx, totalLength) {
  const bodyLen = totalLength - BlockHeader.size - 4;
  const body = yield SHBBody;
  if (body.byte_order_magic === BYTE_ORDER_MAGIC_SWAP) {
    throw new Error("Big-endian pcapng files are not supported in this build");
  }
  if (body.byte_order_magic !== BYTE_ORDER_MAGIC2) {
    throw new Error(`Invalid byte_order_magic: 0x${body.byte_order_magic.toString(16)}`);
  }
  const opts = yield* readOptions(bodyLen - SHBBody.size);
  const trailer = yield u32;
  if (trailer !== totalLength) {
    throw new Error(`SHB trailer mismatch: got ${trailer}, want ${totalLength}`);
  }
  yield emit("section-header", {
    byte_order_magic: body.byte_order_magic,
    major_version: body.major_version,
    minor_version: body.minor_version,
    section_length: body.section_length,
    options: opts
  });
  ctx.interfaces.length = 0;
}
function* readIDB(ctx, totalLength) {
  const bodyLen = totalLength - BlockHeader.size - 4;
  const body = yield IDBBody;
  const rawOptionBuffers = [];
  const opts = yield* readOptions(bodyLen - IDBBody.size, rawOptionBuffers);
  const trailer = yield u32;
  if (trailer !== totalLength) {
    throw new Error(`IDB trailer mismatch: got ${trailer}, want ${totalLength}`);
  }
  let tsresolBuf = null;
  let name = "";
  for (let i = 0; i < opts.length; i++) {
    const o = opts[i];
    if (o.option_code === OPT_IF_TSRESOL && tsresolBuf === null) tsresolBuf = rawOptionBuffers[i];
    else if (o.option_code === OPT_IF_NAME && name === "") name = o.buffer.replaceAll("\0", "");
  }
  ctx.interfaces.push({
    linktype: body.linktype,
    name,
    tsr: tsresol_default.fromBuffer(tsresolBuf)
  });
  yield emit("interface-description", {
    linktype: body.linktype,
    reserved: body.reserved,
    snaplen: body.snaplen,
    options: opts
  });
}
function* readEPB(ctx, totalLength) {
  const bodyLen = totalLength - BlockHeader.size - 4;
  const body = yield EPBBody;
  const padded = alignUp(body.caplen);
  const buf = yield bytes(padded);
  const optsLen = bodyLen - EPBBody.size - padded;
  const opts = optsLen > 0 ? yield* readOptions(optsLen) : [];
  const trailer = yield u32;
  if (trailer !== totalLength) {
    throw new Error(`EPB trailer mismatch: got ${trailer}, want ${totalLength}`);
  }
  const iface = ctx.interfaces[body.interface_id];
  let comment;
  if (opts.length > 0) {
    for (let i = 0; i < opts.length; i++) {
      if (opts[i].option_code === OPT_COMMENT) {
        comment = opts[i].buffer.split("\0")[0];
        break;
      }
    }
  }
  const tsr = iface ? iface.tsr : tsresol_default.DEFAULT;
  const pkt = new Packet({
    iface: iface ? { linktype: iface.linktype, name: iface.name } : {},
    buffer: buf.subarray(0, body.caplen),
    timestamp: tsresol_default.toTimestamp(tsr, body.timestamp_high, body.timestamp_low),
    ...comment !== void 0 && { comment },
    ...body.caplen !== body.len && { origLength: body.len }
  });
  yield push(pkt);
}
function* readSPB(ctx, totalLength) {
  const body = yield SPBBody;
  const padded = totalLength - BlockHeader.size - SPBBody.size - 4;
  const buf = yield bytes(padded);
  const firstInterface = ctx.interfaces[0];
  const trailer = yield u32;
  if (trailer !== totalLength) {
    throw new Error(`SPB trailer mismatch: got ${trailer}, want ${totalLength}`);
  }
  yield push(new Packet({
    iface: firstInterface ? { linktype: firstInterface.linktype, name: firstInterface.name } : {},
    buffer: buf.subarray(0, Math.min(body.caplen, padded)),
    timestamp: TimeStamp.now(),
    ...body.caplen > padded && { origLength: body.caplen }
  }));
}
function* readUnknownBlock(_ctx, totalLength) {
  const bodyLen = totalLength - BlockHeader.size - 4;
  if (bodyLen > 0) yield skip(bodyLen);
  const trailer = yield u32;
  if (trailer !== totalLength) {
    throw new Error(`Unknown block trailer mismatch: got ${trailer}, want ${totalLength}`);
  }
}
function* parsePcapNG(ctx) {
  yield setEndian("LE");
  ctx.interfaces = [];
  while (yield hasBytes(BlockHeader.size)) {
    const hdr = yield BlockHeader;
    switch (hdr.block_type) {
      case SHB_BLOCK_TYPE:
        yield* readSHB(ctx, hdr.total_length);
        break;
      case IDB_BLOCK_TYPE:
        yield* readIDB(ctx, hdr.total_length);
        break;
      case EPB_BLOCK_TYPE:
        yield* readEPB(ctx, hdr.total_length);
        break;
      case SPB_BLOCK_TYPE:
        yield* readSPB(ctx, hdr.total_length);
        break;
      default:
        yield* readUnknownBlock(ctx, hdr.total_length);
        break;
    }
  }
}
function optionsWireSize(opts) {
  let len = 0;
  for (const o of opts) len += OptionHeader.size + alignUp(o.option_length);
  if (opts.length === 0) return 0;
  if (opts[opts.length - 1].option_code !== 0) len += OptionHeader.size;
  return len;
}
function encodeOptionsAt(buf, offset, opts) {
  for (const o of opts) {
    buf.writeUInt16LE(o.option_code, offset);
    offset += 2;
    buf.writeUInt16LE(o.option_length, offset);
    offset += 2;
    if (o.option_length > 0) {
      const data = Buffer.isBuffer(o.buffer) ? o.buffer : Buffer.from(o.buffer);
      data.copy(buf, offset, 0, o.option_length);
      const padded = alignUp(o.option_length);
      if (padded > o.option_length) buf.fill(0, offset + o.option_length, offset + padded);
      offset += padded;
    }
  }
  if (opts.length > 0 && opts[opts.length - 1].option_code !== 0) {
    buf.writeUInt16LE(0, offset);
    offset += 2;
    buf.writeUInt16LE(0, offset);
    offset += 2;
  }
  return offset;
}
var import_stream3, SHB_BLOCK_TYPE, IDB_BLOCK_TYPE, SPB_BLOCK_TYPE, EPB_BLOCK_TYPE, BYTE_ORDER_MAGIC2, BYTE_ORDER_MAGIC_SWAP, PCAP_NG_VERSION_MAJOR, PCAP_NG_VERSION_MINOR, APP_NAME, OPT_EOFOPT, OPT_COMMENT, OPT_SHB_HARDWARE, OPT_SHB_OS, OPT_SHB_USERAPPL, OPT_IF_NAME, OPT_IF_TSRESOL, OPT_EPB_FLAGS, OPT_EPB_HASH, OPT_EPB_DROPCOUNT, constants, BlockHeader, SHBBody, IDBBody, EPBBody, SPBBody, OptionHeader, ALIGN, alignUp, PcapNGInputStream, PcapNGOutputStream;
var init_pcapng = __esm({
  "lib/pcapFile/pcapng.js"() {
    import_stream3 = require("stream");
    init_parser3();
    init_timestamp();
    init_packet();
    init_defaults2();
    init_tsresol();
    SHB_BLOCK_TYPE = 168627466;
    IDB_BLOCK_TYPE = 1;
    SPB_BLOCK_TYPE = 3;
    EPB_BLOCK_TYPE = 6;
    BYTE_ORDER_MAGIC2 = 439041101;
    BYTE_ORDER_MAGIC_SWAP = 1295788826;
    PCAP_NG_VERSION_MAJOR = 1;
    PCAP_NG_VERSION_MINOR = 0;
    APP_NAME = "https://github.com/vaguue/over-the-wire";
    OPT_EOFOPT = 0;
    OPT_COMMENT = 1;
    OPT_SHB_HARDWARE = 2;
    OPT_SHB_OS = 3;
    OPT_SHB_USERAPPL = 4;
    OPT_IF_NAME = 2;
    OPT_IF_TSRESOL = 9;
    OPT_EPB_FLAGS = 2;
    OPT_EPB_HASH = 3;
    OPT_EPB_DROPCOUNT = 4;
    constants = Object.freeze({
      OPT_EOFOPT,
      OPT_COMMENT,
      OPT_IF_NAME,
      OPT_IF_DESCRIPTION: 3,
      OPT_IF_IPV4ADDR: 4,
      OPT_IF_IPV6ADDR: 5,
      OPT_IF_MACADDR: 6,
      OPT_IF_EUIADDR: 7,
      OPT_IF_SPEED: 8,
      OPT_IF_TSRESOL,
      OPT_IF_TZONE: 10,
      OPT_IF_FILTER: 11,
      OPT_IF_OS: 12,
      OPT_IF_FCSLEN: 13,
      OPT_IF_TSOFFSET: 14,
      OPT_SHB_HARDWARE,
      OPT_SHB_OS,
      OPT_SHB_USERAPPL,
      OPT_EPB_FLAGS,
      OPT_EPB_HASH,
      OPT_EPB_DROPCOUNT
    });
    ({
      BlockHeader,
      SHBBody,
      IDBBody,
      EPBBody,
      SPBBody,
      OptionHeader
    } = cstruct(`
  //@LE
  struct __attribute__((__packed__)) BlockHeader {
    uint32_t block_type;
    uint32_t total_length;
  };

  //@LE
  struct __attribute__((__packed__)) SHBBody {
    uint32_t byte_order_magic;
    uint16_t major_version;
    uint16_t minor_version;
    int64_t  section_length;
  };

  //@LE
  struct __attribute__((__packed__)) IDBBody {
    uint16_t linktype;
    uint16_t reserved;
    uint32_t snaplen;
  };

  //@LE
  struct __attribute__((__packed__)) EPBBody {
    uint32_t interface_id;
    uint32_t timestamp_high;
    uint32_t timestamp_low;
    uint32_t caplen;
    uint32_t len;
  };

  //@LE
  struct __attribute__((__packed__)) SPBBody {
    uint32_t caplen;
  };

  //@LE
  struct __attribute__((__packed__)) OptionHeader {
    uint16_t option_code;
    uint16_t option_length;
  };
`));
    ALIGN = 4;
    alignUp = (n) => n + ALIGN - 1 & ~(ALIGN - 1);
    PcapNGInputStream = class extends import_stream3.Transform {
      constructor(opts = {}) {
        super({ ...opts, objectMode: true });
        this.source = new ByteSource();
        this.engine = new Engine(parsePcapNG, this.source, this, { interfaces: [] });
      }
      _transform(chunk, _enc, cb) {
        this.source.feed(chunk);
        try {
          this.engine.drive();
        } catch (err) {
          return cb(err);
        }
        cb();
      }
      _read(size) {
        if (this.engine.parkedBack) {
          this.engine.parkedBack = false;
          try {
            this.engine.drive();
          } catch (err) {
            this.destroy(err);
            return;
          }
        }
        return super._read(size);
      }
      _flush(cb) {
        this.engine.eof = true;
        try {
          this.engine.drive();
        } catch (err) {
          return cb(err);
        }
        cb();
      }
    };
    PcapNGOutputStream = class extends import_stream3.Transform {
      constructor(opts = {}) {
        super({ ...opts, writableObjectMode: true });
        this.interfaces = [];
        this._writeSectionHeader();
      }
      _writeSectionHeader() {
        const opts = [{
          option_code: OPT_SHB_USERAPPL,
          option_length: APP_NAME.length,
          buffer: Buffer.from(APP_NAME)
        }];
        const optsLen = optionsWireSize(opts);
        const totalLen = BlockHeader.size + SHBBody.size + optsLen + 4;
        const buf = Buffer.allocUnsafe(totalLen);
        BlockHeader.encodeLE(buf, 0, { block_type: SHB_BLOCK_TYPE, total_length: totalLen });
        SHBBody.encodeLE(buf, BlockHeader.size, {
          byte_order_magic: BYTE_ORDER_MAGIC2,
          major_version: PCAP_NG_VERSION_MAJOR,
          minor_version: PCAP_NG_VERSION_MINOR,
          section_length: -1n
        });
        const optsOff = BlockHeader.size + SHBBody.size;
        encodeOptionsAt(buf, optsOff, opts);
        buf.writeUInt32LE(totalLen, totalLen - 4);
        this.push(buf);
      }
      iface({ linktype: linktype3, snaplen: snaplen2 = defaults_default2.snaplen, tsresol = null, name = null }) {
        const tsr = tsresol == null ? tsresol_default.build(9) : tsresol_default.fromBuffer(tsresol);
        const opts = [];
        if (name && name.length > 0) {
          const nameBytes = Buffer.from(name);
          opts.push({
            option_code: OPT_IF_NAME,
            option_length: nameBytes.length,
            buffer: nameBytes
          });
        }
        opts.push({
          option_code: OPT_IF_TSRESOL,
          option_length: 1,
          buffer: tsr.raw
        });
        const optsLen = optionsWireSize(opts);
        const totalLen = BlockHeader.size + IDBBody.size + optsLen + 4;
        const buf = Buffer.allocUnsafe(totalLen);
        BlockHeader.encodeLE(buf, 0, { block_type: IDB_BLOCK_TYPE, total_length: totalLen });
        IDBBody.encodeLE(buf, BlockHeader.size, { linktype: linktype3, reserved: 0, snaplen: snaplen2 });
        encodeOptionsAt(buf, BlockHeader.size + IDBBody.size, opts);
        buf.writeUInt32LE(totalLen, totalLen - 4);
        this.push(buf);
        this.interfaces.push({ linktype: linktype3, snaplen: snaplen2, name, tsr });
        return this.interfaces.length - 1;
      }
      _findIfaceIndex(iface) {
        for (let i = 0; i < this.interfaces.length; i++) {
          const e = this.interfaces[i];
          if (e.linktype !== iface.linktype) continue;
          if (iface.name && e.name && iface.name !== e.name) continue;
          return i;
        }
        return -1;
      }
      enhancedPacket(pkt) {
        const buffer = pkt.buffer;
        if (!buffer) throw new Error("Expected EnhancedPacket to have buffer property");
        if (!pkt.iface) throw new Error("Expected EnhancedPacket to have iface property");
        const packetInterface = {
          ...pkt.iface,
          linktype: pkt.iface.linktype ?? pkt.linktype ?? defaults_default2.linktype
        };
        let interface_id = this._findIfaceIndex(packetInterface);
        if (interface_id === -1) {
          interface_id = this.iface({
            ...packetInterface,
            ...pkt.timestamp.tsresol && { tsresol: pkt.timestamp.tsresol }
          });
        }
        const tsr = this.interfaces[interface_id].tsr;
        const { timestamp_high, timestamp_low } = tsresol_default.fromTimestamp(tsr, pkt.timestamp);
        const opts = [];
        if (pkt.comment) {
          const commentBytes = Buffer.from(pkt.comment);
          opts.push({
            option_code: OPT_COMMENT,
            option_length: commentBytes.length,
            buffer: commentBytes
          });
        }
        const padded = alignUp(buffer.length);
        const optsLen = optionsWireSize(opts);
        const totalLen = BlockHeader.size + EPBBody.size + padded + optsLen + 4;
        const headSize = BlockHeader.size + EPBBody.size;
        const head2 = Buffer.allocUnsafe(headSize);
        BlockHeader.encodeLE(head2, 0, { block_type: EPB_BLOCK_TYPE, total_length: totalLen });
        EPBBody.encodeLE(head2, BlockHeader.size, {
          interface_id,
          timestamp_high,
          timestamp_low,
          caplen: buffer.length,
          len: pkt.origLength ?? buffer.length
        });
        this.push(head2);
        this.push(buffer);
        const tailLen = padded - buffer.length + optsLen + 4;
        const tail = Buffer.allocUnsafe(tailLen);
        let off = 0;
        if (padded > buffer.length) {
          tail.fill(0, 0, padded - buffer.length);
          off = padded - buffer.length;
        }
        off = encodeOptionsAt(tail, off, opts);
        tail.writeUInt32LE(totalLen, off);
        this.push(tail);
      }
      simplePacket(buffer) {
        if (this.interfaces.length === 0) {
          this.iface({ linktype: defaults_default2.linktype });
        }
        const padded = alignUp(buffer.length);
        const totalLen = BlockHeader.size + SPBBody.size + padded + 4;
        const headSize = BlockHeader.size + SPBBody.size;
        const head2 = Buffer.allocUnsafe(headSize);
        BlockHeader.encodeLE(head2, 0, { block_type: SPB_BLOCK_TYPE, total_length: totalLen });
        SPBBody.encodeLE(head2, BlockHeader.size, { caplen: buffer.length });
        this.push(head2);
        this.push(buffer);
        const tailLen = padded - buffer.length + 4;
        const tail = Buffer.allocUnsafe(tailLen);
        if (padded > buffer.length) tail.fill(0, 0, padded - buffer.length);
        tail.writeUInt32LE(totalLen, tailLen - 4);
        this.push(tail);
      }
      _transform(chunk, _enc, cb) {
        try {
          if (Buffer.isBuffer(chunk)) {
            this.simplePacket(chunk);
          } else if (chunk instanceof Packet) {
            this.enhancedPacket(chunk);
          } else {
            throw new Error(`Invalid argument: ${chunk}`);
          }
        } catch (err) {
          return cb(err);
        }
        cb();
      }
    };
  }
});

// lib/pcapFile/index.js
var createReadStream, createWriteStream;
var init_pcapFile = __esm({
  "lib/pcapFile/index.js"() {
    init_pcap();
    init_pcapng();
    createReadStream = ({ format: format3 = "pcap", ...options } = {}) => {
      if (format3 == "pcap") {
        return new PcapInputStream(options);
      } else if (format3 == "pcapng") {
        return new PcapNGInputStream(options);
      } else {
        throw new Error(`Unknown format ${format3}`);
      }
    };
    createWriteStream = ({ format: format3 = "pcap", ...options } = {}) => {
      if (format3 == "pcap") {
        return new PcapOutputStream(options);
      } else if (format3 == "pcapng") {
        return new PcapNGOutputStream(options);
      } else {
        throw new Error(`Unknown format ${format3}`);
      }
    };
  }
});

// lib/arp.js
async function readArpTableFromProc() {
  const rl = import_node_readline.default.createInterface({
    input: import_node_fs.default.createReadStream("/proc/net/arp"),
    crlfDelay: Infinity
  });
  const res = {};
  let fst = true;
  for await (const line of rl) {
    if (fst) {
      fst = false;
      continue;
    }
    const [ipAddr, hwType, flags, hwAddr, _, device] = line.split(/\s/).filter((e) => e.length > 0);
    if (!res[device]) {
      res[device] = [];
    }
    res[device].push({ ipAddr, hwType: Number(hwType), flags: Number(flags), hwAddr });
  }
  return res;
}
var import_node_os, import_node_fs, import_node_readline, getArpTableCxx, platform, readArpTableFromNative, getArpTable;
var init_arp = __esm({
  "lib/arp.js"() {
    import_node_os = __toESM(require("node:os"), 1);
    import_node_fs = __toESM(require("node:fs"), 1);
    import_node_readline = __toESM(require("node:readline"), 1);
    init_bindings();
    ({ getArpTable: getArpTableCxx } = bindings_default);
    platform = import_node_os.default.platform();
    readArpTableFromNative = () => {
      return new Promise((resolve6, reject2) => {
        getArpTableCxx((res) => {
          if (res instanceof Error) {
            reject2(res);
            return;
          }
          resolve6(res);
        });
      });
    };
    getArpTable = platform === "linux" ? readArpTableFromProc : readArpTableFromNative;
  }
});

// lib/routing.js
async function ipv4Routes() {
  const out = {};
  const rl = import_node_readline2.default.createInterface({
    input: import_node_fs2.default.createReadStream("/proc/net/route"),
    crlfDelay: Infinity
  });
  let skip2 = true;
  for await (const line of rl) {
    if (skip2) {
      skip2 = false;
      continue;
    }
    const [
      iface,
      dstHex,
      gwHex,
      flHex,
      ,
      ,
      metricStr,
      maskHex
    ] = line.trim().split(/\s+/);
    const dstIp = inetNtop5(parseInt(dstHex, 16));
    const gwIp = inetNtop5(parseInt(gwHex, 16));
    const maskIp = inetNtop5(parseInt(maskHex, 16));
    const flags = parseFlags(parseInt(flHex, 16));
    const gateway = gwIp;
    const prefix = dstIp === "0.0.0.0" ? 0 : prefixFromMask(maskIp);
    const destination = prefix === 0 ? "default" : dstIp;
    if (!out[iface]) out[iface] = [];
    out[iface].push({
      destination,
      prefixLength: prefix,
      gateway,
      metric: parseInt(metricStr, 10),
      flags,
      family: "AF_INET"
    });
  }
  return out;
}
async function ipv6Routes() {
  const hasIpv6Routes = await import_node_fs2.default.promises.access("/proc/net/ipv6_route").then(() => true).catch(() => false);
  if (!hasIpv6Routes) {
    return {};
  }
  const out = {};
  const rl = import_node_readline2.default.createInterface({
    input: import_node_fs2.default.createReadStream("/proc/net/ipv6_route"),
    crlfDelay: Infinity
  });
  for await (const line of rl) {
    const p = line.trim().split(/\s+/);
    if (p.length < 10) continue;
    const [dstHex, plenHex, , , gwHex, metricHex, , , flHex, iface] = p;
    const dstIp = hexToIPv6(dstHex);
    const gwIp = hexToIPv6(gwHex);
    const prefix = parseInt(plenHex, 16);
    const flags = parseFlags(parseInt(flHex, 16));
    const gateway = withZone(gwIp, iface);
    const destination = prefix === 0 ? "default" : withZone(dstIp, iface);
    if (!out[iface]) out[iface] = [];
    out[iface].push({
      destination,
      prefixLength: prefix,
      gateway,
      metric: parseInt(metricHex, 16),
      flags,
      family: "AF_INET6"
    });
  }
  return out;
}
async function readRoutingTableFromProc() {
  const [v4, v6] = await Promise.all([ipv4Routes(), ipv6Routes()]);
  const merged = { ...v4 };
  for (const [i, lst] of Object.entries(v6)) {
    merged[i] = merged[i] ? merged[i].concat(lst) : lst;
  }
  return merged;
}
var import_node_os2, import_node_fs2, import_node_readline2, inetNtop5, socket4, getRoutingTableCxx, platform2, linuxRouteFlagLetters, parseFlags, hexToIPv6, withZone, prefixFromMask, readRoutingTableFromNative, getRoutingTable;
var init_routing = __esm({
  "lib/routing.js"() {
    import_node_os2 = __toESM(require("node:os"), 1);
    import_node_fs2 = __toESM(require("node:fs"), 1);
    import_node_readline2 = __toESM(require("node:readline"), 1);
    init_converters();
    init_bindings();
    init_enums();
    ({ inetNtop: inetNtop5 } = converters_default);
    ({ socket: socket4, getRoutingTable: getRoutingTableCxx } = bindings_default);
    platform2 = import_node_os2.default.platform();
    linuxRouteFlagLetters = () => {
      return [
        [RouteFlags.RTF_UP, "U"],
        [RouteFlags.RTF_GATEWAY, "G"],
        [RouteFlags.RTF_HOST, "H"],
        [RouteFlags.RTF_REJECT, "R"],
        [RouteFlags.RTF_DYNAMIC, "D"],
        [RouteFlags.RTF_MODIFIED, "M"],
        [RouteFlags.RTF_MULTICAST, "m"]
      ];
    };
    parseFlags = (value) => {
      return linuxRouteFlagLetters().filter(([mask]) => (value & mask) !== 0).map(([, letter]) => letter);
    };
    hexToIPv6 = (hex) => {
      if (!hex || hex.length !== 32) return "";
      const buf = Buffer.alloc(16);
      for (let i = 0; i < 16; i++) buf[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
      return inetNtop5(socket4.AF_INET6, buf);
    };
    withZone = (a, i) => a && a.startsWith("fe80::") ? `${a}%${i}` : a;
    prefixFromMask = (m) => m.split(".").map((o) => parseInt(o, 10).toString(2)).reduce((s, b) => s + [...b].filter((x) => x === "1").length, 0);
    readRoutingTableFromNative = () => {
      return new Promise((resolve6, reject2) => {
        getRoutingTableCxx((res) => {
          if (res instanceof Error) {
            reject2(res);
            return;
          }
          resolve6(res);
        });
      });
    };
    getRoutingTable = platform2 === "linux" ? readRoutingTableFromProc : readRoutingTableFromNative;
  }
});

// lib/ip.js
function toLong(addr) {
  return addr.split(".").reduce((a, o) => (a << 8) + (+o & 255) >>> 0, 0);
}
function prefixMask(len) {
  return len ? 4294967295 << 32 - len >>> 0 : 0;
}
function ipv4Contains(cidr, ip) {
  const [net5, len] = cidr.split("/");
  const mask = prefixMask(+len);
  return (toLong(ip) & mask) === (toLong(net5) & mask);
}
function v6buf(a) {
  if (a === "::") return Buffer.alloc(16);
  const [h, t] = a.split("::");
  const head2 = h ? h.split(":") : [];
  const tail = t ? t.split(":") : [];
  const miss = 8 - head2.length - tail.length;
  const parts = [...head2, ...Array(miss).fill("0"), ...tail].map((x) => parseInt(x || "0", 16));
  const b = Buffer.alloc(16);
  parts.forEach((p, i) => b.writeUInt16BE(p, i * 2));
  return b;
}
function ipv6Contains(cidr, ip) {
  const [net5, lenStr] = cidr.split("/");
  const len = +lenStr;
  const a = v6buf(ip);
  const n = v6buf(net5);
  const bytes2 = len >> 3;
  const bits = len & 7;
  for (let i = 0; i < bytes2; i++) if (a[i] !== n[i]) return false;
  if (!bits) return true;
  const mask = 255 << 8 - bits & 255;
  return (a[bytes2] & mask) === (n[bytes2] & mask);
}
function cidrContains(cidr, ip) {
  return cidr.includes(":") ? ipv6Contains(cidr, ip) : ipv4Contains(cidr, ip);
}
var init_ip = __esm({
  "lib/ip.js"() {
  }
});

// lib/gateway.js
async function gatewayFor(dstIp = null, { iface: onlyIface = null, routes: knownRoutes = null } = {}) {
  const allRoutes = knownRoutes ?? await getRoutingTable();
  const routes = onlyIface === null ? allRoutes : Object.fromEntries(Object.entries(allRoutes).filter(([iface]) => iface === onlyIface));
  const flat = Object.entries(routes).flatMap(
    ([iface, list]) => list.map((r) => ({
      iface,
      ...r,
      af: r.family,
      family: [{ name: "AF_INET", value: 4 }, { name: "AF_INET6", value: 6 }].find((e) => e.name == r.family)?.value ?? 0
    }))
  );
  const route = selectRoute(dstIp, flat);
  if (!route) return null;
  const isV4 = route.family === 4;
  const gwZero = isV4 ? "0.0.0.0" : "::";
  const nextIp = route.onLink || !route.gateway || route.gateway === gwZero ? dstIp ?? "" : route.gateway;
  return { iface: route.iface, ip: nextIp, family: route.af };
}
function selectRoute(dstIp, routes) {
  if (dstIp === null) {
    const defaults3 = routes.filter((r) => r.destination === "default" && (r.family === 4 || r.family === 6));
    if (defaults3.length === 0) {
      return null;
    }
    return defaults3.reduce((best2, r) => {
      const metric = r.metric ?? 0;
      const bestMetric2 = best2.metric ?? 0;
      const isBetter = metric < bestMetric2 || metric === bestMetric2 && r.family === 4 && best2.family === 6;
      return isBetter ? r : best2;
    });
  }
  const v4 = import_node_net3.default.isIP(dstIp) === 4;
  const dLng = v4 ? toLong(dstIp) : null;
  let best = null, bestLen = -1, bestMetric = Infinity;
  for (const r of routes) {
    if (r.family !== (v4 ? 4 : 6)) continue;
    if (!inSubnet(dstIp, r.destination, r.prefixLength, v4, dLng)) continue;
    if (r.prefixLength > bestLen || r.prefixLength === bestLen && r.metric < bestMetric) {
      best = r;
      bestLen = r.prefixLength;
      bestMetric = r.metric;
    }
  }
  return best;
}
function inSubnet(dst, netIp, preLen, v4, dLng) {
  if (netIp === "default") return true;
  if (v4) {
    const base = toLong(netIp);
    const mask = preLen ? ~0 << 32 - preLen >>> 0 : 0;
    return (dLng & mask) === (base & mask);
  }
  return cidrContains(`${netIp.split("%")[0]}/${preLen}`, dst);
}
var import_node_net3;
var init_gateway = __esm({
  "lib/gateway.js"() {
    import_node_net3 = __toESM(require("node:net"), 1);
    init_ip();
    init_routing();
  }
});

// lib/socketStream.js
var import_node_stream2, Socket, SockAddr2, PAYLOAD_WITHOUT_HEADERS, linktypeDeliveredBy, toSockAddr, peerFromSockAddr, SocketStream;
var init_socketStream = __esm({
  "lib/socketStream.js"() {
    import_node_stream2 = require("node:stream");
    init_socket();
    init_packet();
    init_enums();
    init_timestamp();
    init_expect();
    ({ Socket, SockAddr: SockAddr2 } = socket_default);
    PAYLOAD_WITHOUT_HEADERS = LinkLayerType.LINKTYPE_USER0;
    linktypeDeliveredBy = ({ domain, type }) => {
      if (domain === socket_default.AF_INET && type === socket_default.SOCK_RAW) {
        return LinkLayerType.LINKTYPE_IPV4;
      }
      return PAYLOAD_WITHOUT_HEADERS;
    };
    toSockAddr = (address) => {
      if (address === void 0 || address === null) {
        return void 0;
      }
      if (address instanceof SockAddr2) {
        return address;
      }
      return new SockAddr2(address);
    };
    peerFromSockAddr = (address) => {
      if (!address) {
        return null;
      }
      return {
        ip: address.ip,
        port: address.port,
        domain: address.domain
      };
    };
    SocketStream = class extends import_node_stream2.Duplex {
      constructor({ domain, type, protocol = 0, bufferSize, bind, connect, to, ...streamOptions } = {}) {
        super({ ...streamOptions, objectMode: true });
        this.domain = domain;
        this.type = type;
        this.protocol = protocol;
        this.iface = { linktype: linktypeDeliveredBy({ domain, type }) };
        this.defaultDestination = toSockAddr(to);
        this.receiving = false;
        this.settleQueuedWrites = null;
        const socketOptions = { domain, type, protocol };
        if (bufferSize !== void 0) {
          socketOptions.bufferSize = bufferSize;
        }
        this.socket = new Socket(socketOptions);
        this.socket.on("data", (buffer, sender) => {
          this.deliver(buffer, sender);
        });
        this.socket.on("drain", () => {
          this.settleWrites(null);
        });
        this.socket.on("error", (message) => {
          this.failWith(new Error(String(message)));
        });
        if (bind) {
          this.bind(bind);
        }
        if (connect) {
          this.connect(connect);
        }
      }
      bind(address) {
        this.socket.bind(toSockAddr(address));
        return this;
      }
      connect(address) {
        this.socket.connect(toSockAddr(address));
        this.connected = true;
        return this;
      }
      deliver(buffer, sender) {
        const packet = new Packet({
          buffer,
          iface: this.iface,
          timestamp: TimeStamp.now("ns"),
          peer: peerFromSockAddr(sender)
        });
        const consumerKeepsUp = this.push(packet);
        if (!consumerKeepsUp) {
          this.socket.pause();
          this.receiving = false;
        }
      }
      settleWrites(err) {
        const settle = this.settleQueuedWrites;
        if (settle === null) {
          return;
        }
        this.settleQueuedWrites = null;
        settle(err);
      }
      failWith(err) {
        if (this.settleQueuedWrites !== null) {
          this.settleWrites(err);
          return;
        }
        this.destroy(err);
      }
      destinationFor(chunk) {
        if (this.connected) {
          return void 0;
        }
        const destination = toSockAddr(chunk.to ?? chunk.peer) ?? this.defaultDestination;
        if (destination === void 0) {
          throw new Error('No destination: connect the socket, pass "to" to the stream, or write { data, to }');
        }
        return destination;
      }
      bytesOf(chunk) {
        if (chunk instanceof Packet) {
          return chunk.buffer;
        }
        if (Buffer.isBuffer(chunk) || ArrayBuffer.isView(chunk)) {
          return chunk;
        }
        if (chunk && (Buffer.isBuffer(chunk.data) || ArrayBuffer.isView(chunk.data))) {
          return chunk.data;
        }
        throw new Error("Invalid argument - expected Packet | Buffer | TypedArray | { data, to }");
      }
      _read() {
        if (!this.receiving) {
          this.receiving = true;
          this.socket.resume();
        }
      }
      _write(chunk, encoding, callback) {
        this._writev([{ chunk }], callback);
      }
      _writev(chunks, callback) {
        let batch;
        try {
          batch = chunks.map(({ chunk }) => [this.bytesOf(chunk), this.destinationFor(chunk)]);
        } catch (err) {
          callback(err);
          return;
        }
        this.settleQueuedWrites = callback;
        try {
          this.socket.write(batch);
        } catch (err) {
          this.settleWrites(err);
        }
      }
      _destroy(err, callback) {
        this.socket.close();
        callback(err);
      }
    };
    installExpect(SocketStream);
  }
});

// lib/wire.js
var wire_exports = {};
__export(wire_exports, {
  Sending: () => Sending,
  Wire: () => Wire,
  default: () => wire_default,
  otw: () => otw
});
var import_node_os3, import_node_net4, import_node_dgram, inetPton7, AF_INET67, DEFAULT_CACHE_MS, DEFAULT_NEIGHBOUR_TIMEOUT_MS, NEIGHBOUR_POLL_INTERVAL_MS, DISCARD_PORT, UNSET_MAC, MAC_PATTERN, isUsableMac, withoutZone, sameAddress, sleep, letTheKernelResolve, Wire, writeTo, Sending, otw, wire_default;
var init_wire = __esm({
  "lib/wire.js"() {
    import_node_os3 = __toESM(require("node:os"), 1);
    import_node_net4 = __toESM(require("node:net"), 1);
    import_node_dgram = __toESM(require("node:dgram"), 1);
    init_routing();
    init_arp();
    init_gateway();
    init_packetBuilder();
    init_liveDevice();
    init_filter2();
    init_packet();
    init_converters();
    init_socket();
    ({ inetPton: inetPton7 } = converters_default);
    ({ AF_INET6: AF_INET67 } = socket_default);
    DEFAULT_CACHE_MS = 5e3;
    DEFAULT_NEIGHBOUR_TIMEOUT_MS = 1e3;
    NEIGHBOUR_POLL_INTERVAL_MS = 25;
    DISCARD_PORT = 9;
    UNSET_MAC = "00:00:00:00:00:00";
    MAC_PATTERN = /^([0-9a-f]{1,2}:){5}[0-9a-f]{1,2}$/i;
    isUsableMac = (mac) => {
      return typeof mac == "string" && MAC_PATTERN.test(mac) && mac !== UNSET_MAC;
    };
    withoutZone = (address) => {
      return address.split("%")[0];
    };
    sameAddress = (left2, right2) => {
      const leftAddress = withoutZone(left2);
      const rightAddress = withoutZone(right2);
      if (import_node_net4.default.isIPv6(leftAddress) && import_node_net4.default.isIPv6(rightAddress)) {
        return inetPton7(AF_INET67, leftAddress).equals(inetPton7(AF_INET67, rightAddress));
      }
      return leftAddress === rightAddress;
    };
    sleep = (ms) => {
      return new Promise((resolve6) => {
        setTimeout(resolve6, ms);
      });
    };
    letTheKernelResolve = (address, iface) => {
      return new Promise((resolve6) => {
        const isIpv6 = import_node_net4.default.isIPv6(address);
        const socket5 = import_node_dgram.default.createSocket(isIpv6 ? "udp6" : "udp4");
        const needsScope = isIpv6 && address.toLowerCase().startsWith("fe80");
        const target = needsScope ? `${address}%${iface}` : address;
        const finish = () => {
          socket5.close();
          resolve6();
        };
        socket5.once("error", finish);
        socket5.send(Buffer.alloc(1), DISCARD_PORT, target, finish);
      });
    };
    Wire = class _Wire {
      constructor({ iface = null, cacheMs = DEFAULT_CACHE_MS, neighbourTimeoutMs = DEFAULT_NEIGHBOUR_TIMEOUT_MS, system: system2 = {} } = {}) {
        this.iface = iface ?? _Wire.defaults.iface;
        this.cacheMs = cacheMs;
        this.neighbourTimeoutMs = neighbourTimeoutMs;
        this.system = {
          platform: import_node_os3.default.platform(),
          getRoutingTable,
          getArpTable,
          networkInterfaces: import_node_os3.default.networkInterfaces,
          provokeNeighbourDiscovery: letTheKernelResolve,
          openDevice: (options) => new LiveDevice(options),
          ...system2
        };
        this.devices = /* @__PURE__ */ new Map();
        this.lookups = /* @__PURE__ */ new Map();
      }
      cachedLookup(name, load) {
        const cached = this.lookups.get(name);
        if (cached !== void 0 && Date.now() - cached.startedAt < this.cacheMs) {
          return cached.result;
        }
        const result = load();
        this.lookups.set(name, { startedAt: Date.now(), result });
        result.catch(() => {
          if (this.lookups.get(name)?.result === result) {
            this.lookups.delete(name);
          }
        });
        return result;
      }
      flush() {
        this.lookups.clear();
        return this;
      }
      routingTable() {
        return this.cachedLookup("routes", () => this.system.getRoutingTable());
      }
      arpTable() {
        return this.cachedLookup("neighbours", () => this.system.getArpTable());
      }
      async route(destination = null, { iface = null } = {}) {
        const routes = await this.routingTable();
        const route = await gatewayFor(destination, { iface: iface ?? this.iface, routes });
        if (route === null) {
          const err = new Error(`No route to ${destination ?? "the default gateway"}`);
          err.code = "ENOROUTE";
          throw err;
        }
        return route;
      }
      async knownNeighbour(address, iface) {
        const table2 = await this.arpTable();
        const entry = (table2[iface] ?? []).find(({ ipAddr, hwAddr }) => isUsableMac(hwAddr) && sameAddress(ipAddr, address));
        return entry?.hwAddr ?? null;
      }
      async neighbour(address, iface) {
        const alreadyKnown = await this.knownNeighbour(address, iface);
        if (alreadyKnown !== null) {
          return alreadyKnown;
        }
        await this.system.provokeNeighbourDiscovery(address, iface);
        const deadline = Date.now() + this.neighbourTimeoutMs;
        for (; ; ) {
          this.lookups.delete("neighbours");
          const discovered = await this.knownNeighbour(address, iface);
          if (discovered !== null) {
            return discovered;
          }
          if (Date.now() >= deadline) {
            return null;
          }
          await sleep(NEIGHBOUR_POLL_INTERVAL_MS);
        }
      }
      linkLayerOf(iface) {
        const entries = this.system.networkInterfaces()[iface] ?? [];
        if (entries.some(({ mac }) => isUsableMac(mac))) {
          return "ethernet";
        }
        if (this.system.platform === "linux") {
          return entries.some(({ internal }) => internal) ? "ethernet-without-addresses" : "none";
        }
        return "loopback";
      }
      addresses(iface) {
        const entries = this.system.networkInterfaces()[iface] ?? [];
        return {
          mac: entries.find(({ mac }) => mac !== void 0)?.mac,
          ipv4: entries.find(({ family }) => family === "IPv4")?.address,
          ipv6: entries.find(({ family }) => family === "IPv6")?.address
        };
      }
      packet(options = {}) {
        return new PacketBuilder(this, options);
      }
      filter() {
        return new FilterBuilder();
      }
      async defaultInterface() {
        return this.iface ?? (await this.route(null)).iface;
      }
      async capture(filterOrOptions = {}) {
        const describesFilter = filterOrOptions instanceof FilterBuilder || typeof filterOrOptions == "string";
        const options = describesFilter ? { filter: filterOrOptions } : { ...filterOrOptions };
        if (options.filter instanceof FilterBuilder) {
          const filter2 = options.filter;
          delete options.filter;
          if (filter2.expressible && filter2.toString().length > 0) {
            options.filter = filter2.toString();
          }
        }
        const iface = options.iface ?? await this.defaultInterface();
        return this.system.openDevice({ ...options, iface });
      }
      async deviceFor(requestedIface) {
        const iface = requestedIface ?? await this.defaultInterface();
        if (!this.devices.has(iface)) {
          this.devices.set(iface, this.system.openDevice({ iface }));
        }
        return this.devices.get(iface);
      }
      send(packet) {
        return new Sending(this, packet);
      }
      close() {
        for (const device of this.devices.values()) {
          device.destroy();
        }
        this.devices.clear();
        return this;
      }
    };
    Wire.defaults = {
      iface: null
    };
    Object.defineProperties(Wire.prototype, {
      p: {
        configurable: true,
        get() {
          return this.packet();
        }
      },
      f: {
        configurable: true,
        get() {
          return this.filter();
        }
      }
    });
    Wire.prototype.c = Wire.prototype.capture;
    Wire.prototype.s = Wire.prototype.send;
    writeTo = (device, packet) => {
      return new Promise((resolve6, reject2) => {
        device.write(packet, (err) => {
          if (err) {
            reject2(err);
            return;
          }
          resolve6();
        });
      });
    };
    Sending = class {
      constructor(wire, description) {
        this.wire = wire;
        this.description = description;
        this.resolution = null;
        this.delivery = null;
      }
      resolvedPacket() {
        if (this.resolution === null) {
          this.resolution = this.description instanceof PacketBuilder ? this.description.exec() : Promise.resolve(this.description);
        }
        return this.resolution;
      }
      async write() {
        const packet = await this.resolvedPacket();
        const device = await this.wire.deviceFor(packet.iface?.name);
        await writeTo(device, packet);
        return packet;
      }
      deliver() {
        if (this.delivery === null) {
          this.delivery = this.write();
        }
        return this.delivery;
      }
      then(onDelivered, onFailed) {
        return this.deliver().then(onDelivered, onFailed);
      }
      catch(onFailed) {
        return this.deliver().catch(onFailed);
      }
      finally(onSettled) {
        return this.deliver().finally(onSettled);
      }
      async expect(filter2, options) {
        const packet = await this.resolvedPacket();
        const device = await this.wire.deviceFor(packet.iface?.name);
        const described = filter2 === void 0 || typeof filter2 == "function" ? filter2 : FilterBuilder.from(filter2);
        const sentBytes = packet instanceof Packet ? packet.buffer : packet;
        const isAnAnswer = (candidate) => {
          if (candidate.buffer.equals(sentBytes)) {
            return false;
          }
          if (described === void 0) {
            return true;
          }
          return typeof described == "function" ? described(candidate) : described.matches(candidate);
        };
        const answer = device.expect(isAnAnswer, options);
        await this.deliver();
        return answer;
      }
    };
    Sending.prototype.ex = Sending.prototype.expect;
    otw = (options = {}) => {
      return new Wire(options);
    };
    wire_default = { otw, Wire };
  }
});

// lib/registry.js
var registerLayer;
var init_registry = __esm({
  "lib/registry.js"() {
    init_layers();
    init_packet();
    init_packetBuilder();
    init_filter2();
    init_protocols();
    registerLayer = (Layer) => {
      if (typeof Layer !== "function" || typeof Layer.name !== "string" || Layer.name.length === 0) {
        throw new Error("A layer has to be a named class");
      }
      layers[Layer.name] = Layer;
      if (Layer.linktype !== void 0) {
        linktype[Layer.linktype] = Layer;
      }
      installLayerMethods(Packet, Layer);
      installLayerMethods(PacketBuilder, Layer);
      installLayerMethods(FilterBuilder, Layer);
      describeLayer(Layer);
      return Layer;
    };
  }
});

// lib/index.js
var lib_exports = {};
__export(lib_exports, {
  BpfFilter: () => BpfFilter,
  FilterBuilder: () => FilterBuilder,
  LinkLayerType: () => LinkLayerType,
  Packet: () => Packet,
  PacketBuilder: () => PacketBuilder,
  Pcap: () => Pcap,
  SocketStream: () => SocketStream,
  Wire: () => Wire,
  arp: () => arp,
  default: () => lib_default2,
  dhcp: () => dhcp,
  dns: () => dns,
  ethernet: () => ethernet,
  gre: () => gre,
  icmp: () => icmp,
  icmpv6: () => icmpv6,
  ipv4: () => ipv4,
  ipv6: () => ipv6,
  loopback: () => loopback,
  ntp: () => ntp,
  otw: () => otw,
  payload: () => payload,
  pcap: () => Pcap,
  protocols: () => protocols,
  registerLayer: () => registerLayer,
  socket: () => socket_default,
  system: () => system,
  tcp: () => tcp,
  udp: () => udp,
  vlan: () => vlan
});
var system, Pcap, lib_default2;
var init_lib = __esm({
  "lib/index.js"() {
    init_liveDevice();
    init_socket();
    init_bpfFilter();
    init_enums();
    init_pcapFile();
    init_packet();
    init_arp();
    init_routing();
    init_gateway();
    init_converters();
    init_socketStream();
    init_wire();
    init_registry();
    init_filter2();
    init_packetBuilder();
    init_protocols();
    init_protocols();
    system = {
      ...converters_default,
      getArpTable,
      getRoutingTable,
      gatewayFor
    };
    Pcap = {
      LiveDevice,
      createReadStream,
      createWriteStream,
      constants
    };
    Object.assign(otw, {
      Pcap,
      socket: socket_default,
      SocketStream,
      LinkLayerType,
      BpfFilter,
      Packet,
      PacketBuilder,
      FilterBuilder,
      Wire,
      registerLayer,
      protocols,
      system,
      pcap: Pcap,
      ...namespaces()
    });
    lib_default2 = otw;
  }
});

// lib/cli/host.js
var import_node_fs3, import_node_os4, import_node_module2, import_node_child_process, PACKAGE_NAME, PACKAGE_URL, PACKAGE_SLOT, DEFAULT_RELEASES, EXECUTABLE, SYSTEM_NAMES, packageIsExposed, packageVersion, packageSource, exposePackage, importScript, releaseAsset, versionOf, update;
var init_host = __esm({
  "lib/cli/host.js"() {
    import_node_fs3 = __toESM(require("node:fs"), 1);
    import_node_os4 = __toESM(require("node:os"), 1);
    import_node_module2 = __toESM(require("node:module"), 1);
    import_node_child_process = require("node:child_process");
    init_lib();
    PACKAGE_NAME = "over-the-wire";
    PACKAGE_URL = "over-the-wire:package";
    PACKAGE_SLOT = Symbol.for(PACKAGE_NAME);
    DEFAULT_RELEASES = "https://github.com/vaguue/over-the-wire/releases/latest/download";
    EXECUTABLE = 493;
    SYSTEM_NAMES = {
      darwin: "macos",
      linux: "linux"
    };
    packageIsExposed = false;
    packageVersion = () => {
      return "2.0.0";
    };
    packageSource = () => {
      const names = Object.keys(lib_exports).filter((name) => name !== "default");
      return [
        `const loaded = globalThis[Symbol.for(${JSON.stringify(PACKAGE_NAME)})];`,
        "export default loaded.default;",
        `export const { ${names.join(", ")} } = loaded;`
      ].join("\n");
    };
    exposePackage = () => {
      if (packageIsExposed) {
        return true;
      }
      const source = packageSource();
      globalThis[PACKAGE_SLOT] = lib_exports;
      import_node_module2.default.registerHooks({
        resolve(specifier, context2, nextResolve) {
          if (specifier === PACKAGE_NAME) {
            return { url: PACKAGE_URL, format: "module", shortCircuit: true };
          }
          return nextResolve(specifier, context2);
        },
        load(url, context2, nextLoad) {
          if (url === PACKAGE_URL) {
            return { format: "module", source, shortCircuit: true };
          }
          return nextLoad(url, context2);
        }
      });
      packageIsExposed = true;
      return true;
    };
    importScript = (url) => {
      return import(url);
    };
    releaseAsset = (platform3 = import_node_os4.default.platform(), arch = import_node_os4.default.arch()) => {
      const system2 = SYSTEM_NAMES[platform3];
      if (system2 === void 0) {
        const err = new Error(`There is no standalone otw for ${platform3}`);
        err.code = "ENOTSUPPORTED";
        throw err;
      }
      return `otw-${system2}-${arch}`;
    };
    versionOf = (executable) => {
      const asked = (0, import_node_child_process.spawnSync)(executable, ["--version"], { encoding: "utf8" });
      return asked.status === 0 ? asked.stdout.trim() : null;
    };
    update = async ({ log = console.log, executable = process.execPath, releases = process.env.OVER_THE_WIRE_RELEASES ?? DEFAULT_RELEASES } = {}) => {
      const url = `${releases.replace(/\/$/, "")}/${releaseAsset()}`;
      const downloaded = `${executable}.download`;
      log("[*] Updating the binary...");
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Could not download ${url}: ${response.status} ${response.statusText}`);
      }
      import_node_fs3.default.writeFileSync(downloaded, Buffer.from(await response.arrayBuffer()), { mode: EXECUTABLE });
      const newVersion = versionOf(downloaded);
      if (newVersion === null) {
        import_node_fs3.default.rmSync(downloaded, { force: true });
        throw new Error(`What was downloaded from ${url} does not run on this system, the current binary is kept`);
      }
      import_node_fs3.default.renameSync(downloaded, executable);
      log(`[*] ${packageVersion()} -> ${newVersion}. It takes effect the next time otw starts.`);
      return true;
    };
  }
});

// lib/cli/session.js
var printDocs, openSession, installGlobals;
var init_session = __esm({
  "lib/cli/session.js"() {
    init_lib();
    init_protocols();
    init_docs();
    init_style();
    printDocs = (name) => {
      console.log(renderDocs(name, { color: colorsWanted() }));
    };
    openSession = ({ iface = null } = {}) => {
      Wire.defaults.iface = iface;
      const wire = lib_default2();
      return {
        wire,
        globals: {
          wire,
          otw: lib_default2,
          Packet,
          pcap: Pcap,
          system,
          docs: printDocs,
          ...namespaces()
        }
      };
    };
    installGlobals = (globals, target = globalThis) => {
      for (const [name, value] of Object.entries(globals)) {
        Object.defineProperty(target, name, {
          value,
          writable: true,
          configurable: true,
          enumerable: false
        });
      }
    };
  }
});

// lib/cli/logo.js
var SPIDER, banner;
var init_logo = __esm({
  "lib/cli/logo.js"() {
    SPIDER = [
      "    / \\  _  / \\",
      "   /   \\(_)/   \\",
      "  /  /\\/   \\/\\  \\",
      " /  / (  o o  ) \\  \\",
      "    \\  \\  ^  /  /",
      "     \\  \\___/  /",
      "      \\/     \\/"
    ];
    banner = ({ version, iface }) => {
      const notes = [
        "",
        "",
        `over-the-wire ${version}`,
        `interface: ${iface ?? "chosen by the routing table"}`,
        "wire, the protocol constants and docs() are global",
        ".docs icmp   .help   .exit",
        ""
      ];
      const width = Math.max(...SPIDER.map((line) => line.length)) + 3;
      return SPIDER.map((line, row) => {
        return `${line.padEnd(width)}${notes[row]}`.trimEnd();
      }).join("\n");
    };
  }
});

// lib/cli/repl.js
var repl_exports = {};
__export(repl_exports, {
  isThenable: () => isThenable,
  promptFor: () => promptFor,
  settleBeforePrinting: () => settleBeforePrinting,
  startRepl: () => startRepl
});
var import_node_os5, import_node_path, import_node_repl, HISTORY_FILE, isThenable, settleBeforePrinting, DEFAULT_PROMPT, promptFor, startRepl;
var init_repl = __esm({
  "lib/cli/repl.js"() {
    import_node_os5 = __toESM(require("node:os"), 1);
    import_node_path = __toESM(require("node:path"), 1);
    import_node_repl = __toESM(require("node:repl"), 1);
    init_session();
    init_logo();
    init_host();
    HISTORY_FILE = ".otw_history";
    isThenable = (value) => {
      return value !== null && (typeof value == "object" || typeof value == "function") && typeof value.then == "function";
    };
    settleBeforePrinting = (server) => {
      const evaluate = server.eval;
      const deliverLine = server.listeners("line");
      const waitingLines = [];
      let settling = false;
      const deliverWaitingLines = () => {
        while (!settling && waitingLines.length > 0) {
          const line = waitingLines.shift();
          for (const deliver of deliverLine) {
            deliver.call(server, line);
          }
        }
      };
      server.removeAllListeners("line");
      server.on("line", (line) => {
        waitingLines.push(line);
        deliverWaitingLines();
      });
      server.eval = (command2, context2, file, finish) => {
        evaluate.call(server, command2, context2, file, (err, result) => {
          if (err || !isThenable(result)) {
            finish(err, result);
            return;
          }
          settling = true;
          const settle = (failure, settled) => {
            settling = false;
            finish(failure, settled);
            deliverWaitingLines();
          };
          Promise.resolve(result).then(
            (settled) => {
              settle(null, settled);
            },
            (failure) => {
              settle(failure);
            }
          );
        });
      };
    };
    DEFAULT_PROMPT = "otw> ";
    promptFor = async (wire) => {
      try {
        const iface = await wire.defaultInterface();
        const { ipv4: ipv42, ipv6: ipv62 } = wire.addresses(iface);
        const address = ipv42 ?? ipv62;
        return address === void 0 ? `otw(${iface})> ` : `otw(${iface}):${address}> `;
      } catch (err) {
        return DEFAULT_PROMPT;
      }
    };
    startRepl = ({ iface = null, version, input = process.stdin, output = process.stdout, prompt = DEFAULT_PROMPT } = {}) => {
      const session = openSession({ iface });
      if (output.isTTY) {
        output.write(`${banner({ version, iface })}

`);
      }
      const server = import_node_repl.default.start({
        prompt,
        input,
        output,
        useGlobal: true,
        ignoreUndefined: true
      });
      installGlobals(session.globals, server.context);
      settleBeforePrinting(server);
      server.defineCommand("docs", {
        help: "Fields and constants of a protocol, for example .docs icmp",
        action(name) {
          try {
            printDocs(name.trim().length > 0 ? name.trim() : void 0);
          } catch (err) {
            console.log(err.message);
          }
          this.displayPrompt();
        }
      });
      server.defineCommand("update", {
        help: "Replace this otw with the latest release",
        action() {
          update().catch((err) => {
            console.log(err.message);
          }).finally(() => {
            this.displayPrompt();
          });
        }
      });
      if (input.isTTY) {
        server.setupHistory(import_node_path.default.join(import_node_os5.default.homedir(), HISTORY_FILE), () => {
        });
      }
      const finished = new Promise((resolve6) => {
        server.once("exit", () => {
          session.wire.close();
          resolve6();
        });
      });
      return { server, session, finished };
    };
  }
});

// lib/cli/scriptArguments.js
var SEPARATOR, NUMBER, valueOf, nameOf, isOption, withoutSeparator, parseScriptArguments;
var init_scriptArguments = __esm({
  "lib/cli/scriptArguments.js"() {
    SEPARATOR = "--";
    NUMBER = /^-?\d+(\.\d+)?$/;
    valueOf = (text) => {
      return NUMBER.test(text) ? Number(text) : text;
    };
    nameOf = (option) => {
      return option.replace(/^-+/, "");
    };
    isOption = (argument) => {
      return argument.startsWith("-") && argument.length > 1 && !NUMBER.test(argument);
    };
    withoutSeparator = (scriptArguments) => {
      return scriptArguments[0] === SEPARATOR ? scriptArguments.slice(1) : scriptArguments;
    };
    parseScriptArguments = (scriptArguments) => {
      const args = [];
      const given = withoutSeparator(scriptArguments);
      for (let index = 0; index < given.length; index++) {
        const argument = given[index];
        if (!isOption(argument)) {
          args.push(valueOf(argument));
          continue;
        }
        const assignment = argument.indexOf("=");
        if (assignment !== -1) {
          args[nameOf(argument.slice(0, assignment))] = valueOf(argument.slice(assignment + 1));
          continue;
        }
        const following = given[index + 1];
        if (following === void 0 || isOption(following)) {
          args[nameOf(argument)] = true;
          continue;
        }
        args[nameOf(argument)] = valueOf(following);
        index++;
      }
      return args;
    };
  }
});

// lib/cli/run.js
var run_exports = {};
__export(run_exports, {
  checkSupportedSystem: () => checkSupportedSystem,
  resolvePackageToThisInstall: () => resolvePackageToThisInstall,
  runFile: () => runFile
});
var import_node_os6, import_node_path2, import_node_url, SYSTEM_NAMES2, resolvePackageToThisInstall, unsupportedSystem, checkSupportedSystem, runFile;
var init_run = __esm({
  "lib/cli/run.js"() {
    import_node_os6 = __toESM(require("node:os"), 1);
    import_node_path2 = __toESM(require("node:path"), 1);
    import_node_url = require("node:url");
    init_session();
    init_host();
    init_scriptArguments();
    SYSTEM_NAMES2 = {
      darwin: ["mac", "macos", "darwin"],
      linux: ["linux"],
      win32: ["windows", "win32"]
    };
    resolvePackageToThisInstall = () => {
      return exposePackage();
    };
    unsupportedSystem = (file, supported, platform3) => {
      const err = new Error(`${import_node_path2.default.basename(file)} supports ${supported.join(", ")}, this system is ${platform3}`);
      err.code = "EUNSUPPORTEDOS";
      return err;
    };
    checkSupportedSystem = (file, options, platform3) => {
      const supported = options?.supported_os;
      if (!Array.isArray(supported)) {
        return;
      }
      const namesOfThisSystem = SYSTEM_NAMES2[platform3] ?? [platform3];
      if (!supported.some((name) => namesOfThisSystem.includes(String(name).toLowerCase()))) {
        throw unsupportedSystem(file, supported, platform3);
      }
    };
    runFile = async (file, { iface = null, scriptArguments = [], platform: platform3 = import_node_os6.default.platform() } = {}) => {
      const session = openSession({ iface });
      const scriptPath = import_node_path2.default.resolve(file);
      const ownArguments = withoutSeparator(scriptArguments);
      installGlobals(session.globals);
      resolvePackageToThisInstall();
      process.argv = [process.argv[0], scriptPath, ...ownArguments];
      const script = await importScript((0, import_node_url.pathToFileURL)(scriptPath).href);
      if (typeof script.default == "function") {
        checkSupportedSystem(file, script.options, platform3);
        await script.default(session.wire, parseScriptArguments(ownArguments));
      }
      return session;
    };
  }
});

// node_modules/yargs/lib/platform-shims/esm.mjs
var import_assert = require("assert");

// node_modules/cliui/build/lib/index.js
var align = {
  right: alignRight,
  center: alignCenter
};
var top = 0;
var right = 1;
var bottom = 2;
var left = 3;
var UI = class {
  constructor(opts) {
    var _a2;
    this.width = opts.width;
    this.wrap = (_a2 = opts.wrap) !== null && _a2 !== void 0 ? _a2 : true;
    this.rows = [];
  }
  span(...args) {
    const cols = this.div(...args);
    cols.span = true;
  }
  resetOutput() {
    this.rows = [];
  }
  div(...args) {
    if (args.length === 0) {
      this.div("");
    }
    if (this.wrap && this.shouldApplyLayoutDSL(...args) && typeof args[0] === "string") {
      return this.applyLayoutDSL(args[0]);
    }
    const cols = args.map((arg) => {
      if (typeof arg === "string") {
        return this.colFromString(arg);
      }
      return arg;
    });
    this.rows.push(cols);
    return cols;
  }
  shouldApplyLayoutDSL(...args) {
    return args.length === 1 && typeof args[0] === "string" && /[\t\n]/.test(args[0]);
  }
  applyLayoutDSL(str) {
    const rows = str.split("\n").map((row) => row.split("	"));
    let leftColumnWidth = 0;
    rows.forEach((columns) => {
      if (columns.length > 1 && mixin.stringWidth(columns[0]) > leftColumnWidth) {
        leftColumnWidth = Math.min(Math.floor(this.width * 0.5), mixin.stringWidth(columns[0]));
      }
    });
    rows.forEach((columns) => {
      this.div(...columns.map((r, i) => {
        return {
          text: r.trim(),
          padding: this.measurePadding(r),
          width: i === 0 && columns.length > 1 ? leftColumnWidth : void 0
        };
      }));
    });
    return this.rows[this.rows.length - 1];
  }
  colFromString(text) {
    return {
      text,
      padding: this.measurePadding(text)
    };
  }
  measurePadding(str) {
    const noAnsi = mixin.stripAnsi(str);
    return [0, noAnsi.match(/\s*$/)[0].length, 0, noAnsi.match(/^\s*/)[0].length];
  }
  toString() {
    const lines = [];
    this.rows.forEach((row) => {
      this.rowToString(row, lines);
    });
    return lines.filter((line) => !line.hidden).map((line) => line.text).join("\n");
  }
  rowToString(row, lines) {
    this.rasterize(row).forEach((rrow, r) => {
      let str = "";
      rrow.forEach((col, c) => {
        const { width } = row[c];
        const wrapWidth = this.negatePadding(row[c]);
        let ts = col;
        if (wrapWidth > mixin.stringWidth(col)) {
          ts += " ".repeat(wrapWidth - mixin.stringWidth(col));
        }
        if (row[c].align && row[c].align !== "left" && this.wrap) {
          const fn = align[row[c].align];
          ts = fn(ts, wrapWidth);
          if (mixin.stringWidth(ts) < wrapWidth) {
            ts += " ".repeat((width || 0) - mixin.stringWidth(ts) - 1);
          }
        }
        const padding = row[c].padding || [0, 0, 0, 0];
        if (padding[left]) {
          str += " ".repeat(padding[left]);
        }
        str += addBorder(row[c], ts, "| ");
        str += ts;
        str += addBorder(row[c], ts, " |");
        if (padding[right]) {
          str += " ".repeat(padding[right]);
        }
        if (r === 0 && lines.length > 0) {
          str = this.renderInline(str, lines[lines.length - 1]);
        }
      });
      lines.push({
        text: str.replace(/ +$/, ""),
        span: row.span
      });
    });
    return lines;
  }
  // if the full 'source' can render in
  // the target line, do so.
  renderInline(source, previousLine) {
    const match = source.match(/^ */);
    const leadingWhitespace = match ? match[0].length : 0;
    const target = previousLine.text;
    const targetTextWidth = mixin.stringWidth(target.trimRight());
    if (!previousLine.span) {
      return source;
    }
    if (!this.wrap) {
      previousLine.hidden = true;
      return target + source;
    }
    if (leadingWhitespace < targetTextWidth) {
      return source;
    }
    previousLine.hidden = true;
    return target.trimRight() + " ".repeat(leadingWhitespace - targetTextWidth) + source.trimLeft();
  }
  rasterize(row) {
    const rrows = [];
    const widths = this.columnWidths(row);
    let wrapped;
    row.forEach((col, c) => {
      col.width = widths[c];
      if (this.wrap) {
        wrapped = mixin.wrap(col.text, this.negatePadding(col), { hard: true }).split("\n");
      } else {
        wrapped = col.text.split("\n");
      }
      if (col.border) {
        wrapped.unshift("." + "-".repeat(this.negatePadding(col) + 2) + ".");
        wrapped.push("'" + "-".repeat(this.negatePadding(col) + 2) + "'");
      }
      if (col.padding) {
        wrapped.unshift(...new Array(col.padding[top] || 0).fill(""));
        wrapped.push(...new Array(col.padding[bottom] || 0).fill(""));
      }
      wrapped.forEach((str, r) => {
        if (!rrows[r]) {
          rrows.push([]);
        }
        const rrow = rrows[r];
        for (let i = 0; i < c; i++) {
          if (rrow[i] === void 0) {
            rrow.push("");
          }
        }
        rrow.push(str);
      });
    });
    return rrows;
  }
  negatePadding(col) {
    let wrapWidth = col.width || 0;
    if (col.padding) {
      wrapWidth -= (col.padding[left] || 0) + (col.padding[right] || 0);
    }
    if (col.border) {
      wrapWidth -= 4;
    }
    return wrapWidth;
  }
  columnWidths(row) {
    if (!this.wrap) {
      return row.map((col) => {
        return col.width || mixin.stringWidth(col.text);
      });
    }
    let unset = row.length;
    let remainingWidth = this.width;
    const widths = row.map((col) => {
      if (col.width) {
        unset--;
        remainingWidth -= col.width;
        return col.width;
      }
      return void 0;
    });
    const unsetWidth = unset ? Math.floor(remainingWidth / unset) : 0;
    return widths.map((w, i) => {
      if (w === void 0) {
        return Math.max(unsetWidth, _minWidth(row[i]));
      }
      return w;
    });
  }
};
function addBorder(col, ts, style) {
  if (col.border) {
    if (/[.']-+[.']/.test(ts)) {
      return "";
    }
    if (ts.trim().length !== 0) {
      return style;
    }
    return "  ";
  }
  return "";
}
function _minWidth(col) {
  const padding = col.padding || [];
  const minWidth = 1 + (padding[left] || 0) + (padding[right] || 0);
  if (col.border) {
    return minWidth + 4;
  }
  return minWidth;
}
function getWindowWidth() {
  if (typeof process === "object" && process.stdout && process.stdout.columns) {
    return process.stdout.columns;
  }
  return 80;
}
function alignRight(str, width) {
  str = str.trim();
  const strWidth = mixin.stringWidth(str);
  if (strWidth < width) {
    return " ".repeat(width - strWidth) + str;
  }
  return str;
}
function alignCenter(str, width) {
  str = str.trim();
  const strWidth = mixin.stringWidth(str);
  if (strWidth >= width) {
    return str;
  }
  return " ".repeat(width - strWidth >> 1) + str;
}
var mixin;
function cliui(opts, _mixin) {
  mixin = _mixin;
  return new UI({
    width: (opts === null || opts === void 0 ? void 0 : opts.width) || getWindowWidth(),
    wrap: opts === null || opts === void 0 ? void 0 : opts.wrap
  });
}

// node_modules/cliui/build/lib/string-utils.js
var ansi = new RegExp("\x1B(?:\\[(?:\\d+[ABCDEFGJKSTm]|\\d+;\\d+[Hfm]|\\d+;\\d+;\\d+m|6n|s|u|\\?25[lh])|\\w)", "g");
function stripAnsi(str) {
  return str.replace(ansi, "");
}
function wrap(str, width) {
  const [start, end] = str.match(ansi) || ["", ""];
  str = stripAnsi(str);
  let wrapped = "";
  for (let i = 0; i < str.length; i++) {
    if (i !== 0 && i % width === 0) {
      wrapped += "\n";
    }
    wrapped += str.charAt(i);
  }
  if (start && end) {
    wrapped = `${start}${wrapped}${end}`;
  }
  return wrapped;
}

// node_modules/cliui/index.mjs
function ui(opts) {
  return cliui(opts, {
    stringWidth: (str) => {
      return [...str].length;
    },
    stripAnsi,
    wrap
  });
}

// node_modules/escalade/sync/index.mjs
var import_path = require("path");
var import_fs = require("fs");
function sync_default(start, callback) {
  let dir = (0, import_path.resolve)(".", start);
  let tmp, stats = (0, import_fs.statSync)(dir);
  if (!stats.isDirectory()) {
    dir = (0, import_path.dirname)(dir);
  }
  while (true) {
    tmp = callback(dir, (0, import_fs.readdirSync)(dir));
    if (tmp) return (0, import_path.resolve)(dir, tmp);
    dir = (0, import_path.dirname)(tmp = dir);
    if (tmp === dir) break;
  }
}

// node_modules/yargs/lib/platform-shims/esm.mjs
var import_util3 = require("util");
var import_fs4 = require("fs");
var import_url = require("url");

// node_modules/yargs-parser/build/lib/index.js
var import_util = require("util");
var import_path2 = require("path");

// node_modules/yargs-parser/build/lib/string-utils.js
function camelCase(str) {
  const isCamelCase = str !== str.toLowerCase() && str !== str.toUpperCase();
  if (!isCamelCase) {
    str = str.toLowerCase();
  }
  if (str.indexOf("-") === -1 && str.indexOf("_") === -1) {
    return str;
  } else {
    let camelcase = "";
    let nextChrUpper = false;
    const leadingHyphens = str.match(/^-+/);
    for (let i = leadingHyphens ? leadingHyphens[0].length : 0; i < str.length; i++) {
      let chr = str.charAt(i);
      if (nextChrUpper) {
        nextChrUpper = false;
        chr = chr.toUpperCase();
      }
      if (i !== 0 && (chr === "-" || chr === "_")) {
        nextChrUpper = true;
      } else if (chr !== "-" && chr !== "_") {
        camelcase += chr;
      }
    }
    return camelcase;
  }
}
function decamelize(str, joinString) {
  const lowercase = str.toLowerCase();
  joinString = joinString || "-";
  let notCamelcase = "";
  for (let i = 0; i < str.length; i++) {
    const chrLower = lowercase.charAt(i);
    const chrString = str.charAt(i);
    if (chrLower !== chrString && i > 0) {
      notCamelcase += `${joinString}${lowercase.charAt(i)}`;
    } else {
      notCamelcase += chrString;
    }
  }
  return notCamelcase;
}
function looksLikeNumber(x) {
  if (x === null || x === void 0)
    return false;
  if (typeof x === "number")
    return true;
  if (/^0x[0-9a-f]+$/i.test(x))
    return true;
  if (/^0[^.]/.test(x))
    return false;
  return /^[-]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x);
}

// node_modules/yargs-parser/build/lib/tokenize-arg-string.js
function tokenizeArgString(argString) {
  if (Array.isArray(argString)) {
    return argString.map((e) => typeof e !== "string" ? e + "" : e);
  }
  argString = argString.trim();
  let i = 0;
  let prevC = null;
  let c = null;
  let opening = null;
  const args = [];
  for (let ii = 0; ii < argString.length; ii++) {
    prevC = c;
    c = argString.charAt(ii);
    if (c === " " && !opening) {
      if (!(prevC === " ")) {
        i++;
      }
      continue;
    }
    if (c === opening) {
      opening = null;
    } else if ((c === "'" || c === '"') && !opening) {
      opening = c;
    }
    if (!args[i])
      args[i] = "";
    args[i] += c;
  }
  return args;
}

// node_modules/yargs-parser/build/lib/yargs-parser-types.js
var DefaultValuesForTypeKey;
(function(DefaultValuesForTypeKey2) {
  DefaultValuesForTypeKey2["BOOLEAN"] = "boolean";
  DefaultValuesForTypeKey2["STRING"] = "string";
  DefaultValuesForTypeKey2["NUMBER"] = "number";
  DefaultValuesForTypeKey2["ARRAY"] = "array";
})(DefaultValuesForTypeKey || (DefaultValuesForTypeKey = {}));

// node_modules/yargs-parser/build/lib/yargs-parser.js
var mixin2;
var YargsParser = class {
  constructor(_mixin) {
    mixin2 = _mixin;
  }
  parse(argsInput, options) {
    const opts = Object.assign({
      alias: void 0,
      array: void 0,
      boolean: void 0,
      config: void 0,
      configObjects: void 0,
      configuration: void 0,
      coerce: void 0,
      count: void 0,
      default: void 0,
      envPrefix: void 0,
      narg: void 0,
      normalize: void 0,
      string: void 0,
      number: void 0,
      __: void 0,
      key: void 0
    }, options);
    const args = tokenizeArgString(argsInput);
    const inputIsString = typeof argsInput === "string";
    const aliases = combineAliases(Object.assign(/* @__PURE__ */ Object.create(null), opts.alias));
    const configuration = Object.assign({
      "boolean-negation": true,
      "camel-case-expansion": true,
      "combine-arrays": false,
      "dot-notation": true,
      "duplicate-arguments-array": true,
      "flatten-duplicate-arrays": true,
      "greedy-arrays": true,
      "halt-at-non-option": false,
      "nargs-eats-options": false,
      "negation-prefix": "no-",
      "parse-numbers": true,
      "parse-positional-numbers": true,
      "populate--": false,
      "set-placeholder-key": false,
      "short-option-groups": true,
      "strip-aliased": false,
      "strip-dashed": false,
      "unknown-options-as-args": false
    }, opts.configuration);
    const defaults3 = Object.assign(/* @__PURE__ */ Object.create(null), opts.default);
    const configObjects = opts.configObjects || [];
    const envPrefix = opts.envPrefix;
    const notFlagsOption = configuration["populate--"];
    const notFlagsArgv = notFlagsOption ? "--" : "_";
    const newAliases = /* @__PURE__ */ Object.create(null);
    const defaulted = /* @__PURE__ */ Object.create(null);
    const __ = opts.__ || mixin2.format;
    const flags = {
      aliases: /* @__PURE__ */ Object.create(null),
      arrays: /* @__PURE__ */ Object.create(null),
      bools: /* @__PURE__ */ Object.create(null),
      strings: /* @__PURE__ */ Object.create(null),
      numbers: /* @__PURE__ */ Object.create(null),
      counts: /* @__PURE__ */ Object.create(null),
      normalize: /* @__PURE__ */ Object.create(null),
      configs: /* @__PURE__ */ Object.create(null),
      nargs: /* @__PURE__ */ Object.create(null),
      coercions: /* @__PURE__ */ Object.create(null),
      keys: []
    };
    const negative = /^-([0-9]+(\.[0-9]+)?|\.[0-9]+)$/;
    const negatedBoolean = new RegExp("^--" + configuration["negation-prefix"] + "(.+)");
    [].concat(opts.array || []).filter(Boolean).forEach(function(opt) {
      const key = typeof opt === "object" ? opt.key : opt;
      const assignment = Object.keys(opt).map(function(key2) {
        const arrayFlagKeys = {
          boolean: "bools",
          string: "strings",
          number: "numbers"
        };
        return arrayFlagKeys[key2];
      }).filter(Boolean).pop();
      if (assignment) {
        flags[assignment][key] = true;
      }
      flags.arrays[key] = true;
      flags.keys.push(key);
    });
    [].concat(opts.boolean || []).filter(Boolean).forEach(function(key) {
      flags.bools[key] = true;
      flags.keys.push(key);
    });
    [].concat(opts.string || []).filter(Boolean).forEach(function(key) {
      flags.strings[key] = true;
      flags.keys.push(key);
    });
    [].concat(opts.number || []).filter(Boolean).forEach(function(key) {
      flags.numbers[key] = true;
      flags.keys.push(key);
    });
    [].concat(opts.count || []).filter(Boolean).forEach(function(key) {
      flags.counts[key] = true;
      flags.keys.push(key);
    });
    [].concat(opts.normalize || []).filter(Boolean).forEach(function(key) {
      flags.normalize[key] = true;
      flags.keys.push(key);
    });
    if (typeof opts.narg === "object") {
      Object.entries(opts.narg).forEach(([key, value]) => {
        if (typeof value === "number") {
          flags.nargs[key] = value;
          flags.keys.push(key);
        }
      });
    }
    if (typeof opts.coerce === "object") {
      Object.entries(opts.coerce).forEach(([key, value]) => {
        if (typeof value === "function") {
          flags.coercions[key] = value;
          flags.keys.push(key);
        }
      });
    }
    if (typeof opts.config !== "undefined") {
      if (Array.isArray(opts.config) || typeof opts.config === "string") {
        ;
        [].concat(opts.config).filter(Boolean).forEach(function(key) {
          flags.configs[key] = true;
        });
      } else if (typeof opts.config === "object") {
        Object.entries(opts.config).forEach(([key, value]) => {
          if (typeof value === "boolean" || typeof value === "function") {
            flags.configs[key] = value;
          }
        });
      }
    }
    extendAliases(opts.key, aliases, opts.default, flags.arrays);
    Object.keys(defaults3).forEach(function(key) {
      (flags.aliases[key] || []).forEach(function(alias) {
        defaults3[alias] = defaults3[key];
      });
    });
    let error = null;
    checkConfiguration();
    let notFlags = [];
    const argv = Object.assign(/* @__PURE__ */ Object.create(null), { _: [] });
    const argvReturn = {};
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      const truncatedArg = arg.replace(/^-{3,}/, "---");
      let broken;
      let key;
      let letters;
      let m;
      let next;
      let value;
      if (arg !== "--" && /^-/.test(arg) && isUnknownOptionAsArg(arg)) {
        pushPositional(arg);
      } else if (truncatedArg.match(/^---+(=|$)/)) {
        pushPositional(arg);
        continue;
      } else if (arg.match(/^--.+=/) || !configuration["short-option-groups"] && arg.match(/^-.+=/)) {
        m = arg.match(/^--?([^=]+)=([\s\S]*)$/);
        if (m !== null && Array.isArray(m) && m.length >= 3) {
          if (checkAllAliases(m[1], flags.arrays)) {
            i = eatArray(i, m[1], args, m[2]);
          } else if (checkAllAliases(m[1], flags.nargs) !== false) {
            i = eatNargs(i, m[1], args, m[2]);
          } else {
            setArg(m[1], m[2], true);
          }
        }
      } else if (arg.match(negatedBoolean) && configuration["boolean-negation"]) {
        m = arg.match(negatedBoolean);
        if (m !== null && Array.isArray(m) && m.length >= 2) {
          key = m[1];
          setArg(key, checkAllAliases(key, flags.arrays) ? [false] : false);
        }
      } else if (arg.match(/^--.+/) || !configuration["short-option-groups"] && arg.match(/^-[^-]+/)) {
        m = arg.match(/^--?(.+)/);
        if (m !== null && Array.isArray(m) && m.length >= 2) {
          key = m[1];
          if (checkAllAliases(key, flags.arrays)) {
            i = eatArray(i, key, args);
          } else if (checkAllAliases(key, flags.nargs) !== false) {
            i = eatNargs(i, key, args);
          } else {
            next = args[i + 1];
            if (next !== void 0 && (!next.match(/^-/) || next.match(negative)) && !checkAllAliases(key, flags.bools) && !checkAllAliases(key, flags.counts)) {
              setArg(key, next);
              i++;
            } else if (/^(true|false)$/.test(next)) {
              setArg(key, next);
              i++;
            } else {
              setArg(key, defaultValue(key));
            }
          }
        }
      } else if (arg.match(/^-.\..+=/)) {
        m = arg.match(/^-([^=]+)=([\s\S]*)$/);
        if (m !== null && Array.isArray(m) && m.length >= 3) {
          setArg(m[1], m[2]);
        }
      } else if (arg.match(/^-.\..+/) && !arg.match(negative)) {
        next = args[i + 1];
        m = arg.match(/^-(.\..+)/);
        if (m !== null && Array.isArray(m) && m.length >= 2) {
          key = m[1];
          if (next !== void 0 && !next.match(/^-/) && !checkAllAliases(key, flags.bools) && !checkAllAliases(key, flags.counts)) {
            setArg(key, next);
            i++;
          } else {
            setArg(key, defaultValue(key));
          }
        }
      } else if (arg.match(/^-[^-]+/) && !arg.match(negative)) {
        letters = arg.slice(1, -1).split("");
        broken = false;
        for (let j = 0; j < letters.length; j++) {
          next = arg.slice(j + 2);
          if (letters[j + 1] && letters[j + 1] === "=") {
            value = arg.slice(j + 3);
            key = letters[j];
            if (checkAllAliases(key, flags.arrays)) {
              i = eatArray(i, key, args, value);
            } else if (checkAllAliases(key, flags.nargs) !== false) {
              i = eatNargs(i, key, args, value);
            } else {
              setArg(key, value);
            }
            broken = true;
            break;
          }
          if (next === "-") {
            setArg(letters[j], next);
            continue;
          }
          if (/[A-Za-z]/.test(letters[j]) && /^-?\d+(\.\d*)?(e-?\d+)?$/.test(next) && checkAllAliases(next, flags.bools) === false) {
            setArg(letters[j], next);
            broken = true;
            break;
          }
          if (letters[j + 1] && letters[j + 1].match(/\W/)) {
            setArg(letters[j], next);
            broken = true;
            break;
          } else {
            setArg(letters[j], defaultValue(letters[j]));
          }
        }
        key = arg.slice(-1)[0];
        if (!broken && key !== "-") {
          if (checkAllAliases(key, flags.arrays)) {
            i = eatArray(i, key, args);
          } else if (checkAllAliases(key, flags.nargs) !== false) {
            i = eatNargs(i, key, args);
          } else {
            next = args[i + 1];
            if (next !== void 0 && (!/^(-|--)[^-]/.test(next) || next.match(negative)) && !checkAllAliases(key, flags.bools) && !checkAllAliases(key, flags.counts)) {
              setArg(key, next);
              i++;
            } else if (/^(true|false)$/.test(next)) {
              setArg(key, next);
              i++;
            } else {
              setArg(key, defaultValue(key));
            }
          }
        }
      } else if (arg.match(/^-[0-9]$/) && arg.match(negative) && checkAllAliases(arg.slice(1), flags.bools)) {
        key = arg.slice(1);
        setArg(key, defaultValue(key));
      } else if (arg === "--") {
        notFlags = args.slice(i + 1);
        break;
      } else if (configuration["halt-at-non-option"]) {
        notFlags = args.slice(i);
        break;
      } else {
        pushPositional(arg);
      }
    }
    applyEnvVars(argv, true);
    applyEnvVars(argv, false);
    setConfig(argv);
    setConfigObjects();
    applyDefaultsAndAliases(argv, flags.aliases, defaults3, true);
    applyCoercions(argv);
    if (configuration["set-placeholder-key"])
      setPlaceholderKeys(argv);
    Object.keys(flags.counts).forEach(function(key) {
      if (!hasKey(argv, key.split(".")))
        setArg(key, 0);
    });
    if (notFlagsOption && notFlags.length)
      argv[notFlagsArgv] = [];
    notFlags.forEach(function(key) {
      argv[notFlagsArgv].push(key);
    });
    if (configuration["camel-case-expansion"] && configuration["strip-dashed"]) {
      Object.keys(argv).filter((key) => key !== "--" && key.includes("-")).forEach((key) => {
        delete argv[key];
      });
    }
    if (configuration["strip-aliased"]) {
      ;
      [].concat(...Object.keys(aliases).map((k) => aliases[k])).forEach((alias) => {
        if (configuration["camel-case-expansion"] && alias.includes("-")) {
          delete argv[alias.split(".").map((prop) => camelCase(prop)).join(".")];
        }
        delete argv[alias];
      });
    }
    function pushPositional(arg) {
      const maybeCoercedNumber = maybeCoerceNumber("_", arg);
      if (typeof maybeCoercedNumber === "string" || typeof maybeCoercedNumber === "number") {
        argv._.push(maybeCoercedNumber);
      }
    }
    function eatNargs(i, key, args2, argAfterEqualSign) {
      let ii;
      let toEat = checkAllAliases(key, flags.nargs);
      toEat = typeof toEat !== "number" || isNaN(toEat) ? 1 : toEat;
      if (toEat === 0) {
        if (!isUndefined2(argAfterEqualSign)) {
          error = Error(__("Argument unexpected for: %s", key));
        }
        setArg(key, defaultValue(key));
        return i;
      }
      let available = isUndefined2(argAfterEqualSign) ? 0 : 1;
      if (configuration["nargs-eats-options"]) {
        if (args2.length - (i + 1) + available < toEat) {
          error = Error(__("Not enough arguments following: %s", key));
        }
        available = toEat;
      } else {
        for (ii = i + 1; ii < args2.length; ii++) {
          if (!args2[ii].match(/^-[^0-9]/) || args2[ii].match(negative) || isUnknownOptionAsArg(args2[ii]))
            available++;
          else
            break;
        }
        if (available < toEat)
          error = Error(__("Not enough arguments following: %s", key));
      }
      let consumed = Math.min(available, toEat);
      if (!isUndefined2(argAfterEqualSign) && consumed > 0) {
        setArg(key, argAfterEqualSign);
        consumed--;
      }
      for (ii = i + 1; ii < consumed + i + 1; ii++) {
        setArg(key, args2[ii]);
      }
      return i + consumed;
    }
    function eatArray(i, key, args2, argAfterEqualSign) {
      let argsToSet = [];
      let next = argAfterEqualSign || args2[i + 1];
      const nargsCount = checkAllAliases(key, flags.nargs);
      if (checkAllAliases(key, flags.bools) && !/^(true|false)$/.test(next)) {
        argsToSet.push(true);
      } else if (isUndefined2(next) || isUndefined2(argAfterEqualSign) && /^-/.test(next) && !negative.test(next) && !isUnknownOptionAsArg(next)) {
        if (defaults3[key] !== void 0) {
          const defVal = defaults3[key];
          argsToSet = Array.isArray(defVal) ? defVal : [defVal];
        }
      } else {
        if (!isUndefined2(argAfterEqualSign)) {
          argsToSet.push(processValue(key, argAfterEqualSign, true));
        }
        for (let ii = i + 1; ii < args2.length; ii++) {
          if (!configuration["greedy-arrays"] && argsToSet.length > 0 || nargsCount && typeof nargsCount === "number" && argsToSet.length >= nargsCount)
            break;
          next = args2[ii];
          if (/^-/.test(next) && !negative.test(next) && !isUnknownOptionAsArg(next))
            break;
          i = ii;
          argsToSet.push(processValue(key, next, inputIsString));
        }
      }
      if (typeof nargsCount === "number" && (nargsCount && argsToSet.length < nargsCount || isNaN(nargsCount) && argsToSet.length === 0)) {
        error = Error(__("Not enough arguments following: %s", key));
      }
      setArg(key, argsToSet);
      return i;
    }
    function setArg(key, val, shouldStripQuotes = inputIsString) {
      if (/-/.test(key) && configuration["camel-case-expansion"]) {
        const alias = key.split(".").map(function(prop) {
          return camelCase(prop);
        }).join(".");
        addNewAlias(key, alias);
      }
      const value = processValue(key, val, shouldStripQuotes);
      const splitKey = key.split(".");
      setKey(argv, splitKey, value);
      if (flags.aliases[key]) {
        flags.aliases[key].forEach(function(x) {
          const keyProperties = x.split(".");
          setKey(argv, keyProperties, value);
        });
      }
      if (splitKey.length > 1 && configuration["dot-notation"]) {
        ;
        (flags.aliases[splitKey[0]] || []).forEach(function(x) {
          let keyProperties = x.split(".");
          const a = [].concat(splitKey);
          a.shift();
          keyProperties = keyProperties.concat(a);
          if (!(flags.aliases[key] || []).includes(keyProperties.join("."))) {
            setKey(argv, keyProperties, value);
          }
        });
      }
      if (checkAllAliases(key, flags.normalize) && !checkAllAliases(key, flags.arrays)) {
        const keys2 = [key].concat(flags.aliases[key] || []);
        keys2.forEach(function(key2) {
          Object.defineProperty(argvReturn, key2, {
            enumerable: true,
            get() {
              return val;
            },
            set(value2) {
              val = typeof value2 === "string" ? mixin2.normalize(value2) : value2;
            }
          });
        });
      }
    }
    function addNewAlias(key, alias) {
      if (!(flags.aliases[key] && flags.aliases[key].length)) {
        flags.aliases[key] = [alias];
        newAliases[alias] = true;
      }
      if (!(flags.aliases[alias] && flags.aliases[alias].length)) {
        addNewAlias(alias, key);
      }
    }
    function processValue(key, val, shouldStripQuotes) {
      if (shouldStripQuotes) {
        val = stripQuotes(val);
      }
      if (checkAllAliases(key, flags.bools) || checkAllAliases(key, flags.counts)) {
        if (typeof val === "string")
          val = val === "true";
      }
      let value = Array.isArray(val) ? val.map(function(v) {
        return maybeCoerceNumber(key, v);
      }) : maybeCoerceNumber(key, val);
      if (checkAllAliases(key, flags.counts) && (isUndefined2(value) || typeof value === "boolean")) {
        value = increment();
      }
      if (checkAllAliases(key, flags.normalize) && checkAllAliases(key, flags.arrays)) {
        if (Array.isArray(val))
          value = val.map((val2) => {
            return mixin2.normalize(val2);
          });
        else
          value = mixin2.normalize(val);
      }
      return value;
    }
    function maybeCoerceNumber(key, value) {
      if (!configuration["parse-positional-numbers"] && key === "_")
        return value;
      if (!checkAllAliases(key, flags.strings) && !checkAllAliases(key, flags.bools) && !Array.isArray(value)) {
        const shouldCoerceNumber = looksLikeNumber(value) && configuration["parse-numbers"] && Number.isSafeInteger(Math.floor(parseFloat(`${value}`)));
        if (shouldCoerceNumber || !isUndefined2(value) && checkAllAliases(key, flags.numbers)) {
          value = Number(value);
        }
      }
      return value;
    }
    function setConfig(argv2) {
      const configLookup = /* @__PURE__ */ Object.create(null);
      applyDefaultsAndAliases(configLookup, flags.aliases, defaults3);
      Object.keys(flags.configs).forEach(function(configKey) {
        const configPath = argv2[configKey] || configLookup[configKey];
        if (configPath) {
          try {
            let config = null;
            const resolvedConfigPath = mixin2.resolve(mixin2.cwd(), configPath);
            const resolveConfig = flags.configs[configKey];
            if (typeof resolveConfig === "function") {
              try {
                config = resolveConfig(resolvedConfigPath);
              } catch (e) {
                config = e;
              }
              if (config instanceof Error) {
                error = config;
                return;
              }
            } else {
              config = mixin2.require(resolvedConfigPath);
            }
            setConfigObject(config);
          } catch (ex) {
            if (ex.name === "PermissionDenied")
              error = ex;
            else if (argv2[configKey])
              error = Error(__("Invalid JSON config file: %s", configPath));
          }
        }
      });
    }
    function setConfigObject(config, prev) {
      Object.keys(config).forEach(function(key) {
        const value = config[key];
        const fullKey = prev ? prev + "." + key : key;
        if (typeof value === "object" && value !== null && !Array.isArray(value) && configuration["dot-notation"]) {
          setConfigObject(value, fullKey);
        } else {
          if (!hasKey(argv, fullKey.split(".")) || checkAllAliases(fullKey, flags.arrays) && configuration["combine-arrays"]) {
            setArg(fullKey, value);
          }
        }
      });
    }
    function setConfigObjects() {
      if (typeof configObjects !== "undefined") {
        configObjects.forEach(function(configObject) {
          setConfigObject(configObject);
        });
      }
    }
    function applyEnvVars(argv2, configOnly) {
      if (typeof envPrefix === "undefined")
        return;
      const prefix = typeof envPrefix === "string" ? envPrefix : "";
      const env2 = mixin2.env();
      Object.keys(env2).forEach(function(envVar) {
        if (prefix === "" || envVar.lastIndexOf(prefix, 0) === 0) {
          const keys2 = envVar.split("__").map(function(key, i) {
            if (i === 0) {
              key = key.substring(prefix.length);
            }
            return camelCase(key);
          });
          if ((configOnly && flags.configs[keys2.join(".")] || !configOnly) && !hasKey(argv2, keys2)) {
            setArg(keys2.join("."), env2[envVar]);
          }
        }
      });
    }
    function applyCoercions(argv2) {
      let coerce;
      const applied = /* @__PURE__ */ new Set();
      Object.keys(argv2).forEach(function(key) {
        if (!applied.has(key)) {
          coerce = checkAllAliases(key, flags.coercions);
          if (typeof coerce === "function") {
            try {
              const value = maybeCoerceNumber(key, coerce(argv2[key]));
              [].concat(flags.aliases[key] || [], key).forEach((ali) => {
                applied.add(ali);
                argv2[ali] = value;
              });
            } catch (err) {
              error = err;
            }
          }
        }
      });
    }
    function setPlaceholderKeys(argv2) {
      flags.keys.forEach((key) => {
        if (~key.indexOf("."))
          return;
        if (typeof argv2[key] === "undefined")
          argv2[key] = void 0;
      });
      return argv2;
    }
    function applyDefaultsAndAliases(obj, aliases2, defaults4, canLog = false) {
      Object.keys(defaults4).forEach(function(key) {
        if (!hasKey(obj, key.split("."))) {
          setKey(obj, key.split("."), defaults4[key]);
          if (canLog)
            defaulted[key] = true;
          (aliases2[key] || []).forEach(function(x) {
            if (hasKey(obj, x.split(".")))
              return;
            setKey(obj, x.split("."), defaults4[key]);
          });
        }
      });
    }
    function hasKey(obj, keys2) {
      let o = obj;
      if (!configuration["dot-notation"])
        keys2 = [keys2.join(".")];
      keys2.slice(0, -1).forEach(function(key2) {
        o = o[key2] || {};
      });
      const key = keys2[keys2.length - 1];
      if (typeof o !== "object")
        return false;
      else
        return key in o;
    }
    function setKey(obj, keys2, value) {
      let o = obj;
      if (!configuration["dot-notation"])
        keys2 = [keys2.join(".")];
      keys2.slice(0, -1).forEach(function(key2) {
        key2 = sanitizeKey(key2);
        if (typeof o === "object" && o[key2] === void 0) {
          o[key2] = {};
        }
        if (typeof o[key2] !== "object" || Array.isArray(o[key2])) {
          if (Array.isArray(o[key2])) {
            o[key2].push({});
          } else {
            o[key2] = [o[key2], {}];
          }
          o = o[key2][o[key2].length - 1];
        } else {
          o = o[key2];
        }
      });
      const key = sanitizeKey(keys2[keys2.length - 1]);
      const isTypeArray = checkAllAliases(keys2.join("."), flags.arrays);
      const isValueArray = Array.isArray(value);
      let duplicate = configuration["duplicate-arguments-array"];
      if (!duplicate && checkAllAliases(key, flags.nargs)) {
        duplicate = true;
        if (!isUndefined2(o[key]) && flags.nargs[key] === 1 || Array.isArray(o[key]) && o[key].length === flags.nargs[key]) {
          o[key] = void 0;
        }
      }
      if (value === increment()) {
        o[key] = increment(o[key]);
      } else if (Array.isArray(o[key])) {
        if (duplicate && isTypeArray && isValueArray) {
          o[key] = configuration["flatten-duplicate-arrays"] ? o[key].concat(value) : (Array.isArray(o[key][0]) ? o[key] : [o[key]]).concat([value]);
        } else if (!duplicate && Boolean(isTypeArray) === Boolean(isValueArray)) {
          o[key] = value;
        } else {
          o[key] = o[key].concat([value]);
        }
      } else if (o[key] === void 0 && isTypeArray) {
        o[key] = isValueArray ? value : [value];
      } else if (duplicate && !(o[key] === void 0 || checkAllAliases(key, flags.counts) || checkAllAliases(key, flags.bools))) {
        o[key] = [o[key], value];
      } else {
        o[key] = value;
      }
    }
    function extendAliases(...args2) {
      args2.forEach(function(obj) {
        Object.keys(obj || {}).forEach(function(key) {
          if (flags.aliases[key])
            return;
          flags.aliases[key] = [].concat(aliases[key] || []);
          flags.aliases[key].concat(key).forEach(function(x) {
            if (/-/.test(x) && configuration["camel-case-expansion"]) {
              const c = camelCase(x);
              if (c !== key && flags.aliases[key].indexOf(c) === -1) {
                flags.aliases[key].push(c);
                newAliases[c] = true;
              }
            }
          });
          flags.aliases[key].concat(key).forEach(function(x) {
            if (x.length > 1 && /[A-Z]/.test(x) && configuration["camel-case-expansion"]) {
              const c = decamelize(x, "-");
              if (c !== key && flags.aliases[key].indexOf(c) === -1) {
                flags.aliases[key].push(c);
                newAliases[c] = true;
              }
            }
          });
          flags.aliases[key].forEach(function(x) {
            flags.aliases[x] = [key].concat(flags.aliases[key].filter(function(y) {
              return x !== y;
            }));
          });
        });
      });
    }
    function checkAllAliases(key, flag) {
      const toCheck = [].concat(flags.aliases[key] || [], key);
      const keys2 = Object.keys(flag);
      const setAlias = toCheck.find((key2) => keys2.includes(key2));
      return setAlias ? flag[setAlias] : false;
    }
    function hasAnyFlag(key) {
      const flagsKeys = Object.keys(flags);
      const toCheck = [].concat(flagsKeys.map((k) => flags[k]));
      return toCheck.some(function(flag) {
        return Array.isArray(flag) ? flag.includes(key) : flag[key];
      });
    }
    function hasFlagsMatching(arg, ...patterns) {
      const toCheck = [].concat(...patterns);
      return toCheck.some(function(pattern) {
        const match = arg.match(pattern);
        return match && hasAnyFlag(match[1]);
      });
    }
    function hasAllShortFlags(arg) {
      if (arg.match(negative) || !arg.match(/^-[^-]+/)) {
        return false;
      }
      let hasAllFlags = true;
      let next;
      const letters = arg.slice(1).split("");
      for (let j = 0; j < letters.length; j++) {
        next = arg.slice(j + 2);
        if (!hasAnyFlag(letters[j])) {
          hasAllFlags = false;
          break;
        }
        if (letters[j + 1] && letters[j + 1] === "=" || next === "-" || /[A-Za-z]/.test(letters[j]) && /^-?\d+(\.\d*)?(e-?\d+)?$/.test(next) || letters[j + 1] && letters[j + 1].match(/\W/)) {
          break;
        }
      }
      return hasAllFlags;
    }
    function isUnknownOptionAsArg(arg) {
      return configuration["unknown-options-as-args"] && isUnknownOption(arg);
    }
    function isUnknownOption(arg) {
      arg = arg.replace(/^-{3,}/, "--");
      if (arg.match(negative)) {
        return false;
      }
      if (hasAllShortFlags(arg)) {
        return false;
      }
      const flagWithEquals = /^-+([^=]+?)=[\s\S]*$/;
      const normalFlag = /^-+([^=]+?)$/;
      const flagEndingInHyphen = /^-+([^=]+?)-$/;
      const flagEndingInDigits = /^-+([^=]+?\d+)$/;
      const flagEndingInNonWordCharacters = /^-+([^=]+?)\W+.*$/;
      return !hasFlagsMatching(arg, flagWithEquals, negatedBoolean, normalFlag, flagEndingInHyphen, flagEndingInDigits, flagEndingInNonWordCharacters);
    }
    function defaultValue(key) {
      if (!checkAllAliases(key, flags.bools) && !checkAllAliases(key, flags.counts) && `${key}` in defaults3) {
        return defaults3[key];
      } else {
        return defaultForType(guessType2(key));
      }
    }
    function defaultForType(type) {
      const def = {
        [DefaultValuesForTypeKey.BOOLEAN]: true,
        [DefaultValuesForTypeKey.STRING]: "",
        [DefaultValuesForTypeKey.NUMBER]: void 0,
        [DefaultValuesForTypeKey.ARRAY]: []
      };
      return def[type];
    }
    function guessType2(key) {
      let type = DefaultValuesForTypeKey.BOOLEAN;
      if (checkAllAliases(key, flags.strings))
        type = DefaultValuesForTypeKey.STRING;
      else if (checkAllAliases(key, flags.numbers))
        type = DefaultValuesForTypeKey.NUMBER;
      else if (checkAllAliases(key, flags.bools))
        type = DefaultValuesForTypeKey.BOOLEAN;
      else if (checkAllAliases(key, flags.arrays))
        type = DefaultValuesForTypeKey.ARRAY;
      return type;
    }
    function isUndefined2(num) {
      return num === void 0;
    }
    function checkConfiguration() {
      Object.keys(flags.counts).find((key) => {
        if (checkAllAliases(key, flags.arrays)) {
          error = Error(__("Invalid configuration: %s, opts.count excludes opts.array.", key));
          return true;
        } else if (checkAllAliases(key, flags.nargs)) {
          error = Error(__("Invalid configuration: %s, opts.count excludes opts.narg.", key));
          return true;
        }
        return false;
      });
    }
    return {
      aliases: Object.assign({}, flags.aliases),
      argv: Object.assign(argvReturn, argv),
      configuration,
      defaulted: Object.assign({}, defaulted),
      error,
      newAliases: Object.assign({}, newAliases)
    };
  }
};
function combineAliases(aliases) {
  const aliasArrays = [];
  const combined = /* @__PURE__ */ Object.create(null);
  let change = true;
  Object.keys(aliases).forEach(function(key) {
    aliasArrays.push([].concat(aliases[key], key));
  });
  while (change) {
    change = false;
    for (let i = 0; i < aliasArrays.length; i++) {
      for (let ii = i + 1; ii < aliasArrays.length; ii++) {
        const intersect = aliasArrays[i].filter(function(v) {
          return aliasArrays[ii].indexOf(v) !== -1;
        });
        if (intersect.length) {
          aliasArrays[i] = aliasArrays[i].concat(aliasArrays[ii]);
          aliasArrays.splice(ii, 1);
          change = true;
          break;
        }
      }
    }
  }
  aliasArrays.forEach(function(aliasArray) {
    aliasArray = aliasArray.filter(function(v, i, self2) {
      return self2.indexOf(v) === i;
    });
    const lastAlias = aliasArray.pop();
    if (lastAlias !== void 0 && typeof lastAlias === "string") {
      combined[lastAlias] = aliasArray;
    }
  });
  return combined;
}
function increment(orig) {
  return orig !== void 0 ? orig + 1 : 1;
}
function sanitizeKey(key) {
  if (key === "__proto__")
    return "___proto___";
  return key;
}
function stripQuotes(val) {
  return typeof val === "string" && (val[0] === "'" || val[0] === '"') && val[val.length - 1] === val[0] ? val.substring(1, val.length - 1) : val;
}

// node_modules/yargs-parser/build/lib/index.js
var import_fs2 = require("fs");
var _a;
var _b;
var _c;
var minNodeVersion = process && process.env && process.env.YARGS_MIN_NODE_VERSION ? Number(process.env.YARGS_MIN_NODE_VERSION) : 12;
var nodeVersion = (_b = (_a = process === null || process === void 0 ? void 0 : process.versions) === null || _a === void 0 ? void 0 : _a.node) !== null && _b !== void 0 ? _b : (_c = process === null || process === void 0 ? void 0 : process.version) === null || _c === void 0 ? void 0 : _c.slice(1);
if (nodeVersion) {
  const major = Number(nodeVersion.match(/^([^.]+)/)[1]);
  if (major < minNodeVersion) {
    throw Error(`yargs parser supports a minimum Node.js version of ${minNodeVersion}. Read our version support policy: https://github.com/yargs/yargs-parser#supported-nodejs-versions`);
  }
}
var env = process ? process.env : {};
var parser = new YargsParser({
  cwd: process.cwd,
  env: () => {
    return env;
  },
  format: import_util.format,
  normalize: import_path2.normalize,
  resolve: import_path2.resolve,
  // TODO: figure  out a  way to combine ESM and CJS coverage, such  that
  // we can exercise all the lines below:
  require: (path3) => {
    if (typeof require !== "undefined") {
      return require(path3);
    } else if (path3.match(/\.json$/)) {
      return JSON.parse((0, import_fs2.readFileSync)(path3, "utf8"));
    } else {
      throw Error("only .json config files are supported in ESM");
    }
  }
});
var yargsParser = function Parser(args, opts) {
  const result = parser.parse(args.slice(), opts);
  return result.argv;
};
yargsParser.detailed = function(args, opts) {
  return parser.parse(args.slice(), opts);
};
yargsParser.camelCase = camelCase;
yargsParser.decamelize = decamelize;
yargsParser.looksLikeNumber = looksLikeNumber;
var lib_default = yargsParser;

// node_modules/yargs/lib/platform-shims/esm.mjs
var import_path4 = require("path");

// node_modules/yargs/build/lib/utils/process-argv.js
function getProcessArgvBinIndex() {
  if (isBundledElectronApp())
    return 0;
  return 1;
}
function isBundledElectronApp() {
  return isElectronApp() && !process.defaultApp;
}
function isElectronApp() {
  return !!process.versions.electron;
}
function getProcessArgvBin() {
  return process.argv[getProcessArgvBinIndex()];
}

// node_modules/yargs/build/lib/yerror.js
var YError = class _YError extends Error {
  constructor(msg) {
    super(msg || "yargs error");
    this.name = "YError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _YError);
    }
  }
};

// node_modules/y18n/build/lib/platform-shims/node.js
var import_fs3 = require("fs");
var import_util2 = require("util");
var import_path3 = require("path");
var node_default = {
  fs: {
    readFileSync: import_fs3.readFileSync,
    writeFile: import_fs3.writeFile
  },
  format: import_util2.format,
  resolve: import_path3.resolve,
  exists: (file) => {
    try {
      return (0, import_fs3.statSync)(file).isFile();
    } catch (err) {
      return false;
    }
  }
};

// node_modules/y18n/build/lib/index.js
var shim;
var Y18N = class {
  constructor(opts) {
    opts = opts || {};
    this.directory = opts.directory || "./locales";
    this.updateFiles = typeof opts.updateFiles === "boolean" ? opts.updateFiles : true;
    this.locale = opts.locale || "en";
    this.fallbackToLanguage = typeof opts.fallbackToLanguage === "boolean" ? opts.fallbackToLanguage : true;
    this.cache = /* @__PURE__ */ Object.create(null);
    this.writeQueue = [];
  }
  __(...args) {
    if (typeof arguments[0] !== "string") {
      return this._taggedLiteral(arguments[0], ...arguments);
    }
    const str = args.shift();
    let cb = function() {
    };
    if (typeof args[args.length - 1] === "function")
      cb = args.pop();
    cb = cb || function() {
    };
    if (!this.cache[this.locale])
      this._readLocaleFile();
    if (!this.cache[this.locale][str] && this.updateFiles) {
      this.cache[this.locale][str] = str;
      this._enqueueWrite({
        directory: this.directory,
        locale: this.locale,
        cb
      });
    } else {
      cb();
    }
    return shim.format.apply(shim.format, [this.cache[this.locale][str] || str].concat(args));
  }
  __n() {
    const args = Array.prototype.slice.call(arguments);
    const singular = args.shift();
    const plural = args.shift();
    const quantity = args.shift();
    let cb = function() {
    };
    if (typeof args[args.length - 1] === "function")
      cb = args.pop();
    if (!this.cache[this.locale])
      this._readLocaleFile();
    let str = quantity === 1 ? singular : plural;
    if (this.cache[this.locale][singular]) {
      const entry = this.cache[this.locale][singular];
      str = entry[quantity === 1 ? "one" : "other"];
    }
    if (!this.cache[this.locale][singular] && this.updateFiles) {
      this.cache[this.locale][singular] = {
        one: singular,
        other: plural
      };
      this._enqueueWrite({
        directory: this.directory,
        locale: this.locale,
        cb
      });
    } else {
      cb();
    }
    const values2 = [str];
    if (~str.indexOf("%d"))
      values2.push(quantity);
    return shim.format.apply(shim.format, values2.concat(args));
  }
  setLocale(locale) {
    this.locale = locale;
  }
  getLocale() {
    return this.locale;
  }
  updateLocale(obj) {
    if (!this.cache[this.locale])
      this._readLocaleFile();
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        this.cache[this.locale][key] = obj[key];
      }
    }
  }
  _taggedLiteral(parts, ...args) {
    let str = "";
    parts.forEach(function(part, i) {
      const arg = args[i + 1];
      str += part;
      if (typeof arg !== "undefined") {
        str += "%s";
      }
    });
    return this.__.apply(this, [str].concat([].slice.call(args, 1)));
  }
  _enqueueWrite(work) {
    this.writeQueue.push(work);
    if (this.writeQueue.length === 1)
      this._processWriteQueue();
  }
  _processWriteQueue() {
    const _this = this;
    const work = this.writeQueue[0];
    const directory = work.directory;
    const locale = work.locale;
    const cb = work.cb;
    const languageFile = this._resolveLocaleFile(directory, locale);
    const serializedLocale = JSON.stringify(this.cache[locale], null, 2);
    shim.fs.writeFile(languageFile, serializedLocale, "utf-8", function(err) {
      _this.writeQueue.shift();
      if (_this.writeQueue.length > 0)
        _this._processWriteQueue();
      cb(err);
    });
  }
  _readLocaleFile() {
    let localeLookup = {};
    const languageFile = this._resolveLocaleFile(this.directory, this.locale);
    try {
      if (shim.fs.readFileSync) {
        localeLookup = JSON.parse(shim.fs.readFileSync(languageFile, "utf-8"));
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        err.message = "syntax error in " + languageFile;
      }
      if (err.code === "ENOENT")
        localeLookup = {};
      else
        throw err;
    }
    this.cache[this.locale] = localeLookup;
  }
  _resolveLocaleFile(directory, locale) {
    let file = shim.resolve(directory, "./", locale + ".json");
    if (this.fallbackToLanguage && !this._fileExistsSync(file) && ~locale.lastIndexOf("_")) {
      const languageFile = shim.resolve(directory, "./", locale.split("_")[0] + ".json");
      if (this._fileExistsSync(languageFile))
        file = languageFile;
    }
    return file;
  }
  _fileExistsSync(file) {
    return shim.exists(file);
  }
};
function y18n(opts, _shim) {
  shim = _shim;
  const y18n3 = new Y18N(opts);
  return {
    __: y18n3.__.bind(y18n3),
    __n: y18n3.__n.bind(y18n3),
    setLocale: y18n3.setLocale.bind(y18n3),
    getLocale: y18n3.getLocale.bind(y18n3),
    updateLocale: y18n3.updateLocale.bind(y18n3),
    locale: y18n3.locale
  };
}

// node_modules/y18n/index.mjs
var y18n2 = (opts) => {
  return y18n(opts, node_default);
};
var y18n_default = y18n2;

// node_modules/yargs/lib/platform-shims/esm.mjs
var REQUIRE_ERROR = "require is not supported by ESM";
var REQUIRE_DIRECTORY_ERROR = "loading a directory of commands is not supported yet for ESM";
var __dirname;
try {
  __dirname = (0, import_url.fileURLToPath)(importMetaUrl);
} catch (e) {
  __dirname = process.cwd();
}
var mainFilename = __dirname.substring(0, __dirname.lastIndexOf("node_modules"));
var esm_default = {
  assert: {
    notStrictEqual: import_assert.notStrictEqual,
    strictEqual: import_assert.strictEqual
  },
  cliui: ui,
  findUp: sync_default,
  getEnv: (key) => {
    return process.env[key];
  },
  inspect: import_util3.inspect,
  getCallerFile: () => {
    throw new YError(REQUIRE_DIRECTORY_ERROR);
  },
  getProcessArgvBin,
  mainFilename: mainFilename || process.cwd(),
  Parser: lib_default,
  path: {
    basename: import_path4.basename,
    dirname: import_path4.dirname,
    extname: import_path4.extname,
    relative: import_path4.relative,
    resolve: import_path4.resolve
  },
  process: {
    argv: () => process.argv,
    cwd: process.cwd,
    emitWarning: (warning, type) => process.emitWarning(warning, type),
    execPath: () => process.execPath,
    exit: process.exit,
    nextTick: process.nextTick,
    stdColumns: typeof process.stdout.columns !== "undefined" ? process.stdout.columns : null
  },
  readFileSync: import_fs4.readFileSync,
  require: () => {
    throw new YError(REQUIRE_ERROR);
  },
  requireDirectory: () => {
    throw new YError(REQUIRE_DIRECTORY_ERROR);
  },
  stringWidth: (str) => {
    return [...str].length;
  },
  y18n: y18n_default({
    directory: (0, import_path4.resolve)(__dirname, "../../../locales"),
    updateFiles: false
  })
};

// node_modules/yargs/build/lib/typings/common-types.js
function assertNotStrictEqual(actual, expected, shim3, message) {
  shim3.assert.notStrictEqual(actual, expected, message);
}
function assertSingleKey(actual, shim3) {
  shim3.assert.strictEqual(typeof actual, "string");
}
function objectKeys(object) {
  return Object.keys(object);
}

// node_modules/yargs/build/lib/utils/is-promise.js
function isPromise(maybePromise) {
  return !!maybePromise && !!maybePromise.then && typeof maybePromise.then === "function";
}

// node_modules/yargs/build/lib/parse-command.js
function parseCommand(cmd) {
  const extraSpacesStrippedCommand = cmd.replace(/\s{2,}/g, " ");
  const splitCommand = extraSpacesStrippedCommand.split(/\s+(?![^[]*]|[^<]*>)/);
  const bregex = /\.*[\][<>]/g;
  const firstCommand = splitCommand.shift();
  if (!firstCommand)
    throw new Error(`No command found in: ${cmd}`);
  const parsedCommand = {
    cmd: firstCommand.replace(bregex, ""),
    demanded: [],
    optional: []
  };
  splitCommand.forEach((cmd2, i) => {
    let variadic = false;
    cmd2 = cmd2.replace(/\s/g, "");
    if (/\.+[\]>]/.test(cmd2) && i === splitCommand.length - 1)
      variadic = true;
    if (/^\[/.test(cmd2)) {
      parsedCommand.optional.push({
        cmd: cmd2.replace(bregex, "").split("|"),
        variadic
      });
    } else {
      parsedCommand.demanded.push({
        cmd: cmd2.replace(bregex, "").split("|"),
        variadic
      });
    }
  });
  return parsedCommand;
}

// node_modules/yargs/build/lib/argsert.js
var positionName = ["first", "second", "third", "fourth", "fifth", "sixth"];
function argsert(arg1, arg2, arg3) {
  function parseArgs() {
    return typeof arg1 === "object" ? [{ demanded: [], optional: [] }, arg1, arg2] : [
      parseCommand(`cmd ${arg1}`),
      arg2,
      arg3
    ];
  }
  try {
    let position2 = 0;
    const [parsed, callerArguments, _length] = parseArgs();
    const args = [].slice.call(callerArguments);
    while (args.length && args[args.length - 1] === void 0)
      args.pop();
    const length = _length || args.length;
    if (length < parsed.demanded.length) {
      throw new YError(`Not enough arguments provided. Expected ${parsed.demanded.length} but received ${args.length}.`);
    }
    const totalCommands = parsed.demanded.length + parsed.optional.length;
    if (length > totalCommands) {
      throw new YError(`Too many arguments provided. Expected max ${totalCommands} but received ${length}.`);
    }
    parsed.demanded.forEach((demanded) => {
      const arg = args.shift();
      const observedType = guessType(arg);
      const matchingTypes = demanded.cmd.filter((type) => type === observedType || type === "*");
      if (matchingTypes.length === 0)
        argumentTypeError(observedType, demanded.cmd, position2);
      position2 += 1;
    });
    parsed.optional.forEach((optional) => {
      if (args.length === 0)
        return;
      const arg = args.shift();
      const observedType = guessType(arg);
      const matchingTypes = optional.cmd.filter((type) => type === observedType || type === "*");
      if (matchingTypes.length === 0)
        argumentTypeError(observedType, optional.cmd, position2);
      position2 += 1;
    });
  } catch (err) {
    console.warn(err.stack);
  }
}
function guessType(arg) {
  if (Array.isArray(arg)) {
    return "array";
  } else if (arg === null) {
    return "null";
  }
  return typeof arg;
}
function argumentTypeError(observedType, allowedTypes, position2) {
  throw new YError(`Invalid ${positionName[position2] || "manyith"} argument. Expected ${allowedTypes.join(" or ")} but received ${observedType}.`);
}

// node_modules/yargs/build/lib/middleware.js
var GlobalMiddleware = class {
  constructor(yargs) {
    this.globalMiddleware = [];
    this.frozens = [];
    this.yargs = yargs;
  }
  addMiddleware(callback, applyBeforeValidation, global2 = true, mutates = false) {
    argsert("<array|function> [boolean] [boolean] [boolean]", [callback, applyBeforeValidation, global2], arguments.length);
    if (Array.isArray(callback)) {
      for (let i = 0; i < callback.length; i++) {
        if (typeof callback[i] !== "function") {
          throw Error("middleware must be a function");
        }
        const m = callback[i];
        m.applyBeforeValidation = applyBeforeValidation;
        m.global = global2;
      }
      Array.prototype.push.apply(this.globalMiddleware, callback);
    } else if (typeof callback === "function") {
      const m = callback;
      m.applyBeforeValidation = applyBeforeValidation;
      m.global = global2;
      m.mutates = mutates;
      this.globalMiddleware.push(callback);
    }
    return this.yargs;
  }
  addCoerceMiddleware(callback, option) {
    const aliases = this.yargs.getAliases();
    this.globalMiddleware = this.globalMiddleware.filter((m) => {
      const toCheck = [...aliases[option] || [], option];
      if (!m.option)
        return true;
      else
        return !toCheck.includes(m.option);
    });
    callback.option = option;
    return this.addMiddleware(callback, true, true, true);
  }
  getMiddleware() {
    return this.globalMiddleware;
  }
  freeze() {
    this.frozens.push([...this.globalMiddleware]);
  }
  unfreeze() {
    const frozen = this.frozens.pop();
    if (frozen !== void 0)
      this.globalMiddleware = frozen;
  }
  reset() {
    this.globalMiddleware = this.globalMiddleware.filter((m) => m.global);
  }
};
function commandMiddlewareFactory(commandMiddleware) {
  if (!commandMiddleware)
    return [];
  return commandMiddleware.map((middleware) => {
    middleware.applyBeforeValidation = false;
    return middleware;
  });
}
function applyMiddleware(argv, yargs, middlewares, beforeValidation) {
  return middlewares.reduce((acc, middleware) => {
    if (middleware.applyBeforeValidation !== beforeValidation) {
      return acc;
    }
    if (middleware.mutates) {
      if (middleware.applied)
        return acc;
      middleware.applied = true;
    }
    if (isPromise(acc)) {
      return acc.then((initialObj) => Promise.all([initialObj, middleware(initialObj, yargs)])).then(([initialObj, middlewareObj]) => Object.assign(initialObj, middlewareObj));
    } else {
      const result = middleware(acc, yargs);
      return isPromise(result) ? result.then((middlewareObj) => Object.assign(acc, middlewareObj)) : Object.assign(acc, result);
    }
  }, argv);
}

// node_modules/yargs/build/lib/utils/maybe-async-result.js
function maybeAsyncResult(getResult, resultHandler, errorHandler = (err) => {
  throw err;
}) {
  try {
    const result = isFunction(getResult) ? getResult() : getResult;
    return isPromise(result) ? result.then((result2) => resultHandler(result2)) : resultHandler(result);
  } catch (err) {
    return errorHandler(err);
  }
}
function isFunction(arg) {
  return typeof arg === "function";
}

// node_modules/yargs/build/lib/utils/which-module.js
function whichModule(exported) {
  if (typeof require === "undefined")
    return null;
  for (let i = 0, files = Object.keys(require.cache), mod; i < files.length; i++) {
    mod = require.cache[files[i]];
    if (mod.exports === exported)
      return mod;
  }
  return null;
}

// node_modules/yargs/build/lib/command.js
var DEFAULT_MARKER = /(^\*)|(^\$0)/;
var CommandInstance = class {
  constructor(usage2, validation2, globalMiddleware, shim3) {
    this.requireCache = /* @__PURE__ */ new Set();
    this.handlers = {};
    this.aliasMap = {};
    this.frozens = [];
    this.shim = shim3;
    this.usage = usage2;
    this.globalMiddleware = globalMiddleware;
    this.validation = validation2;
  }
  addDirectory(dir, req, callerFile, opts) {
    opts = opts || {};
    if (typeof opts.recurse !== "boolean")
      opts.recurse = false;
    if (!Array.isArray(opts.extensions))
      opts.extensions = ["js"];
    const parentVisit = typeof opts.visit === "function" ? opts.visit : (o) => o;
    opts.visit = (obj, joined, filename) => {
      const visited = parentVisit(obj, joined, filename);
      if (visited) {
        if (this.requireCache.has(joined))
          return visited;
        else
          this.requireCache.add(joined);
        this.addHandler(visited);
      }
      return visited;
    };
    this.shim.requireDirectory({ require: req, filename: callerFile }, dir, opts);
  }
  addHandler(cmd, description, builder, handler, commandMiddleware, deprecated) {
    let aliases = [];
    const middlewares = commandMiddlewareFactory(commandMiddleware);
    handler = handler || (() => {
    });
    if (Array.isArray(cmd)) {
      if (isCommandAndAliases(cmd)) {
        [cmd, ...aliases] = cmd;
      } else {
        for (const command2 of cmd) {
          this.addHandler(command2);
        }
      }
    } else if (isCommandHandlerDefinition(cmd)) {
      let command2 = Array.isArray(cmd.command) || typeof cmd.command === "string" ? cmd.command : this.moduleName(cmd);
      if (cmd.aliases)
        command2 = [].concat(command2).concat(cmd.aliases);
      this.addHandler(command2, this.extractDesc(cmd), cmd.builder, cmd.handler, cmd.middlewares, cmd.deprecated);
      return;
    } else if (isCommandBuilderDefinition(builder)) {
      this.addHandler([cmd].concat(aliases), description, builder.builder, builder.handler, builder.middlewares, builder.deprecated);
      return;
    }
    if (typeof cmd === "string") {
      const parsedCommand = parseCommand(cmd);
      aliases = aliases.map((alias) => parseCommand(alias).cmd);
      let isDefault = false;
      const parsedAliases = [parsedCommand.cmd].concat(aliases).filter((c) => {
        if (DEFAULT_MARKER.test(c)) {
          isDefault = true;
          return false;
        }
        return true;
      });
      if (parsedAliases.length === 0 && isDefault)
        parsedAliases.push("$0");
      if (isDefault) {
        parsedCommand.cmd = parsedAliases[0];
        aliases = parsedAliases.slice(1);
        cmd = cmd.replace(DEFAULT_MARKER, parsedCommand.cmd);
      }
      aliases.forEach((alias) => {
        this.aliasMap[alias] = parsedCommand.cmd;
      });
      if (description !== false) {
        this.usage.command(cmd, description, isDefault, aliases, deprecated);
      }
      this.handlers[parsedCommand.cmd] = {
        original: cmd,
        description,
        handler,
        builder: builder || {},
        middlewares,
        deprecated,
        demanded: parsedCommand.demanded,
        optional: parsedCommand.optional
      };
      if (isDefault)
        this.defaultCommand = this.handlers[parsedCommand.cmd];
    }
  }
  getCommandHandlers() {
    return this.handlers;
  }
  getCommands() {
    return Object.keys(this.handlers).concat(Object.keys(this.aliasMap));
  }
  hasDefaultCommand() {
    return !!this.defaultCommand;
  }
  runCommand(command2, yargs, parsed, commandIndex, helpOnly, helpOrVersionSet) {
    const commandHandler = this.handlers[command2] || this.handlers[this.aliasMap[command2]] || this.defaultCommand;
    const currentContext = yargs.getInternalMethods().getContext();
    const parentCommands = currentContext.commands.slice();
    const isDefaultCommand = !command2;
    if (command2) {
      currentContext.commands.push(command2);
      currentContext.fullCommands.push(commandHandler.original);
    }
    const builderResult = this.applyBuilderUpdateUsageAndParse(isDefaultCommand, commandHandler, yargs, parsed.aliases, parentCommands, commandIndex, helpOnly, helpOrVersionSet);
    return isPromise(builderResult) ? builderResult.then((result) => this.applyMiddlewareAndGetResult(isDefaultCommand, commandHandler, result.innerArgv, currentContext, helpOnly, result.aliases, yargs)) : this.applyMiddlewareAndGetResult(isDefaultCommand, commandHandler, builderResult.innerArgv, currentContext, helpOnly, builderResult.aliases, yargs);
  }
  applyBuilderUpdateUsageAndParse(isDefaultCommand, commandHandler, yargs, aliases, parentCommands, commandIndex, helpOnly, helpOrVersionSet) {
    const builder = commandHandler.builder;
    let innerYargs = yargs;
    if (isCommandBuilderCallback(builder)) {
      yargs.getInternalMethods().getUsageInstance().freeze();
      const builderOutput = builder(yargs.getInternalMethods().reset(aliases), helpOrVersionSet);
      if (isPromise(builderOutput)) {
        return builderOutput.then((output) => {
          innerYargs = isYargsInstance(output) ? output : yargs;
          return this.parseAndUpdateUsage(isDefaultCommand, commandHandler, innerYargs, parentCommands, commandIndex, helpOnly);
        });
      }
    } else if (isCommandBuilderOptionDefinitions(builder)) {
      yargs.getInternalMethods().getUsageInstance().freeze();
      innerYargs = yargs.getInternalMethods().reset(aliases);
      Object.keys(commandHandler.builder).forEach((key) => {
        innerYargs.option(key, builder[key]);
      });
    }
    return this.parseAndUpdateUsage(isDefaultCommand, commandHandler, innerYargs, parentCommands, commandIndex, helpOnly);
  }
  parseAndUpdateUsage(isDefaultCommand, commandHandler, innerYargs, parentCommands, commandIndex, helpOnly) {
    if (isDefaultCommand)
      innerYargs.getInternalMethods().getUsageInstance().unfreeze(true);
    if (this.shouldUpdateUsage(innerYargs)) {
      innerYargs.getInternalMethods().getUsageInstance().usage(this.usageFromParentCommandsCommandHandler(parentCommands, commandHandler), commandHandler.description);
    }
    const innerArgv = innerYargs.getInternalMethods().runYargsParserAndExecuteCommands(null, void 0, true, commandIndex, helpOnly);
    return isPromise(innerArgv) ? innerArgv.then((argv) => ({
      aliases: innerYargs.parsed.aliases,
      innerArgv: argv
    })) : {
      aliases: innerYargs.parsed.aliases,
      innerArgv
    };
  }
  shouldUpdateUsage(yargs) {
    return !yargs.getInternalMethods().getUsageInstance().getUsageDisabled() && yargs.getInternalMethods().getUsageInstance().getUsage().length === 0;
  }
  usageFromParentCommandsCommandHandler(parentCommands, commandHandler) {
    const c = DEFAULT_MARKER.test(commandHandler.original) ? commandHandler.original.replace(DEFAULT_MARKER, "").trim() : commandHandler.original;
    const pc = parentCommands.filter((c2) => {
      return !DEFAULT_MARKER.test(c2);
    });
    pc.push(c);
    return `$0 ${pc.join(" ")}`;
  }
  handleValidationAndGetResult(isDefaultCommand, commandHandler, innerArgv, currentContext, aliases, yargs, middlewares, positionalMap) {
    if (!yargs.getInternalMethods().getHasOutput()) {
      const validation2 = yargs.getInternalMethods().runValidation(aliases, positionalMap, yargs.parsed.error, isDefaultCommand);
      innerArgv = maybeAsyncResult(innerArgv, (result) => {
        validation2(result);
        return result;
      });
    }
    if (commandHandler.handler && !yargs.getInternalMethods().getHasOutput()) {
      yargs.getInternalMethods().setHasOutput();
      const populateDoubleDash = !!yargs.getOptions().configuration["populate--"];
      yargs.getInternalMethods().postProcess(innerArgv, populateDoubleDash, false, false);
      innerArgv = applyMiddleware(innerArgv, yargs, middlewares, false);
      innerArgv = maybeAsyncResult(innerArgv, (result) => {
        const handlerResult = commandHandler.handler(result);
        return isPromise(handlerResult) ? handlerResult.then(() => result) : result;
      });
      if (!isDefaultCommand) {
        yargs.getInternalMethods().getUsageInstance().cacheHelpMessage();
      }
      if (isPromise(innerArgv) && !yargs.getInternalMethods().hasParseCallback()) {
        innerArgv.catch((error) => {
          try {
            yargs.getInternalMethods().getUsageInstance().fail(null, error);
          } catch (_err) {
          }
        });
      }
    }
    if (!isDefaultCommand) {
      currentContext.commands.pop();
      currentContext.fullCommands.pop();
    }
    return innerArgv;
  }
  applyMiddlewareAndGetResult(isDefaultCommand, commandHandler, innerArgv, currentContext, helpOnly, aliases, yargs) {
    let positionalMap = {};
    if (helpOnly)
      return innerArgv;
    if (!yargs.getInternalMethods().getHasOutput()) {
      positionalMap = this.populatePositionals(commandHandler, innerArgv, currentContext, yargs);
    }
    const middlewares = this.globalMiddleware.getMiddleware().slice(0).concat(commandHandler.middlewares);
    const maybePromiseArgv = applyMiddleware(innerArgv, yargs, middlewares, true);
    return isPromise(maybePromiseArgv) ? maybePromiseArgv.then((resolvedInnerArgv) => this.handleValidationAndGetResult(isDefaultCommand, commandHandler, resolvedInnerArgv, currentContext, aliases, yargs, middlewares, positionalMap)) : this.handleValidationAndGetResult(isDefaultCommand, commandHandler, maybePromiseArgv, currentContext, aliases, yargs, middlewares, positionalMap);
  }
  populatePositionals(commandHandler, argv, context2, yargs) {
    argv._ = argv._.slice(context2.commands.length);
    const demanded = commandHandler.demanded.slice(0);
    const optional = commandHandler.optional.slice(0);
    const positionalMap = {};
    this.validation.positionalCount(demanded.length, argv._.length);
    while (demanded.length) {
      const demand = demanded.shift();
      this.populatePositional(demand, argv, positionalMap);
    }
    while (optional.length) {
      const maybe = optional.shift();
      this.populatePositional(maybe, argv, positionalMap);
    }
    argv._ = context2.commands.concat(argv._.map((a) => "" + a));
    this.postProcessPositionals(argv, positionalMap, this.cmdToParseOptions(commandHandler.original), yargs);
    return positionalMap;
  }
  populatePositional(positional, argv, positionalMap) {
    const cmd = positional.cmd[0];
    if (positional.variadic) {
      positionalMap[cmd] = argv._.splice(0).map(String);
    } else {
      if (argv._.length)
        positionalMap[cmd] = [String(argv._.shift())];
    }
  }
  cmdToParseOptions(cmdString) {
    const parseOptions = {
      array: [],
      default: {},
      alias: {},
      demand: {}
    };
    const parsed = parseCommand(cmdString);
    parsed.demanded.forEach((d) => {
      const [cmd, ...aliases] = d.cmd;
      if (d.variadic) {
        parseOptions.array.push(cmd);
        parseOptions.default[cmd] = [];
      }
      parseOptions.alias[cmd] = aliases;
      parseOptions.demand[cmd] = true;
    });
    parsed.optional.forEach((o) => {
      const [cmd, ...aliases] = o.cmd;
      if (o.variadic) {
        parseOptions.array.push(cmd);
        parseOptions.default[cmd] = [];
      }
      parseOptions.alias[cmd] = aliases;
    });
    return parseOptions;
  }
  postProcessPositionals(argv, positionalMap, parseOptions, yargs) {
    const options = Object.assign({}, yargs.getOptions());
    options.default = Object.assign(parseOptions.default, options.default);
    for (const key of Object.keys(parseOptions.alias)) {
      options.alias[key] = (options.alias[key] || []).concat(parseOptions.alias[key]);
    }
    options.array = options.array.concat(parseOptions.array);
    options.config = {};
    const unparsed = [];
    Object.keys(positionalMap).forEach((key) => {
      positionalMap[key].map((value) => {
        if (options.configuration["unknown-options-as-args"])
          options.key[key] = true;
        unparsed.push(`--${key}`);
        unparsed.push(value);
      });
    });
    if (!unparsed.length)
      return;
    const config = Object.assign({}, options.configuration, {
      "populate--": false
    });
    const parsed = this.shim.Parser.detailed(unparsed, Object.assign({}, options, {
      configuration: config
    }));
    if (parsed.error) {
      yargs.getInternalMethods().getUsageInstance().fail(parsed.error.message, parsed.error);
    } else {
      const positionalKeys = Object.keys(positionalMap);
      Object.keys(positionalMap).forEach((key) => {
        positionalKeys.push(...parsed.aliases[key]);
      });
      Object.keys(parsed.argv).forEach((key) => {
        if (positionalKeys.includes(key)) {
          if (!positionalMap[key])
            positionalMap[key] = parsed.argv[key];
          if (!this.isInConfigs(yargs, key) && !this.isDefaulted(yargs, key) && Object.prototype.hasOwnProperty.call(argv, key) && Object.prototype.hasOwnProperty.call(parsed.argv, key) && (Array.isArray(argv[key]) || Array.isArray(parsed.argv[key]))) {
            argv[key] = [].concat(argv[key], parsed.argv[key]);
          } else {
            argv[key] = parsed.argv[key];
          }
        }
      });
    }
  }
  isDefaulted(yargs, key) {
    const { default: defaults3 } = yargs.getOptions();
    return Object.prototype.hasOwnProperty.call(defaults3, key) || Object.prototype.hasOwnProperty.call(defaults3, this.shim.Parser.camelCase(key));
  }
  isInConfigs(yargs, key) {
    const { configObjects } = yargs.getOptions();
    return configObjects.some((c) => Object.prototype.hasOwnProperty.call(c, key)) || configObjects.some((c) => Object.prototype.hasOwnProperty.call(c, this.shim.Parser.camelCase(key)));
  }
  runDefaultBuilderOn(yargs) {
    if (!this.defaultCommand)
      return;
    if (this.shouldUpdateUsage(yargs)) {
      const commandString = DEFAULT_MARKER.test(this.defaultCommand.original) ? this.defaultCommand.original : this.defaultCommand.original.replace(/^[^[\]<>]*/, "$0 ");
      yargs.getInternalMethods().getUsageInstance().usage(commandString, this.defaultCommand.description);
    }
    const builder = this.defaultCommand.builder;
    if (isCommandBuilderCallback(builder)) {
      return builder(yargs, true);
    } else if (!isCommandBuilderDefinition(builder)) {
      Object.keys(builder).forEach((key) => {
        yargs.option(key, builder[key]);
      });
    }
    return void 0;
  }
  moduleName(obj) {
    const mod = whichModule(obj);
    if (!mod)
      throw new Error(`No command name given for module: ${this.shim.inspect(obj)}`);
    return this.commandFromFilename(mod.filename);
  }
  commandFromFilename(filename) {
    return this.shim.path.basename(filename, this.shim.path.extname(filename));
  }
  extractDesc({ describe, description, desc }) {
    for (const test of [describe, description, desc]) {
      if (typeof test === "string" || test === false)
        return test;
      assertNotStrictEqual(test, true, this.shim);
    }
    return false;
  }
  freeze() {
    this.frozens.push({
      handlers: this.handlers,
      aliasMap: this.aliasMap,
      defaultCommand: this.defaultCommand
    });
  }
  unfreeze() {
    const frozen = this.frozens.pop();
    assertNotStrictEqual(frozen, void 0, this.shim);
    ({
      handlers: this.handlers,
      aliasMap: this.aliasMap,
      defaultCommand: this.defaultCommand
    } = frozen);
  }
  reset() {
    this.handlers = {};
    this.aliasMap = {};
    this.defaultCommand = void 0;
    this.requireCache = /* @__PURE__ */ new Set();
    return this;
  }
};
function command(usage2, validation2, globalMiddleware, shim3) {
  return new CommandInstance(usage2, validation2, globalMiddleware, shim3);
}
function isCommandBuilderDefinition(builder) {
  return typeof builder === "object" && !!builder.builder && typeof builder.handler === "function";
}
function isCommandAndAliases(cmd) {
  return cmd.every((c) => typeof c === "string");
}
function isCommandBuilderCallback(builder) {
  return typeof builder === "function";
}
function isCommandBuilderOptionDefinitions(builder) {
  return typeof builder === "object";
}
function isCommandHandlerDefinition(cmd) {
  return typeof cmd === "object" && !Array.isArray(cmd);
}

// node_modules/yargs/build/lib/utils/obj-filter.js
function objFilter(original = {}, filter2 = () => true) {
  const obj = {};
  objectKeys(original).forEach((key) => {
    if (filter2(key, original[key])) {
      obj[key] = original[key];
    }
  });
  return obj;
}

// node_modules/yargs/build/lib/utils/set-blocking.js
function setBlocking(blocking) {
  if (typeof process === "undefined")
    return;
  [process.stdout, process.stderr].forEach((_stream) => {
    const stream = _stream;
    if (stream._handle && stream.isTTY && typeof stream._handle.setBlocking === "function") {
      stream._handle.setBlocking(blocking);
    }
  });
}

// node_modules/yargs/build/lib/usage.js
function isBoolean(fail) {
  return typeof fail === "boolean";
}
function usage(yargs, shim3) {
  const __ = shim3.y18n.__;
  const self2 = {};
  const fails = [];
  self2.failFn = function failFn(f) {
    fails.push(f);
  };
  let failMessage = null;
  let globalFailMessage = null;
  let showHelpOnFail = true;
  self2.showHelpOnFail = function showHelpOnFailFn(arg1 = true, arg2) {
    const [enabled, message] = typeof arg1 === "string" ? [true, arg1] : [arg1, arg2];
    if (yargs.getInternalMethods().isGlobalContext()) {
      globalFailMessage = message;
    }
    failMessage = message;
    showHelpOnFail = enabled;
    return self2;
  };
  let failureOutput = false;
  self2.fail = function fail(msg, err) {
    const logger = yargs.getInternalMethods().getLoggerInstance();
    if (fails.length) {
      for (let i = fails.length - 1; i >= 0; --i) {
        const fail2 = fails[i];
        if (isBoolean(fail2)) {
          if (err)
            throw err;
          else if (msg)
            throw Error(msg);
        } else {
          fail2(msg, err, self2);
        }
      }
    } else {
      if (yargs.getExitProcess())
        setBlocking(true);
      if (!failureOutput) {
        failureOutput = true;
        if (showHelpOnFail) {
          yargs.showHelp("error");
          logger.error();
        }
        if (msg || err)
          logger.error(msg || err);
        const globalOrCommandFailMessage = failMessage || globalFailMessage;
        if (globalOrCommandFailMessage) {
          if (msg || err)
            logger.error("");
          logger.error(globalOrCommandFailMessage);
        }
      }
      err = err || new YError(msg);
      if (yargs.getExitProcess()) {
        return yargs.exit(1);
      } else if (yargs.getInternalMethods().hasParseCallback()) {
        return yargs.exit(1, err);
      } else {
        throw err;
      }
    }
  };
  let usages = [];
  let usageDisabled = false;
  self2.usage = (msg, description) => {
    if (msg === null) {
      usageDisabled = true;
      usages = [];
      return self2;
    }
    usageDisabled = false;
    usages.push([msg, description || ""]);
    return self2;
  };
  self2.getUsage = () => {
    return usages;
  };
  self2.getUsageDisabled = () => {
    return usageDisabled;
  };
  self2.getPositionalGroupName = () => {
    return __("Positionals:");
  };
  let examples = [];
  self2.example = (cmd, description) => {
    examples.push([cmd, description || ""]);
  };
  let commands = [];
  self2.command = function command2(cmd, description, isDefault, aliases, deprecated = false) {
    if (isDefault) {
      commands = commands.map((cmdArray) => {
        cmdArray[2] = false;
        return cmdArray;
      });
    }
    commands.push([cmd, description || "", isDefault, aliases, deprecated]);
  };
  self2.getCommands = () => commands;
  let descriptions = {};
  self2.describe = function describe(keyOrKeys, desc) {
    if (Array.isArray(keyOrKeys)) {
      keyOrKeys.forEach((k) => {
        self2.describe(k, desc);
      });
    } else if (typeof keyOrKeys === "object") {
      Object.keys(keyOrKeys).forEach((k) => {
        self2.describe(k, keyOrKeys[k]);
      });
    } else {
      descriptions[keyOrKeys] = desc;
    }
  };
  self2.getDescriptions = () => descriptions;
  let epilogs = [];
  self2.epilog = (msg) => {
    epilogs.push(msg);
  };
  let wrapSet = false;
  let wrap3;
  self2.wrap = (cols) => {
    wrapSet = true;
    wrap3 = cols;
  };
  self2.getWrap = () => {
    if (shim3.getEnv("YARGS_DISABLE_WRAP")) {
      return null;
    }
    if (!wrapSet) {
      wrap3 = windowWidth();
      wrapSet = true;
    }
    return wrap3;
  };
  const deferY18nLookupPrefix = "__yargsString__:";
  self2.deferY18nLookup = (str) => deferY18nLookupPrefix + str;
  self2.help = function help() {
    if (cachedHelpMessage)
      return cachedHelpMessage;
    normalizeAliases();
    const base$0 = yargs.customScriptName ? yargs.$0 : shim3.path.basename(yargs.$0);
    const demandedOptions = yargs.getDemandedOptions();
    const demandedCommands = yargs.getDemandedCommands();
    const deprecatedOptions = yargs.getDeprecatedOptions();
    const groups = yargs.getGroups();
    const options = yargs.getOptions();
    let keys2 = [];
    keys2 = keys2.concat(Object.keys(descriptions));
    keys2 = keys2.concat(Object.keys(demandedOptions));
    keys2 = keys2.concat(Object.keys(demandedCommands));
    keys2 = keys2.concat(Object.keys(options.default));
    keys2 = keys2.filter(filterHiddenOptions);
    keys2 = Object.keys(keys2.reduce((acc, key) => {
      if (key !== "_")
        acc[key] = true;
      return acc;
    }, {}));
    const theWrap = self2.getWrap();
    const ui2 = shim3.cliui({
      width: theWrap,
      wrap: !!theWrap
    });
    if (!usageDisabled) {
      if (usages.length) {
        usages.forEach((usage2) => {
          ui2.div({ text: `${usage2[0].replace(/\$0/g, base$0)}` });
          if (usage2[1]) {
            ui2.div({ text: `${usage2[1]}`, padding: [1, 0, 0, 0] });
          }
        });
        ui2.div();
      } else if (commands.length) {
        let u = null;
        if (demandedCommands._) {
          u = `${base$0} <${__("command")}>
`;
        } else {
          u = `${base$0} [${__("command")}]
`;
        }
        ui2.div(`${u}`);
      }
    }
    if (commands.length > 1 || commands.length === 1 && !commands[0][2]) {
      ui2.div(__("Commands:"));
      const context2 = yargs.getInternalMethods().getContext();
      const parentCommands = context2.commands.length ? `${context2.commands.join(" ")} ` : "";
      if (yargs.getInternalMethods().getParserConfiguration()["sort-commands"] === true) {
        commands = commands.sort((a, b) => a[0].localeCompare(b[0]));
      }
      const prefix = base$0 ? `${base$0} ` : "";
      commands.forEach((command2) => {
        const commandString = `${prefix}${parentCommands}${command2[0].replace(/^\$0 ?/, "")}`;
        ui2.span({
          text: commandString,
          padding: [0, 2, 0, 2],
          width: maxWidth(commands, theWrap, `${base$0}${parentCommands}`) + 4
        }, { text: command2[1] });
        const hints = [];
        if (command2[2])
          hints.push(`[${__("default")}]`);
        if (command2[3] && command2[3].length) {
          hints.push(`[${__("aliases:")} ${command2[3].join(", ")}]`);
        }
        if (command2[4]) {
          if (typeof command2[4] === "string") {
            hints.push(`[${__("deprecated: %s", command2[4])}]`);
          } else {
            hints.push(`[${__("deprecated")}]`);
          }
        }
        if (hints.length) {
          ui2.div({
            text: hints.join(" "),
            padding: [0, 0, 0, 2],
            align: "right"
          });
        } else {
          ui2.div();
        }
      });
      ui2.div();
    }
    const aliasKeys = (Object.keys(options.alias) || []).concat(Object.keys(yargs.parsed.newAliases) || []);
    keys2 = keys2.filter((key) => !yargs.parsed.newAliases[key] && aliasKeys.every((alias) => (options.alias[alias] || []).indexOf(key) === -1));
    const defaultGroup = __("Options:");
    if (!groups[defaultGroup])
      groups[defaultGroup] = [];
    addUngroupedKeys(keys2, options.alias, groups, defaultGroup);
    const isLongSwitch = (sw) => /^--/.test(getText(sw));
    const displayedGroups = Object.keys(groups).filter((groupName) => groups[groupName].length > 0).map((groupName) => {
      const normalizedKeys = groups[groupName].filter(filterHiddenOptions).map((key) => {
        if (aliasKeys.includes(key))
          return key;
        for (let i = 0, aliasKey; (aliasKey = aliasKeys[i]) !== void 0; i++) {
          if ((options.alias[aliasKey] || []).includes(key))
            return aliasKey;
        }
        return key;
      });
      return { groupName, normalizedKeys };
    }).filter(({ normalizedKeys }) => normalizedKeys.length > 0).map(({ groupName, normalizedKeys }) => {
      const switches = normalizedKeys.reduce((acc, key) => {
        acc[key] = [key].concat(options.alias[key] || []).map((sw) => {
          if (groupName === self2.getPositionalGroupName())
            return sw;
          else {
            return (/^[0-9]$/.test(sw) ? options.boolean.includes(key) ? "-" : "--" : sw.length > 1 ? "--" : "-") + sw;
          }
        }).sort((sw1, sw2) => isLongSwitch(sw1) === isLongSwitch(sw2) ? 0 : isLongSwitch(sw1) ? 1 : -1).join(", ");
        return acc;
      }, {});
      return { groupName, normalizedKeys, switches };
    });
    const shortSwitchesUsed = displayedGroups.filter(({ groupName }) => groupName !== self2.getPositionalGroupName()).some(({ normalizedKeys, switches }) => !normalizedKeys.every((key) => isLongSwitch(switches[key])));
    if (shortSwitchesUsed) {
      displayedGroups.filter(({ groupName }) => groupName !== self2.getPositionalGroupName()).forEach(({ normalizedKeys, switches }) => {
        normalizedKeys.forEach((key) => {
          if (isLongSwitch(switches[key])) {
            switches[key] = addIndentation(switches[key], "-x, ".length);
          }
        });
      });
    }
    displayedGroups.forEach(({ groupName, normalizedKeys, switches }) => {
      ui2.div(groupName);
      normalizedKeys.forEach((key) => {
        const kswitch = switches[key];
        let desc = descriptions[key] || "";
        let type = null;
        if (desc.includes(deferY18nLookupPrefix))
          desc = __(desc.substring(deferY18nLookupPrefix.length));
        if (options.boolean.includes(key))
          type = `[${__("boolean")}]`;
        if (options.count.includes(key))
          type = `[${__("count")}]`;
        if (options.string.includes(key))
          type = `[${__("string")}]`;
        if (options.normalize.includes(key))
          type = `[${__("string")}]`;
        if (options.array.includes(key))
          type = `[${__("array")}]`;
        if (options.number.includes(key))
          type = `[${__("number")}]`;
        const deprecatedExtra = (deprecated) => typeof deprecated === "string" ? `[${__("deprecated: %s", deprecated)}]` : `[${__("deprecated")}]`;
        const extra = [
          key in deprecatedOptions ? deprecatedExtra(deprecatedOptions[key]) : null,
          type,
          key in demandedOptions ? `[${__("required")}]` : null,
          options.choices && options.choices[key] ? `[${__("choices:")} ${self2.stringifiedValues(options.choices[key])}]` : null,
          defaultString(options.default[key], options.defaultDescription[key])
        ].filter(Boolean).join(" ");
        ui2.span({
          text: getText(kswitch),
          padding: [0, 2, 0, 2 + getIndentation(kswitch)],
          width: maxWidth(switches, theWrap) + 4
        }, desc);
        const shouldHideOptionExtras = yargs.getInternalMethods().getUsageConfiguration()["hide-types"] === true;
        if (extra && !shouldHideOptionExtras)
          ui2.div({ text: extra, padding: [0, 0, 0, 2], align: "right" });
        else
          ui2.div();
      });
      ui2.div();
    });
    if (examples.length) {
      ui2.div(__("Examples:"));
      examples.forEach((example) => {
        example[0] = example[0].replace(/\$0/g, base$0);
      });
      examples.forEach((example) => {
        if (example[1] === "") {
          ui2.div({
            text: example[0],
            padding: [0, 2, 0, 2]
          });
        } else {
          ui2.div({
            text: example[0],
            padding: [0, 2, 0, 2],
            width: maxWidth(examples, theWrap) + 4
          }, {
            text: example[1]
          });
        }
      });
      ui2.div();
    }
    if (epilogs.length > 0) {
      const e = epilogs.map((epilog) => epilog.replace(/\$0/g, base$0)).join("\n");
      ui2.div(`${e}
`);
    }
    return ui2.toString().replace(/\s*$/, "");
  };
  function maxWidth(table2, theWrap, modifier) {
    let width = 0;
    if (!Array.isArray(table2)) {
      table2 = Object.values(table2).map((v) => [v]);
    }
    table2.forEach((v) => {
      width = Math.max(shim3.stringWidth(modifier ? `${modifier} ${getText(v[0])}` : getText(v[0])) + getIndentation(v[0]), width);
    });
    if (theWrap)
      width = Math.min(width, parseInt((theWrap * 0.5).toString(), 10));
    return width;
  }
  function normalizeAliases() {
    const demandedOptions = yargs.getDemandedOptions();
    const options = yargs.getOptions();
    (Object.keys(options.alias) || []).forEach((key) => {
      options.alias[key].forEach((alias) => {
        if (descriptions[alias])
          self2.describe(key, descriptions[alias]);
        if (alias in demandedOptions)
          yargs.demandOption(key, demandedOptions[alias]);
        if (options.boolean.includes(alias))
          yargs.boolean(key);
        if (options.count.includes(alias))
          yargs.count(key);
        if (options.string.includes(alias))
          yargs.string(key);
        if (options.normalize.includes(alias))
          yargs.normalize(key);
        if (options.array.includes(alias))
          yargs.array(key);
        if (options.number.includes(alias))
          yargs.number(key);
      });
    });
  }
  let cachedHelpMessage;
  self2.cacheHelpMessage = function() {
    cachedHelpMessage = this.help();
  };
  self2.clearCachedHelpMessage = function() {
    cachedHelpMessage = void 0;
  };
  self2.hasCachedHelpMessage = function() {
    return !!cachedHelpMessage;
  };
  function addUngroupedKeys(keys2, aliases, groups, defaultGroup) {
    let groupedKeys = [];
    let toCheck = null;
    Object.keys(groups).forEach((group) => {
      groupedKeys = groupedKeys.concat(groups[group]);
    });
    keys2.forEach((key) => {
      toCheck = [key].concat(aliases[key]);
      if (!toCheck.some((k) => groupedKeys.indexOf(k) !== -1)) {
        groups[defaultGroup].push(key);
      }
    });
    return groupedKeys;
  }
  function filterHiddenOptions(key) {
    return yargs.getOptions().hiddenOptions.indexOf(key) < 0 || yargs.parsed.argv[yargs.getOptions().showHiddenOpt];
  }
  self2.showHelp = (level) => {
    const logger = yargs.getInternalMethods().getLoggerInstance();
    if (!level)
      level = "error";
    const emit2 = typeof level === "function" ? level : logger[level];
    emit2(self2.help());
  };
  self2.functionDescription = (fn) => {
    const description = fn.name ? shim3.Parser.decamelize(fn.name, "-") : __("generated-value");
    return ["(", description, ")"].join("");
  };
  self2.stringifiedValues = function stringifiedValues(values2, separator) {
    let string = "";
    const sep = separator || ", ";
    const array = [].concat(values2);
    if (!values2 || !array.length)
      return string;
    array.forEach((value) => {
      if (string.length)
        string += sep;
      string += JSON.stringify(value);
    });
    return string;
  };
  function defaultString(value, defaultDescription) {
    let string = `[${__("default:")} `;
    if (value === void 0 && !defaultDescription)
      return null;
    if (defaultDescription) {
      string += defaultDescription;
    } else {
      switch (typeof value) {
        case "string":
          string += `"${value}"`;
          break;
        case "object":
          string += JSON.stringify(value);
          break;
        default:
          string += value;
      }
    }
    return `${string}]`;
  }
  function windowWidth() {
    const maxWidth2 = 80;
    if (shim3.process.stdColumns) {
      return Math.min(maxWidth2, shim3.process.stdColumns);
    } else {
      return maxWidth2;
    }
  }
  let version = null;
  self2.version = (ver) => {
    version = ver;
  };
  self2.showVersion = (level) => {
    const logger = yargs.getInternalMethods().getLoggerInstance();
    if (!level)
      level = "error";
    const emit2 = typeof level === "function" ? level : logger[level];
    emit2(version);
  };
  self2.reset = function reset(localLookup) {
    failMessage = null;
    failureOutput = false;
    usages = [];
    usageDisabled = false;
    epilogs = [];
    examples = [];
    commands = [];
    descriptions = objFilter(descriptions, (k) => !localLookup[k]);
    return self2;
  };
  const frozens = [];
  self2.freeze = function freeze() {
    frozens.push({
      failMessage,
      failureOutput,
      usages,
      usageDisabled,
      epilogs,
      examples,
      commands,
      descriptions
    });
  };
  self2.unfreeze = function unfreeze(defaultCommand = false) {
    const frozen = frozens.pop();
    if (!frozen)
      return;
    if (defaultCommand) {
      descriptions = { ...frozen.descriptions, ...descriptions };
      commands = [...frozen.commands, ...commands];
      usages = [...frozen.usages, ...usages];
      examples = [...frozen.examples, ...examples];
      epilogs = [...frozen.epilogs, ...epilogs];
    } else {
      ({
        failMessage,
        failureOutput,
        usages,
        usageDisabled,
        epilogs,
        examples,
        commands,
        descriptions
      } = frozen);
    }
  };
  return self2;
}
function isIndentedText(text) {
  return typeof text === "object";
}
function addIndentation(text, indent) {
  return isIndentedText(text) ? { text: text.text, indentation: text.indentation + indent } : { text, indentation: indent };
}
function getIndentation(text) {
  return isIndentedText(text) ? text.indentation : 0;
}
function getText(text) {
  return isIndentedText(text) ? text.text : text;
}

// node_modules/yargs/build/lib/completion-templates.js
var completionShTemplate = `###-begin-{{app_name}}-completions-###
#
# yargs command completion script
#
# Installation: {{app_path}} {{completion_command}} >> ~/.bashrc
#    or {{app_path}} {{completion_command}} >> ~/.bash_profile on OSX.
#
_{{app_name}}_yargs_completions()
{
    local cur_word args type_list

    cur_word="\${COMP_WORDS[COMP_CWORD]}"
    args=("\${COMP_WORDS[@]}")

    # ask yargs to generate completions.
    type_list=$({{app_path}} --get-yargs-completions "\${args[@]}")

    COMPREPLY=( $(compgen -W "\${type_list}" -- \${cur_word}) )

    # if no match was found, fall back to filename completion
    if [ \${#COMPREPLY[@]} -eq 0 ]; then
      COMPREPLY=()
    fi

    return 0
}
complete -o bashdefault -o default -F _{{app_name}}_yargs_completions {{app_name}}
###-end-{{app_name}}-completions-###
`;
var completionZshTemplate = `#compdef {{app_name}}
###-begin-{{app_name}}-completions-###
#
# yargs command completion script
#
# Installation: {{app_path}} {{completion_command}} >> ~/.zshrc
#    or {{app_path}} {{completion_command}} >> ~/.zprofile on OSX.
#
_{{app_name}}_yargs_completions()
{
  local reply
  local si=$IFS
  IFS=$'
' reply=($(COMP_CWORD="$((CURRENT-1))" COMP_LINE="$BUFFER" COMP_POINT="$CURSOR" {{app_path}} --get-yargs-completions "\${words[@]}"))
  IFS=$si
  _describe 'values' reply
}
compdef _{{app_name}}_yargs_completions {{app_name}}
###-end-{{app_name}}-completions-###
`;

// node_modules/yargs/build/lib/completion.js
var Completion = class {
  constructor(yargs, usage2, command2, shim3) {
    var _a2, _b2, _c2;
    this.yargs = yargs;
    this.usage = usage2;
    this.command = command2;
    this.shim = shim3;
    this.completionKey = "get-yargs-completions";
    this.aliases = null;
    this.customCompletionFunction = null;
    this.indexAfterLastReset = 0;
    this.zshShell = (_c2 = ((_a2 = this.shim.getEnv("SHELL")) === null || _a2 === void 0 ? void 0 : _a2.includes("zsh")) || ((_b2 = this.shim.getEnv("ZSH_NAME")) === null || _b2 === void 0 ? void 0 : _b2.includes("zsh"))) !== null && _c2 !== void 0 ? _c2 : false;
  }
  defaultCompletion(args, argv, current, done) {
    const handlers = this.command.getCommandHandlers();
    for (let i = 0, ii = args.length; i < ii; ++i) {
      if (handlers[args[i]] && handlers[args[i]].builder) {
        const builder = handlers[args[i]].builder;
        if (isCommandBuilderCallback(builder)) {
          this.indexAfterLastReset = i + 1;
          const y = this.yargs.getInternalMethods().reset();
          builder(y, true);
          return y.argv;
        }
      }
    }
    const completions = [];
    this.commandCompletions(completions, args, current);
    this.optionCompletions(completions, args, argv, current);
    this.choicesFromOptionsCompletions(completions, args, argv, current);
    this.choicesFromPositionalsCompletions(completions, args, argv, current);
    done(null, completions);
  }
  commandCompletions(completions, args, current) {
    const parentCommands = this.yargs.getInternalMethods().getContext().commands;
    if (!current.match(/^-/) && parentCommands[parentCommands.length - 1] !== current && !this.previousArgHasChoices(args)) {
      this.usage.getCommands().forEach((usageCommand) => {
        const commandName = parseCommand(usageCommand[0]).cmd;
        if (args.indexOf(commandName) === -1) {
          if (!this.zshShell) {
            completions.push(commandName);
          } else {
            const desc = usageCommand[1] || "";
            completions.push(commandName.replace(/:/g, "\\:") + ":" + desc);
          }
        }
      });
    }
  }
  optionCompletions(completions, args, argv, current) {
    if ((current.match(/^-/) || current === "" && completions.length === 0) && !this.previousArgHasChoices(args)) {
      const options = this.yargs.getOptions();
      const positionalKeys = this.yargs.getGroups()[this.usage.getPositionalGroupName()] || [];
      Object.keys(options.key).forEach((key) => {
        const negable = !!options.configuration["boolean-negation"] && options.boolean.includes(key);
        const isPositionalKey = positionalKeys.includes(key);
        if (!isPositionalKey && !options.hiddenOptions.includes(key) && !this.argsContainKey(args, key, negable)) {
          this.completeOptionKey(key, completions, current, negable && !!options.default[key]);
        }
      });
    }
  }
  choicesFromOptionsCompletions(completions, args, argv, current) {
    if (this.previousArgHasChoices(args)) {
      const choices = this.getPreviousArgChoices(args);
      if (choices && choices.length > 0) {
        completions.push(...choices.map((c) => c.replace(/:/g, "\\:")));
      }
    }
  }
  choicesFromPositionalsCompletions(completions, args, argv, current) {
    if (current === "" && completions.length > 0 && this.previousArgHasChoices(args)) {
      return;
    }
    const positionalKeys = this.yargs.getGroups()[this.usage.getPositionalGroupName()] || [];
    const offset = Math.max(this.indexAfterLastReset, this.yargs.getInternalMethods().getContext().commands.length + 1);
    const positionalKey = positionalKeys[argv._.length - offset - 1];
    if (!positionalKey) {
      return;
    }
    const choices = this.yargs.getOptions().choices[positionalKey] || [];
    for (const choice of choices) {
      if (choice.startsWith(current)) {
        completions.push(choice.replace(/:/g, "\\:"));
      }
    }
  }
  getPreviousArgChoices(args) {
    if (args.length < 1)
      return;
    let previousArg = args[args.length - 1];
    let filter2 = "";
    if (!previousArg.startsWith("-") && args.length > 1) {
      filter2 = previousArg;
      previousArg = args[args.length - 2];
    }
    if (!previousArg.startsWith("-"))
      return;
    const previousArgKey = previousArg.replace(/^-+/, "");
    const options = this.yargs.getOptions();
    const possibleAliases = [
      previousArgKey,
      ...this.yargs.getAliases()[previousArgKey] || []
    ];
    let choices;
    for (const possibleAlias of possibleAliases) {
      if (Object.prototype.hasOwnProperty.call(options.key, possibleAlias) && Array.isArray(options.choices[possibleAlias])) {
        choices = options.choices[possibleAlias];
        break;
      }
    }
    if (choices) {
      return choices.filter((choice) => !filter2 || choice.startsWith(filter2));
    }
  }
  previousArgHasChoices(args) {
    const choices = this.getPreviousArgChoices(args);
    return choices !== void 0 && choices.length > 0;
  }
  argsContainKey(args, key, negable) {
    const argsContains = (s) => args.indexOf((/^[^0-9]$/.test(s) ? "-" : "--") + s) !== -1;
    if (argsContains(key))
      return true;
    if (negable && argsContains(`no-${key}`))
      return true;
    if (this.aliases) {
      for (const alias of this.aliases[key]) {
        if (argsContains(alias))
          return true;
      }
    }
    return false;
  }
  completeOptionKey(key, completions, current, negable) {
    var _a2, _b2, _c2, _d;
    let keyWithDesc = key;
    if (this.zshShell) {
      const descs = this.usage.getDescriptions();
      const aliasKey = (_b2 = (_a2 = this === null || this === void 0 ? void 0 : this.aliases) === null || _a2 === void 0 ? void 0 : _a2[key]) === null || _b2 === void 0 ? void 0 : _b2.find((alias) => {
        const desc2 = descs[alias];
        return typeof desc2 === "string" && desc2.length > 0;
      });
      const descFromAlias = aliasKey ? descs[aliasKey] : void 0;
      const desc = (_d = (_c2 = descs[key]) !== null && _c2 !== void 0 ? _c2 : descFromAlias) !== null && _d !== void 0 ? _d : "";
      keyWithDesc = `${key.replace(/:/g, "\\:")}:${desc.replace("__yargsString__:", "").replace(/(\r\n|\n|\r)/gm, " ")}`;
    }
    const startsByTwoDashes = (s) => /^--/.test(s);
    const isShortOption = (s) => /^[^0-9]$/.test(s);
    const dashes = !startsByTwoDashes(current) && isShortOption(key) ? "-" : "--";
    completions.push(dashes + keyWithDesc);
    if (negable) {
      completions.push(dashes + "no-" + keyWithDesc);
    }
  }
  customCompletion(args, argv, current, done) {
    assertNotStrictEqual(this.customCompletionFunction, null, this.shim);
    if (isSyncCompletionFunction(this.customCompletionFunction)) {
      const result = this.customCompletionFunction(current, argv);
      if (isPromise(result)) {
        return result.then((list) => {
          this.shim.process.nextTick(() => {
            done(null, list);
          });
        }).catch((err) => {
          this.shim.process.nextTick(() => {
            done(err, void 0);
          });
        });
      }
      return done(null, result);
    } else if (isFallbackCompletionFunction(this.customCompletionFunction)) {
      return this.customCompletionFunction(current, argv, (onCompleted = done) => this.defaultCompletion(args, argv, current, onCompleted), (completions) => {
        done(null, completions);
      });
    } else {
      return this.customCompletionFunction(current, argv, (completions) => {
        done(null, completions);
      });
    }
  }
  getCompletion(args, done) {
    const current = args.length ? args[args.length - 1] : "";
    const argv = this.yargs.parse(args, true);
    const completionFunction = this.customCompletionFunction ? (argv2) => this.customCompletion(args, argv2, current, done) : (argv2) => this.defaultCompletion(args, argv2, current, done);
    return isPromise(argv) ? argv.then(completionFunction) : completionFunction(argv);
  }
  generateCompletionScript($0, cmd) {
    let script = this.zshShell ? completionZshTemplate : completionShTemplate;
    const name = this.shim.path.basename($0);
    if ($0.match(/\.js$/))
      $0 = `./${$0}`;
    script = script.replace(/{{app_name}}/g, name);
    script = script.replace(/{{completion_command}}/g, cmd);
    return script.replace(/{{app_path}}/g, $0);
  }
  registerFunction(fn) {
    this.customCompletionFunction = fn;
  }
  setParsed(parsed) {
    this.aliases = parsed.aliases;
  }
};
function completion(yargs, usage2, command2, shim3) {
  return new Completion(yargs, usage2, command2, shim3);
}
function isSyncCompletionFunction(completionFunction) {
  return completionFunction.length < 3;
}
function isFallbackCompletionFunction(completionFunction) {
  return completionFunction.length > 3;
}

// node_modules/yargs/build/lib/utils/levenshtein.js
function levenshtein(a, b) {
  if (a.length === 0)
    return b.length;
  if (b.length === 0)
    return a.length;
  const matrix = [];
  let i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  let j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        if (i > 1 && j > 1 && b.charAt(i - 2) === a.charAt(j - 1) && b.charAt(i - 1) === a.charAt(j - 2)) {
          matrix[i][j] = matrix[i - 2][j - 2] + 1;
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
        }
      }
    }
  }
  return matrix[b.length][a.length];
}

// node_modules/yargs/build/lib/validation.js
var specialKeys = ["$0", "--", "_"];
function validation(yargs, usage2, shim3) {
  const __ = shim3.y18n.__;
  const __n = shim3.y18n.__n;
  const self2 = {};
  self2.nonOptionCount = function nonOptionCount(argv) {
    const demandedCommands = yargs.getDemandedCommands();
    const positionalCount = argv._.length + (argv["--"] ? argv["--"].length : 0);
    const _s = positionalCount - yargs.getInternalMethods().getContext().commands.length;
    if (demandedCommands._ && (_s < demandedCommands._.min || _s > demandedCommands._.max)) {
      if (_s < demandedCommands._.min) {
        if (demandedCommands._.minMsg !== void 0) {
          usage2.fail(demandedCommands._.minMsg ? demandedCommands._.minMsg.replace(/\$0/g, _s.toString()).replace(/\$1/, demandedCommands._.min.toString()) : null);
        } else {
          usage2.fail(__n("Not enough non-option arguments: got %s, need at least %s", "Not enough non-option arguments: got %s, need at least %s", _s, _s.toString(), demandedCommands._.min.toString()));
        }
      } else if (_s > demandedCommands._.max) {
        if (demandedCommands._.maxMsg !== void 0) {
          usage2.fail(demandedCommands._.maxMsg ? demandedCommands._.maxMsg.replace(/\$0/g, _s.toString()).replace(/\$1/, demandedCommands._.max.toString()) : null);
        } else {
          usage2.fail(__n("Too many non-option arguments: got %s, maximum of %s", "Too many non-option arguments: got %s, maximum of %s", _s, _s.toString(), demandedCommands._.max.toString()));
        }
      }
    }
  };
  self2.positionalCount = function positionalCount(required, observed) {
    if (observed < required) {
      usage2.fail(__n("Not enough non-option arguments: got %s, need at least %s", "Not enough non-option arguments: got %s, need at least %s", observed, observed + "", required + ""));
    }
  };
  self2.requiredArguments = function requiredArguments(argv, demandedOptions) {
    let missing = null;
    for (const key of Object.keys(demandedOptions)) {
      if (!Object.prototype.hasOwnProperty.call(argv, key) || typeof argv[key] === "undefined") {
        missing = missing || {};
        missing[key] = demandedOptions[key];
      }
    }
    if (missing) {
      const customMsgs = [];
      for (const key of Object.keys(missing)) {
        const msg = missing[key];
        if (msg && customMsgs.indexOf(msg) < 0) {
          customMsgs.push(msg);
        }
      }
      const customMsg = customMsgs.length ? `
${customMsgs.join("\n")}` : "";
      usage2.fail(__n("Missing required argument: %s", "Missing required arguments: %s", Object.keys(missing).length, Object.keys(missing).join(", ") + customMsg));
    }
  };
  self2.unknownArguments = function unknownArguments(argv, aliases, positionalMap, isDefaultCommand, checkPositionals = true) {
    var _a2;
    const commandKeys = yargs.getInternalMethods().getCommandInstance().getCommands();
    const unknown = [];
    const currentContext = yargs.getInternalMethods().getContext();
    Object.keys(argv).forEach((key) => {
      if (!specialKeys.includes(key) && !Object.prototype.hasOwnProperty.call(positionalMap, key) && !Object.prototype.hasOwnProperty.call(yargs.getInternalMethods().getParseContext(), key) && !self2.isValidAndSomeAliasIsNotNew(key, aliases)) {
        unknown.push(key);
      }
    });
    if (checkPositionals && (currentContext.commands.length > 0 || commandKeys.length > 0 || isDefaultCommand)) {
      argv._.slice(currentContext.commands.length).forEach((key) => {
        if (!commandKeys.includes("" + key)) {
          unknown.push("" + key);
        }
      });
    }
    if (checkPositionals) {
      const demandedCommands = yargs.getDemandedCommands();
      const maxNonOptDemanded = ((_a2 = demandedCommands._) === null || _a2 === void 0 ? void 0 : _a2.max) || 0;
      const expected = currentContext.commands.length + maxNonOptDemanded;
      if (expected < argv._.length) {
        argv._.slice(expected).forEach((key) => {
          key = String(key);
          if (!currentContext.commands.includes(key) && !unknown.includes(key)) {
            unknown.push(key);
          }
        });
      }
    }
    if (unknown.length) {
      usage2.fail(__n("Unknown argument: %s", "Unknown arguments: %s", unknown.length, unknown.map((s) => s.trim() ? s : `"${s}"`).join(", ")));
    }
  };
  self2.unknownCommands = function unknownCommands(argv) {
    const commandKeys = yargs.getInternalMethods().getCommandInstance().getCommands();
    const unknown = [];
    const currentContext = yargs.getInternalMethods().getContext();
    if (currentContext.commands.length > 0 || commandKeys.length > 0) {
      argv._.slice(currentContext.commands.length).forEach((key) => {
        if (!commandKeys.includes("" + key)) {
          unknown.push("" + key);
        }
      });
    }
    if (unknown.length > 0) {
      usage2.fail(__n("Unknown command: %s", "Unknown commands: %s", unknown.length, unknown.join(", ")));
      return true;
    } else {
      return false;
    }
  };
  self2.isValidAndSomeAliasIsNotNew = function isValidAndSomeAliasIsNotNew(key, aliases) {
    if (!Object.prototype.hasOwnProperty.call(aliases, key)) {
      return false;
    }
    const newAliases = yargs.parsed.newAliases;
    return [key, ...aliases[key]].some((a) => !Object.prototype.hasOwnProperty.call(newAliases, a) || !newAliases[key]);
  };
  self2.limitedChoices = function limitedChoices(argv) {
    const options = yargs.getOptions();
    const invalid = {};
    if (!Object.keys(options.choices).length)
      return;
    Object.keys(argv).forEach((key) => {
      if (specialKeys.indexOf(key) === -1 && Object.prototype.hasOwnProperty.call(options.choices, key)) {
        [].concat(argv[key]).forEach((value) => {
          if (options.choices[key].indexOf(value) === -1 && value !== void 0) {
            invalid[key] = (invalid[key] || []).concat(value);
          }
        });
      }
    });
    const invalidKeys = Object.keys(invalid);
    if (!invalidKeys.length)
      return;
    let msg = __("Invalid values:");
    invalidKeys.forEach((key) => {
      msg += `
  ${__("Argument: %s, Given: %s, Choices: %s", key, usage2.stringifiedValues(invalid[key]), usage2.stringifiedValues(options.choices[key]))}`;
    });
    usage2.fail(msg);
  };
  let implied = {};
  self2.implies = function implies(key, value) {
    argsert("<string|object> [array|number|string]", [key, value], arguments.length);
    if (typeof key === "object") {
      Object.keys(key).forEach((k) => {
        self2.implies(k, key[k]);
      });
    } else {
      yargs.global(key);
      if (!implied[key]) {
        implied[key] = [];
      }
      if (Array.isArray(value)) {
        value.forEach((i) => self2.implies(key, i));
      } else {
        assertNotStrictEqual(value, void 0, shim3);
        implied[key].push(value);
      }
    }
  };
  self2.getImplied = function getImplied() {
    return implied;
  };
  function keyExists(argv, val) {
    const num = Number(val);
    val = isNaN(num) ? val : num;
    if (typeof val === "number") {
      val = argv._.length >= val;
    } else if (val.match(/^--no-.+/)) {
      val = val.match(/^--no-(.+)/)[1];
      val = !Object.prototype.hasOwnProperty.call(argv, val);
    } else {
      val = Object.prototype.hasOwnProperty.call(argv, val);
    }
    return val;
  }
  self2.implications = function implications(argv) {
    const implyFail = [];
    Object.keys(implied).forEach((key) => {
      const origKey = key;
      (implied[key] || []).forEach((value) => {
        let key2 = origKey;
        const origValue = value;
        key2 = keyExists(argv, key2);
        value = keyExists(argv, value);
        if (key2 && !value) {
          implyFail.push(` ${origKey} -> ${origValue}`);
        }
      });
    });
    if (implyFail.length) {
      let msg = `${__("Implications failed:")}
`;
      implyFail.forEach((value) => {
        msg += value;
      });
      usage2.fail(msg);
    }
  };
  let conflicting = {};
  self2.conflicts = function conflicts(key, value) {
    argsert("<string|object> [array|string]", [key, value], arguments.length);
    if (typeof key === "object") {
      Object.keys(key).forEach((k) => {
        self2.conflicts(k, key[k]);
      });
    } else {
      yargs.global(key);
      if (!conflicting[key]) {
        conflicting[key] = [];
      }
      if (Array.isArray(value)) {
        value.forEach((i) => self2.conflicts(key, i));
      } else {
        conflicting[key].push(value);
      }
    }
  };
  self2.getConflicting = () => conflicting;
  self2.conflicting = function conflictingFn(argv) {
    Object.keys(argv).forEach((key) => {
      if (conflicting[key]) {
        conflicting[key].forEach((value) => {
          if (value && argv[key] !== void 0 && argv[value] !== void 0) {
            usage2.fail(__("Arguments %s and %s are mutually exclusive", key, value));
          }
        });
      }
    });
    if (yargs.getInternalMethods().getParserConfiguration()["strip-dashed"]) {
      Object.keys(conflicting).forEach((key) => {
        conflicting[key].forEach((value) => {
          if (value && argv[shim3.Parser.camelCase(key)] !== void 0 && argv[shim3.Parser.camelCase(value)] !== void 0) {
            usage2.fail(__("Arguments %s and %s are mutually exclusive", key, value));
          }
        });
      });
    }
  };
  self2.recommendCommands = function recommendCommands(cmd, potentialCommands) {
    const threshold = 3;
    potentialCommands = potentialCommands.sort((a, b) => b.length - a.length);
    let recommended = null;
    let bestDistance = Infinity;
    for (let i = 0, candidate; (candidate = potentialCommands[i]) !== void 0; i++) {
      const d = levenshtein(cmd, candidate);
      if (d <= threshold && d < bestDistance) {
        bestDistance = d;
        recommended = candidate;
      }
    }
    if (recommended)
      usage2.fail(__("Did you mean %s?", recommended));
  };
  self2.reset = function reset(localLookup) {
    implied = objFilter(implied, (k) => !localLookup[k]);
    conflicting = objFilter(conflicting, (k) => !localLookup[k]);
    return self2;
  };
  const frozens = [];
  self2.freeze = function freeze() {
    frozens.push({
      implied,
      conflicting
    });
  };
  self2.unfreeze = function unfreeze() {
    const frozen = frozens.pop();
    assertNotStrictEqual(frozen, void 0, shim3);
    ({ implied, conflicting } = frozen);
  };
  return self2;
}

// node_modules/yargs/build/lib/utils/apply-extends.js
var previouslyVisitedConfigs = [];
var shim2;
function applyExtends(config, cwd, mergeExtends, _shim) {
  shim2 = _shim;
  let defaultConfig = {};
  if (Object.prototype.hasOwnProperty.call(config, "extends")) {
    if (typeof config.extends !== "string")
      return defaultConfig;
    const isPath = /\.json|\..*rc$/.test(config.extends);
    let pathToDefault = null;
    if (!isPath) {
      try {
        pathToDefault = require.resolve(config.extends);
      } catch (_err) {
        return config;
      }
    } else {
      pathToDefault = getPathToDefaultConfig(cwd, config.extends);
    }
    checkForCircularExtends(pathToDefault);
    previouslyVisitedConfigs.push(pathToDefault);
    defaultConfig = isPath ? JSON.parse(shim2.readFileSync(pathToDefault, "utf8")) : require(config.extends);
    delete config.extends;
    defaultConfig = applyExtends(defaultConfig, shim2.path.dirname(pathToDefault), mergeExtends, shim2);
  }
  previouslyVisitedConfigs = [];
  return mergeExtends ? mergeDeep(defaultConfig, config) : Object.assign({}, defaultConfig, config);
}
function checkForCircularExtends(cfgPath) {
  if (previouslyVisitedConfigs.indexOf(cfgPath) > -1) {
    throw new YError(`Circular extended configurations: '${cfgPath}'.`);
  }
}
function getPathToDefaultConfig(cwd, pathToExtend) {
  return shim2.path.resolve(cwd, pathToExtend);
}
function mergeDeep(config1, config2) {
  const target = {};
  function isObject2(obj) {
    return obj && typeof obj === "object" && !Array.isArray(obj);
  }
  Object.assign(target, config1);
  for (const key of Object.keys(config2)) {
    if (isObject2(config2[key]) && isObject2(target[key])) {
      target[key] = mergeDeep(config1[key], config2[key]);
    } else {
      target[key] = config2[key];
    }
  }
  return target;
}

// node_modules/yargs/build/lib/yargs-factory.js
var __classPrivateFieldSet = function(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet = function(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _YargsInstance_command;
var _YargsInstance_cwd;
var _YargsInstance_context;
var _YargsInstance_completion;
var _YargsInstance_completionCommand;
var _YargsInstance_defaultShowHiddenOpt;
var _YargsInstance_exitError;
var _YargsInstance_detectLocale;
var _YargsInstance_emittedWarnings;
var _YargsInstance_exitProcess;
var _YargsInstance_frozens;
var _YargsInstance_globalMiddleware;
var _YargsInstance_groups;
var _YargsInstance_hasOutput;
var _YargsInstance_helpOpt;
var _YargsInstance_isGlobalContext;
var _YargsInstance_logger;
var _YargsInstance_output;
var _YargsInstance_options;
var _YargsInstance_parentRequire;
var _YargsInstance_parserConfig;
var _YargsInstance_parseFn;
var _YargsInstance_parseContext;
var _YargsInstance_pkgs;
var _YargsInstance_preservedGroups;
var _YargsInstance_processArgs;
var _YargsInstance_recommendCommands;
var _YargsInstance_shim;
var _YargsInstance_strict;
var _YargsInstance_strictCommands;
var _YargsInstance_strictOptions;
var _YargsInstance_usage;
var _YargsInstance_usageConfig;
var _YargsInstance_versionOpt;
var _YargsInstance_validation;
function YargsFactory(_shim) {
  return (processArgs = [], cwd = _shim.process.cwd(), parentRequire) => {
    const yargs = new YargsInstance(processArgs, cwd, parentRequire, _shim);
    Object.defineProperty(yargs, "argv", {
      get: () => {
        return yargs.parse();
      },
      enumerable: true
    });
    yargs.help();
    yargs.version();
    return yargs;
  };
}
var kCopyDoubleDash = /* @__PURE__ */ Symbol("copyDoubleDash");
var kCreateLogger = /* @__PURE__ */ Symbol("copyDoubleDash");
var kDeleteFromParserHintObject = /* @__PURE__ */ Symbol("deleteFromParserHintObject");
var kEmitWarning = /* @__PURE__ */ Symbol("emitWarning");
var kFreeze = /* @__PURE__ */ Symbol("freeze");
var kGetDollarZero = /* @__PURE__ */ Symbol("getDollarZero");
var kGetParserConfiguration = /* @__PURE__ */ Symbol("getParserConfiguration");
var kGetUsageConfiguration = /* @__PURE__ */ Symbol("getUsageConfiguration");
var kGuessLocale = /* @__PURE__ */ Symbol("guessLocale");
var kGuessVersion = /* @__PURE__ */ Symbol("guessVersion");
var kParsePositionalNumbers = /* @__PURE__ */ Symbol("parsePositionalNumbers");
var kPkgUp = /* @__PURE__ */ Symbol("pkgUp");
var kPopulateParserHintArray = /* @__PURE__ */ Symbol("populateParserHintArray");
var kPopulateParserHintSingleValueDictionary = /* @__PURE__ */ Symbol("populateParserHintSingleValueDictionary");
var kPopulateParserHintArrayDictionary = /* @__PURE__ */ Symbol("populateParserHintArrayDictionary");
var kPopulateParserHintDictionary = /* @__PURE__ */ Symbol("populateParserHintDictionary");
var kSanitizeKey = /* @__PURE__ */ Symbol("sanitizeKey");
var kSetKey = /* @__PURE__ */ Symbol("setKey");
var kUnfreeze = /* @__PURE__ */ Symbol("unfreeze");
var kValidateAsync = /* @__PURE__ */ Symbol("validateAsync");
var kGetCommandInstance = /* @__PURE__ */ Symbol("getCommandInstance");
var kGetContext = /* @__PURE__ */ Symbol("getContext");
var kGetHasOutput = /* @__PURE__ */ Symbol("getHasOutput");
var kGetLoggerInstance = /* @__PURE__ */ Symbol("getLoggerInstance");
var kGetParseContext = /* @__PURE__ */ Symbol("getParseContext");
var kGetUsageInstance = /* @__PURE__ */ Symbol("getUsageInstance");
var kGetValidationInstance = /* @__PURE__ */ Symbol("getValidationInstance");
var kHasParseCallback = /* @__PURE__ */ Symbol("hasParseCallback");
var kIsGlobalContext = /* @__PURE__ */ Symbol("isGlobalContext");
var kPostProcess = /* @__PURE__ */ Symbol("postProcess");
var kRebase = /* @__PURE__ */ Symbol("rebase");
var kReset = /* @__PURE__ */ Symbol("reset");
var kRunYargsParserAndExecuteCommands = /* @__PURE__ */ Symbol("runYargsParserAndExecuteCommands");
var kRunValidation = /* @__PURE__ */ Symbol("runValidation");
var kSetHasOutput = /* @__PURE__ */ Symbol("setHasOutput");
var kTrackManuallySetKeys = /* @__PURE__ */ Symbol("kTrackManuallySetKeys");
var YargsInstance = class {
  constructor(processArgs = [], cwd, parentRequire, shim3) {
    this.customScriptName = false;
    this.parsed = false;
    _YargsInstance_command.set(this, void 0);
    _YargsInstance_cwd.set(this, void 0);
    _YargsInstance_context.set(this, { commands: [], fullCommands: [] });
    _YargsInstance_completion.set(this, null);
    _YargsInstance_completionCommand.set(this, null);
    _YargsInstance_defaultShowHiddenOpt.set(this, "show-hidden");
    _YargsInstance_exitError.set(this, null);
    _YargsInstance_detectLocale.set(this, true);
    _YargsInstance_emittedWarnings.set(this, {});
    _YargsInstance_exitProcess.set(this, true);
    _YargsInstance_frozens.set(this, []);
    _YargsInstance_globalMiddleware.set(this, void 0);
    _YargsInstance_groups.set(this, {});
    _YargsInstance_hasOutput.set(this, false);
    _YargsInstance_helpOpt.set(this, null);
    _YargsInstance_isGlobalContext.set(this, true);
    _YargsInstance_logger.set(this, void 0);
    _YargsInstance_output.set(this, "");
    _YargsInstance_options.set(this, void 0);
    _YargsInstance_parentRequire.set(this, void 0);
    _YargsInstance_parserConfig.set(this, {});
    _YargsInstance_parseFn.set(this, null);
    _YargsInstance_parseContext.set(this, null);
    _YargsInstance_pkgs.set(this, {});
    _YargsInstance_preservedGroups.set(this, {});
    _YargsInstance_processArgs.set(this, void 0);
    _YargsInstance_recommendCommands.set(this, false);
    _YargsInstance_shim.set(this, void 0);
    _YargsInstance_strict.set(this, false);
    _YargsInstance_strictCommands.set(this, false);
    _YargsInstance_strictOptions.set(this, false);
    _YargsInstance_usage.set(this, void 0);
    _YargsInstance_usageConfig.set(this, {});
    _YargsInstance_versionOpt.set(this, null);
    _YargsInstance_validation.set(this, void 0);
    __classPrivateFieldSet(this, _YargsInstance_shim, shim3, "f");
    __classPrivateFieldSet(this, _YargsInstance_processArgs, processArgs, "f");
    __classPrivateFieldSet(this, _YargsInstance_cwd, cwd, "f");
    __classPrivateFieldSet(this, _YargsInstance_parentRequire, parentRequire, "f");
    __classPrivateFieldSet(this, _YargsInstance_globalMiddleware, new GlobalMiddleware(this), "f");
    this.$0 = this[kGetDollarZero]();
    this[kReset]();
    __classPrivateFieldSet(this, _YargsInstance_command, __classPrivateFieldGet(this, _YargsInstance_command, "f"), "f");
    __classPrivateFieldSet(this, _YargsInstance_usage, __classPrivateFieldGet(this, _YargsInstance_usage, "f"), "f");
    __classPrivateFieldSet(this, _YargsInstance_validation, __classPrivateFieldGet(this, _YargsInstance_validation, "f"), "f");
    __classPrivateFieldSet(this, _YargsInstance_options, __classPrivateFieldGet(this, _YargsInstance_options, "f"), "f");
    __classPrivateFieldGet(this, _YargsInstance_options, "f").showHiddenOpt = __classPrivateFieldGet(this, _YargsInstance_defaultShowHiddenOpt, "f");
    __classPrivateFieldSet(this, _YargsInstance_logger, this[kCreateLogger](), "f");
  }
  addHelpOpt(opt, msg) {
    const defaultHelpOpt = "help";
    argsert("[string|boolean] [string]", [opt, msg], arguments.length);
    if (__classPrivateFieldGet(this, _YargsInstance_helpOpt, "f")) {
      this[kDeleteFromParserHintObject](__classPrivateFieldGet(this, _YargsInstance_helpOpt, "f"));
      __classPrivateFieldSet(this, _YargsInstance_helpOpt, null, "f");
    }
    if (opt === false && msg === void 0)
      return this;
    __classPrivateFieldSet(this, _YargsInstance_helpOpt, typeof opt === "string" ? opt : defaultHelpOpt, "f");
    this.boolean(__classPrivateFieldGet(this, _YargsInstance_helpOpt, "f"));
    this.describe(__classPrivateFieldGet(this, _YargsInstance_helpOpt, "f"), msg || __classPrivateFieldGet(this, _YargsInstance_usage, "f").deferY18nLookup("Show help"));
    return this;
  }
  help(opt, msg) {
    return this.addHelpOpt(opt, msg);
  }
  addShowHiddenOpt(opt, msg) {
    argsert("[string|boolean] [string]", [opt, msg], arguments.length);
    if (opt === false && msg === void 0)
      return this;
    const showHiddenOpt = typeof opt === "string" ? opt : __classPrivateFieldGet(this, _YargsInstance_defaultShowHiddenOpt, "f");
    this.boolean(showHiddenOpt);
    this.describe(showHiddenOpt, msg || __classPrivateFieldGet(this, _YargsInstance_usage, "f").deferY18nLookup("Show hidden options"));
    __classPrivateFieldGet(this, _YargsInstance_options, "f").showHiddenOpt = showHiddenOpt;
    return this;
  }
  showHidden(opt, msg) {
    return this.addShowHiddenOpt(opt, msg);
  }
  alias(key, value) {
    argsert("<object|string|array> [string|array]", [key, value], arguments.length);
    this[kPopulateParserHintArrayDictionary](this.alias.bind(this), "alias", key, value);
    return this;
  }
  array(keys2) {
    argsert("<array|string>", [keys2], arguments.length);
    this[kPopulateParserHintArray]("array", keys2);
    this[kTrackManuallySetKeys](keys2);
    return this;
  }
  boolean(keys2) {
    argsert("<array|string>", [keys2], arguments.length);
    this[kPopulateParserHintArray]("boolean", keys2);
    this[kTrackManuallySetKeys](keys2);
    return this;
  }
  check(f, global2) {
    argsert("<function> [boolean]", [f, global2], arguments.length);
    this.middleware((argv, _yargs) => {
      return maybeAsyncResult(() => {
        return f(argv, _yargs.getOptions());
      }, (result) => {
        if (!result) {
          __classPrivateFieldGet(this, _YargsInstance_usage, "f").fail(__classPrivateFieldGet(this, _YargsInstance_shim, "f").y18n.__("Argument check failed: %s", f.toString()));
        } else if (typeof result === "string" || result instanceof Error) {
          __classPrivateFieldGet(this, _YargsInstance_usage, "f").fail(result.toString(), result);
        }
        return argv;
      }, (err) => {
        __classPrivateFieldGet(this, _YargsInstance_usage, "f").fail(err.message ? err.message : err.toString(), err);
        return argv;
      });
    }, false, global2);
    return this;
  }
  choices(key, value) {
    argsert("<object|string|array> [string|array]", [key, value], arguments.length);
    this[kPopulateParserHintArrayDictionary](this.choices.bind(this), "choices", key, value);
    return this;
  }
  coerce(keys2, value) {
    argsert("<object|string|array> [function]", [keys2, value], arguments.length);
    if (Array.isArray(keys2)) {
      if (!value) {
        throw new YError("coerce callback must be provided");
      }
      for (const key of keys2) {
        this.coerce(key, value);
      }
      return this;
    } else if (typeof keys2 === "object") {
      for (const key of Object.keys(keys2)) {
        this.coerce(key, keys2[key]);
      }
      return this;
    }
    if (!value) {
      throw new YError("coerce callback must be provided");
    }
    __classPrivateFieldGet(this, _YargsInstance_options, "f").key[keys2] = true;
    __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f").addCoerceMiddleware((argv, yargs) => {
      let aliases;
      const shouldCoerce = Object.prototype.hasOwnProperty.call(argv, keys2);
      if (!shouldCoerce) {
        return argv;
      }
      return maybeAsyncResult(() => {
        aliases = yargs.getAliases();
        return value(argv[keys2]);
      }, (result) => {
        argv[keys2] = result;
        const stripAliased = yargs.getInternalMethods().getParserConfiguration()["strip-aliased"];
        if (aliases[keys2] && stripAliased !== true) {
          for (const alias of aliases[keys2]) {
            argv[alias] = result;
          }
        }
        return argv;
      }, (err) => {
        throw new YError(err.message);
      });
    }, keys2);
    return this;
  }
  conflicts(key1, key2) {
    argsert("<string|object> [string|array]", [key1, key2], arguments.length);
    __classPrivateFieldGet(this, _YargsInstance_validation, "f").conflicts(key1, key2);
    return this;
  }
  config(key = "config", msg, parseFn) {
    argsert("[object|string] [string|function] [function]", [key, msg, parseFn], arguments.length);
    if (typeof key === "object" && !Array.isArray(key)) {
      key = applyExtends(key, __classPrivateFieldGet(this, _YargsInstance_cwd, "f"), this[kGetParserConfiguration]()["deep-merge-config"] || false, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
      __classPrivateFieldGet(this, _YargsInstance_options, "f").configObjects = (__classPrivateFieldGet(this, _YargsInstance_options, "f").configObjects || []).concat(key);
      return this;
    }
    if (typeof msg === "function") {
      parseFn = msg;
      msg = void 0;
    }
    this.describe(key, msg || __classPrivateFieldGet(this, _YargsInstance_usage, "f").deferY18nLookup("Path to JSON config file"));
    (Array.isArray(key) ? key : [key]).forEach((k) => {
      __classPrivateFieldGet(this, _YargsInstance_options, "f").config[k] = parseFn || true;
    });
    return this;
  }
  completion(cmd, desc, fn) {
    argsert("[string] [string|boolean|function] [function]", [cmd, desc, fn], arguments.length);
    if (typeof desc === "function") {
      fn = desc;
      desc = void 0;
    }
    __classPrivateFieldSet(this, _YargsInstance_completionCommand, cmd || __classPrivateFieldGet(this, _YargsInstance_completionCommand, "f") || "completion", "f");
    if (!desc && desc !== false) {
      desc = "generate completion script";
    }
    this.command(__classPrivateFieldGet(this, _YargsInstance_completionCommand, "f"), desc);
    if (fn)
      __classPrivateFieldGet(this, _YargsInstance_completion, "f").registerFunction(fn);
    return this;
  }
  command(cmd, description, builder, handler, middlewares, deprecated) {
    argsert("<string|array|object> [string|boolean] [function|object] [function] [array] [boolean|string]", [cmd, description, builder, handler, middlewares, deprecated], arguments.length);
    __classPrivateFieldGet(this, _YargsInstance_command, "f").addHandler(cmd, description, builder, handler, middlewares, deprecated);
    return this;
  }
  commands(cmd, description, builder, handler, middlewares, deprecated) {
    return this.command(cmd, description, builder, handler, middlewares, deprecated);
  }
  commandDir(dir, opts) {
    argsert("<string> [object]", [dir, opts], arguments.length);
    const req = __classPrivateFieldGet(this, _YargsInstance_parentRequire, "f") || __classPrivateFieldGet(this, _YargsInstance_shim, "f").require;
    __classPrivateFieldGet(this, _YargsInstance_command, "f").addDirectory(dir, req, __classPrivateFieldGet(this, _YargsInstance_shim, "f").getCallerFile(), opts);
    return this;
  }
  count(keys2) {
    argsert("<array|string>", [keys2], arguments.length);
    this[kPopulateParserHintArray]("count", keys2);
    this[kTrackManuallySetKeys](keys2);
    return this;
  }
  default(key, value, defaultDescription) {
    argsert("<object|string|array> [*] [string]", [key, value, defaultDescription], arguments.length);
    if (defaultDescription) {
      assertSingleKey(key, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
      __classPrivateFieldGet(this, _YargsInstance_options, "f").defaultDescription[key] = defaultDescription;
    }
    if (typeof value === "function") {
      assertSingleKey(key, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
      if (!__classPrivateFieldGet(this, _YargsInstance_options, "f").defaultDescription[key])
        __classPrivateFieldGet(this, _YargsInstance_options, "f").defaultDescription[key] = __classPrivateFieldGet(this, _YargsInstance_usage, "f").functionDescription(value);
      value = value.call();
    }
    this[kPopulateParserHintSingleValueDictionary](this.default.bind(this), "default", key, value);
    return this;
  }
  defaults(key, value, defaultDescription) {
    return this.default(key, value, defaultDescription);
  }
  demandCommand(min = 1, max, minMsg, maxMsg) {
    argsert("[number] [number|string] [string|null|undefined] [string|null|undefined]", [min, max, minMsg, maxMsg], arguments.length);
    if (typeof max !== "number") {
      minMsg = max;
      max = Infinity;
    }
    this.global("_", false);
    __classPrivateFieldGet(this, _YargsInstance_options, "f").demandedCommands._ = {
      min,
      max,
      minMsg,
      maxMsg
    };
    return this;
  }
  demand(keys2, max, msg) {
    if (Array.isArray(max)) {
      max.forEach((key) => {
        assertNotStrictEqual(msg, true, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
        this.demandOption(key, msg);
      });
      max = Infinity;
    } else if (typeof max !== "number") {
      msg = max;
      max = Infinity;
    }
    if (typeof keys2 === "number") {
      assertNotStrictEqual(msg, true, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
      this.demandCommand(keys2, max, msg, msg);
    } else if (Array.isArray(keys2)) {
      keys2.forEach((key) => {
        assertNotStrictEqual(msg, true, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
        this.demandOption(key, msg);
      });
    } else {
      if (typeof msg === "string") {
        this.demandOption(keys2, msg);
      } else if (msg === true || typeof msg === "undefined") {
        this.demandOption(keys2);
      }
    }
    return this;
  }
  demandOption(keys2, msg) {
    argsert("<object|string|array> [string]", [keys2, msg], arguments.length);
    this[kPopulateParserHintSingleValueDictionary](this.demandOption.bind(this), "demandedOptions", keys2, msg);
    return this;
  }
  deprecateOption(option, message) {
    argsert("<string> [string|boolean]", [option, message], arguments.length);
    __classPrivateFieldGet(this, _YargsInstance_options, "f").deprecatedOptions[option] = message;
    return this;
  }
  describe(keys2, description) {
    argsert("<object|string|array> [string]", [keys2, description], arguments.length);
    this[kSetKey](keys2, true);
    __classPrivateFieldGet(this, _YargsInstance_usage, "f").describe(keys2, description);
    return this;
  }
  detectLocale(detect) {
    argsert("<boolean>", [detect], arguments.length);
    __classPrivateFieldSet(this, _YargsInstance_detectLocale, detect, "f");
    return this;
  }
  env(prefix) {
    argsert("[string|boolean]", [prefix], arguments.length);
    if (prefix === false)
      delete __classPrivateFieldGet(this, _YargsInstance_options, "f").envPrefix;
    else
      __classPrivateFieldGet(this, _YargsInstance_options, "f").envPrefix = prefix || "";
    return this;
  }
  epilogue(msg) {
    argsert("<string>", [msg], arguments.length);
    __classPrivateFieldGet(this, _YargsInstance_usage, "f").epilog(msg);
    return this;
  }
  epilog(msg) {
    return this.epilogue(msg);
  }
  example(cmd, description) {
    argsert("<string|array> [string]", [cmd, description], arguments.length);
    if (Array.isArray(cmd)) {
      cmd.forEach((exampleParams) => this.example(...exampleParams));
    } else {
      __classPrivateFieldGet(this, _YargsInstance_usage, "f").example(cmd, description);
    }
    return this;
  }
  exit(code, err) {
    __classPrivateFieldSet(this, _YargsInstance_hasOutput, true, "f");
    __classPrivateFieldSet(this, _YargsInstance_exitError, err, "f");
    if (__classPrivateFieldGet(this, _YargsInstance_exitProcess, "f"))
      __classPrivateFieldGet(this, _YargsInstance_shim, "f").process.exit(code);
  }
  exitProcess(enabled = true) {
    argsert("[boolean]", [enabled], arguments.length);
    __classPrivateFieldSet(this, _YargsInstance_exitProcess, enabled, "f");
    return this;
  }
  fail(f) {
    argsert("<function|boolean>", [f], arguments.length);
    if (typeof f === "boolean" && f !== false) {
      throw new YError("Invalid first argument. Expected function or boolean 'false'");
    }
    __classPrivateFieldGet(this, _YargsInstance_usage, "f").failFn(f);
    return this;
  }
  getAliases() {
    return this.parsed ? this.parsed.aliases : {};
  }
  async getCompletion(args, done) {
    argsert("<array> [function]", [args, done], arguments.length);
    if (!done) {
      return new Promise((resolve6, reject2) => {
        __classPrivateFieldGet(this, _YargsInstance_completion, "f").getCompletion(args, (err, completions) => {
          if (err)
            reject2(err);
          else
            resolve6(completions);
        });
      });
    } else {
      return __classPrivateFieldGet(this, _YargsInstance_completion, "f").getCompletion(args, done);
    }
  }
  getDemandedOptions() {
    argsert([], 0);
    return __classPrivateFieldGet(this, _YargsInstance_options, "f").demandedOptions;
  }
  getDemandedCommands() {
    argsert([], 0);
    return __classPrivateFieldGet(this, _YargsInstance_options, "f").demandedCommands;
  }
  getDeprecatedOptions() {
    argsert([], 0);
    return __classPrivateFieldGet(this, _YargsInstance_options, "f").deprecatedOptions;
  }
  getDetectLocale() {
    return __classPrivateFieldGet(this, _YargsInstance_detectLocale, "f");
  }
  getExitProcess() {
    return __classPrivateFieldGet(this, _YargsInstance_exitProcess, "f");
  }
  getGroups() {
    return Object.assign({}, __classPrivateFieldGet(this, _YargsInstance_groups, "f"), __classPrivateFieldGet(this, _YargsInstance_preservedGroups, "f"));
  }
  getHelp() {
    __classPrivateFieldSet(this, _YargsInstance_hasOutput, true, "f");
    if (!__classPrivateFieldGet(this, _YargsInstance_usage, "f").hasCachedHelpMessage()) {
      if (!this.parsed) {
        const parse2 = this[kRunYargsParserAndExecuteCommands](__classPrivateFieldGet(this, _YargsInstance_processArgs, "f"), void 0, void 0, 0, true);
        if (isPromise(parse2)) {
          return parse2.then(() => {
            return __classPrivateFieldGet(this, _YargsInstance_usage, "f").help();
          });
        }
      }
      const builderResponse = __classPrivateFieldGet(this, _YargsInstance_command, "f").runDefaultBuilderOn(this);
      if (isPromise(builderResponse)) {
        return builderResponse.then(() => {
          return __classPrivateFieldGet(this, _YargsInstance_usage, "f").help();
        });
      }
    }
    return Promise.resolve(__classPrivateFieldGet(this, _YargsInstance_usage, "f").help());
  }
  getOptions() {
    return __classPrivateFieldGet(this, _YargsInstance_options, "f");
  }
  getStrict() {
    return __classPrivateFieldGet(this, _YargsInstance_strict, "f");
  }
  getStrictCommands() {
    return __classPrivateFieldGet(this, _YargsInstance_strictCommands, "f");
  }
  getStrictOptions() {
    return __classPrivateFieldGet(this, _YargsInstance_strictOptions, "f");
  }
  global(globals, global2) {
    argsert("<string|array> [boolean]", [globals, global2], arguments.length);
    globals = [].concat(globals);
    if (global2 !== false) {
      __classPrivateFieldGet(this, _YargsInstance_options, "f").local = __classPrivateFieldGet(this, _YargsInstance_options, "f").local.filter((l) => globals.indexOf(l) === -1);
    } else {
      globals.forEach((g) => {
        if (!__classPrivateFieldGet(this, _YargsInstance_options, "f").local.includes(g))
          __classPrivateFieldGet(this, _YargsInstance_options, "f").local.push(g);
      });
    }
    return this;
  }
  group(opts, groupName) {
    argsert("<string|array> <string>", [opts, groupName], arguments.length);
    const existing = __classPrivateFieldGet(this, _YargsInstance_preservedGroups, "f")[groupName] || __classPrivateFieldGet(this, _YargsInstance_groups, "f")[groupName];
    if (__classPrivateFieldGet(this, _YargsInstance_preservedGroups, "f")[groupName]) {
      delete __classPrivateFieldGet(this, _YargsInstance_preservedGroups, "f")[groupName];
    }
    const seen = {};
    __classPrivateFieldGet(this, _YargsInstance_groups, "f")[groupName] = (existing || []).concat(opts).filter((key) => {
      if (seen[key])
        return false;
      return seen[key] = true;
    });
    return this;
  }
  hide(key) {
    argsert("<string>", [key], arguments.length);
    __classPrivateFieldGet(this, _YargsInstance_options, "f").hiddenOptions.push(key);
    return this;
  }
  implies(key, value) {
    argsert("<string|object> [number|string|array]", [key, value], arguments.length);
    __classPrivateFieldGet(this, _YargsInstance_validation, "f").implies(key, value);
    return this;
  }
  locale(locale) {
    argsert("[string]", [locale], arguments.length);
    if (locale === void 0) {
      this[kGuessLocale]();
      return __classPrivateFieldGet(this, _YargsInstance_shim, "f").y18n.getLocale();
    }
    __classPrivateFieldSet(this, _YargsInstance_detectLocale, false, "f");
    __classPrivateFieldGet(this, _YargsInstance_shim, "f").y18n.setLocale(locale);
    return this;
  }
  middleware(callback, applyBeforeValidation, global2) {
    return __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f").addMiddleware(callback, !!applyBeforeValidation, global2);
  }
  nargs(key, value) {
    argsert("<string|object|array> [number]", [key, value], arguments.length);
    this[kPopulateParserHintSingleValueDictionary](this.nargs.bind(this), "narg", key, value);
    return this;
  }
  normalize(keys2) {
    argsert("<array|string>", [keys2], arguments.length);
    this[kPopulateParserHintArray]("normalize", keys2);
    return this;
  }
  number(keys2) {
    argsert("<array|string>", [keys2], arguments.length);
    this[kPopulateParserHintArray]("number", keys2);
    this[kTrackManuallySetKeys](keys2);
    return this;
  }
  option(key, opt) {
    argsert("<string|object> [object]", [key, opt], arguments.length);
    if (typeof key === "object") {
      Object.keys(key).forEach((k) => {
        this.options(k, key[k]);
      });
    } else {
      if (typeof opt !== "object") {
        opt = {};
      }
      this[kTrackManuallySetKeys](key);
      if (__classPrivateFieldGet(this, _YargsInstance_versionOpt, "f") && (key === "version" || (opt === null || opt === void 0 ? void 0 : opt.alias) === "version")) {
        this[kEmitWarning]([
          '"version" is a reserved word.',
          "Please do one of the following:",
          '- Disable version with `yargs.version(false)` if using "version" as an option',
          "- Use the built-in `yargs.version` method instead (if applicable)",
          "- Use a different option key",
          "https://yargs.js.org/docs/#api-reference-version"
        ].join("\n"), void 0, "versionWarning");
      }
      __classPrivateFieldGet(this, _YargsInstance_options, "f").key[key] = true;
      if (opt.alias)
        this.alias(key, opt.alias);
      const deprecate = opt.deprecate || opt.deprecated;
      if (deprecate) {
        this.deprecateOption(key, deprecate);
      }
      const demand = opt.demand || opt.required || opt.require;
      if (demand) {
        this.demand(key, demand);
      }
      if (opt.demandOption) {
        this.demandOption(key, typeof opt.demandOption === "string" ? opt.demandOption : void 0);
      }
      if (opt.conflicts) {
        this.conflicts(key, opt.conflicts);
      }
      if ("default" in opt) {
        this.default(key, opt.default);
      }
      if (opt.implies !== void 0) {
        this.implies(key, opt.implies);
      }
      if (opt.nargs !== void 0) {
        this.nargs(key, opt.nargs);
      }
      if (opt.config) {
        this.config(key, opt.configParser);
      }
      if (opt.normalize) {
        this.normalize(key);
      }
      if (opt.choices) {
        this.choices(key, opt.choices);
      }
      if (opt.coerce) {
        this.coerce(key, opt.coerce);
      }
      if (opt.group) {
        this.group(key, opt.group);
      }
      if (opt.boolean || opt.type === "boolean") {
        this.boolean(key);
        if (opt.alias)
          this.boolean(opt.alias);
      }
      if (opt.array || opt.type === "array") {
        this.array(key);
        if (opt.alias)
          this.array(opt.alias);
      }
      if (opt.number || opt.type === "number") {
        this.number(key);
        if (opt.alias)
          this.number(opt.alias);
      }
      if (opt.string || opt.type === "string") {
        this.string(key);
        if (opt.alias)
          this.string(opt.alias);
      }
      if (opt.count || opt.type === "count") {
        this.count(key);
      }
      if (typeof opt.global === "boolean") {
        this.global(key, opt.global);
      }
      if (opt.defaultDescription) {
        __classPrivateFieldGet(this, _YargsInstance_options, "f").defaultDescription[key] = opt.defaultDescription;
      }
      if (opt.skipValidation) {
        this.skipValidation(key);
      }
      const desc = opt.describe || opt.description || opt.desc;
      const descriptions = __classPrivateFieldGet(this, _YargsInstance_usage, "f").getDescriptions();
      if (!Object.prototype.hasOwnProperty.call(descriptions, key) || typeof desc === "string") {
        this.describe(key, desc);
      }
      if (opt.hidden) {
        this.hide(key);
      }
      if (opt.requiresArg) {
        this.requiresArg(key);
      }
    }
    return this;
  }
  options(key, opt) {
    return this.option(key, opt);
  }
  parse(args, shortCircuit, _parseFn) {
    argsert("[string|array] [function|boolean|object] [function]", [args, shortCircuit, _parseFn], arguments.length);
    this[kFreeze]();
    if (typeof args === "undefined") {
      args = __classPrivateFieldGet(this, _YargsInstance_processArgs, "f");
    }
    if (typeof shortCircuit === "object") {
      __classPrivateFieldSet(this, _YargsInstance_parseContext, shortCircuit, "f");
      shortCircuit = _parseFn;
    }
    if (typeof shortCircuit === "function") {
      __classPrivateFieldSet(this, _YargsInstance_parseFn, shortCircuit, "f");
      shortCircuit = false;
    }
    if (!shortCircuit)
      __classPrivateFieldSet(this, _YargsInstance_processArgs, args, "f");
    if (__classPrivateFieldGet(this, _YargsInstance_parseFn, "f"))
      __classPrivateFieldSet(this, _YargsInstance_exitProcess, false, "f");
    const parsed = this[kRunYargsParserAndExecuteCommands](args, !!shortCircuit);
    const tmpParsed = this.parsed;
    __classPrivateFieldGet(this, _YargsInstance_completion, "f").setParsed(this.parsed);
    if (isPromise(parsed)) {
      return parsed.then((argv) => {
        if (__classPrivateFieldGet(this, _YargsInstance_parseFn, "f"))
          __classPrivateFieldGet(this, _YargsInstance_parseFn, "f").call(this, __classPrivateFieldGet(this, _YargsInstance_exitError, "f"), argv, __classPrivateFieldGet(this, _YargsInstance_output, "f"));
        return argv;
      }).catch((err) => {
        if (__classPrivateFieldGet(this, _YargsInstance_parseFn, "f")) {
          __classPrivateFieldGet(this, _YargsInstance_parseFn, "f")(err, this.parsed.argv, __classPrivateFieldGet(this, _YargsInstance_output, "f"));
        }
        throw err;
      }).finally(() => {
        this[kUnfreeze]();
        this.parsed = tmpParsed;
      });
    } else {
      if (__classPrivateFieldGet(this, _YargsInstance_parseFn, "f"))
        __classPrivateFieldGet(this, _YargsInstance_parseFn, "f").call(this, __classPrivateFieldGet(this, _YargsInstance_exitError, "f"), parsed, __classPrivateFieldGet(this, _YargsInstance_output, "f"));
      this[kUnfreeze]();
      this.parsed = tmpParsed;
    }
    return parsed;
  }
  parseAsync(args, shortCircuit, _parseFn) {
    const maybePromise = this.parse(args, shortCircuit, _parseFn);
    return !isPromise(maybePromise) ? Promise.resolve(maybePromise) : maybePromise;
  }
  parseSync(args, shortCircuit, _parseFn) {
    const maybePromise = this.parse(args, shortCircuit, _parseFn);
    if (isPromise(maybePromise)) {
      throw new YError(".parseSync() must not be used with asynchronous builders, handlers, or middleware");
    }
    return maybePromise;
  }
  parserConfiguration(config) {
    argsert("<object>", [config], arguments.length);
    __classPrivateFieldSet(this, _YargsInstance_parserConfig, config, "f");
    return this;
  }
  pkgConf(key, rootPath) {
    argsert("<string> [string]", [key, rootPath], arguments.length);
    let conf = null;
    const obj = this[kPkgUp](rootPath || __classPrivateFieldGet(this, _YargsInstance_cwd, "f"));
    if (obj[key] && typeof obj[key] === "object") {
      conf = applyExtends(obj[key], rootPath || __classPrivateFieldGet(this, _YargsInstance_cwd, "f"), this[kGetParserConfiguration]()["deep-merge-config"] || false, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
      __classPrivateFieldGet(this, _YargsInstance_options, "f").configObjects = (__classPrivateFieldGet(this, _YargsInstance_options, "f").configObjects || []).concat(conf);
    }
    return this;
  }
  positional(key, opts) {
    argsert("<string> <object>", [key, opts], arguments.length);
    const supportedOpts = [
      "default",
      "defaultDescription",
      "implies",
      "normalize",
      "choices",
      "conflicts",
      "coerce",
      "type",
      "describe",
      "desc",
      "description",
      "alias"
    ];
    opts = objFilter(opts, (k, v) => {
      if (k === "type" && !["string", "number", "boolean"].includes(v))
        return false;
      return supportedOpts.includes(k);
    });
    const fullCommand = __classPrivateFieldGet(this, _YargsInstance_context, "f").fullCommands[__classPrivateFieldGet(this, _YargsInstance_context, "f").fullCommands.length - 1];
    const parseOptions = fullCommand ? __classPrivateFieldGet(this, _YargsInstance_command, "f").cmdToParseOptions(fullCommand) : {
      array: [],
      alias: {},
      default: {},
      demand: {}
    };
    objectKeys(parseOptions).forEach((pk) => {
      const parseOption = parseOptions[pk];
      if (Array.isArray(parseOption)) {
        if (parseOption.indexOf(key) !== -1)
          opts[pk] = true;
      } else {
        if (parseOption[key] && !(pk in opts))
          opts[pk] = parseOption[key];
      }
    });
    this.group(key, __classPrivateFieldGet(this, _YargsInstance_usage, "f").getPositionalGroupName());
    return this.option(key, opts);
  }
  recommendCommands(recommend = true) {
    argsert("[boolean]", [recommend], arguments.length);
    __classPrivateFieldSet(this, _YargsInstance_recommendCommands, recommend, "f");
    return this;
  }
  required(keys2, max, msg) {
    return this.demand(keys2, max, msg);
  }
  require(keys2, max, msg) {
    return this.demand(keys2, max, msg);
  }
  requiresArg(keys2) {
    argsert("<array|string|object> [number]", [keys2], arguments.length);
    if (typeof keys2 === "string" && __classPrivateFieldGet(this, _YargsInstance_options, "f").narg[keys2]) {
      return this;
    } else {
      this[kPopulateParserHintSingleValueDictionary](this.requiresArg.bind(this), "narg", keys2, NaN);
    }
    return this;
  }
  showCompletionScript($0, cmd) {
    argsert("[string] [string]", [$0, cmd], arguments.length);
    $0 = $0 || this.$0;
    __classPrivateFieldGet(this, _YargsInstance_logger, "f").log(__classPrivateFieldGet(this, _YargsInstance_completion, "f").generateCompletionScript($0, cmd || __classPrivateFieldGet(this, _YargsInstance_completionCommand, "f") || "completion"));
    return this;
  }
  showHelp(level) {
    argsert("[string|function]", [level], arguments.length);
    __classPrivateFieldSet(this, _YargsInstance_hasOutput, true, "f");
    if (!__classPrivateFieldGet(this, _YargsInstance_usage, "f").hasCachedHelpMessage()) {
      if (!this.parsed) {
        const parse2 = this[kRunYargsParserAndExecuteCommands](__classPrivateFieldGet(this, _YargsInstance_processArgs, "f"), void 0, void 0, 0, true);
        if (isPromise(parse2)) {
          parse2.then(() => {
            __classPrivateFieldGet(this, _YargsInstance_usage, "f").showHelp(level);
          });
          return this;
        }
      }
      const builderResponse = __classPrivateFieldGet(this, _YargsInstance_command, "f").runDefaultBuilderOn(this);
      if (isPromise(builderResponse)) {
        builderResponse.then(() => {
          __classPrivateFieldGet(this, _YargsInstance_usage, "f").showHelp(level);
        });
        return this;
      }
    }
    __classPrivateFieldGet(this, _YargsInstance_usage, "f").showHelp(level);
    return this;
  }
  scriptName(scriptName) {
    this.customScriptName = true;
    this.$0 = scriptName;
    return this;
  }
  showHelpOnFail(enabled, message) {
    argsert("[boolean|string] [string]", [enabled, message], arguments.length);
    __classPrivateFieldGet(this, _YargsInstance_usage, "f").showHelpOnFail(enabled, message);
    return this;
  }
  showVersion(level) {
    argsert("[string|function]", [level], arguments.length);
    __classPrivateFieldGet(this, _YargsInstance_usage, "f").showVersion(level);
    return this;
  }
  skipValidation(keys2) {
    argsert("<array|string>", [keys2], arguments.length);
    this[kPopulateParserHintArray]("skipValidation", keys2);
    return this;
  }
  strict(enabled) {
    argsert("[boolean]", [enabled], arguments.length);
    __classPrivateFieldSet(this, _YargsInstance_strict, enabled !== false, "f");
    return this;
  }
  strictCommands(enabled) {
    argsert("[boolean]", [enabled], arguments.length);
    __classPrivateFieldSet(this, _YargsInstance_strictCommands, enabled !== false, "f");
    return this;
  }
  strictOptions(enabled) {
    argsert("[boolean]", [enabled], arguments.length);
    __classPrivateFieldSet(this, _YargsInstance_strictOptions, enabled !== false, "f");
    return this;
  }
  string(keys2) {
    argsert("<array|string>", [keys2], arguments.length);
    this[kPopulateParserHintArray]("string", keys2);
    this[kTrackManuallySetKeys](keys2);
    return this;
  }
  terminalWidth() {
    argsert([], 0);
    return __classPrivateFieldGet(this, _YargsInstance_shim, "f").process.stdColumns;
  }
  updateLocale(obj) {
    return this.updateStrings(obj);
  }
  updateStrings(obj) {
    argsert("<object>", [obj], arguments.length);
    __classPrivateFieldSet(this, _YargsInstance_detectLocale, false, "f");
    __classPrivateFieldGet(this, _YargsInstance_shim, "f").y18n.updateLocale(obj);
    return this;
  }
  usage(msg, description, builder, handler) {
    argsert("<string|null|undefined> [string|boolean] [function|object] [function]", [msg, description, builder, handler], arguments.length);
    if (description !== void 0) {
      assertNotStrictEqual(msg, null, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
      if ((msg || "").match(/^\$0( |$)/)) {
        return this.command(msg, description, builder, handler);
      } else {
        throw new YError(".usage() description must start with $0 if being used as alias for .command()");
      }
    } else {
      __classPrivateFieldGet(this, _YargsInstance_usage, "f").usage(msg);
      return this;
    }
  }
  usageConfiguration(config) {
    argsert("<object>", [config], arguments.length);
    __classPrivateFieldSet(this, _YargsInstance_usageConfig, config, "f");
    return this;
  }
  version(opt, msg, ver) {
    const defaultVersionOpt = "version";
    argsert("[boolean|string] [string] [string]", [opt, msg, ver], arguments.length);
    if (__classPrivateFieldGet(this, _YargsInstance_versionOpt, "f")) {
      this[kDeleteFromParserHintObject](__classPrivateFieldGet(this, _YargsInstance_versionOpt, "f"));
      __classPrivateFieldGet(this, _YargsInstance_usage, "f").version(void 0);
      __classPrivateFieldSet(this, _YargsInstance_versionOpt, null, "f");
    }
    if (arguments.length === 0) {
      ver = this[kGuessVersion]();
      opt = defaultVersionOpt;
    } else if (arguments.length === 1) {
      if (opt === false) {
        return this;
      }
      ver = opt;
      opt = defaultVersionOpt;
    } else if (arguments.length === 2) {
      ver = msg;
      msg = void 0;
    }
    __classPrivateFieldSet(this, _YargsInstance_versionOpt, typeof opt === "string" ? opt : defaultVersionOpt, "f");
    msg = msg || __classPrivateFieldGet(this, _YargsInstance_usage, "f").deferY18nLookup("Show version number");
    __classPrivateFieldGet(this, _YargsInstance_usage, "f").version(ver || void 0);
    this.boolean(__classPrivateFieldGet(this, _YargsInstance_versionOpt, "f"));
    this.describe(__classPrivateFieldGet(this, _YargsInstance_versionOpt, "f"), msg);
    return this;
  }
  wrap(cols) {
    argsert("<number|null|undefined>", [cols], arguments.length);
    __classPrivateFieldGet(this, _YargsInstance_usage, "f").wrap(cols);
    return this;
  }
  [(_YargsInstance_command = /* @__PURE__ */ new WeakMap(), _YargsInstance_cwd = /* @__PURE__ */ new WeakMap(), _YargsInstance_context = /* @__PURE__ */ new WeakMap(), _YargsInstance_completion = /* @__PURE__ */ new WeakMap(), _YargsInstance_completionCommand = /* @__PURE__ */ new WeakMap(), _YargsInstance_defaultShowHiddenOpt = /* @__PURE__ */ new WeakMap(), _YargsInstance_exitError = /* @__PURE__ */ new WeakMap(), _YargsInstance_detectLocale = /* @__PURE__ */ new WeakMap(), _YargsInstance_emittedWarnings = /* @__PURE__ */ new WeakMap(), _YargsInstance_exitProcess = /* @__PURE__ */ new WeakMap(), _YargsInstance_frozens = /* @__PURE__ */ new WeakMap(), _YargsInstance_globalMiddleware = /* @__PURE__ */ new WeakMap(), _YargsInstance_groups = /* @__PURE__ */ new WeakMap(), _YargsInstance_hasOutput = /* @__PURE__ */ new WeakMap(), _YargsInstance_helpOpt = /* @__PURE__ */ new WeakMap(), _YargsInstance_isGlobalContext = /* @__PURE__ */ new WeakMap(), _YargsInstance_logger = /* @__PURE__ */ new WeakMap(), _YargsInstance_output = /* @__PURE__ */ new WeakMap(), _YargsInstance_options = /* @__PURE__ */ new WeakMap(), _YargsInstance_parentRequire = /* @__PURE__ */ new WeakMap(), _YargsInstance_parserConfig = /* @__PURE__ */ new WeakMap(), _YargsInstance_parseFn = /* @__PURE__ */ new WeakMap(), _YargsInstance_parseContext = /* @__PURE__ */ new WeakMap(), _YargsInstance_pkgs = /* @__PURE__ */ new WeakMap(), _YargsInstance_preservedGroups = /* @__PURE__ */ new WeakMap(), _YargsInstance_processArgs = /* @__PURE__ */ new WeakMap(), _YargsInstance_recommendCommands = /* @__PURE__ */ new WeakMap(), _YargsInstance_shim = /* @__PURE__ */ new WeakMap(), _YargsInstance_strict = /* @__PURE__ */ new WeakMap(), _YargsInstance_strictCommands = /* @__PURE__ */ new WeakMap(), _YargsInstance_strictOptions = /* @__PURE__ */ new WeakMap(), _YargsInstance_usage = /* @__PURE__ */ new WeakMap(), _YargsInstance_usageConfig = /* @__PURE__ */ new WeakMap(), _YargsInstance_versionOpt = /* @__PURE__ */ new WeakMap(), _YargsInstance_validation = /* @__PURE__ */ new WeakMap(), kCopyDoubleDash)](argv) {
    if (!argv._ || !argv["--"])
      return argv;
    argv._.push.apply(argv._, argv["--"]);
    try {
      delete argv["--"];
    } catch (_err) {
    }
    return argv;
  }
  [kCreateLogger]() {
    return {
      log: (...args) => {
        if (!this[kHasParseCallback]())
          console.log(...args);
        __classPrivateFieldSet(this, _YargsInstance_hasOutput, true, "f");
        if (__classPrivateFieldGet(this, _YargsInstance_output, "f").length)
          __classPrivateFieldSet(this, _YargsInstance_output, __classPrivateFieldGet(this, _YargsInstance_output, "f") + "\n", "f");
        __classPrivateFieldSet(this, _YargsInstance_output, __classPrivateFieldGet(this, _YargsInstance_output, "f") + args.join(" "), "f");
      },
      error: (...args) => {
        if (!this[kHasParseCallback]())
          console.error(...args);
        __classPrivateFieldSet(this, _YargsInstance_hasOutput, true, "f");
        if (__classPrivateFieldGet(this, _YargsInstance_output, "f").length)
          __classPrivateFieldSet(this, _YargsInstance_output, __classPrivateFieldGet(this, _YargsInstance_output, "f") + "\n", "f");
        __classPrivateFieldSet(this, _YargsInstance_output, __classPrivateFieldGet(this, _YargsInstance_output, "f") + args.join(" "), "f");
      }
    };
  }
  [kDeleteFromParserHintObject](optionKey) {
    objectKeys(__classPrivateFieldGet(this, _YargsInstance_options, "f")).forEach((hintKey) => {
      if (/* @__PURE__ */ ((key) => key === "configObjects")(hintKey))
        return;
      const hint = __classPrivateFieldGet(this, _YargsInstance_options, "f")[hintKey];
      if (Array.isArray(hint)) {
        if (hint.includes(optionKey))
          hint.splice(hint.indexOf(optionKey), 1);
      } else if (typeof hint === "object") {
        delete hint[optionKey];
      }
    });
    delete __classPrivateFieldGet(this, _YargsInstance_usage, "f").getDescriptions()[optionKey];
  }
  [kEmitWarning](warning, type, deduplicationId) {
    if (!__classPrivateFieldGet(this, _YargsInstance_emittedWarnings, "f")[deduplicationId]) {
      __classPrivateFieldGet(this, _YargsInstance_shim, "f").process.emitWarning(warning, type);
      __classPrivateFieldGet(this, _YargsInstance_emittedWarnings, "f")[deduplicationId] = true;
    }
  }
  [kFreeze]() {
    __classPrivateFieldGet(this, _YargsInstance_frozens, "f").push({
      options: __classPrivateFieldGet(this, _YargsInstance_options, "f"),
      configObjects: __classPrivateFieldGet(this, _YargsInstance_options, "f").configObjects.slice(0),
      exitProcess: __classPrivateFieldGet(this, _YargsInstance_exitProcess, "f"),
      groups: __classPrivateFieldGet(this, _YargsInstance_groups, "f"),
      strict: __classPrivateFieldGet(this, _YargsInstance_strict, "f"),
      strictCommands: __classPrivateFieldGet(this, _YargsInstance_strictCommands, "f"),
      strictOptions: __classPrivateFieldGet(this, _YargsInstance_strictOptions, "f"),
      completionCommand: __classPrivateFieldGet(this, _YargsInstance_completionCommand, "f"),
      output: __classPrivateFieldGet(this, _YargsInstance_output, "f"),
      exitError: __classPrivateFieldGet(this, _YargsInstance_exitError, "f"),
      hasOutput: __classPrivateFieldGet(this, _YargsInstance_hasOutput, "f"),
      parsed: this.parsed,
      parseFn: __classPrivateFieldGet(this, _YargsInstance_parseFn, "f"),
      parseContext: __classPrivateFieldGet(this, _YargsInstance_parseContext, "f")
    });
    __classPrivateFieldGet(this, _YargsInstance_usage, "f").freeze();
    __classPrivateFieldGet(this, _YargsInstance_validation, "f").freeze();
    __classPrivateFieldGet(this, _YargsInstance_command, "f").freeze();
    __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f").freeze();
  }
  [kGetDollarZero]() {
    let $0 = "";
    let default$0;
    if (/\b(node|iojs|electron)(\.exe)?$/.test(__classPrivateFieldGet(this, _YargsInstance_shim, "f").process.argv()[0])) {
      default$0 = __classPrivateFieldGet(this, _YargsInstance_shim, "f").process.argv().slice(1, 2);
    } else {
      default$0 = __classPrivateFieldGet(this, _YargsInstance_shim, "f").process.argv().slice(0, 1);
    }
    $0 = default$0.map((x) => {
      const b = this[kRebase](__classPrivateFieldGet(this, _YargsInstance_cwd, "f"), x);
      return x.match(/^(\/|([a-zA-Z]:)?\\)/) && b.length < x.length ? b : x;
    }).join(" ").trim();
    if (__classPrivateFieldGet(this, _YargsInstance_shim, "f").getEnv("_") && __classPrivateFieldGet(this, _YargsInstance_shim, "f").getProcessArgvBin() === __classPrivateFieldGet(this, _YargsInstance_shim, "f").getEnv("_")) {
      $0 = __classPrivateFieldGet(this, _YargsInstance_shim, "f").getEnv("_").replace(`${__classPrivateFieldGet(this, _YargsInstance_shim, "f").path.dirname(__classPrivateFieldGet(this, _YargsInstance_shim, "f").process.execPath())}/`, "");
    }
    return $0;
  }
  [kGetParserConfiguration]() {
    return __classPrivateFieldGet(this, _YargsInstance_parserConfig, "f");
  }
  [kGetUsageConfiguration]() {
    return __classPrivateFieldGet(this, _YargsInstance_usageConfig, "f");
  }
  [kGuessLocale]() {
    if (!__classPrivateFieldGet(this, _YargsInstance_detectLocale, "f"))
      return;
    const locale = __classPrivateFieldGet(this, _YargsInstance_shim, "f").getEnv("LC_ALL") || __classPrivateFieldGet(this, _YargsInstance_shim, "f").getEnv("LC_MESSAGES") || __classPrivateFieldGet(this, _YargsInstance_shim, "f").getEnv("LANG") || __classPrivateFieldGet(this, _YargsInstance_shim, "f").getEnv("LANGUAGE") || "en_US";
    this.locale(locale.replace(/[.:].*/, ""));
  }
  [kGuessVersion]() {
    const obj = this[kPkgUp]();
    return obj.version || "unknown";
  }
  [kParsePositionalNumbers](argv) {
    const args = argv["--"] ? argv["--"] : argv._;
    for (let i = 0, arg; (arg = args[i]) !== void 0; i++) {
      if (__classPrivateFieldGet(this, _YargsInstance_shim, "f").Parser.looksLikeNumber(arg) && Number.isSafeInteger(Math.floor(parseFloat(`${arg}`)))) {
        args[i] = Number(arg);
      }
    }
    return argv;
  }
  [kPkgUp](rootPath) {
    const npath = rootPath || "*";
    if (__classPrivateFieldGet(this, _YargsInstance_pkgs, "f")[npath])
      return __classPrivateFieldGet(this, _YargsInstance_pkgs, "f")[npath];
    let obj = {};
    try {
      let startDir = rootPath || __classPrivateFieldGet(this, _YargsInstance_shim, "f").mainFilename;
      if (!rootPath && __classPrivateFieldGet(this, _YargsInstance_shim, "f").path.extname(startDir)) {
        startDir = __classPrivateFieldGet(this, _YargsInstance_shim, "f").path.dirname(startDir);
      }
      const pkgJsonPath = __classPrivateFieldGet(this, _YargsInstance_shim, "f").findUp(startDir, (dir, names) => {
        if (names.includes("package.json")) {
          return "package.json";
        } else {
          return void 0;
        }
      });
      assertNotStrictEqual(pkgJsonPath, void 0, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
      obj = JSON.parse(__classPrivateFieldGet(this, _YargsInstance_shim, "f").readFileSync(pkgJsonPath, "utf8"));
    } catch (_noop) {
    }
    __classPrivateFieldGet(this, _YargsInstance_pkgs, "f")[npath] = obj || {};
    return __classPrivateFieldGet(this, _YargsInstance_pkgs, "f")[npath];
  }
  [kPopulateParserHintArray](type, keys2) {
    keys2 = [].concat(keys2);
    keys2.forEach((key) => {
      key = this[kSanitizeKey](key);
      __classPrivateFieldGet(this, _YargsInstance_options, "f")[type].push(key);
    });
  }
  [kPopulateParserHintSingleValueDictionary](builder, type, key, value) {
    this[kPopulateParserHintDictionary](builder, type, key, value, (type2, key2, value2) => {
      __classPrivateFieldGet(this, _YargsInstance_options, "f")[type2][key2] = value2;
    });
  }
  [kPopulateParserHintArrayDictionary](builder, type, key, value) {
    this[kPopulateParserHintDictionary](builder, type, key, value, (type2, key2, value2) => {
      __classPrivateFieldGet(this, _YargsInstance_options, "f")[type2][key2] = (__classPrivateFieldGet(this, _YargsInstance_options, "f")[type2][key2] || []).concat(value2);
    });
  }
  [kPopulateParserHintDictionary](builder, type, key, value, singleKeyHandler) {
    if (Array.isArray(key)) {
      key.forEach((k) => {
        builder(k, value);
      });
    } else if (/* @__PURE__ */ ((key2) => typeof key2 === "object")(key)) {
      for (const k of objectKeys(key)) {
        builder(k, key[k]);
      }
    } else {
      singleKeyHandler(type, this[kSanitizeKey](key), value);
    }
  }
  [kSanitizeKey](key) {
    if (key === "__proto__")
      return "___proto___";
    return key;
  }
  [kSetKey](key, set) {
    this[kPopulateParserHintSingleValueDictionary](this[kSetKey].bind(this), "key", key, set);
    return this;
  }
  [kUnfreeze]() {
    var _a2, _b2, _c2, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const frozen = __classPrivateFieldGet(this, _YargsInstance_frozens, "f").pop();
    assertNotStrictEqual(frozen, void 0, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
    let configObjects;
    _a2 = this, _b2 = this, _c2 = this, _d = this, _e = this, _f = this, _g = this, _h = this, _j = this, _k = this, _l = this, _m = this, {
      options: { set value(_o) {
        __classPrivateFieldSet(_a2, _YargsInstance_options, _o, "f");
      } }.value,
      configObjects,
      exitProcess: { set value(_o) {
        __classPrivateFieldSet(_b2, _YargsInstance_exitProcess, _o, "f");
      } }.value,
      groups: { set value(_o) {
        __classPrivateFieldSet(_c2, _YargsInstance_groups, _o, "f");
      } }.value,
      output: { set value(_o) {
        __classPrivateFieldSet(_d, _YargsInstance_output, _o, "f");
      } }.value,
      exitError: { set value(_o) {
        __classPrivateFieldSet(_e, _YargsInstance_exitError, _o, "f");
      } }.value,
      hasOutput: { set value(_o) {
        __classPrivateFieldSet(_f, _YargsInstance_hasOutput, _o, "f");
      } }.value,
      parsed: this.parsed,
      strict: { set value(_o) {
        __classPrivateFieldSet(_g, _YargsInstance_strict, _o, "f");
      } }.value,
      strictCommands: { set value(_o) {
        __classPrivateFieldSet(_h, _YargsInstance_strictCommands, _o, "f");
      } }.value,
      strictOptions: { set value(_o) {
        __classPrivateFieldSet(_j, _YargsInstance_strictOptions, _o, "f");
      } }.value,
      completionCommand: { set value(_o) {
        __classPrivateFieldSet(_k, _YargsInstance_completionCommand, _o, "f");
      } }.value,
      parseFn: { set value(_o) {
        __classPrivateFieldSet(_l, _YargsInstance_parseFn, _o, "f");
      } }.value,
      parseContext: { set value(_o) {
        __classPrivateFieldSet(_m, _YargsInstance_parseContext, _o, "f");
      } }.value
    } = frozen;
    __classPrivateFieldGet(this, _YargsInstance_options, "f").configObjects = configObjects;
    __classPrivateFieldGet(this, _YargsInstance_usage, "f").unfreeze();
    __classPrivateFieldGet(this, _YargsInstance_validation, "f").unfreeze();
    __classPrivateFieldGet(this, _YargsInstance_command, "f").unfreeze();
    __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f").unfreeze();
  }
  [kValidateAsync](validation2, argv) {
    return maybeAsyncResult(argv, (result) => {
      validation2(result);
      return result;
    });
  }
  getInternalMethods() {
    return {
      getCommandInstance: this[kGetCommandInstance].bind(this),
      getContext: this[kGetContext].bind(this),
      getHasOutput: this[kGetHasOutput].bind(this),
      getLoggerInstance: this[kGetLoggerInstance].bind(this),
      getParseContext: this[kGetParseContext].bind(this),
      getParserConfiguration: this[kGetParserConfiguration].bind(this),
      getUsageConfiguration: this[kGetUsageConfiguration].bind(this),
      getUsageInstance: this[kGetUsageInstance].bind(this),
      getValidationInstance: this[kGetValidationInstance].bind(this),
      hasParseCallback: this[kHasParseCallback].bind(this),
      isGlobalContext: this[kIsGlobalContext].bind(this),
      postProcess: this[kPostProcess].bind(this),
      reset: this[kReset].bind(this),
      runValidation: this[kRunValidation].bind(this),
      runYargsParserAndExecuteCommands: this[kRunYargsParserAndExecuteCommands].bind(this),
      setHasOutput: this[kSetHasOutput].bind(this)
    };
  }
  [kGetCommandInstance]() {
    return __classPrivateFieldGet(this, _YargsInstance_command, "f");
  }
  [kGetContext]() {
    return __classPrivateFieldGet(this, _YargsInstance_context, "f");
  }
  [kGetHasOutput]() {
    return __classPrivateFieldGet(this, _YargsInstance_hasOutput, "f");
  }
  [kGetLoggerInstance]() {
    return __classPrivateFieldGet(this, _YargsInstance_logger, "f");
  }
  [kGetParseContext]() {
    return __classPrivateFieldGet(this, _YargsInstance_parseContext, "f") || {};
  }
  [kGetUsageInstance]() {
    return __classPrivateFieldGet(this, _YargsInstance_usage, "f");
  }
  [kGetValidationInstance]() {
    return __classPrivateFieldGet(this, _YargsInstance_validation, "f");
  }
  [kHasParseCallback]() {
    return !!__classPrivateFieldGet(this, _YargsInstance_parseFn, "f");
  }
  [kIsGlobalContext]() {
    return __classPrivateFieldGet(this, _YargsInstance_isGlobalContext, "f");
  }
  [kPostProcess](argv, populateDoubleDash, calledFromCommand, runGlobalMiddleware) {
    if (calledFromCommand)
      return argv;
    if (isPromise(argv))
      return argv;
    if (!populateDoubleDash) {
      argv = this[kCopyDoubleDash](argv);
    }
    const parsePositionalNumbers = this[kGetParserConfiguration]()["parse-positional-numbers"] || this[kGetParserConfiguration]()["parse-positional-numbers"] === void 0;
    if (parsePositionalNumbers) {
      argv = this[kParsePositionalNumbers](argv);
    }
    if (runGlobalMiddleware) {
      argv = applyMiddleware(argv, this, __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f").getMiddleware(), false);
    }
    return argv;
  }
  [kReset](aliases = {}) {
    __classPrivateFieldSet(this, _YargsInstance_options, __classPrivateFieldGet(this, _YargsInstance_options, "f") || {}, "f");
    const tmpOptions = {};
    tmpOptions.local = __classPrivateFieldGet(this, _YargsInstance_options, "f").local || [];
    tmpOptions.configObjects = __classPrivateFieldGet(this, _YargsInstance_options, "f").configObjects || [];
    const localLookup = {};
    tmpOptions.local.forEach((l) => {
      localLookup[l] = true;
      (aliases[l] || []).forEach((a) => {
        localLookup[a] = true;
      });
    });
    Object.assign(__classPrivateFieldGet(this, _YargsInstance_preservedGroups, "f"), Object.keys(__classPrivateFieldGet(this, _YargsInstance_groups, "f")).reduce((acc, groupName) => {
      const keys2 = __classPrivateFieldGet(this, _YargsInstance_groups, "f")[groupName].filter((key) => !(key in localLookup));
      if (keys2.length > 0) {
        acc[groupName] = keys2;
      }
      return acc;
    }, {}));
    __classPrivateFieldSet(this, _YargsInstance_groups, {}, "f");
    const arrayOptions = [
      "array",
      "boolean",
      "string",
      "skipValidation",
      "count",
      "normalize",
      "number",
      "hiddenOptions"
    ];
    const objectOptions = [
      "narg",
      "key",
      "alias",
      "default",
      "defaultDescription",
      "config",
      "choices",
      "demandedOptions",
      "demandedCommands",
      "deprecatedOptions"
    ];
    arrayOptions.forEach((k) => {
      tmpOptions[k] = (__classPrivateFieldGet(this, _YargsInstance_options, "f")[k] || []).filter((k2) => !localLookup[k2]);
    });
    objectOptions.forEach((k) => {
      tmpOptions[k] = objFilter(__classPrivateFieldGet(this, _YargsInstance_options, "f")[k], (k2) => !localLookup[k2]);
    });
    tmpOptions.envPrefix = __classPrivateFieldGet(this, _YargsInstance_options, "f").envPrefix;
    __classPrivateFieldSet(this, _YargsInstance_options, tmpOptions, "f");
    __classPrivateFieldSet(this, _YargsInstance_usage, __classPrivateFieldGet(this, _YargsInstance_usage, "f") ? __classPrivateFieldGet(this, _YargsInstance_usage, "f").reset(localLookup) : usage(this, __classPrivateFieldGet(this, _YargsInstance_shim, "f")), "f");
    __classPrivateFieldSet(this, _YargsInstance_validation, __classPrivateFieldGet(this, _YargsInstance_validation, "f") ? __classPrivateFieldGet(this, _YargsInstance_validation, "f").reset(localLookup) : validation(this, __classPrivateFieldGet(this, _YargsInstance_usage, "f"), __classPrivateFieldGet(this, _YargsInstance_shim, "f")), "f");
    __classPrivateFieldSet(this, _YargsInstance_command, __classPrivateFieldGet(this, _YargsInstance_command, "f") ? __classPrivateFieldGet(this, _YargsInstance_command, "f").reset() : command(__classPrivateFieldGet(this, _YargsInstance_usage, "f"), __classPrivateFieldGet(this, _YargsInstance_validation, "f"), __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f"), __classPrivateFieldGet(this, _YargsInstance_shim, "f")), "f");
    if (!__classPrivateFieldGet(this, _YargsInstance_completion, "f"))
      __classPrivateFieldSet(this, _YargsInstance_completion, completion(this, __classPrivateFieldGet(this, _YargsInstance_usage, "f"), __classPrivateFieldGet(this, _YargsInstance_command, "f"), __classPrivateFieldGet(this, _YargsInstance_shim, "f")), "f");
    __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f").reset();
    __classPrivateFieldSet(this, _YargsInstance_completionCommand, null, "f");
    __classPrivateFieldSet(this, _YargsInstance_output, "", "f");
    __classPrivateFieldSet(this, _YargsInstance_exitError, null, "f");
    __classPrivateFieldSet(this, _YargsInstance_hasOutput, false, "f");
    this.parsed = false;
    return this;
  }
  [kRebase](base, dir) {
    return __classPrivateFieldGet(this, _YargsInstance_shim, "f").path.relative(base, dir);
  }
  [kRunYargsParserAndExecuteCommands](args, shortCircuit, calledFromCommand, commandIndex = 0, helpOnly = false) {
    let skipValidation = !!calledFromCommand || helpOnly;
    args = args || __classPrivateFieldGet(this, _YargsInstance_processArgs, "f");
    __classPrivateFieldGet(this, _YargsInstance_options, "f").__ = __classPrivateFieldGet(this, _YargsInstance_shim, "f").y18n.__;
    __classPrivateFieldGet(this, _YargsInstance_options, "f").configuration = this[kGetParserConfiguration]();
    const populateDoubleDash = !!__classPrivateFieldGet(this, _YargsInstance_options, "f").configuration["populate--"];
    const config = Object.assign({}, __classPrivateFieldGet(this, _YargsInstance_options, "f").configuration, {
      "populate--": true
    });
    const parsed = __classPrivateFieldGet(this, _YargsInstance_shim, "f").Parser.detailed(args, Object.assign({}, __classPrivateFieldGet(this, _YargsInstance_options, "f"), {
      configuration: { "parse-positional-numbers": false, ...config }
    }));
    const argv = Object.assign(parsed.argv, __classPrivateFieldGet(this, _YargsInstance_parseContext, "f"));
    let argvPromise = void 0;
    const aliases = parsed.aliases;
    let helpOptSet = false;
    let versionOptSet = false;
    Object.keys(argv).forEach((key) => {
      if (key === __classPrivateFieldGet(this, _YargsInstance_helpOpt, "f") && argv[key]) {
        helpOptSet = true;
      } else if (key === __classPrivateFieldGet(this, _YargsInstance_versionOpt, "f") && argv[key]) {
        versionOptSet = true;
      }
    });
    argv.$0 = this.$0;
    this.parsed = parsed;
    if (commandIndex === 0) {
      __classPrivateFieldGet(this, _YargsInstance_usage, "f").clearCachedHelpMessage();
    }
    try {
      this[kGuessLocale]();
      if (shortCircuit) {
        return this[kPostProcess](argv, populateDoubleDash, !!calledFromCommand, false);
      }
      if (__classPrivateFieldGet(this, _YargsInstance_helpOpt, "f")) {
        const helpCmds = [__classPrivateFieldGet(this, _YargsInstance_helpOpt, "f")].concat(aliases[__classPrivateFieldGet(this, _YargsInstance_helpOpt, "f")] || []).filter((k) => k.length > 1);
        if (helpCmds.includes("" + argv._[argv._.length - 1])) {
          argv._.pop();
          helpOptSet = true;
        }
      }
      __classPrivateFieldSet(this, _YargsInstance_isGlobalContext, false, "f");
      const handlerKeys = __classPrivateFieldGet(this, _YargsInstance_command, "f").getCommands();
      const requestCompletions = __classPrivateFieldGet(this, _YargsInstance_completion, "f").completionKey in argv;
      const skipRecommendation = helpOptSet || requestCompletions || helpOnly;
      if (argv._.length) {
        if (handlerKeys.length) {
          let firstUnknownCommand;
          for (let i = commandIndex || 0, cmd; argv._[i] !== void 0; i++) {
            cmd = String(argv._[i]);
            if (handlerKeys.includes(cmd) && cmd !== __classPrivateFieldGet(this, _YargsInstance_completionCommand, "f")) {
              const innerArgv = __classPrivateFieldGet(this, _YargsInstance_command, "f").runCommand(cmd, this, parsed, i + 1, helpOnly, helpOptSet || versionOptSet || helpOnly);
              return this[kPostProcess](innerArgv, populateDoubleDash, !!calledFromCommand, false);
            } else if (!firstUnknownCommand && cmd !== __classPrivateFieldGet(this, _YargsInstance_completionCommand, "f")) {
              firstUnknownCommand = cmd;
              break;
            }
          }
          if (!__classPrivateFieldGet(this, _YargsInstance_command, "f").hasDefaultCommand() && __classPrivateFieldGet(this, _YargsInstance_recommendCommands, "f") && firstUnknownCommand && !skipRecommendation) {
            __classPrivateFieldGet(this, _YargsInstance_validation, "f").recommendCommands(firstUnknownCommand, handlerKeys);
          }
        }
        if (__classPrivateFieldGet(this, _YargsInstance_completionCommand, "f") && argv._.includes(__classPrivateFieldGet(this, _YargsInstance_completionCommand, "f")) && !requestCompletions) {
          if (__classPrivateFieldGet(this, _YargsInstance_exitProcess, "f"))
            setBlocking(true);
          this.showCompletionScript();
          this.exit(0);
        }
      }
      if (__classPrivateFieldGet(this, _YargsInstance_command, "f").hasDefaultCommand() && !skipRecommendation) {
        const innerArgv = __classPrivateFieldGet(this, _YargsInstance_command, "f").runCommand(null, this, parsed, 0, helpOnly, helpOptSet || versionOptSet || helpOnly);
        return this[kPostProcess](innerArgv, populateDoubleDash, !!calledFromCommand, false);
      }
      if (requestCompletions) {
        if (__classPrivateFieldGet(this, _YargsInstance_exitProcess, "f"))
          setBlocking(true);
        args = [].concat(args);
        const completionArgs = args.slice(args.indexOf(`--${__classPrivateFieldGet(this, _YargsInstance_completion, "f").completionKey}`) + 1);
        __classPrivateFieldGet(this, _YargsInstance_completion, "f").getCompletion(completionArgs, (err, completions) => {
          if (err)
            throw new YError(err.message);
          (completions || []).forEach((completion2) => {
            __classPrivateFieldGet(this, _YargsInstance_logger, "f").log(completion2);
          });
          this.exit(0);
        });
        return this[kPostProcess](argv, !populateDoubleDash, !!calledFromCommand, false);
      }
      if (!__classPrivateFieldGet(this, _YargsInstance_hasOutput, "f")) {
        if (helpOptSet) {
          if (__classPrivateFieldGet(this, _YargsInstance_exitProcess, "f"))
            setBlocking(true);
          skipValidation = true;
          this.showHelp("log");
          this.exit(0);
        } else if (versionOptSet) {
          if (__classPrivateFieldGet(this, _YargsInstance_exitProcess, "f"))
            setBlocking(true);
          skipValidation = true;
          __classPrivateFieldGet(this, _YargsInstance_usage, "f").showVersion("log");
          this.exit(0);
        }
      }
      if (!skipValidation && __classPrivateFieldGet(this, _YargsInstance_options, "f").skipValidation.length > 0) {
        skipValidation = Object.keys(argv).some((key) => __classPrivateFieldGet(this, _YargsInstance_options, "f").skipValidation.indexOf(key) >= 0 && argv[key] === true);
      }
      if (!skipValidation) {
        if (parsed.error)
          throw new YError(parsed.error.message);
        if (!requestCompletions) {
          const validation2 = this[kRunValidation](aliases, {}, parsed.error);
          if (!calledFromCommand) {
            argvPromise = applyMiddleware(argv, this, __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f").getMiddleware(), true);
          }
          argvPromise = this[kValidateAsync](validation2, argvPromise !== null && argvPromise !== void 0 ? argvPromise : argv);
          if (isPromise(argvPromise) && !calledFromCommand) {
            argvPromise = argvPromise.then(() => {
              return applyMiddleware(argv, this, __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f").getMiddleware(), false);
            });
          }
        }
      }
    } catch (err) {
      if (err instanceof YError)
        __classPrivateFieldGet(this, _YargsInstance_usage, "f").fail(err.message, err);
      else
        throw err;
    }
    return this[kPostProcess](argvPromise !== null && argvPromise !== void 0 ? argvPromise : argv, populateDoubleDash, !!calledFromCommand, true);
  }
  [kRunValidation](aliases, positionalMap, parseErrors, isDefaultCommand) {
    const demandedOptions = { ...this.getDemandedOptions() };
    return (argv) => {
      if (parseErrors)
        throw new YError(parseErrors.message);
      __classPrivateFieldGet(this, _YargsInstance_validation, "f").nonOptionCount(argv);
      __classPrivateFieldGet(this, _YargsInstance_validation, "f").requiredArguments(argv, demandedOptions);
      let failedStrictCommands = false;
      if (__classPrivateFieldGet(this, _YargsInstance_strictCommands, "f")) {
        failedStrictCommands = __classPrivateFieldGet(this, _YargsInstance_validation, "f").unknownCommands(argv);
      }
      if (__classPrivateFieldGet(this, _YargsInstance_strict, "f") && !failedStrictCommands) {
        __classPrivateFieldGet(this, _YargsInstance_validation, "f").unknownArguments(argv, aliases, positionalMap, !!isDefaultCommand);
      } else if (__classPrivateFieldGet(this, _YargsInstance_strictOptions, "f")) {
        __classPrivateFieldGet(this, _YargsInstance_validation, "f").unknownArguments(argv, aliases, {}, false, false);
      }
      __classPrivateFieldGet(this, _YargsInstance_validation, "f").limitedChoices(argv);
      __classPrivateFieldGet(this, _YargsInstance_validation, "f").implications(argv);
      __classPrivateFieldGet(this, _YargsInstance_validation, "f").conflicting(argv);
    };
  }
  [kSetHasOutput]() {
    __classPrivateFieldSet(this, _YargsInstance_hasOutput, true, "f");
  }
  [kTrackManuallySetKeys](keys2) {
    if (typeof keys2 === "string") {
      __classPrivateFieldGet(this, _YargsInstance_options, "f").key[keys2] = true;
    } else {
      for (const k of keys2) {
        __classPrivateFieldGet(this, _YargsInstance_options, "f").key[k] = true;
      }
    }
  }
};
function isYargsInstance(y) {
  return !!y && typeof y.getInternalMethods === "function";
}

// node_modules/yargs/index.mjs
var Yargs = YargsFactory(esm_default);
var yargs_default = Yargs;

// lib/cli/main.js
init_docs();
init_style();
init_host();
var usageError = (message) => {
  const err = new Error(message);
  err.code = "EUSAGE";
  return err;
};
var openShell = async ({ iface }) => {
  const { startRepl: startRepl2, promptFor: promptFor2 } = await Promise.resolve().then(() => (init_repl(), repl_exports));
  const { otw: otw2 } = await Promise.resolve().then(() => (init_wire(), wire_exports));
  const prompt = await promptFor2(otw2({ iface }));
  await startRepl2({ iface, version: packageVersion(), prompt }).finished;
};
var runScript = async ({ iface, file, scriptArguments }) => {
  const { runFile: runFile2 } = await Promise.resolve().then(() => (init_run(), run_exports));
  await runFile2(file, { iface, scriptArguments });
};
var printDocs2 = ({ protocol }) => {
  console.log(renderDocs(protocol, { color: colorsWanted() }));
};
var updateItself = async () => {
  await update();
};
var commandLine = (argv, handlers = { openShell, runScript, printDocs: printDocs2, updateItself }) => {
  return yargs_default(argv).scriptName("otw").parserConfiguration({ "halt-at-non-option": true }).usage("$0 [options]                    start the interactive shell").usage("$0 [options] <file> [args...]   run a script with wire and the protocol constants as globals").usage("$0 docs [protocol]              describe a protocol: fields, constants, filter support").usage("$0 update                       replace this otw with the latest release").option("iface", {
    alias: "i",
    type: "string",
    requiresArg: true,
    describe: "interface to use, otherwise chosen by the routing table"
  }).version(packageVersion()).alias("version", "v").help().alias("help", "h").strictOptions().exitProcess(false).wrap(null).fail((message, err) => {
    if (err === void 0 || err === null || err.name === "YError") {
      throw usageError(message ?? err.message);
    }
    throw err;
  }).command({
    command: "$0",
    describe: false,
    handler: ({ iface = null, _: positionals }) => {
      const [first2, ...rest] = positionals.map(String);
      if (first2 === void 0) {
        return handlers.openShell({ iface });
      }
      if (first2 === "docs") {
        return handlers.printDocs({ protocol: rest[0] });
      }
      if (first2 === "update") {
        return handlers.updateItself();
      }
      return handlers.runScript({ iface, file: first2, scriptArguments: rest });
    }
  });
};
var main = async (argv = process.argv.slice(2), handlers) => {
  await commandLine(argv, handlers).parseAsync();
};
var mainOrExit = async (argv) => {
  try {
    await main(argv);
  } catch (err) {
    if (err.code === "EUSAGE" || err.code === "EUNKNOWNPROTOCOL" || err.code === "EUNSUPPORTEDOS") {
      console.error(`otw: ${err.message}`);
    } else {
      console.error(err);
    }
    process.exitCode = 1;
  }
};

// standalone/entry.js
var ARGUMENTS_START = 1;
mainOrExit(process.argv.slice(ARGUMENTS_START));
