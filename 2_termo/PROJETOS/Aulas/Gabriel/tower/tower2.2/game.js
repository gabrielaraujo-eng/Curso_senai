'use strict';
/* ===================== BASTIÃO — Tower Defense ===================== */
const T = 48, COLS = 20, ROWS = 12, MAXW = 30;
const cv = document.getElementById('game');
const W = COLS * T, H = ROWS * T;
const $ = s => document.querySelector(s);
const PC = ['#f2b134', '#4cc9f0'];

/* ---------- Dados ---------- */
const MAPS = [
  { name: 'Serpente', pts: [[-1,2],[16,2],[16,5],[3,5],[3,9],[20,9]], rocks: [[8,0],[9,0],[12,7],[13,7],[8,10],[17,10],[1,7],[18,4]] },
  { name: 'Espiral', pts: [[-1,1],[18,1],[18,10],[1,10],[1,3],[15,3],[15,8],[4,8],[4,5],[10,5]], rocks: [[8,2],[12,2],[10,9],[6,9],[8,6],[12,6],[17,5]] },
  { name: 'Zigue-zague', pts: [[2,-1],[2,9],[6,9],[6,2],[10,2],[10,9],[14,9],[14,2],[18,2],[18,12]], rocks: [[0,5],[4,5],[8,5],[12,5],[16,5],[8,10],[1,11],[19,6]] },
  { name: 'Anel', pts: [[-1,5],[2,5],[2,1],[17,1],[17,10],[5,10],[5,4],[13,4],[13,7]], rocks: [[9,7],[9,8],[15,5],[8,2],[1,8],[19,3]] }
];
const DIFFS = [
  { name: 'Fácil', gold: 300, lives: 30, hp: .8 },
  { name: 'Normal', gold: 200, lives: 20, hp: 1 },
  { name: 'Difícil', gold: 150, lives: 10, hp: 1.3 }
];
const DEF = {
  arrow:  { n: 'Arqueiro', cost: 50,  range: 150, rate: .5,  dmg: 12,  spd: 520, col: '#9bdc6c', desc: 'Rápido, acerta ar e terra' },
  cannon: { n: 'Canhão',   cost: 100, range: 135, rate: 1.4, dmg: 34,  spd: 320, splash: 58, ground: 1, col: '#c98a5a', desc: 'Dano em área, só terrestres' },
  frost:  { n: 'Gelo',     cost: 75,  range: 120, rate: .9,  dmg: 5,   spd: 380, splash: 44, slow: .45, col: '#8fe3ff', desc: 'Retarda inimigos em área' },
  tesla:  { n: 'Tesla',    cost: 150, range: 125, rate: 1.1, dmg: 24,  chain: 3, col: '#d58bff', desc: 'Raio que salta entre alvos' },
  sniper: { n: 'Sniper',   cost: 175, range: 300, rate: 2.3, dmg: 130, spd: 900, pierce: 1, mode: 2, col: '#ff7b7b', desc: 'Longo alcance, mira o mais forte' },
  poison: { n: 'Veneno',   cost: 90,  range: 125, rate: 1,   dmg: 8,   spd: 380, poison: 1, col: '#a3e635', desc: 'Veneno: dano contínuo por 4s' },
  laser:  { n: 'Laser',    cost: 220, range: 140, rate: 0,   dmg: 35,  beam: 1, col: '#ff5ec4', desc: 'Raio contínuo que ganha força' }
};
const TYPES = Object.keys(DEF);
const MODES = ['Primeiro', 'Último', 'Mais forte', 'Mais fraco', 'Mais próximo'];
const NAMES = { grunt: 'Comum', runner: 'Corredor', brute: 'Bruto', flyer: 'Voador', healer: 'Curandeiro', splitter: 'Divisor', boss: 'CHEFE' };
const EN = {
  grunt:  { hp: 40,   spd: 46, r: 11, gold: 5,   dmg: 1, col: '#7fb069' },
  runner: { hp: 26,   spd: 96, r: 9,  gold: 5,   dmg: 1, col: '#f4d35e' },
  brute:  { hp: 220,  spd: 30, r: 15, gold: 14,  dmg: 2, col: '#8d6a9f', armor: .3 },
  flyer:  { hp: 65,   spd: 62, r: 10, gold: 9,   dmg: 1, col: '#6fd3d3', air: 1 },
  healer: { hp: 90,   spd: 50, r: 11, gold: 10,  dmg: 1, col: '#ff9ecb', heal: 1 },
  splitter: { hp: 150, spd: 40, r: 13, gold: 10,  dmg: 1, col: '#c9a227', split: 1 },
  boss:   { hp: 1600, spd: 24, r: 21, gold: 120, dmg: 6, col: '#e4572e', armor: .2 }
};
const KEYS = [
  { up:'w', down:'s', left:'a', right:'d', prev:'q', next:'e', place:'f', upg:'r', sell:'g', abil:'t', tgt:'c', fix:'v' },
  { up:'arrowup', down:'arrowdown', left:'arrowleft', right:'arrowright', prev:'n', next:'m', place:'enter', upg:'k', sell:'l', abil:'j', tgt:'i', fix:'o' }
];

/* ---------- Som ---------- */
let AC = null, muted = false;
function sfx(f, d = .08, type = 'square', v = .035) {
  if (muted) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.value = f; g.gain.value = v;
    g.gain.exponentialRampToValueAtTime(.0001, AC.currentTime + d);
    o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + d);
  } catch (e) {}
}

/* ---------- Caminho ---------- */
function mkPath(pts) {
  const p = pts.map(([x, y]) => [(x + .5) * T, (y + .5) * T]);
  const cum = [0];
  for (let i = 1; i < p.length; i++) cum.push(cum[i - 1] + Math.hypot(p[i][0] - p[i-1][0], p[i][1] - p[i-1][1]));
  return { p, cum, len: cum[cum.length - 1] };
}
function pointAt(path, d) {
  const { p, cum } = path;
  let i = 1;
  while (i < p.length - 1 && cum[i] < d) i++;
  const t = Math.min(1, Math.max(0, (d - cum[i-1]) / (cum[i] - cum[i-1] || 1)));
  return [p[i-1][0] + (p[i][0] - p[i-1][0]) * t, p[i-1][1] + (p[i][1] - p[i-1][1]) * t];
}

/* ---------- Estado ---------- */
let G = null;
let M = { mode: 1, map: 0, diff: 1 };

