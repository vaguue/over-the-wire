const fs = require('fs');
const logFn = './render-log/memory.log';

try {
  fs.unlinkSync(logFn);
} catch(err) {

}

setInterval(() => {
  fs.appendFile(logFn, JSON.stringify(process.memoryUsage()) + '\n', () => {});
}, 50);
