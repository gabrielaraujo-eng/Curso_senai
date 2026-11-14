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
})();
