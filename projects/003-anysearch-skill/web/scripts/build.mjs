import { cp, mkdir, lstat, realpath, rm } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderReport } from './render-report.mjs';

const web = await realpath(fileURLToPath(new URL('../', import.meta.url)));
const output = resolve(web, 'dist');
// Clean only this project's generated output and reject redirected directories.
if (dirname(output) !== web) throw new Error('Build output escaped site directory');
try {
  const existing = await lstat(output);
  if (existing.isSymbolicLink() || await realpath(output) !== output) throw new Error('Refusing redirected build output');
  await rm(output, { recursive: true });
} catch (error) { if (error.code !== 'ENOENT') throw error; }
await mkdir(output);
await cp(join(web, 'public'), output, { recursive: true });
await cp(resolve(web, '../assets'), join(output, 'assets'), { recursive: true });
await cp(resolve(web, '../notes'), join(output, 'notes'), { recursive: true });
await renderReport(output);
console.log('AnySearch: static research page, complete report, source notes and diagrams built.');
