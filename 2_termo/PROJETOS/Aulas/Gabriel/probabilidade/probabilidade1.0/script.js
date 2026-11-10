const $ = s => document.querySelector(s);
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[rnd(0, a.length - 1)];
const shuf = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const frac = (n, d) => { const g = gcd(n, d); return n / g === d / g ? "1" : `${n / g}/${d / g}`; };

const NIVEIS = {
  facil:   { nome: "Fácil",   ic: "🟢", cls: "f", desc: "Bolas, dados e moedas simples", tempo: 0,  prox: "medio" },
  medio:   { nome: "Médio",   ic: "🟠", cls: "m", desc: "3 cores, 2 moedas · 20s",       tempo: 20, prox: "dificil" },
  dificil: { nome: "Difícil", ic: "🔴", cls: "d", desc: "2 dados, sem reposição · 15s",  tempo: 15 }
};
const RODADAS = 8;
const COR = [{ n: "vermelhas", c: "#ff3b5c" }, { n: "azuis", c: "#2f7bff" }, { n: "amarelas", c: "#ffd400" }, { n: "verdes", c: "#19d36b" }];

let estrelas = { facil: 0, medio: 0, dificil: 0 };
try { Object.assign(estrelas, JSON.parse(localStorage.getItem("sc_estrelas") || "{}")); } catch (e) {}
const salvar = () => { try { localStorage.setItem("sc_estrelas", JSON.stringify(estrelas)); } catch (e) {} };

/* ---------- fundo animado ---------- */
(function () {
  const bg = $("#bg"), cores = ["#ff3d9a", "#ffd600", "#12d96b", "#2f7bff", "#ff8a00"];
  for (let i = 0; i < 16; i++) {
    const b = document.createElement("i"), s = rnd(24, 70);
    b.style.cssText = `left:${rnd(0, 98)}%;width:${s}px;height:${s}px;background:${pick(cores)};animation-duration:${rnd(12, 28)}s;animation-delay:-${rnd(0, 20)}s`;
    bg.appendChild(b);
  }
})();

/* ---------- navegação ---------- */
function ir(id) {
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
  $("#" + id).classList.add("ativa");
  if (id === "niveis") montarNiveis();
}
document.querySelectorAll("[data-go]").forEach(b => b.onclick = () => ir(b.dataset.go));
$("#abrirCreditos").onclick = () => $("#creditos").classList.add("ver");
$("#fecharCreditos").onclick = () => $("#creditos").classList.remove("ver");
$("#creditos").onclick = e => { if (e.target.id === "creditos") e.target.classList.remove("ver"); };

function liberado(k) {
  const ordem = ["facil", "medio", "dificil"], i = ordem.indexOf(k);
  return i === 0 || estrelas[ordem[i - 1]] >= 2;
}
function montarNiveis() {
  $("#listaNiveis").innerHTML = "";
  for (const k in NIVEIS) {
    const n = NIVEIS[k], ok = liberado(k), b = document.createElement("button");
    b.className = "nv " + n.cls; b.disabled = !ok;
    b.innerHTML = `<span class="ic">${ok ? n.ic : "🔒"}</span><span><b>${n.nome}</b><small>${ok ? n.desc : "Ganhe 2 ⭐ no nível anterior"}</small></span><span class="st">${"⭐".repeat(estrelas[k])}${"☆".repeat(3 - estrelas[k])}</span>`;
    b.onclick = () => iniciar(k);
    $("#listaNiveis").appendChild(b);
  }
}

