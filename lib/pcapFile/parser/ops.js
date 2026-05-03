'use strict';

/*
 * Op tags for the parser engine.
 *
 * A primitive yielded from a `do_(function*)` parser is just a plain object
 * carrying one of these tags. The engine dispatches in a tight switch.
 */

const READ_U8        = 1;
const READ_U16       = 2;
const READ_U32       = 3;
const READ_I32       = 4;
const READ_U32_LE    = 5;
const READ_BYTES     = 6;
const READ_STRUCT    = 7;
const SKIP           = 8;
const HAS_BYTES      = 9;
const SET_ENDIAN     = 10;
const PUSH           = 11;
const EMIT_EVENT     = 12;
const CONTEXT        = 13;

module.exports = {
  READ_U8,
  READ_U16,
  READ_U32,
  READ_I32,
  READ_U32_LE,
  READ_BYTES,
  READ_STRUCT,
  SKIP,
  HAS_BYTES,
  SET_ENDIAN,
  PUSH,
  EMIT_EVENT,
  CONTEXT,
};
