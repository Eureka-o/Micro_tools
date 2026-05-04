(function () {
  "use strict";

  const FAV_STORAGE_KEY = "micro_tools_fav_v1";

  function normalizeFavoriteId(id) {
    return String(id || "").trim();
  }

  function getFavorites() {
    try {
      const raw = window.localStorage.getItem(FAV_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      const seen = new Set();
      return parsed
        .map(normalizeFavoriteId)
        .filter((id) => {
          if (!id || seen.has(id)) return false;
          seen.add(id);
          return true;
        });
    } catch (error) {
      return [];
    }
  }

  function setFavorites(ids) {
    const seen = new Set();
    const safeIds = Array.isArray(ids)
      ? ids.map(normalizeFavoriteId).filter((id) => {
          if (!id || seen.has(id)) return false;
          seen.add(id);
          return true;
        })
      : [];

    try {
      window.localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(safeIds));
    } catch (error) {
      return getFavorites();
    }
    return safeIds;
  }

  function isFavorited(id) {
    const target = normalizeFavoriteId(id);
    if (!target) return false;
    return getFavorites().includes(target);
  }

  function toggleFavorite(id) {
    const target = normalizeFavoriteId(id);
    if (!target) return false;

    const favorites = getFavorites();
    const exists = favorites.includes(target);
    const next = exists ? favorites.filter((item) => item !== target) : favorites.concat(target);
    setFavorites(next);
    return !exists;
  }

  window.MicroToolsStorage = Object.freeze({
    FAV_STORAGE_KEY,
    getFavorites,
    toggleFavorite,
    isFavorited
  });
})();
