(()=>{
const $=s=>document.querySelector(s),cv=$('#cv'),c=cv.getContext('2d'),W=320,H=192,T=16;
cv.width=W;cv.height=H;
const fit=()=>{const s=Math.min(innerWidth/W,innerHeight/H);cv.style.width=W*s+'px';cv.style.height=H*s+'px';const r=document.documentElement.style;r.setProperty('--gh',32*s+'px');r.setProperty('--gs',3*s+'px')};addEventListener('resize',fit);fit();
if('ontouchstart' in window)document.body.classList.add('touch');

// MUDE AQUI: a senha do botão secret (1 número escondido em cada mundo)
const CODE=[1,9,8,4,2];
const WD=[
{n:'Rua do Maurício',sky:'#5c94fc',e:['Pombo Cobrador','Boleto Ambulante'],col:['#9a9aaa','#e8e0c8'],gl:'#c33'},
{n:'Farmácia do Bairro',sky:'#6ab0ff',e:['Comprimido Zangado','Seringa Maluca'],col:['#e8a0a0','#b8e0f0'],gl:'#fff'},
{n:'Hospital',sky:'#4a8ae0',e:['Maca Fantasma','Termômetro Espinhoso'],col:['#dcdcf0','#f08080'],gl:'#e33'},
{n:'Laboratório',sky:'#3a6fc0',e:['Bactéria Verde','Tubo de Ensaio Espinhoso'],col:['#58c048','#a0e8c8'],gl:'#2a2'},
{n:'Consultório do Doutor',sky:'#2c4a98',e:['Receita Ilegível','Estetoscópio Bravo'],col:['#f0e8b0','#707080'],gl:'#000'}];

let imp=0,ng=0,pw=[],bul=[],inv=0,st='menu',wi=0,lives=3,coins=0,score=0,g=[],N=0,ens=[],proj=[],items=[],fx=[],boss=null,P={},cam=0,keys={},tm=0,flagX=0;
let cutS=[],cutI=0,cutT=0,cutC=0,cutDone=null,cardT=0,over=0,hj=0,rain=[],rainT=0,found=[],mj=0,ks='',nickN=0,clouds=[],acc=0,last=0;
try{found=JSON.parse(localStorage.getItem('mauSeg'))||[]}catch(e){}
const sv=()=>{try{return+localStorage.getItem('mauSave')||0}catch(e){return 0}};
const setSave=v=>{if(inv||imp)return;try{localStorage.setItem('mauSave',v)}catch(e){}};

// ---- áudio ----
const WI=[
{n:'Praça da Quebrada',sky:'#5c94fc',e:['Cartilha do Bem','Panfleto Espinhoso'],col:['#e8e8f0','#8fb0f0'],gl:'#1d4f91'},
{n:'Escola da Palestra',sky:'#6ab0ff',e:['Diploma Zangado','Giz Espinhoso'],col:['#f0e0a0','#f0f0f0'],gl:'#1d4f91'},
{n:'Viatura de Brinquedo',sky:'#4a8ae0',e:['Sirene Mirim','Cone Espinhoso'],col:['#9ab8f0','#f0a050'],gl:'#e33'},
{n:'Auditório Chato',sky:'#3a6fc0',e:['Palestra Sonolenta','Microfone Espinhoso'],col:['#c8b0e0','#808090'],gl:'#fff'},
{n:'Quartel do PROERD',sky:'#2c4a98',e:['Camiseta Oficial','Apito Bravo'],col:['#2a5aa8','#e8d060'],gl:'#fff'}];
const WL=()=>inv?WI:WD;
const NGS=['#3a1a5a','#4a1a4a','#5a1a3a','#2a1a3a','#1a0a2a'],SKY=()=>ng?NGS[wi]:WL()[wi].sky;
const ACH=[['first','Primeiros Passos','Comece uma partida.'],['stomp','Pisão Certeiro','Pise em 10 inimigos (soma de todas as partidas).'],['coin','Mãos de Ouro','Pegue 25 moedas na mesma partida.'],['mush','Crescendo','Pegue um cogumelo (blocos ? com degraus).'],['gun','Armado e Perigoso','Pegue a Flor da Pistola. Só vem se você já estiver grande.'],['dig','Caçador de Números','Bata num tijolo que brilha e ache um número da senha.'],['vault','Cofre Aberto','Ache os 5 números da senha.',1],['egg3','Fuçador','Ache 3 segredos no menu.'],['egg5','Detetive','Ache os 5 segredos do menu.'],['pit','Buraco Negro','Caia num buraco.'],['die10','Persistente','Morra 10 vezes. Quem desiste não vence.'],['half','Meio Caminho','Zere o Mundo 3.'],['boss','Receita Cumprida','Derrote o Dr. Receitus.'],['sug','Colaborador','Envie uma sugestão.'],['inv','Do Outro Lado','Zere o Mundo Invertido.',1],['imp','Impossível? Nem tanto','Zere o Modo Impossível.'],['unlock','Chave Verde','Libere o NG+.',1],['ng','Lenda Verde','Derrote o chefe real do NG+.',1]];
let AD={ids:[],s:{},beat:{}},aq=[],ab=0;try{AD=Object.assign(AD,JSON.parse(localStorage.getItem('mauAch')))}catch(e){}
const saveA=()=>{try{localStorage.setItem('mauAch',JSON.stringify(AD))}catch(e){}};
const stat=(k,n=1)=>{AD.s[k]=(AD.s[k]||0)+n;saveA();return AD.s[k]};
function ach(id){if(AD.ids.includes(id))return;const a=ACH.find(x=>x[0]===id);if(!a)return;AD.ids.push(id);saveA();aq.push(a[1]);if(!ab)nextA()}
function nextA(){const n=aq.shift(),e=$('#atoast');if(!n){ab=0;return}ab=1;e.innerHTML='🏆 CONQUISTA<br>'+n;e.classList.add('on');[660,880,1100].forEach((f,i)=>setTimeout(()=>beep(f,.15,'square',.06),i*110));setTimeout(()=>{e.classList.remove('on');setTimeout(nextA,350)},3200)}
function drawAch(){$('#achList').innerHTML=ACH.map(a=>{const on=AD.ids.includes(a[0]),hid=!on&&a[3];return '<div class="ac'+(on?' on':'')+'"><b>'+(on?'🏆 ':'🔒 ')+(hid?'???':a[1])+'</b><span>'+(hid?'Conquista secreta. Explore o jogo.':a[2])+'</span></div>'}).join('');$('#achCount').textContent=AD.ids.length+'/'+ACH.length}
let DIGF=[];try{DIGF=JSON.parse(localStorage.getItem('mauDig'))||[]}catch(e){}
let AC;
function beep(f,d,t='square',v=.05,f2){try{AC=AC||new AudioContext();const o=AC.createOscillator(),q=AC.createGain(),n=AC.currentTime;o.type=t;o.frequency.setValueAtTime(f,n);if(f2)o.frequency.exponentialRampToValueAtTime(f2,n+d);q.gain.setValueAtTime(v,n);q.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(q);q.connect(AC.destination);o.start();o.stop(n+d)}catch(e){}}

// ---- ui ----
const show=id=>{document.querySelectorAll('.scr').forEach(s=>s.classList.toggle('on',s.id===id));document.body.classList.toggle('playing',st==='play')};
function toast(m,ms=2800){const e=$('#toast');e.textContent=m;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),ms)}
function egg(id,m){toast(m);if(found.includes(id))return;found.push(id);try{localStorage.setItem('mauSeg',JSON.stringify(found))}catch(e){}upE();if(found.length>=3)ach('egg3');if(found.length>=5)ach('egg5');beep(988,.1);setTimeout(()=>beep(1319,.3),100)}
function upE(){$('#eggs').textContent='Segredos '+found.length+'/5';if(found.length>=5)$('#eggs').textContent='Segredos 5/5 ★'}



