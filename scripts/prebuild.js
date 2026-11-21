import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const NAPI_BUILD_VERSION = '6';
const OLDEST_SUPPORTED_NODE = '18.0.0';
const CMAKE_POLICY_VERSION_MINIMUM = '3.5';
const ADDON_INSIDE_PACKAGE = 'build/Release/over-the-wire.node';
const PREBUILDS_DIRECTORY = 'prebuilds';

const require = createRequire(import.meta.url);
const packageRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const { name, version } = require(path.join(packageRoot, 'package.json'));

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, { cwd: packageRoot, stdio: 'inherit', ...options });

  if (result.status !== 0) {
    throw new Error(`${path.basename(command)} ${args.join(' ')} failed with exit code ${result.status}`);
  }
};

const libcSuffix = () => {
  if (process.platform !== 'linux') {
    return '';
  }

  const usesGlibc = process.report.getReport().header.glibcVersionRuntime !== undefined;
  return usesGlibc ? '' : 'musl';
};

const prebuildName = (arch) => {
  return `${name}-v${version}-napi-v${NAPI_BUILD_VERSION}-${process.platform}${libcSuffix()}-${arch}.tar.gz`;
};

const prebuild = (arch = process.env.npm_config_arch ?? process.arch) => {
  const cmakeJsManifest = require.resolve('cmake-js/package.json');
  const cmakeJs = path.join(path.dirname(cmakeJsManifest), require(cmakeJsManifest).bin['cmake-js']);
  const env = { ...process.env, CMAKE_POLICY_VERSION_MINIMUM };

  run(process.execPath, [cmakeJs, 'rebuild', `--runtime-version=${OLDEST_SUPPORTED_NODE}`, `--arch=${arch}`], { env });

  const output = `${PREBUILDS_DIRECTORY}/${prebuildName(arch)}`;

  fs.mkdirSync(path.join(packageRoot, PREBUILDS_DIRECTORY), { recursive: true });
  run('tar', ['-czf', output, ADDON_INSIDE_PACKAGE]);

  console.log(`[over-the-wire] ${output}`);
};

prebuild(process.argv[2]);
