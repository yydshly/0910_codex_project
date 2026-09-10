import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { scenarios } from '../public/app.mjs';
const web = fileURLToPath(new URL('../',import.meta.url));
const output = join(web,'dist');
let links = 0;
for (const name of ['index.html','understanding.html']) {
const page = await readFile(join(output,name),'utf8');
assert.match(page,/<html lang="zh-CN">/); assert.match(page,/<meta name="viewport"/);
const ids = [...page.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,new Set(ids).size,'Duplicate element IDs');
for(const match of page.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
  const link=match[1]; if(/^https?:/.test(link) || link === '../') continue;
  assert.ok(!link.startsWith('/'),'Absolute local path');
  const [path,anchor]=link.split('#'); let file=resolve(output,path || name); if(path.endsWith('/')) file=join(file,'index.html');
  await access(file); if(anchor) assert.ok((await readFile(file,'utf8')).includes(`id="${anchor}"`),`Missing anchor ${link}`); links++;
}
for(const image of page.matchAll(/<img\b[^>]*>/g)) assert.match(image[0],/alt="[^"]+"/);
}
const report = await readFile(join(output,'understanding.html'),'utf8');
for(const claim of ['我们最终确认的理解与 Codex 对比','比较的意义','证据索引','https://learn.chatgpt.com/docs/codex/cli']) assert.ok(report.includes(claim),`Missing research content: ${claim}`);
for(const asset of ['research-overview.png','research-overview.svg','upstream-workspace.png']) await access(join(output,'assets',asset));
for(const id of ['coding','research','agents']) { assert.ok(scenarios[id]); assert.equal(scenarios[id].steps.length,5); for(const step of scenarios[id].steps) assert.ok(step.length===5 && step.every(value=>typeof value==='string' && value.length>0)); }
for(const file of ['public/app.mjs','dist/app.mjs','scripts/build.mjs','scripts/serve.mjs','scripts/render-report.mjs']) execFileSync(process.execPath,['--check',join(web,file)]);
async function checkDocs(dir) { for(const item of await readdir(dir,{withFileTypes:true})) { if(['dist','public'].includes(item.name)) continue;const path=join(dir,item.name);if(item.isDirectory()) {await checkDocs(path);continue;}if(!path.endsWith('.md')) continue;for(const m of (await readFile(path,'utf8')).matchAll(/\]\(([^)]+)\)/g)){if(/^(https?:|#)/.test(m[1])) continue;await access(resolve(dirname(path),m[1].split('#')[0]));} } }
await checkDocs(resolve(web,'..'));
console.log(`Pi Web showcase validated: ${links} local references, 3 scenarios / 15 stages, JavaScript syntax and research links. Browser interactions not tested.`);
