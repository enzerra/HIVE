import {floors,props,locations} from './scene.mjs';
export function inside({x,y},poly){let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){
 const [ax,ay]=poly[i],[bx,by]=poly[j];if((ay>y)!==(by>y)&&x<(bx-ax)*(y-ay)/(by-ay)+ax)yes=!yes;
}return yes;}
const solids=props.flatMap(p=>p.solids);
function onFloor(p){return floors.some(poly=>inside(p,poly));}
export function canStand(p){
 if(!Number.isFinite(p.x)||!Number.isFinite(p.y))return false;
 const r=10;
 if(!onFloor(p))return false;
 for(let i=0;i<8;i++){const a=i*Math.PI/4;if(!onFloor({x:p.x+Math.cos(a)*r,y:p.y+Math.sin(a)*r}))return false;}
 return !solids.some(([l,t,r,b])=>p.x>l-10&&p.x<r+10&&p.y>t-10&&p.y<b+10);
}
export function move(p,d,dt){
 const length=Math.hypot(d.x,d.y);
 if(!length||!Number.isFinite(length)||!Number.isFinite(dt))return p;
 const step=170*Math.max(0,Math.min(dt,.04))/length;
 const n={x:p.x+d.x*step,y:p.y+d.y*step};
 if(canStand(n))return n;
 const nx={x:n.x,y:p.y},ny={x:p.x,y:n.y};return canStand(nx)?nx:canStand(ny)?ny:p;
}
export function nearby(p){return locations.find(l=>Math.hypot(l.x-p.x,l.y-p.y)<l.radius)??null;}
