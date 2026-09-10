import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.md':'text/markdown; charset=utf-8'};
export function createPreviewServer(){return http.createServer(async(req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
  try{const route=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const target=resolve(root,'.'+(route.endsWith('/')?route+'index.html':route));
    if(!target.startsWith(resolve(root)+sep)){res.writeHead(403);res.end();return;}
    const body=await readFile(target);res.writeHead(200,{'Content-Type':types[extname(target)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:body);
  }catch(error){res.writeHead(error instanceof URIError?400:404,{'Content-Type':'text/plain; charset=utf-8'});res.end(req.method==='HEAD'?undefined:'Not found');}
});}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const port=Number(process.env.PORT||4324);
  if(!Number.isInteger(port)||port<1||port>65535)throw new Error('Invalid PORT');
  const server=createPreviewServer();server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`Port ${port} is already in use; set PORT to another port.`:error.message);process.exitCode=1;});
  server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}/`));
}
