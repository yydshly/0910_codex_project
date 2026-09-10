import {knowledgeKey,normalizeKnowledge,setKnowledge,matchesKnowledge,reviewPrompt} from './knowledge-state.mjs';
const catalog=JSON.parse(document.querySelector('#knowledge-catalog')?.textContent||'[]');
const ids=catalog.map(p=>p.id),byId=new Map(catalog.map(p=>[p.id,p]));
const cards=[...document.querySelectorAll('[data-knowledge-card]')],scope=cards.map(c=>byId.get(c.dataset.knowledgeCard)).filter(Boolean);
let state={},available=true;
try{state=normalizeKnowledge(JSON.parse(localStorage.getItem(knowledgeKey)||'{}'),ids);}catch{available=false;}
const status=document.querySelector('[data-knowledge-storage]');
const filter=document.querySelector('[data-knowledge-filter]'),pending=document.querySelector('[data-knowledge-pending]');
function report(message){if(status)status.textContent=message;}
function refresh() {
  let shown=0;
  for(const card of cards){const point=byId.get(card.dataset.knowledgeCard);card.hidden=!matchesKnowledge(point,state,filter?.value||'all',pending?.checked||false);if(!card.hidden)shown++;const select=card.querySelector('[data-knowledge-state]');select.value=state[point.id]||'todo';select.disabled=false;}
  const ready=scope.filter(p=>state[p.id]==='ready').length,review=scope.filter(p=>state[p.id]==='review').length;
  document.querySelectorAll('[data-knowledge-summary]').forEach(e=>e.textContent='当前范围 '+scope.length+' 项：未学 '+(scope.length-ready-review)+' · 需复习 '+review+' · 能解释 '+ready+(filter?'；筛选显示 '+shown+' 项':''));
  document.querySelectorAll('.knowledge-domain').forEach(section=>section.hidden=![...section.querySelectorAll('[data-knowledge-card]')].some(card=>!card.hidden));
  for(const a of document.querySelectorAll('.knowledge-group-nav a')){const target=document.getElementById(a.hash.slice(1));a.hidden=!!target?.hidden;}
  const empty=document.querySelector('[data-knowledge-empty]');if(empty)empty.hidden=shown>0;
  const prompt=document.querySelector('[data-review-prompt]');if(prompt)prompt.value=reviewPrompt(catalog,state);
  const chapterPrompt=document.querySelector('[data-prompt]');
  if(chapterPrompt&&scope.length){
    if(!chapterPrompt.dataset.knowledgeBase)chapterPrompt.dataset.knowledgeBase=chapterPrompt.dataset.template||chapterPrompt.value;
    const missing=scope.filter(p=>state[p.id]!=='ready');
    const addition=missing.length?'\n本章尚未自评掌握的关键点：\n'+missing.map(p=>p.id.toUpperCase()+' '+p.title).join('\n'):'\n本章关键点均已自评能解释，请换场景抽查，不把自评当作掌握证明。';
    chapterPrompt.dataset.template=chapterPrompt.dataset.knowledgeBase+addition;chapterPrompt.value=chapterPrompt.dataset.template;
  }
}
refresh();if(!available)report('浏览器保存不可用或旧数据无法读取；当前页面仍可记录，请导出复习记录自行保存。');
if(filter)filter.disabled=false;if(pending)pending.disabled=false;
document.querySelectorAll('[data-knowledge-state]').forEach(select=>select.addEventListener('change',()=>{state=setKnowledge(state,select.dataset.knowledgeState,select.value,ids);try{localStorage.setItem(knowledgeKey,JSON.stringify(state));available=true;report('知识点状态已保存在此浏览器，章节进度与笔记保持独立。');}catch{available=false;report('保存不可用，当前修改只在本页面有效；请导出复习记录。');}refresh();}));
filter?.addEventListener('change',refresh);pending?.addEventListener('change',refresh);
document.addEventListener('click',event=>{const link=event.target.closest?.('a[href^="#key-"]');if(link&&filter&&pending){filter.value='all';pending.checked=false;refresh();}});
const copy=document.querySelector('[data-review-copy]');if(copy){copy.disabled=false;copy.addEventListener('click',async()=>{const input=document.querySelector('[data-review-prompt]');try{await navigator.clipboard.writeText(input.value);report('已复制待学清单和引导语。粘贴到对话后即可继续。');}catch{input.focus();input.select();report('请手动复制已选中的引导语。');}});}
const download=document.querySelector('[data-knowledge-export]');if(download){download.disabled=false;download.addEventListener('click',()=>{const content='# Crypto 101 复习记录\n\n导出时间：'+new Date().toISOString()+'\n个人自评记录，不是能力认证；此文件不自动恢复网站状态。\n\n'+catalog.map(p=>'- '+p.id.toUpperCase()+' ['+({review:'需复习',ready:'能解释'}[state[p.id]]||'未学')+'] '+p.title+' · '+p.priority+' · '+p.origin).join('\n')+'\n\n'+reviewPrompt(catalog,state);const url=URL.createObjectURL(new Blob([content],{type:'text/markdown;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='crypto101-review.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);report('已导出复习记录；其中包含当前全部知识点状态。');});}
