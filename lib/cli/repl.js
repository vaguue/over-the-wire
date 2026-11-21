import os from 'node:os';
import path from 'node:path';
import repl from 'node:repl';

import { openSession, installGlobals, printDocs, printPorts } from '#lib/cli/session';
import { banner } from '#lib/cli/logo';

const HISTORY_FILE = '.otw_history';

const isThenable = (value) => {
  return value !== null && (typeof value == 'object' || typeof value == 'function') && typeof value.then == 'function';
};

const settleBeforePrinting = (server) => {
  const evaluate = server.eval;
  const deliverLine = server.listeners('line');
  const waitingLines = [];
  let settling = false;

  const deliverWaitingLines = () => {
    while (!settling && waitingLines.length > 0) {
      const line = waitingLines.shift();

      for (const deliver of deliverLine) {
        deliver.call(server, line);
      }
    }
  };

  server.removeAllListeners('line');

  server.on('line', (line) => {
    waitingLines.push(line);
    deliverWaitingLines();
  });

  server.eval = (command, context, file, finish) => {
    evaluate.call(server, command, context, file, (err, result) => {
      if (err || !isThenable(result)) {
        finish(err, result);
        return;
      }

      settling = true;

      const settle = (failure, settled) => {
        settling = false;
        finish(failure, settled);
        deliverWaitingLines();
      };

      Promise.resolve(result).then(
        (settled) => {
          settle(null, settled);
        },
        (failure) => {
          settle(failure);
        },
      );
    });
  };
};

const startRepl = ({ iface = null, version, input = process.stdin, output = process.stdout } = {}) => {
  const session = openSession({ iface });

  if (output.isTTY) {
    output.write(`${banner({ version, iface })}\n\n`);
  }

  const server = repl.start({
    prompt: 'otw> ',
    input,
    output,
    useGlobal: true,
    ignoreUndefined: true,
  });

  installGlobals(session.globals, server.context);
  settleBeforePrinting(server);

  server.defineCommand('docs', {
    help: 'Fields and constants of a protocol, for example .docs icmp',
    action(name) {
      try {
        printDocs(name.trim().length > 0 ? name.trim() : undefined);
      }
      catch (err) {
        console.log(err.message);
      }

      this.displayPrompt();
    },
  });

  server.defineCommand('ports', {
    help: 'Ports this machine listens on and the processes behind them',
    action() {
      printPorts().catch((err) => {
        console.log(err.message);
      }).finally(() => {
        this.displayPrompt();
      });
    },
  });

  if (input.isTTY) {
    server.setupHistory(path.join(os.homedir(), HISTORY_FILE), () => {});
  }

  const finished = new Promise((resolve) => {
    server.once('exit', () => {
      session.wire.close();
      resolve();
    });
  });

  return { server, session, finished };
};

export { startRepl, settleBeforePrinting, isThenable };
