import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('../dist/', import.meta.url));
const page = await readFile(join(output, 'index.html'), 'utf8');
assert.match(page, /<html lang="zh-CN">/);
assert.match(page, /<meta name="viewport"/);
assert.match(page, /账号用户名（非实名）/);
assert.match(page, /范围限规则库及所选站点/);
assert.match(page, /id="sources"/);
assert.ok(!/\]\[S\d+\]|\[S\d+\]:|\u0000/.test(page), 'Unrendered source reference');
const ids = [...page.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(ids.length, new Set(ids).size, 'Duplicate anchors');
for (let n = 1; n <= 10; n++) assert.ok(ids.includes(`section-${n}`), `Missing section ${n}`);
let count = 0;
for (const match of page.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
  const link = match[1];
  if (/^https?:/.test(link) || link === '../') continue;
  assert.ok(!link.startsWith('/'), `Absolute local path: ${link}`);
  const [path, anchor] = link.split('#');
  if (path) await access(resolve(output, path));
  if (anchor) assert.ok(ids.includes(anchor), `Missing anchor ${anchor}`);
  count++;
}
for (const img of page.matchAll(/<img\b[^>]*>/g)) assert.match(img[0], /alt="[^"]+"/);
assert.equal([...page.matchAll(/<h1\b/g)].length, 1);
assert.match(page, /<ol>/);
await access(join(output, 'assets/research-overview.png'));
await access(join(output, 'assets/research-overview.svg'));
console.log(`Maigret checked: 10 research sections, sources, username boundary, diagram and ${count} links.`);
