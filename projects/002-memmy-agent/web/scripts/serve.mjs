import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../public/', import.meta.url));
const diagram = fileURLToPath(new URL('../../assets/architecture.svg', import.meta.url));
const poster = fileURLToPath(new URL('../../assets/memory-mechanism.png', import.meta.url));
const externalDiagram = fileURLToPath(new URL('../../assets/external-memory-architecture.svg', import.meta.url));
const sharedAssets = new Map([['/architecture.svg', diagram], ['/memory-mechanism.png', poster], ['/external-memory-architecture.svg', externalDiagram]]);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png' };
export function createPreviewServer() {
return http.createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return; }
    const route = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const sharedAsset = sharedAssets.get(route);
    const target = sharedAsset ?? resolve(root, '.' + (route.endsWith('/') ? route + 'index.html' : route));
    if (!sharedAsset && !target.startsWith(resolve(root) + sep)) { res.writeHead(403); res.end(); return; }
    const body = await readFile(target);
    res.writeHead(200, { 'Content-Type': types[extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch (error) {
    const status = error instanceof URIError ? 400 : 404;
    res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(req.method === 'HEAD' ? undefined : status === 400 ? 'Bad request' : 'Not found');
  }
});
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4318);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be an integer from 1 to 65535');
  const server = createPreviewServer();
  server.on('error', error => {
    console.error(error.code === 'EADDRINUSE' ? `Port ${port} is in use. Set PORT to another available port.` : error.message);
    process.exitCode = 1;
  });
  server.listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}/`));
}
