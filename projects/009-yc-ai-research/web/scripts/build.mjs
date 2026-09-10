import {cp,mkdir,realpath,lstat,rm} from 'node:fs/promises';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const web=await realpath(fileURLToPath(new URL('../',import.meta.url)));
const output=resolve(web,'dist');
if(dirname(output)!==web)throw new Error('Output escaped project');
try{const item=await lstat(output);if(item.isSymbolicLink()||await realpath(output)!==output)throw new Error('Redirected output');await rm(output,{recursive:true});}catch(error){if(error.code!=='ENOENT')throw error;}
await mkdir(output);
await cp(join(web,'public'),output,{recursive:true});
await cp(resolve(web,'../assets/research-overview.svg'),join(output,'assets/research-overview.svg'));
await mkdir(join(output,'notes'),{recursive:true});
for(const file of ['01-understanding.md','02-sources-and-verification.md'])await cp(resolve(web,'../notes',file),join(output,'notes',file));
console.log('YC AI Research: reading page, diagram and research notes built.');