function newGame(o) {
  const map = MAPS[o.map], df = DIFFS[o.diff];
  const road = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  for (let i = 1; i < map.pts.length; i++) {
    let [x, y] = map.pts[i - 1]; const [bx, by] = map.pts[i];
    const sx = Math.sign(bx - x), sy = Math.sign(by - y);
    for (;;) {
      if (x >= 0 && x < COLS && y >= 0 && y < ROWS) road[y][x] = true;
      if (x === bx && y === by) break;
      x += sx; y += sy;
    }
  }
  const block = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  map.rocks.forEach(([x, y]) => { block[y][x] = true; });
  const players = [];
  for (let i = 0; i < o.mode; i++) players.push({
    id: i, gold: df.gold, kills: 0, sel: 'arrow', cx: i ? 14 : 5, cy: i ? 7 : 7, cd: 0, cdMax: i ? 35 : 40
  });
  const ground = mkPath(map.pts);
  const air = mkPath([map.pts[0], map.pts[map.pts.length - 1]]);
  return {
    o, map, df, road, block, players, ground, air, state: 'menu', speed: 1, time: 0,
    lives: df.lives, wave: 0, active: false, inter: 25, queue: [], spawnT: 0, gap: .9,
    towers: [], occ: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
    enemies: [], proj: [], parts: [], floats: [], bolts: [], rings: [], strikes: [], freeze: 0,
    score: 0, won: false
  };
}

/* ---------- Ondas ---------- */
const hpMul = w => 1 + w * .25 + w * w * .015;
function waveList(w) {
  const q = [], add = (t, n) => { for (let i = 0; i < n; i++) q.push(t); };
  add('grunt', 6 + w * 2);
  if (w >= 2) add('runner', w);
  if (w >= 4) add('brute', w >> 1);
  if (w >= 5) add('splitter', Math.floor(w / 3));
  if (w >= 6) add('flyer', w >> 1);
  if (w >= 8) add('healer', Math.floor(w / 4));
  return q;
}
function startWave() {
  const g = G; g.wave++; g.active = true;
  const w = g.wave, q = waveList(w);
  for (let i = q.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [q[i], q[j]] = [q[j], q[i]]; }
  if (w % 10 === 0) q.push('boss');
  g.queue = q; g.spawnT = 0; g.gap = Math.max(.35, .9 - w * .02);
  if (g.o.mode === 2) g.gap *= .8;
  sfx(220, .3, 'sawtooth', .05);
}
function spawn(type, d0 = 0) {
  const g = G, d = EN[type];
  const path = d.air ? g.air : g.ground;
  const hp = d.hp * hpMul(g.wave) * g.df.hp * (g.o.mode === 2 ? 1.5 : 1);
  g.enemies.push({ type, d: d0, hp, max: hp, spd: d.spd, r: d.r, gold: d.gold + Math.floor(g.wave / 3), dmg: d.dmg,
    col: d.col, air: !!d.air, armor: d.armor || 0, path, x: pointAt(path, d0)[0], y: pointAt(path, d0)[1], pt: 0, heal: d.heal, split: d.split, slow: 0, slowF: 1, dead: false });
}
function endWave() {
  const g = G; g.active = false; g.inter = 18;
  const b = 20 + g.wave * 3;
  g.players.forEach(p => {
    const i = Math.min(50, Math.floor(p.gold * .05));
    p.gold += b + i;
    if (i > 0) float((p.cx + .5) * T, p.cy * T, '+' + i + ' juros', '#ffd966');
  });
  g.score += g.wave * 100;
  sfx(660, .25, 'triangle', .05);
  if (g.wave >= MAXW && !g.won) { g.won = true; finish(true); }
}

/* ---------- Dano e efeitos ---------- */
function dmgEnemy(e, d, owner, pierce) {
  if (e.dead) return;
  e.hp -= pierce ? d : d * (1 - e.armor);
  if (e.hp <= 0) {
    e.dead = true;
    if (owner) { owner.gold += e.gold; owner.kills++; }
    G.score += 10;
    float(e.x, e.y - 10, '+' + e.gold, '#ffd966');
    burst(e.x, e.y, e.col, 8);
    if (e.split) { spawn('runner', e.d); spawn('runner', Math.max(0, e.d - 14)); }
    sfx(140 + Math.random() * 60, .06, 'triangle', .03);
  }
}
function burst(x, y, col, n) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * 6.28, s = 30 + Math.random() * 90;
    G.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: .5, max: .5, col, r: 2 + Math.random() * 2 });
  }
}
const float = (x, y, txt, col) => G.floats.push({ x, y, txt, col, life: .9 });
function aoe(x, y, rad, dmg, owner, opt = {}) {
  for (const e of G.enemies) {
    if (e.dead || (opt.ground && e.air)) continue;
    if (Math.hypot(e.x - x, e.y - y) <= rad + e.r) {
      dmgEnemy(e, dmg, owner, opt.pierce);
      if (opt.slow) { e.slow = 2; e.slowF = opt.slow; }
    }
  }
  G.rings.push({ x, y, r: rad, life: .3, max: .3, col: opt.col || '#fff' });
}

/* ---------- Torres ---------- */
function stat(t) {
  const d = DEF[t.type], l = t.lvl - 1;
  return { dmg: d.dmg * (1 + .65 * l), range: d.range * (1 + .1 * l), rate: d.rate * (1 - .12 * l), chain: (d.chain || 0) + l };
}
function pickTarget(t, s) {
  const d = DEF[t.type]; let best = null, bv = -Infinity;
  for (const e of G.enemies) {
    if (e.dead || (d.ground && e.air)) continue;
    if (Math.hypot(e.x - t.x, e.y - t.y) > s.range + e.r) continue;
    const m = t.mode, v = m === 0 ? e.d : m === 1 ? -e.d : m === 2 ? e.hp : m === 3 ? -e.hp : -Math.hypot(e.x - t.x, e.y - t.y);
    if (v > bv) { bv = v; best = e; }
  }
  return best;
}
function fire(t, e, s) {
  const d = DEF[t.type];
  t.ang = Math.atan2(e.y - t.y, e.x - t.x); t.cd = s.rate;
  if (t.type === 'tesla') {
    const hit = [e], pts = [[t.x, t.y], [e.x, e.y]];
    let cur = e;
    for (let i = 0; i < s.chain; i++) {
      let n = null, nd = 90;
      for (const o of G.enemies) {
        if (o.dead || hit.includes(o)) continue;
        const dd = Math.hypot(o.x - cur.x, o.y - cur.y);
        if (dd < nd) { nd = dd; n = o; }
      }
      if (!n) break;
      hit.push(n); pts.push([n.x, n.y]); cur = n;
    }
    hit.forEach(h => dmgEnemy(h, s.dmg, t.owner));
    G.bolts.push({ pts, life: .15 });
    sfx(900, .07, 'sawtooth', .03);
    return;
  }
  const crit = t.type === 'arrow' && Math.random() < .15;
  G.proj.push({ x: t.x, y: t.y, tg: e, tx: e.x, ty: e.y, dmg: s.dmg * (crit ? 2 : 1), crit, spd: d.spd, d, owner: t.owner, col: d.col });
  sfx(d.splash ? 120 : t.type === 'sniper' ? 300 : 520, .05, 'square', .02);
}
function hitProj(p) {
  const d = p.d;
  if (d.splash) {
    aoe(p.tx, p.ty, d.splash, p.dmg, p.owner, { ground: d.ground, slow: d.slow, col: p.col });
    burst(p.tx, p.ty, p.col, 6);
    if (d.ground) sfx(80, .15, 'sawtooth', .05);
  } else if (p.tg && !p.tg.dead) {
    dmgEnemy(p.tg, p.dmg, p.owner, d.pierce);
    if (d.poison) { p.tg.pt = 4; p.tg.pd = Math.max(p.tg.pd || 0, p.dmg * 2.5); p.tg.po = p.owner; }
    if (p.crit) float(p.tg.x, p.tg.y - 14, 'CRÍTICO', '#ffd966');
    burst(p.tg.x, p.tg.y, p.col, 3);
  }
}

