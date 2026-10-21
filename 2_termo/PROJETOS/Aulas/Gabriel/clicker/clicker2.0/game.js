'use strict';
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const KEY = 'minaDeCristais_v2';

/* ---------- Dados ---------- */
const GENS = [
  ['Minerador', '⛏️', 15, .1], ['Carrinho de Mina', '🛒', 100, 1], ['Perfuratriz', '🔩', 1100, 8],
  ['Golem de Pedra', '🗿', 12000, 47], ['Portal Cristalino', '🌀', 130000, 260], ['Dragão Geodo', '🐉', 1.4e6, 1400],
  ['Forja Estelar', '⭐', 2e7, 7800], ['Coração da Montanha', '💎', 3.3e8, 44000]];
const GCOL = ['#d98b3a', '#4aa3a0', '#9aa7b8', '#8d8da0', '#a45cff', '#35c47a', '#f2c21d', '#4fc3f7'];
const TIERS = ['Reforçado', 'de Elite', 'Mestre', 'Lendário'], TREQ = [1, 10, 25, 50], TMULT = [10, 100, 1e3, 1e4];
const ZONES = [['Gruta Cristalina', 0, 1], ['Veios de Ametista', 1e5, 1.5], ['Cavernas de Magma', 1e8, 2.5], ['Abismo Gelado', 1e11, 4], ['Núcleo Estelar', 1e14, 7]];
const TAL = [
  ['hands', '🤜', 'Mãos Fortes', '+25% de poder de clique por nível', 1, 10],
  ['vein', '🪨', 'Veia Rica', '+10% de produção por nível', 1, 20],
  ['eye', '🎯', 'Olho Clínico', '+2% de chance de crítico por nível', 2, 10],
  ['magnet', '🧲', 'Ímã de Raros', 'Cristais raros surgem 8% mais rápido por nível', 2, 8],
  ['auto', '🤖', 'Mineração Automática', '+1 clique automático por segundo por nível', 3, 10],
  ['deal', '🏷️', 'Barganha', 'Construções 2% mais baratas por nível', 2, 10],
  ['mem', '🌙', 'Memória da Mina', '+10% de ganho offline por nível', 2, 5],
  ['flow', '🌊', 'Fluxo Constante', 'O combo cai mais devagar por nível', 2, 5]];
const SK = [
  ['boom', '💥', 'Explosão', 'Ganha 40s de produção + 100 cliques', 60, 'Q'],
  ['heat', '🔥', 'Superaquecer', 'Produção x3 por 15s', 90, 'W'],
  ['rage', '⚡', 'Fúria', 'Poder de clique x10 por 10s', 120, 'E']];
const QT = {
  click: ['Clique {n} vezes', l => 60 * (1 + l), 2], build: ['Compre {n} construções', l => 10 + 5 * l, 2],
  crit: ['Acerte {n} críticos', l => 8 + 3 * l, 3], rare: ['Pegue {n} cristal raro', l => 1 + (l >> 2), 4],
  skill: ['Use habilidades {n} vezes', l => 2 + (l >> 1), 3], earn: ['Minere {n} cristais', l => Math.max(500, cps() * 300 * (1 + l * .3)), 3]};

const UPS = [];
[['Picareta de Ferro', 100, 2], ['Picareta de Aço', 1e3, 2], ['Picareta de Diamante', 2e4, 2], ['Picareta Rúnica', 5e5, 2], ['Picareta Cósmica', 2e7, 3]]
  .forEach(([n, c, m], i) => UPS.push({ id: 'c' + i, n, d: `Cliques valem ${m}x`, cost: c, ok: s => s.total >= c / 2, click: m, icon: '⛏️' }));
UPS.push({ id: 't0', n: 'Toque Ressonante', d: 'Cada clique rende +3% da produção por segundo', cost: 5e4, ok: s => s.total >= 2.5e4, touch: .03, icon: '👆' });
[['Lanterna Mágica', 25e3, 1.25], ['Veio Dourado', 5e6, 1.5], ['Sintonia Cósmica', 1e9, 2], ['Eco Infinito', 1e12, 3]]
  .forEach(([n, c, m], i) => UPS.push({ id: 'g' + i, n, d: `Toda a produção x${m}`, cost: c, ok: s => s.total >= c / 2, glob: m, icon: '✨' }));
GENS.forEach((g, gi) => TIERS.forEach((t, ti) => UPS.push({ id: `b${gi}_${ti}`, n: `${g[0]} ${t}`, d: `${g[0]} produz o dobro`, cost: g[2] * TMULT[ti], ok: s => s.owned[gi] >= TREQ[ti], gen: gi, icon: g[1] })));

