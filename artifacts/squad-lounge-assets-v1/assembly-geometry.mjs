export const spawn = {x:600,y:650};
export const floor = [{x:165,y:220},{x:1035,y:220},{x:1110,y:680},{x:90,y:680}];
export const obstacles = [
 {id:'main-sofa',points:[{x:442,y:303},{x:470,y:290},{x:730,y:290},{x:758,y:303},{x:748,y:355},{x:452,y:355}]},
 {id:'coffee-table',points:[{x:544,y:413},{x:576,y:402},{x:635,y:403},{x:660,y:417},{x:650,y:448},{x:550,y:448}]},
 {id:'relax-sofa',points:[{x:200,y:390},{x:380,y:390},{x:385,y:435},{x:195,y:435}]},
 {id:'door-left',points:[{x:510,y:620},{x:548,y:620},{x:548,y:682},{x:510,y:682}]},
 {id:'door-right',points:[{x:650,y:620},{x:690,y:620},{x:690,y:682},{x:650,y:682}]},
];
export function inside(p,poly){let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)yes=!yes;}return yes;}
function edgeDistance(p,a,b){const dx=b.x-a.x,dy=b.y-a.y;const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy)));return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);}
export function canStand(p){if(!Number.isFinite(p.x)||!Number.isFinite(p.y)||!inside(p,floor))return false;for(let i=0;i<floor.length;i++)if(edgeDistance(p,floor[i],floor[(i+1)%floor.length])<12)return false;return !obstacles.some(o=>inside(p,o.points)||o.points.some((a,i)=>edgeDistance(p,a,o.points[(i+1)%o.points.length])<12));}
export function move(p,d,dt){const l=Math.hypot(d.x,d.y);if(!l)return p;const s=150*Math.min(.04,Math.max(0,dt))/l;const n={x:p.x+d.x*s,y:p.y+d.y*s};if(canStand(n))return n;const x={x:n.x,y:p.y},y={x:p.x,y:n.y};return canStand(x)?x:canStand(y)?y:p;}
export const route=[spawn,{x:780,y:590},{x:820,y:400},{x:820,y:260},{x:410,y:260},{x:410,y:485},{x:600,y:530},spawn];
