import assert from 'node:assert/strict';
import {Simulation,CAPACITY,STEP} from '../public/physics.mjs';
const low=new Simulation(),high=new Simulation();low.gravity=.2;high.gravity=2;low.spawn(205);high.spawn(205);for(let i=0;i<20;i++){low.step();high.step();}assert(high.balls[0].y>low.balls[0].y+8,'Gravity must visibly change fall distance');
function wallSpeed(bounce){const sim=new Simulation();sim.bounce=bounce;const b=sim.spawn();Object.assign(b,{x:184,y:200,vx:-100,vy:0});sim.step();assert(b.x>=188-1e-6,'Wall containment');return b.vx;}
assert(wallSpeed(.9)>wallSpeed(.2)+50,'Elasticity changes reflected velocity');
const pair=new Simulation();const a=pair.spawn(),b=pair.spawn();Object.assign(a,{x:360,y:450,vx:100});Object.assign(b,{x:373,y:450,vx:-100});pair.step();assert(a.vx<0&&b.vx>0,'Head-on pair rebounds');assert(Math.hypot(a.x-b.x,a.y-b.y)>=16-1e-8,'Pair overlap resolved');
const flip=new Simulation();flip.left=true;const hit=flip.spawn();Object.assign(hit,{x:300,y:520,vy:70});flip.step();assert(hit.vy<=-350,'Raised flipper launches contact upwards');
const capped=new Simulation();for(let i=0;i<CAPACITY+8;i++)capped.spawn(300);assert.equal(capped.balls.length,CAPACITY);assert.equal(capped.balls[0].id,8,'Oldest slot recycled');
const drain=new Simulation();drain.spawn().y=690;drain.step();assert.equal(drain.balls.length,0);assert.equal(drain.drained,1);drain.reset();assert.equal(drain.drained,0);assert.equal(drain.nextId,0);
const stress=new Simulation();stress.gravity=2;stress.bounce=.95;for(let i=0;i<80;i++)stress.spawn(205+(i*47)%350);for(let i=0;i<7200;i++){stress.left=i%240<60;stress.right=i%180<50;stress.step(STEP);for(const b of stress.balls)assert([b.x,b.y,b.vx,b.vy].every(Number.isFinite),'Simulation remains finite');}assert(stress.balls.length<=80);stress.reset();assert.equal(stress.balls.length,0);
console.log('Physics checks passed: gravity, rebound, ball contact, flipper, capacity, drain, reset and 60-second stress simulation.');