let bgk='';
function setBg(s,g,gr){const k=s+g+gr;if(k===bgk)return;bgk=k;const r=document.documentElement.style;r.setProperty('--sky',s);r.setProperty('--gc',g);r.setProperty('--gg',gr)}
// ---- desenho ----
const R=(x,y,w,h,k)=>{c.fillStyle=k;c.fillRect(Math.round(x),Math.round(y),w,h)};
function tx(s,x,y,k='#fff',al='left',sz=8){c.font=sz+'px "Press Start 2P","Courier New",monospace';c.textAlign=al;c.fillStyle='#000';c.fillText(s,x+1,y+1);c.fillStyle=k;c.fillText(s,x,y)}
function sky(col,sc){
  R(0,0,W,H,col);clouds=[];
  for(let i=0;i<5;i++){const x=(((i*83-sc*.3+(st==='menu'?tm*.15:0))%420)+420)%420-50,y=18+(i*37)%50;clouds.push({x,y,w:40,h:16});
    R(x+6,y,28,14,'#fff');R(x,y+5,40,9,'#fff');R(x+10,y-5,14,8,'#fff')}
  c.fillStyle='#3cb028';
  for(let i=0;i<4;i++){const x=(((i*130-sc*.5)%520)+520)%520-80;c.beginPath();c.ellipse(x,160,48,26+(i%2)*14,0,Math.PI,0);c.fill()}
}
function gnd(px,py,top){R(px,py,T,T,'#c84c0c');R(px,py+7,T,1,'#7a2c04');R(px+7,py,1,8,'#7a2c04');R(px+3,py+8,1,8,'#7a2c04');if(top)R(px,py,T,3,'#58c030')}
function tiles(cx){
  const x0=Math.floor(cx/T);
  for(let y=0;y<12;y++)for(let x=x0;x<=x0+21;x++){const t=g[y]&&g[y][x];if(!t)continue;const px=x*T-cx,py=y*T;
    if(t===1)gnd(px,py,y===10);
    else if(t===2){gnd(px,py,0)}
    else if(t===8){gnd(px,py,0);if((tm>>5)%5===0)R(px+10,py+3,2,2,'#fff')}
    else if(t===3||t===9||t===10){R(px,py,T,T,'#fcb800');R(px,py,T,1,'#fff');R(px+1,py+1,2,2,'#7a4a00');tx('?',px+8,py+13,'#7a2c04','center')}
    else if(t===5)R(px,py,T,T,'#6a3a1a');
    else if(t===4){R(px,py,T,T,'#a8a8a8');R(px,py,T,2,'#eee');R(px,py+14,T,2,'#555')}
    else if(t===7){R(px,py,T,T,'#00a800');R(px+2,py,3,T,'#58e058');R(px,py,T,2,'#006800')}
    else if(t===6){R(px+7,py,2,T,'#eee');if(y===2){R(px-9,py+1,16,9,'#e8341c');R(px-6,py+4,10,2,'#fff')}}}
}
function mau(x,y,d,f){
  const r=(a,b,w,h,k)=>R(x+(d>0?a:12-a-w),y+b,w,h,k);
  r(2,0,8,3,'#fcd800');r(7,2,5,1,'#fcd800');r(2,3,8,5,'#6b4226');r(1,3,2,3,'#140c06');r(7,4,2,2,'#fff');r(8,5,1,1,'#000');r(4,6,7,1,'#0a0604');
  r(1,8,10,4,'#2f6bd8');r(0,9,2,3,'#6b4226');r(10,9,2,3,'#6b4226');r(2,12,8,2,'#6a3a1a');
  r(f?1:3,14,4,2,'#3a1a0a');r(f?7:5,14,4,2,'#3a1a0a')}
function doc(x,y,d,s,bag,f){
  const r=(a,b,w,h,k)=>R(x+(d>0?a:22-a-w)*s,y+b*s,Math.ceil(w*s),Math.ceil(h*s),k);
  r(6,0,10,10,'#f8b878');r(6,0,10,2,'#bbb');r(7,4,4,3,'#222');r(12,4,4,3,'#222');r(8,5,2,1,'#fff');r(13,5,2,1,'#fff');r(9,8,5,1,'#a33');
  r(3,10,16,16,'#fff');r(3,10,2,16,'#ccc');r(8,10,1,8,'#333');r(13,10,1,8,'#333');r(8,18,6,1,'#333');r(10,12,2,4,'#e33');
  r(5,26,5,6,'#2a3a6a');r(12,26,5,6,'#2a3a6a');r(f?4:6,31,5,1,'#000');
  if(bag){r(17,14,10,10,'#8a5a2a');r(21,11,3,3,'#e33');r(22,11,1,3,'#fff')}}
