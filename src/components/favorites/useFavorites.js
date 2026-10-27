import { useSyncExternalStore } from "react";

const STORAGE_KEY = "weather-sphere-favorites";
const listeners = new Set();
const EMPTY_FAVORITES = Object.freeze([]);
let cachedFavorites;

function getFavoritesSnapshot() {
  if (cachedFavorites) return cachedFavorites;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    cachedFavorites = Array.isArray(parsed)
      ? parsed.filter((item) =>
          item &&
          typeof item === "object" &&
          typeof item.name === "string" &&
          Number.isFinite(item.latitude) &&
          item.latitude >= -90 &&
          item.latitude <= 90 &&
          Number.isFinite(item.longitude) &&
          item.longitude >= -180 &&
          item.longitude <= 180,
        )
      : [];
  } catch (error) {
    console.error("Unable to read saved favorite locations.", error);
    cachedFavorites = [];
  }

  return cachedFavorites;
}

function subscribe(listener) {
  listeners.add(listener);
  const handleStorage = (event) => {
    if (event.key !== STORAGE_KEY) return;
    cachedFavorites = undefined;
    listener();
  };
  const clearFavorites = () => {
    cachedFavorites = [];
    listener();
  };

  if (typeof window === "undefined") {
    return () => listeners.delete(listener);
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener("weather-sphere-favorites-cleared", clearFavorites);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("weather-sphere-favorites-cleared", clearFavorites);
  };
}

function updateFavorites(update) {
  cachedFavorites = update(getFavoritesSnapshot());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedFavorites));
  } catch (error) {
    console.error("Unable to save favorite locations.", error);
  }
  listeners.forEach((listener) => listener());
}

export function useFavorites() {
  const favorites = useSyncExternalStore(
    subscribe,
    getFavoritesSnapshot,
    () => EMPTY_FAVORITES,
  );

  const addFavorite = (location) => {
    if (!location || typeof location.name !== "string" ||
        !Number.isFinite(location.latitude) || location.latitude < -90 || location.latitude > 90 ||
        !Number.isFinite(location.longitude) || location.longitude < -180 || location.longitude > 180) return;
    updateFavorites((current) => (
    current.some((item) => item.latitude === location.latitude && item.longitude === location.longitude)
      ? current
      : [...current, location]
    ));
  };

  const removeFavorite = (location) => {
    if (!location || !Number.isFinite(location.latitude) || location.latitude < -90 || location.latitude > 90 ||
        !Number.isFinite(location.longitude) || location.longitude < -180 || location.longitude > 180) return;
    updateFavorites((current) => current.filter(
      (item) => item.latitude !== location.latitude || item.longitude !== location.longitude,
    ));
  };

  return {
    favorites,
    hydrated: true,
    addFavorite,
    removeFavorite,
    clearFavorites: () => updateFavorites(() => []),
  };
}
