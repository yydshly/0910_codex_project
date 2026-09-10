import {readFile,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const out=fileURLToPath(new URL('../dist/',import.meta.url)),base=new URL('https://local.invalid/0910_codex_project/011-luvus/');
const pages=['index.html','understanding.html','architecture.html','sources.html'];const ids=new Map();
for(const page of pages){const html=await readFile(resolve(out,page),'utf8'),found=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);if(new Set(found).size!==found.length)throw new Error('Duplicate IDs '+page);ids.set(page,new Set(found));if(!html.includes('lang="zh-CN"')||!html.includes('上游未运行'))throw new Error('Missing language or verification scope');}
let count=0;
for(const page of pages){const html=await readFile(resolve(out,page),'utf8');for(const [,ref]of html.matchAll(/(?:href|src)="([^"]+)"/g)){const url=new URL(ref,new URL(page,base));if(url.origin!==base.origin||ref==='../')continue;if(!url.pathname.startsWith(base.pathname))throw new Error('Escaping project '+ref);let path=decodeURIComponent(url.pathname.slice(base.pathname.length))||'index.html';if(!(await stat(resolve(out,path))).isFile())throw new Error('Missing '+path);if(url.hash&&(!ids.has(path)||!ids.get(path).has(url.hash.slice(1))))throw new Error('Missing anchor '+ref);count++;}}
for(const name of ['01-understanding.md','02-full-architecture.md','03-sources-and-verification.md'])if(await readFile(resolve(out,'notes',name),'utf8')!==await readFile(resolve(out,'../../notes',name),'utf8'))throw new Error('Stale download '+name);
const md=await readFile(resolve(out,'notes/02-full-architecture.md'),'utf8'),mmd=await readFile(resolve(out,'assets/full-architecture.mmd'),'utf8');if(!md.replaceAll('\r\n','\n').includes(mmd.replaceAll('\r\n','\n').trim()))throw new Error('Mermaid source mismatch');
if(ids.get('understanding.html').size!==9)throw new Error('Missing research sections');
console.log(`Luvus check passed: four pages, nine research sections, ${count} links/anchors, matching notes and full diagram source.`);
