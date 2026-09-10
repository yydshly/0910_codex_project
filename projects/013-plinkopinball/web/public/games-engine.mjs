// Original 2D game studies; no upstream code or assets copied.
export const W=900,H=560,DT=1/120;
export const DIFFICULTIES=['练习','挑战','大师'];
export const MODES=[
 {id:'puzzle',name:'物理解谜',tag:'实验 / 收集 / 精准落点',title:'三星引力实验',description:'调整两段斜板和初速度，收集三颗星再落杯。发射后机关锁定，上一球的轨迹会留下供你复盘。',principle:'重力积分、圆与线段接触、轨迹记录和收集判定。',extend:'自定义机关、移动目标与关卡编辑器。',primary:'投下一球',metric:'已收集星星'},
 {id:'maze',name:'弹珠迷宫',tag:'探索 / 惯性 / 风险控制',title:'带上钥匙再离开',description:'收集三把钥匙解锁出口。方向键或触点控制倾斜；空格刹车。拿到钥匙会保存检查点，掉洞消耗救援次数。',principle:'可变重力、阻尼刹车、检查点恢复和门锁条件。',extend:'多层地形、机关地牢与随机地图。',primary:'重新出发',metric:'已获得钥匙'},
 {id:'breakout',name:'打砖块',tag:'护甲 / 爆破 / 道具',title:'击穿反应堆',description:'护甲砖需要多次命中，爆破砖会引发连锁。接住下落道具获得宽板或穿透；空格释放有限的冲击波。',principle:'碰撞法线、耐久状态、区域伤害与限时增益。',extend:'Boss 战、武器组合与 Roguelite 成长。',primary:'重新开局',metric:'摧毁砖块'},
 {id:'track',name:'轨道建造',tag:'规划 / 步数 / 撤销',title:'用有限步数接通能源',description:'旋转轨道连接入口与出口；带锁方块不能移动。预算用完只能撤销或重开。提示会消耗一步，并标记为辅助通关。',principle:'四向端口、路径遍历、最少旋转预算与操作历史。',extend:'关卡分享、复杂分岔与自动寻路竞赛。',primary:'试跑轨道',metric:'剩余旋转步数'},
 {id:'chain',name:'连锁机关',tag:'定时 / 窗口 / 速度取舍',title:'穿越三道脉冲门',description:'每道门只短暂开启。分别调整延迟与球速，让小球完整穿过开门窗口；开得太早或太晚都会撞门。',principle:'事件队列、有限时间窗口与区间碰撞检测。',extend:'逻辑电路、流水线和自动化工厂。',primary:'释放小球',metric:'通过脉冲门'},
 {id:'sorting',name:'颜色分类',tag:'三波订单 / 换序 / 连击',title:'越来越忙的分拣站',description:'完成三波共 24 球的订单，每波提速并交换箱子位置。按 1 / 2 / 3 选实际路线；看准箱上的 A / B / C，三次错误即失败。',principle:'波次状态机、路口锁定、类别映射与连击奖励。',extend:'多人协作厨房、物流调度与经营成长。',primary:'开始新一轮',metric:'完成订单'},
 {id:'rhythm',name:'节奏击球',tag:'切分 / 双押 / 长按',title:'双轨脉冲演奏',description:'F / J 对应左右轨。双球同时到达需要双押，带长尾的球需要按住直到尾端通过光圈。乱按会打断连击并扣分。',principle:'时间轴、精度窗口、按下与释放事件以及长按状态。',extend:'原创音乐谱面、延迟校准与演奏分享。',primary:'重新开始',metric:'演奏得分'},
 {id:'race',name:'弹珠竞速',tag:'三圈 / 弯道 / 能量管理',title:'赢下三圈大奖赛',description:'空格加速，Shift 刹车。红色弯道超速会积累失控值，打滑会损失时间和能量；每圈补能区可帮助反超。',principle:'弧长推进、路段状态、速度插值与失控累积。',extend:'赛季、幽灵回放与多人竞技。',primary:'重新比赛',metric:'当前名次'}
];
export const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const ball=(x,y,vx=0,vy=0,r=10)=>({x,y,vx,vy,r});
export function segmentHit(b,p,restitution=.2){
 const [x1,y1,x2,y2]=p,dx=x2-x1,dy=y2-y1,t=clamp(((b.x-x1)*dx+(b.y-y1)*dy)/(dx*dx+dy*dy),0,1),x=x1+t*dx,y=y1+t*dy;
 let nx=b.x-x,ny=b.y-y,d=Math.hypot(nx,ny);if(d>=b.r+4)return false;if(d<1e-8){nx=-dy;ny=dx;d=Math.hypot(nx,ny);}
 nx/=d;ny/=d;b.x=x+nx*(b.r+4);b.y=y+ny*(b.r+4);const dot=b.vx*nx+b.vy*ny;
 if(dot<0){b.vx-=(1+restitution)*dot*nx;b.vy-=(1+restitution)*dot*ny;}return true;
}
function rectHit(b,r,bounce=.9){
 let x=clamp(b.x,r.x,r.x+r.w),y=clamp(b.y,r.y,r.y+r.h),dx=b.x-x,dy=b.y-y,d=Math.hypot(dx,dy);
 if(d>=b.r)return false;
 if(d<1e-8){const gaps=[Math.abs(b.x-r.x),Math.abs(b.x-r.x-r.w),Math.abs(b.y-r.y),Math.abs(b.y-r.y-r.h)],k=gaps.indexOf(Math.min(...gaps));dx=[-1,1,0,0][k];dy=[0,0,-1,1][k];x=k===0?r.x:k===1?r.x+r.w:b.x;y=k===2?r.y:k===3?r.y+r.h:b.y;d=1;}
 const nx=dx/d,ny=dy/d;b.x=x+nx*b.r;b.y=y+ny*b.r;const v=b.vx*nx+b.vy*ny;if(v<0){b.vx-=(1+bounce)*v*nx;b.vy-=(1+bounce)*v*ny;}return true;
}
export const mazeWalls=[{x:260,y:45,w:18,h:335},{x:450,y:180,w:18,h:335},{x:650,y:45,w:18,h:335}];
export const holes=[{x:175,y:245,r:21},{x:307,y:290,r:20},{x:578,y:265,r:22},{x:777,y:230,r:21}];
export const waypoints=[{x:110,y:438},{x:354,y:438},{x:354,y:110},{x:546,y:110},{x:546,y:442},{x:790,y:445}];
export function puzzleRails(g){const angle=g.angle*Math.PI/180;return [[310-170*Math.cos(angle),245-170*Math.sin(angle),310+170*Math.cos(angle),245+170*Math.sin(angle)],[435,348,755,348+320*Math.tan((g.secondAngle??19.765)*Math.PI/180)]];}
const tileSolution=()=>Array.from({length:15},(_,i)=>({type:[4,5,9,10].includes(i)?'curve':'straight',rotation:({4:0,5:3,9:1,10:2})[i]??0}));
export const ports=t=> (t.type==='straight'?[1,3]:[3,2]).map(n=>(n+t.rotation)%4);
export const tileCenter=i=>({x:230+(i%5)*110,y:160+Math.floor(i/5)*110});
export const portPoint=(i,p)=>{const c=tileCenter(i);return {x:c.x+[0,55,0,-55][p],y:c.y+[-55,0,55,0][p]};};
function end(g,ok,text){if(g.status==='won'||g.status==='lost')return;g.status=ok?'won':'lost';g.message=text;g.endedAt=g.time;}
function particle(g,x,y,color='#d8ee80',n=10){for(let i=0;i<n;i++)g.particles.push({x,y,vx:Math.cos(i*2.399)*80,vy:Math.sin(i*2.399)*80,life:.6,color});}
function makePath(points){
 const samples=[];
 for(let i=0;i<points.length;i++){const prev=points[(i+points.length-1)%points.length],p=points[i],next=points[(i+1)%points.length],a={x:(prev[0]+p[0])/2,y:(prev[1]+p[1])/2},b={x:(next[0]+p[0])/2,y:(next[1]+p[1])/2};for(let j=0;j<20;j++){const t=j/20; samples.push({x:(1-t)**2*a.x+2*(1-t)*t*p[0]+t*t*b.x,y:(1-t)**2*a.y+2*(1-t)*t*p[1]+t*t*b.y});}}
 samples.push({...samples[0]});let length=0;for(let i=0;i<samples.length;i++){if(i)length+=dist(samples[i],samples[i-1]);samples[i].s=length;}return {samples,length};
}
export const racePaths={outer:makePath([[120,430],[80,300],[130,150],[260,70],[450,50],[640,70],[770,150],[820,300],[770,430],[450,490]]),short:makePath([[120,430],[80,300],[130,150],[450,190],[770,150],[820,300],[770,430],[450,490]])};
export function samplePath(path,s){s=clamp(s,0,path.length);const pts=path.samples;let i=1;while(i<pts.length-1&&pts[i].s<s)i++;const a=pts[i-1],b=pts[i],t=(s-a.s)/(b.s-a.s||1);return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};}

