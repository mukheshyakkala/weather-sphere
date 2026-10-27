import { getAqiCategory } from "./airQualityUtils";

const categories = [
  { label: "Good", range: "0–50", color: "#22c55e" },
  { label: "Moderate", range: "51–100", color: "#eab308" },
  { label: "Unhealthy for Sensitive Groups", range: "101–150", color: "#f97316" },
  { label: "Unhealthy", range: "151–200", color: "#ef4444" },
  { label: "Very Unhealthy", range: "201–300", color: "#a855f7" },
  { label: "Hazardous", range: "301+", color: "#7f1d1d" },
];

export default function AqiCategories({ currentAqi }) {
  const active = getAqiCategory(currentAqi).label;
  return (
    <section className="air-panel">
      <div className="air-section-heading"><div><span className="air-kicker">US AQI SCALE</span><h2>Know the categories</h2></div></div>
      <div className="aqi-category-list">
        {categories.map((category) => (
          <div className={`aqi-category${active === category.label ? " current" : ""}`} key={category.label}>
            <i style={{ backgroundColor: category.color }} />
            <span>{category.label}</span>
            <small>{category.range}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
