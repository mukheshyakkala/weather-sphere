// src/components/dashboard/WeeklyForecast.js
"use client";

import { useSelector } from "react-redux";
import { Sun, Cloud, CloudRain, CloudLightning, Droplets } from "lucide-react";
import "./WeeklyForecast.css";

function getWeatherIcon(code) {
  if (!Number.isFinite(code)) return <Cloud size={18} color="#94a3b8" />;
  if (code === 0) return <Sun size={18} color="#fbbf24" />;
  if (code >= 1 && code <= 3) return <Cloud size={18} color="#94a3b8" />;
  if (code >= 51 && code <= 82) return <CloudRain size={18} color="#38bdf8" />;
  return <CloudLightning size={18} color="#f87171" />;
}

export default function WeeklyForecast({ daily }) {
  const tempUnit = useSelector((state) => state.preferences.temperatureUnit);

  if (!Array.isArray(daily?.time) ||
      !Array.isArray(daily?.temperature_2m_max) ||
      !Array.isArray(daily?.temperature_2m_min)) return null;

  return (
    <div className="weekly-container">
      <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Weekly Forecast (Next 7 Days)</h3>
      <div className="weekly-list">
        {daily.time.slice(0, 7).flatMap((timeStr, idx) => {
          if (typeof timeStr !== "string" || !Number.isFinite(Date.parse(`${timeStr}T12:00:00Z`))) return [];
          const date = new Date(timeStr);
          const dayName = idx === 0
            ? "Today"
            : date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "numeric",
                day: "numeric",
                timeZone: "UTC",
              });
          const maxTemp = daily.temperature_2m_max[idx];
          const minTemp = daily.temperature_2m_min[idx];
          if (!Number.isFinite(maxTemp) || !Number.isFinite(minTemp)) return [];
          const weatherCode = Number.isFinite(daily.weather_code?.[idx]) ? daily.weather_code[idx] : null;
          const rainProb = Number.isFinite(daily.precipitation_probability_max?.[idx]) ? daily.precipitation_probability_max[idx] : null;

          return (
            <div key={timeStr} className="weekly-row">
              <span className="weekly-day">{dayName}</span>
              <div className="weekly-condition">
                {getWeatherIcon(weatherCode)}
                <span>{weatherCode == null ? "Condition unavailable" : `Code ${weatherCode}`}</span>
              </div>
              <span className="weekly-rain">
                <Droplets size={12} color="#38bdf8" /> {rainProb == null ? "—" : `${rainProb}%`}
              </span>
              <div className="weekly-temp-range">
                <span style={{ color: "#38bdf8" }}>{Math.round(minTemp)}°</span>
                <div className="temp-bar-bg">
                  <div className="temp-bar-fill" style={{ width: `${Math.min(100, Math.max(20, maxTemp * 2))}%` }}></div>
                </div>
                <span style={{ color: "#f87171" }}>{Math.round(maxTemp)}°{tempUnit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}