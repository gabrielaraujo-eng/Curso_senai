'use strict';
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const el = (t, c) => { const e = document.createElement(t); e.className = c || ''; return e; };
const mon = n => '$' + Math.round(n).toLocaleString('pt-BR');
const KEY = 'cassinoPixel_v1';

/* ---------- Estado e save ---------- */
let S = { money: 1000, played: 0, wins: 0, best: 0, sound: true, pkStack: 0 };
try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
function toast(t) { const d = el('div', 'toast'); d.textContent = t; $('#toasts').append(d); setTimeout(() => d.remove(), 4500); }
function say(id, t, c) { const e = $('#' + id); e.textContent = t; e.className = 'msg ' + (c || ''); }
function settle(net) {
  S.played++;
  if (net > 0) { S.wins++; S.best = Math.max(S.best, net); sfx.win(); } else if (net < 0) sfx.lose();
}

/* ---------- Som chiptune ---------- */
let AC;
function beep(f, d = .08, t = 'square', v = .04, delay = 0) {
  if (!S.sound) return;
  try {
    AC = AC || new AudioContext(); const o = AC.createOscillator(), g = AC.createGain(), n = AC.currentTime + delay;
    o.type = t; o.frequency.value = f; g.gain.setValueAtTime(v, n); g.gain.exponentialRampToValueAtTime(.001, n + d);
    o.connect(g).connect(AC.destination); o.start(n); o.stop(n + d);
  } catch (e) {}
}
const sfx = {
  deal: () => beep(220, .05), chip: () => beep(880, .04), tick: () => beep(440, .03, 'square', .03),
  win: () => [523, 659, 784, 1047].forEach((f, i) => beep(f, .12, 'square', .05, i * .1)),
  lose: () => [330, 262, 196].forEach((f, i) => beep(f, .15, 'sawtooth', .04, i * .12))
};

/* ---------- Sprites pixel (7x7) ---------- */
const PAT = {
  spade: ['...#...', '..###..', '.#####.', '#######', '#######', '...#...', '..###..'],
  heart: ['.##.##.', '#######', '#######', '#######', '.#####.', '..###..', '...#...'],
  diamond: ['...#...', '..###..', '.#####.', '#######', '.#####.', '..###..', '...#...'],
  club: ['...#...', '..###..', '...#...', '##.#.##', '#######', '##.#.##', '..###..'],
  star: ['...#...', '...#...', '#######', '.#####.', '..###..', '.##.##.', '.#...#.'],
  seven: ['#######', '#######', '.....##', '....##.', '...##..', '..##...', '..##...']
};
const spC = {};
function sprite(name, color) {
  const k = name + color; if (spC[k]) return spC[k];
  const c = document.createElement('canvas'); c.width = c.height = 7; const x = c.getContext('2d'); x.fillStyle = color;
  PAT[name].forEach((row, y) => [...row].forEach((ch, i) => { if (ch === '#') x.fillRect(i, y, 1, 1); }));
  return spC[k] = c.toDataURL();
}
const SUITS = ['spade', 'heart', 'diamond', 'club'], SCOL = ['#1a1a1a', '#e0344a', '#e0344a', '#1a1a1a'];
const SYM = [['seven', '#e0344a'], ['star', '#ffd34d'], ['diamond', '#4fc3f7'], ['heart', '#ff6bd6'], ['club', '#35c47a'], ['spade', '#2a2a3a']];
const symSrc = i => sprite(SYM[i][0], SYM[i][1]);