/* ---------- Ações dos jogadores ---------- */
function act(p, kind) {
  const g = G; if (g.state !== 'play') return;
  const t = g.occ[p.cy][p.cx];
  if (kind === 'place') {
    if (t) return act(p, 'upg');
    if (g.road[p.cy][p.cx] || g.block[p.cy][p.cx]) return deny(p, 'Local bloqueado');
    const d = DEF[p.sel];
    if (p.gold < d.cost) return deny(p, 'Ouro insuficiente');
    p.gold -= d.cost;
    const nt = { type: p.sel, lvl: 1, cx: p.cx, cy: p.cy, x: (p.cx + .5) * T, y: (p.cy + .5) * T, cd: 0, ang: 0, owner: p, spent: d.cost, mode: d.mode || 0, ramp: 1 };
    g.towers.push(nt); g.occ[p.cy][p.cx] = nt;
    burst(nt.x, nt.y, d.col, 8); sfx(400, .1, 'triangle', .05);
  } else if (kind === 'upg') {
    if (!t) return;
    if (t.lvl >= 3) return deny(p, 'Nível máximo');
    const c = Math.round(DEF[t.type].cost * (t.lvl === 1 ? .8 : 1.2));
    if (p.gold < c) return deny(p, 'Ouro insuficiente');
    p.gold -= c; t.spent += c; t.lvl++;
    burst(t.x, t.y, '#fff', 10); sfx(700, .12, 'triangle', .05);
  } else if (kind === 'sell') {
    if (!t) return;
    const r = Math.floor(t.spent * .7); p.gold += r;
    g.towers.splice(g.towers.indexOf(t), 1); g.occ[t.cy][t.cx] = null;
    float(t.x, t.y, '+' + r, '#ffd966'); sfx(250, .1, 'triangle', .05);
  } else if (kind === 'tgt') {
    if (t) { t.mode = (t.mode + 1) % MODES.length; float(t.x, t.y - 20, MODES[t.mode], '#fff'); }
  } else if (kind === 'fix') {
    if (g.lives >= g.df.lives) return deny(p, 'Base inteira');
    if (p.gold < 150) return deny(p, 'Precisa de 150');
    p.gold -= 150; g.lives = Math.min(g.df.lives, g.lives + 2);
    sfx(520, .2, 'triangle', .05); float(480, 60, '+2 vidas', '#7fd28a');
  } else if (kind === 'abil') {
    if (p.cd > 0) return deny(p, 'Recarregando');
    p.cd = p.cdMax;
    if (p.id === 0) { g.strikes.push({ x: (p.cx + .5) * T, y: (p.cy + .5) * T, t: .9, owner: p }); sfx(500, .4, 'sine', .05); }
    else { g.freeze = 3; sfx(180, .5, 'sine', .06); float(480, 40, 'CONGELADOS!', '#8fe3ff'); }
  }
}
function deny(p, msg) { float((p.cx + .5) * T, p.cy * T, msg, '#ff8a8a'); sfx(110, .1, 'sawtooth', .04); }
function cycle(p, dir) {
  p.sel = TYPES[(TYPES.indexOf(p.sel) + dir + TYPES.length) % TYPES.length];
}

/* ---------- Atualização ---------- */
function update(dt) {
  const g = G; g.time += dt;
  if (g.freeze > 0) g.freeze -= dt;
  g.players.forEach(p => { if (p.cd > 0) p.cd -= dt; });

  if (!g.active) { g.inter -= dt; if (g.inter <= 0) startWave(); }
  else if (g.queue.length) { g.spawnT -= dt; if (g.spawnT <= 0) { spawn(g.queue.shift()); g.spawnT = g.gap; } }
  else if (!g.enemies.length) endWave();

  for (const e of g.enemies) {
    if (e.pt > 0) { e.pt -= dt; dmgEnemy(e, e.pd * dt, e.po, true); }
    if (e.heal) for (const o of g.enemies) if (!o.dead && o !== e && Math.hypot(o.x - e.x, o.y - e.y) < 85) o.hp = Math.min(o.max, o.hp + o.max * .05 * dt);
    if (e.dead) continue;
    if (e.slow > 0) e.slow -= dt;
    e.d += e.spd * (e.slow > 0 ? e.slowF : 1) * (g.freeze > 0 ? 0 : 1) * dt;
    if (e.d >= e.path.len) {
      e.dead = true; g.lives -= e.dmg; sfx(90, .25, 'sawtooth', .06);
      float(Math.min(e.x, W - 30), Math.min(e.y, H - 20), '-' + e.dmg, '#ff6b6b');
      if (g.lives <= 0) { g.lives = 0; finish(false); return; }
    } else [e.x, e.y] = pointAt(e.path, e.d);
  }

  for (const t of g.towers) {
    const s = stat(t);
    if (t.type === 'laser') {
      let e = t.lock;
      if (!e || e.dead || Math.hypot(e.x - t.x, e.y - t.y) > s.range + e.r) { e = pickTarget(t, s); if (e !== t.lock) t.ramp = 1; t.lock = e; }
      t.beam = e || null;
      if (e) { t.ang = Math.atan2(e.y - t.y, e.x - t.x); t.ramp = Math.min(3, t.ramp + dt); dmgEnemy(e, s.dmg * t.ramp * dt, t.owner, false); }
      continue;
    }
    t.cd -= dt;
    if (t.cd > 0) continue;
    const e = pickTarget(t, s);
    if (e) fire(t, e, s);
  }

  for (const p of g.proj) {
    if (p.tg && !p.tg.dead) { p.tx = p.tg.x; p.ty = p.tg.y; }
    const dx = p.tx - p.x, dy = p.ty - p.y, dist = Math.hypot(dx, dy), step = p.spd * dt;
    if (dist <= step + 4) { hitProj(p); p.done = true; }
    else { p.x += dx / dist * step; p.y += dy / dist * step; }
  }

  for (const s of g.strikes) {
    s.t -= dt;
    if (s.t <= 0) { aoe(s.x, s.y, 95, 220, s.owner, { pierce: 1, col: '#ffb347' }); burst(s.x, s.y, '#ffb347', 24); sfx(60, .4, 'sawtooth', .08); s.done = true; }
  }

  for (const q of g.parts) { q.x += q.vx * dt; q.y += q.vy * dt; q.life -= dt; }
  for (const f of g.floats) { f.y -= 30 * dt; f.life -= dt; }
  for (const b of g.bolts) b.life -= dt;
  for (const r of g.rings) r.life -= dt;

  g.enemies = g.enemies.filter(e => !e.dead);
  g.proj = g.proj.filter(p => !p.done);
  g.strikes = g.strikes.filter(s => !s.done);
  g.parts = g.parts.filter(q => q.life > 0);
  g.floats = g.floats.filter(f => f.life > 0);
  g.bolts = g.bolts.filter(b => b.life > 0);
  g.rings = g.rings.filter(r => r.life > 0);
}

