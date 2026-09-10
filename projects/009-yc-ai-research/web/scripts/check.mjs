import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const output=fileURLToPath(new URL('../dist/',import.meta.url));
const html=await readFile(resolve(output,'index.html'),'utf8');
const base=new URL('https://local.invalid/0910_codex_project/009-yc-ai-research/');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
if(ids.length!==new Set(ids).size)throw new Error('Duplicate anchors');
for(const id of ['guide','updates','capabilities','research','value','sources'])if(!ids.includes(id))throw new Error('Missing section '+id);
let count=0;
for(const [,ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
 const url=new URL(ref,base);if(url.origin!==base.origin||ref==='../')continue;
 if(!url.pathname.startsWith(base.pathname))throw new Error('Link escaped project');
 const relative=decodeURIComponent(url.pathname.slice(base.pathname.length))||'index.html';
 const path=resolve(output,relative);
 if(!(await stat(path)).isFile())throw new Error('Missing resource '+relative);
 if(url.hash&&!ids.includes(url.hash.slice(1)))throw new Error('Missing anchor '+url.hash);
 count++;
}
for(const file of ['01-understanding.md','02-sources-and-verification.md']){
 if(await readFile(resolve(output,'notes',file),'utf8')!==await readFile(resolve(output,'../../notes',file),'utf8'))throw new Error('Stale note '+file);
}
if((html.match(/class="research-card"/g)||[]).length!==5)throw new Error('Missing representative research');
console.log(`YC AI Research check passed: six sections, five examples, ${count} local links, matching downloads.`);
