// Display coordinates refer to the final 1672 × 941 background, not the concept.
export const size={width:1672,height:941};
export const spawn={x:835,y:840};
export const props=[
 {id:'sofa',asset:'sofa',x:82,y:361,width:300,depth:600,solids:[[88,403,369,467],[88,443,181,596]]},
 {id:'coffee-table',asset:'coffee-table',x:242,y:477,width:103,depth:580,solids:[[252,525,336,578]]},
 {id:'central-bench',asset:'central-bench',x:655,y:320,width:360,depth:621,solids:[[714,449,961,576]]},
 {id:'pulse-terminal',asset:'pulse-terminal',x:1432,y:520,width:104,depth:695,solids:[[1438,648,1530,698]]},
 {id:'plant-northwest',asset:'plant',x:449,y:193,width:67,depth:263,solids:[[467,245,499,269]]},
 {id:'plant-northeast',asset:'plant',x:1053,y:193,width:67,depth:263,solids:[[1071,245,1103,269]]},
 {id:'plant-replay',asset:'plant',x:1350,y:315,width:60,depth:378,solids:[[1368,360,1392,381]]},
 {id:'plant-lounge',asset:'plant',x:65,y:569,width:72,depth:644,solids:[[85,624,119,649]]},
 {id:'lamp-lounge',asset:'floor-lamp',x:382,y:421,width:32,depth:527,solids:[[384,514,412,532]]},
];
// Union of conservative walkable polygons; coordinates describe feet positions.
export const floors=[
 [[505,230],[1400,230],[1400,423],[1234,466],[1234,650],[1170,700],[1035,700],[1035,725],[720,725],[720,700],[505,700]],
 [[239,208],[431,208],[431,230],[525,230],[525,306],[239,306]],
 [[58,350],[441,350],[441,575],[505,575],[505,647],[58,647]],
 [[435,574],[510,574],[510,650],[435,650]],
 [[266,120],[400,120],[400,240],[266,240]],
 [[731,34],[953,34],[953,250],[731,250]],
 [[1400,378],[1620,378],[1620,412],[1400,412]],
 [[1497,282],[1614,282],[1614,410],[1497,410]],
 [[1200,551],[1340,551],[1340,609],[1200,609]],
 [[1305,541],[1570,541],[1570,709],[1305,709]],
 [[725,705],[949,705],[949,918],[725,918]],
];
export const walls=[
 {id:'sofa-partition',rect:[449,323,57,248],depth:570},
 {id:'sofa-back',rect:[52,306,397,48],depth:354},
 {id:'pulse-upper',rect:[1254,472,42,66],depth:538},
 {id:'pulse-lower',rect:[1250,622,48,99],depth:721},
 {id:'south-left',rect:[23,650,698,150],depth:800},
 {id:'south-right',rect:[952,711,289,102],depth:813},
];
export const locations=[
 {id:'entrance',label:'Entrance',x:835,y:840,radius:65,description:'Titik masuk Central Lounge.'},
 {id:'arena',label:'Arena',x:835,y:180,radius:75,description:'Gerbang ke Arena. Pada aplikasi, masuk menuju lobby atau pertandingan berdasarkan state yang sah.'},
 {id:'squad',label:'Squad Room',x:335,y:211,radius:60,description:'Ruang percakapan dan koordinasi Squad.'},
 {id:'replay',label:'Replay',x:1547,y:370,radius:60,description:'Akses ke replay dan hasil pertandingan yang sudah tersedia.'},
 {id:'pulse',label:'Pulse Corner',x:1391,y:645,radius:70,description:'Terminal Quick Call. Lampu pada aset adalah dekorasi, bukan indikator call baru atau status live.'},
 {id:'lounge',label:'Sudut diskusi',x:360,y:607,radius:65,description:'Area duduk dan berkumpul. Tidak menampilkan jumlah anggota online buatan.'},
];
export const tour=[spawn,{x:1085,y:675},{x:1185,y:581},{x:1340,y:581},{x:1391,y:645},{x:1340,y:581},{x:1185,y:581},{x:1190,y:393},{x:1547,y:393},{x:1547,y:370},{x:1190,y:393},{x:1190,y:290},{x:835,y:290},{x:835,y:180},{x:835,y:290},{x:526,y:290},{x:414,y:266},{x:335,y:266},{x:335,y:211},{x:335,y:266},{x:414,y:266},{x:526,y:290},{x:540,y:605},{x:360,y:607},{x:540,y:605},{x:590,y:679},{x:835,y:735},spawn];

