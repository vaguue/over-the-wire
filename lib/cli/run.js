import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { openSession, installGlobals } from '#lib/cli/session';
import { exposePackage, importScript } from '#lib/cli/host';
import { parseScriptArguments, withoutSeparator } from '#lib/cli/scriptArguments';

const SYSTEM_NAMES = {
  darwin: ['mac', 'macos', 'darwin'],
  linux: ['linux'],
  win32: ['windows', 'win32'],
};

const resolvePackageToThisInstall = () => {
  return exposePackage();
};

const unsupportedSystem = (file, supported, platform) => {
  const err = new Error(`${path.basename(file)} supports ${supported.join(', ')}, this system is ${platform}`);
  err.code = 'EUNSUPPORTEDOS';
  return err;
};

const checkSupportedSystem = (file, options, platform) => {
  const supported = options?.supported_os;

  if (!Array.isArray(supported)) {
    return;
  }

  const namesOfThisSystem = SYSTEM_NAMES[platform] ?? [platform];

  if (!supported.some(name => namesOfThisSystem.includes(String(name).toLowerCase()))) {
    throw unsupportedSystem(file, supported, platform);
  }
};

const recipeName = (scriptPath) => {
  return path.basename(scriptPath).replace(/\.[^.]+$/, '');
};

const bareRecipeFunction = (source, name) => {
  const declaration = new RegExp(`(^|\\n)\\s*(?:async\\s+)?function\\s+${name}\\s*\\(`);

  if (/\bexport\s+default\b/.test(source) || !declaration.test(source)) {
    return null;
  }

  return name;
};

const loadScript = async (scriptPath) => {
  const url = pathToFileURL(scriptPath).href;
  const source = fs.readFileSync(scriptPath, 'utf8');
  const name = bareRecipeFunction(source, recipeName(scriptPath));

  if (name === null) {
    return importScript(url);
  }

  const asModule = `${source}\nexport default ${name};\nexport const options = typeof ${name} == 'function' ? ${name}.options : undefined;`;
  const dataUrl = `data:text/javascript;charset=utf-8,${encodeURIComponent(asModule)}`;

  return importScript(dataUrl);
};

const runFile = async (file, { iface = null, scriptArguments = [], platform = os.platform() } = {}) => {
  const session = openSession({ iface });
  const scriptPath = path.resolve(file);
  const ownArguments = withoutSeparator(scriptArguments);

  installGlobals(session.globals);
  resolvePackageToThisInstall();

  process.argv = [process.argv[0], scriptPath, ...ownArguments];

  const script = await loadScript(scriptPath);

  if (typeof script.default == 'function') {
    checkSupportedSystem(file, script.options, platform);
    await script.default(session.wire, parseScriptArguments(ownArguments));
  }

  return session;
};

export { runFile, resolvePackageToThisInstall, checkSupportedSystem };
