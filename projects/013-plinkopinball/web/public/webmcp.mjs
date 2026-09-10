export function validateExperiment(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Expected experiment settings');
 for(const key of Object.keys(input))if(!['gravity','bounce','balls','reset'].includes(key))throw new Error('Unknown setting '+key);
 if(input.gravity!==undefined&&(!Number.isFinite(input.gravity)||input.gravity<.2||input.gravity>2))throw new Error('gravity must be 0.2–2');
 if(input.bounce!==undefined&&(!Number.isFinite(input.bounce)||input.bounce<.1||input.bounce>.95))throw new Error('bounce must be 0.1–0.95');
 if(input.balls!==undefined&&(!Number.isInteger(input.balls)||input.balls<0||input.balls>80))throw new Error('balls must be an integer from 0 to 80');
 if(input.reset!==undefined&&typeof input.reset!=='boolean')throw new Error('reset must be boolean');
 return input;
}
export function registerExperiment(context,apply){
 if(!context?.registerTool)return;
 const lifecycle=new AbortController();
 const tool={name:'configure_physics_experiment',title:'配置中文物理实验',description:'切换至原创二维实验，调整重力和弹性，可清空场景并立即加入小球。不会修改作者的原版 3D 游戏。',inputSchema:{type:'object',properties:{gravity:{type:'number',minimum:.2,maximum:2},bounce:{type:'number',minimum:.1,maximum:.95},balls:{type:'integer',minimum:0,maximum:80},reset:{type:'boolean'}},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input=>apply(validateExperiment(input))};
 try{void Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{/* Optional browser API; ordinary controls remain available. */}
 return ()=>lifecycle.abort();
}
