const tabs=[...document.querySelectorAll('[data-diagram]')];
let zoom=1;
function setZoom(value){
  zoom=Math.max(.5,Math.min(3,value));
  document.querySelectorAll('.theory-diagram').forEach(image=>{image.style.width=`${zoom*100}%`;});
  document.getElementById('zoom-value').textContent=`${Number(zoom.toFixed(2))}×`;
  document.getElementById('zoom-out').disabled=zoom<=.5;
  document.getElementById('zoom-in').disabled=zoom>=3;
}
function selectDiagram(id,updateHash=true){
  if(!['architecture','flow'].includes(id))id='architecture';
  for(const tab of tabs){const active=tab.dataset.diagram===id;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;document.getElementById(tab.getAttribute('aria-controls')).hidden=!active;}
  if(updateHash)history.replaceState(null,'',`#${id}`);
}
tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>selectDiagram(tab.dataset.diagram));
  tab.addEventListener('keydown',event=>{
    let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;
    event.preventDefault();selectDiagram(tabs[next].dataset.diagram);tabs[next].focus();
  });
});
document.getElementById('zoom-in').addEventListener('click',()=>setZoom(zoom+.25));
document.getElementById('zoom-out').addEventListener('click',()=>setZoom(zoom-.25));
document.getElementById('zoom-fit').addEventListener('click',()=>{setZoom(1);document.querySelectorAll('.diagram-viewport').forEach(view=>{view.scrollLeft=0;});});
window.addEventListener('hashchange',()=>{if(['#architecture','#flow'].includes(location.hash))selectDiagram(location.hash.slice(1),false);});
selectDiagram(location.hash.slice(1),false);setZoom(1);