/* ---------- 3D (Three.js) ---------- */
const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f1d1c);
scene.fog = new THREE.Fog(0x0f1d1c, 30, 70);
const camera = new THREE.PerspectiveCamera(45, 1.6, .1, 150);
const CAM = { az: 0, el: 1.0, dist: 19 }, CAM0 = { ...CAM };

scene.add(new THREE.HemisphereLight(0xcfe9ff, 0x2b4a3f, .85));
const sun = new THREE.DirectionalLight(0xfff1d6, .9);
sun.position.set(COLS / 2 + 6, 16, ROWS / 2 + 4);
sun.target.position.set(COLS / 2, 0, ROWS / 2);
sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
Object.assign(sun.shadow.camera, { left: -15, right: 15, top: 11, bottom: -11, near: 1, far: 45 });
sun.shadow.camera.updateProjectionMatrix();
scene.add(sun, sun.target);

function resize() {
  const w = $('#stage').clientWidth, h = Math.round(Math.max(380, Math.min(window.innerHeight - 120, w * .62)));
  renderer.setSize(w, h, false); cv.style.height = h + 'px';
  camera.aspect = w / h; camera.updateProjectionMatrix();
}
addEventListener('resize', resize); resize();

/* geometrias e materiais compartilhados */
const gBox = new THREE.BoxGeometry(1, 1, 1), gSph = new THREE.SphereGeometry(.5, 16, 12),
  gCyl = new THREE.CylinderGeometry(.5, .5, 1, 16), gCylZ = new THREE.CylinderGeometry(.5, .5, 1, 8).rotateX(Math.PI / 2),
  gCone = new THREE.ConeGeometry(.5, 1, 10), gOct = new THREE.OctahedronGeometry(.5), gDod = new THREE.DodecahedronGeometry(.5),
  gPlane = new THREE.PlaneGeometry(1, 1),
  gDisc = new THREE.CircleGeometry(1, 40).rotateX(-Math.PI / 2), gRing = new THREE.RingGeometry(.94, 1, 48).rotateX(-Math.PI / 2);
const matCache = {};
const M3 = (c, o = {}) => { const k = c + JSON.stringify(o); return matCache[k] || (matCache[k] = new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .65, metalness: .1 }, o))); };
const glow = (c, i = .6) => M3(c, { emissive: c, emissiveIntensity: i });
const mesh = (g, m, sx = 1, sy = 1, sz = 1, x = 0, y = 0, z = 0) => {
  const o = new THREE.Mesh(g, m); o.scale.set(sx, sy, sz); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; return o;
};
const barBg = new THREE.MeshBasicMaterial({ color: 0x330000, depthTest: false }), barFill = new THREE.MeshBasicMaterial({ color: 0x6fe27a, depthTest: false });
const beamMat = new THREE.MeshBasicMaterial({ color: 0xff5ec4 });

/* mundo */
let world = null, dyn = null, built = null, curs = [];
const mp = { tow: new Map(), en: new Map(), pr: new Map(), bo: new Map(), ri: new Map(), st: new Map(), pa: new Map(), fl: new Map() };

function buildWorld() {
  [world, dyn].forEach(o => o && scene.remove(o));
  Object.values(mp).forEach(m => m.clear());
  world = new THREE.Group(); dyn = new THREE.Group(); scene.add(world, dyn);
  const g = G; built = g;
  const gnd = mesh(gBox, M3(0x142a26), COLS + 40, .4, ROWS + 40, COLS / 2, -.6, ROWS / 2); gnd.castShadow = false; world.add(gnd);
  const tile = (x, y, rd) => {
    const top = rd ? -.12 : 0, c = rd ? 0xa98e5e : ((x + y) % 2 ? 0x2c5a4a : 0x275244);
    const t = mesh(gBox, M3(c), .98, .3, .98, x + .5, top - .15, y + .5); t.castShadow = false; world.add(t);
  };
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
    tile(x, y, g.road[y][x]);
    if (g.block[y][x]) { const r = mesh(gDod, M3(0x6b7a74), .85, .75, .85, x + .5, .3, y + .5); r.rotation.y = Math.random() * 6; world.add(r); }
  }
  const pts = g.map.pts;
  for (let i = 1; i < pts.length; i++) {
    let [x, y] = pts[i - 1]; const [bx, by] = pts[i], sx = Math.sign(bx - x), sy = Math.sign(by - y);
    for (;;) { if (x < 0 || x >= COLS || y < 0 || y >= ROWS) tile(x, y, true); if (x === bx && y === by) break; x += sx; y += sy; }
  }
  // árvores decorativas fora do tabuleiro
  const f = pts[0], l = pts[pts.length - 1];
  for (let i = 0; i < 60; i++) {
    const tx = -5 + Math.random() * (COLS + 10), tz = -5 + Math.random() * (ROWS + 10);
    if (tx > -.8 && tx < COLS + .8 && tz > -.8 && tz < ROWS + .8) continue;
    if (Math.hypot(tx - f[0] - .5, tz - f[1] - .5) < 2.4 || Math.hypot(tx - l[0] - .5, tz - l[1] - .5) < 2.4) continue;
    const h = .8 + Math.random() * .8;
    world.add(mesh(gCyl, M3(0x5a3d2b), .2, h * .5, .2, tx, h * .25 - .2, tz));
    world.add(mesh(gCone, M3(0x2f7a4d), 1, h, 1, tx, h * .5 + h * .25 - .1, tz));
  }
  // entrada e base
  const cl = (v, m) => Math.max(.5, Math.min(m - .5, v + .5));
  const ex = cl(f[0], COLS), ez = cl(f[1], ROWS), bx2 = cl(l[0], COLS), bz2 = cl(l[1], ROWS);
  world.add(mesh(gCyl, glow(0x7fd28a, .5), .9, .06, .9, ex, .02, ez));
  world.add(mesh(gCyl, M3(0xdddddd), .06, 1.2, .06, ex, .6, ez));
  world.add(mesh(gBox, glow(0x7fd28a, .7), .45, .25, .02, ex + .22, 1.05, ez));
  world.add(mesh(gBox, M3(0xd9d2c0), .85, .8, .85, bx2, .4, bz2));
  world.add(mesh(gCone, M3(0xef5b5b), 1.2, .6, 1.2, bx2, 1.1, bz2));
  world.add(mesh(gCyl, M3(0xdddddd), .05, .6, .05, bx2, 1.7, bz2));
  world.add(mesh(gBox, glow(0xef5b5b, .7), .35, .2, .02, bx2 + .18, 1.85, bz2));

  curs = g.players.map((p, i) => {
    const grp = new THREE.Group();
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(.96, .5, .96)), new THREE.LineBasicMaterial({ color: PC[i] }));
    edges.position.y = .25;
    const disc = new THREE.Mesh(gDisc, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .08, depthWrite: false })); disc.position.y = .04;
    const ring = new THREE.Mesh(gRing, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .5 })); ring.position.y = .05;
    grp.add(edges, disc, ring); world.add(grp);
    return { grp, disc, ring };
  });
}

