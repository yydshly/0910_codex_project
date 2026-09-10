import {readFile,stat} from 'node:fs/promises';
import {join,resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const output=fileURLToPath(new URL('../dist/',import.meta.url));
const base=new URL('https://local.invalid/0910_codex_project/007-deeptutor/');
let count=0;
for(const page of ['index.html','sources.html']){
 const html=await readFile(join(output,page),'utf8');
 if(/\{\{[A-Z]+\}\}|\[S\d+\]:/.test(html))throw new Error('Unrendered content: '+page);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 if(ids.length!==new Set(ids).size)throw new Error('Duplicate anchors');
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const url=new URL(match[1].replaceAll('&amp;','&'),new URL(page,base));
  if(url.origin!==base.origin)continue;
  if(!url.pathname.startsWith(base.pathname))throw new Error('Escaping link');
  let relative=decodeURIComponent(url.pathname.slice(base.pathname.length));
  if(!relative||relative.endsWith('/'))relative+='index.html';
  const path=resolve(output,relative);
  if(!(await stat(path)).isFile())throw new Error('Missing resource '+relative);
  if(url.hash&&path.endsWith('.html')){
   const target=await readFile(path,'utf8');
   if(!target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`))throw new Error('Missing anchor '+url.href);
  }
  count++;
 }
}
const report=await readFile(join(output,'index.html'),'utf8');
for(let n=1;n<=9;n++)if(!report.includes(`id="section-${n}"`))throw new Error('Missing research section '+n);
for(const file of ['01-understanding.md','02-sources-and-verification.md']){
 const original=await readFile(resolve(output,'../../notes',file),'utf8');
 if(original!==await readFile(join(output,'notes',file),'utf8'))throw new Error('Stale document '+file);
}
console.log(`DeepTutor check passed: 9 sections, downloads match source, ${count} local links and anchors.`);
