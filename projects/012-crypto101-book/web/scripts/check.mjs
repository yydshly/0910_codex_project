import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {normalize,toggleDone,xorDemo,dhDemo} from '../public/state.mjs';
const web=fileURLToPath(new URL('../',import.meta.url)),out=resolve(web,'dist');
const parse=async name=>JSON.parse(await readFile(resolve(web,'data',name),'utf8'));
const [lessons,inv,guides,terms]=await Promise.all(['lessons.json','source-inventory.json','section-guides.json','glossary.json'].map(parse));
assert.equal(lessons.length,18);assert.equal(new Set(lessons.map(l=>l.id)).size,18);assert.equal(inv.chapters.reduce((n,c)=>n+c.sections.length,0),204);assert.equal(inv.terms.length,57);assert.equal(inv.references.length,47);
for(const c of inv.chapters){assert(lessons.some(l=>l.id===c.id));assert.equal((guides[c.id]||'').split('\n').filter(Boolean).length,c.sections.length-1);for(const s of c.sections){assert(Number.isInteger(s.line)&&s.line>0);assert(s.status);}}
assert.deepEqual(new Set(terms.map(t=>t.term)),new Set(inv.terms.map(t=>t.term)));
const pages=(await readdir(out)).filter(f=>f.endsWith('.html'));assert.equal(pages.length,20);
const ids=new Map(),htmls=new Map(),base=new URL('https://local.invalid/0910_codex_project/012-crypto101-book/');
for(const file of pages){const html=await readFile(resolve(out,file),'utf8'),found=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(found.length,new Set(found).size,'Duplicate IDs '+file);ids.set(file,new Set(found));htmls.set(file,html);assert(html.includes('lang="zh-CN"'));assert(html.includes('name="viewport"'));assert.equal([...html.matchAll(/data-chapter="/g)].length,18);}
let references=0;
for(const [file,html]of htmls){for(const [,ref]of html.matchAll(/(?:href|src)="([^"]+)"/g)){const url=new URL(ref.replaceAll('&amp;','&'),new URL(file,base));assert(['https:','http:'].includes(url.protocol));if(url.origin!==base.origin||ref==='../')continue;assert(url.pathname.startsWith(base.pathname),'Escaping project '+ref);let path=decodeURIComponent(url.pathname.slice(base.pathname.length))||'index.html';if(path.endsWith('/'))path+='index.html';assert((await stat(resolve(out,path))).isFile(),path);if(url.hash)assert(ids.get(path)?.has(decodeURIComponent(url.hash.slice(1))),'Missing anchor '+ref);references++;}}
for(const l of lessons){const html=htmls.get(l.id+'.html');assert(html.includes(l.quiz.question));assert(html.includes(l.quiz.answer));assert(ids.get(l.id+'.html').has('continue'));assert(l.goals.length>=3);assert(l.concepts.length===3);const c=inv.chapters.find(c=>c.id===l.id);if(c)for(const s of c.sections.slice(1))assert(ids.get(l.id+'.html').has('topic-'+s.line));}
const state=normalize({done:['exclusive-or','exclusive-or','bad'],notes:{'exclusive-or':'abc',bad:'no','foreword':42}},lessons.map(l=>l.id));assert.deepEqual(state,{done:['exclusive-or'],notes:{'exclusive-or':'abc'}});assert.deepEqual(toggleDone(toggleDone(state,'foreword'),'foreword'),state);assert.deepEqual(normalize(null,[]),{done:[],notes:{}});
assert.deepEqual(xorDemo('00101101','10101010'),{enc:'10000111',back:'00101101'});assert.equal(xorDemo('11111111','11111111').enc,'00000000');assert.throws(()=>xorDemo('01012','00000000'));
assert.deepEqual(dhDemo(6,15),{A:'8',B:'19',alice:'2',bob:'2'});assert.throws(()=>dhDemo(0,15));assert.throws(()=>dhDemo(2.5,15));for(const a of [1,2,6,20])for(const b of [1,7,15,20]){const d=dhDemo(a,b);assert.equal(d.alice,d.bob);}
for(const name of ['01-capabilities.md','02-sources-and-verification.md','03-learning-path.md'])assert.equal(await readFile(resolve(out,'notes',name),'utf8'),await readFile(resolve(web,'../notes',name),'utf8'));
assert((await readFile(resolve(out,'study-guide.md'),'utf8')).includes('全部术语'));
console.log('Crypto 101 checks passed: coverage, 20 pages, '+references+' local references, source anchors, glossary, downloads, progress normalization and two teaching calculations.');
