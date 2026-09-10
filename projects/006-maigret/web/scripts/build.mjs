import { cp, mkdir, readFile, writeFile, lstat, realpath, rm } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderReport } from './render-report.mjs';

const web = await realpath(fileURLToPath(new URL('../', import.meta.url)));
const output = resolve(web, 'dist');
if (dirname(output) !== web) throw new Error('Output escaped project web directory');
try {
  const info = await lstat(output);
  if (info.isSymbolicLink() || await realpath(output) !== output) throw new Error('Redirected output directory');
  await rm(output, { recursive: true });
} catch (error) { if (error.code !== 'ENOENT') throw error; }
await mkdir(output);
await cp(join(web, 'public'), output, { recursive: true });
await mkdir(join(output, 'assets'));
await mkdir(join(output, 'notes'));
for (const asset of ['research-overview.png', 'research-overview.svg']) {
  await cp(resolve(web, '../assets', asset), join(output, 'assets', asset));
}
await cp(resolve(web, '../notes/01-understanding.md'), join(output, 'notes/01-understanding.md'));
await renderReport(output);
console.log('Maigret research built: complete article, diagram and Markdown download.');