/* sincronização estado -> objetos 3D */
function disposeObj(m) {
  m.traverse(c => {
    if (c.userData.ownGeo && c.geometry) c.geometry.dispose();
    if (c.userData.ownMat && c.material) c.material.dispose();
    if (c.userData.mat) c.userData.mat.dispose();
  });
}
function sync(map, list, make, upd) {
  const seen = new Set();
  for (const o of list) {
    let m = map.get(o);
    if (!m) { m = make(o); dyn.add(m); map.set(o, m); }
    upd(o, m); seen.add(o);
  }
  for (const [o, m] of map) if (!seen.has(o)) { dyn.remove(m); map.delete(o); disposeObj(m); }
}
const mk = (o, k) => { o.userData[k] = true; return o; };

function mkTower(t) {
  const d = DEF[t.type], grp = new THREE.Group(), oc = PC[t.owner.id];
  grp.add(mesh(gCyl, M3(0x1b2e2b), .8, .3, .8, 0, .15, 0));
  grp.add(mesh(gCyl, glow(oc, .4), .86, .06, .86, 0, .04, 0));
  const head = new THREE.Group(); head.position.y = .3; grp.add(head);
  const add = (o, rz) => { if (rz) o.rotation.z = rz; head.add(o); return o; };
  const mc = M3(d.col), me = glow(d.col, .6);
  switch (t.type) {
    case 'arrow': add(mesh(gBox, mc, .42, .5, .42, 0, .25, 0)); add(mesh(gCone, me, .28, .6, .28, .32, .55, 0), -Math.PI / 2); break;
    case 'cannon': add(mesh(gSph, mc, .6, .6, .6, 0, .35, 0)); add(mesh(gCyl, M3(0x3a3a3a), .2, .7, .2, .35, .4, 0), Math.PI / 2); break;
    case 'frost': add(mesh(gCyl, mc, .3, .4, .3, 0, .2, 0)); add(mesh(gOct, me, .7, .9, .7, 0, .65, 0)); break;
    case 'tesla': add(mesh(gCyl, mc, .3, .8, .3, 0, .4, 0)); add(mesh(gSph, me, .4, .4, .4, 0, .9, 0)); break;
    case 'sniper': add(mesh(gBox, mc, .5, .45, .4, 0, .3, 0)); add(mesh(gBox, M3(0x333333), 1.1, .12, .12, .45, .4, 0)); break;
    case 'poison': add(mesh(gSph, me, .55, .55, .55, 0, .35, 0)); add(mesh(gCyl, mc, .2, .3, .2, 0, .7, 0)); break;
    case 'laser': add(mesh(gOct, me, .6, .8, .6, 0, .55, 0)); add(mesh(gBox, glow(0xffffff, .5), .5, .08, .08, .3, .55, 0)); break;
  }
  const pips = [0, 1, 2].map(i => { const p = mesh(gBox, glow(0xffffff, .6), .1, .1, .1, -.1 + i * .1, .32, .42); grp.add(p); return p; });
  const beam = new THREE.Mesh(gCylZ, beamMat); beam.visible = false; grp.add(beam);
  grp.userData = { head, pips, beam };
  return grp;
}
function updTower(t, m) {
  m.position.set(t.x / T, 0, t.y / T);
  const u = m.userData;
  u.head.rotation.y = -t.ang;
  u.head.scale.setScalar(1 + .12 * (t.lvl - 1));
  u.pips.forEach((p, i) => p.visible = i < t.lvl);
  if (t.type === 'laser') {
    const e = t.beam, b = u.beam;
    if (e && !e.dead) {
      const a = new THREE.Vector3(0, .85, 0), w = new THREE.Vector3(e.x / T - m.position.x, .5, e.y / T - m.position.z);
      b.position.copy(a.clone().add(w).multiplyScalar(.5));
      m.updateMatrixWorld(true);
      b.lookAt(new THREE.Vector3(e.x / T, .5, e.y / T));
      const th = .05 + .04 * t.ramp;
      b.scale.set(th, th, a.distanceTo(w)); b.visible = true;
    } else b.visible = false;
  }
}

