'use strict';
const $ = s => document.querySelector(s);
const SAVE_KEY = 'minaDeCristais_v1';

/* ---------- Dados ---------- */
const GENS = [
  ['Minerador', '⛏️', 15, 0.1],
  ['Carrinho de Mina', '🛒', 100, 1],
  ['Perfuratriz', '🔩', 1100, 8],
  ['Golem de Pedra', '🗿', 12000, 47],
  ['Portal Cristalino', '🌀', 130000, 260],
  ['Dragão Geodo', '🐉', 1.4e6, 1400],
  ['Forja Estelar', '⭐', 2e7, 7800],
  ['Coração da Montanha', '💎', 3.3e8, 44000]
];
const TIERS = ['Reforçado', 'de Elite', 'Mestre'], TREQ = [1, 10, 25], TMULT = [10, 100, 1000];

const UPS = [];
[['Picareta de Ferro', 100, 2], ['Picareta de Aço', 1e3, 2], ['Picareta de Diamante', 2e4, 2],
 ['Picareta Rúnica', 5e5, 2], ['Picareta Cósmica', 2e7, 3]].forEach(([n, c, m], i) =>
  UPS.push({ id: 'c' + i, n, d: `Cliques valem ${m}x`, cost: c, ok: s => s.total >= c / 2, click: m, icon: '⛏️' }));
UPS.push({ id: 't0', n: 'Toque Ressonante', d: 'Cada clique rende +3% da produção por segundo', cost: 5e4, ok: s => s.total >= 2.5e4, touch: .03, icon: '👆' });
[['Lanterna Mágica', 25000, 1.25], ['Veio Dourado', 5e6, 1.5], ['Sintonia Cósmica', 1e9, 2]].forEach(([n, c, m], i) =>
  UPS.push({ id: 'g' + i, n, d: `Toda a produção x${m}`, cost: c, ok: s => s.total >= c / 2, glob: m, icon: '✨' }));
GENS.forEach((g, gi) => TIERS.forEach((t, ti) =>
  UPS.push({ id: `b${gi}_${ti}`, n: `${g[0]} ${t}`, d: `${g[0]} produz o dobro`, cost: g[2] * TMULT[ti], ok: s => s.owned[gi] >= TREQ[ti], gen: gi, icon: g[1] })));

const ACH = [
  ['Primeira batida', 'Dê o primeiro clique', s => s.clicks >= 1],
  ['Mão calejada', '100 cliques', s => s.clicks >= 100],
  ['Braço de ferro', '1.000 cliques', s => s.clicks >= 1e3],
  ['Lenda da picareta', '10.000 cliques', s => s.clicks >= 1e4],
  ['Primeiro tesouro', 'Minere 1.000 cristais', s => s.total >= 1e3],
  ['Milionário', 'Minere 1 milhão de cristais', s => s.total >= 1e6],
  ['Bilionário', 'Minere 1 bilhão de cristais', s => s.total >= 1e9],
  ['Trilionário', 'Minere 1 trilhão de cristais', s => s.total >= 1e12],
  ['Linha de produção', 'Produza 10 por segundo', s => s.best >= 10],
  ['Industrial', 'Produza 1.000 por segundo', s => s.best >= 1e3],
  ['Império', 'Produza 100 mil por segundo', s => s.best >= 1e5],
  ['Colecionador', 'Tenha todos os tipos de construção', s => s.owned.every(n => n > 0)],
  ['Exército', 'Tenha 100 construções', s => s.owned.reduce((a, b) => a + b, 0) >= 100],
  ['Olho de águia', 'Pegue um cristal raro', s => s.golden >= 1],
  ['Caçador de raros', 'Pegue 10 cristais raros', s => s.golden >= 10],
  ['Ferreiro', 'Compre 20 melhorias', s => s.ups.length >= 20],
  ['Renascido', 'Renasça pela primeira vez', s => s.rebirths >= 1]
];

/* ---------- Estado ---------- */
const fresh = () => ({ c: 0, run: 0, total: 0, clicks: 0, owned: GENS.map(() => 0), ups: [], ach: [],
  ess: 0, rebirths: 0, golden: 0, best: 0, t0: Date.now(), last: Date.now() });
let S = fresh(), buffs = [], buyAmt = 1, upKey = '';

function load(raw) {
  const d = JSON.parse(raw);
  S = Object.assign(fresh(), d);
  while (S.owned.length < GENS.length) S.owned.push(0);
}
function save(silent) {
  S.last = Date.now();
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); if (!silent) toast('Jogo salvo.'); }
  catch (e) { toast('Não foi possível salvar neste navegador.'); }
}

