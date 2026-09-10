import {scenarios,capabilities,extensions,branches,sourceBase,initialState,transition,recipe,contextView,escapeHtml as esc} from './lab.mjs';
const $=id=>document.getElementById(id);
let state=initialState(), timer=null, compacted=false;
const selection=new Set();
function renderLab(){
  const scenario=scenarios[state.scenario], current=scenario.steps[state.step];
  $('scenario').value=state.scenario;
  $('mission-text').textContent=scenario.task;
  $('mission-tools').innerHTML=scenario.tools.map(tool=>`<span>${esc(tool)}</span>`).join('');
  $('scenario-note').textContent=scenario.note;
  $('scenario-source').href=sourceBase+scenario.source;
  $('step-title').textContent=current.title;
  $('step-count').innerHTML=`${String(state.step+1).padStart(2,'0')} <span>/ ${String(scenario.steps.length).padStart(2,'0')}</span>`;
  const track=$('step-track');
  // Keep stage buttons stable so keyboard focus survives a step change.
  if(track.children.length!==scenario.steps.length){track.innerHTML=scenario.steps.map((_,i)=>`<li><button type="button" data-step="${i}"></button></li>`).join('');}
  track.querySelectorAll('button').forEach((button,i)=>{button.textContent=scenario.steps[i].label;button.dataset.state=i<state.step?'past':'future';button.setAttribute('aria-label',`第 ${i+1} 步：${scenario.steps[i].title}`);if(i===state.step)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
  $('terminal-name').textContent='pi / '+scenario.title;
  $('terminal-log').innerHTML=scenario.steps.slice(0,state.step+1).map((entry,i)=>`<div class="log-entry" data-kind="${entry.kind}"><div class="log-meta"><span>${String(i+1).padStart(2,'0')}</span><span class="log-kind">${esc(entry.kind)}</span><span>${esc(entry.event)}</span></div><pre>${esc(entry.text)}</pre></div>`).join('');
  $('terminal-log').scrollTop=$('terminal-log').scrollHeight;
  $('why-title').textContent=current.title;
  $('why-text').textContent=current.why;
  $('artifact-name').textContent=scenario.file;
  $('artifact-state').textContent=current.artifactState;
  $('artifact-code').innerHTML=current.artifact.split('\n').map(line=>`<span${line.startsWith('−')?' class="removed"':line.startsWith('+')?' class="added"':''}>${esc(line)}</span>`).join('\n');
  const done=state.step===scenario.steps.length-1;
  $('play').textContent=state.playing?'Ⅱ 暂停演示':done?'↻ 重新演示':'▶ 自动演示';
  $('play').setAttribute('aria-pressed',String(state.playing));
  $('next').disabled=done;
  $('playback-state').textContent=done?'模拟任务完成':state.playing?`正在演示 · 第 ${state.step+1} 步`:`第 ${state.step+1} 步，可继续或选择任意阶段`;
}
function dispatch(action){
  clearTimeout(timer);timer=null;
  state=transition(state,action);renderLab();
  if(state.playing)timer=setTimeout(()=>dispatch({type:'next'}),2600);
}
$('scenario').addEventListener('change',event=>dispatch({type:'select',scenario:event.target.value}));
$('play').addEventListener('click',()=>dispatch({type:'play'}));
$('next').addEventListener('click',()=>dispatch({type:'next'}));
$('reset').addEventListener('click',()=>dispatch({type:'reset'}));
$('step-track').addEventListener('click',event=>{const button=event.target.closest('[data-step]');if(button)dispatch({type:'jump',step:Number(button.dataset.step)});});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.playing)dispatch({type:'pause'});});
window.addEventListener('pagehide',()=>clearTimeout(timer));

$('capability-list').innerHTML=capabilities.map(item=>`<button class="capability-button" type="button" data-capability="${item.id}" aria-pressed="false" aria-controls="capability-detail"><span class="capability-glyph" aria-hidden="true">${item.glyph}</span><span><strong>${esc(item.title)}</strong><small>${esc(item.subtitle)}</small></span></button>`).join('');
function selectCapability(id){
  const item=capabilities.find(c=>c.id===id);if(!item)return;
  document.querySelectorAll('[data-capability]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.capability===id)));
  $('capability-detail').innerHTML=`<p class="eyebrow">CAPABILITY / ${String(capabilities.indexOf(item)+1).padStart(2,'0')}</p><div class="detail-glyph" aria-hidden="true">${item.glyph}</div><h3>${esc(item.title)}</h3><p class="detail-description">${esc(item.description)}</p><dl class="detail-facts"><div><dt>如何实现</dt><dd>${esc(item.mechanism)}</dd></div><div><dt>适用场景</dt><dd>${esc(item.use)}</dd></div><div><dt>能力边界</dt><dd>${esc(item.boundary)}</dd></div></dl><a class="source-link" href="${sourceBase+item.source}">查看固定版本来源 ↗</a>`;
}
$('capability-list').addEventListener('click',event=>{const button=event.target.closest('[data-capability]');if(button)selectCapability(button.dataset.capability);});
function selectBranch(id){const branch=branches[id];document.querySelectorAll('[data-branch]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.branch===id)));$('branch-result').innerHTML=`<strong>${branch.title}</strong> <code>${branch.path}</code><p>${branch.text}</p>`;}
document.querySelectorAll('[data-branch]').forEach(button=>button.addEventListener('click',()=>selectBranch(button.dataset.branch)));
function renderContext(){const view=contextView(compacted);$('context-number').innerHTML=`${view.tokens}<span>k</span>`;$('context-blocks').innerHTML=view.blocks.map(type=>`<span class="${type}" aria-hidden="true"></span>`).join('');$('context-blocks').setAttribute('aria-label',compacted?'12k 历史摘要与 12k 近期消息，模拟值':'60k 较早消息与 12k 近期消息，模拟值');$('context-description').textContent=view.description;$('compact').textContent=compacted?'查看压缩前':'压缩上下文';$('compact').setAttribute('aria-pressed',String(compacted));}
$('compact').addEventListener('click',()=>{compacted=!compacted;renderContext();});
$('extension-options').innerHTML=extensions.map(item=>`<label class="extension-option"><input type="checkbox" value="${item.id}"><span><strong>${item.title}<span class="ext-type">${item.type}</span></strong><p>${item.description}</p></span></label>`).join('');
function renderRecipe(){const view=recipe(selection);$('recipe-title').textContent=view.title;$('recipe-stack').innerHTML=view.chips.map(chip=>`<span>${chip}</span>`).join('');$('recipe-description').textContent=view.description;}
$('recipe-description').setAttribute('aria-live','polite');
$('extension-options').addEventListener('change',event=>{if(event.target.checked)selection.add(event.target.value);else selection.delete(event.target.value);renderRecipe();});
renderLab();selectCapability('models');selectBranch('a');renderContext();renderRecipe();