function drawEn(e,cx){
  const x=Math.round(e.x-cx),y=Math.round(e.y),wd=WL()[wi];
  if(e.d){R(x,y+9,14,5,wd.col[e.t]);return}
  R(x+1,y,12,12,wd.col[e.t]);R(x,y+3,14,7,wd.col[e.t]);
  R(x+3,y+4,3,3,'#fff');R(x+8,y+4,3,3,'#fff');R(x+4,y+5,2,2,'#000');R(x+8,y+5,2,2,'#000');R(x+2,y+3,4,1,'#000');R(x+8,y+3,4,1,'#000');
  R(x+4,y+8,6,3,'#fff');R(x+6,y+8,2,3,wd.gl);
  const f=(e.f>>3)&1;R(x+(f?0:2),y+12,5,2,'#222');R(x+(f?9:7),y+12,5,2,'#222');
  if(e.t){c.fillStyle='#eee';for(let k=0;k<3;k++){c.beginPath();c.moveTo(x+1+k*4.5,y);c.lineTo(x+3.5+k*4.5,y-5);c.lineTo(x+6+k*4.5,y);c.fill()}}
}
function pill(x,y,a,b){R(x,y,4,4,a);R(x+4,y,4,4,b)}
function bottle(x,y){R(x+2,y,6,3,'#e33');R(x+1,y+3,8,11,'#fff');R(x+4,y+6,2,5,'#e33');R(x+3,y+8,4,1,'#e33')}
function cab(x,y){R(x,y,44,60,'#ddd');R(x+3,y+3,38,54,'#222');R(x+6,y+8,32,3,'#bbb');R(x+6,y+28,32,3,'#bbb');R(x+6,y+48,32,3,'#bbb');R(x-12,y,12,60,'#fff');R(x-9,y+24,6,12,'#e33');R(x-12,y+27,12,6,'#e33')}

function lion(x,y,d,s,bag,f){
  const r=(a,b,w,h,k)=>R(x+(d>0?a:22-a-w)*s,y+b*s,Math.ceil(w*s),Math.ceil(h*s),k);
  r(1,0,20,15,'#b85a10');r(4,2,14,12,'#f0b840');r(5,0,3,3,'#f0b840');r(14,0,3,3,'#f0b840');
  r(6,6,3,3,'#fff');r(13,6,3,3,'#fff');r(7,7,2,2,'#000');r(14,7,2,2,'#000');r(9,10,4,2,'#7a2a00');r(10,12,2,1,'#fff');
  r(4,15,14,11,'#1d4f91');r(9,17,2,6,'#fff');r(9,17,5,2,'#fff');r(9,20,5,2,'#fff');
  r(5,26,5,6,'#143a70');r(12,26,5,6,'#143a70');r(f?4:6,31,5,1,'#000');r(18,24,6,2,'#b85a10');
  if(bag){r(17,14,10,10,'#8a5a2a');r(21,11,3,3,'#2a2')}}
function stash(x,y){R(x,y,11,3,'#555');R(x+1,y+3,9,11,'#cfe8d8');R(x+2,y+6,7,7,'#2a8a2a');R(x+4,y+4,3,3,'#3ac03a')}
function book(x,y){R(x,y,8,6,'#fff');R(x,y,2,6,'#1d4f91');R(x+3,y+2,4,1,'#1d4f91')}
const shot=(x,y)=>ng?leaf(x,y):inv?book(x,y):pill(x,y,'#e33','#fff');
// ---- cutscenes ----
const wk=t=>(t>>3)&1;
const INTRO=[
 {room:1,t:'Maurício acordou com uma dor de cabeça terrível e foi correndo até o armário de remédios.',d:t=>{cab(200,100);mau(30+Math.min(t,110),144,1,wk(t))}},
 {room:1,t:'Vazio! Só restou um bilhete: “Levei tudo. Atenciosamente, Dr. Receitus”.',d:t=>{cab(200,100);R(150,110,26,20,'#fff');R(154,116,18,2,'#999');R(154,121,12,2,'#999');mau(120,144,1,0)}},
 {t:'Pela janela, Maurício viu o doutor fugindo com a sacola de remédios!',d:t=>{doc(W-t*2.4,128,-1,1,1,wk(t));mau(40,144,1,0);if(t>60)tx('!!',50,138,'#fff')}},
 {t:'Maurício jurou recuperar tudo. Cinco mundos até o consultório do Dr. Receitus. Bora!',d:t=>{mau(40+t*2.2,144,1,wk(t)>0?1:0)}}];
const OUTRO=[
 {t:'Derrotado, o Dr. Receitus devolveu a sacola inteira. “Tá bom, tá bom… pode levar”, resmungou.',d:t=>{doc(200,128,-1,1,0,0);R(210,155,10,2,'#fff');mau(120,144,1,0);bottle(136,136)}},
 {t:'Maurício tomou o remédio, a dor passou e ele finalmente dormiu em paz. FIM.',d:t=>{R(100,140,80,16,'#e8341c');R(100,134,26,10,'#fff');mau(106,128,1,0);tx('Zzz',190-(t%60)/3,120-(t%60)/2,'#fff')}}];
const INV_INTRO=[
 {room:1,t:'Maurício chegou em casa e foi direto buscar a sua erva, guardada no fundo do armário.',d:t=>{cab(200,100);mau(30+Math.min(t,110),144,1,wk(t))}},
 {room:1,t:'Sumiu! Só restou uma cartilha: “Diga não às drogas. Assinado: Leão do PROERD”.',d:t=>{cab(200,100);R(150,108,26,24,'#fff');R(150,108,5,24,'#1d4f91');R(158,116,14,2,'#1d4f91');mau(120,144,1,0)}},
 {t:'Pela janela, Maurício viu o Leão do PROERD fugindo com o pote!',d:t=>{lion(W-t*2.4,128,-1,1,1,wk(t));mau(40,144,1,0);if(t>60)tx('!!',50,138,'#fff')}},
 {t:'Cinco mundos até o quartel do PROERD. Maurício vai recuperar o que é dele!',d:t=>{mau(40+t*2.2,144,1,wk(t))}}];
const INV_OUTRO=[
 {t:'Derrotado, o Leão do PROERD devolveu o pote. “Eu só queria dar a palestra…”, murmurou.',d:t=>{lion(200,128+14,-1,.55,0,0);mau(120,144,1,0);stash(136,136)}},
 {t:'Maurício guardou o que era dele e foi pra casa em paz. FIM (versão invertida).',d:t=>{mau(150,144,1,0);stash(170,146)}}];