/* ---------- Cálculos ---------- */
const has = id => S.ups.includes(id);
const buffMult = type => buffs.reduce((m, b) => b.type === type ? m * b.m : m, 1);
const genMult = i => UPS.reduce((m, u) => u.gen === i && has(u.id) ? m * 2 : m, 1);
const metaMult = () => (1 + S.ess * .05) * (1 + S.ach.length * .02);
function cps() {
  let g = metaMult() * buffMult('prod');
  UPS.forEach(u => { if (u.glob && has(u.id)) g *= u.glob; });
  return GENS.reduce((s, x, i) => s + S.owned[i] * x[3] * genMult(i), 0) * g;
}
function clickPow() {
  let m = 1, t = 0;
  UPS.forEach(u => { if (has(u.id)) { if (u.click) m *= u.click; if (u.touch) t += u.touch; } });
  return (m * metaMult() + t * cps()) * buffMult('click');
}
const costN = (i, n) => GENS[i][2] * 1.15 ** S.owned[i] * ((1.15 ** n - 1) / .15);
function maxN(i) { let n = 0; while (n < 500 && costN(i, n + 1) <= S.c) n++; return n; }
const gain = x => { S.c += x; S.run += x; S.total += x; };
const pending = () => Math.floor(Math.sqrt(S.run / 1e6));

/* ---------- Formatação ---------- */
const UNITS = ['mil', 'mi', 'bi', 'tri', 'quad', 'quin', 'sex', 'sep', 'oct'];
function fmt(n) {
  if (n < 1000) return n < 10 && n % 1 ? n.toFixed(1) : Math.floor(n).toLocaleString('pt-BR');
  let i = -1; while (n >= 1000 && i < UNITS.length - 1) { n /= 1000; i++; }
  return n.toFixed(2).replace('.', ',') + ' ' + UNITS[i];
}
function fmtTime(s) {
  s = Math.floor(s); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60);
  return h ? `${h}h ${m}min` : m ? `${m}min ${s % 60}s` : `${s}s`;
}
function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  $('#toasts').append(t); setTimeout(() => t.remove(), 4000);
}

/* ---------- Ações ---------- */
function floatText(txt, x, y) {
  const f = document.createElement('div'); f.className = 'float'; f.textContent = txt;
  f.style.left = x + 'px'; f.style.top = y + 'px'; document.body.append(f); setTimeout(() => f.remove(), 900);
}
$('#crystal').addEventListener('click', e => {
  const p = clickPow(), r = e.currentTarget.getBoundingClientRect();
  const x = e.detail ? e.clientX : r.left + r.width / 2, y = e.detail ? e.clientY : r.top + r.height / 3;
  gain(p); S.clicks++; floatText('+' + fmt(p), x + (Math.random() * 40 - 20), y);
  render();
});
function buyGen(i) {
  const n = buyAmt === 'max' ? maxN(i) : buyAmt;
  if (n < 1) return;
  const c = costN(i, n); if (c > S.c) return;
  S.c -= c; S.owned[i] += n; render();
}
function buyUp(id) {
  const u = UPS.find(x => x.id === id);
  if (!u || has(id) || S.c < u.cost) return;
  S.c -= u.cost; S.ups.push(id); upKey = ''; render();
}
function checkAch() {
  ACH.forEach((a, i) => {
    if (!S.ach.includes(i) && a[2](S)) { S.ach.push(i); toast(`🏆 ${a[0]} (+2% de produção)`); }
  });
}
function rebirth() {
  const p = pending();
  if (p < 1) return;
  if (!confirm(`Renascer vai reiniciar cristais, construções e melhorias. Você ganha ${p} essências. Continuar?`)) return;
  S.ess += p; S.rebirths++; S.c = 0; S.run = 0; S.owned = GENS.map(() => 0); S.ups = []; upKey = '';
  toast(`Você renasceu! +${p} essências.`); save(true); render();
}

/* ---------- Cristal raro ---------- */
let gTimer;
const scheduleGolden = () => { clearTimeout(gTimer); gTimer = setTimeout(spawnGolden, (60 + Math.random() * 90) * 1000); };
function spawnGolden() {
  const el = document.createElement('button'); el.className = 'golden'; el.textContent = '💠'; el.title = 'Cristal raro!';
  el.style.left = 8 + Math.random() * 80 + '%'; el.style.top = 15 + Math.random() * 65 + '%';
  const gone = setTimeout(() => { el.remove(); scheduleGolden(); }, 13000);
  el.onclick = () => {
    clearTimeout(gone); el.remove(); S.golden++;
    const r = Math.random(), now = Date.now();
    if (r < .45) { buffs.push({ n: 'Frenesi: produção x7', type: 'prod', m: 7, end: now + 30000 }); toast('Frenesi! Produção x7 por 30s.'); }
    else if (r < .75) { buffs.push({ n: 'Cliques x777', type: 'click', m: 777, end: now + 10000 }); toast('Chuva de cliques! x777 por 10s.'); }
    else { const b = Math.min(cps() * 900, S.c * .15) + 13; gain(b); toast(`Sorte! +${fmt(b)} cristais.`); }
    scheduleGolden(); render();
  };
  document.body.append(el);
}

