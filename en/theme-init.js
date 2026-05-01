(() => {
  const key = 'microToolsTheme';
  const root = document.documentElement;
  const stored = localStorage.getItem(key);
  const preferred = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const theme = stored || preferred;
  root.classList.toggle('dark', theme === 'dark');
  root.dataset.theme = theme;
})();
