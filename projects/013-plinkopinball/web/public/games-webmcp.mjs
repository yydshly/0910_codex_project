import {MODES} from './games-engine.mjs';
export function registerGameDirection(context,start){
 if(!context?.registerTool)return;const lifecycle=new AbortController();
 const tool={name:'start_game_direction',title:'开始一个游戏方向演示',description:'在八种原创玩法中切换方向并重置进度，可选择自动演示或亲自试玩；不会改变作者原版游戏。',inputSchema:{type:'object',properties:{game:{type:'string',enum:MODES.map(m=>m.id)},autoplay:{type:'boolean'}},required:['game','autoplay'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){if(!input||Array.isArray(input)||typeof input!=='object'||Object.keys(input).some(k=>!['game','autoplay'].includes(k))||!MODES.some(m=>m.id===input.game)||typeof input.autoplay!=='boolean')throw new Error('Expected a known game and autoplay boolean');return start(input);}};
 try{void Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{/* Optional API; manual UI remains usable. */}return()=>lifecycle.abort();
}