/* ---------- Interface ---------- */
const genEls = GENS.map((g, i) => {
  const b = document.createElement('button'); b.className = 'gen';
  b.innerHTML = `<span class="ic">${g[1]}</span><span class="nm"></span><span class="n">0</span><span class="cost"></span>`;
  b.onclick = () => buyGen(i); $('#gens').append(b); return b;
});
const achEls = ACH.map(a => {
  const d = document.createElement('div'); d.className = 'ach'; d.textContent = '🏆';
  d.title = `${a[0]}: ${a[1]}`; $('#achs').append(d); return d;
});
$('#amt').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  buyAmt = b.dataset.n === 'max' ? 'max' : +b.dataset.n;
  [...$('#amt').children].forEach(x => x.classList.toggle('on', x === b)); render();
});
$('#ups').addEventListener('click', e => { const b = e.target.closest('.up'); if (b) buyUp(b.dataset.id); });

function render() {
  const c = cps();
  $('#bank').textContent = fmt(S.c); $('#cps').textContent = fmt(c); $('#clickPow').textContent = fmt(clickPow());
  document.title = fmt(S.c) + ' cristais · Mina';

  GENS.forEach((g, i) => {
    const el = genEls[i], n = buyAmt === 'max' ? Math.max(1, maxN(i)) : buyAmt, cost = costN(i, n);
    const locked = S.total < g[2] * .6 && S.owned[i] === 0;
    el.classList.toggle('locked', locked); el.classList.toggle('can', S.c >= cost);
    el.querySelector('.nm').textContent = locked ? '???' : g[0];
    el.querySelector('.n').textContent = S.owned[i];
    el.querySelector('.cost').textContent = locked ? 'Continue minerando' : `${fmt(cost)} · +${fmt(g[3] * genMult(i) * metaMult())}/s cada (x${n})`;
  });

  const vis = UPS.filter(u => !has(u.id) && u.ok(S)).sort((a, b) => a.cost - b.cost).slice(0, 12);
  const key = vis.map(u => u.id).join();
  if (key !== upKey) {
    upKey = key;
    $('#ups').innerHTML = vis.length ? vis.map(u =>
      `<button class="up" data-id="${u.id}"><span class="ic">${u.icon}</span><div><b>${u.n}</b><span>${u.d}</span><em>${fmt(u.cost)} cristais</em></div></button>`).join('')
      : '<p class="muted empty">Nenhuma melhoria disponível agora. Compre mais construções!</p>';
  }
  document.querySelectorAll('.up').forEach(b => b.classList.toggle('can', S.c >= UPS.find(u => u.id === b.dataset.id).cost));

  achEls.forEach((el, i) => el.classList.toggle('got', S.ach.includes(i)));
  $('#achCount').textContent = `${S.ach.length}/${ACH.length}`;

  $('#ess').textContent = S.ess; $('#essPending').textContent = pending(); $('#rebirth').disabled = pending() < 1;

  const now = Date.now();
  $('#buffs').innerHTML = buffs.map(b => `<span class="buff">${b.n} · ${Math.ceil((b.end - now) / 1000)}s</span>`).join('');

  const rows = [['Cliques', fmt(S.clicks)], ['Total minerado', fmt(S.total)], ['Minerado nesta run', fmt(S.run)],
    ['Melhor produção/s', fmt(S.best)], ['Construções', S.owned.reduce((a, b) => a + b, 0)],
    ['Cristais raros', S.golden], ['Renascimentos', S.rebirths], ['Bônus total', '+' + Math.round((metaMult() - 1) * 100) + '%'],
    ['Tempo de jogo', fmtTime((now - S.t0) / 1000)]];
  $('#stats').innerHTML = rows.map(r => `<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('');
}

/* ---------- Loop ---------- */
function tick() {
  const now = Date.now(), dt = Math.min((now - S.last) / 1000, 5);
  S.last = now; buffs = buffs.filter(b => b.end > now);
  gain(cps() * dt); S.best = Math.max(S.best, cps());
  checkAch(); render();
}

/* ---------- Opções ---------- */
$('#save').onclick = () => save();
$('#rebirth').onclick = rebirth;
$('#export').onclick = () => { save(true); prompt('Copie seu save:', btoa(unescape(encodeURIComponent(JSON.stringify(S))))); };
$('#import').onclick = () => {
  const t = prompt('Cole seu save:'); if (!t) return;
  try { load(decodeURIComponent(escape(atob(t.trim())))); upKey = ''; save(true); render(); toast('Save importado!'); }
  catch (e) { toast('Save inválido. Confira se copiou o texto inteiro.'); }
};
$('#reset').onclick = () => {
  if (!confirm('Apagar TODO o progresso, inclusive conquistas e essências?')) return;
  S = fresh(); buffs = []; upKey = ''; save(true); render(); toast('Progresso apagado.');
};

/* ---------- Início ---------- */
try { const raw = localStorage.getItem(SAVE_KEY); if (raw) load(raw); } catch (e) {}
const away = Math.min((Date.now() - S.last) / 1000, 8 * 3600);
if (away > 60 && cps() > 0) {
  const g = cps() * away * .5; gain(g);
  toast(`Bem-vindo de volta! Seus mineradores trabalharam ${fmtTime(away)} e geraram ${fmt(g)} cristais.`);
}
S.last = Date.now();
setInterval(tick, 100);
setInterval(() => save(true), 15000);
window.addEventListener('beforeunload', () => save(true));
scheduleGolden(); render();
