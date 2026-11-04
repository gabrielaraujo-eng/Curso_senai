(() => {
const $ = s => document.querySelector(s);
const cv = $('#cv'), ctx = cv.getContext('2d');
let W, H;
const resize = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
addEventListener('resize', resize); resize();

// ---------- dados ----------
const KEY = 'cincoHorasSave2', HOUR = 50;
const CLK = ['12:00 AM','1:00 AM','2:00 AM','3:00 AM','4:00 AM','5:00 AM'];
const SP = [[5,9],[4,8],[3.5,6.5],[2.5,5],[2,4]], FILL = [7,6,5,4.2,3.5], MAXA = [1,2,2,2,3];
const F = [
  {n:'Léo', nick:'O Valentão do 3ºB', info:'Vem pela ESQUERDA. Boné vermelho, risada alta e zero vergonha. Pichou o banheiro inteiro.', skin:'#d8a47a', hair:'#2a170c', st:'cap', cap:'#b3261e', shoe:'#c62828'},
  {n:'Dudu', nick:'O Fofoqueiro', info:'Vem pela PORTA. Já postou no grupo antes de você abrir a torneira.', skin:'#f1cba6', hair:'#d9ad2b', st:'spiky', shoe:'#eeeeee'},
  {n:'Matheus', nick:'O CDF', info:'Vem pela DIREITA. Quieto, de óculos, filma em 4K e estabiliza a imagem.', skin:'#8a5836', hair:'#0e0e0e', st:'short', shoe:'#1565c0', glasses:1}
];
const LINES = {
  start:['Só mais um pouquinho...','Por que eu bebi tanto guaraná?','Noite do Pijama. Ótima ideia, né.'],
  steps:['Eu ouvi tênis no corredor?','Alguém tá cochichando...','Essa risadinha eu conheço...','Ai não. A turma veio.'],
  hit:['SAI DAQUI, CARA!','Vai gravar a sua mãe!','Toma! Isso é pela prova surpresa!'],
  miss:['Bati no vento. Que mico.','Nada ali... eu acho.'],
  shy:['Fugiu. Covarde.','Foi chamar a inspetora, aposto.','Tá, vazou.'],
  hour:['','1 AM. Dona Neide já deve estar dormindo...','2 AM. Esse banheiro é assombrado mesmo.','3 AM. Já virou cachoeira.','4 AM. Quase tocando o sinal. Aguenta.']
};
const rnd = (a,b) => a + Math.random()*(b-a);
const pick = a => a[Math.floor(Math.random()*a.length)];

let mode = 'menu', hour = 0, elapsed = 0, T = 0, look = 0, mouseT = 0, usingMouse = false;
let kL = false, kR = false, kC = false, cd = 0, swing = 0, swingDir = 0, hitTxt = 0;
let flk = 0, danger = 0, pulse = 0, hbT = 1, scareT = 0, scareI = 0, last = 0, raf = 0, subTimer;
let spots = [], gazeX = 0, pendingH = 0, castIv = 0, menuRaf = 0, mmx = -1, ks = '', signN = 0, nickN = 0;

// ---------- áudio ----------
let AC, master, nb;
function initAudio() {
  if (AC) { AC.resume(); return; }
  AC = new (window.AudioContext || window.webkitAudioContext)();
  master = AC.createGain(); master.gain.value = 0; master.connect(AC.destination);
  nb = AC.createBuffer(1, AC.sampleRate*2, AC.sampleRate);
  const d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random()*2-1;
  const loop = (freq, type, vol, lfo) => {
    const s = AC.createBufferSource(); s.buffer = nb; s.loop = true;
    const f = AC.createBiquadFilter(); f.type = type; f.frequency.value = freq;
    const g = AC.createGain(); g.gain.value = vol;
    s.connect(f); f.connect(g); g.connect(master); s.start();
    if (lfo) { const o = AC.createOscillator(), og = AC.createGain(); o.frequency.value = lfo; og.gain.value = vol*.5; o.connect(og); og.connect(g.gain); o.start(); }
  };
  loop(2600, 'bandpass', .03, .35);   // xixi
  loop(220, 'lowpass', .05);          // ventilação
  [50,100].forEach((f,i) => { const o = AC.createOscillator(), g = AC.createGain(); o.frequency.value = f; g.gain.value = .02/(i+1); o.connect(g); g.connect(master); o.start(); });
  (function drip(){ if (mode === 'play') tone(1500, .09, 'sine', .035, rnd(-.8,.8), 650); setTimeout(drip, rnd(2200,5500)); })();
}
const out = (n, pan) => {
  if (AC.createStereoPanner) { const p = AC.createStereoPanner(); p.pan.value = pan||0; n.connect(p); p.connect(master); } else n.connect(master);
};
function tone(f, d, type='sine', v=.1, pan=0, f2) {
  if (!AC) return; const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime;
  o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t+d);
  g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t+d);
  o.connect(g); out(g, pan); o.start(); o.stop(t+d+.02);
}
function burst(d, v, pan, freq, type='lowpass') {
  if (!AC) return; const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(), t = AC.currentTime;
  s.buffer = nb; f.type = type; f.frequency.value = freq;
  g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t+d);
  s.connect(f); f.connect(g); out(g, pan); s.start(0, Math.random()); s.stop(t+d);
}
const steps = p => { for (let k = 0; k < 4; k++) setTimeout(() => burst(.09, .35, (p-1)*.8, 280), k*270); };
const giggle = p => { for (let k = 0; k < 5; k++) setTimeout(() => tone(420+rnd(0,260), .09, 'triangle', .08, (p-1)*.8), 700+k*115); };
const thump = () => { tone(62, .22, 'sine', .35); setTimeout(() => tone(55, .2, 'sine', .25), 170); pulse = 1; };
const setVol = v => { if (master) master.gain.setTargetAtTime(v, AC.currentTime, .3); };

