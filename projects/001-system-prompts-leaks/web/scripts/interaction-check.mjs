import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {agents,scenarios,reuseCases,commit,sourceUrl,getAgent,getCapability} from '../public/catalog.js';
import {taskLoopSteps,taskRoutes,getTaskRoute,taskLogicMarkup} from '../public/task-logic.js';
const script=(await readFile(new URL('../public/app.js',import.meta.url),'utf8')).replace(/^import[^\n]+\n/gm,'');
const inventory=JSON.parse((await readFile(new URL('../public/inventory.json',import.meta.url),'utf8')).replace(/^\uFEFF/,''));
function surface(fail=false,hash=''){
const elements={};
for(const id of ['#content','#page-title','#page-description'])elements[id]={innerHTML:'',textContent:''};
let click,unavailable=fail;
const location={hash};
const history={replaceState:(_state,_title,value)=>{location.hash=value;}};
const window={addEventListener(){}};
const document={querySelector:s=>elements[s]||{focus(){}},querySelectorAll:()=>[],addEventListener:(name,handler)=>{if(name==='click')click=handler;}};
vm.runInNewContext(script,{agents,scenarios,reuseCases,commit,sourceUrl,getAgent,getCapability,taskLoopSteps,taskRoutes,getTaskRoute,taskLogicMarkup,document,location,history,window,fetch:async()=>{if(unavailable)throw Error('offline');return{ok:true,json:async()=>inventory};}});
return{html:()=>elements['#content'].innerHTML,click:dataset=>click({target:{closest:()=>({dataset})}}),online:()=>{unavailable=false;}};
}
const settle=()=>new Promise(resolve=>setImmediate(resolve));
const ui=surface();await settle();
for(const agent of agents){
ui.click({agent:agent.id});
for(const cap of agent.caps){ui.click({cap:cap.id});assert(ui.html().includes(cap.rule));assert(ui.html().includes(cap.runtime));assert(ui.html().includes(sourceUrl(cap.path)));}
}
ui.click({view:'flow'});
for(const scenario of scenarios){ui.click({scenario:scenario.id});for(let i=0;i<4;i++){ui.click({step:String(i)});assert(ui.html().includes(scenario.steps[i].text));}ui.click({next:'reset'});assert(ui.html().includes(scenario.steps[0].text));ui.click({next:'1'});assert(ui.html().includes(scenario.steps[1].text));ui.click({next:'-1'});assert(ui.html().includes(scenario.steps[0].text));}
ui.click({view:'inventory'});
assert.equal((ui.html().match(/class="archive-group"/g)||[]).length,inventory.groups.length);
assert.equal((ui.html().match(/<details>/g)||[]).length,inventory.groups.length);
const offline=surface(true);await settle();offline.click({view:'inventory'});assert(offline.html().includes('重试载入'));offline.online();offline.click({retry:''});await settle();assert(offline.html().includes('archive-group'));
ui.click({view:'meaning'});
assert(ui.html().includes('核心意义'));
for(const example of reuseCases){ui.click({reuse:example.id});assert(ui.html().includes(example.instruction));assert(ui.html().includes(example.measure));}
ui.click({jumpAgent:'claude',jumpCap:'plan-agent'});
assert(ui.html().includes(getCapability(getAgent('claude'),'plan-agent').rule));
const linked=surface(false,'#meaning');assert(linked.html().includes('核心意义'));
ui.click({view:'logic'});
assert.equal((ui.html().match(/data-logic-step=/g)||[]).length,taskLoopSteps.length);
for(let i=0;i<taskLoopSteps.length;i++){
ui.click({logicStep:String(i)});
assert(ui.html().includes(taskLoopSteps[i].context));
assert(ui.html().includes(taskLoopSteps[i].model));
assert(ui.html().includes(taskLoopSteps[i].program));
assert(ui.html().includes(taskLoopSteps[i].plan));
}
assert(ui.html().includes('重新查看'));
ui.click({logicNext:'reset'});assert(ui.html().includes(taskLoopSteps[0].plan));
ui.click({logicNext:'1'});assert(ui.html().includes(taskLoopSteps[1].plan));
ui.click({logicNext:'-1'});assert(ui.html().includes(taskLoopSteps[0].plan));
ui.click({logicStep:'99'});assert(ui.html().includes(taskLoopSteps[0].plan));
const logicLink=surface(false,'#logic');assert(logicLink.html().includes('data-logic-step="0"'));assert(logicLink.html().includes('src="./reports/agent-task-loop.png"'));assert(logicLink.html().includes('href="./reports/agent-task-loop.html"'));
assert.equal((ui.html().match(/data-logic-route=/g)||[]).length,4);
for(const route of taskRoutes){
ui.click({logicRoute:route.id});
assert(ui.html().includes(route.steps[0].context));
assert.equal((ui.html().match(/data-logic-step=/g)||[]).length,route.steps.length);
let calls=0;
for(let i=0;i<route.steps.length;i++){
const step=route.steps[i];
if(step.owner==='模型')calls++;
assert.equal(step.calls,calls,route.id+' model call count at '+step.id);
ui.click({logicStep:String(i)});
assert(ui.html().includes(step.status));assert(ui.html().includes(step.plan));
assert(ui.html().includes(step.packet.execution));
assert(ui.html().includes('到此已调用模型 <strong>'+step.calls+'</strong> 次'));
}
ui.click({logicNext:'1'});assert(ui.html().includes(route.steps.at(-1).status));
ui.click({logicNext:'reset'});assert(ui.html().includes(route.steps[0].status));
ui.click({logicNext:'NaN'});assert(ui.html().includes(route.steps[0].status));
}
assert.equal(getTaskRoute('approval').steps.at(-1).branch,'wait');
assert(!getTaskRoute('approval').steps.some(s=>['edit','test-pass'].includes(s.id)));
assert.equal(getTaskRoute('clarify').steps.at(-1).branch,'wait');
assert.equal(getTaskRoute('clarify').steps.at(-1).calls,1);
assert(getTaskRoute('retry').steps.findIndex(s=>s.id==='test-fail')<getTaskRoute('retry').steps.findIndex(s=>s.id==='retry-decision'));
assert.equal(getTaskRoute('retry').steps.at(-1).calls,6);
assert.equal(getTaskRoute('unknown').id,'normal');
assert(taskLogicMarkup(99,'clarify').includes('阶段 1 / 2'));
ui.click({logicRoute:'normal'});ui.click({view:'explore'});ui.click({view:'logic'});assert(ui.html().includes('9 个阶段'));
const unknown=surface(false,'#unknown');assert(unknown.html().includes('cap-list'));
console.log('Interaction rendering verified: '+agents.reduce((n,a)=>n+a.caps.length,0)+' capabilities, all scenarios, four task routes (29 stages), model call counts, waiting boundaries, navigation and retry. No browser visual test performed.');
