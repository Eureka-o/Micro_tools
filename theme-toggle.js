(() => {
  const STORAGE_KEY = "microToolsTheme";
  const STATES = ["light", "dark", "system"];
  const LABELS = {
    en: {
      light: "Light",
      dark: "Dark",
      system: "System",
      aria: "Theme",
    },
    zh: {
      light: "亮色",
      dark: "深色",
      system: "系统",
      aria: "主题",
    },
  };

  const root = document.documentElement;
  let initialized = false;
  let systemWatcherBound = false;
  const media =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;

  const readPreference = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return STATES.includes(saved) ? saved : "system";
    } catch {
      return "system";
    }
  };

  const writePreference = (preference) => {
    try {
      localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // Some private browsing modes block localStorage.
    }
  };

  const systemTheme = () => (media && media.matches ? "dark" : "light");

  const normalizePreference = (preference) =>
    STATES.includes(preference) ? preference : "system";

  const currentLanguage = () => {
    const lang = (root.lang || "").toLowerCase();
    if (lang.startsWith("zh")) return "zh";
    if (lang.startsWith("en")) return "en";
    return location.pathname.includes("/en/") ? "en" : "zh";
  };

  const getLabels = () => LABELS[currentLanguage()] || LABELS.en;

  const getButtons = () =>
    Array.from(document.querySelectorAll("#themeToggleBtn, [data-theme-toggle]")).filter(
      (button, index, buttons) => buttons.indexOf(button) === index
    );

  const setIconState = (button, resolved, preference) => {
    const sun = button.querySelector("[data-theme-sun]");
    const moon = button.querySelector("[data-theme-moon]");
    const label = button.querySelector("[data-theme-label]");
    const isSystem = preference === "system";
    const labels = getLabels();

    if (sun) sun.classList.toggle("opacity-35", resolved !== "light" && !isSystem);
    if (moon) moon.classList.toggle("opacity-35", resolved !== "dark" && !isSystem);
    if (label) label.textContent = labels[preference];

    button.dataset.themeState = preference;
    button.setAttribute("aria-label", `${labels.aria}: ${labels[preference]}`);
    button.setAttribute("title", `${labels.aria}: ${labels[preference]}`);
  };

  const applyTheme = (preference, persist = true) => {
    const normalized = normalizePreference(preference);
    const resolved = normalized === "system" ? systemTheme() : normalized;

    root.classList.toggle("dark", resolved === "dark");
    root.dataset.themePreference = normalized;
    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;

    if (persist) writePreference(normalized);

    getButtons().forEach((button) => setIconState(button, resolved, normalized));
  };

  const bindThemeButtons = () => {
    getButtons().forEach((button) => {
      if (button.dataset.themeBound === "true") return;
      button.dataset.themeBound = "true";
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const current = normalizePreference(root.dataset.themePreference || readPreference());
        const next = STATES[(STATES.indexOf(current) + 1) % STATES.length];
        applyTheme(next);
      });
    });
  };

  const bindSystemWatcher = () => {
    if (!media || systemWatcherBound) return;
    systemWatcherBound = true;

    const onSystemChange = () => {
      if (readPreference() === "system") applyTheme("system", false);
    };

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onSystemChange);
    } else if (typeof media.addListener === "function") {
      media.addListener(onSystemChange);
    }
  };

  const initThemeToggle = () => {
    if (initialized) return;
    initialized = true;
    bindThemeButtons();
    bindSystemWatcher();
    applyTheme(readPreference(), false);

    if (typeof MutationObserver === "function") {
      const observer = new MutationObserver(() => applyTheme(readPreference(), false));
      observer.observe(root, { attributes: true, attributeFilter: ["lang"] });
    }

    window.microToolsTheme = {
      apply: applyTheme,
      read: readPreference,
      refresh: () => applyTheme(readPreference(), false),
    };
  };

  document.addEventListener("DOMContentLoaded", initThemeToggle, { once: true });

  if (document.readyState !== "loading") initThemeToggle();
})();
