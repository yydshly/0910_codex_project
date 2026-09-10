import { cp, mkdir, lstat, realpath, rm } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const web = await realpath(fileURLToPath(new URL('../', import.meta.url)));
const output = resolve(web, 'dist');
// Remove only this site's generated output. Never follow a redirected output directory.
if (dirname(output) !== web) throw new Error('Build output escaped the site directory');
try {
  const existing = await lstat(output);
  if (existing.isSymbolicLink() || await realpath(output) !== output) throw new Error('Refusing redirected build output');
  await rm(output, { recursive: true });
} catch (error) { if (error.code !== 'ENOENT') throw error; }
await mkdir(output);
await cp(new URL('../public/', import.meta.url), output, { recursive: true });
await cp(new URL('../../assets/architecture.svg', import.meta.url), join(output, 'architecture.svg'));
await cp(new URL('../../assets/memory-mechanism.png', import.meta.url), join(output, 'memory-mechanism.png'));
await cp(new URL('../../assets/external-memory-architecture.svg', import.meta.url), join(output, 'external-memory-architecture.svg'));
console.log('Static output: dist/');
