// src/components/dashboard/TempAnalytics.js
"use client";

import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowDown, ArrowUp, ThermometerSun } from "lucide-react";
import "./TempAnalytics.css";

function formatHour(hour) {
  const normalizedHour = Number(hour);
  const period = normalizedHour >= 12 ? "PM" : "AM";
  const displayHour = normalizedHour % 12 || 12;

  return `${displayHour} ${period}`;
}

export default function TempAnalytics({ hourly, tempUnit = "C" }) {
  if (!Array.isArray(hourly?.time) || !Array.isArray(hourly?.temperature_2m)) return null;

  const data = hourly.time.slice(0, 24).flatMap((time, index) => {
    const temperature = hourly.temperature_2m?.[index];
    if (typeof time !== "string" || !Number.isFinite(Date.parse(time))) return [];
    const hour = Number(time.slice(11, 13));

    if (!Number.isFinite(temperature) || !Number.isFinite(hour)) return [];

    return [{ hour, temperature: Math.round(temperature) }];
  });

  if (!data.length) return null;

  const temperatures = data.map((item) => item.temperature);
  const high = Math.max(...temperatures);
  const low = Math.min(...temperatures);
  const average = Math.round(
    temperatures.reduce((total, temperature) => total + temperature, 0) /
      temperatures.length,
  );

  return (
    <div className="analytics-card">
      <div className="analytics-header">
        <div>
          <h3>Temperature Analytics</h3>
          <p>Hourly temperature throughout the day</p>
        </div>
        <span className="analytics-period">24 HOURS</span>
      </div>

      <div className="analytics-stats" aria-label="Daily temperature summary">
        <div className="analytics-stat">
          <span className="analytics-stat-label">High</span>
          <span className="analytics-stat-value analytics-high">
            <ArrowUp size={15} aria-hidden="true" />
            {high}°{tempUnit}
          </span>
        </div>
        <div className="analytics-stat">
          <span className="analytics-stat-label">Average</span>
          <span className="analytics-stat-value">
            <ThermometerSun size={15} aria-hidden="true" />
            {average}°{tempUnit}
          </span>
        </div>
        <div className="analytics-stat">
          <span className="analytics-stat-label">Low</span>
          <span className="analytics-stat-value analytics-low">
            <ArrowDown size={15} aria-hidden="true" />
            {low}°{tempUnit}
          </span>
        </div>
      </div>

      <div className="analytics-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 8, left: -18, bottom: 0 }}
            accessibilityLayer
          >
            <defs>
              <linearGradient id="temperature-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-color)" stopOpacity={0.32} />
                <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="var(--border-color)"
              strokeDasharray="3 5"
            />
            <XAxis
              dataKey="hour"
              type="number"
              domain={[0, 23]}
              ticks={[0, 3, 6, 9, 12, 15, 18, 21]}
              tickFormatter={formatHour}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
              tickMargin={10}
              interval={0}
            />
            <YAxis
              width={42}
              domain={["dataMin - 2", "dataMax + 2"]}
              tickFormatter={(temperature) => `${temperature}°`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
            />
            <Tooltip
              labelFormatter={(hour) => formatHour(hour)}
              formatter={(temperature) => [
                `${temperature}°${tempUnit}`,
                "Temperature",
              ]}
              contentStyle={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
                borderRadius: "12px",
                color: "var(--text-primary)",
                boxShadow: "0 8px 24px var(--shadow-color)",
              }}
              labelStyle={{ color: "var(--text-secondary)", marginBottom: 4 }}
            />
            <Area
              type="monotone"
              dataKey="temperature"
              stroke="var(--accent-color)"
              strokeWidth={3}
              fill="url(#temperature-fill)"
              activeDot={{ r: 5, strokeWidth: 0, fill: "var(--accent-color)" }}
              name="Temperature"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="analytics-footnote">
        {data.length} hourly readings · {formatHour(data[0].hour)}–{formatHour(data[data.length - 1].hour)}
      </p>
    </div>
  );
}