// Original educational simulation; independent of upstream Rapier implementation.
export const WIDTH = 760, HEIGHT = 660, CAPACITY = 80, STEP = 1 / 120;
export const pins = Array.from({length:7},(_,row)=>Array.from({length:row%2?6:7},(_,col)=>({x:230+col*50+(row%2?25:0),y:130+row*35,r:6}))).flat();
const rails = [[175,62,175,560],[585,62,585,560],[175,62,585,62],[180,405,248,515],[580,405,512,515],[175,560,255,610],[585,560,505,610]];
export class Simulation {
  constructor(){this.gravity=1;this.bounce=.55;this.left=false;this.right=false;this.reset();}
  reset(){this.balls=[];this.drained=0;this.nextId=0;this.left=false;this.right=false;}
  spawn(x=380){
    if(this.balls.length>=CAPACITY)this.balls.shift();
    const ball={id:this.nextId++,x:Math.max(205,Math.min(555,x)),y:88,vx:0,vy:0,r:8,angle:0};
    this.balls.push(ball);return ball;
  }
  segments(){return [...rails.map(p=>({p})),{p:[260,550,340,this.left?510:578],active:this.left},{p:[500,550,420,this.right?510:578],active:this.right}];}
  contact(ball,x,y,r,active=false){
    let dx=ball.x-x,dy=ball.y-y,d=Math.hypot(dx,dy),reach=ball.r+r;
    if(d>=reach)return;
    if(d<1e-8){dx=0;dy=-1;d=1;}
    const nx=dx/d,ny=dy/d;
    ball.x=x+nx*reach;ball.y=y+ny*reach;
    const dot=ball.vx*nx+ball.vy*ny;
    if(dot<0){ball.vx-=(1+this.bounce)*dot*nx;ball.vy-=(1+this.bounce)*dot*ny;}
    if(active&&ny<.6){ball.vy=Math.min(ball.vy,-350);ball.vx+=(380-ball.x)*.8;}
  }
  step(dt=STEP){
    const segments=this.segments();
    for(const b of this.balls){
      b.vy+=550*this.gravity*dt;b.vx*=Math.exp(-.12*dt);b.vy=Math.min(b.vy,850);
      b.x+=b.vx*dt;b.y+=b.vy*dt;b.angle+=b.vx*dt/b.r;
      for(const p of pins)this.contact(b,p.x,p.y,p.r);
      for(const {p:[x1,y1,x2,y2],active} of segments){const dx=x2-x1,dy=y2-y1,t=Math.max(0,Math.min(1,((b.x-x1)*dx+(b.y-y1)*dy)/(dx*dx+dy*dy)));this.contact(b,x1+t*dx,y1+t*dy,5,active);}
    }
    for(let i=0;i<this.balls.length;i++)for(let j=i+1;j<this.balls.length;j++){
      const a=this.balls[i],b=this.balls[j];let dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),reach=a.r+b.r;
      if(d>=reach)continue;
      if(d<1e-8){dx=1;dy=0;d=1;}
      const nx=dx/d,ny=dy/d,overlap=(reach-d)/2;
      a.x-=nx*overlap;a.y-=ny*overlap;b.x+=nx*overlap;b.y+=ny*overlap;
      const relative=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;
      if(relative<0){const impulse=-(1+this.bounce)*relative/2;a.vx-=impulse*nx;a.vy-=impulse*ny;b.vx+=impulse*nx;b.vy+=impulse*ny;}
    }
    this.balls=this.balls.filter(b=>{const keep=b.y<HEIGHT+20&&b.x>-30&&b.x<WIDTH+30;if(!keep)this.drained++;return keep;});
  }
}
