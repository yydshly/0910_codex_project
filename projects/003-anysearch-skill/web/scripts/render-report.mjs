import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const repository = 'https://github.com/yydshly/0910_codex_project/blob/main/projects/003-anysearch-skill/';
const escape = text => text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

// A deliberately limited renderer for this trusted, versioned research document.
// Source text is escaped; raw HTML is not accepted. Reference links remain traceable.
export async function renderReport(output) {
  const markdown = await readFile(join(output, 'notes/05-complete-understanding.md'), 'utf8');
  const refs = new Map([...markdown.matchAll(/^\[(S\d+)\]:\s+(\S+)\s*$/gm)].map(m => [m[1], m[2]]));
  const href = url => {
    if (/^(https?:|#)/.test(url)) return url;
    if (url.startsWith('../assets/') && !url.includes('README.md')) return url;
    if (url.endsWith('.json')) return './' + url;
    if (url === '../README.md') return '../';
    if (url.startsWith('../assets/README.md')) return repository + 'assets/README.md';
    if (url === 'README.md') return repository + 'notes/README.md';
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
    value = value.replace(/\[(S\d+)\]/g, (_, id) => {
      if (!refs.has(id)) throw new Error(`Unknown reference: ${id}`);
      return save(link(`[${id}]`, refs.get(id)));
    });
    value = escape(value).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    return value.replace(/\u0000(\d+)\u0000/g, (_, index) => tokens[Number(index)]);
  }
  const lines = markdown.split(/\r?\n/), html = [], toc = [];
  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    if (!line.trim() || /^\[S\d+\]:/.test(line)) { i++; continue; }
    const picture = line.match(/^\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)$/);
    if (picture) {
      html.push(`<figure><a href="${escape(href(picture[3]))}"><img src="${escape(href(picture[2]))}" alt="${escape(picture[1])}" width="2520" height="4035" loading="lazy"></a></figure>`); i++; continue;
    }
    const heading = line.match(/^(#{1,3}) (.+)$/);
    if (heading) {
      const level = heading[1].length;
      const number = heading[2].match(/^(\d+)\./)?.[1];
      const id = number ? `section-${number}` : heading[2] === '来源索引' ? 'sources' : `heading-${i}`;
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
    if (/^- /.test(line)) {
      const items = [];
      while (i < lines.length && /^- /.test(lines[i])) items.push(`<li>${inline(lines[i++].slice(2))}</li>`);
      html.push('<ul>' + items.join('') + '</ul>'); continue;
    }
    if (/^---+$/.test(line)) { html.push('<hr>'); i++; continue; }
    const paragraph = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,3} |\||- |---+$|```|\[S\d+\]:)/.test(lines[i])) paragraph.push(inline(lines[i++]));
    html.push('<p>' + paragraph.join(' ') + '</p>');
  }
  await writeFile(join(output, 'notes/05-complete-understanding.html'), `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="AnySearch Skill 完整研究：客户端、服务端、专业能力、收费、同类产品和 Agent 的搜索来源。"><title>完整理解 · AnySearch Skill</title><link rel="stylesheet" href="../style.css"></head>
<body class="report"><a class="skip" href="#main">跳到正文</a><header class="site-header"><a href="../">← 返回 AnySearch 展示</a><a href="./05-complete-understanding.md" download>下载 Markdown</a><a href="${repository}notes/05-complete-understanding.md">GitHub 原文 ↗</a></header><div class="layout"><aside><nav aria-label="文档目录"><p class="eyebrow">完整研究 · 阅读目录</p>${toc.join('\n')}</nav></aside><main id="main"><article>${html.join('\n')}</article></main></div></body></html>\n`);
}