function leaf(x,y){R(x,y,6,3,'#2fa82f');R(x+1,y+1,4,1,'#8af08a')}
function plant(x,y,d,s,f){
  const r=(a,b,w,h,k)=>R(x+a*s,y+b*s,Math.ceil(w*s),Math.ceil(h*s),k),cx=x+11*s,cy=y+18*s;
  r(5,24,12,8,'#8a4a1a');r(4,24,14,2,'#a0602a');r(10,18,2,6,'#1a6a1a');
  [[-75,8],[-50,12],[-25,15],[0,17],[25,15],[50,12],[75,8]].forEach(([a,l])=>{
    const t=a*Math.PI/180+Math.sin(tm/20+a)*.06,ex=cx+Math.sin(t)*l*s*1.15,ey=cy-Math.cos(t)*l*s*1.15,px=Math.cos(t)*2.4*s,py=Math.sin(t)*2.4*s,mx=cx+(ex-cx)*.5,my=cy+(ey-cy)*.5;
    c.fillStyle='#2fa82f';c.beginPath();c.moveTo(cx,cy);c.lineTo(mx+px,my+py);c.lineTo(ex,ey);c.lineTo(mx-px,my-py);c.closePath();c.fill();
    c.strokeStyle='#8af08a';c.lineWidth=Math.max(.5,s*.6);c.beginPath();c.moveTo(cx,cy);c.lineTo(ex,ey);c.stroke()});
  r(7,10,3,3,'#fff');r(12,10,3,3,'#fff');r(8,11,2,2,'#c00');r(13,11,2,2,'#c00');r(6,8,5,1,'#000');r(12,8,5,1,'#000');r(f?4:6,31,5,1,'#000')}
const NG_INTRO=[
 {room:1,t:'Meses depois, o pote esquecido na janela cresceu… e cresceu… e cresceu.',d:t=>{const s=Math.min(1,.3+t/150);plant(190,160-32*s,-1,s,0)}},
 {t:'A planta tomou o quartel do PROERD e dominou o Leão. O verdadeiro chefe tinha acordado.',d:t=>{plant(190,128,-1,1,wk(t));lion(120,128,1,1,0,wk(t))}},
 {t:'Maurício respirou fundo. Dessa vez é uma vida só e um mundo inteiro de inimigos.',d:t=>{mau(40+t*2.2,144,1,wk(t))}}];
const NG_OUTRO=[
 {t:'A Planta murchou. O Leão do PROERD, livre do feitiço, pediu desculpas e saiu de férias.',d:t=>{plant(190,146,-1,.55,0);lion(100+t*1.2,128,1,1,0,wk(t));mau(40,144,1,0)}},
 {t:'Maurício zerou tudo e virou lenda. FIM… ou será que não?',d:t=>{mau(150,144,1,0);tx('★',130+Math.sin(t/10)*6,110,'#fcd800','center',12);tx('★',170-Math.sin(t/10)*6,100,'#fcd800','center',12)}}];
const IMP_OUTRO=OUTRO.concat([{t:'Modo Impossível zerado, com uma vida só. Maurício é uma lenda.',d:t=>{mau(150,144,1,0);tx('★',130+Math.sin(t/10)*6,110,'#fcd800','center',12)}}]);
function cut(s,done){st='cut';cutS=s;cutI=0;cutT=0;cutC=0;cutDone=done;show(null)}
function adv(){
  if(st==='cut'){const l=cutS[cutI].t.length;if(cutC<l){cutC=l;return}cutI++;cutT=0;cutC=0;if(cutI>=cutS.length)cutDone()}
  else if(st==='card'&&cardT>20){over?toMenu():startLevel()}
}
function wrap(s,mw){const o=[];let l='';for(const w of s.split(' ')){if(c.measureText(l+w).width>mw){o.push(l.trim());l=''}l+=w+' '}o.push(l.trim());return o}
function rCut(){
  const s=cutS[cutI];
  s.room?setBg('#e8d8b0','#8a5a2a','#5a3a1a'):setBg('#5c94fc','#c84c0c','#58c030');
  if(s.room){R(0,0,W,H,'#e8d8b0');R(0,160,W,32,'#8a5a2a');R(0,158,W,3,'#5a3a1a')}else{sky('#5c94fc',0);for(let x=0;x<W;x+=T){gnd(x,160,1);gnd(x,176,0)}}
  s.d(cutT);
  R(8,H-62,W-16,54,'#0d1b4c');R(8,H-62,W-16,2,'#fff');R(8,H-10,W-16,2,'#fff');R(8,H-62,2,54,'#fff');R(W-10,H-62,2,54,'#fff');
  c.font='8px "Press Start 2P","Courier New",monospace';
  const ls=wrap(s.t,W-40);let n=Math.floor(cutC);
  ls.forEach((l,i)=>{const p=Math.max(0,Math.min(l.length,n));n-=l.length+1;if(p>0)tx(l.slice(0,p),18,H-44+i*12)});
  if(cutC>=s.t.length&&((tm>>4)&1))tx('▶',W-24,H-14,'#fcd800');
}