// ---------- legendas ----------
function say(t, ms=2400) {
  const s = $('#sub'); s.textContent = t; s.style.opacity = 1;
  clearTimeout(subTimer); subTimer = setTimeout(() => s.style.opacity = 0, ms);
}

// ---------- desenho ----------
const rr = (c,x,y,w,h,r) => { c.beginPath(); c.roundRect ? c.roundRect(x,y,w,h,r) : c.rect(x,y,w,h); };
function phone(c, x, y, r, t, rec=true) {
  c.save(); c.translate(x, y); c.rotate(-.15);
  if (rec) { const g = c.createRadialGradient(0,0,0,0,0,r*2.2); g.addColorStop(0,'rgba(255,60,60,.28)'); g.addColorStop(1,'rgba(255,60,60,0)'); c.fillStyle = g; c.fillRect(-r*2.2,-r*2.2,r*4.4,r*4.4); }
  c.fillStyle = '#0d0d10'; rr(c,-r*.3,-r*.55,r*.6,r*1.1,r*.1); c.fill();
  c.strokeStyle = '#2a2a30'; c.lineWidth = r*.03; c.stroke();
  c.fillStyle = '#1b1b22'; c.beginPath(); c.arc(-r*.12,-r*.38,r*.11,0,7); c.fill();
  c.strokeStyle = '#555'; c.stroke();
  c.fillStyle = '#3a4a66'; c.beginPath(); c.arc(-r*.12,-r*.38,r*.05,0,7); c.fill();
  c.fillStyle = (Math.floor(t*2)%2) ? '#ff2a2a' : '#4a0a0a'; c.beginPath(); c.arc(r*.14,-r*.44,r*.045,0,7); c.fill();
  c.restore();
}
function head(c, x, y, r, f, t, open=0, hit=false) {
  c.fillStyle = f.skin;
  [-1,1].forEach(s => { c.beginPath(); c.ellipse(x+s*r*.95, y+r*.05, r*.16, r*.24, 0, 0, 7); c.fill(); });
  c.beginPath(); c.ellipse(x, y, r*.95, r*1.08, 0, 0, 7); c.fill();
  const g = c.createLinearGradient(x-r, y, x+r, y);
  g.addColorStop(0,'rgba(0,0,0,.3)'); g.addColorStop(.5,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(0,0,0,.35)');
  c.fillStyle = g; c.beginPath(); c.ellipse(x, y, r*.95, r*1.08, 0, 0, 7); c.fill();
  c.fillStyle = f.hair;
  if (f.st === 'spiky') { c.beginPath(); c.moveTo(x-r, y-r*.2); for (let i = 0; i <= 6; i++) c.lineTo(x-r+i*r/3, y-r*(i%2 ? 1.0 : 1.5)); c.lineTo(x+r, y-r*.2); c.lineTo(x+r*.8, y-r*.55); c.lineTo(x-r*.8, y-r*.55); c.fill(); }
  else if (f.st === 'cap') { c.fillStyle = f.cap; c.beginPath(); c.ellipse(x, y-r*.3, r*1.03, r*.85, 0, Math.PI, 0); c.fill(); c.fillStyle = '#6e1511'; c.beginPath(); c.ellipse(x, y-r*.3, r*1.12, r*.17, 0, 0, 7); c.fill(); }
  else { c.beginPath(); c.ellipse(x, y-r*.35, r*.98, r*.8, 0, Math.PI, 0); c.fill(); }
  const jx = Math.sin(t*3)*r*.02 + gazeX*r*.1;
  [-1,1].forEach(s => {
    c.fillStyle = '#f4f4ee'; c.beginPath(); c.ellipse(x+s*r*.4, y-r*.05, r*.22, r*.17*(1+open*.5), 0, 0, 7); c.fill();
    c.fillStyle = '#120a06'; c.beginPath(); c.arc(x+s*r*.4+jx, y+r*.01, r*.09, 0, 7); c.fill();
    c.strokeStyle = f.hair; c.lineWidth = r*.09; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x+s*r*.66, y-r*.34+open*-r*.05); c.lineTo(x+s*r*.16, y-r*.2); c.stroke();
  });
  if (f.glasses) { c.strokeStyle = '#111'; c.lineWidth = r*.07; [-1,1].forEach(s => { c.beginPath(); c.arc(x+s*r*.4, y-r*.03, r*.27, 0, 7); c.stroke(); }); c.beginPath(); c.moveTo(x-r*.13, y-r*.05); c.lineTo(x+r*.13, y-r*.05); c.stroke(); }
  c.fillStyle = 'rgba(0,0,0,.18)'; c.beginPath(); c.ellipse(x, y+r*.22, r*.1, r*.07, 0, 0, 7); c.fill();
  const mo = open*.45;
  c.save(); c.beginPath(); c.moveTo(x-r*.5, y+r*.4); c.quadraticCurveTo(x, y+r*(.95+mo), x+r*.5, y+r*.4); c.quadraticCurveTo(x, y+r*.5, x-r*.5, y+r*.4);
  c.fillStyle = '#2a0808'; c.fill(); c.clip(); c.fillStyle = '#ecece4'; c.fillRect(x-r*.5, y+r*.38, r, r*.14); c.restore();
  if (hit) { c.fillStyle = 'rgba(220,40,40,.55)'; c.beginPath(); c.ellipse(x+r*.45, y+r*.2, r*.4, r*.3, 0, 0, 7); c.fill(); }
}
function shoe(c, x, y, col, s) {
  c.fillStyle = '#d8d8d0'; rr(c, x-s*1.1, y+s*.5, s*2.2, s*.55, s*.25); c.fill();
  c.fillStyle = col; c.beginPath(); c.ellipse(x, y+s*.55, s*1.0, s*.95, 0, Math.PI, 0); c.fill();
  c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(x+s*.3, y+s*.3, s*.5, s*.4, 0, Math.PI, 0); c.fill();
}
function panel(p, x, t) {
  const c = ctx, s = spots[p], f = F[p], pT = H*.2, pB = H*.8, cx = x + W/2;
  let g = c.createLinearGradient(0,0,0,H); g.addColorStop(0,'#4a5d55'); g.addColorStop(.55,'#2b3a35'); g.addColorStop(1,'#141b19');
  c.fillStyle = g; c.fillRect(x, 0, W, H);
  c.strokeStyle = 'rgba(0,0,0,.28)'; c.lineWidth = 2; const ts = H*.11;
  for (let i = 0; i <= W; i += ts) { c.beginPath(); c.moveTo(x+i,0); c.lineTo(x+i,H); c.stroke(); }
  for (let j = 0; j < H; j += ts) { c.beginPath(); c.moveTo(x,j); c.lineTo(x+W,j); c.stroke(); }
  g = c.createRadialGradient(cx, 0, 0, cx, 0, H*.7); g.addColorStop(0, 'rgba(210,255,230,.28)'); g.addColorStop(1, 'rgba(210,255,230,0)');
  c.fillStyle = g; c.fillRect(x, 0, W, H);
  c.fillStyle = '#1a2522'; c.fillRect(x, pB, W, H-pB);
  if (s.stage >= 2 && s.rise > .01) {
    const r = H*.12, hy = pT - r*.45 + (1-s.rise)*r*2.7, sway = Math.sin(t*1.3+p)*W*.004;
    head(c, cx+sway, hy, r, f, t, s.stage === 2 ? Math.min(1, s.rec*1.2) : 0, s.stage === 3);
    if (s.stage === 2) phone(c, cx+r*1.45+sway, hy+r*.05, r, t);
    else { c.fillStyle = f.skin; c.beginPath(); c.ellipse(cx+r*1.45, hy+r*.6, r*.3, r*.2, 0, 0, 7); c.fill(); }
  }
  if (s.stage >= 1) {
    const sz = H*.045, tap = s.stage === 1 ? Math.max(0, Math.sin(t*5+p))*H*.006 : 0;
    shoe(c, cx-H*.11, pB-H*.012-tap, f.shoe, sz); shoe(c, cx+H*.11, pB-H*.012, f.shoe, sz);
  }
  g = c.createLinearGradient(x, 0, x+W, 0); g.addColorStop(0,'#35514a'); g.addColorStop(.5,'#46665e'); g.addColorStop(1,'#35514a');
  c.fillStyle = g; c.fillRect(x, pT, W, pB-pT);
  c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 3;
  for (let i = W*.1; i < W; i += W*.1) { c.beginPath(); c.moveTo(x+i, pT); c.lineTo(x+i, pB); c.stroke(); }
  c.fillStyle = '#7a9a90'; c.fillRect(x, pT-4, W, 6); c.fillStyle = '#1c2a26'; c.fillRect(x, pB-4, W, 5);
  if (s.stage === 2) { const a = s.rec*.45*(.7+.3*Math.sin(t*10)); g = c.createRadialGradient(cx, pT, 0, cx, pT, H*.5); g.addColorStop(0, 'rgba(255,40,40,'+a+')'); g.addColorStop(1, 'rgba(255,40,40,0)'); c.fillStyle = g; c.fillRect(x, pT, W, H*.6); }
  c.save(); c.translate(cx, H*.5); c.fillStyle = 'rgba(15,20,18,.5)'; c.font = Math.round(H*.035)+'px "Comic Sans MS",cursive'; c.textAlign = 'center';
  if (p === 0) { c.rotate(-.05); c.fillText('LEO FOI AQUI', -W*.1, 0); c.fillText('3ºB manda · recuperação é vida', W*.1, H*.06); }
  if (p === 2) { c.rotate(.04); c.fillText('NÃO OLHE PRA CIMA', 0, 0); c.fillText('Dona Neide vê tudo', 0, H*.06); }
  c.restore();
  if (p === 1) {
    c.fillStyle = '#222c29'; rr(c, cx+W*.12, H*.46, H*.05, H*.12, 6); c.fill();
    c.fillStyle = '#c33'; c.fillRect(cx+W*.12+H*.012, H*.485, H*.026, H*.012);
    c.fillStyle = '#999'; c.beginPath(); c.arc(cx+W*.12+H*.025, H*.54, H*.012, 0, 7); c.fill();
    c.fillStyle = 'rgba(0,0,0,.3)'; c.fillRect(x+W*.08, pT+H*.04, 6, pB-pT-H*.08); c.fillRect(x+W*.92, pT+H*.04, 6, pB-pT-H*.08);
  }
}
function player(t) {
  const c = ctx, b = Math.sin(t*1.6)*H*.004;
  [[.28,-1],[.72,1]].forEach(([px,s]) => {
    const g = c.createLinearGradient(0, H*.84, 0, H); g.addColorStop(0, '#3a5f93'); g.addColorStop(1, '#1d3558');
    c.fillStyle = g; c.beginPath(); c.ellipse(W*px, H*1.0+b, W*.17, H*.17, s*.12, Math.PI, 0); c.fill();
    c.strokeStyle = 'rgba(255,220,120,.3)'; c.lineWidth = 2; c.setLineDash([8,6]);
    c.beginPath(); c.ellipse(W*px, H*1.0+b, W*.15, H*.15, s*.12, Math.PI*1.1, Math.PI*1.9); c.stroke(); c.setLineDash([]);
  });
  c.fillStyle = '#d9a77c'; [[.34,.92],[.66,.92]].forEach(([px,py]) => { c.beginPath(); c.ellipse(W*px, H*py+b, W*.04, H*.03, 0, 0, 7); c.fill(); });
  if (swing > 0) {
    const pr = 1 - swing/.28, e = Math.sin(pr*Math.PI), hx = W/2 + look*W*.18 - swingDir*W*.05 + swingDir*pr*W*.1;
    c.save(); c.translate(hx, H*(1.1-.6*e)); c.rotate(swingDir*(.5-pr)*1.2); c.scale(1+e*.4, 1+e*.4);
    c.fillStyle = '#d9a77c'; rr(c, -W*.05, -H*.1, W*.1, H*.2, W*.03); c.fill();
    for (let i = 0; i < 4; i++) { rr(c, -W*.05+i*W*.026, -H*.2, W*.021, H*.13, W*.01); c.fill(); }
    rr(c, W*.04, -H*.06, W*.04, H*.03, W*.015); c.fill(); c.restore();
  }
  if (hitTxt > 0) { c.save(); c.globalAlpha = Math.min(1, hitTxt*3); c.fillStyle = '#ffe14a'; c.strokeStyle = '#a00'; c.lineWidth = 6; c.font = 'bold '+Math.round(H*.12)+'px Impact,sans-serif'; c.textAlign = 'center'; c.strokeText('PLAF!', W/2, H*.4); c.fillText('PLAF!', W/2, H*.4); c.restore(); }
}
function post(t) {
  const c = ctx; let g = c.createRadialGradient(W/2, H/2, H*.15, W/2, H/2, H);
  g.addColorStop(0, 'rgba(0,0,0,.15)'); g.addColorStop(1, 'rgba(0,0,0,.9)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  if (flk > .02) { c.fillStyle = 'rgba(0,0,0,'+flk+')'; c.fillRect(0, 0, W, H); }
  if (danger > .02) {
    const a = (.08 + .4*danger) * (.6 + .4*pulse);
    g = c.createRadialGradient(W/2, H/2, H*.3, W/2, H/2, H*.95); g.addColorStop(0, 'rgba(160,0,0,0)'); g.addColorStop(1, 'rgba(160,0,0,'+a+')'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  }
  c.fillStyle = 'rgba(255,255,255,.04)'; for (let i = 0; i < 40; i++) c.fillRect(Math.random()*W, Math.random()*H, 2, 2);
}
function scare(t) {
  const c = ctx; c.save(); c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
  c.translate(rnd(-18,18), rnd(-18,18));
  c.fillStyle = 'rgba(140,0,0,'+(.35+.3*Math.sin(t*50))+')'; c.fillRect(-30, -30, W+60, H+60);
  const r = H*.4*(1+t*.3); head(c, W/2, H*.5, r, F[scareI], t, 1.3);
  phone(c, W/2+r*1.3, H*.72, r*.9, t);
  c.fillStyle = 'rgba(255,255,255,'+(.5*Math.max(0, Math.sin(t*30)))+')'; c.fillRect(-30, -30, W+60, H+60);
  c.restore();
  c.fillStyle = '#ff2a2a'; c.font = 'bold '+Math.round(H*.07)+'px "Courier New",monospace'; c.fillText('● REC', W*.05, H*.12);
}

// ---------- lógica ----------
const nearest = () => look < -.5 ? 0 : look > .5 ? 2 : 1;
const lookingAt = p => Math.abs(look - (p-1)) < .35;
const activeCount = () => spots.filter(s => s.stage > 0 && s.stage < 3).length;

function update(dt) {
  const tgt = (kL || kR || kC) ? (kL ? -1 : kR ? 1 : 0) : (usingMouse ? mouseT : 0);
  look += (tgt - look) * Math.min(1, dt*6);
  cd -= dt; swing = Math.max(0, swing - dt); hitTxt = Math.max(0, hitTxt - dt);
  elapsed += dt;
  const h = Math.floor(elapsed / HOUR);
  if (h !== hour) {
    hour = h; $('#clock').textContent = CLK[hour];
    if (hour >= 5) return win();
    try { localStorage.setItem(KEY, hour); } catch (e) {}
    tone(440, 1.2, 'sine', .12); tone(330, 1.6, 'sine', .1); say(LINES.hour[hour], 3200);
  }
  let dmax = 0;
  spots.forEach((s, p) => {
    if (s.stage === 0) {
      s.timer -= dt;
      if (s.timer <= 0 && activeCount() < MAXA[hour]) {
        s.stage = 1; s.t = 0; s.watch = 0; s.rise = 0; s.rec = 0; s.dur = 3.6 - hour*.35 + rnd(0, 1.5);
        steps(p); giggle(p); say(pick(LINES.steps));
      } else if (s.timer <= 0) s.timer = 1;
    } else if (s.stage === 1) {
      s.t += dt; dmax = Math.max(dmax, .25);
      if (lookingAt(p)) s.watch += dt; else s.watch = Math.max(0, s.watch - dt*.5);
      if (s.watch > 1.1) { s.stage = 0; s.timer = rnd(...SP[hour]); burst(.4, .2, (p-1)*.8, 200); say(pick(LINES.shy)); }
      else if (s.t >= s.dur && !lookingAt(p)) { s.stage = 2; s.rec = 0; s.rise = 0; s.beep = 0; tone(90, .5, 'sawtooth', .1, (p-1)*.8, 60); }
    } else if (s.stage === 2) {
      s.rise = Math.min(1, s.rise + dt*3); s.rec += dt / FILL[hour]; s.beep -= dt;
      if (s.beep <= 0) { tone(1800, .05, 'square', .035, (p-1)*.8); s.beep = .9; }
      dmax = Math.max(dmax, s.rec);
      if (s.rec >= 1) return lose(p);
    } else if (s.stage === 3) {
      s.rise = Math.max(0, s.rise - dt*5);
      if (s.rise <= 0) { s.stage = 0; s.timer = rnd(...SP[hour]); }
    }
  });
  danger += (dmax - danger) * Math.min(1, dt*4);
  hbT -= dt; if (hbT <= 0) { thump(); hbT = 1.25 - danger*.9; }
  pulse = Math.max(0, pulse - dt*3);
  if (Math.random() < dt*.35) flk = .55; flk *= .88;
  const n = nearest(); document.querySelectorAll('#dots i').forEach((d, i) => d.classList.toggle('on', i === n));
}
function slap() {
  if (mode !== 'play' || cd > 0) return;
  cd = .55; swing = .28; swingDir = look < 0 ? -1 : 1;
  const p = nearest(), s = spots[p];
  if (lookingAt(p) && s.stage === 2) {
    s.stage = 3; s.rec = 0; hitTxt = .5; burst(.12, .6, 0, 1800, 'highpass'); tone(160, .15, 'square', .2, 0, 60);
    tone(300, .3, 'sawtooth', .08, (p-1)*.8, 120); say(pick(LINES.hit), 1800);
  } else { burst(.2, .15, 0, 900, 'highpass'); if (Math.random() < .6) say(pick(LINES.miss), 1600); }
}
function render(t) {
  ctx.clearRect(0, 0, W, H);
  if (mode === 'scare') { scare(scareT); return; }
  ctx.save(); ctx.translate(-(1+look)*W, 0);
  for (let p = 0; p < 3; p++) panel(p, p*W, T);
  [W, 2*W].forEach(x => { const g = ctx.createLinearGradient(x-W*.04, 0, x+W*.04, 0); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(.5,'rgba(0,0,0,.85)'); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(x-W*.04, 0, W*.08, H); });
  ctx.restore();
  player(T); post(T);
}
function loop(now) {
  if (mode !== 'play' && mode !== 'scare') return;
  const dt = Math.min((now - last)/1000, .05); last = now; T += dt;
  if (mode === 'scare') { scareT += dt; if (scareT > 1.6) { endScare(); return; } }
  else update(dt);
  if (mode === 'play' || mode === 'scare') render(T);
  raf = requestAnimationFrame(loop);
}

// ---------- fluxo ----------
const screens = document.querySelectorAll('.screen'), fade = $('#fade');
const show = id => { screens.forEach(s => s.classList.toggle('active', s.id === id)); if (id === 'menu') startMenu(); };
const go = (id, cb) => { fade.classList.add('on'); setTimeout(() => { show(id); if (cb) cb(); fade.classList.remove('on'); }, 800); };
const getSave = () => { try { return +localStorage.getItem(KEY) || 0; } catch (e) { return 0; } };
const refresh = () => { $('#btnContinue').disabled = getSave() <= 0; };

function typeStory(text, done) {
  const el = $('#storyText'); el.textContent = ''; let i = 0;
  const iv = setInterval(() => {
    el.textContent += text[i++];
    if (i % 3 === 0) tone(rnd(260,320), .03, 'square', .02);
    if (i >= text.length) { clearInterval(iv); setTimeout(done, 1500); }
  }, 36);
}
function startGame(h) {
  initAudio(); pendingH = h;
  go('story', () => {
    typeStory(h > 0 ? 'Você voltou pra cabine do banheiro da escola. São '+CLK[h]+'. O guaraná não perdoa.'
      : 'Noite do Pijama da escola. Meia-noite. Você tomou três copos de guaraná no lanche e correu pro banheiro do 2º andar, aquele que a Dona Neide jura que é assombrado. Trancou a cabine. Lá fora: risadinhas. Léo, Dudu e Matheus viram você entrar, e todos estão com o celular na mão. Aguente até o sinal das 5 da manhã.',
      () => h > 0 ? go(null, begin(h)) : go('cast', drawCast));
  });
}
function portrait(c, f, t) {
  const g = c.createLinearGradient(0,0,0,170); g.addColorStop(0,'#5b7a70'); g.addColorStop(1,'#2b3a35'); c.fillStyle = g; c.fillRect(0,0,180,170);
  c.fillStyle = 'rgba(0,0,0,.2)'; for (let i = 0; i < 180; i += 30) c.fillRect(i,0,2,170);
  c.fillStyle = '#f2f2ee'; c.beginPath(); c.ellipse(90,190,80,64,0,Math.PI,0); c.fill();
  c.fillStyle = '#1d4f91'; c.beginPath(); c.moveTo(66,132); c.lineTo(90,156); c.lineTo(114,132); c.lineTo(104,128); c.lineTo(90,142); c.lineTo(76,128); c.fill();
  c.fillRect(122,150,18,12); c.fillStyle = '#ffe14a'; c.fillRect(125,153,12,3);
  head(c, 90, 76, 42, f, t, 0);
}
function drawCast() {
  const box = $('#cards');
  if (!box.children.length) F.forEach(f => box.insertAdjacentHTML('beforeend', '<div class="card"><canvas width="180" height="170"></canvas><h3>'+f.n+'</h3><em>'+f.nick+'</em><p>'+f.info+'</p></div>'));
  clearInterval(castIv);
  castIv = setInterval(() => { const t = performance.now()/1000; box.querySelectorAll('canvas').forEach((k, i) => { gazeX = Math.sin(t+i)*.6; portrait(k.getContext('2d'), F[i], t); }); gazeX = 0; }, 60);
}
function begin(h) {
  return () => {
    mode = 'play'; hour = h; elapsed = h*HOUR; look = 0; danger = 0; cd = 0; swing = 0; hitTxt = 0; usingMouse = false;
    spots = [0,1,2].map(() => ({ stage: 0, t: 0, timer: rnd(3,6) + 2, rec: 0, rise: 0, watch: 0, dur: 4, beep: 0 }));
    document.body.classList.add('playing'); $('#clock').textContent = CLK[hour];
    const hint = $('#hint'); hint.classList.remove('off'); setTimeout(() => hint.classList.add('off'), 7000);
    setVol(.9); say(h ? 'Continua...' : pick(LINES.start), 3000);
    last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
  };
}
function leave() { mode = 'menu'; cancelAnimationFrame(raf); document.body.classList.remove('playing'); setVol(0); ctx.clearRect(0, 0, W, H); }
function lose(p) {
  mode = 'scare'; scareT = 0; scareI = p; setVol(.9);
  burst(1, .5, 0, 3000, 'highpass'); tone(500, .9, 'sawtooth', .25, 0, 1100); tone(250, .9, 'square', .2, 0, 700);
  $('#sub').style.opacity = 0;
}
function endScare() {
  const n = F[scareI].n; cancelAnimationFrame(raf);
  $('#overTxt').textContent = 'O '+n+' gravou tudo. Já tá no grupo "3ºB - SEM PROFESSOR" com '+(Math.floor(rnd(40,300)))+' visualizações.';
  document.body.classList.remove('playing'); mode = 'menu'; setVol(0); show('over');
}
function win() {
  leave(); try { localStorage.setItem(KEY, 0); } catch (e) {} refresh();
  setVol(.5); [523,659,784,1046].forEach((f, k) => setTimeout(() => tone(f, .5, 'sine', .15), k*180));
  show('win'); setTimeout(() => setVol(0), 2500);
}


// ---------- menu: turma espiando + segredos ----------
const pk = $('#peek'), pc = pk.getContext('2d'), ducks = [0,0,0], heard = new Set();
const QUOTES = ['Tá gravando, hein!','Já mandei no grupo da sala!','Calma, tô ajustando o foco...'];
let found = []; try { found = JSON.parse(localStorage.getItem('cincoHorasEggs')) || []; } catch (e) {}
function toast(m, ms=2800) { const el = $('#toast'); el.textContent = m; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), ms); }
function upEggs() { $('#eggs').textContent = '🔎 Segredos '+found.length+'/8'; $('#title').classList.toggle('gold', found.length >= 8); }
function egg(id, msg) {
  toast(msg); if (found.includes(id)) return;
  found.push(id); try { localStorage.setItem('cincoHorasEggs', JSON.stringify(found)); } catch (e) {}
  upEggs(); if (found.length === 8) setTimeout(() => toast('★ ALUNO NOTA 10 ★ Você achou todos os segredos!', 4500), 3000);
}
function sfx(fn) { initAudio(); setVol(.7); fn(); setTimeout(() => { if (mode !== 'play' && mode !== 'scare') setVol(0); }, 2000); }
function peekFrame(now) {
  if (!$('#menu').classList.contains('active')) { menuRaf = 0; return; }
  const w = pk.width = pk.clientWidth, h = pk.height = pk.clientHeight, t = now/1000, r = Math.min(h*.3, w*.07), dT = h*.6;
  pc.clearRect(0, 0, w, h);
  F.forEach((f, i) => {
    const cx = w*(.2+i*.3), rise = (.85+.15*Math.sin(t*.9+i*2))*(1-ducks[i])*1.25, hy = dT + r*(1.05-rise);
    gazeX = mmx < 0 ? Math.sin(t+i) : Math.max(-1, Math.min(1, (mmx-cx)/(w*.3)));
    head(pc, cx, hy, r, f, t, ducks[i] > 0 ? 1 : .2);
    if (ducks[i] < .5) phone(pc, cx+r*1.5, hy+r*.1, r, t);
    ducks[i] = Math.max(0, ducks[i]-.012);
  });
  gazeX = 0;
  const g = pc.createLinearGradient(0, dT, 0, h); g.addColorStop(0, '#46665e'); g.addColorStop(1, '#1c2a26');
  pc.fillStyle = g; pc.fillRect(0, dT, w, h-dT); pc.fillStyle = '#7a9a90'; pc.fillRect(0, dT-3, w, 6);
  pc.strokeStyle = 'rgba(0,0,0,.3)'; pc.lineWidth = 2; for (let x = w*.1; x < w; x += w*.1) { pc.beginPath(); pc.moveTo(x, dT); pc.lineTo(x, h); pc.stroke(); }
  menuRaf = requestAnimationFrame(peekFrame);
}
function startMenu() { if (!menuRaf) menuRaf = requestAnimationFrame(peekFrame); }
pk.addEventListener('pointerdown', e => {
  const b = pk.getBoundingClientRect(), x = e.clientX-b.left, w = pk.clientWidth, r = Math.min(pk.clientHeight*.3, w*.07);
  F.forEach((f, i) => { if (Math.abs(x-w*(.2+i*.3)) < r*1.3 && ducks[i] === 0) { ducks[i] = 1; heard.add(i); toast(f.n+': “'+QUOTES[i]+'”', 2000); sfx(() => tone(420+i*90, .12, 'triangle', .1)); if (heard.size === 3) egg('turma', 'Você conheceu a turma toda. Eles já conheciam você.'); } });
});
addEventListener('pointermove', e => { if (mode === 'menu') mmx = e.clientX-pk.getBoundingClientRect().left; });
$('#sign').onclick = () => { if (++signN < 5) return toast('Clique na placa mais '+(5-signN)+'x...', 1200); signN = 0; $('#sign').innerHTML = '<b>🚽 SALA DOS PROFESSORES</b><small>Entrada proibida para alunos</small>'; egg('placa', 'Opa! Você não devia estar aqui. Vou fingir que não vi.'); };
$('#rec').onclick = () => egg('rec', 'Sorria! Você está sendo gravado desde o 1º ano.');
$('#nick').onclick = () => { if (++nickN >= 3) { nickN = 0; egg('jaco', 'jaco: “fiz esse jogo em 1 noite. Sem ir ao banheiro.”'); } };
$('#flush').onclick = () => { sfx(() => { burst(1.8,.5,0,700); burst(1.6,.3,0,2500,'bandpass'); }); egg('flush', 'Descarga dada. Lá fora o Léo grita: “EU OUVI ISSO!”'); };
['g1','g2','g3'].forEach((id, i) => $('#'+id).onclick = () => { sfx(() => giggle(i)); egg('graf', ['Alguém escreveu embaixo: “Léo ainda deve R$ 5 da cantina”','“3ºB manda” … apagado com corretivo.','Dona Neide: “Quem foi?! Eu vou ligar pros seus pais!”'][i]); });
addEventListener('keydown', e => {
  if (mode !== 'menu') return;
  const k = e.key.toLowerCase(); ks = (ks + ({arrowup:'U',arrowdown:'D',arrowleft:'L',arrowright:'R'}[k] || (k.length === 1 ? k : ''))).slice(-14);
  if (ks.endsWith('neide')) { document.body.classList.add('shake'); setTimeout(() => document.body.classList.remove('shake'), 700); sfx(() => { tone(880,1.2,'sine',.2); tone(660,1.4,'sine',.15); }); egg('neide', 'DONA NEIDE: “Quem tá aí?! Eu vou chamar a direção!”'); }
  if (ks.endsWith('UUDDLRLRba')) { document.body.classList.toggle('recreio'); sfx(() => [523,659,784].forEach((f, n) => setTimeout(() => tone(f,.4,'sine',.2), n*150))); egg('konami', 'MODO RECREIO! Lanche liberado, sinal tocando.'); }
});
upEggs();

