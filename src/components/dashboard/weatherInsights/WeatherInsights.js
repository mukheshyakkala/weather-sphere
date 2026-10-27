"use client";

import { Umbrella, Shirt, Activity, ShieldCheck } from "lucide-react";
import "./WeatherInsights.css";

export default function WeatherInsights({ weather }) {
  const current = weather?.current;
  const precip = current?.precipitation;
  const temp = current?.temperature_2m;

  return (
    <div className="insights-container">
      <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Smart Weather Insights</h3>
      <div className="insights-grid">
        {/* Rain Suggestion */}
        <div className="insight-card">
          <div className="insight-header">
            <Umbrella size={18} color="#38bdf8" />
            <span>Rain Suggestions</span>
          </div>
          <p className="insight-desc">
            {!Number.isFinite(precip) ? "Rain conditions are currently unavailable." : precip > 0 ? "Rain detected. Carry an umbrella before heading out!" : "No rain expected right now. Clear conditions."}
          </p>
        </div>

        {/* Clothing Suggestions */}
        <div className="insight-card">
          <div className="insight-header">
            <Shirt size={18} color="#fbbf24" />
            <span>Clothing Suggestions</span>
          </div>
          <p className="insight-desc">
            {!Number.isFinite(temp) ? "Temperature guidance is currently unavailable." : temp < 15 ? "Cool weather! A warm sweater or light jacket is recommended." : "Mild & comfortable. Standard breathable cotton wear is ideal."}
          </p>
        </div>

        {/* Outdoor Activity */}
        <div className="insight-card">
          <div className="insight-header">
            <Activity size={18} color="#10b981" />
            <span>Outdoor Activity</span>
          </div>
          <p className="insight-desc">
            {!Number.isFinite(precip) ? "Check local conditions before planning outdoor activities." : precip === 0 ? "Great conditions for outdoor workouts, running, or cycling!" : "Consider indoor activities due to active precipitation."}
          </p>
        </div>

        {/* Safety Tips */}
        <div className="insight-card">
          <div className="insight-header">
            <ShieldCheck size={18} color="#a855f7" />
            <span>Safety Advice</span>
          </div>
          <p className="insight-desc">
            Keep hydrated throughout the day and wear UV protection during peak afternoon hours.
          </p>
        </div>
      </div>
    </div>
  );
}