import fs from 'node:fs';
import nodeModule from 'node:module';

const packageVersion = () => {
  const manifest = fs.readFileSync(new URL(import.meta.resolve('over-the-wire/package.json')), 'utf8');
  return JSON.parse(manifest).version;
};

const exposePackage = () => {
  if (typeof nodeModule.register != 'function') {
    return false;
  }

  nodeModule.register(import.meta.resolve('#lib/cli/selfResolve'), {
    data: { packageEntry: import.meta.resolve('#lib/index') },
  });

  return true;
};

const importScript = (url) => {
  return import(url);
};

const update = async ({ log = console.log } = {}) => {
  log('This otw was installed through npm. Update it with: npm install --global over-the-wire@latest');
  return false;
};

export { packageVersion, exposePackage, importScript, update };
