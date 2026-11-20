import { strict as assert } from 'node:assert';
import test from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import http from 'node:http';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { parseScriptArguments } from '#lib/cli/scriptArguments';
import { checkSupportedSystem } from '#lib/cli/run';
import { promptFor } from '#lib/cli/repl';
import { packageVersion } from '#lib/cli/main';
import otw from '#lib/index';

const PACKAGE_ROOT = path.dirname(fileURLToPath(import.meta.resolve('over-the-wire/package.json')));
const NODE_COMMAND = [process.execPath, path.join(PACKAGE_ROOT, 'bin', 'otw.js')];
const STANDALONE = process.env.OVER_THE_WIRE_STANDALONE ?? path.join(PACKAGE_ROOT, 'build-standalone', 'cmake', 'otw');
const SYSTEM = { darwin: 'macos', linux: 'linux' }[os.platform()];
const ASSET = `otw-${SYSTEM}-${os.arch()}`;

const K6_STYLE_SCRIPT = `
  import otw, { icmp } from 'over-the-wire';

  export const options = {
    supported_os: ['linux', 'mac'],
  };

  export default async function (wire, args) {
    const probe = wire.packet().ipv4({ src: '10.0.0.1', dst: args[0] }).icmp({ type: icmp.ECHO_REQUEST });

    console.log(JSON.stringify({
      target: args[0],
      timeout: args.timeout,
      verbose: args.verbose,
      iface: wire.iface,
      bytes: probe.buffer.length,
      sameNamespace: otw.icmp === icmp,
      argv: process.argv.slice(2),
    }));
  }
`;

const EXPECTED_FROM_K6_STYLE_SCRIPT = {
  target: '8.8.8.8',
  timeout: 1000,
  verbose: true,
  iface: 'lo0',
  bytes: 36,
  sameNamespace: true,
  argv: ['8.8.8.8', '-timeout', '1000', '--verbose'],
};

const inTemporaryDirectory = async (use) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'otw-standalone-'));

  try {
    return await use(directory);
  }
  finally {
    fs.rmSync(directory, { recursive: true });
  }
};

const runCommand = (command, args, options = {}) => {
  return new Promise((resolve) => {
    const child = spawn(command[0], [...command.slice(1), ...args], options);
    const output = { stdout: '', stderr: '' };

    child.stdout.on('data', (chunk) => {
      output.stdout += chunk;
    });

    child.stderr.on('data', (chunk) => {
      output.stderr += chunk;
    });

    child.on('close', (status) => {
      resolve({ status, ...output });
    });

    if (options.input !== undefined) {
      child.stdin.end(options.input);
    }
  });
};

const servingFiles = async (files, use) => {
  const server = http.createServer((request, response) => {
    const file = files[request.url];

    if (file === undefined) {
      response.writeHead(404).end();
      return;
    }

    response.writeHead(200).end(fs.readFileSync(file));
  });

  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });

  try {
    return await use(`http://127.0.0.1:${server.address().port}`);
  }
  finally {
    server.close();
  }
};

const runsScriptsWithADefaultExport = async (command) => {
  await inTemporaryDirectory(async (directory) => {
    const script = path.join(directory, 'script.mjs');
    const elsewhereOnly = path.join(directory, 'elsewhere.mjs');

    fs.writeFileSync(script, K6_STYLE_SCRIPT);
    fs.writeFileSync(elsewhereOnly, 'export const options = { supported_os: ["plan9"] };\nexport default function () { console.log("ran"); }\n');

    const ran = await runCommand(command, ['-i', 'lo0', script, '--', '8.8.8.8', '-timeout', '1000', '--verbose']);

    assert.equal(ran.status, 0, ran.stderr);
    assert.deepEqual(JSON.parse(ran.stdout), EXPECTED_FROM_K6_STYLE_SCRIPT);

    const refused = await runCommand(command, [elsewhereOnly]);

    assert.equal(refused.status, 1);
    assert.equal(refused.stdout, '');
    assert.match(refused.stderr, /elsewhere\.mjs supports plan9, this system is/);
  });
};

test('script arguments: positionals in order, options by name', () => {
  const args = parseScriptArguments(['--', '8.8.8.8', 'last', '-timeout', '1000', '--count=4', '-5', '--verbose']);

  assert.deepEqual([...args], ['8.8.8.8', 'last', -5]);
  assert.equal(args.timeout, 1000);
  assert.equal(args.count, 4);
  assert.equal(args.verbose, true);
  assert.deepEqual([...parseScriptArguments([])], []);
  assert.equal(parseScriptArguments(['--name', 'en0']).name, 'en0');
});

test('a script says which systems it supports', () => {
  assert.doesNotThrow(() => checkSupportedSystem('s.js', { supported_os: ['linux', 'mac'] }, 'darwin'));
  assert.doesNotThrow(() => checkSupportedSystem('s.js', { supported_os: ['Linux'] }, 'linux'));
  assert.doesNotThrow(() => checkSupportedSystem('s.js', undefined, 'win32'));
  assert.throws(() => checkSupportedSystem('s.js', { supported_os: ['linux', 'mac'] }, 'win32'), { code: 'EUNSUPPORTEDOS' });
});

test('the prompt names the interface and its address', async () => {
  const system = {
    getRoutingTable: async () => ({
      en0: [{ destination: 'default', gateway: '192.168.1.1', prefixLength: 0, family: 'AF_INET', flags: ['U', 'G'], metric: 0 }],
    }),
    networkInterfaces: () => ({
      en0: [{ address: '192.168.1.2', family: 'IPv4', mac: 'aa:aa:aa:aa:aa:01', internal: false }],
      tun9: [],
    }),
  };

  assert.equal(await promptFor(otw({ system })), 'otw(en0):192.168.1.2> ');
  assert.equal(await promptFor(otw({ system, iface: 'tun9' })), 'otw(tun9)> ');
  assert.equal(await promptFor(otw({ system: { ...system, getRoutingTable: async () => ({}) } })), 'otw> ');
});

