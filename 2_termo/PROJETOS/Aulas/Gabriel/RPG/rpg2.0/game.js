const T=THREE,$=s=>document.querySelector(s),R=Math.random,rn=(a,b)=>a+R()*(b-a),ri=n=>Math.floor(R()*n);

/* ===== DADOS ===== */
const ZN=[{n:'Vila de Aethra',r:14,c:'#7bc96f',sky:'#9ad0ff'},{n:'Planície Verde',r:55,c:'#6dbb5a',sky:'#8cc7f0'},{n:'Floresta Sombria',r:95,c:'#2f7d46',sky:'#4d6b70'},
 {n:'Deserto Dourado',r:135,c:'#e0c26a',sky:'#e8c88a'},{n:'Tundra Gélida',r:170,c:'#dbeaf5',sky:'#cfe3f2'},{n:'Vulcão Infernal',r:210,c:'#4a2a2a',sky:'#3a1a1a'}];
const zoneOf=d=>{for(let i=0;i<6;i++)if(d<ZN[i].r)return i;return 5};
const WN={w:['Espada Enferrujada','Espada de Ferro','Lâmina de Aço','Espada Rúnica','Lâmina Flamejante','Excalibur'],
 a:['Arco Curto','Arco Longo','Arco Composto','Arco Élfico','Arco Solar','Arco do Dragão'],
 m:['Graveto','Cajado de Carvalho','Cajado Arcano','Cajado de Cristal','Cajado Astral','Cajado Supremo']};
const AN=['Túnica de Pano','Couro Batido','Cota de Malha','Armadura de Placas','Manto Rúnico','Armadura Dracônica'];
const WV=[4,12,26,48,85,150],AV=[1,4,9,17,30,50],PR=[0,100,350,900,2200,5500];
const WC=['#9a9a9a','#cfd6dd','#6fd3ff','#9b5de5','#ff7a1a','#ffd23f'],AC=['#8b7355','#7a5230','#8e9aa6','#c8d0d8','#6a4fe0','#c0152a'];
const CL={w:{n:'Guerreiro',c:'#c0392b',rg:2.3,hp:40,cd:.8,i:'🗡️'},a:{n:'Arqueiro',c:'#2e9b4e',rg:9,hp:15,cd:1,i:'🏹'},m:{n:'Mago',c:'#6a4fe0',rg:8,hp:0,cd:1,i:'🪄'}};
const POT={h1:['Poção de Vida P','❤️',80,0,20],h2:['Poção de Vida M','💖',250,0,60],h3:['Poção de Vida G','💗',700,0,150],
 m1:['Poção de Mana P','🔹',0,40,25],m2:['Poção de Mana M','💧',0,120,70],m3:['Poção de Mana G','🌊',0,350,160]};
const SKL=[{n:'Golpe Poderoso',i:'💥',lv:1,mp:8,cd:3},{n:'Onda Giratória',i:'🌀',lv:5,mp:16,cd:6},{n:'Cura Divina',i:'💚',lv:10,mp:24,cd:10}],SC=[0,0,0];
/* monstros por zona (1..5): s=forma, c=cor, d=cor secundária, a=olhos, k=escala, B=boss */
const MS=[
 [{n:'Slime',s:'blob',c:'#5fd068',d:'#c9ffd0',hp:30,at:5,xp:10,g:[2,6]},{n:'Lobo Cinzento',s:'beast',c:'#8a8a94',d:'#c9c9d4',a:'#ffd23f',hp:55,at:8,xp:16,g:[4,9]},{n:'Rei Slime',s:'blob',c:'#3fa0ff',d:'#bfe3ff',k:2.6,cr:1,hp:600,at:18,xp:250,g:[150,250],B:1}],
 [{n:'Cogumelo Bravo',s:'blob',c:'#c0392b',d:'#ffffff',hp:110,at:15,xp:40,g:[8,16]},{n:'Goblin',s:'human',c:'#5a8f3a',sk:'#7fbf4f',d:'#6b4a2b',a:'#ff3030',h:'#d9d2a0',hp:150,at:20,xp:55,g:[10,20]},{n:'Ent Ancião',s:'human',c:'#5b3a1e',sk:'#6e4a28',d:'#3f2a14',a:'#7dff6a',k:2.6,hp:1400,at:34,xp:600,g:[400,600],B:1}],
 [{n:'Escorpião',s:'bug',c:'#c9822b',d:'#e8a64a',a:'#111',hp:260,at:30,xp:100,g:[20,40]},{n:'Múmia',s:'human',c:'#d8cfae',sk:'#cfc39a',d:'#c4b88a',a:'#35e0ff',hp:340,at:38,xp:140,g:[28,52]},{n:'Faraó Imortal',s:'human',c:'#e8c547',sk:'#b99a2e',d:'#2a6fd6',a:'#ff3030',h:'#ffd23f',k:2.6,hp:3200,at:60,xp:1500,g:[900,1300],B:1}],
 [{n:'Lobo Gélido',s:'beast',c:'#cfe8ff',d:'#ffffff',a:'#35a8ff',hp:480,at:48,xp:220,g:[40,80]},{n:'Golem de Gelo',s:'human',c:'#8fd3ff',sk:'#b8e6ff',d:'#6fb8e8',a:'#fff',k:1.5,hp:650,at:60,xp:300,g:[60,110]},{n:'Rainha Gélida',s:'human',c:'#b0e0ff',sk:'#e8f6ff',d:'#6fa8ff',a:'#35a8ff',h:'#e8f6ff',k:2.6,hp:6500,at:90,xp:3200,g:[1800,2600],B:1}],
 [{n:'Salamandra',s:'bug',c:'#ff5a1f',d:'#ffb020',a:'#ffff30',hp:900,at:75,xp:480,g:[80,150]},{n:'Demônio',s:'human',c:'#a01028',sk:'#d12038',d:'#5a0a18',a:'#ffd23f',h:'#2a0a10',hp:1200,at:95,xp:650,g:[110,200]},{n:'Dragão Rubro',s:'beast',c:'#7a0f1a',d:'#ff5a1f',a:'#ffd23f',k:3.2,hp:15000,at:150,xp:9000,g:[4000,6000],B:1}]
];
const RG=(c)=>CL[c].rg;

