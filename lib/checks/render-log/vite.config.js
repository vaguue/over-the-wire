import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createReadStream } from 'fs';
import readline from 'readline';

const randomColor = () => `#${Math.floor(Math.random()*16777215).toString(16)}`;

function memoryLogLoader() {
  return {
    name: 'memory-log-loader',
    async transform(src, id) {
      if (id.endsWith('memory.log')) {
        const rl = readline.createInterface({
          input: createReadStream(id),
          crlfDelay: Infinity,
        });

        const cols = ['rss', 'heapTotal', 'heapUsed', 'external', 'arrayBuffers'];

        const res = {
          datasets: cols.map(label => ({
            label,
            data: [],
            borderColor: (global[`${label}borderColor`] ||= randomColor()),
            backgroundColor: (global[`${label}backgroundColor`] ||= randomColor()),
          })),
        };

        for await (const line of rl) {
          const { rss, heapTotal, heapUsed, external, arrayBuffers } = JSON.parse(line);
          const obj = JSON.parse(line);
          cols.forEach((col, i) => {
            res.datasets[i].data.push(obj[col]);
          });
        }

        res.labels = Array.from({ length: res.datasets[0].data.length }, (_, i) => i);

        return {
          code: `export default ${JSON.stringify(res)}`,
          map: null,
        };
      }
    }
  };
}


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), memoryLogLoader()],
});
