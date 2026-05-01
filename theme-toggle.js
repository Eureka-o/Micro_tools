(() => {
  const STORAGE_KEY = "microToolsTheme";
  const STATES = ["light", "dark", "system"];
  const LABELS = {
    light: "Light",
    dark: "Dark",
    system: "System",
  };
  const root = document.documentElement;
  const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

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
      // Private browsing can disable localStorage; keep the UI working anyway.
    }
  };

  const systemTheme = () => (media && media.matches ? "dark" : "light");

  const setIconState = (button, resolved, preference) => {
    const sun = button.querySelector("[data-theme-sun]");
    const moon = button.querySelector("[data-theme-moon]");
    const label = button.querySelector("[data-theme-label]");
    const isSystem = preference === "system";

    if (sun) sun.classList.toggle("opacity-35", resolved !== "light" && !isSystem);
    if (moon) moon.classList.toggle("opacity-35", resolved !== "dark" && !isSystem);
    if (label) label.textContent = LABELS[preference];

    button.dataset.themeState = preference;
    button.setAttribute("aria-label", `Theme: ${LABELS[preference]}`);
    button.setAttribute("title", `Theme: ${LABELS[preference]}`);
  };

  const applyTheme = (preference, persist = true) => {
    const normalized = STATES.includes(preference) ? preference : "system";
    const resolved = normalized === "system" ? systemTheme() : normalized;

    root.classList.toggle("dark", resolved === "dark");
    root.dataset.themePreference = normalized;
    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;

    if (persist) writePreference(normalized);

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      setIconState(button, resolved, normalized);
    });
  };

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-theme-toggle]");
    if (!button) return;
    const current = readPreference();
    const next = STATES[(STATES.indexOf(current) + 1) % STATES.length];
    applyTheme(next);
  });

  if (media) {
    const onSystemChange = () => {
      if (readPreference() === "system") applyTheme("system", false);
    };
    if (media.addEventListener) media.addEventListener("change", onSystemChange);
    else media.addListener(onSystemChange);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => applyTheme(readPreference(), false));
  } else {
    applyTheme(readPreference(), false);
  }
})();