/* ===== ESTADO ===== */
const NEW=c=>({cls:c,lv:1,xp:0,gold:100,hp:125,mp:40,inv:{h1:5,m1:3},w:0,a:0,x:0,z:4});
let P=null;try{P=JSON.parse(localStorage.getItem('aethra3d'))}catch(e){}
const mh=()=>100+P.lv*25+CL[P.cls].hp*P.lv/2|0,mm=()=>30+P.lv*10+(P.cls==='m'?P.lv*10:0),atk=()=>8+P.lv*3+WV[P.w],def=()=>P.lv+AV[P.a],need=()=>P.lv*P.lv*25+P.lv*50;
let TG=null,MV=null,CD=0,DT=0,ZD=1,inv=P&&P.inv;const MON=[],PRJ=[],FX=[];

/* ===== CENA ===== */
const ren=new T.WebGLRenderer({antialias:true});ren.setSize(innerWidth,innerHeight);ren.setPixelRatio(Math.min(devicePixelRatio,2));ren.shadowMap.enabled=true;$('#game').appendChild(ren.domElement);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(45,innerWidth/innerHeight,.1,400);
sc.background=new T.Color('#9ad0ff');sc.fog=new T.Fog('#9ad0ff',55,150);
sc.add(new T.HemisphereLight(0xffffff,0x556677,.85));
const sun=new T.DirectionalLight(0xfff2d0,.9);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
const sh=sun.shadow.camera;sh.left=sh.bottom=-35;sh.right=sh.top=35;sh.far=140;sc.add(sun,sun.target);
addEventListener('resize',()=>{ren.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()});

const M=(c,e)=>new T.MeshStandardMaterial({color:c,flatShading:true,roughness:.9,emissive:e||0});
const BX=(w,h,d)=>new T.BoxGeometry(w,h,d),SP=r=>new T.SphereGeometry(r,10,8),CN=(r,h)=>new T.ConeGeometry(r,h,6);
function part(g,geo,c,x,y,z,o={}){const m=new T.Mesh(geo,M(c,o.e));m.position.set(x,y,z);if(o.s)m.scale.set(...o.s);m.castShadow=true;g.add(m);return m}
const eyes=(g,y,z,sp,c)=>[-1,1].forEach(s=>{part(g,SP(.09),'#fff',s*sp,y,z);part(g,SP(.05),c,s*sp,y,z+.07)});
function limb(g,x,y,z,geo,c,len){const p=new T.Group();p.position.set(x,y,z);g.add(p);part(p,geo,c,0,-len/2,0);return p}

