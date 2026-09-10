import {readFile,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const web=fileURLToPath(new URL('../',import.meta.url)),out=resolve(web,'dist'),base=new URL('https://local.invalid/0910_codex_project/013-plinkopinball/'),pages=['index.html','understanding.html','sources.html','games.html','games-notes.html'],ids=new Map();
for(const page of pages){const html=await readFile(resolve(out,page),'utf8'),found=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);if(new Set(found).size!==found.length)throw new Error('Duplicate IDs '+page);ids.set(page,new Set(found));if(!html.includes('lang="zh-CN"'))throw new Error('Missing language');}
let count=0;for(const page of pages){const html=await readFile(resolve(out,page),'utf8');for(const [,ref]of html.matchAll(/(?:href|src)="([^"]+)"/g)){const url=new URL(ref,new URL(page,base));if(url.origin!==base.origin||ref==='../')continue;if(!url.pathname.startsWith(base.pathname))throw new Error('Escaping path '+ref);const path=decodeURIComponent(url.pathname.slice(base.pathname.length))||'index.html';if(!(await stat(resolve(out,path))).isFile())throw new Error('Missing file '+path);if(url.hash&&!ids.get(path)?.has(url.hash.slice(1)))throw new Error('Missing anchor '+ref);count++;}}
for(const name of ['01-understanding.md','02-sources-and-verification.md','03-game-directions.md'])if(await readFile(resolve(out,'notes',name),'utf8')!==await readFile(resolve(web,'../notes',name),'utf8'))throw new Error('Stale note '+name);
const html=await readFile(resolve(out,'index.html'),'utf8'),app=await readFile(resolve(out,'app.mjs'),'utf8');
for(const [,id]of app.matchAll(/\$\('([^']+)'\)/g))if(!ids.get('index.html').has(id))throw new Error('Unknown element '+id);
for(const marker of ['原版 3D 体验','原理实验','原创的简化二维教学实验','64a896e','iframe'])if(!html.includes(marker))throw new Error('Missing provenance '+marker);
for(const file of ['app.mjs','physics.mjs','webmcp.mjs','games-engine.mjs','games-view.mjs','games-app.mjs','games-webmcp.mjs'])execFileSync(process.execPath,['--check',resolve(out,file)],{stdio:'inherit'});
execFileSync(process.execPath,['scripts/check-physics.mjs'],{cwd:web,stdio:'inherit'});
execFileSync(process.execPath,['scripts/check-webmcp.mjs'],{cwd:web,stdio:'inherit'});
execFileSync(process.execPath,['scripts/check-games.mjs'],{cwd:web,stdio:'inherit'});
console.log(`Plinkopinball check passed: five pages, ${count} local links/anchors, matching notes, scripts and simulation tests.`);
