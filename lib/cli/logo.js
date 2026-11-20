import { paintWith } from '#lib/cli/style';

const SPIDER = [
  '           ▄▟██████▙▄           ',
  '        ▗▟████████████▙▖        ',
  '       ▗████████████████▖       ',
  '       ▐████████████████▌       ',
  '    ▗▄████████████████████▄▄    ',
  '  ▗█▀▙▟▛▜██████████████▛▜█▟▀█▄  ',
  ' ▟▛▘▟▛▚▟▛▘▟█▜██▛▜██▛▜▙▝▜▙▖▜▙▖▜▙ ',
  '▐█ ▟▛▗█▘ ▗█▘ ▗▄  ▄▖ ▝█▙ ▝█▖▜▙ ▜▌',
  '█▌▐█ ▟▛ ▗█▌▗▟▛▀▙▐▛▜▙▖▝█▖ ▐█ █▌▐█',
  '█▌▐█ █▌ ▟█▄█▘▗▄▄▄▄▖▝▜▙██ ▐█ █▌▐█',
  '▐█▐█ ▐█ █▛▀ ▟███████▖▝▜█▘▟▛ █▌▟▌',
  ' ▀ ▜▙ ▜▙▖  ▐████████▙   ▟▛ ▟▛ ▀ ',
  '    ▀█▄▞█▙▄▝████████▌▗▄█▜▄█▀    ',
  '         ▝▀▀████████▀▀▘  ▘      ',
];

const PAINT = [
  '           gggggggggg           ',
  '        gggggggggggggggg        ',
  '       gggggkkkkkkkkggggg       ',
  '       ggggkkkkkkkkkkgggg       ',
  '    kkkkgggkkkkkkkkkkgggkkkk    ',
  '  kkkkkkgkgkrrkkkkrrkkkkkkkkkk  ',
  ' kkkkkkkkkkkkrkkkkrkkkkkkkkkkkk ',
  'kk kkkkk kkk kk  kk kkk kkkkk kk',
  'kkkk kk kkkkkkkkkkkkkkkk kk kkkk',
  'kkkk kk kkkkkrrrrrrkkkkk kk kkkk',
  'kkkk kk kkk rrrrrrrrrkkkkkk kkkk',
  ' k kk kkk  rrrrrrrrrr   kk kk k ',
  '    kkkkkkkrrrrrrrrrrkkkkkkk    ',
  '         kkkrrrrrrrrkkk  k      ',
];

const NOTES_START_ROW = 4;
const GAP = '   ';

const INKS = {
  k: 'bold',
  g: 'dim',
  r: 'red',
};

const paintedRow = (row, paintRow, paint) => {
  let painted = '';
  let runStart = 0;

  for (let column = 1; column <= row.length; column++) {
    if (column < row.length && paintRow[column] === paintRow[runStart]) {
      continue;
    }

    const run = row.slice(runStart, column);
    const ink = INKS[paintRow[runStart]];

    painted += ink === undefined ? run : paint[ink](run);
    runStart = column;
  }

  return painted;
};

const logo = ({ color = false } = {}) => {
  const paint = paintWith(color);

  return SPIDER.map((row, index) => {
    return color ? paintedRow(row, PAINT[index], paint) : row;
  });
};

const banner = ({ version, iface, color = false }) => {
  const paint = paintWith(color);

  const notes = [
    paint.bold(`over-the-wire ${version}`),
    `interface: ${iface ?? 'chosen by the routing table'}`,
    '',
    'wire, the protocol constants and docs() are global',
    paint.dim("p = wire.p.ipv4({ dst: 'github.com' }).icmp()"),
    paint.dim('r = wire.s(p).ex()'),
    '.docs icmp   .help   .exit',
  ];

  return logo({ color }).map((row, index) => {
    const note = notes[index - NOTES_START_ROW];
    return note === undefined || note.length === 0 ? row.trimEnd() : `${row}${GAP}${note}`;
  }).join('\n');
};

export { SPIDER, PAINT, logo, banner };
