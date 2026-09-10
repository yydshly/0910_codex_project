import {Simulation,pins,WIDTH,HEIGHT,CAPACITY,STEP} from './physics.mjs';
import {registerExperiment} from './webmcp.mjs';
const $=id=>document.getElementById(id),sim=new Simulation(),canvas=$('board'),ctx=canvas.getContext('2d');
let mode='original',paused=false,colliders=false,lastTime=0,accumulator=0,burst=0,nextDrop=0;
const source='https://github.com/andrewwoan/codrops-demo-for-threejs-conference/blob/64a896ef3ff6b1dac9d6f5d63601f0bc1f43e354/';
const topics={
 assets:['01 / 离线准备','把复杂光照先画进贴图。','静态场景的明暗已经在 Blender 中烘焙好。浏览器用不受场景灯光影响的材质显示贴图，减少实时计算；移动的小球单独使用受光照影响的材质。','适合光照和场景大体固定的体验。大幅改变灯光或昼夜状态时，需要重新烘焙或增加实时光照。','src/Experience/World/Baked.js'],
 geometry:['02 / 几何提取','沿着模型的截面，找到碰撞边界。','程序识别钉板与桌面，建立各自的二维坐标系；在距板面一个球半径的高度切割模型，将线段拼成轮廓。接近圆形的轮廓转为圆形碰撞体，其他轮廓保留为折线。','依赖当前场景形状和结构。换成任意模型并不保证直接适用，但可以借鉴以几何形状构建碰撞体的方法。','src/Experience/World/Plinko/Extract.js'],
 physics:['03 / 运动求解','两个二维世界，加一条空间轨道。','钉板和桌面分别由 Rapier 2D 计算。小球离开钉板时，位置与速度经过坐标转换进入桌面；登上拱形轨道后，改用沿曲线的位置与速度。物理采用固定时间步长和连续碰撞检测。','适合贴着板面或轨道的受约束运动。原版含经验阻尼与速度限制，不用于精密工程仿真；自由三维飞行需要重做物理方案。','src/Experience/World/Plinko/Physics.js'],
 render:['04 / 画面与反馈','批量绘制，再把运动变成声音。','Three.js 把物理坐标映射回三维小球。实例化批量绘制小球和接触阴影；Howler 播放碰撞采样，滚动音随速度变化。声音设置强度阈值、冷却与每帧数量限制。','代码容量为 1,000 球，不代表已验证所有设备流畅。实例化减少绘制开销，但物理计算、资源加载和设备性能仍影响整体体验。','src/Experience/World/Plinko/Balls.js']
};
document.querySelectorAll('[data-topic]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-topic]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 const [tag,title,body,limit,path]=topics[button.dataset.topic];$('topic-tag').textContent=tag;$('topic-title').textContent=title;$('topic-body').textContent=body;$('topic-limit').textContent=limit;$('topic-source').href=source+path;
}));
function releaseControls(){sim.left=sim.right=false;document.querySelectorAll('.held').forEach(b=>b.classList.remove('held'));}
function setMode(next){
 mode=next;releaseControls();accumulator=0;lastTime=0;
 for(const name of ['original','lab']){const selected=mode===name;$(name+'-tab').setAttribute('aria-selected',String(selected));$(name+'-tab').tabIndex=selected?0:-1;$(name+'-panel').hidden=!selected;$(name+'-guide').hidden=!selected;}
 // Unload the external game while experimenting to avoid simultaneous GPU/physics work.
 const frame=document.querySelector('iframe');if(mode==='lab'){frame.dataset.url=frame.src;frame.removeAttribute('src');}else if(!frame.getAttribute('src'))frame.src=frame.dataset.url;
 $('mode-note').textContent=mode==='original'?'外部原站实时加载，首次进入请选择有声或静音；若空白或加载较慢，可使用“独立窗口”。':'原创简化实验：重力、圆形碰撞与挡板冲量。切回原版会重新加载原站；两边参数和进度互不关联。';
 if(mode==='lab')resize();
}
for(const name of ['original','lab']){$(name+'-tab').addEventListener('click',()=>{if(mode!==name)setMode(name);});$(name+'-tab').addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?'original':e.key==='End'?'lab':mode==='original'?'lab':'original';if(next!==mode)setMode(next);$(next+'-tab').focus();}});}
function updateCounts(){$('ball-count').textContent=`${sim.balls.length} / ${CAPACITY} 球`;$('drained').textContent=sim.drained;}
function drop(x=220+Math.random()*320){sim.spawn(x);updateCounts();}
$('drop').addEventListener('click',()=>drop());$('burst').addEventListener('click',()=>{burst=Math.min(burst+10,CAPACITY);$('lab-status').textContent='小球会依次投下；改变弹性，观察它们如何散开。';});
function pause(value){paused=value;$('pause').textContent=paused?'继续':'暂停';$('pause').setAttribute('aria-pressed',String(paused));releaseControls();accumulator=0;}
$('pause').addEventListener('click',()=>pause(!paused));$('reset').addEventListener('click',()=>{sim.reset();burst=0;nextDrop=0;pause(false);updateCounts();$('lab-status').textContent='小球已清空，当前参数保留。点击钉板或按钮重新投球。';});
for(const name of ['left','right']){const button=$(name+'-flipper');button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);sim[name]=true;button.classList.add('held');});for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,()=>{sim[name]=false;button.classList.remove('held');});}
window.addEventListener('blur',releaseControls);document.addEventListener('visibilitychange',()=>{releaseControls();lastTime=0;accumulator=0;});
function key(e,down){if(!down){const release=['ArrowLeft','KeyA'].includes(e.code)?'left':['ArrowRight','KeyD'].includes(e.code)?'right':null;if(release){sim[release]=false;$(release+'-flipper').classList.remove('held');}}
 if(mode!=='lab'||/INPUT|BUTTON|A|TEXTAREA|SELECT/.test(e.target.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;
 const name=['ArrowLeft','KeyA'].includes(e.code)?'left':['ArrowRight','KeyD'].includes(e.code)?'right':null;
 if(name){e.preventDefault();sim[name]=down;$(name+'-flipper').classList.toggle('held',down);}
 if(e.code==='Space'){e.preventDefault();if(down&&!e.repeat)drop();}
}
window.addEventListener('keydown',e=>key(e,true));window.addEventListener('keyup',e=>key(e,false));
canvas.tabIndex=0;
canvas.addEventListener('pointerdown',e=>{const rect=canvas.getBoundingClientRect(),scale=Math.min(rect.width/WIDTH,rect.height/HEIGHT),x=(e.clientX-rect.left-(rect.width-WIDTH*scale)/2)/scale,y=(e.clientY-rect.top-(rect.height-HEIGHT*scale)/2)/scale;if(x>=175&&x<=585&&y>=55&&y<=400){drop(x);canvas.focus({preventScroll:true});}});
$('gravity').addEventListener('input',e=>{sim.gravity=+e.target.value;$('gravity-value').textContent=sim.gravity.toFixed(1)+'×';$('experiment-title').textContent='观察下落速度';$('experiment-copy').textContent=sim.gravity>1?'重力更强，小球更快到达钉阵。相同时间内的运动距离通常更大。':'重力减弱，小球下落变慢。其他参数保持不变，比较运动过程。';});
$('bounce').addEventListener('input',e=>{sim.bounce=+e.target.value;$('bounce-value').textContent=sim.bounce.toFixed(2);$('experiment-title').textContent='观察碰撞后的反弹';$('experiment-copy').textContent=sim.bounce>.65?'更高弹性保留更多碰撞后的相对速度，小球往往弹得更远。':'更低弹性使碰撞损失更多速度，小球更容易沿钉阵向下沉。';});
$('colliders').addEventListener('change',e=>{colliders=e.target.checked;});
let cssWidth=760,cssHeight=490;
function resize(){if(mode!=='lab')return;const rect=canvas.getBoundingClientRect();cssWidth=rect.width;cssHeight=rect.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(cssWidth*dpr);canvas.height=Math.round(cssHeight*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0);draw();}
window.addEventListener('resize',resize);
function line(x1,y1,x2,y2,color,width){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
function circle(x,y,r,color){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
function draw(){if(!ctx)return;ctx.clearRect(0,0,cssWidth,cssHeight);ctx.save();const scale=Math.min(cssWidth/WIDTH,cssHeight/HEIGHT);ctx.translate((cssWidth-WIDTH*scale)/2,(cssHeight-HEIGHT*scale)/2);ctx.scale(scale,scale);ctx.lineCap='round';
 ctx.fillStyle='#163638';ctx.fillRect(175,60,410,550);
 ctx.strokeStyle='#264b4b';ctx.lineWidth=1;for(let x=180;x<590;x+=25)line(x,65,x,610,'#204345',1);for(let y=80;y<610;y+=25)line(175,y,585,y,'#204345',1);
 ctx.font='12px system-ui';ctx.fillStyle='#8daaa5';ctx.textAlign='center';ctx.fillText('点击此处投球',380,105);ctx.fillText('回收区',380,636);
 for(const {p,active}of sim.segments()){line(...p,active?'#d8ee80':'#8ca69d',10);if(colliders)line(...p,'#70deef',1.5);}
 for(const pin of pins){circle(pin.x+1,pin.y+3,pin.r+1,'#092528');circle(pin.x,pin.y,pin.r,'#b8c9ad');if(colliders){ctx.beginPath();ctx.arc(pin.x,pin.y,pin.r+8,0,Math.PI*2);ctx.strokeStyle='#5fa8b4';ctx.lineWidth=1;ctx.stroke();}}
 for(const b of sim.balls){circle(b.x+2,b.y+4,b.r+1,'#092326');circle(b.x,b.y,b.r,'#e8c776');line(b.x-Math.cos(b.angle)*5,b.y-Math.sin(b.angle)*5,b.x+Math.cos(b.angle)*5,b.y+Math.sin(b.angle)*5,'#af7a32',2);if(colliders){ctx.beginPath();ctx.arc(b.x,b.y,b.r+1,0,Math.PI*2);ctx.strokeStyle='#a2f5fd';ctx.lineWidth=1;ctx.stroke();}}
 if(paused){ctx.fillStyle='#102a2cce';ctx.fillRect(175,60,410,550);ctx.fillStyle='#d8ee80';ctx.font='24px system-ui';ctx.fillText('已暂停',380,320);}
 ctx.restore();}
if(!ctx){$('lab-status').textContent='当前浏览器无法创建绘图画布，请使用原版入口或阅读技术拆解。';document.querySelectorAll('#lab-panel button,#lab-guide input').forEach(el=>el.disabled=true);}
function animate(now){const delta=lastTime?Math.min((now-lastTime)/1000,.05):0;lastTime=now;if(mode==='lab'&&!document.hidden){if(!paused&&ctx){accumulator+=delta;while(accumulator>=STEP){if(burst&&now>=nextDrop){drop();burst--;nextDrop=now+130;}sim.step();accumulator-=STEP;}updateCounts();}draw();}requestAnimationFrame(animate);}
requestAnimationFrame(animate);
const unregister=registerExperiment(document.modelContext,input=>{
 if(!ctx)throw new Error('Canvas unavailable');
 if(mode!=='lab')setMode('lab');
 if(input.reset)$('reset').click();
 for(const field of ['gravity','bounce'])if(input[field]!==undefined){$(field).value=String(input[field]);$(field).dispatchEvent(new Event('input'));}
 for(let i=0;i<(input.balls??0);i++)drop();
 updateCounts();draw();
 return {mode,gravity:sim.gravity,bounce:sim.bounce,balls:sim.balls.length,paused};
});
window.addEventListener('pagehide',()=>unregister?.(),{once:true});
