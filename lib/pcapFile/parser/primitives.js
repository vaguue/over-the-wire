'use strict';

const {
  READ_U8,
  READ_U16,
  READ_U32,
  READ_I32,
  READ_U32_LE,
  READ_BYTES,
  SKIP,
  HAS_BYTES,
  SET_ENDIAN,
  PUSH,
  EMIT_EVENT,
  CONTEXT,
} = require('./ops');

/*
 * All primitives are plain frozen objects. Single-shape singletons go through
 * V8 inline caches with no allocation; parameterised ones (`bytes(n)`,
 * `emit(name, value)`) allocate one tiny object per call.
 */

const u8     = Object.freeze({ tag: READ_U8 });
const u16    = Object.freeze({ tag: READ_U16 });
const u32    = Object.freeze({ tag: READ_U32 });
const i32    = Object.freeze({ tag: READ_I32 });
const u32le  = Object.freeze({ tag: READ_U32_LE });
const context = Object.freeze({ tag: CONTEXT });

const setEndian = (e) => ({ tag: SET_ENDIAN, e });
const bytes     = (n) => ({ tag: READ_BYTES, n });
const skip      = (n) => ({ tag: SKIP, n });
const hasBytes  = (n) => ({ tag: HAS_BYTES, n });
const push      = (value) => ({ tag: PUSH, value });
const emit      = (event, value) => ({ tag: EMIT_EVENT, event, value });

module.exports = {
  u8, u16, u32, i32, u32le,
  context,
  setEndian, bytes, skip, hasBytes, push, emit,
};
