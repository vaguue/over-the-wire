import fs from 'node:fs';

import { renderDocs } from '#lib/cli/docs';
import { colorsWanted } from '#lib/cli/style';

const USAGE = `Usage:
  otw [options]                    start the interactive shell
  otw [options] <file> [args...]   run a script with wire and the protocol constants as globals
  otw docs [protocol]              describe a protocol: fields, constants, filter support

Options:
  -i, --iface <name>   interface to use, otherwise chosen by the routing table
  -v, --version        print the version
  -h, --help           print this text`;

const packageVersion = () => {
  const manifest = fs.readFileSync(new URL(import.meta.resolve('over-the-wire/package.json')), 'utf8');
  return JSON.parse(manifest).version;
};

const usageError = (message) => {
  const err = new Error(message);
  err.code = 'EUSAGE';
  return err;
};

const parseArguments = (argv) => {
  const parsed = {
    iface: null,
    help: false,
    version: false,
    positionals: [],
  };

  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];

    if (argument === '-h' || argument === '--help') {
      parsed.help = true;
    }
    else if (argument === '-v' || argument === '--version') {
      parsed.version = true;
    }
    else if (argument === '-i' || argument === '--iface') {
      index++;

      if (argv[index] === undefined) {
        throw usageError(`${argument} needs an interface name`);
      }

      parsed.iface = argv[index];
    }
    else if (argument.startsWith('--iface=')) {
      parsed.iface = argument.slice('--iface='.length);
    }
    else if (argument.startsWith('-')) {
      throw usageError(`Unknown option ${argument}`);
    }
    else {
      parsed.positionals = argv.slice(index);
      break;
    }
  }

  return parsed;
};

const main = async (argv = process.argv.slice(2)) => {
  const { iface, help, version, positionals } = parseArguments(argv);
  const [command, ...rest] = positionals;

  if (help) {
    console.log(USAGE);
    return;
  }

  if (version) {
    console.log(packageVersion());
    return;
  }

  if (command === 'docs') {
    console.log(renderDocs(rest[0], { color: colorsWanted() }));
    return;
  }

  if (command === undefined) {
    const { startRepl } = await import('#lib/cli/repl');
    await startRepl({ iface, version: packageVersion() }).finished;
    return;
  }

  const { runFile } = await import('#lib/cli/run');
  await runFile(command, { iface, scriptArguments: rest });
};

const mainOrExit = async (argv) => {
  try {
    await main(argv);
  }
  catch (err) {
    if (err.code === 'EUSAGE' || err.code === 'EUNKNOWNPROTOCOL') {
      console.error(`otw: ${err.message}`);
    }
    else {
      console.error(err);
    }

    process.exitCode = 1;
  }
};

export { main, mainOrExit, parseArguments, packageVersion, USAGE };
