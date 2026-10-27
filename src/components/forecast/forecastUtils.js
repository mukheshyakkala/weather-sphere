import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Sun,
} from "lucide-react";

export function getWeatherDetails(code = null) {
  if (!Number.isFinite(code)) return { label: "Conditions unavailable", Icon: Cloud, color: "#94a3b8" };
  if (code === 0) return { label: "Clear sky", Icon: Sun, color: "#fbbf24" };
  if (code <= 2) return { label: "Partly cloudy", Icon: Cloud, color: "#7dd3fc" };
  if (code === 3) return { label: "Overcast", Icon: Cloud, color: "#94a3b8" };
  if (code === 45 || code === 48) return { label: "Fog", Icon: CloudFog, color: "#cbd5e1" };
  if (code <= 57) return { label: "Drizzle", Icon: CloudDrizzle, color: "#38bdf8" };
  if (code <= 67 || (code >= 80 && code <= 82)) {
    return { label: "Rain showers", Icon: CloudRain, color: "#38bdf8" };
  }
  if (code <= 77 || code === 85 || code === 86) {
    return { label: "Snow", Icon: CloudSnow, color: "#bae6fd" };
  }
  if (code >= 95) return { label: "Thunderstorm", Icon: CloudLightning, color: "#f87171" };
  return { label: "Cloudy", Icon: Cloud, color: "#94a3b8" };
}

export function formatDay(date, options = { weekday: "short", month: "short", day: "numeric" }) {
  if (typeof date !== "string" || !Number.isFinite(Date.parse(`${date.slice(0, 10)}T12:00:00Z`))) return "—";
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    ...options,
    timeZone: "UTC",
  });
}

export function formatHour(time) {
  if (typeof time !== "string" || time.length < 13) return "—";
  const hour = Number(time.slice(11, 13));
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) return "—";
  return `${hour % 12 || 12}${hour < 12 ? "AM" : "PM"}`;
}

export function getWindDirection(degrees) {
  if (!Number.isFinite(degrees)) return "—";
  return ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][
    Math.round(degrees / 45) % 8
  ];
}

export function formatValue(value, unit = "", digits = 0) {
  if (!Number.isFinite(value) || typeof unit !== "string" || !Number.isInteger(digits) || digits < 0) return "—";
  return `${Number(value).toFixed(digits)}${unit}`;
}

export function getChartLabel(metric, view) {
  if (metric === "rain") return view === "hourly" ? "Rain chance & amount" : "Daily rainfall";
  if (metric === "wind") return view === "hourly" ? "Wind & gusts" : "Daily wind";
  return view === "hourly" ? "Temperature & feels like" : "Daily temperature range";
}
