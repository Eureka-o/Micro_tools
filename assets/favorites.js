(function () {
  "use strict";

  const BUTTON_SELECTOR = "[data-favorite-tool-toggle], #favoriteToolBtn";
  const STORAGE_EVENT_NAME = "microtools:favorites-changed";

  const COPY = {
    zh: {
      save: "收藏",
      saved: "已收藏",
      saveAria: "收藏工具",
      removeAria: "取消收藏",
      added: "已加入收藏",
      removed: "已取消收藏",
      unavailable: "收藏不可用，请允许浏览器本地存储。",
      noticeTitle: "本地收藏说明",
      noticeBody:
        "收藏数据仅保存在您当前设备的浏览器中。即开即用，无云端追踪。清除浏览器缓存或更换设备会导致收藏失效。",
      noticeOk: "我已知晓"
    },
    en: {
      save: "Favorite",
      saved: "Favorited",
      saveAria: "Save favorite",
      removeAria: "Remove favorite",
      added: "Added to favorites",
      removed: "Removed from favorites",
      unavailable: "Favorites are unavailable. Please allow local storage in this browser.",
      noticeTitle: "Local Favorites Notice",
      noticeBody:
        "Favorites are stored only in this browser on your current device. No cloud tracking. Clearing browser data or switching devices will remove them.",
      noticeOk: "I understand"
    }
  };

  let currentButton = null;
  let currentSlug = "";
  let toastTimer = 0;
  let pendingAction = null;

  function isEnglishPage() {
    return (document.documentElement.lang || "").toLowerCase().startsWith("en") || location.pathname.includes("/en/");
  }

  function copy() {
    return isEnglishPage() ? COPY.en : COPY.zh;
  }

  function getStorage() {
    return window.MicroToolsStorage || null;
  }

  function getToolSlug() {
    const parts = location.pathname.split("/").filter(Boolean);
    let slug = parts[parts.length - 1] || "index";
    slug = slug.replace(/\.html$/i, "");
    if (!slug || slug === "en" || slug === "index") return "";
    return decodeURIComponent(slug);
  }

  function createButton() {
    const texts = copy();
    const button = document.createElement("button");
    button.type = "button";
    button.className =
      "favorite-tool-toggle inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/60 hover:bg-cyan-400 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 active:scale-95 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100 dark:hover:bg-cyan-400 dark:hover:text-slate-950";
    button.setAttribute("aria-label", texts.saveAria);
    button.setAttribute("title", texts.saveAria);
    button.setAttribute("aria-pressed", "false");
    button.innerHTML =
      '<span data-favorite-icon aria-hidden="true" class="text-base leading-none">☆</span><span data-favorite-label>' +
      texts.save +
      "</span>";
    return button;
  }

  function normalizeExistingButton(button) {
    if (!button) return null;
    button.type = "button";
    button.dataset.favoriteToolToggle = currentSlug;
    button.classList.add("favorite-tool-toggle");

    let icon = button.querySelector("[data-favorite-icon], #favoriteToolIcon");
    if (!icon) {
      icon = document.createElement("span");
      icon.dataset.favoriteIcon = "";
      icon.setAttribute("aria-hidden", "true");
      icon.className = "text-base leading-none";
      button.insertBefore(icon, button.firstChild);
    } else {
      icon.dataset.favoriteIcon = "";
    }

    let label = button.querySelector("[data-favorite-label], #favoriteToolLabel");
    if (!label) {
      label = document.createElement("span");
      label.dataset.favoriteLabel = "";
      button.appendChild(label);
    } else {
      label.dataset.favoriteLabel = "";
    }

    return button;
  }

  function placeButton(button) {
    if (!button || button.isConnected) return;

    const shareRoot = document.getElementById("shareToolMenuRoot");
    if (shareRoot && shareRoot.parentElement) {
      shareRoot.parentElement.insertBefore(button, shareRoot);
      return;
    }

    const hero = document.querySelector("main > section");
    if (!hero) {
      document.body.insertBefore(button, document.body.firstChild);
      return;
    }

    const directFlex = Array.from(hero.children).find((child) => child.classList && child.classList.contains("flex"));
    const lastChild = directFlex ? directFlex.lastElementChild : null;
    if (directFlex && lastChild && !lastChild.querySelector("h1")) {
      if (lastChild.classList.contains("inline-flex")) {
        const controls = document.createElement("div");
        controls.className =
          "flex w-full flex-wrap items-start justify-between gap-3 lg:w-auto lg:flex-col-reverse lg:items-end lg:justify-start";
        directFlex.replaceChild(controls, lastChild);
        controls.appendChild(lastChild);
        controls.appendChild(button);
        return;
      }
      if (lastChild.classList.contains("flex")) {
        lastChild.appendChild(button);
        return;
      }
    }

    const wrapper = document.createElement("div");
    wrapper.className = "mt-5 flex flex-wrap items-center justify-end gap-3";
    wrapper.appendChild(button);
    hero.appendChild(wrapper);
  }

  function ensureButton() {
    currentSlug = getToolSlug();
    if (!currentSlug) return null;

    const existing = document.querySelector(BUTTON_SELECTOR);
    currentButton = normalizeExistingButton(existing || createButton());
    currentButton.dataset.favoriteToolToggle = currentSlug;
    placeButton(currentButton);
    updateButton();
    return currentButton;
  }

  function updateButton() {
    const button = currentButton || document.querySelector(BUTTON_SELECTOR);
    const storage = getStorage();
    const texts = copy();
    if (!button || !currentSlug) return;

    const active = !!(storage && storage.isFavorited(currentSlug));
    const icon = button.querySelector("[data-favorite-icon], #favoriteToolIcon");
    const label = button.querySelector("[data-favorite-label], #favoriteToolLabel");

    button.setAttribute("aria-pressed", String(active));
    button.setAttribute("aria-label", active ? texts.removeAria : texts.saveAria);
    button.setAttribute("title", active ? texts.removeAria : texts.saveAria);
    if (icon) icon.textContent = active ? "★" : "☆";
    if (label) label.textContent = active ? texts.saved : texts.save;

    button.classList.toggle("border-cyan-400/70", active);
    button.classList.toggle("bg-cyan-400", active);
    button.classList.toggle("text-slate-950", active);
    button.classList.toggle("shadow-[0_0_24px_-10px_rgba(6,182,212,0.9)]", active);
    button.classList.toggle("dark:bg-cyan-400", active);
    button.classList.toggle("dark:text-slate-950", active);
  }

  function ensureToast() {
    let toast = document.getElementById("microFavoriteToast");
    if (toast) return toast;

    toast = document.createElement("div");
    toast.id = "microFavoriteToast";
    toast.className =
      "fixed left-1/2 bottom-6 z-[80] hidden max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-full border border-cyan-400/30 bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-2xl shadow-cyan-950/30 dark:bg-white dark:text-slate-950 sm:bottom-8";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
    return toast;
  }

  function showToast(message) {
    const toast = ensureToast();
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.remove("hidden");
    toastTimer = window.setTimeout(() => {
      toast.classList.add("hidden");
    }, 2600);
  }

  function ensureNoticeModal() {
    let modal = document.getElementById("microFavoriteNoticeModal");
    if (modal) return modal;

    const texts = copy();
    modal = document.createElement("div");
    modal.id = "microFavoriteNoticeModal";
    modal.className =
      "fixed inset-0 z-[90] hidden items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML =
      '<div class="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-5 shadow-2xl shadow-slate-950/20 dark:border-white/10 dark:bg-slate-950 sm:p-6">' +
      '<div class="flex items-start justify-between gap-4">' +
      '<div class="min-w-0">' +
      '<h2 class="text-lg font-black text-slate-950 dark:text-white" data-favorite-notice-title></h2>' +
      '<p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400" data-favorite-notice-body></p>' +
      "</div>" +
      '<span aria-hidden="true" class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-lg text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">☆</span>' +
      "</div>" +
      '<button type="button" class="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-cyan-400 px-5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300 active:scale-95" data-favorite-notice-ok></button>' +
      "</div>";
    document.body.appendChild(modal);

    modal.addEventListener("click", (event) => {
      if (event.target === modal || event.target.closest("[data-favorite-notice-ok]")) {
        acknowledgeNotice();
      }
    });

    modal.querySelector("[data-favorite-notice-title]").textContent = texts.noticeTitle;
    modal.querySelector("[data-favorite-notice-body]").textContent = texts.noticeBody;
    modal.querySelector("[data-favorite-notice-ok]").textContent = texts.noticeOk;
    return modal;
  }

  function showNotice(action) {
    pendingAction = action || null;
    const modal = ensureNoticeModal();
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    modal.setAttribute("aria-hidden", "false");
    modal.querySelector("[data-favorite-notice-ok]")?.focus();
  }

  function hideNotice() {
    const modal = document.getElementById("microFavoriteNoticeModal");
    if (!modal) return;
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    modal.setAttribute("aria-hidden", "true");
  }

  function acknowledgeNotice() {
    const storage = getStorage();
    if (storage && storage.markFavoriteNoticeSeen) storage.markFavoriteNoticeSeen();
    const action = pendingAction;
    pendingAction = null;
    hideNotice();
    if (action && action.type === "toggle") toggleFavorite();
  }

  function requiresNotice(action) {
    const storage = getStorage();
    if (!storage) {
      showToast(copy().unavailable);
      return true;
    }
    if (storage.hasSeenFavoriteNotice && !storage.hasSeenFavoriteNotice()) {
      showNotice(action);
      return true;
    }
    return false;
  }

  function toggleFavorite() {
    const storage = getStorage();
    const texts = copy();
    if (!storage || !currentSlug) {
      showToast(texts.unavailable);
      return;
    }
    const active = storage.toggleFavorite(currentSlug);
    updateButton();
    showToast(active ? texts.added : texts.removed);
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT_NAME, { detail: { id: currentSlug, active } }));
  }

  function handleClick(event) {
    const button = event.target.closest(BUTTON_SELECTOR);
    if (!button || !currentSlug) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    if (requiresNotice({ type: "toggle" })) return;
    toggleFavorite();
  }

  function init() {
    if (!ensureButton()) return;
    document.addEventListener("click", handleClick, true);
    window.addEventListener("storage", (event) => {
      if (!event.key || event.key === "micro_tools_fav_v1") updateButton();
    });
    window.addEventListener(STORAGE_EVENT_NAME, updateButton);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