/* ---------- geradores de perguntas ---------- */
// Q: monta pergunta com espaço amostral (itens) e função de "favorável"
function Q(texto, itens, ehFav, cls, extra) {
  const fav = itens.map(ehFav), k = fav.filter(Boolean).length, n = itens.length;
  return { texto, itens, fav, cls, n, k, exp: `${k} de ${n} → ${Math.round(k / n * 100)}%`, extra };
}
function urna(qtdCores, sem) {
  const cs = shuf(COR).slice(0, qtdCores), cont = cs.map(() => rnd(sem ? 2 : 1, sem ? 4 : 4));
  const alvo = rnd(0, qtdCores - 1), itens = [];
  cs.forEach((c, i) => { for (let j = 0; j < cont[i]; j++) itens.push({ c: c.c }); });
  const tot = itens.length, a = cont[alvo];
  if (!sem) return Q(`Sorteie 1 bola. Qual a chance de sair ${cs[alvo].n}?`, shuf(itens), it => it.c === cs[alvo].c, "bolas");
  const q = Q(`Sorteie 2 bolas SEM devolver. Chance de as duas serem ${cs[alvo].n}?`, shuf(itens), it => it.c === cs[alvo].c, "bolas");
  q.n = tot * (tot - 1); q.k = a * (a - 1);
  q.exp = `${a}/${tot} × ${a - 1}/${tot - 1} = ${frac(q.k, q.n)} (${Math.round(q.k / q.n * 100)}%)`;
  q.ruim = [frac(a * a, tot * tot), frac(a, tot)];
  return q;
}
function dado(nivel) {
  const faces = [1, 2, 3, 4, 5, 6].map(v => ({ t: "⚀⚁⚂⚃⚄⚅"[v - 1], v }));
  const regras = nivel === "facil"
    ? [["um número PAR", v => v % 2 === 0], ["um número MAIOR que 4", v => v > 4], ["o número 6", v => v === 6]]
    : [["um MÚLTIPLO de 3", v => v % 3 === 0], ["um número MENOR que 3", v => v < 3], ["um ÍMPAR maior que 1", v => v % 2 && v > 1]];
  const [t, f] = pick(regras);
  return Q(`Jogue 1 dado. Chance de sair ${t}?`, faces, it => f(it.v), "faces");
}
function doisDados() {
  const itens = [], s = rnd(4, 10);
  for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) itens.push({ t: a + "·" + b, s: a + b });
  return Q(`Jogue 2 dados. Chance de a SOMA ser ${s}?`, itens, it => it.s === s, "grade");
}
function moedas(n) {
  const itens = [];
  for (let i = 0; i < 1 << n; i++) { const r = [...Array(n)].map((_, j) => (i >> j) & 1 ? "K" : "C").join(""); itens.push({ t: r, ca: r.split("C").length - 1 }); }
  const regras = n === 2
    ? [["DUAS caras", c => c === 2], ["PELO MENOS uma cara", c => c >= 1], ["UMA cara e UMA coroa", c => c === 1]]
    : [["EXATAMENTE 2 caras", c => c === 2], ["PELO MENOS 2 caras", c => c >= 2], ["PELO MENOS 1 coroa", c => c < 3]];
  const [t, f] = pick(regras);
  return Q(`Lance ${n} moedas. Chance de sair ${t}? (C = cara, K = coroa)`, itens, it => f(it.ca), "moedas");
}
const GER = {
  facil:   [() => urna(2), () => dado("facil"), () => moedas(2)],
  medio:   [() => urna(3), () => dado("medio"), () => moedas(2)],
  dificil: [() => urna(2, true), () => doisDados(), () => moedas(3)]
};

function opcoes(q) {
  const ok = frac(q.k, q.n), set = new Set([ok]);
  const cand = [...(q.ruim || []), frac(q.n - q.k, q.n), frac(q.k + 1, q.n), frac(Math.max(q.k - 1, 1), q.n), frac(q.k, q.n + 1), frac(1, q.n), frac(q.k * 2 > q.n ? q.n - 1 : q.k * 2, q.n)];
  shuf(cand).forEach(c => { if (set.size < 4 && /^\d+(\/\d+)?$/.test(c)) set.add(c); });
  while (set.size < 4) set.add(frac(rnd(1, q.n - 1), q.n));
  return { ok, lista: shuf([...set]) };
}

