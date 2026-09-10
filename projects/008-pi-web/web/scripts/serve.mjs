import { createServer } from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, relative, extname, isAbsolute } from 'node:path';
const root = await realpath(fileURLToPath(new URL('../dist/',import.meta.url)));
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.md':'text/plain; charset=utf-8','.txt':'text/plain; charset=utf-8'};
createServer(async(req,res)=>{try { let path = decodeURIComponent(new URL(req.url,'http://localhost').pathname); if(path.endsWith('/')) path += 'index.html'; const file = await realpath(resolve(root,'.'+path)); const rel = relative(root,file); if(rel.startsWith('..') || isAbsolute(rel)) throw new Error('Outside root'); const data = await readFile(file); res.writeHead(200,{'Content-Type':mime[extname(file)] || 'application/octet-stream','Cache-Control':'no-store'}); res.end(data); } catch { res.writeHead(404);res.end('Not found');} }).listen(30148,'127.0.0.1',()=>console.log('Pi Web research showcase: http://127.0.0.1:30148'));
