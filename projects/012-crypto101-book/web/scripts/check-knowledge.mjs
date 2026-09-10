import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {knowledgeKey,normalizeKnowledge,setKnowledge,matchesKnowledge,reviewPrompt} from '../public/knowledge-state.mjs';
import {storageKey,normalize} from '../public/state.mjs';
const data=JSON.parse(await readFile(new URL('../data/knowledge.json',import.meta.url),'utf8'));
const lessons=JSON.parse(await readFile(new URL('../data/lessons.json',import.meta.url),'utf8'));
const source=JSON.parse(await readFile(new URL('../data/source-inventory.json',import.meta.url),'utf8'));
const points=data.points,ids=points.map(p=>p.id);
assert.equal(points.length,52);assert.equal(new Set(ids).size,52);
assert.equal(points.filter(p=>p.priority==='必会').length,44);assert.equal(points.filter(p=>p.priority==='进阶').length,8);assert.equal(points.filter(p=>p.origin==='补充学习').length,10);
for(const p of points){
 assert(lessons.some(l=>l.id===p.chapter));
 for(const field of ['title','core','pitfall','mastery','question','answer'])assert(typeof p[field]==='string'&&p[field].length>8,p.id+': '+field);
 assert(['必会','进阶'].includes(p.priority));assert(['原书提炼','补充学习'].includes(p.origin));assert(p.sources.length>0);
 for(const s of p.sources)assert.equal(new URL(s.url).protocol,'https:');
 if(p.origin==='原书提炼'){assert(source.chapters.find(c=>c.id===p.chapter)?.sections.some(s=>s.line===p.line),p.id+' source heading');assert(p.sources[0].url.includes(source.sha));}
}
assert.notEqual(storageKey,knowledgeKey);
const old=normalize({done:['foreword'],notes:{foreword:'已有笔记'}},lessons.map(l=>l.id));
const state=Object.freeze(normalizeKnowledge({k01:'ready',k44:'review',k52:42,obsolete:'ready'},ids));
assert.deepEqual(state,{k01:'ready',k44:'review'});
const next=setKnowledge(state,'k07','ready',ids);assert.deepEqual(state,{k01:'ready',k44:'review'});assert.equal(next.k44,'review');assert.equal(next.k07,'ready');
assert.deepEqual(setKnowledge(next,'k07','todo',ids),state);assert.equal(setKnowledge(state,'bad','ready',ids),state);assert.deepEqual(normalizeKnowledge([],ids),{});assert.deepEqual(normalizeKnowledge(null,ids),{});
assert.deepEqual(old,{done:['foreword'],notes:{foreword:'已有笔记'}});
assert.equal(matchesKnowledge(points[0],state,'required',true),false);assert.equal(matchesKnowledge(points[43],state,'supplement',true),true);
assert.equal(points.filter(p=>matchesKnowledge(p,{},'advanced',false)).length,8);
const prompt=reviewPrompt(points,state);assert(!prompt.includes('K01 '+points[0].title));assert(prompt.includes('K44 '+points[43].title));assert(prompt.indexOf('K02 ')<prompt.indexOf('K08 '));assert(reviewPrompt(points,Object.fromEntries(ids.map(id=>[id,'ready']))).includes('换场景'));
const root=new URL('../dist/',import.meta.url);
const home=await readFile(new URL('knowledge.html',root),'utf8');
const escape=value=>value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
assert.equal([...home.matchAll(/data-knowledge-card="/g)].length,52);assert(home.includes('五个场景'));assert(home.includes('key-knowledge.md'));
for(const p of points){
 assert(home.includes('id="key-'+p.id+'"'));assert(home.includes(escape(p.mastery)));assert(home.includes(escape(p.answer)));
 const chapter=await readFile(new URL(p.chapter+'.html',root),'utf8');
 assert(chapter.includes('data-knowledge-card="'+p.id+'"'));
 const catalog=JSON.parse(chapter.match(/id="knowledge-catalog">([\s\S]*?)<\/script>/)[1]);assert.deepEqual(catalog.map(p=>p.id),ids);
}
const guide=await readFile(new URL('key-knowledge.md',root),'utf8');for(const p of points)assert(guide.includes(p.title)&&guide.includes(p.mastery));
console.log('Knowledge checks passed: 52 points, 44 required/8 advanced, 42 book/10 supplements; source lines, all chapter links, cross-chapter state retention, old progress isolation, filters and review prompt.');