/* ---------- jogo ---------- */
let S = {}, timer;
function iniciar(k) {
  S = { k, i: 0, pts: 0, vidas: 3, seq: 0, acertos: 0 };
  ir("jogo"); proxima();
}
function hud() {
  $("#vidas").textContent = "❤️".repeat(S.vidas) + "🖤".repeat(3 - S.vidas);
  $("#pontos").textContent = S.pts;
  $("#seq").textContent = S.seq > 1 ? `🔥 x${S.seq}` : "";
  $("#prog").style.width = (S.i / RODADAS * 100) + "%";
}
function proxima() {
  if (S.i >= RODADAS || S.vidas <= 0) return fim();
  const q = S.q = pick(GER[S.k])(), o = opcoes(q);
  S.ok = o.ok; S.trava = false; S.i++;
  $("#pergunta").textContent = q.texto;
  const cena = $("#cena"); cena.className = "cena " + (q.cls === "bolas" ? "" : q.cls); cena.innerHTML = "";
  q.itens.forEach((it, i) => {
    const d = document.createElement("div"); d.className = "t" + (q.fav[i] ? " fav" : "");
    if (it.c) d.style.background = it.c; else d.textContent = it.t;
    cena.appendChild(d);
  });
  const box = $("#opcoes"); box.innerHTML = "";
  o.lista.forEach(v => {
    const b = document.createElement("button"); b.className = "op"; b.textContent = v; b.dataset.v = v;
    b.onclick = () => responder(v); box.appendChild(b);
  });
  $("#fb").classList.remove("ver");
  hud(); relogio();
}
function relogio() {
  clearInterval(timer);
  const total = NIVEIS[S.k].tempo, box = $("#tempoBox"), barra = $("#tempo");
  box.style.visibility = total ? "visible" : "hidden";
  if (!total) return;
  const ini = Date.now(); S.ini = ini; S.total = total;
  timer = setInterval(() => {
    const r = 1 - (Date.now() - ini) / (total * 1000);
    barra.style.width = Math.max(r, 0) * 100 + "%";
    barra.style.background = r < .3 ? "var(--verm)" : r < .6 ? "var(--amar)" : "var(--verde)";
    if (r <= 0) responder(null);
  }, 100);
}
function responder(v) {
  if (S.trava) return; S.trava = true; clearInterval(timer);
  const certo = v === S.ok;
  document.querySelectorAll(".op").forEach(b => {
    b.disabled = true;
    if (b.dataset.v === S.ok) b.classList.add("certa");
    else if (b.dataset.v === v) b.classList.add("errada");
  });
  $("#cena").classList.add("pop");
  if (certo) {
    S.acertos++; S.seq++;
    let bonus = 0;
    if (S.total) bonus = Math.round(Math.max(0, 1 - (Date.now() - S.ini) / (S.total * 1000)) * 50);
    S.pts += 100 + bonus + (S.seq - 1) * 20;
  } else { S.vidas--; S.seq = 0; }
  $("#fbTxt").textContent = (certo ? "🎉 Certo! " : v === null ? "⏰ Tempo! " : "❌ Quase! ") + S.q.exp + (v === S.ok ? "" : ` · Resposta: ${S.ok}`);
  $("#prox").textContent = (S.i >= RODADAS || S.vidas <= 0) ? "Resultado ▶" : "Próxima ▶";
  $("#fb").classList.add("ver"); hud();
}
$("#prox").onclick = proxima;
$("#sair").onclick = () => { clearInterval(timer); ir("niveis"); };

function fim() {
  clearInterval(timer);
  const e = S.acertos >= 7 ? 3 : S.acertos >= 5 ? 2 : S.acertos >= 3 ? 1 : 0;
  const novoDesbloqueio = e >= 2 && NIVEIS[S.k].prox && estrelas[S.k] < 2;
  if (e > estrelas[S.k]) { estrelas[S.k] = e; salvar(); }
  $("#fimTit").textContent = S.vidas <= 0 ? "💥 Fim das vidas!" : e === 3 ? "🏆 Mestre da Sorte!" : "🎯 Fase concluída!";
  $("#estrelas").innerHTML = [0, 1, 2].map(i => `<span class="${i < e ? "on" : "off"}" style="animation-delay:${i * .25}s">⭐</span>`).join("");
  $("#fimTxt").textContent = `${S.acertos}/${RODADAS} acertos · ${S.pts} pontos` + (novoDesbloqueio ? " · 🔓 Novo nível liberado!" : "");
  $("#again").onclick = () => iniciar(S.k);
  ir("fim");
}
