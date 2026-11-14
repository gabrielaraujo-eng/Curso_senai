(() => {
  const root = document.documentElement;
  const button = document.querySelector('#theme-toggle');
  const label = button?.querySelector('.theme-toggle-label');
  const storageKey = 'curso-senai-theme';
  const storedTheme = localStorage.getItem(storageKey);
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    root.dataset.theme = theme;
    button?.setAttribute('aria-pressed', String(isDark));
    if (label) label.textContent = isDark ? 'Modo claro' : 'Modo escuro';
  }

  applyTheme(storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : systemTheme);

  button?.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(storageKey, nextTheme);
    applyTheme(nextTheme);
  });

  const welcome = document.querySelector('#welcome-overlay');
  const orb = document.querySelector('#profile-orb');
  const visual = welcome?.querySelector('.welcome-visual');
  const destination = document.querySelector('.hero-art');

  orb?.addEventListener('click', () => {
    if (!welcome || !visual || !destination) return;

    const target = destination.getBoundingClientRect();
    visual.style.setProperty('--target-top', `${target.top}px`);
    visual.style.setProperty('--target-left', `${target.left}px`);
    visual.style.setProperty('--target-width', `${target.width}px`);
    visual.style.setProperty('--target-height', `${target.height}px`);
    welcome.classList.add('is-minimizing');

    window.setTimeout(() => {
      document.body.classList.remove('welcome-open');
      welcome.classList.add('is-finished');
      welcome.setAttribute('aria-hidden', 'true');
      window.setTimeout(() => welcome.remove(), 180);
      destination.querySelector('img')?.focus?.();
    }, 850);
  });
})();
