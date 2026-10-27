"use client";

import { useDispatch } from "react-redux";
import { Database, RotateCcw, Trash2 } from "lucide-react";
import { clearRecentSearches, resetPreferences } from "../../app/store/preferencesSlice";

export default function DataManagement() {
  const dispatch = useDispatch();
  const clearFavorites = () => {
    try {
      localStorage.removeItem("weather-sphere-favorites");
      window.dispatchEvent(new Event("weather-sphere-favorites-cleared"));
    } catch (error) {
      console.error("Unable to clear saved favorites.", error);
    }
  };

  const clearPreferences = () => {
    dispatch(resetPreferences());
    try {
      localStorage.removeItem("weather-sphere-preferences");
    } catch (error) {
      console.error("Unable to clear saved application settings.", error);
    }
  };

  const reset = () => {
    clearPreferences();
    clearFavorites();
    try {
      localStorage.removeItem("weather-sphere-notification-settings");
      window.dispatchEvent(new Event("weather-sphere-notifications-reset"));
    } catch (error) {
      console.error("Unable to clear notification preferences.", error);
    }
  };

  return (
    <section className="settings-card">
      <div className="settings-card-heading"><Database size={19} /><div><h2>Data management</h2><p>Clear saved data or restore the app defaults.</p></div></div>
      <div className="settings-data-actions">
        <button type="button" onClick={() => dispatch(clearRecentSearches())}><Trash2 size={15} /> Clear recent searches</button>
        <button type="button" onClick={clearFavorites}><Trash2 size={15} /> Clear saved locations</button>
        <button type="button" onClick={clearPreferences}><Trash2 size={15} /> Clear saved preferences</button>
        <button className="settings-reset" type="button" onClick={reset}><RotateCcw size={15} /> Reset application settings</button>
      </div>
    </section>
  );
}
