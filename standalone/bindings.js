import { createRequire } from 'node:module';

const LINKED_BINDING = 'over_the_wire';

globalThis.require = createRequire(process.execPath);

const bindings = process._linkedBinding(LINKED_BINDING);

export default bindings;
