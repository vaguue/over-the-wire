import { paintWith } from '#lib/cli/style';

const HEADER = ['PROTO', 'ADDRESS', 'PORT', 'PID', 'PROCESS'];
const UNKNOWN = '-';

const columnWidths = (rows) => {
  return HEADER.map((_, column) => Math.max(...rows.map(row => row[column].length)));
};

const renderPorts = (ports, { color = false } = {}) => {
  const paint = paintWith(color);

  if (ports.length === 0) {
    return 'No open ports found.';
  }

  const rows = ports.map(({ protocol, family, address, port, pid, process }) => {
    return [
      family === 'IPv6' ? `${protocol}6` : protocol,
      address,
      String(port),
      pid === null ? UNKNOWN : String(pid),
      process === null || process.length === 0 ? UNKNOWN : process,
    ];
  });

  const widths = columnWidths([HEADER, ...rows]);

  const line = (row) => {
    return row.map((cell, column) => cell.padEnd(widths[column] + 2)).join('').trimEnd();
  };

  return [paint.bold(line(HEADER)), ...rows.map(line)].join('\n');
};

export { renderPorts };
