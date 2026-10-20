'use strict';
/* ===================== BASTIÃO — Tower Defense ===================== */
const T = 48, COLS = 20, ROWS = 12, MAXW = 30;
const cv = document.getElementById('game'), ctx = cv.getContext('2d');
cv.width = COLS * T; cv.height = ROWS * T;
const $ = s => document.querySelector(s);
const PC = ['#f2b134', '#4cc9f0'];

/* ---------- Dados ---------- */
const MAPS = [
  { name: 'Serpente', pts: [[-1,2],[16,2],[16,5],[3,5],[3,9],[20,9]] },
  { name: 'Espiral', pts: [[-1,1],[18,1],[18,10],[1,10],[1,3],[15,3],[15,8],[4,8],[4,5],[10,5]] },
  { name: 'Zigue-zague', pts: [[2,-1],[2,9],[6,9],[6,2],[10,2],[10,9],[14,9],[14,2],[18,2],[18,12]] }
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
  sniper: { n: 'Sniper',   cost: 175, range: 300, rate: 2.3, dmg: 130, spd: 900, pierce: 1, strong: 1, col: '#ff7b7b', desc: 'Longo alcance, mira o mais forte' }
};
const TYPES = Object.keys(DEF);
const EN = {
  grunt:  { hp: 40,   spd: 46, r: 11, gold: 5,   dmg: 1, col: '#7fb069' },
  runner: { hp: 26,   spd: 96, r: 9,  gold: 5,   dmg: 1, col: '#f4d35e' },
  brute:  { hp: 220,  spd: 30, r: 15, gold: 14,  dmg: 2, col: '#8d6a9f', armor: .3 },
  flyer:  { hp: 65,   spd: 62, r: 10, gold: 9,   dmg: 1, col: '#6fd3d3', air: 1 },
  boss:   { hp: 1600, spd: 24, r: 21, gold: 120, dmg: 6, col: '#e4572e', armor: .2 }
};
const KEYS = [
  { up:'w', down:'s', left:'a', right:'d', prev:'q', next:'e', place:'f', upg:'r', sell:'g', abil:'t' },
  { up:'arrowup', down:'arrowdown', left:'arrowleft', right:'arrowright', prev:'n', next:'m', place:'enter', upg:'k', sell:'l', abil:'j' }
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
  const players = [];
  for (let i = 0; i < o.mode; i++) players.push({
    id: i, gold: df.gold, kills: 0, sel: 'arrow', cx: i ? 14 : 5, cy: i ? 7 : 7, cd: 0, cdMax: i ? 35 : 40
  });
  const ground = mkPath(map.pts);
  const air = mkPath([map.pts[0], map.pts[map.pts.length - 1]]);
  return {
    o, map, df, road, players, ground, air, state: 'menu', speed: 1, time: 0,
    lives: df.lives, wave: 0, active: false, inter: 25, queue: [], spawnT: 0, gap: .9,
    towers: [], occ: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
    enemies: [], proj: [], parts: [], floats: [], bolts: [], rings: [], strikes: [], freeze: 0,
    score: 0, won: false
  };
}

/* ---------- Ondas ---------- */
const hpMul = w => 1 + w * .25 + w * w * .015;
function startWave() {
  const g = G; g.wave++; g.active = true;
  const w = g.wave, q = [];
  for (let i = 0; i < 6 + w * 2; i++) q.push('grunt');
  if (w >= 2) for (let i = 0; i < w; i++) q.push('runner');
  if (w >= 4) for (let i = 0; i < Math.floor(w / 2); i++) q.push('brute');
  if (w >= 6) for (let i = 0; i < Math.floor(w / 2); i++) q.push('flyer');
  for (let i = q.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [q[i], q[j]] = [q[j], q[i]]; }
  if (w % 10 === 0) q.push('boss');
  g.queue = q; g.spawnT = 0; g.gap = Math.max(.35, .9 - w * .02);
  if (g.o.mode === 2) g.gap *= .8;
  sfx(220, .3, 'sawtooth', .05);
}
function spawn(type) {
  const g = G, d = EN[type];
  const path = d.air ? g.air : g.ground;
  const hp = d.hp * hpMul(g.wave) * g.df.hp * (g.o.mode === 2 ? 1.5 : 1);
  g.enemies.push({ type, d: 0, hp, max: hp, spd: d.spd, r: d.r, gold: d.gold + Math.floor(g.wave / 3), dmg: d.dmg,
    col: d.col, air: !!d.air, armor: d.armor || 0, path, x: path.p[0][0], y: path.p[0][1], slow: 0, slowF: 1, dead: false });
}
function endWave() {
  const g = G; g.active = false; g.inter = 18;
  const b = 20 + g.wave * 3;
  g.players.forEach(p => { p.gold += b; });
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
  const d = DEF[t.type]; let best = null, bv = -1;
  for (const e of G.enemies) {
    if (e.dead || (d.ground && e.air)) continue;
    if (Math.hypot(e.x - t.x, e.y - t.y) > s.range + e.r) continue;
    const v = d.strong ? e.hp : e.d;
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
  G.proj.push({ x: t.x, y: t.y, tg: e, tx: e.x, ty: e.y, dmg: s.dmg, spd: d.spd, d, owner: t.owner, col: d.col });
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
    burst(p.tg.x, p.tg.y, p.col, 3);
  }
}

