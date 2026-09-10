import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createPreviewServer } from './serve.mjs';
const server = createPreviewServer();
server.listen(0, '127.0.0.1');
await once(server, 'listening');
const base = `http://127.0.0.1:${server.address().port}`;
try {
  for (const [path, mime] of [['/', 'text/html'], ['/app.mjs', 'text/javascript'], ['/data.mjs', 'text/javascript'], ['/styles.css', 'text/css'], ['/architecture.svg', 'image/svg+xml'], ['/external-memory-architecture.svg', 'image/svg+xml'], ['/memory-mechanism.png', 'image/png']]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    assert.ok(response.headers.get('content-type').startsWith(mime), `Invalid MIME: ${path}`);
    assert.ok((await response.arrayBuffer()).byteLength > 0);
  }
  const head = await fetch(base + '/app.mjs', { method: 'HEAD' });
  assert.equal(head.status, 200); assert.equal(await head.text(), '');
  assert.equal((await fetch(base + '/?mode=native&layer=6')).status, 200);
  assert.equal((await fetch(base + '/missing-file.mjs')).status, 404);
  assert.equal((await fetch(base + '/%ZZ')).status, 400);
  assert.equal((await fetch(base + '/', { method: 'POST' })).status, 405);
  assert.equal((await fetch(base + '/..%2f..%2fREADME.md')).status, 403);
  console.log('HTTP checks passed: assets and MIME, HEAD, query, 400 / 403 / 404 / 405.');
} finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
