const CODES = {
  bold: [1, 22],
  dim: [2, 22],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  cyan: [36, 39],
};

const colorsWanted = (stream = process.stdout) => {
  return Boolean(stream.isTTY) && process.env.NO_COLOR === undefined;
};

const paintWith = (enabled) => {
  const paint = {};

  for (const [name, [open, close]] of Object.entries(CODES)) {
    paint[name] = (text) => {
      return enabled ? `\x1b[${open}m${text}\x1b[${close}m` : String(text);
    };
  }

  return paint;
};

export { colorsWanted, paintWith };
