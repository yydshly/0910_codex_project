import {agents,scenarios,reuseCases,commit,sourceUrl,getAgent,getCapability} from './catalog.js';
import {taskLoopSteps,taskRoutes,getTaskRoute,taskLogicMarkup} from './task-logic.js';
const content=document.querySelector('#content');
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validViews=['explore','flow','inventory','meaning','logic'];
const initialView=location.hash.slice(1);
const state={view:validViews.includes(initialView)?initialView:'explore',agent:'codex',cap:'execution',scenario:'fix',step:0,reuse:'delivery',logicStep:0,logicRoute:'normal'};
let inventory, inventoryError=false;
const external=(url,text)=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(text)}</a>`;
function source(cap){return `<div class="source-box"><div><code>${esc(cap.path)}</code><small>对应章节：${esc(cap.section)}</small></div>${external(sourceUrl(cap.path),'查看原文 ↗')}</div>`;}
function renderExplore(){
const agent=getAgent(state.agent), selected=getCapability(agent,state.cap);
content.innerHTML=`<div class="agent-picker" aria-label="选择 Agent">${agents.map(a=>`<button data-agent="${a.id}" class="agent-button ${a.id===agent.id?'active':''}" aria-pressed="${a.id===agent.id}" style="--agent-color:${a.color}"><span class="agent-symbol" aria-hidden="true">${a.symbol}</span><span><span class="agent-name">${a.name}</span><span class="agent-vendor">${a.vendor}</span></span></button>`).join('')}</div>
<div class="section-heading"><div><h2>${agent.name} <span style="font-weight:400;color:#95a2b7">/</span> 已收录的能力线索</h2><p>${agent.version}</p></div><span class="count-label">精选解读 ${agent.caps.length} 项 · 非完整能力清单</span></div>
<div class="explorer"><div class="cap-list" aria-label="${agent.name} 能力">${agent.caps.map((c,i)=>`<button class="cap-button ${c.id===selected.id?'active':''}" data-cap="${c.id}" aria-pressed="${c.id===selected.id}"><span class="cap-no">0${i+1}</span><span><strong>${c.title}</strong><small>${c.summary}</small></span><span class="arrow" aria-hidden="true">›</span></button>`).join('')}</div>
<article class="detail" aria-label="能力解读" aria-live="polite"><header class="detail-head"><div class="detail-topline"><span>指令层拆解 / ${String(agent.caps.indexOf(selected)+1).padStart(2,'0')}</span><span class="verified-label">仓库文件已核对</span></div><h3>${selected.title}</h3><p>${selected.summary}</p></header>
<div class="detail-body"><div class="rule"><span class="block-label">01 · 指令要求什么 / 中文解读</span><p>${selected.rule}</p></div><div class="mechanism"><div><h4>02 · 对任务有什么影响</h4><p>${selected.effect}</p></div><div><h4>03 · 程序还要做什么</h4><p>${selected.runtime}</p></div></div><div class="boundary"><p><strong>解读边界</strong>${selected.boundary}</p></div>${source(selected)}</div></article></div>
<div class="understanding"><span aria-hidden="true">⌘</span><p><strong>你看到的是 Agent 的工作说明书。</strong> 指令引导模型选择行动，工具执行程序把行动变成真实结果。到「运行过程」逐步查看这条链路。</p></div>`;
}
function renderFlow(){
const scenario=scenarios.find(s=>s.id===state.scenario)||scenarios[0],step=scenario.steps[state.step], cap=getCapability(getAgent(scenario.agent),scenario.cap);
content.innerHTML=`<div class="scenario-controls"><div class="scenario-tabs" aria-label="选择教学场景">${scenarios.map(s=>`<button class="scenario-tab ${scenario.id===s.id?'active':''}" data-scenario="${s.id}" aria-pressed="${scenario.id===s.id}">${s.name}</button>`).join('')}</div><span class="teaching-label">教学示意 · 未调用真实模型</span></div>
<div class="task-input"><span class="block-label">用户的任务</span><p>${scenario.task}</p></div>
<div class="flow-layout"><div class="flow-steps" aria-label="执行步骤">${scenario.steps.map((s,i)=>`<button class="flow-step ${state.step===i?'active':''}" data-step="${i}" aria-pressed="${state.step===i}"><span class="step-num">0${i+1}</span><span><strong>${s.title}</strong><small>${s.owner}</small></span></button>`).join('')}</div>
<article class="flow-inspector" aria-live="polite"><span class="block-label">步骤 ${state.step+1} / 4 · ${step.owner}</span><h3>${step.title}</h3><p>${step.text}</p><div class="result-box"><span class="block-label">这一阶段的结果</span>${step.result}</div><span class="block-label">依据的指令材料</span>${external(sourceUrl(cap.path),getAgent(scenario.agent).name+' · '+cap.title+' ↗')}<div class="flow-nav"><button data-next="-1" ${state.step===0?'disabled':''}>← 上一步</button><button class="primary" data-next="${state.step===3?'reset':'1'}">${state.step===3?'重新查看 ↺':'下一步 →'}</button></div></article></div>
<div class="understanding"><span aria-hidden="true">↳</span><p><strong>每一步的执行者不同。</strong> 模型负责判断和生成调用，程序负责执行与回传。这里按公开材料做概念演示，具体产品的实际调度实现可能不同。</p></div>`;
}
function renderInventory(){
if(!inventory){content.innerHTML=inventoryError?'<div class="error-box">目录快照暂时未能载入。请确认通过本地服务或已部署的网站访问。<br><button data-retry>重试载入</button></div>':'<p class="loading">正在载入目录快照…</p>';return;}
content.innerHTML=`<div class="metrics"><div class="metric"><span>产品与分类目录</span><strong>${inventory.groups.length}</strong></div><div class="metric"><span>Markdown 文件 · 含说明与历史版本</span><strong>${inventory.markdownFiles}</strong></div><div class="metric"><span>本站精选能力解读</span><strong>${agents.reduce((n,a)=>n+a.caps.length,0)}</strong></div></div><p class="inventory-note">下面展示固定版本中的全部顶层产品分类。文件数包含提示词、历史版本、说明和技能资料，<strong>不等于独立能力数量</strong>。本站对 5 个产品提供精选解读，其余目录可展开查看文件并访问原始材料。</p>
<div class="inventory-grid">${inventory.groups.map(g=>`<article class="archive-group"><h3>${esc(g.name)}</h3><p>${g.files} 个文件 · ${g.markdown} 份 Markdown</p>${external('https://github.com/asgeirtj/system_prompts_leaks/tree/'+commit+'/'+encodeURIComponent(g.name),'浏览上游目录 ↗')}<details><summary>查看收录文件（${g.files}）</summary><ul class="file-list">${g.paths.map(p=>`<li>${external(sourceUrl(p),p.slice(g.name.length+1))}</li>`).join('')}</ul></details></article>`).join('')}</div>
<div class="understanding"><span aria-hidden="true">▤</span><p><strong>来源也需要区分。</strong> 仓库同时包含官方公开归档、捕获文本与整理说明；部分 Skills 元数据为重建内容。入库日期、产品版本和捕获环境不能直接混为一谈。</p></div>`;
}
function renderMeaning(){
const example=reuseCases.find(c=>c.id===state.reuse)||reuseCases[0],agent=getAgent(example.agent),cap=getCapability(agent,example.cap);
content.innerHTML=`<section class="meaning-lead"><span class="block-label">核心意义</span><h2>让成熟 Agent 的行为设计，成为可以研究的材料。</h2><p>你可以从指令中观察：它如何理解任务、分配工作、调用工具、管理上下文，以及判断什么时候完成。然后把其中有用的设计改写为自己的规则，再用实际任务验证。</p><div class="provenance-chain"><div><strong>上游收集</strong><span>原始提示词、工具说明与配套资料</span></div><div><strong>本站解读</strong><span>把材料拆成中文能力说明与教学示例</span></div><div><strong>你来验证</strong><span>接入自己的模型和工具，测试是否有效</span></div></div></section>
<div class="understanding"><span aria-hidden="true">▤</span><p><strong>把我们的理解连起来。</strong> <a href="./reports/complete-understanding.html">阅读完整理解与研究结论 →</a><br>19 个章节汇总材料来源、Agent 原理、ChatGPT 5.6 内容、24 项解读、价值与待验证问题。<br><a href="./reports/official-agent-anatomy.html">官方样例：Agent 包含哪些部分 →</a> · <a href="./reports/official-agent-anatomy.svg">查看 Agent 组成图 →</a><br><a href="./reports/codex-chatgpt56.html">复核 Codex 获取实例与 ChatGPT 5.6 逐段证据 →</a> · <a href="./reports/research-overview.svg">查看一图总览 →</a></p></div>
<div class="value-grid">
<article><span class="block-label">01 · 理解产品</span><h3>知道它为什么这样工作</h3><p>例如，先规划、持续执行或只读搜索，可能都有明确的指令约定。材料帮助你提出行为解释，但不能单独证明每次输出的原因。</p><button class="text-button" data-jump-agent="codex" data-jump-cap="planning">查看规划模式 →</button></article>
<article><span class="block-label">02 · 学习工程</span><h3>借鉴任务组织方法</h3><p>从角色分工、工具描述和完成条件中提炼设计模式，减少完全从零摸索的成本。迁移时要改成适合自己业务和工具的规则。</p><button class="text-button" data-jump-agent="claude" data-jump-cap="plan-agent">查看角色分工 →</button></article>
<article><span class="block-label">03 · 建立证据</span><h3>把“好提示词”变成可检验假设</h3><p>提出一条规则可能改善什么，再固定模型、任务与工具做对照。成功率、成本和错误情况，比提示词长短更能说明效果。</p><button class="text-button" data-jump-agent="gemini" data-jump-cap="validation">查看验证规则 →</button></article>
</div>
<section class="meaning-section"><div class="section-heading"><div><h2>研究它，能拿到什么？</h2><p>这些结论描述本次研究范围，不代表对所有条目进行了完整审计。</p></div></div>
<div class="meaning-table-wrap"><table class="meaning-table"><caption>从提示词档案到实际 Agent 的能力边界</caption><thead><tr><th scope="col">材料或能力</th><th scope="col">这里能看到的</th><th scope="col">你还需要完成的</th></tr></thead><tbody>
<tr><th scope="row">角色与任务规则</th><td>行为要求、完成条件、角色分工</td><td>按自己的业务重写并测试</td></tr>
<tr><th scope="row">工具与技能资料</th><td>部分接口说明、技能文档和配套代码</td><td>兼容的工具实现、授权与运行环境</td></tr>
<tr><th scope="row">产品变化线索</th><td>文件与提交记录中的文本差异</td><td>区分捕获、整理和产品变更；核对日期</td></tr>
<tr><th scope="row">模型本身</th><td>文件可能标注模型或产品名称</td><td>模型服务或权重；提示词不包含其训练能力</td></tr>
<tr><th scope="row">完整产品与质量</th><td>部分行为设计的线索</td><td>完整调度、状态管理和效果评测；不能据此声称复刻产品</td></tr>
</tbody></table></div></section>
<section class="meaning-section"><div class="section-heading"><div><h2>把一条规则，变成自己的设计</h2><p>以下是本站原创的迁移示例，尚未做模型对照实验。</p></div></div>
<div class="reuse-picker" aria-label="选择迁移示例">${reuseCases.map(c=>`<button class="scenario-tab ${c.id===example.id?'active':''}" data-reuse="${c.id}" aria-pressed="${c.id===example.id}">${c.title}</button>`).join('')}</div>
<article class="reuse-detail" aria-live="polite"><div class="reuse-context"><span class="block-label">要解决的问题</span><p>${example.problem}</p><span class="block-label">从材料中提炼的设计</span><p>${example.pattern}</p>${external(sourceUrl(cap.path),agent.name+' · '+cap.title+' / 原始材料 ↗')}</div>
<div class="reuse-instruction"><span class="block-label">适配后的指令示例 · 本站原创，非上游原文</span><p>${example.instruction}</p></div>
<div class="reuse-bottom"><div><h3>需要配套实现</h3><ul>${example.tools.map(t=>`<li>${t}</li>`).join('')}</ul></div><div><h3>怎么知道它是否有用</h3><p>${example.measure}</p></div></div><p class="reuse-limit">${example.limit}</p></article></section>
<div class="understanding"><span aria-hidden="true">◇</span><p><strong>更值得积累的是“规则、适用条件和验证结果”。</strong> 上游提供研究入口；最终价值来自你能否把设计模式转化为自己场景中的可靠行为。</p></div>`;
}
function render(){
const labels={explore:['Agent 的能力，是怎样组织出来的？','选择一个产品，查看仓库已经收录的指令，以及它们如何影响任务执行。'],flow:['一句任务，怎样变成一连串行动？','逐步区分大模型、内部指令和执行程序各自负责的事情。'],inventory:['这个仓库，已经收录了什么？','从全部目录回到原始文件，查看这份档案的范围与研究边界。']};
labels.meaning=['这个库的意义，究竟是什么？','从观察产品行为，到学习设计模式，再到构建和验证自己的助手。'];
labels.logic=['Agent 怎样把一个任务持续推进？','指令与上下文提供依据，模型规划，程序调度，工具和状态把反馈带回下一次判断。'];
document.querySelector('#page-title').textContent=labels[state.view][0];
document.querySelector('#page-description').textContent=labels[state.view][1];
document.querySelectorAll('[data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===state.view);if(b.dataset.view===state.view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
if(state.view==='explore')renderExplore();else if(state.view==='flow')renderFlow();else if(state.view==='meaning')renderMeaning();else if(state.view==='logic')content.innerHTML=taskLogicMarkup(state.logicStep,state.logicRoute);else renderInventory();
}
function preserveFocus(selector){render();if(selector)document.querySelector(selector)?.focus({preventScroll:true});}
document.addEventListener('click',e=>{
const b=e.target.closest('button');if(!b||b.disabled)return;
if(b.dataset.view&&validViews.includes(b.dataset.view)){state.view=b.dataset.view;history.replaceState(null,'','#'+state.view);render();}
else if(b.dataset.logicRoute&&taskRoutes.some(r=>r.id===b.dataset.logicRoute)){state.logicRoute=b.dataset.logicRoute;state.logicStep=0;preserveFocus('[data-logic-route="'+state.logicRoute+'"]');}
else if(b.dataset.logicStep!==undefined){const index=Number(b.dataset.logicStep);if(Number.isInteger(index)&&index>=0&&index<getTaskRoute(state.logicRoute).steps.length){state.logicStep=index;preserveFocus('[data-logic-step="'+index+'"]');}}
else if(b.dataset.logicNext!==undefined){if(!['reset','1','-1'].includes(b.dataset.logicNext))return;state.logicStep=b.dataset.logicNext==='reset'?0:Math.min(getTaskRoute(state.logicRoute).steps.length-1,Math.max(0,state.logicStep+Number(b.dataset.logicNext)));preserveFocus('[data-logic-step="'+state.logicStep+'"]');}
else if(b.dataset.jumpAgent){state.agent=b.dataset.jumpAgent;state.cap=b.dataset.jumpCap;state.view='explore';history.replaceState(null,'','#explore');preserveFocus('[data-cap="'+state.cap+'"]');}
else if(b.dataset.reuse){state.reuse=b.dataset.reuse;preserveFocus('[data-reuse="'+state.reuse+'"]');}
else if(b.dataset.agent){state.agent=b.dataset.agent;state.cap=getAgent(state.agent).caps[0].id;preserveFocus('[data-agent="'+state.agent+'"]');}
else if(b.dataset.cap){state.cap=b.dataset.cap;preserveFocus('[data-cap="'+state.cap+'"]');}
else if(b.dataset.scenario){state.scenario=b.dataset.scenario;state.step=0;preserveFocus('[data-scenario="'+state.scenario+'"]');}
else if(b.dataset.step!==undefined){state.step=Number(b.dataset.step);preserveFocus('[data-step="'+state.step+'"]');}
else if(b.dataset.next!==undefined){state.step=b.dataset.next==='reset'?0:Math.min(3,Math.max(0,state.step+Number(b.dataset.next)));preserveFocus('[data-step="'+state.step+'"]');}
else if(b.dataset.retry!==undefined){loadInventory();}
});
async function loadInventory(){
inventoryError=false;
if(state.view==='inventory')renderInventory();
try{const r=await fetch('./inventory.json');if(!r.ok)throw new Error('目录加载失败');inventory=await r.json();if(!Array.isArray(inventory.groups)||inventory.commit!==commit)throw new Error('版本不匹配');if(state.view==='inventory')render();}
catch{inventory=null;inventoryError=true;if(state.view==='inventory')renderInventory();}
}
window.addEventListener('hashchange',()=>{const view=location.hash.slice(1);if(validViews.includes(view)){state.view=view;render();}});
render();loadInventory();