/* ---------- Ações dos jogadores ---------- */
function act(p, kind) {
  const g = G; if (g.state !== 'play') return;
  const t = g.occ[p.cy][p.cx];
  if (kind === 'place') {
    if (t) return act(p, 'upg');
    if (g.road[p.cy][p.cx]) return deny(p, 'Na estrada não');
    const d = DEF[p.sel];
    if (p.gold < d.cost) return deny(p, 'Ouro insuficiente');
    p.gold -= d.cost;
    const nt = { type: p.sel, lvl: 1, cx: p.cx, cy: p.cy, x: (p.cx + .5) * T, y: (p.cy + .5) * T, cd: 0, ang: 0, owner: p, spent: d.cost };
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
    if (e.slow > 0) e.slow -= dt;
    e.d += e.spd * (e.slow > 0 ? e.slowF : 1) * (g.freeze > 0 ? 0 : 1) * dt;
    if (e.d >= e.path.len) {
      e.dead = true; g.lives -= e.dmg; sfx(90, .25, 'sawtooth', .06);
      float(Math.min(e.x, cv.width - 30), Math.min(e.y, cv.height - 20), '-' + e.dmg, '#ff6b6b');
      if (g.lives <= 0) { g.lives = 0; finish(false); return; }
    } else [e.x, e.y] = pointAt(e.path, e.d);
  }

  for (const t of g.towers) {
    t.cd -= dt;
    if (t.cd > 0) continue;
    const s = stat(t), e = pickTarget(t, s);
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

/* ---------- Desenho ---------- */
function draw() {
  const g = G;
  ctx.clearRect(0, 0, cv.width, cv.height);
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
    ctx.fillStyle = g.road[y][x] ? '#a98e5e' : (x + y) % 2 ? '#1e3f37' : '#1b3a33';
    ctx.fillRect(x * T, y * T, T, T);
    if (g.road[y][x]) { ctx.fillStyle = 'rgba(0,0,0,.08)'; ctx.fillRect(x * T + 4, y * T + 4, T - 8, T - 8); }
  }
  // entrada e base
  const a = g.ground.p[0], b = g.ground.p[g.ground.p.length - 1];
  marker(Math.max(14, Math.min(cv.width - 14, a[0])), Math.max(14, Math.min(cv.height - 14, a[1])), '#7fd28a', 'E');
  marker(Math.max(14, Math.min(cv.width - 14, b[0])), Math.max(14, Math.min(cv.height - 14, b[1])), '#ef5b5b', 'B');

  // torres
  for (const t of g.towers) drawTower(t);

  // cursores
  g.players.forEach(p => {
    const t = g.occ[p.cy][p.cx], x = p.cx * T, y = p.cy * T;
    const type = t ? t.type : p.sel, d = DEF[type];
    const ok = t || (!g.road[p.cy][p.cx] && p.gold >= d.cost);
    const rng = t ? stat(t).range : d.range;
    ctx.beginPath(); ctx.arc(x + T / 2, y + T / 2, rng, 0, 6.28);
    ctx.fillStyle = ok ? 'rgba(255,255,255,.07)' : 'rgba(239,91,91,.12)'; ctx.fill();
    ctx.strokeStyle = PC[p.id]; ctx.lineWidth = 3; ctx.strokeRect(x + 2, y + 2, T - 4, T - 4);
    if (t) {
      const c = t.lvl >= 3 ? 'máx.' : Math.round(DEF[t.type].cost * (t.lvl === 1 ? .8 : 1.2));
      tip(x, y, `${d.n} nv${t.lvl} · melhorar: ${c} · vender: ${Math.floor(t.spent * .7)}`, PC[p.id]);
    }
  });

  // inimigos
  for (const e of g.enemies) {
    if (e.air) { ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(e.x, e.y + 14, e.r, e.r / 2, 0, 0, 6.28); ctx.fill(); }
    ctx.fillStyle = e.slow > 0 ? '#8fe3ff' : e.col;
    ctx.beginPath(); ctx.arc(e.x, e.y - (e.air ? 8 : 0), e.r, 0, 6.28); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 2; ctx.stroke();
    const w = e.r * 2, yy = e.y - (e.air ? 8 : 0) - e.r - 7;
    ctx.fillStyle = '#300'; ctx.fillRect(e.x - w / 2, yy, w, 4);
    ctx.fillStyle = '#6fe27a'; ctx.fillRect(e.x - w / 2, yy, w * Math.max(0, e.hp / e.max), 4);
  }

  // projéteis, raios, anéis, partículas
  for (const p of g.proj) { ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(p.x, p.y, p.d.splash ? 5 : 3, 0, 6.28); ctx.fill(); }
  for (const bt of g.bolts) {
    ctx.strokeStyle = '#e9c2ff'; ctx.lineWidth = 3; ctx.beginPath();
    bt.pts.forEach(([x, y], i) => i ? ctx.lineTo(x + (Math.random() - .5) * 6, y + (Math.random() - .5) * 6) : ctx.moveTo(x, y));
    ctx.stroke();
  }
  for (const r of g.rings) {
    ctx.globalAlpha = r.life / r.max; ctx.strokeStyle = r.col; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(r.x, r.y, r.r * (1 - r.life / r.max * .4), 0, 6.28); ctx.stroke(); ctx.globalAlpha = 1;
  }
  for (const s of g.strikes) {
    ctx.strokeStyle = '#ff8a3d'; ctx.setLineDash([6, 6]); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(s.x, s.y, 95 * (1 - s.t / 1.4), 0, 6.28); ctx.stroke(); ctx.setLineDash([]);
  }
  for (const q of g.parts) { ctx.globalAlpha = Math.max(0, q.life / q.max); ctx.fillStyle = q.col; ctx.fillRect(q.x, q.y, q.r, q.r); }
  ctx.globalAlpha = 1;
  ctx.font = '700 15px system-ui'; ctx.textAlign = 'center';
  for (const f of g.floats) { ctx.globalAlpha = Math.min(1, f.life * 2); ctx.fillStyle = f.col; ctx.fillText(f.txt, f.x, f.y); }
  ctx.globalAlpha = 1;
  if (g.freeze > 0) { ctx.fillStyle = 'rgba(143,227,255,.15)'; ctx.fillRect(0, 0, cv.width, cv.height); }
}
function marker(x, y, col, ch) {
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 14, 0, 6.28); ctx.fill();
  ctx.fillStyle = '#0e1b1a'; ctx.font = '700 15px system-ui'; ctx.textAlign = 'center'; ctx.fillText(ch, x, y + 5);
}
function tip(x, y, txt, col) {
  ctx.font = '600 13px system-ui'; ctx.textAlign = 'left';
  const w = ctx.measureText(txt).width + 14;
  const bx = Math.min(cv.width - w - 4, Math.max(4, x)), by = y > 40 ? y - 28 : y + T + 6;
  ctx.fillStyle = 'rgba(8,16,15,.92)'; ctx.fillRect(bx, by, w, 22);
  ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.strokeRect(bx, by, w, 22);
  ctx.fillStyle = '#e6efe9'; ctx.fillText(txt, bx + 7, by + 15);
}
function drawTower(t) {
  const d = DEF[t.type];
  ctx.fillStyle = '#10201e'; ctx.beginPath(); ctx.arc(t.x, t.y, 19, 0, 6.28); ctx.fill();
  ctx.strokeStyle = PC[t.owner.id]; ctx.lineWidth = 3; ctx.stroke();
  ctx.save(); ctx.translate(t.x, t.y); ctx.rotate(t.ang); ctx.fillStyle = d.col;
  if (t.type === 'arrow') { ctx.beginPath(); ctx.moveTo(16, 0); ctx.lineTo(-8, -9); ctx.lineTo(-8, 9); ctx.fill(); }
  else if (t.type === 'cannon') { ctx.fillRect(0, -6, 20, 12); ctx.beginPath(); ctx.arc(0, 0, 10, 0, 6.28); ctx.fill(); }
  else if (t.type === 'frost') { ctx.rotate(.785); ctx.fillRect(-9, -9, 18, 18); }
  else if (t.type === 'tesla') { ctx.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? 5 : 13, a = i * .785; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.fill(); }
  else { ctx.fillRect(-4, -3, 26, 6); ctx.beginPath(); ctx.arc(0, 0, 7, 0, 6.28); ctx.fill(); }
  ctx.restore();
  ctx.fillStyle = '#fff';
  for (let i = 0; i < t.lvl; i++) ctx.fillRect(t.x - 10 + i * 7, t.y + 21, 5, 4);
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
  $('#help').innerHTML = `<b>Jogador 1:</b> <kbd>WASD</kbd> mover · <kbd>Q</kbd>/<kbd>E</kbd> trocar torre · <kbd>F</kbd> construir/melhorar · <kbd>R</kbd> melhorar · <kbd>G</kbd> vender · <kbd>T</kbd> ataque aéreo · ou use o mouse (clique esq. constrói/melhora, dir. vende)` +
    (G.o.mode === 2 ? `<br><b>Jogador 2:</b> <kbd>←↑↓→</kbd> mover · <kbd>N</kbd>/<kbd>M</kbd> trocar torre · <kbd>Enter</kbd> construir/melhorar · <kbd>K</kbd> melhorar · <kbd>L</kbd> vender · <kbd>J</kbd> congelar inimigos` : '') +
    `<br><kbd>1</kbd>-<kbd>5</kbd> escolhe torre (J1) · <kbd>Espaço</kbd> chama a onda · <kbd>P</kbd> pausa`;
}
function updateHUD() {
  const g = G;
  $('#hLives').textContent = g.lives;
  $('#hWave').textContent = g.wave + '/' + MAXW;
  $('#hEnemies').textContent = g.enemies.length + g.queue.length;
  $('#hScore').textContent = g.score;
  $('#hTimer').textContent = g.active ? 'em curso' : Math.ceil(g.inter) + 's';
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
const hiKey = () => 'bastiao-hi-' + M.mode + 'p';
function showMenu() {
  if (G) G.state = 'menu';
  const opt = (grp, arr) => `<div class="opts">${arr.map((n, i) => `<button class="btn ${M[grp] === i + (grp === 'mode' ? 1 : 0) ? 'on' : ''}" data-g="${grp}" data-v="${i + (grp === 'mode' ? 1 : 0)}">${n}</button>`).join('')}</div>`;
  $('#overlay').innerHTML = `<div class="card">
    <h2>Bastião</h2><p>Construa torres, segure as ondas e proteja a base. Sobreviva a ${MAXW} ondas.</p>
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
  G = newGame(M); buildUI(); G.state = 'play'; $('#overlay').classList.remove('on');
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
$('#bPause').onclick = togglePause;
$('#bSpeed').onclick = () => { if (G) G.speed = G.speed % 3 + 1; };
$('#bMute').onclick = () => { muted = !muted; $('#bMute').textContent = 'Som: ' + (muted ? 'desligado' : 'ligado'); };

function mouseCell(e) {
  const r = cv.getBoundingClientRect(), p = G.players[0];
  p.cx = Math.max(0, Math.min(COLS - 1, Math.floor((e.clientX - r.left) / r.width * COLS)));
  p.cy = Math.max(0, Math.min(ROWS - 1, Math.floor((e.clientY - r.top) / r.height * ROWS)));
}
cv.addEventListener('mousemove', e => G && mouseCell(e));
cv.addEventListener('mousedown', e => { if (!G || G.state !== 'play') return; mouseCell(e); act(G.players[0], e.button === 2 ? 'sell' : 'place'); });
cv.addEventListener('contextmenu', e => e.preventDefault());

document.addEventListener('keydown', e => {
  if (!G) return;
  const k = e.key.toLowerCase();
  if (k === 'p' || k === 'escape') { if (!e.repeat) togglePause(); return; }
  if (G.state !== 'play') return;
  if (k === ' ') { e.preventDefault(); if (!e.repeat) callWave(); return; }
  if (/^[1-5]$/.test(k)) { G.players[0].sel = TYPES[+k - 1]; return; }
  G.players.forEach((p, i) => {
    const K = KEYS[i];
    if (k === K.up) p.cy = Math.max(0, p.cy - 1);
    else if (k === K.down) p.cy = Math.min(ROWS - 1, p.cy + 1);
    else if (k === K.left) p.cx = Math.max(0, p.cx - 1);
    else if (k === K.right) p.cx = Math.min(COLS - 1, p.cx + 1);
    else if (e.repeat) return;
    else if (k === K.prev) cycle(p, -1);
    else if (k === K.next) cycle(p, 1);
    else if (k === K.place) act(p, 'place');
    else if (k === K.upg) act(p, 'upg');
    else if (k === K.sell) act(p, 'sell');
    else if (k === K.abil) act(p, 'abil');
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
