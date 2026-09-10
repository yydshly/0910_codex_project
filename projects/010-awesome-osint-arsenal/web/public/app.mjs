import {categories,methods,featured,scenarios,filterTools,safeUrl} from './catalog.mjs';
const $=id=>document.getElementById(id);
const upstream='https://github.com/rawfilejson/awesome-osint-arsenal/blob/2c6475a1d5b941cc598b3612419ef22e6d903ce8/README.md';
const state={tools:[],query:'',category:'',method:'',page:1,scenario:'photo'};
const pageSize=24;
function el(tag,text,className){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;return node;}
function link(text,url){const a=el('a',text);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}
function selectScenario(id){
 const s=scenarios.find(x=>x.id===id);if(!s)throw new Error('Unknown scenario');state.scenario=id;
 $('scenario-buttons').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.id===id)));
 for(const key of ['question','input','output','boundary'])$(key).textContent=s[key];
 $('selected-tools').replaceChildren(...s.ids.map(id=>{const t=state.tools.find(t=>t.id===id);const card=el('article',undefined,'selected-tool');card.append(el('h4',t?.name||id),el('p',featured[id]?.[0]||t?.description||''),el('small',featured[id]?.[1]||''));return card;}));
 $('steps').replaceChildren(...s.steps.map(step=>el('li',step)));
 return {scenario:s.id,question:s.question,tools:s.ids,executed:false};
}
function render(){
 const found=filterTools(state.tools,state);const pages=Math.max(1,Math.ceil(found.length/pageSize));state.page=Math.max(1,Math.min(state.page,pages));
 const start=(state.page-1)*pageSize;const subset=found.slice(start,start+pageSize);
 $('results').replaceChildren(...subset.map(t=>{
   const card=el('article',undefined,'tool-card');const tags=el('div',undefined,'tags');tags.append(el('span',categories[t.category]||t.category,'tag'),el('span',methods[t.install.method]||t.install.method,'tag'));
   card.append(tags,el('h3',t.name),el('p',featured[t.id]?.[0]||t.description||'上游未填写用途说明。','description'));
   if(featured[t.id])card.append(el('p',featured[t.id][1],'caveat'));
   const detail=el('details');detail.append(el('summary','上游原文与记录信息'),el('p',t.description||'未填写描述'),el('p',`记录 ID：${t.id} · 描述为上游快照，未经本次运行验证。`));card.append(detail);
   const bottom=el('div',undefined,'card-bottom');bottom.append(el('span','已收录 · 未实测'));
   const url=safeUrl(t.url);bottom.append(link(url?'原记录链接 ↗':'查阅上游目录 ↗',url||upstream));card.append(bottom);return card;
 }));
 $('result-count').textContent=`匹配 ${found.length} / ${state.tools.length} 条${found.length?` · 当前 ${start+1}–${Math.min(start+pageSize,found.length)} 条`:''}`;
 $('empty').hidden=found.length>0;$('page-state').textContent=`第 ${state.page} / ${pages} 页`;$('previous').disabled=state.page===1;$('next').disabled=state.page===pages;
 return {count:found.length,page:state.page,pages,items:subset.map(t=>({name:t.name,category:categories[t.category],method:methods[t.install.method]})),executed:false};
}
function updateFilters(input){
 if(input===null||typeof input!=='object'||Array.isArray(input))throw new Error('Expected filter object');
 for(const key of Object.keys(input))if(!['query','category','method'].includes(key))throw new Error('Unknown filter');
 for(const key of ['query','category','method'])if(input[key]!==undefined&&typeof input[key]!=='string')throw new Error('Filters must be text');
 if(input.category&&!Object.hasOwn(categories,input.category))throw new Error('Unknown category');
 if(input.method&&!Object.hasOwn(methods,input.method))throw new Error('Unknown method');
 if((input.query||'').length>200)throw new Error('Query too long');
 Object.assign(state,{query:input.query||'',category:input.category||'',method:input.method||'',page:1});
 for(const id of ['query','category','method'])$(id).value=state[id];return render();
}
try{
 const response=await fetch('./data/tools.json');if(!response.ok)throw new Error(`Directory HTTP ${response.status}`);state.tools=await response.json();
 if(!Array.isArray(state.tools))throw new Error('Invalid directory data');
 for(const [id,label] of Object.entries(categories))$('category').append(new Option(`${label}（${state.tools.filter(t=>t.category===id).length}）`,id));
 for(const [id,label] of Object.entries(methods))$('method').append(new Option(label,id));
 for(const s of scenarios){const b=el('button',s.label);b.type='button';b.dataset.id=s.id;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>selectScenario(s.id));$('scenario-buttons').append(b);}
 $('filters').addEventListener('submit',e=>e.preventDefault());
 for(const id of ['query','category','method'])$(id).addEventListener(id==='query'?'input':'change',()=>updateFilters({query:$('query').value,category:$('category').value,method:$('method').value}));
 $('filters').addEventListener('reset',e=>{e.preventDefault();updateFilters({});});
 for(const [id,delta] of [['previous',-1],['next',1]])$(id).addEventListener('click',()=>{state.page+=delta;render();$('catalog').scrollIntoView({block:'start'});});
 const counts=Object.keys(methods).map(method=>({method,count:state.tools.filter(t=>t.install.method===method).length})).sort((a,b)=>b.count-a.count);
 $('method-stats').replaceChildren(...counts.map(({method,count})=>{const box=el('div',undefined,'method-stat');const progress=el('progress');progress.max=state.tools.length;progress.value=count;progress.setAttribute('aria-label',`${methods[method]} ${count} 条`);box.append(el('b',String(count)),el('span',methods[method]),progress);return box;}));
 selectScenario('photo');render();
 if(document.modelContext?.registerTool){
   const lifecycle=new AbortController();window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
   for(const tool of [
     {name:'filter_arsenal_catalog',title:'筛选工具目录',description:'筛选页面收录的工具记录。只改变本页筛选，不安装软件、不查询外部目标。',inputSchema:{type:'object',properties:{query:{type:'string',maxLength:200},category:{type:'string',enum:['',...Object.keys(categories)]},method:{type:'string',enum:['',...Object.keys(methods)]}},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:updateFilters},
     {name:'show_arsenal_scenario',title:'查看用途场景',description:'显示某个工具选择场景及预期输出类型。不会执行调查。',inputSchema:{type:'object',properties:{scenario:{type:'string',enum:scenarios.map(s=>s.id)}},required:['scenario'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input=>{if(!input||typeof input!=='object'||Object.keys(input).some(k=>k!=='scenario')||typeof input.scenario!=='string')throw new Error('Invalid scenario input');return selectScenario(input.scenario);}}
   ]){try{await document.modelContext.registerTool(tool,{signal:lifecycle.signal});}catch(error){console.warn('Optional catalog tool unavailable',error.message);}}
 }
}catch(error){$('result-count').textContent='目录加载失败，请刷新重试；也可下载原始目录。';$('results').replaceChildren(el('p',error.message,'notice'));}
