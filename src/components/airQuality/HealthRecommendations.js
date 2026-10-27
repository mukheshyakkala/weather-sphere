import { Activity, HeartPulse, Leaf, ShieldCheck } from "lucide-react";
import { getAqiCategory } from "./airQualityUtils";

export default function HealthRecommendations({ aqi }) {
  const category = getAqiCategory(aqi);
  const hasAqi = Number.isFinite(aqi);
  const sensitive = hasAqi && aqi > 100;
  return (
    <section className="air-panel">
      <div className="air-section-heading"><div><span className="air-kicker">TAKE CARE OUT THERE</span><h2>Health recommendations</h2></div></div>
      <p className="air-advice-banner" style={{ "--aqi-color": category.color }}><ShieldCheck size={19} /> {category.advice}</p>
      <div className="air-recommendation-grid">
        <article><Leaf size={19} /><h3>Outdoor activity</h3><p>{!hasAqi ? "Check local air-quality guidance before planning outdoor activities." : aqi <= 100 ? "Good conditions for everyday outdoor plans." : "Keep outdoor activities shorter and take breaks indoors."}</p></article>
        <article><Activity size={19} /><h3>Exercise</h3><p>{!hasAqi ? "Air-quality readings are unavailable; use caution during outdoor exercise." : aqi <= 100 ? "Outdoor exercise is generally fine for most people." : "Move intense workouts indoors, especially near busy roads."}</p></article>
        <article><HeartPulse size={19} /><h3>Sensitive groups</h3><p>{!hasAqi ? "Sensitive groups should check local guidance before extended outdoor activity." : sensitive ? "Children, older adults, and people with asthma should limit prolonged outdoor exertion." : "Sensitive groups can enjoy usual activities, while watching for symptoms."}</p></article>
      </div>
    </section>
  );
}
