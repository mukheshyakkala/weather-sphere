// src/components/dashboard/HourlyForecast.js
"use client";

import { useRef } from "react";
import { Sun, Cloud, CloudRain, CloudLightning, Wind, ChevronLeft, ChevronRight } from "lucide-react";
import "./HourlyForecast.css";

function getWeatherIcon(code) {
  if (!Number.isFinite(code)) return <Cloud size={20} color="#94a3b8" />;
  if (code === 0) return <Sun size={20} color="#fbbf24" />;
  if (code >= 1 && code <= 3) return <Cloud size={20} color="#94a3b8" />;
  if (code >= 51 && code <= 82) return <CloudRain size={20} color="#38bdf8" />;
  return <CloudLightning size={20} color="#f87171" />;
}

export default function HourlyForecast({ hourly, tempUnit, windUnit = "km/h" }) {
  const scrollRef = useRef(null);

  if (!Array.isArray(hourly?.time) || !Array.isArray(hourly?.temperature_2m)) return null;

  const scrollForecast = (direction) => {
    const track = scrollRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * track.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  const hoursList = hourly.time.slice(0, 24).flatMap((timeStr, idx) => {
    const temperature = hourly.temperature_2m[idx];
    if (typeof timeStr !== "string" || !Number.isFinite(Date.parse(timeStr)) || !Number.isFinite(temperature)) return [];
    return [{
      time: new Date(timeStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      temp: Math.round(temperature),
      rainProb: Number.isFinite(hourly.precipitation_probability?.[idx]) ? hourly.precipitation_probability[idx] : null,
      windSpeed: Number.isFinite(hourly.wind_speed_10m?.[idx]) ? hourly.wind_speed_10m[idx] : null,
      code: Number.isFinite(hourly.weather_code?.[idx]) ? hourly.weather_code[idx] : null,
    }];
  });

  if (!hoursList.length) return null;

  return (
    <div className="hourly-container">
      <div className="hourly-header">
        <h3>Hourly Weather Forecast (Next 24 Hours)</h3>
        <div className="hourly-controls" aria-label="Forecast carousel controls">
          <button
            type="button"
            className="hourly-control"
            aria-label="Scroll forecast backward"
            onClick={() => scrollForecast(-1)}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="hourly-control"
            aria-label="Scroll forecast forward"
            onClick={() => scrollForecast(1)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div
        className="hourly-scroll"
        ref={scrollRef}
        role="region"
        aria-label="Hourly weather forecast carousel"
        tabIndex={0}
      >
        {hoursList.map((item, idx) => (
          <div key={item.time} className="hourly-card">
            <p className="hourly-time">{item.time}</p>
            <div className="hourly-icon">{getWeatherIcon(item.code)}</div>
            <p className="hourly-temp">{item.temp}°{tempUnit}</p>
            <p className="hourly-rain">{item.rainProb == null ? "—" : `${item.rainProb}%`} rain</p>
            <p className="hourly-wind">
              <Wind size={10} color="var(--text-secondary)" /> {item.windSpeed == null ? "—" : `${item.windSpeed} ${windUnit}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}