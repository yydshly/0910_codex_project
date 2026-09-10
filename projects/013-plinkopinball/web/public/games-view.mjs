import {W,H,clamp,puzzleRails,mazeWalls,holes,waypoints,ports,tileCenter,portPoint,racePaths,samplePath} from './games-engine.mjs';
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
  text('落球口',208,42,'#b4ccc5',15,'center');rect(188,54,40,10,'#8be1df',3);line(208,85,208,115,'#426767',1);text('① 可调斜板',175,190);text('② 固定斜板',550,335);
  for(const [i,p]of puzzleRails(g).entries()){line(p[0]+2,p[1]+7,p[2]+2,p[3]+7,'#061b2077',16);line(...p,i?'#799b93':'#d8ee80',12);orb(p[0],p[1],5,'#406259');orb(p[2],p[3],5,'#406259');}
  rect(740,500,110,35,'#d8ee8028',4);line(740,483,740,531,'#d8ee80',5);line(740,531,850,531,'#d8ee80',5);line(850,483,850,531,'#d8ee80',5);text('收集杯',795,556,'#d8ee80',15,'center');
  const b=g.b||{x:208,y:75,r:10};orb(b.x,b.y,b.r);if(g.status==='won')ring(b.x,b.y,22+Math.sin(g.time*4)*3,'#d8ee80');
 }
 if(g.id==='maze'){
  rect(42,42,816,476,'#18383b',12);ctx.strokeStyle='#52736d';ctx.lineWidth=5;ctx.strokeRect(45,45,810,470);
  if(g.demo)path([{x:100,y:100},...waypoints],'#345f59',2,[5,8]);
  for(const r of mazeWalls){rect(r.x+3,r.y+5,r.w,r.h,'#061b20',4);rect(r.x,r.y,r.w,r.h,'#90a79c',4);}
  for(const h of holes){circle(h.x,h.y,h.r+5,'#314f4e');circle(h.x,h.y,h.r,'#06161d');ring(h.x,h.y,h.r-5,'#172f33');}
  circle(800,450,31,'#d8ee8025');ring(800,450,31,'#d8ee80');text('终点',800,456,'#d8ee80',16,'center');text('起点',100,77,'#a8c0b8',14,'center');orb(g.b.x,g.b.y,g.b.r,'#8be1df');
  const t=g.tilt||{x:0,y:0};line(90,550,90+t.x*32,550+t.y*18,'#8be1df',3);text('倾斜方向',140,548,'#8da8a2',13);
 }
 if(g.id==='breakout'){
  rect(40,40,820,490,'#143235',9);line(40,525,40,40,'#55776e');line(40,40,860,40,'#55776e');line(860,40,860,525,'#55776e');
  for(const b of g.bricks)if(b.alive){rect(b.x,b.y+4,b.w,b.h,'#071b20',4);rect(b.x,b.y,b.w,b.h,['#d8ee80','#8be1df','#c5a6e2','#ec99ac'][b.row],4);rect(b.x+4,b.y+3,b.w-8,3,'#ffffff33',2);}
  rect(g.paddle-65,489,130,15,'#061b20',7);rect(g.paddle-65,485,130,13,'#8be1df',6);rect(g.paddle-18,485,36,13,'#ecf6e8',4);orb(g.b.x,g.b.y,g.b.r);
  text('剩余机会',70,548,'#8da8a2',14);for(let i=0;i<g.lives;i++)orb(162+i*25,543,6,'#ec99ac');text('移动挡板，改变下一次反弹',825,548,'#8da8a2',14,'right');
 }
 if(g.id==='track'){
  text('入口 →',170,166,'#d8ee80',16,'right');text('→ 出口',735,386,'#d8ee80',16);
  for(let i=0;i<15;i++){const c=tileCenter(i),ps=ports(g.tiles[i]),a=portPoint(i,ps[0]),b=portPoint(i,ps[1]),visited=g.visited.includes(i);rect(c.x-52,c.y-52,104,104,'#214243',7);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo(c.x,c.y,b.x,b.y);ctx.lineWidth=24;ctx.strokeStyle='#0a2329';ctx.stroke();ctx.lineWidth=4;ctx.strokeStyle=visited?'#d8ee80':'#749a91';ctx.stroke();circle(c.x-38,c.y-36,2,'#719087');text(String(i+1).padStart(2,'0'),c.x+40,c.y+42,'#6f938a',11,'right');}
  if(g.status==='playing'||g.status==='won'||g.status==='lost'){const i=g.tile,c=tileCenter(i),a=portPoint(i,g.entry),ps=ports(g.tiles[i]),exit=ps.find(p=>p!==g.entry)??g.entry,b=portPoint(i,exit),t=g.status==='won'?1:clamp(g.travel,0,1);const x=(1-t)**2*a.x+2*(1-t)*t*c.x+t*t*b.x,y=(1-t)**2*a.y+2*(1-t)*t*c.y+t*t*b.y;orb(x,y,11,'#d8ee80');if(g.status==='lost')ring(x,y,24,'#ec99ac');}
  if(!g.demo&&Number.isInteger(g.selectedTile)){const c=tileCenter(g.selectedTile);ctx.strokeStyle='#d8ee80';ctx.lineWidth=2;ctx.strokeRect(c.x-52,c.y-52,104,104);}
  text(g.demo?'示例逐块拼接，然后自动试跑':'点击任意方块旋转 90°',450,487,'#a9c4bb',17,'center');
 }
 if(g.id==='chain'){
  rect(70,260,790,80,'#183b3b',10);line(75,325,860,325,'#74948a',7);
  for(const [i,s]of g.switches.entries()){line(s.x,274,s.x,210,s.triggered?'#8be1df':'#466b62',2);line(s.x,210,s.gate,210,s.triggered?'#8be1df':'#466b62',2);line(s.gate,210,s.gate,240,s.triggered?'#8be1df':'#466b62',2);circle(s.x,300,19,s.triggered?'#8be1df':'#315c58');text(String.fromCharCode(65+i),s.x,306,s.triggered?'#123236':'#bdd0c8',16,'center');
   const open=s.open?1:s.triggered?clamp(1-(s.at-g.time)/g.delay,0,1):0;rect(s.gate-8,255-open*95,16,72,s.open?'#d8ee80':'#ec99ac',3);text(s.open?'已开门':s.triggered?'开启中':'等待触发',s.gate,385,s.open?'#d8ee80':'#a7c1b7',14,'center');text('开关 '+String.fromCharCode(65+i),s.x,430,'#a7c1b7',15,'center');}
  text('发射口',97,380,'#b2c8bd',14,'center');text('出口',850,245,'#d8ee80',15,'center');const b=g.b||{x:95,y:300,r:10};orb(b.x,b.y,b.r);text('触发开关 → 等待延迟 → 门升起 → 小球通过',450,90,'#b2c8bd',19,'center');
 }
 if(g.id==='sorting'){
  rect(428,35,44,80,'#234a48',12);line(450,100,450,250,'#456d64',4);circle(450,264,27,'#315653');const laneX=[210,450,690];
  for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(450,264);ctx.bezierCurveTo(450,350,laneX[i],360,laneX[i],468);ctx.lineWidth=g.selected===i?6:2;ctx.strokeStyle=g.selected===i?colors[i]:'#34574f';ctx.stroke();rect(laneX[i]-68,476,136,54,colors[i]+'28',8);line(laneX[i]-68,470,laneX[i]-68,530,colors[i],4);line(laneX[i]+68,470,laneX[i]+68,530,colors[i],4);text(['青 · A','黄 · B','粉 · C'][i],laneX[i],510,colors[i],19,'center');}
  circle(450,264,14,colors[g.selected]);for(const b of g.balls){orb(b.x,b.y,16,colors[b.color]);text(['A','B','C'][b.color],b.x,b.y+5,'#102a2c',13,'center');}text('经过这里时锁定路线',505,269,'#94b3a7',15);text('已处理 '+g.resolved+' / 12',70,55,'#a7c5b6',16);
 }
 if(g.id==='rhythm'){
  for(let lane=0;lane<2;lane++){const x=350+lane*200;rect(x-65,75,130,390,'#1b3b3f',12);line(x,90,x,420,'#2c5354',2);circle(x,426,38,colors[lane===0?0:2]+'15');ring(x,426,30+g.flash[lane]*90,colors[lane===0?0:2],g.flash[lane]>0?5:2);line(x-55,426,x+55,426,colors[lane===0?0:2],1);text(lane?'J / 右':'F / 左',x,505,'#c5d8cd',18,'center');}
  for(const n of g.notes)if(n.state==='pending'){const t=(g.time-(n.at-1.4))/1.4;if(t>=0&&t<=1.12){const y=100+t*326,x=350+n.lane*200;line(x,y-28,x,y,colors[n.lane===0?0:2]+'55',14);orb(x,y,15,colors[n.lane===0?0:2]);}}
  text('96 BPM',75,62,'#8fafa1',17);text('连击',770,210,'#9abaad',16,'center');text(String(g.combo).padStart(2,'0'),770,265,'#d8ee80',44,'center');text(g.lastHit,450,48,'#d8ee80',18,'center');
 }
 if(g.id==='race'){
  path(racePaths.outer.samples,'#35534f',52);path(racePaths.outer.samples,'#708e82',2,[10,12]);path(racePaths.short.samples,'#234a49',35);path(racePaths.short.samples,'#79b9b3',2,[7,12]);
  const short=racePaths.short;path(short.samples.filter(p=>p.s/short.length>.24&&p.s/short.length<.45),'#dfba69',5,[4,8]);text('近道 · 减速区',450,253,'#dfba69',15,'center');text('外环',450,30,'#91aaa0',15,'center');
  const start=samplePath(racePaths.outer,0);line(start.x-25,start.y-8,start.x+25,start.y+8,'#fff2d3',6);text('起终点',start.x-20,start.y+39,'#b3c7ba',14,'center');
  for(let i=0;i<2;i++){const p=samplePath(racePaths.outer,Math.min(g.rivals[i].s,racePaths.outer.length));orb(p.x+(i?7:-7),p.y,10,i?'#c8a7e5':'#ec99ac');}
  const p=samplePath(racePaths[g.route],g.progress);if(g.boost){ring(p.x,p.y,20,'#8be1df55',4);}orb(p.x,p.y,12,'#8be1df');text('你',p.x,p.y-22,'#8be1df',15,'center');text('能量',385,325,'#b4cabe',15);rect(385,342,135,8,'#3a5651',4);rect(385,342,135*g.energy/100,8,'#8be1df',4);text(Math.round(g.energy)+'%',535,351,'#8be1df',15);text(Math.round(g.speed)+' 速度',450,390,'#b4cabe',16,'center');
 }
 for(const p of g.particles){ctx.globalAlpha=clamp(p.life/.6,0,1);circle(p.x,p.y,3,p.color);}ctx.globalAlpha=1;
 ctx.restore();
}
