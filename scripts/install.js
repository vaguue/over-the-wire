import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const NAPI_BUILD_VERSION = '6';
const CMAKE_POLICY_VERSION_MINIMUM = '3.5';

const require = createRequire(import.meta.url);
const packageRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const addonPath = path.join(packageRoot, 'build', 'Release', 'over-the-wire.node');
const { repository } = require(path.join(packageRoot, 'package.json'));

const releasesUrl = () => {
  if (process.env.OVER_THE_WIRE_PREBUILDS !== undefined) {
    return process.env.OVER_THE_WIRE_PREBUILDS.replace(/\/$/, '');
  }

  return `${repository.url.replace(/\.git$/, '')}/releases/download/v{version}`;
};

const prebuiltUrl = () => {
  return `${releasesUrl()}/{name}-v{version}-napi-v${NAPI_BUILD_VERSION}-{platform}{libc}-{arch}.tar.gz`;
};

const say = (message) => {
  console.log(`[over-the-wire] ${message}`);
};

const runNode = (args, options = {}) => {
  return spawnSync(process.execPath, args, { cwd: packageRoot, ...options });
};

const binOf = (packageName, binName) => {
  const manifestPath = require.resolve(`${packageName}/package.json`);
  const { bin } = require(manifestPath);
  const relative = typeof bin == 'string' ? bin : bin[binName];
  return path.join(path.dirname(manifestPath), relative);
};

const downloadPrebuilt = () => {
  if (process.env.npm_config_build_from_source !== undefined) {
    return false;
  }

  const prebuildInstall = binOf('@vaguuue/prebuild-install', 'prebuild-install');
  const result = runNode([prebuildInstall, '--download', prebuiltUrl()], { stdio: 'inherit' });
  return result.status === 0 && fs.existsSync(addonPath);
};

const whyItDoesNotLoad = () => {
  const check = `require(${JSON.stringify(addonPath)})`;
  const result = runNode(['-e', check], { encoding: 'utf8' });

  if (result.status === 0) {
    return null;
  }

  const reason = (result.stderr ?? '').split('\n').find(line => line.startsWith('Error:'));
  return reason ?? `exit code ${result.status}`;
};

const buildFromSource = () => {
  const cmakeJs = binOf('cmake-js', 'cmake-js');
  const env = { ...process.env, CMAKE_POLICY_VERSION_MINIMUM };
  const result = runNode([cmakeJs, 'compile'], { stdio: 'inherit', env });
  return result.status === 0;
};

const install = () => {
  if (downloadPrebuilt()) {
    const reason = whyItDoesNotLoad();

    if (reason === null) {
      return true;
    }

    say(`The prebuilt binary does not load on this system: ${reason}`);
    fs.rmSync(addonPath, { force: true });
  }

  say('Building from source. This needs CMake, a C++17 compiler and the libpcap headers.');

  if (!buildFromSource()) {
    say('The build failed. Install CMake, a C++ compiler and libpcap-dev (or the Npcap SDK on Windows) and run "npm rebuild over-the-wire".');
    return false;
  }

  const reason = whyItDoesNotLoad();

  if (reason !== null) {
    say(`The binary built from source does not load: ${reason}`);
    return false;
  }

  return true;
};

process.exitCode = install() ? 0 : 1;
