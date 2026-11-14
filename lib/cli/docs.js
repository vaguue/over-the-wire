import { protocols, protocolFor } from '#lib/protocols';
import { pcapVocabulary } from '#lib/filter';
import { paintWith } from '#lib/cli/style';

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
  ].join('\n');
};

const renderDocs = (name, options = {}) => {
  if (name === undefined || name === null) {
    return renderIndex(options);
  }

  const protocol = protocolFor(name);

  if (protocol === null) {
    const err = new Error(`Unknown protocol "${name}". Known: ${Object.keys(protocols).join(', ')}`);
    err.code = 'EUNKNOWNPROTOCOL';
    throw err;
  }

  return renderProtocol(protocol, options);
};

export { renderDocs, renderProtocol, renderIndex };