export function createGame(id,demo=true,difficulty=2){
 if(!MODES.some(m=>m.id===id))throw new Error('Unknown game');
 const level=clamp(Math.round(difficulty)||2,1,3);
 const g={id,demo,difficulty:level,time:0,status:'playing',message:'',particles:[],score:0,total:0,combo:0,bestCombo:0,assisted:false};
 if(id==='puzzle')Object.assign(g,{angle:demo||level===1?22:level===2?16:12,secondAngle:demo||level===1?19.765:level===2?28:30,launchSpeed:demo||level===1?15:35,attempts:0,maxAttempts:9-level*2,b:null,status:'ready',trace:[],ghost:[],stars:[{x:288,y:221},{x:507,y:313},{x:699,y:428}].map(p=>({...p,taken:false})),message:'收集全部三颗星，再让球落入杯中。'});
 if(id==='maze')Object.assign(g,{b:ball(100,100),waypoint:0,strength:1,keys:[waypoints[1],waypoints[3],waypoints[4]].map(p=>({...p,taken:false})),checkpoint:{x:100,y:100},rescues:3-level,recovering:0,timeLimit:125-level*20});
 if(id==='breakout')Object.assign(g,{b:ball(450,430,180,-260,9),paddle:450,lives:4-level,charges:2,wideUntil:0,pierceUntil:0,drops:[],bricks:Array.from({length:28},(_,i)=>({x:73+i%7*108,y:80+Math.floor(i/7)*36,w:98,h:25,alive:true,row:Math.floor(i/7),hp:i<7?level:1,kind:[9,18,24].includes(i)?'bomb':i%6===0?'power':'normal'}))});
 if(id==='track'){
  const solution=tileSolution(),tiles=solution.map((t,i)=>({...t,locked:[4,9,10].includes(i),rotation:[4,9,10].includes(i)?t.rotation:(t.rotation+(i%3)+1)%4}));
  const minimum=tiles.reduce((n,t,i)=>n+(t.locked?0:t.type==='straight'?(solution[i].rotation-t.rotation+4)%2:(solution[i].rotation-t.rotation+4)%4),0);
  Object.assign(g,{tiles,status:'ready',tile:0,entry:3,travel:0,visited:[],autoIndex:0,moves:0,budget:minimum+[10,4,0][level-1],history:[],message:'锁定方块已归位。规划路线，每次旋转消耗一步。'});
 }
 if(id==='chain')Object.assign(g,{delay:.2,delays:demo||level===1?[.2,.42,.13]:[0,.1,.05],gateWindow:[.7,.4,.25][level-1],launchSpeed:195,b:null,status:'ready',switches:[270,470,745].map((x,i)=>({x,gate:[350,595,810][i],triggered:false,open:false,passed:false,at:0,closeAt:0})),message:'观察门的开启窗口，三个延迟需要分别设置。'});
 if(id==='sorting')Object.assign(g,{balls:[],bins:[0,1,2],selected:1,spawned:0,resolved:0,nextSpawn:1.2,total:24,wave:1,lives:3,points:0});
 if(id==='rhythm'){
  const bpm=[96,112,128][level-1],beatSeconds=60/bpm,notes=[];
  for(let i=0;i<24;i++){const at=1.8+i*beatSeconds+(i%8===3?beatSeconds*.5:0),lane=i%4===0||i%4===3?0:1;notes.push({at,lane,duration:i%8===5?beatSeconds*.75:0,state:'pending'});if(i%8===7)notes.push({at,lane:1-lane,duration:0,state:'pending'});}
  Object.assign(g,{notes,bpm,beatSeconds,window:[.18,.14,.11][level-1],maxScore:notes.reduce((n,t)=>n+100+(t.duration?50:0),0),resolved:0,misses:0,perfect:0,ghosts:0,lastGhost:-1,lastHit:'单点 · 双押 · 长按',flash:[0,0],beat:-1,held:[false,false]});
 }
 if(id==='race')Object.assign(g,{route:'short',energy:100,progress:0,speed:0,rivals:[{s:0,speed:0,base:218+level*5},{s:0,speed:0,base:208+level*4}],rank:1,boost:false,laps:3,lap:1,risk:0,spins:0,stun:0,recharges:0,braking:false});
 return g;
}
function combo(g){g.combo++;g.bestCombo=Math.max(g.bestCombo,g.combo);}
function hitBrick(g,brick){
 if(!brick.alive)return;brick.hp--;if(brick.hp>0){particle(g,brick.x+brick.w/2,brick.y,'#ffffff',4);return;}
 brick.alive=false;g.score++;combo(g);particle(g,brick.x+brick.w/2,brick.y+12,['#d8ee80','#8be1df','#d4b4ee','#ec99ac'][brick.row]);
 if(brick.kind==='power')g.drops.push({x:brick.x+brick.w/2,y:brick.y+12,kind:g.score%2?'wide':'pierce'});
 // Mark the bomb dead before recursively propagating damage to avoid cycles.
 if(brick.kind==='bomb'){g.message='连锁爆破！附近砖块受到伤害。';for(const other of g.bricks)if(other.alive&&Math.hypot(other.x-brick.x,other.y-brick.y)<112)hitBrick(g,other);}
}
function missNote(g,n,message){n.state='miss';g.resolved++;g.misses++;g.combo=0;g.lastHit=message;}
export function action(g,name,value){
 if(['angle','secondAngle','launchSpeed','delay'].includes(name)&&!Number.isFinite(Number(value)))return;
 if(g.id==='puzzle'&&g.status!=='playing'){
  if(name==='angle')g.angle=clamp(Number(value),5,42);
  if(name==='secondAngle')g.secondAngle=clamp(Number(value),8,32);
  if(name==='launchSpeed')g.launchSpeed=clamp(Number(value),0,70);
 }
 if(name==='strength'&&g.id==='maze'&&Number.isFinite(Number(value)))g.strength=clamp(Number(value),.5,1.8);
 if(g.id==='chain'&&g.status!=='playing'){
  if(name==='delay'){g.delay=clamp(Number(value),.05,1.2);g.delays.fill(g.delay);}
  if(name==='gateDelay'&&Number.isInteger(value?.index)&&value.index>=0&&value.index<3&&Number.isFinite(value.delay))g.delays[value.index]=clamp(value.delay,0,1.2);
  if(name==='launchSpeed')g.launchSpeed=clamp(Number(value),145,260);
 }
 if(name==='select'&&g.id==='sorting'&&Number.isFinite(Number(value)))g.selected=clamp(Math.round(value),0,2);
 if(name==='route'&&g.id==='race'&&g.progress===0)g.route=value==='outer'?'outer':'short';
 if(g.id==='track'&&g.status!=='playing'){
  if(name==='rotate'&&Number.isInteger(value)&&value>=0&&value<15){
   const tile=g.tiles[value];g.selectedTile=value;
   if(tile.locked){g.message='这块轨道已锁定，请规划其他方块。';return;}
   if(g.moves>=g.budget){g.message='步数已用完，可以撤销上一步或重开。';return;}
   g.history.push({index:value,rotation:tile.rotation});tile.rotation=(tile.rotation+1)%4;g.moves++;g.status='ready';g.message='已用 '+g.moves+' / '+g.budget+' 步。';
  }
  if(name==='undo'&&g.history.length){const last=g.history.pop();g.tiles[last.index].rotation=last.rotation;g.moves--;g.status='ready';g.message='已撤销上一步。';}
  if(name==='hint'){
   const sol=tileSolution(),i=g.tiles.findIndex((t,i)=>!ports(t).every(p=>ports(sol[i]).includes(p)));
   if(i>=0&&g.moves<g.budget){g.assisted=true;action(g,'rotate',i);g.message='提示：第 '+(i+1)+' 块已向正确方向旋转一步。';}
  }
  if(name==='solve'){g.assisted=true;g.tiles=tileSolution().map((t,i)=>({...t,locked:[4,9,10].includes(i)}));g.status='ready';g.message='示例已填入，本次作为辅助练习。';}
 }
 if(name==='pulse'&&g.id==='breakout'&&g.status==='playing'&&g.charges>0){g.charges--;g.pulse={x:g.b.x,y:g.b.y,until:g.time+.4};for(const b of g.bricks)if(b.alive&&Math.hypot(b.x+b.w/2-g.b.x,b.y+b.h/2-g.b.y)<105)hitBrick(g,b);g.message='冲击波释放：适合在砖块密集区使用。';}
 if(g.id==='rhythm'&&g.status==='playing'){
  const lane=Number(value);if((name==='hit'||name==='release')&&lane!==0&&lane!==1)return;
  if(name==='release'){g.held[lane]=false;for(const n of g.notes)if(n.lane===lane&&n.state==='holding'&&g.time<n.at+n.duration-.045)missNote(g,n,'长按松得太早');}
  if(name==='hit'){
   g.held[lane]=true;g.flash[lane]=.18;
   const n=g.notes.filter(n=>n.lane===lane&&n.state==='pending').sort((a,b)=>Math.abs(a.at-g.time)-Math.abs(b.at-g.time))[0];
   if(n&&Math.abs(n.at-g.time)<=g.window){const perfect=Math.abs(n.at-g.time)<=.065;g.score+=perfect?100:70;if(perfect)g.perfect++;n.state=n.duration?'holding':'hit';if(!n.duration){g.resolved++;combo(g);}g.lastHit=n.duration?'按住，直到尾端通过':perfect?'PERFECT · 精准':'GOOD · 命中';particle(g,350+lane*200,426,lane?'#ec99ac':'#8be1df');}
   else if(g.time>1&&g.time-g.lastGhost>.09){g.score=Math.max(0,g.score-25);g.combo=0;g.ghosts++;g.lastGhost=g.time;g.lastHit='空击 −25 · 等待节拍';}
  }
 }
 if(name==='launch'&&g.status!=='playing'){
  if(g.id==='puzzle'){
   if(g.attempts>=g.maxAttempts){g.message='本轮投球次数已用完，点击“重来”重新挑战。';return;}
   g.ghost=g.trace;g.trace=[];g.stars.forEach(s=>s.taken=false);g.score=0;g.b=ball(208,75,g.launchSpeed,0);g.attempts++;g.startedAt=g.time;g.status='playing';g.message='机关已锁定，观察星星与落点。';
  }
  if(g.id==='chain'){g.b=ball(95,300,g.launchSpeed,0);g.switches.forEach(s=>Object.assign(s,{triggered:false,open:false,passed:false,at:0,closeAt:0}));g.status='playing';g.score=0;g.message='门会自动关闭，球尾也必须在窗口内通过。';}
  if(g.id==='track'){g.status='playing';g.tile=0;g.entry=3;g.travel=0;g.visited=[];g.score=0;g.message='检查入口、弯道和出口是否连通。';}
 }
}
export function raceSection(route,fraction){return {corner:(fraction>.07&&fraction<.21)||(fraction>.48&&fraction<.63),rough:route==='short'&&fraction>.24&&fraction<.45};}
export function stepGame(g,dt,input={}){
 g.particles=g.particles.filter(p=>{p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=90*dt;return p.life>0;});
 if(g.status==='won'||g.status==='lost')return;
 g.time+=dt;
 if(g.demo&&g.status==='ready'){
  if(g.id==='track'){
   if(g.autoIndex<15&&g.time>g.autoIndex*.13+.3){const t=g.tiles[g.autoIndex],sol=tileSolution()[g.autoIndex];if(!ports(t).every(p=>ports(sol).includes(p)))action(g,'rotate',g.autoIndex);else g.autoIndex++;}
   if(g.autoIndex===15&&g.time>2.5)action(g,'launch');
  }else if(g.time>.8){if(g.id==='chain')g.delays=g.switches.map(s=>Math.max(0,(s.gate-s.x)/g.launchSpeed-g.gateWindow*.5));action(g,'launch');}
 }
 if(g.status!=='playing')return;
 if(g.id==='puzzle'){
  const b=g.b;b.vy+=600*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;for(const p of puzzleRails(g))segmentHit(b,p,.12);b.vx*=Math.exp(-.05*dt);
  if(!g.trace.length||dist(b,g.trace.at(-1))>5)g.trace.push({x:b.x,y:b.y});
  for(const s of g.stars)if(!s.taken&&dist(b,s)<[40,30,21][g.difficulty-1]){s.taken=true;g.score++;particle(g,s.x,s.y);}
  if(b.x>740&&b.x<850&&b.y>483&&b.y<540)end(g,g.score===3,g.score===3?'三颗星全部入袋！第 '+g.attempts+' 球完成精准落杯。':'已入杯，但还有星星没收集。参考轨迹调整后再试。');
  else if(b.y>570||b.x>910||b.x<0||g.time-g.startedAt>15)end(g,false,'没有接住。上一球轨迹已保留，调整角度与初速度后再试。');
 }
 if(g.id==='maze'){
  const b=g.b;let ax=input.x||0,ay=input.y||0;
  if(g.demo){const target=waypoints[g.waypoint];if(dist(b,target)<23&&g.waypoint<waypoints.length-1)g.waypoint++;const t=waypoints[g.waypoint];ax=clamp((t.x-b.x)*.025-b.vx*.013,-1,1);ay=clamp((t.y-b.y)*.025-b.vy*.013,-1,1);}
  g.braking=!!input.brake;const drag=g.braking?7:1.2;g.tilt={x:ax,y:ay};b.vx=(b.vx+ax*330*g.strength*dt)*Math.exp(-drag*dt);b.vy=(b.vy+ay*330*g.strength*dt)*Math.exp(-drag*dt);b.x+=b.vx*dt;b.y+=b.vy*dt;
  for(const r of mazeWalls)rectHit(b,r,.25);if(b.x<55||b.x>845){b.x=clamp(b.x,55,845);b.vx*=-.2;}if(b.y<55||b.y>505){b.y=clamp(b.y,55,505);b.vy*=-.2;}
  for(const key of g.keys)if(!key.taken&&dist(b,key)<30){key.taken=true;g.score++;g.checkpoint={x:key.x,y:key.y};particle(g,key.x,key.y);g.message='钥匙 '+g.score+' / 3 · 检查点已保存。';}
  for(const hole of holes)if(dist(b,hole)<hole.r-3){if(g.rescues>0){g.rescues--;g.b=ball(g.checkpoint.x,g.checkpoint.y);g.recovering=g.time+.8;g.message='已回到检查点，剩余救援 '+g.rescues+' 次。';}else end(g,false,'救援次数耗尽。接近黑洞时按住刹车。');break;}
  if(dist(g.b,{x:800,y:450})<30){if(g.score===3)end(g,true,'三把钥匙已集齐！'+g.time.toFixed(1)+' 秒逃出迷宫。');else g.message='出口尚未解锁，还需要 '+(3-g.score)+' 把钥匙。';}
  if(g.time>g.timeLimit)end(g,false,'倒计时结束。利用检查点，规划更短的路线。');
 }
 if(g.id==='breakout'){
  const b=g.b,half=g.time<g.wideUntil?95:65;
  if(g.demo){const target=g.bricks.filter(r=>r.alive).sort((a,c)=>Math.abs(a.x+49-b.x)-Math.abs(c.x+49-b.x))[0];const dx=(target?.x??400)+49-b.x,offset=clamp(dx/Math.hypot(dx,390)*half/.8,-half*.88,half*.88);g.paddle+=clamp(b.x-offset-g.paddle,-750*dt,750*dt);}else if(Number.isFinite(input.pointerX))g.paddle=input.pointerX;else g.paddle+=(input.x||0)*580*dt;
  g.paddle=clamp(g.paddle,42+half,858-half);b.x+=b.vx*dt;b.y+=b.vy*dt;
  if(b.x<49||b.x>851){b.x=clamp(b.x,49,851);b.vx*=-1;}if(b.y<49){b.y=49;b.vy=Math.abs(b.vy);}
  if(b.vy>0&&b.y>=475&&b.y<=501&&Math.abs(b.x-g.paddle)<half+9){const offset=clamp((b.x-g.paddle)/half,-1,1),speed=340+g.score*2+g.difficulty*8;b.y=474;b.vx=offset*speed*.8;b.vy=-Math.sqrt(speed**2-b.vx**2);g.combo=0;}
  for(const brick of g.bricks)if(brick.alive){const vx=b.vx,vy=b.vy;if(rectHit(b,brick,1)){hitBrick(g,brick);if(g.time<g.pierceUntil){b.vx=vx;b.vy=vy;brick.hp=1;hitBrick(g,brick);}break;}}
  if(g.demo&&g.charges&&b.y<230&&g.bricks.filter(r=>r.alive&&Math.hypot(r.x+r.w/2-b.x,r.y-b.y)<105).length>=3)action(g,'pulse');
  for(const drop of g.drops){drop.y+=130*dt;if(drop.y>473&&drop.y<510&&Math.abs(drop.x-g.paddle)<half+12){drop.done=true;if(drop.kind==='wide')g.wideUntil=g.time+10;else g.pierceUntil=g.time+8;g.message=drop.kind==='wide'?'宽板生效 · 10 秒':'穿透生效 · 8 秒';particle(g,drop.x,480,'#8be1df');}}
  g.drops=g.drops.filter(d=>!d.done&&d.y<570);
  if(g.score===28)end(g,true,'反应堆已清空！最高空中连锁 '+g.bestCombo+'。');
  if(b.y>580){g.lives--;g.combo=0;if(g.lives<=0)end(g,false,'最后一次接球失败。留意道具，冲击波可快速打开缺口。');else g.b=ball(g.paddle,430,140,-280,9);}
 }
 if(g.id==='track'){
  const tile=g.tiles[g.tile],ps=ports(tile);if(!ps.includes(g.entry)){end(g,false,'第 '+(g.tile+1)+' 块入口不通。撤销或旋转后再试跑。');return;}
  const exit=ps.find(p=>p!==g.entry);g.exit=exit;g.travel+=dt*2.4;
  if(g.travel>=1){g.travel-=1;g.visited.push(g.tile);g.score=g.visited.length;const col=g.tile%5,row=Math.floor(g.tile/5),nc=col+[0,1,0,-1][exit],nr=row+[-1,0,1,0][exit];if(g.tile===14&&exit===1){end(g,true,'能源接通！用 '+g.moves+' / '+g.budget+' 步完成'+(g.assisted?'（辅助练习）。':'。'));return;}if(nc<0||nc>=5||nr<0||nr>=3||g.visited.includes(nr*5+nc)){end(g,false,'轨道通向边界或回路。修复发光位置的下一块。');return;}g.tile=nr*5+nc;g.entry=(exit+2)%4;}
 }
 if(g.id==='chain'){
  const b=g.b;b.x+=b.vx*dt;
  for(const [i,s]of g.switches.entries()){
   if(!s.triggered&&b.x>=s.x){s.triggered=true;s.at=g.time+g.delays[i];s.closeAt=s.at+g.gateWindow;particle(g,s.x,300,'#8be1df');}
   s.open=s.triggered&&g.time>=s.at&&g.time<s.closeAt;
   if(!s.open&&b.x+b.r>=s.gate-8&&b.x-b.r<=s.gate+8){end(g,false,g.time>=s.closeAt?'门 '+(i+1)+' 关得太早：增加延迟，或提高球速。':'门 '+(i+1)+' 还未开启：缩短延迟，或降低球速。');return;}
   if(!s.passed&&b.x-b.r>s.gate+8){s.passed=true;g.score++;particle(g,s.gate,300);}
  }
  if(b.x>850)end(g,true,'三道脉冲门全部通过！球速与三个窗口同步成功。');
 }
 if(g.id==='sorting'){
  const colors=[0,2,1,2,0,1,1,0];
  if(g.spawned<g.wave*8&&g.time>=g.nextSpawn){g.balls.push({x:450,y:60,color:colors[(g.spawned+(g.wave-1)*3)%8],route:null});g.spawned++;g.nextSpawn=g.time+Math.max(.48,1.5-g.difficulty*.16-(g.wave-1)*.22);}
  const incoming=g.balls.filter(b=>b.route===null).sort((a,b)=>b.y-a.y)[0];if(g.demo&&incoming)g.selected=g.bins.indexOf(incoming.color);
  for(const b of g.balls){b.y+=(145+g.wave*10+g.difficulty*8)*dt;if(b.route===null&&b.y>=263)b.route=g.selected;if(b.route!==null){const t=clamp((b.y-263)/210,0,1);b.x=450+([210,450,690][b.route]-450)*(t*t*(3-2*t));}if(b.y>=475){b.done=true;g.resolved++;if(b.color===g.bins[b.route]){g.score++;combo(g);g.points+=100+Math.min(10,g.combo)*10;particle(g,b.x,b.y,['#8be1df','#d8ee80','#ec99ac'][b.color]);g.message=g.combo+' 连击 · 订单积分 '+g.points;}else{g.lives--;g.combo=0;g.message='分错了，剩余容错 '+g.lives+' 次。';}}}
  g.balls=g.balls.filter(b=>!b.done);
  if(g.lives<=0)end(g,false,'三次分拣错误，订单中断。注意每波箱子会换位置。');
  else if(g.resolved===24)end(g,true,'三波订单完成！正确 '+g.score+' / 24 · '+g.points+' 分。');
  else if(g.resolved===g.wave*8&&g.wave<3){g.wave++;g.bins=[g.bins[1],g.bins[2],g.bins[0]];g.nextSpawn=g.time+2;g.message='第 '+g.wave+' 波 · 箱位已交换，速度提升！';}
 }
 if(g.id==='rhythm'){
  g.flash=g.flash.map(v=>Math.max(0,v-dt));
  for(const n of g.notes){
   if(g.demo&&n.state==='pending'&&g.time>=n.at)action(g,'hit',n.lane);
   if(n.state==='pending'&&g.time>n.at+g.window)missNote(g,n,'MISS · 跟上下一拍');
   if(n.state==='holding'){
    if(!g.demo&&!g.held[n.lane])missNote(g,n,'长按中断');
    else if(g.time>=n.at+n.duration-.04){n.state='hit';g.score+=50;g.resolved++;combo(g);g.lastHit='HOLD +50 · 长按完成';}
   }
  }
  if(g.resolved===g.notes.length)end(g,g.score>=g.maxScore*.7,'完成 '+g.notes.length+' 音符 · '+Math.round(g.score/g.maxScore*100)+'% 得分率 · 最长连击 '+g.bestCombo+'。');
 }
 if(g.id==='race'){
  const path=racePaths[g.route],fraction=(g.progress%path.length)/path.length,section=raceSection(g.route,fraction);
  g.lap=Math.min(g.laps,Math.floor(g.progress/path.length)+1);
  g.braking=g.demo?section.corner&&g.speed>179:!!input.brake;g.boost=g.demo?!section.corner&&g.energy>15:!!input.boost;
  const boosting=g.boost&&!g.braking&&g.energy>1&&g.time>=g.stun;
  g.energy=clamp(g.energy+(boosting?-27:19)*dt,0,100);
  const target=g.time<g.stun?20:g.braking?115:(section.rough?127:158)+(boosting?133:0);
  g.speed+=(target-g.speed)*Math.min(1,dt*(g.braking?7:3));
  g.risk=clamp(g.risk+(section.corner&&g.speed>185?(g.speed-185)*[.9,1.5,2.1][g.difficulty-1]:-60)*dt,0,100);
  if(g.risk>=100){g.spins++;g.stun=g.time+3;g.risk=0;g.energy=Math.max(0,g.energy-50);g.message='弯道失控！下次提前松开加速并刹车。';}
  g.progress+=g.speed*dt;
  if(fraction>.76&&g.recharges<g.lap){g.recharges=g.lap;g.energy=clamp(g.energy+25,0,100);g.message='通过补能区 +25 · 第 '+g.lap+' 圈。';}
  for(const r of g.rivals){const f=(r.s%racePaths.outer.length)/racePaths.outer.length,s=raceSection('outer',f);const target=s.corner?143:r.base;r.speed+=(target-r.speed)*Math.min(1,dt*4);r.s=Math.min(racePaths.outer.length*g.laps,r.s+r.speed*dt);if(r.s>=racePaths.outer.length*g.laps&&r.finishedAt===undefined)r.finishedAt=g.time;}
  g.rank=1+g.rivals.filter(r=>r.s/racePaths.outer.length>g.progress/path.length).length;
  if(g.progress>=path.length*g.laps){g.progress=path.length*g.laps;g.rank=1+g.rivals.filter(r=>r.finishedAt!==undefined&&r.finishedAt<=g.time).length;end(g,g.rank===1,'第 '+g.rank+' 名 · '+g.time.toFixed(2)+' 秒 · 打滑 '+g.spins+' 次。'+(g.rank===1?'三圈冠军！':'把加速留给直道，弯道提前减速。'));}
 }
}
export function metric(g){switch(g.id){case'puzzle':return g.score+' / 3';case'maze':return g.score+' / 3';case'breakout':return g.score+' / 28';case'track':return String(g.budget-g.moves);case'chain':return g.score+' / 3';case'sorting':return g.resolved+' / 24';case'rhythm':return String(g.score);case'race':return '#'+g.rank;}}
export function progress(g){switch(g.id){case'puzzle':case'maze':case'chain':return g.score/3;case'breakout':return g.score/28;case'track':return g.visited.length/15;case'sorting':return g.resolved/24;case'rhythm':return g.resolved/g.notes.length;case'race':return g.progress/(racePaths[g.route].length*g.laps);}}
export function details(g){switch(g.id){case'puzzle':return '投球 '+g.attempts+' / '+g.maxAttempts+' · 发射后锁定机关';case'maze':return '剩余 '+Math.max(0,g.timeLimit-g.time).toFixed(0)+' 秒 · 救援 '+g.rescues+' 次';case'breakout':return '机会 '+g.lives+' · 冲击波 '+g.charges+' · 连锁 '+g.combo;case'track':return '已用 '+g.moves+' / '+g.budget+' 步'+(g.assisted?' · 辅助练习':' · 3 块锁定');case'chain':return '开门窗口 '+g.gateWindow.toFixed(2)+' 秒 · 球速 '+g.launchSpeed;case'sorting':return '第 '+g.wave+' / 3 波 · 容错 '+g.lives+' · 连击 '+g.combo;case'rhythm':return g.bpm+' BPM · 精准 '+g.perfect+' · 漏拍 '+g.misses+' · 空击 '+g.ghosts;case'race':return '第 '+g.lap+' / '+g.laps+' 圈 · 失控 '+Math.round(g.risk)+'% · 打滑 '+g.spins;}}
export function rating(g){if(g.status!=='won')return 0;if(g.assisted)return 1;switch(g.id){case'puzzle':return g.attempts<=1?3:g.attempts<=3?2:1;case'maze':return g.time<45&&g.rescues===3-g.difficulty?3:g.time<70?2:1;case'breakout':return g.lives===4-g.difficulty?3:g.lives>1?2:1;case'track':return g.moves<=g.budget-[10,4,0][g.difficulty-1]?3:2;case'chain':return 3;case'sorting':return g.score===24?3:g.score>=23?2:1;case'rhythm':return g.score>=g.maxScore*.95?3:g.score>=g.maxScore*.85?2:1;case'race':return g.spins===0?3:g.spins<=2?2:1;}}
