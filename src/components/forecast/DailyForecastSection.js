import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";
import { formatDay, formatValue, getWeatherDetails, getWindDirection } from "./forecastUtils";

export default function DailyForecastSection({
  data,
  tempUnit,
  windUnit = "km/h",
  precipitationUnit = "mm",
}) {
  const forecast = Array.isArray(data) ? data.filter((day) => day && typeof day === "object") : [];
  return (
    <section className="forecast-panel">
      <div className="forecast-section-heading">
        <div>
          <span className="forecast-section-kicker">LOOKING AHEAD</span>
          <h2>16-day weather forecast</h2>
          <p className="forecast-section-description">
            Daily highs, lows, rain outlook and wind conditions.
          </p>
        </div>
        <span className="forecast-data-badge">{forecast.length} days</span>
      </div>
      <div className="forecast-daily-list">
        {forecast.map((day, index) => {
          const details = getWeatherDetails(day.weatherCode);
          const WeatherIcon = details.Icon;
          return (
            <article
              key={day.date ?? index}
              className="forecast-daily-row"
              style={{ "--item-index": index }}
            >
              <div className="forecast-day-name">
                <strong>{index === 0 ? "Today" : formatDay(day.date, { weekday: "short" })}</strong>
                <span>{formatDay(day.date, { month: "short", day: "numeric" })}</span>
              </div>
              <WeatherIcon size={25} color={details.color} className="forecast-weather-icon" />
              <span className="forecast-day-condition">{details.label}</span>
              <div className="forecast-day-temps">
                <span className="forecast-low">
                  <ArrowDown size={13} /> {formatValue(day.minTemperature, `°${tempUnit}`)}
                </span>
                <div className="forecast-temp-track"><span /></div>
                <span className="forecast-high">
                  <ArrowUp size={13} /> {formatValue(day.maxTemperature, `°${tempUnit}`)}
                </span>
              </div>
              <span className="forecast-day-rain">
                <Droplets size={14} /> {formatValue(day.rainProbability, "%")}
                <small>{formatValue(day.rainfall, ` ${precipitationUnit}`, 1)}</small>
              </span>
              <span className="forecast-day-wind">
                <Wind size={14} /> {formatValue(day.windSpeed, ` ${windUnit}`)}
                <small>{getWindDirection(day.windDirection)}</small>
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