function mkEnemy(e) {
  const grp = new THREE.Group(), s = e.r / T * 2.2;
  const mat = new THREE.MeshStandardMaterial({ color: e.col, roughness: .5 });
  const body = new THREE.Group(); grp.add(body);
  const add = (g, sx, sy, sz, x, y, z, m) => { const o = mesh(g, m || mat, sx, sy, sz, x, y, z); body.add(o); return o; };
  let wings = null;
  switch (e.type) {
    case 'runner': add(gOct, s * 1.2, s, s, 0, s * .5, 0); break;
    case 'brute': add(gBox, s * 1.1, s * .9, s * 1.1, 0, s * .45, 0); break;
    case 'flyer': add(gSph, s * .8, s * .8, s * .8, 0, s * .4, 0);
      wings = [add(gBox, s * .5, .04, s * 1.7, 0, s * .45, 0, M3(0xffffff))]; break;
    case 'healer': add(gSph, s, s, s, 0, s * .5, 0);
      add(gBox, s * .6, s * .15, s * .15, 0, s * 1.05, 0, glow(0xffffff, .8)); add(gBox, s * .15, s * .6, s * .15, 0, s * 1.05, 0, glow(0xffffff, .8)); break;
    case 'splitter': add(gDod, s * 1.1, s * 1.1, s * 1.1, 0, s * .55, 0); break;
    case 'boss': add(gBox, s * .9, s * .9, s * .9, 0, s * .45, 0);
      add(gCone, s * .2, s * .5, s * .2, 0, s * 1.1, s * .3, M3(0xffe0b0)); add(gCone, s * .2, s * .5, s * .2, 0, s * 1.1, -s * .3, M3(0xffe0b0)); break;
    default: add(gSph, s, s, s, 0, s * .5, 0);
  }
  const bar = new THREE.Group(); bar.position.y = s + .4;
  const bg = new THREE.Mesh(gPlane, barBg); bg.scale.set(.8, .1, 1); bg.renderOrder = 10;
  const fill = new THREE.Mesh(gPlane, barFill); fill.renderOrder = 11; bar.add(bg, fill); grp.add(bar);
  grp.userData = { body, bar, fill, wings, mat };
  return grp;
}
function updEnemy(e, m) {
  const u = m.userData;
  m.position.set(e.x / T, e.air ? 1.1 + Math.sin(G.time * 3 + e.d) * .1 : 0, e.y / T);
  if (e._px !== undefined && Math.hypot(e.x - e._px, e.y - e._py) > .01) u.body.rotation.y = -Math.atan2(e.y - e._py, e.x - e._px);
  e._px = e.x; e._py = e.y;
  u.body.position.y = Math.abs(Math.sin(G.time * 8 + e.d * .1)) * .05;
  u.mat.color.setHex(e.slow > 0 ? 0x8fe3ff : e.pt > 0 ? 0xb8e84a : parseInt(e.col.slice(1), 16));
  if (u.wings) u.wings[0].rotation.x = Math.sin(G.time * 22) * .5;
  const r = Math.max(0, e.hp / e.max);
  u.bar.quaternion.copy(camera.quaternion);
  u.fill.scale.set(.78 * r + .0001, .07, 1); u.fill.position.x = -.78 * (1 - r) / 2;
}

function textTex(txt, col) {
  const k = txt + col; if (textTex.c[k]) return textTex.c[k];
  const c = document.createElement('canvas'); c.width = 256; c.height = 64;
  const x = c.getContext('2d'); x.font = '700 40px system-ui'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.lineWidth = 7; x.strokeStyle = 'rgba(0,0,0,.8)'; x.strokeText(txt, 128, 34); x.fillStyle = col; x.fillText(txt, 128, 34);
  return textTex.c[k] = new THREE.CanvasTexture(c);
}
textTex.c = {};

function mkProj(p) { const s = p.d.splash ? .28 : .14; const o = mesh(gSph, glow(parseInt(p.col.slice(1), 16), .8), s, s, s); o.castShadow = false; return o; }
function mkBolt(b) {
  const geo = new THREE.BufferGeometry().setFromPoints(b.pts.map(([x, y]) => new THREE.Vector3(x / T + (Math.random() - .5) * .15, .9 + (Math.random() - .5) * .15, y / T + (Math.random() - .5) * .15)));
  const l = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xe9c2ff }));
  l.frustumCulled = false; mk(l, 'ownGeo'); mk(l, 'ownMat'); return l;
}
function mkRing(r) {
  const o = new THREE.Mesh(gRing, new THREE.MeshBasicMaterial({ color: parseInt(r.col.slice(1), 16), transparent: true })); return mk(o, 'ownMat');
}
function mkStrike() {
  const grp = new THREE.Group();
  const ring = mk(new THREE.Mesh(gRing, new THREE.MeshBasicMaterial({ color: 0xff8a3d })), 'ownMat');
  ring.scale.set(95 / T, 1, 95 / T); ring.position.y = .12;
  const ball = mesh(gSph, glow(0xff8a3d, 1), .6, .6, .6); grp.add(ring, ball); grp.userData.ball = ball; return grp;
}
function mkFloat(f) {
  f.z0 = f.y;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: textTex(f.txt, f.col), transparent: true, depthTest: false }));
  s.scale.set(2.2, .55, 1); s.renderOrder = 20; return mk(s, 'ownMat');
}

const _v = new THREE.Vector3();
function draw() {
  if (built !== G) buildWorld();
  const g = G;
  if (g.state === 'menu') CAM.az += .0025;
  const ce = Math.cos(CAM.el);
  camera.position.set(COLS / 2 + Math.sin(CAM.az) * CAM.dist * ce, Math.sin(CAM.el) * CAM.dist, ROWS / 2 + Math.cos(CAM.az) * CAM.dist * ce);
  camera.lookAt(COLS / 2, 0, ROWS / 2); camera.updateMatrixWorld();

  sync(mp.tow, g.towers, mkTower, updTower);
  sync(mp.en, g.enemies, mkEnemy, updEnemy);
  sync(mp.pr, g.proj, mkProj, (p, m) => m.position.set(p.x / T, .9, p.y / T));
  sync(mp.bo, g.bolts, mkBolt, () => {});
  sync(mp.ri, g.rings, mkRing, (r, m) => {
    const k = r.life / r.max, s = r.r * (1 - k * .4) / T;
    m.position.set(r.x / T, .15, r.y / T); m.scale.set(s, 1, s); m.material.opacity = k;
  });
  sync(mp.st, g.strikes, mkStrike, (s, m) => { m.position.set(s.x / T, 0, s.y / T); m.userData.ball.position.y = .3 + Math.max(0, s.t / .9) * 9; });
  sync(mp.pa, g.parts, q => mesh(gBox, M3(parseInt(q.col.slice(1), 16)), .09, .09, .09), (q, m) => {
    m.position.set(q.x / T, .4 + (1 - q.life / q.max) * .5, q.y / T); m.castShadow = false;
  });
  sync(mp.fl, g.floats, mkFloat, (f, m) => {
    m.position.set(f.x / T, 1.3 + (.9 - f.life) * 1.1, f.z0 / T); m.material.opacity = Math.min(1, f.life * 2);
  });

  g.players.forEach((p, i) => {
    const c = curs[i], t = g.occ[p.cy][p.cx], d = DEF[t ? t.type : p.sel];
    const ok = t || (!g.road[p.cy][p.cx] && !g.block[p.cy][p.cx] && p.gold >= d.cost);
    const rng = (t ? stat(t).range : d.range) / T, col = ok ? 0xffffff : 0xef5b5b;
    c.grp.position.set(p.cx + .5, 0, p.cy + .5);
    c.disc.scale.set(rng, 1, rng); c.ring.scale.set(rng, 1, rng);
    c.disc.material.color.setHex(col); c.ring.material.color.setHex(col);

    const el = document.getElementById('tip' + i); if (!el) return;
    el.textContent = t
      ? `${d.n} nv${t.lvl} · mira: ${MODES[t.mode]} · melhorar: ${t.lvl >= 3 ? 'máx.' : Math.round(d.cost * (t.lvl === 1 ? .8 : 1.2))} · vender: ${Math.floor(t.spent * .7)}`
      : (g.block[p.cy][p.cx] || g.road[p.cy][p.cx]) ? 'Local bloqueado' : `Construir ${d.n} (${d.cost})`;
    _v.set(p.cx + .5, 1.2, p.cy + .5).project(camera);
    el.style.left = ((_v.x + 1) / 2 * cv.clientWidth) + 'px';
    el.style.top = ((1 - _v.y) / 2 * cv.clientHeight) + 'px';
    el.style.display = g.state === 'play' ? 'block' : 'none';
  });

  const bg = g.freeze > 0 ? 0x1d3a52 : 0x0f1d1c;
  scene.background.setHex(bg); scene.fog.color.setHex(bg);
  renderer.render(scene, camera);
}

