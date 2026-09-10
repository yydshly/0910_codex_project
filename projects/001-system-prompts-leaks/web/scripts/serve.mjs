import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./render-report.mjs');
const root=fileURLToPath(new URL('../public/',import.meta.url));
const port=Number(process.env.PORT || 4317);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer(async(req,res)=>{
try{
if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
const file=resolve(root,'.'+(path.endsWith('/')?path+'index.html':path));
if(!file.startsWith(resolve(root)+sep)){res.writeHead(403);res.end('Forbidden');return;}
if(!(await stat(file)).isFile()){res.writeHead(404);res.end('Not found');return;}
const body=await readFile(file);
res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
res.end(req.method==='HEAD'?undefined:body);
}catch{res.writeHead(404);res.end('Not found');}
});
server.listen(port,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+port+'/'));
