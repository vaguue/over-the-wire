import { strict as assert } from 'node:assert';
import test from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { Wire, protocols } from '#lib/index';
import { parseArguments, packageVersion } from '#lib/cli/main';
import { renderDocs } from '#lib/cli/docs';
import { startRepl } from '#lib/cli/repl';
import { banner } from '#lib/cli/logo';

const command = fileURLToPath(import.meta.resolve('over-the-wire/package.json')).replace('package.json', path.join('bin', 'otw.js'));

const run = (...args) => {
  return spawnSync(process.execPath, [command, ...args], { encoding: 'utf8' });
};

test('arguments before the first positional belong to otw, the rest to the script', () => {
  assert.deepEqual(parseArguments(['-i', 'en0', 'script.js', '-i', 'x', '--help']), {
    iface: 'en0',
    help: false,
    version: false,
    positionals: ['script.js', '-i', 'x', '--help'],
  });

  assert.equal(parseArguments(['--iface=eth0']).iface, 'eth0');
  assert.throws(() => parseArguments(['--nope']), { code: 'EUSAGE' });
  assert.throws(() => parseArguments(['-i']), { code: 'EUSAGE' });
});

test('docs describe every protocol', () => {
  const index = renderDocs();

  for (const protocol of Object.values(protocols)) {
    assert.ok(index.includes(protocol.name));

    const page = renderDocs(protocol.name);

    assert.ok(page.includes(protocol.title));

    for (const constant of Object.keys(protocol.namespace)) {
      assert.ok(page.includes(`${protocol.name}.${constant}`), `${protocol.name}.${constant}`);
    }
  }
});

test('docs for icmp show fields, constants and filter support without colour codes', () => {
  const page = renderDocs('icmp');

  assert.match(page, /type\s+uint8_t\s+Message type/);
  assert.match(page, /icmp\.ECHO_REQUEST\s+8/);
  assert.match(page, /Compiled into the kernel filter: "icmp", fields type, code/);
  assert.ok(!page.includes('\x1b['));
  assert.ok(renderDocs('icmp', { color: true }).includes('\x1b['));
  assert.throws(() => renderDocs('nope'), { code: 'EUNKNOWNPROTOCOL' });
});

test('otw docs and otw --version work as a command', () => {
  const docs = run('docs', 'dns');

  assert.equal(docs.status, 0);
  assert.match(docs.stdout, /dns\.TYPE_A\s+1/);

  assert.equal(run('--version').stdout.trim(), packageVersion());
  assert.equal(run('docs', 'nope').status, 1);
  assert.equal(run('--nope').status, 1);
});

test('a script run through otw gets wire, the constants, its own arguments and the package', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'otw-cli-'));
  const script = path.join(directory, 'script.mjs');

  fs.writeFileSync(script, `
    import otw, { icmp as imported } from 'over-the-wire';
    console.log(JSON.stringify({
      args: process.argv.slice(2),
      iface: wire.iface,
      inherited: otw().iface,
      sameNamespace: imported === icmp,
      built: wire.p().ipv4({ src: '10.0.0.1', dst: '10.0.0.2' }).icmp({ type: icmp.ECHO_REQUEST }).buffer.length,
    }));
  `);

  const result = run('-i', 'lo0', script, 'first', '--second');

  fs.rmSync(directory, { recursive: true });

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    args: ['first', '--second'],
    iface: 'lo0',
    inherited: 'lo0',
    sameNamespace: true,
    built: 36,
  });
});

test('the shell settles what is typed before printing it', async () => {
  const input = new PassThrough();
  const output = new PassThrough();
  const printed = [];

  output.on('data', (chunk) => {
    printed.push(chunk.toString());
  });

  const { server, finished } = startRepl({ iface: 'lo0', version: '0.0.0', input, output });

  input.write('icmp.ECHO_REQUEST\n');
  input.write('Promise.resolve({ then: undefined, settled: dns.PORT })\n');
  input.write('wire.iface\n');
  input.write('.exit\n');

  await finished;

  const text = printed.join('');

  assert.ok(text.includes('8'));
  assert.ok(text.includes('settled: 53'));
  assert.ok(text.includes("'lo0'"));
  assert.equal(typeof server.commands.docs.action, 'function');

  Wire.defaults.iface = null;

  for (const name of ['wire', 'otw', 'docs', 'icmp', 'dns', 'tcp', 'udp']) {
    delete globalThis[name];
  }
});

test('the banner carries the version and the interface', () => {
  const text = banner({ version: '1.2.3', iface: null });

  assert.ok(text.includes('over-the-wire 1.2.3'));
  assert.ok(text.includes('chosen by the routing table'));
});
