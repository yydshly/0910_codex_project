import {cp,mkdir,readFile,writeFile,realpath,lstat,rm} from 'node:fs/promises';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {render,escape} from './render.mjs';
const web=await realpath(fileURLToPath(new URL('../',import.meta.url))),project=dirname(web),out=resolve(web,'dist');
if(dirname(out)!==web)throw new Error('Output escaped project');
try{const existing=await lstat(out);if(existing.isSymbolicLink()||await realpath(out)!==out)throw new Error('Redirected output');await rm(out,{recursive:true});}catch(error){if(error.code!=='ENOENT')throw error;}
await mkdir(out);await cp(join(web,'public'),out,{recursive:true});await mkdir(join(out,'assets'));await mkdir(join(out,'notes'));
await cp(join(project,'assets/capability-overview.svg'),join(out,'assets/capability-overview.svg'));
for(const [name,slug] of [['01-understanding.md','understanding'],['02-sources-and-verification.md','sources'],['03-game-directions.md','games-notes']]){
 const md=await readFile(join(project,'notes',name),'utf8'),title=md.match(/^# (.+)$/m)[1],article=render(md);
 await cp(join(project,'notes',name),join(out,'notes',name));
 await writeFile(join(out,slug+'.html'),`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Plinkopinball 中文研究：原库能力、技术原理、适用场景、许可与验证范围"><title>${escape(title)} · Plinkopinball</title><link rel="stylesheet" href="./style.css"></head><body><header class="topbar"><a class="brand" href="./"><span class="mark">013</span> PLINKOPINBALL</a><nav aria-label="主导航"><a href="./">互动展示</a><a href="./games.html">八种玩法</a><a href="./understanding.html">完整理解</a><a href="./sources.html">来源与验证</a><a href="../">研究集 ↗</a></nav></header><main><article class="article"><p class="eyebrow"><a href="./">← 返回互动展示</a></p><h1>${escape(title)}</h1><nav class="toc" aria-label="文章目录">${article.toc}</nav>${article.body}<div class="downloads"><a href="./notes/${name}" download>下载本文 Markdown</a><a href="./">返回互动展示</a></div></article></main><footer><span>固定研究提交 64a896e · 原版与教学实验的验证范围分别记录</span><a href="https://github.com/andrewwoan/codrops-demo-for-threejs-conference">上游仓库 ↗</a></footer></body></html>\n`);
}
console.log('Plinkopinball built: original embed, teaching lab, eight playable directions, three research pages and matching downloads.');
