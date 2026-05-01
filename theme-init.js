(() => {
  const STORAGE_KEY = "microToolsTheme";
  const root = document.documentElement;
  const valid = new Set(["light", "dark", "system"]);

  const readPreference = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return valid.has(saved) ? saved : "system";
    } catch {
      return "system";
    }
  };

  const systemTheme = () =>
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const preference = readPreference();
  const resolved = preference === "system" ? systemTheme() : preference;

  root.classList.toggle("dark", resolved === "dark");
  root.dataset.themePreference = preference;
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
})();
