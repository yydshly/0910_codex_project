import {cp,mkdir} from 'node:fs/promises';
await import('./render-report.mjs');
const publicDir=new URL('../public/',import.meta.url),output=new URL('../dist/',import.meta.url);
await mkdir(output,{recursive:true});
await cp(publicDir,output,{recursive:true});
console.log('Static site built to dist/.');
