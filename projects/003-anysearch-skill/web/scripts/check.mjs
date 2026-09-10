import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const web = fileURLToPath(new URL('../', import.meta.url));
const output = join(web, 'dist');
let links = 0;
for (const name of ['index.html', 'notes/05-complete-understanding.html']) {
  const page = await readFile(join(output, name), 'utf8');
  assert.match(page, /<html lang="zh-CN">/);
  assert.match(page, /<meta name="viewport"/);
  const ids = [...page.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, new Set(ids).size, `Duplicate IDs in ${name}`);
  for (const match of page.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const link = match[1];
    if (/^https?:/.test(link)) continue;
    assert.ok(!link.startsWith('/'), `Absolute local path: ${link}`);
    // The top-level return link is checked after the shared Pages build.
    if (name === 'index.html' && link === '../') continue;
    const [path, anchor] = link.split('#');
    let target = resolve(dirname(join(output, name)), path || name.split('/').at(-1));
    if (path.endsWith('/')) target = join(target, 'index.html');
    await access(target);
    if (anchor) {
      const targetPage = await readFile(target, 'utf8');
      assert.ok(targetPage.includes(`id="${anchor}"`), `Missing anchor: ${name} -> ${link}`);
    }
    links++;
  }
  for (const img of page.matchAll(/<img\b[^>]*>/g)) assert.match(img[0], /alt="[^"]+"/);
}
const report = await readFile(join(output, 'notes/05-complete-understanding.html'), 'utf8');
assert.match(report, /id="sources"/);
assert.ok(!/\]\[S\d+\]|\[S\d+\]:|\u0000/.test(report), 'Unrendered references');
for (let section = 1; section <= 11; section++) assert.ok(report.includes(`id="section-${section}"`), `Missing research section ${section}`);
for (const asset of ['research-overview.png', 'research-overview.svg', 'architecture.svg']) await access(join(output, 'assets', asset));
const snapshot = JSON.parse(await readFile(join(output, 'notes/capabilities-2026-09-10.json'), 'utf8'));
assert.equal(Object.keys(snapshot.domains).length, 17);
async function checkDocs(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (['dist', 'public'].includes(entry.name)) continue;
    const file = join(directory, entry.name);
    if (entry.isDirectory()) { await checkDocs(file); continue; }
    if (!entry.name.endsWith('.md')) continue;
    for (const match of (await readFile(file, 'utf8')).matchAll(/\]\(([^)]+)\)/g)) {
      if (/^(https?:|#)/.test(match[1])) continue;
      await access(resolve(dirname(file), match[1].split('#')[0]));
    }
  }
}
await checkDocs(resolve(web, '..'));
console.log(`AnySearch validated: 2 HTML pages, ${links} local references, report sources, assets and research links.`);
