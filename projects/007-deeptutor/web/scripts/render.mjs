// Limited Markdown renderer for these trusted research documents; raw HTML is escaped.
export const escape = value => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const destinations = new Map([
  ['01-understanding.md','./'], ['01-understanding.md#来源索引','./#sources'],
  ['02-sources-and-verification.md','./sources.html'], ['../README.md','./'],
  ['../assets/full-architecture.svg','./full-architecture.svg'],
  ['../assets/full-architecture.png','./full-architecture.png']
]);
export function render(markdown) {
  const refs = new Map([...markdown.matchAll(/^\[(S\d+)\]:\s+(\S+)\s*$/gm)].map(m=>[m[1],m[2]]));
  function link(label, url) {
    const target = destinations.get(url) ?? url;
    if (!/^(https:\/\/|\.\/|#)/.test(target)) throw new Error('Unsupported URL: '+target);
    return `<a href="${escape(target)}">${escape(label)}</a>`;
  }
  function inline(value) {
    const tokens = [];
    const keep = html => `\u0000${tokens.push(html)-1}\u0000`;
    value=value.replace(/`([^`]+)`/g,(_,s)=>keep(`<code>${escape(s)}</code>`));
    value=value.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(_,s,u)=>keep(link(s,u)));
    value=value.replace(/\[([^\]]+)\]\[(S\d+)\]/g,(_,s,id)=>{if(!refs.has(id))throw new Error('Missing source '+id);return keep(link(s,refs.get(id)));});
    value=value.replace(/\[(S\d+)\]/g,(_,id)=>{if(!refs.has(id))throw new Error('Missing source '+id);return keep(link('['+id+']',refs.get(id)));});
    return escape(value).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\u0000(\d+)\u0000/g,(_,n)=>tokens[Number(n)]);
  }
  const lines=markdown.split(/\r?\n/), html=[],toc=[];
  for(let i=0;i<lines.length;){
    const line=lines[i];
    if(!line.trim()||/^\[S\d+\]:/.test(line)||/^# /.test(line)){i++;continue;}
    const heading=line.match(/^(#{2,3}) (.+)$/);
    if(heading){const level=heading[1].length;const n=heading[2].match(/^(\d+)\./)?.[1];const id=n?'section-'+n:heading[2]==='来源索引'?'sources':'heading-'+i;html.push(`<h${level} id="${id}">${inline(heading[2])}</h${level}>`);if(level===2)toc.push(link(heading[2],'#'+id));i++;continue;}
    if(line.startsWith('|')){const rows=[];while(i<lines.length&&lines[i].startsWith('|'))rows.push(lines[i++]);if(!/^\|[ :|-]+\|$/.test(rows[1]??''))throw new Error('Invalid table');const cells=r=>r.slice(1,r.lastIndexOf('|')).split('|').map(s=>inline(s.trim()));html.push('<div class="table-wrap" tabindex="0" role="region" aria-label="研究对照表"><table><thead><tr>'+cells(rows[0]).map(s=>`<th scope="col">${s}</th>`).join('')+'</tr></thead><tbody>'+rows.slice(2).map(r=>'<tr>'+cells(r).map(s=>`<td>${s}</td>`).join('')+'</tr>').join('')+'</tbody></table></div>');continue;}
    if(line.startsWith('- ')){const items=[];while(i<lines.length&&lines[i].startsWith('- '))items.push('<li>'+inline(lines[i++].slice(2))+'</li>');html.push('<ul>'+items.join('')+'</ul>');continue;}
    const paragraph=[];while(i<lines.length&&lines[i].trim()&&!/^(#{1,3} |\||- |\[S\d+\]:)/.test(lines[i]))paragraph.push(inline(lines[i++]));if(!paragraph.length)throw new Error('Unsupported Markdown line '+i);html.push('<p>'+paragraph.join(' ')+'</p>');
  }
  return {content:html.join('\n'),toc:toc.join('\n')};
}