/* ---------- Estado ---------- */
const fresh = () => ({ c: 0, run: 0, total: 0, clicks: 0, owned: GENS.map(() => 0), ups: [], ach: [], ess: 0, rebirths: 0, golden: 0, best: 0,
  crits: 0, maxCombo: 0, maxZone: 0, g: 0, tal: {}, sk: { boom: { l: 1, r: 0 }, heat: { l: 1, r: 0 }, rage: { l: 1, r: 0 } }, q: [], mdone: 0, sound: true,
  t0: Date.now(), last: Date.now() });
let S = fresh(), buffs = [], buyAmt = 1, upKey = '', combo = 0, lastClick = 0, autoAcc = 0, tab = 'ups';

/* ---------- Utilidades ---------- */
const UNITS = ['mil', 'mi', 'bi', 'tri', 'quad', 'quin', 'sex', 'sep', 'oct'];
function fmt(n) {
  if (n < 1000) return n < 10 && n % 1 ? n.toFixed(1).replace('.', ',') : Math.floor(n).toLocaleString('pt-BR');
  let i = -1; while (n >= 1000 && i < UNITS.length - 1) { n /= 1000; i++; }
  return n.toFixed(2).replace('.', ',') + ' ' + UNITS[i];
}
function fmtTime(s) { s = Math.floor(s); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return h ? `${h}h ${m}min` : m ? `${m}min ${s % 60}s` : `${s}s`; }
function toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; $('#toasts').append(t); setTimeout(() => t.remove(), 4000); }
function put(id, key, html) { const e = $('#' + id); if (e._k !== key) { e._k = key; e.innerHTML = html; } }
const accent = () => getComputedStyle(document.body).getPropertyValue('--teal').trim();

const ACH = [];
const add = (ic, n, d, f) => ACH.push([ic, n, d, f]);
[1, 100, 1e3, 1e4, 1e5].forEach(n => add('👆', `${n.toLocaleString('pt-BR')} cliques`, `Dê ${n.toLocaleString('pt-BR')} cliques`, s => s.clicks >= n));
[1e3, 1e6, 1e9, 1e12, 1e15, 1e18].forEach(n => add('💰', `${fmt(n)} minerados`, `Minere ${fmt(n)} cristais no total`, s => s.total >= n));
[10, 1e3, 1e5, 1e7, 1e9].forEach(n => add('🏭', `${fmt(n)}/s`, `Produza ${fmt(n)} por segundo`, s => s.best >= n));
GENS.forEach((g, i) => add(g[1], `Mestre: ${g[0]}`, `Tenha 50 ${g[0]}`, s => s.owned[i] >= 50));
add('🔥', 'Combo máximo', 'Chegue a 100 de combo', s => s.maxCombo >= 100);
[10, 100, 1e3].forEach(n => add('🎯', `${n} críticos`, `Acerte ${n} críticos`, s => s.crits >= n));
[1, 10, 50].forEach(n => add('💠', `${n} raros`, `Pegue ${n} cristais raros`, s => s.golden >= n));
[1, 5, 10].forEach(n => add('♻️', `${n} renascimentos`, `Renasça ${n} vez(es)`, s => s.rebirths >= n));
[1, 2, 3, 4].forEach(n => add('🧭', ZONES[n][0], `Alcance a zona ${ZONES[n][0]}`, s => s.maxZone >= n));
[5, 25, 100].forEach(n => add('📜', `${n} missões`, `Cumpra ${n} missões`, s => s.mdone >= n));

/* ---------- Cálculos ---------- */
const tl = id => S.tal[id] || 0, has = id => S.ups.includes(id);
const zone = () => ZONES.reduce((z, x, i) => S.total >= x[1] ? i : z, 0);
const buffMult = t => buffs.reduce((m, b) => b.type === t ? m * b.m : m, 1);
const genMult = i => UPS.reduce((m, u) => u.gen === i && has(u.id) ? m * 2 : m, 1);
const metaMult = () => (1 + S.ess * .05) * (1 + S.ach.length * .02) * (1 + .1 * tl('vein')) * ZONES[zone()][2];
const comboMult = () => 1 + Math.min(combo, 100) * .02;
const skM = k => 1 + .2 * (S.sk[k].l - 1);
function cps() {
  let g = metaMult() * buffMult('prod');
  UPS.forEach(u => { if (u.glob && has(u.id)) g *= u.glob; });
  return GENS.reduce((s, x, i) => s + S.owned[i] * x[3] * genMult(i), 0) * g;
}
function clickPow() {
  let m = 1, t = 0;
  UPS.forEach(u => { if (has(u.id)) { if (u.click) m *= u.click; if (u.touch) t += u.touch; } });
  return (m * metaMult() * (1 + .25 * tl('hands')) + t * cps()) * buffMult('click');
}
const costN = (i, n) => GENS[i][2] * 1.15 ** S.owned[i] * ((1.15 ** n - 1) / .15) * (1 - .02 * tl('deal'));
function maxN(i) { let n = 0; while (n < 500 && costN(i, n + 1) <= S.c) n++; return n; }
const pending = () => Math.floor(Math.sqrt(S.run / 1e6));
function gain(x) { S.c += x; S.run += x; S.total += x; ev('earn', x); }

