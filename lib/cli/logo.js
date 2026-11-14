const SPIDER = [
  '    / \\  _  / \\',
  '   /   \\(_)/   \\',
  '  /  /\\/   \\/\\  \\',
  ' /  / (  o o  ) \\  \\',
  '    \\  \\  ^  /  /',
  '     \\  \\___/  /',
  '      \\/     \\/',
];

const banner = ({ version, iface }) => {
  const notes = [
    '',
    '',
    `over-the-wire ${version}`,
    `interface: ${iface ?? 'chosen by the routing table'}`,
    'wire, the protocol constants and docs() are global',
    '.docs icmp   .help   .exit',
    '',
  ];

  const width = Math.max(...SPIDER.map(line => line.length)) + 3;

  return SPIDER.map((line, row) => {
    return `${line.padEnd(width)}${notes[row]}`.trimEnd();
  }).join('\n');
};

export { SPIDER, banner };
