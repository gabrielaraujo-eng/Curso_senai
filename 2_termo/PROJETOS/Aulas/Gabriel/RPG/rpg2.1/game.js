/* =====================================================================
   AETHRA ONLINE 3D — Edição Completa
   Um RPG de ação em 3D feito com three.js (r128).
   Criação: GTz
   ---------------------------------------------------------------------
   Organização do arquivo:
    01 Base ........ utilidades, ruído, configurações
    02 Dados ....... zonas, monstros, chefes, itens, classes, missões
    03 Áudio ....... efeitos sonoros e música procedural (WebAudio)
    04 Render ...... cena, luzes, materiais, partículas, marcações
    05 Modelos ..... personagens, monstros e armas (low-poly procedural)
    06 Mundo ....... terreno, vila, vegetação, marcos, Abismo
    07 Entidades ... monstros, IA, chefes, projéteis, loot, NPCs
    08 Jogador ..... atributos, combate, habilidades, inventário
    09 Sistemas .... missões, diálogos, lojas, ferreiro, conquistas
    10 Interface ... HUD, janelas, mapas, chat, notificações
    11 Controles ... teclado, mouse e toque
    12 Principal ... fluxo do jogo, salvamento, final, loop
   ===================================================================== */
'use strict';

/* ===================== 01 · BASE ===================== */
const T = THREE;
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const R = Math.random;
const rn = (a, b) => a + R() * (b - a);
const ri = n => Math.floor(R() * n);
const pick = a => a[Math.floor(R() * a.length)];
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const TAU = Math.PI * 2;
const dist2d = (ax, az, bx, bz) => Math.hypot(ax - bx, az - bz);
const angTo = (fx, fz, tx, tz) => Math.atan2(tx - fx, tz - fz);
const angDiff = (a, b) => { let d = (b - a) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; return d; };
const fmt = n => { n = Math.floor(n); if (n >= 1e6) return (n / 1e6).toFixed(1).replace('.0', '') + 'M'; if (n >= 1e5) return Math.round(n / 1e3) + 'k'; return n.toLocaleString('pt-BR'); };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const IS_TOUCH = (window.matchMedia && matchMedia('(pointer: coarse)').matches) || (('ontouchstart' in window) && navigator.maxTouchPoints > 0);
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch (e) { } }
};

// Gerador aleatório com semente: o mundo é sempre o mesmo a cada partida
function mulberry(a) {
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const WR = mulberry(20261020);
const wr = (a, b) => a + WR() * (b - a);

// Ruído de valor 2D (relevo, manchas no chão)
function hash2(x, z) { const h = Math.sin(x * 127.1 + z * 311.7) * 43758.5453123; return h - Math.floor(h); }
function vnoise(x, z) {
  const xi = Math.floor(x), zi = Math.floor(z), xf = x - xi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = zf * zf * (3 - 2 * zf);
  const a = hash2(xi, zi), b = hash2(xi + 1, zi), c = hash2(xi, zi + 1), d = hash2(xi + 1, zi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, z) { return vnoise(x, z) * .55 + vnoise(x * 2.07 + 5.3, z * 2.07 + 1.7) * .3 + vnoise(x * 4.3 + 9.1, z * 4.3 + 3.3) * .15; }

// Configurações do jogador (salvas separadamente do personagem)
const CFG = Object.assign({ music: .45, sfx: .7, shadows: !IS_TOUCH, hq: !IS_TOUCH, dmg: true, shake: true }, store.get('aethra3d_cfg') || {});
const saveCfg = () => store.set('aethra3d_cfg', CFG);
/* ===================== 02 · DADOS DO JOGO ===================== */
const VILLAGE_R = 24, WORLD_R = 216, ABYSS_X = 1000;

// Zonas em anéis ao redor da vila + o Abismo (área separada)
const ZONES = [
  { n: 'Vila de Aethra', r: 24, lv: 'Zona segura', sky: '#a6d6ff', fog: [85, 210], hemi: ['#ffffff', '#56664c', .62], sun: ['#fff1d6', .85], amb: 'pollen', theme: 'vila', g: ['#79bd68', '#8ccd72', '#b9a275'], hill: 0 },
  { n: 'Planície Verde', r: 62, lv: 'Nv 1–5', sky: '#a6d6ff', fog: [75, 200], hemi: ['#ffffff', '#4f6a45', .62], sun: ['#fff1d6', .85], amb: 'pollen', theme: 'planicie', g: ['#6db85a', '#93cc62', '#a8885a'], hill: 1.8 },
  { n: 'Floresta Sombria', r: 102, lv: 'Nv 6–10', sky: '#5d8276', fog: [40, 135], hemi: ['#d6f0d6', '#1e2e1e', .72], sun: ['#e0ffd0', .62], amb: 'fireflies', theme: 'floresta', g: ['#2f6a3a', '#3f7c3c', '#5c4a30'], hill: 2.6 },
  { n: 'Deserto Dourado', r: 142, lv: 'Nv 11–15', sky: '#f3dca8', fog: [75, 210], hemi: ['#fff6dc', '#8a6a3a', .62], sun: ['#ffe8b8', .9], amb: 'dust', theme: 'deserto', g: ['#d4b462', '#c49e50', '#b08a50'], hill: 2.4 },
  { n: 'Tundra Gélida', r: 180, lv: 'Nv 16–20', sky: '#d3e6f4', fog: [50, 165], hemi: ['#f2f8ff', '#6c84a0', .6], sun: ['#eaf4ff', .75], amb: 'snow', theme: 'tundra', g: ['#eaf2f8', '#cfe0ed', '#a9b9ca'], hill: 2.4 },
  { n: 'Vulcão Infernal', r: 218, lv: 'Nv 21–25', sky: '#5c2618', fog: [45, 150], hemi: ['#ffb894', '#2a0c08', .8], sun: ['#ff9c6a', .85], amb: 'embers', theme: 'vulcao', g: ['#4b2b26', '#3a221e', '#271612'], hill: 3 },
  { n: 'Fenda do Abismo', r: 0, lv: 'Nv 26–30', sky: '#120820', fog: [45, 150], hemi: ['#b394ff', '#0c0614', .8], sun: ['#c4a6ff', .7], amb: 'void', theme: 'abismo', g: ['#2a1a3a', '#1c1028', '#3a2650'], hill: 0 }
];
const zoneAt = (x, z) => { if (x > 600) return 6; const d = Math.hypot(x, z); for (let i = 0; i < 6; i++) if (d < ZONES[i].r) return i; return 5; };

// Pedras de Teleporte
const WAYS = [
  { id: 0, n: 'Vila de Aethra', x: 12, z: 2.5 },
  { id: 1, n: 'Planície Verde', x: 31.5, z: -5.6 },
  { id: 2, n: 'Floresta Sombria', x: -29.6, z: 63.4 },
  { id: 3, n: 'Deserto Dourado', x: 110, z: 0 },
  { id: 4, n: 'Tundra Gélida', x: -141, z: -51.3 },
  { id: 5, n: 'Vulcão Infernal', x: 64.3, z: -176.7 }
];
// Covis dos chefes
const LAIRS = {
  reiSlime: { x: 36.8, z: -30.9, r: 9 },
  ent: { x: -67.4, z: 56.6, r: 10 },
  farao: { x: 120.3, z: 43.8, r: 10 },
  rainha: { x: -127.2, z: -106.7, r: 10 },
  dragao: { x: 0, z: -199, r: 12 },
  malvorath: { x: 1000, z: -84, r: 20 }
};
// Estradas (linhas quebradas) que ligam a vila aos objetivos
const ROADS = [
  [[22, 0], [31.5, -5.6], [36.8, -30.9]],
  [[31.5, -5.6], [70, -4], [110, 0], [120.3, 43.8]],
  [[0, 22], [-12, 42], [-29.6, 63.4], [-67.4, 56.6]],
  [[-22, 0], [-70, -18], [-141, -51.3], [-127.2, -106.7]],
  [[0, -22], [18, -80], [64.3, -176.7], [0, -199]]
];
// Marcos visuais
const MARKS = {
  windmill: { x: -27, z: -41 },
  farm: { x: -41, z: -26 },
  bigtree: { x: -76, z: 63 },
  pyramid: { x: 104, z: 68, s: 12 },
  oasis: { x: -88, z: -78, r: 7 },
  lake: { x: 82, z: 136, r: 11 },
  volcanoes: [{ x: -86, z: -176, r: 20, h: 17 }, { x: 126, z: 158, r: 20, h: 19 }]
};
// Abismo: plataformas flutuantes ligadas por pontes
const ABYSS = {
  plats: [[1000, 72, 12], [1000, 24, 14], [1000, -26, 14], [1000, -84, 24]],
  bridges: [[1000, 61, 1000, 37, 2.6], [1000, 11, 1000, -13, 2.6], [1000, -39, 1000, -61, 2.6]],
  spawn: [1000, 74], exit: [1000, 80]
};
const SPAWN = [0, 7];

/* ===================== FÓRMULAS DE PROGRESSÃO ===================== */
const mHP = L => Math.round(24 + 38 * L + .6 * L * L);
const mATK = L => 4 + .95 * L + .09 * L * L;
const mXP = L => Math.round(15 + 8 * Math.pow(L, 1.45));
const needXP = L => Math.round(40 * Math.pow(L, 1.8) + 60);
const MAXLV = 99;

/* ===================== MONSTROS ===================== */
// m = modelo, c/d = cores, a = olhos, hp/at = multiplicadores, band = faixa do anel onde nasce
const SP = {
  slime: { n: 'Slime', z: 1, lv: [1, 2], band: [0, .42], m: 'blob', c: '#5fd068', d: '#c9ffd0', hp: .85, at: .8, spd: 2.6, mat: 'Gel de Slime' },
  lobo: { n: 'Lobo Cinzento', z: 1, lv: [2, 4], band: [.28, .72], m: 'wolf', c: '#8a8a94', d: '#c9c9d4', a: '#ffd23f', hp: 1, at: 1, spd: 3.8, mat: 'Pele de Lobo' },
  javali: { n: 'Javali', z: 1, lv: [4, 5], band: [.6, 1], m: 'boar', c: '#7a5230', d: '#3d2a1a', a: '#ff4a20', hp: 1.2, at: 1.05, spd: 3.4, mat: 'Presa de Javali' },
  cogumelo: { n: 'Cogumelo Bravo', z: 2, lv: [6, 7], band: [0, .42], m: 'shroom', c: '#c0392b', d: '#f4ead8', a: '#ffe14a', hp: .9, at: .9, spd: 2.3, rng: 8, pc: '#b5ff6a', mat: 'Esporo Maldito' },
  goblin: { n: 'Goblin', z: 2, lv: [7, 9], band: [.28, .75], m: 'goblin', c: '#6b4a2b', sk: '#7fbf4f', d: '#4a3020', a: '#ff3030', hp: 1, at: 1.1, spd: 3.6, mat: 'Orelha de Goblin' },
  morcego: { n: 'Morcego Vampiro', z: 2, lv: [9, 10], band: [.6, 1], m: 'bat', c: '#3a2a4a', d: '#6a4a8a', a: '#ff3030', hp: .8, at: 1, spd: 4.4, fly: 1, mat: 'Asa de Morcego' },
  escorpiao: { n: 'Escorpião', z: 3, lv: [11, 12], band: [0, .42], m: 'scorp', c: '#c9822b', d: '#8a5418', a: '#111111', hp: 1, at: 1, spd: 3.3, mat: 'Ferrão de Escorpião' },
  mumia: { n: 'Múmia', z: 3, lv: [12, 14], band: [.28, .75], m: 'mummy', c: '#d8cfae', d: '#a89870', a: '#35e0ff', hp: 1.2, at: 1, spd: 2.5, mat: 'Atadura Amaldiçoada' },
  verme: { n: 'Verme da Areia', z: 3, lv: [14, 15], band: [.6, 1], m: 'worm', c: '#c8a060', d: '#8a6030', a: '#ff5a20', hp: 1.3, at: 1.1, spd: 3, mat: 'Dente de Verme' },
  loboGelo: { n: 'Lobo Gélido', z: 4, lv: [16, 17], band: [0, .42], m: 'wolf', c: '#cfe8ff', d: '#ffffff', a: '#35a8ff', hp: 1, at: 1, spd: 4, mat: 'Pele Gélida' },
  golem: { n: 'Golem de Gelo', z: 4, lv: [17, 19], band: [.28, .75], m: 'golem', c: '#8fd3ff', d: '#5aa8d8', a: '#e0ffff', hp: 1.5, at: 1.15, spd: 2.5, mat: 'Núcleo de Gelo' },
  espirito: { n: 'Espírito da Neve', z: 4, lv: [19, 20], band: [.6, 1], m: 'ghost', c: '#e8f6ff', d: '#9fd8ff', a: '#2a90ff', hp: .85, at: 1, spd: 3.2, rng: 9, pc: '#9fe0ff', fly: 1, slowHit: 1, mat: 'Essência Gélida' },
  salamandra: { n: 'Salamandra', z: 5, lv: [21, 22], band: [0, .42], m: 'lizard', c: '#ff5a1f', d: '#ffb020', a: '#ffff40', hp: 1, at: 1, spd: 3.6, burnHit: 1, mat: 'Escama Ígnea' },
  demonio: { n: 'Demônio', z: 5, lv: [22, 24], band: [.28, .75], m: 'demon', c: '#8a0e22', sk: '#c81e36', d: '#2a0a10', a: '#ffd23f', hp: 1.2, at: 1.15, spd: 3.3, mat: 'Chifre de Demônio' },
  diabrete: { n: 'Diabrete', z: 5, lv: [24, 25], band: [.6, 1], m: 'imp', c: '#ff7a1a', d: '#7a1010', a: '#ffff60', hp: .8, at: 1, spd: 3.8, rng: 9, pc: '#ff8030', fly: 1, burnHit: 1, mat: 'Brasa Viva' },
  sombra: { n: 'Sombra Errante', z: 6, lv: [26, 28], m: 'ghost', c: '#3a2050', d: '#8a50ff', a: '#ff50ff', hp: 1, at: 1.05, spd: 3.4, rng: 9, pc: '#c070ff', fly: 1 },
  cavaleiro: { n: 'Cavaleiro do Vazio', z: 6, lv: [28, 30], m: 'knight', c: '#2a2238', d: '#7a50d0', a: '#d080ff', hp: 1.5, at: 1.2, spd: 3.1, k: 1.12 },
  // invocações dos chefes e outros
  slimeP: { n: 'Slimezinho', m: 'blob', c: '#5ab0ff', d: '#d0e8ff', hp: .45, at: .7, spd: 3.2, k: .75 },
  broto: { n: 'Broto Raivoso', m: 'sapling', c: '#4a7a2a', d: '#6b4a28', a: '#9dff6a', hp: .5, at: .8, spd: 3 },
  boneco: { n: 'Boneco de Treino', m: 'dummy', c: '#d9b070', d: '#7a5230', hp: 1, at: 0, spd: 0, dummy: 1 }
};
// Acampamentos por espécie: [quantidade de acampamentos, monstros por acampamento]
const CAMPS = { slime: [6, 4], lobo: [5, 4], javali: [4, 3], cogumelo: [5, 4], goblin: [5, 4], morcego: [4, 3], escorpiao: [5, 4], mumia: [5, 4], verme: [4, 3], loboGelo: [5, 4], golem: [5, 3], espirito: [4, 3], salamandra: [5, 4], demonio: [5, 4], diabrete: [4, 3] };
const ELITE_AFX = {
  Veloz: 'Move-se e ataca muito rápido',
  Robusto: 'Vida muito maior',
  'Vampírico': 'Cura-se ao causar dano',
  Explosivo: 'Explode ao morrer — afaste-se!',
  'Gélido': 'Ataques causam lentidão'
};

/* ===================== CHEFES ===================== */
const BOSS = {
  reiSlime: { n: 'Rei Slime', z: 1, lv: 6, m: 'blob', c: '#3fa0ff', d: '#bfe3ff', crown: 1, k: 2.8, hp: 15, at: 1.8, spd: 3.3, ab: ['salto', 'divisao'], frag: 'Fragmento Esmeralda', fc: '#3ddc84', title: 'Guardião da Planície', hi: 'BLOOORP! Ninguém toca na MINHA planície!' },
  ent: { n: 'Ent Ancião', z: 2, lv: 11, m: 'ent', c: '#5b3a1e', d: '#2f7a2a', a: '#7dff6a', k: 2.2, hp: 17, at: 1.8, spd: 2.6, ab: ['raizes', 'brotos', 'folhas'], frag: 'Fragmento Silvestre', fc: '#7dff6a', title: 'Guardião da Floresta', hi: 'Intruso... a floresta... vai te engolir...' },
  farao: { n: 'Faraó Imortal', z: 3, lv: 16, m: 'pharaoh', c: '#e8c547', sk: '#c9a040', d: '#2a6fd6', a: '#ff3030', k: 2.3, hp: 18, at: 1.8, spd: 2.8, rng: 11, pc: '#ffd23f', ab: ['maldicao', 'tornado', 'sarcofago'], frag: 'Fragmento Solar', fc: '#ffd23f', title: 'Guardião do Deserto', hi: 'Mortal insolente! Ajoelhe-se diante do Faraó!' },
  rainha: { n: 'Rainha Gélida', z: 4, lv: 21, m: 'queen', c: '#b0e0ff', sk: '#e8f6ff', d: '#6fa8ff', a: '#35a8ff', k: 2.2, hp: 19, at: 1.85, spd: 2.8, rng: 11, pc: '#9fe0ff', slowHit: 1, ab: ['nova', 'estalactites', 'rajada'], frag: 'Fragmento Boreal', fc: '#9fe0ff', title: 'Guardiã da Tundra', hi: 'Que calor irritante... vou transformar você numa estátua de gelo.' },
  dragao: { n: 'Dragão Rubro', z: 5, lv: 26, m: 'dragon', c: '#9a1424', d: '#ff7a2a', a: '#ffd23f', k: 2.4, hp: 21, at: 1.9, spd: 3.6, burnHit: 1, ab: ['sopro', 'meteoros', 'voo'], frag: 'Fragmento Ígneo', fc: '#ff6a1f', title: 'Guardião do Vulcão', hi: 'GRRRAAAH! Mais um petisco para as minhas chamas!' },
  malvorath: { n: 'Malvorath', z: 6, lv: 30, m: 'lord', c: '#1c1230', d: '#8a40ff', a: '#ff4aff', k: 2.3, hp: 34, at: 1.9, spd: 3.4, ab: ['cleave', 'orbes', 'fendas', 'invocar', 'vazio', 'colapso'], final: 1, title: 'o Devorador de Estrelas', hi: 'Então você é a faísca que ousa desafiar a escuridão? Venha. Eu devorarei sua luz.' }
};
const BOSS_ORDER = ['reiSlime', 'ent', 'farao', 'rainha', 'dragao'];

/* ===================== ITENS ===================== */
const SLOTS = ['arma', 'armadura', 'elmo', 'amuleto'];
const SLOT_N = { arma: 'Arma', armadura: 'Armadura', elmo: 'Elmo', amuleto: 'Amuleto' };
const SLOT_I = { armadura: '🥋', elmo: '⛑️', amuleto: '📿' };
const RAR = [
  { n: 'Comum', c: '#d2d2d2', m: 1, af: 0 },
  { n: 'Incomum', c: '#5fe08a', m: 1.12, af: 1 },
  { n: 'Raro', c: '#4aa8ff', m: 1.28, af: 2 },
  { n: 'Épico', c: '#b36bff', m: 1.5, af: 3 },
  { n: 'Lendário', c: '#ff9a1f', m: 1.8, af: 4 }
];
const WNAME = {
  w: ['Espada Enferrujada', 'Espada de Ferro', 'Lâmina Silvestre', 'Cimitarra do Deserto', 'Espada Glacial', 'Lâmina Flamejante', 'Lâmina da Aurora'],
  a: ['Arco Curto', 'Arco de Caça', 'Arco Élfico', 'Arco do Escorpião', 'Arco Boreal', 'Arco do Dragão', 'Arco da Aurora'],
  m: ['Graveto Mágico', 'Cajado de Carvalho', 'Cajado do Bosque', 'Cetro do Faraó', 'Cajado de Cristal', 'Cajado Ígneo', 'Cajado da Aurora']
};
const ANAME = ['Túnica de Pano', 'Couro Batido', 'Gibão Silvestre', 'Armadura de Escamas', 'Cota Glacial', 'Armadura Vulcânica', 'Armadura da Aurora'];
const HNAME = ['Capuz de Pano', 'Elmo de Couro', 'Coroa de Folhas', 'Elmo do Deserto', 'Elmo Glacial', 'Elmo Infernal', 'Diadema da Aurora'];
const MNAME = ['Amuleto Simples', 'Amuleto de Jade', 'Amuleto Silvestre', 'Amuleto Solar', 'Amuleto Boreal', 'Amuleto de Magma', 'Amuleto da Aurora'];
const TCOL = ['#9a9a9a', '#cfd6dd', '#6fd36a', '#ffd23f', '#9fe0ff', '#ff6a1f', '#e2c8ff'];
const ACOL = ['#8b7355', '#7a5230', '#3f7a3a', '#c9a050', '#8fbfdf', '#7a1a1a', '#e8e0ff'];
const AFX = {
  atk: { n: 'Ataque', v: il => 2 + il * .9, suf: 'da Fúria' },
  hp: { n: 'Vida', v: il => 10 + il * 6, suf: 'do Urso' },
  mp: { n: 'Mana', v: il => 6 + il * 2.5, suf: 'do Sábio' },
  def: { n: 'Defesa', v: il => 1 + il * .5, suf: 'da Muralha' },
  crit: { n: 'Crítico', v: il => 1.5 + il * .08, p: 1, suf: 'do Falcão' },
  aspd: { n: 'Vel. de Ataque', v: il => 3 + il * .2, p: 1, suf: 'do Vento' },
  move: { n: 'Vel. de Movimento', v: il => 3 + il * .12, p: 1, suf: 'da Lebre' },
  ls: { n: 'Roubo de Vida', v: il => 1 + il * .05, p: 1, suf: 'do Vampiro' }
};
const STAT_N = { atk: 'Ataque', def: 'Defesa', hp: 'Vida', mp: 'Mana', crit: 'Crítico', aspd: 'Vel. de Ataque', move: 'Vel. de Movimento', ls: 'Roubo de Vida' };
const PCT = { crit: 1, aspd: 1, move: 1, ls: 1 };
const REFINE_CHANCE = [100, 100, 100, 100, 95, 85, 75, 65, 50, 40];

// Consumíveis (guardados como contadores)
const CONS = {
  h1: { n: 'Poção de Vida P', i: '❤️', hp: .35, price: 15 },
  h2: { n: 'Poção de Vida M', i: '💖', hp: .6, price: 45 },
  h3: { n: 'Poção de Vida G', i: '💗', hp: 1, price: 120 },
  m1: { n: 'Poção de Mana P', i: '🔹', mp: .4, price: 15 },
  m2: { n: 'Poção de Mana M', i: '💧', mp: .7, price: 45 },
  m3: { n: 'Poção de Mana G', i: '🌊', mp: 1, price: 120 },
  scroll: { n: 'Pergaminho de Retorno', i: '📜', price: 25, d: 'Teleporta você de volta para a vila (tecla B).' },
  stone: { n: 'Pedra de Refino', i: '💠', price: 250, d: 'Necessária para refinar itens acima de +4.' },
  elixir: { n: 'Elixir de Sabedoria', i: '⚗️', price: 300, d: '+50% de experiência por 10 minutos.' }
};

/* ===================== CLASSES E HABILIDADES ===================== */
const CLS = {
  w: {
    n: ['Guerreiro', 'Guerreira'], i: '🗡️', c: '#d0503a', rng: 2.5, aspd: .85, hpL: 9, mpL: 1,
    desc: 'Mestre do combate corpo a corpo. Aguenta muito dano e atordoa os inimigos.',
    pas: 'Pele de Ferro: +10% de Defesa e 3% de roubo de vida.',
    auto: { pod: 1.6, vit: 1.2, agi: .2, sab: 0 }, bars: [5, 3, 1, 1]
  },
  a: {
    n: ['Arqueiro', 'Arqueira'], i: '🏹', c: '#3fb35e', rng: 11, aspd: .95, hpL: 5, mpL: 2,
    desc: 'Ataca de longe com precisão mortal. Muitos acertos críticos e muita mobilidade.',
    pas: 'Olhos de Águia: +8% de chance de crítico e +25% de dano crítico.',
    auto: { pod: 1.4, vit: .6, agi: 1, sab: 0 }, bars: [3, 4, 5, 2]
  },
  m: {
    n: ['Mago', 'Maga'], i: '🪄', c: '#8a6cff', rng: 10, aspd: 1.1, hpL: 3, mpL: 6,
    desc: 'Domina fogo, gelo e raios. Devastador contra grupos, mas frágil.',
    pas: 'Mente Arcana: +20% de Mana e +15% de dano das habilidades.',
    auto: { pod: 1.4, vit: .6, agi: .2, sab: .8 }, bars: [2, 5, 4, 3]
  }
};
const ATTR = {
  pod: { n: 'Poder', d: '+2 de Ataque' },
  vit: { n: 'Vitalidade', d: '+12 de Vida e +0,4 de Defesa' },
  agi: { n: 'Agilidade', d: '+0,35% de Crítico e +0,8% de Vel. de Ataque' },
  sab: { n: 'Sabedoria', d: '+6 de Mana e +1% de dano das habilidades' }
};
const SKILLS = {
  w: [
    { id: 'golpe', n: 'Golpe Brutal', i: '💥', lv: 1, mp: 8, cd: 4, tgt: 1, d: 'Golpe pesado com 260% de dano. 40% de chance de atordoar.' },
    { id: 'redemoinho', n: 'Redemoinho', i: '🌀', lv: 3, mp: 16, cd: 7, d: 'Gira a arma e causa 180% de dano a todos ao redor.' },
    { id: 'investida', n: 'Investida', i: '⚡', lv: 7, mp: 14, cd: 9, tgt: 1, rng: 15, d: 'Avança até o alvo: 220% de dano e atordoa por 1,5s.' },
    { id: 'grito', n: 'Grito de Guerra', i: '📯', lv: 12, mp: 25, cd: 25, d: '+35% de Ataque e Defesa por 12s. Cura 20% da vida.' },
    { id: 'terremoto', n: 'Fúria do Titã', i: '🌋', lv: 18, mp: 45, cd: 30, d: 'Salta e esmaga o chão: 400% de dano em grande área e atordoa.' }
  ],
  a: [
    { id: 'perfurante', n: 'Tiro Perfurante', i: '🎯', lv: 1, mp: 8, cd: 4, tgt: 1, d: 'Flecha que atravessa todos os inimigos em linha: 240% de dano.' },
    { id: 'chuva', n: 'Chuva de Flechas', i: '🌧️', lv: 3, mp: 18, cd: 8, tgt: 1, d: 'Três ondas de flechas na área do alvo (100% cada).' },
    { id: 'salto', n: 'Salto Evasivo', i: '💨', lv: 7, mp: 10, cd: 10, d: 'Salta para trás, fica mais rápido e os próximos 3 tiros são críticos.' },
    { id: 'instinto', n: 'Instinto Selvagem', i: '🐺', lv: 12, mp: 25, cd: 25, d: '+50% de Vel. de Ataque e +20% de Crítico por 12s. Cura 15%.' },
    { id: 'tempestade', n: 'Tempestade de Flechas', i: '🏹', lv: 18, mp: 45, cd: 30, d: 'Dispara 12 flechas teleguiadas (110% cada) nos inimigos próximos.' }
  ],
  m: [
    { id: 'bolafogo', n: 'Bola de Fogo', i: '🔥', lv: 1, mp: 10, cd: 3.5, tgt: 1, d: '260% de dano, explode em área e queima o alvo.' },
    { id: 'nova', n: 'Nova Gélida', i: '❄️', lv: 3, mp: 18, cd: 8, d: 'Explosão de gelo ao redor: 160% de dano e deixa lentos.' },
    { id: 'raio', n: 'Corrente de Raios', i: '⚡', lv: 7, mp: 20, cd: 7, tgt: 1, d: 'Um raio que salta entre até 5 inimigos (210% de dano).' },
    { id: 'escudo', n: 'Escudo Arcano', i: '🔮', lv: 12, mp: 25, cd: 25, d: 'Escudo que absorve dano igual a 40% da vida máxima por 12s.' },
    { id: 'meteoro', n: 'Meteoro', i: '☄️', lv: 18, mp: 50, cd: 30, tgt: 1, d: 'Invoca um meteoro: 500% de dano em grande área e queima.' }
  ]
};

/* ===================== MISSÕES ===================== */
// Linha principal (L = nível de referência para recompensas)
const MAIN = [
  { t: 'O Despertar', type: 'talk', npc: 'eldric', d: 'Fale com o Ancião Eldric, perto da fonte da vila.', L: 1 },
  { t: 'Armas para a Jornada', type: 'talk', npc: 'brunhilda', d: 'Fale com a Ferreira Brunhilda, na forja da vila.', L: 1 },
  { t: 'Gosma nas Plantações', type: 'kill', sp: 'slime', n: 6, d: 'Derrote 6 Slimes na Planície Verde.', L: 2, rew: { pot: { h1: 3 } } },
  { t: 'Uivos na Planície', type: 'kill', sp: 'lobo', n: 6, d: 'Derrote 6 Lobos Cinzentos na Planície Verde.', L: 3 },
  { t: 'O Rei Gelatinoso', type: 'boss', boss: 'reiSlime', d: 'Derrote o Rei Slime em seu covil, a nordeste da vila.', L: 6 },
  { t: 'A Primeira Luz', type: 'deliver', npc: 'eldric', frag: 1, d: 'Leve o Fragmento Esmeralda ao Ancião Eldric.', L: 6 },
  { t: 'Esporos Malditos', type: 'collect', sp: 'cogumelo', n: 6, item: 'Esporo Maldito', chance: .7, d: 'Colete 6 Esporos Malditos dos Cogumelos Bravos (Floresta Sombria).', L: 7 },
  { t: 'O Acampamento Goblin', type: 'kill', sp: 'goblin', n: 8, d: 'Derrote 8 Goblins na Floresta Sombria.', L: 8 },
  { t: 'O Coração da Floresta', type: 'boss', boss: 'ent', d: 'Derrote o Ent Ancião, no coração da floresta, a sudoeste.', L: 11 },
  { t: 'Raízes da Esperança', type: 'deliver', npc: 'eldric', frag: 2, d: 'Leve o Fragmento Silvestre ao Ancião Eldric.', L: 11 },
  { t: 'Ferrões no Deserto', type: 'kill', sp: 'escorpiao', n: 8, d: 'Derrote 8 Escorpiões no Deserto Dourado.', L: 12 },
  { t: 'Ataduras Amaldiçoadas', type: 'collect', sp: 'mumia', n: 6, item: 'Atadura Amaldiçoada', chance: .7, d: 'Colete 6 Ataduras Amaldiçoadas das Múmias.', L: 13 },
  { t: 'O Faraó Imortal', type: 'boss', boss: 'farao', d: 'Derrote o Faraó Imortal diante de sua pirâmide, a leste.', L: 16 },
  { t: 'O Sol Renascido', type: 'deliver', npc: 'eldric', frag: 3, d: 'Leve o Fragmento Solar ao Ancião Eldric.', L: 16 },
  { t: 'Uivos no Gelo', type: 'kill', sp: 'loboGelo', n: 8, d: 'Derrote 8 Lobos Gélidos na Tundra Gélida.', L: 17 },
  { t: 'Corações Congelados', type: 'collect', sp: 'golem', n: 5, item: 'Núcleo de Gelo', chance: .7, d: 'Colete 5 Núcleos de Gelo dos Golens de Gelo.', L: 18 },
  { t: 'A Rainha Gélida', type: 'boss', boss: 'rainha', d: 'Derrote a Rainha Gélida nas ruínas de seu palácio, a noroeste.', L: 21 },
  { t: 'O Degelo', type: 'deliver', npc: 'eldric', frag: 4, d: 'Leve o Fragmento Boreal ao Ancião Eldric.', L: 21 },
  { t: 'Escamas de Fogo', type: 'collect', sp: 'salamandra', n: 6, item: 'Escama Ígnea', chance: .7, d: 'Colete 6 Escamas Ígneas das Salamandras (Vulcão Infernal).', L: 22 },
  { t: 'A Legião Infernal', type: 'kill', sp: 'demonio', n: 8, d: 'Derrote 8 Demônios no Vulcão Infernal.', L: 23 },
  { t: 'O Dragão Rubro', type: 'boss', boss: 'dragao', d: 'Derrote o Dragão Rubro em seu ninho, no extremo norte.', L: 26 },
  { t: 'A Aurora Restaurada', type: 'deliver', npc: 'eldric', frag: 5, d: 'Leve o Fragmento Ígneo ao Ancião Eldric.', L: 26 },
  { t: 'A Fenda do Abismo', type: 'portal', d: 'Entre no portal que se abriu ao lado da fonte da vila.', L: 27 },
  { t: 'O Devorador', type: 'boss', boss: 'malvorath', d: 'Atravesse a Fenda do Abismo e derrote Malvorath.', L: 30 },
  { t: 'Lenda de Aethra', type: 'done', d: 'Aethra está salva! Continue explorando e ficando mais forte.', L: 30 }
];
// Missões secundárias (req = etapa mínima da história)
const SIDE = [
  { id: 'gel', npc: 'tobias', t: 'Gosma Valiosa', type: 'collect', sp: 'slime', n: 8, item: 'Gel de Slime', chance: .6, req: 2, L: 3, rew: { pot: { h1: 4, m1: 4 } }, txt: 'Gel de slime é ótimo para poções! Me traga 8 e eu pago em mercadoria.' },
  { id: 'javali', npc: 'lyra', t: 'Javalis Furiosos', type: 'kill', sp: 'javali', n: 8, req: 3, L: 5, rew: { item: ['elmo', 1, 5, 1] }, txt: 'Javalis estão destruindo as cercas das fazendas, nos limites da planície. Derrube 8 deles.' },
  { id: 'orelha', npc: 'tobias', t: 'Orelhas de Goblin', type: 'collect', sp: 'goblin', n: 8, item: 'Orelha de Goblin', chance: .6, req: 6, L: 9, rew: { pot: { h2: 3 }, scroll: 3 }, txt: 'Um colecionador excêntrico paga bem por orelhas de goblin. Não pergunte. Traga 8!' },
  { id: 'morcego', npc: 'lyra', t: 'Asas na Escuridão', type: 'kill', sp: 'morcego', n: 10, req: 6, L: 10, rew: { item: ['amuleto', 2, 10, 2] }, txt: 'Morcegos vampiros atacam viajantes nas bordas da floresta. Elimine 10.' },
  { id: 'elite', npc: 'lyra', t: 'Caçador de Elites', type: 'elite', n: 5, req: 6, L: 13, rew: { item: ['arma', 3, 15, 3], stone: 2 }, txt: 'Monstros com brilho dourado são elites: mais fortes e mais perigosos. Derrote 5 deles, de qualquer tipo.' },
  { id: 'ferrao', npc: 'brunhilda', t: 'Aço e Veneno', type: 'collect', sp: 'escorpiao', n: 6, item: 'Ferrão de Escorpião', chance: .6, req: 10, L: 13, rew: { stone: 3 }, txt: 'Ferrões de escorpião deixam o aço mais flexível. Traga 6 e eu te dou Pedras de Refino.' },
  { id: 'verme', npc: 'lyra', t: 'Terror das Dunas', type: 'kill', sp: 'verme', n: 8, req: 10, L: 15, rew: { item: ['armadura', 3, 15, 2] }, txt: 'Vermes gigantes engolem caravanas inteiras no fundo do deserto. Acabe com 8 deles.' },
  { id: 'pele', npc: 'tobias', t: 'Peles para o Inverno', type: 'collect', sp: 'loboGelo', n: 6, item: 'Pele Gélida', chance: .6, req: 14, L: 18, rew: { pot: { h2: 4, m2: 4 } }, txt: 'O inverno vem aí! Preciso de 6 Peles Gélidas para fazer casacos.' },
  { id: 'espirito', npc: 'lyra', t: 'Lamentos Gelados', type: 'kill', sp: 'espirito', n: 10, req: 14, L: 20, rew: { item: ['elmo', 4, 20, 2] }, txt: 'Espíritos da neve congelam quem cruza a tundra. Liberte 10 deles.' },
  { id: 'chifre', npc: 'brunhilda', t: 'Fogo para a Forja', type: 'collect', sp: 'demonio', n: 6, item: 'Chifre de Demônio', chance: .6, req: 18, L: 23, rew: { stone: 4, item: ['arma', 5, 24, 2] }, txt: 'Chifres de demônio queimam mais quente que carvão. Traga 6 para minha forja!' },
  { id: 'diabrete', npc: 'lyra', t: 'Pequenos Incendiários', type: 'kill', sp: 'diabrete', n: 10, req: 18, L: 25, rew: { item: ['amuleto', 5, 25, 3] }, txt: 'Diabretes estão incendiando tudo no vulcão. Derrube 10 dessas pestes.' }
];

/* ===================== DIÁLOGOS ===================== */
const DLG = {
  intro: [
    'Ah... um rosto novo! Seja bem-vind{o} a Aethra, {nome}. Eu sou Eldric, o ancião desta vila.',
    'Há sete noites, Malvorath, o Devorador de Estrelas, rompeu o selo do Abismo e despedaçou o Cristal da Aurora — a luz que protegia esta terra.',
    'Cinco fragmentos do cristal foram tomados por guardiões corrompidos. Desde então, as criaturas de Aethra enlouqueceram.',
    'Sei que é pedir muito... mas você pode nos ajudar? Antes de partir, procure Brunhilda, a ferreira. Ela tem algo para você.'
  ],
  bru1: [
    'Então você é {o} novat{o} que o Eldric mandou? Hmph. Com esse equipamento você não corta nem manteiga.',
    'Tome, forjei isto ontem à noite. Abra a mochila com a tecla I (ou o botão 🎒) e equipe.',
    'Quando juntar ouro, volte aqui: eu vendo equipamentos e REFINO suas peças. Agora vá — os slimes estão devorando as plantações, a leste da vila!'
  ],
  frag: {
    1: ['Este brilho... o Fragmento Esmeralda! Você conseguiu!', 'Veja, o Cristal da Aurora já reage. Uma faísca de luz voltou a Aethra.',
      'O próximo fragmento está na Floresta Sombria, ao sul. Dizem que o Ent Ancião, antigo protetor da mata, foi corrompido.',
      'Antes, os Cogumelos Bravos andam espalhando esporos malditos. Traga alguns para que eu estude essa corrupção.'],
    2: ['O Fragmento Silvestre... o cheiro da floresta voltou ao ar!', 'Dois de cinco. O cristal pulsa mais forte a cada fragmento.',
      'Agora, o Deserto Dourado, a leste. O Faraó Imortal despertou de seu sono de mil anos e tomou um fragmento para si.',
      'Cuidado com os escorpiões, e traga-me as ataduras das múmias: preciso entender que magia as move.'],
    3: ['O Fragmento Solar! Quente como o próprio deserto.', 'Três de cinco. Você está se tornando uma lenda, {nome}.',
      'O quarto fragmento está com a Rainha Gélida, nas ruínas de seu palácio, a noroeste, na Tundra.',
      'Os lobos de gelo caçam em matilha, e os núcleos dos golens guardam magia antiga. Traga alguns para mim.'],
    4: ['O Fragmento Boreal... frio como o inverno, mas cheio de luz.', 'Falta apenas um.',
      'O último guardião é o Dragão Rubro, que fez seu ninho no extremo norte do Vulcão Infernal. É a criatura mais perigosa de Aethra.',
      'Prepare-se bem: compre poções, refine seu equipamento... e que a Aurora te proteja.'],
    5: ['Os cinco fragmentos... juntos outra vez! Olhe para a fonte!', 'O Cristal da Aurora está completo! Mas... sinto algo errado.',
      'O poder do cristal reabriu a Fenda do Abismo. Um portal surgiu ao lado da fonte. Malvorath sabe que você está indo.',
      'Esta é a batalha final, {nome}. Entre no portal quando estiver pront{o}. Toda Aethra estará torcendo por você.']
  },
  portal: ['O portal está aberto, ao lado da fonte. Quando estiver pront{o}, atravesse-o.', 'Lembre-se: Malvorath é ardiloso. Fique de olho nas áreas vermelhas no chão e use a esquiva (Shift)!'],
  done: ['{nome}! {Heroi} de Aethra!', 'Graças a você, o Cristal da Aurora brilha como nunca. Fique o quanto quiser — esta vila é a sua casa.', 'Dizem que o Abismo ainda ecoa... Se quiser um desafio maior, comece um Novo Jogo+ pelo menu (Esc).'],
  greet: {
    brunhilda: ['Precisa de aço, {nome}?', 'Nada como o som do martelo na bigorna!', 'Traga Pedras de Refino e eu deixo suas armas afiadas como nunca.'],
    tobias: ['Bem-vind{o}, bem-vind{o}! Poções fresquinhas, pergaminhos, elixires... tudo com preço de amigo!', 'Ouro na mão, poção na bolsa! Hehe.', 'O Elixir de Sabedoria acelera seu aprendizado. Ótimo investimento!'],
    lyra: ['Capitã Lyra, da Guarda de Aethra. Se quiser ajudar a manter a vila segura, tenho trabalho para você.', 'Fique atent{o}: monstros com brilho dourado são elites. Mais fortes, mas valem a pena.', 'Treine nos bonecos ali do lado se quiser testar suas habilidades.']
  }
};
const INTRO_STORY = [
  'Há mil anos, o Cristal da Aurora ilumina o reino de Aethra, mantendo as trevas do Abismo seladas sob a terra.',
  'Mas, numa noite sem estrelas, Malvorath, o Devorador, rompeu o selo. O cristal se partiu em cinco fragmentos, e guardiões corrompidos os levaram para os cantos mais perigosos do reino.',
  'Agora, {um} jovem {classe} chega à pequena Vila de Aethra. Ninguém sabe ainda... mas é aqui que a lenda começa.'
];
const ENDING_STORY = [
  'Com o último golpe, Malvorath se desfaz em poeira estelar. A Fenda do Abismo se fecha com um estrondo que ecoa por toda Aethra.',
  'O Cristal da Aurora volta a brilhar, mais forte do que nunca. As criaturas se acalmam, as florestas respiram, e a vila inteira celebra o nome de {nome}.',
  'Mas toda lenda deixa ecos... e dizem que, nas noites sem lua, algo ainda observa das profundezas.'
];

/* ===================== NPCs ===================== */
const NPCS = [
  { id: 'eldric', n: 'Ancião Eldric', i: '🧙', x: -5.8, z: -4.2, ry: 2.2, look: { skin: '#e8c4a0', shirt: '#33437f', pants: '#2a2f55', hair: '#eeeeee', hs: 'bald', beard: '#eeeeee', robe: '#33437f', staff: 1 } },
  { id: 'brunhilda', n: 'Ferreira Brunhilda', i: '⚒️', x: -10.5, z: 4.8, ry: 1.2, look: { skin: '#e0a882', shirt: '#7a3a22', pants: '#3a2a1a', hair: '#d9542a', hs: 'braids', apron: '#4a3a2a', hammer: 1, f: 1 } },
  { id: 'tobias', n: 'Mercador Tobias', i: '💰', x: 8.8, z: -5.8, ry: -1, look: { skin: '#f1c9a0', shirt: '#2e7d4f', pants: '#5a4030', hair: '#5a3a1a', hs: 'short', hat: '#8a5a2a', belly: 1, mustache: '#5a3a1a' } },
  { id: 'lyra', n: 'Capitã Lyra', i: '🛡️', x: 6.8, z: 9.6, ry: -2.6, look: { skin: '#c68a5e', shirt: '#9aa6b4', pants: '#3a4a6a', hair: '#1a1a1a', hs: 'long', plume: '#c0392b', spear: 1, f: 1 } },
  { id: 'quadro', n: 'Quadro de Caçadas', i: '📜', x: -5, z: 11.5, ry: 2.8, board: 1 }
];

/* ===================== CONQUISTAS ===================== */
const ACH = [
  { id: 'kill1', n: 'Primeiro Sangue', d: 'Derrote seu primeiro monstro.', i: '🩸' },
  { id: 'kill100', n: 'Caçador', d: 'Derrote 100 monstros.', i: '🏹' },
  { id: 'kill500', n: 'Exterminador', d: 'Derrote 500 monstros.', i: '💀' },
  { id: 'elite10', n: 'Elite da Elite', d: 'Derrote 10 monstros de elite.', i: '⭐' },
  { id: 'boss1', n: 'Matador de Reis', d: 'Derrote o Rei Slime.', i: '👑' },
  { id: 'boss5', n: 'Guardiões Caídos', d: 'Derrote os 5 guardiões corrompidos.', i: '💎' },
  { id: 'final', n: 'Lenda de Aethra', d: 'Derrote Malvorath, o Devorador.', i: '🌅' },
  { id: 'nodeath', n: 'Intocável', d: 'Derrote um guardião sem morrer durante a luta.', i: '🛡️' },
  { id: 'rich', n: 'Rico', d: 'Tenha 5.000 de ouro.', i: '💰' },
  { id: 'legend', n: 'Lendário', d: 'Equipe um item Lendário.', i: '🟠' },
  { id: 'smith', n: 'Mestre Ferreiro', d: 'Refine um item até +7.', i: '⚒️' },
  { id: 'explorer', n: 'Explorador', d: 'Descubra todas as Pedras de Teleporte.', i: '🧭' },
  { id: 'lv30', n: 'Veterano', d: 'Alcance o nível 30.', i: '🎖️' },
  { id: 'bounty10', n: 'Caçador de Recompensas', d: 'Complete 10 contratos do Quadro de Caçadas.', i: '📜' },
  { id: 'ng', n: 'Mais Uma Vez', d: 'Comece um Novo Jogo+.', i: '🔁' }
];

/* ===================== OUTROS AVENTUREIROS (clima de MMO) ===================== */
const BOT_NAMES = ['xX_Sombra_Xx', 'LunaMaga', 'Pedrão99', 'Kaio_Arqueiro', 'DragonSlayerBR', 'Bia.exe', 'TioDaPoção', 'NinjaDaVila', 'Mestre_Yuri', 'GabiGamer', 'ZéDaEspada', 'Tainá_Raio'];
const BOT_CHAT = ['alguém pra matar o Rei Slime comigo?', 'vendo Espada Glacial +5, chama no privado', 'lag absurdo hj kkk', 'a Rainha Gélida me matou 3x 😭', 'dica: desvia das áreas vermelhas no chão', 'quem tem poção sobrando?', 'acabei de dropar um lendário!!!', 'bora farmar na floresta', 'gg', 'o dragão é muito apelão', 'aff morri pro javali', 'alguém sabe onde fica a pirâmide?', 'refinei pra +7 de primeira 😎', 'to quase nv 20', 'Tobias vende Pedra de Refino, é caro mas vale', 'kkkkk', 'oi gente', 'cuidado com os elites dourados', 'shift = esquiva, salva vidas', 'o mapa (M) mostra os chefes', 'alguém aí já zerou?', 'Brunhilda refina até +10 👀'];
const BOT_REPLY = [
  [/\b(oi|ol[aá]|eae|salve|opa)\b/i, ['oi!', 'eae 👋', 'salve!', 'opa, bem-vind{o}!']],
  [/ajuda|como|onde|socorro/i, ['abre o mapa com M', 'fala com o Eldric na fonte', 'compra poção com o Tobias', 'a Brunhilda refina seus itens']],
  [/boss|chefe|guardi/i, ['os chefes têm ataques em área, fica de olho no chão vermelho', 'leva bastante poção pro chefe']],
  [/gg|vlw|valeu|obrigad/i, ['gg!', 'tmj', 'nada não 😄']],
  [/lag/i, ['aqui tá liso']],
  [/drop|lend[aá]rio/i, ['sortud{o}!', 'mentira kkkk', 'que inveja']]
];
/* ===================== 03 · ÁUDIO (sintetizado, sem arquivos) ===================== */
const AU = (() => {
  let ctx = null, master, sfxG, musG, noiseBuf, bus = null, theme = null, nextT = 0, step = 0, timer = 0, pending = 'vila';
  const last = {};

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.connect(ctx.destination);
    master = ctx.createGain(); master.connect(comp);
    sfxG = ctx.createGain(); sfxG.connect(master);
    musG = ctx.createGain(); musG.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    setVol();
    timer = setInterval(sched, 60);
    setTheme(pending, true);
  }
  function setVol() { if (!ctx) return; sfxG.gain.value = CFG.sfx * .55; musG.gain.value = CFG.music * .5; }

  function tone(f, dur, o = {}) {
    const t = ctx.currentTime + (o.delay || 0), osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(f, t);
    if (o.f2) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.f2), t + dur);
    const v = o.vol || .2, at = o.at || .005;
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + at); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    let n = osc;
    if (o.filt) { const fl = ctx.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = o.filt; osc.connect(fl); n = fl; }
    n.connect(g); g.connect(o.dest || sfxG); osc.start(t); osc.stop(t + dur + .05);
  }
  function noise(dur, o = {}) {
    const t = ctx.currentTime + (o.delay || 0), s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf; s.loop = true;
    fl.type = o.type || 'bandpass'; fl.frequency.setValueAtTime(o.f || 1000, t); fl.Q.value = o.q || 1;
    if (o.f2) fl.frequency.exponentialRampToValueAtTime(o.f2, t + dur);
    const v = o.vol || .2;
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + (o.at || .005)); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    s.connect(fl); fl.connect(g); g.connect(o.dest || sfxG); s.start(t, Math.random() * .5); s.stop(t + dur + .05);
  }
  const arp = (notes, gap, o) => notes.forEach((f, i) => tone(f, o.dur || .4, Object.assign({}, o, { delay: i * gap })));

  const SFX = {
    swing: () => noise(.16, { vol: .22, f: 2600, f2: 500, q: .8 }),
    hit: () => { noise(.08, { vol: .3, f: 1400, q: .7 }); tone(150, .12, { type: 'triangle', vol: .25, f2: 60 }); },
    crit: () => { noise(.12, { vol: .35, f: 3200, q: .6 }); tone(240, .2, { type: 'square', vol: .1, f2: 70 }); tone(1100, .15, { vol: .1, delay: .02 }); },
    arrow: () => noise(.2, { vol: .16, f: 5200, f2: 1400, q: 2 }),
    magic: () => { tone(620, .25, { vol: .12, f2: 1250 }); tone(930, .2, { type: 'triangle', vol: .06, f2: 1800, delay: .03 }); },
    fire: () => { noise(.5, { vol: .28, f: 900, f2: 160, type: 'lowpass' }); tone(120, .4, { type: 'sawtooth', vol: .06, f2: 50, filt: 600 }); },
    ice: () => { tone(1800, .3, { vol: .07, f2: 900 }); tone(2500, .25, { vol: .05, f2: 1300, delay: .05 }); noise(.3, { vol: .1, f: 6000, q: 3 }); },
    zap: () => { tone(1300, .15, { type: 'square', vol: .06, f2: 300 }); noise(.2, { vol: .14, f: 4200, q: 4 }); },
    boom: () => { noise(.8, { vol: .5, f: 700, f2: 50, type: 'lowpass' }); tone(90, .6, { vol: .35, f2: 30 }); },
    slam: () => { noise(.5, { vol: .45, f: 420, f2: 50, type: 'lowpass' }); tone(70, .45, { vol: .35, f2: 28 }); },
    hurt: () => { tone(190, .18, { type: 'square', vol: .08, f2: 90, filt: 900 }); noise(.1, { vol: .18, f: 800 }); },
    mdie: () => { noise(.3, { vol: .18, f: 700, f2: 150, type: 'lowpass' }); tone(320, .3, { type: 'triangle', vol: .1, f2: 90 }); },
    coin: () => { tone(1320, .08, { type: 'square', vol: .035 }); tone(1760, .12, { type: 'square', vol: .035, delay: .07 }); },
    pickup: () => { tone(660, .1, { vol: .1 }); tone(990, .15, { vol: .1, delay: .08 }); },
    rare: () => arp([784, 988, 1175, 1568], .07, { type: 'triangle', vol: .09, dur: .5 }),
    potion: () => { tone(420, .25, { vol: .1, f2: 950 }); noise(.2, { vol: .07, f: 2200, q: 5, delay: .05 }); },
    heal: () => arp([523, 659, 784], .07, { vol: .07, dur: .4 }),
    level: () => arp([523, 659, 784, 1047, 1319], .09, { type: 'triangle', vol: .12, dur: .6 }),
    quest: () => arp([784, 988, 1175], .09, { vol: .11, dur: .45 }),
    ach: () => arp([659, 784, 988, 1319], .08, { type: 'triangle', vol: .09, dur: .5 }),
    ui: () => tone(900, .05, { vol: .05 }),
    err: () => tone(170, .15, { type: 'square', vol: .05 }),
    buy: () => { tone(1047, .1, { type: 'square', vol: .035 }); tone(1568, .18, { type: 'square', vol: .035, delay: .08 }); },
    tele: () => { tone(200, .9, { vol: .1, f2: 1600 }); noise(.9, { vol: .08, f: 500, f2: 4000, q: 2 }); },
    roar: () => { tone(95, 1.1, { type: 'sawtooth', vol: .16, f2: 45, filt: 520 }); noise(1.1, { vol: .22, f: 320, f2: 110, type: 'lowpass' }); },
    warn: () => tone(440, .22, { type: 'triangle', vol: .05, f2: 330 }),
    dash: () => noise(.22, { vol: .14, f: 1200, f2: 3200, q: 1 }),
    shield: () => { tone(300, .5, { vol: .08, f2: 600 }); tone(450, .5, { type: 'triangle', vol: .05, f2: 900 }); },
    buff: () => arp([392, 523, 659], .06, { type: 'sawtooth', vol: .04, dur: .3, filt: 1600 }),
    refOk: () => arp([523, 784, 1047, 1568], .08, { type: 'triangle', vol: .1, dur: .5 }),
    refFail: () => { tone(300, .4, { type: 'sawtooth', vol: .06, f2: 90, filt: 900 }); noise(.3, { vol: .15, f: 600 }); },
    pdie: () => arp([392, 330, 262, 196], .18, { type: 'triangle', vol: .1, dur: .6 }),
    victory: () => arp([523, 659, 784, 1047, 784, 1047, 1319], .14, { type: 'triangle', vol: .12, dur: .7 }),
    open: () => tone(600, .08, { type: 'triangle', vol: .05, f2: 900 }),
    step: () => noise(.05, { vol: .03, f: 300, q: 1 })
  };
  function play(name) {
    if (!ctx || CFG.sfx <= 0) return;
    const now = ctx.currentTime; if (last[name] && now - last[name] < .045) return; last[name] = now;
    const f = SFX[name]; if (f) try { f(); } catch (e) { }
  }

  /* ---- Música procedural: acordes suaves + arpejo + baixo (+ bateria nos chefes) ---- */
  const MAJ = [0, 2, 4, 5, 7, 9, 11], MIN = [0, 2, 3, 5, 7, 8, 10], DOR = [0, 2, 3, 5, 7, 9, 10], PHR = [0, 1, 3, 5, 7, 8, 10], HAR = [0, 1, 4, 5, 7, 8, 10];
  const THEMES = {
    vila: { bpm: 84, root: 60, sc: MAJ, prog: [0, 5, 3, 4], arp: .8, pad: 'triangle', cut: 1500 },
    planicie: { bpm: 96, root: 62, sc: MAJ, prog: [0, 3, 4, 0, 5, 3, 1, 4], arp: .85, pad: 'triangle', cut: 1800 },
    floresta: { bpm: 78, root: 57, sc: DOR, prog: [0, 6, 5, 6], arp: .65, pad: 'sine', cut: 1100 },
    deserto: { bpm: 92, root: 62, sc: HAR, prog: [0, 1, 0, 6], arp: .8, pad: 'triangle', cut: 1600 },
    tundra: { bpm: 70, root: 64, sc: MIN, prog: [0, 5, 2, 6], arp: .55, pad: 'sine', cut: 2200 },
    vulcao: { bpm: 104, root: 52, sc: PHR, prog: [0, 1, 5, 4], arp: .75, pad: 'sawtooth', cut: 700 },
    abismo: { bpm: 66, root: 50, sc: PHR, prog: [0, 1, 0, 4], arp: .45, pad: 'sawtooth', cut: 500 },
    chefe: { bpm: 138, root: 50, sc: MIN, prog: [0, 5, 6, 4], arp: 1, pad: 'sawtooth', cut: 900, drums: 1 },
    final: { bpm: 150, root: 49, sc: HAR, prog: [0, 1, 5, 4], arp: 1, pad: 'sawtooth', cut: 1000, drums: 1 },
    vitoria: { bpm: 96, root: 60, sc: MAJ, prog: [0, 4, 5, 3], arp: .9, pad: 'triangle', cut: 2200 },
    titulo: { bpm: 72, root: 57, sc: DOR, prog: [0, 5, 3, 4], arp: .6, pad: 'triangle', cut: 1300 }
  };
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const deg = (th, d) => { const n = th.sc.length, o = Math.floor(d / n); return th.root + th.sc[((d % n) + n) % n] + o * 12; };

  function setTheme(name, force) {
    pending = name;
    if (!ctx) return;
    if (theme && theme.name === name && !force) return;
    const old = bus, now = ctx.currentTime;
    if (old) { old.gain.cancelScheduledValues(now); old.gain.setValueAtTime(old.gain.value, now); old.gain.linearRampToValueAtTime(0, now + 1.5); setTimeout(() => old.disconnect(), 1800); }
    bus = ctx.createGain(); bus.gain.setValueAtTime(0, now); bus.gain.linearRampToValueAtTime(1, now + 2); bus.connect(musG);
    theme = Object.assign({ name }, THEMES[name] || THEMES.vila);
    nextT = now + .1; step = 0;
  }
  function note(f, t, dur, type, vol, cut, at = .01) {
    const o = ctx.createOscillator(), g = ctx.createGain(), fl = ctx.createBiquadFilter();
    o.type = type; o.frequency.value = f; fl.type = 'lowpass'; fl.frequency.value = cut;
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + at); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(fl); fl.connect(g); g.connect(bus); o.start(t); o.stop(t + dur + .05);
  }
  function drum(kind, t) {
    if (kind === 'k') { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(40, t + .15); g.gain.setValueAtTime(.35, t); g.gain.exponentialRampToValueAtTime(.001, t + .2); o.connect(g); g.connect(bus); o.start(t); o.stop(t + .25); }
    else { const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = noiseBuf; f.type = kind === 's' ? 'bandpass' : 'highpass'; f.frequency.value = kind === 's' ? 1800 : 7000; const v = kind === 's' ? .16 : .05, d = kind === 's' ? .15 : .04; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d); s.connect(f); f.connect(g); g.connect(bus); s.start(t, Math.random() * .5); s.stop(t + d + .02); }
  }
  function sched() {
    if (!ctx || !theme || !bus || CFG.music <= 0) { if (ctx) nextT = ctx.currentTime + .1; return; }
    const th = theme, e8 = 60 / th.bpm / 2;
    while (nextT < ctx.currentTime + .25) {
      const bar = Math.floor(step / 8), s8 = step % 8, ch = th.prog[bar % th.prog.length];
      if (s8 === 0) {
        [0, 2, 4].forEach(k => note(mtof(deg(th, ch + k) - 12), nextT, e8 * 8.6, th.pad, .045, th.cut, .5));
        note(mtof(deg(th, ch) - 24), nextT, e8 * 3.5, 'sine', .16, 400, .02);
      }
      if (s8 === 4) note(mtof(deg(th, ch) - 24), nextT, e8 * 3, 'sine', .12, 400, .02);
      if (Math.random() < th.arp) {
        const pat = [0, 2, 4, 7, 4, 2, 4, 9];
        note(mtof(deg(th, ch + pat[s8])), nextT, e8 * 1.8, 'triangle', .045, 3000);
      }
      if (th.drums) {
        if (s8 === 0 || s8 === 4 || (s8 === 6 && Math.random() < .4)) drum('k', nextT);
        if (s8 === 2 || s8 === 6) drum('s', nextT);
        drum('h', nextT);
      }
      nextT += e8; step++;
    }
  }
  return { init, play, setVol, music: setTheme, get on() { return !!ctx; } };
})();
/* ===================== 04 · RENDERIZAÇÃO ===================== */
const ren = new T.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
ren.setPixelRatio(Math.min(window.devicePixelRatio || 1, CFG.hq ? 2 : 1));
ren.setSize(innerWidth, innerHeight);
ren.shadowMap.enabled = !!CFG.shadows;
ren.shadowMap.type = T.PCFSoftShadowMap;
$('#game').appendChild(ren.domElement);

const scene = new T.Scene();
scene.background = new T.Color('#a6d6ff');
scene.fog = new T.Fog('#a6d6ff', 80, 210);
const cam = new T.PerspectiveCamera(45, innerWidth / innerHeight, .3, 700);
cam.position.set(0, 30, 30);

const hemi = new T.HemisphereLight(0xffffff, 0x50604a, .88);
scene.add(hemi);
const sun = new T.DirectionalLight(0xfff0d0, 1);
sun.castShadow = true;
sun.shadow.mapSize.set(CFG.hq ? 2048 : 1024, CFG.hq ? 2048 : 1024);
{ const c = sun.shadow.camera; c.left = c.bottom = -44; c.right = c.top = 44; c.near = 1; c.far = 190; }
sun.shadow.bias = -.0006;
sun.shadow.normalBias = .04;
scene.add(sun, sun.target);

/* ---------- Materiais compartilhados ---------- */
const MAT = {
  v: new T.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: .86, metalness: 0 }),
  glow: new T.MeshBasicMaterial({ vertexColors: true }),
  flash: new T.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: .86, emissive: new T.Color(0xff3030), emissiveIntensity: .8 }),
  elite: new T.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: .7, emissive: new T.Color(0xffb020), emissiveIntensity: .25 }),
  ghost: new T.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: .6, transparent: true, opacity: .75, depthWrite: false }),
  frost: new T.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: .5, emissive: new T.Color(0x3a8aff), emissiveIntensity: .45 }),
  shield: new T.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: .5, emissive: new T.Color(0xffd040), emissiveIntensity: .5 })
};
const _matC = {};
function matC(color, o = {}) {
  const k = color + JSON.stringify(o);
  if (!_matC[k]) _matC[k] = o.basic ? new T.MeshBasicMaterial(Object.assign({ color }, o.p || {})) : new T.MeshStandardMaterial(Object.assign({ color, flatShading: true, roughness: .85 }, o.p || {}));
  return _matC[k];
}

/* ---------- Construtor de modelos low-poly (geometrias mescladas com cor por vértice) ---------- */
const GEO = {
  box: new T.BoxGeometry(1, 1, 1),
  sph: new T.SphereGeometry(1, 10, 8),
  sphL: new T.SphereGeometry(1, 7, 5),
  cone: new T.ConeGeometry(1, 1, 7),
  cone4: new T.ConeGeometry(1, 1, 4),
  cone5: new T.ConeGeometry(1, 1, 5),
  cyl: new T.CylinderGeometry(1, 1, 1, 8),
  cyl6: new T.CylinderGeometry(1, 1, 1, 6),
  ico: new T.IcosahedronGeometry(1, 0),
  oct: new T.OctahedronGeometry(1, 0),
  dod: new T.DodecahedronGeometry(1, 0),
  tor: new T.TorusGeometry(1, .07, 5, 14, Math.PI),
  torF: new T.TorusGeometry(1, .08, 6, 20),
  prism: (() => {
    // prisma triangular (telhados): cumeeira ao longo de X, base de -0.5 a 0.5 em Z, altura 1
    const A = [-.5, 0, -.5], B = [-.5, 0, .5], C = [-.5, 1, 0], D = [.5, 0, -.5], E = [.5, 0, .5], F = [.5, 1, 0];
    const tris = [A, B, C, D, F, E, B, E, F, B, F, C, A, C, F, A, F, D, A, D, E, A, E, B];
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(tris.flat(), 3)); g.computeVertexNormals(); return g;
  })()
};
const _gc = {};
const cylT = (rt, rb, h, seg = 8) => { const k = `c${rt}_${rb}_${h}_${seg}`; return _gc[k] || (_gc[k] = new T.CylinderGeometry(rt, rb, h, seg)); };
const _ni = new Map();
const nonIdx = g => { let n = _ni.get(g); if (!n) { n = g.index ? g.toNonIndexed() : g; _ni.set(g, n); } return n; };
const _m4 = new T.Matrix4(), _m3 = new T.Matrix3(), _q = new T.Quaternion(), _e = new T.Euler(), _v = new T.Vector3(), _v2 = new T.Vector3(), _s = new T.Vector3(), _c = new T.Color();

class MB {
  constructor() { this.p = []; this.F = null; }
  // define um "quadro" local (posição + rotação Y + escala) para as próximas peças
  at(x, y, z, ry, s) {
    if (x === undefined) { this.F = null; return this; }
    this.F = new T.Matrix4().compose(new T.Vector3(x, y, z), new T.Quaternion().setFromEuler(new T.Euler(0, ry || 0, 0)), new T.Vector3(s || 1, s || 1, s || 1));
    return this;
  }
  add(g, c, x, y, z, sx, sy, sz, rx, ry, rz) { this.p.push([g, c, x, y, z, sx, sy, sz, rx || 0, ry || 0, rz || 0, this.F]); return this; }
  box(w, h, d, c, x, y, z, rx, ry, rz) { return this.add(GEO.box, c, x, y, z, w, h, d, rx, ry, rz); }
  sph(r, c, x, y, z, sx = 1, sy = 1, sz = 1, rx, ry, rz) { return this.add(GEO.sph, c, x, y, z, r * sx, r * sy, r * sz, rx, ry, rz); }
  ball(r, c, x, y, z, sx = 1, sy = 1, sz = 1) { return this.add(GEO.sphL, c, x, y, z, r * sx, r * sy, r * sz); }
  cone(r, h, c, x, y, z, rx, ry, rz) { return this.add(GEO.cone, c, x, y, z, r, h, r, rx, ry, rz); }
  cone4(r, h, c, x, y, z, rx, ry, rz) { return this.add(GEO.cone4, c, x, y, z, r, h, r, rx, ry, rz); }
  cyl(r, h, c, x, y, z, rx, ry, rz) { return this.add(GEO.cyl, c, x, y, z, r, h, r, rx, ry, rz); }
  tcyl(rt, rb, h, c, x, y, z, rx, ry, rz, seg) { return this.add(cylT(rt, rb, h, seg || 8), c, x, y, z, 1, 1, 1, rx, ry, rz); }
  geo(g, c, x, y, z, sx = 1, sy = 1, sz = 1, rx, ry, rz) { return this.add(g, c, x, y, z, sx, sy, sz, rx, ry, rz); }
  get empty() { return this.p.length === 0; }
  build() { return mergeParts(this.p); }
}
function mergeParts(parts) {
  let n = 0;
  for (const p of parts) n += nonIdx(p[0]).attributes.position.count;
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), col = new Float32Array(n * 3);
  let o = 0;
  for (const p of parts) {
    const g = nonIdx(p[0]), pa = g.attributes.position.array, na = g.attributes.normal.array, cnt = g.attributes.position.count;
    _e.set(p[8], p[9], p[10]); _q.setFromEuler(_e);
    _m4.compose(_v2.set(p[2], p[3], p[4]), _q, _s.set(p[5], p[6], p[7]));
    if (p[11]) _m4.premultiply(p[11]);
    _m3.getNormalMatrix(_m4); _c.set(p[1]);
    for (let i = 0; i < cnt; i++) {
      const k = (o + i) * 3;
      _v.set(pa[i * 3], pa[i * 3 + 1], pa[i * 3 + 2]).applyMatrix4(_m4);
      pos[k] = _v.x; pos[k + 1] = _v.y; pos[k + 2] = _v.z;
      _v.set(na[i * 3], na[i * 3 + 1], na[i * 3 + 2]).applyMatrix3(_m3).normalize();
      nor[k] = _v.x; nor[k + 1] = _v.y; nor[k + 2] = _v.z;
      col[k] = _c.r; col[k + 1] = _c.g; col[k + 2] = _c.b;
    }
    o += cnt;
  }
  const geo = new T.BufferGeometry();
  geo.setAttribute('position', new T.BufferAttribute(pos, 3));
  geo.setAttribute('normal', new T.BufferAttribute(nor, 3));
  geo.setAttribute('color', new T.BufferAttribute(col, 3));
  geo.computeBoundingSphere();
  return geo;
}
// Instâncias divididas em blocos espaciais (para o recorte por câmera funcionar)
function chunkedInstances(baseGeo, mat, list, opts = {}) {
  const CH = 80, cells = new Map();
  baseGeo.computeBoundingSphere();
  const br = baseGeo.boundingSphere.radius + baseGeo.boundingSphere.center.length();
  for (const it of list) {
    const k = Math.floor(it.x / CH) + ',' + Math.floor(it.z / CH);
    if (!cells.has(k)) cells.set(k, []);
    cells.get(k).push(it);
  }
  const meshes = [];
  for (const arr of cells.values()) {
    const g = new T.BufferGeometry();
    for (const name in baseGeo.attributes) g.setAttribute(name, baseGeo.attributes[name]);
    let cx = 0, cy = 0, cz = 0;
    for (const it of arr) { cx += it.x; cy += it.y || 0; cz += it.z; }
    cx /= arr.length; cy /= arr.length; cz /= arr.length;
    let rad = 0;
    for (const it of arr) rad = Math.max(rad, Math.hypot(it.x - cx, (it.y || 0) - cy, it.z - cz) + br * (it.s || 1) * (it.sy || 1));
    g.boundingSphere = new T.Sphere(new T.Vector3(cx, cy, cz), rad + 1);
    const im = new T.InstancedMesh(g, mat, arr.length);
    arr.forEach((it, i) => {
      _e.set(it.rx || 0, it.ry || 0, it.rz || 0); _q.setFromEuler(_e);
      _m4.compose(_v.set(it.x, it.y || 0, it.z), _q, _s.set(it.s || 1, (it.s || 1) * (it.sy || 1), it.s || 1));
      im.setMatrixAt(i, _m4);
      im.setColorAt(i, it.col !== undefined ? _c.set(it.col) : _c.setRGB(1, 1, 1));
    });
    im.instanceMatrix.needsUpdate = true;
    if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.castShadow = !!opts.shadow; im.receiveShadow = opts.receive !== false;
    scene.add(im); meshes.push(im);
  }
  return meshes;
}

/* ---------- Sistema de partículas (um único draw call por sistema) ---------- */
const PVS = 'attribute float psize; attribute float palpha; attribute vec3 pcol; varying float vA; varying vec3 vC; uniform float uScale;\n' +
  'void main(){ vA = palpha; vC = pcol; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = psize * uScale / max(0.5, -mv.z); gl_Position = projectionMatrix * mv; }';
const PFS = 'varying float vA; varying vec3 vC;\n' +
  'void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d); if (r > 0.5) discard; float a = smoothstep(0.5, 0.0, r); gl_FragColor = vec4(vC, a * vA); }';
class PSys {
  constructor(n, additive) {
    this.n = n; this.i = 0; this.dirty = false;
    this.pos = new Float32Array(n * 3); this.col = new Float32Array(n * 3); this.sz = new Float32Array(n); this.al = new Float32Array(n);
    this.vel = new Float32Array(n * 3); this.life = new Float32Array(n); this.max = new Float32Array(n);
    this.s0 = new Float32Array(n); this.s1 = new Float32Array(n); this.a0 = new Float32Array(n); this.gr = new Float32Array(n); this.dr = new Float32Array(n);
    const g = new T.BufferGeometry();
    this.aPos = new T.BufferAttribute(this.pos, 3).setUsage(T.DynamicDrawUsage);
    this.aCol = new T.BufferAttribute(this.col, 3).setUsage(T.DynamicDrawUsage);
    this.aSz = new T.BufferAttribute(this.sz, 1).setUsage(T.DynamicDrawUsage);
    this.aAl = new T.BufferAttribute(this.al, 1).setUsage(T.DynamicDrawUsage);
    g.setAttribute('position', this.aPos); g.setAttribute('pcol', this.aCol); g.setAttribute('psize', this.aSz); g.setAttribute('palpha', this.aAl);
    this.mat = new T.ShaderMaterial({ uniforms: { uScale: { value: 500 } }, vertexShader: PVS, fragmentShader: PFS, transparent: true, depthWrite: false, blending: additive ? T.AdditiveBlending : T.NormalBlending });
    this.pts = new T.Points(g, this.mat); this.pts.frustumCulled = false; this.pts.renderOrder = additive ? 6 : 5;
    scene.add(this.pts);
  }
  emit(x, y, z, vx, vy, vz, life, s0, s1, color, a0 = 1, gr = 0, dr = 0) {
    const i = this.i; this.i = (i + 1) % this.n; const k = i * 3;
    this.pos[k] = x; this.pos[k + 1] = y; this.pos[k + 2] = z;
    this.vel[k] = vx; this.vel[k + 1] = vy; this.vel[k + 2] = vz;
    _c.set(color); this.col[k] = _c.r; this.col[k + 1] = _c.g; this.col[k + 2] = _c.b;
    this.life[i] = this.max[i] = life; this.s0[i] = s0; this.s1[i] = s1; this.a0[i] = a0; this.gr[i] = gr; this.dr[i] = dr;
    this.sz[i] = s0; this.al[i] = 0; this.dirty = true;
  }
  update(dt) {
    if (!this.dirty) return;
    let any = false;
    const L = this.life, P = this.pos, V = this.vel;
    for (let i = 0; i < this.n; i++) {
      if (L[i] <= 0) continue;
      L[i] -= dt; any = true;
      if (L[i] <= 0) { this.al[i] = 0; this.sz[i] = 0; continue; }
      const k = i * 3, drag = Math.max(0, 1 - this.dr[i] * dt);
      V[k + 1] += this.gr[i] * dt;
      V[k] *= drag; V[k + 1] *= drag; V[k + 2] *= drag;
      P[k] += V[k] * dt; P[k + 1] += V[k + 1] * dt; P[k + 2] += V[k + 2] * dt;
      const t = 1 - L[i] / this.max[i];
      this.sz[i] = this.s0[i] + (this.s1[i] - this.s0[i]) * t;
      this.al[i] = this.a0[i] * (t < .12 ? t / .12 : 1 - (t - .12) / .88);
    }
    this.aPos.needsUpdate = this.aCol.needsUpdate = this.aSz.needsUpdate = this.aAl.needsUpdate = true;
    if (!any) this.dirty = false;
  }
}
const PADD = new PSys(3500, true), PNORM = new PSys(2000, false);
function particleScale() { const s = innerHeight * ren.getPixelRatio() / (2 * Math.tan(cam.fov * Math.PI / 360)); PADD.mat.uniforms.uScale.value = s; PNORM.mat.uniforms.uScale.value = s; }
particleScale();

const FX = {
  burst(x, y, z, col, n = 14, spd = 5, life = .6, size = .5, gr = -5, add = true) {
    const ps = add ? PADD : PNORM;
    for (let i = 0; i < n; i++) {
      const a = R() * TAU, u = R() * 2 - 1, s = spd * (.35 + R() * .65), r = Math.sqrt(1 - u * u);
      ps.emit(x, y, z, Math.cos(a) * r * s, u * s * .7 + spd * .35, Math.sin(a) * r * s, life * (.6 + R() * .6), size, size * .15, col, 1, gr, 1.2);
    }
  },
  ring(x, y, z, col, rad, n = 28, life = .5, size = .5, spd = 4) {
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU + R() * .2;
      PADD.emit(x + Math.sin(a) * rad * .2, y, z + Math.cos(a) * rad * .2, Math.sin(a) * spd * rad / 3, .5 + R(), Math.cos(a) * spd * rad / 3, life, size, size * .3, col, 1, 0, 2);
    }
  },
  disk(x, y, z, col, rad, n = 30, life = .7, size = .6) {
    for (let i = 0; i < n; i++) { const a = R() * TAU, d = Math.sqrt(R()) * rad; PADD.emit(x + Math.sin(a) * d, y + R() * .4, z + Math.cos(a) * d, 0, 1.5 + R() * 3, 0, life * (.6 + R() * .6), size, 0, col, 1, -2, .5); }
  },
  rise(x, y, z, col, n = 10, spread = .6, spd = 2, life = .9, size = .35) {
    for (let i = 0; i < n; i++) PADD.emit(x + rn(-spread, spread), y + rn(0, .5), z + rn(-spread, spread), rn(-.3, .3), spd * (.5 + R()), rn(-.3, .3), life * (.6 + R() * .6), size, size * .2, col, 1, 0, .4);
  },
  trail(x, y, z, col, size = .4, life = .3) { PADD.emit(x + rn(-.05, .05), y + rn(-.05, .05), z + rn(-.05, .05), 0, .25, 0, life, size, 0, col, .9); },
  smoke(x, y, z, col = '#555555', n = 3, size = 1.4, life = 1.6, spd = 1.5) {
    for (let i = 0; i < n; i++) PNORM.emit(x + rn(-.4, .4), y, z + rn(-.4, .4), rn(-.3, .3), spd * (.6 + R() * .6), rn(-.3, .3), life, size * .6, size * 1.6, col, .5, 0, .3);
  },
  beam(x, y, z, col, h = 6, n = 40) {
    for (let i = 0; i < n; i++) { const a = R() * TAU, r = rn(.2, 1); PADD.emit(x + Math.sin(a) * r, y + R() * h * .3, z + Math.cos(a) * r, 0, rn(3, 9), 0, rn(.6, 1.2), rn(.3, .6), 0, col, 1, 0, .3); }
  }
};

/* ---------- Marcações de ataque no chão (telegrafia dos chefes) ---------- */
const TVS = 'attribute float rad; varying float vR; void main(){ vR = rad; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';
const TFS = 'uniform float prog; uniform vec3 col; uniform float op; varying float vR;\n' +
  'void main(){ float edge = smoothstep(0.88, 1.0, vR); float fill = 1.0 - smoothstep(prog - 0.03, prog, vR); float a = 0.14 + edge * 0.6 + fill * 0.32; gl_FragColor = vec4(col, a * op); }';
const TELES = [];
function groundY(x, z) { return x > 600 ? 0 : H(x, z); }
function teleGeo(o) {
  const P = [], RD = [], I = [];
  if (o.shape === 'rect') {
    const sl = 14, sw = 2, sa = Math.sin(o.ang), ca = Math.cos(o.ang);
    for (let j = 0; j <= sl; j++) for (let i = 0; i <= sw; i++) {
      const al = o.len * j / sl, sd = (i / sw - .5) * o.w, x = o.x + sa * al + ca * sd, z = o.z + ca * al - sa * sd;
      P.push(x, groundY(x, z) + .14, z); RD.push(j / sl);
    }
    for (let j = 0; j < sl; j++) for (let i = 0; i < sw; i++) { const a = j * (sw + 1) + i, b = a + 1, c = a + sw + 1, d = c + 1; I.push(a, c, b, b, c, d); }
  } else {
    const r0 = o.shape === 'ring' ? o.r0 : 0, cone = o.shape === 'cone';
    const a0 = cone ? o.ang - o.arc / 2 : 0, arc = cone ? o.arc : TAU, sa = cone ? 18 : 44, sr = 7;
    for (let j = 0; j <= sr; j++) {
      const rr = lerp(r0, o.r, j / sr);
      for (let i = 0; i <= sa; i++) {
        const a = a0 + arc * i / sa, x = o.x + Math.sin(a) * rr, z = o.z + Math.cos(a) * rr;
        P.push(x, groundY(x, z) + .14, z); RD.push(o.shape === 'ring' ? (rr - r0) / (o.r - r0) : rr / o.r);
      }
    }
    for (let j = 0; j < sr; j++) for (let i = 0; i < sa; i++) { const a = j * (sa + 1) + i, b = a + 1, c = a + sa + 1, d = c + 1; I.push(a, c, b, b, c, d); }
  }
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(P, 3));
  g.setAttribute('rad', new T.Float32BufferAttribute(RD, 1));
  g.setIndex(I);
  return g;
}
function tele(o) {
  const m = new T.ShaderMaterial({
    uniforms: { prog: { value: 0 }, col: { value: new T.Color(o.col || '#ff2a2a') }, op: { value: 1 } },
    vertexShader: TVS, fragmentShader: TFS, transparent: true, depthWrite: false, side: T.DoubleSide,
    polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4
  });
  const mesh = new T.Mesh(teleGeo(o), m); mesh.renderOrder = 3; mesh.frustumCulled = false; scene.add(mesh);
  const t = { o, mesh, t: 0 }; TELES.push(t); return t;
}
function inShape(o, x, z, pad = .45) {
  const dx = x - o.x, dz = z - o.z, d = Math.hypot(dx, dz);
  if (o.shape === 'circle') return d <= o.r + pad;
  if (o.shape === 'ring') return d >= o.r0 - pad && d <= o.r + pad;
  if (o.shape === 'cone') return d <= o.r + pad && (d < 1 || Math.abs(angDiff(o.ang, Math.atan2(dx, dz))) <= o.arc / 2 + .06);
  if (o.shape === 'rect') { const al = dx * Math.sin(o.ang) + dz * Math.cos(o.ang), sd = dx * Math.cos(o.ang) - dz * Math.sin(o.ang); return al >= -pad && al <= o.len + pad && Math.abs(sd) <= o.w / 2 + pad; }
  return false;
}
function updateTeles(dt) {
  for (let i = TELES.length - 1; i >= 0; i--) {
    const t = TELES[i]; t.t += dt;
    const p = Math.min(1, t.t / t.o.dur);
    t.mesh.material.uniforms.prog.value = p;
    t.mesh.material.uniforms.op.value = .75 + Math.sin(t.t * 18) * .25 * p;
    if (p >= 1 || t.cancel) {
      if (!t.cancel && t.o.done) t.o.done(t.o);
      scene.remove(t.mesh); t.mesh.geometry.dispose(); t.mesh.material.dispose(); TELES.splice(i, 1);
    }
  }
}
function clearTeles(owner) { for (const t of TELES) if (!owner || t.o.owner === owner) t.cancel = true; }

/* ---------- Textos 3D (nomes) e barras de vida ---------- */
const _lbl = {};
function labelTex(text, color, size, bold = 700) {
  const k = text + '|' + color + '|' + size;
  if (_lbl[k]) return _lbl[k];
  const c = document.createElement('canvas'), x = c.getContext('2d'), f = `${bold} ${size}px "Segoe UI", system-ui, sans-serif`;
  x.font = f; const w = Math.ceil(x.measureText(text).width) + 14;
  c.width = w; c.height = size + 14;
  x.font = f; x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineJoin = 'round';
  x.lineWidth = Math.max(3, size / 6); x.strokeStyle = 'rgba(0,0,0,.85)'; x.strokeText(text, w / 2, c.height / 2);
  x.fillStyle = color; x.fillText(text, w / 2, c.height / 2);
  const tex = new T.CanvasTexture(c); tex.minFilter = T.LinearFilter; tex.generateMipmaps = false;
  return (_lbl[k] = { tex, w, h: c.height });
}
function makeLabel(text, color = '#ffffff', size = 30, scale = .5) {
  const { tex, w, h } = labelTex(text, color, size);
  const s = new T.Sprite(new T.SpriteMaterial({ map: tex, depthTest: false, depthWrite: false, transparent: true, fog: false }));
  s.scale.set(scale * w / h, scale, 1); s.center.set(.5, 0); s.renderOrder = 30;
  return s;
}
const BAR_GEO = new T.PlaneGeometry(1, .14);
const BAR_M = {
  bg: new T.MeshBasicMaterial({ color: 0x0a0a0a, depthTest: false, transparent: true, opacity: .8, fog: false }),
  red: new T.MeshBasicMaterial({ color: 0xe63946, depthTest: false, fog: false }),
  gold: new T.MeshBasicMaterial({ color: 0xffb020, depthTest: false, fog: false }),
  purple: new T.MeshBasicMaterial({ color: 0xb36bff, depthTest: false, fog: false })
};
function makeBar(w, m = 'red') {
  const g = new T.Group(), bg = new T.Mesh(BAR_GEO, BAR_M.bg), fg = new T.Mesh(BAR_GEO, BAR_M[m]);
  bg.scale.set(w + .08, 1.5, 1); fg.scale.x = w; fg.position.z = .002;
  bg.renderOrder = 31; fg.renderOrder = 32; g.add(bg, fg); g.fg = fg; g.w = w;
  return g;
}
function setBar(b, f) { f = clamp(f, 0, 1); b.fg.scale.x = Math.max(.001, b.w * f); b.fg.position.x = -b.w * (1 - f) / 2; }

/* ---------- Câmera em terceira pessoa ---------- */
const CAM = { yaw: 0, pitch: .93, dist: 26, tdist: 26, shake: 0, tx: 0, ty: 0, tz: 0, ready: false };
function shake(a) { if (CFG.shake) CAM.shake = Math.min(1.4, Math.max(CAM.shake, a)); }
function updateCamera(dt, tx, ty, tz) {
  CAM.dist = lerp(CAM.dist, CAM.tdist, Math.min(1, dt * 8));
  const pitch = CAM.pitch - (1 - (CAM.dist - 13) / 30) * .12;
  const cx = tx + Math.sin(CAM.yaw) * Math.cos(pitch) * CAM.dist, cy = ty + Math.sin(pitch) * CAM.dist, cz = tz + Math.cos(CAM.yaw) * Math.cos(pitch) * CAM.dist;
  if (!CAM.ready) { cam.position.set(cx, cy, cz); CAM.tx = tx; CAM.ty = ty; CAM.tz = tz; CAM.ready = true; }
  const k = Math.min(1, dt * 9);
  CAM.tx = lerp(CAM.tx, tx, k); CAM.ty = lerp(CAM.ty, ty, k); CAM.tz = lerp(CAM.tz, tz, k);
  cam.position.set(CAM.tx + (cx - tx), CAM.ty + (cy - ty), CAM.tz + (cz - tz));
  const gy = groundY(cam.position.x, cam.position.z) + 2;
  if (cam.position.y < gy) cam.position.y = gy;
  cam.lookAt(CAM.tx, CAM.ty, CAM.tz);
  if (CAM.shake > 0) {
    const s = CAM.shake * .35; cam.position.x += rn(-s, s); cam.position.y += rn(-s, s); cam.position.z += rn(-s, s);
    CAM.shake = Math.max(0, CAM.shake - dt * 2.6);
  }
}
addEventListener('resize', () => {
  ren.setSize(innerWidth, innerHeight); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); particleScale();
});
/* ===================== 05 · MODELOS (low-poly procedural) ===================== */
// Uma definição de modelo: corpo (iluminado), brilho (sem luz: olhos, cristais), membros animados.
function limbDef(x, y, z, ph, amp, kind, o = {}) { return Object.assign({ mb: new MB(), gl: new MB(), x, y, z, ph, amp, kind }, o); }
function finalizeDef(d) {
  d.bodyGeo = d.body && !d.body.empty ? d.body.build() : null;
  d.glowGeo = d.glow && !d.glow.empty ? d.glow.build() : null;
  for (const l of d.limbs) { l.geo = l.mb.empty ? null : l.mb.build(); l.glowGeo = l.gl.empty ? null : l.gl.build(); }
  return d;
}
function instModel(D, mat) {
  mat = mat || (D.ghost ? MAT.ghost : MAT.v);
  const g = new T.Group(), inner = new T.Group(); g.add(inner);
  const meshes = [];
  const mk = (geo, m, parent, shadow) => { const me = new T.Mesh(geo, m); me.castShadow = shadow && !D.ghost; parent.add(me); return me; };
  if (D.bodyGeo) meshes.push(mk(D.bodyGeo, mat, inner, true));
  if (D.glowGeo) mk(D.glowGeo, MAT.glow, inner, false);
  const limbs = D.limbs.map(l => {
    const p = new T.Group(); p.position.set(l.x, l.y, l.z); p.rotation.x = l.rx || 0; p.rotation.z = l.rz || 0; inner.add(p);
    if (l.geo) meshes.push(mk(l.geo, mat, p, false));
    if (l.glowGeo) mk(l.glowGeo, MAT.glow, p, false);
    return { p, ph: l.ph || 0, amp: l.amp == null ? .6 : l.amp, kind: l.kind || 'leg', rx: l.rx || 0, rz: l.rz || 0, side: l.side || 1 };
  });
  return { g, inner, meshes, limbs, h: D.h, r: D.r, D, baseMat: mat };
}
function setModelMat(o, m) { for (const me of o.meshes) me.material = m; }

/* ---------- Humanoide genérico (jogador, NPCs e vários monstros) ---------- */
function human(o) {
  const b = new MB(), gl = new MB();
  const skin = o.skin || '#f1c9a0', shirt = o.shirt || '#888888', pants = o.pants || '#3a3a50', boots = o.boots || '#4a3020';
  const armL = limbDef(-.5, 1.68, 0, 1, .55, 'arm', { rx: o.armsFwd || 0 }), armR = limbDef(.5, 1.68, 0, 0, .55, 'arm', { rx: o.armsFwd || 0 });
  const legL = limbDef(-.19, .9, 0, 0, .6, 'leg'), legR = limbDef(.19, .9, 0, 1, .6, 'leg');
  // pernas
  for (const l of [legL, legR]) { l.mb.box(.27, .86, .3, pants, 0, -.43, 0); l.mb.box(.3, .22, .36, boots, 0, -.78, .03); if (o.wrap) [-.25, -.55].forEach(y => l.mb.box(.29, .06, .32, o.wrap, 0, y, 0)); }
  // braços
  for (const a of [armL, armR]) {
    a.mb.box(.23, .46, .25, o.sleeve || shirt, 0, -.2, 0); a.mb.box(.2, .38, .22, o.forearm || skin, 0, -.6, 0); a.mb.box(.21, .16, .23, o.hand || skin, 0, -.82, 0);
    if (o.wrap) [-.3, -.6].forEach(y => a.mb.box(.24, .06, .26, o.wrap, 0, y, 0));
    if (o.pads) a.mb.box(.34, .2, .38, o.pads, 0, .06, 0);
    if (o.claws) [-.06, .06].forEach(x => a.gl.cone(.035, .16, o.claws, x, -.98, .06, Math.PI));
  }
  // tronco
  b.box(.74, .84, .44, shirt, 0, 1.32, 0);
  b.box(.78, .12, .48, o.belt || '#3a2a1a', 0, .95, 0);
  if (o.buckle) b.box(.14, .1, .04, o.buckle, 0, .95, .25);
  if (o.trim) { b.box(.76, .08, .46, o.trim, 0, 1.72, 0); b.box(.08, .8, .46, o.trim, 0, 1.32, .005); }
  if (o.belly) b.sph(.34, shirt, 0, 1.18, .18, 1, 1, .8);
  if (o.apron) b.box(.62, .78, .04, o.apron, 0, 1.12, .24);
  if (o.robe) { b.tcyl(.37, .58, .95, o.robe, 0, .52, 0); if (o.robeTrim) b.tcyl(.59, .6, .08, o.robeTrim, 0, .07, 0); }
  if (o.dress) { b.tcyl(.38, .8, 1.25, o.dress, 0, .62, 0); b.tcyl(.81, .82, .08, o.dressTrim || o.dress, 0, .04, 0); }
  if (o.cape) b.box(.72, 1.32, .06, o.cape, 0, 1.2, -.27, .1);
  if (o.wrap) [1.05, 1.25, 1.45, 1.65].forEach(y => b.box(.76, .06, .46, o.wrap, 0, y, 0));
  if (o.collar) b.tcyl(.3, .4, .14, o.collar, 0, 1.78, 0);
  if (o.wings) [-1, 1].forEach(s => { b.box(.06, .9, 1.0, o.wings, s * .45, 1.75, -.55, 0, s * .7, s * .35); b.box(.05, .1, 1.1, o.wings2 || '#1a0a0a', s * .45, 2.18, -.52, 0, s * .7, s * .35); });
  if (o.tail) { b.box(.1, .1, .55, o.tail, 0, .98, -.4, .7, 0, 0); b.box(.08, .08, .5, o.tail, 0, .72, -.78, 1.2, 0, 0); b.cone4(.1, .2, o.tail, 0, .5, -1, 2.2); }
  if (o.quiver) { b.tcyl(.11, .13, .72, '#6b4226', .18, 1.4, -.3, 0, 0, .35); [-.04, .04, 0].forEach((dx, i) => b.cone4(.05, .16, '#f2f2f2', .3 + dx, 1.82 + i * .03, -.3, 0, 0, .35)); }
  // cabeça
  b.box(.6, .58, .56, skin, 0, 2.06, 0);
  if (o.eyesGlow) [-1, 1].forEach(s => gl.box(.12, .09, .03, o.eyesGlow, s * .14, 2.1, .29));
  else [-1, 1].forEach(s => { b.box(.12, .13, .03, '#ffffff', s * .14, 2.09, .285); b.box(.06, .08, .02, o.eyes || '#2a1a10', s * .13, 2.08, .3); });
  if (!o.noMouth) b.box(.16, .04, .02, o.mouth || '#7a3a2a', 0, 1.9, .285);
  if (o.ears === 'goblin') { b.cone4(.09, .42, skin, -.42, 2.12, 0, 0, 0, Math.PI / 2); b.cone4(.09, .42, skin, .42, 2.12, 0, 0, 0, -Math.PI / 2); }
  if (o.nose) b.cone4(.07, .26, skin, 0, 2.0, .38, Math.PI / 2);
  if (o.beard) { b.box(.5, .42, .14, o.beard, 0, 1.86, .28); b.box(.3, .22, .12, o.beard, 0, 1.6, .27); }
  if (o.mustache) b.box(.36, .07, .06, o.mustache, 0, 1.96, .3);
  if (o.wrap) [1.95, 2.2].forEach(y => b.box(.62, .06, .58, o.wrap, 0, y, 0));
  const hair = o.hair || '#5a3a1a';
  if (o.hs && o.hs !== 'none') {
    if (o.hs !== 'bald') { b.box(.64, .16, .6, hair, 0, 2.4, -.01); b.box(.64, .44, .12, hair, 0, 2.16, -.27); b.box(.08, .26, .5, hair, -.31, 2.24, -.02); b.box(.08, .26, .5, hair, .31, 2.24, -.02); b.box(.56, .1, .08, hair, 0, 2.33, .27); }
    else { b.box(.08, .22, .4, hair, -.31, 2.06, -.06); b.box(.08, .22, .4, hair, .31, 2.06, -.06); b.box(.64, .22, .1, hair, 0, 2.06, -.27); }
    if (o.hs === 'spiky') [[-.18, .02], [0, -.05], [.18, .02], [-.09, -.18], [.09, -.18]].forEach(([x, z]) => b.cone4(.1, .3, hair, x, 2.58, z));
    if (o.hs === 'long') { b.box(.64, .82, .14, hair, 0, 1.86, -.28); b.box(.1, .62, .16, hair, -.31, 1.96, .06); b.box(.1, .62, .16, hair, .31, 1.96, .06); }
    if (o.hs === 'braids') [-1, 1].forEach(s => { b.box(.14, .62, .14, hair, s * .26, 1.78, -.24); b.ball(.1, o.ribbon || '#ffd23f', s * .26, 1.45, -.24); });
    if (o.hs === 'bun') b.ball(.18, hair, 0, 2.35, -.33);
  }
  if (o.hat) { b.cyl(.5, .05, o.hat, 0, 2.37, 0); b.tcyl(.28, .32, .32, o.hat, 0, 2.54, 0); b.tcyl(.33, .33, .07, '#3a2010', 0, 2.42, 0); }
  if (o.wizhat) { b.cyl(.56, .05, o.wizhat, 0, 2.36, 0); b.cone(.38, .82, o.wizhat, 0, 2.78, -.04, -.12); gl.ball(.06, '#ffe680', 0, 3.15, -.12); }
  if (o.plume) { b.box(.68, .3, .64, '#b8c2cc', 0, 2.37, 0); b.box(.08, .26, .52, o.plume, 0, 2.62, -.06); b.box(.1, .3, .1, '#b8c2cc', -.31, 2.12, .2); b.box(.1, .3, .1, '#b8c2cc', .31, 2.12, .2); }
  if (o.horns) [-1, 1].forEach(s => { b.cone(.09, .42, o.horns, s * .22, 2.5, .02, 0, 0, -s * .45); b.cone(.06, .22, o.horns, s * .38, 2.72, .02, 0, 0, -s * 1.1); });
  if (o.nemes) {
    b.box(.7, .16, .64, o.nemes[0], 0, 2.4, 0); b.box(.72, .8, .2, o.nemes[1], 0, 1.95, -.24);
    [-1, 1].forEach(s => { b.box(.14, .66, .22, o.nemes[1], s * .35, 1.92, .1); [0, 1, 2].forEach(i => b.box(.15, .05, .23, o.nemes[0], s * .35, 1.7 + i * .2, .1)); });
    [0, 1, 2, 3].forEach(i => b.box(.73, .05, .21, o.nemes[0], 0, 1.7 + i * .17, -.24));
    b.box(.08, .14, .06, o.nemes[0], 0, 2.42, .33); b.box(.12, .3, .1, o.nemes[0], 0, 1.66, .29);
  }
  if (o.crownIce) { b.cyl(.34, .08, '#dff4ff', 0, 2.37, 0); [-.24, -.12, 0, .12, .24].forEach((x, i) => gl.cone4(.06, i === 2 ? .45 : .3, '#bfefff', x, 2.55 + (i === 2 ? .08 : 0), .18)); }
  if (o.knightHelm) { b.box(.68, .66, .64, o.knightHelm, 0, 2.08, 0); gl.box(.46, .06, .03, o.eyesGlow2 || '#d080ff', 0, 2.1, .33); b.cone4(.08, .3, o.knightHelm, -.3, 2.5, 0, 0, 0, .5); b.cone4(.08, .3, o.knightHelm, .3, 2.5, 0, 0, 0, -.5); }
  if (o.helm != null) helmetParts(b, gl, o.helm);
  // itens nas mãos
  const H = armR.mb, HG = armR.gl;
  if (o.hold === 'staff') { H.cyl(.05, 2.1, '#6b4a2b', 0, -.75, .05); HG.ball(.14, '#9fe0ff', 0, .35, .05); }
  if (o.hold === 'hammer') { H.cyl(.045, .9, '#5a3a1a', 0, -.85, .1, Math.PI / 2); H.box(.24, .24, .36, '#6a6a72', 0, -.85, .52); }
  if (o.hold === 'spear') { H.cyl(.04, 2.6, '#6b4a2b', 0, -.4, .05); H.cone4(.08, .38, '#cfd6dd', 0, .98, .05); }
  if (o.hold === 'club') { H.tcyl(.12, .06, .8, '#7a5230', 0, -.8, .35, Math.PI / 2.2); H.ball(.08, '#9a9a9a', 0, -.75, .7); }
  if (o.hold === 'scepter') { H.cyl(.05, 2.0, '#c9a040', 0, -.6, .05); HG.box(.1, .26, .06, '#ffd23f', 0, .5, .05); HG.torus = 1; H.geo(GEO.torF, '#ffd23f', 0, .74, .05, .14, .16, .5); }
  if (o.hold === 'icestaff') { H.cyl(.05, 2.2, '#dff4ff', 0, -.6, .05); HG.geo(GEO.oct, '#bfefff', 0, .62, .05, .2, .32, .2); }
  if (o.hold === 'voidsword') { H.box(.05, .26, .07, '#2a1a3a', 0, -.85, .1, Math.PI / 2); H.box(.36, .07, .1, '#4a3a6a', 0, -.85, .22, Math.PI / 2); HG.box(.12, 1.3, .04, o.blade || '#b080ff', 0, -.85, .95, Math.PI / 2); }
  if (o.shield) { armL.mb.box(.1, .78, .62, o.shield, -.15, -.5, .05); armL.gl.box(.03, .2, .2, o.shieldGem || '#d080ff', -.21, -.5, .05); }
  return { body: b, glow: gl, limbs: [armL, armR, legL, legR], h: 2.5, r: .55, hand: 1 };
}
function helmetParts(b, gl, t) {
  const c = ACOL[t], tc = TCOL[t];
  if (t === 0) { b.box(.68, .18, .64, c, 0, 2.38, -.01); b.box(.1, .56, .58, c, -.34, 2.12, -.02); b.box(.1, .56, .58, c, .34, 2.12, -.02); b.box(.68, .56, .1, c, 0, 2.12, -.32); }
  else if (t === 1) { b.box(.66, .18, .62, '#7a5230', 0, 2.41, 0); b.box(.68, .1, .64, '#5a3a20', 0, 2.29, 0); }
  else if (t === 2) { for (let i = 0; i < 9; i++) { const a = i / 9 * TAU; b.ball(.1, i % 2 ? '#3f9a3a' : '#5fd068', Math.sin(a) * .33, 2.36, Math.cos(a) * .31); } gl.ball(.05, '#ffe680', 0, 2.4, .33); }
  else if (t === 3) { b.sph(.38, '#c9a040', 0, 2.36, 0, 1, .55, 1); b.box(.66, .5, .1, '#f2ead8', 0, 2.1, -.31); gl.box(.08, .08, .04, '#ff3030', 0, 2.38, .34); }
  else if (t === 4) { b.box(.7, .32, .66, '#bfe3f5', 0, 2.37, 0); b.box(.1, .3, .1, '#bfe3f5', -.31, 2.12, .2); b.box(.1, .3, .1, '#bfe3f5', .31, 2.12, .2); [-1, 1].forEach(s => gl.cone4(.07, .4, '#e0faff', s * .3, 2.68, 0, 0, 0, -s * .3)); }
  else if (t === 5) { b.box(.7, .34, .66, '#4a0a12', 0, 2.37, 0); [-1, 1].forEach(s => { b.cone(.09, .5, '#1a1010', s * .3, 2.68, .02, 0, 0, -s * .55); }); gl.box(.4, .04, .03, '#ff7a1a', 0, 2.28, .34); }
  else { b.box(.68, .06, .62, '#ffe8a8', 0, 2.32, 0); gl.geo(GEO.oct, '#e2c8ff', 0, 2.45, .3, .1, .16, .06); gl.ball(.05, '#9fe0ff', -.2, 2.36, .3); gl.ball(.05, '#9fe0ff', .2, 2.36, .3); }
}

/* ---------- Armas do jogador ---------- */
function weaponGroup(cls, tier, rar, up) {
  const b = new MB(), gl = new MB(), tc = TCOL[tier], shiny = rar >= 3 || up >= 7, bl = shiny ? gl : b;
  const grp = new T.Group();
  if (cls === 'w') {
    const L = .9 + tier * .09;
    b.box(.07, .32, .08, '#4a3020', 0, 0, 0);
    b.box(.46, .09, .13, tier >= 3 ? '#c9a040' : '#6a6a6a', 0, .2, 0);
    b.ball(.07, tier >= 3 ? '#c9a040' : '#555555', 0, -.18, 0);
    bl.box(.14, L, .05, tc, 0, .25 + L / 2, 0);
    bl.cone4(.075, .22, tc, 0, .36 + L, 0, 0, Math.PI / 4, 0);
    if (tier >= 5) gl.box(.04, L * .8, .06, tier === 5 ? '#ffd040' : '#ffffff', 0, .25 + L / 2, 0);
  } else if (cls === 'a') {
    const s = .75 + tier * .03;
    b.geo(GEO.tor, tc, -s, 0, 0, s, s, s, 0, 0, -Math.PI / 2);
    b.box(.06, .26, .08, '#4a3020', 0, 0, 0);
    (shiny ? gl : b).box(.012, s * 2, .012, '#f2f2f2', -s, 0, 0);
    if (shiny || tier >= 5) [[-.55, .55], [-.55, -.55]].forEach(([x, y]) => gl.ball(.06, tc, x * s / .75 * .9 - .1, y * s / .75 * .9, 0));
  } else {
    const L = 1.7 + tier * .05;
    b.tcyl(.04, .055, L, tier >= 3 ? '#4a3a6a' : '#6b4a2b', 0, .1, 0);
    b.box(.14, .08, .14, '#c9a040', 0, .1 + L / 2 - .05, 0);
    [-1, 1].forEach(s => b.cone4(.04, .26, '#c9a040', s * .1, .2 + L / 2, 0, 0, 0, -s * .5));
    gl.geo(tier >= 4 ? GEO.oct : GEO.sph, tc, 0, .3 + L / 2, 0, .17, tier >= 4 ? .26 : .17, .17);
  }
  if (!b.empty) { const m = new T.Mesh(b.build(), MAT.v); m.castShadow = true; grp.add(m); }
  if (!gl.empty) grp.add(new T.Mesh(gl.build(), MAT.glow));
  const holder = new T.Group(); holder.add(grp);
  if (cls === 'w') { holder.position.set(0, -.82, .06); grp.rotation.x = Math.PI / 2; }
  else if (cls === 'a') { holder.position.set(0, -.82, .04); grp.rotation.x = Math.PI / 2; grp.rotation.y = Math.PI / 2; }
  else { holder.position.set(0, -.82, .06); }
  holder.userData.shiny = shiny; holder.userData.tc = tc;
  return holder;
}

/* ---------- Monstros ---------- */
const MODELS = {
  blob(sp) {
    const b = new MB(), gl = new MB(), c = sp.c, d = sp.d;
    b.sph(.72, c, 0, .62, 0, 1, .82, 1); b.sph(.55, c, 0, .38, 0, 1.45, .5, 1.45);
    [[.32, 1.02, .22, .12], [-.36, .95, -.1, .1], [0, 1.08, -.3, .14], [.12, .72, .66, .08], [-.5, .6, .3, .09]].forEach(([x, y, z, r]) => b.ball(r, d, x, y, z));
    [-1, 1].forEach(s => { b.ball(.14, '#ffffff', s * .24, .82, .58); b.ball(.07, '#151515', s * .24, .82, .7); });
    b.box(.26, .06, .05, '#151515', 0, .58, .7);
    if (sp.crown) { b.tcyl(.34, .34, .2, '#ffd23f', 0, 1.28, 0); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; b.cone4(.08, .26, '#ffd23f', Math.sin(a) * .3, 1.48, Math.cos(a) * .3); } gl.ball(.07, '#ff3060', 0, 1.3, .34); gl.ball(.06, '#30a0ff', .3, 1.3, .15); gl.ball(.06, '#30ff90', -.3, 1.3, .15); }
    return { body: b, glow: gl, limbs: [], h: 1.45, r: .82, anim: 'bounce' };
  },
  wolf(sp) {
    const b = new MB(), gl = new MB(), c = sp.c, d = sp.d;
    b.box(.62, .55, 1.25, c, 0, .92, 0); b.box(.68, .62, .42, d, 0, .92, .48);
    b.box(.5, .48, .52, c, 0, 1.24, .82); b.box(.28, .24, .38, d, 0, 1.12, 1.2); b.box(.12, .1, .08, '#151515', 0, 1.22, 1.4);
    b.box(.22, .06, .3, '#ffffff', 0, 1.0, 1.18);
    [-1, 1].forEach(s => { b.cone4(.12, .32, c, s * .16, 1.58, .74); gl.box(.1, .07, .04, sp.a || '#ffd23f', s * .14, 1.32, 1.08); });
    const tail = limbDef(0, 1.08, -.6, 0, .35, 'tail', { rx: -.7 }); tail.mb.box(.16, .16, .62, d, 0, 0, -.3);
    const legs = [[-.2, .42], [.2, .42], [-.2, -.42], [.2, -.42]].map(([x, z], i) => { const l = limbDef(x, .72, z, i === 0 || i === 3 ? 0 : 1, .7, 'leg'); l.mb.box(.17, .66, .2, c, 0, -.33, 0); l.mb.box(.2, .1, .26, d, 0, -.67, .03); return l; });
    return { body: b, glow: gl, limbs: [...legs, tail], h: 1.6, r: .85 };
  },
  boar(sp) {
    const b = new MB(), gl = new MB(), c = sp.c, d = sp.d;
    b.box(.82, .72, 1.3, c, 0, .86, 0); b.box(.2, .2, 1.14, d, 0, 1.28, -.05);
    b.box(.6, .56, .52, c, 0, .92, .82); b.tcyl(.18, .21, .3, '#e8b0a0', 0, .82, 1.15, Math.PI / 2);
    [-1, 1].forEach(s => { b.ball(.04, '#3a1a1a', s * .07, .84, 1.31); b.cone(.06, .36, '#fff6e0', s * .22, .74, 1.1, -1.1); b.cone4(.1, .22, d, s * .2, 1.25, .72); gl.box(.09, .07, .04, sp.a, s * .16, 1.04, 1.085); });
    const legs = [[-.26, .4], [.26, .4], [-.26, -.42], [.26, -.42]].map(([x, z], i) => { const l = limbDef(x, .56, z, i === 0 || i === 3 ? 0 : 1, .7); l.mb.box(.2, .52, .22, c, 0, -.26, 0); l.mb.box(.22, .1, .24, '#2a1a10', 0, -.52, 0); return l; });
    const tail = limbDef(0, 1.05, -.66, 0, .5, 'tail', { rx: -.4 }); tail.mb.box(.06, .06, .3, d, 0, 0, -.15);
    return { body: b, glow: gl, limbs: [...legs, tail], h: 1.45, r: .95 };
  },
  shroom(sp) {
    const b = new MB(), gl = new MB();
    b.tcyl(.3, .4, .92, sp.d, 0, .56, 0); b.sph(.78, sp.c, 0, 1.16, 0, 1, .55, 1);
    [[.38, 1.36, .3], [-.4, 1.3, .2], [0, 1.52, -.1], [.15, 1.3, -.5], [-.3, 1.26, -.42], [.52, 1.2, -.15]].forEach(([x, y, z]) => b.ball(.11, '#ffffff', x, y, z));
    [-1, 1].forEach(s => { b.ball(.09, '#ffffff', s * .13, .78, .31); b.ball(.05, '#151515', s * .13, .78, .38); });
    b.box(.14, .05, .04, '#3a1a1a', 0, .62, .37);
    const arms = [-1, 1].map((s, i) => { const l = limbDef(s * .36, .72, 0, i, .5, 'arm', { rz: s * .4 }); l.mb.box(.1, .34, .1, sp.d, 0, -.17, 0); return l; });
    const feet = [-1, 1].map((s, i) => { const l = limbDef(s * .17, .16, 0, i, .5); l.mb.box(.18, .16, .26, sp.d, 0, -.07, .04); return l; });
    return { body: b, glow: gl, limbs: [...arms, ...feet], h: 1.65, r: .78, anim: 'bounce' };
  },
  goblin(sp) { const d = human({ skin: sp.sk, shirt: sp.c, pants: sp.d, boots: '#2a1a10', eyesGlow: sp.a, ears: 'goblin', nose: 1, hs: 'none', hold: 'club', mouth: '#2a1010', belt: '#2a1a10' }); d.k = .86; return d; },
  bat(sp) {
    const b = new MB(), gl = new MB();
    b.sph(.32, sp.c, 0, 0, 0, 1, 1.1, 1); b.ball(.23, sp.c, 0, .26, .18);
    [-1, 1].forEach(s => { b.cone4(.07, .22, sp.c, s * .11, .5, .14); gl.box(.07, .06, .03, sp.a, s * .08, .3, .4); b.cone4(.025, .08, '#ffffff', s * .04, .14, .38, Math.PI); });
    const wings = [-1, 1].map(s => { const l = limbDef(s * .26, .05, 0, 0, .9, 'wing', { side: s }); l.mb.box(.9, .04, .52, sp.d, s * .48, 0, -.04); l.mb.box(.95, .07, .07, sp.c, s * .5, .03, .2); l.mb.box(.06, .06, .5, sp.c, s * .95, .02, -.02); return l; });
    return { body: b, glow: gl, limbs: wings, h: .9, r: .6, fly: 1.6 };
  },
  scorp(sp) {
    const b = new MB(), gl = new MB(), c = sp.c, d = sp.d;
    b.sph(.5, c, 0, .52, 0, 1.1, .55, 1.4); b.sph(.32, c, 0, .52, .74, 1, .7, 1);
    [-1, 1].forEach(s => gl.ball(.05, '#ff3020', s * .1, .66, 1.0));
    [[0, .78, -.66, .2], [0, 1.08, -.84, .19], [0, 1.4, -.78, .17], [0, 1.64, -.52, .15]].forEach(([x, y, z, r]) => b.ball(r, c, x, y, z));
    b.cone(.08, .34, d, 0, 1.6, -.24, 2.2);
    const claws = [-1, 1].map((s, i) => { const l = limbDef(s * .38, .52, .84, i, .25, 'arm'); l.mb.box(.12, .12, .5, c, 0, 0, .22); l.mb.box(.24, .16, .26, d, 0, 0, .55); l.mb.box(.07, .1, .22, d, s * -.08, 0, .74); return l; });
    const legs = [];
    for (let i = 0; i < 3; i++) for (const s of [-1, 1]) { const l = limbDef(s * .45, .5, -.32 + i * .32, (i + (s > 0 ? 1 : 0)) % 2, .45, 'leg', { rz: s * .7 }); l.mb.box(.07, .5, .07, d, 0, -.25, 0); legs.push(l); }
    return { body: b, glow: gl, limbs: [...claws, ...legs], h: 1.7, r: 1 };
  },
  mummy(sp) { const d = human({ skin: sp.c, shirt: sp.c, pants: sp.c, boots: sp.d, sleeve: sp.c, forearm: sp.c, hand: sp.c, eyesGlow: sp.a, wrap: sp.d, hs: 'none', noMouth: 1, armsFwd: -1.35, belt: sp.d }); return d; },
  worm(sp) {
    const b = new MB(), gl = new MB();
    b.sph(.8, '#b8945a', 0, .1, 0, 1.3, .35, 1.3);
    for (let i = 0; i < 6; i++) b.ball(.46 - i * .02, i % 2 ? sp.c : sp.d, 0, .35 + i * .36, -.18 + Math.sin(i * .7) * .28);
    b.ball(.5, sp.c, 0, 2.38, .22);
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; b.cone4(.06, .2, '#fff6e0', Math.sin(a) * .26, 2.38 + Math.cos(a) * .26, .64, Math.PI / 2); }
    b.cyl(.24, .1, '#3a1010', 0, 2.38, .66, Math.PI / 2);
    [-1, 1].forEach(s => gl.ball(.07, sp.a, s * .3, 2.62, .52));
    return { body: b, glow: gl, limbs: [], h: 2.8, r: .85, anim: 'sway' };
  },
  golem(sp) {
    const b = new MB(), gl = new MB(), c = sp.c, d = sp.d;
    b.box(1.15, 1.1, .8, c, 0, 1.68, 0); b.box(.9, .4, .7, d, 0, 1.08, 0); b.box(.52, .44, .48, d, 0, 2.42, .08);
    gl.ball(.2, sp.a, 0, 1.72, .42); [-1, 1].forEach(s => gl.box(.1, .07, .04, sp.a, s * .12, 2.46, .33));
    [[-.62, 2.32, 0, .45], [.62, 2.32, 0, -.45], [-.3, 2.3, -.3, .2], [.35, 2.25, -.35, -.2], [0, 2.3, -.4, 0]].forEach(([x, y, z, rz]) => gl.cone4(.13, .5, '#e0f8ff', x, y, z, 0, 0, rz));
    const arms = [-1, 1].map((s, i) => { const l = limbDef(s * .8, 2.05, 0, i, .5, 'arm'); l.mb.box(.44, .95, .46, c, 0, -.45, 0); l.mb.box(.52, .42, .52, d, 0, -1.08, 0); return l; });
    const legs = [-1, 1].map((s, i) => { const l = limbDef(s * .3, 1.0, 0, i, .5); l.mb.box(.4, 1.0, .44, d, 0, -.5, 0); return l; });
    return { body: b, glow: gl, limbs: [...arms, ...legs], h: 2.8, r: 1.05 };
  },
  ghost(sp) {
    const b = new MB(), gl = new MB();
    b.tcyl(.5, .14, 1.1, sp.c, 0, .62, 0); b.ball(.5, sp.c, 0, 1.36, 0);
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; b.cone4(.1, .4, sp.d, Math.sin(a) * .16, .08, Math.cos(a) * .16, Math.PI); }
    [-1, 1].forEach(s => gl.box(.12, .17, .03, sp.a, s * .16, 1.42, .45)); b.box(.18, .1, .04, '#1a1020', 0, 1.18, .45);
    const arms = [-1, 1].map((s, i) => { const l = limbDef(s * .5, 1.08, 0, i, .35, 'arm', { rz: s * .5 }); l.mb.box(.14, .5, .14, sp.c, 0, -.24, 0); return l; });
    return { body: b, glow: gl, limbs: arms, h: 1.9, r: .6, fly: .5, ghost: 1 };
  },
  lizard(sp) {
    const b = new MB(), gl = new MB(), c = sp.c, d = sp.d;
    b.sph(.45, c, 0, .46, 0, .95, .6, 1.6); b.sph(.3, c, 0, .52, .86, 1, .75, 1.25);
    [-1, 1].forEach(s => gl.ball(.06, sp.a, s * .16, .66, 1.06));
    for (let i = 0; i < 5; i++) b.cone4(.08, .24, d, 0, .78 - i * .02, .5 - i * .28);
    const tail = limbDef(0, .46, -.66, 0, .4, 'tail', { rx: .1 }); [0, 1, 2, 3].forEach(i => tail.mb.ball(.2 - i * .04, c, 0, 0, -.2 - i * .28)); tail.gl.ball(.12, '#ffb020', 0, .05, -1.14);
    const legs = [[-.38, .38], [.38, .38], [-.38, -.38], [.38, -.38]].map(([x, z], i) => { const l = limbDef(x, .42, z, i === 0 || i === 3 ? 0 : 1, .6, 'leg', { rz: x < 0 ? .5 : -.5 }); l.mb.box(.13, .42, .13, d, 0, -.2, 0); return l; });
    return { body: b, glow: gl, limbs: [...legs, tail], h: 1.15, r: .9 };
  },
  demon(sp) { const d = human({ skin: sp.sk, shirt: sp.c, pants: sp.d, boots: '#1a0a0a', sleeve: sp.sk, eyesGlow: sp.a, horns: '#2a1a1a', wings: '#5a0a18', tail: sp.c, hs: 'none', mouth: '#1a0505', claws: '#ffd23f', belt: '#1a0a0a', buckle: '#ffd23f' }); d.k = 1.05; return d; },
  imp(sp) {
    const b = new MB(), gl = new MB();
    b.ball(.36, sp.c, 0, 0, 0); b.ball(.3, sp.c, 0, .44, .06);
    [-1, 1].forEach(s => { b.cone(.06, .24, sp.d, s * .14, .78, .02, 0, 0, -s * .35); gl.box(.08, .06, .03, sp.a, s * .1, .48, .35); });
    b.cone4(.05, .4, sp.d, 0, -.32, -.32, -2.2); gl.ball(.16, '#ffd040', .32, .05, .32);
    const wings = [-1, 1].map(s => { const l = limbDef(s * .24, .12, -.12, 0, .8, 'wing', { side: s }); l.mb.box(.6, .04, .42, sp.d, s * .32, 0, -.08); return l; });
    return { body: b, glow: gl, limbs: wings, h: 1.1, r: .5, fly: 1.4 };
  },
  knight(sp) { const d = human({ skin: '#1a1424', shirt: sp.c, pants: sp.c, boots: '#120e1a', sleeve: sp.c, forearm: '#3a3050', hand: '#3a3050', pads: '#4a3a6a', knightHelm: '#3a3050', eyesGlow2: sp.a, hs: 'none', noMouth: 1, hold: 'voidsword', blade: sp.d, shield: '#2a2238', shieldGem: sp.a, trim: '#4a3a6a', cape: '#3a1a5a' }); d.k = 1.12; return d; },
  sapling(sp) {
    const b = new MB(), gl = new MB();
    b.box(.4, .72, .4, sp.d, 0, .62, 0);
    [[0, 1.22, 0, .36], [.22, 1.12, .1, .24], [-.24, 1.14, -.05, .26], [0, 1.4, -.1, .24]].forEach(([x, y, z, r]) => b.ball(r, sp.c, x, y, z));
    [-1, 1].forEach(s => gl.box(.08, .07, .03, sp.a, s * .1, .82, .21));
    const arms = [-1, 1].map((s, i) => { const l = limbDef(s * .24, .82, 0, i, .5, 'arm', { rz: s * .6 }); l.mb.box(.07, .44, .07, sp.d, 0, -.2, 0); l.mb.ball(.08, sp.c, 0, -.44, 0); return l; });
    const legs = [-1, 1].map((s, i) => { const l = limbDef(s * .12, .28, 0, i, .6); l.mb.box(.12, .3, .14, sp.d, 0, -.14, 0); return l; });
    return { body: b, glow: gl, limbs: [...arms, ...legs], h: 1.6, r: .5 };
  },
  dummy(sp) {
    const b = new MB();
    b.cyl(.08, 2.1, '#6b4a2b', 0, 1.05, 0); b.sph(.42, sp.c, 0, 1.3, 0, 1, 1.3, .9); b.ball(.28, sp.c, 0, 1.98, 0);
    b.box(1.4, .12, .12, sp.d, 0, 1.55, 0);
    b.cyl(.3, .04, '#ffffff', 0, 1.3, .36, Math.PI / 2); b.cyl(.2, .05, '#d33', 0, 1.3, .37, Math.PI / 2); b.cyl(.08, .06, '#ffffff', 0, 1.3, .38, Math.PI / 2);
    return { body: b, glow: new MB(), limbs: [], h: 2.3, r: .5, anim: 'none' };
  },
  ent(sp) {
    const b = new MB(), gl = new MB(), c = sp.c, d = sp.d;
    b.tcyl(.46, .62, 2.3, c, 0, 1.45, 0, 0, 0, 0, 7); b.box(.18, .9, .16, '#4a2e16', .3, 1.2, .38, 0, 0, .1); b.box(.14, .7, .14, '#4a2e16', -.32, 1.5, .36, 0, 0, -.12);
    [[0, 3.05, 0, .85], [.55, 2.85, .2, .6], [-.55, 2.9, .1, .62], [0, 3.5, -.2, .6], [.3, 3.3, -.45, .5], [-.35, 3.25, -.4, .52]].forEach(([x, y, z, r]) => b.ball(r, d, x, y, z));
    [[.2, 3.4, .5], [-.4, 3.0, .55], [.6, 3.0, .5]].forEach(([x, y, z]) => gl.ball(.07, '#ffe680', x, y, z));
    [-1, 1].forEach(s => gl.box(.14, .1, .04, sp.a, s * .17, 2.12, .5)); b.box(.36, .1, .04, '#1a0e06', 0, 1.82, .52);
    b.box(.4, .12, .2, '#4a2e16', 0, 2.3, .45);
    const arms = [-1, 1].map((s, i) => { const l = limbDef(s * .5, 2.2, 0, i, .45, 'arm', { rz: s * .5 }); l.mb.tcyl(.12, .2, 1.3, c, 0, -.65, 0); l.mb.box(.08, .5, .08, c, s * .12, -1.25, .1, 0, 0, s * .4); l.mb.ball(.36, d, 0, -1.4, 0); l.mb.ball(.26, d, s * .2, -1.2, .2); return l; });
    const legs = [-1, 1].map((s, i) => { const l = limbDef(s * .3, .62, 0, i, .4); l.mb.tcyl(.18, .28, .66, c, 0, -.3, 0); l.mb.box(.5, .12, .7, '#4a2e16', 0, -.58, .1); return l; });
    return { body: b, glow: gl, limbs: [...arms, ...legs], h: 3.9, r: 1.1 };
  },
  pharaoh(sp) { const d = human({ skin: sp.sk, shirt: '#f2ead8', pants: '#f2ead8', boots: '#c9a040', sleeve: sp.sk, eyesGlow: sp.a, nemes: [sp.c, sp.d], hs: 'none', noMouth: 1, robe: '#f2ead8', robeTrim: sp.c, collar: sp.c, hold: 'scepter', belt: sp.c, buckle: sp.d, cape: sp.d }); return d; },
  queen(sp) { const d = human({ skin: sp.sk, shirt: sp.c, pants: sp.d, sleeve: sp.c, eyesGlow: sp.a, hs: 'long', hair: '#e8f6ff', crownIce: 1, dress: sp.d, dressTrim: '#e8f6ff', cape: '#dff4ff', collar: '#e8f6ff', hold: 'icestaff', noMouth: 1 }); d.fly = .35; return d; },
  dragon(sp) {
    const b = new MB(), gl = new MB(), c = sp.c, d = sp.d;
    b.box(1.15, .95, 1.9, c, 0, 1.35, 0); b.box(.9, .4, 1.6, d, 0, .95, .05);
    [[0, 1.78, 1.05, .6, .6, .7, -.5], [0, 2.18, 1.38, .52, .55, .6, -.6], [0, 2.52, 1.64, .48, .5, .55, -.4]].forEach(([x, y, z, w, h, l, rx]) => b.box(w, h, l, c, x, y, z, rx));
    b.box(.64, .5, .86, c, 0, 2.68, 2.08); b.box(.52, .2, .7, d, 0, 2.38, 2.12); b.box(.5, .12, .5, '#2a0a0a', 0, 2.52, 2.24);
    [-1, 1].forEach(s => { b.cone(.1, .6, '#2a1a10', s * .22, 3.02, 1.82, -.9, 0, -s * .3); gl.box(.12, .08, .04, sp.a, s * .2, 2.82, 2.5); b.cone4(.04, .14, '#fff6e0', s * .12, 2.42, 2.48, Math.PI); });
    gl.box(.32, .06, .3, '#ffb040', 0, 2.46, 2.3);
    for (let i = 0; i < 7; i++) b.cone4(.12, .36, d, 0, 1.92 - (i > 3 ? (i - 3) * .12 : 0), .8 - i * .32);
    const tail = limbDef(0, 1.3, -.95, 0, .3, 'tail', { rx: .15 }); [0, 1, 2, 3, 4].forEach(i => tail.mb.box(.5 - i * .08, .45 - i * .07, .55, c, 0, -i * .08, -.25 - i * .5)); tail.mb.cone4(.2, .5, d, 0, -.4, -2.8, -Math.PI / 2);
    const legs = [[-.55, .62], [.55, .62], [-.55, -.62], [.55, -.62]].map(([x, z], i) => { const l = limbDef(x, 1.05, z, i === 0 || i === 3 ? 0 : 1, .55); l.mb.box(.32, 1.0, .36, c, 0, -.5, 0); l.mb.box(.38, .16, .5, '#2a1a10', 0, -.98, .08); return l; });
    const wings = [-1, 1].map(s => { const l = limbDef(s * .5, 1.82, .25, 0, .5, 'wing', { side: s }); l.mb.box(2.4, .1, .14, c, s * 1.2, .25, .3, 0, 0, s * .25); l.mb.box(2.2, .05, 1.5, d, s * 1.15, .1, -.42, 0, 0, s * .2); l.mb.box(.1, .08, 1.2, c, s * 2.2, .5, -.3); return l; });
    return { body: b, glow: gl, limbs: [...legs, tail, ...wings], h: 3.1, r: 1.7 };
  },
  lord(sp) {
    const b = new MB(), gl = new MB(), c = sp.c, d = sp.d;
    b.tcyl(.56, 1.05, 1.7, c, 0, .85, 0, 0, 0, 0, 8); b.tcyl(1.06, 1.08, .1, d, 0, .05, 0, 0, 0, 0, 8);
    b.box(1.05, 1.05, .62, '#241838', 0, 2.1, 0); gl.ball(.22, d, 0, 2.12, .33);
    [-1, 1].forEach(s => { b.box(.5, .3, .6, '#120a20', s * .6, 2.62, 0); [0, 1, 2].forEach(i => b.cone4(.08, .4, d, s * (.45 + i * .14), 2.92, -.1 + i * .08, 0, 0, -s * .3)); });
    b.box(.62, .62, .58, '#0e0818', 0, 2.95, .02);
    [-1, 1].forEach(s => { gl.box(.14, .08, .03, sp.a, s * .15, 3.0, .32); b.cone(.1, .7, '#2a1a3a', s * .3, 3.45, -.05, -.3, 0, -s * .7); b.cone(.07, .4, '#2a1a3a', s * .62, 3.75, -.15, -.4, 0, -s * 1.3); });
    for (let i = 0; i < 5; i++) gl.cone4(.05, .3, d, -.2 + i * .1, 3.34, .2);
    b.box(1.1, 2.3, .08, '#2a0a3a', 0, 1.5, -.36, .08);
    const arms = [-1, 1].map((s, i) => { const l = limbDef(s * .72, 2.4, 0, i, .4, 'arm'); l.mb.box(.3, .6, .32, '#241838', 0, -.3, 0); l.mb.box(.26, .55, .28, '#120a20', 0, -.85, 0); [-.08, 0, .08].forEach(x => l.gl.cone(.03, .22, d, x, -1.2, .08, Math.PI)); return l; });
    return { body: b, glow: gl, limbs: arms, h: 3.6, r: 1.25, fly: .45 };
  }
};
const _defs = {};
function getDef(key, sp) {
  if (_defs[key]) return _defs[key];
  const d = MODELS[sp.m](sp);
  return (_defs[key] = finalizeDef(d));
}
// Personagem humano (jogador, NPCs, outros aventureiros)
function humanDef(look) { return finalizeDef(human(look)); }

/* ---------- Animação comum dos membros ---------- */
function animLimbs(o, ph, moving, t) {
  for (const l of o.limbs) {
    if (l.kind === 'wing') { l.p.rotation.z = l.rz + l.side * Math.sin(t * 12 + l.ph) * l.amp; continue; }
    if (l.kind === 'tail') { l.p.rotation.y = Math.sin(t * (moving ? 9 : 3)) * l.amp; continue; }
    const s = moving ? Math.sin(ph + (l.ph ? Math.PI : 0)) * l.amp : 0;
    l.p.rotation.x = lerp(l.p.rotation.x, l.rx + s, .35);
  }
}
/* ===================== 06 · MUNDO ===================== */
const GN = 200, GS = 2.4, GO = -240, GW = GN + 1, HG = new Float32Array(GW * GW);
const FLATS = [], LAVA = [], CAMPLIST = [], INTER = [], FIRES = [], SMOKES = [], ROADSEG = [], DYN = {};

function zoneAmp(d) { let a = ZONES[0].hill; for (let i = 1; i < 6; i++) a = lerp(a, ZONES[i].hill, sstep(ZONES[i - 1].r - 6, ZONES[i - 1].r + 6, d)); return a; }
function Hbase(x, z) {
  const d = Math.hypot(x, z), amp = zoneAmp(d);
  let h = (fbm(x * .03 + 3.1, z * .03 + 7.7) - .5) * amp * 3.4 + (vnoise(x * .012 + 1.3, z * .012 + 2.9) - .5) * amp * 3;
  h *= sstep(VILLAGE_R - 6, VILLAGE_R + 10, d);
  if (d > WORLD_R - 6) { const e = (d - (WORLD_R - 6)) / 9; h += Math.min(44, Math.pow(e, 1.7) * 7 * (.7 + vnoise(x * .08, z * .08) * .6)); }
  return h;
}
function Hraw(x, z) {
  let h = Hbase(x, z);
  for (const f of FLATS) { const d = Math.hypot(x - f.x, z - f.z); if (d < f.r + f.fall) h = f.y + (h - f.y) * sstep(f.r, f.r + f.fall, d); }
  for (const v of MARKS.volcanoes) { const d = Math.hypot(x - v.x, z - v.z); if (d < v.r) { h += v.h * Math.pow(1 - d / v.r, 1.4); const cr = v.r * .2; if (d < cr) h -= (1 - d / cr) * v.h * .45; } }
  const oa = MARKS.oasis, od = Math.hypot(x - oa.x, z - oa.z);
  if (od < oa.r + 3) h = lerp(h, oa.y - 1.4, 1 - sstep(oa.r - 2, oa.r + 3, od));
  for (const l of LAVA) { const d = Math.hypot(x - l.x, z - l.z); if (d < l.r + 2.5) h = lerp(h, l.y - .9, 1 - sstep(l.r - 1, l.r + 2.5, d)); }
  return h;
}
function H(x, z) {
  const fx = (x - GO) / GS, fz = (z - GO) / GS;
  if (fx < 0 || fz < 0 || fx >= GN || fz >= GN) return 0;
  const i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j;
  const a = HG[j * GW + i], b = HG[j * GW + i + 1], c = HG[(j + 1) * GW + i], d = HG[(j + 1) * GW + i + 1];
  return u + v <= 1 ? a + (b - a) * u + (c - a) * v : d + (c - d) * (1 - u) + (b - d) * (1 - v);
}
function distRoad(x, z) {
  let best = 1e9;
  for (const s of ROADSEG) {
    const dx = s[2] - s[0], dz = s[3] - s[1], L2 = dx * dx + dz * dz;
    const t = clamp(((x - s[0]) * dx + (z - s[1]) * dz) / L2, 0, 1);
    const d = Math.hypot(x - (s[0] + dx * t), z - (s[1] + dz * t)); if (d < best) best = d;
  }
  return best;
}

/* ---------- Colisões ---------- */
const COLS = new Map(), CCS = 8;
const ckey = (i, j) => i * 65536 + j;
function addCol(x, z, r) {
  const o = { x, z, r };
  for (let i = Math.floor((x - r) / CCS); i <= Math.floor((x + r) / CCS); i++)
    for (let j = Math.floor((z - r) / CCS); j <= Math.floor((z + r) / CCS); j++) {
      const k = ckey(i, j); if (!COLS.has(k)) COLS.set(k, []); COLS.get(k).push(o);
    }
}
function pushOut(p, r) {
  const ci = Math.floor(p.x / CCS), cj = Math.floor(p.z / CCS);
  for (let i = ci - 1; i <= ci + 1; i++) for (let j = cj - 1; j <= cj + 1; j++) {
    const l = COLS.get(ckey(i, j)); if (!l) continue;
    for (const o of l) { const dx = p.x - o.x, dz = p.z - o.z, d = Math.hypot(dx, dz), m = o.r + r; if (d < m && d > 1e-4) { p.x += dx / d * (m - d); p.z += dz / d * (m - d); } }
  }
}
function onAbyss(x, z) {
  for (const p of ABYSS.plats) if (Math.hypot(x - p[0], z - p[1]) < p[2] - .6) return true;
  for (const b of ABYSS.bridges) if (Math.abs(x - b[0]) < b[4] / 2 - .2 && z <= b[1] + .5 && z >= b[3] - .5) return true;
  return false;
}
function moveEnt(p, dx, dz, r) {
  const nx = p.x + dx, nz = p.z + dz;
  if (p.x > 600) {
    if (onAbyss(nx, nz)) { p.x = nx; p.z = nz; } else if (onAbyss(nx, p.z)) p.x = nx; else if (onAbyss(p.x, nz)) p.z = nz;
    pushOut(p, r); if (!onAbyss(p.x, p.z)) { p.x = nx - dx; p.z = nz - dz; }
    return;
  }
  p.x = nx; p.z = nz; pushOut(p, r);
  const d = Math.hypot(p.x, p.z), M = WORLD_R - 3; if (d > M) { p.x *= M / d; p.z *= M / d; }
}

// anda desviando de obstáculos: se o caminho reto estiver bloqueado, tenta ângulos laterais
function moveSmart(p, ux, uz, s, r, tx, tz) {
  const x0 = p.x, z0 = p.z, d0 = Math.hypot(tx - x0, tz - z0);
  moveEnt(p, ux * s, uz * s, r);
  if (Math.hypot(p.x - x0, p.z - z0) > s * .5) return;
  let best = null, bd = 1e9;
  for (const a of [.7, -.7, 1.3, -1.3, 1.9, -1.9]) {
    const c = Math.cos(a), sn = Math.sin(a), q = { x: x0, z: z0 };
    moveEnt(q, (ux * c - uz * sn) * s, (ux * sn + uz * c) * s, r);
    if (Math.hypot(q.x - x0, q.z - z0) < s * .4) continue;
    const d = Math.hypot(tx - q.x, tz - q.z) + Math.abs(a) * .05;
    if (d < bd) { bd = d; best = q; }
  }
  if (best) { p.x = best.x; p.z = best.z; }
}

/* ---------- Cores do chão ---------- */
const ZC = ZONES.slice(0, 6).map(Z => Z.g.map(h => new T.Color(h)));
const ROCK = ['#8f8a78', '#8a8a7a', '#5b5a4a', '#b48a58', '#9aa8b8', '#2e2220'].map(h => new T.Color(h));
const SNOW = new T.Color('#f4f8ff'), _gc1 = new T.Color();
function zoneCol(i, x, z, out) {
  const g = ZC[i], n1 = fbm(x * .07 + i * 13, z * .07 - i * 7), n2 = vnoise(x * .22 + 5 + i, z * .22 + 9);
  out.copy(g[0]).lerp(g[1], sstep(.32, .68, n1));
  if (n2 > .7) out.lerp(g[2], Math.min(1, (n2 - .7) * 3.2));
  return out;
}
function groundColor(x, z, h, slope, out) {
  const d = Math.hypot(x, z), dj = d + (fbm(x * .045 + 20, z * .045 + 40) - .5) * 16;
  out.setRGB(0, 0, 0);
  for (let i = 0; i < 6; i++) {
    const lo = i ? sstep(ZONES[i - 1].r - 3, ZONES[i - 1].r + 3, dj) : 1, hi = i < 5 ? 1 - sstep(ZONES[i].r - 3, ZONES[i].r + 3, dj) : 1, w = lo * hi;
    if (w > .001) { zoneCol(i, x, z, _gc1); out.r += _gc1.r * w; out.g += _gc1.g * w; out.b += _gc1.b * w; }
  }
  const zi = zoneAt(x, z);
  out.lerp(ROCK[zi], sstep(.5, 1, slope) * .75);
  if (d > WORLD_R - 4) { out.lerp(ROCK[zi], sstep(2, 8, h)); if (zi !== 5 && h > 20) out.lerp(SNOW, sstep(20, 28, h)); }
  for (const v of MARKS.volcanoes) { const vd = Math.hypot(x - v.x, z - v.z); if (vd < v.r) out.lerp(ROCK[5], .7 * (1 - vd / v.r)); }
  out.multiplyScalar(.94 + hash2(Math.floor(x * .7), Math.floor(z * .7)) * .12);
}

/* ---------- Construção ---------- */
const WATER_MAT = new T.MeshStandardMaterial({ color: '#3a9ad8', roughness: .15, metalness: .1, transparent: true, opacity: .82, emissive: new T.Color('#0a3060'), emissiveIntensity: .4 });
const LAVA_MAT = new T.MeshBasicMaterial({ color: '#ff6a1a' });
const ICE_MAT = new T.MeshStandardMaterial({ color: '#d4ecff', roughness: .1, metalness: .25 });
function addBuilt(B, G, shadow = true) {
  if (!B.empty) { const m = new T.Mesh(B.build(), MAT.v); m.castShadow = shadow; m.receiveShadow = true; scene.add(m); }
  if (G && !G.empty) scene.add(new T.Mesh(G.build(), MAT.glow));
}
function disc(x, y, z, r, mat, seg = 32) { const m = new T.Mesh(new T.CircleGeometry(r, seg), mat); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); scene.add(m); return m; }

function buildTerrain() {
  const pos = new Float32Array(GW * GW * 3), col = new Float32Array(GW * GW * 3), c = new T.Color();
  for (let j = 0; j < GW; j++) for (let i = 0; i < GW; i++) {
    const k = j * GW + i, x = GO + i * GS, z = GO + j * GS, h = HG[k];
    pos[k * 3] = x; pos[k * 3 + 1] = h; pos[k * 3 + 2] = z;
    const hx = HG[j * GW + Math.min(GN, i + 1)] - HG[j * GW + Math.max(0, i - 1)], hz = HG[Math.min(GN, j + 1) * GW + i] - HG[Math.max(0, j - 1) * GW + i];
    groundColor(x, z, h, Math.hypot(hx, hz) / (2 * GS), c);
    col[k * 3] = c.r; col[k * 3 + 1] = c.g; col[k * 3 + 2] = c.b;
  }
  const idx = new Uint32Array(GN * GN * 6); let o = 0;
  for (let j = 0; j < GN; j++) for (let i = 0; i < GN; i++) {
    const a = j * GW + i, b = a + 1, cc = a + GW, d = cc + 1;
    idx[o++] = a; idx[o++] = cc; idx[o++] = b; idx[o++] = b; idx[o++] = cc; idx[o++] = d;
  }
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('color', new T.BufferAttribute(col, 3));
  g.setIndex(new T.BufferAttribute(idx, 1)); g.computeVertexNormals();
  const m = new T.Mesh(g, new T.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1 }));
  m.receiveShadow = true; scene.add(m);
  return col;
}
function buildRoads() {
  const ROADC = ['#b9a275', '#b9a275', '#6b5a3a', '#c4a062', '#b8c4cc', '#3a2a26'].map(h => new T.Color(h));
  const P = [], C = [], I = []; const c = new T.Color();
  const lines = [[[9.5, 0], [22, 0]], [[0, 9.5], [0, 22]], [[-9.5, 0], [-22, 0]], [[0, -9.5], [0, -22]], ...ROADS];
  for (const L of lines) {
    for (let s = 0; s < L.length - 1; s++) ROADSEG.push([L[s][0], L[s][1], L[s + 1][0], L[s + 1][1]]);
    const pts = [];
    for (let s = 0; s < L.length - 1; s++) {
      const [x1, z1] = L[s], [x2, z2] = L[s + 1], len = Math.hypot(x2 - x1, z2 - z1), n = Math.ceil(len / 1.2);
      for (let k = 0; k < n; k++) pts.push([lerp(x1, x2, k / n), lerp(z1, z2, k / n)]);
    }
    pts.push(L[L.length - 1]);
    const base = P.length / 3;
    pts.forEach((p, k) => {
      const q = pts[Math.min(pts.length - 1, k + 1)], r = pts[Math.max(0, k - 1)];
      let dx = q[0] - r[0], dz = q[1] - r[1]; const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l;
      const w = 1.6 + (vnoise(p[0] * .2, p[1] * .2) - .5) * .5;
      for (const sd of [-1, 1]) {
        const x = p[0] - dz * w * sd, z = p[1] + dx * w * sd;
        P.push(x, H(x, z) + .07, z);
        c.copy(ROADC[zoneAt(x, z)]).multiplyScalar(.9 + hash2(Math.floor(x * 2), Math.floor(z * 2)) * .18); C.push(c.r, c.g, c.b);
      }
      if (k < pts.length - 1) { const a = base + k * 2; I.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    });
  }
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(P, 3)); g.setAttribute('color', new T.Float32BufferAttribute(C, 3));
  g.setIndex(I); g.computeVertexNormals();
  const m = new T.Mesh(g, new T.MeshStandardMaterial({ vertexColors: true, roughness: 1, side: T.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
  m.receiveShadow = true; scene.add(m);
}

function house(B, G, x, z, ry, o = {}) {
  const w = o.w || 5, d = o.d || 4.6, h = o.h || 3, wall = o.wall || '#e6d6b8', roof = o.roof || '#b5452e', tim = '#6b4426';
  B.at(x, 0, z, ry); G.at(x, 0, z, ry);
  B.box(w + .4, .4, d + .4, '#8a8478', 0, .2, 0);
  B.box(w, h, d, wall, 0, .4 + h / 2, 0);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => B.box(.26, h, .26, tim, sx * w / 2, .4 + h / 2, sz * d / 2));
  B.box(w + .08, .2, d + .08, tim, 0, .4 + h * .5, 0); B.box(w + .1, .24, d + .1, tim, 0, .4 + h, 0);
  B.box(1.2, 2, .14, '#5a3a1e', 0, 1.4, d / 2 + .04); B.box(1.5, .22, .22, tim, 0, 2.45, d / 2 + .06); G.box(.1, .1, .05, '#ffd040', .4, 1.4, d / 2 + .13);
  [-1, 1].forEach(s => { G.box(.8, .7, .06, '#ffd88a', s * w * .3, 2.3, d / 2 + .03); G.box(.06, .7, .8, '#ffd88a', s * (w / 2 + .03), 2.3, 0); B.box(1, .12, .16, tim, s * w * .3, 1.9, d / 2 + .06); });
  B.geo(GEO.prism, roof, 0, .4 + h + .1, 0, w + .9, o.rh || 2.3, d + 1.1);
  B.box(.6, 1.8, .6, '#8a7a6a', w * .25, .4 + h + 1.3, -d * .15);
  SMOKES.push([x + Math.cos(ry) * w * .25 + Math.sin(ry) * -d * .15, .4 + h + 2.3, z - Math.sin(ry) * w * .25 + Math.cos(ry) * -d * .15]);
  if (o.flowers) [-1, 1].forEach(s => { B.box(1.4, .3, .5, '#7a5230', s * w * .3, .55, d / 2 + .5); [-.4, 0, .4].forEach(fx => B.ball(.16, pick(['#ff6a8a', '#ffd23f', '#b06aff', '#ffffff']), s * w * .3 + fx, .82, d / 2 + .5)); });
  B.at(); G.at();
  addCol(x, z, Math.max(w, d) * .58);
}

function buildVillage() {
  const B = new MB(), G = new MB();
  B.tcyl(11.2, 11.2, .16, '#a89878', 0, 0, 0, 0, 0, 0, 40);
  B.tcyl(10.6, 10.6, .22, '#b3a585', 0, 0, 0, 0, 0, 0, 40);
  B.tcyl(4.3, 4.3, .26, '#9c8e70', 0, 0, 0, 0, 0, 0, 28);
  for (let i = 0; i < 80; i++) { const a = wr(0, TAU), r = wr(4.8, 10.2); B.box(wr(.4, .8), .05, wr(.4, .8), WR() < .5 ? '#a89a7a' : '#bcae8e', Math.sin(a) * r, .12, Math.cos(a) * r, 0, wr(0, 3), 0); }
  // fonte
  B.tcyl(2.8, 3, .8, '#b8bcc6', 0, .4, 0, 0, 0, 0, 16);
  B.tcyl(.9, 1.1, .5, '#c8ccd6', 0, 1, 0, 0, 0, 0, 10);
  B.tcyl(.32, .42, 1.6, '#c8ccd6', 0, 1.8, 0, 0, 0, 0, 8);
  B.tcyl(.8, .4, .3, '#b8bcc6', 0, 2.65, 0, 0, 0, 0, 10);
  disc(0, .74, 0, 2.5, WATER_MAT, 20);
  addCol(0, 0, 3.1);
  // casas
  house(B, G, 15, -14.5, Math.atan2(-15, 14.5), { roof: '#b5452e', flowers: 1 });
  house(B, G, -15, -14.5, Math.atan2(15, 14.5), { roof: '#3f6fa8', wall: '#eadcc0' });
  house(B, G, -15.5, 15, Math.atan2(15.5, -15), { roof: '#5a8a3a', flowers: 1 });
  house(B, G, 17.5, 15.5, Math.atan2(-17.5, -15.5), { roof: '#8a4a9a', w: 5.5 });
  house(B, G, -19, -3.5, Math.PI / 2 + .1, { roof: '#a8642a', w: 4, d: 4 });
  // forja da Brunhilda
  B.at(-14.2, 0, 7, 1.2); G.at(-14.2, 0, 7, 1.2);
  B.box(6, .3, 4.6, '#7a7468', 0, .15, 0);
  [[-2.7, -2], [2.7, -2], [-2.7, 2], [2.7, 2]].forEach(([x, z]) => B.box(.3, 3.2, .3, '#5a3a1e', x, 1.7, z));
  B.geo(GEO.prism, '#6a4a3a', 0, 3.2, 0, 6.6, 1.6, 5.2);
  B.box(1.8, 2.2, 1.6, '#6a625a', -1.6, 1.25, -1.2); G.box(.9, .7, .1, '#ff7a1a', -1.6, .95, -.38); B.box(.6, 1.6, .6, '#5a524a', -1.6, 3, -1.2);
  B.box(.9, .5, .45, '#4a4a52', 1, .9, .8); B.box(.4, .5, .3, '#3a3a40', 1, .5, .8); B.box(1.2, .14, .5, '#5a5a62', 1, 1.2, .8);
  B.box(.1, 2, 2.4, '#5a3a1e', 2.6, 1.3, -.5);[-.8, 0, .8].forEach(z => { B.box(.06, 1.4, .14, '#cfd6dd', 2.45, 1.5, z - .5); B.box(.3, .08, .1, '#6a6a6a', 2.45, 1, z - .5); });
  B.at(); G.at();
  FIRES.push([-14.2 + Math.cos(1.2) * -1.6 + Math.sin(1.2) * -.38, .95, 7 - Math.sin(1.2) * -1.6 + Math.cos(1.2) * -.38]);
  SMOKES.push([-14.2 + Math.cos(1.2) * -1.6 + Math.sin(1.2) * -1.2, 4, 7 - Math.sin(1.2) * -1.6 + Math.cos(1.2) * -1.2]);
  addCol(-14.6, 7.6, 2.2);
  // barraca do Tobias
  B.at(11.8, 0, -8.4, Math.atan2(-11.8, 8.4)); G.at(11.8, 0, -8.4, Math.atan2(-11.8, 8.4));
  B.box(3.4, 1, 1.2, '#8a5a2a', 0, .5, 0);
  [[-1.6, -.6], [1.6, -.6], [-1.6, .6], [1.6, .6]].forEach(([x, z]) => B.box(.14, 2.6, .14, '#5a3a1e', x, 1.3, z));
  for (let i = 0; i < 6; i++) B.box(.58, .1, 1.8, i % 2 ? '#e8e0d0' : '#2e8a5a', -1.45 + i * .58, 2.65, .1, .25, 0, 0);
  ['#ff4a5a', '#4aa8ff', '#ff4a5a', '#4aa8ff', '#ffd23f', '#5fe08a'].forEach((c, i) => { G.ball(.13, c, -1.3 + i * .5, 1.18, .1); B.box(.06, .1, .06, '#e8e0d0', -1.3 + i * .5, 1.36, .1); });
  B.box(.7, .7, .7, '#9a6a3a', 2.3, .35, -.8); B.box(.6, .6, .6, '#8a5a2a', 2.4, 1.0, -.8); B.tcyl(.35, .35, .9, '#7a4a2a', -2.4, .45, -.6);
  B.at(); G.at(); addCol(11.8, -8.4, 1.8);
  // quadro de caçadas
  B.at(-5, 0, 11.5, 2.8);
  B.box(.15, 2.2, .15, '#5a3a1e', -1, 1.1, 0); B.box(.15, 2.2, .15, '#5a3a1e', 1, 1.1, 0); B.box(2.3, 1.3, .12, '#8a5a2a', 0, 1.6, 0);
  [[-.6, 1.8], [.2, 1.85], [.7, 1.4], [-.3, 1.35]].forEach(([x, y]) => B.box(.42, .52, .03, '#f2ead8', x, y, .08));
  B.geo(GEO.prism, '#6a4a3a', 0, 2.25, 0, 2.6, .5, .5);
  B.at(); addCol(-5, 11.5, .9);
  // cerca de madeira + portões
  for (let i = 0; i < 96; i++) {
    const a = i / 96 * TAU; if ([0, Math.PI / 2, Math.PI, Math.PI * 1.5, TAU].some(g => Math.abs(a - g) < .085)) continue;
    const x = Math.sin(a) * 23.5, z = Math.cos(a) * 23.5;
    B.box(.32, 1.8 + (i % 3) * .15, .32, '#7a5230', x, .9, z, 0, a, 0); B.cone4(.24, .4, '#7a5230', x, 2.05 + (i % 3) * .15, z);
  }
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; [-1, 1].forEach(s => { const x = Math.sin(a) * 23.5 + Math.cos(a) * s * 2.4, z = Math.cos(a) * 23.5 - Math.sin(a) * s * 2.4; B.box(.5, 4, .5, '#6b4426', x, 2, z); B.box(.3, 1.6, .05, ['#c0392b', '#2e86de', '#27ae60', '#8e44ad'][i], x, 3, z); addCol(x, z, .4); }); }
  // postes de luz
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + TAU / 16, x = Math.sin(a) * 11.8, z = Math.cos(a) * 11.8; B.cyl(.09, 3, '#3a3a40', x, 1.5, z); B.box(.4, .1, .4, '#3a3a40', x, 3.05, z); G.box(.3, .4, .3, '#ffe08a', x, 3.3, z); B.cone4(.32, .3, '#3a3a40', x, 3.65, z, 0, Math.PI / 4, 0); addCol(x, z, .25); }
  // árvores e enfeites
  [[-8, -19], [8, -20], [20, -6], [-21, 8], [6, 20], [-6, 20], [20, 6], [-20, -11]].forEach(([x, z]) => { B.tcyl(.2, .3, 1.8, '#6b4a2b', x, .9, z); B.ball(1.3, '#4f9e3f', x, 2.7, z); B.ball(.9, '#5fb04a', x + .6, 2.3, z + .3); addCol(x, z, .5); });
  [[13, 3.8], [-8.5, -9], [9, 10.5]].forEach(([x, z]) => { B.tcyl(.4, .4, .9, '#8a5a2a', x, .45, z); B.tcyl(.42, .42, .08, '#5a3a1e', x, .7, z); addCol(x, z, .45); });
  // pedra de teleporte e portal são criados em buildMarks
  addBuilt(B, G);
  // placas nos portões
  [['→ Rei Slime · Deserto', 27, 0], ['↓ Floresta · Ent Ancião', 0, 27], ['← Tundra · Rainha Gélida', -27, 0], ['↑ Vulcão · Dragão Rubro', 0, -27]].forEach(([t, x, z]) => { const s = makeLabel(t, '#ffe9b0', 26, .7); s.position.set(x, 3.6, z); scene.add(s); });
}

/* ---------- Vegetação ---------- */
function vdef(f) { const b = new MB(), g = new MB(); f(b, g); return { b: b.empty ? null : b.build(), g: g.empty ? null : g.build() }; }
const VD = {
  tree: vdef(b => { b.tcyl(.18, .28, 1.6, '#6b4a2b', 0, .8, 0); b.ball(1.2, '#4f9e3f', 0, 2.4, 0); b.ball(.85, '#5fb04a', .6, 2.1, .3); b.ball(.8, '#3f8a35', -.5, 2.8, -.2); }),
  pine: vdef(b => { b.tcyl(.18, .26, 1.4, '#4a331c', 0, .7, 0); b.cone(1.5, 2.2, '#1f5e34', 0, 2.2, 0); b.cone(1.15, 1.9, '#236a3a', 0, 3.3, 0); b.cone(.75, 1.5, '#2a7442', 0, 4.3, 0); }),
  snowpine: vdef(b => { b.tcyl(.18, .26, 1.4, '#4a331c', 0, .7, 0); b.cone(1.5, 2.2, '#2a5e44', 0, 2.2, 0); b.cone(1.1, .8, '#f2f8ff', 0, 2.95, 0); b.cone(1.1, 1.9, '#2f6a4a', 0, 3.3, 0); b.cone(.8, .7, '#f2f8ff', 0, 3.95, 0); b.cone(.65, 1.4, '#f2f8ff', 0, 4.4, 0); }),
  bush: vdef(b => { b.ball(.6, '#4a9a3a', 0, .4, 0); b.ball(.45, '#5aaa48', .45, .35, .1); b.ball(.4, '#3f8a35', -.35, .3, -.2); }),
  rock: vdef(b => { b.geo(GEO.ico, '#8a8f99', 0, .3, 0, 1, .7, 1); b.geo(GEO.ico, '#9aa0aa', .6, .15, .3, .5, .4, .5); }),
  grass: vdef(b => { [[0, 0, 0], [.15, .1, .2], [-.15, .05, -.1], [.05, -.1, .25]].forEach(([x, z, r]) => b.cone4(.08, .55, '#5a9a40', x, .27, z, r, 0, r)); }),
  flowerR: vdef(b => { b.box(.03, .4, .03, '#3a7a2a', 0, .2, 0); b.ball(.12, '#ff5a7a', 0, .42, 0); b.box(.03, .3, .03, '#3a7a2a', .25, .15, .1); b.ball(.1, '#ffd23f', .25, .32, .1); }),
  flowerB: vdef(b => { b.box(.03, .4, .03, '#3a7a2a', 0, .2, 0); b.ball(.12, '#9a6aff', 0, .42, 0); b.box(.03, .3, .03, '#3a7a2a', -.2, .15, .15); b.ball(.1, '#ffffff', -.2, .32, .15); }),
  fern: vdef(b => { for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; b.box(.18, .04, .9, '#2f7a3a', Math.sin(a) * .35, .25, Math.cos(a) * .35, -.5, a, 0); } }),
  mush: vdef((b, g) => { b.tcyl(.12, .16, .9, '#e8e0d0', 0, .45, 0); g.sph(.45, '#6ae0ff', 0, .95, 0, 1, .45, 1); }),
  log: vdef(b => { b.cyl(.35, 2.6, '#5a3a1e', 0, .35, 0, 0, 0, Math.PI / 2); b.cyl(.3, .02, '#c9a070', 1.31, .35, 0, 0, 0, Math.PI / 2); }),
  cactus: vdef(b => { b.tcyl(.32, .36, 2.6, '#4fa34f', 0, 1.3, 0, 0, 0, 0, 7); b.tcyl(.18, .2, 1, '#4fa34f', .55, 1.6, 0, 0, 0, 0, 6); b.tcyl(.18, .2, .6, '#4fa34f', .55, 2.2, 0, 0, 0, 0, 6); b.box(.4, .2, .2, '#4fa34f', .35, 1.15, 0); b.tcyl(.16, .18, .8, '#4fa34f', -.5, 1.9, 0, 0, 0, 0, 6); b.box(.35, .2, .2, '#4fa34f', -.3, 1.55, 0); }),
  dbush: vdef(b => { for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; b.box(.05, .8, .05, '#8a6a40', Math.sin(a) * .2, .35, Math.cos(a) * .2, Math.cos(a) * .5, 0, -Math.sin(a) * .5); } }),
  srock: vdef(b => { b.geo(GEO.dod, '#c89a5a', 0, .4, 0, 1.2, .8, 1); b.geo(GEO.dod, '#b8884a', .8, .25, .2, .6, .5, .6); }),
  bones: vdef(b => { for (let i = 0; i < 5; i++) b.geo(GEO.tor, '#f2ead8', 0, .1, -.6 + i * .3, .5, .5, .5, 0, Math.PI / 2, 0); b.box(.1, .1, 1.6, '#f2ead8', 0, .05, 0); b.ball(.3, '#f2ead8', 0, .25, 1.05); }),
  column: vdef(b => { b.box(1, .3, 1, '#d8c89a', 0, .15, 0); b.tcyl(.35, .38, 2.2, '#e0d2a8', 0, 1.4, 0, 0, 0, 0, 8); b.box(.9, .25, .9, '#d8c89a', 0, 2.6, 0); }),
  palm: vdef(b => { for (let i = 0; i < 6; i++) b.tcyl(.18, .22, .8, '#8a6a40', i * .12, .4 + i * .72, 0, 0, 0, -.14); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; b.box(.4, .06, 2, '#3f9a3a', .7 + Math.sin(a) * .9, 4.3, Math.cos(a) * .9, .45 * Math.cos(a), a, 0); } }),
  crystal: vdef((b, g) => { b.geo(GEO.ico, '#9aa8b8', 0, .2, 0, .8, .4, .8); g.geo(GEO.oct, '#9fe8ff', 0, 1, 0, .35, 1, .35); g.geo(GEO.oct, '#cff6ff', .4, .7, .2, .22, .6, .22, 0, 0, .4); }),
  srockW: vdef(b => { b.geo(GEO.ico, '#c8d6e4', 0, .3, 0, 1, .75, 1); b.geo(GEO.ico, '#f4f8ff', 0, .72, 0, .7, .25, .7); }),
  dtree: vdef(b => { b.tcyl(.16, .3, 3, '#3a2a22', 0, 1.5, 0); b.box(.1, 1.4, .1, '#3a2a22', .4, 2.6, 0, 0, 0, -.7); b.box(.1, 1.1, .1, '#3a2a22', -.35, 2.3, .1, 0, 0, .8); b.box(.08, .8, .08, '#3a2a22', 0, 3.2, -.3, .6, 0, 0); }),
  obsid: vdef((b, g) => { b.cone4(.6, 3, '#1a1220', 0, 1.5, 0, .1, 0, .1); b.cone4(.35, 1.8, '#241830', .6, .9, .2, -.2, 0, -.3); g.box(.06, 1.2, .06, '#ff5a1f', .1, .8, .2); }),
  vrock: vdef((b, g) => { b.geo(GEO.dod, '#2e2220', 0, .4, 0, 1.1, .7, 1); g.box(.6, .05, .08, '#ff6a1a', 0, .72, .3, 0, .4, 0); })
};
const VLIST = {};
function vplace(type, x, z, s, ry, col) { (VLIST[type] || (VLIST[type] = [])).push({ x, y: H(x, z), z, s, ry, col }); }
function spotFree(x, z, pad = 0) {
  const d = Math.hypot(x, z);
  if (d < VILLAGE_R + 1.5 || d > WORLD_R - 3) return false;
  if (distRoad(x, z) < 2.4 + pad) return false;
  for (const f of FLATS) if (Math.hypot(x - f.x, z - f.z) < (f.kind === 'way' ? 3.5 : f.r - 1) + pad) return false;
  for (const l of LAVA) if (Math.hypot(x - l.x, z - l.z) < l.r + 1.5) return false;
  for (const v of MARKS.volcanoes) if (Math.hypot(x - v.x, z - v.z) < v.r * .45) return false;
  return true;
}
function scatterZone(z, type, n, o = {}) {
  const r0 = ZONES[z - 1].r + 1, r1 = (z === 5 ? WORLD_R - 3 : ZONES[z].r - 1);
  let tries = 0, placed = 0;
  while (placed < n && tries++ < n * 12) {
    const a = WR() * TAU, d = Math.sqrt(lerp(r0 * r0, r1 * r1, WR())), x = Math.sin(a) * d, z2 = Math.cos(a) * d;
    if (o.clust && fbm(x * .05 + 9, z2 * .05 + 3) < o.clust) continue;
    if (!spotFree(x, z2, o.pad || 0)) continue;
    const s = wr(o.s0 || .8, o.s1 || 1.3);
    vplace(type, x, z2, s, WR() * TAU, new T.Color().setScalar(wr(.82, 1.05)));
    if (o.col) addCol(x, z2, o.col * s);
    placed++;
  }
}
function buildVegetation() {
  scatterZone(1, 'tree', 90, { col: .5, clust: .42 }); scatterZone(1, 'bush', 80); scatterZone(1, 'grass', 420, { s0: .7 }); scatterZone(1, 'flowerR', 120); scatterZone(1, 'flowerB', 110); scatterZone(1, 'rock', 40, { col: .7, s0: .5, s1: 1.1 });
  scatterZone(2, 'pine', 300, { col: .55, clust: .36, s0: .9, s1: 1.5 }); scatterZone(2, 'fern', 220); scatterZone(2, 'mush', 70, { s0: .7, s1: 1.6 }); scatterZone(2, 'log', 25); scatterZone(2, 'rock', 50, { col: .7 }); scatterZone(2, 'tree', 40, { col: .5 });
  scatterZone(3, 'cactus', 90, { col: .4 }); scatterZone(3, 'dbush', 100); scatterZone(3, 'srock', 70, { col: .9 }); scatterZone(3, 'bones', 22); scatterZone(3, 'column', 18, { col: .45 });
  scatterZone(4, 'snowpine', 230, { col: .55, clust: .38, s0: .9, s1: 1.5 }); scatterZone(4, 'crystal', 60, { s0: .7, s1: 1.6 }); scatterZone(4, 'srockW', 70, { col: .8 }); scatterZone(4, 'dtree', 25, { col: .3 });
  scatterZone(5, 'dtree', 60, { col: .3 }); scatterZone(5, 'obsid', 70, { col: .5 }); scatterZone(5, 'vrock', 70, { col: .8 }); scatterZone(5, 'bones', 14);
  const oa = MARKS.oasis; for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + .2, r = oa.r + wr(1.5, 3); vplace('palm', oa.x + Math.sin(a) * r, oa.z + Math.cos(a) * r, wr(.9, 1.2), WR() * TAU); addCol(oa.x + Math.sin(a) * r, oa.z + Math.cos(a) * r, .4); }
  const big = { tree: 1, pine: 1, snowpine: 1, cactus: 1, palm: 1, dtree: 1, obsid: 1, column: 1 };
  for (const k in VLIST) {
    const D = VD[k];
    if (D.b) chunkedInstances(D.b, MAT.v, VLIST[k], { shadow: !!big[k] });
    if (D.g) chunkedInstances(D.g, MAT.glow, VLIST[k].map(o => Object.assign({}, o, { col: undefined })), {});
  }
}

/* ---------- Marcos, covis, teleportes, portal ---------- */
function ringOf(B, cx, cz, r, n, f) { for (let i = 0; i < n; i++) { const a = i / n * TAU, x = cx + Math.sin(a) * r, z = cz + Math.cos(a) * r; f(x, H(x, z), z, a, i); } }
function buildMarks() {
  const B = new MB(), G = new MB();
  // moinho
  { const m = MARKS.windmill, y = H(m.x, m.z); B.tcyl(1.6, 2.3, 7, '#e8dcc0', m.x, y + 3.5, m.z, 0, 0, 0, 8); B.cone(2.1, 2.2, '#8a3a2a', m.x, y + 8.1, m.z); B.box(1, 1.8, .2, '#5a3a1e', m.x, y + .9, m.z + 2.1); addCol(m.x, m.z, 2.4);
    const bl = new T.Group(), bb = new MB(); for (let i = 0; i < 4; i++) bb.box(.5, 5, .1, '#d8c8a8', Math.sin(i * Math.PI / 2) * 2.6, Math.cos(i * Math.PI / 2) * 2.6, 0, 0, 0, -i * Math.PI / 2); bb.box(.5, .5, .6, '#5a3a1e', 0, 0, 0);
    const bm = new T.Mesh(bb.build(), MAT.v); bm.castShadow = true; bl.add(bm); bl.position.set(m.x, y + 6.4, m.z + 2.1); scene.add(bl); DYN.blades = bl; }
  // fazenda
  { const f = MARKS.farm, y = H(f.x, f.z);
    for (let r = -3; r <= 3; r++) for (let c = -7; c <= 7; c++) B.box(.6, .5, .6, r % 2 ? '#d8b040' : '#6aa83a', f.x + c * .9, y + .25, f.z + r * 1.8);
    for (let i = -8; i <= 8; i += 2) { [-1, 1].forEach(s => B.box(.15, 1, .15, '#7a5230', f.x + i, y + .5, f.z + s * 7)); }
    [-1, 1].forEach(s => B.box(16, .1, .08, '#7a5230', f.x, y + .75, f.z + s * 7));
    B.box(.15, 2, .15, '#7a5230', f.x + 9, y + 1, f.z); B.box(1.4, .12, .12, '#7a5230', f.x + 9, y + 1.6, f.z); B.ball(.3, '#d8b040', f.x + 9, y + 2.2, f.z); B.cone(.45, .4, '#8a5a2a', f.x + 9, y + 2.55, f.z);
    house(B, G, f.x - 3, f.z - 10, 0, { roof: '#9a2a1a', wall: '#a83a2a', w: 6, d: 5, h: 3.4 }); }
  // pirâmide
  { const p = MARKS.pyramid, y = H(p.x, p.z);
    for (let i = 0; i < 6; i++) B.box(24 - i * 4, 2.2, 24 - i * 4, i % 2 ? '#d8b868' : '#caa858', p.x, y + 1.1 + i * 2.2, p.z);
    G.geo(GEO.oct, '#ffd23f', p.x, y + 14.4, p.z, 1, 1.6, 1);
    B.box(3, 4, .6, '#3a2a1a', p.x, y + 2, p.z - 12.1);
    addCol(p.x, p.z, 12); [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([a, b]) => addCol(p.x + a * 8.5, p.z + b * 8.5, 4.6)); }
  // oásis e lago gelado
  { const oa = MARKS.oasis; disc(oa.x, oa.y - .45, oa.z, oa.r + .6, WATER_MAT); addCol(oa.x, oa.z, oa.r - .4);
    const lk = MARKS.lake, ly = H(lk.x, lk.z); disc(lk.x, ly + .04, lk.z, lk.r, ICE_MAT, 40).receiveShadow = true;
    ringOf(B, lk.x, lk.z, lk.r + 1, 14, (x, y, z) => B.geo(GEO.ico, '#e8f2fa', x, y + .2, z, wr(.6, 1.2), .5, wr(.6, 1.2))); }
  // vulcões e lava
  for (const v of MARKS.volcanoes) { const y = H(v.x, v.z); disc(v.x, y + .3, v.z, v.r * .17, LAVA_MAT, 16); FIRES.push([v.x, y + 1, v.z, 1]); addCol(v.x, v.z, v.r * .42); }
  for (const l of LAVA) { disc(l.x, l.y - .3, l.z, l.r + .4, LAVA_MAT, 20); addCol(l.x, l.z, l.r - .2); }
  // covis dos chefes
  const L = LAIRS;
  ringOf(B, L.reiSlime.x, L.reiSlime.z, L.reiSlime.r + 1.5, 9, (x, y, z, a, i) => { B.geo(GEO.ico, '#7a8a90', x, y + .6, z, 1.1, 1.2, 1.1); B.sph(.5, '#3fa0ff', x, y + 1.4, z, 1, .4, 1); });
  ringOf(B, L.ent.x, L.ent.z, L.ent.r + 1.5, 11, (x, y, z, a, i) => { if (i % 4 === 0) return; B.box(.8, wr(2, 3.5), .6, '#6a6a5a', x, y + 1.2, z, 0, a, wr(-.1, .1)); });
  { const t = MARKS.bigtree, y = H(t.x, t.z); B.tcyl(1.6, 2.6, 9, '#4a3018', t.x, y + 4.5, t.z, 0, 0, 0, 9); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; B.box(.6, .6, 3, '#4a3018', t.x + Math.sin(a) * 2.4, y + .3, t.z + Math.cos(a) * 2.4, 0, a, 0); }
    [[0, 11, 0, 5], [3, 10, 1, 3.5], [-3, 10.5, -1, 3.6], [0, 13, -1.5, 3.2], [1.5, 12, 2.6, 3]].forEach(([x, yy, z, r]) => B.ball(r, '#2a6a2a', t.x + x, y + yy, t.z + z)); addCol(t.x, t.z, 2.6); }
  ringOf(B, L.farao.x, L.farao.z, L.farao.r + 1.5, 8, (x, y, z) => { B.box(1, 5, 1, '#d8c08a', x, y + 2.5, z); B.cone4(.72, 1.1, '#ffd23f', x, y + 5.5, z, 0, Math.PI / 4, 0); addCol(x, z, .8); });
  ringOf(B, L.rainha.x, L.rainha.z, L.rainha.r + 1.5, 10, (x, y, z, a, i) => { if (i % 3 === 1) return; const h = wr(2.5, 5); G.geo(GEO.oct, '#bfefff', x, y + h / 2, z, .7, h / 2, .7); addCol(x, z, .7); });
  { const q = L.rainha, y = H(q.x, q.z - q.r - 2); B.box(3, 1, 2, '#cfe6f6', q.x, y + .5, q.z - q.r - 2); B.box(3, 4, .6, '#bfe0f2', q.x, y + 2.5, q.z - q.r - 2.8); G.geo(GEO.oct, '#9fe8ff', q.x, y + 5.2, q.z - q.r - 2.8, .5, .9, .5); }
  ringOf(B, L.dragao.x, L.dragao.z, L.dragao.r + 2, 12, (x, y, z, a, i) => { B.cone4(.9, wr(4, 7), '#1a1012', x, y + 2.5, z, wr(-.2, .2), 0, wr(-.2, .2)); addCol(x, z, .9); if (i % 3 === 0) B.geo(GEO.tor, '#f2ead8', x * .9 + L.dragao.x * .1, y + .3, z * .9 + L.dragao.z * .1, 1.2, 1.2, 1.2, 0, a, 0); });
  // pedras de teleporte
  DYN.ways = WAYS.map(w => {
    const y = H(w.x, w.z); B.box(2.2, .4, 2.2, '#7a7f8a', w.x, y + .2, w.z); B.tcyl(.35, .6, 3.2, '#8a8f9a', w.x, y + 2, w.z, 0, Math.PI / 4, 0, 4);
    const mat = new T.MeshBasicMaterial({ color: '#5a5f6a' }), rune = new T.Mesh(new T.OctahedronGeometry(.42), mat); rune.position.set(w.x, y + 4.2, w.z); scene.add(rune);
    addCol(w.x, w.z, .8); INTER.push({ kind: 'way', id: w.id, x: w.x, z: w.z, r: 3.2, n: 'Pedra de Teleporte' });
    return { mat, rune, y };
  });
  addBuilt(B, G);
  // Cristal da Aurora (na fonte)
  { const g = new T.Group(); g.position.set(0, 3.7, 0);
    const core = new T.Mesh(GEO.oct, new T.MeshBasicMaterial({ color: '#7a7090' })); core.scale.set(.55, .95, .55); g.add(core);
    const shards = BOSS_ORDER.map(k => { const s = new T.Mesh(GEO.oct, new T.MeshBasicMaterial({ color: BOSS[k].fc })); s.scale.set(.18, .3, .18); s.visible = false; g.add(s); return s; });
    const beam = new T.Mesh(new T.CylinderGeometry(.35, .6, 60, 12, 1, true), new T.MeshBasicMaterial({ color: '#fff2c0', transparent: true, opacity: .25, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }));
    beam.position.y = 30; beam.visible = false; g.add(beam); scene.add(g); DYN.aurora = { g, core, shards, beam }; }
  // portais
  DYN.portal = makePortal(-6.5, -10.5, '#8a40ff', '#2a0a4a'); DYN.portal.g.visible = false;
  INTER.push({ kind: 'portal', x: -6.5, z: -10.5, r: 3, n: 'Portal do Abismo' });
  DYN.exit = makePortal(ABYSS.exit[0], ABYSS.exit[1], '#ffd88a', '#fff6e0');
  INTER.push({ kind: 'exit', x: ABYSS.exit[0], z: ABYSS.exit[1], r: 3, n: 'Portal para a Vila' });
  for (const n of NPCS) INTER.push({ kind: 'npc', id: n.id, x: n.x, z: n.z, r: 3.2, n: n.n });
}
const PORTAL_FS = 'uniform float t; uniform vec3 c1; uniform vec3 c2; varying vec2 vUv; void main(){ vec2 p = vUv - .5; float r = length(p) * 2.; float a = atan(p.y, p.x); float s = sin(a * 3. + r * 9. - t * 3.); vec3 col = mix(c1, c2, s * .5 + .5) * (1.3 - r * .5); gl_FragColor = vec4(col, smoothstep(1., .75, r) * .95); }';
function makePortal(x, z, c1, c2) {
  const y = groundY(x, z), g = new T.Group(); g.position.set(x, y, z);
  const ring = new T.Mesh(new T.TorusGeometry(1.9, .28, 8, 28), matC('#3a2a4a')); ring.position.y = 2.3; ring.castShadow = true; g.add(ring);
  const mat = new T.ShaderMaterial({ uniforms: { t: { value: 0 }, c1: { value: new T.Color(c1) }, c2: { value: new T.Color(c2) } }, vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }', fragmentShader: PORTAL_FS, transparent: true, depthWrite: false, side: T.DoubleSide });
  const d = new T.Mesh(new T.CircleGeometry(1.8, 32), mat); d.position.y = 2.3; g.add(d);
  const base = new T.Mesh(cylT(1.2, 1.5, .4, 8), matC('#4a3a5a')); base.position.y = .2; g.add(base);
  scene.add(g); return { g, mat, x, z, c: c1 };
}

/* ---------- O Abismo ---------- */
function buildAbyss() {
  const B = new MB(), G = new MB();
  ABYSS.plats.forEach(([x, z, r], i) => {
    B.tcyl(r, r, .6, '#3a2650', x, -.3, z, 0, 0, 0, 20); B.tcyl(r * .95, r * .2, r * 1.1, '#241830', x, -.6 - r * .55, z, 0, 0, 0, 10);
    for (let k = 0; k < Math.floor(r * .9); k++) { const a = k / Math.floor(r * .9) * TAU, rr = r - .5; G.geo(GEO.oct, k % 2 ? '#b080ff' : '#7a40ff', x + Math.sin(a) * rr, .5, z + Math.cos(a) * rr, .22, .5, .22); }
    for (let k = 0; k < 6; k++) B.box(wr(.4, 1), .08, wr(.4, 1), '#4a3466', x + wr(-r * .6, r * .6), .02, z + wr(-r * .6, r * .6), 0, wr(0, 3), 0);
    if (i === 3) { ringOf(B, x, z, r - 3, 8, (px, py, pz) => { B.box(1.2, 6, 1.2, '#2a1a3a', px, 3, pz); G.geo(GEO.oct, '#ff4aff', px, 6.8, pz, .5, .8, .5); addCol(px, pz, 1); }); G.geo(GEO.torF, '#8a40ff', x, .05, z, 8, 8, 1, Math.PI / 2, 0, 0); }
  });
  ABYSS.bridges.forEach(([x, z1, , z2, w]) => { for (let z = z2; z <= z1; z += .8) B.box(w, .2, .7, (Math.round(z) % 2) ? '#4a3a2a' : '#5a4a3a', x, -.1, z); [-1, 1].forEach(s => { B.box(.15, .8, .15, '#2a1a3a', x + s * w / 2, .4, z1); B.box(.15, .8, .15, '#2a1a3a', x + s * w / 2, .4, z2); G.ball(.15, '#b080ff', x + s * w / 2, .9, z1); G.ball(.15, '#b080ff', x + s * w / 2, .9, z2); }); });
  for (let i = 0; i < 50; i++) { const x = 1000 + wr(-90, 90), z = wr(-140, 120); if (Math.abs(x - 1000) < 30) continue; B.geo(GEO.dod, '#2a1a3a', x, wr(-30, 8), z, wr(1, 4), wr(1, 3), wr(1, 4)); }
  addBuilt(B, G);
  const sg = new T.BufferGeometry(), sp = [];
  for (let i = 0; i < 900; i++) { const a = R() * TAU, b = R() * Math.PI - Math.PI / 2, r = 320; sp.push(1000 + Math.cos(a) * Math.cos(b) * r, Math.sin(b) * r * .8 + 40, Math.sin(a) * Math.cos(b) * r); }
  sg.setAttribute('position', new T.Float32BufferAttribute(sp, 3));
  scene.add(new T.Points(sg, new T.PointsMaterial({ color: '#e8d8ff', size: 2, sizeAttenuation: false, fog: false })));
  const moon = new T.Mesh(new T.SphereGeometry(55, 24, 16), new T.MeshBasicMaterial({ color: '#5a2a8a', fog: false })); moon.position.set(1180, -40, -330); scene.add(moon);
}

/* ---------- Acampamentos de monstros ---------- */
function buildCamps() {
  const B = new MB(), G = new MB();
  for (const key in CAMPS) {
    const sp = SP[key], [nc, per] = CAMPS[key], r0 = ZONES[sp.z - 1].r + 5, r1 = (sp.z === 5 ? WORLD_R - 6 : ZONES[sp.z].r - 5);
    const a0 = lerp(r0, r1, sp.band[0]), a1 = lerp(r0, r1, sp.band[1]);
    let made = 0, tries = 0;
    while (made < nc && tries++ < 400) {
      const a = WR() * TAU, d = wr(a0, a1), x = Math.sin(a) * d, z = Math.cos(a) * d;
      if (!spotFree(x, z, 3)) continue;
      if (Object.values(LAIRS).some(l => Math.hypot(x - l.x, z - l.z) < l.r + 12)) continue;
      if (WAYS.some(w => Math.hypot(x - w.x, z - w.z) < 10)) continue;
      if (CAMPLIST.some(c => Math.hypot(x - c.x, z - c.z) < 13)) continue;
      if (Math.hypot(x - MARKS.pyramid.x, z - MARKS.pyramid.z) < 20 || Math.hypot(x - MARKS.farm.x, z - MARKS.farm.z) < 14 || Math.hypot(x - MARKS.windmill.x, z - MARKS.windmill.z) < 8) continue;
      CAMPLIST.push({ sp: key, x, z, n: per }); made++;
      const y = H(x, z);
      if (key === 'goblin' || key === 'demonio') {
        const tc = key === 'goblin' ? '#8a6a3a' : '#4a1a1a';
        B.cone4(2, 2.6, tc, x + 2.5, y + 1.3, z - 1.5, 0, .3, 0); B.box(.8, 1.2, .1, '#1a1008', x + 2.5, y + .6, z - .55);
        ringOf(B, x, z, .8, 7, (px, py, pz) => B.geo(GEO.ico, '#6a6a6a', px, y + .15, pz, .25, .2, .25));
        G.cone(.4, .9, key === 'goblin' ? '#ff9a2a' : '#ff4a1a', x, y + .5, z); FIRES.push([x, y + .6, z]);
        addCol(x + 2.5, z - 1.5, 1.6);
      } else if (key === 'mumia') { B.box(1, .8, 2.4, '#c9a858', x + 2, y + .4, z); B.box(1.1, .2, 2.5, '#2a6fd6', x + 2, y + .9, z); addCol(x + 2, z, 1.2); }
      else if (key === 'cavaleiro') { }
    }
  }
  // Abismo
  [[1000, 24, 'sombra', 3], [1000, 24, 'cavaleiro', 2], [1000, -26, 'sombra', 3], [1000, -26, 'cavaleiro', 3]].forEach(([x, z, sp, n]) => CAMPLIST.push({ sp, x, z, n, abyss: 1 }));
  addBuilt(B, G);
}

/* ---------- Mapa do mundo (canvas) ---------- */
const MAPC = document.createElement('canvas'); MAPC.width = MAPC.height = 480;
function buildMapCanvas(col) {
  const c = document.createElement('canvas'); c.width = c.height = GW; const x = c.getContext('2d'), im = x.createImageData(GW, GW);
  for (let k = 0; k < GW * GW; k++) { im.data[k * 4] = col[k * 3] * 255; im.data[k * 4 + 1] = col[k * 3 + 1] * 255; im.data[k * 4 + 2] = col[k * 3 + 2] * 255; im.data[k * 4 + 3] = 255; }
  x.putImageData(im, 0, 0);
  const m = MAPC.getContext('2d'); m.imageSmoothingEnabled = true; m.drawImage(c, 0, 0, 480, 480);
  m.strokeStyle = 'rgba(120,90,50,.85)'; m.lineWidth = 2.6; m.lineCap = 'round';
  for (const s of ROADSEG) { m.beginPath(); m.moveTo(s[0] + 240, s[1] + 240); m.lineTo(s[2] + 240, s[3] + 240); m.stroke(); }
  m.fillStyle = '#cdbf9e'; m.beginPath(); m.arc(240, 240, 11, 0, TAU); m.fill();
  m.fillStyle = '#3a9ad8'; m.beginPath(); m.arc(240 + MARKS.oasis.x, 240 + MARKS.oasis.z, MARKS.oasis.r, 0, TAU); m.fill();
  m.fillStyle = '#d4ecff'; m.beginPath(); m.arc(240 + MARKS.lake.x, 240 + MARKS.lake.z, MARKS.lake.r, 0, TAU); m.fill();
  m.fillStyle = '#ff6a1a'; for (const l of LAVA) { m.beginPath(); m.arc(240 + l.x, 240 + l.z, l.r, 0, TAU); m.fill(); }
  m.fillStyle = '#c9a050'; m.fillRect(240 + MARKS.pyramid.x - 12, 240 + MARKS.pyramid.z - 12, 24, 24);
  m.fillStyle = 'rgba(0,0,0,.35)'; m.beginPath(); m.arc(240, 240, 240, 0, TAU); m.arc(240, 240, WORLD_R, 0, TAU, true); m.fill();
}

function buildWorld() {
  Object.values(LAIRS).forEach(l => { if (l.x < 600) FLATS.push({ x: l.x, z: l.z, r: l.r + 3, fall: 8 }); });
  WAYS.forEach(w => { if (Math.hypot(w.x, w.z) > VILLAGE_R) FLATS.push({ x: w.x, z: w.z, r: 4, fall: 5, kind: 'way' }); });
  FLATS.push({ x: MARKS.pyramid.x, z: MARKS.pyramid.z, r: 18, fall: 8 }, { x: MARKS.windmill.x, z: MARKS.windmill.z, r: 6, fall: 5 }, { x: MARKS.farm.x, z: MARKS.farm.z, r: 12, fall: 6 },
    { x: MARKS.oasis.x, z: MARKS.oasis.z, r: MARKS.oasis.r + 4, fall: 6 }, { x: MARKS.lake.x, z: MARKS.lake.z, r: MARKS.lake.r + 2, fall: 6 });
  for (const f of FLATS) f.y = Hbase(f.x, f.z);
  MARKS.oasis.y = Hbase(MARKS.oasis.x, MARKS.oasis.z);
  let tries = 0;
  while (LAVA.length < 12 && tries++ < 500) {
    const a = WR() * TAU, d = wr(186, 209), x = Math.sin(a) * d, z = Math.cos(a) * d, r = wr(2.2, 3.8);
    if (MARKS.volcanoes.some(v => Math.hypot(x - v.x, z - v.z) < v.r + 4) || Math.hypot(x - LAIRS.dragao.x, z - LAIRS.dragao.z) < 22 || Math.hypot(x - WAYS[5].x, z - WAYS[5].z) < 10 || LAVA.some(l => Math.hypot(x - l.x, z - l.z) < 14)) continue;
    LAVA.push({ x, z, r, y: Hbase(x, z) });
  }
  for (const l of LAVA) FLATS.push({ x: l.x, z: l.z, r: l.r + 1.5, fall: 4, y: l.y });
  for (let j = 0; j < GW; j++) for (let i = 0; i < GW; i++) HG[j * GW + i] = Hraw(GO + i * GS, GO + j * GS);
  const col = buildTerrain();
  buildRoads();
  // a estrada tem prioridade: remove distância de segmentos dentro de rochas etc.
  buildVillage(); buildMarks(); buildCamps(); buildVegetation(); buildAbyss(); buildMapCanvas(col);
}
/* ===================== 07 · JOGO (entidades, combate, sistemas) ===================== */
let P = null, S = null, GAME = 'title';
const MON = [], PPROJ = [], EPROJ = [], LOOT = [], HAZ = [], LATER = [], BOTS = [], NPCM = {};
const later = (t, f) => LATER.push({ t, f });
const PORTAL_Q = MAIN.findIndex(q => q.type === 'portal'), FINAL_Q = MAIN.length - 1;
const tx = s => !P ? s : s.replace(/\{o\}/g, P.f ? 'a' : 'o').replace(/\{nome\}/g, P.name).replace(/\{Heroi\}/g, P.f ? 'Heroína' : 'Herói').replace(/\{um\}/g, P.f ? 'uma' : 'um').replace(/\{classe\}/g, CLS[P.cls].n[P.f].toLowerCase());
const inAbyss = () => PL.x > 600;
const inTown = () => !inAbyss() && Math.hypot(PL.x, PL.z) < VILLAGE_R;
const bossesBeaten = () => BOSS_ORDER.filter(k => P.boss[k]).length;
const fragsDelivered = () => MAIN.slice(0, P.q).filter(q => q.type === 'deliver').length;

/* ---------- Novo personagem ---------- */
function newChar(name, cls, f, look) {
  return {
    v: 2, name, cls, f, look, lv: 1, xp: 0, gold: 60, pts: 0, attr: { pod: 0, vit: 0, agi: 0, sab: 0 }, sk: { [SKILLS[cls][0].id]: 1 }, spts: 0,
    hp: 9999, mp: 9999, inv: [], eq: {}, cons: { h1: 5, m1: 3, scroll: 2 }, mats: {}, q: 0, qc: 0, side: {}, bnt: [], bOff: [], bdone: 0,
    boss: {}, ways: [0], ach: {}, kills: 0, elites: 0, deaths: 0, time: 0, ng: 0, x: SPAWN[0], z: SPAWN[1], exp: '', uid: 1, shop: null, shopT: -1
  };
}

/* ---------- Itens ---------- */
const tierOf = il => il <= 3 ? 0 : il <= 7 ? 1 : il <= 12 ? 2 : il <= 17 ? 3 : il <= 22 ? 4 : il <= 27 ? 5 : 6;
function rollRar(boost = 0) { const w = [60, 28, 9, 2.6, .4].map((v, i) => v * Math.pow(1 + boost, i)); let r = R() * w.reduce((a, b) => a + b); for (let i = 0; i < 5; i++) { r -= w[i]; if (r <= 0) return i; } return 0; }
function genItem(il, slot, rar, cls) {
  il = Math.max(1, Math.round(il)); slot = slot || pick(SLOTS); if (rar == null) rar = rollRar();
  const it = { u: P.uid++, s: slot, t: tierOf(il), il, r: rar, up: 0, af: {} };
  Object.keys(AFX).sort(() => R() - .5).slice(0, RAR[rar].af).forEach(k => it.af[k] = Math.round(AFX[k].v(il) * rn(.8, 1.2) * 10) / 10);
  if (slot === 'arma') it.c = cls || P.cls;
  return it;
}
function itemName(it) {
  const t = it.t, base = it.s === 'arma' ? WNAME[it.c || P.cls][t] : it.s === 'armadura' ? ANAME[t] : it.s === 'elmo' ? HNAME[t] : MNAME[t];
  const k = Object.keys(it.af)[0];
  return (it.r === 4 ? '✦ ' : '') + base + (k ? ' ' + AFX[k].suf : '') + (it.up ? ` +${it.up}` : '');
}
function itemStats(it) {
  const m = RAR[it.r].m * (1 + it.up * .08), il = it.il, o = {};
  if (it.s === 'arma') o.atk = (5 + il * 2.6) * m;
  else if (it.s === 'armadura') { o.def = (2 + il * 1.1) * m; o.hp = il * 4 * m; }
  else if (it.s === 'elmo') { o.def = (1 + il * .6) * m; o.hp = il * 3 * m; }
  else { o.atk = (2 + il * .8) * m; o.hp = (5 + il * 3) * m; }
  for (const k in it.af) o[k] = (o[k] || 0) + it.af[k];
  return o;
}
const itemValue = it => Math.round((10 + Math.pow(it.il, 1.5) * 4) * (1 + it.r * .8) * (1 + it.up * .15));
const itemIcon = it => it.s === 'arma' ? CLS[it.c || P.cls].i : SLOT_I[it.s];
function addItem(it) { if (P.inv.length >= 36) { toast('🎒 Mochila cheia!', '#ff7a7a'); return false; } P.inv.push(it); if (it.r >= 3) AU.play('rare'); else AU.play('pickup'); log(`Você obteve <b style="color:${RAR[it.r].c}">${esc(itemName(it))}</b>`); refreshWin(); return true; }
function equip(it) {
  const i = P.inv.indexOf(it); if (i < 0) return;
  if (it.s === 'arma' && it.c && it.c !== P.cls) return toast('Essa arma não é da sua classe', '#ff7a7a');
  P.inv.splice(i, 1); if (P.eq[it.s]) P.inv.push(P.eq[it.s]); P.eq[it.s] = it;
  if (it.r === 4) ach('legend');
  AU.play('open'); buildPlayer(); calc(); refreshWin();
}
function unequip(slot) { if (!P.eq[slot]) return; if (P.inv.length >= 36) return toast('🎒 Mochila cheia!'); P.inv.push(P.eq[slot]); delete P.eq[slot]; buildPlayer(); calc(); refreshWin(); }
function sellItem(it) { const i = P.inv.indexOf(it); if (i < 0) return; P.inv.splice(i, 1); const v = Math.round(itemValue(it) / 4); P.gold += v; AU.play('coin'); log(`Vendeu ${esc(itemName(it))} por ${v}💰`); refreshWin(); }

/* ---------- Atributos ---------- */
function calc() {
  const c = CLS[P.cls], L = P.lv, A = P.attr;
  const s = { atk: 6 + 2.2 * L + A.pod * 2, def: L * .5 + A.vit * .4, hp: 90 + L * (12 + c.hpL * 2) + A.vit * 12, mp: 40 + L * (4 + c.mpL * 2) + A.sab * 6, crit: 5 + A.agi * .35, aspd: A.agi * .8, move: 0, ls: 0, cdm: 150, skd: A.sab };
  for (const sl of SLOTS) { const it = P.eq[sl]; if (it) { const o = itemStats(it); for (const k in o) s[k] += o[k]; } }
  if (P.cls === 'w') { s.def *= 1.1; s.ls += 3; } if (P.cls === 'a') { s.crit += 8; s.cdm += 25; } if (P.cls === 'm') { s.mp *= 1.2; s.skd += 15; }
  const b = PL.buffs; if (b.grito > 0) { s.atk *= 1.35; s.def *= 1.35; } if (b.instinto > 0) { s.aspd += 50; s.crit += 20; } if (b.salto > 0) s.move += 30;
  if (PL.slowT > 0) s.move -= 40;
  s.hp = Math.round(s.hp); s.mp = Math.round(s.mp); s.atk = Math.round(s.atk); s.def = Math.round(s.def);
  S = s; P.hp = Math.min(P.hp, s.hp); P.mp = Math.min(P.mp, s.mp);
  return s;
}

/* ---------- Jogador ---------- */
const PL = { g: new T.Group(), o: null, x: 0, z: 7, y: 0, ry: Math.PI, ph: 0, moving: false, atkCd: 0, anim: null, dash: null, dodgeCd: 0, invT: 0, tgt: null, mv: null, pend: null, skc: [0, 0, 0, 0, 0], potCd: 0, buffs: {}, shield: 0, slowT: 0, burnT: 0, burnD: 0, rootT: 0, stunT: 0, curseT: 0, combatT: 0, dead: false, deadT: 0, saltoShots: 0, wep: null, shieldMesh: null, regenT: 0, interact: null };
scene.add(PL.g);
{ const sm = new T.Mesh(new T.SphereGeometry(1.5, 16, 12), new T.MeshBasicMaterial({ color: '#b080ff', transparent: true, opacity: .25, blending: T.AdditiveBlending, depthWrite: false })); sm.position.y = 1.3; sm.visible = false; PL.g.add(sm); PL.shieldMesh = sm; }
{ const r = new T.Mesh(new T.RingGeometry(.9, 1.15, 28), new T.MeshBasicMaterial({ color: '#ffd23f', transparent: true, opacity: .8, side: T.DoubleSide, depthWrite: false })); r.rotation.x = -Math.PI / 2; r.renderOrder = 4; scene.add(r); PL.tring = r; r.visible = false; }
{ const a = new T.Mesh(new T.ConeGeometry(.45, 1.1, 4), new T.MeshBasicMaterial({ color: '#ffd23f', transparent: true, opacity: .85, depthWrite: false })); a.rotation.x = Math.PI / 2; const g = new T.Group(); g.add(a); a.position.z = 3.2; scene.add(g); PL.arrow = g; }
function playerLook() {
  const ar = P.eq.armadura, hl = P.eq.elmo, ct = ar ? ar.t : 0, L = P.look;
  const o = { skin: L.skin, hair: L.hair, hs: L.hs, shirt: ar ? ACOL[ct] : CLS[P.cls].c, pants: ar ? '#3a3448' : '#4a3a2a', boots: '#3a2a1a', belt: '#3a2a1a' };
  if (ar && ar.r >= 2) o.trim = TCOL[ct]; if (ar && ct >= 3) o.pads = TCOL[ct]; if (ar && ar.r >= 3) o.cape = RAR[ar.r].c;
  if (hl) o.helm = hl.t; else if (P.cls === 'm') o.wizhat = ar ? ACOL[ct] : '#4a3a9a';
  if (P.cls === 'a') o.quiver = 1; if (P.cls === 'm') { o.robe = ar ? ACOL[ct] : '#4a3a9a'; o.robeTrim = TCOL[ct]; }
  if (P.f && !o.hs) o.hs = 'long';
  return o;
}
function buildPlayer() {
  if (PL.o) PL.g.remove(PL.o.g);
  PL.o = instModel(humanDef(playerLook())); PL.g.add(PL.o.g);
  const w = P.eq.arma; PL.wep = weaponGroup(P.cls, w ? w.t : 0, w ? w.r : 0, w ? w.up : 0);
  (P.cls === 'a' ? PL.o.limbs[0] : PL.o.limbs[1]).p.add(PL.wep);
  if (P.cls === 'w') PL.wep.children[0].rotation.x = Math.PI / 2.6;
}
function placePlayer(x, z) { PL.x = x; PL.z = z; PL.tgt = null; PL.mv = null; PL.pend = null; CAM.ready = false; }

/* ---------- Monstros ---------- */
let MUID = 1;
function makeMon(key, x, z, o = {}) {
  const isB = !!BOSS[key], sp = isB ? BOSS[key] : SP[key];
  const base = o.lv || (isB ? sp.lv : (sp.lv ? Math.round(rn(sp.lv[0], sp.lv[1])) : 1));
  const lv = base + (sp.dummy ? 0 : P.ng * 30);
  let elite = o.elite || null;
  if (!elite && !isB && !sp.dummy && !o.summon && sp.z && R() < .07) elite = pick(Object.keys(ELITE_AFX));
  const D = getDef(key, sp), k = (sp.k || D.k || 1) * (elite ? 1.25 : 1);
  const inst = instModel(D, elite ? MAT.elite : null); inst.g.scale.setScalar(k);
  scene.add(inst.g);
  let hp = mHP(lv) * sp.hp * (elite ? (elite === 'Robusto' ? 4 : 2.5) : 1);
  if (sp.dummy) hp = 99999;
  const m = {
    id: MUID++, key, sp, isB, lv, max: Math.round(hp), hp: Math.round(hp), atk: mATK(lv) * sp.at * (elite ? 1.4 : 1), elite, o: inst, g: inst.g, x, z, y: 0, ry: R() * TAU,
    home: { x, z }, camp: o.camp, st: 'idle', cd: rn(0, 1), wind: 0, tx: x, tz: z, wt: rn(1, 4), stun: 0, slowT: 0, burnT: 0, burnD: 0, burnTick: 0, dead: false, deadT: 0,
    r: D.r * k, h: D.h * k, fly: D.fly ? D.fly * k : 0, spd: sp.spd * (elite === 'Veloz' ? 1.45 : 1), rng: sp.rng || 0, ph: R() * 6, flash: 0, summon: !!o.summon, spawnT: .6, abT: 3, busy: 0, abI: 0, th: {}, awake: false, owner: o.owner
  };
  const ui = new T.Group(), lb = makeLabel((elite ? '⭐ ' + elite + ' ' : '') + sp.n + ' · Nv ' + lv, isB ? '#ff9a5a' : elite ? '#ffd23f' : '#ffffff', 28, isB ? .75 : .5);
  const bar = makeBar(isB ? 2.6 : 1.3, isB ? 'gold' : 'red'); bar.position.y = -.05; lb.position.y = .12; ui.add(lb, bar); ui.visible = false; scene.add(ui);
  m.ui = ui; m.bar = bar;
  MON.push(m); return m;
}
function removeMon(m) { scene.remove(m.g); scene.remove(m.ui); const i = MON.indexOf(m); if (i >= 0) MON.splice(i, 1); if (PL.tgt === m) PL.tgt = null; }
function spawnAll() {
  for (const m of MON.slice()) removeMon(m);
  for (const c of CAMPLIST) for (let i = 0; i < c.n; i++) { const a = i / c.n * TAU + R(), r = rn(1.5, 5); makeMon(c.sp, c.x + Math.sin(a) * r, c.z + Math.cos(a) * r, { camp: c }); }
  for (const k in LAIRS) { const l = LAIRS[k]; makeMon(k, l.x, l.z); }
  [[10.5, 13.5], [13, 11], [13.6, 15]].forEach(([x, z]) => makeMon('boneco', x, z));
}
function nearestEnemy(rad, from) {
  from = from || PL; let best = null, bd = rad;
  for (const m of MON) { if (m.dead || m.untarget || m.sp.dummy && rad < 99 && !inTown()) continue; const d = Math.hypot(m.x - from.x, m.z - from.z) - m.r; if (d < bd) { bd = d; best = m; } }
  return best;
}
const mdist = m => Math.hypot(m.x - PL.x, m.z - PL.z);

/* ---------- Dano ---------- */
function hitMon(m, base, o = {}) {
  if (!m || m.dead || m.untarget || m.st === 'return') return 0;
  let crit = o.crit || R() * 100 < S.crit;
  if (o.basic && P.cls === 'a' && PL.saltoShots > 0) { crit = true; PL.saltoShots--; }
  let d = base * rn(.9, 1.1) * (crit ? S.cdm / 100 : 1);
  if (o.skill) d *= 1 + S.skd / 100;
  d = Math.max(1, Math.round(d));
  m.hp -= d; m.flash = .12; PL.combatT = 6;
  dmgText(m.x, m.y + m.h * .8, m.z, (crit ? '💥' : '') + fmt(d), crit ? '#ffd23f' : o.col || '#ffffff', crit);
  AU.play(crit ? 'crit' : 'hit');
  if (S.ls > 0 && !m.sp.dummy) healP(d * S.ls / 100 * (o.skill ? .5 : 1), true);
  if (o.stun && !m.isB) m.stun = Math.max(m.stun, o.stun); else if (o.stun && m.isB) m.stun = Math.max(m.stun, o.stun * .25);
  if (o.slow) m.slowT = Math.max(m.slowT, o.slow);
  if (o.burn) { m.burnT = 3; m.burnD = S.atk * .25; }
  if (!m.isB && m.st !== 'chase' && !m.sp.dummy) { m.st = 'chase'; for (const n of MON) if (!n.dead && n !== m && n.camp === m.camp && Math.hypot(n.x - m.x, n.z - m.z) < 10 && n.st === 'idle') n.st = 'chase'; }
  if (m.sp.dummy) { m.hp = Math.max(1, m.hp); m.regen = 4; }
  if (m.hp <= 0) killMon(m);
  return d;
}
function healP(n, quiet) { if (PL.dead) return; if (PL.curseT > 0) n *= .5; n = Math.round(n); if (n <= 0) return; const b = P.hp; P.hp = Math.min(S.hp, P.hp + n); if (!quiet && P.hp > b) dmgText(PL.x, PL.y + 2.6, PL.z, '+' + fmt(P.hp - b), '#5fe08a'); }
function hurtP(raw, src, o = {}) {
  if (PL.dead || GAME !== 'play') return;
  if (PL.invT > 0) { if (PL.dash) dmgText(PL.x, PL.y + 2.4, PL.z, 'Esquiva!', '#9fe0ff'); return; }
  const lv = src ? src.lv : P.lv, red = S.def / (S.def + 40 + 8 * lv);
  let d = Math.max(1, Math.round(raw * rn(.88, 1.12) * (1 - red)));
  if (PL.shield > 0) { const a = Math.min(PL.shield, d); PL.shield -= a; d -= a; if (a > 0) dmgText(PL.x, PL.y + 2.2, PL.z, '🛡' + fmt(a), '#c9a8ff'); }
  if (d <= 0) return;
  P.hp -= d; PL.combatT = 6; PL.hurtFlash = .15; PL.bossHit = true;
  dmgText(PL.x, PL.y + 2.4, PL.z, '-' + fmt(d), '#ff5c5c', d > S.hp * .15);
  AU.play('hurt'); if (d > S.hp * .12) shake(.35);
  $('#hurt').style.opacity = Math.min(.8, .25 + d / S.hp * 2);
  if (src && src.elite === 'Vampírico') src.hp = Math.min(src.max, src.hp + src.max * .05);
  if (o.slow || (src && (src.sp.slowHit || src.elite === 'Gélido'))) PL.slowT = Math.max(PL.slowT, o.slow || 2);
  if (o.burn || (src && src.sp.burnHit)) { PL.burnT = 3; PL.burnD = raw * .06; }
  if (o.root) PL.rootT = Math.max(PL.rootT, o.root);
  if (o.curse) { PL.curseT = 6; toast('☠️ Amaldiçoad' + (P.f ? 'a' : 'o') + ': cura reduzida!', '#ffd23f'); }
  if (P.hp <= 0) dieP();
}
function dieP() {
  P.hp = 0; PL.dead = true; PL.deadT = 0; PL.tgt = null; PL.mv = null; PL.pend = null; P.deaths++;
  const lost = Math.floor(P.gold * .1); P.gold -= lost;
  AU.play('pdie'); clearTeles(); for (const h of HAZ) h.t = 0;
  setTimeout(() => showDeath(lost), 1200);
}
function respawn() {
  PL.dead = false; P.hp = Math.round(S.hp * .6); P.mp = Math.round(S.mp * .6); PL.burnT = PL.slowT = PL.rootT = PL.curseT = 0;
  if (inAbyss()) placePlayer(ABYSS.spawn[0], ABYSS.spawn[1]); else placePlayer(SPAWN[0], SPAWN[1]);
  PL.invT = 2; hideOverlay(); AU.play('heal');
}

/* ---------- Morte dos monstros e recompensas ---------- */
function killMon(m) {
  m.dead = true; m.deadT = 0; m.hp = 0; m.ui.visible = false; if (PL.tgt === m) PL.tgt = null;
  FX.burst(m.x, m.y + m.h * .5, m.z, m.sp.c, 22, 6, .8, .7);
  AU.play('mdie');
  if (m.summon) { m.resp = -1; return; }
  m.resp = m.isB ? 180 : 25;
  let xp = mXP(m.lv) * (m.isB ? 12 : m.elite ? 3 : 1);
  const diff = P.lv - m.lv; if (diff > 3) xp *= clamp(1 - (diff - 3) * .15, .1, 1); else if (diff < 0) xp *= Math.min(1.5, 1 - diff * .1);
  if (PL.buffs.elixir > 0) xp *= 1.5;
  gainXP(Math.round(xp));
  const gold = Math.round((2 + m.lv * 1.6) * rn(.7, 1.3) * (m.isB ? 15 : m.elite ? 3 : 1));
  dropGold(m.x, m.z, gold);
  const it = m.isB ? 1 : m.elite ? .35 : .055;
  if (R() < it) dropItem(m.x, m.z, genItem(m.lv, null, rollRar(m.elite ? 1 : 0)));
  if (R() < .12) dropCons(m.x, m.z, R() < .55 ? (m.lv > 15 ? 'h2' : 'h1') : (m.lv > 15 ? 'm2' : 'm1'));
  P.kills++; ach('kill1'); if (P.kills >= 100) ach('kill100'); if (P.kills >= 500) ach('kill500');
  if (m.elite) { P.elites++; if (P.elites >= 10) ach('elite10'); }
  if (m.elite === 'Explosivo') { const ex = m.x, ez = m.z, lv = m.lv, at = m.atk; tele({ shape: 'circle', x: ex, z: ez, r: 4, dur: 1.2, col: '#ff8a2a', done: o => { FX.burst(ex, 1, ez, '#ff8a2a', 30, 8, .7, .9); AU.play('boom'); if (inShape(o, PL.x, PL.z)) hurtP(at * 2, { lv, sp: {} }); } }); }
  questKill(m);
  if (m.isB) bossDown(m);
  if (P.gold >= 5000) ach('rich');
}
function gainXP(n) {
  if (P.lv >= MAXLV) return;
  P.xp += n; dmgText(PL.x, PL.y + 3, PL.z, '+' + fmt(n) + ' XP', '#c9a8ff');
  while (P.xp >= needXP(P.lv) && P.lv < MAXLV) {
    P.xp -= needXP(P.lv); P.lv++; P.pts += 3; P.spts++;
    const nw = SKILLS[P.cls].filter(s => s.lv === P.lv); nw.forEach(s => { P.sk[s.id] = 1; });
    calc(); P.hp = S.hp; P.mp = S.mp;
    FX.beam(PL.x, PL.y, PL.z, '#ffd23f', 6, 60); FX.ring(PL.x, PL.y + .3, PL.z, '#ffd23f', 5, 40);
    AU.play('level'); banner('⭐ Nível ' + P.lv + '!', nw.length ? 'Nova habilidade: ' + nw.map(s => s.i + ' ' + s.n).join(', ') : '+3 pontos de atributo · +1 ponto de habilidade');
    log(`<b style="color:#ffd23f">Você alcançou o nível ${P.lv}!</b>`);
    if (P.lv >= 30) ach('lv30');
    tip('lvl', 'Você tem pontos para distribuir! Abra o Personagem (C) e as Habilidades (K).');
  }
}
/* ---------- Loot no chão ---------- */
const COIN_GEO = new T.CylinderGeometry(.22, .22, .06, 10), BAG_GEO = new T.BoxGeometry(.5, .5, .5);
function dropGold(x, z, v) {
  const n = Math.min(4, 1 + Math.floor(v / 40));
  for (let i = 0; i < n; i++) { const me = new T.Mesh(COIN_GEO, matC('#ffd23f', { p: { emissive: new T.Color('#7a5a00'), metalness: .6, roughness: .3 } })); scene.add(me); LOOT.push({ kind: 'gold', v: Math.ceil(v / n), x: x + rn(-1, 1), z: z + rn(-1, 1), me, t: 0, vy: rn(4, 6) }); }
}
function dropItem(x, z, it) { const me = new T.Mesh(BAG_GEO, matC(RAR[it.r].c, { p: { emissive: new T.Color(RAR[it.r].c), emissiveIntensity: .5 } })); scene.add(me); LOOT.push({ kind: 'item', it, x: x + rn(-1, 1), z: z + rn(-1, 1), me, t: 0, vy: 5 }); }
function dropCons(x, z, id) { const me = new T.Mesh(SPHG, matC(id[0] === 'h' ? '#ff4a5a' : '#4aa8ff', { p: { emissive: new T.Color(id[0] === 'h' ? '#aa0010' : '#0040aa') } })); me.scale.setScalar(1.4); scene.add(me); LOOT.push({ kind: 'cons', id, x: x + rn(-1, 1), z: z + rn(-1, 1), me, t: 0, vy: 4 }); }
const SPHG = new T.SphereGeometry(.2, 10, 8);
function updateLoot(dt) {
  for (let i = LOOT.length - 1; i >= 0; i--) {
    const l = LOOT[i]; l.t += dt;
    const gy = groundY(l.x, l.z), d = Math.hypot(l.x - PL.x, l.z - PL.z);
    if (l.t < .6) { l.vy -= 18 * dt; l.y = (l.y == null ? gy + 1 : l.y) + l.vy * dt; if (l.y < gy + .35) { l.y = gy + .35; l.vy = 0; } }
    else l.y = gy + .45 + Math.sin(l.t * 3) * .12;
    l.me.position.set(l.x, l.y, l.z); l.me.rotation.y += dt * 3;
    if (l.kind === 'item' && R() < .3) FX.trail(l.x, l.y + rn(0, 2), l.z, RAR[l.it.r].c, .4, .6);
    if (PL.dead) continue;
    const mag = l.kind === 'gold' ? 6 : 2.2;
    if (l.t > .7 && d < mag) { const k = Math.min(1, dt * 10); l.x = lerp(l.x, PL.x, k); l.z = lerp(l.z, PL.z, k); }
    if (l.t > .7 && d < 1) {
      if (l.kind === 'gold') { P.gold += l.v; AU.play('coin'); dmgText(PL.x, PL.y + 2, PL.z, '+' + l.v + '💰', '#ffd23f'); }
      else if (l.kind === 'cons') { P.cons[l.id] = (P.cons[l.id] || 0) + 1; AU.play('pickup'); log(`Você pegou ${CONS[l.id].i} ${CONS[l.id].n}`); }
      else if (!addItem(l.it)) { l.t = -3; continue; }
      scene.remove(l.me); LOOT.splice(i, 1);
    }
    if (l.t > 240) { scene.remove(l.me); LOOT.splice(i, 1); }
  }
}

/* ---------- Projéteis ---------- */
function projMesh(col, s = 1) { const me = new T.Mesh(SPHG, matC(col, { basic: 1 })); me.scale.setScalar(s); scene.add(me); return me; }
function shootP(tgt, dmg, col, o = {}) {
  const y = PL.y + 1.6;
  PPROJ.push(Object.assign({ x: PL.x, y, z: PL.z, tgt, dmg, col, spd: o.spd || 28, me: projMesh(col, o.size || 1), life: 2 }, o));
  AU.play(P.cls === 'a' ? 'arrow' : 'magic');
}
function updateProj(dt) {
  for (let i = PPROJ.length - 1; i >= 0; i--) {
    const p = PPROJ[i]; p.life -= dt; let done = p.life <= 0;
    if (p.dir) {
      const s = p.spd * dt; p.x += p.dir[0] * s; p.z += p.dir[1] * s; p.trav = (p.trav || 0) + s;
      for (const m of MON) if (!m.dead && !p.hits.has(m) && Math.hypot(m.x - p.x, m.z - p.z) < m.r + .8) { p.hits.add(m); hitMon(m, p.dmg, { skill: 1, col: '#9fe0ff' }); }
      if (p.trav > p.len) done = true;
    } else {
      const t = p.tgt; if (!t || t.dead) done = true;
      else {
        const ty = t.y + t.h * .55, dx = t.x - p.x, dy = ty - p.y, dz = t.z - p.z, d = Math.hypot(dx, dy, dz), s = p.spd * dt;
        if (d < s + .4) { done = true; hitMon(t, p.dmg, p.hit || {}); if (p.onHit) p.onHit(t); }
        else { p.x += dx / d * s; p.y += dy / d * s; p.z += dz / d * s; }
      }
    }
    p.me.position.set(p.x, p.y, p.z); FX.trail(p.x, p.y, p.z, p.col, .45 * (p.size || 1), .25);
    if (done) { scene.remove(p.me); PPROJ.splice(i, 1); }
  }
  for (let i = EPROJ.length - 1; i >= 0; i--) {
    const p = EPROJ[i]; p.life -= dt;
    p.x += p.vx * dt; p.z += p.vz * dt; p.y = lerp(p.y, groundY(p.x, p.z) + 1.3, dt * 2);
    p.me.position.set(p.x, p.y, p.z); FX.trail(p.x, p.y, p.z, p.col, .55, .3);
    let done = p.life <= 0;
    if (!done && !PL.dead && Math.hypot(p.x - PL.x, p.z - PL.z) < .9) { hurtP(p.dmg, p.src, p.o); done = true; FX.burst(p.x, p.y, p.z, p.col, 10, 4, .4, .5); }
    if (done) { scene.remove(p.me); EPROJ.splice(i, 1); }
  }
}
function shootE(m, ang, spd, dmg, col, o = {}) {
  const y = m.y + m.h * .6;
  EPROJ.push({ x: m.x + Math.sin(ang) * m.r, y, z: m.z + Math.cos(ang) * m.r, vx: Math.sin(ang) * spd, vz: Math.cos(ang) * spd, dmg, col, src: m, o, life: 3.2, me: projMesh(col, 1.6) });
}

/* ---------- IA dos monstros ---------- */
function moveMon(m, tx, tz, sp, dt) {
  const dx = tx - m.x, dz = tz - m.z, d = Math.hypot(dx, dz); if (d < .05) return 0;
  const s = Math.min(d, sp * dt * (m.slowT > 0 ? .5 : 1)); const p = { x: m.x, z: m.z };
  moveSmart(p, dx / d, dz / d, s, m.r * .6, tx, tz); m.x = p.x; m.z = p.z;
  m.ry = lerpAng(m.ry, Math.atan2(dx, dz), Math.min(1, dt * 10));
  return d;
}
function lerpAng(a, b, t) { return a + angDiff(a, b) * t; }
function updateMonsters(dt, t) {
  const town = inTown(), abyss = inAbyss();
  for (let i = MON.length - 1; i >= 0; i--) {
    const m = MON[i];
    const far = (m.x > 600) !== abyss || Math.abs(m.x - PL.x) > 62 || Math.abs(m.z - PL.z) > 62;
    m.g.visible = !far && (!m.dead || m.deadT < .8);
    if (m.dead) {
      m.deadT += dt;
      if (m.deadT < .8) { m.o.inner.rotation.z = Math.min(1.5, m.deadT * 3); m.g.position.y = m.y - m.deadT * m.h * .4; m.g.scale.setScalar((m.sp.k || m.o.D.k || 1) * (m.elite ? 1.25 : 1) * (1 - m.deadT)); }
      if (m.resp < 0) { if (m.deadT > .8) removeMon(m); continue; }
      if (m.deadT > m.resp && Math.hypot(m.home.x - PL.x, m.home.z - PL.z) > 22) { const c = m.camp; removeMon(m); makeMon(m.key, m.home.x, m.home.z, { camp: c }); }
      continue;
    }
    if (far && !m.isB) continue;
    if (far && m.isB && !m.awake) continue;
    m.flash -= dt; m.stun -= dt; m.slowT -= dt; m.cd -= dt; m.spawnT -= dt;
    if (m.regen != null) { m.regen -= dt; if (m.regen <= 0) { m.hp = m.max; m.regen = null; } }
    if (m.burnT > 0) { m.burnT -= dt; m.burnTick -= dt; if (m.burnTick <= 0) { m.burnTick = .5; const d = Math.round(m.burnD * .5); m.hp -= d; dmgText(m.x, m.y + m.h, m.z, fmt(d), '#ff9a3a'); FX.rise(m.x, m.y + m.h * .5, m.z, '#ff7a1a', 4); if (m.hp <= 0) { killMon(m); continue; } } }
    const d = mdist(m);
    let moving = false;
    if (m.sp.dummy) { }
    else if (m.isB) moving = bossAI(m, dt, d);
    else if (m.stun > 0) { }
    else if (m.st === 'return') {
      moving = moveMon(m, m.home.x, m.home.z, m.spd * 1.8, dt) > .5; m.hp = Math.min(m.max, m.hp + m.max * dt * .5);
      if (!moving) m.st = 'idle';
    } else {
      const aggroR = m.elite ? 10 : 8;
      if (m.st === 'idle' && !town && !PL.dead && d < aggroR && GAME === 'play') m.st = 'chase';
      if (m.st === 'chase') {
        if (PL.dead || town || Math.hypot(m.x - m.home.x, m.z - m.home.z) > 34 || d > 30) { m.st = 'return'; m.wind = 0; }
        else moving = monFight(m, dt, d);
      } else {
        m.wt -= dt; if (m.wt <= 0) { m.tx = m.home.x + rn(-5, 5); m.tz = m.home.z + rn(-5, 5); m.wt = rn(3, 7); }
        if (Math.hypot(m.tx - m.x, m.tz - m.z) > .4) { moveMon(m, m.tx, m.tz, m.spd * .4, dt); moving = true; }
      }
    }
    // separação
    if (moving && !m.isB) for (const n of MON) { if (n === m || n.dead || n.isB) continue; const dx = m.x - n.x, dz = m.z - n.z, dd = dx * dx + dz * dz, rr = (m.r + n.r) * .8; if (dd < rr * rr && dd > 1e-4) { const q = Math.sqrt(dd), push = (rr - q) * .5; m.x += dx / q * push; m.z += dz / q * push; } }
    // visual
    m.ph += dt * (moving ? 9 : 2.5);
    const gy = groundY(m.x, m.z); m.y = gy + (m.fly ? m.fly + Math.sin(t * 2.5 + m.id) * .25 : 0);
    m.g.position.set(m.x, m.y + (m.lift || 0), m.z); m.g.rotation.y = m.ry;
    if (m.spawnT > 0) m.g.scale.setScalar((m.sp.k || m.o.D.k || 1) * (m.elite ? 1.25 : 1) * (1 - m.spawnT / .6));
    const an = m.o.D.anim; const inner = m.o.inner;
    if (an === 'bounce') { inner.position.y = Math.abs(Math.sin(m.ph * .7)) * (moving ? .35 : .06); inner.scale.y = 1 + Math.sin(m.ph * 1.4) * .06; }
    else if (an === 'sway') inner.rotation.z = Math.sin(t * 2 + m.id) * .08;
    else inner.position.y = moving ? Math.abs(Math.sin(m.ph)) * .08 : 0;
    if (m.wind > 0) inner.rotation.x = -.35 * Math.min(1, m.wind * 3); else inner.rotation.x = lerp(inner.rotation.x, 0, .3);
    animLimbs(m.o, m.ph, moving || m.wind > 0, t);
    const fm = m.flash > 0 ? MAT.flash : m.stun > 0 && !m.isB ? MAT.frost : (m.elite ? MAT.elite : m.o.baseMat);
    if (m.curMat !== fm) { setModelMat(m.o, fm); m.curMat = fm; }
    if (m.stun > 0 && R() < .2) FX.rise(m.x, m.y + m.h + .2, m.z, '#ffe680', 1, .4, .5, .4, .25);
    // interface
    const show = d < 34 && (PL.tgt === m || m.hp < m.max || m.elite || m.isB || HOVER === m);
    m.ui.visible = show && !m.untarget;
    if (show) { m.ui.position.set(m.x, m.y + m.h + .35 + (m.lift || 0), m.z); m.bar.quaternion.copy(cam.quaternion); setBar(m.bar, m.hp / m.max); }
  }
}
function monFight(m, dt, d) {
  const reach = m.r + .5 + 1;
  if (m.wind > 0) {
    m.wind -= dt; m.ry = lerpAng(m.ry, angTo(m.x, m.z, PL.x, PL.z), dt * 6);
    if (m.wind <= 0) {
      if (m.rng) { shootE(m, angTo(m.x, m.z, PL.x, PL.z), 13, m.atk, m.sp.pc || '#ff5a5a', { slow: m.sp.slowHit ? 2 : 0, burn: m.sp.burnHit }); AU.play('magic'); }
      else if (d < reach + .9) { hurtP(m.atk, m); AU.play('swing'); }
      m.cd = (m.elite === 'Veloz' ? .9 : 1.5) * rn(.9, 1.15);
    }
    return false;
  }
  if (m.rng) {
    if (d > m.rng) { moveMon(m, PL.x, PL.z, m.spd, dt); return true; }
    if (m.cd <= 0) { m.wind = .55; return false; }
    if (d < m.rng * .4) { moveMon(m, m.x * 2 - PL.x, m.z * 2 - PL.z, m.spd * .6, dt); return true; }
    m.ry = lerpAng(m.ry, angTo(m.x, m.z, PL.x, PL.z), dt * 6); return false;
  }
  if (d > reach) { moveMon(m, PL.x, PL.z, m.spd, dt); return true; }
  m.ry = lerpAng(m.ry, angTo(m.x, m.z, PL.x, PL.z), dt * 8);
  if (m.cd <= 0) m.wind = .42;
  return false;
}

/* ---------- Chefes ---------- */
function summon(m, key, n, rad = 4) { for (let i = 0; i < n; i++) { const a = R() * TAU, x = m.x + Math.sin(a) * rad, z = m.z + Math.cos(a) * rad; const s = makeMon(key, x, z, { summon: 1, lv: m.lv - 2 - P.ng * 30, owner: m }); s.st = 'chase'; FX.burst(x, 1, z, '#ffffff', 12, 4, .5, .6); } }
const T_ = (m, o, mult, ex) => tele(Object.assign({ owner: m, done: oo => { if (inShape(oo, PL.x, PL.z)) hurtP(m.atk * mult, m, ex || {}); if (o.fx) o.fx(oo); } }, o));
const BA = {
  salto(m) { const x = PL.x, z = PL.z, sx = m.x, sz = m.z; T_(m, { shape: 'circle', x, z, r: 4.5, dur: 1.3, fx: () => { FX.ring(x, groundY(x, z) + .3, z, '#5ab0ff', 5, 30); AU.play('slam'); shake(.6); } }, 1.6);
    m.jump = { t: 0, d: 1.3, sx, sz, x, z }; return 1.5; },
  divisao(m) { summon(m, 'slimeP', 3); return .8; },
  raizes(m) { for (let i = 0; i < 4; i++) { const x = PL.x + (i ? rn(-4, 4) : 0), z = PL.z + (i ? rn(-4, 4) : 0); later(i * .35, () => T_(m, { shape: 'circle', x, z, r: 2.4, dur: 1.1, fx: () => { FX.burst(x, groundY(x, z) + .3, z, '#6b4a28', 16, 6, .6, .6, -8, false); AU.play('slam'); } }, 1.3, { root: 1 })); } return 1.8; },
  brotos(m) { summon(m, 'broto', 3); return .8; },
  folhas(m) { const a = angTo(m.x, m.z, PL.x, PL.z); m.ry = a; T_(m, { shape: 'cone', x: m.x, z: m.z, r: 11, ang: a, arc: 1.25, dur: 1.2, fx: o => { for (let i = 0; i < 40; i++) { const aa = a + rn(-.6, .6), r = rn(1, 11); FX.trail(m.x + Math.sin(aa) * r, 1 + R(), m.z + Math.cos(aa) * r, '#7dff6a', .7, .5); } AU.play('swing'); } }, 1.5); return 1.5; },
  maldicao(m) { const a = angTo(m.x, m.z, PL.x, PL.z); m.ry = a; T_(m, { shape: 'rect', x: m.x, z: m.z, len: 22, w: 3.2, ang: a, dur: 1, col: '#ffd23f', fx: () => { for (let i = 0; i < 22; i += .7) FX.trail(m.x + Math.sin(a) * i, 1.2, m.z + Math.cos(a) * i, '#ffd23f', .9, .5); AU.play('zap'); } }, 1.6, { curse: 1 }); return 1.3; },
  tornado(m) { for (let i = 0; i < 2; i++) HAZ.push({ x: m.x + rn(-3, 3), z: m.z + rn(-3, 3), t: 8, tick: 0, m, dmg: m.atk * .45, col: '#e0c070', spd: 3.3 }); return .8; },
  sarcofago(m) { summon(m, 'mumia', 2, 5); return .8; },
  nova(m) { T_(m, { shape: 'circle', x: m.x, z: m.z, r: 7.5, dur: 1.4, col: '#5ab0ff', fx: () => { FX.ring(m.x, m.y + .5, m.z, '#bfefff', 8, 50); AU.play('ice'); } }, 1.8, { slow: 3 }); if (m.hp < m.max * .5) later(1.6, () => T_(m, { shape: 'ring', x: m.x, z: m.z, r0: 7.5, r: 13, dur: 1.1, col: '#5ab0ff', fx: () => AU.play('ice') }, 1.6, { slow: 3 })); return 1.7; },
  estalactites(m) { for (let i = 0; i < 6; i++) { const x = PL.x + (i ? rn(-6, 6) : 0), z = PL.z + (i ? rn(-6, 6) : 0); T_(m, { shape: 'circle', x, z, r: 2.1, dur: 1.4 + i * .1, col: '#9fe0ff', fx: () => { FX.burst(x, groundY(x, z) + .5, z, '#dff6ff', 14, 5, .5, .5); AU.play('ice'); } }, 1.4); } return 1.2; },
  rajada(m) { const a = angTo(m.x, m.z, PL.x, PL.z); [-.3, 0, .3].forEach(o => shootE(m, a + o, 12, m.atk * .9, '#9fe0ff', { slow: 2 })); AU.play('ice'); return .8; },
  sopro(m) { const a = angTo(m.x, m.z, PL.x, PL.z); m.ry = a; T_(m, { shape: 'cone', x: m.x, z: m.z, r: 14, ang: a, arc: 1.05, dur: 1.2, col: '#ff6a1a', fx: () => { for (let i = 0; i < 70; i++) { const aa = a + rn(-.5, .5), sp = rn(8, 20); PADD.emit(m.x + Math.sin(a) * 2, m.y + 2.4, m.z + Math.cos(a) * 2, Math.sin(aa) * sp, rn(-1, 1), Math.cos(aa) * sp, .7, 1.2, .3, i % 2 ? '#ff6a1a' : '#ffd040', 1, 0, 1); } AU.play('fire'); shake(.4); } }, 2, { burn: 1 }); return 1.5; },
  meteoros(m) { for (let i = 0; i < 8; i++) { const x = PL.x + (i ? rn(-8, 8) : 0), z = PL.z + (i ? rn(-8, 8) : 0); T_(m, { shape: 'circle', x, z, r: 2.6, dur: 1.5 + i * .12, col: '#ff6a1a', fx: () => { FX.burst(x, groundY(x, z) + .5, z, '#ff7a1a', 20, 7, .7, .8); FX.smoke(x, groundY(x, z) + .5, z, '#3a2a2a', 3); AU.play('boom'); shake(.25); } }, 1.6, { burn: 1 }); } return 1.4; },
  voo(m) { m.untarget = true; m.flyUp = { t: 0 }; later(2.4, () => { if (m.dead) return; const x = PL.x, z = PL.z; m.x = x; m.z = z; T_(m, { shape: 'circle', x, z, r: 5.5, dur: 1.2, col: '#ff6a1a', fx: () => { m.untarget = false; m.flyUp = null; FX.ring(x, groundY(x, z) + .4, z, '#ff7a1a', 7, 50); AU.play('slam'); shake(1); } }, 2.4); }); return 3.8; },
  cleave(m) { const a = angTo(m.x, m.z, PL.x, PL.z); m.ry = a; T_(m, { shape: 'cone', x: m.x, z: m.z, r: 7.5, ang: a, arc: 2.1, dur: .9, col: '#b060ff', fx: () => { FX.ring(m.x, 1, m.z, '#b060ff', 6, 30); AU.play('swing'); shake(.3); } }, 1.6); return 1.1; },
  orbes(m) { const n = m.phase >= 2 ? 16 : 12, off = R(); for (let i = 0; i < n; i++) shootE(m, i / n * TAU + off, 7, m.atk * .9, '#c070ff'); AU.play('magic'); return 1; },
  fendas(m) { const a = angTo(m.x, m.z, PL.x, PL.z); [-.55, 0, .55].forEach(o => T_(m, { shape: 'rect', x: m.x, z: m.z, len: 24, w: 2.6, ang: a + o, dur: 1.1, col: '#b060ff', fx: () => AU.play('zap') }, 1.5)); return 1.3; },
  invocar(m) { summon(m, 'cavaleiro', 2, 6); summon(m, 'sombra', 2, 6); return 1; },
  vazio(m) { m.pull = 1.3; banner('O Vazio te puxa!', 'Corra para longe de Malvorath!', 1.5); T_(m, { shape: 'circle', x: m.x, z: m.z, r: 8.5, dur: 1.9, col: '#8a40ff', fx: () => { FX.ring(m.x, 1, m.z, '#c070ff', 9, 60); AU.play('boom'); shake(.8); } }, 2); return 2.1; },
  colapso(m) { for (let i = 0; i < 4; i++) T_(m, { shape: 'ring', x: m.x, z: m.z, r0: Math.max(.01, i * 6), r: (i + 1) * 6, dur: 1.3 + i * .75, col: '#ff40c0', fx: o => { FX.ring(m.x, 1, m.z, '#ff70e0', o.r, 40); AU.play('boom'); } }, 1.8); return 4; }
};
function bossAI(m, dt, d) {
  const L = LAIRS[m.key], B = m.sp;
  if (m.flyUp) { m.flyUp.t += dt; m.lift = Math.min(14, m.flyUp.t * 10); m.ui.visible = false; return false; } else m.lift = m.jump ? m.lift : 0;
  if (m.jump) { const j = m.jump; j.t += dt; const p = Math.min(1, j.t / j.d); m.x = lerp(j.sx, j.x, p); m.z = lerp(j.sz, j.z, p); m.lift = Math.sin(p * Math.PI) * 6; if (p >= 1) { m.jump = null; m.lift = 0; } return true; }
  if (!m.awake) {
    if (!PL.dead && Math.hypot(PL.x - L.x, PL.z - L.z) < L.r + 5 && GAME === 'play') {
      m.awake = true; m.abT = 2.5; PL.bossHit = false; BOSSF = m;
      banner('👑 ' + B.n, B.title, 3); log(`<b style="color:#ff9a5a">${B.n}:</b> “${esc(B.hi)}”`); speech(B.n, B.hi);
      AU.play('roar'); AU.music(B.final ? 'final' : 'chefe'); shake(.6);
    }
    return false;
  }
  if (PL.dead || Math.hypot(PL.x - L.x, PL.z - L.z) > L.r + 18) {
    m.awake = false; m.hp = m.max; m.x = L.x; m.z = L.z; m.th = {}; m.phase = 1; m.busy = 0; m.untarget = false; m.flyUp = null; m.lift = 0;
    clearTeles(m); for (const s of MON) if (s.owner === m && !s.dead) { s.resp = -1; s.dead = true; } for (const h of HAZ) if (h.m === m) h.t = 0;
    if (BOSSF === m) BOSSF = null; musicZone(true); return false;
  }
  const f = m.hp / m.max;
  // gatilhos por vida
  const trig = (k, v, ab) => { if (f < v && !m.th[k]) { m.th[k] = 1; m.busy = BA[ab](m); return true; } };
  if (m.key === 'reiSlime' && (trig('a', .66, 'divisao') || trig('b', .33, 'divisao'))) return false;
  if (m.key === 'ent' && trig('a', .5, 'brotos')) return false;
  if (m.key === 'farao' && (trig('a', .5, 'sarcofago') || trig('b', .25, 'sarcofago'))) return false;
  if (m.key === 'malvorath') {
    if (f < .7 && !m.th.p2) { m.th.p2 = 1; m.phase = 2; banner('Malvorath desperta seu poder!', 'Fase 2'); speech('Malvorath', 'Você é mais teimos' + (P.f ? 'a' : 'o') + ' do que imaginei... SERVOS, A MIM!'); m.busy = BA.invocar(m); return false; }
    if (f < .35 && !m.th.p3) { m.th.p3 = 1; m.phase = 3; banner('Malvorath enlouquece!', 'Fase final — desvie das ondas!'); speech('Malvorath', 'CHEGA! Eu vou DEVORAR esta realidade inteira!'); AU.play('roar'); shake(1); m.busy = BA.colapso(m); m.abT = 3; return false; }
    if (m.phase === 3) FX.rise(m.x, m.y + 1, m.z, '#ff40c0', 1, 1.2, 2, .8, .6);
  }
  if (m.pull > 0) { m.pull -= dt; const dx = m.x - PL.x, dz = m.z - PL.z, dd = Math.hypot(dx, dz); if (dd > 2 && !PL.dash) { const p = { x: PL.x, z: PL.z }; moveEnt(p, dx / dd * 4.5 * dt, dz / dd * 4.5 * dt, .5); PL.x = p.x; PL.z = p.z; } }
  if (m.busy > 0) { m.busy -= dt; return false; }
  if (m.stun > 0) return false;
  m.abT -= dt;
  if (m.abT <= 0) {
    const list = B.ab.filter(a => !['divisao', 'brotos', 'sarcofago', 'invocar'].includes(a) && (a !== 'vazio' || m.phase >= 2) && (a !== 'colapso' || m.phase >= 3));
    const ab = list[m.abI++ % list.length];
    m.busy = BA[ab](m); m.abT = rn(2.2, 3.2) * (f < .5 ? .8 : 1) * (m.phase === 3 ? .75 : 1);
    if (m.key === 'reiSlime' && R() < .35) summon(m, 'slimeP', 1);
    return false;
  }
  const reach = m.r + 1.4;
  if (m.wind > 0) { m.wind -= dt; if (m.wind <= 0) { if (d < reach + 1) { hurtP(m.atk, m); AU.play('slam'); } else if (B.rng) { shootE(m, angTo(m.x, m.z, PL.x, PL.z), 13, m.atk * .8, B.pc || '#ffd23f', { slow: B.slowHit ? 2 : 0 }); AU.play('magic'); } m.cd = 1.4; } return false; }
  if (B.rng && d > reach && d < B.rng && m.cd <= 0) { m.wind = .5; return false; }
  if (d > reach) { moveMon(m, PL.x, PL.z, m.spd, dt); const lx = m.x - L.x, lz = m.z - L.z, ld = Math.hypot(lx, lz); if (ld > L.r + 6) { m.x = L.x + lx / ld * (L.r + 6); m.z = L.z + lz / ld * (L.r + 6); } return true; }
  m.ry = lerpAng(m.ry, angTo(m.x, m.z, PL.x, PL.z), dt * 6);
  if (m.cd <= 0) m.wind = .55;
  return false;
}
let BOSSF = null;
function updateHaz(dt) {
  for (let i = HAZ.length - 1; i >= 0; i--) {
    const h = HAZ[i]; h.t -= dt; if (h.t <= 0 || h.m.dead) { HAZ.splice(i, 1); continue; }
    const dx = PL.x - h.x, dz = PL.z - h.z, d = Math.hypot(dx, dz); if (d > .1) { h.x += dx / d * h.spd * dt; h.z += dz / d * h.spd * dt; }
    for (let k = 0; k < 3; k++) { const a = R() * TAU, r = R() * 1.3, y = R() * 4; PNORM.emit(h.x + Math.sin(a) * r * (y / 4 + .3), groundY(h.x, h.z) + y, h.z + Math.cos(a) * r * (y / 4 + .3), Math.cos(a) * 3, 1, -Math.sin(a) * 3, .5, .8, .3, h.col, .7, 0, 1); }
    h.tick -= dt; if (d < 1.6 && h.tick <= 0) { h.tick = .5; hurtP(h.dmg, h.m); }
  }
}
function bossDown(m) {
  const B = m.sp; clearTeles(m); for (const s of MON) if (s.owner === m && !s.dead) { s.resp = -1; s.dead = true; } for (const h of HAZ) if (h.m === m) h.t = 0;
  m.awake = false; if (BOSSF === m) BOSSF = null;
  AU.play('victory'); shake(1); FX.beam(m.x, m.y, m.z, B.fc || '#ff40ff', 10, 120);
  const first = !P.boss[m.key]; P.boss[m.key] = true;
  for (let i = 0; i < 2; i++) dropItem(m.x, m.z, genItem(m.lv, null, i ? 3 : 2 + (R() < .4 ? 1 : 0)));
  if (R() < .25) dropItem(m.x, m.z, genItem(m.lv, null, 4));
  P.cons.h2 = (P.cons.h2 || 0) + 2; P.cons.m2 = (P.cons.m2 || 0) + 2; P.cons.stone = (P.cons.stone || 0) + 1;
  if (!PL.bossHit) ach('nodeath');
  ach(m.key === 'reiSlime' ? 'boss1' : 'x'); if (bossesBeaten() >= 5) ach('boss5');
  if (B.final) { ach('final'); banner('🌅 Malvorath foi derrotado!', 'A luz voltou a Aethra', 4); setTimeout(() => { completeMain(); showEnding(); }, 3500); return; }
  banner('👑 ' + B.n + ' derrotad' + (m.key === 'rainha' ? 'a' : 'o') + '!', first ? '💎 Você obteve o ' + B.frag : 'Recompensas épicas!', 3.5);
  if (first) log(`<b style="color:${B.fc}">💎 ${B.frag}</b> obtido! Leve ao Ancião Eldric.`);
  later(2, () => musicZone(true));
}

/* ---------- Habilidades ---------- */
function skillInfo(i) { const s = SKILLS[P.cls][i], r = P.sk[s.id] || 0; return { s, r, mult: 1 + .2 * (r - 1), cd: s.cd * (1 - .05 * (r - 1)), mp: Math.round(s.mp * (1 + .1 * (r - 1))) }; }
function enemiesAround(x, z, r) { return MON.filter(m => !m.dead && !m.untarget && (m.x > 600) === (x > 600) && Math.hypot(m.x - x, m.z - z) < r + m.r); }
function useSkill(i) {
  if (GAME !== 'play' || PL.dead || PL.stunT > 0) return;
  const K = skillInfo(i), s = K.s;
  if (!K.r) return toast(`🔒 ${s.n} libera no nível ${s.lv}`, '#aaa');
  if (PL.skc[i] > 0) return;
  if (P.mp < K.mp) { AU.play('err'); return toast('💧 Mana insuficiente', '#6fb0ff'); }
  let t = null;
  if (s.tgt) {
    t = PL.tgt && !PL.tgt.dead && !PL.tgt.untarget ? PL.tgt : nearestEnemy(16);
    if (!t) { AU.play('err'); return toast('Nenhum alvo por perto', '#aaa'); }
    PL.tgt = t;
    const range = (s.rng || (P.cls === 'w' ? CLS.w.rng + 1 : CLS[P.cls].rng + 2)) + t.r;
    if (mdist(t) > range) { PL.pend = i; PL.mv = null; return; }
    PL.ry = angTo(PL.x, PL.z, t.x, t.z);
  }
  PL.pend = null; P.mp -= K.mp; PL.skc[i] = K.cd; PL.combatT = 6;
  const A = S.atk, M = K.mult;
  ({
    golpe() { PL.anim = { k: 'swing', t: 0, d: .4 }; later(.15, () => { hitMon(t, A * 2.6 * M, { skill: 1, stun: R() < .4 ? 1.5 : 0 }); FX.burst(t.x, t.y + 1, t.z, '#ff8a3d', 20, 6); shake(.3); }); AU.play('swing'); },
    redemoinho() { PL.anim = { k: 'spin', t: 0, d: .55 }; AU.play('swing'); later(.2, () => { enemiesAround(PL.x, PL.z, 4.5).forEach(m => hitMon(m, A * 1.8 * M, { skill: 1 })); FX.ring(PL.x, PL.y + .8, PL.z, '#9fe0ff', 4.5, 40); }); },
    investida() { const dx = t.x - PL.x, dz = t.z - PL.z, d = Math.hypot(dx, dz), go = Math.max(0, d - t.r - 1.2); PL.dash = { t: .22, d: .22, vx: dx / d * go / .22, vz: dz / d * go / .22, roll: 0 }; PL.invT = .3; AU.play('dash'); later(.24, () => { hitMon(t, A * 2.2 * M, { skill: 1, stun: 1.5 }); FX.burst(t.x, t.y + 1, t.z, '#ffd23f', 24, 7); shake(.4); AU.play('slam'); }); },
    grito() { PL.buffs.grito = 12; healP(S.hp * .2); FX.ring(PL.x, PL.y + .5, PL.z, '#ff6a3d', 6, 40); FX.beam(PL.x, PL.y, PL.z, '#ff6a3d', 4, 30); AU.play('buff'); },
    terremoto() { PL.anim = { k: 'slam', t: 0, d: .65 }; later(.55, () => { enemiesAround(PL.x, PL.z, 7).forEach(m => hitMon(m, A * 4 * M, { skill: 1, stun: 2 })); FX.disk(PL.x, PL.y, PL.z, '#c9a070', 7, 60); FX.ring(PL.x, PL.y + .3, PL.z, '#ffd23f', 7, 50); AU.play('slam'); shake(1); }); },
    perfurante() { PL.anim = { k: 'shoot', t: 0, d: .35 }; const a = angTo(PL.x, PL.z, t.x, t.z); later(.1, () => { PPROJ.push({ x: PL.x, y: PL.y + 1.5, z: PL.z, dir: [Math.sin(a), Math.cos(a)], spd: 40, len: 26, hits: new Set(), dmg: A * 2.4 * M, col: '#9fe0ff', size: 1.4, me: projMesh('#9fe0ff', 1.4), life: 2 }); AU.play('arrow'); }); },
    chuva() { PL.anim = { k: 'shoot', t: 0, d: .35 }; const x = t.x, z = t.z; for (let w = 0; w < 3; w++) later(.3 + w * .35, () => { for (let k = 0; k < 14; k++) { const a = R() * TAU, r = R() * 3.5; PADD.emit(x + Math.sin(a) * r, groundY(x, z) + 8, z + Math.cos(a) * r, 0, -30, 0, .28, .5, .3, '#e0c080', 1); } AU.play('arrow'); enemiesAround(x, z, 3.5).forEach(m => hitMon(m, A * M, { skill: 1 })); }); },
    salto() { const a = PL.ry + Math.PI; PL.dash = { t: .25, d: .25, vx: Math.sin(a) * 28, vz: Math.cos(a) * 28, roll: -1 }; PL.invT = .35; PL.buffs.salto = 4; PL.saltoShots = 3; AU.play('dash'); FX.burst(PL.x, PL.y + .5, PL.z, '#c9f0ff', 14, 4); },
    instinto() { PL.buffs.instinto = 12; healP(S.hp * .15); FX.ring(PL.x, PL.y + .5, PL.z, '#5fe08a', 5, 40); AU.play('buff'); },
    tempestade() { PL.anim = { k: 'shoot', t: 0, d: 1.2 }; for (let k = 0; k < 12; k++) later(k * .1, () => { const l = enemiesAround(PL.x, PL.z, 14); if (l.length) shootP(pick(l), A * 1.1 * M, '#ffe08a', { hit: { skill: 1 }, spd: 34 }); }); },
    bolafogo() { PL.anim = { k: 'cast', t: 0, d: .4 }; later(.12, () => shootP(t, A * 2.6 * M, '#ff7a1a', { size: 2.2, spd: 22, hit: { skill: 1, burn: 1 }, onHit: tt => { FX.burst(tt.x, tt.y + 1, tt.z, '#ff7a1a', 26, 7, .6, .8); AU.play('fire'); enemiesAround(tt.x, tt.z, 3).forEach(m => m !== tt && hitMon(m, A * 1.3 * M, { skill: 1, burn: 1 })); } })); },
    nova() { PL.anim = { k: 'cast', t: 0, d: .4 }; enemiesAround(PL.x, PL.z, 6).forEach(m => hitMon(m, A * 1.6 * M, { skill: 1, slow: 3, col: '#9fe0ff' })); FX.ring(PL.x, PL.y + .5, PL.z, '#bfefff', 6, 60); FX.disk(PL.x, PL.y, PL.z, '#9fe0ff', 6, 40); AU.play('ice'); },
    raio() { PL.anim = { k: 'cast', t: 0, d: .35 }; let cur = t, from = { x: PL.x, y: PL.y + 1.6, z: PL.z }, hit = new Set(); for (let k = 0; k < 5 && cur; k++) { hit.add(cur); bolt(from, { x: cur.x, y: cur.y + cur.h * .6, z: cur.z }); hitMon(cur, A * 2.1 * M * (1 - k * .1), { skill: 1, col: '#9fe0ff' }); from = { x: cur.x, y: cur.y + cur.h * .6, z: cur.z }; cur = MON.filter(m => !m.dead && !hit.has(m) && Math.hypot(m.x - from.x, m.z - from.z) < 7).sort((a, b) => Math.hypot(a.x - from.x, a.z - from.z) - Math.hypot(b.x - from.x, b.z - from.z))[0]; } AU.play('zap'); },
    escudo() { PL.shield = S.hp * .4 * M; PL.shieldT = 12; AU.play('shield'); FX.ring(PL.x, PL.y + 1, PL.z, '#b080ff', 3, 30); },
    meteoro() { PL.anim = { k: 'cast', t: 0, d: .5 }; const x = t.x, z = t.z, gy = groundY(x, z); const me = projMesh('#ff5a1a', 5); let k = 0; const fall = () => { k += .05; me.position.set(x + (1 - k) * 6, gy + (1 - k) * 22, z); FX.trail(me.position.x, me.position.y, me.position.z, '#ff8a2a', 1.8, .5); if (k < 1) later(.035, fall); else { scene.remove(me); enemiesAround(x, z, 6).forEach(m => hitMon(m, A * 5 * M, { skill: 1, burn: 1 })); FX.burst(x, gy + .5, z, '#ff7a1a', 60, 12, .9, 1.2); FX.smoke(x, gy + .5, z, '#3a2a2a', 6, 2.5); AU.play('boom'); shake(1); } }; fall(); AU.play('fire'); }
  })[s.id]();
}
function bolt(a, b) {
  const pts = []; for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push(new T.Vector3(lerp(a.x, b.x, t) + (i % 8 ? rn(-.4, .4) : 0), lerp(a.y, b.y, t) + (i % 8 ? rn(-.4, .4) : 0), lerp(a.z, b.z, t) + (i % 8 ? rn(-.4, .4) : 0))); }
  const l = new T.Line(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({ color: '#bfefff' })); scene.add(l);
  pts.forEach(p => FX.trail(p.x, p.y, p.z, '#9fe0ff', .6, .3));
  later(.22, () => { scene.remove(l); l.geometry.dispose(); l.material.dispose(); });
}
function dodge() {
  if (GAME !== 'play' || PL.dead || PL.dodgeCd > 0 || PL.stunT > 0 || PL.rootT > 0) return;
  let { x, z } = moveInput(); if (!x && !z) { x = Math.sin(PL.ry); z = Math.cos(PL.ry); }
  PL.dash = { t: .26, d: .26, vx: x * 24, vz: z * 24, roll: 1 }; PL.ry = Math.atan2(x, z); PL.invT = .32; PL.dodgeCd = 1.3; PL.mv = null;
  AU.play('dash'); FX.burst(PL.x, PL.y + .3, PL.z, '#ffffff', 8, 3, .4, .5, 0, false);
}
function usePotion(k) {
  if (GAME !== 'play' || PL.dead) return;
  if (PL.potCd > 0) return;
  const ids = [k + '1', k + '2', k + '3'].filter(i => P.cons[i] > 0);
  if (!ids.length) { AU.play('err'); return toast(k === 'h' ? '❤️ Sem poções de vida! Compre com o Tobias.' : '🔹 Sem poções de mana!', '#ff7a7a'); }
  const miss = k === 'h' ? S.hp - P.hp : S.mp - P.mp; if (miss < 1) return toast(k === 'h' ? 'Vida cheia' : 'Mana cheia', '#aaa');
  const max = k === 'h' ? S.hp : S.mp, id = ids.find(i => CONS[i][k === 'h' ? 'hp' : 'mp'] * max >= miss) || ids[ids.length - 1];
  P.cons[id]--; PL.potCd = 1;
  if (k === 'h') healP(CONS[id].hp * S.hp); else { P.mp = Math.min(S.mp, P.mp + CONS[id].mp * S.mp); dmgText(PL.x, PL.y + 2.4, PL.z, '+MP', '#6fb0ff'); }
  AU.play('potion'); FX.rise(PL.x, PL.y + .5, PL.z, k === 'h' ? '#ff6a8a' : '#6fb0ff', 14);
}
function useScroll() {
  if (GAME !== 'play' || PL.dead) return;
  if (!(P.cons.scroll > 0)) return toast('📜 Sem Pergaminhos de Retorno', '#ff7a7a');
  if (BOSSF) return toast('Não dá para fugir de uma luta contra um chefe!', '#ff7a7a');
  if (inTown()) return toast('Você já está na vila', '#aaa');
  P.cons.scroll--; teleport(SPAWN[0], SPAWN[1]);
}
function teleport(x, z) { AU.play('tele'); FX.beam(PL.x, PL.y, PL.z, '#9fe0ff', 6, 50); fade(() => { placePlayer(x, z); FX.beam(x, groundY(x, z), z, '#9fe0ff', 6, 50); musicZone(true); }); }

/* ---------- Missões ---------- */
const curQ = () => MAIN[Math.min(P.q, FINAL_Q)];
function questKill(m) {
  const q = curQ();
  if (q.type === 'kill' && q.sp === m.key) { P.qc++; if (P.qc >= q.n) completeMain(); }
  if (q.type === 'collect' && q.sp === m.key && R() < q.chance) { P.qc++; dmgText(m.x, m.y + m.h + .6, m.z, '📦 ' + q.item, '#ffe08a'); AU.play('pickup'); if (P.qc >= q.n) completeMain(); }
  if (q.type === 'boss' && q.boss === m.key && !BOSS[m.key].final) completeMain();
  for (const s of SIDE) {
    const st = P.side[s.id]; if (!st || st.st !== 1) continue;
    let inc = 0;
    if (s.type === 'kill' && s.sp === m.key) inc = 1; else if (s.type === 'collect' && s.sp === m.key && R() < s.chance) inc = 1; else if (s.type === 'elite' && m.elite) inc = 1;
    if (inc) { st.c++; if (s.type === 'collect') dmgText(m.x, m.y + m.h + .6, m.z, '📦 ' + s.item, '#ffe08a'); if (st.c >= s.n) { st.st = 2; AU.play('quest'); toast(`✅ ${s.t}: volte para ${NPCS.find(n => n.id === s.npc).n}`, '#5fe08a'); } }
  }
  for (const b of P.bnt) if (!b.done && b.sp === m.key) { b.c++; if (b.c >= b.n) { b.done = true; P.gold += b.gold; gainXP(b.xp); P.bdone++; AU.play('quest'); toast(`📜 Contrato concluído! +${b.gold}💰`, '#ffe08a'); if (P.bdone >= 10) ach('bounty10'); } }
  P.bnt = P.bnt.filter(b => !b.done);
}
function giveRewards(L, k, gold, rew) {
  const xp = Math.round(needXP(Math.max(1, Math.min(L, P.lv))) * k);
  gainXP(xp); P.gold += gold;
  let txt = `+${fmt(xp)} XP · +${gold}💰`;
  if (rew) {
    if (rew.pot) for (const id in rew.pot) { P.cons[id] = (P.cons[id] || 0) + rew.pot[id]; txt += ` · ${rew.pot[id]}× ${CONS[id].i}`; }
    if (rew.scroll) { P.cons.scroll = (P.cons.scroll || 0) + rew.scroll; txt += ` · ${rew.scroll}× 📜`; }
    if (rew.stone) { P.cons.stone = (P.cons.stone || 0) + rew.stone; txt += ` · ${rew.stone}× 💠`; }
    if (rew.item) { const [sl, , il, r] = rew.item; const it = genItem(il + P.ng * 30, sl, r); addItem(it); txt += ` · ${itemName(it)}`; }
  }
  return txt;
}
function completeMain() {
  const q = curQ(); if (q.type === 'done') return;
  const k = q.type === 'boss' ? .8 : q.type === 'kill' || q.type === 'collect' ? .35 : .25;
  const rew = Object.assign({}, q.rew || {});
  if (q.type === 'deliver') rew.item = [['arma', 'armadura', 'elmo', 'amuleto', 'arma'][q.frag - 1], 0, q.L, q.frag >= 4 ? 3 : 2];
  const txt = giveRewards(q.L, k, q.L * (q.type === 'boss' ? 40 : 15), rew);
  AU.play('quest'); banner('✅ Missão concluída: ' + q.t, txt, 3);
  log(`<b style="color:#5fe08a">Missão concluída:</b> ${q.t} <span class="mut">(${txt})</span>`);
  P.q++; P.qc = 0;
  const n = curQ(); if (n.type !== 'done') later(3.2, () => toast('📜 Nova missão: ' + n.t, '#ffe08a'));
  saveGame();
}
function questTarget() {
  const q = curQ();
  if (q.type === 'talk' || q.type === 'deliver') { const n = NPCS.find(n => n.id === q.npc); return { x: n.x, z: n.z, n: n.n }; }
  if (q.type === 'boss') { const l = LAIRS[q.boss]; if (l.x > 600 && !inAbyss()) return { x: -6.5, z: -10.5, n: 'Portal' }; return { x: l.x, z: l.z, n: BOSS[q.boss].n }; }
  if (q.type === 'portal') return inAbyss() ? null : { x: -6.5, z: -10.5, n: 'Portal' };
  if (q.type === 'kill' || q.type === 'collect') { let best = null, bd = 1e9; for (const c of CAMPLIST) if (c.sp === q.sp) { const d = Math.hypot(c.x - PL.x, c.z - PL.z); if (d < bd) { bd = d; best = c; } } return best && { x: best.x, z: best.z, n: SP[q.sp].n }; }
  return null;
}
function sideAvail(npc) { return SIDE.filter(s => s.npc === npc && P.q >= s.req && (!P.side[s.id] || P.side[s.id].st === 2)); }
function npcMarker(id) {
  const q = curQ();
  if ((q.type === 'talk' || q.type === 'deliver') && q.npc === id) return q.type === 'deliver' ? '?' : '!';
  const s = SIDE.filter(s => s.npc === id && P.q >= s.req);
  if (s.some(x => P.side[x.id] && P.side[x.id].st === 2)) return '?';
  if (s.some(x => !P.side[x.id])) return '!';
  if (id === 'quadro' && P.q >= 3 && !P.bnt.length) return '!';
  return '';
}
function refreshBounties(force) {
  if (P.bOff.length && !force) return;
  const zmax = Math.min(5, bossesBeaten() + 1), keys = Object.keys(CAMPS).filter(k => SP[k].z <= zmax && SP[k].z >= Math.max(1, zmax - 1));
  P.bOff = [0, 1, 2].map(() => { const sp = pick(keys), L = SP[sp].lv[1] + P.ng * 30, n = 6 + ri(7); return { sp, n, c: 0, gold: Math.round(n * (2 + L * 1.6) * 2.2), xp: Math.round(needXP(Math.min(L, P.lv)) * .22) }; });
}

/* ---------- Ferreiro / lojas ---------- */
function forgeStock() {
  const tierIl = [3, 7, 12, 17, 22, 27][Math.min(5, bossesBeaten())] + P.ng * 30;
  if (P.shopT !== tierIl || !P.shop) { P.shopT = tierIl; P.shop = SLOTS.map(sl => genItem(tierIl, sl, 1)).concat([genItem(tierIl, 'arma', 2), genItem(tierIl, pick(['armadura', 'elmo', 'amuleto']), 2)]); }
  return P.shop;
}
const buyPrice = it => Math.round(itemValue(it) * 1.25);
function buyGear(i) { const it = P.shop[i]; if (!it) return; const p = buyPrice(it); if (P.gold < p) { AU.play('err'); return toast('💰 Ouro insuficiente', '#ff7a7a'); } if (P.inv.length >= 36) return toast('🎒 Mochila cheia'); P.gold -= p; P.shop.splice(i, 1); AU.play('buy'); addItem(it); }
function buyCons(id, n) { const p = CONS[id].price * n; if (P.gold < p) { AU.play('err'); return toast('💰 Ouro insuficiente', '#ff7a7a'); } P.gold -= p; P.cons[id] = (P.cons[id] || 0) + n; AU.play('buy'); refreshWin(); }
function consAvail() { const b = bossesBeaten(); return ['h1', 'm1', 'scroll', 'elixir'].concat(b >= 1 ? ['h2', 'm2', 'stone'] : [], b >= 3 ? ['h3', 'm3'] : []); }
const refineCost = it => Math.round(30 + it.il * 12 + it.up * it.up * 25);
function refine(it) {
  if (it.up >= 10) return toast('Refino máximo!');
  const c = refineCost(it), st = it.up >= 4;
  if (P.gold < c) { AU.play('err'); return toast('💰 Ouro insuficiente', '#ff7a7a'); }
  if (st && !(P.cons.stone > 0)) { AU.play('err'); return toast('💠 Precisa de uma Pedra de Refino', '#ff7a7a'); }
  P.gold -= c; if (st) P.cons.stone--;
  if (R() * 100 < REFINE_CHANCE[it.up]) { it.up++; AU.play('refOk'); banner('⚒️ Sucesso!', itemName(it), 2); if (it.up >= 7) ach('smith'); }
  else { AU.play('refFail'); if (it.up >= 5) { it.up--; banner('💥 Falhou...', 'O item caiu para +' + it.up, 2); } else banner('💥 Falhou...', 'Nada foi perdido', 2); }
  if (Object.values(P.eq).includes(it)) { buildPlayer(); calc(); }
  refreshWin();
}

/* ---------- Conquistas ---------- */
function ach(id) { if (!P || P.ach[id] || !ACH.find(a => a.id === id)) return; P.ach[id] = Date.now(); const a = ACH.find(a => a.id === id); AU.play('ach'); achPop(a); log(`🏆 Conquista: <b>${a.n}</b>`); }

/* ---------- Diálogos dos NPCs ---------- */
function talk(id) {
  const n = NPCS.find(n => n.id === id), q = curQ();
  PL.mv = null; PL.tgt = null;
  if (id === 'quadro') { refreshBounties(); return openWin('bounty'); }
  const opts = [];
  const sides = sideAvail(id);
  for (const s of sides) {
    const st = P.side[s.id];
    if (st && st.st === 2) opts.push({ t: '✅ Entregar: ' + s.t, f: () => { st.st = 3; const txt = giveRewards(s.L, .4, s.L * 12, s.rew); AU.play('quest'); banner('✅ ' + s.t, txt, 3); log(`<b style="color:#5fe08a">Missão secundária concluída:</b> ${s.t}`); } });
    else opts.push({ t: '❗ ' + s.t, f: () => dialog(n, [s.txt, `Recompensa: experiência, ouro${s.rew.item ? ' e um equipamento' : ''}.`], [{ t: 'Aceitar', f: () => { P.side[s.id] = { st: 1, c: 0 }; AU.play('quest'); toast('📜 Missão aceita: ' + s.t, '#ffe08a'); } }, { t: 'Agora não' }]) });
  }
  if (id === 'eldric') {
    if (q.type === 'talk' && q.npc === 'eldric') return dialog(n, DLG.intro, [{ t: 'Pode contar comigo!', f: completeMain }]);
    if (q.type === 'deliver') return dialog(n, DLG.frag[q.frag], [{ t: 'Continuar', f: () => { completeMain(); updateAurora(); } }]);
    if (q.type === 'portal' || (q.type === 'boss' && q.boss === 'malvorath')) return dialog(n, DLG.portal, opts.concat([{ t: 'Estou pront' + (P.f ? 'a' : 'o') }]));
    if (q.type === 'done') return dialog(n, DLG.done, opts.concat([{ t: 'Obrigad' + (P.f ? 'a' : 'o') + ', Eldric' }]));
    return dialog(n, ['Seu caminho está claro, ' + P.name + ': ' + q.d, 'Use o mapa (M) se precisar. A seta dourada aos seus pés aponta o objetivo.'], opts.concat([{ t: 'Até mais' }]));
  }
  if (id === 'brunhilda') {
    if (q.type === 'talk' && q.npc === 'brunhilda') return dialog(n, DLG.bru1, [{ t: 'Valeu, Brunhilda!', f: () => { const it = genItem(2, 'arma', 1); addItem(it); P.cons.h1 = (P.cons.h1 || 0) + 3; completeMain(); tip('equip', 'Abra a Mochila (I) e clique na arma nova para equipar.'); } }]);
    return dialog(n, [pick(DLG.greet.brunhilda)], [{ t: '🛒 Comprar equipamentos', f: () => openWin('forge') }, { t: '⚒️ Refinar itens', f: () => openWin('refine') }].concat(opts, [{ t: 'Até mais' }]));
  }
  if (id === 'tobias') return dialog(n, [pick(DLG.greet.tobias)], [{ t: '🛒 Ver mercadorias', f: () => openWin('shop') }].concat(opts, [{ t: 'Até mais' }]));
  if (id === 'lyra') return dialog(n, [pick(DLG.greet.lyra)], opts.concat([{ t: 'Até mais' }]));
}
function interact(o) {
  if (!o) return;
  if (o.kind === 'npc') talk(o.id);
  else if (o.kind === 'way') openWin('tele');
  else if (o.kind === 'portal') {
    if (P.q < PORTAL_Q) return toast('O portal ainda está selado...', '#aaa');
    AU.play('tele'); fade(() => { placePlayer(ABYSS.spawn[0], ABYSS.spawn[1]); if (curQ().type === 'portal') completeMain(); banner('🌌 Fenda do Abismo', 'Nv 26–30 · Malvorath espera no fim do caminho', 3); musicZone(true); });
  } else if (o.kind === 'exit') { AU.play('tele'); fade(() => { placePlayer(-6.5, -7); musicZone(true); }); }
}

/* ---------- Outros aventureiros (enfeite) ---------- */
function spawnBots() {
  const skins = ['#f1c9a0', '#e0a882', '#c68a5e', '#8d5a3c', '#f7dcc4'], hairs = ['#1a1a1a', '#5a3a1a', '#d9a03a', '#d9542a', '#eeeeee', '#3a5ad9'];
  BOT_NAMES.slice(0, 7).forEach((n, i) => {
    const cls = pick(['w', 'a', 'm']), t = ri(5), look = { skin: pick(skins), hair: pick(hairs), hs: pick(['short', 'spiky', 'long', 'bun']), shirt: ACOL[t], pants: '#3a3448', trim: TCOL[t], helm: R() < .4 ? ri(5) : null, quiver: cls === 'a', robe: cls === 'm' ? ACOL[t] : null };
    const o = instModel(humanDef(look)); const w = weaponGroup(cls, t, ri(4), 0); (cls === 'a' ? o.limbs[0] : o.limbs[1]).p.add(w); scene.add(o.g);
    const lb = makeLabel(n, '#9fd0ff', 26, .45); scene.add(lb);
    const a = R() * TAU, r = rn(5, 18);
    BOTS.push({ o, lb, n, x: Math.sin(a) * r, z: Math.cos(a) * r, tx: 0, tz: 0, wt: 0, ph: 0, ry: 0 });
  });
}
function updateBots(dt, t) {
  for (const b of BOTS) {
    b.wt -= dt; if (b.wt <= 0) { const a = R() * TAU, r = rn(4, 20); b.tx = Math.sin(a) * r; b.tz = Math.cos(a) * r; b.wt = rn(4, 12); }
    const dx = b.tx - b.x, dz = b.tz - b.z, d = Math.hypot(dx, dz), mv = d > .3 && b.wt < 9;
    if (mv) { const p = { x: b.x, z: b.z }; moveEnt(p, dx / d * 4 * dt, dz / d * 4 * dt, .4); b.x = p.x; b.z = p.z; b.ry = lerpAng(b.ry, Math.atan2(dx, dz), dt * 8); b.ph += dt * 10; }
    b.o.g.position.set(b.x, 0, b.z); b.o.g.rotation.y = b.ry; animLimbs(b.o, b.ph, mv, t);
    b.lb.position.set(b.x, 2.75, b.z); b.o.g.visible = b.lb.visible = !inAbyss();
  }
}

/* ---------- NPCs ---------- */
function spawnNPCs() {
  for (const n of NPCS) {
    let o;
    if (n.board) { o = { g: new T.Group(), limbs: [], inner: new T.Group() }; }
    else {
      const L = n.look; const look = Object.assign({}, L, { hold: L.staff ? 'staff' : L.hammer ? 'hammer' : L.spear ? 'spear' : null });
      o = instModel(humanDef(look)); o.g.position.set(n.x, 0, n.z); o.g.rotation.y = n.ry; scene.add(o.g); addCol(n.x, n.z, .6);
    }
    const lb = makeLabel(n.i + ' ' + n.n, '#ffe9b0', 28, .5); lb.position.set(n.x, n.board ? 2.9 : 2.85, n.z); scene.add(lb);
    const mk = makeLabel('!', '#ffd23f', 64, 1.1); mk.position.set(n.x, n.board ? 3.4 : 3.45, n.z); scene.add(mk);
    NPCM[n.id] = { n, o, lb, mk, ry: n.ry };
  }
}
let _mkC = {};
function updateNPCs(dt, t) {
  for (const id in NPCM) {
    const N = NPCM[id], m = P && GAME !== 'create' ? npcMarker(id) : '';
    if (_mkC[id] !== m) { _mkC[id] = m; if (m) { const L = labelTex(m, m === '?' ? '#5fe08a' : '#ffd23f', 64); N.mk.material.map = L.tex; N.mk.material.needsUpdate = true; } N.mk.visible = !!m; }
    N.mk.position.y = (N.n.board ? 3.4 : 3.45) + Math.sin(t * 3) * .12;
    if (N.n.board) continue;
    const d = Math.hypot(PL.x - N.n.x, PL.z - N.n.z), want = d < 7 ? angTo(N.n.x, N.n.z, PL.x, PL.z) : N.n.ry;
    N.ry = lerpAng(N.ry, want, dt * 4); N.o.g.rotation.y = N.ry;
    N.o.inner.position.y = Math.sin(t * 2 + N.n.x) * .02; N.o.inner.scale.y = 1 + Math.sin(t * 2 + N.n.x) * .01;
  }
}
function updateAurora(t = 0) {
  const A = DYN.aurora; if (!A || !P) return; const n = fragsDelivered();
  A.shards.forEach((s, i) => { s.visible = i < n; const a = t * .8 + i / 5 * TAU; s.position.set(Math.sin(a) * 1.4, Math.sin(t * 2 + i) * .2, Math.cos(a) * 1.4); s.rotation.y = t * 2; });
  A.core.rotation.y = t * .6; A.core.material.color.set(n >= 5 ? '#fff6d0' : '#7a7090').lerp(new T.Color('#fff2c0'), n / 5 * .8);
  A.g.position.y = 3.7 + Math.sin(t * 1.5) * .12; A.beam.visible = n >= 5; A.beam.material.opacity = .18 + Math.sin(t * 2) * .06;
  if (n > 0 && R() < .1 * n) FX.rise(0, 3.4, 0, '#fff2c0', 1, .8, 1.5, 1, .3);
}
/* ===================== 08 · INTERFACE, CONTROLES E LAÇO PRINCIPAL ===================== */
let HOVER = null, MODAL = null, WIN = null, WS = { sel: null, tab: 'inv' };
const KEYS = {}, JOY = { x: 0, y: 0, on: false };

/* ---------- Mensagens ---------- */
function toast(t, c) { const d = document.createElement('div'); d.className = 'toast'; d.textContent = t; if (c) d.style.color = c; $('#toasts').appendChild(d); setTimeout(() => d.classList.add('out'), 2600); setTimeout(() => d.remove(), 3200); while ($('#toasts').children.length > 4) $('#toasts').firstChild.remove(); }
let _banT = 0;
function banner(t, s = '', dur = 2.6) { const b = $('#banner'); b.innerHTML = `<b>${esc(t)}</b>${s ? `<span>${esc(s)}</span>` : ''}`; b.className = 'show'; clearTimeout(_banT); _banT = setTimeout(() => b.className = '', dur * 1000); }
function log(html, cls) { const l = $('#chatlog'), d = document.createElement('div'); d.innerHTML = html; if (cls) d.className = cls; l.appendChild(d); while (l.children.length > 60) l.firstChild.remove(); l.scrollTop = l.scrollHeight; }
let _spT = 0;
function speech(n, t) { const s = $('#speech'); s.innerHTML = `<b>${esc(n)}</b> ${esc(t)}`; s.className = 'show'; clearTimeout(_spT); _spT = setTimeout(() => s.className = '', 5000); }
function achPop(a) { const d = document.createElement('div'); d.className = 'ach'; d.innerHTML = `<i>${a.i}</i><div><small>Conquista desbloqueada</small><b>${a.n}</b><span>${a.d}</span></div>`; document.body.appendChild(d); setTimeout(() => d.classList.add('out'), 3800); setTimeout(() => d.remove(), 4400); }
function tip(id, t) { if (!P) return; P.tut = P.tut || {}; if (P.tut[id]) return; P.tut[id] = 1; setTimeout(() => { const d = $('#tip'); d.innerHTML = '💡 ' + esc(t); d.className = 'show'; setTimeout(() => d.className = '', 7000); }, 600); }
function fade(fn) { const f = $('#fade'); f.style.opacity = 1; setTimeout(() => { fn(); setTimeout(() => f.style.opacity = 0, 120); }, 380); }

/* ---------- Números flutuantes ---------- */
const DMG = [];
const _pv = new T.Vector3();
function dmgText(x, y, z, t, c, big) {
  if (!CFG.dmg && !/XP|💰|\+/.test(t)) return;
  let d = DMG.find(o => o.life <= 0);
  if (!d) { if (DMG.length > 60) return; const e = document.createElement('div'); e.className = 'fl'; $('#dmg').appendChild(e); d = { e, life: 0 }; DMG.push(d); }
  d.x = x + rn(-.4, .4); d.y = y; d.z = z + rn(-.4, .4); d.life = d.max = big ? 1.2 : .95; d.e.textContent = t; d.e.style.color = c; d.e.style.fontSize = big ? '26px' : '17px'; d.e.style.display = 'block';
}
function updateDmg(dt) {
  for (const d of DMG) {
    if (d.life <= 0) continue; d.life -= dt; if (d.life <= 0) { d.e.style.display = 'none'; continue; }
    const p = 1 - d.life / d.max; _pv.set(d.x, d.y + p * 1.6, d.z).project(cam);
    if (_pv.z > 1) { d.e.style.display = 'none'; continue; }
    d.e.style.display = 'block';
    d.e.style.transform = `translate(${(_pv.x * .5 + .5) * innerWidth}px,${(-_pv.y * .5 + .5) * innerHeight}px) translate(-50%,-50%) scale(${p < .15 ? .6 + p * 3 : 1})`;
    d.e.style.opacity = p > .7 ? (1 - p) / .3 : 1;
  }
}

/* ---------- Diálogo ---------- */
let DLGS = null;
function dialog(n, lines, opts) {
  DLGS = { n, lines: lines.map(tx), i: 0, opts: opts || [{ t: 'Continuar' }], shown: 0 };
  MODAL = 'dlg'; $('#dlg').hidden = false; AU.play('open'); drawDialog();
}
function drawDialog() {
  const D = DLGS, last = D.i >= D.lines.length - 1;
  $('#dlg').innerHTML = `<div class="dn">${D.n.i || '💬'} ${esc(D.n.n)}</div><div class="dt">${esc(D.lines[D.i])}</div>
  <div class="do">${last ? D.opts.map((o, k) => `<button data-act="dopt" data-i="${k}">${esc(o.t)}</button>`).join('') : '<button data-act="dnext">Continuar ▸</button>'}</div><small>${D.i + 1}/${D.lines.length}</small>`;
}
function dialogNext() { if (!DLGS) return; if (DLGS.i < DLGS.lines.length - 1) { DLGS.i++; AU.play('ui'); drawDialog(); } else if (DLGS.opts.length === 1) dialogOpt(0); }
function dialogOpt(k) { const o = DLGS.opts[k]; closeDialog(); if (o && o.f) o.f(); }
function closeDialog() { DLGS = null; $('#dlg').hidden = true; if (MODAL === 'dlg') MODAL = null; }

/* ---------- Janelas ---------- */
const WT = { inv: '🎒 Mochila', char: '👤 Personagem', skills: '✨ Habilidades', quests: '📜 Missões', map: '🗺️ Mapa de Aethra', shop: '💰 Mercador Tobias', forge: '⚒️ Forja da Brunhilda', refine: '⚒️ Refino', tele: '🌀 Pedras de Teleporte', bounty: '📜 Quadro de Caçadas', menu: '⚙️ Menu', settings: '⚙️ Configurações', help: '🎮 Controles' };
function openWin(w) { if (WIN === w) return closeWin(); WIN = w; MODAL = 'win'; $('#win').hidden = false; AU.play('open'); refreshWin(); }
function closeWin() { WIN = null; $('#win').hidden = true; if (MODAL === 'win') MODAL = null; }
function refreshWin() { if (!WIN || !P) return; const el = $('#win'); el.className = 'w-' + WIN; el.innerHTML = `<header><b>${WT[WIN]}</b><span>💰 ${fmt(P.gold)}</span><button data-act="close">✖</button></header><section>${WR_[WIN]()}</section>`; if (WIN === 'map') drawBigMap(); }
const statLine = (k, v) => `<div class="st"><span>${STAT_N[k]}</span><b>${PCT[k] ? '+' + (Math.round(v * 10) / 10) + '%' : '+' + Math.round(v)}</b></div>`;
function itemHTML(it, opts = {}) {
  const st = itemStats(it), cur = P.eq[it.s], cs = cur && cur !== it ? itemStats(cur) : null;
  let h = `<div class="ih" style="--rc:${RAR[it.r].c}"><div class="in">${itemIcon(it)} ${esc(itemName(it))}</div><small>${RAR[it.r].n} · ${SLOT_N[it.s]} · Nível ${it.il}</small>`;
  for (const k in st) { const diff = cs ? st[k] - (cs[k] || 0) : 0; h += `<div class="st"><span>${STAT_N[k]}</span><b>${PCT[k] ? '+' + (Math.round(st[k] * 10) / 10) + '%' : '+' + Math.round(st[k])}${cs && Math.abs(diff) >= .5 ? ` <em class="${diff > 0 ? 'up' : 'dn'}">${diff > 0 ? '▲' : '▼'}${Math.abs(Math.round(diff))}</em>` : ''}</b></div>`; }
  if (cs) for (const k in cs) if (!(k in st)) h += `<div class="st"><span>${STAT_N[k]}</span><b><em class="dn">▼${Math.round(cs[k])}</em></b></div>`;
  return h + `<small>Valor de venda: ${Math.round(itemValue(it) / 4)}💰</small></div>`;
}
const slotBox = it => it ? `<div class="slot" style="--rc:${RAR[it.r].c}">${itemIcon(it)}${it.up ? `<i>+${it.up}</i>` : ''}</div>` : '<div class="slot empty"></div>';
const findItem = u => P.inv.find(i => i.u == u) || Object.values(P.eq).find(i => i && i.u == u);
const WR_ = {
  inv() {
    let eq = SLOTS.map(s => `<div class="eqr" data-act="sel" data-u="${P.eq[s] ? P.eq[s].u : ''}"><small>${SLOT_N[s]}</small>${slotBox(P.eq[s])}<span>${P.eq[s] ? `<b style="color:${RAR[P.eq[s].r].c}">${esc(itemName(P.eq[s]))}</b>` : '<i class="mut">vazio</i>'}</span></div>`).join('');
    let grid = ''; for (let i = 0; i < 36; i++) { const it = P.inv[i]; grid += it ? `<div class="cell ${WS.sel == it.u ? 'on' : ''}" data-act="sel" data-u="${it.u}">${slotBox(it)}</div>` : '<div class="cell"></div>'; }
    const sel = WS.sel && findItem(WS.sel);
    const det = sel ? itemHTML(sel) + `<div class="row">${P.eq[sel.s] === sel ? `<button data-act="uneq" data-s="${sel.s}">Desequipar</button>` : `<button class="pri" data-act="equip" data-u="${sel.u}">Equipar</button><button data-act="sell" data-u="${sel.u}">Vender (${Math.round(itemValue(sel) / 4)}💰)</button>`}</div>` : '<p class="mut">Clique num item para ver detalhes.</p>';
    const cons = Object.keys(CONS).filter(k => P.cons[k] > 0).map(k => `<div class="cons" title="${esc(CONS[k].d || '')}"><span>${CONS[k].i} ${CONS[k].n} <b>×${P.cons[k]}</b></span>${k[0] === 'h' || k[0] === 'm' || k === 'scroll' || k === 'elixir' ? `<button data-act="usec" data-k="${k}">Usar</button>` : ''}</div>`).join('') || '<p class="mut">Nenhum.</p>';
    return `<div class="cols"><div><h4>Equipado</h4>${eq}<div class="sum">⚔️ ATK <b>${S.atk}</b> · 🛡️ DEF <b>${S.def}</b> · ❤️ <b>${S.hp}</b> · 💧 <b>${S.mp}</b></div><h4>Consumíveis</h4>${cons}</div>
    <div><h4>Mochila (${P.inv.length}/36) <button class="sm" data-act="sellc">Vender comuns</button></h4><div class="grid">${grid}</div><div class="det">${det}</div></div></div>`;
  },
  char() {
    const a = Object.keys(ATTR).map(k => `<div class="attr"><span><b>${ATTR[k].n}</b> ${P.attr[k]}<small>${ATTR[k].d}</small></span>${P.pts > 0 ? `<button class="sm" data-act="attr" data-k="${k}">+1</button>` : ''}</div>`).join('');
    const st = ['atk', 'def', 'hp', 'mp', 'crit', 'aspd', 'move', 'ls'].map(k => `<div class="st"><span>${STAT_N[k]}</span><b>${PCT[k] ? Math.round(S[k] * 10) / 10 + '%' : fmt(S[k])}</b></div>`).join('');
    const ac = ACH.map(x => `<div class="achi ${P.ach[x.id] ? 'on' : ''}" title="${esc(x.d)}"><i>${x.i}</i><span><b>${x.n}</b><small>${x.d}</small></span></div>`).join('');
    const tm = Math.floor(P.time / 60);
    return `<div class="cols"><div><h4>${CLS[P.cls].i} ${esc(P.name)} — ${CLS[P.cls].n[P.f]} Nv ${P.lv}${P.ng ? ` · NG+${P.ng}` : ''}</h4><p class="mut">${CLS[P.cls].pas}</p>
    <h4>Atributos ${P.pts ? `<em class="up">(${P.pts} pontos)</em> <button class="sm" data-act="auto">Auto</button>` : ''}</h4>${a}<h4>Estatísticas</h4>${st}
    <p class="mut">Monstros derrotados: ${P.kills} · Elites: ${P.elites} · Mortes: ${P.deaths} · Tempo: ${Math.floor(tm / 60)}h${tm % 60}m</p></div>
    <div><h4>🏆 Conquistas (${Object.keys(P.ach).length}/${ACH.length})</h4><div class="achs">${ac}</div></div></div>`;
  },
  skills() {
    return `<p>Pontos de habilidade: <b class="gold">${P.spts}</b> — cada nível de habilidade dá +20% de efeito e −5% de recarga.</p>` + SKILLS[P.cls].map((s, i) => {
      const r = P.sk[s.id] || 0, K = skillInfo(i);
      return `<div class="skl ${r ? '' : 'lock'}"><i>${s.i}</i><div><b>${s.n}</b> ${r ? `<span class="rk">${'★'.repeat(r)}${'☆'.repeat(5 - r)}</span>` : `<span class="mut">libera no nível ${s.lv}</span>`}<small>${s.d}</small><small class="mut">Tecla ${i + 1} · ${K.mp} de mana · recarga ${K.cd.toFixed(1)}s</small></div>${r && r < 5 && P.spts > 0 ? `<button class="sm pri" data-act="skup" data-i="${i}">+1</button>` : ''}</div>`;
    }).join('') + `<div class="skl"><i>💨</i><div><b>Esquiva</b><small>Espaço ou Shift: rola na direção do movimento e fica invulnerável por um instante. Use para escapar das áreas vermelhas!</small></div></div>`;
  },
  quests() {
    const q = curQ();
    let h = `<h4>⭐ História — ${P.q}/${FINAL_Q}</h4><div class="qbox main"><b>${q.t}</b><p>${q.d}</p>${qProg(q, P.qc)}</div>`;
    const act = SIDE.filter(s => P.side[s.id] && P.side[s.id].st < 3);
    h += `<h4>Missões secundárias</h4>` + (act.map(s => `<div class="qbox"><b>${s.t}</b> <small class="mut">(${NPCS.find(n => n.id === s.npc).n})</small><p>${s.st === 2 ? '' : ''}${P.side[s.id].st === 2 ? '✅ Concluída! Volte para entregar.' : sideDesc(s)}</p>${P.side[s.id].st === 1 ? bar(P.side[s.id].c, s.n) : ''}</div>`).join('') || '<p class="mut">Converse com os moradores da vila (ícone ❗) para receber missões.</p>');
    h += `<h4>Contratos de caçada</h4>` + (P.bnt.map(b => `<div class="qbox"><b>Caçar ${SP[b.sp].n}</b>${bar(b.c, b.n)}</div>`).join('') || '<p class="mut">Pegue contratos no Quadro de Caçadas da vila.</p>');
    const done = MAIN.slice(0, P.q).map(x => `<li>${x.t}</li>`).join('');
    return h + (done ? `<h4>Concluídas</h4><ul class="done">${done}</ul>` : '');
  },
  map() { return `<canvas id="bigmap" width="480" height="480"></canvas><p class="mut">🔵 Pedras de teleporte · 👑 Chefes · ⭐ Objetivo · ⚪ Você</p>`; },
  shop() { return `<p class="mut">Poções curam uma porcentagem da sua vida/mana máxima. Mais itens liberam conforme você derrota guardiões.</p>` + consAvail().map(k => `<div class="cons"><span>${CONS[k].i} <b>${CONS[k].n}</b> <small class="mut">${CONS[k].d || (CONS[k].hp ? 'Cura ' + CONS[k].hp * 100 + '% da vida' : 'Recupera ' + CONS[k].mp * 100 + '% da mana')}</small><small>Você tem: ${P.cons[k] || 0}</small></span><button data-act="buyc" data-k="${k}" data-n="1">${CONS[k].price}💰</button><button data-act="buyc" data-k="${k}" data-n="5">×5 ${CONS[k].price * 5}💰</button></div>`).join(''); },
  forge() { const st = forgeStock(); return `<p class="mut">Equipamentos para o seu nível de progresso. Derrote guardiões para liberar peças melhores.</p><div class="shopg">` + st.map((it, i) => `<div class="sitem">${itemHTML(it)}<button class="pri" data-act="buyg" data-i="${i}" ${P.gold < buyPrice(it) ? 'disabled' : ''}>Comprar ${fmt(buyPrice(it))}💰</button></div>`).join('') + `</div>${st.length ? '' : '<p>Estoque esgotado! Volte depois de derrotar o próximo guardião.</p>'}`; },
  refine() {
    const list = SLOTS.map(s => P.eq[s]).filter(Boolean).concat(P.inv);
    return `<p class="mut">Refinar aumenta todos os atributos base do item em +8% por nível. A partir do +5 é preciso uma 💠 Pedra de Refino (você tem ${P.cons.stone || 0}), e uma falha faz o item perder um nível.</p>` + (list.map(it => `<div class="cons"><span>${slotBox(it)} <b style="color:${RAR[it.r].c}">${esc(itemName(it))}</b>${Object.values(P.eq).includes(it) ? ' <small class="gold">(equipado)</small>' : ''}<small>${it.up >= 10 ? 'Máximo' : `+${it.up} → +${it.up + 1} · chance ${REFINE_CHANCE[it.up]}% · ${fmt(refineCost(it))}💰${it.up >= 4 ? ' + 💠' : ''}`}</small></span>${it.up < 10 ? `<button class="pri" data-act="refine" data-u="${it.u}">Refinar</button>` : ''}</div>`).join('') || '<p>Nenhum item.</p>');
  },
  tele() { return WAYS.map(w => { const ok = P.ways.includes(w.id); return `<div class="cons"><span>${ok ? '🔵' : '⚫'} <b>${w.n}</b><small>${ok ? ZONES[w.id].lv : 'Ainda não descoberta — toque na pedra para ativar'}</small></span>${ok ? `<button class="pri" data-act="tp" data-i="${w.id}">Teleportar</button>` : ''}</div>`; }).join(''); },
  bounty() {
    return `<p class="mut">Contratos repetíveis: derrote monstros e receba ouro e experiência na hora.</p><h4>Disponíveis <button class="sm" data-act="bref">Novos contratos (${20 + P.lv * 5}💰)</button></h4>` +
      P.bOff.map((b, i) => `<div class="cons"><span>🎯 <b>Caçar ${b.n} × ${SP[b.sp].n}</b><small>${ZONES[SP[b.sp].z].n} · Recompensa: ${fmt(b.gold)}💰 + ${fmt(b.xp)} XP</small></span><button class="pri" data-act="bacc" data-i="${i}" ${P.bnt.length >= 3 ? 'disabled' : ''}>Aceitar</button></div>`).join('') +
      `<h4>Ativos (${P.bnt.length}/3)</h4>` + (P.bnt.map(b => `<div class="qbox"><b>Caçar ${SP[b.sp].n}</b>${bar(b.c, b.n)}</div>`).join('') || '<p class="mut">Nenhum.</p>');
  },
  menu() { return `<div class="menu"><button class="pri" data-act="close">▶ Continuar</button><button data-act="win" data-w="settings">⚙️ Configurações</button><button data-act="win" data-w="help">🎮 Controles</button><button data-act="save">💾 Salvar agora</button>${P.q >= FINAL_Q ? '<button data-act="ngp">🔁 Novo Jogo+</button>' : ''}<button data-act="totitle">🏠 Voltar ao título</button></div>`; },
  settings() {
    const sl = (k, n) => `<label class="cfg">${n}<input type="range" min="0" max="1" step=".05" value="${CFG[k]}" data-cfg="${k}"></label>`, ck = (k, n) => `<label class="cfg"><input type="checkbox" data-cfg="${k}" ${CFG[k] ? 'checked' : ''}> ${n}</label>`;
    return sl('music', '🎵 Música') + sl('sfx', '🔊 Efeitos') + ck('dmg', 'Mostrar números de dano') + ck('shake', 'Tremer a tela') + ck('shadows', 'Sombras (recarregue a página)') + ck('hq', 'Alta qualidade (recarregue a página)') + '<button data-act="win" data-w="menu">◂ Voltar</button>';
  },
  help() {
    return `<div class="help">${[['Andar', 'WASD / setas, ou clique no chão (segure para seguir o mouse)'], ['Atacar', 'Clique no monstro (ataque automático) · F ou Tab: alvo mais próximo'], ['Habilidades', '1 a 5'], ['Esquiva', 'Espaço ou Shift'], ['Poções', 'Q = vida · R = mana'], ['Interagir', 'E (falar, teleportar, portal)'], ['Câmera', 'Botão direito + arrastar: girar · Roda do mouse: zoom'], ['Janelas', 'I mochila · C personagem · K habilidades · J missões · M mapa'], ['Outros', 'B pergaminho de retorno · Enter chat · Esc menu'], ['Celular', 'Joystick à esquerda, botões à direita; arraste a tela para girar a câmera']].map(([a, b]) => `<div class="st"><span>${a}</span><b>${b}</b></div>`).join('')}</div><p class="mut">Dica: áreas vermelhas no chão mostram onde o ataque do chefe vai cair — saia delas!</p>` + (GAME === 'play' ? '<button data-act="win" data-w="menu">◂ Voltar</button>' : '');
  }
};
const bar = (c, n) => `<div class="qbar"><i style="width:${Math.min(100, c / n * 100)}%"></i><span>${Math.min(c, n)}/${n}</span></div>`;
function qProg(q, c) { return q.n ? bar(c, q.n) : ''; }
function sideDesc(s) { return s.type === 'elite' ? `Derrote ${s.n} monstros de elite (brilho dourado).` : s.type === 'collect' ? `Colete ${s.n}× ${s.item} de ${SP[s.sp].n} (${ZONES[SP[s.sp].z].n}).` : `Derrote ${s.n}× ${SP[s.sp].n} (${ZONES[SP[s.sp].z].n}).`; }

/* ---------- Ações dos botões ---------- */
const ACT = {
  close() { closeWin(); }, win(d) { WIN = null; openWin(d.w); },
  sel(d) { if (d.u) { WS.sel = +d.u; AU.play('ui'); refreshWin(); } },
  equip(d) { const it = findItem(d.u); if (it) equip(it); }, uneq(d) { unequip(d.s); },
  sell(d) { const it = findItem(d.u); if (it) { sellItem(it); WS.sel = null; refreshWin(); } },
  sellc() { const l = P.inv.filter(i => i.r === 0); l.forEach(sellItem); toast(l.length ? `Vendeu ${l.length} itens comuns` : 'Nenhum item comum'); },
  usec(d) { const k = d.k; if (k[0] === 'h' || k[0] === 'm') { const own = P.cons; const keep = {}; ['1', '2', '3'].forEach(n => { if (k[0] + n !== k) { keep[k[0] + n] = own[k[0] + n]; own[k[0] + n] = 0; } }); usePotion(k[0]); Object.assign(own, keep); } else if (k === 'scroll') { closeWin(); useScroll(); } else if (k === 'elixir') { P.cons.elixir--; PL.buffs.elixir = 600; AU.play('buff'); toast('⚗️ +50% de experiência por 10 minutos!', '#c9a8ff'); } refreshWin(); },
  attr(d) { if (P.pts > 0) { P.pts--; P.attr[d.k]++; AU.play('ui'); calc(); refreshWin(); } },
  auto() { const a = CLS[P.cls].auto, tot = Object.values(a).reduce((x, y) => x + y); while (P.pts > 0) { let best = null, bv = -1e9; for (const k in a) { const v = a[k] / tot - P.attr[k] / Math.max(1, Object.values(P.attr).reduce((x, y) => x + y)); if (a[k] && v > bv) { bv = v; best = k; } } P.attr[best]++; P.pts--; } calc(); refreshWin(); },
  skup(d) { const s = SKILLS[P.cls][d.i]; if (P.spts > 0 && P.sk[s.id] < 5) { P.spts--; P.sk[s.id]++; AU.play('level'); refreshWin(); } },
  buyc(d) { buyCons(d.k, +d.n); }, buyg(d) { buyGear(+d.i); refreshWin(); },
  refine(d) { const it = findItem(d.u); if (it) refine(it); },
  tp(d) { const w = WAYS[d.i]; closeWin(); teleport(w.x + 2.5, w.z + 2.5); },
  bacc(d) { if (P.bnt.length >= 3) return; P.bnt.push(P.bOff.splice(d.i, 1)[0]); AU.play('quest'); if (!P.bOff.length) refreshBounties(true); refreshWin(); },
  bref() { const c = 20 + P.lv * 5; if (P.gold < c) return toast('💰 Ouro insuficiente'); P.gold -= c; refreshBounties(true); refreshWin(); },
  save() { saveGame(); toast('💾 Jogo salvo!', '#5fe08a'); },
  totitle() { saveGame(); location.reload(); },
  ngp() { closeWin(); startNGPlus(); },
  dnext() { dialogNext(); }, dopt(d) { dialogOpt(+d.i); },
  skill(d) { useSkill(+d.i); }, pot(d) { usePotion(d.k); }, dodge() { dodge(); }, act() { const o = PL.interact; if (o) interact(o); else attackNearest(); },
  menu(d) { openWin(d.w); }
};
document.addEventListener('click', e => {
  AU.init();
  const b = e.target.closest('[data-act]'); if (!b || b.disabled) return;
  const f = ACT[b.dataset.act]; if (f && P) { f(b.dataset); e.stopPropagation(); }
});
document.addEventListener('input', e => { const k = e.target.dataset && e.target.dataset.cfg; if (!k) return; CFG[k] = e.target.type === 'checkbox' ? e.target.checked : +e.target.value; saveCfg(); AU.setVol(); });

/* ---------- HUD ---------- */
function setBarEl(el, v, m, txt) { el.firstElementChild.style.width = clamp(v / m * 100, 0, 100) + '%'; el.lastElementChild.textContent = txt != null ? txt : fmt(v) + ' / ' + fmt(m); }
function buildHotbar() {
  $('#hot').innerHTML = SKILLS[P.cls].map((s, i) => `<button class="hk" data-act="skill" data-i="${i}" id="sk${i}"><i>${s.i}</i><em></em><kbd>${i + 1}</kbd><small></small></button>`).join('') +
    `<button class="hk pot" data-act="pot" data-k="h"><i>❤️</i><kbd>Q</kbd><small id="ph"></small></button><button class="hk pot" data-act="pot" data-k="m"><i>🔹</i><kbd>R</kbd><small id="pm"></small></button><button class="hk pot" data-act="dodge" id="skd"><i>💨</i><em></em><kbd>Esp</kbd></button>`;
}
function updateHUD() {
  $('#pn').textContent = `${P.name} · Nv ${P.lv}`; $('#pc').textContent = CLS[P.cls].i;
  setBarEl($('#php'), P.hp, S.hp, fmt(P.hp) + ' / ' + fmt(S.hp) + (PL.shield > 0 ? ` (+${fmt(PL.shield)}🛡)` : ''));
  setBarEl($('#pmp'), P.mp, S.mp);
  setBarEl($('#xpb'), P.xp, needXP(P.lv), `Nível ${P.lv} — ${fmt(P.xp)} / ${fmt(needXP(P.lv))} XP (${Math.floor(P.xp / needXP(P.lv) * 100)}%)`);
  const bf = []; const B = PL.buffs;
  if (B.grito > 0) bf.push(['📯', B.grito]); if (B.instinto > 0) bf.push(['🐺', B.instinto]); if (B.salto > 0) bf.push(['💨', B.salto]); if (B.elixir > 0) bf.push(['⚗️', B.elixir]); if (PL.shield > 0) bf.push(['🔮', PL.shieldT]);
  if (PL.slowT > 0) bf.push(['🐌', PL.slowT, 1]); if (PL.burnT > 0) bf.push(['🔥', PL.burnT, 1]); if (PL.curseT > 0) bf.push(['☠️', PL.curseT, 1]); if (PL.rootT > 0) bf.push(['🌿', PL.rootT, 1]);
  $('#buffs').innerHTML = bf.map(([i, t, bad]) => `<span class="${bad ? 'bad' : ''}">${i}<small>${t > 60 ? Math.ceil(t / 60) + 'm' : Math.ceil(t)}</small></span>`).join('');
  $('#gold').textContent = '💰 ' + fmt(P.gold);
  const t = PL.tgt, tf = $('#tframe');
  if (t && !t.dead && !t.isB) { tf.hidden = false; tf.querySelector('b').innerHTML = `${t.elite ? '⭐ ' + t.elite + ' ' : ''}${esc(t.sp.n)} <small>Nv ${t.lv}</small>`; setBarEl(tf.querySelector('.bar'), t.hp, t.max); tf.querySelector('small.ex').textContent = t.elite ? ELITE_AFX[t.elite] : t.sp.dummy ? 'Bata à vontade!' : ''; } else tf.hidden = true;
  const bb = $('#bossbar'); if (BOSSF && !BOSSF.dead) { bb.hidden = false; bb.querySelector('b').innerHTML = `👑 ${esc(BOSSF.sp.n)} <small>${esc(BOSSF.sp.title)} · Nv ${BOSSF.lv}</small>`; setBarEl(bb.querySelector('.bar'), BOSSF.hp, BOSSF.max, Math.ceil(BOSSF.hp / BOSSF.max * 100) + '%'); } else bb.hidden = true;
  SKILLS[P.cls].forEach((s, i) => { const b = $('#sk' + i), K = skillInfo(i), cd = PL.skc[i]; b.classList.toggle('lock', !K.r); b.classList.toggle('nomp', K.r && P.mp < K.mp); b.querySelector('em').style.height = (cd > 0 ? cd / K.cd * 100 : 0) + '%'; b.querySelector('small').textContent = !K.r ? 'Nv' + s.lv : cd > 0 ? cd.toFixed(1) : K.mp; b.title = `${s.n}: ${s.d}`; });
  $('#skd em').style.height = (PL.dodgeCd > 0 ? PL.dodgeCd / 1.3 * 100 : 0) + '%';
  $('#ph').textContent = ['h1', 'h2', 'h3'].reduce((a, k) => a + (P.cons[k] || 0), 0); $('#pm').textContent = ['m1', 'm2', 'm3'].reduce((a, k) => a + (P.cons[k] || 0), 0);
  $('#bC').classList.toggle('badge', P.pts > 0); $('#bK').classList.toggle('badge', P.spts > 0);
  // rastreador
  const q = curQ(); let h = `<div class="tq"><b>⭐ ${q.t}</b><span>${q.d}</span>${q.n ? `<em>${Math.min(P.qc, q.n)}/${q.n}</em>` : ''}</div>`;
  for (const s of SIDE) { const st = P.side[s.id]; if (st && st.st < 3) h += `<div class="tq side"><b>${s.t}</b>${st.st === 2 ? '<span>✅ Volte para entregar</span>' : `<em>${st.c}/${s.n}</em>`}</div>`; }
  for (const b of P.bnt) h += `<div class="tq side"><b>🎯 ${SP[b.sp].n}</b><em>${b.c}/${b.n}</em></div>`;
  if ($('#tracker').innerHTML !== h) $('#tracker').innerHTML = h;
  const pr = $('#prompt'), o = PL.interact;
  if (o && !MODAL) { pr.hidden = false; pr.innerHTML = `<kbd>E</kbd> ${o.kind === 'npc' ? (o.id === 'quadro' ? 'Ver ' : 'Falar com ') + esc(o.n) : o.kind === 'way' ? 'Usar Pedra de Teleporte' : o.kind === 'portal' ? (P.q >= PORTAL_Q ? 'Entrar no Portal do Abismo' : 'Portal selado') : 'Voltar para a vila'}`; } else pr.hidden = true;
}

/* ---------- Minimapa e mapa ---------- */
const MM = $('#mini'), mmx = MM.getContext('2d');
function mapMarks() {
  const out = [];
  WAYS.forEach(w => P.ways.includes(w.id) && out.push({ x: w.x, z: w.z, c: '#4ad8ff', s: 3.5, t: 'd' }));
  for (const k in LAIRS) if (!P.boss[k] || true) out.push({ x: LAIRS[k].x, z: LAIRS[k].z, i: '👑', alive: true, k });
  for (const n of NPCS) out.push({ x: n.x, z: n.z, c: '#ffd23f', s: 2, t: 'd' });
  return out;
}
function drawMini() {
  const W = 180, R2 = 90, sc = 1.6, ab = inAbyss();
  mmx.save(); mmx.clearRect(0, 0, W, W); mmx.beginPath(); mmx.arc(R2, R2, R2 - 2, 0, TAU); mmx.clip();
  mmx.translate(R2, R2); mmx.rotate(CAM.yaw); mmx.scale(sc, sc); mmx.translate(-PL.x, -PL.z);
  if (ab) { mmx.fillStyle = '#0c0614'; mmx.fillRect(PL.x - 100, PL.z - 100, 200, 200); mmx.fillStyle = '#3a2650'; ABYSS.plats.forEach(p => { mmx.beginPath(); mmx.arc(p[0], p[1], p[2], 0, TAU); mmx.fill(); }); ABYSS.bridges.forEach(b => mmx.fillRect(b[0] - b[4] / 2, b[3], b[4], b[1] - b[3])); }
  else mmx.drawImage(MAPC, -240, -240);
  for (const m of MON) { if (m.dead || (m.x > 600) !== ab || Math.abs(m.x - PL.x) > 70 || Math.abs(m.z - PL.z) > 70) continue; mmx.fillStyle = m.isB ? '#ff9a3d' : m.elite ? '#ffd23f' : m.sp.dummy ? '#aaa' : '#ff4a4a'; const r = m.isB ? 3.2 : 1.4; mmx.fillRect(m.x - r, m.z - r, r * 2, r * 2); }
  for (const n of NPCS) { mmx.fillStyle = '#ffd23f'; mmx.beginPath(); mmx.arc(n.x, n.z, 1.6, 0, TAU); mmx.fill(); }
  WAYS.forEach(w => { mmx.fillStyle = P.ways.includes(w.id) ? '#4ad8ff' : '#666'; mmx.beginPath(); mmx.arc(w.x, w.z, 2.2, 0, TAU); mmx.fill(); });
  for (const b of BOTS) { mmx.fillStyle = '#9fd0ff'; mmx.fillRect(b.x - 1, b.z - 1, 2, 2); }
  mmx.restore();
  const qt = questTarget();
  if (qt) { const dx = qt.x - PL.x, dz = qt.z - PL.z, a = Math.atan2(dx, dz) - CAM.yaw, d = Math.hypot(dx, dz) * sc, rr = Math.min(R2 - 10, d); const sx = R2 - Math.sin(-a) * rr * 0 + Math.sin(a) * rr, sy = R2 + Math.cos(a) * rr; mmx.font = '16px sans-serif'; mmx.textAlign = 'center'; mmx.textBaseline = 'middle'; mmx.fillText('⭐', sx, sy); }
  mmx.save(); mmx.translate(R2, R2); mmx.rotate(-(PL.ry - CAM.yaw) + Math.PI); mmx.fillStyle = '#fff'; mmx.strokeStyle = '#000'; mmx.lineWidth = 1.5; mmx.beginPath(); mmx.moveTo(0, -7); mmx.lineTo(5, 5); mmx.lineTo(0, 2); mmx.lineTo(-5, 5); mmx.closePath(); mmx.fill(); mmx.stroke(); mmx.restore();
  mmx.save(); mmx.translate(R2, R2); mmx.rotate(CAM.yaw); mmx.fillStyle = '#ffd23f'; mmx.font = 'bold 13px sans-serif'; mmx.textAlign = 'center'; mmx.textBaseline = 'middle'; mmx.fillText('N', 0, -R2 + 11); mmx.restore();
}
function exploredIdx(x, z) { const i = Math.floor((x + 240) / 10), j = Math.floor((z + 240) / 10); return i < 0 || j < 0 || i > 47 || j > 47 ? -1 : j * 48 + i; }
function markExplored() {
  if (inAbyss()) return; let e = P.exp.length === 2304 ? P.exp.split('') : new Array(2304).fill('0'), ch = false;
  for (let dx = -3; dx <= 3; dx++) for (let dz = -3; dz <= 3; dz++) { if (dx * dx + dz * dz > 10) continue; const k = exploredIdx(PL.x + dx * 10, PL.z + dz * 10); if (k >= 0 && e[k] !== '1') { e[k] = '1'; ch = true; } }
  if (ch || P.exp.length !== 2304) P.exp = e.join('');
}
function drawBigMap() {
  const c = $('#bigmap'); if (!c) return; const x = c.getContext('2d');
  x.drawImage(MAPC, 0, 0);
  const fg = document.createElement('canvas'); fg.width = fg.height = 480; const f = fg.getContext('2d');
  f.fillStyle = 'rgba(8,6,16,.94)'; f.fillRect(0, 0, 480, 480); f.globalCompositeOperation = 'destination-out'; f.filter = 'blur(6px)';
  for (let k = 0; k < 2304; k++) if (P.exp[k] === '1') f.fillRect((k % 48) * 10 - 2, Math.floor(k / 48) * 10 - 2, 14, 14);
  x.drawImage(fg, 0, 0);
  x.font = 'bold 11px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
  WAYS.forEach(w => { if (!P.ways.includes(w.id)) return; x.fillStyle = '#4ad8ff'; x.beginPath(); x.arc(w.x + 240, w.z + 240, 4, 0, TAU); x.fill(); });
  for (const k in LAIRS) { const l = LAIRS[k]; if (l.x > 600) continue; if (P.exp[exploredIdx(l.x, l.z)] !== '1') continue; x.font = '15px sans-serif'; x.fillText(P.boss[k] ? '💀' : '👑', l.x + 240, l.z + 240); }
  x.font = 'bold 11px sans-serif'; x.fillStyle = '#fff'; x.strokeStyle = 'rgba(0,0,0,.8)'; x.lineWidth = 3;
  [['Vila', 0, 0], ['Planície Verde', 40, 30], ['Floresta Sombria', -60, 80], ['Deserto Dourado', 70, 100], ['Tundra Gélida', -150, 20], ['Vulcão Infernal', 150, -120]].forEach(([n, a, b]) => { if (P.exp[exploredIdx(a, b)] !== '1') return; x.strokeText(n, a + 240, b + 240 - 14); x.fillText(n, a + 240, b + 240 - 14); });
  const qt = questTarget(); if (qt) { x.font = '18px sans-serif'; x.fillText('⭐', qt.x + 240, qt.z + 240); }
  if (!inAbyss()) { x.fillStyle = '#fff'; x.beginPath(); x.arc(PL.x + 240, PL.z + 240, 5, 0, TAU); x.fill(); x.strokeStyle = '#000'; x.lineWidth = 2; x.stroke(); }
  else { x.fillStyle = '#fff'; x.font = 'bold 14px sans-serif'; x.fillText('Você está na Fenda do Abismo', 240, 460); }
}

/* ---------- Entrada: teclado ---------- */
function moveInput() {
  let kx = (KEYS.d || KEYS.arrowright ? 1 : 0) - (KEYS.a || KEYS.arrowleft ? 1 : 0), kz = (KEYS.w || KEYS.arrowup ? 1 : 0) - (KEYS.s || KEYS.arrowdown ? 1 : 0);
  if (JOY.on) { kx = JOY.x; kz = -JOY.y; }
  if (MODAL || $('#chatin') === document.activeElement) kx = kz = 0;
  const l = Math.hypot(kx, kz); if (l < .15) return { x: 0, z: 0 };
  const y = CAM.yaw, fx = -Math.sin(y), fz = -Math.cos(y), rx = Math.cos(y), rz = -Math.sin(y), s = Math.min(1, l) / l;
  return { x: (rx * kx + fx * kz) * s, z: (rz * kx + fz * kz) * s };
}
function attackNearest() { const m = nearestEnemy(16); if (m) { PL.tgt = m; PL.mv = null; } else toast('Nenhum inimigo por perto', '#aaa'); }
addEventListener('keydown', e => {
  AU.init();
  const k = e.key.toLowerCase(), chat = $('#chatin');
  if (document.activeElement === chat) { if (k === 'enter') { sendChat(chat.value); chat.value = ''; chat.blur(); } else if (k === 'escape') chat.blur(); return; }
  if (e.target.tagName === 'INPUT') return;
  if (GAME !== 'play') { if (GAME === 'intro' && (k === ' ' || k === 'enter')) introNext(); return; }
  KEYS[k] = 1;
  if (k === 'tab') e.preventDefault();
  if (MODAL === 'dlg') { if (k === ' ' || k === 'enter' || k === 'e') dialogNext(); else if (k === 'escape') closeDialog(); else if (/^[1-4]$/.test(k) && DLGS.i >= DLGS.lines.length - 1 && DLGS.opts[+k - 1]) dialogOpt(+k - 1); return; }
  if (k === 'escape') { if (WIN) closeWin(); else openWin('menu'); return; }
  if (k === 'enter') { chat.focus(); return; }
  if (PL.dead) return;
  if ('12345'.includes(k) && k.length === 1) useSkill(+k - 1);
  else if (k === ' ' || k === 'shift') { e.preventDefault(); dodge(); }
  else if (k === 'q' || k === 'h') usePotion('h');
  else if (k === 'r') usePotion('m');
  else if (k === 'e') { if (PL.interact) interact(PL.interact); }
  else if (k === 'f' || k === 'tab') { const l = MON.filter(m => !m.dead && !m.untarget && !m.sp.dummy && mdist(m) < 18).sort((a, b) => mdist(a) - mdist(b)); if (l.length) { const i = l.indexOf(PL.tgt); PL.tgt = l[(i + 1) % l.length]; PL.mv = null; } }
  else if (k === 'i') openWin('inv'); else if (k === 'c') openWin('char'); else if (k === 'k') openWin('skills'); else if (k === 'j' || k === 'l') openWin('quests'); else if (k === 'm') openWin('map');
  else if (k === 'b') useScroll();
});
addEventListener('keyup', e => { KEYS[e.key.toLowerCase()] = 0; });
addEventListener('blur', () => { for (const k in KEYS) KEYS[k] = 0; });
function sendChat(t) {
  t = t.trim().slice(0, 80); if (!t) return;
  log(`<b class="me">${esc(P.name)}:</b> ${esc(t)}`);
  for (const [re, ans] of BOT_REPLY) if (re.test(t)) { setTimeout(() => log(`<b class="bot">${pick(BOT_NAMES)}:</b> ${esc(tx(pick(ans)))}`), rn(900, 2500)); break; }
}

/* ---------- Entrada: mouse e toque ---------- */
const CV = ren.domElement;
let MDOWN = null, HOLD = false, MPOS = { x: 0, y: 0 }, _hovT = 0;
const _ray = new T.Raycaster(), _mv = new T.Vector2();
function groundAt(cx, cy) {
  _mv.set(cx / innerWidth * 2 - 1, -cy / innerHeight * 2 + 1); _ray.setFromCamera(_mv, cam);
  const o = _ray.ray.origin, d = _ray.ray.direction;
  if (inAbyss()) { if (d.y >= 0) return null; const t = -o.y / d.y; return { x: o.x + d.x * t, z: o.z + d.z * t }; }
  let prev = 0;
  for (let t = 1; t < 260; t += 1) { const x = o.x + d.x * t, y = o.y + d.y * t, z = o.z + d.z * t; if (y < H(x, z)) { let a = prev, b = t; for (let k = 0; k < 8; k++) { const m = (a + b) / 2; if (o.y + d.y * m < H(o.x + d.x * m, o.z + d.z * m)) b = m; else a = m; } return { x: o.x + d.x * b, z: o.z + d.z * b }; } prev = t; }
  return null;
}
function pickAt(cx, cy) {
  let best = null, bd = 1e9;
  const test = (x, y, z, h, rpx, obj) => { _pv.set(x, y + h * .5, z).project(cam); if (_pv.z > 1) return; const sx = (_pv.x * .5 + .5) * innerWidth, sy = (-_pv.y * .5 + .5) * innerHeight; _pv.set(x, y + h, z).project(cam); const r = Math.max(rpx, Math.abs((-_pv.y * .5 + .5) * innerHeight - sy) * 1.1); const d = Math.hypot(cx - sx, cy - sy); if (d < r && d < bd) { bd = d; best = obj; } };
  for (const m of MON) if (!m.dead && !m.untarget && m.g.visible && mdist(m) < 45) test(m.x, m.y + (m.lift || 0), m.z, m.h, 26, m);
  for (const o of INTER) if (Math.abs(o.x - PL.x) < 45 && Math.abs(o.z - PL.z) < 45 && (o.kind !== 'portal' || P.q >= PORTAL_Q)) test(o.x, groundY(o.x, o.z), o.z, o.kind === 'npc' ? 2.6 : 4, 24, o);
  return best;
}
CV.addEventListener('contextmenu', e => e.preventDefault());
CV.addEventListener('pointerdown', e => {
  AU.init(); MDOWN = { x: e.clientX, y: e.clientY, b: e.button, t: performance.now(), touch: e.pointerType === 'touch', moved: 0 };
  if ($('#chatin') === document.activeElement) $('#chatin').blur();
  if (GAME !== 'play' || MODAL) return;
  if (e.button === 0 && !MDOWN.touch) clickWorld(e.clientX, e.clientY);
});
addEventListener('pointermove', e => {
  MPOS.x = e.clientX; MPOS.y = e.clientY;
  if (!MDOWN) return;
  const dx = e.clientX - (MDOWN.lx ?? MDOWN.x), dy = e.clientY - (MDOWN.ly ?? MDOWN.y); MDOWN.lx = e.clientX; MDOWN.ly = e.clientY; MDOWN.moved += Math.abs(dx) + Math.abs(dy);
  if (MDOWN.b === 2 || (MDOWN.touch && MDOWN.moved > 12)) { CAM.yaw -= dx * .008; CAM.pitch = clamp(CAM.pitch + dy * .005, .45, 1.3); }
});
addEventListener('pointerup', e => {
  if (MDOWN && MDOWN.touch && MDOWN.moved <= 12 && GAME === 'play' && !MODAL && e.target === CV) clickWorld(e.clientX, e.clientY, true);
  MDOWN = null; HOLD = false;
});
function clickWorld(cx, cy, tap) {
  if (PL.dead) return;
  const o = pickAt(cx, cy);
  if (o && o.sp) { PL.tgt = o; PL.mv = null; PL.pend = null; return; }
  if (o) { PL.mv = { x: o.x, z: o.z, inter: o }; PL.tgt = null; return; }
  const g = groundAt(cx, cy); if (!g) return;
  PL.mv = { x: g.x, z: g.z }; PL.tgt = null; PL.pend = null; HOLD = !tap;
  FX.ring(g.x, groundY(g.x, g.z) + .2, g.z, '#ffffff', 1.2, 12, .35, .3, 2);
}
CV.addEventListener('wheel', e => { CAM.tdist = clamp(CAM.tdist + e.deltaY * .02, 12, 42); e.preventDefault(); }, { passive: false });
// joystick
(() => {
  const j = $('#joy'), k = $('#joyk'); let id = null, cx = 0, cy = 0;
  j.addEventListener('pointerdown', e => { AU.init(); id = e.pointerId; const r = j.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2; JOY.on = true; j.setPointerCapture(id); mv(e); e.preventDefault(); });
  const mv = e => { if (e.pointerId !== id) return; let dx = e.clientX - cx, dy = e.clientY - cy; const l = Math.hypot(dx, dy), M = 48; if (l > M) { dx *= M / l; dy *= M / l; } JOY.x = dx / M; JOY.y = dy / M; k.style.transform = `translate(${dx}px,${dy}px)`; PL.mv = null; };
  j.addEventListener('pointermove', mv);
  const up = e => { if (e.pointerId !== id) return; id = null; JOY.on = false; JOY.x = JOY.y = 0; k.style.transform = ''; };
  j.addEventListener('pointerup', up); j.addEventListener('pointercancel', up);
})();

/* ---------- Telas: título, criação, introdução, morte, final ---------- */
const LOOK = { skin: ['#f7dcc4', '#f1c9a0', '#e0a882', '#c68a5e', '#8d5a3c', '#5a3a28'], hair: ['#1a1a1a', '#5a3a1a', '#a0622a', '#d9a03a', '#d9542a', '#eeeeee', '#3a5ad9', '#c04a9a'], hs: ['short', 'spiky', 'long', 'braids', 'bun', 'bald'] };
const HSN = { short: 'Curto', spiky: 'Espetado', long: 'Longo', braids: 'Tranças', bun: 'Coque', bald: 'Careca' };
let CR = null;
function showTitle() {
  GAME = 'title'; const sv = store.get('aethra3d_v2'), old = store.get('aethra3d');
  $('#title').hidden = false; $('#hud').hidden = true;
  $('#title').innerHTML = `<div class="logo"><small>⚔️ Edição Completa ⚔️</small><h1>Aethra Online</h1><p>A Lenda do Cristal da Aurora</p></div>
  <div class="tmenu">${sv && sv.v === 2 ? `<button class="pri" id="bCont">▶ Continuar<small>${esc(sv.name)} · ${CLS[sv.cls].n[sv.f]} Nv ${sv.lv}</small></button>` : old && old.cls ? `<button class="pri" id="bOld">▶ Continuar personagem antigo<small>${CLS[old.cls].n[0]} Nv ${old.lv || 1}</small></button>` : ''}
  <button id="bNew">✨ Novo Jogo</button><button id="bHelp">🎮 Controles</button></div><div class="cred">Criado por <b>GTz</b> · feito com three.js</div>`;
  $('#bNew').onclick = e => { const b = e.currentTarget; if (sv && sv.v === 2 && !b.dataset.ok) { b.dataset.ok = 1; b.innerHTML = '⚠️ Clique de novo para começar<small>o personagem salvo será substituído</small>'; return; } showCreate(); };
  $('#bHelp').onclick = () => { P = P || newChar('-', 'w', 0, { skin: '#f1c9a0', hair: '#5a3a1a', hs: 'short' }); WIN = null; openWin('help'); };
  if ($('#bCont')) $('#bCont').onclick = () => { P = sv; startGame(false); };
  if ($('#bOld')) $('#bOld').onclick = () => { P = newChar('Herói', old.cls, 0, { skin: '#f1c9a0', hair: '#5a3a1a', hs: 'short' }); P.lv = Math.max(1, old.lv || 1); P.gold = old.gold || 60; SKILLS[P.cls].forEach(s => { if (s.lv <= P.lv) P.sk[s.id] = 1; }); P.pts = (P.lv - 1) * 3; P.spts = P.lv - 1; startGame(true); };
  AU.music('titulo');
}
function showCreate() {
  GAME = 'create'; CR = { cls: 'w', f: 0, skin: 1, hair: 1, hs: 0, name: '' };
  P = newChar('', 'w', 0, {}); crPreview();
  drawCreate();
}
function crPreview() { P.cls = CR.cls; P.f = CR.f; P.look = { skin: LOOK.skin[CR.skin], hair: LOOK.hair[CR.hair], hs: LOOK.hs[CR.hs] }; buildPlayer(); PL.x = 0; PL.z = 7; PL.ry = 0; }
function drawCreate() {
  const c = CLS[CR.cls], sw = (k, arr) => arr.map((v, i) => `<button class="sw ${CR[k] === i ? 'on' : ''}" style="background:${v}" data-cr="${k}" data-v="${i}"></button>`).join('');
  $('#title').innerHTML = `<div class="create"><h2>Crie seu personagem</h2>
  <label>Nome<input id="crn" maxlength="14" placeholder="Digite um nome" value="${esc(CR.name)}"></label>
  <h4>Classe</h4><div class="clsrow">${Object.keys(CLS).map(k => `<button class="cls ${CR.cls === k ? 'on' : ''}" data-cr="cls" data-v="${k}"><i>${CLS[k].i}</i>${CLS[k].n[CR.f]}</button>`).join('')}</div>
  <p>${c.desc}</p><p class="mut">${c.pas}</p>
  <div class="bars">${['Vida', 'Dano', 'Alcance', 'Magia'].map((n, i) => `<div><span>${n}</span><i style="width:${c.bars[i] * 20}%"></i></div>`).join('')}</div>
  <h4>Aparência</h4><div class="row"><button class="${!CR.f ? 'on' : ''}" data-cr="f" data-v="0">Masculino</button><button class="${CR.f ? 'on' : ''}" data-cr="f" data-v="1">Feminino</button></div>
  <small>Pele</small><div class="row">${sw('skin', LOOK.skin)}</div><small>Cabelo</small><div class="row">${sw('hair', LOOK.hair)}</div>
  <small>Penteado</small><div class="row">${LOOK.hs.map((h, i) => `<button class="${CR.hs === i ? 'on' : ''}" data-cr="hs" data-v="${i}">${HSN[h]}</button>`).join('')}</div>
  <div class="row end"><button id="crBack">◂ Voltar</button><button class="pri big" id="crGo">Começar aventura ▸</button></div></div>`;
  $('#crn').oninput = e => CR.name = e.target.value;
  $$('[data-cr]').forEach(b => b.onclick = () => { const k = b.dataset.cr; CR[k] = k === 'cls' ? b.dataset.v : +b.dataset.v; AU.play('ui'); crPreview(); drawCreate(); });
  $('#crBack').onclick = () => { P = null; if (PL.o) { PL.g.remove(PL.o.g); PL.o = null; } showTitle(); };
  $('#crGo').onclick = () => {
    const name = CR.name.trim() || (CR.f ? 'Aurora' : 'Arthur');
    P = newChar(name, CR.cls, CR.f, { skin: LOOK.skin[CR.skin], hair: LOOK.hair[CR.hair], hs: LOOK.hs[CR.hs] });
    store.del('aethra3d'); startGame(true);
  };
}
let INTRO = 0;
function showIntro() {
  GAME = 'intro'; INTRO = 0; const o = $('#overlay'); o.hidden = false; o.className = 'story';
  introDraw();
}
function introDraw() { const o = $('#overlay'); o.innerHTML = `<div class="sbox"><p>${esc(tx(INTRO_STORY[INTRO]))}</p><button class="pri" id="inx">${INTRO < INTRO_STORY.length - 1 ? 'Continuar ▸' : 'Começar ▸'}</button><small>${INTRO + 1}/${INTRO_STORY.length}</small></div>`; $('#inx').onclick = introNext; }
function introNext() { if (INTRO < INTRO_STORY.length - 1) { INTRO++; introDraw(); } else { hideOverlay(); GAME = 'play'; banner('📍 Vila de Aethra', 'Fale com o Ancião Eldric (ícone ❗)', 4); tip('move', 'Ande com WASD ou clicando no chão. Siga a seta dourada até o Ancião Eldric e aperte E.'); } }
function hideOverlay() { $('#overlay').hidden = true; $('#overlay').innerHTML = ''; }
function showDeath(lost) {
  const o = $('#overlay'); o.hidden = false; o.className = 'death';
  o.innerHTML = `<div class="sbox"><h2>☠️ Você caiu em batalha</h2><p>Você perdeu ${fmt(lost)}💰. Dica: compre poções com o Tobias, refine seus itens com a Brunhilda e use a esquiva (Espaço) contra as áreas vermelhas.</p><button class="pri" id="rsp">Renascer</button></div>`;
  $('#rsp').onclick = respawn;
}
function showEnding() {
  GAME = 'ending'; const o = $('#overlay'); o.hidden = false; o.className = 'ending'; AU.music('vitoria');
  const tm = Math.floor(P.time / 60);
  o.innerHTML = `<div class="sbox end"><h1>🌅 Fim</h1>${ENDING_STORY.map(l => `<p>${esc(tx(l))}</p>`).join('')}
  <div class="estats"><div><b>${P.lv}</b><small>Nível</small></div><div><b>${fmt(P.kills)}</b><small>Monstros</small></div><div><b>${P.deaths}</b><small>Mortes</small></div><div><b>${Math.floor(tm / 60)}h${String(tm % 60).padStart(2, '0')}</b><small>Tempo</small></div><div><b>${Object.keys(P.ach).length}/${ACH.length}</b><small>Conquistas</small></div></div>
  <p class="cred">Aethra Online — criado por <b>GTz</b></p>
  <div class="row"><button id="eCont">Continuar explorando</button><button class="pri" id="eNG">🔁 Novo Jogo+ (monstros +30 níveis, loot melhor)</button></div></div>`;
  $('#eCont').onclick = () => { hideOverlay(); GAME = 'play'; placePlayer(SPAWN[0], SPAWN[1]); musicZone(true); saveGame(); };
  $('#eNG').onclick = () => { hideOverlay(); startNGPlus(); };
  saveGame();
}
function startNGPlus() {
  P.ng++; P.q = 0; P.qc = 0; P.side = {}; P.boss = {}; P.bnt = []; P.bOff = []; P.shop = null; P.shopT = -1;
  ach('ng'); spawnAll(); GAME = 'play'; placePlayer(SPAWN[0], SPAWN[1]); updateAurora(); musicZone(true);
  banner('🔁 Novo Jogo+ ' + P.ng, 'Os monstros estão mais fortes. Fale com o Eldric!', 4); saveGame();
}

/* ---------- Início do jogo ---------- */
function startGame(isNew) {
  closeWin(); $('#title').hidden = true; $('#hud').hidden = false;
  P.tut = P.tut || {}; P.cons = P.cons || {}; if (!P.exp) P.exp = '';
  calc(); buildPlayer(); buildHotbar(); spawnAll();
  if (P.hp <= 0 || P.hp > S.hp) P.hp = S.hp; if (P.mp > S.mp) P.mp = S.mp;
  const x = P.x > 600 && !onAbyss(P.x, P.z) ? ABYSS.spawn[0] : P.x, z = P.x > 600 && !onAbyss(P.x, P.z) ? ABYSS.spawn[1] : P.z;
  placePlayer(x, z); CAM.tdist = 26; CAM.pitch = .93; CAM.yaw = 0;
  updateAurora(); lastZone = -1; GAME = 'play';
  log('<b class="sys">Bem-vind' + (P.f ? 'a' : 'o') + ' a Aethra Online!</b> Pressione Enter para conversar.', 'sys');
  if (isNew) showIntro(); else banner('Bem-vind' + (P.f ? 'a' : 'o') + ' de volta, ' + P.name + '!', curQ().t, 3);
  if (IS_TOUCH) document.body.classList.add('touch');
  saveGame();
}
function saveGame() { if (!P || GAME === 'title' || GAME === 'create' || !P.name) return; P.x = PL.x; P.z = PL.z; if (PL.dead) P.hp = 1; store.set('aethra3d_v2', P); }
setInterval(() => { if (GAME === 'play') saveGame(); }, 15000);
addEventListener('beforeunload', saveGame);
document.addEventListener('visibilitychange', () => { if (document.hidden) saveGame(); });

/* ---------- Ambiente por zona ---------- */
let lastZone = -1, curZone = 0;
const ENV = { bg: new T.Color(), hs: new T.Color(), hg: new T.Color(), sc: new T.Color(), fn: 80, ff: 200, hi: .9, si: 1 };
function musicZone(force) { if (BOSSF && BOSSF.awake) return; AU.music(ZONES[curZone].theme, force); }
function updateEnv(dt) {
  curZone = inAbyss() ? 6 : zoneAt(PL.x, PL.z); const Z = ZONES[curZone];
  if (curZone !== lastZone && GAME === 'play') { if (lastZone !== -1 || true) banner('📍 ' + Z.n, Z.lv, 2.4); lastZone = curZone; $('#zone').textContent = Z.n; musicZone(); }
  const k = Math.min(1, dt * 1.2);
  scene.background.lerp(ENV.bg.set(Z.sky), k); scene.fog.color.copy(scene.background);
  scene.fog.near = lerp(scene.fog.near, Z.fog[0], k); scene.fog.far = lerp(scene.fog.far, Z.fog[1], k);
  hemi.color.lerp(ENV.hs.set(Z.hemi[0]), k); hemi.groundColor.lerp(ENV.hg.set(Z.hemi[1]), k); hemi.intensity = lerp(hemi.intensity, Z.hemi[2], k);
  sun.color.lerp(ENV.sc.set(Z.sun[0]), k); sun.intensity = lerp(sun.intensity, Z.sun[1], k);
  sun.position.set(PL.x + 30, PL.y + 55, PL.z + 22); sun.target.position.set(PL.x, PL.y, PL.z);
  // partículas ambientes
  const n = CFG.hq ? 3 : 1;
  for (let i = 0; i < n; i++) {
    const x = PL.x + rn(-28, 28), z = PL.z + rn(-24, 18), y = groundY(x, z);
    switch (Z.amb) {
      case 'pollen': if (R() < .3) PADD.emit(x, y + rn(.5, 4), z, rn(-.3, .3), rn(-.1, .2), rn(-.3, .3), 4, .25, .25, '#fff6b0', .7); break;
      case 'fireflies': if (R() < .5) PADD.emit(x, y + rn(.5, 3), z, rn(-.6, .6), rn(-.2, .3), rn(-.6, .6), 3, .4, .2, '#d8ff6a', 1); break;
      case 'dust': PNORM.emit(x, y + rn(.2, 2), z, rn(2, 4), 0, rn(-.5, .5), 2.5, .6, 1.4, '#e8d0a0', .35); break;
      case 'snow': PNORM.emit(x, y + rn(8, 14), z, rn(-.5, .5), -2.2, rn(-.5, .5), 5, .35, .3, '#ffffff', .9); break;
      case 'embers': PADD.emit(x, y + rn(0, 1), z, rn(-.4, .4), rn(1, 3), rn(-.4, .4), 2.5, .35, .1, R() < .5 ? '#ff7a1a' : '#ffb040', 1); break;
      case 'void': PADD.emit(x, rn(-6, 4), z, rn(-.3, .3), rn(.4, 1.4), rn(-.3, .3), 4, .5, .1, R() < .5 ? '#b080ff' : '#ff60e0', .8); break;
    }
  }
  for (const f of FIRES) { if (Math.abs(f[0] - PL.x) > 45 || Math.abs(f[2] - PL.z) > 45) continue; const big = f[3]; for (let i = 0; i < (big ? 2 : 1); i++) PADD.emit(f[0] + rn(-.3, .3) * (big ? 8 : 1), f[1] + rn(0, .3), f[2] + rn(-.3, .3) * (big ? 8 : 1), rn(-.2, .2), rn(1.5, 3) * (big ? 2 : 1), rn(-.2, .2), .7, big ? 1.4 : .6, .1, R() < .5 ? '#ff7a1a' : '#ffc040', 1); if (big && R() < .1) FX.smoke(f[0], f[1] + 3, f[2], '#3a2a2a', 1, 4, 4, 3); }
  for (const s of SMOKES) if (Math.abs(s[0] - PL.x) < 40 && Math.abs(s[2] - PL.z) < 40 && R() < .05) FX.smoke(s[0], s[1], s[2], '#bbbbbb', 1, 1, 3, 1);
}

/* ---------- Atualização do jogador ---------- */
function attackRange(t) { return (P.cls === 'w' ? CLS.w.rng : CLS[P.cls].rng) + t.r; }
function basicAttack(t) {
  PL.ry = angTo(PL.x, PL.z, t.x, t.z); PL.atkCd = CLS[P.cls].aspd / (1 + S.aspd / 100); PL.combatT = 6;
  if (P.cls === 'w') { PL.anim = { k: 'swing', t: 0, d: .35 }; AU.play('swing'); later(.14, () => { if (!t.dead && mdist(t) < attackRange(t) + 1.2) hitMon(t, S.atk, { basic: 1 }); }); }
  else if (P.cls === 'a') { PL.anim = { k: 'shoot', t: 0, d: .3 }; later(.1, () => shootP(t, S.atk, '#e0c080', { hit: { basic: 1 }, spd: 36 })); }
  else { PL.anim = { k: 'cast', t: 0, d: .3 }; later(.1, () => shootP(t, S.atk, '#c27bff', { hit: { basic: 1 }, spd: 24, size: 1.4 })); }
}
function goTo(x, z, sp, dt) { const dx = x - PL.x, dz = z - PL.z, d = Math.hypot(dx, dz); if (d < .1) return 0; const s = Math.min(d, sp * dt), p = { x: PL.x, z: PL.z }; moveSmart(p, dx / d, dz / d, s, .45, x, z); PL.x = p.x; PL.z = p.z; PL.ry = lerpAng(PL.ry, Math.atan2(dx, dz), Math.min(1, dt * 14)); return d; }
let _footT = 0;
function updatePlayer(dt, t) {
  PL.atkCd -= dt; PL.dodgeCd -= dt; PL.invT -= dt; PL.potCd -= dt; PL.combatT -= dt; PL.slowT -= dt; PL.rootT -= dt; PL.curseT -= dt; PL.stunT -= dt;
  for (let i = 0; i < 5; i++) PL.skc[i] = Math.max(0, PL.skc[i] - dt);
  for (const k in PL.buffs) PL.buffs[k] -= dt;
  if (PL.shield > 0) { PL.shieldT -= dt; if (PL.shieldT <= 0) PL.shield = 0; }
  PL.shieldMesh.visible = PL.shield > 0; PL.shieldMesh.material.opacity = .18 + Math.sin(t * 5) * .06;
  if (PL.burnT > 0) { PL.burnT -= dt; PL._bt = (PL._bt || 0) - dt; if (PL._bt <= 0) { PL._bt = .5; P.hp -= Math.max(1, Math.round(PL.burnD * .5)); dmgText(PL.x, PL.y + 2.2, PL.z, '🔥', '#ff9a3a'); FX.rise(PL.x, PL.y + 1, PL.z, '#ff7a1a', 4); if (P.hp <= 0) dieP(); } }
  calc();
  let moving = false;
  if (PL.dead) { PL.o.inner.rotation.x = lerp(PL.o.inner.rotation.x, -Math.PI / 2, dt * 6); PL.o.inner.position.y = .3; }
  else {
    PL.o.inner.rotation.x = PL.dash && PL.dash.roll ? 0 : lerp(PL.o.inner.rotation.x, 0, dt * 10); PL.o.inner.position.y = 0;
    const sp = 6.4 * Math.max(.4, 1 + S.move / 100), mi = moveInput();
    if (PL.dash) {
      const D = PL.dash; D.t -= dt; const p = { x: PL.x, z: PL.z }; moveEnt(p, D.vx * dt, D.vz * dt, .45); PL.x = p.x; PL.z = p.z;
      if (D.roll) PL.o.inner.rotation.x = D.roll * (1 - D.t / D.d) * TAU; FX.trail(PL.x, PL.y + 1, PL.z, '#ffffff', .6, .3);
      if (D.t <= 0) { PL.dash = null; PL.o.inner.rotation.x = 0; }
      moving = true;
    } else if (PL.rootT > 0 || PL.stunT > 0) { }
    else if (mi.x || mi.z) {
      const p = { x: PL.x, z: PL.z }; moveEnt(p, mi.x * sp * dt, mi.z * sp * dt, .45); PL.x = p.x; PL.z = p.z;
      PL.ry = lerpAng(PL.ry, Math.atan2(mi.x, mi.z), Math.min(1, dt * 14)); moving = true; PL.mv = null; PL.pend = null;
      if (PL.tgt && (PL.tgt.dead || mdist(PL.tgt) > 30)) PL.tgt = null;
      if (PL.tgt && PL.atkCd <= 0 && mdist(PL.tgt) <= attackRange(PL.tgt) && P.cls !== 'w') basicAttack(PL.tgt);
    } else {
      if (HOLD && MDOWN && !MODAL) { const g = groundAt(MPOS.x, MPOS.y); if (g) PL.mv = { x: g.x, z: g.z }; }
      const tg = PL.tgt;
      if (tg && (tg.dead || tg.untarget || mdist(tg) > 40)) PL.tgt = null;
      if (PL.pend != null && PL.tgt) {
        const s = SKILLS[P.cls][PL.pend], range = (s.rng || (P.cls === 'w' ? CLS.w.rng + 1 : CLS[P.cls].rng + 2)) + PL.tgt.r;
        if (mdist(PL.tgt) > range) { goTo(PL.tgt.x, PL.tgt.z, sp, dt); moving = true; } else useSkill(PL.pend);
      } else if (PL.tgt) {
        const T2 = PL.tgt, d = mdist(T2);
        if (d > attackRange(T2) * .95) { goTo(T2.x, T2.z, sp, dt); moving = true; }
        else { PL.ry = lerpAng(PL.ry, angTo(PL.x, PL.z, T2.x, T2.z), dt * 12); if (PL.atkCd <= 0 && !PL.anim) basicAttack(T2); }
      } else if (PL.mv) {
        const o = PL.mv.inter, stop = o ? 2.4 : .25, d = Math.hypot(PL.mv.x - PL.x, PL.mv.z - PL.z);
        if (d > stop) { goTo(PL.mv.x, PL.mv.z, sp, dt); moving = true; } else { if (o) interact(o); PL.mv = null; }
      }
    }
    if (moving) { _footT -= dt; if (_footT <= 0) { _footT = .32; AU.play('step'); } }
    // regeneração
    const town = inTown(), hr = town ? .12 : PL.combatT > 0 ? .004 : .03, mr = town ? .1 : (P.cls === 'm' ? .025 : .015);
    healP(S.hp * hr * dt, true); P.mp = Math.min(S.mp, P.mp + S.mp * mr * dt);
  }
  PL.y = groundY(PL.x, PL.z);
  PL.g.position.set(PL.x, PL.y, PL.z); PL.g.rotation.y = PL.ry;
  PL.ph += dt * (moving ? 11 : 2);
  animLimbs(PL.o, PL.ph, moving && !PL.dash, t);
  if (!moving && !PL.dead) PL.o.inner.position.y = Math.sin(t * 2) * .015;
  const A = PL.anim, aR = PL.o.limbs[1].p, aL = PL.o.limbs[0].p;
  if (P.cls === 'a' && PL.tgt && !A) { aL.rotation.x = -1.2; }
  if (A) {
    A.t += dt; const p = A.t / A.d;
    if (p >= 1) { PL.anim = null; PL.o.inner.rotation.y = 0; }
    else if (A.k === 'swing') aR.rotation.x = p < .4 ? lerp(0, -2.5, p / .4) : lerp(-2.5, -.2, (p - .4) / .6);
    else if (A.k === 'shoot') { aL.rotation.x = -1.55; aR.rotation.x = -1.4 + Math.min(1, p * 3) * .6; }
    else if (A.k === 'cast') { aR.rotation.x = -1.9 * Math.sin(p * Math.PI); aL.rotation.x = -1 * Math.sin(p * Math.PI); if (R() < .5) FX.trail(PL.x + Math.sin(PL.ry) * .8, PL.y + 2.2, PL.z + Math.cos(PL.ry) * .8, PL.wep.userData.tc, .6, .3); }
    else if (A.k === 'spin') { PL.o.inner.rotation.y = p * TAU * 2; aR.rotation.x = -1.5; aL.rotation.x = -1.5; }
    else if (A.k === 'slam') { PL.o.inner.position.y = Math.sin(p * Math.PI) * 2.4; aR.rotation.x = aL.rotation.x = -2.8 * Math.sin(p * Math.PI); }
  }
  if (PL.wep && PL.wep.userData.shiny && R() < .25) { const v = new T.Vector3(); PL.wep.getWorldPosition(v); FX.trail(v.x, v.y, v.z, PL.wep.userData.tc, .35, .4); }
  setModelMat(PL.o, PL.hurtFlash > 0 ? MAT.flash : PL.invT > 0 && !PL.dash ? MAT.shield : MAT.v); PL.hurtFlash -= dt;
  // anel do alvo e seta do objetivo
  const tg = PL.tgt; PL.tring.visible = !!tg && !tg.dead;
  if (PL.tring.visible) { PL.tring.position.set(tg.x, groundY(tg.x, tg.z) + .12, tg.z); PL.tring.scale.setScalar(tg.r * 1.3 + .4); PL.tring.rotation.z = t; PL.tring.material.color.set(tg.isB ? '#ff6a3d' : tg.elite ? '#ffd23f' : '#ff4a4a'); }
  const qt = questTarget(); PL.arrow.visible = !!qt && !PL.dead && (!qt || Math.hypot(qt.x - PL.x, qt.z - PL.z) > 6);
  if (PL.arrow.visible) { PL.arrow.position.set(PL.x, PL.y + .4, PL.z); PL.arrow.rotation.y = angTo(PL.x, PL.z, qt.x, qt.z); PL.arrow.children[0].material.opacity = .55 + Math.sin(t * 4) * .3; }
  // interação próxima
  let best = null, bd = 1e9;
  for (const o of INTER) { if (o.kind === 'portal' && P.q < PORTAL_Q) continue; const d = Math.hypot(o.x - PL.x, o.z - PL.z); if (d < o.r && d < bd) { bd = d; best = o; } }
  PL.interact = best;
  // descobrir pedras
  for (const w of WAYS) if (!P.ways.includes(w.id) && Math.hypot(w.x - PL.x, w.z - PL.z) < 6) { P.ways.push(w.id); AU.play('tele'); banner('🔵 Pedra de Teleporte ativada', w.n, 2.5); FX.beam(w.x, groundY(w.x, w.z), w.z, '#4ad8ff', 6, 50); if (P.ways.length >= WAYS.length) ach('explorer'); }
  $('#hurt').style.opacity = Math.max(0, (+$('#hurt').style.opacity || 0) - dt * 1.5) + (P.hp < S.hp * .25 && !PL.dead ? .15 + Math.sin(t * 6) * .1 : 0);
}

/* ---------- Laço principal ---------- */
const clock = new T.Clock(); let TT = 0, _hudT = 0, _miniT = 0, _expT = 0, _botChat = 20;
function loop() {
  requestAnimationFrame(loop);
  const dt = Math.min(.05, clock.getDelta()); TT += dt;
  for (let i = LATER.length - 1; i >= 0; i--) { const l = LATER[i]; l.t -= dt; if (l.t <= 0) { LATER.splice(i, 1); try { l.f(); } catch (e) { console.error(e); } } }
  if (P && (GAME === 'play' || GAME === 'intro' || GAME === 'ending')) {
    if (GAME === 'play') P.time += dt;
    updatePlayer(dt, TT); updateMonsters(dt, TT); updateProj(dt); updateHaz(dt); updateLoot(dt); updateEnv(dt);
    if (!PL.dead && GAME === 'play' && !MODAL) {
      _hovT -= dt; if (_hovT <= 0) { _hovT = .1; const h = MDOWN ? null : pickAt(MPOS.x, MPOS.y); HOVER = h && h.sp ? h : null; CV.style.cursor = h ? (h.sp ? 'crosshair' : 'pointer') : 'default'; }
    }
    updateCamera(dt, PL.x, PL.y + 1.2, PL.z);
    _hudT -= dt; if (_hudT <= 0) { _hudT = .1; updateHUD(); }
    _miniT -= dt; if (_miniT <= 0) { _miniT = .12; drawMini(); }
    _expT -= dt; if (_expT <= 0) { _expT = .6; markExplored(); }
    _botChat -= dt; if (_botChat <= 0) { _botChat = rn(25, 60); log(`<b class="bot">${pick(BOT_NAMES)}:</b> ${esc(pick(BOT_CHAT))}`); }
  } else {
    if (GAME === 'create') {
      PL.g.position.set(PL.x, 0, PL.z); PL.ry += dt * .6; PL.g.rotation.y = PL.ry; PL.ph += dt * 2; if (PL.o) animLimbs(PL.o, PL.ph, false, TT);
      CAM.yaw = .35; CAM.pitch = .22; CAM.tdist = CAM.dist = 7.5; updateCamera(dt, 1.4, 1.5, 7);
    } else { CAM.yaw += dt * .04; CAM.pitch = .62; CAM.tdist = CAM.dist = 40; updateCamera(dt, 0, 2, 0); }
    PL.x = PL.x || 0;
    sun.position.set(30, 55, 22); sun.target.position.set(0, 0, 0);
  }
  updateNPCs(dt, TT); updateBots(dt, TT); updateAurora(TT); updateTeles(dt); updateDmg(dt);
  if (DYN.blades) DYN.blades.rotation.z += dt * .8;
  DYN.portal.g.visible = !!P && P.q >= PORTAL_Q; DYN.portal.mat.uniforms.t.value = TT; DYN.exit.mat.uniforms.t.value = TT;
  if (DYN.portal.g.visible && R() < .5) FX.rise(DYN.portal.x + rn(-1.5, 1.5), .5, DYN.portal.z, '#b080ff', 1, .3, 2, 1, .4);
  DYN.ways.forEach((w, i) => { const on = P && P.ways.includes(i); w.mat.color.set(on ? '#4ad8ff' : '#5a5f6a'); w.rune.rotation.y = TT * (on ? 1.5 : .3); w.rune.position.y = w.y + 4.2 + Math.sin(TT * 2 + i) * .15; });
  PADD.update(dt); PNORM.update(dt);
  ren.render(scene, cam);
}

/* ---------- Inicialização ---------- */
try {
  buildWorld(); spawnNPCs(); spawnBots();
  $('#load').remove();
  showTitle();
  window.G = { get P() { return P; }, PL, MON, S: () => S, gainXP, completeMain, teleport, placePlayer, BOSS, LAIRS, killMon, hitMon, useSkill, openWin, spawnAll, get GAME() { return GAME; }, set GAME(v) { GAME = v; } };
} catch (e) { console.error(e); $('#load').textContent = 'Erro ao carregar: ' + e.message; }
loop();
