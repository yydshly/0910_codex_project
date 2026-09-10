import assert from 'node:assert/strict';
import {readFile,access,readdir} from 'node:fs/promises';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {scenarios,capabilities,extensions} from '../public/lab.mjs';
const web=fileURLToPath(new URL('../',import.meta.url)),output=join(web,'dist');
const page=await readFile(join(output,'index.html'),'utf8');
assert.match(page,/<html lang="zh-CN">/);assert.match(page,/<meta name="viewport"/);
const ids=[...page.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,new Set(ids).size,'Duplicate element IDs');
let links=0;
for(const name of ['index.html','app.mjs','lab.mjs','style.css','theory.html','theory.mjs','theory.css','understanding.html','understanding.css']){
  const source=await readFile(join(output,name),'utf8');
  const references=[...source.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]);
  if(name.endsWith('.mjs'))references.push(...[...source.matchAll(/from\s*['"](\.[^'"]+)['"]/g)].map(m=>m[1]));
  for(const reference of references){
    if(/^(https?:|data:)/.test(reference)||reference.includes('${'))continue;
    assert.ok(!reference.startsWith('/'),'Root-relative paths break Pages subpaths');
    const [path,anchor]=reference.split('#');const target=path?resolve(dirname(join(output,name)),path):join(output,name);
    await access(target);if(anchor)assert.ok((await readFile(target,'utf8')).includes(`id="${anchor}"`),`Missing anchor ${reference}`);links++;
  }
  if(name.endsWith('.mjs'))execFileSync(process.execPath,['--check',join(output,name)],{stdio:'pipe'});
}
const app=await readFile(join(output,'app.mjs'),'utf8');
for(const [,id] of app.matchAll(/\$\('([^']+)'\)/g))assert.ok(ids.includes(id),`Missing app element #${id}`);
for(const [id,scenario] of Object.entries(scenarios)){
  assert.ok(page.includes(`value="${id}"`));assert.equal(scenario.steps.length,6);
  for(const step of scenario.steps)for(const key of ['label','title','kind','event','text','why','artifact'])assert.ok(step[key],`${id}: missing ${key}`);
}
assert.equal(capabilities.length,8);assert.equal(extensions.length,4);
assert.match(page,/不调用模型/);assert.match(page,/教学数值/);assert.match(page,/上游未实际运行/);
await access(join(output,'notes/01-analysis.md'));
const theory=await readFile(join(output,'theory.html'),'utf8');
assert.equal([...theory.matchAll(/class="source-item"/g)].length,18);
assert.ok(!theory.includes('<!-- THEORY_SOURCES -->'));
const theoryIds=[...theory.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(theoryIds.length,new Set(theoryIds).size,'Duplicate theory IDs');
for(const [,target] of theory.matchAll(/aria-(?:controls|labelledby)="([^"]+)"/g))assert.ok(theoryIds.includes(target));
const theoryScript=await readFile(join(output,'theory.mjs'),'utf8');
for(const [,id] of theoryScript.matchAll(/getElementById\('([^']+)'\)/g))assert.ok(theoryIds.includes(id),`Missing theory target ${id}`);
for(const file of ['architecture.svg','architecture.png','scheduling-flow.svg','scheduling-flow.png'])await access(join(output,'assets',file));
await access(join(output,'notes/02-architecture-and-scheduling.md'));
const article=await readFile(join(output,'understanding.html'),'utf8');
assert.equal([...article.matchAll(/<h2 id="section-/g)].length,8);
assert.ok(!article.includes('<!-- UNDERSTANDING_ARTICLE -->'));
assert.match(article,/上游 Pi 已被实际部署或测试/);
await access(join(output,'notes/03-understanding.md'));
execFileSync(process.execPath,['--test',join(web,'scripts/lab.test.mjs')],{stdio:'inherit'});
console.log(`Pi Lab checked: 3 scenarios / 18 stages, 8 capabilities, 16 extension combinations, ${links} local references, JS syntax and DOM targets.`);