/* ---------- Baralho ---------- */
const RK = ['', '', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
function newDeck(n = 1) {
  const d = [];
  for (let k = 0; k < n; k++) for (let s = 0; s < 4; s++) for (let r = 2; r <= 14; r++) d.push({ r, s });
  for (let i = d.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [d[i], d[j]] = [d[j], d[i]]; }
  return d;
}
function cardEl(c, down, anim) {
  const d = el('div', 'card');
  if (down || !c) d.classList.add('down');
  else {
    if (c.s === 1 || c.s === 2) d.classList.add('red');
    const u = `url(${sprite(SUITS[c.s], SCOL[c.s])})`;
    d.innerHTML = `<b class="r">${RK[c.r]}</b><i class="s" style="background-image:${u}"></i><i class="big" style="background-image:${u}"></i>`;
  }
  if (anim) d.classList.add('pop');
  return d;
}

/* ---------- Fichas e botões ---------- */
const CHIPS = [[5, '#e8e8e8'], [25, '#e0344a'], [100, '#2f6be0'], [500, '#a56bff'], [1000, '#ffd34d']];
function chipRow(id, fn) {
  const box = $('#' + id); box.innerHTML = '';
  CHIPS.forEach(([v, c]) => { const b = el('button', 'chip'); b.style.setProperty('--c', c); b.textContent = v; b.onclick = () => fn(v); box.append(b); });
}
function setBtns(id, list) {
  $('#' + id + 'Btns').replaceChildren(...list.map(([t, f, dis, cls]) => {
    const x = el('button', 'px ' + (cls || '')); x.textContent = t; x.disabled = !!dis; x.onclick = f; return x;
  }));
}

/* ---------- Navegação e HUD ---------- */
function go(id) {
  ['lobby', 'bj', 'pk', 'sl'].forEach(s => $('#' + s).hidden = s !== id);
  $('#home').hidden = id === 'lobby';
  if (id === 'pk') { $('#pkSitBox').hidden = PK.seat; $('#pkTable').hidden = !PK.seat; if (PK.seat) pkUI(); }
  if (id === 'bj' && !BJ.on) bjBet();
  draw();
}
function draw() {
  $('#money').textContent = mon(S.money);
  $('#mute').textContent = 'SOM: ' + (S.sound ? 'ON' : 'OFF');
  $('#stats').innerHTML = `<div>RODADAS<b>${S.played}</b></div><div>VITÓRIAS<b>${S.wins}</b></div><div>MAIOR GANHO<b>${mon(S.best)}</b></div>`;
  $('#bonus').hidden = !(S.money < 25 && !PK.seat && !BJ.bet && !BJ.on);
  $('#bjBet').textContent = mon(BJ.bet);
  $('#slBet').textContent = mon(SL_BETS[SL.i]);
  save();
}
$$('.tile').forEach(t => t.onclick = () => go(t.dataset.go));
$('#home').onclick = () => go('lobby');
$('#mute').onclick = () => { S.sound = !S.sound; draw(); };
$('#bonus').onclick = () => { S.money += 500; toast('A casa te emprestou $500. Jogue com juízo!'); sfx.chip(); draw(); };
[['icoBj', 'spade', '#f4ecd8'], ['icoPk', 'heart', '#e0344a'], ['icoSl', 'seven', '#ffd34d']].forEach(([id, n, c]) => $('#' + id).style.backgroundImage = `url(${sprite(n, c)})`);

/* =====================================================
   BLACKJACK
   ===================================================== */
const BJ = { shoe: [], bet: 0, base: 0, pl: [], de: [], on: false };
function draw1() { if (BJ.shoe.length < 20) BJ.shoe = newDeck(6); const c = BJ.shoe.pop(); c.n = 1; return c; }
function total(h) {
  let t = 0, a = 0;
  h.forEach(c => { if (c.r === 14) { a++; t += 11; } else t += Math.min(c.r, 10); });
  while (t > 21 && a) { t -= 10; a--; }
  return t;
}
function bjUI(hide) {
  $('#bjDealer').replaceChildren(...BJ.de.map((c, i) => cardEl(c, hide && i === 1, c.n)));
  $('#bjPlayer').replaceChildren(...BJ.pl.map(c => cardEl(c, 0, c.n)));
  $('#bjDT').textContent = BJ.de.length ? (hide ? total([BJ.de[0]]) : total(BJ.de)) : '';
  $('#bjPT').textContent = BJ.pl.length ? total(BJ.pl) : '';
  [...BJ.pl, ...BJ.de].forEach(c => c.n = 0); draw();
}
function bjBet() {
  BJ.on = false; BJ.pl = []; BJ.de = []; bjUI(false);
  chipRow('bjChips', v => { if (BJ.on || S.money < v) return; S.money -= v; BJ.bet += v; sfx.chip(); bjBet2(); });
  bjBet2();
  say('bjMsg', S.money <= 0 && !BJ.bet ? 'SEM FICHAS! VOLTE AO LOBBY.' : 'FAÇA SUA APOSTA');
}
function bjBet2() {
  draw();
  setBtns('bj', [['DISTRIBUIR', bjStart, BJ.bet <= 0, 'green'], ['LIMPAR', () => { S.money += BJ.bet; BJ.bet = 0; bjBet2(); }, BJ.bet <= 0]]);
}
async function bjStart() {
  if (BJ.bet <= 0 || BJ.on) return;
  BJ.on = true; BJ.base = BJ.bet; BJ.pl = []; BJ.de = []; setBtns('bj', []); say('bjMsg', '');
  for (const who of ['p', 'd', 'p', 'd']) { (who === 'p' ? BJ.pl : BJ.de).push(draw1()); sfx.deal(); bjUI(true); await sleep(300); }
  if (total(BJ.pl) === 21 || total(BJ.de) === 21) return bjFinish();
  bjTurn();
}
function bjTurn() {
  const can2 = BJ.pl.length === 2 && S.money >= BJ.bet;
  setBtns('bj', [['PEDIR', bjHit], ['PARAR', bjStand, 0, 'red'], ['DOBRAR', bjDouble, !can2, 'gold']]);
}
async function bjHit() {
  setBtns('bj', []); BJ.pl.push(draw1()); sfx.deal(); bjUI(true); await sleep(300);
  total(BJ.pl) >= 21 ? bjStand() : bjTurn();
}
async function bjDouble() {
  setBtns('bj', []); S.money -= BJ.bet; BJ.bet *= 2; BJ.pl.push(draw1()); sfx.deal(); bjUI(true); await sleep(400); bjStand();
}
async function bjStand() {
  setBtns('bj', []); bjUI(false); await sleep(500);
  const p = total(BJ.pl);
  if (p <= 21 && !(BJ.pl.length === 2 && p === 21)) {
    while (total(BJ.de) < 17) { BJ.de.push(draw1()); sfx.deal(); bjUI(false); await sleep(550); }
  }
  bjFinish();
}
function bjFinish() {
  bjUI(false);
  const p = total(BJ.pl), d = total(BJ.de), pbj = p === 21 && BJ.pl.length === 2, dbj = d === 21 && BJ.de.length === 2;
  let pay = 0, msg;
  if (p > 21) msg = 'VOCÊ ESTOUROU!';
  else if (pbj && !dbj) { pay = BJ.bet * 2.5; msg = 'BLACKJACK! PAGA 3:2'; }
  else if (dbj && !pbj) msg = 'DEALER TEM BLACKJACK';
  else if (d > 21) { pay = BJ.bet * 2; msg = 'DEALER ESTOUROU! VOCÊ GANHOU'; }
  else if (p > d) { pay = BJ.bet * 2; msg = 'VOCÊ GANHOU!'; }
  else if (p === d) { pay = BJ.bet; msg = 'EMPATE'; }
  else msg = 'A CASA GANHOU';
  const net = pay - BJ.bet; settle(net); S.money += pay; BJ.bet = 0;
  say('bjMsg', `${msg} ${net > 0 ? '+' + mon(net) : net < 0 ? '−' + mon(-net) : ''}`, net > 0 ? 'win' : net < 0 ? 'lose' : '');
  BJ.on = false; draw();
  setBtns('bj', [['MESMA APOSTA', () => { if (S.money >= BJ.base) { S.money -= BJ.base; BJ.bet = BJ.base; bjStart(); } }, S.money < BJ.base, 'green'], ['NOVA APOSTA', bjBet]]);
}

/* =====================================================
   POKER (Texas Hold'em, você + 2 rivais)
   ===================================================== */
const SB = 10, BB = 20, BUYIN = 500;
const PK = { seat: false, P: [], board: [], btn: 0, cur: 0, minR: BB, over: true, log: [] };
const HANDN = ['CARTA ALTA', 'PAR', 'DOIS PARES', 'TRINCA', 'SEQUÊNCIA', 'FLUSH', 'FULL HOUSE', 'QUADRA', 'STRAIGHT FLUSH'];
const potSum = () => PK.P.reduce((a, p) => a + p.tin, 0);

function ev5(c) {
  const r = c.map(x => x.r).sort((a, b) => b - a), fl = c.every(x => x.s === c[0].s), cnt = {};
  r.forEach(x => cnt[x] = (cnt[x] || 0) + 1);
  const g = Object.entries(cnt).map(([k, v]) => [v, +k]).sort((a, b) => b[0] - a[0] || b[1] - a[1]);
  let st = 0; const u = new Set(r);
  if (u.size === 5) { if (r[0] - r[4] === 4) st = r[0]; else if (r[0] === 14 && r[1] === 5) st = 5; }
  let cat, tb;
  if (st && fl) { cat = 8; tb = [st]; } else if (g[0][0] === 4) { cat = 7; tb = [g[0][1], g[1][1]]; }
  else if (g[0][0] === 3 && g[1][0] === 2) { cat = 6; tb = [g[0][1], g[1][1]]; } else if (fl) { cat = 5; tb = r; }
  else if (st) { cat = 4; tb = [st]; } else if (g[0][0] === 3) { cat = 3; tb = g.map(x => x[1]); }
  else if (g[0][0] === 2 && g[1][0] === 2) { cat = 2; tb = g.map(x => x[1]); } else if (g[0][0] === 2) { cat = 1; tb = g.map(x => x[1]); }
  else { cat = 0; tb = r; }
  return tb.concat([0, 0, 0, 0, 0]).slice(0, 5).reduce((a, x) => a * 15 + x, cat);
}
function best(c) {
  if (c.length === 5) return ev5(c);
  let b = -1;
  if (c.length === 6) c.forEach((_, i) => b = Math.max(b, ev5(c.filter((_, j) => j !== i))));
  else for (let i = 0; i < c.length; i++) for (let j = i + 1; j < c.length; j++) b = Math.max(b, ev5(c.filter((_, k) => k !== i && k !== j)));
  return b;
}
const catOf = sc => Math.floor(sc / 15 ** 5);

function strength(p) {
  const [a, b] = p.cards, hi = Math.max(a.r, b.r), lo = Math.min(a.r, b.r);
  if (!PK.board.length) {
    let s = hi / 14 * .42 + lo / 14 * .18;
    if (a.r === b.r) s += .3 + hi / 50; if (a.s === b.s) s += .05; if (hi - lo <= 2) s += .04;
    return Math.min(s, 1);
  }
  const all = [...p.cards, ...PK.board], cat = catOf(best(all));
  let s = [.2, .5, .66, .78, .84, .88, .94, .98, 1][cat];
  if (cat === 0) s += hi / 14 * .15;
  const sc = {}; all.forEach(c => sc[c.s] = (sc[c.s] || 0) + 1);
  if (PK.board.length < 5 && Math.max(...Object.values(sc)) === 4) s += .12;
  return Math.min(s, 1);
}
async function botAct(p) {
  await sleep(700 + Math.random() * 500);
  const call = Math.min(PK.cur - p.bet, p.stack), pot = potSum(), s = strength(p) + (Math.random() - .5) * .14, odds = call / (pot + call), maxTo = p.bet + p.stack;
  const rz = () => Math.min(maxTo, Math.max(PK.cur + PK.minR, PK.cur + Math.round(pot * (.4 + s * .6) / 10) * 10));
  if (call === 0) {
    if ((s > .62 && Math.random() < .4 + p.a * .5) || Math.random() < .06 * p.a) return { t: 'raise', to: rz() };
    return { t: 'call' };
  }
  if (s > .85 && Math.random() < .5 + p.a * .4 && p.stack > call) return { t: 'raise', to: rz() };
  if (s > odds + .08 - p.a * .05 || (call <= BB && s > .3)) return { t: 'call' };
  return { t: 'fold' };
}
function humanAct(p) {
  return new Promise(res => {
    const call = Math.min(PK.cur - p.bet, p.stack), maxTo = p.bet + p.stack, minTo = Math.min(PK.cur + PK.minR, maxTo), box = $('#pkBtns');
    box.innerHTML = '';
    const add = (t, f, cls) => { const b = el('button', 'px ' + (cls || '')); b.textContent = t; b.onclick = () => { box.innerHTML = ''; f(); }; box.append(b); return b; };
    if (call > 0) add('DESISTIR', () => res({ t: 'fold' }), 'red');
    add(call === 0 ? 'PASSAR' : `PAGAR ${mon(call)}${call >= p.stack ? ' (ALL-IN)' : ''}`, () => res({ t: 'call' }), 'green');
    if (p.stack > call) {
      const r = el('div', 'raise'), sl = el('input'), lbl = add('', () => res({ t: 'raise', to: +sl.value }), 'gold');
      sl.type = 'range'; sl.min = minTo; sl.max = maxTo; sl.step = 10; sl.value = minTo;
      const upd = () => lbl.textContent = (+sl.value >= maxTo ? 'ALL-IN ' : (PK.cur ? 'AUMENTAR P/ ' : 'APOSTAR ')) + mon(+sl.value);
      sl.oninput = upd; upd();
      const q = (t, k) => { const b = el('button', 'px sm'); b.textContent = t; b.onclick = () => { sl.value = Math.min(maxTo, Math.max(minTo, PK.cur + Math.round(potSum() * k / 10) * 10)); upd(); }; return b; };
      r.append(q('½ POTE', .5), q('POTE', 1), sl); box.append(r);
    }
  });
}
function plog(m) { PK.log.push(m); PK.log = PK.log.slice(-5); $('#pkLog').innerHTML = PK.log.map(x => `<div>${x}</div>`).join(''); }
function apply(p, a) {
  const cur = PK.cur; p.acted = true;
  if (a.t === 'fold') { p.fold = true; p.act = 'DESISTE'; sfx.lose(); }
  else {
    const to = a.t === 'raise' ? Math.min(a.to, p.bet + p.stack) : Math.min(cur, p.bet + p.stack), x = to - p.bet;
    p.stack -= x; p.bet = to; p.tin += x; sfx.chip();
    if (to > cur) {
      PK.minR = Math.max(PK.minR, to - cur); PK.cur = to;
      PK.P.forEach(o => { if (o !== p && !o.fold && !o.allin) o.acted = false; });
      p.act = (cur === 0 ? 'APOSTA ' : 'AUMENTA P/ ') + mon(to);
    } else p.act = x ? 'PAGA ' + mon(x) : 'PASSA';
    if (!p.stack) { p.allin = true; p.act = 'ALL-IN ' + mon(p.bet); }
  }
  plog(`${p.n}: ${p.act}`); pkUI();
}
async function pkBet(first) {
  const P = PK.P, n = P.length; let i = first;
  for (let g = 0; g < 300; g++) {
    const live = P.filter(p => !p.fold), can = live.filter(p => !p.allin);
    if (live.length < 2 || !can.length) return;
    if (can.length === 1 && can[0].bet >= PK.cur) return;
    if (can.every(p => p.acted && p.bet === PK.cur)) return;
    const p = P[i]; i = (i + 1) % n;
    if (p.fold || p.allin || (p.acted && p.bet === PK.cur)) continue;
    pkUI(p);
    apply(p, p.h ? await humanAct(p) : await botAct(p));
    await sleep(250);
  }
}
function post(p, x) { const a = Math.min(x, p.stack); p.stack -= a; p.bet = a; p.tin = a; if (!p.stack) p.allin = true; }

async function pkHand() {
  const P = PK.P; setBtns('pk', []);
  P.forEach(p => { if (!p.h && p.stack <= 0) p.stack = 500; p.bet = 0; p.tin = 0; p.fold = false; p.allin = false; p.acted = false; p.cards = []; p.act = ''; p.show = !!p.h; p.start = p.stack; });
  if (P[0].stack <= 0) return pkLeave(true);
  S.pkStack = P[0].stack; save();
  PK.board = []; PK.log = []; PK.over = false; PK.btn = (PK.btn + 1) % 3; $('#pkLog').innerHTML = '';
  const deck = newDeck(), sb = (PK.btn + 1) % 3, bb = (PK.btn + 2) % 3;
  post(P[sb], SB); post(P[bb], BB); PK.cur = BB; PK.minR = BB;
  for (let r = 0; r < 2; r++) P.forEach(p => { const c = deck.pop(); c.n = 1; p.cards.push(c); });
  plog(`Blinds: ${P[sb].n} ${mon(SB)} · ${P[bb].n} ${mon(BB)}`); sfx.deal(); pkUI(); await sleep(700);
  for (let st = 0; st < 4; st++) {
    if (st > 0) {
      P.forEach(p => { p.bet = 0; p.acted = false; if (!p.fold && !p.allin) p.act = ''; }); PK.cur = 0; PK.minR = BB;
      for (let k = 0; k < (st === 1 ? 3 : 1); k++) { const c = deck.pop(); c.n = 1; PK.board.push(c); }
      sfx.deal(); pkUI(); await sleep(600);
    }
    let first = (PK.btn + 1) % 3; if (st === 0) first = (bb + 1) % 3;
    await pkBet(first);
    if (P.filter(p => !p.fold).length < 2) break;
  }
  pkShow();
}
function pkShow() {
  const P = PK.P, live = P.filter(p => !p.fold), won = {}; PK.over = true;
  const potTotal = potSum();
  if (live.length === 1) { live[0].stack += potTotal; won[live[0].n] = potTotal; }
  else {
    live.forEach(p => p.show = true); P.forEach(p => p.sc = p.fold ? -1 : best([...p.cards, ...PK.board]));
    const lv = [...new Set(P.filter(p => p.tin > 0).map(p => p.tin))].sort((a, b) => a - b); let prev = 0;
    lv.forEach(L => {
      let amt = 0; P.forEach(p => amt += Math.max(0, Math.min(p.tin, L) - Math.min(p.tin, prev)));
      let el2 = P.filter(p => !p.fold && p.tin >= L); if (!el2.length) el2 = live;
      const top = Math.max(...el2.map(p => p.sc)), w = el2.filter(p => p.sc === top), share = Math.floor(amt / w.length);
      w.forEach(x => { x.stack += share; won[x.n] = (won[x.n] || 0) + share; }); w[0].stack += amt - share * w.length; won[w[0].n] += amt - share * w.length; prev = L;
    });
  }
  const names = Object.keys(won), me = P[0], net = me.stack - me.start;
  const txt = names.map(n => { const p = P.find(x => x.n === n); return `${n} LEVA ${mon(won[n])}${live.length > 1 ? ' (' + HANDN[catOf(p.sc)] + ')' : ''}`; }).join(' · ');
  plog(txt); settle(net); S.pkStack = me.stack; pkUI();
  const out = me.stack <= 0;
  say0(out ? 'VOCÊ PERDEU TODAS AS FICHAS DA MESA' : txt, net > 0 ? 'win' : net < 0 ? 'lose' : '');
  setBtns('pk', out ? [['SAIR DA MESA', () => pkLeave()]] : [['PRÓXIMA MÃO', pkHand, 0, 'green'], ['SAIR DA MESA', () => pkLeave(), 0, 'red']]);
}
function say0(t, c) { const m = $('#pkPot'); m.dataset.msg = t; m.dataset.cls = c || ''; pkUI(); }
function pkLeave() {
  S.money += PK.P[0] ? PK.P[0].stack : 0; S.pkStack = 0; PK.seat = false; PK.P = []; PK.board = [];
  $('#pkSitBox').hidden = false; $('#pkTable').hidden = true; setBtns('pk', []); draw();
  $('#pkMsg0').textContent = 'Você saiu da mesa e levou suas fichas.';
}
function pkUI(turn) {
  const P = PK.P; if (!P.length) return;
  $('#pkOpp').replaceChildren(...[1, 2].map(i => {
    const p = P[i], d = el('div', 'opp' + (p.fold ? ' fold' : '')), cs = el('div', 'hand');
    p.cards.forEach(c => cs.append(cardEl(c, !p.show, c.n)));
    d.append(cs);
    d.insertAdjacentHTML('beforeend', `<div class="nm">${p.n}${PK.btn === i ? '<span class="dbtn">D</span>' : ''}${turn === p ? ' ◄' : ''}</div><div>${mon(p.stack)}</div><div class="bet">${p.bet ? 'APOSTA ' + mon(p.bet) : ''}</div><div class="act">${p.act || ''}</div>`);
    return d;
  }));
  const bd = $('#pkBoard'); bd.replaceChildren(...[0, 1, 2, 3, 4].map(i => PK.board[i] ? cardEl(PK.board[i], 0, PK.board[i].n) : el('div', 'slot')));
  const pm = $('#pkPot'); pm.textContent = `POTE: ${mon(potSum())}`;
  if (PK.over && pm.dataset.msg) { pm.innerHTML += `<div class="msg ${pm.dataset.cls}">${pm.dataset.msg}</div>`; } else pm.dataset.msg = '';
  const me = P[0], m = $('#pkMe'), hand = el('div', 'hand'); me.cards.forEach(c => hand.append(cardEl(c, 0, c.n)));
  m.replaceChildren(hand);
  m.insertAdjacentHTML('beforeend', `<div>VOCÊ${PK.btn === 0 ? '<span class="dbtn">D</span>' : ''}${turn === me ? ' ◄' : ''} · FICHAS ${mon(me.stack)}</div><div class="bet">${me.bet ? 'APOSTA ' + mon(me.bet) : ''}</div><div class="act">${me.act || ''}</div>`);
  if (!me.fold && me.cards.length && PK.board.length) m.insertAdjacentHTML('beforeend', `<div class="muted">SUA MÃO: ${HANDN[catOf(best([...me.cards, ...PK.board]))]}</div>`);
  P.forEach(p => p.cards.forEach(c => c.n = 0)); PK.board.forEach(c => c.n = 0);
}
$('#pkSit').onclick = () => {
  const b = Math.min(BUYIN, S.money);
  if (b < 100) { $('#pkMsg0').textContent = 'Você precisa de pelo menos $100. Peça fichas no lobby.'; return; }
  S.money -= b; S.pkStack = b;
  PK.P = [{ n: 'VOCÊ', h: 1, stack: b }, { n: 'ZÉ PIXEL', a: .35, stack: 500 }, { n: 'DONA 8BIT', a: .6, stack: 500 }];
  PK.seat = true; PK.btn = 0; PK.over = true; $('#pkSitBox').hidden = true; $('#pkTable').hidden = false; $('#pkPot').dataset.msg = ''; draw(); pkHand();
};

/* =====================================================
   CAÇA-NÍQUEIS
   ===================================================== */
const SL_BETS = [5, 10, 25, 50, 100, 250, 500, 1000], PAY = [100, 40, 20, 12, 8, 6];
const SL = { i: 2, busy: false, w: [0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5] };
const reelImgs = $$('#reels img');
reelImgs.forEach((im, i) => im.src = symSrc([0, 1, 2][i]));
$('#pay').innerHTML = SYM.map((s, i) => `<div><img src="${symSrc(i)}" alt=""> x3 = ${PAY[i]}x</div>`).join('') + '<div>2 iguais seguidos = 1x (7 e ★ = 2x)</div>';
$('#slMinus').onclick = () => { if (!SL.busy) { SL.i = Math.max(0, SL.i - 1); sfx.chip(); draw(); } };
$('#slPlus').onclick = () => { if (!SL.busy) { SL.i = Math.min(SL_BETS.length - 1, SL.i + 1); sfx.chip(); draw(); } };
async function slSpin() {
  const bet = SL_BETS[SL.i];
  if (SL.busy || S.money < bet) { if (S.money < bet) say('slMsg', 'FICHAS INSUFICIENTES', 'lose'); return; }
  SL.busy = true; S.money -= bet; draw(); say('slMsg', 'GIRANDO...'); $('#slBtn').disabled = true; $('#reels').classList.remove('flash');
  const R = [0, 1, 2].map(() => SL.w[Math.random() * 20 | 0]);
  await Promise.all(reelImgs.map(async (im, i) => {
    const end = Date.now() + 800 + i * 500;
    while (Date.now() < end) { im.src = symSrc(Math.random() * 6 | 0); sfx.tick(); await sleep(70); }
    im.src = symSrc(R[i]); beep(300 + i * 120, .1);
  }));
  let pay = 0, msg = 'NÃO FOI DESSA VEZ';
  if (R[0] === R[1] && R[1] === R[2]) { pay = PAY[R[0]] * bet; msg = `TRIO! ${PAY[R[0]]}x`; }
  else if (R[0] === R[1] || R[1] === R[2]) { const k = R[0] === R[1] ? R[0] : R[1]; pay = (k <= 1 ? 2 : 1) * bet; msg = `PAR! ${k <= 1 ? 2 : 1}x`; }
  const net = pay - bet; settle(net); S.money += pay;
  if (pay >= bet * 8) $('#reels').classList.add('flash');
  say('slMsg', `${msg} ${net > 0 ? '+' + mon(net) : net < 0 ? '−' + mon(-net) : '(EMPATE)'}`, net > 0 ? 'win' : net < 0 ? 'lose' : '');
  SL.busy = false; $('#slBtn').disabled = false; draw();
}
$('#slBtn').onclick = slSpin;

/* ---------- Início ---------- */
if (S.pkStack > 0) { S.money += S.pkStack; toast(`Você voltou da mesa de poker com ${mon(S.pkStack)}.`); S.pkStack = 0; }
draw();
