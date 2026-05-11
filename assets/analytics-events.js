(() => {
  "use strict";

  const STORAGE_KEY = "microtools_local_events_v1";
  const MAX_EVENTS = 200;
  const sessionId = (crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + "-" + Math.random().toString(16).slice(2);

  function now() {
    return new Date().toISOString();
  }

  function readEvents() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function writeEvents(events) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
    } catch {
      // Local analytics are optional and must never break the tool.
    }
  }

  function cleanPayload(payload) {
    const out = {};
    Object.entries(payload || {}).forEach(([key, value]) => {
      if (value == null) return;
      if (typeof value === "string") out[key] = value.slice(0, 160);
      else if (typeof value === "number" || typeof value === "boolean") out[key] = value;
      else out[key] = String(value).slice(0, 160);
    });
    return out;
  }

  function track(eventName, payload = {}) {
    const event = {
      name: String(eventName || "event").slice(0, 80),
      at: now(),
      path: location.pathname,
      lang: document.documentElement.lang || "",
      sessionId,
      payload: cleanPayload(payload)
    };
    const events = readEvents();
    events.push(event);
    writeEvents(events);
    window.dispatchEvent(new CustomEvent("microtools:analytics", { detail: event }));
    return event;
  }

  function classifyAction(target) {
    const text = (target.textContent || target.getAttribute("aria-label") || target.id || "").toLowerCase();
    if (/copy|复制/.test(text) || /copy/i.test(target.id)) return "copy";
    if (/download|save|下载|保存/.test(text) || /download|save/i.test(target.id)) return "download";
    if (/share|分享/.test(text) || /share/i.test(target.id)) return "share";
    if (/favorite|收藏/.test(text) || /favorite/i.test(target.id)) return "favorite";
    return "click";
  }

  function init() {
    track("page_view", { title: document.title });

    document.addEventListener("click", (event) => {
      const target = event.target.closest("button, a, [role='button']");
      if (!target) return;
      const action = classifyAction(target);
      if (action === "click" && !target.closest("main") && !target.id) return;
      track("ui_action", {
        action,
        id: target.id || "",
        label: (target.textContent || target.getAttribute("aria-label") || "").trim().replace(/\s+/g, " "),
        href: target.getAttribute("href") || ""
      });
    }, { passive: true });

    let searchTimer = 0;
    document.addEventListener("input", (event) => {
      const target = event.target;
      if (!target || target.id !== "searchInput") return;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        track("search_query", { query: target.value || "", length: (target.value || "").length });
      }, 600);
    }, { passive: true });

    window.addEventListener("microtools:favorites-changed", (event) => {
      track("favorite_changed", event.detail || {});
    });
  }

  window.MicroToolsAnalytics = {
    track,
    getEvents: readEvents,
    clearEvents() {
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();