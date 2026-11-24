import fs from 'node:fs';

import yargs from 'yargs';

import { renderDocs } from '#lib/cli/docs';
import { colorsWanted } from '#lib/cli/style';

const packageVersion = () => {
  const manifest = fs.readFileSync(new URL(import.meta.resolve('over-the-wire/package.json')), 'utf8');
  return JSON.parse(manifest).version;
};

const usageError = (message) => {
  const err = new Error(message);
  err.code = 'EUSAGE';
  return err;
};

const openShell = async ({ iface }) => {
  const { startRepl } = await import('#lib/cli/repl');
  await startRepl({ iface, version: packageVersion() }).finished;
};

const runScript = async ({ iface, file, scriptArguments }) => {
  const { runFile } = await import('#lib/cli/run');
  await runFile(file, { iface, scriptArguments });
};

const printDocs = ({ protocol }) => {
  console.log(renderDocs(protocol, { color: colorsWanted() }));
};

const printPorts = async () => {
  const { printPorts: print } = await import('#lib/cli/session');
  await print();
};

const commandLine = (argv, handlers = { openShell, runScript, printDocs, printPorts }) => {
  return yargs(argv)
    .scriptName('otw')
    .parserConfiguration({ 'halt-at-non-option': true })
    .usage('$0 [options]                    start the interactive shell')
    .usage('$0 [options] <file> [args...]   run a script with wire and the protocol constants as globals')
    .usage('$0 docs [protocol]              describe a protocol: fields, constants, filter support')
    .usage('$0 ports                        list the ports this machine listens on and the processes behind them')
    .option('iface', {
      alias: 'i',
      type: 'string',
      requiresArg: true,
      describe: 'interface to use, otherwise chosen by the routing table',
    })
    .version(packageVersion())
    .alias('version', 'v')
    .help()
    .alias('help', 'h')
    .strictOptions()
    .exitProcess(false)
    .wrap(null)
    .fail((message, err) => {
      if (err === undefined || err === null || err.name === 'YError') {
        throw usageError(message ?? err.message);
      }

      throw err;
    })
    .command({
      command: '$0',
      describe: false,
      handler: ({ iface = null, _: positionals }) => {
        const [first, ...rest] = positionals.map(String);

        if (first === undefined) {
          return handlers.openShell({ iface });
        }

        if (first === 'docs') {
          return handlers.printDocs({ protocol: rest[0] });
        }

        if (first === 'ports') {
          return handlers.printPorts();
        }

        return handlers.runScript({ iface, file: first, scriptArguments: rest });
      },
    });
};

const main = async (argv = process.argv.slice(2), handlers) => {
  await commandLine(argv, handlers).parseAsync();
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

export { main, mainOrExit, commandLine, packageVersion };