/* ---------- Missões ---------- */
function newQ(cur) {
  const ks = Object.keys(QT).filter(k => !cur.some(q => q.k === k)), k = ks[Math.random() * ks.length | 0];
  return { k, n: Math.max(1, Math.round(QT[k][1](S.mdone / 3 | 0))), p: 0 };
}
function ev(k, a = 1) {
  let done = false;
  S.q.forEach(q => { if (q.k === k && q.p < q.n) { q.p += a; if (q.p >= q.n) done = true; } });
  if (done) S.q = S.q.map(q => {
    if (q.p < q.n) return q;
    const r = QT[q.k][2]; S.g += r; S.mdone++; toast(`📜 Missão cumprida! +${r} 🔮`);
    return newQ(S.q.filter(x => x !== q));
  });
}

/* ---------- Efeitos: partículas e som ---------- */
const cv = $('#fx'), cx = cv.getContext('2d'); let P = [], raf = 0;
const resize = () => { cv.width = innerWidth; cv.height = innerHeight; }; addEventListener('resize', resize); resize();
function burst(x, y, n, col) {
  for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, v = 2 + Math.random() * 5; P.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2, l: 1, c: col, s: 2 + Math.random() * 3 }); }
  if (!raf) raf = requestAnimationFrame(fxLoop);
}
function fxLoop() {
  cx.clearRect(0, 0, cv.width, cv.height); P = P.filter(p => p.l > 0);
  P.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .25; p.l -= .025; cx.globalAlpha = Math.max(p.l, 0); cx.fillStyle = p.c; cx.fillRect(p.x, p.y, p.s, p.s); });
  raf = P.length ? requestAnimationFrame(fxLoop) : 0;
}
let AC;
function beep(f, d = .07, t = 'triangle', v = .05) {
  if (!S.sound) return;
  try {
    AC = AC || new AudioContext(); const o = AC.createOscillator(), g = AC.createGain(), n = AC.currentTime;
    o.type = t; o.frequency.value = f; g.gain.setValueAtTime(v, n); g.gain.exponentialRampToValueAtTime(.001, n + d);
    o.connect(g).connect(AC.destination); o.start(); o.stop(n + d);
  } catch (e) {}
}
function floatText(txt, x, y, crit) {
  const f = document.createElement('div'); f.className = 'float' + (crit ? ' crit' : ''); f.textContent = txt;
  f.style.left = x + 'px'; f.style.top = y + 'px'; document.body.append(f); setTimeout(() => f.remove(), 900);
}

/* ---------- Ações ---------- */
function mine(x, y) {
  lastClick = Date.now(); combo++; S.maxCombo = Math.max(S.maxCombo, Math.floor(combo));
  let p = clickPow() * comboMult();
  const crit = Math.random() < .05 + .02 * tl('eye');
  if (crit) {
    p *= 5; S.crits++; ev('crit');
    if (Math.random() < .2) { S.g++; toast('🔮 +1 gema!'); }
  }
  gain(p); S.clicks++; ev('click'); pulse(crit);
  floatText((crit ? 'CRÍTICO ' : '') + '+' + fmt(p), x + Math.random() * 40 - 20, y, crit);
  burst(x, y, crit ? 28 : 8, crit ? '#ffb84d' : accent());
  beep(300 + Math.min(combo, 100) * 6 + (crit ? 250 : 0), .06, crit ? 'square' : 'triangle');
  render();
}
$('#crystal').addEventListener('click', e => { if (e.detail) mine(e.clientX, e.clientY); });
function crystalPos() { const r = $('#stage').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height * .45]; }

