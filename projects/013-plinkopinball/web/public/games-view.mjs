import {W,H,clamp,puzzleRails,mazeWalls,holes,waypoints,ports,tileCenter,portPoint,racePaths,samplePath,raceSection} from './games-engine.mjs';
const colors=['#8be1df','#d8ee80','#ec99ac'];
export function drawGame(ctx,g,width,height,dpr=1){
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);ctx.fillStyle='#102a2c';ctx.fillRect(0,0,width,height);const scale=Math.min(width/W,height/H);ctx.save();ctx.translate((width-W*scale)/2,(height-H*scale)/2);ctx.scale(scale,scale);ctx.lineCap='round';ctx.lineJoin='round';
 const line=(x1,y1,x2,y2,color='#617e78',w=3)=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.lineWidth=w;ctx.strokeStyle=color;ctx.stroke();};
 const rect=(x,y,w,h,color,r=0)=>{ctx.beginPath();if(r)ctx.roundRect(x,y,w,h,r);else ctx.rect(x,y,w,h);ctx.fillStyle=color;ctx.fill();};
 const text=(s,x,y,color='#b4ccc5',size=15,align='left')=>{ctx.font=`${size}px system-ui, sans-serif`;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(s,x,y);};
 const circle=(x,y,r,color)=>{ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();};
 const ring=(x,y,r,color='#d8ee80',w=2)=>{ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.strokeStyle=color;ctx.lineWidth=w;ctx.stroke();};
 const orb=(x,y,r=11,color='#e8c776')=>{circle(x+3,y+5,r+1,'#061b2077');const gradient=ctx.createRadialGradient(x-r*.3,y-r*.4,0,x,y,r);gradient.addColorStop(0,'#fff8df');gradient.addColorStop(.3,color);gradient.addColorStop(1,color);circle(x,y,r,gradient);};
 const path=(points,color,w=3,dash=[])=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.strokeStyle=color;ctx.lineWidth=w;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);};
 // The geometric field is the actual gameplay surface, not an illustration.
 for(let x=20;x<W;x+=40)for(let y=20;y<H;y+=40)circle(x,y,1,'#264449');
 if(g.id==='puzzle'){
  if(g.ghost.length)path(g.ghost,'#82999555',2,[3,7]);if(g.trace.length)path(g.trace,'#8be1df66',2);
  for(const star of g.stars){ctx.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,r=i%2?7:16;const x=star.x+Math.cos(a)*r,y=star.y+Math.sin(a)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.fillStyle=star.taken?'#d8ee8033':'#e8c776';ctx.fill();if(!star.taken)ring(star.x,star.y,25,'#e8c77633',1);}
  text('上次轨迹：虚线',68,535,'#809f97',13);
  text('落球口',208,42,'#b4ccc5',15,'center');rect(188,54,40,10,'#8be1df',3);line(208,85,208,115,'#426767',1);text('① 可调斜板',175,190);text('② 可调斜板',580,305);
  for(const [i,p]of puzzleRails(g).entries()){line(p[0]+2,p[1]+7,p[2]+2,p[3]+7,'#061b2077',16);line(...p,i?'#799b93':'#d8ee80',12);orb(p[0],p[1],5,'#406259');orb(p[2],p[3],5,'#406259');}
  rect(740,500,110,35,'#d8ee8028',4);line(740,483,740,531,'#d8ee80',5);line(740,531,850,531,'#d8ee80',5);line(850,483,850,531,'#d8ee80',5);text('收集杯',795,556,'#d8ee80',15,'center');
  const b=g.b||{x:208,y:75,r:10};orb(b.x,b.y,b.r);if(g.status==='won')ring(b.x,b.y,22+Math.sin(g.time*4)*3,'#d8ee80');
 }
 if(g.id==='maze'){
  rect(42,42,816,476,'#18383b',12);ctx.strokeStyle='#52736d';ctx.lineWidth=5;ctx.strokeRect(45,45,810,470);
  if(g.demo)path([{x:100,y:100},...waypoints],'#345f59',2,[5,8]);
  for(const r of mazeWalls){rect(r.x+3,r.y+5,r.w,r.h,'#061b20',4);rect(r.x,r.y,r.w,r.h,'#90a79c',4);}
  for(const h of holes){circle(h.x,h.y,h.r+5,'#314f4e');circle(h.x,h.y,h.r,'#06161d');ring(h.x,h.y,h.r-5,'#172f33');}
  for(const key of g.keys){ring(key.x,key.y,22,key.taken?'#d8ee8033':'#e8c776',2);if(!key.taken){ring(key.x-5,key.y-3,6,'#e8c776',3);line(key.x,key.y,key.x+12,key.y+8,'#e8c776',3);line(key.x+8,key.y+5,key.x+5,key.y+10,'#e8c776',3);}else text('✓',key.x,key.y+6,'#d8ee80',19,'center');}
  circle(800,450,31,g.score===3?'#d8ee8025':'#ec99ac25');ring(800,450,31,g.score===3?'#d8ee80':'#ec99ac');text(g.score===3?'出口':'锁定',800,456,g.score===3?'#d8ee80':'#ec99ac',16,'center');text('起点',100,77,'#a8c0b8',14,'center');orb(g.b.x,g.b.y,g.b.r,'#8be1df');
  if(g.braking)ring(g.b.x,g.b.y,17,'#8be1df',3);if(g.recovering>g.time)ring(g.b.x,g.b.y,32,'#d8ee80');const t=g.tilt||{x:0,y:0};line(90,550,90+t.x*32,550+t.y*18,'#8be1df',3);text('倾斜方向',140,548,'#8da8a2',13);
 }
 if(g.id==='breakout'){
  rect(40,40,820,490,'#143235',9);line(40,525,40,40,'#55776e');line(40,40,860,40,'#55776e');line(860,40,860,525,'#55776e');
  for(const b of g.bricks)if(b.alive){rect(b.x,b.y+4,b.w,b.h,'#071b20',4);rect(b.x,b.y,b.w,b.h,['#d8ee80','#8be1df','#c5a6e2','#ec99ac'][b.row],4);rect(b.x+4,b.y+3,b.w-8,3,'#ffffff33',2);if(b.hp>1){for(let i=0;i<b.hp;i++)rect(b.x+7+i*8,b.y+17,5,3,'#143235',1);}if(b.kind!=='normal')text(b.kind==='bomb'?'✦':'↓',b.x+b.w/2,b.y+18,'#173234',17,'center');}
  const half=g.time<g.wideUntil?95:65;rect(g.paddle-half,489,half*2,15,'#061b20',7);rect(g.paddle-half,485,half*2,13,'#8be1df',6);rect(g.paddle-18,485,36,13,'#ecf6e8',4);orb(g.b.x,g.b.y,g.b.r);
  text('剩余机会',70,548,'#8da8a2',14);for(let i=0;i<g.lives;i++)orb(162+i*25,543,6,'#ec99ac');text(g.time<g.pierceUntil?'穿透 '+Math.ceil(g.pierceUntil-g.time)+' s':g.time<g.wideUntil?'宽板 '+Math.ceil(g.wideUntil-g.time)+' s':'空格：冲击波 × '+g.charges,825,548,'#8be1df',14,'right');
  for(const drop of g.drops){rect(drop.x-18,drop.y-12,36,24,drop.kind==='wide'?'#8be1df':'#e8c776',6);text(drop.kind==='wide'?'↔':'↑',drop.x,drop.y+6,'#102a2c',19,'center');}if(g.time<g.pierceUntil)ring(g.b.x,g.b.y,15,'#e8c776');if(g.pulse?.until>g.time){const t=(g.pulse.until-g.time)/.4;ring(g.pulse.x,g.pulse.y,105*(1-t),'#8be1df'+Math.round(t*255).toString(16).padStart(2,'0'),3);}text('护甲 · 多次命中     ✦ 爆破     ↓ 道具',450,26,'#a4c3b9',13,'center');
 }
 if(g.id==='track'){
  text('入口 →',170,166,'#d8ee80',16,'right');text('→ 出口',735,386,'#d8ee80',16);
  for(let i=0;i<15;i++){const c=tileCenter(i),ps=ports(g.tiles[i]),a=portPoint(i,ps[0]),b=portPoint(i,ps[1]),visited=g.visited.includes(i);rect(c.x-52,c.y-52,104,104,'#214243',7);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo(c.x,c.y,b.x,b.y);ctx.lineWidth=24;ctx.strokeStyle='#0a2329';ctx.stroke();ctx.lineWidth=4;ctx.strokeStyle=visited?'#d8ee80':'#749a91';ctx.stroke();circle(c.x-38,c.y-36,2,'#719087');text(String(i+1).padStart(2,'0'),c.x+40,c.y+42,'#6f938a',11,'right');if(g.tiles[i].locked){rect(c.x-46,c.y+30,27,17,'#668c8066',3);text('锁',c.x-32,c.y+43,'#c5d6c7',11,'center');}}
  if(g.status==='playing'||g.status==='won'||g.status==='lost'){const i=g.tile,c=tileCenter(i),a=portPoint(i,g.entry),ps=ports(g.tiles[i]),exit=ps.find(p=>p!==g.entry)??g.entry,b=portPoint(i,exit),t=g.status==='won'?1:clamp(g.travel,0,1);const x=(1-t)**2*a.x+2*(1-t)*t*c.x+t*t*b.x,y=(1-t)**2*a.y+2*(1-t)*t*c.y+t*t*b.y;orb(x,y,11,'#d8ee80');if(g.status==='lost')ring(x,y,24,'#ec99ac');}
  if(!g.demo&&Number.isInteger(g.selectedTile)){const c=tileCenter(g.selectedTile);ctx.strokeStyle='#d8ee80';ctx.lineWidth=2;ctx.strokeRect(c.x-52,c.y-52,104,104);}
  text(g.demo?'演示按同样步数预算逐块拼接':'点击旋转 · 锁定块不可移动 · 可撤销',450,487,'#a9c4bb',17,'center');text('旋转预算',220,70,'#8da8a2',13);for(let i=0;i<g.budget;i++)rect(305+i*17,58,11,16,i<g.moves?'#35524e':'#d8ee80',3);
 }
 if(g.id==='chain'){
  rect(70,260,790,80,'#183b3b',10);line(75,325,860,325,'#74948a',7);
  for(const [i,s]of g.switches.entries()){line(s.x,274,s.x,210,s.triggered?'#8be1df':'#466b62',2);line(s.x,210,s.gate,210,s.triggered?'#8be1df':'#466b62',2);line(s.gate,210,s.gate,240,s.triggered?'#8be1df':'#466b62',2);circle(s.x,300,19,s.triggered?'#8be1df':'#315c58');text(String.fromCharCode(65+i),s.x,306,s.triggered?'#123236':'#bdd0c8',16,'center');
   const open=s.open?1:0;rect(s.gate-8,255-open*95,16,72,s.open?'#d8ee80':'#ec99ac',3);text(s.passed?'已通过':s.open?'通行窗口':s.triggered?(g.time>=s.closeAt?'已关闭':'等待开启'):'等待触发',s.gate,385,s.open?'#d8ee80':'#a7c1b7',14,'center');
   const tx=95+i*270,ty=457,arrival=(s.gate-s.x)/g.launchSpeed;rect(tx,ty,230,12,'#365550',3);rect(tx+g.delays[i]/2*230,ty,g.gateWindow/2*230,12,'#8be1df88',3);line(tx+arrival/2*230,ty-5,tx+arrival/2*230,ty+17,'#e8c776',3);text('门 '+(i+1)+' · 延迟 '+g.delays[i].toFixed(2)+' s',tx,ty-16,'#a7c1b7',14);text('预计到达 '+arrival.toFixed(2)+' s',tx,ty+38,'#e8c776',12);}
  text('发射口',97,380,'#b2c8bd',14,'center');text('出口',850,245,'#d8ee80',15,'center');const b=g.b||{x:95,y:300,r:10};orb(b.x,b.y,b.r);text('让金色到达线落在青色开门窗口内',450,90,'#b2c8bd',19,'center');text('窗口需要留出整颗球通过的时间',450,122,'#759a8c',14,'center');
 }
 if(g.id==='sorting'){
  rect(428,35,44,80,'#234a48',12);line(450,100,450,250,'#456d64',4);circle(450,264,27,'#315653');const laneX=[210,450,690];
  for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(450,264);ctx.bezierCurveTo(450,350,laneX[i],360,laneX[i],468);ctx.lineWidth=g.selected===i?6:2;ctx.strokeStyle=g.selected===i?colors[g.bins[i]]:'#34574f';ctx.stroke();rect(laneX[i]-68,476,136,54,colors[g.bins[i]]+'28',8);line(laneX[i]-68,470,laneX[i]-68,530,colors[g.bins[i]],4);line(laneX[i]+68,470,laneX[i]+68,530,colors[g.bins[i]],4);text(['青 · A','黄 · B','粉 · C'][g.bins[i]],laneX[i],510,colors[g.bins[i]],19,'center');}
  circle(450,264,14,colors[g.bins[g.selected]]);for(const b of g.balls){orb(b.x,b.y,16,colors[b.color]);text(['A','B','C'][b.color],b.x,b.y+5,'#102a2c',13,'center');}text('经过这里时锁定路线',505,269,'#94b3a7',15);text('WAVE '+g.wave+' / 3',70,55,'#d8ee80',20);text('订单积分 '+g.points,70,82,'#a7c5b6',15);text('接下来',650,55,'#a7c5b6',13);for(let j=0;j<Math.min(3,g.wave*8-g.spawned);j++){const color=[0,2,1,2,0,1,1,0][(g.spawned+j+(g.wave-1)*3)%8];orb(671+j*48,89,15,colors[color]);text(['A','B','C'][color],671+j*48,94,'#102a2c',13,'center');}
 }
 if(g.id==='rhythm'){
  for(let lane=0;lane<2;lane++){const x=350+lane*200;rect(x-65,75,130,390,'#1b3b3f',12);line(x,90,x,420,'#2c5354',2);circle(x,426,38,colors[lane===0?0:2]+'15');ring(x,426,30+g.flash[lane]*90,colors[lane===0?0:2],g.flash[lane]>0?5:2);line(x-55,426,x+55,426,colors[lane===0?0:2],1);text(lane?'J / 右':'F / 左',x,505,'#c5d8cd',18,'center');}
  ctx.save();ctx.beginPath();ctx.rect(285,75,330,390);ctx.clip();for(const n of g.notes)if(n.state==='pending'||n.state==='holding'){const y=426+(g.time-n.at)*233,x=350+n.lane*200,tail=426+(g.time-n.at-n.duration)*233,color=colors[n.lane===0?0:2];if(y>=60&&tail<=465){if(n.duration){line(x,n.state==='holding'?426:y,x,tail,color+'88',19);ring(x,tail,8,color,2);}orb(x,n.state==='holding'?426:y,15,color);}}ctx.restore();
  text(g.bpm+' BPM',75,62,'#8fafa1',17);text('长尾需要按住',75,102,'#8fafa1',14);text('同时落下需双押',75,127,'#8fafa1',14);text('连击',770,210,'#9abaad',16,'center');text(String(g.combo).padStart(2,'0'),770,265,'#d8ee80',44,'center');text(g.lastHit,450,48,'#d8ee80',18,'center');
 }
 if(g.id==='race'){
  path(racePaths.outer.samples,'#35534f',52);path(racePaths.outer.samples,'#708e82',2,[10,12]);path(racePaths.short.samples,'#234a49',35);path(racePaths.short.samples,'#79b9b3',2,[7,12]);
  const short=racePaths.short;path(short.samples.filter(p=>p.s/short.length>.24&&p.s/short.length<.45),'#dfba69',5,[4,8]);text('近道 · 碎石区',450,238,'#dfba69',15,'center');text('外环',450,30,'#91aaa0',15,'center');
  const start=samplePath(racePaths.outer,0);line(start.x-25,start.y-8,start.x+25,start.y+8,'#fff2d3',6);text('起终点',start.x-20,start.y+39,'#b3c7ba',14,'center');
  for(let i=0;i<2;i++){const p=samplePath(racePaths.outer,g.rivals[i].s%racePaths.outer.length);orb(p.x+(i?7:-7),p.y,10,i?'#c8a7e5':'#ec99ac');}
  const current=racePaths[g.route],p=samplePath(current,g.progress%current.length);for(let j=1;j<8;j++){const t=samplePath(current,(g.progress-j*7+current.length)%current.length);circle(t.x,t.y,Math.max(1,7-j), '#8be1df44');}if(g.boost){ring(p.x,p.y,20,'#8be1df55',4);}orb(p.x,p.y,12,'#8be1df');text('你',p.x,p.y-22,'#8be1df',15,'center');text('能量',385,325,'#b4cabe',15);rect(385,342,135,8,'#3a5651',4);rect(385,342,135*g.energy/100,8,'#8be1df',4);text(Math.round(g.energy)+'%',535,351,'#8be1df',15);text(Math.round(g.speed)+' 速度',450,390,'#b4cabe',22,'center');
  for(const route of ['outer','short']){const pts=racePaths[route].samples;for(let i=1;i<pts.length;i++){const p=pts[i],a=pts[i-1];if(raceSection(route,p.s/racePaths[route].length).corner)line(a.x,a.y,p.x,p.y,'#ec99ac88',3);}}
  text('LAP '+g.lap+' / '+g.laps,450,288,'#e5eedb',26,'center');text(g.time<g.stun?'打滑！正在恢复':g.braking?'刹车中':g.risk>35?'弯道超速，松油门！':'红弯减速 · 直道超车',450,420,g.risk>35?'#ec99ac':'#8fae9f',14,'center');rect(385,437,135,5,'#3a5651',3);rect(385,437,135*g.risk/100,5,'#ec99ac',3);
  const refill=samplePath(current,current.length*.76);ring(refill.x,refill.y,18,'#d8ee80',3);text('+25',refill.x,refill.y+5,'#d8ee80',12,'center');text(g.time.toFixed(1)+' s',68,548,'#9bb5a7',15);text('你：青色     对手：粉 / 紫',825,548,'#9bb5a7',13,'right');
 }
 for(const p of g.particles){ctx.globalAlpha=clamp(p.life/.6,0,1);circle(p.x,p.y,3,p.color);}ctx.globalAlpha=1;
 ctx.restore();
}
