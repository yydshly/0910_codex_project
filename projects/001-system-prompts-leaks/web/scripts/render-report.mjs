import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
const output=new URL('../public/reports/',import.meta.url);
await mkdir(output,{recursive:true});
const reports=[
{source:'01-analysis.md',name:'analysis',title:'能力、原理、场景与扩展'},
{source:'02-significance.md',name:'significance',title:'这个库的意义与实践方法'},
{source:'03-codex-acquisition-chatgpt56.md',name:'codex-chatgpt56',title:'Codex 获取实例与 ChatGPT 5.6 文件详解'},
{source:'04-complete-understanding.md',name:'complete-understanding',title:'我们的完整理解与研究结论'},
{source:'05-official-agent-anatomy.md',name:'official-agent-anatomy',title:'官方样例：Agent 包含哪些部分'},
{source:'06-agent-task-loop.md',name:'agent-task-loop',title:'Agent 如何推进任务：我们的理解与职责划分'}
];
const localLinks=new Map(reports.map(report=>[report.source,'./'+report.name+'.html']));
localLinks.set('03-source-index.json','./source-index.json');
localLinks.set('../assets/research-overview.png','./research-overview.png');
localLinks.set('../assets/research-overview.svg','./research-overview.svg');
localLinks.set('../assets/official-agent-anatomy.png','./official-agent-anatomy.png');
localLinks.set('../assets/official-agent-anatomy.svg','./official-agent-anatomy.svg');
localLinks.set('../assets/agent-task-loop.png','./agent-task-loop.png');
localLinks.set('../assets/agent-task-loop.svg','./agent-task-loop.svg');
localLinks.set('../web/public/inventory.json','../inventory.json');
localLinks.set('../web/public/catalog.js','../catalog.js');
localLinks.set('../README.md','../#meaning');
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function inline(text){
let value=escape(text);
value=value.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(_all,label,href)=>{
if(localLinks.has(href))return '<a href="'+localLinks.get(href)+'">'+label+'</a>';
if(!href.startsWith('https://'))return '<span>'+label+'（仓库本地文档）</span>';
return '<a href="'+href+'" target="_blank" rel="noopener noreferrer">'+label+'</a>';
});
value=value.replace(/\x60([^\x60]+)\x60/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
return value;
}
for(const report of reports){
const markdown=await readFile(new URL('../../notes/'+report.source,import.meta.url),'utf8');
const rows=markdown.split(/\r?\n/),html=[],contents=[];
for(let i=0;i<rows.length;){
const line=rows[i];
if(!line.trim()){i++;continue;}
const picture=line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
if(picture&&localLinks.has(picture[2])&&/\.(png|svg)$/.test(picture[2])){const src=localLinks.get(picture[2]);html.push('<figure class="report-figure"><a href="'+src+'"><img src="'+src+'" alt="'+escape(picture[1])+'" loading="lazy"></a></figure>');i++;continue;}
if(line.startsWith('~~~')||line.startsWith('\x60\x60\x60')){
const fence=line.slice(0,3),code=[];i++;
while(i<rows.length&&!rows[i].startsWith(fence))code.push(rows[i++]);
i++;html.push('<pre><code>'+escape(code.join('\n'))+'</code></pre>');continue;
}
const heading=line.match(/^(#{1,3}) (.+)$/);
if(heading){const level=heading[1].length,id='section-'+i;html.push('<h'+level+' id="'+id+'">'+inline(heading[2])+'</h'+level+'>');if(level===2)contents.push({id,text:heading[2]});i++;continue;}
if(line.startsWith('|')){
const table=[];while(i<rows.length&&rows[i].startsWith('|'))table.push(rows[i++]);
const cells=row=>row.slice(1,row.lastIndexOf('|')).split('|').map(c=>c.trim());
html.push('<div class="table-wrap" tabindex="0"><table><thead><tr>'+cells(table[0]).map(c=>'<th scope="col">'+inline(c)+'</th>').join('')+'</tr></thead><tbody>'+table.slice(2).map(row=>'<tr>'+cells(row).map(c=>'<td>'+inline(c)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>');continue;
}
if(/^[-*] /.test(line)){const items=[];while(i<rows.length&&/^[-*] /.test(rows[i]))items.push('<li>'+inline(rows[i++].slice(2))+'</li>');html.push('<ul>'+items.join('')+'</ul>');continue;}
if(/^\d+\. /.test(line)){const items=[];while(i<rows.length&&/^\d+\. /.test(rows[i]))items.push('<li>'+inline(rows[i++].replace(/^\d+\. /,''))+'</li>');html.push('<ol>'+items.join('')+'</ol>');continue;}
const paragraph=[];while(i<rows.length&&rows[i].trim()&&!/^(#{1,3} |\||[-*] |\x60\x60\x60|~~~)/.test(rows[i]))paragraph.push(inline(rows[i++]));
html.push('<p>'+paragraph.join('<br>')+'</p>');
}
const page='<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escape(report.title)+' · Agent 解剖室</title><style>'+
'*{box-sizing:border-box}html{scroll-behavior:smooth;background:#f2f5fa;color:#253750;font:16px/1.95 "Segoe UI","Microsoft YaHei",sans-serif}body{margin:0}header{padding:19px 5%;background:#111a2e;display:flex;gap:18px;flex-wrap:wrap;justify-content:space-between}header a{color:#c7d7ff}a{color:#315ed7;text-decoration:none;overflow-wrap:anywhere}a:hover{text-decoration:underline}a:focus-visible,[tabindex]:focus-visible{outline:3px solid #6b8ff1;outline-offset:4px}.layout{max-width:1390px;margin:auto;display:grid;grid-template-columns:245px minmax(0,1fr);gap:35px;padding:35px}nav{position:sticky;top:25px;align-self:start;font-size:14px;max-height:calc(100vh - 50px);overflow:auto}nav strong{display:block;font-size:16px;margin-bottom:17px;color:#1d365c}nav a{display:block;margin:13px 0;color:#6880a2}article{min-width:0;background:white;border:1px solid #dce4ef;border-radius:12px;padding:40px 46px}h1{font-size:30px;line-height:1.6;margin:0 0 25px;color:#172c4c}h2{font-size:24px;line-height:1.6;margin:46px 0 20px;padding-top:22px;border-top:1px solid #e0e7f1;color:#1f3e6e}h3{font-size:19px;line-height:1.6;margin:30px 0 15px;color:#3a5375}p{margin:16px 0}code{font-family:Consolas,monospace;font-size:.9em;overflow-wrap:anywhere;background:#eff3f9;padding:2px 4px;border-radius:3px}pre{padding:21px;background:#142239;color:#d2e4ff;border-radius:8px;overflow:auto;line-height:1.8}pre code{background:none;padding:0;color:inherit;overflow-wrap:normal}.table-wrap{overflow:auto;margin:23px 0;border:1px solid #dce4ef;border-radius:7px}table{border-collapse:collapse;width:100%;font-size:14px;line-height:1.85;min-width:570px}th,td{padding:13px 16px;text-align:left;vertical-align:top;border-bottom:1px solid #e3e9f2}th{background:#edf3fc;color:#3b557a}tr:last-child td{border-bottom:0}li{padding-left:3px;margin:8px 0}strong{color:#1e426e}footer{color:#7a8ba5;font-size:13px;margin-top:32px}@media(max-width:1000px){.layout{grid-template-columns:1fr;padding:22px;gap:20px}nav{position:static;display:flex;gap:8px 18px;flex-wrap:wrap;max-height:none;overflow:visible}nav strong{width:100%;margin-bottom:0}nav a{margin:0}article{padding:28px}}@media(max-width:560px){.layout{padding:12px}article{padding:22px 18px}h1{font-size:24px}h2{font-size:21px}header{font-size:14px}.table-wrap{max-width:100%}}@media print{header,nav{display:none}.layout{display:block;padding:0}article{border:0;padding:0}html{background:white;font-size:11pt}.table-wrap{overflow:visible}table{min-width:0;font-size:9pt}h2,h3{break-after:avoid}tr{break-inside:avoid}pre{white-space:pre-wrap;color:#172c4c;background:#f1f4fa}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}'+
'.report-figure{margin:24px 0}.report-figure img{display:block;width:100%;height:auto}'+
'</style></head><body><header><a href="../#meaning">← 返回 Agent 解剖室</a><a href="../#logic">任务逻辑</a><a href="./complete-understanding.html">完整理解总稿</a><a href="./'+report.name+'.md" download>下载 Markdown 文档 ↓</a></header><div class="layout"><nav aria-label="文档目录"><strong>阅读目录</strong>'+contents.map(c=>'<a href="#'+c.id+'">'+escape(c.text)+'</a>').join('')+'</nav><article>'+html.join('\n')+'<footer>依据文中标明的公开材料编写 · 原文、来源声明与研究推断已分别标注 · 2026-09-10</footer></article></div></body></html>';
await writeFile(new URL(report.name+'.html',output),page);
await writeFile(new URL(report.name+'.md',output),markdown);
}
await copyFile(new URL('../../notes/03-source-index.json',import.meta.url),new URL('source-index.json',output));
for(const name of ['research-overview','official-agent-anatomy','agent-task-loop']){
for(const extension of ['png','svg'])await copyFile(new URL('../../assets/'+name+'.'+extension,import.meta.url),new URL(name+'.'+extension,output));
}
console.log('Six research documents rendered with source index and research images.');