function buyGen(i) {
  const n = buyAmt === 'max' ? maxN(i) : buyAmt;
  if (n < 1 || costN(i, n) > S.c) return;
  S.c -= costN(i, n); S.owned[i] += n; ev('build', n); beep(520, .05, 'sine'); render();
}
function buyUp(id) {
  const u = UPS.find(x => x.id === id);
  if (!u || has(id) || S.c < u.cost) return;
  S.c -= u.cost; S.ups.push(id); upKey = ''; beep(660, .1, 'sine'); render();
}
function buyTal(id) {
  const t = TAL.find(x => x[0] === id), l = tl(id), c = t[4] * (l + 1);
  if (l >= t[5] || S.ess < c) return;
  S.ess -= c; S.tal[id] = l + 1; beep(740, .12, 'sine'); render();
}
function useSkill(i) {
  const [k, , , , cd] = SK[i], s = S.sk[k], now = Date.now();
  if (now < s.r) return;
  s.r = now + cd * 1000 * .95 ** (s.l - 1); const m = skM(k);
  if (k === 'boom') { const [x, y] = crystalPos(), g = (cps() * 40 + clickPow() * 100) * m; gain(g); burst(x, y, 40, '#ffb84d'); pulse(true); toast(`💥 Explosão! +${fmt(g)} cristais.`); }
  if (k === 'heat') buffs.push({ n: `Superaquecer x${(1 + 2 * m).toFixed(1)}`, type: 'prod', m: 1 + 2 * m, end: now + 15000 });
  if (k === 'rage') buffs.push({ n: `Fúria x${(1 + 9 * m).toFixed(0)}`, type: 'click', m: 1 + 9 * m, end: now + 10000 });
  ev('skill'); beep(180, .25, 'sawtooth', .07); render();
}
function upSkill(i) {
  const s = S.sk[SK[i][0]], c = 5 * s.l * s.l;
  if (S.g < c) return; S.g -= c; s.l++; render();
}
function checkAch() {
  ACH.forEach((a, i) => { if (!S.ach.includes(i) && a[3](S)) { S.ach.push(i); toast(`🏆 ${a[1]} (+2% de produção)`); } });
}
function rebirth() {
  const p = pending(); if (p < 1) return;
  if (!confirm(`Renascer reinicia cristais, construções e melhorias. Você ganha ${p} essências. Continuar?`)) return;
  S.ess += p; S.rebirths++; S.c = 0; S.run = 0; S.owned = GENS.map(() => 0); S.ups = []; upKey = '';
  toast(`♻️ Você renasceu! +${p} essências.`); save(true); render();
}

/* ---------- Cristal raro ---------- */
let gTimer;
const scheduleGolden = () => { clearTimeout(gTimer); gTimer = setTimeout(spawnGolden, (60 + Math.random() * 90) * 1000 * .92 ** tl('magnet')); };
function spawnGolden() {
  const el = document.createElement('button'); el.className = 'golden'; el.textContent = '💠'; el.title = 'Cristal raro!';
  el.style.left = 8 + Math.random() * 80 + '%'; el.style.top = 15 + Math.random() * 65 + '%';
  const gone = setTimeout(() => { el.remove(); scheduleGolden(); }, 13000);
  el.onclick = () => {
    clearTimeout(gone); el.remove(); S.golden++; ev('rare'); S.g += 2;
    const r = Math.random(), now = Date.now();
    if (r < .45) { buffs.push({ n: 'Frenesi: produção x7', type: 'prod', m: 7, end: now + 30000 }); toast('💠 Frenesi! Produção x7 por 30s. +2 🔮'); }
    else if (r < .75) { buffs.push({ n: 'Cliques x777', type: 'click', m: 777, end: now + 10000 }); toast('💠 Chuva de cliques! x777 por 10s. +2 🔮'); }
    else { const b = Math.min(cps() * 900, S.c * .15) + 13; gain(b); toast(`💠 Sorte! +${fmt(b)} cristais e +2 🔮`); }
    scheduleGolden(); render();
  };
  document.body.append(el);
}

/* ---------- Interface ---------- */
const genEls = GENS.map((g, i) => {
  const b = document.createElement('button'); b.className = 'gen';
  b.innerHTML = `<span class="ic" style="--g:${GCOL[i]}">${g[1]}</span><span class="nm"></span><span class="n">0</span><span class="cost"></span>`;
  b.onclick = () => buyGen(i); $('#gens').append(b); return b;
});
const achEls = ACH.map(a => { const d = document.createElement('div'); d.className = 'ach'; d.textContent = a[0]; d.title = `${a[1]}: ${a[2]}`; $('#achs').append(d); return d; });
const skEls = SK.map((s, i) => {
  const d = document.createElement('div'); d.className = 'skill';
  d.innerHTML = `<button class="use" title="${s[3]}"><span class="ic">${s[1]}</span><span><b>${s[2]}</b> <small>[${s[5]}]</small><small class="st"></small></span></button><button class="lv"></button>`;
  d.children[0].onclick = () => useSkill(i); d.children[1].onclick = () => upSkill(i); $('#skills').append(d); return d;
});
$('#amt').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  buyAmt = b.dataset.n === 'max' ? 'max' : +b.dataset.n;
  $$('#amt button').forEach(x => x.classList.toggle('on', x === b)); render();
});
$('#ups').addEventListener('click', e => { const b = e.target.closest('.up'); if (b) buyUp(b.dataset.id); });
$('#tal').addEventListener('click', e => { const b = e.target.closest('.up'); if (b) buyTal(b.dataset.id); });
$('#tabs').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return; tab = b.dataset.tab;
  $$('#tabs button').forEach(x => x.classList.toggle('on', x === b));
  $$('.pane').forEach(p => p.hidden = p.id !== 'p-' + tab); render();
});

