import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

globalThis.require = require;

const bindings = require('bindings')('over-the-wire');

export default bindings;
