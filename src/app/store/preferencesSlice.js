// src/store/preferencesSlice.js (or wherever your preferences slice is located)
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "dark",
  temperatureUnit: "C", // Default unit
  windSpeedUnit: "kmh",
  precipitationUnit: "mm",
  defaultForecastView: "hourly",
  refreshInterval: 0,
  selectedLocation: null,
  locationRequestId: 0,
  locationStatus: "locating",
  recentSearches: [],
  hydrated: false,
};

function isValidLocation(location) {
  return Boolean(
    location &&
    typeof location === "object" &&
    Number.isFinite(location.latitude) &&
    location.latitude >= -90 &&
    location.latitude <= 90 &&
    Number.isFinite(location.longitude) &&
    location.longitude >= -180 &&
    location.longitude <= 180,
  );
}

function normalizeLocation(location) {
  return {
    ...location,
    name: typeof location.name === "string" ? location.name : "Selected location",
    country: typeof location.country === "string" ? location.country : "",
    admin1: typeof location.admin1 === "string" ? location.admin1 : "",
    source: location.source === "browser" ? "browser" : "manual",
  };
}

function isLegacyDefaultLocation(location) {
  return location?.latitude === 17.385 &&
    location?.longitude === 78.4867 &&
    location?.name === "Hyderabad";
}

function updateSelectedLocation(state, location, source) {
  if (!isValidLocation(location)) return;
  const normalizedLocation = normalizeLocation({ ...location, source });
  state.selectedLocation = normalizedLocation;
  const recentSearches = Array.isArray(state.recentSearches) ? state.recentSearches : [];
  state.recentSearches = [
    normalizedLocation,
    ...recentSearches.filter(
      (recentLocation) =>
        recentLocation?.latitude !== normalizedLocation.latitude ||
        recentLocation?.longitude !== normalizedLocation.longitude,
    ),
  ].slice(0, 10);
}

export const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setTheme: (state, action) => {
      if (["dark", "light", "system"].includes(action.payload)) state.theme = action.payload;
    },
    setTemperatureUnit: (state, action) => {
      if (["C", "F"].includes(action.payload)) state.temperatureUnit = action.payload;
    },
    toggleTemperatureUnit: (state) => {
      state.temperatureUnit = state.temperatureUnit === "C" ? "F" : "C";
    },
    setSelectedLocation: (state, action) => {
      updateSelectedLocation(state, action.payload, "manual");
    },
    setCurrentLocation: (state, action) => {
      updateSelectedLocation(state, action.payload, "browser");
      if (state.selectedLocation) state.locationStatus = "available";
    },
    setLocationUnavailable: (state) => {
      state.locationStatus = "unavailable";
    },
    setWindSpeedUnit: (state, action) => {
      if (["kmh", "mph", "ms"].includes(action.payload)) state.windSpeedUnit = action.payload;
    },
    setPrecipitationUnit: (state, action) => {
      if (["mm", "inch"].includes(action.payload)) state.precipitationUnit = action.payload;
    },
    setDefaultForecastView: (state, action) => {
      if (["hourly", "daily"].includes(action.payload)) state.defaultForecastView = action.payload;
    },
    setRefreshInterval: (state, action) => {
      if ([0, 300000, 900000, 1800000].includes(action.payload)) state.refreshInterval = action.payload;
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    hydratePreferences: (state, action) => {
      const saved = action.payload;
      if (saved && typeof saved === "object") {
        if (["dark", "light", "system"].includes(saved.theme)) state.theme = saved.theme;
        if (["C", "F"].includes(saved.temperatureUnit)) state.temperatureUnit = saved.temperatureUnit;
        if (["kmh", "mph", "ms"].includes(saved.windSpeedUnit)) state.windSpeedUnit = saved.windSpeedUnit;
        if (["mm", "inch"].includes(saved.precipitationUnit)) state.precipitationUnit = saved.precipitationUnit;
        if (["hourly", "daily"].includes(saved.defaultForecastView)) state.defaultForecastView = saved.defaultForecastView;
        if ([0, 300000, 900000, 1800000].includes(saved.refreshInterval)) state.refreshInterval = saved.refreshInterval;
        if (isValidLocation(saved.selectedLocation) && !isLegacyDefaultLocation(saved.selectedLocation)) {
          state.selectedLocation = normalizeLocation(saved.selectedLocation);
        }
        if (Array.isArray(saved.recentSearches)) {
          state.recentSearches = saved.recentSearches
            .filter((location) =>
              location &&
              typeof location === "object" &&
              isValidLocation(location),
            )
            .map(normalizeLocation)
            .slice(0, 10);
        }
      }
      state.hydrated = true;
    },
    resetPreferences: (state) => ({
      ...initialState,
      hydrated: true,
      locationRequestId: state.locationRequestId + 1,
    }),
  },
});

export const {
  toggleTheme,
  setTheme,
  setTemperatureUnit,
  toggleTemperatureUnit,
  setWindSpeedUnit,
  setPrecipitationUnit,
  setDefaultForecastView,
  setRefreshInterval,
  setSelectedLocation,
  setCurrentLocation,
  setLocationUnavailable,
  clearRecentSearches,
  hydratePreferences,
  resetPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;