import { getChartLabel } from "./forecastUtils";
import ForecastChart from "./ForecastChart";

export default function ForecastChartSection({
  data,
  metric,
  view,
  tempUnit,
  windUnit,
  precipitationUnit,
}) {
  const chartData = Array.isArray(data) ? data.filter((point) => point && typeof point === "object") : [];
  const activeView = view === "daily" ? "daily" : "hourly";
  return (
    <section className="forecast-panel">
      <div className="forecast-section-heading">
        <div>
          <span className="forecast-section-kicker">AT A GLANCE</span>
          <h2>{getChartLabel(metric, view)}</h2>
        </div>
        <span className="forecast-data-badge">
          {activeView === "hourly" ? `${chartData.length} hourly points` : `${chartData.length} days`}
        </span>
      </div>
      {chartData.length ? (
        <ForecastChart
          data={chartData}
          metric={metric}
          view={activeView}
          tempUnit={tempUnit}
          windUnit={windUnit}
          precipitationUnit={precipitationUnit}
        />
      ) : (
        <p className="forecast-empty">No readings available for the selected date.</p>
      )}
    </section>
  );
}
