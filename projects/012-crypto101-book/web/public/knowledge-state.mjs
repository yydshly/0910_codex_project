export const knowledgeKey='crypto101-knowledge-v1';
export function normalizeKnowledge(value,ids) {
  const allowed=new Set(ids), result={};
  if(!value||typeof value!=='object'||Array.isArray(value))return result;
  for(const [id,state] of Object.entries(value))if(allowed.has(id)&&['review','ready'].includes(state))result[id]=state;
  return result;
}
export function setKnowledge(state,id,value,ids) {
  if(!ids.includes(id)||!['todo','review','ready'].includes(value))return state;
  const next={...state};if(value==='todo')delete next[id];else next[id]=value;return next;
}
export function matchesKnowledge(point,state,filter,pending) {
  const selected=filter==='all'||filter==='required'&&point.priority==='必会'||filter==='advanced'&&point.priority==='进阶'||filter==='supplement'&&point.origin==='补充学习';
  return selected&&(!pending||state[point.id]!=='ready');
}
export function reviewPrompt(points,state) {
  const pending=points.filter(p=>state[p.id]!=='ready').sort((a,b)=>(a.priority==='必会'?0:1)-(b.priority==='必会'?0:1));
  return '请按 Crypto 101 关键知识清单带我查漏补缺。先选择第一个未掌握的必会知识点，一次只讲一个点：核心结论、适用前提、常见误区、一个例子，再问我一道理解题。等我回答后纠正并推进。区分原书与补充来源，不把历史案例当作当前配置建议。\n\n'+(pending.length?'我尚未自评为能解释的知识点：\n'+pending.map(p=>p.id.toUpperCase()+' '+p.title+'（'+(state[p.id]==='review'?'需复习':'未学')+'；'+p.priority+'）').join('\n'):'目前清单均已自评能解释，请用换场景的问题抽查；不要把我的自评当作能力证明。');
}