/* ===== MODELOS DE MONSTROS (procedurais, estilo próprio) ===== */
function mk(sp){const g=new T.Group(),c=sp.c,a=sp.a||'#222',L=[];let h=1.5;
 if(sp.s==='blob'){part(g,SP(.7),c,0,.55,0,{s:[1,.8,1]});part(g,SP(.5),c,0,.4,0,{s:[1.5,.5,1.5]});eyes(g,.8,.55,.25,'#222');part(g,BX(.3,.06,.05),'#222',0,.55,.7);
  [[.3,1,.2],[-.35,.95,-.1],[0,1.05,-.3],[.1,.6,.68]].forEach(p=>part(g,SP(.12),sp.d,...p));h=1.4}
 else if(sp.s==='beast'){part(g,BX(.7,.6,1.3),c,0,.85,0);part(g,BX(.6,.55,.55),c,0,1.1,.85);part(g,BX(.3,.25,.3),sp.d,0,1,1.2);
  [-.2,.2].forEach(x=>part(g,CN(.12,.3),c,x,1.5,.8));eyes(g,1.2,1.1,.17,a);part(g,BX(.15,.15,.6),sp.d,0,1,-.9);part(g,BX(.5,.15,.5),sp.d,0,1.2,.1);
  [[-.25,.55],[.25,.55],[-.25,-.55],[.25,-.55]].forEach(p=>L.push(limb(g,p[0],.6,p[1],BX(.2,.6,.2),sp.d,.6)));h=1.7}
 else if(sp.s==='human'){part(g,BX(.75,.9,.45),c,0,1.35,0);part(g,BX(.55,.55,.55),sp.sk||c,0,2.05,0);eyes(g,2.1,.28,.14,a);part(g,BX(.8,.12,.5),sp.d,0,.95,0);
  [-.5,.5].forEach(x=>L.push(limb(g,x,1.7,0,BX(.22,.8,.22),sp.sk||c,.8)));[-.2,.2].forEach(x=>L.push(limb(g,x,.9,0,BX(.28,.9,.3),sp.d,.9)));
  if(sp.h)[-.2,.2].forEach(x=>part(g,CN(.1,.4),sp.h,x,2.5,0));h=2.5}
 else{part(g,SP(.6),c,0,.6,0,{s:[1,.6,1.4]});part(g,SP(.35),c,0,.7,.8);eyes(g,.85,1.05,.15,a);
  [-1,1].forEach(s=>{part(g,BX(.25,.2,.7),sp.d,s*.6,.6,1);[0,1,2].forEach(i=>L.push(limb(g,s*.5,.45,-.3+i*.4,BX(.08,.5,.08),'#222',.5)))});
  [0,1,2].forEach(i=>part(g,SP(.2-i*.03),c,0,.9+i*.28,-.7-i*.2));part(g,CN(.08,.3),sp.d,0,1.7,-1.1);h=1.4}
 if(sp.cr)part(g,CN(.4,.45),'#ffd23f',0,h-.1,0);
 g.scale.setScalar(sp.k||1);return{g,L,h:h*(sp.k||1)}}

/* ===== MUNDO ===== */
const cv=document.createElement('canvas');cv.width=cv.height=1024;const cx=cv.getContext('2d'),K=1024/460;
cx.fillStyle='#2b5d9e';cx.fillRect(0,0,1024,1024);
for(let i=5;i>=0;i--){cx.fillStyle=ZN[i].c;cx.beginPath();cx.arc(512,512,ZN[i].r*K,0,7);cx.fill()}
for(let i=0;i<16000;i++){const a=R()*6.28,d=Math.sqrt(R())*214,z=zoneOf(d);cx.fillStyle=z===5?`rgba(255,${ri(120)},20,.12)`:z===4?'rgba(255,255,255,.12)':'rgba(0,0,0,.07)';cx.fillRect(512+Math.cos(a)*d*K,512+Math.sin(a)*d*K,rn(2,6),rn(2,6))}
const gt=new T.CanvasTexture(cv),gr=new T.Mesh(new T.PlaneGeometry(460,460),new T.MeshStandardMaterial({map:gt,roughness:1}));gr.rotation.x=-Math.PI/2;gr.receiveShadow=true;sc.add(gr);

function scatter(z,n,cg,cc,tc,ty){const a=ZN[z-1].r+2,b=ZN[z].r-2,tm=new T.InstancedMesh(new T.CylinderGeometry(.2,.3,1.4,5),M(tc),n),cm=new T.InstancedMesh(cg,M(cc),n),mt=new T.Matrix4();
 for(let i=0;i<n;i++){const an=R()*6.28,d=rn(a,b),s=rn(.8,1.5);mt.makeScale(s,s,s).setPosition(Math.cos(an)*d,.7*s,Math.sin(an)*d);tm.setMatrixAt(i,mt);mt.setPosition(Math.cos(an)*d,ty*s,Math.sin(an)*d);cm.setMatrixAt(i,mt)}
 tm.castShadow=cm.castShadow=true;sc.add(tm,cm)}