/* movimento do cursor relativo à câmera */
function mv(p, sx, sy) {
  const a = Math.round(CAM.az / (Math.PI / 2)) * Math.PI / 2, c = Math.round(Math.cos(a)), s = Math.round(Math.sin(a));
  p.cx = Math.max(0, Math.min(COLS - 1, p.cx + Math.round(sx * c + sy * s)));
  p.cy = Math.max(0, Math.min(ROWS - 1, p.cy + Math.round(-sx * s + sy * c)));
}

/* ---------- Interface ---------- */
function buildUI() {
  $('#shop').innerHTML = TYPES.map((k, i) => {
    const d = DEF[k];
    return `<button class="tw" data-t="${k}" style="--c:${d.col}"><i></i><b>${i + 1}. ${d.n}</b><span>${d.cost}</span><small>${d.desc}</small></button>`;
  }).join('');
  $('#players').innerHTML = G.players.map((p, i) => `
    <div class="pcard" style="--c:${PC[i]}" id="pc${i}">
      <div class="row"><b>Jogador ${i + 1}</b><span class="g"></span></div>
      <div class="row"><span class="s"></span><span class="k"></span></div>
      <div class="ab"></div><div class="bar"><div></div></div>
    </div>`).join('');
  $('#stage').querySelectorAll('.tip').forEach(n => n.remove());
  G.players.forEach((p, i) => { const d = document.createElement('div'); d.className = 'tip'; d.id = 'tip' + i; d.style.borderColor = PC[i]; $('#stage').appendChild(d); });
  $('#help').innerHTML = `<b>Jogador 1:</b> <kbd>WASD</kbd> mover · <kbd>Q</kbd>/<kbd>E</kbd> trocar torre · <kbd>F</kbd> construir/melhorar · <kbd>R</kbd> melhorar · <kbd>G</kbd> vender · <kbd>T</kbd> ataque aéreo · <kbd>C</kbd> modo de mira · <kbd>V</kbd> reparar base (150 ouro) · ou use o mouse (clique esq. constrói/melhora, dir. vende)` +
    (G.o.mode === 2 ? `<br><b>Jogador 2:</b> <kbd>←↑↓→</kbd> mover · <kbd>N</kbd>/<kbd>M</kbd> trocar torre · <kbd>Enter</kbd> construir/melhorar · <kbd>K</kbd> melhorar · <kbd>L</kbd> vender · <kbd>J</kbd> congelar inimigos · <kbd>I</kbd> modo de mira · <kbd>O</kbd> reparar base` : '') +
    `<br><kbd>1</kbd>-<kbd>7</kbd> escolhe torre (J1) · <kbd>Espaço</kbd> chama a onda · <kbd>P</kbd> pausa<br><b>Câmera:</b> roda do mouse = zoom · Shift+arrastar (ou botão do meio) = girar · <kbd>,</kbd> <kbd>.</kbd> girar · <kbd>Z</kbd>/<kbd>X</kbd> inclinar · <kbd>0</kbd> resetar`;
}
function updateHUD() {
  const g = G;
  $('#hLives').textContent = g.lives;
  $('#hWave').textContent = g.wave + '/' + MAXW;
  $('#hEnemies').textContent = g.enemies.length + g.queue.length;
  $('#hScore').textContent = g.score;
  $('#hTimer').textContent = g.active ? 'em curso' : Math.ceil(g.inter) + 's';
  const nw = g.wave + 1;
  if (g.pv !== nw) {
    g.pv = nw; const c = {};
    waveList(nw).forEach(t => c[t] = (c[t] || 0) + 1);
    if (nw % 10 === 0) c.boss = 1;
    $('#preview').innerHTML = '<b>Onda ' + nw + ':</b> ' + Object.entries(c).map(([k, v]) => v + '× ' + NAMES[k]).join(', ');
  }
  document.querySelectorAll('.tw').forEach(b => {
    b.classList.toggle('sel', b.dataset.t === g.players[0].sel);
    b.classList.toggle('no', g.players[0].gold < DEF[b.dataset.t].cost);
  });
  g.players.forEach((p, i) => {
    const c = $('#pc' + i);
    c.querySelector('.g').textContent = '🪙 ' + p.gold;
    c.querySelector('.s').textContent = 'Torre: ' + DEF[p.sel].n + ' (' + DEF[p.sel].cost + ')';
    c.querySelector('.k').textContent = p.kills + ' abates';
    c.querySelector('.ab').textContent = (i ? 'Congelar: ' : 'Ataque aéreo: ') + (p.cd > 0 ? Math.ceil(p.cd) + 's' : 'pronto');
    c.querySelector('.bar div').style.width = (100 - Math.max(0, p.cd) / p.cdMax * 100) + '%';
  });
  $('#bSpeed').textContent = 'Velocidade ' + g.speed + 'x';
  $('#bPause').textContent = g.state === 'pause' ? 'Continuar (P)' : 'Pausar (P)';
}

