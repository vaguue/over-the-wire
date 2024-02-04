/**
 * Enum for OSI model layers.
 * @readonly
 * @enum {number}
 */
const OsiModelLayers = {
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
  Unknown: 8,
};

module.exports = { OsiModelLayers };
