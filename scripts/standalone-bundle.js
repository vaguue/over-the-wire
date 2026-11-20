import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { build } from 'esbuild';

const RAW_STRING_DELIMITER = 'OTW_BUNDLE';
const EMBEDDED_NODE = 'node22';

const require = createRequire(import.meta.url);
const packageRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const { version } = require(path.join(packageRoot, 'package.json'));

const replacedInStandalone = new Map([
  [path.join(packageRoot, 'lib', 'bindings.js'), path.join(packageRoot, 'standalone', 'bindings.js')],
  [path.join(packageRoot, 'lib', 'cli', 'host.js'), path.join(packageRoot, 'standalone', 'host.js')],
]);

const standaloneModules = {
  name: 'standalone-modules',
  setup(bundler) {
    bundler.onLoad({ filter: /\.js$/ }, ({ path: loaded }) => {
      const replacement = replacedInStandalone.get(loaded);

      if (replacement === undefined) {
        return null;
      }

      return { contents: fs.readFileSync(replacement, 'utf8'), resolveDir: path.dirname(replacement), loader: 'js' };
    });
  },
};

const asCxxSource = (script) => {
  if (script.includes(`)${RAW_STRING_DELIMITER}"`)) {
    throw new Error('The bundle contains the delimiter of the string literal it is embedded in');
  }

  return [
    '#include <cstddef>',
    '',
    `extern const char overTheWireBundle[] = R"${RAW_STRING_DELIMITER}(${script})${RAW_STRING_DELIMITER}";`,
    'extern const size_t overTheWireBundleLength = sizeof(overTheWireBundle) - 1;',
    '',
  ].join('\n');
};

const bundle = async (outputDirectory = path.join(packageRoot, 'build-standalone')) => {
  const result = await build({
    entryPoints: [path.join(packageRoot, 'standalone', 'entry.js')],
    absWorkingDir: packageRoot,
    bundle: true,
    write: false,
    platform: 'node',
    format: 'cjs',
    target: EMBEDDED_NODE,
    legalComments: 'none',
    plugins: [standaloneModules],
    banner: {
      js: "const importMetaUrl = require('node:url').pathToFileURL(process.execPath).href;",
    },
    define: {
      OVER_THE_WIRE_VERSION: JSON.stringify(version),
      'import.meta.url': 'importMetaUrl',
    },
  });

  const [{ text }] = result.outputFiles;

  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(path.join(outputDirectory, 'bundle.js'), text);
  fs.writeFileSync(path.join(outputDirectory, 'bundle.cxx'), asCxxSource(text));

  console.log(`[over-the-wire] ${path.join(outputDirectory, 'bundle.cxx')} (${text.length} characters of script)`);
};

await bundle(process.argv[2]);
