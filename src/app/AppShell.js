"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import {
  hydratePreferences,
  setCurrentLocation,
  setLocationUnavailable,
} from "./store/preferencesSlice";
import { getCurrentLocation } from "./utils/geolocation";
import { useClientReady } from "./utils/useClientReady";
import Header from "../components/common/Header/Header";
import Sidebar from "../components/common/Sidebar/Sidebar";

export default function AppShell({ children }) {
  const dispatch = useDispatch();
  const store = useStore();
  const preferences = useSelector((state) => state.preferences);
  const clientReady = useClientReady();
  const geolocationAttempted = useRef(false);
  const locationRequestId = useRef(preferences.locationRequestId);

  useEffect(() => {
    let savedPreferences;
    try {
      savedPreferences = localStorage.getItem("weather-sphere-preferences");
    } catch (error) {
      console.error("Unable to read saved preferences.", error);
    }

    if (savedPreferences) {
      try {
        dispatch(hydratePreferences(JSON.parse(savedPreferences)));
      } catch (error) {
        console.error("Unable to parse saved preferences.", error);
        dispatch(hydratePreferences(null));
      }
    } else {
      dispatch(hydratePreferences(null));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!preferences.hydrated) return;
    document.body.className = preferences.theme;
  }, [preferences.hydrated, preferences.theme]);

  useEffect(() => {
    if (!preferences.hydrated) return undefined;

    if (locationRequestId.current !== preferences.locationRequestId) {
      locationRequestId.current = preferences.locationRequestId;
      geolocationAttempted.current = false;
    }

    if (preferences.selectedLocation && preferences.selectedLocation.source !== "browser") {
      return undefined;
    }
    if (geolocationAttempted.current) return undefined;

    geolocationAttempted.current = true;
    getCurrentLocation()
      .then((location) => {
        const selectedLocation = store.getState().preferences.selectedLocation;
        if (selectedLocation && selectedLocation.source !== "browser") return;
        dispatch(setCurrentLocation(location));
      })
      .catch((error) => {
        if (store.getState().preferences.selectedLocation) return;
        console.warn("Unable to determine the user's location.", error);
        dispatch(setLocationUnavailable());
      });
    return undefined;
  }, [
    dispatch,
    preferences.hydrated,
    preferences.locationRequestId,
    preferences.selectedLocation,
    store,
  ]);

  useEffect(() => {
    if (!preferences.hydrated) return;

    try {
      localStorage.setItem(
        "weather-sphere-preferences",
        JSON.stringify({
          theme: preferences.theme,
          temperatureUnit: preferences.temperatureUnit,
          windSpeedUnit: preferences.windSpeedUnit,
          precipitationUnit: preferences.precipitationUnit,
          defaultForecastView: preferences.defaultForecastView,
          refreshInterval: preferences.refreshInterval,
          selectedLocation: preferences.selectedLocation,
          recentSearches: preferences.recentSearches,
        }),
      );
    } catch (error) {
      console.error("Unable to save preferences.", error);
    }
  }, [preferences]);

  return (
    <div className="app-container">
      <Header />
      <div className="dashboard-layout">
        <Sidebar />
        <div className="app-content">
          {clientReady && preferences.hydrated && !preferences.selectedLocation && (
            <div className={`location-status location-status-${preferences.locationStatus}`} role={preferences.locationStatus === "unavailable" ? "alert" : "status"}>
              {preferences.locationStatus === "locating"
                ? "Getting your location to load local weather…"
                : "Location is unavailable. Search for a city or use Settings → Use current location to try again."}
            </div>
          )}
          {children}
        </div>
      </div>
      <footer className="app-footer">
        © WeatherSphere. All rights reserved.
      </footer>
    </div>
  );
}
