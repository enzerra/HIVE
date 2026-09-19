// Read pixels to measure sprite rectangles; source images are never rewritten.
import sharp from 'sharp';
import {fileURLToPath} from 'node:url';
import {readdir, writeFile} from 'node:fs/promises';
const root=new URL('./',import.meta.url);
const report={};
for(const file of (await readdir(new URL('layers/',root))).filter(f=>f.endsWith('.png'))){
 const {data,info}=await sharp(fileURLToPath(new URL(`layers/${file}`,root))).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const {width,height,channels}=info;
 const alpha=(x,y)=>data[(y*width+x)*channels+3];
 function bounds(x0,y0,x1,y1){
  let l=x1,t=y1,r=-1,b=-1,transparent=0;
  for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const a=alpha(x,y);if(a===0)transparent++;if(a>128){l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x);b=Math.max(b,y);}}
  return {x:l,y:t,width:r-l+1,height:b-t+1,transparent};
 }
 const all=bounds(0,0,width,height),frames=[];
 if(file.includes('-sheet'))for(let row=0;row<3;row++)for(let column=0;column<4;column++){
  const b=bounds(Math.floor(column*width/4),Math.floor(row*height/3),Math.floor((column+1)*width/4),Math.floor((row+1)*height/3));
  const {transparent,...rect}=b;
  frames.push({row,column,...rect,anchorX:rect.x+rect.width/2,anchorY:rect.y+rect.height});
 }
 const {transparent,...rect}=all;
 report[file.slice(0,-4)]={file:`layers/${file}`,width,height,cornerAlpha:alpha(0,0),transparentFraction:Math.round(transparent/(width*height)*10000)/10000,bounds:rect,frames};
}
await writeFile(new URL('assets.json',root),JSON.stringify(report,null,2)+'\n');
console.table(Object.entries(report).map(([id,a])=>({id,width:a.width,height:a.height,transparent:a.transparentFraction,frames:a.frames.length})));

