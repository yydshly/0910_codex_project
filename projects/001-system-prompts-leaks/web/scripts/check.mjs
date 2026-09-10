import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {agents,scenarios,reuseCases,commit,sourceUrl,getAgent,getCapability} from '../public/catalog.js';
import {fileURLToPath} from 'node:url';
// Reports are generated and absent in a fresh checkout.
await import('./render-report.mjs');
const root=new URL('../public/',import.meta.url);
const inventory=JSON.parse((await readFile(new URL('inventory.json',root),'utf8')).replace(/^\uFEFF/,''));
assert.equal(inventory.commit,commit);
const paths=new Set(inventory.groups.flatMap(g=>g.paths));
assert.equal(new Set(agents.map(a=>a.id)).size,agents.length);
for(const agent of agents){
assert.equal(new Set(agent.caps.map(c=>c.id)).size,agent.caps.length);
for(const cap of agent.caps){
assert(paths.has(cap.path),'Source not in snapshot: '+cap.path);
for(const field of ['title','summary','section','rule','effect','runtime','boundary'])assert(cap[field]?.trim());
assert(sourceUrl(cap.path).includes(commit));
assert.equal(getCapability(agent,cap.id),cap);
}
}
for(const scenario of scenarios){assert.equal(scenario.steps.length,4);assert(agents.find(a=>a.id===scenario.agent)?.caps.find(c=>c.id===scenario.cap));}
assert.equal(getAgent('unknown').id,'codex');
for(const example of reuseCases){
assert(agents.find(a=>a.id===example.agent)?.caps.find(c=>c.id===example.cap));
for(const field of ['problem','pattern','instruction','measure','limit'])assert(example[field]?.trim());
assert(example.tools.length>0);
}
for(const group of inventory.groups){assert.equal(group.files,group.paths.length);assert.equal(group.markdown,group.paths.filter(p=>p.endsWith('.md')).length);}
const html=await readFile(new URL('index.html',root),'utf8');
for(const match of html.matchAll(/(?:src|href)="\.\/([^"]+)"/g))await readFile(new URL(match[1],root));
for(const file of await readdir(root))if(file.endsWith('.js'))execFileSync(process.execPath,['--check',fileURLToPath(new URL(file,root))]);
console.log('Validated '+agents.length+' products, '+agents.reduce((n,a)=>n+a.caps.length,0)+' capability explanations, '+scenarios.length+' scenarios, source paths, local assets and JavaScript syntax.');
await import('./interaction-check.mjs');
