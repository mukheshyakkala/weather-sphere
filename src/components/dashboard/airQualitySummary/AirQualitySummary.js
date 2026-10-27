"use client";

import { Wind, ShieldAlert } from "lucide-react";
import { useSelector } from "react-redux";
import { useGetAirQualityQuery } from "../../../app/store/weatherApiSlice";
import "./AirQualitySummary.css";

export default function AirQualitySummary() {
  const location = useSelector((state) => state.preferences.selectedLocation);
  const refreshInterval = useSelector((state) => state.preferences.refreshInterval);
  const { data, isLoading, isError } = useGetAirQualityQuery(
    { latitude: location?.latitude, longitude: location?.longitude },
    {
      skip: !Number.isFinite(location?.latitude) || !Number.isFinite(location?.longitude),
      pollingInterval: refreshInterval,
    }
  );
  const aqiValue = data?.current?.us_aqi;

  const getAQICategory = (aqi) => {
    if (!Number.isFinite(aqi)) {
      return {
        category: "Unavailable",
        color: "var(--text-secondary)",
        bg: "var(--bg-secondary)",
        tip: "Current air quality data is unavailable.",
      };
    }
    if (aqi <= 50) return { category: "Good", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)", tip: "Air quality is satisfactory. Enjoy outdoor activities!" };
    if (aqi <= 100) return { category: "Moderate", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)", tip: "Air quality is acceptable; sensitive individuals should take precautions." };
    if (aqi <= 150) return { category: "Unhealthy for Sensitive Groups", color: "#f97316", bg: "rgba(249, 115, 22, 0.15)", tip: "Sensitive groups should reduce prolonged outdoor exertion." };
    if (aqi <= 200) return { category: "Unhealthy", color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)", tip: "Consider reducing prolonged outdoor exertion." };
    if (aqi <= 300) return { category: "Very Unhealthy", color: "#a855f7", bg: "rgba(168, 85, 247, 0.15)", tip: "Avoid prolonged outdoor exertion and limit time outside." };
    return { category: "Hazardous", color: "#7f1d1d", bg: "rgba(127, 29, 29, 0.2)", tip: "Avoid outdoor activity and follow local health guidance." };
  };

  const status = getAQICategory(aqiValue);

  return (
    <div className="aqi-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Air Quality Summary</h3>
        <Wind size={20} color="var(--accent-color)" />
      </div>

      <div className="aqi-main-card">
        <div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Current AQI Index</p>
          <p style={{ fontSize: "2rem", fontWeight: "900", lineHeight: 1, marginTop: "4px" }}>
            {isLoading ? "…" : isError ? "—" : Number.isFinite(aqiValue) ? Math.round(aqiValue) : "—"}
          </p>
        </div>
        <span className="aqi-badge" style={{ backgroundColor: status.bg, color: status.color }}>
          {status.category}
        </span>
      </div>

      <div className="aqi-recommendation">
        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "4px" }}>
          <ShieldAlert size={14} color={status.color} /> Health Recommendation
        </span>
        {isError ? "Unable to load air quality data. Please try again later." : status.tip}
      </div>

      {/* <button className="aqi-btn">View Detailed Air Quality →</button> */}
    </div>
  );
}