"use client";

import { ArrowRight, Droplets, Heart, MapPin, Wind } from "lucide-react";
import { useSelector } from "react-redux";
import { useGetAirQualityQuery, useGetWeatherDataQuery } from "../../app/store/weatherApiSlice";
import { formatValue, getWeatherDetails } from "../forecast/forecastUtils";

export default function FavoriteCityCard({ city, isDefault, onRemove, onDefault, onNavigate }) {
  const unit = useSelector((state) => state.preferences.temperatureUnit);
  const windSpeedUnit = useSelector((state) => state.preferences.windSpeedUnit);
  const precipitationUnit = useSelector((state) => state.preferences.precipitationUnit);
  const refreshInterval = useSelector((state) => state.preferences.refreshInterval);
  const { data } = useGetWeatherDataQuery({
    latitude: city?.latitude,
    longitude: city?.longitude,
    unit,
    windSpeedUnit,
    precipitationUnit,
  }, {
    skip: !Number.isFinite(city?.latitude) || city.latitude < -90 || city.latitude > 90 ||
      !Number.isFinite(city?.longitude) || city.longitude < -180 || city.longitude > 180,
    pollingInterval: refreshInterval,
  });
  const { data: air } = useGetAirQualityQuery(
    { latitude: city?.latitude, longitude: city?.longitude },
    {
      skip: !Number.isFinite(city?.latitude) || city.latitude < -90 || city.latitude > 90 ||
        !Number.isFinite(city?.longitude) || city.longitude < -180 || city.longitude > 180,
      pollingInterval: refreshInterval,
    },
  );
  if (!city || !Number.isFinite(city.latitude) || city.latitude < -90 || city.latitude > 90 ||
      !Number.isFinite(city.longitude) || city.longitude < -180 || city.longitude > 180) return null;
  const details = getWeatherDetails(data?.current?.weather_code);
  const Icon = details.Icon;

  return (
    <article className="favorite-card">
      <div className="favorite-card-head">
        <div><span className="favorite-city-name"><MapPin size={14} />{city.name}</span><small>{city.country}</small></div>
        <button className="favorite-remove" type="button" aria-label={`Remove ${city.name} from favorites`} onClick={() => onRemove(city)}><Heart size={17} fill="currentColor" /></button>
      </div>
      <div className="favorite-current">
        <Icon size={34} color={details.color} />
        <strong>{formatValue(data?.current?.temperature_2m, `°${unit}`)}</strong>
        <span>{details.label}</span>
      </div>
      <div className="favorite-metrics">
        <span><Droplets size={14} />{formatValue(data?.current?.relative_humidity_2m, "%")}</span>
        <span><Wind size={14} />{formatValue(data?.current?.wind_speed_10m, ` ${data?.current_units?.wind_speed_10m || "km/h"}`)}</span>
        <span className="favorite-aqi">AQI {air?.current?.us_aqi ?? "—"}</span>
      </div>
      <div className="favorite-card-actions">
        <button type="button" className={isDefault ? "is-default" : ""} onClick={() => onDefault(city)}>{isDefault ? "Default city" : "Set default"}</button>
        <button type="button" className="favorite-open" onClick={() => onNavigate(city, "/")}>Dashboard</button>
        <button type="button" className="favorite-open" onClick={() => onNavigate(city, "/forecast")}>Forecast <ArrowRight size={14} /></button>
        <button type="button" className="favorite-open" onClick={() => onNavigate(city, "/air-quality")}>Air quality</button>
      </div>
    </article>
  );
}
