// Independent playable concept studies. No upstream game code or assets are copied.
export const W=900,H=560,DT=1/120;
export const MODES=[
 {id:'puzzle',name:'物理解谜',tag:'摆放与试验',title:'让小球落进收集杯',description:'改变第一块斜板的角度，再投下一球。目标是借助两块斜板，把球送到右下方。',principle:'圆与线段碰撞、重力、弹性，以及可编辑的机关参数。',extend:'可以继续做成有限机关、星级目标和逐步解锁的关卡。',primary:'投下一球',metric:'尝试次数'},
 {id:'maze',name:'弹珠迷宫',tag:'倾斜与避险',title:'穿过迷宫，避开黑洞',description:'按方向键或下方倾斜按钮控制重力。也可按住画面，让小球向触点方向移动。',principle:'改变重力方向，用圆与墙壁碰撞限制运动。',extend:'可以增加移动障碍、检查点和多层迷宫。',primary:'重新出发',metric:'用时'},
 {id:'breakout',name:'打砖块',tag:'反弹与消除',title:'接住小球，清空砖块',description:'移动鼠标或手指控制挡板，也可使用左右方向键。击球位置会改变反弹方向。',principle:'圆与矩形碰撞，依据击中挡板的位置改变速度方向。',extend:'可以加入多球、穿透球、特殊砖块和组合道具。',primary:'重新开局',metric:'击碎砖块'},
 {id:'track',name:'轨道建造',tag:'旋转与连接',title:'拼出一条完整的轨道',description:'点击轨道方块旋转 90°，将入口连到出口，再试跑。也可以先填入一条示例路线。',principle:'网格端口连通判断、路径遍历和曲线插值。',extend:'可以增加轨道零件、立体坡道和玩家关卡分享。',primary:'试跑轨道',metric:'经过轨道'},
 {id:'chain',name:'连锁机关',tag:'触发与时序',title:'一次发射，依次打开三道门',description:'球经过开关后，门会延迟打开。调整开门延迟，让球在撞门前通过。',principle:'碰撞触发事件，定时改变机关状态，并判断通行条件。',extend:'可以扩展传送带、逻辑门和多步骤机关谜题。',primary:'释放小球',metric:'触发开关'},
 {id:'sorting',name:'颜色分类',tag:'观察与分流',title:'把 12 颗球送回各自的盒子',description:'在小球经过分流器前选择左、中、右路线。球的文字标记与盒子相同即为正确。',principle:'区域触发、分流状态锁定、路径引导和分类判定。',extend:'可以增加双分流器、特殊球和不断加快的挑战。',primary:'开始新一轮',metric:'正确分类'},
 {id:'rhythm',name:'节奏击球',tag:'节拍与时机',title:'在小球落到光圈时击打',description:'按 F / J 或左右击打按钮。接近中心时得分更高，连续命中可以累积连击。',principle:'节拍时间轴与输入时间窗口判定。声音为可选的合成节拍。',extend:'可以制作原创谱面、加入长按音符和延迟校准。',primary:'重新开始',metric:'得分'},
 {id:'race',name:'弹珠竞速',tag:'路线与能量',title:'选择路线，争取第一个冲线',description:'选择近道或外环，按住加速消耗能量，松开后恢复。近道的黄色路段会减速。',principle:'按路径长度推进运动，结合速度、能量和路段规则。',extend:'可以加入弯道风险、个人纪录和幽灵回放。',primary:'重新比赛',metric:'当前名次'}
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
export function puzzleRails(g){const angle=g.angle*Math.PI/180;return [[310-170*Math.cos(angle),245-170*Math.sin(angle),310+170*Math.cos(angle),245+170*Math.sin(angle)],[435,348,755,463]];}
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
export function createGame(id,demo=true){
 if(!MODES.some(m=>m.id===id))throw new Error('Unknown game');
 const g={id,demo,time:0,status:'playing',message:'',particles:[],score:0,total:0};
 if(id==='puzzle')Object.assign(g,{angle:22,attempts:0,b:null,status:'ready',message:'调好斜板，再投下一球。'});
 if(id==='maze')Object.assign(g,{b:ball(100,100),waypoint:0,strength:1});
 if(id==='breakout')Object.assign(g,{b:ball(450,430,180,-260,9),paddle:450,lives:3,bricks:Array.from({length:28},(_,i)=>({x:73+i%7*108,y:80+Math.floor(i/7)*36,w:98,h:25,alive:true,row:Math.floor(i/7)}))});
 if(id==='track'){const tiles=tileSolution().map((t,i)=>({...t,rotation:(t.rotation+(i%3)+1)%4}));Object.assign(g,{tiles,status:'ready',tile:0,entry:3,travel:0,visited:[],autoIndex:0,message:'点击轨道旋转，连通左侧入口和右下出口。'});}
 if(id==='chain')Object.assign(g,{delay:.2,b:null,status:'ready',switches:[270,510,730].map((x,i)=>({x,gate:[350,590,810][i],triggered:false,open:false,at:0})),message:'延迟太长时，小球会先撞上门。'});
 if(id==='sorting')Object.assign(g,{balls:[],selected:1,spawned:0,resolved:0,nextSpawn:.6,total:12});
 if(id==='rhythm')Object.assign(g,{notes:Array.from({length:16},(_,i)=>({at:1.8+i*.625,lane:i%4===0||i%4===3?0:1,state:'pending'})),combo:0,bestCombo:0,resolved:0,lastHit:'等待第一个节拍',flash:[0,0],beat:-1});
 if(id==='race')Object.assign(g,{route:'short',energy:100,progress:0,speed:0,rivals:[{s:0,speed:157},{s:0,speed:147}],rank:1,boost:false});
 return g;
}
export function action(g,name,value){
 if(name==='angle'&&g.id==='puzzle')g.angle=clamp(Number(value),5,42);
 if(name==='strength'&&g.id==='maze')g.strength=clamp(Number(value),.5,1.8);
 if(name==='delay'&&g.id==='chain')g.delay=clamp(Number(value),.05,1.2);
 if(name==='select'&&g.id==='sorting')g.selected=clamp(Math.round(value),0,2);
 if(name==='route'&&g.id==='race'&&g.progress===0)g.route=value==='outer'?'outer':'short';
 if(name==='rotate'&&g.id==='track'&&g.status!=='playing'&&Number.isInteger(value)&&value>=0&&value<15){g.selectedTile=value;g.tiles[value].rotation=(g.tiles[value].rotation+1)%4;g.status='ready';g.message='轨道已旋转，可以再次试跑。';}
 if(name==='solve'&&g.id==='track'){g.tiles=tileSolution();g.status='ready';g.message='示例路线已填入，点击“试跑轨道”。';}
 if(name==='hit'&&g.id==='rhythm'&&g.status==='playing'){
  const lane=Number(value);if(lane!==0&&lane!==1)return;
  const note=g.notes.filter(n=>n.lane===lane&&n.state==='pending').sort((a,b)=>Math.abs(a.at-g.time)-Math.abs(b.at-g.time))[0];g.flash[lane]=.18;
  if(note&&Math.abs(note.at-g.time)<=.15){const perfect=Math.abs(note.at-g.time)<=.065;note.state='hit';g.score+=perfect?100:70;g.combo++;g.bestCombo=Math.max(g.bestCombo,g.combo);g.resolved++;g.lastHit=perfect?'精准 +100':'命中 +70';particle(g,350+lane*200,426,lane?'#ec99ac':'#8be1df');}else{g.lastHit='还没到光圈，再等一下';}
 }
 if(name==='launch'){
  if(g.id==='puzzle'){g.b=ball(208,75,15,0);g.attempts++;g.startedAt=g.time;g.status='playing';g.message='观察落点，也可以在下一次尝试前调节角度。';}
  if(g.id==='chain'){g.b=ball(95,300,195,0);g.switches.forEach(s=>Object.assign(s,{triggered:false,open:false,at:0}));g.status='playing';g.score=0;g.message='开关触发后，门开始倒计时。';}
  if(g.id==='track'){g.status='playing';g.tile=0;g.entry=3;g.travel=0;g.visited=[];g.score=0;g.message='检查入口、弯道和出口是否连通。';}
 }
}
export function stepGame(g,dt,input={}){
 g.particles=g.particles.filter(p=>{p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=90*dt;return p.life>0;});
 if(g.status==='won'||g.status==='lost')return;
 g.time+=dt;
 if(g.demo&&g.status==='ready'){
  if(g.id==='track'){if(g.autoIndex<15&&g.time>g.autoIndex*.13+.3){g.tiles[g.autoIndex]={...tileSolution()[g.autoIndex]};g.autoIndex++;}if(g.autoIndex===15&&g.time>2.5)action(g,'launch');}
  else if(g.time>.8)action(g,'launch');
 }
 if(g.status!=='playing')return;
 if(g.id==='puzzle'){
  const b=g.b;b.vy+=600*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;for(const p of puzzleRails(g))segmentHit(b,p,.12);b.vx*=Math.exp(-.05*dt);
  if(b.x>740&&b.x<850&&b.y>483&&b.y<540){particle(g,b.x,b.y);end(g,true,'成功入杯！你完成了一次“摆放 → 模拟 → 验证”。');}
  else if(b.y>570||b.x>910||b.x<0||g.time-g.startedAt>30)end(g,false,'没有接住。调整斜板角度，再投一球。');
 }
 if(g.id==='maze'){
  const b=g.b;let ax=input.x||0,ay=input.y||0;
  if(g.demo){const target=waypoints[g.waypoint];if(dist(b,target)<23&&g.waypoint<waypoints.length-1)g.waypoint++;const t=waypoints[g.waypoint];ax=clamp((t.x-b.x)*.025-b.vx*.013,-1,1);ay=clamp((t.y-b.y)*.025-b.vy*.013,-1,1);}
  g.tilt={x:ax,y:ay};b.vx=(b.vx+ax*330*g.strength*dt)*Math.exp(-1.2*dt);b.vy=(b.vy+ay*330*g.strength*dt)*Math.exp(-1.2*dt);b.x+=b.vx*dt;b.y+=b.vy*dt;
  for(const r of mazeWalls)rectHit(b,r,.25);if(b.x<55||b.x>845){b.x=clamp(b.x,55,845);b.vx*=-.2;}if(b.y<55||b.y>505){b.y=clamp(b.y,55,505);b.vy*=-.2;}
  for(const hole of holes)if(dist(b,hole)<hole.r-3)end(g,false,'掉进黑洞了。重开后轻推方向，给小球留出刹车距离。');
  if(dist(b,{x:800,y:450})<30)end(g,true,'到达终点！用时 '+g.time.toFixed(1)+' 秒。');
 }
 if(g.id==='breakout'){
  const b=g.b;
  if(g.demo)g.paddle+=clamp(b.x+Math.sin(g.time*1.7)*32-g.paddle,-650*dt,650*dt);else if(Number.isFinite(input.pointerX))g.paddle=input.pointerX;else g.paddle+=(input.x||0)*500*dt;
  g.paddle=clamp(g.paddle,107,793);b.x+=b.vx*dt;b.y+=b.vy*dt;
  if(b.x<49||b.x>851){b.x=clamp(b.x,49,851);b.vx*=-1;}if(b.y<49){b.y=49;b.vy=Math.abs(b.vy);}
  if(b.vy>0&&b.y>=475&&b.y<=501&&Math.abs(b.x-g.paddle)<74){const offset=clamp((b.x-g.paddle)/65,-1,1);b.y=474;b.vx=offset*275;b.vy=-Math.sqrt(350**2-b.vx**2);}
  for(const brick of g.bricks)if(brick.alive&&rectHit(b,brick,1)){brick.alive=false;g.score++;particle(g,b.x,b.y,['#d8ee80','#8be1df','#d4b4ee','#ec99ac'][brick.row]);break;}
  if(g.score===28)end(g,true,'28 块砖已清空！接球位置决定反弹方向。');
  if(b.y>580){g.lives--;if(g.lives<=0)end(g,false,'三次机会已用完。让挡板提前移动到落点下方。');else g.b=ball(g.paddle,430,140,-280,9);}
 }
 if(g.id==='track'){
  const tile=g.tiles[g.tile],ps=ports(tile);if(!ps.includes(g.entry)){end(g,false,'第 '+(g.tile+1)+' 块轨道入口不通。旋转它，再试跑。');return;}
  const exit=ps.find(p=>p!==g.entry);g.exit=exit;g.travel+=dt*1.9;
  if(g.travel>=1){g.travel-=1;g.visited.push(g.tile);g.score=g.visited.length;const col=g.tile%5,row=Math.floor(g.tile/5),nc=col+[0,1,0,-1][exit],nr=row+[-1,0,1,0][exit];if(g.tile===14&&exit===1){end(g,true,'轨道贯通！小球完整经过 15 块轨道。');return;}if(nc<0||nc>=5||nr<0||nr>=3||g.visited.includes(nr*5+nc)){end(g,false,'轨道通向了边界或回路。检查发光位置的下一块。');return;}g.tile=nr*5+nc;g.entry=(exit+2)%4;}
 }
 if(g.id==='chain'){
  const b=g.b;b.x+=b.vx*dt;for(const s of g.switches){if(!s.triggered&&b.x>=s.x){s.triggered=true;s.at=g.time+g.delay;g.score++;particle(g,s.x,300,'#8be1df');}if(s.triggered&&g.time>=s.at)s.open=true;if(!s.open&&b.x+b.r>=s.gate&&b.x<s.gate+15){b.x=s.gate-b.r;b.vx=-80;end(g,false,'门还没打开。缩短延迟，再测试一次。');return;}}
  if(b.x>850)end(g,true,'三道门全部通过！开关与门的时序配合成功。');
 }
 if(g.id==='sorting'){
  if(g.spawned<12&&g.time>=g.nextSpawn){g.balls.push({x:450,y:60,color:[0,2,1,2,0,1,1,0,2,0,1,2][g.spawned],route:null});g.spawned++;g.nextSpawn+=1.55;}
  for(const b of g.balls){b.y+=150*dt;if(g.demo&&b.route===null&&b.y>190)g.selected=b.color;if(b.route===null&&b.y>=263)b.route=g.selected;if(b.route!==null){const t=clamp((b.y-263)/210,0,1);b.x=450+([210,450,690][b.route]-450)*(t*t*(3-2*t));}if(b.y>=475){b.done=true;g.resolved++;if(b.color===b.route){g.score++;particle(g,b.x,b.y,['#8be1df','#d8ee80','#ec99ac'][b.color]);g.message='正确！'+['青 · A','黄 · B','粉 · C'][b.color]+' 回到了对应的盒子。';}else g.message='分错了。选择会在球经过分流器时锁定。';}}
  g.balls=g.balls.filter(b=>!b.done);if(g.resolved===12)end(g,g.score>=10,'本轮正确 '+g.score+' / 12。'+(g.score>=10?'分类挑战完成！':'至少正确 10 球即可通过。'));
 }
 if(g.id==='rhythm'){
  g.flash=g.flash.map(v=>Math.max(0,v-dt));for(const n of g.notes){if(g.demo&&n.state==='pending'&&g.time>=n.at)action(g,'hit',n.lane);if(n.state==='pending'&&g.time>n.at+.15){n.state='miss';g.resolved++;g.combo=0;g.lastHit='错过了，跟上下一拍';}}
  if(g.resolved===16)end(g,g.score>=1000,'完成 16 拍 · '+g.score+' 分 · 最长连击 '+g.bestCombo+'。');
 }
 if(g.id==='race'){
  const path=racePaths[g.route],fraction=g.progress/path.length,rough=g.route==='short'&&fraction>.24&&fraction<.45;
  g.boost=g.demo?g.energy>25:!!input.boost;const boosting=g.boost&&g.energy>0;g.energy=clamp(g.energy+(boosting?-30:20)*dt,0,100);const target=(rough?100:145)+(boosting?125:0);g.speed+=(target-g.speed)*Math.min(1,dt*3);g.progress+=g.speed*dt;
  g.rivals.forEach(r=>{r.s+=r.speed*dt;});g.rank=1+g.rivals.filter(r=>r.s/racePaths.outer.length>g.progress/path.length).length;
  if(g.progress>=path.length){g.progress=path.length;g.rank=1+g.rivals.filter(r=>r.s>=racePaths.outer.length).length;end(g,g.rank===1,'第 '+g.rank+' 名冲线 · '+g.time.toFixed(2)+' 秒。'+(g.rank===1?'路线与能量配合成功！':'试试在减速路段使用加速。'));}
 }
}
export function metric(g){switch(g.id){case'puzzle':return String(g.attempts);case'maze':return g.time.toFixed(1)+' s';case'breakout':return g.score+' / 28';case'track':return g.score+' / 15';case'chain':return g.score+' / 3';case'sorting':return g.score+' / '+g.resolved;case'rhythm':return String(g.score);case'race':return '#'+g.rank;}}
