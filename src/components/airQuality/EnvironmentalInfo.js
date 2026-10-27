import { Sun, Wind } from "lucide-react";
import { pollutantDefinitions } from "./airQualityUtils";

export default function EnvironmentalInfo({ current, units, hourly }) {
  const dustLabel = pollutantDefinitions.find(([key]) => key === "dust")?.[1] ?? "Dust";
  const hasPollenData = ["alder_pollen", "birch_pollen", "grass_pollen", "mugwort_pollen", "olive_pollen", "ragweed_pollen"]
    .some((key) => Array.isArray(hourly?.[key]) && hourly[key].some((value) => Number.isFinite(value)));
  return (
    <section className="air-panel">
      <div className="air-section-heading"><div><span className="air-kicker">ENVIRONMENT</span><h2>Additional conditions</h2></div></div>
      <div className="environment-grid">
        <article><Sun size={21} color="#fbbf24" /><span>UV index</span><strong>{Number.isFinite(current?.uv_index) ? current.uv_index.toFixed(1) : "—"}</strong><small>Current conditions</small></article>
        <article><Wind size={21} color="#7dd3fc" /><span>{dustLabel}</span><strong>{Number.isFinite(current?.dust) ? `${current.dust.toFixed(1)} ${units?.dust ?? "µg/m³"}` : "—"}</strong><small>{Number.isFinite(current?.dust) ? "Current model estimate" : "Not available for this location"}</small></article>
        <article><span className="pollen-mark">P</span><span>Pollen</span><strong>{hasPollenData ? "Available" : "—"}</strong><small>{hasPollenData ? "Seasonal model forecast" : "Not available for this location"}</small></article>
      </div>
    </section>
  );
}
