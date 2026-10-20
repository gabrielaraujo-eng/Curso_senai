const $=s=>document.querySelector(s),rnd=n=>Math.floor(Math.random()*n);

/* ===== ITENS ===== */
const IT={};
[['Espada Enferrujada','🗡️',3,0],['Machado de Ferro','🪓',8,80],['Lâmina de Aço','⚔️',14,250],['Espada Rúnica','🔱',24,650],['Excalibur','✨',40,1600]]
 .forEach((x,i)=>IT['w'+i]={n:x[0],i:x[1],t:'w',v:x[2],p:x[3]});
[['Túnica de Pano','👕',1,0],['Couro Batido','🦺',4,60],['Cota de Malha','⛓️',8,180],['Armadura de Placas','🛡️',14,450],['Manto Dracônico','🐉',22,1100]]
 .forEach((x,i)=>IT['a'+i]={n:x[0],i:x[1],t:'a',v:x[2],p:x[3]});
[['h1','Poção de Vida P','❤️',50,0,25],['h2','Poção de Vida M','❤️‍🔥',150,0,70],['h3','Poção de Vida G','💖',400,0,180],
 ['m1','Poção de Mana P','🔹',0,30,30],['m2','Poção de Mana M','💧',0,80,80],['m3','Poção de Mana G','🌊',0,200,200]]
 .forEach(x=>IT[x[0]]={n:x[1],i:x[2],t:'p',hp:x[3],mp:x[4],p:x[5]});

/* ===== ÁREAS: [nome,emoji,lvMin,monstros[nome,emoji,hp,atk,xp,ouro],boss] ===== */
const AR=[
 {n:'Floresta Sombria',e:'🌲',lv:1,m:[['Slime','🟢',24,6,8,5],['Lobo','🐺',38,8,12,8],['Goblin','👺',50,10,16,11]],b:['Rei Goblin','👑',220,15,120,100]},
 {n:'Caverna de Cristal',e:'🕳️',lv:5,m:[['Morcego','🦇',80,14,34,20],['Golem','🗿',130,18,46,28],['Aranha','🕷️',105,22,52,32]],b:['Aranha Rainha','🕸️',520,28,300,260]},
 {n:'Deserto Ardente',e:'🏜️',lv:10,m:[['Escorpião','🦂',170,26,80,45],['Múmia','🧟',230,31,105,60],['Djinn','🧞',200,38,125,75]],b:['Faraó Imortal','🏺',1000,45,650,520]},
 {n:'Vulcão Infernal',e:'🌋',lv:16,m:[['Imp','😈',330,42,190,110],['Salamandra','🦎',430,50,240,140],['Elemental','🔥',520,58,290,170]],b:['Dragão Rubro','🐲',2200,72,1400,1000]},
 {n:'Castelo Sombrio',e:'🏰',lv:22,m:[['Esqueleto','💀',650,66,420,220],['Vampiro','🧛',800,78,520,280],['Cavaleiro Negro','🥷',950,90,650,340]],b:['Lorde Demônio','👹',4500,115,3500,2500]}
];

/* ===== SKILLS ===== */
const SK=[
 {n:'Golpe Forte',i:'💥',lv:1,mp:5,m:1.8},{n:'Bola de Fogo',i:'🔥',lv:3,mp:9,m:2.6},
 {n:'Cura',i:'💚',lv:5,mp:12,h:.35},{n:'Frenesi',i:'⚡',lv:8,mp:16,m:3.6},
 {n:'Nova Arcana',i:'🌌',lv:12,mp:28,m:5.5},{n:'Julgamento',i:'☄️',lv:18,mp:40,m:8}
];

