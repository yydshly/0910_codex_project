import { cp, mkdir, lstat, realpath, rm } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderReport } from './render-report.mjs';
const web = await realpath(fileURLToPath(new URL('../', import.meta.url)));
const output = resolve(web, 'dist');
if (dirname(output) !== web) throw new Error('Output escaped web directory');
try { const item = await lstat(output); if (item.isSymbolicLink() || await realpath(output) !== output) throw new Error('Redirected output'); await rm(output,{recursive:true}); } catch(error) { if(error.code !== 'ENOENT') throw error; }
await mkdir(output);
await cp(join(web,'public'),output,{recursive:true});
await cp(resolve(web,'../assets'),join(output,'assets'),{recursive:true});
await cp(resolve(web,'../notes'),join(output,'notes'),{recursive:true});
await renderReport(output);
console.log('Pi Web research showcase built.');
