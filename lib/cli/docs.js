import { protocols, protocolFor } from '#lib/protocols';
import { pcapVocabulary } from '#lib/filter';
import { paintWith } from '#lib/cli/style';
import { otw } from '#lib/wire';

const INDENT = '  ';

const formatValue = (value) => {
  if (typeof value == 'string') {
    return `'${value}'`;
  }

  if (value > 0xffff) {
    return `0x${value.toString(16)}`;
  }

  return String(value);
};

const table = (rows) => {
  const widths = [];

  for (const row of rows) {
    row.forEach((cell, column) => {
      widths[column] = Math.max(widths[column] ?? 0, cell.length);
    });
  }

  return rows.map((row) => {
    return row.map((cell, column) => cell.padEnd(widths[column] + 2)).join('').trimEnd();
  });
};

const indented = (lines, depth = 1) => {
  return lines.map(line => `${INDENT.repeat(depth)}${line}`);
};

const renderProtocol = (protocol, { color = false } = {}) => {
  const paint = paintWith(color);
  const lines = [];
  lines.push(`${paint.bold(protocol.layer)}  ${protocol.title}`);
  lines.push('');

  if (protocol.summary.length > 0) {
    lines.push(...indented([protocol.summary]));
    lines.push('');
  }

  const usage = [
    ['build', `wire.packet().${protocol.name}({ ... })`],
    ['match', `wire.filter().${protocol.name}({ ... })`],
    ['read', `packet.layers.${protocol.layer}`],
  ];

  if (Object.keys(protocol.namespace).length > 0) {
    usage.push(['constants', `import { ${protocol.name} } from 'over-the-wire'`]);
  }

  lines.push(...indented(table(usage)));

  lines.push('');
  lines.push(paint.bold('Fields'));
  lines.push(...indented(table(protocol.fields.map(({ name, type, description }) => {
    return [name, type, description];
  }))));

  for (const group of protocol.constants) {
    const field = group.field === undefined ? '' : paint.dim(`  for ${group.field}`);

    lines.push('');
    lines.push(`${paint.bold(group.title)}${field}`);
    lines.push(...indented(table(Object.entries(group.values).map(([name, value]) => {
      return [`${protocol.name}.${name}`, formatValue(value)];
    }))));
  }

  const vocabulary = pcapVocabulary[protocol.layer];

  lines.push('');
  lines.push(paint.bold('Capture filter'));

  if (vocabulary === undefined) {
    lines.push(...indented(['Matched in the process after capture, not by the kernel.']));
  }
  else {
    const kernelFields = Object.keys(vocabulary.fields);
    const presence = vocabulary.presence === null ? 'no keyword of its own' : `"${vocabulary.presence}"`;

    lines.push(...indented([
      `Compiled into the kernel filter: ${presence}${kernelFields.length > 0 ? `, fields ${kernelFields.join(', ')}` : ''}.`,
      'Any other field is matched in the process after capture.',
    ]));
  }

  if (protocol.example !== null) {
    lines.push('');
    lines.push(paint.bold('Example'));
    lines.push(...indented([protocol.example]));
  }

  return lines.join('\n');
};

const NOT_HERE = 'not on this system';

const optionTargets = (option) => {
  const choices = option.level === undefined ? [option.inet, option.inet6].filter(choice => choice !== undefined) : [option];
  return choices.map(({ level, name }) => `${level} / ${name}`).join(', ');
};

const optionIsAvailable = (option, constants) => {
  const choices = option.level === undefined ? [option.inet, option.inet6].filter(choice => choice !== undefined) : [option];
  return choices.some(({ level, name }) => constants[level] !== undefined && constants[name] !== undefined);
};

const renderSockets = (catalogue, { color = false } = {}) => {
  const paint = paintWith(color);
  const { kinds, constants } = catalogue;
  const lines = [];

  lines.push(`${paint.bold('Sockets')}  ${catalogue.title}`);
  lines.push('');
  lines.push(...indented(table([
    ['describe', 'wire.socket().inet().raw().icmp()'],
    ['open', 'await the description, or call .exec()'],
    ['short', 'wire.s'],
    ['constants', 'wire.sockets.SOL_SOCKET'],
  ])));

  for (const group of catalogue.groups) {
    lines.push('');
    lines.push(paint.bold(group.title));
    lines.push(...indented(table(Object.entries(group.values).map(([method, { constant, value }]) => {
      return [`.${method}()`, constant, value === undefined ? NOT_HERE : String(value)];
    }))));
  }

  lines.push('');
  lines.push(paint.bold('Options'));
  lines.push(...indented(table(Object.entries(kinds.options).map(([method, option]) => {
    return [`.${method}(value)`, optionTargets(option), optionIsAvailable(option, constants) ? '' : NOT_HERE];
  }))));

  lines.push('');
  lines.push(paint.bold('Also'));
  lines.push(...indented(table([
    ['.blocking()', 'every write is handed to the system before write returns'],
    ['.bind(address)', 'local { ip, port }'],
    ['.connect(address)', 'the only peer of the socket'],
    ['.to(address)', 'where writes go unless a write says otherwise'],
    ['.bufferSize(bytes)', 'size of the buffer a received packet is read into'],
    ['.protocol(number)', 'a protocol without a name here'],
    ['.option(level, name, value)', 'any other setsockopt'],
  ])));

  lines.push('');
  lines.push(...indented([
    'An option this system does not have, or refuses, never throws:',
    'the socket opens without it and lists it in socket.unsupported.',
  ]));

  return lines.join('\n');
};

const renderIndex = ({ color = false } = {}) => {
  const paint = paintWith(color);
  const rows = Object.values(protocols).map(({ name, title, namespace }) => {
    return [name, title, `${Object.keys(namespace).length} constants`];
  });

  return [
    paint.bold('Protocols'),
    ...indented(table(rows)),
    '',
    'otw docs <protocol> prints the fields and constants of one of them.',
    'otw docs socket describes the sockets a wire can open.',
  ].join('\n');
};

const renderDocs = (name, options = {}) => {
  if (name === undefined || name === null) {
    return renderIndex(options);
  }

  if (String(name).toLowerCase() === 'socket') {
    return renderSockets(otw().socketCatalogue, options);
  }

  const protocol = protocolFor(name);

  if (protocol === null) {
    const err = new Error(`Unknown protocol "${name}". Known: ${Object.keys(protocols).join(', ')}`);
    err.code = 'EUNKNOWNPROTOCOL';
    throw err;
  }

  return renderProtocol(protocol, options);
};

export { renderDocs, renderProtocol, renderIndex, renderSockets };
