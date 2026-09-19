import test from 'node:test';
import assert from 'node:assert/strict';
import {canStand, move, route, spawn, obstacles} from './assembly-geometry.mjs';

test('inspection route returns safely through all waypoints', () => {
  let position = {...spawn};
  assert.ok(canStand(position));
  for (const target of route.slice(1)) {
    let steps = 0;
    while (Math.hypot(target.x-position.x,target.y-position.y)>5 && steps++<2000) {
      position=move(position,{x:target.x-position.x,y:target.y-position.y},1/60);
      assert.ok(canStand(position));
    }
    assert.ok(steps<2000,'route must not stall');
  }
});
test('solid furniture and outside floor reject movement',()=>{
  for(const obstacle of obstacles){
    const center=obstacle.points.reduce((p,v)=>({x:p.x+v.x/obstacle.points.length,y:p.y+v.y/obstacle.points.length}),{x:0,y:0});
    assert.equal(canStand(center),false,obstacle.id);
  }
  assert.equal(canStand({x:0,y:0}),false);
  let p={...spawn};
  for(let i=0;i<1000;i++)p=move(p,{x:0,y:1},1/60);
  assert.ok(canStand(p));
  assert.ok(p.y<=668);
});
test('diagonal speed and delayed frames remain bounded',()=>{
  const p={x:820,y:500};
  for(const direction of [{x:1,y:0},{x:1,y:1}]){
    const next=move(p,direction,10);
    assert.ok(Math.hypot(next.x-p.x,next.y-p.y)<=6.00001);
  }
});