/* ===== ESTADO ===== */
const NEW=()=>({lv:1,xp:0,gold:50,hp:80,mp:28,inv:{h1:3,m1:2},eq:{w:'w0',a:'a0'},area:0,kills:[0,0,0,0,0],boss:[0,0,0,0,0],tab:'inv'});
let P=NEW(),E=null,L=[];
try{const s=localStorage.getItem('aethra');if(s)P=Object.assign(NEW(),JSON.parse(s))}catch(e){}
const mh=()=>60+P.lv*20,mm=()=>20+P.lv*8,atk=()=>5+P.lv*2+IT[P.eq.w].v,def=()=>P.lv+IT[P.eq.a].v,need=()=>P.lv*P.lv*30+P.lv*25;
const log=t=>{L.unshift(t);L=L.slice(0,50)};
const add=(id,n=1)=>P.inv[id]=(P.inv[id]||0)+n;
const bar=(v,m,c)=>`<div class="bar"><i style="width:${Math.max(0,v/m*100)}%;background:${c}"></i><b>${Math.max(0,Math.floor(v))}/${m}</b></div>`;

/* ===== COMBATE ===== */
function spawn(boss){
  const a=AR[P.area],d=boss?a.b:a.m[rnd(a.m.length)];
  E={n:d[0],i:d[1],hp:d[2],max:d[2],atk:d[3],xp:d[4],g:d[5],boss,turn:0};
  log(boss?`👑 O boss ${E.n} apareceu!`:`Um ${E.n} selvagem apareceu!`);
}
function hurt(dmg,label){
  dmg=Math.max(1,Math.round(dmg));let crit=Math.random()<.15;if(crit)dmg*=2;
  E.hp-=dmg;log(`${label} ${crit?'CRÍTICO! ':''}causa ${dmg} de dano em ${E.n}.`);
  $('#view')?.classList.add('hit');
}
const act={
  hunt(){if(P.hp<=0)return;spawn(false)},
  boss(){spawn(true)},
  atk(){hurt(atk()+rnd(6),'Você ataca:');post()},
  skill(i){
    const s=SK[i];if(P.mp<s.mp||P.lv<s.lv)return;P.mp-=s.mp;
    if(s.h){const h=Math.round(mh()*s.h);P.hp=Math.min(mh(),P.hp+h);log(`${s.i} ${s.n}: recupera ${h} HP.`)}
    else hurt(atk()*s.m+rnd(8)+P.lv*2,`${s.i} ${s.n}:`);
    post();
  },
  use(id){
    const it=IT[id];
    if(it.t==='w'||it.t==='a'){P.inv[id]--;add(P.eq[it.t]);P.eq[it.t]=id;log(`Equipou ${it.n}.`);clean();return}
    if(it.hp&&P.hp>=mh()&&!it.mp)return;if(it.mp&&P.mp>=mm()&&!it.hp)return;
    P.inv[id]--;P.hp=Math.min(mh(),P.hp+(it.hp||0));P.mp=Math.min(mm(),P.mp+(it.mp||0));
    log(`${it.i} Usou ${it.n}.`);clean();if(E)post();
  },
  flee(){if(E.boss){log('Não dá para fugir de um boss!');post();return}
    if(Math.random()<.6){log('Você fugiu!');E=null}else{log('A fuga falhou!');post()}},
  rest(){if(P.gold<10)return;P.gold-=10;P.hp=mh();P.mp=mm();log('😴 Você descansou na estalagem. HP/MP restaurados.')},
  tab(t){P.tab=t},
  buy(id){const it=IT[id];if(P.gold<it.p)return;P.gold-=it.p;add(id);log(`Comprou ${it.n} por ${it.p}💰.`)},
  sell(id){const it=IT[id];P.gold+=Math.floor(it.p/2);P.inv[id]--;log(`Vendeu ${it.n} por ${Math.floor(it.p/2)}💰.`);clean()},
  area(i){if(!E&&P.lv>=AR[i].lv)P.area=+i},
  save(){try{localStorage.setItem('aethra',JSON.stringify(P));log('💾 Jogo salvo!')}catch(e){log('Não foi possível salvar.')}},
  reset(){if(confirm('Apagar todo o progresso?')){P=NEW();E=null;L=[];try{localStorage.removeItem('aethra')}catch(e){}}}
};
function clean(){for(const k in P.inv)if(P.inv[k]<=0)delete P.inv[k]}
function post(){if(E.hp<=0)return win();
  E.turn++;const sp=E.boss&&E.turn%3===0;
  const d=Math.max(1,Math.round((E.atk+rnd(5))*(sp?1.8:1))-def());P.hp-=d;
  log(sp?`💢 ${E.n} usa ATAQUE ESPECIAL: ${d} de dano!`:`${E.n} ataca: ${d} de dano.`);
  if(P.hp<=0)die();
}
function win(){
  log(`🏆 ${E.n} derrotado! +${E.xp} XP, +${E.g}💰`);
  P.xp+=E.xp;P.gold+=E.g;
  if(E.boss){P.boss[P.area]++;const w='w'+Math.min(4,P.area+1),a='a'+Math.min(4,P.area+1);add(w);add(a);log(`🎁 Drop do boss: ${IT[w].n} e ${IT[a].n}!`);add('h3');add('m3')}
  else{P.kills[P.area]++;const r=Math.random();
    if(r<.25){const id=['h1','h1','h2','m1','m1','m2'][rnd(6)+(P.area>=2?0:0)];add(id);log(`Drop: ${IT[id].n}`)}
    if(r>.93){const id=(Math.random()<.5?'w':'a')+Math.min(4,P.area+1);add(id);log(`✨ Drop raro: ${IT[id].n}!`)}}
  E=null;
  while(P.xp>=need()){P.xp-=need();P.lv++;P.hp=mh();P.mp=mm();log(`⭐ NÍVEL ${P.lv}! HP e MP restaurados.`);
    SK.filter(s=>s.lv===P.lv).forEach(s=>log(`✨ Nova skill: ${s.n}!`))}
}
function die(){
  log('☠️ Você morreu! Perdeu metade do ouro e acordou na estalagem.');
  P.gold=Math.floor(P.gold/2);P.hp=Math.floor(mh()/2);P.mp=Math.floor(mm()/2);E=null;
}

