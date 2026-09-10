import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, dirname, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const project = fileURLToPath(new URL('../../', import.meta.url));
const output = fileURLToPath(new URL('../dist/', import.meta.url)).replace(/[\\/]$/, '');
const html = await readFile(join(output, 'index.html'), 'utf8');
assert.match(html, /<html lang="zh-CN">/);
assert.match(html, /<title>[^<]+<\/title>/);
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(ids.length, new Set(ids).size, 'Duplicate page IDs');
let resourceCount = 0;
for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
  const link = match[1];
  if (/^(https?:|data:)/.test(link)) continue;
  if (link.startsWith('#')) { assert.ok(ids.includes(link.slice(1)), `Missing anchor ${link}`); continue; }
  assert.ok(!link.startsWith('/'), `Use relative resource paths: ${link}`);
  const target = resolve(output, link.split('#')[0]);
  assert.ok(target.startsWith(output + sep), `Resource outside output: ${link}`);
  await access(target); resourceCount++;
}
for (const file of ['app.mjs', 'data.mjs']) {
  const result = spawnSync(process.execPath, ['--check', join(output, file)], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
}
for (const match of (await readFile(join(output, 'app.mjs'), 'utf8')).matchAll(/from\s+'([^']+)'/g)) await access(resolve(output, match[1]));
const svg = await readFile(join(output, 'architecture.svg'), 'utf8');
assert.match(svg, /<title\s/); assert.match(svg, /<desc\s/);
let docLinks = 0;
async function checkDocs(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) { if (!['dist','public'].includes(entry.name)) await checkDocs(file); continue; }
    if (!entry.name.endsWith('.md')) continue;
    const content = await readFile(file, 'utf8');
    for (const match of content.matchAll(/\]\(([^)]+)\)/g)) {
      const link = match[1];
      if (/^(https?:|#)/.test(link)) continue;
      await access(resolve(dirname(file), decodeURIComponent(link.split('#')[0]))); docLinks++;
    }
    assert.ok(!content.includes('待填写'), `Unfilled template: ${file}`);
  }
}
await checkDocs(project);
console.log(`Validated: entrypoint, ${resourceCount} assets, ${ids.length} unique anchors, module syntax, ${docLinks} document links.`);
