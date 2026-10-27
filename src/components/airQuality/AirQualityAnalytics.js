"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatHour } from "../forecast/forecastUtils";

export default function AirQualityAnalytics({ hourly }) {
  const [metric, setMetric] = useState("us_aqi");
  const [range, setRange] = useState("hourly");
  const chartData = useMemo(() => {
    if (!Array.isArray(hourly?.time)) return [];
    const now = new Date();
    const readings = hourly.time.flatMap((time, index) => {
      if (typeof time !== "string" || !Number.isFinite(Date.parse(time))) return [];
      return [{
        time,
        us_aqi: hourly.us_aqi?.[index],
        pm2_5: hourly.pm2_5?.[index],
        pm10: hourly.pm10?.[index],
        carbon_monoxide: hourly.carbon_monoxide?.[index],
        nitrogen_dioxide: hourly.nitrogen_dioxide?.[index],
        sulphur_dioxide: hourly.sulphur_dioxide?.[index],
        ozone: hourly.ozone?.[index],
      }];
    }).filter((reading) => Date.parse(reading.time) >= now.getTime());
    if (range === "hourly") return readings.slice(0, 48);

    const dailyReadings = new Map();
    readings.forEach((reading) => {
      const date = reading.time.slice(0, 10);
      const current = dailyReadings.get(date) || { time: date, values: [], total: 0 };
      if (typeof metric === "string" && Number.isFinite(reading[metric])) {
        current.values.push(reading[metric]);
        current.total += reading[metric];
      }
      dailyReadings.set(date, current);
    });

    return [...dailyReadings.values()].map(({ time, values, total }) => ({
      time,
      [metric]: values.length ? total / values.length : null,
    }));
  }, [hourly, metric, range]);

  return (
    <section className="air-panel">
      <div className="air-section-heading air-analytics-heading">
        <div><span className="air-kicker">5-DAY OUTLOOK</span><h2>Air quality analytics</h2></div>
        <div className="air-chart-controls">
          <div className="air-chart-tabs" aria-label="Chart period">
            {[["hourly", "Hourly"], ["daily", "Daily"]].map(([value, label]) => (
              <button key={value} type="button" className={range === value ? "active" : ""} onClick={() => setRange(value)}>{label}</button>
            ))}
          </div>
          <div className="air-chart-tabs air-pollutant-tabs" aria-label="Pollutant chart selection">
            {[
              ["us_aqi", "AQI"],
              ["pm2_5", "PM2.5"],
              ["pm10", "PM10"],
              ["carbon_monoxide", "CO"],
              ["nitrogen_dioxide", "NO₂"],
              ["sulphur_dioxide", "SO₂"],
              ["ozone", "O₃"],
            ].map(([value, label]) => (
              <button key={value} type="button" className={metric === value ? "active" : ""} onClick={() => setMetric(value)}>{label}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="air-chart">
        {chartData.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs><linearGradient id="air-chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#34d399" stopOpacity={0.3} /><stop offset="100%" stopColor="#34d399" stopOpacity={0.02} /></linearGradient></defs>
              <CartesianGrid vertical={false} stroke="var(--border-color)" strokeDasharray="3 5" />
              <XAxis dataKey="time" tickFormatter={(value) => range === "hourly" ? formatHour(value) : new Date(`${value}T12:00:00Z`).toLocaleDateString("en", { month: "short", day: "numeric", timeZone: "UTC" })} minTickGap={28} axisLine={false} tickLine={false} tick={{ fill: "var(--text-secondary)", fontSize: 10 }} />
              <YAxis width={44} axisLine={false} tickLine={false} tick={{ fill: "var(--text-secondary)", fontSize: 10 }} />
              <Tooltip labelFormatter={(value) => range === "hourly" ? new Date(value).toLocaleString() : new Date(`${value}T12:00:00Z`).toLocaleDateString()} contentStyle={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", borderRadius: 12, color: "var(--text-primary)" }} />
              <Area type="monotone" dataKey={metric} name={metric === "us_aqi" ? "US AQI" : metric.toUpperCase()} stroke="#34d399" strokeWidth={2.5} fill="url(#air-chart-fill)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : <p className="air-no-chart">Forecast measurements are currently unavailable.</p>}
      </div>
      <p className="air-chart-caption">{range === "hourly" ? "Hourly forecast · Next 48 hours" : "Daily averages · Air quality forecast · Model estimates"}</p>
    </section>
  );
}
