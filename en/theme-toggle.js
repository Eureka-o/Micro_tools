(() => {
  const key = 'microToolsTheme';
  const root = document.documentElement;

  function currentTheme() {
    return root.classList.contains('dark') ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    const next = theme === 'dark' ? 'dark' : 'light';
    root.classList.toggle('dark', next === 'dark');
    root.dataset.theme = next;
    localStorage.setItem(key, next);
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.setAttribute('aria-pressed', String(next === 'dark'));
      button.setAttribute('title', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-theme-toggle]');
    if (!button) return;
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => applyTheme(currentTheme()));
  } else {
    applyTheme(currentTheme());
  }
})();
