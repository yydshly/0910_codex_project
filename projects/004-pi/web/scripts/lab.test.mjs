import test from 'node:test';
import assert from 'node:assert/strict';
import {scenarios,initialState,transition,recipe,contextView,escapeHtml} from '../public/lab.mjs';

test('每条任务可完整推进，末尾停止，重放重新开始',()=>{
  for(const id of Object.keys(scenarios)){
    let state=transition(initialState(id),{type:'play'});
    for(let i=1;i<scenarios[id].steps.length;i++){
      state=transition(state,{type:'next'});assert.equal(state.step,i);
    }
    assert.equal(state.playing,false);
    assert.deepEqual(transition(state,{type:'next'}),state);
    const replay=transition(state,{type:'play'});assert.equal(replay.step,0);assert.equal(replay.playing,true);
  }
});
test('播放中切换任务、跳转和重置不会继承播放状态或旧任务步骤',()=>{
  let state=transition(initialState(),{type:'play'});
  state=transition(state,{type:'next'});
  assert.deepEqual(transition(state,{type:'select',scenario:'extension'}),initialState('extension'));
  const jumped=transition(state,{type:'jump',step:4});assert.equal(jumped.step,4);assert.equal(jumped.playing,false);
  assert.deepEqual(transition(jumped,{type:'reset'}),initialState());
  assert.equal(transition(state,{type:'jump',step:-1}),state);
  assert.equal(transition(state,{type:'jump',step:100}),state);
  assert.equal(transition(state,{type:'jump',step:1.5}),state);
  assert.equal(transition(state,{type:'pause'}).playing,false);
});
test('扩展组合的全部 16 种选择不把分发误当作工具能力',()=>{
  const ids=['prompt','skill','tool','package'];
  for(let mask=0;mask<16;mask++){
    const selection=new Set(ids.filter((_,i)=>mask&(1<<i)));const view=recipe(selection);
    assert.equal(view.chips.length,selection.size+1);assert.ok(view.description.trim());assert.ok(!view.description.includes('undefined'));
    assert.equal(view.title.includes('接入知识'),selection.has('tool'));
  }
  assert.match(recipe(new Set(['package'])).description,/不会凭空增加能力/);
  assert.equal(recipe(new Set()).title,'基础编程助手');
});
test('上下文示意保持近期内容，压缩表示可还原',()=>{
  const before=contextView(false),after=contextView(true);
  assert.equal(before.blocks.filter(t=>t==='recent').length,after.blocks.filter(t=>t==='recent').length);
  assert.equal(before.blocks.length,after.blocks.length);
  assert.ok(after.tokens<before.tokens);assert.match(after.description,/原始历史仍保留/);
  assert.deepEqual(contextView(false),before);
});
test('动态内容中的 HTML 被转义',()=>{
  assert.equal(escapeHtml('<script>"x" & \'y\'</script>'),'&lt;script&gt;&quot;x&quot; &amp; &#39;y&#39;&lt;/script&gt;');
});
