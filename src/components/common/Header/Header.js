"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Search, Sun, Moon, CloudSun, MapPin, Thermometer } from "lucide-react";
import { setSelectedLocation, toggleTheme, toggleTemperatureUnit } from "../../../app/store/preferencesSlice";
import { useLazySearchLocationsQuery } from "../../../app/store/weatherApiSlice";
import "./Header.css";

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useSelector((state) => state.preferences.theme);
  const tempUnit = useSelector((state) => state.preferences.temperatureUnit);

  const [searchQuery, setSearchQuery] = useState("");
  const [triggerSearch, { currentData: searchResults = [] }] = useLazySearchLocationsQuery();
  const locations = Array.isArray(searchResults) ? searchResults : [];

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length >= 2) {
      triggerSearch(query);
    }
  };

  const handleSelectLocation = (loc) => {
    dispatch(
      setSelectedLocation({
        name: loc.name,
        country: loc.country,
        admin1: loc.admin1 || "",
        latitude: loc.latitude,
        longitude: loc.longitude,
      })
    );
    setSearchQuery("");
    router.push("/");
  };

  return (
    <header className="full-header-wrapper">
      <div className="brand-container" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div className="brand-icon">
          <CloudSun size={24} />
        </div>
        <div className="brand-copy">
          <h1 className="brand-title">WeatherSphere</h1>
          <p className="brand-subtitle">Intelligence Dashboard</p>
        </div>
      </div>

      <div className="search-container">
        <div className="search-input-box">
          <Search size={16} color="var(--text-secondary)" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search city..."
            className="search-input"
          />
        </div>

        {locations.length > 0 && searchQuery.length >= 2 && (
          <ul className="search-dropdown">
            {locations.filter((loc) => Number.isFinite(loc?.latitude) && Number.isFinite(loc?.longitude)).map((loc) => (
              <li
                key={`${loc.latitude}-${loc.longitude}`}
                onClick={() => handleSelectLocation(loc)}
                className="search-item"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <MapPin size={14} color="var(--accent-color)" />
                  <span>{loc.name ?? "Unknown location"}</span>
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  {loc.admin1 ? `${loc.admin1}, ` : ""}{loc.country ?? ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="header-actions">
        {/* Unit Selector (°C / °F) */}
        <button
          onClick={() => dispatch(toggleTemperatureUnit())}
          className="theme-btn"
          title="Toggle Temperature Unit"
        >
          <Thermometer size={16} color="var(--accent-color)" />
          <span>°{tempUnit}</span>
        </button>

        {/* Theme Toggle */}
        <button onClick={() => dispatch(toggleTheme())} className="theme-btn">
          {theme === "dark" ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#0ea5e9" />}
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
      </div>
    </header>
  );
}