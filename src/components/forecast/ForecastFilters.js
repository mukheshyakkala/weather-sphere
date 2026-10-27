import { formatDay } from "./forecastUtils";

const viewOptions = [
  ["hourly", "Hourly"],
  ["daily", "Daily"],
];

const metricOptions = [
  ["temperature", "Temperature"],
  ["rain", "Rainfall"],
  ["wind", "Wind"],
];

function Segment({ label, options, value, onChange, className = "" }) {
  return (
    <div className={`forecast-filter-group ${className}`}>
      <span className="forecast-filter-label">{label}</span>
      <div className={`forecast-segment ${label === "Temperature unit" ? "forecast-unit" : ""}`}>
        {options.map(([option, text]) => (
          <button
            key={option}
            type="button"
            className={value === option ? "selected" : ""}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ForecastFilters({
  view,
  metric,
  selectedDate,
  dailyData,
  tempUnit,
  onViewChange,
  onMetricChange,
  onDateChange,
  onUnitChange,
}) {
  const dates = Array.isArray(dailyData) ? dailyData.filter((day) => day && typeof day.date === "string") : [];
  return (
    <section className="forecast-filter-card" aria-label="Forecast filters">
      <Segment label="View" options={viewOptions} value={view} onChange={onViewChange} />
      <Segment label="Metric" options={metricOptions} value={metric} onChange={onMetricChange} />
      <label className="forecast-date-filter">
        <span className="forecast-filter-label">Date</span>
        <select value={selectedDate} onChange={(event) => onDateChange(event.target.value)}>
          <option value="all">All forecast dates</option>
          {dates.map((day, index) => (
            <option key={day?.date ?? index} value={day?.date ?? ""}>{formatDay(day?.date)}</option>
          ))}
        </select>
      </label>
      <Segment
        label="Temperature unit"
        options={[["C", "°C"], ["F", "°F"]]}
        value={tempUnit}
        onChange={onUnitChange}
      />
    </section>
  );
}