scatter(1,70,SP(1.3),'#3f9e3a','#6b4a2b',2.2);scatter(2,240,CN(1.4,3.4),'#1f6b3a','#4a331c',2.6);scatter(3,70,new T.CylinderGeometry(.35,.4,3,6),'#4fa34f','#4fa34f',1.6);
scatter(4,150,CN(1.3,3.2),'#e6f4ff','#6b6f7a',2.5);scatter(5,80,CN(.9,3.6),'#2a1a1a','#1a1010',2.6);
const rk=new T.InstancedMesh(new T.IcosahedronGeometry(1,0),M('#8a8f99'),200),mt4=new T.Matrix4();
for(let i=0;i<200;i++){const an=R()*6.28,d=rn(16,208),s=rn(.4,1.3);mt4.makeScale(s,s*.7,s).setPosition(Math.cos(an)*d,.3,Math.sin(an)*d);rk.setMatrixAt(i,mt4)}rk.castShadow=true;sc.add(rk);

/* vila */
const bx=(w,h,d,c,x,y,z,p=sc)=>{const m=part(p,BX(w,h,d),c,x,y,z);m.receiveShadow=true;return m};
const pz=part(sc,new T.CylinderGeometry(9,9,.15,24),'#cbbd9f',0,.07,0);pz.receiveShadow=true;
part(sc,new T.CylinderGeometry(2,2.2,.7,14),'#aab2c0',0,.4,0);part(sc,new T.CylinderGeometry(1.7,1.7,.5,14),'#4aa8ff',0,.55,0);part(sc,SP(.5),'#bfe3ff',0,1.4,0);
[[12,0],[-12,0],[0,-12],[0,12],[9,9]].forEach(([x,z],i)=>{bx(4.5,3,4.5,'#d8c8a8',x,1.5,z);const r=part(sc,CN(3.8,2.2),'#a8412a',x,4.1,z);r.rotation.y=Math.PI/4;bx(1,1.8,.1,'#5a3a1e',x,.9,z+2.3)});
const NP=mk({s:'human',c:'#b8862b',sk:'#f1c9a0',d:'#553',a:'#222'});NP.g.position.set(6,0,-4);NP.g.rotation.y=-.6;sc.add(NP.g);
const NM=part(sc,new T.OctahedronGeometry(.3),'#ffd23f',6,3.4,-4,{e:'#aa8800'});

/* ===== JOGADOR ===== */
const pl=mk({s:'human',c:'#888',sk:'#f1c9a0',d:'#334',a:'#222'});sc.add(pl.g);let WP=null;
function gear(){const g=pl.g;g.children[0].material.color.set(AC[P.a]);g.children[1].material.color.set('#f1c9a0');if(WP)g.remove(WP);WP=new T.Group();const c=WC[P.w];
 if(P.cls==='w'){part(WP,BX(.1,1.3,.14),c,0,.5,0);part(WP,BX(.4,.1,.14),'#553',0,-.1,0)}
 else if(P.cls==='a'){const b=part(WP,new T.TorusGeometry(.55,.05,6,12,Math.PI),c,0,.3,0);b.rotation.z=-Math.PI/2;part(WP,BX(.02,1.1,.02),'#eee',-.28*0,.3,0)}
 else{part(WP,new T.CylinderGeometry(.05,.05,1.7,6),'#6b4a2b',0,.4,0);part(WP,SP(.18),c,0,1.35,0,{e:c})}
 WP.position.set(.62,1.35,.3);g.add(WP)}
function setup(){pl.g.position.set(P.x,0,P.z);P.hp=Math.min(P.hp,mh());gear();TG=null;MV=null}

/* ===== MONSTROS ===== */
function spawnM(z,sp){const d=rn(ZN[z-1].r+4,ZN[z].r-4),an=R()*6.28,o=mk(sp);o.g.position.set(Math.cos(an)*d,0,Math.sin(an)*d);sc.add(o.g);
 const bar=new T.Group(),bg=new T.Mesh(new T.PlaneGeometry(1.2,.14),new T.MeshBasicMaterial({color:0})),fl=new T.Mesh(new T.PlaneGeometry(1.2,.14),new T.MeshBasicMaterial({color:sp.B?0xffb020:0xe63946}));
 fl.position.z=.01;bar.add(bg,fl);bar.visible=false;bar.scale.setScalar(sp.B?2:1);sc.add(bar);
 const m={sp,o,g:o.g,L:o.L,z,hp:sp.hp,max:sp.hp,hx:o.g.position.x,hz:o.g.position.z,tx:0,tz:0,wt:0,cd:0,ag:0,dead:0,ph:R()*6,bar,fl};o.g.userData.m=m;MON.push(m)}
MS.forEach((arr,i)=>{const z=i+1;arr.forEach(sp=>{const n=sp.B?1:z===1?22:30;for(let k=0;k<n;k++)spawnM(z,sp)})});

