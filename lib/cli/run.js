import path from 'node:path';
import nodeModule from 'node:module';
import { pathToFileURL } from 'node:url';

import { openSession, installGlobals } from '#lib/cli/session';

const resolvePackageToThisInstall = () => {
  if (typeof nodeModule.register != 'function') {
    return false;
  }

  nodeModule.register(import.meta.resolve('#lib/cli/selfResolve'), {
    data: { packageEntry: import.meta.resolve('#lib/index') },
  });

  return true;
};

const runFile = async (file, { iface = null, scriptArguments = [] } = {}) => {
  const session = openSession({ iface });
  const scriptPath = path.resolve(file);

  installGlobals(session.globals);
  resolvePackageToThisInstall();

  process.argv = [process.argv[0], scriptPath, ...scriptArguments];

  await import(pathToFileURL(scriptPath).href);

  return session;
};

export { runFile, resolvePackageToThisInstall };