// ---- fase ----
const rng=s=>()=>(s=(s*16807)%2147483647)/2147483647;
const sol=(x,y)=>{if(x<0||x>=N)return 1;if(y<0||y>11)return 0;return [1,2,3,4,5,7,8,9,10].includes(g[y][x])};
function mv(e,w,h){
  e.wall=0;e.gr=0;e.x+=e.vx;
  let x0=Math.floor(e.x/T),x1=Math.floor((e.x+w-1)/T),y0=Math.floor(e.y/T),y1=Math.floor((e.y+h-1)/T);
  for(let ty=y0;ty<=y1;ty++)for(let tx2=x0;tx2<=x1;tx2++)if(sol(tx2,ty)){if(e.vx>0)e.x=tx2*T-w;else if(e.vx<0)e.x=(tx2+1)*T;e.wall=1;x0=Math.floor(e.x/T);x1=Math.floor((e.x+w-1)/T)}
  e.y+=e.vy;x0=Math.floor(e.x/T);x1=Math.floor((e.x+w-1)/T);y0=Math.floor(e.y/T);y1=Math.floor((e.y+h-1)/T);
  for(let ty=y0;ty<=y1;ty++)for(let tx2=x0;tx2<=x1;tx2++)if(sol(tx2,ty)){if(e.vy>0){e.y=ty*T-h;e.gr=1;e.vy=0}else if(e.vy<0){e.y=(ty+1)*T;e.vy=0;e.bump=[tx2,ty]}}
}
function build(w){
  const r=rng(w*97+13),b=w===4;N=b?78:96+w*10;
  g=Array.from({length:12},()=>Array(N).fill(0));ens=[];proj=[];items=[];fx=[];pw=[];bul=[];boss=null;cam=0;
  const sp=[],E=(x,t,q)=>ens.push({x:x*T,y:146,vx:-.35-((q||0)%3)*.07,vy:0,t,d:0,f:0});
  for(let i=0;i<N;i++)g[10][i]=g[11][i]=1;
  const safe=N-26;
  for(let i=18;i<safe;i+=7+Math.floor(r()*6))if(r()<.55+w*.05){const gw=2+(w>1&&r()<.5?1:0);for(let k=0;k<gw;k++)g[10][i+k]=g[11][i+k]=0}
  const ok=(a,b2)=>{for(let k=a;k<=b2;k++)if(!g[10][k])return 0;return 1};
  for(let i=12;i<safe;i+=7+Math.floor(r()*6)){
    const f=r();
    if(f<.3&&ok(i-1,i+3)){const h=2+Math.floor(r()*2);for(let y=10-h;y<10;y++)g[y][i]=g[y][i+1]=7}
    else if(f<.7&&ok(i,i+5)){const pq=r()<.5;for(let k=0;k<4;k++)g[7][i+k]=k===1?3:k===2?(pq?10:3):2;if(pq){if(g[10][i-1]&&!g[9][i-1])g[9][i-1]=4;if(!g[9][i+4])g[9][i+4]=4}}
    if(ok(i+4,i+5))for(let q=0;q<(imp?10:1);q++)sp.push([i+4+q*1.3,(w>0&&r()<.3+w*.08)?1:0,q]);
  }
  if(w===0)g[6][34]=9;
  {const cl=x=>ok(x-1,x+1)&&[7,8,9].every(y=>!g[y][x-1]&&!g[y][x]&&!g[y][x+1]);let dc=30+Math.floor(r()*10);while(dc<safe&&!cl(dc))dc++;if(dc>=safe){dc=29;while(dc>14&&!cl(dc))dc--}g[6][dc]=8}
  if([21,22,23].every(x=>!g[7][x]&&!g[8][x]&&!g[9][x]&&g[10][x])){g[7][21]=2;g[7][22]=10;g[7][23]=2;if(g[10][20]&&!g[9][20])g[9][20]=4;if(g[10][24]&&!g[9][24])g[9][24]=4}
  if(b){boss={x:(N-6)*T,y:128,vx:0,vy:0,hp:imp?15:3,mx:imp?15:3,inv:0,dir:-1,sh:90,t:0,d:0}}
  else{for(let k=0;k<5;k++)for(let y=9-k;y<10;y++)g[y][N-22+k]=4;for(let y=2;y<10;y++)g[y][N-10]=6;flagX=(N-10)*T}
  sp.forEach(([x,t,q])=>{const a=Math.floor(x),b2=Math.floor(x+.9);if(x<safe&&g[10][a]&&g[10][b2]&&!sol(a,9)&&!sol(b2,9)&&!sol(a,8)&&!sol(b2,8))E(x,t,q)});
  if(imp)for(const row of g)for(let x=0;x<N;x++)if(row[x]===10)row[x]=3;
  const pb=P.big?1:0,pg=P.gun?1:0;P={x:32,y:pb?136:144,vx:0,vy:0,dir:1,gr:0,dead:0,jb:0,big:pb,gun:pg,inv:0};
}
const PH=()=>P.big?24:16;
function killP(f){if(P.dead)return;if(!f){if(P.inv>0)return;if(P.big||P.gun){if(P.big)P.y+=8;P.big=0;P.gun=0;P.inv=90;beep(250,.3,'square',.06,100);toast('Perdeu o poder!',1500);return}}P.dead=1;P.vy=-5;P.big=0;P.gun=0;beep(400,.8,'sawtooth',.06,60);if(stat('die')>=10)ach('die10');if(f)ach('pit')}
function hurtBoss(){const b=boss;b.hp--;b.inv=70;beep(120,.3,'square',.08,60);fx.push({x:b.x-6,y:b.y-8,txt:ng?'Folhada!':inv?'Rugiu!':'Receitou!',t:60});if(b.hp<=0){b.d=1;items.push({x:b.x+6,y:146});score+=2000}}
function shoot(){if(st!=='play'||!P.gun||P.dead||bul.length>=2)return;bul.push({x:P.x+(P.dir>0?14:-4),y:P.y+(P.big?15:10),vx:P.dir*4.5,t:0});beep(700,.08,'square',.05,200)}
const drawPw=it=>{const x=Math.round(it.x-cam),y=Math.round(it.y);if(it.k==='m'){R(x,y,12,7,'#e33');R(x+2,y+1,3,3,'#fff');R(x+7,y+2,3,3,'#fff');R(x+2,y+7,8,5,'#f0d8b0');R(x+4,y+8,1,2,'#000');R(x+7,y+8,1,2,'#000')}else{R(x+5,y+6,2,6,'#2a2');R(x+2,y+8,3,2,'#2a2');R(x+3,y,6,6,'#f60');R(x+5,y+2,2,2,'#ff0');R(x+2,y+2,2,2,'#f60');R(x+8,y+2,2,2,'#f60')}};
const hit=(a,aw,ah,b,bw,bh)=>a.x<b.x+bw&&a.x+aw>b.x&&a.y<b.y+bh&&a.y+ah>b.y;
function upPlay(){
  if(P.dead){P.dead++;P.vy+=.3;P.y+=P.vy;if(P.dead>110)lose();return}
  if(P.inv>0)P.inv--;
  const tg=((keys.r?1:0)-(keys.l?1:0))*(keys.run?2.1:1.4);
  P.vx+=(tg-P.vx)*(P.gr?.18:.08);if(tg)P.dir=tg>0?1:-1;
  if(P.jb>0){P.jb--;if(P.gr){P.vy=hj?-7:-5.6;P.jb=0;beep(300,.16,'square',.05,700)}}
  P.vy=Math.min(6,P.vy+(keys.j&&P.vy<0?.2:.42));
  P.bump=0;mv(P,12,PH());
  if(P.x<cam){P.x=cam;P.vx=0}
  if(P.bump){const[a,b]=P.bump,t=g[b][a];
    if(t===10){g[b][a]=5;pw.push(P.big?{k:'f',x:a*T+2,y:b*T-12,vx:0,vy:0}:{k:'m',x:a*T+2,y:b*T-12,vx:.6,vy:0});beep(500,.2,'sine',.08,900)}
    if(t===8){g[b][a]=5;DIGF[wi]=CODE[wi];try{localStorage.setItem('mauDig',JSON.stringify(DIGF))}catch(e){}ach('dig');if(CODE.every((_,i)=>DIGF[i]!=null))ach('vault');fx.push({x:a*T-30,y:b*T-8,txt:'SENHA '+(wi+1)+': '+CODE[wi],t:150});toast('Mundo '+(wi+1)+': o número é '+CODE[wi]+'. Anote!',4500);beep(988,.1);setTimeout(()=>beep(1319,.3),100)}
    if(t===3||t===9){g[b][a]=5;if(t===9){if(!imp)lives++;fx.push({x:a*T,y:b*T-8,txt:'1UP!',t:60});beep(660,.4)}else{coins++;score+=200;if(coins>=25)ach('coin');fx.push({x:a*T,y:b*T-8,txt:'+200',t:40});beep(988,.08);if(coins>=100){coins=0;if(!imp)lives++}}}}
  cam=Math.max(cam,Math.min(N*T-W,P.x-140));
  if(P.y>H+20)killP(1);
  for(const e of ens){
    if(e.d>0){e.d--;if(!e.d)e.rm=1;continue}
    if(!e.on&&Math.abs(e.x-cam-W/2)>W*.75)continue;e.on=1;e.f++;
    e.vy=Math.min(5,e.vy+.3);mv(e,14,14);if(e.wall)e.vx*=-1;
    if(!P.dead&&hit(P,12,PH(),e,14,14)){
      if(P.vy>0&&P.y+PH()<e.y+11&&!e.t){e.d=25;P.vy=-3.6;score+=100;if(stat('stomp')>=10)ach('stomp');beep(200,.1,'square',.06,80);fx.push({x:e.x-20,y:e.y-8,txt:WL()[wi].e[e.t],t:70})}else killP()}
  }
  ens=ens.filter(e=>!e.rm&&e.y<H+40);
  if(boss){const b=boss;
    if(!b.d){
      b.t++;b.inv=Math.max(0,b.inv-1);b.vx=b.dir*(imp?1:.7);if(b.x<(N-24)*T)b.dir=1;if(b.x>(N-4)*T)b.dir=-1;
      b.vy=Math.min(5,b.vy+.3);mv(b,22,32);if(b.wall)b.dir*=-1;if(b.gr&&b.t%140===0)b.vy=-5.5;
      if(--b.sh<=0){b.sh=imp?65:95;const dx=P.x<b.x?-1:1;proj.push({x:b.x+(dx<0?0:20),y:b.y+8,vx:dx*1.8,vy:-2.6});beep(150,.2,'sawtooth',.04,300)}
      if(!P.dead&&hit(P,12,PH(),b,22,32)){
        if(P.vy>0&&P.y+PH()<b.y+16&&!b.inv){b.hp--;b.inv=80;P.vy=-5.5;beep(120,.3,'square',.08,60);fx.push({x:b.x-6,y:b.y-8,txt:ng?'Folhada!':inv?'Rugiu!':'Receitou!',t:60});
          if(b.hp<=0){b.d=1;items.push({x:b.x+6,y:146});score+=2000}}
        else if(!b.inv)killP()}
    }
  }
  pw.forEach(it=>{if(it.k==='m'){it.vy=Math.min(5,it.vy+.3);mv(it,12,12);if(it.wall)it.vx*=-1}
    if(!P.dead&&hit(P,12,PH(),it,12,12)){it.rm=1;score+=1000;beep(660,.1);setTimeout(()=>beep(990,.3),100);if(!P.big){P.big=1;P.y-=8}
      if(it.k==='m'){ach('mush');toast('Cogumelo! Maurício cresceu.',2200)}else{ach('gun');P.gun=1;toast('Flor da Pistola! Aperte F ou K pra atirar.',3500)}}});
  pw=pw.filter(i=>!i.rm&&i.y<H+30);
  bul.forEach(q=>{q.x+=q.vx;q.t++;if(sol(Math.floor(q.x/T),Math.floor(q.y/T))||q.t>70){q.rm=1;return}
    for(const e of ens)if(!e.d&&hit({x:q.x,y:q.y},3,2,e,14,14)){e.d=25;q.rm=1;score+=100;beep(200,.1,'square',.06,80);fx.push({x:e.x-20,y:e.y-8,txt:WL()[wi].e[e.t],t:70});return}
    if(boss&&!boss.d&&!boss.inv&&hit({x:q.x,y:q.y},3,2,boss,22,32)){q.rm=1;hurtBoss()}});
  bul=bul.filter(q=>!q.rm);
  proj.forEach(p=>{p.vy+=.12;p.x+=p.vx;p.y+=p.vy;if(!P.dead&&hit(P,12,PH(),p,8,4))killP()});
  proj=proj.filter(p=>p.y<158&&p.x>cam-20&&p.x<cam+W+20);
  for(const it of items)if(!P.dead&&hit(P,12,PH(),{x:it.x,y:it.y},10,14)){beep(880,.5,'sine',.1);return levelWin()}
  if(!boss&&P.x+6>=flagX&&!P.dead){beep(660,.6,'sine',.1);score+=1000;return levelWin()}
  fx.forEach(f=>{f.t--;f.y-=.3});fx=fx.filter(f=>f.t>0);
}
function rPlay(){
  setBg(SKY(),'#c84c0c','#58c030');
  sky(SKY(),cam);tiles(cam);
  items.forEach(it=>(inv?stash:bottle)(it.x-cam,it.y));
  pw.forEach(drawPw);
  ens.forEach(e=>drawEn(e,cam));
  bul.forEach(q=>R(q.x-cam,q.y,4,2,'#ff0'));
  if(boss){const b=boss;if(!b.d){if(!b.inv||((b.t>>2)&1))(ng?plant:inv?lion:doc)(b.x-cam,b.y,b.dir<0?-1:1,1,0,(b.t>>3)&1)}else (ng?plant:inv?lion:doc)(b.x-cam,b.y+14,-1,.55,0,0)}
  proj.forEach(p=>shot(p.x-cam,p.y));
  if((!P.dead||P.dead<110)&&(P.inv<=0||(tm>>2)&1)){const px=Math.round(P.x-cam),py=Math.round(P.y),f=P.gr&&Math.abs(P.vx)>.3?((tm>>2)&1):0;
    if(P.big){c.save();c.translate(0,py);c.scale(1,1.5);mau(px,0,P.dir,f);c.restore()}else mau(px,py,P.dir,f);
    if(P.gun){const gy=py+(P.big?13:9),o=P.dir>0?9:-3;R(px+o,gy,6,3,'#555');R(px+o+(P.dir>0?0:2),gy+3,2,3,'#333');R(px+o+(P.dir>0?5:0),gy-1,1,2,'#999')}}
  fx.forEach(f=>tx(f.txt,f.x-cam,f.y,'#fff','left',7));
  tx('MAURICIO',12,16);tx(String(score).padStart(6,'0'),12,28);
  tx('● x'+String(coins).padStart(2,'0'),110,28,'#fcd800');
  tx('MUNDO '+(wi+1)+'-1',190,16);tx(imp?'1 VIDA':'VIDAS x'+lives,190,28);if(imp)tx(ng?'NG+ IMPOSSIVEL':'IMPOSSIVEL',110,40,'#f55','left',7);if(P.gun)tx('[F] ATIRAR',190,40,'#ff0','left',7);else if(P.big)tx('GRANDE',190,40,'#9f9','left',7);
  if(boss&&!boss.d){tx(ng?'PLANTA':inv?'LEAO':'DR',W-100,50,'#fff','left',7);R(W-100,54,84,6,'#400');R(W-100,54,Math.max(0,84*boss.hp/boss.mx),6,'#e33');R(W-100,54,84,1,'#fff')}
}