/* ===== RENDER ===== */
function draw(){
  $('#gold').textContent=`💰 ${P.gold}`;
  $('#hero').innerHTML=`<div class="avatar">🧙‍♂️</div><h2 style="text-align:center;margin:4px">Herói — Nv ${P.lv}</h2>
  ${bar(P.hp,mh(),'var(--hp)')}${bar(P.mp,mm(),'var(--mp)')}${bar(P.xp,need(),'var(--xp)')}
  <div class="stats"><span>⚔️ Ataque: ${atk()}</span><span>🛡️ Defesa: ${def()}</span></div>
  <div class="eq">${IT[P.eq.w].i} ${IT[P.eq.w].n}<br>${IT[P.eq.a].i} ${IT[P.eq.a].n}</div>
  <h3>🏅 Progresso</h3><div class="eq">Bosses derrotados: ${P.boss.filter(x=>x).length}/5</div>`;
  $('#view').className='';
  $('#view').innerHTML=E?battleView():mapView();
  $('#log').innerHTML=L.map(t=>`<p>${t}</p>`).join('');
  document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.x===P.tab));
  $('#panel').innerHTML=P.tab==='inv'?invView():P.tab==='shop'?shopView():skillView();
}
function battleView(){
  const pots=['h','m'].map(k=>Object.keys(P.inv).filter(i=>i[0]===k));
  return `<div class="enemy ${E.boss?'boss':''}"><div class="avatar">${E.i}</div><h2>${E.n}</h2>${bar(E.hp,E.max,'var(--hp)')}</div>
  <div class="acts"><button data-a="atk">⚔️ Atacar</button>
  ${SK.map((s,i)=>P.lv>=s.lv?`<button data-a="skill" data-x="${i}" ${P.mp<s.mp?'disabled':''}>${s.i} ${s.n} (${s.mp})</button>`:'').join('')}
  <button data-a="flee">🏃 Fugir</button></div>
  <div class="acts">${[...pots[0],...pots[1]].map(id=>`<button data-a="use" data-x="${id}">${IT[id].i} ${IT[id].n} x${P.inv[id]}</button>`).join('')||'<small>Sem poções</small>'}</div>`;
}
function mapView(){
  const a=AR[P.area];
  return `<div class="areas">${AR.map((x,i)=>`<div class="area ${P.lv<x.lv?'lock':''}"><div>${x.e} <b>${x.n}</b><small>Nv ${x.lv}+ · Abates: ${P.kills[i]} · ${P.boss[i]?'Boss ✅':'Boss ❌'}</small></div>
  <button data-a="area" data-x="${i}" ${P.lv<x.lv?'disabled':''} class="${P.area===i?'on':''}">${P.lv<x.lv?'🔒':P.area===i?'Aqui':'Ir'}</button></div>`).join('')}</div>
  <div class="acts"><button data-a="hunt" ${P.hp<=0?'disabled':''}>🗡️ Caçar em ${a.n}</button>
  <button data-a="boss" ${P.kills[P.area]<5?'disabled':''}>👑 Boss: ${a.b[0]} ${P.kills[P.area]<5?`(${P.kills[P.area]}/5 abates)`:''}</button>
  <button data-a="rest" ${P.gold<10?'disabled':''}>🛏️ Descansar (10💰)</button></div>`;
}
function invView(){
  const ids=Object.keys(P.inv);
  const row=id=>{const it=IT[id],d=it.t==='p'?(it.hp?`+${it.hp} HP`:`+${it.mp} MP`):it.t==='w'?`+${it.v} ATK`:`+${it.v} DEF`;
    return `<div class="item"><span>${it.i} ${it.n} x${P.inv[id]}<small>${d}</small></span>
    <button data-a="use" data-x="${id}">${it.t==='p'?'Usar':'Equipar'}</button>${it.p?`<button data-a="sell" data-x="${id}" ${E?'disabled':''}>💰${Math.floor(it.p/2)}</button>`:''}</div>`};
  return `<div class="grid">${ids.map(row).join('')||'<small>Mochila vazia.</small>'}</div>`;
}
function shopView(){
  const ids=Object.keys(IT).filter(i=>IT[i].p>0);
  return `<div class="grid">${ids.map(id=>{const it=IT[id],d=it.t==='p'?(it.hp?`+${it.hp} HP`:`+${it.mp} MP`):it.t==='w'?`+${it.v} ATK`:`+${it.v} DEF`;
    return `<div class="item"><span>${it.i} ${it.n}<small>${d}</small></span><button data-a="buy" data-x="${id}" ${P.gold<it.p?'disabled':''}>💰${it.p}</button></div>`}).join('')}</div>`;
}
function skillView(){
  return `<div class="grid">${SK.map(s=>`<div class="item ${P.lv>=s.lv?'eqd':''}" style="${P.lv<s.lv?'opacity:.45':''}"><span>${s.i} ${s.n}<small>${s.h?`Cura ${s.h*100}% do HP`:`Dano x${s.m}`} · ${s.mp} MP · Nv ${s.lv}</small></span>${P.lv<s.lv?'🔒':'✔'}</div>`).join('')}</div>`;
}

document.addEventListener('click',e=>{
  const b=e.target.closest('[data-a]');if(!b||!act[b.dataset.a])return;
  act[b.dataset.a](b.dataset.x);draw();
  if(b.dataset.a==='atk'||b.dataset.a==='skill'){const v=$('#view');v.classList.add('hit');setTimeout(()=>v.classList.remove('hit'),250)}
});
log('Bem-vindo a Aethra! Cace monstros, suba de nível e derrote os 5 bosses.');
draw();
