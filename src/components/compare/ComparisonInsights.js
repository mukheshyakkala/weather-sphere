import { ArrowDown, ArrowUp, CloudRain, Droplets, Wind } from "lucide-react";

function difference(a, b, unit, digits = 0) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return "Waiting for data";
  const delta = a - b;
  return `${delta > 0 ? "+" : ""}${delta.toFixed(digits)}${unit}`;
}

export default function ComparisonInsights({
  cityA,
  cityB,
  weatherA,
  weatherB,
  airA,
  airB,
  windUnit = "km/h",
  precipitationUnit = "mm",
}) {
  const tempA = weatherA?.current?.temperature_2m;
  const tempB = weatherB?.current?.temperature_2m;
  const humidityA = weatherA?.current?.relative_humidity_2m;
  const humidityB = weatherB?.current?.relative_humidity_2m;
  const windA = weatherA?.current?.wind_speed_10m;
  const windB = weatherB?.current?.wind_speed_10m;
  const rainA = weatherA?.daily?.precipitation_probability_max?.[0];
  const rainB = weatherB?.daily?.precipitation_probability_max?.[0];
  const rainfallA = weatherA?.daily?.precipitation_sum?.[0];
  const rainfallB = weatherB?.daily?.precipitation_sum?.[0];
  const aqiA = airA?.current?.us_aqi;
  const aqiB = airB?.current?.us_aqi;
  const warmer = Number.isFinite(tempA) && Number.isFinite(tempB) ? (tempA >= tempB ? cityA?.name : cityB?.name) : "—";
  const cleaner = Number.isFinite(aqiA) && Number.isFinite(aqiB) ? (aqiA <= aqiB ? cityA?.name : cityB?.name) : "—";
  const lowerRainCity = Number.isFinite(rainA) && Number.isFinite(rainB)
    ? rainA <= rainB ? cityA?.name : cityB?.name
    : "—";

  return (
    <section className="compare-panel">
      <div className="compare-section-heading"><div><span className="compare-kicker">THE DIFFERENCE</span><h2>Weather insights</h2></div></div>
      <div className="compare-insight-grid">
        <article><ArrowUp size={18} /><span>Warmer right now</span><strong>{warmer}</strong><small>{difference(tempA, tempB, "°", 1)} · {cityA?.name ?? "City one"} vs {cityB?.name ?? "City two"}</small></article>
        <article><ArrowDown size={18} /><span>Cooler right now</span><strong>{warmer === cityA?.name ? cityB?.name : warmer === cityB?.name ? cityA?.name : "—"}</strong><small>The other city by current temperature</small></article>
        <article><Droplets size={18} /><span>Humidity difference</span><strong>{difference(humidityA, humidityB, "%")}</strong><small>First city minus second city</small></article>
        <article><Wind size={18} /><span>Wind speed difference</span><strong>{difference(windA, windB, ` ${windUnit}`, 1)}</strong><small>First city minus second city</small></article>
        <article><CloudRain size={18} /><span>Rainfall difference</span><strong>{difference(rainfallA, rainfallB, ` ${precipitationUnit}`, 1)}</strong><small>Today · first city minus second city</small></article>
        <article><Droplets size={18} /><span>Rain chance difference</span><strong>{difference(rainA, rainB, "%")}</strong><small>Today · first city minus second city</small></article>
        <article><ArrowDown size={18} /><span>Cleaner air</span><strong>{cleaner}</strong><small>AQI {Number.isFinite(aqiA) ? aqiA : "—"} vs {Number.isFinite(aqiB) ? aqiB : "—"}</small></article>
        <article><Wind size={18} /><span>Outdoor outlook</span><strong>{lowerRainCity}</strong><small>Lower predicted rain chance today</small></article>
      </div>
    </section>
  );
}
