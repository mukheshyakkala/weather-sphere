"use client";

import { Sunrise, Sunset, SunMedium } from "lucide-react";
import "./SunSchedule.css";

export default function SunSchedule({ daily }) {
  const sunriseStr = daily?.sunrise?.[0];
  const sunsetStr = daily?.sunset?.[0];

  const formatTime = (isoString) => {
    if (!isoString || !Number.isFinite(Date.parse(isoString))) return "--:--";
    return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Calculate daylight duration
  let daylightHours = 0;
  let daylightMinutes = 0;
  let hasDaylightDuration = false;
  if (sunriseStr && sunsetStr && Number.isFinite(Date.parse(sunriseStr)) && Number.isFinite(Date.parse(sunsetStr))) {
    const diffMs = new Date(sunsetStr) - new Date(sunriseStr);
    if (diffMs >= 0) {
      hasDaylightDuration = true;
      daylightHours = Math.floor(diffMs / (1000 * 60 * 60));
      daylightMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    }
  }

  return (
    <div className="sun-container">
      <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Sunrise & Sunset</h3>
      <div className="sun-grid">
        <div className="sun-card">
          <div style={{ padding: "10px", backgroundColor: "rgba(251, 191, 36, 0.15)", borderRadius: "12px" }}>
            <Sunrise size={22} color="#fbbf24" />
          </div>
          <div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Sunrise</p>
            <p style={{ fontSize: "1.1rem", fontWeight: "800", marginTop: "2px" }}>{formatTime(sunriseStr)}</p>
          </div>
        </div>

        <div className="sun-card">
          <div style={{ padding: "10px", backgroundColor: "rgba(249, 115, 22, 0.15)", borderRadius: "12px" }}>
            <Sunset size={22} color="#f97316" />
          </div>
          <div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Sunset</p>
            <p style={{ fontSize: "1.1rem", fontWeight: "800", marginTop: "2px" }}>{formatTime(sunsetStr)}</p>
          </div>
        </div>
      </div>

      <div className="sun-daylight-banner">
        <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
          <SunMedium size={16} color="var(--accent-color)" /> Total Daylight Duration
        </span>
        <span style={{ fontWeight: "700" }}>{hasDaylightDuration ? `${daylightHours}h ${daylightMinutes}m` : "—"}</span>
      </div>
    </div>
  );
}