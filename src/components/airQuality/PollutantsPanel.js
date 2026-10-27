import { Atom } from "lucide-react";
import { pollutantDefinitions } from "./airQualityUtils";

export default function PollutantsPanel({ current, units }) {
  return (
    <section className="air-panel">
      <div className="air-section-heading">
        <div><span className="air-kicker">WHAT&apos;S IN THE AIR</span><h2>Pollutant levels</h2></div>
        <Atom size={20} color="var(--accent-color)" />
      </div>
      <div className="pollutant-grid">
        {pollutantDefinitions.slice(0, 6).map(([key, name, description], index) => (
          <article className="pollutant-card" key={key} style={{ "--pollutant-index": index }}>
            <span className={`pollutant-dot pollutant-dot-${index}`} />
            <span className="pollutant-name">{name}</span>
            <strong>{Number.isFinite(current?.[key]) ? current[key].toFixed(key === "carbon_monoxide" ? 0 : 1) : "—"}</strong>
            <span className="pollutant-unit">{units?.[key] ?? "µg/m³"}</span>
            <small>{description}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