const dist=o=>Math.hypot(o.g.position.x-pl.g.position.x,o.g.position.z-pl.g.position.z);
const inTown=()=>Math.hypot(pl.g.position.x,pl.g.position.z)<ZN[0].r;
function dmgText(p,t,c){const v=new T.Vector3(p.x,(p.y||0)+2.5,p.z).project(cam),e=document.createElement('div');e.className='dmg';e.textContent=t;e.style.color=c;
 e.style.left=(v.x*.5+.5)*innerWidth+'px';e.style.top=(-v.y*.5+.5)*innerHeight+'px';document.body.appendChild(e);setTimeout(()=>e.remove(),900)}
function toast(t){$('#msg').textContent=t;clearTimeout(toast.t);toast.t=setTimeout(()=>$('#msg').textContent='',2200)}
function ring(c,r){const m=new T.Mesh(new T.RingGeometry(.5,.7,28),new T.MeshBasicMaterial({color:c,transparent:true,side:2}));m.rotation.x=-Math.PI/2;m.position.set(pl.g.position.x,.2,pl.g.position.z);sc.add(m);FX.push({m,t:0,r})}
function flash(m){m.g.traverse(o=>o.material&&o.material.emissive&&o.material.emissive.setHex(0xaa2222));setTimeout(()=>m.g.traverse(o=>o.material&&o.material.emissive&&o.material.emissive.setHex(0)),90)}

/* ===== COMBATE ===== */
function hit(m,dmg){if(m.dead)return;let cr=R()<.12;dmg=Math.max(1,Math.round(dmg*(cr?2:1)));m.hp-=dmg;m.ag=8;flash(m);dmgText(m.g.position,(cr?'💥':'')+dmg,cr?'#ffd23f':'#fff');if(m.hp<=0)kill(m)}
function shoot(m,dmg,c){const s=new T.Mesh(SP(.18),new T.MeshBasicMaterial({color:c}));s.position.set(pl.g.position.x,1.6,pl.g.position.z);sc.add(s);PRJ.push({s,m,dmg})}
function basic(){const m=TG;let d=atk()*rn(.85,1.15);pl.g.rotation.y=Math.atan2(m.g.position.x-pl.g.position.x,m.g.position.z-pl.g.position.z);
 if(P.cls==='w'){hit(m,d);WP.rotation.x=-1.2;setTimeout(()=>WP.rotation.x=0,120)}
 else{if(P.cls==='m'){if(P.mp>=2)P.mp-=2;else d*=.4}shoot(m,d,P.cls==='a'?'#e0c080':'#c27bff')}}
function skill(i){const s=SKL[i];if(!P||DT>0||P.lv<s.lv||P.mp<s.mp||SC[i]>0)return;
 if(i===0){if(!TG)return toast('Selecione um alvo');if(dist(TG)>CL[P.cls].rg+2)return toast('Alvo muito longe');P.mp-=s.mp;ring('#ff6a3d',2);P.cls==='w'?hit(TG,atk()*2.4):shoot(TG,atk()*2.4,'#ff6a3d')}
 if(i===1){P.mp-=s.mp;ring('#4aa8ff',6);MON.forEach(m=>!m.dead&&dist(m)<6&&hit(m,atk()*1.6))}
 if(i===2){P.mp-=s.mp;const h=Math.round(mh()*.45);P.hp=Math.min(mh(),P.hp+h);ring('#5fe08a',2);dmgText(pl.g.position,'+'+h,'#5fe08a')}
 SC[i]=s.cd}
const add=(id,n=1)=>P.inv[id]=(P.inv[id]||0)+n;
function kill(m){m.dead=m.sp.B?120:20;m.g.visible=false;m.bar.visible=false;if(TG===m)TG=null;const s=m.sp,g=ri(s.g[1]-s.g[0]+1)+s.g[0];P.gold+=g;P.xp+=s.xp;
 toast(`${s.n} derrotado! +${s.xp} XP +${g}💰`);
 if(R()<.3)add((R()<.5?'h':'m')+Math.min(3,Math.max(1,Math.ceil(m.z/2)+(R()<.2?1:0))));
 if(s.B){add('w'+Math.min(5,m.z));add('a'+Math.min(5,m.z));add('h3');add('m3');toast(`👑 ${s.n} caiu! Drops épicos!`)}else if(R()<.05){const id=(R()<.5?'w':'a')+m.z;add(id);toast('✨ Drop raro: '+nm(id))}
 while(P.xp>=need()){P.xp-=need();P.lv++;P.hp=mh();P.mp=mm();ring('#ffd23f',8);toast(`⭐ NÍVEL ${P.lv}!`+SKL.filter(k=>k.lv===P.lv).map(k=>' Nova skill: '+k.n).join(''))}}
