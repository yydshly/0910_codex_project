import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
const demos = JSON.parse(await readFile(new URL('docs/web-demos.json', root), 'utf8'));
const escape = text => text.replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const seen = new Set();
for (const demo of demos) {
  if (!/^\d{3}-[a-z0-9-]+$/.test(demo.directory) || seen.has(demo.directory)) throw new Error('Invalid or duplicate demo directory');
  seen.add(demo.directory);
}
// Only the fixed, generated root dist directory is cleaned.
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const demo of demos.sort((a, b) => a.directory.localeCompare(b.directory))) {
  const cwd = fileURLToPath(new URL(`projects/${demo.directory}/web/`, root));
  execFileSync(process.execPath, ['scripts/check.mjs'], { cwd, stdio: 'inherit' });
  execFileSync(process.execPath, ['scripts/build.mjs'], { cwd, stdio: 'inherit' });
  await cp(new URL(`projects/${demo.directory}/web/dist/`, root), new URL(`${demo.directory}/`, output), { recursive: true });
}
const repository = 'https://github.com/yydshly/0910_codex_project';
const cards = demos.map(demo => `<article><p class="label">项目 ${demo.directory.slice(0, 3)}</p><h2>${escape(demo.title)}</h2><p>${escape(demo.description)}</p><div class="links"><a class="primary" href="./${demo.directory}/">进入演示 →</a><a href="${repository}/tree/main/projects/${demo.directory}">研究文档 ↗</a></div></article>`).join('\n');
await writeFile(new URL('index.html', output), `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="开源项目中文研究与交互演示导航"><title>开源项目研究集 · 在线演示</title>
<style>*{box-sizing:border-box}body{margin:0;background:#f4f6fb;color:#16233c;font:17px/1.8 system-ui,sans-serif}main{max-width:1040px;margin:auto;padding:64px 24px}nav,.links{display:flex;gap:24px;flex-wrap:wrap}a{color:#234dcc;text-underline-offset:4px}a:focus-visible{outline:3px solid #234dcc;outline-offset:5px}.label{color:#5a6b88;font-size:13px;letter-spacing:.12em}h1{font-size:clamp(32px,6vw,52px);line-height:1.25;margin:24px 0}h2{margin:8px 0;font-size:28px}.intro{max-width:690px;color:#54637c}section{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:24px;margin:40px 0}article{padding:32px;background:white;border:1px solid #dce3ef;border-radius:18px}article p{color:#54637c}.links{align-items:center}.primary{background:#234dcc;color:white;padding:10px 20px;border-radius:9px;text-decoration:none}footer{border-top:1px solid #dce3ef;padding-top:24px;font-size:14px;color:#54637c}</style></head>
<body><main><nav aria-label="站点导航"><strong>开源项目研究集</strong><a href="${repository}">GitHub 研究仓库 ↗</a></nav><p class="label">研究 · 理解 · 实践</p><h1>把研究，变成可以探索的演示。</h1><p class="intro">每个项目保留独立文档和来源，通过交互展示帮助理解关键机制。选择一个项目开始阅读与探索。</p><section aria-label="已上线演示">${cards}</section><footer>演示用于解释研究结论；原始材料、实际验证结果与研究推断在各项目中分别注明。<br><a href="${repository}/blob/main/docs/web-demos.md">部署说明与维护方式</a></footer></main></body></html>\n`);
await writeFile(new URL('.nojekyll', output), '');
let revision = 'local';
try { revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: fileURLToPath(root), encoding: 'utf8' }).trim(); } catch {}
await writeFile(new URL('deployment.json', output), JSON.stringify({ revision, demos: demos.map(demo => demo.directory) }, null, 2) + '\n');
console.log(`Pages built: ${demos.length} demo(s), root navigation and deployment revision.`);
