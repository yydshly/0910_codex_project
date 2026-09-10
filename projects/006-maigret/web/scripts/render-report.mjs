import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const repository = 'https://github.com/yydshly/0910_codex_project/blob/main/projects/006-maigret/';
const summary = '按用户在网站设置的账号用户名（非实名），通过预设站点规则批量检查公开主页或接口，提取公开资料与关联链接；范围限规则库及所选站点，不覆盖全网，同名账号不等于同一个人。';
const escape = text => text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

// Render only trusted, versioned Markdown; escape source HTML and resolve known links.
export async function renderReport(output) {
  const markdown = await readFile(join(output, 'notes/01-understanding.md'), 'utf8');
  const refs = new Map([...markdown.matchAll(/^\[(S\d+)\]:\s+(\S+)\s*$/gm)].map(m => [m[1], m[2]]));
  const href = url => {
    if (/^(https?:|#)/.test(url)) return url;
    if (url.startsWith('../assets/') && !url.includes('README.md')) return './' + url.slice(3);
    if (url === '../README.md') return repository + 'README.md';
    return repository + 'notes/' + url;
  };
  const link = (label, url) => `<a href="${escape(href(url))}">${label}</a>`;
  function inline(text) {
    const tokens = [];
    const save = html => `\u0000${tokens.push(html) - 1}\u0000`;
    let value = text.replace(/`([^`]+)`/g, (_, code) => save(`<code>${escape(code)}</code>`));
    value = value.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => save(link(escape(label), url)));
    value = value.replace(/\[([^\]]+)\]\[(S\d+)\]/g, (_, label, id) => {
      if (!refs.has(id)) throw new Error(`Unknown reference: ${id}`);
      return save(link(escape(label), refs.get(id)));
    });
    value = escape(value).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    return value.replace(/\u0000(\d+)\u0000/g, (_, index) => tokens[Number(index)]);
  }
  const lines = markdown.split(/\r?\n/), html = [], toc = [];
  const boundary = /^(#{1,3} |\||- |\d+\. |>|---+$|```|\[S\d+\]:)/;
  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    if (!line.trim() || /^\[S\d+\]:/.test(line)) { i++; continue; }
    const picture = line.match(/^\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)$/);
    if (picture) {
      html.push(`<figure id="overview"><a href="${escape(href(picture[3]))}"><img src="${escape(href(picture[2]))}" alt="${escape(picture[1])}：账号用户名非实名，网站适配、批量检查、搜索范围、价值与局限" width="1800" height="2130" loading="lazy"></a><figcaption>一张图整理全部理解 · 点击打开可缩放版本</figcaption></figure>`); i++; continue;
    }
    const heading = line.match(/^(#{1,3}) (.+)$/);
    if (heading) {
      const level = heading[1].length;
      if (level === 1) { i++; continue; }
      const number = heading[2].match(/^(\d+)\./)?.[1];
      const id = number ? `section-${number}` : heading[2] === '来源与许可' ? 'sources' : `heading-${i}`;
      html.push(`<h${level} id="${id}">${inline(heading[2])}</h${level}>`);
      if (level === 2) toc.push(link(escape(heading[2]), '#' + id));
      i++; continue;
    }
    if (/^```/.test(line)) {
      const code = []; i++;
      while (i < lines.length && !/^```/.test(lines[i])) code.push(lines[i++]);
      i++; html.push(`<pre><code>${escape(code.join('\n'))}</code></pre>`); continue;
    }
    if (line.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]);
      const cells = row => row.slice(1, row.lastIndexOf('|')).split('|').map(c => inline(c.trim()));
      html.push('<div class="table-wrap" tabindex="0" role="region" aria-label="研究对照表"><table><thead><tr>' + cells(rows[0]).map(c => `<th scope="col">${c}</th>`).join('') + '</tr></thead><tbody>' + rows.slice(2).map(row => '<tr>' + cells(row).map(c => `<td>${c}</td>`).join('') + '</tr>').join('') + '</tbody></table></div>'); continue;
    }
    if (/^(?:- |\d+\. )/.test(line)) {
      const ordered = /^\d+\./.test(line), pattern = ordered ? /^\d+\. / : /^- /;
      const items = [];
      while (i < lines.length && pattern.test(lines[i])) items.push(`<li>${inline(lines[i++].replace(pattern, ''))}</li>`);
      const tag = ordered ? 'ol' : 'ul';
      html.push(`<${tag}>${items.join('')}</${tag}>`); continue;
    }
    if (line.startsWith('>')) {
      const items = [];
      while (i < lines.length && lines[i].startsWith('>')) items.push(inline(lines[i++].replace(/^>\s?/, '')));
      html.push('<blockquote>' + items.join(' ') + '</blockquote>'); continue;
    }
    if (/^---+$/.test(line)) { html.push('<hr>'); i++; continue; }
    const paragraph = [];
    while (i < lines.length && lines[i].trim() && !boundary.test(lines[i])) paragraph.push(inline(lines[i++]));
    html.push('<p>' + paragraph.join(' ') + '</p>');
  }
  await writeFile(join(output, 'index.html'), `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${summary}"><title>Maigret · 按账号用户名跨站检查，非实名查人</title><link rel="stylesheet" href="./style.css"></head>
<body><a class="skip" href="#main">跳到正文</a><header class="site-header"><a href="../">← 开源项目研究集</a><a href="${repository}README.md">GitHub 研究文档 ↗</a><a href="https://github.com/soxoj/maigret">上游仓库 ↗</a></header>
<section class="hero" aria-labelledby="page-title"><p class="eyebrow">006 / MAIGRET / 完整理解</p><h1 id="page-title">按账号用户名，<br>批量检查跨站公开账号。</h1><p class="lead">${summary}</p><div class="definition"><strong>输入的是账号用户名，不是实名。</strong><span>例如主页地址中的 <code>bluecat123</code>。显示昵称也不一定等于账号用户名。</span></div><div class="actions"><a class="primary" href="#overview">查看总览图 ↓</a><a href="#section-3">阅读搜索原理</a><a href="./notes/01-understanding.md" download>下载完整文档</a></div><p class="status">文档与关键源码研究 · v0.6.5 / 578d603 · 未运行上游账号扫描</p></section>
<div class="layout"><aside><nav aria-label="文档目录"><p class="eyebrow">本页目录</p>${toc.join('\n')}</nav></aside><main id="main"><article>${html.join('\n')}</article></main></div><footer><p>原创研究与信息图；上游 MIT。收录站点不代表实时可用，同名账号需要进一步核验。</p><a href="../">返回研究集</a> · <a href="#page-title">回到顶部</a></footer></body></html>\n`);
}
