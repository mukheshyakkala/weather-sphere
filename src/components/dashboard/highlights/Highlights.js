// src/components/dashboard/Highlights.js
"use client";

import { Droplets, Wind, Compass, Gauge, Eye, Cloud, Thermometer, CloudRain, Sunrise, Sunset } from "lucide-react";
import "./Highlights.css";

export default function Highlights({ weather }) {
  const current = weather?.current;
  const units = weather?.current_units;
  const daily = weather?.daily;
  const formatValue = (value, unit, decimalPlaces = 0) => {
    if (!Number.isFinite(value)) return "—";

    const formattedValue = Number(value).toFixed(decimalPlaces);
    return unit === "%" ? `${formattedValue}%` : `${formattedValue}${unit ? ` ${unit}` : ""}`;
  };
  const formatTime = (value) => {
    if (!value || typeof value !== "string") return "—";

    const time = value.split("T")[1];
    if (!time) return "—";

    const [hours, minutes] = time.split(":").map(Number);
    if (!Number.isInteger(hours) || hours < 0 || hours > 23 || !Number.isInteger(minutes) || minutes < 0 || minutes > 59) return "—";

    return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${hours < 12 ? "AM" : "PM"}`;
  };
  const items = [
    { label: "Humidity", val: formatValue(current?.relative_humidity_2m, units?.relative_humidity_2m), icon: Droplets },
    { label: "Wind Speed", val: formatValue(current?.wind_speed_10m, units?.wind_speed_10m, 1), icon: Wind },
    { label: "UV Index", val: formatValue(current?.uv_index, units?.uv_index, 1), icon: Compass },
    { label: "Pressure", val: formatValue(current?.surface_pressure, units?.surface_pressure, 1), icon: Gauge },
    {
      label: "Visibility",
      val: formatValue(current?.visibility == null ? null : current.visibility / 1000, "km", 1),
      icon: Eye,
    },
    { label: "Cloud Cover", val: formatValue(current?.cloud_cover, units?.cloud_cover), icon: Cloud },
    { label: "Dew Point", val: formatValue(current?.dew_point_2m, units?.dew_point_2m, 1), icon: Thermometer },
    { label: "Precipitation", val: formatValue(current?.precipitation, units?.precipitation), icon: CloudRain },
    {
      label: "Sunrise",
      val: formatTime(daily?.sunrise?.[0]),
      icon: Sunrise,
    },
    {
      label: "Sunset",
      val: formatTime(daily?.sunset?.[0]),
      icon: Sunset,
    },
  ];

  return (
    <div className="highlights-container">
      <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Today&apos;s Weather Highlights</h3>
      <div className="highlights-grid">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="highlight-tile">
              <Icon size={18} color="var(--accent-color)" />
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "6px" }}>{item.label}</p>
              <p style={{ fontSize: "1rem", fontWeight: "700", marginTop: "2px" }}>{item.val}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}