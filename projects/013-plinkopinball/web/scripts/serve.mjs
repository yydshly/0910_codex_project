import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const web=fileURLToPath(new URL('../',import.meta.url)),port=Number(process.env.PORT||4313);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.md':'text/markdown; charset=utf-8'};
createServer(async(req,res)=>{try{const root=resolve(web,(await stat(resolve(web,'dist')).catch(()=>null))?'dist':'public');let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(pathname.endsWith('/'))pathname+='index.html';const file=resolve(root,'.'+pathname);if(!file.startsWith(root+sep)){res.writeHead(403);res.end();return;}const data=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}}).listen(port,'127.0.0.1',()=>console.log(`Local preview: http://127.0.0.1:${port}/`));