function dmgP(d){P.hp-=d;dmgText(pl.g.position,'-'+d,'#ff5c5c');if(P.hp<=0&&!DT){DT=3;TG=null;MV=null;toast('☠️ Você morreu!')}}
function pot(k){const id=['1','2','3'].map(n=>k+n).find(i=>P.inv[i]);if(!id)return toast('Sem poções!');const p=POT[id];
 if((p[2]&&P.hp>=mh())||(p[3]&&P.mp>=mm()))return;P.inv[id]--;if(!P.inv[id])delete P.inv[id];P.hp=Math.min(mh(),P.hp+p[2]);P.mp=Math.min(mm(),P.mp+p[3]);dmgText(pl.g.position,'+'+(p[2]||p[3]),p[2]?'#ff8080':'#6fb0ff')}

/* ===== ITENS / PAINEL ===== */
function nm(id){const t=+id[1];if(id[0]==='w')return WN[P.cls][t];if(id[0]==='a')return AN[t];return POT[id][0]}
const ic=id=>id[0]==='w'?CL[P.cls].i:id[0]==='a'?'🛡️':POT[id][1];
const info=id=>id[0]==='w'?`+${WV[+id[1]]} ATK`:id[0]==='a'?`+${AV[+id[1]]} DEF`:(POT[id][2]?`+${POT[id][2]} HP`:`+${POT[id][3]} MP`);
const price=id=>id[0]==='h'||id[0]==='m'?POT[id][4]:PR[+id[1]];
let TAB='inv';
function equip(id){const k=id[0],t=+id[1];P.inv[id]--;if(!P.inv[id])delete P.inv[id];if(P[k]>0)add(k+P[k]);P[k]=t;gear()}
const nearNpc=()=>Math.hypot(pl.g.position.x-6,pl.g.position.z+4)<8;
const ACT={
 open(){const p=$('#panel');p.hidden=!p.hidden;panel()},close(){$('#panel').hidden=true},tab(x){TAB=x},skill:i=>skill(+i),pot,
 use(id){id[0]==='w'||id[0]==='a'?equip(id):pot(id[0])},
 sell(id){P.gold+=Math.floor(price(id)/2);P.inv[id]--;if(!P.inv[id])delete P.inv[id]},
 buy(id){if(P.gold<price(id)||!nearNpc())return;P.gold-=price(id);add(id)}};
function panel(){const el=$('#panel');if(el.hidden)return;
 const row=(id,b)=>`<div class="item"><span>${ic(id)} ${nm(id)}${b.n?` x${b.n}`:''}<small>${info(id)} · ${price(id)}💰</small></span>${b.h}</div>`;
 let h=`<nav><button data-a="tab" data-x="inv">🎒 Mochila</button><button data-a="tab" data-x="shop">🛒 Mercador</button><button data-a="close">✖</button></nav>
 <div class="item"><span>${ic('w0')} ${WN[P.cls][P.w]} (${info('w'+P.w)})<small>${AN[P.a]} (${info('a'+P.a)}) · ATK ${atk()} · DEF ${def()}</small></span></div>`;
 if(TAB==='inv')h+=Object.keys(P.inv).map(id=>row(id,{n:P.inv[id],h:`<button data-a="use" data-x="${id}">${id[0]==='w'||id[0]==='a'?'Equipar':'Usar'}</button><button data-a="sell" data-x="${id}">💰${price(id)>>1}</button>`})).join('')||'<small>Vazia.</small>';
 else{h+=nearNpc()?'':'<small>⚠️ Chegue perto do mercador na vila (tecla E)</small>';
  h+=['h1','h2','h3','m1','m2','m3',1,2,3,4,5].map(x=>typeof x==='number'?['w'+x,'a'+x]:[x]).flat().map(id=>row(id,{h:`<button data-a="buy" data-x="${id}" ${P.gold<price(id)||!nearNpc()?'disabled':''}>Comprar</button>`})).join('')}
 el.innerHTML=h}
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(b&&P&&ACT[b.dataset.a]){ACT[b.dataset.a](b.dataset.x);panel()}
 const c=e.target.closest('[data-cls]');if(c){P=NEW(c.dataset.cls);$('#menu').hidden=true;setup()}});

/* ===== ENTRADA ===== */
const KY={};addEventListener('keydown',e=>{const k=e.key.toLowerCase();KY[k]=1;if(!P)return;if('123'.includes(k)&&k)skill(+k-1);if(k==='h')pot('h');if(k==='m')pot('m');if(k==='i')ACT.open(),panel();
 if(k==='e'&&nearNpc()){TAB='shop';$('#panel').hidden=false;panel()}});addEventListener('keyup',e=>KY[e.key.toLowerCase()]=0);