/* ---------- Telas ---------- */
const hiKey = () => 'bastiao3d-hi-' + M.mode + 'p';
function showMenu() {
  if (G) G.state = 'menu';
  const opt = (grp, arr) => `<div class="opts">${arr.map((n, i) => `<button class="btn ${M[grp] === i + (grp === 'mode' ? 1 : 0) ? 'on' : ''}" data-g="${grp}" data-v="${i + (grp === 'mode' ? 1 : 0)}">${n}</button>`).join('')}</div>`;
  $('#overlay').innerHTML = `<div class="card">
    <h2>Bastião 3D</h2><p>Construa torres, segure as ondas e proteja a base. Sobreviva a ${MAXW} ondas.</p>
    <h3>Modo</h3>${opt('mode', ['1 jogador', '2 jogadores (cooperativo)'])}
    <h3>Mapa</h3>${opt('map', MAPS.map(m => m.name))}
    <h3>Dificuldade</h3>${opt('diff', DIFFS.map(d => d.name))}
    <button class="go" data-a="start">Jogar</button>
    <div class="hi">Recorde (${M.mode} jogador${M.mode > 1 ? 'es' : ''}): ${localStorage.getItem(hiKey()) || 0} pontos</div>
  </div>`;
  $('#overlay').classList.add('on');
}
function finish(win) {
  const g = G; g.state = 'end';
  const best = Math.max(+localStorage.getItem(hiKey()) || 0, g.score);
  localStorage.setItem(hiKey(), best);
  const kills = g.players.map((p, i) => `Jogador ${i + 1}: ${p.kills} abates`).join(' · ');
  $('#overlay').innerHTML = `<div class="card">
    <h2>${win ? 'Vitória!' : 'A base caiu'}</h2>
    <p>${win ? `Você segurou as ${MAXW} ondas.` : `Você chegou até a onda ${g.wave}.`}</p>
    <p>Pontos: <b>${g.score}</b> · Recorde: ${best}<br>${kills}</p>
    ${win ? '<button class="go" data-a="continue">Continuar jogando (modo infinito)</button>' : ''}
    <button class="go ${win ? 'alt' : ''}" data-a="menu">Menu principal</button>
  </div>`;
  $('#overlay').classList.add('on');
  sfx(win ? 880 : 70, .6, win ? 'triangle' : 'sawtooth', .06);
}
function begin() {
  G = newGame(M); buildUI(); Object.assign(CAM, CAM0); G.state = 'play'; $('#overlay').classList.remove('on');
}
function togglePause() {
  if (!G) return;
  if (G.state === 'play') { G.state = 'pause'; $('#overlay').innerHTML = '<div class="card"><h2>Pausado</h2><p>Aperte P para continuar.</p><button class="go" data-a="resume">Continuar</button><button class="go alt" data-a="menu">Sair para o menu</button></div>'; $('#overlay').classList.add('on'); }
  else if (G.state === 'pause') { G.state = 'play'; $('#overlay').classList.remove('on'); }
}
function callWave() {
  if (G.state !== 'play' || G.active) return;
  const b = Math.floor(G.inter / 2);
  G.players.forEach(p => { p.gold += b; });
  if (b > 0) float(480, 60, '+' + b + ' ouro de bônus', '#ffd966');
  startWave();
}

/* ---------- Entrada ---------- */
document.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const d = b.dataset;
  if (d.g) { M[d.g] = +d.v; showMenu(); }
  else if (d.a === 'start') begin();
  else if (d.a === 'menu') { G = newGame(M); showMenu(); }
  else if (d.a === 'resume') togglePause();
  else if (d.a === 'continue') { G.state = 'play'; $('#overlay').classList.remove('on'); }
  else if (d.t && G) G.players[0].sel = d.t;
  b.blur();
});
$('#bWave').onclick = () => G && callWave();
$('#bFix').onclick = () => G && act(G.players[0], 'fix');
$('#bPause').onclick = togglePause;
$('#bSpeed').onclick = () => { if (G) G.speed = G.speed % 3 + 1; };
$('#bMute').onclick = () => { muted = !muted; $('#bMute').textContent = 'Som: ' + (muted ? 'desligado' : 'ligado'); };

const ray = new THREE.Raycaster(), gplane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hitP = new THREE.Vector3();
function mouseCell(e) {
  const r = cv.getBoundingClientRect();
  ray.setFromCamera({ x: ((e.clientX - r.left) / r.width) * 2 - 1, y: -((e.clientY - r.top) / r.height) * 2 + 1 }, camera);
  if (!ray.ray.intersectPlane(gplane, hitP)) return;
  const p = G.players[0];
  p.cx = Math.max(0, Math.min(COLS - 1, Math.floor(hitP.x)));
  p.cy = Math.max(0, Math.min(ROWS - 1, Math.floor(hitP.z)));
}
let drag = null;
cv.addEventListener('mousedown', e => {
  if (!G) return;
  if (e.button === 1 || e.shiftKey) { drag = { x: e.clientX, y: e.clientY }; e.preventDefault(); return; }
  if (G.state !== 'play') return;
  mouseCell(e); act(G.players[0], e.button === 2 ? 'sell' : 'place');
});
addEventListener('mousemove', e => {
  if (!drag) return;
  CAM.az -= (e.clientX - drag.x) * .008;
  CAM.el = Math.max(.45, Math.min(1.45, CAM.el + (e.clientY - drag.y) * .006));
  drag.x = e.clientX; drag.y = e.clientY;
});
addEventListener('mouseup', () => drag = null);
cv.addEventListener('mousemove', e => G && !drag && mouseCell(e));
cv.addEventListener('wheel', e => { e.preventDefault(); CAM.dist = Math.max(9, Math.min(32, CAM.dist + Math.sign(e.deltaY) * 1.2)); }, { passive: false });
cv.addEventListener('contextmenu', e => e.preventDefault());
cv.addEventListener('touchstart', e => { if (!G || G.state !== 'play') return; e.preventDefault(); mouseCell(e.touches[0]); act(G.players[0], 'place'); }, { passive: false });
cv.addEventListener('touchmove', e => { if (G) { e.preventDefault(); mouseCell(e.touches[0]); } }, { passive: false });

document.addEventListener('keydown', e => {
  if (!G) return;
  const k = e.key.toLowerCase();
  if (k === 'p' || k === 'escape') { if (!e.repeat) togglePause(); return; }
  if (G.state !== 'play') return;
  if (k === ' ') { e.preventDefault(); if (!e.repeat) callWave(); return; }
  if (k === ',') { CAM.az -= .12; return; }
  if (k === '.') { CAM.az += .12; return; }
  if (k === 'z') { CAM.el = Math.max(.45, CAM.el - .06); return; }
  if (k === 'x') { CAM.el = Math.min(1.45, CAM.el + .06); return; }
  if (k === '0') { Object.assign(CAM, CAM0); return; }
  if (/^[1-7]$/.test(k)) { G.players[0].sel = TYPES[+k - 1]; return; }
  G.players.forEach((p, i) => {
    const K = KEYS[i];
    if (k === K.up) mv(p, 0, -1);
    else if (k === K.down) mv(p, 0, 1);
    else if (k === K.left) mv(p, -1, 0);
    else if (k === K.right) mv(p, 1, 0);
    else if (e.repeat) return;
    else if (k === K.prev) cycle(p, -1);
    else if (k === K.next) cycle(p, 1);
    else if (k === K.place) act(p, 'place');
    else if (k === K.upg) act(p, 'upg');
    else if (k === K.sell) act(p, 'sell');
    else if (k === K.abil) act(p, 'abil');
    else if (k === K.tgt) act(p, 'tgt');
    else if (k === K.fix) act(p, 'fix');
    else return;
    e.preventDefault();
  });
});

/* ---------- Loop ---------- */
let last = 0;
function frame(t) {
  const dt = Math.min(.05, (t - last) / 1000); last = t;
  if (G.state === 'play') for (let i = 0; i < G.speed && G.state === 'play'; i++) update(dt);
  draw(); updateHUD();
  requestAnimationFrame(frame);
}
G = newGame(M); buildUI(); showMenu();
requestAnimationFrame(frame);
