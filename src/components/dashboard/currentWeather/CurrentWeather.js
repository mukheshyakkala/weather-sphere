// src/components/dashboard/CurrentWeather.js
"use client";

import { Sun, Cloud, CloudRain, CloudLightning, Snowflake, Clock, Wind, Droplets } from "lucide-react";
import "./CurrentWeather.css";
import { useDispatch, useSelector } from "react-redux";

// Helper function to map Open-Meteo WMO weather codes to text, icons, and colors
function getWeatherDetails(code) {
  switch (code) {
    case 0:
      return { label: "Clear Sky", icon: Sun, color: "#fbbf24", animation: "spin-slow" };
    case 1:
    case 2:
      return { label: "Partly Cloudy", icon: Cloud, color: "#38bdf8", animation: "bounce-slow" };
    case 3:
      return { label: "Overcast Clouds", icon: Cloud, color: "#94a3b8", animation: "pulse-slow" };
    case 51:
    case 53:
    case 55:
    case 61:
    case 63:
      return { label: "Rain Showers", icon: CloudRain, color: "#60a5fa", animation: "bounce-slow" };
    case 95:
    case 96:
    case 99:
      return { label: "Thunderstorm", icon: CloudLightning, color: "#f87171", animation: "pulse-fast" };
    default:
      return { label: "Atmospheric Haze", icon: Cloud, color: "#cbd5e1", animation: "pulse-slow" };
  }
}

export default function CurrentWeather({ weather, location }) {
  const current = weather?.current;
  const daily = weather?.daily;

  const weatherCode = Number.isFinite(current?.weather_code) ? current.weather_code : null;
  const weatherInfo = getWeatherDetails(weatherCode);
  const WeatherIcon = weatherInfo.icon;

  // Extract today's max/min from daily arrays (index 0 corresponds to current day)
  const maxTemp = daily?.temperature_2m_max?.[0];
  const minTemp = daily?.temperature_2m_min?.[0];
  const tempUnit = useSelector((state) => state.preferences.temperatureUnit);
  const currentTime = current?.time;
  const date = currentTime && Number.isFinite(Date.parse(currentTime))
    ? new Date(currentTime)
    : null;

  return (
    <div className="card-current">
      {/* Top Header: Location & Date */}
      <div className="card-header-row">
        <div>
          <h2 className="location-title">
            {location?.name ?? "Selected location"}
            {location?.country && <span className="location-country">, {location.country}</span>}
          </h2>
          <p className="date-subtitle">
            {date?.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }) ?? "Current conditions"}
          </p>
        </div>

        {/* Animated Weather Icon Box */}
        <div className="weather-icon-box" style={{ borderColor: `${weatherInfo.color}40` }}>
          <WeatherIcon
            size={36}
            color={weatherInfo.color}
            className={weatherInfo.animation}
          />
        </div>
      </div>

      {/* Main Temperature Display */}
      <div className="temp-section">
        <div className="temp-large-wrapper">
          <span className="temp-large">{Number.isFinite(current?.temperature_2m) ? Math.round(current.temperature_2m) : "—"}</span>
          <span className="temp-unit">°{tempUnit}</span>
        </div>
        <div className="temp-meta">
          <p className="condition-text">{weatherInfo.label}</p>
          <p className="feels-like">
            Feels like <span className="highlight-val">{Number.isFinite(current?.apparent_temperature) ? `${Math.round(current.apparent_temperature)}°${tempUnit}` : "—"}</span>
          </p>
        </div>
      </div>

      {/* Advanced Insights Badge Row */}
      <div className="weather-extra-grid">
        <div className="extra-badge">
          <span className="badge-label">Daily High</span>
          <span className="badge-value">
            <span style={{ color: "#f87171" }}>↑ {Number.isFinite(maxTemp) ? `${Math.round(maxTemp)}°` : "—"}</span>
          </span>
        </div>

        <div className="extra-badge">
          <span className="badge-label">Daily  Low</span>
          <span className="badge-value">
            <span style={{ color: "#38bdf8" }}>↓ {Number.isFinite(minTemp) ? `${Math.round(minTemp)}°` : "—"}</span>
          </span>
        </div>
      </div>

      {/* Footer Timestamp */}
      <div className="card-footer-row">
        <span className="update-status">
          <Clock size={12} /> Live telemetry synced
        </span>
        <span className="code-tag">WMO Code: {weatherCode ?? "—"}</span>
      </div>
    </div>
  );
}