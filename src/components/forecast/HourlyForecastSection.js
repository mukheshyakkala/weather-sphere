"use client";

import { useRef } from "react";
import { Droplets, Thermometer, Wind } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDay, formatHour, formatValue, getWeatherDetails, getWindDirection } from "./forecastUtils";

export default function HourlyForecastSection({ data, tempUnit, windUnit = "km/h" }) {
  const scrollRef = useRef(null);
  const forecast = Array.isArray(data) ? data.filter((hour) => hour && typeof hour === "object") : [];
  const scrollForecast = (direction) => {
    const track = scrollRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * track.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <section className="forecast-panel">
      <div className="forecast-section-heading">
        <div>
          <span className="forecast-section-kicker">HOUR BY HOUR</span>
          <h2>Next 48 hours</h2>
          <p className="forecast-section-description">
            Swipe to explore temperature, rain, humidity, wind and UV.
          </p>
        </div>
        <div className="forecast-carousel-actions">
          <span className="forecast-data-badge">{forecast.length} hours</span>
          <div className="forecast-carousel-controls" aria-label="48-hour forecast controls">
            <button
              type="button"
              aria-label="Scroll forecast backward"
              onClick={() => scrollForecast(-1)}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Scroll forecast forward"
              onClick={() => scrollForecast(1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
      <div
        className="forecast-hourly-scroll"
        ref={scrollRef}
        role="region"
        aria-label="48-hour weather forecast carousel"
        tabIndex={0}
      >
        {forecast.map((hour, index) => {
          const details = getWeatherDetails(hour.weatherCode);
          const WeatherIcon = details.Icon;
          return (
            <article
              key={hour.time ?? index}
              className="forecast-hour-card"
              style={{ "--item-index": index }}
            >
              <span className="forecast-hour-time">{index === 0 ? "Now" : formatHour(hour.time ?? "")}</span>
              <span className="forecast-hour-date">
                {index === 0 || hour.time?.slice(11, 13) === "00"
                  ? formatDay(hour.date, { month: "short", day: "numeric" })
                  : "\u00a0"}
              </span>
              <WeatherIcon size={24} color={details.color} className="forecast-weather-icon" />
              <strong className="forecast-hour-temp">{formatValue(hour.temperature, `°${tempUnit}`)}</strong>
              <span className="forecast-hour-condition">{details.label}</span>
              <div className="forecast-hour-stat">
                <Thermometer size={13} /> Feels {formatValue(hour.feelsLike, `°${tempUnit}`)}
              </div>
              <div className="forecast-hour-stat forecast-rain-stat">
                <Droplets size={13} /> {formatValue(hour.rainProbability, "%")}
              </div>
              <div className="forecast-hour-stat">
                <Wind size={13} /> {formatValue(hour.windSpeed, ` ${windUnit}`)} {getWindDirection(hour.windDirection)}
              </div>
              <div className="forecast-hour-extra">
                <span>Humidity {formatValue(hour.humidity, "%")}</span>
                <span>UV {formatValue(hour.uvIndex, "", 1)}</span>
                <span>Gusts {formatValue(hour.windGusts, ` ${windUnit}`)}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
