import os from 'node:os';
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

const runFile = async (file, { iface = null, scriptArguments = [], platform = os.platform() } = {}) => {
  const session = openSession({ iface });
  const scriptPath = path.resolve(file);
  const ownArguments = withoutSeparator(scriptArguments);

  installGlobals(session.globals);
  resolvePackageToThisInstall();

  process.argv = [process.argv[0], scriptPath, ...ownArguments];

  const script = await importScript(pathToFileURL(scriptPath).href);

  if (typeof script.default == 'function') {
    checkSupportedSystem(file, script.options, platform);
    await script.default(session.wire, parseScriptArguments(ownArguments));
  }

  return session;
};

export { runFile, resolvePackageToThisInstall, checkSupportedSystem };