addEventListener('wheel',e=>ZD=Math.min(1.7,Math.max(.6,ZD+e.deltaY*.001)));
const rc=new T.Raycaster(),mv=new T.Vector2();
ren.domElement.addEventListener('pointerdown',e=>{if(!P||DT>0)return;mv.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);rc.setFromCamera(mv,cam);
 const hs=rc.intersectObjects(MON.filter(m=>!m.dead).map(m=>m.g),true);
 if(hs.length){let o=hs[0].object;while(!o.userData.m)o=o.parent;TG=o.userData.m;MV=null;return}
 const r=rc.ray,t=-r.origin.y/r.direction.y;if(t>0){MV={x:r.origin.x+r.direction.x*t,z:r.origin.z+r.direction.z*t};TG=null}});

/* ===== LOOP ===== */
function go(o,tx,tz,sp,dt){const dx=tx-o.x,dz=tz-o.z,d=Math.hypot(dx,dz);if(d<.01)return 0;const s=Math.min(d,sp*dt);o.x+=dx/d*s;o.z+=dz/d*s;return d}
const face=(g,tx,tz)=>g.rotation.y=Math.atan2(tx-g.position.x,tz-g.position.z);
const skyC=new T.Color('#9ad0ff'),tmp=new T.Color();let clock=new T.Clock(),t0=0,hudT=0,miniT=0,lastZ=-1;
function update(dt){t0+=dt;const p=pl.g.position;
 if(DT>0){DT-=dt;if(DT<=0){DT=0;P.hp=Math.round(mh()/2);P.mp=Math.round(mm()/2);P.gold=Math.floor(P.gold*.9);p.set(0,0,4)}}
 else{let vx=(KY.d||KY.arrowright?1:0)-(KY.a||KY.arrowleft?1:0),vz=(KY.s||KY.arrowdown?1:0)-(KY.w||KY.arrowup?1:0),mvg=0,sp=6;
  if(vx||vz){MV=null;const l=Math.hypot(vx,vz);p.x+=vx/l*sp*dt;p.z+=vz/l*sp*dt;pl.g.rotation.y=Math.atan2(vx,vz);mvg=1;if(TG)TG=null}
  else if(TG){if(TG.dead||dist(TG)>35)TG=null;else{const rg=CL[P.cls].rg;if(dist(TG)>rg*.9){mvg=1;face(pl.g,TG.g.position.x,TG.g.position.z);go(p,TG.g.position.x,TG.g.position.z,sp,dt)}else if(CD<=0){CD=CL[P.cls].cd;basic()}}}
  else if(MV){mvg=go(p,MV.x,MV.z,sp,dt)>.3;if(mvg)face(pl.g,MV.x,MV.z);else MV=null}
  const d=Math.hypot(p.x,p.z);if(d>206){p.x*=206/d;p.z*=206/d}
  pl.ph=(pl.ph||0)+(mvg?dt*10:0);pl.L.forEach((l,i)=>l.rotation.x=mvg?Math.sin(pl.ph+(i%3?Math.PI:0))*.7:0);p.y=mvg?Math.abs(Math.sin(pl.ph))*.1:0}
 CD-=dt;SC.forEach((v,i)=>SC[i]=Math.max(0,v-dt));
 const tn=inTown(),rg=tn?.08:.01;if(DT<=0){P.hp=Math.min(mh(),P.hp+mh()*(tn?.08:.004)*dt);P.mp=Math.min(mm(),P.mp+mm()*rg*dt)}
 for(const m of MON){const g=m.g,mp=g.position;
  if(m.dead>0){m.dead-=dt;if(m.dead<=0){m.hp=m.max;mp.set(m.hx,0,m.hz);g.visible=true}continue}
  const d=dist(m),k=m.sp.k||1;m.cd-=dt;m.ag-=dt;let sp=0;
  const agg=!tn&&DT<=0&&(d<(m.sp.B?12:7)||m.ag>0)&&d<40;
  if(agg){face(g,p.x,p.z);if(d>1.4*Math.pow(k,.7)+.4)sp=go(mp,p.x,p.z,m.sp.B?4:3.2,dt)?3:0;else if(m.cd<=0){m.cd=1.3;dmgP(Math.max(1,Math.round(m.sp.at*rn(.8,1.2)-def()*.6)))}}
  else{m.wt-=dt;if(m.wt<=0){m.tx=m.hx+rn(-6,6);m.tz=m.hz+rn(-6,6);m.wt=rn(2,6)}if(Math.hypot(m.tx-mp.x,m.tz-mp.z)>.5){face(g,m.tx,m.tz);go(mp,m.tx,m.tz,1.3,dt);sp=1}}
  m.ph+=dt*(sp?6:2);m.L.forEach((l,i)=>l.rotation.x=sp?Math.sin(m.ph*1.5+(i%2?Math.PI:0))*.6:0);
  g.position.y=m.sp.s==='blob'?Math.abs(Math.sin(m.ph))*(sp?.3:.05):sp?Math.abs(Math.sin(m.ph*1.5))*.08:0;
  m.bar.visible=m.hp<m.max||TG===m;if(m.bar.visible){m.bar.position.set(mp.x,m.o.h+.6,mp.z);m.bar.quaternion.copy(cam.quaternion);const f=Math.max(0,m.hp/m.max);m.fl.scale.x=f;m.fl.position.x=-.6*(1-f)}}
 for(let i=PRJ.length-1;i>=0;i--){const q=PRJ[i],tp=q.m.g.position;if(q.m.dead){sc.remove(q.s);PRJ.splice(i,1);continue}
  const dx=tp.x-q.s.position.x,dy=1.2-q.s.position.y,dz=tp.z-q.s.position.z,d=Math.hypot(dx,dy,dz),s=20*dt;
  if(d<s+.3){hit(q.m,q.dmg);sc.remove(q.s);PRJ.splice(i,1)}else q.s.position.add(new T.Vector3(dx,dy,dz).multiplyScalar(s/d))}
 for(let i=FX.length-1;i>=0;i--){const f=FX[i];f.t+=dt*2.2;f.m.scale.setScalar(1+f.t*f.r);f.m.material.opacity=1-f.t;if(f.t>=1){sc.remove(f.m);FX.splice(i,1)}}
 NM.position.y=3.4+Math.sin(t0*3)*.2;NM.rotation.y=t0*2;
 const z=zoneOf(Math.hypot(p.x,p.z));if(z!==lastZ){lastZ=z;$('#zone').textContent='📍 '+ZN[z].n;skyC.set(ZN[z].sky)}
 sc.background.lerp(skyC,dt*1.5);sc.fog.color.copy(sc.background);
 const f=ZD;cam.position.lerp(new T.Vector3(p.x,20*f,p.z+15*f),Math.min(1,dt*6));cam.lookAt(p.x,0,p.z);sun.position.set(p.x+30,50,p.z+20);sun.target.position.set(p.x,0,p.z)}

