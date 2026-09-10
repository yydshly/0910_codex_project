import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {categories,methods,featured,scenarios,filterTools,safeUrl} from '../public/catalog.mjs';
const out=fileURLToPath(new URL('../dist/',import.meta.url));
const tools=JSON.parse(await readFile(resolve(out,'data/tools.json'),'utf8'));
assert.equal(await readFile(resolve(out,'data/tools.json'),'utf8'),await readFile(resolve(out,'../../data/tools.json'),'utf8'));
assert.equal(tools.length,753);assert.equal(new Set(tools.map(t=>t.id)).size,752);assert.equal(new Set(tools.map(t=>t.category)).size,26);
assert.equal(Object.keys(featured).length,20);assert.equal(scenarios.length,6);
for(const t of tools){assert.ok(categories[t.category]);assert.ok(methods[t.install.method]);}
for(const s of scenarios){assert.equal(s.steps.length,4);for(const id of s.ids)assert.ok(tools.some(t=>t.id===id),`Missing scenario tool ${id}`);}
for(const id of Object.keys(featured))assert.ok(tools.some(t=>t.id===id));
assert.equal(filterTools(tools).length,753);
assert.ok(filterTools(tools,{query:'照片'}).some(t=>t.id==='exiftool'));
assert.ok(filterTools(tools,{query:'mAiGrEt'}).some(t=>t.id==='maigret'));
assert.equal(filterTools(tools,{category:'username-social'}).length,82);
assert.equal(filterTools(tools,{method:'web'}).length,300);
assert.equal(filterTools(tools,{query:'maigret',category:'username-social',method:'pip'}).length,1);
assert.equal(filterTools(tools,{query:'maigret',category:'company-business'}).length,0);
assert.equal(filterTools(tools,{query:'THIS_STRING_HAS_NO_MATCH_0193123'}).length,0);
assert.equal(safeUrl('javascript:alert(1)'),null);assert.equal(safeUrl('file:///etc/passwd'),null);assert.equal(safeUrl(''),null);assert.equal(safeUrl('https://example.org/'),'https://example.org/');
const html=await readFile(resolve(out,'index.html'),'utf8');const base=new URL('https://local.invalid/0910_codex_project/010-awesome-osint-arsenal/');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
for(const id of ['guide','scenarios','catalog','core','overview','updates','meaning','sources'])assert.ok(ids.includes(id));
assert.ok(html.indexOf('id="catalog"')<html.indexOf('id="scenarios"'));
assert.deepEqual(await readFile(resolve(out,'assets/complete-understanding.png')),await readFile(resolve(out,'../../assets/complete-understanding.png')));
let count=0;
for(const file of ['index.html','app.mjs','catalog.mjs','style.css']){
 const source=await readFile(resolve(out,file),'utf8');
 const refs=[...source.matchAll(/(?:href|src)=["']([^"']+)["']/g),...source.matchAll(/(?:from\s*|fetch\(\s*)["'](\.[^"']+)["']/g)].map(m=>m[1]);
 for(const ref of refs){const url=new URL(ref,new URL(file,base));if(url.origin!==base.origin||ref==='../')continue;assert.ok(url.pathname.startsWith(base.pathname));const path=decodeURIComponent(url.pathname.slice(base.pathname.length))||'index.html';assert.ok((await stat(resolve(out,path))).isFile(),path);if(url.hash&&path==='index.html')assert.ok(ids.includes(url.hash.slice(1)));count++;}
}
for(const f of ['01-understanding.md','02-sources-and-verification.md'])assert.equal(await readFile(resolve(out,'notes',f),'utf8'),await readFile(resolve(out,'../../notes',f),'utf8'));
const stats=JSON.parse(await readFile(resolve(out,'data/statistics.json'),'utf8'));
assert.deepEqual(stats.methods,{web:300,manual:161,git:117,apt:62,pip:70,go:35,docker:8});
console.log(`Arsenal checks passed: 753 raw records, 20 explanations, six scenarios, filtering and safe URLs, ${count} local references. No third-party tools run.`);
