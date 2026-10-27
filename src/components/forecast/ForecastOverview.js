import { CalendarDays, MapPin } from "lucide-react";
import { getWeatherDetails, formatDay } from "./forecastUtils";

export default function ForecastOverview({ weather, location, dailyData, tempUnit }) {
  const current = weather?.current;
  const details = getWeatherDetails(current?.weather_code);
  const WeatherIcon = details.Icon;
  const dates = Array.isArray(dailyData) ? dailyData : [];
  const dateRange = dates.length
    ? `${formatDay(dates[0]?.date, { month: "short", day: "numeric" })} – ${formatDay(dates[dates.length - 1]?.date, { month: "short", day: "numeric", year: "numeric" })}`
    : "Loading 16-day outlook";

  return (
    <section className="forecast-hero">
      <div className="forecast-hero-copy">
        <span className="forecast-eyebrow"><CalendarDays size={14} /> EXTENDED OUTLOOK</span>
        <h1>Forecast</h1>
        <p>Plan ahead with a clear view of the weather, hour by hour and day by day.</p>
        <div className="forecast-location">
          <MapPin size={16} />
          <span>{location?.name}{location?.country ? `, ${location.country}` : ""}</span>
        </div>
        <span className="forecast-date-range">{dateRange}</span>
      </div>
      <div className="forecast-current">
        <WeatherIcon className="forecast-current-icon" size={54} color={details.color} />
        <div>
          <span className="forecast-current-label">Right now · {details.label}</span>
          <div className="forecast-current-temp">
            {Number.isFinite(current?.temperature_2m) ? `${Math.round(current.temperature_2m)}°${tempUnit}` : "—"}
          </div>
          <span className="forecast-feels">
            Feels like {Number.isFinite(current?.apparent_temperature ?? current?.temperature_2m) ? `${Math.round(current?.apparent_temperature ?? current?.temperature_2m)}°${tempUnit}` : "—"}
          </span>
        </div>
      </div>
    </section>
  );
}
