// Small renderer for the repository-owned research notes. Escape raw HTML.
export const escape = s => s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function inline(s){
 const stash=[];const keep=x=>`\u0000${stash.push(x)-1}\u0000`;
 s=s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,(_,label,url)=>{if(!url.startsWith('../assets/'))throw new Error('Unexpected image');return keep(`<figure><a href="./assets/${escape(url.slice(10))}"><img src="./assets/${escape(url.slice(10))}" alt="${escape(label)}" loading="lazy"></a></figure>`);});
 s=s.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(_,label,url)=>{const target=url.startsWith('../assets/')?'./assets/'+url.slice(10):url;if(!/^(https:\/\/|\.\/assets\/|#)/.test(target))throw new Error('Unexpected URL '+url);return keep(`<a href="${escape(target)}">${escape(label)}</a>`);});
 s=s.replace(/`([^`]+)`/g,(_,x)=>keep(`<code>${escape(x)}</code>`));
 return escape(s).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\u0000(\d+)\u0000/g,(_,n)=>stash[Number(n)]);
}
export function render(md){
 const lines=md.split(/\r?\n/),body=[],toc=[];let serial=0;
 for(let i=0;i<lines.length;){
  const line=lines[i];if(!line.trim()||line.startsWith('# ')){i++;continue;}
  if(line.startsWith('```')){const code=[];i++;while(i<lines.length&&!lines[i].startsWith('```'))code.push(lines[i++]);i++;body.push(`<details><summary>展开完整 Mermaid 源图</summary><pre><code>${escape(code.join('\n'))}</code></pre></details>`);continue;}
  const heading=line.match(/^(#{2,3}) (.+)$/);if(heading){const level=heading[1].length,id='section-'+(++serial);body.push(`<h${level} id="${id}">${inline(heading[2])}</h${level}>`);if(level===2)toc.push(`<a href="#${id}">${escape(heading[2])}</a>`);i++;continue;}
  if(line.startsWith('|')){const rows=[];while(i<lines.length&&lines[i].startsWith('|'))rows.push(lines[i++]);if(!/^\|[ :|-]+\|$/.test(rows[1]??''))throw new Error('Malformed table');const cells=r=>r.slice(1,r.lastIndexOf('|')).split('|').map(x=>inline(x.trim()));body.push('<div class="table-wrap" tabindex="0" role="region" aria-label="对照表，可横向滚动"><table><thead><tr>'+cells(rows[0]).map(x=>'<th scope="col">'+x+'</th>').join('')+'</tr></thead><tbody>'+rows.slice(2).map(r=>'<tr>'+cells(r).map(x=>'<td>'+x+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>');continue;}
  if(line.startsWith('- ')){const items=[];while(i<lines.length&&lines[i].startsWith('- '))items.push('<li>'+inline(lines[i++].slice(2))+'</li>');body.push('<ul>'+items.join('')+'</ul>');continue;}
  if(line.startsWith('![')){body.push(inline(line));i++;continue;}
  const p=[];while(i<lines.length&&lines[i].trim()&&!/^(#{1,3} |\||- |```|!\[)/.test(lines[i]))p.push(inline(lines[i++]));if(!p.length)throw new Error('Unsupported line '+i);body.push('<p>'+p.join(' ')+'</p>');
 }
 return {body:body.join('\n'),toc:toc.join('\n')};
}