test('through Node.js: a default export gets the wire and the arguments', async () => {
  await runsScriptsWithADefaultExport(NODE_COMMAND);
});

test('through Node.js: update points at npm', async () => {
  const asked = await runCommand(NODE_COMMAND, ['update']);

  assert.equal(asked.status, 0, asked.stderr);
  assert.match(asked.stdout, /npm install --global over-the-wire@latest/);
});

test('install.sh puts the binary for this system in place and refuses one that does not run', async (t) => {
  if (SYSTEM === undefined) {
    t.skip('install.sh is for Linux and macOS');
    return;
  }

  await inTemporaryDirectory(async (directory) => {
    const release = path.join(directory, 'release');
    const broken = path.join(directory, 'broken');
    const installDirectory = path.join(directory, 'bin');

    fs.writeFileSync(release, '#!/bin/sh\necho 9.9.9\n');
    fs.writeFileSync(broken, 'not a program');

    const install = (releases) => {
      return runCommand(['sh', path.join(PACKAGE_ROOT, 'install.sh')], [], {
        env: { ...process.env, OVER_THE_WIRE_RELEASES: releases, OVER_THE_WIRE_INSTALL_DIR: installDirectory },
      });
    };

    await servingFiles({ [`/good/${ASSET}`]: release, [`/bad/${ASSET}`]: broken }, async (origin) => {
      const installed = await install(`${origin}/good`);

      assert.equal(installed.status, 0, installed.stderr);
      assert.match(installed.stdout, new RegExp(`Installing over-the-wire for ${SYSTEM} ${os.arch()}`));
      assert.match(installed.stdout, /otw 9\.9\.9 is installed in/);
      assert.equal(spawnSync(path.join(installDirectory, 'otw'), ['--version'], { encoding: 'utf8' }).stdout.trim(), '9.9.9');

      const refused = await install(`${origin}/bad`);

      assert.equal(refused.status, 1);
      assert.match(refused.stderr, /does not run on this system/);
      assert.equal(spawnSync(path.join(installDirectory, 'otw'), ['--version'], { encoding: 'utf8' }).stdout.trim(), '9.9.9');

      const missing = await install(`${origin}/nowhere`);

      assert.equal(missing.status, 1);
      assert.match(missing.stderr, /Could not download/);
    });
  });
});

const standaloneTest = (name, body) => {
  test(name, async (t) => {
    if (!fs.existsSync(STANDALONE)) {
      t.skip(`no standalone binary at ${STANDALONE}`);
      return;
    }

    await body(t);
  });
};

standaloneTest('standalone: the same command without Node.js around', async () => {
  const outsideThePackage = { cwd: os.tmpdir(), env: { PATH: '/usr/bin:/bin' } };

  const version = await runCommand([STANDALONE], ['--version'], outsideThePackage);
  const docs = await runCommand([STANDALONE], ['docs', 'dns'], outsideThePackage);
  const unknown = await runCommand([STANDALONE], ['--nope'], outsideThePackage);

  assert.equal(version.stdout.trim(), packageVersion());
  assert.match(docs.stdout, /dns\.TYPE_A\s+1/);
  assert.equal(unknown.status, 1);
  assert.match(unknown.stderr, /otw: Unknown argument: nope/);
});

standaloneTest('standalone: a default export gets the wire and the arguments', async () => {
  await runsScriptsWithADefaultExport([STANDALONE]);
});

standaloneTest('standalone: the shell', async () => {
  const session = await runCommand([STANDALONE], ['-i', 'lo0'], {
    input: 'icmp.ECHO_REQUEST\nwire.p.ipv4({ src: "10.0.0.1", dst: "10.0.0.2" }).udp({ src: 1, dst: dns.PORT }).buffer.length\nawait Promise.resolve("settled")\n.exit\n',
  });

  assert.equal(session.status, 0, session.stderr);
  assert.match(session.stdout, /otw\(lo0\)/);
  assert.ok(session.stdout.includes('8\n'));
  assert.ok(session.stdout.includes('28\n'));
  assert.ok(session.stdout.includes("'settled'"));
});

standaloneTest('standalone: update replaces the binary with the one of the latest release', async () => {
  await inTemporaryDirectory(async (directory) => {
    const installed = path.join(directory, 'otw');
    const broken = path.join(directory, 'broken');

    fs.copyFileSync(STANDALONE, installed);
    fs.chmodSync(installed, 0o755);
    fs.writeFileSync(broken, 'not a program');

    const before = fs.statSync(installed).ino;

    await servingFiles({ [`/good/${ASSET}`]: STANDALONE, [`/bad/${ASSET}`]: broken }, async (origin) => {
      const refused = await runCommand([installed], ['update'], { env: { ...process.env, OVER_THE_WIRE_RELEASES: `${origin}/bad` } });

      assert.equal(refused.status, 1);
      assert.match(refused.stderr, /does not run on this system, the current binary is kept/);
      assert.equal(fs.statSync(installed).ino, before);

      const updated = await runCommand([installed], ['update'], { env: { ...process.env, OVER_THE_WIRE_RELEASES: `${origin}/good` } });

      assert.equal(updated.status, 0, updated.stderr);
      assert.match(updated.stdout, /Updating the binary/);
      assert.notEqual(fs.statSync(installed).ino, before);
      assert.equal(spawnSync(installed, ['--version'], { encoding: 'utf8' }).stdout.trim(), packageVersion());
    });
  });
});