// ---- fluxo ----
function startLevel(){ach('first');build(wi);st='play';show(null);document.body.classList.add('playing')}
function card(){st='card';cardT=0;over=0;setSave(wi);show(null);document.body.classList.remove('playing')}
function levelWin(){wi++;if(wi===3)ach('half');
  if(wi>=5){setSave(0);const k=ng?'ng':inv?'inv':imp?'imp':'norm';AD.beat[k]=1;if(!inv)ach('boss');ach(k==='norm'?'boss':k);
    if(AD.beat.norm&&AD.beat.imp&&AD.beat.inv&&!AD.beat.unlock){AD.beat.unlock=1;ach('unlock');toast('NG+ liberado no Cofre Secreto!',4500)}
    saveA();cut(ng?NG_OUTRO:inv?INV_OUTRO:imp?IMP_OUTRO:OUTRO,toMenu)}else card()}
function lose(){lives--;if(lives<0){st='card';over=1;cardT=0;document.body.classList.remove('playing')}else build(wi)}
function toMenu(){st='menu';over=0;inv=0;imp=0;ng=0;document.documentElement.style.filter='';show('menu');refresh();document.body.classList.remove('playing')}
function rCard(){
  setBg('#000','#000','#000');R(0,0,W,H,'#000');const d=WL()[wi];
  if(over){tx('FIM DE JOGO',W/2,80,'#e8341c','center',16);tx(ng?'A Planta tomou conta de tudo.':inv?'O Leão do PROERD ficou com tudo.':'O Dr. Receitus ficou com tudo.',W/2,112,'#fff','center');tx('Toque ou Enter',W/2,150,'#fcd800','center',7);return}
  if(imp)tx(ng?'NG+ IMPOSSIVEL':'MODO IMPOSSIVEL',W/2,34,'#f55','center',8);tx('MUNDO '+(wi+1)+'-1',W/2,56,'#fff','center',16);tx(d.n,W/2,80,'#fcd800','center');
  tx('Inimigos:',W/2,104,'#fff','center',7);tx(d.e[0],W/2,118,'#9fd','center',7);tx(d.e[1]+' (espinhos)',W/2,130,'#f99','center',7);
  if(wi===4)tx(ng?'BOSS: A Planta':inv?'BOSS: Leão do PROERD':'BOSS: Dr. Receitus',W/2,148,'#e8341c','center',7);
  mau(W/2-6,158,1,wk(cardT));tx('x '+(imp?1:Math.max(0,lives)),W/2+16,170,'#fff','left',8);
}
const refresh=()=>{$('#bCont').disabled=sv()<=0};
function startInv(n){P={};inv=1;imp=n?1:0;ng=n?1:0;document.documentElement.style.filter=n?'':'hue-rotate(95deg) saturate(1.25)';wi=0;lives=n?0:3;coins=0;score=0;cut(n?NG_INTRO:INV_INTRO,card)}
function newGame(){P={};imp=0;ng=0;wi=0;lives=3;coins=0;score=0;setSave(0);cut(INTRO,card)}

