(() => {
  const $ = s => document.querySelector(s);
  const screens = document.querySelectorAll('.screen');
  const fade = $('#fade');
  const KEY = 'cincoHorasSave';
  const HOUR_MS = 45000;
  const labels = ['12 AM','1 AM','2 AM','3 AM','4 AM','5 AM'];
  let hour = 0, running = false, spots = [], last = 0, hourStart = 0, raf = 0;

  // áudio simples
  let ac;
  const beep = (f, d, t = 'square', v = .08) => {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = t; o.frequency.value = f; g.gain.value = v;
      o.connect(g); g.connect(ac.destination);
      o.start(); g.gain.exponentialRampToValueAtTime(.001, ac.currentTime + d);
      o.stop(ac.currentTime + d);
    } catch (e) {}
  };

  const show = id => {
    screens.forEach(s => s.classList.toggle('active', s.id === id));
  };
  // transição com fade preto
  const go = (id, cb) => {
    fade.classList.add('on');
    setTimeout(() => { show(id); if (cb) cb(); fade.classList.remove('on'); }, 800);
  };

  const getSave = () => { try { return +localStorage.getItem(KEY) || 0; } catch (e) { return 0; } };
  const setSave = h => { try { localStorage.setItem(KEY, h); } catch (e) {} };
  const refreshContinue = () => { $('#btnContinue').disabled = getSave() <= 0; };

  function typeStory(text, done) {
    const el = $('#storyText'); el.textContent = ''; let i = 0;
    const t = setInterval(() => {
      el.textContent += text[i++];
      if (i % 3 === 0) beep(300 + Math.random() * 60, .03, 'square', .02);
      if (i >= text.length) { clearInterval(t); setTimeout(done, 1600); }
    }, 38);
  }

  function startGame(h) {
    hour = h;
    go('story', () => {
      typeStory(h > 0
        ? 'Você voltou pra cabine. Ainda são ' + labels[h] + '. A bexiga não perdoa.'
        : 'Você entrou no banheiro apertado. Seus amigos viram e querem te gravar. A cabine é seu único refúgio. Aguente até as 5 da manhã.',
        () => go('game', beginRun));
    });
  }

  function beginRun() {
    spots = [...document.querySelectorAll('.spot')].map(el => ({ el, state: 'idle', p: 0, cd: 1 + Math.random() * 2, bar: el.querySelector('.bar div') }));
    hourStart = last = performance.now();
    running = true;
    updateHud();
    raf = requestAnimationFrame(loop);
  }

  function updateHud() {
    $('#clock').textContent = labels[hour];
    $('#bladder').textContent = 'Aperto: ' + ['😖','😣','😫','🥵','💀'][Math.min(hour, 4)];
  }

  function loop(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, .1); last = now;
    // dificuldade por hora
    const spawnRate = [.18, .26, .34, .44, .56][hour];   // chance/seg
    const fillTime = [6, 5, 4.2, 3.5, 3][hour];          // segundos até gravar
    const active = spots.filter(s => s.state === 'show').length;

    spots.forEach(s => {
      if (s.state === 'idle') {
        s.cd -= dt;
        if (s.cd <= 0 && active < 2 && Math.random() < spawnRate * dt * 3) {
          s.state = 'show'; s.p = 0;
          s.el.classList.add('show');
          beep(120, .25, 'sawtooth', .05);
          $('#msg').textContent = 'Tem alguém em cima!';
        }
      } else if (s.state === 'show') {
        s.p += dt / fillTime;
        s.bar.style.width = Math.min(s.p * 100, 100) + '%';
        if (s.p > .6) beep(500 + s.p * 400, .05, 'square', .02);
        if (s.p >= 1) return lose();
      }
    });

    if (now - hourStart >= HOUR_MS) {
      hour++;
      hourStart = now;
      $('#msg').textContent = '';
      if (hour >= 5) return win();
      setSave(hour);
      beep(880, .5, 'sine', .1);
      updateHud();
    }
    raf = requestAnimationFrame(loop);
  }

  function slap(i, x, y) {
    if (!running) return;
    const s = spots[i];
    const h = $('#slap');
    const r = $('#game').getBoundingClientRect();
    const rect = s.el.getBoundingClientRect();
    h.style.left = (x ?? rect.left + rect.width / 2) - r.left + 'px';
    h.style.top = (y ?? rect.top + rect.height / 2) - r.top + 'px';
    h.classList.remove('go'); void h.offsetWidth; h.classList.add('go');
    if (s.state !== 'show') { beep(200, .08, 'triangle', .05); return; }
    beep(90, .15, 'sawtooth', .12);
    s.state = 'idle'; s.cd = 1.5 + Math.random() * 2.5; s.p = 0;
    s.bar.style.width = 0;
    s.el.classList.remove('show'); s.el.classList.add('slapped');
    setTimeout(() => s.el.classList.remove('slapped'), 300);
    $('#msg').textContent = 'TAPÃO!';
  }

  function stop() { running = false; cancelAnimationFrame(raf); resetSpots(); }
  function resetSpots() { document.querySelectorAll('.spot').forEach(e => e.classList.remove('show', 'slapped')); }

  function lose() {
    stop();
    [200, 150, 100, 60].forEach((f, k) => setTimeout(() => beep(f, .3, 'sawtooth', .15), k * 80));
    show('over');
  }
  function win() {
    stop(); setSave(0); refreshContinue();
    [523, 659, 784, 1046].forEach((f, k) => setTimeout(() => beep(f, .3, 'sine', .1), k * 150));
    go('win');
  }

  // eventos
  spots = [];
  document.querySelectorAll('.spot').forEach(el =>
    el.addEventListener('pointerdown', e => slap(+el.dataset.i, e.clientX, e.clientY)));
  addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    const i = { a: 0, s: 1, d: 2 }[k];
    if (i !== undefined) slap(i);
  });

  $('#btnNew').onclick = () => { setSave(0); startGame(0); };
  $('#btnContinue').onclick = () => startGame(getSave());
  $('#btnControls').onclick = () => show('controls');
  $('#btnCredits').onclick = () => show('credits');
  $('#btnRetry').onclick = () => startGame(getSave());
  document.querySelectorAll('.back').forEach(b => b.onclick = () => { refreshContinue(); show('menu'); });
  refreshContinue();
})();
