// Render the deliberately small Markdown subset used by the research article.
export function renderUnderstanding(markdown) {
  const escape = text => text.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const inline = text => {
    const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;
    let result = '', cursor = 0;
    for (const match of text.matchAll(pattern)) {
      result += escape(text.slice(cursor, match.index));
      if (match[1]) {
        let url = match[2];
        if (/^\d{2}-[\w-]+\.md$/.test(url)) url = `./notes/${url}`;
        if (url.startsWith('../assets/')) url = url.replace('../assets/', './assets/');
        if (!/^(https:\/\/|\.\/(?:notes|assets)\/)/.test(url)) throw new Error(`Unsupported article link: ${url}`);
        result += `<a href="${escape(url)}">${escape(match[1])}</a>`;
      } else if (match[3]) result += `<strong>${escape(match[3])}</strong>`;
      else result += `<code>${escape(match[4])}</code>`;
      cursor = match.index + match[0].length;
    }
    return result + escape(text.slice(cursor));
  };
  let section = 0;
  return markdown.trim().split(/\r?\n\s*\r?\n/).map(block => {
    if (block.startsWith('# ')) return `<h1>${inline(block.slice(2))}</h1>`;
    if (block.startsWith('## ')) return `<h2 id="section-${++section}">${inline(block.slice(3))}</h2>`;
    if (block.startsWith('- ')) return `<ul>${block.split(/\r?\n/).map(line => {
      if (!line.startsWith('- ')) throw new Error('Unsupported nested article list');
      return `<li>${inline(line.slice(2))}</li>`;
    }).join('')}</ul>`;
    return `<p>${inline(block)}</p>`;
  }).join('\n');
}
