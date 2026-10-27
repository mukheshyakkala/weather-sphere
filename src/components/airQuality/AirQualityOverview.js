import { Activity, MapPin } from "lucide-react";
import { formatUpdatedTime, getAqiCategory } from "./airQualityUtils";

export default function AirQualityOverview({ location, current, timezone }) {
  const aqi = current?.us_aqi;
  const category = getAqiCategory(aqi);
  const locationLabel = [location?.name, location?.country].filter(Boolean).join(", ") || "Selected location";

  return (
    <section className="air-hero">
      <div className="air-hero-copy">
        <span className="air-eyebrow"><Activity size={15} /> AIR QUALITY MONITOR</span>
        <h1>Breathe easier with local air insights</h1>
        <p>Track the air around you and make informed choices before heading outside.</p>
        <span className="air-location"><MapPin size={16} /> {locationLabel}</span>
      </div>
      <div className="air-aqi-card" style={{ "--aqi-color": category.color }}>
        <div className="air-aqi-gauge" aria-label={`US AQI ${aqi ?? "unavailable"}`}>
          <strong>{Number.isFinite(aqi) ? aqi : "—"}</strong>
          <span>US AQI</span>
        </div>
        <span className="air-aqi-category">{category.label}</span>
        <span className="air-updated">Updated {formatUpdatedTime(current?.time, timezone)}</span>
      </div>
    </section>
  );
}
