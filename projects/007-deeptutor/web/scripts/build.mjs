import {cp,mkdir,readFile,writeFile,realpath,lstat,rm} from 'node:fs/promises';
import {dirname,resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {render,escape} from './render.mjs';
const web=await realpath(fileURLToPath(new URL('../',import.meta.url)));
const output=resolve(web,'dist');
// This fixed generated directory is the only cleanup target; reject redirected paths.
if(dirname(output)!==web)throw new Error('Output escaped project');
try{const item=await lstat(output);if(item.isSymbolicLink()||await realpath(output)!==output)throw new Error('Redirected output');await rm(output,{recursive:true});}catch(e){if(e.code!=='ENOENT')throw e;}
await mkdir(output);
await cp(join(web,'public/style.css'),join(output,'style.css'));
for(const diagram of ['architecture.svg','full-architecture.svg','full-architecture.png'])await cp(resolve(web,'../assets',diagram),join(output,diagram));
await mkdir(join(output,'notes'));
const template=await readFile(join(web,'public/index.html'),'utf8');
for(const page of [
 {source:'01-understanding.md',target:'index.html',title:'从资料问答到持续学习的 AI 教学工作台',kicker:'DEEPTUTOR / 能力 · 对照 · 实践意义',lead:'问答、解题、出题、学习路径与复习。与 NotebookLM、Open Notebook、SurfSense 共用许多底层方法，DeepTutor 更着重可修改的教学流程与学习状态；我们可以借鉴它，探索从项目讲解到可执行练习和反馈的学习导师。',figure:true},
 {source:'02-sources-and-verification.md',target:'sources.html',title:'来源与验证边界',kicker:'DEEPTUTOR / 研究依据',lead:'固定源码版本，区分官方能力、我们的理解与尚未实测的效果。',figure:false}
]){
 const markdown=await readFile(resolve(web,'../notes',page.source),'utf8');
 await writeFile(join(output,'notes',page.source),markdown);
 const document=render(markdown);
 const values={TITLE:escape(page.title),KICKER:escape(page.kicker),LEAD:escape(page.lead),TOC:document.toc,CONTENT:document.content,FIGURE:page.figure?'<figure class="overview"><a href="./full-architecture.svg" aria-label="放大完整架构图"><img src="./full-architecture.png" alt="DeepTutor 完整架构：教学闭环、模型工具循环、知识检索与记忆、基础模型、同类产品对照及扩展边界" width="2400" height="3510"></a><figcaption>图 1 · 原创完整概念架构，非实际部署拓扑。<a href="./full-architecture.svg">放大矢量图</a> · <a href="./full-architecture.png" download>下载高清 PNG</a> · <a href="./architecture.svg">三层职责简图</a> · <a href="./sources.html">来源与边界</a>。</figcaption></figure>':''};
 await writeFile(join(output,page.target),template.replace(/\{\{([A-Z]+)\}\}/g,(_,key)=>{if(!(key in values))throw new Error('Unknown placeholder '+key);return values[key];}));
}
console.log('DeepTutor: two reading pages, source Markdown and original diagram built.');
