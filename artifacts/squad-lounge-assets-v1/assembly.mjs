import{floor,obstacles,spawn,route,move}from'./assembly-geometry.mjs';
const ns='http://www.w3.org/2000/svg',scene=document.querySelector('#scene'),objects=document.querySelector('#objects'),status=document.querySelector('#status');
function node(tag,attrs){const el=document.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);return el;}
const assets=[{id:'main-sofa',src:'sofa-curved.png',x:420,y:155,w:360,h:240,depth:355},{id:'relax-sofa',src:'sofa-curved.png',x:165,y:292,w:255,h:170,depth:435},{id:'coffee-table',src:'coffee-table-v2.png',x:520,y:338,w:165,h:138,depth:448}];
const layers=assets.map(a=>({depth:a.depth,el:node('image',{href:a.src,x:a.x,y:a.y,width:a.w,height:a.h})}));
// Display-only affine correction levels the original doorway's diagonal lintel.
// Source pixels remain unchanged; a native matching camera is still preferable.
const door=node('g',{transform:'translate(452 420)'});door.append(node('image',{href:'doorway-open-v2.png',width:300,height:312,transform:'translate(0 40) skewY(-16)'}));layers.push({depth:676,el:door});
const player=node('g',{'aria-label':'Karakter inspeksi'});player.append(node('ellipse',{cx:0,cy:0,rx:13,ry:5,fill:'#10152699'}));player.append(node('image',{href:'../../public/world-assets/v1/wolf-idle.webp',x:-34,y:-63,width:68,height:68}));
let p={...spawn},keys=new Set(),last=0,automatic=false,waypoint=1,paused=false;
const overlay=document.querySelector('#overlay');overlay.append(node('polygon',{points:floor.map(p=>`${p.x},${p.y}`).join(' '),class:'floor'}));for(const o of obstacles)overlay.append(node('polygon',{points:o.points.map(p=>`${p.x},${p.y}`).join(' ')}));overlay.append(node('polyline',{points:route.map(p=>`${p.x},${p.y}`).join(' '),class:'route'}));
function render(){player.setAttribute('transform',`translate(${p.x} ${p.y})`);for(const l of [...layers,{depth:p.y,el:player}].sort((a,b)=>a.depth-b.depth))objects.append(l.el);}
function stop(){keys.clear();paused=true;document.querySelector('#pause').setAttribute('aria-pressed','true');status.textContent='Gerakan dijeda. Tekan Lanjutkan gerakan untuk melanjutkan.';document.querySelector('#pause').textContent='Lanjutkan gerakan';}
scene.addEventListener('pointerdown',()=>scene.focus());scene.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;if(['w','a','s','d','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();keys.add(e.key);resume();automatic=false;document.querySelector("#walk").setAttribute("aria-pressed","false");}});window.addEventListener('keyup',e=>keys.delete(e.key));scene.addEventListener('blur',()=>keys.clear());window.addEventListener('blur',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
function tick(t){const dt=last?(t-last)/1000:0;last=t;let d={x:0,y:0};if(!document.hidden&&!paused){if(automatic){const target=route[waypoint];d={x:target.x-p.x,y:target.y-p.y};if(Math.hypot(d.x,d.y)<5){waypoint++;if(waypoint===route.length){automatic=false;document.querySelector('#walk').setAttribute('aria-pressed','false');status.textContent='Jalur selesai: entrance → sisi lounge → depan sofa → kembali.';}d={x:0,y:0};}}else{d.x=Number(keys.has('d')||keys.has('ArrowRight'))-Number(keys.has('a')||keys.has('ArrowLeft'));d.y=Number(keys.has('s')||keys.has('ArrowDown'))-Number(keys.has('w')||keys.has('ArrowUp'));}p=move(p,d,dt);}render();requestAnimationFrame(tick);}requestAnimationFrame(tick);
for(const[id,cls]of[['theme','light'],['debug','show-debug']])document.querySelector('#'+id).onclick=e=>{const on=document.body.classList.toggle(cls);e.currentTarget.setAttribute('aria-pressed',String(on));};
document.querySelector('#walk').onclick=e=>{automatic=!automatic;resume();keys.clear();p={...spawn};waypoint=1;e.currentTarget.setAttribute('aria-pressed',String(automatic));status.textContent=automatic?'Menelusuri jalur inspeksi…':'Uji jalur dihentikan.';};document.querySelector('#reset').onclick=()=>{p={...spawn};automatic=false;resume();keys.clear();document.querySelector('#walk').setAttribute('aria-pressed','false');status.textContent='Kembali ke entrance.';};
const sources=[...new Set([...assets.map(a=>a.src),'floor-tile.png','wall-module.png','doorway-open-v2.png','../../public/world-assets/v1/wolf-idle.webp'])];let failures=0;await Promise.all(sources.map(src=>new Promise(resolve=>{const image=new Image();image.onload=resolve;image.onerror=()=>{failures++;resolve();};image.src=src;})));status.textContent=failures?`${failures} aset gagal dimuat; periksa folder sumber.`:'Aset termuat. Pilih Uji jalur atau aktifkan kontrol keyboard.';if(failures)status.classList.add('error');

function resume(){paused=false;document.querySelector('#pause').setAttribute('aria-pressed','false');document.querySelector('#pause').textContent='Jeda gerakan';}
document.querySelector('#pause').onclick=()=>{if(paused){resume();status.textContent='Gerakan dilanjutkan.';}else stop();};
for(const button of document.querySelectorAll('[data-direction]')){
  button.style.touchAction='none';
  button.addEventListener('pointerdown',event=>{
    event.preventDefault();button.setPointerCapture(event.pointerId);
    automatic=false;document.querySelector('#walk').setAttribute('aria-pressed','false');
    resume();keys.add(button.dataset.direction);
  });
  for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,()=>keys.delete(button.dataset.direction));
  button.addEventListener('keydown',event=>{if(event.key===' '||event.key==='Enter'){event.preventDefault();automatic=false;resume();keys.add(button.dataset.direction);}});
  button.addEventListener('keyup',()=>keys.delete(button.dataset.direction));
  button.addEventListener('blur',()=>keys.delete(button.dataset.direction));
}
