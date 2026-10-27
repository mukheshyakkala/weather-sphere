import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDay, formatHour } from "./forecastUtils";

export default function ForecastChart({
  data,
  metric,
  view,
  tempUnit,
  windUnit = "km/h",
  precipitationUnit = "mm",
}) {
  const chartData = Array.isArray(data) ? data : [];
  const isHourly = view === "hourly";
  const xKey = isHourly ? "time" : "date";
  const xLabel = (value) => isHourly
    ? formatHour(value)
    : formatDay(value, { month: "short", day: "numeric" });
  const primaryKey = metric === "rain"
    ? "rainProbability"
    : metric === "wind"
      ? "windSpeed"
      : isHourly ? "temperature" : "maxTemperature";
  const secondaryKey = metric === "temperature"
    ? isHourly ? "feelsLike" : "minTemperature"
    : metric === "rain" ? "rainfall" : "windGusts";
  const primaryColor = metric === "wind" ? "#a78bfa" : "#38bdf8";
  const secondaryColor = metric === "rain" ? "#2dd4bf" : "#fbbf24";
  const yFormatter = (value) => metric === "temperature"
    ? `${value}°`
    : metric === "rain"
      ? `${value}%`
      : `${value} ${windUnit}`;

  return (
    <div className="forecast-chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="forecast-primary-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={primaryColor} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border-color)" strokeDasharray="3 5" />
          <XAxis
            dataKey={xKey}
            tickFormatter={xLabel}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--text-secondary)", fontSize: 10 }}
            tickMargin={10}
            minTickGap={24}
          />
          <YAxis
            yAxisId="primary"
            width={48}
            tickFormatter={yFormatter}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--text-secondary)", fontSize: 10 }}
          />
          {metric === "rain" && (
            <YAxis
              yAxisId="secondary"
              orientation="right"
              width={42}
              tickFormatter={(value) => `${value} ${precipitationUnit}`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-secondary)", fontSize: 10 }}
            />
          )}
          <Tooltip
            labelFormatter={(value) => isHourly
              ? `${formatHour(value)} · ${formatDay(typeof value === "string" ? value.slice(0, 10) : "")}`
              : formatDay(value)}
            formatter={(value, name) => {
              if (!Number.isFinite(value)) return ["—", name];
              if (metric === "temperature") return [`${Math.round(value)}°${tempUnit}`, name];
              if (metric === "rain") return [name === "Rainfall" ? `${value} ${precipitationUnit}` : `${value}%`, name];
              return [`${Math.round(value)} ${windUnit}`, name];
            }}
            contentStyle={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
              borderRadius: "12px",
              color: "var(--text-primary)",
              boxShadow: "0 8px 24px var(--shadow-color)",
            }}
            labelStyle={{ color: "var(--text-secondary)", marginBottom: 4 }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            height={30}
            wrapperStyle={{ fontSize: 11, color: "var(--text-secondary)" }}
          />
          <Area
            yAxisId="primary"
            type="monotone"
            dataKey={primaryKey}
            name={metric === "temperature"
              ? isHourly ? "Temperature" : "High"
              : metric === "rain" ? "Rain chance" : "Wind speed"}
            stroke={primaryColor}
            strokeWidth={2.5}
            fill="url(#forecast-primary-fill)"
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Area
            yAxisId={metric === "rain" ? "secondary" : "primary"}
            type="monotone"
            dataKey={secondaryKey}
            name={metric === "temperature"
              ? isHourly ? "Feels like" : "Low"
              : metric === "rain" ? "Rainfall" : "Gusts"}
            stroke={secondaryColor}
            strokeWidth={2}
            fill="none"
            activeDot={{ r: 3, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