// ---- menu ----
function rMenu(){
  setBg('#5c94fc','#c84c0c','#58c030');
  const sc=tm*.8,o=sc%T,dx=x0=>((x0-sc)%480+480)%480-80;
  sky('#5c94fc',sc);
  for(let x=-1;x<=W/T+1;x++){gnd(x*T-o,160,1);gnd(x*T-o,176,0)}
  [80,330].forEach(b=>{const x=dx(b);R(x,150,34,10,'#2fa020');R(x+4,144,26,8,'#2fa020');R(x+11,139,12,6,'#2fa020');R(x+6,146,3,3,'#58c030');R(x+20,148,3,3,'#58c030')});
  {const x=dx(140);gnd(x,96,0);R(x+T,96,T,T,'#fcb800');tx('?',x+T+8,109,'#7a2c04','center');gnd(x+2*T,96,0)}
  {const x=dx(250),bob=(Math.sin(tm/35)+1)*14;doc(x+5,128-bob,1,1,0,wk(tm));
   R(x,128,32,32,'#00a800');R(x-2,128,36,10,'#00c800');R(x+4,138,4,22,'#58e058');R(x+26,138,4,22,'#006800');R(x-2,136,36,2,'#006800')}
  const mx=((tm*.7)%(W+40))-20,ex=(((420-1.15*tm)%480)+480)%480-70;
  if(!mj&&ex-mx>6&&ex-mx<26)mj=30;
  {const sw=wi;wi=0;drawEn({x:ex,y:146,d:0,t:0,f:tm},0);wi=sw}
  const jy=mj>0?Math.sin((30-mj)/30*Math.PI)*34:0;if(mj>0)mj--;
  rMenu.m={x:mx,y:144-jy};mau(mx,144-jy,1,wk(tm));
  if(rainT>0){rainT--;if(rainT%3===0)rain.push({x:Math.random()*W,y:-6,v:1.5+Math.random()*2,a:'#e33',b:'#fff'})}
  rain.forEach(p=>{p.y+=p.v;pill(p.x,p.y,p.a,p.b)});rain=rain.filter(p=>p.y<H);
}
cv.addEventListener('pointerdown',e=>{
  const b=cv.getBoundingClientRect(),lx=(e.clientX-b.left)/b.width*W,ly=(e.clientY-b.top)/b.height*H;
  if(st==='cut'||st==='card')return adv();
  if(st!=='menu')return;
  const m=rMenu.m;if(m&&lx>m.x-4&&lx<m.x+16&&ly>m.y-4&&ly<m.y+20){mj=30;beep(300,.16,'square',.05,700);return egg('mau','Maurício: “Eu tô com dor de cabeça, não me chama pra pular!”')}
  for(const k of clouds)if(lx>k.x&&lx<k.x+k.w&&ly>k.y-5&&ly<k.y+k.h){return egg('nuv','Essa nuvem parece um comprimido gigante.')}
});
addEventListener('pointerdown',e=>{if((st==='cut'||st==='card')&&e.target!==cv)adv()});