function hud(){const b=(s,v,m)=>{const e=$(s);e.firstChild.style.width=Math.max(0,v/m*100)+'%';e.lastChild.textContent=Math.floor(v)+'/'+m};
 $('#nm').textContent=`${CL[P.cls].n} — Nv ${P.lv}`;b('#stats .hp',P.hp,mh());b('#stats .mp',P.mp,mm());b('#stats .xp',P.xp,need());$('#gold').textContent='💰 '+P.gold;
 const t=$('#target');t.hidden=!TG;if(TG){t.firstChild.textContent=TG.sp.n+(TG.sp.B?' 👑':'');b('#target .bar',TG.hp,TG.max)}
 const pc=k=>['1','2','3'].reduce((s,n)=>s+(P.inv[k+n]||0),0);
 $('#hot').innerHTML=SKL.map((s,i)=>`<button data-a="skill" data-x="${i}" class="${SC[i]>0?'cd':''}" ${P.lv<s.lv?'disabled':''}>${P.lv<s.lv?'🔒':s.i}<small>${i+1} · ${P.lv<s.lv?'Nv'+s.lv:SC[i]>0?SC[i].toFixed(1)+'s':s.mp+'mp'}</small></button>`).join('')
  +`<button data-a="pot" data-x="h">❤️<small>H · ${pc('h')}</small></button><button data-a="pot" data-x="m">🔹<small>M · ${pc('m')}</small></button>`}
function mini(){const c=$('#mini').getContext('2d'),s=70/210;c.clearRect(0,0,140,140);c.save();c.beginPath();c.arc(70,70,70,0,7);c.clip();
 for(let i=5;i>=0;i--){c.fillStyle=ZN[i].c;c.beginPath();c.arc(70-P.x*0,70,ZN[i].r*s,0,7);c.fill()}
 MON.forEach(m=>{if(m.dead)return;c.fillStyle=m.sp.B?'#ffd23f':'#e63946';const r=m.sp.B?4:1.6;c.fillRect(70+m.g.position.x*s-r/2,70+m.g.position.z*s-r/2,r,r)});
 c.fillStyle='#fff';c.beginPath();c.arc(70+pl.g.position.x*s,70+pl.g.position.z*s,3.5,0,7);c.fill();c.restore()}

function loop(){requestAnimationFrame(loop);const dt=Math.min(.05,clock.getDelta());
 if(P&&!$('#menu').hidden===false){update(dt);hudT-=dt;miniT-=dt;if(hudT<=0){hudT=.12;hud();panel()}if(miniT<=0){miniT=.25;mini()}}
 else sc.rotation.y=0;ren.render(sc,cam)}
const save=()=>{if(!P)return;try{P.x=pl.g.position.x;P.z=pl.g.position.z;localStorage.setItem('aethra3d',JSON.stringify(P))}catch(e){}};
setInterval(save,10000);addEventListener('beforeunload',save);
if(P){$('#menu').hidden=true;setup()}
loop();
