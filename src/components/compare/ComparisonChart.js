"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatDay } from "../forecast/forecastUtils";

const metrics = [
  ["temperature", "Temperature"],
  ["humidity", "Humidity"],
  ["wind", "Wind speed"],
  ["rainfall", "Rainfall"],
];

function getDailyHumidity(weather, date) {
  const hourly = weather?.hourly;
  if (!Array.isArray(hourly?.time) || !Array.isArray(hourly?.relative_humidity_2m)) return null;
  const values = hourly.time
  .map((time, index) => typeof time === "string" && time.startsWith(date) ? hourly.relative_humidity_2m[index] : null)
    .filter(Number.isFinite);
  return values.length
    ? values.reduce((total, value) => total + value, 0) / values.length
    : null;
}

export default function ComparisonChart({
  cityA,
  cityB,
  weatherA,
  weatherB,
  tempUnit,
  windUnit = "km/h",
  precipitationUnit = "mm",
}) {
  const [metric, setMetric] = useState("temperature");
  const selectedCityA = cityA ?? {};
  const selectedCityB = cityB ?? {};
  const data = useMemo(() => {
    const dailyA = weatherA?.daily;
    const dailyB = weatherB?.daily;
    if (!Array.isArray(dailyA?.time) || !Array.isArray(dailyB?.time)) return [];

    return dailyA.time.slice(0, 7).flatMap((date, index) => {
      if (typeof date !== "string" || !Number.isFinite(Date.parse(`${date}T12:00:00Z`))) return [];
      const cityAValue = metric === "temperature" ? dailyA.temperature_2m_max?.[index]
        : metric === "rainfall" ? dailyA.precipitation_sum?.[index]
          : metric === "wind" ? dailyA.wind_speed_10m_max?.[index]
            : getDailyHumidity(weatherA, date);
      const cityBValue = metric === "temperature" ? dailyB.temperature_2m_max?.[index]
        : metric === "rainfall" ? dailyB.precipitation_sum?.[index]
          : metric === "wind" ? dailyB.wind_speed_10m_max?.[index]
            : getDailyHumidity(weatherB, date);
      return [{ date, cityA: Number.isFinite(cityAValue) ? cityAValue : null, cityB: Number.isFinite(cityBValue) ? cityBValue : null }];
    });
  }, [metric, weatherA, weatherB]);
  const unit = metric === "temperature" ? `°${tempUnit}`
    : metric === "humidity" ? "%"
      : metric === "rainfall" ? ` ${precipitationUnit}`
        : ` ${windUnit}`;

  return (
    <section className="compare-panel">
      <div className="compare-section-heading">
        <div><span className="compare-kicker">SIDE-BY-SIDE TRENDS</span><h2>7-day comparison</h2></div>
        <div className="compare-chart-tabs">
          {metrics.map(([value, label]) => <button type="button" className={metric === value ? "active" : ""} key={value} onClick={() => setMetric(value)}>{label}</button>)}
        </div>
      </div>
      <div className="compare-chart">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border-color)" strokeDasharray="3 5" />
              <XAxis dataKey="date" tickFormatter={(value) => formatDay(value, { weekday: "short" })} axisLine={false} tickLine={false} tick={{ fill: "var(--text-secondary)", fontSize: 10 }} />
              <YAxis tickFormatter={(value) => `${value}${unit}`} axisLine={false} tickLine={false} tick={{ fill: "var(--text-secondary)", fontSize: 10 }} />
              <Tooltip labelFormatter={(value) => formatDay(value)} formatter={(value) => [Number.isFinite(value) ? `${Math.round(value)}${unit}` : "—"]} contentStyle={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", borderRadius: 12, color: "var(--text-primary)" }} />
              <Legend />
              <Line type="monotone" dataKey="cityA" name={selectedCityA.name ?? "City one"} stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 3 }} connectNulls />
              <Line type="monotone" dataKey="cityB" name={selectedCityB.name ?? "City two"} stroke="#f97316" strokeWidth={2.5} dot={{ r: 3 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        ) : <p className="compare-empty">Waiting for both city forecasts.</p>}
      </div>
    </section>
  );
}