// ---- entrada ----
const KM={ArrowLeft:'l',a:'l',A:'l',ArrowRight:'r',d:'r',D:'r',ArrowUp:'j',w:'j',W:'j',z:'j',Z:'j',' ':'j',Shift:'run',x:'run',X:'run',f:'s',F:'s',k:'s',K:'s'};
addEventListener('keydown',e=>{
  if(e.key===' '||e.key.startsWith('Arrow'))e.preventDefault();
  if(st==='cut'||st==='card'){if(e.key==='Enter'||e.key===' ')adv();return}
  if(st==='menu'){ks=(ks+({ArrowUp:'U',ArrowDown:'D',ArrowLeft:'L',ArrowRight:'R'}[e.key]||(e.key.length===1?e.key.toLowerCase():''))).slice(-14);
    if(ks.endsWith('remedio')){rainT=260;egg('rem','Chuva de remédios! Toma um, Maurício.')}
    if(ks.endsWith('UUDDLRLRba')){hj=1;egg('kon','PULO TURBO ativado! Maurício tomou café.')}}
  const k=KM[e.key];if(k){keys[k]=1;if(k==='j'&&st==='play'&&!e.repeat)P.jb=7;if(k==='s'&&!e.repeat)shoot()}
});
addEventListener('keyup',e=>{const k=KM[e.key];if(k)keys[k]=0});
const tb=(id,k)=>{const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();keys[k]=1;if(k==='j'&&st==='play')P.jb=7;if(k==='s')shoot()});['pointerup','pointerleave','pointercancel'].forEach(v=>b.addEventListener(v,()=>keys[k]=0))};
tb('#tl','l');tb('#tr','r');tb('#tj','j');tb('#ts','s');
$('#bNew').onclick=newGame;
$('#bCont').onclick=()=>{P={};imp=0;ng=0;wi=Math.min(4,sv());lives=3;coins=0;score=0;card()};
$('#bCtl').onclick=()=>show('controls');
$('#bCred').onclick=()=>show('credits');
$('#bImp').onclick=()=>{P={};imp=1;ng=0;wi=0;lives=0;coins=0;score=0;cut(INTRO,card)};
$('#bAch').onclick=()=>{drawAch();show('ach')};
function refreshInv(){const b=AD.beat,u=!!b.unlock;$('#bNG').disabled=!u;$('#bNG').textContent=u?'NG+ Invertido':'NG+ (bloqueado)';$('#ngInfo').textContent=u?'NG+ liberado! 1 vida, sem poderes, 10x inimigos e a Planta como chefe real.':'NG+ libera ao zerar: Normal '+(b.norm?'[x]':'[ ]')+'  Impossível '+(b.imp?'[x]':'[ ]')+'  Invertido '+(b.inv?'[x]':'[ ]')}
$('#bInv').onclick=()=>startInv(0);$('#bNG').onclick=()=>startInv(1);
const REPO='gabrielaraujo-eng/Curso_senai'; // MUDE AQUI: usuario/repositorio que recebe as sugestões
$('#bSug').onclick=()=>{show('suggest');$('#sugTxt').focus()};
['#sugTxt','#sugNome'].forEach(q=>{const el=$(q);['keydown','keyup'].forEach(v=>el.addEventListener(v,e=>e.stopPropagation()))});
$('#bSend').onclick=()=>{
  const t=$('#sugTxt').value.trim(),n=$('#sugNome').value.trim()||'anônimo';
  if(t.length<5)return toast('Escreva sua sugestão primeiro.',2000);
  const body='**Sugestão para “Maurício e os Remédios Roubados”**\n\n'+t+'\n\n— '+n;
  try{navigator.clipboard&&navigator.clipboard.writeText(body)}catch(e){}
  if(REPO.includes('NOME-DO-REPO'))return toast('O destino ainda não foi configurado. Sua sugestão foi copiada.',4000);
  window.open('https://github.com/'+REPO+'/issues/new?title='+encodeURIComponent('[SuperMauricio] Sugestão: '+t.slice(0,50))+'&body='+encodeURIComponent(body),'_blank','noopener');
  toast('Abrindo o GitHub. Clique em “Submit new issue” para enviar!',4500);ach('sug');$('#sugTxt').value=''};
const pins=[...document.querySelectorAll('#pin input')];
pins.forEach((p,i)=>{p.addEventListener('input',()=>{p.value=p.value.replace(/\D/g,'');if(p.value&&pins[i+1])pins[i+1].focus()});p.addEventListener('keydown',e=>{if(e.key==='Backspace'&&!p.value&&pins[i-1])pins[i-1].focus();if(e.key==='Enter')$('#bPin').click();e.stopPropagation()})});
$('#sec').onclick=()=>{$('#pinInfo').textContent='Números achados: '+CODE.map((d,i)=>'M'+(i+1)+'='+(DIGF[i]!=null?d:'?')).join('  ');pins.forEach(p=>p.value='');show('secret');pins[0].focus()};
$('#bPin').onclick=()=>{if(pins.map(p=>p.value).join('')===CODE.join('')){beep(660,.15);setTimeout(()=>beep(990,.4),150);refreshInv();show('invmenu')}else{beep(120,.3,'sawtooth',.06,60);toast('Senha errada.',1800)}};
$('#nick').onclick=()=>{if(++nickN>=3){nickN=0;egg('jaco','jaco: “fiz esse jogo pra ninguém ficar sem remédio.”')}};
document.querySelectorAll('.back').forEach(b=>b.onclick=toMenu);

// ---- loop ----
function frame(now){
  acc+=Math.min(now-last,50);last=now;
  while(acc>=16.67){acc-=16.67;tm++;
    if(st==='play')upPlay();
    else if(st==='cut'){cutT++;cutC+=.6}
    else if(st==='card')cardT++}
  c.clearRect(0,0,W,H);
  if(st==='menu')rMenu();else if(st==='cut')rCut();else if(st==='card')rCard();else if(st==='play')rPlay();
  requestAnimationFrame(frame)
}
upE();refresh();requestAnimationFrame(t=>{last=t;frame(t)});
})();
