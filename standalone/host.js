import fs from 'node:fs';
import os from 'node:os';
import nodeModule from 'node:module';
import { spawnSync } from 'node:child_process';

import * as packageExports from '#lib/index';

const PACKAGE_NAME = 'over-the-wire';
const PACKAGE_URL = 'over-the-wire:package';
const PACKAGE_SLOT = Symbol.for(PACKAGE_NAME);
const DEFAULT_RELEASES = 'https://github.com/vaguue/over-the-wire/releases/latest/download';
const EXECUTABLE = 0o755;

const SYSTEM_NAMES = {
  darwin: 'macos',
  linux: 'linux',
};

let packageIsExposed = false;

const packageVersion = () => {
  return OVER_THE_WIRE_VERSION;
};

const packageSource = () => {
  const names = Object.keys(packageExports).filter(name => name !== 'default');

  return [
    `const loaded = globalThis[Symbol.for(${JSON.stringify(PACKAGE_NAME)})];`,
    'export default loaded.default;',
    `export const { ${names.join(', ')} } = loaded;`,
  ].join('\n');
};

const exposePackage = () => {
  if (packageIsExposed) {
    return true;
  }

  const source = packageSource();
  globalThis[PACKAGE_SLOT] = packageExports;

  nodeModule.registerHooks({
    resolve(specifier, context, nextResolve) {
      if (specifier === PACKAGE_NAME) {
        return { url: PACKAGE_URL, format: 'module', shortCircuit: true };
      }

      return nextResolve(specifier, context);
    },
    load(url, context, nextLoad) {
      if (url === PACKAGE_URL) {
        return { format: 'module', source, shortCircuit: true };
      }

      return nextLoad(url, context);
    },
  });

  packageIsExposed = true;
  return true;
};

const importScript = (url) => {
  return import(url);
};

const releaseAsset = (platform = os.platform(), arch = os.arch()) => {
  const system = SYSTEM_NAMES[platform];

  if (system === undefined) {
    const err = new Error(`There is no standalone otw for ${platform}`);
    err.code = 'ENOTSUPPORTED';
    throw err;
  }

  return `otw-${system}-${arch}`;
};

const versionOf = (executable) => {
  const asked = spawnSync(executable, ['--version'], { encoding: 'utf8' });
  return asked.status === 0 ? asked.stdout.trim() : null;
};

const update = async ({ log = console.log, executable = process.execPath, releases = process.env.OVER_THE_WIRE_RELEASES ?? DEFAULT_RELEASES } = {}) => {
  const url = `${releases.replace(/\/$/, '')}/${releaseAsset()}`;
  const downloaded = `${executable}.download`;

  log('[*] Updating the binary...');

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Could not download ${url}: ${response.status} ${response.statusText}`);
  }

  fs.writeFileSync(downloaded, Buffer.from(await response.arrayBuffer()), { mode: EXECUTABLE });

  const newVersion = versionOf(downloaded);

  if (newVersion === null) {
    fs.rmSync(downloaded, { force: true });
    throw new Error(`What was downloaded from ${url} does not run on this system, the current binary is kept`);
  }

  fs.renameSync(downloaded, executable);
  log(`[*] ${packageVersion()} -> ${newVersion}. It takes effect the next time otw starts.`);

  return true;
};

export { packageVersion, exposePackage, importScript, update, releaseAsset };
