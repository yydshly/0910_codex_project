import {cp,mkdir,readFile,writeFile,realpath,lstat,rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
const web=await realpath(fileURLToPath(new URL('../',import.meta.url)));
const out=resolve(web,'dist');
if(dirname(out)!==web)throw new Error('Output escaped project');
try{const st=await lstat(out);if(st.isSymbolicLink()||await realpath(out)!==out)throw new Error('Redirected output');await rm(out,{recursive:true});}catch(e){if(e.code!=='ENOENT')throw e;}
await mkdir(out,{recursive:true});await cp(resolve(web,'public'),out,{recursive:true});
for(const name of ['assets','notes','data'])await cp(resolve(web,'..',name),resolve(out,name),{recursive:true});
await cp(resolve(web,'../data/UPSTREAM-LICENSE'),resolve(out,'data/UPSTREAM-LICENSE.txt'));
const tools=JSON.parse(await readFile(resolve(out,'data/tools.json'),'utf8'));
const countBy=fn=>tools.reduce((map,t)=>(map[fn(t)]=(map[fn(t)]||0)+1,map),{});
const stats={commit:'2c6475a1d5b941cc598b3612419ef22e6d903ce8',date:'2026-09-10',records:tools.length,uniqueIds:new Set(tools.map(t=>t.id)).size,categories:countBy(t=>t.category),methods:countBy(t=>t.install.method),duplicateIds:[...new Set(tools.filter((t,i)=>tools.findIndex(x=>x.id===t.id)!==i).map(t=>t.id))],note:'Raw upstream records; not unique installed or verified tools.'};
await writeFile(resolve(out,'data/statistics.json'),JSON.stringify(stats,null,2)+'\n');
console.log(`Arsenal built: ${tools.length} records, ${Object.keys(stats.categories).length} categories, six explanatory scenarios. No tools installed or executed.`);