function render() {
  const z = zone(), now = Date.now(), nx = ZONES[z + 1];
  if (z > S.maxZone) { S.maxZone = z; toast(`🧭 Nova zona: ${ZONES[z][0]}! Produção x${ZONES[z][2]}.`); }
  document.body.dataset.zone = z;
  $('#bank').textContent = fmt(S.c); $('#cps').textContent = fmt(cps()); $('#gems').textContent = S.g;
  $('#clickPow').textContent = fmt(clickPow() * comboMult());
  $('#combo').style.width = Math.min(combo, 100) + '%';
  $('#comboTxt').textContent = combo >= 2 ? `Combo ${Math.floor(combo)} · cliques x${comboMult().toFixed(2)}` : 'Clique rápido para criar combo';
  $('#zone').textContent = ZONES[z][0] + (ZONES[z][2] > 1 ? ` · produção x${ZONES[z][2]}` : '');
  $('#zbar').style.width = nx ? Math.min(100, (S.total - ZONES[z][1]) / (nx[1] - ZONES[z][1]) * 100) + '%' : '100%';
  document.title = fmt(S.c) + ' cristais · Mina';

  GENS.forEach((g, i) => {
    const el = genEls[i], n = buyAmt === 'max' ? Math.max(1, maxN(i)) : buyAmt, cost = costN(i, n);
    const locked = S.total < g[2] * .6 && S.owned[i] === 0;
    el.classList.toggle('locked', locked); el.classList.toggle('can', S.c >= cost);
    el.querySelector('.nm').textContent = locked ? '???' : `${i + 1}. ${g[0]}`;
    el.querySelector('.n').textContent = S.owned[i];
    el.querySelector('.cost').textContent = locked ? 'Continue minerando' : `${fmt(cost)} · +${fmt(g[3] * genMult(i) * metaMult())}/s cada (x${n})`;
  });
  SK.forEach((s, i) => {
    const st = S.sk[s[0]], left = Math.max(0, st.r - now), tot = s[4] * 1000 * .95 ** (st.l - 1), c = 5 * st.l * st.l;
    const u = skEls[i].children[0], l = skEls[i].children[1];
    u.classList.toggle('ready', !left); u.style.setProperty('--p', (left / tot * 100) + '%');
    u.querySelector('.st').textContent = left ? `Recarregando ${Math.ceil(left / 1000)}s` : `${s[3]} (efeito +${Math.round((skM(s[0]) - 1) * 100)}%)`;
    l.textContent = `Nv ${st.l} ▲ ${c}🔮`; l.classList.toggle('can', S.g >= c);
  });

  const vis = UPS.filter(u => !has(u.id) && u.ok(S)).sort((a, b) => a.cost - b.cost).slice(0, 12), key = vis.map(u => u.id).join();
  if (key !== upKey) {
    upKey = key;
    $('#ups').innerHTML = vis.length ? vis.map(u => `<button class="up" data-id="${u.id}"><span class="ic">${u.icon}</span><div><b>${u.n}</b><span>${u.d}</span><em>${fmt(u.cost)} cristais</em></div></button>`).join('')
      : '<p class="muted">Nenhuma melhoria disponível agora. Compre mais construções!</p>';
  }
  $$('#ups .up').forEach(b => b.classList.toggle('can', S.c >= UPS.find(u => u.id === b.dataset.id).cost));

  achEls.forEach((el, i) => el.classList.toggle('got', S.ach.includes(i)));
  $('#achCount').textContent = `${S.ach.length}/${ACH.length}`;

  if (tab === 'tals') {
    $('#ess').textContent = S.ess; $('#essPending').textContent = pending(); $('#rebirth').disabled = pending() < 1;
    put('tal', TAL.map(t => tl(t[0]) + (S.ess >= t[4] * (tl(t[0]) + 1) ? 'y' : 'n')).join() + S.ess,
      TAL.map(t => {
        const l = tl(t[0]), c = t[4] * (l + 1), mx = l >= t[5];
        return `<button class="up${mx ? ' max' : S.ess >= c ? ' can' : ''}" data-id="${t[0]}"><span class="ic">${t[1]}</span><div><b>${t[2]} · ${l}/${t[5]}</b><span>${t[3]}</span><em>${mx ? 'Nível máximo' : c + ' essências'}</em></div></button>`;
      }).join(''));
  }
  if (tab === 'qs') put('qs', JSON.stringify(S.q), S.q.map(q => `<div class="q"><p>${QT[q.k][0].replace('{n}', fmt(q.n))}<small>+${QT[q.k][2]} 🔮</small></p><div class="bar"><i style="width:${Math.min(100, q.p / q.n * 100)}%"></i></div></div>`).join(''));
  if (tab === 'more') {
    const rows = [['Cliques', fmt(S.clicks)], ['Críticos', fmt(S.crits)], ['Maior combo', S.maxCombo], ['Total minerado', fmt(S.total)], ['Minerado nesta run', fmt(S.run)],
      ['Melhor produção/s', fmt(S.best)], ['Construções', S.owned.reduce((a, b) => a + b, 0)], ['Cristais raros', S.golden], ['Missões cumpridas', S.mdone],
      ['Renascimentos', S.rebirths], ['Bônus total', '+' + Math.round((metaMult() - 1) * 100) + '%'], ['Tempo de jogo', fmtTime((now - S.t0) / 1000)]];
    $('#stats').innerHTML = rows.map(r => `<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('');
  }
  $('#buffs').innerHTML = buffs.map(b => `<span class="buff">${b.n} · ${Math.ceil((b.end - now) / 1000)}s</span>`).join('');
  $('#snd').textContent = 'Som: ' + (S.sound ? 'ligado' : 'desligado');
}

/* ---------- Loop e atalhos ---------- */
function tick() {
  const now = Date.now(), dt = Math.min((now - S.last) / 1000, 5);
  S.last = now; buffs = buffs.filter(b => b.end > now);
  if (now - lastClick > 800) combo = Math.max(0, combo - dt * 10 / (1 + .3 * tl('flow')));
  gain(cps() * dt); S.best = Math.max(S.best, cps());
  autoAcc += dt * tl('auto'); while (autoAcc >= 1) { autoAcc--; gain(clickPow()); }
  checkAch(); render();
}
addEventListener('keydown', e => {
  if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key.toLowerCase();
  if (e.code === 'Space' || (e.key === 'Enter' && document.activeElement.id === 'crystal')) { e.preventDefault(); const [x, y] = crystalPos(); mine(x, y); }
  else if ('qwe'.includes(k) && k.length === 1) useSkill('qwe'.indexOf(k));
  else if (/^[1-8]$/.test(k)) buyGen(+k - 1);
});

/* ---------- Opções e save ---------- */
function load(raw) { S = Object.assign(fresh(), JSON.parse(raw)); while (S.owned.length < GENS.length) S.owned.push(0); }
function save(silent) {
  S.last = Date.now();
  try { localStorage.setItem(KEY, JSON.stringify(S)); if (!silent) toast('Jogo salvo.'); } catch (e) { toast('Não foi possível salvar neste navegador.'); }
}
$('#save').onclick = () => save();
$('#rebirth').onclick = rebirth;
$('#snd').onclick = () => { S.sound = !S.sound; render(); };
$('#export').onclick = () => { save(true); prompt('Copie seu save:', btoa(unescape(encodeURIComponent(JSON.stringify(S))))); };
$('#import').onclick = () => {
  const t = prompt('Cole seu save:'); if (!t) return;
  try { load(decodeURIComponent(escape(atob(t.trim())))); upKey = ''; save(true); render(); toast('Save importado!'); }
  catch (e) { toast('Save inválido. Confira se copiou o texto inteiro.'); }
};
$('#reset').onclick = () => {
  if (!confirm('Apagar TODO o progresso, inclusive conquistas, talentos e essências?')) return;
  S = fresh(); buffs = []; combo = 0; upKey = ''; while (S.q.length < 3) S.q.push(newQ(S.q)); save(true); render(); toast('Progresso apagado.');
};

/* ---------- Início ---------- */
try { const raw = localStorage.getItem(KEY); if (raw) load(raw); } catch (e) {}
while (S.q.length < 3) S.q.push(newQ(S.q));
const away = Math.min((Date.now() - S.last) / 1000, 8 * 3600);
if (away > 60 && cps() > 0) {
  const g = cps() * away * (.5 + .1 * tl('mem')); gain(g);
  toast(`Bem-vindo de volta! Seus mineradores trabalharam ${fmtTime(away)} e geraram ${fmt(g)} cristais.`);
}
S.last = Date.now();
setInterval(tick, 100);
setInterval(() => save(true), 15000);
addEventListener('beforeunload', () => save(true));
scheduleGolden(); render();

/* ---------- Cena 3D (Three.js) ---------- */
const ZCOL = [0x3df2d0, 0xc05cff, 0xff7a2e, 0x6fd6ff, 0xffd84d], SPIN = [2, 4, 6, 7];
let kick = 0;
function pulse(c) { kick = c ? 1.7 : 1; }

(function init3d() {
  const gl = $('#gl'), st = $('#stage');
  if (!window.THREE) {
    gl.addEventListener('pointerdown', e => mine(e.clientX, e.clientY));
    st.insertAdjacentHTML('beforeend', '<p class="muted" style="position:absolute;top:42%;width:100%;margin:0">Biblioteca 3D indisponível (sem internet?). Clique aqui para minerar.</p>');
    return;
  }
  const T = THREE, R = new T.WebGLRenderer({ canvas: gl, antialias: true, alpha: true });
  R.setPixelRatio(Math.min(devicePixelRatio, 2));
  const sc = new T.Scene(), cam = new T.PerspectiveCamera(42, 1, .1, 100), pivot = new T.Group(); sc.add(pivot);
  let zoom = 1.15;
  const place = () => { cam.position.set(0, 5.2 * zoom, 13 * zoom); cam.lookAt(0, .2, 0); }; place();
  const fit = () => { const w = st.clientWidth, h = st.clientHeight; R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
  new ResizeObserver(fit).observe(st); fit();

  sc.add(new T.AmbientLight(0x8877bb, .75));
  const sun = new T.DirectionalLight(0xffffff, .8); sun.position.set(4, 8, 6); sc.add(sun);
  const L1 = new T.PointLight(0x3df2d0, 2.2, 18), L2 = new T.PointLight(0x8b5cf6, 1.6, 18), core = new T.PointLight(0x3df2d0, 1.5, 10);
  core.position.set(0, 1, 0); sc.add(L1, L2, core);

  /* cristal principal + aglomerado */
  const mat = new T.MeshPhysicalMaterial({ color: ZCOL[0], emissive: ZCOL[0], emissiveIntensity: .3, roughness: .12, metalness: .1, clearcoat: 1, flatShading: true, transparent: true, opacity: .93 });
  const geo = new T.LatheGeometry([[0, -1.7], [.85, -1], [.95, .8], [.55, 1.7], [0, 2.2]].map(p => new T.Vector2(p[0], p[1])), 6);
  const cg = new T.Group(); pivot.add(cg);
  const big = new T.Mesh(geo, mat); big.position.y = .1; cg.add(big);
  for (let i = 0; i < 8; i++) {
    const s = .28 + Math.random() * .3, a = i / 8 * 6.283 + Math.random() * .4, r = 1.4 + Math.random() * .5, m = new T.Mesh(geo, mat);
    m.scale.setScalar(s); m.position.set(Math.cos(a) * r, -1.5 + s * 1.6, Math.sin(a) * r);
    m.rotation.set(Math.sin(a) * .5, Math.random() * 3, -Math.cos(a) * .5); cg.add(m);
  }
  cg.add(new T.Mesh(new T.SphereGeometry(2.4, 8, 6), new T.MeshBasicMaterial({ visible: false }))); /* área de clique generosa */

  /* chão e pedras */
  const gm = new T.MeshStandardMaterial({ color: 0x1b1533, roughness: 1, flatShading: true });
  const ground = new T.Mesh(new T.CylinderGeometry(6.3, 6.6, .4, 48), gm); ground.position.y = -1.9; pivot.add(ground);
  for (let i = 0; i < 16; i++) {
    const a = i / 16 * 6.283, s = .3 + Math.random() * .5, r = 6 + Math.random() * .4, k = new T.Mesh(new T.DodecahedronGeometry(s, 0), gm);
    k.position.set(Math.cos(a) * r, -1.6 + s * .3, Math.sin(a) * r); k.rotation.set(Math.random() * 3, Math.random() * 3, 0); pivot.add(k);
  }

  /* trabalhadores 3D: um anel por construção */
  const M = (g, c, e = 0) => new T.Mesh(g, new T.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: e, roughness: .6, flatShading: true }));
  const MK = [
    () => { const g = new T.Group(), h = M(new T.SphereGeometry(.1, 8, 6), 0xf2c9a0), c = M(new T.SphereGeometry(.11, 8, 6, 0, 6.3, 0, 1.5), 0xffcc33, .4);
      h.position.y = .22; c.position.y = .25; g.add(M(new T.CylinderGeometry(.1, .14, .3, 6), 0x8a5a2b), h, c); return g; },
    () => { const g = new T.Group(), o = M(new T.BoxGeometry(.3, .1, .2), 0x3df2d0, .6); o.position.y = .12; g.add(M(new T.BoxGeometry(.4, .18, .26), 0x6b7280), o); return g; },
    () => { const m = M(new T.ConeGeometry(.13, .5, 8), 0xb8c0cc); m.rotation.x = Math.PI; return m; },
    () => { const g = new T.Group(), h = M(new T.BoxGeometry(.18, .16, .18), 0x8e8e9c), e = M(new T.BoxGeometry(.2, .04, .04), 0xffb84d, 1);
      h.position.y = .24; e.position.set(0, .25, .1); g.add(M(new T.BoxGeometry(.3, .3, .3), 0x7c7c8a), h, e); return g; },
    () => M(new T.TorusGeometry(.2, .05, 8, 18), 0xb06bff, .9),
    () => { const g = new T.Group(); g.add(M(new T.IcosahedronGeometry(.2, 0), 0x35d07f, .2));
      [-1, 1].forEach(s => { const w = M(new T.ConeGeometry(.12, .35, 3), 0x1f9d5c); w.rotation.z = s * 1.3; w.position.x = s * .25; g.add(w); }); return g; },
    () => M(new T.OctahedronGeometry(.26), 0xffd84d, .9),
    () => M(new T.DodecahedronGeometry(.28), 0x6fd6ff, .9)];
  const ringR = i => 2.7 + i * .45, og = [], rings = [], cnt = [];
  GENS.forEach((g, i) => {
    const o = new T.Group(); pivot.add(o); og.push(o); cnt.push(-1);
    const rg = new T.Mesh(new T.RingGeometry(ringR(i) - .012, ringR(i) + .012, 72), new T.MeshBasicMaterial({ color: ZCOL[0], transparent: true, opacity: .28, side: T.DoubleSide }));
    rg.rotation.x = -Math.PI / 2; rg.position.y = -1.68; rg.visible = false; pivot.add(rg); rings.push(rg);
  });
  function build(i) {
    const n = Math.min(S.owned[i], 12), o = og[i], k2 = 1 + .12 * TREQ.filter(r => S.owned[i] >= r).length;
    while (o.children.length) o.remove(o.children[0]);
    for (let k = 0; k < n; k++) {
      const a = k / n * 6.283, w = MK[i]();
      w.position.set(Math.cos(a) * ringR(i), -1.35, Math.sin(a) * ringR(i)); w.rotation.y = -a; w.scale.setScalar(k2); o.add(w);
    }
    rings[i].visible = n > 0; cnt[i] = S.owned[i];
  }

  /* poeira flutuante */
  const N = 160, pa = new Float32Array(N * 3);
  for (let i = 0; i < N * 3; i += 3) { pa[i] = (Math.random() - .5) * 12; pa[i + 1] = Math.random() * 7 - 2; pa[i + 2] = (Math.random() - .5) * 12; }
  const pg = new T.BufferGeometry(); pg.setAttribute('position', new T.BufferAttribute(pa, 3));
  const dust = new T.Points(pg, new T.PointsMaterial({ color: ZCOL[0], size: .07, transparent: true, opacity: .7, depthWrite: false, blending: T.AdditiveBlending })); pivot.add(dust);

  /* entrada: clique, arrastar e zoom */
  const ray = new T.Raycaster(), v2 = new T.Vector2();
  const hit = e => { const r = gl.getBoundingClientRect(); v2.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(v2, cam); return ray.intersectObject(cg, true).length > 0; };
  let drag = null;
  gl.addEventListener('pointerdown', e => { drag = { sx: e.clientX, lx: e.clientX, moved: false }; gl.setPointerCapture(e.pointerId); });
  gl.addEventListener('pointermove', e => {
    if (!drag) return;
    if (Math.abs(e.clientX - drag.sx) > 6) drag.moved = true;
    if (drag.moved) { pivot.rotation.y += (e.clientX - drag.lx) * .01; }
    drag.lx = e.clientX;
  });
  gl.addEventListener('pointerup', e => { if (drag && !drag.moved && hit(e)) mine(e.clientX, e.clientY); drag = null; });
  gl.addEventListener('wheel', e => { e.preventDefault(); zoom = Math.min(1.6, Math.max(.75, zoom + e.deltaY * .001)); place(); }, { passive: false });

  /* loop de animação */
  const tgt = new T.Color(), clock = new T.Clock();
  const cols = [mat.color, mat.emissive, L1.color, core.color, dust.material.color, ...rings.map(r => r.material.color)];
  (function loop() {
    requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), .1), t = clock.elapsedTime, cm = Math.min(combo, 100) / 100;
    tgt.set(ZCOL[zone()]); cols.forEach(c => c.lerp(tgt, .04));
    kick *= .9;
    cg.scale.setScalar(1 + kick * .1); cg.rotation.y += dt * (.35 + cm * 1.2); cg.position.y = Math.sin(t * 1.4) * .08;
    big.rotation.z = Math.sin(t * 70) * kick * .03;
    mat.emissiveIntensity = .28 + cm * .5 + kick * .5; core.intensity = 1.5 + cm * 2 + kick * 4;
    L1.position.set(Math.cos(t * .7) * 4, 2.5, Math.sin(t * .7) * 4); L2.position.set(Math.cos(t * .5 + 3) * 4, 1, Math.sin(t * .5 + 3) * 4);
    og.forEach((o, i) => {
      if (cnt[i] !== S.owned[i]) build(i);
      o.rotation.y += dt * (i % 2 ? -1 : 1) * (.45 - i * .03);
      o.children.forEach((w, k) => { w.position.y = -1.35 + Math.sin(t * 2.2 + k) * .06; if (SPIN.includes(i)) w.rotation.y += dt * 3; });
    });
    const p = pg.attributes.position;
    for (let i = 1; i < p.array.length; i += 3) { p.array[i] += dt * .35; if (p.array[i] > 5) p.array[i] = -2; }
    p.needsUpdate = true; pivot.rotation.y += dt * .04;
    R.render(sc, cam);
  })();
})();