// ---------- entrada ----------
addEventListener('pointermove', e => { if (mode === 'play') { usingMouse = true; mouseT = Math.max(-1, Math.min(1, (e.clientX/W - .5)*2.6)); } });
cv.addEventListener('pointerdown', slap);
addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'a' || k === 'arrowleft') kL = true;
  if (k === 'd' || k === 'arrowright') kR = true;
  if (k === 's' || k === 'arrowdown') kC = true;
  if (e.code === 'Space') { e.preventDefault(); slap(); }
});
addEventListener('keyup', e => {
  const k = e.key.toLowerCase();
  if (k === 'a' || k === 'arrowleft') kL = false;
  if (k === 'd' || k === 'arrowright') kR = false;
  if (k === 's' || k === 'arrowdown') kC = false;
});
$('#btnNew').onclick = () => { try { localStorage.setItem(KEY, 0); } catch (e) {} startGame(0); };
$('#btnContinue').onclick = () => startGame(getSave());
$('#btnControls').onclick = () => show('controls');
$('#btnCredits').onclick = () => show('credits');
$('#btnCastGo').onclick = () => { clearInterval(castIv); go(null, begin(pendingH)); };
$('#btnRetry').onclick = () => startGame(getSave());
document.querySelectorAll('.back').forEach(b => b.onclick = () => { leave(); refresh(); show('menu'); });
refresh(); startMenu();
})();
