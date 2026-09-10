import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const output = new URL('../dist/', import.meta.url);
const base = new URL('https://pages.invalid/0910_codex_project/');
let checked = 0;
async function walk(directory, prefix = '') {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = prefix + entry.name;
    const file = new URL(entry.name, directory);
    if (entry.isDirectory()) { await walk(new URL(entry.name + '/', directory), relative + '/'); continue; }
    if (!/\.(html|js|css)$/.test(entry.name)) continue;
    const source = await readFile(file, 'utf8');
    const references = [...source.matchAll(/(?:href|src)=["']([^"']+)["']/g)].map(match => match[1]);
    if (entry.name.endsWith('.js')) {
      references.push(...[...source.matchAll(/(?:from\s*|fetch\(\s*)["'](\.[^"']+)["']/g)].map(match => match[1]));
    }
    for (const reference of references) {
      if (reference.includes('${')) continue;
      const target = new URL(reference.replaceAll('&amp;', '&'), new URL(relative, base));
      if (target.origin !== base.origin) continue;
      if (!target.pathname.startsWith(base.pathname)) throw new Error(`Link escapes repository prefix: ${relative} -> ${reference}`);
      let local = new URL(decodeURIComponent(target.pathname.slice(base.pathname.length)), output);
      if ((await stat(local).catch(() => null))?.isDirectory()) local = new URL('index.html', local.href.endsWith('/') ? local : new URL(local.href + '/'));
      if (!(await stat(local).catch(() => null))?.isFile()) throw new Error(`Missing local target: ${relative} -> ${reference} (${fileURLToPath(local)})`);
      // Report navigation must return to its own demo, not the shared Pages homepage.
      if (relative.includes('/reports/') && /#(?:logic|meaning)$/.test(reference) && !target.pathname.startsWith(base.pathname + relative.split('/')[0] + '/')) throw new Error(`Report leaves demo: ${relative} -> ${reference}`);
      checked++;
    }
  }
}
await walk(output);
console.log(`Pages subpath check passed: ${checked} local references.`);
