"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { ArrowLeftRight, Droplets, Eye, Gauge, Thermometer, Wind } from "lucide-react";
import { useClientReady } from "../../app/utils/useClientReady";
import { useGetAirQualityQuery, useGetWeatherDataQuery } from "../../app/store/weatherApiSlice";
import CityPicker from "./CityPicker";
import ComparisonChart from "./ComparisonChart";
import ComparisonInsights from "./ComparisonInsights";
import { getWeatherDetails, formatValue } from "../forecast/forecastUtils";
import { getAqiCategory } from "../airQuality/airQualityUtils";
import "./ComparePage.css";

const secondaryCity = { name: "London", country: "United Kingdom", latitude: 51.5072, longitude: -0.1276 };

function CityConditions({ city, weather, airQuality, unit }) {
  if (!city || typeof city !== "object") return null;
  const current = weather?.current;
  const airCurrent = airQuality?.current;
  const details = getWeatherDetails(current?.weather_code);
  const Icon = details.Icon;
  const aqiCategory = getAqiCategory(airCurrent?.us_aqi);
  const rows = [
    [Thermometer, "Feels like", formatValue(current?.apparent_temperature, `°${unit}`)],
    [Droplets, "Humidity", formatValue(current?.relative_humidity_2m, "%")],
    [Wind, "Wind speed", formatValue(current?.wind_speed_10m, ` ${weather?.current_units?.wind_speed_10m || "km/h"}`)],
    [Gauge, "Pressure", formatValue(current?.surface_pressure, " hPa")],
    [Eye, "Visibility", formatValue(current?.visibility == null ? null : current.visibility / 1000, " km", 1)],
    [Droplets, "PM2.5", formatValue(airCurrent?.pm2_5, " µg/m³", 1)],
    [Wind, "PM10", formatValue(airCurrent?.pm10, " µg/m³", 1)],
  ];

  return (
    <article className="compare-city-card">
      <div className="compare-city-card-head">
        <div><span className="compare-kicker">CURRENT CONDITIONS</span><h2>{city.name}</h2><small>{city.country}</small></div>
        <Icon size={34} color={details.color} />
      </div>
      <div className="compare-main-reading">
        <strong>{formatValue(current?.temperature_2m, `°${unit}`)}</strong>
        <span>{details.label}</span>
        <span className="compare-aqi"><i style={{ backgroundColor: aqiCategory.color }} />AQI {airCurrent?.us_aqi ?? "—"} · {aqiCategory.label}</span>
      </div>
      <div className="compare-condition-list">
        {rows.map(([RowIcon, label, value]) => <div key={label}><RowIcon size={14} /><span>{label}</span><strong>{value}</strong></div>)}
      </div>
    </article>
  );
}

export default function ComparePage() {
  const selectedLocation = useSelector((state) => state.preferences.selectedLocation);
  const preferencesHydrated = useSelector((state) => state.preferences.hydrated);
  const tempUnit = useSelector((state) => state.preferences.temperatureUnit);
  const windSpeedUnit = useSelector((state) => state.preferences.windSpeedUnit);
  const precipitationUnit = useSelector((state) => state.preferences.precipitationUnit);
  const refreshInterval = useSelector((state) => state.preferences.refreshInterval);
  const clientReady = useClientReady();
  const ready = clientReady && preferencesHydrated;
  const [cityA, setCityA] = useState(null);
  const [cityB, setCityB] = useState(secondaryCity);
  const cityOne = cityA ?? selectedLocation;
  const hasCityOne = Number.isFinite(cityOne?.latitude) && cityOne.latitude >= -90 && cityOne.latitude <= 90 &&
    Number.isFinite(cityOne?.longitude) && cityOne.longitude >= -180 && cityOne.longitude <= 180;
  const hasCityTwo = Number.isFinite(cityB?.latitude) && cityB.latitude >= -90 && cityB.latitude <= 90 &&
    Number.isFinite(cityB?.longitude) && cityB.longitude >= -180 && cityB.longitude <= 180;
  const queryOptions = { unit: tempUnit, windSpeedUnit, precipitationUnit };
  const { data: weatherA } = useGetWeatherDataQuery(
    { ...queryOptions, latitude: cityOne?.latitude, longitude: cityOne?.longitude },
    { pollingInterval: refreshInterval, skip: !hasCityOne },
  );
  const { data: weatherB } = useGetWeatherDataQuery(
    { ...queryOptions, latitude: cityB?.latitude, longitude: cityB?.longitude },
    { pollingInterval: refreshInterval, skip: !hasCityTwo },
  );
  const { data: airA } = useGetAirQualityQuery(
    { latitude: cityOne?.latitude, longitude: cityOne?.longitude },
    { pollingInterval: refreshInterval, skip: !hasCityOne },
  );
  const { data: airB } = useGetAirQualityQuery(
    { latitude: cityB?.latitude, longitude: cityB?.longitude },
    { pollingInterval: refreshInterval, skip: !hasCityTwo },
  );

  const swapCities = () => {
    setCityA(cityB);
    setCityB(cityOne);
  };

  return (
    <main className="dashboard-main compare-main">
      {!ready ? (
        <div className="compare-panel" role="status">Preparing your city comparison…</div>
      ) : (
      <div className="compare-page">
            <section className="compare-hero">
              <span className="compare-kicker">WEATHER SIDE BY SIDE</span>
              <h1>Compare cities</h1>
              <p>Compare today&apos;s conditions, air quality and the week ahead.</p>
            </section>
            <section className="compare-pickers">
              <CityPicker label="CITY ONE" city={cityOne} onChange={setCityA} />
              <button type="button" className="compare-swap" aria-label="Swap cities" onClick={swapCities}><ArrowLeftRight size={19} /></button>
              <CityPicker label="CITY TWO" city={cityB} onChange={setCityB} />
            </section>
            <section className="compare-city-grid">
              <CityConditions city={cityOne} weather={weatherA} airQuality={airA} unit={tempUnit} />
              <CityConditions city={cityB} weather={weatherB} airQuality={airB} unit={tempUnit} />
            </section>
            <ComparisonChart
              cityA={cityOne}
              cityB={cityB}
              weatherA={weatherA}
              weatherB={weatherB}
              tempUnit={tempUnit}
              windUnit={weatherA?.current_units?.wind_speed_10m}
              precipitationUnit={weatherA?.daily_units?.precipitation_sum}
            />
            <ComparisonInsights
              cityA={cityOne}
              cityB={cityB}
              weatherA={weatherA}
              weatherB={weatherB}
              airA={airA}
              airB={airB}
              windUnit={weatherA?.current_units?.wind_speed_10m}
              precipitationUnit={weatherA?.daily_units?.precipitation_sum}
            />
            <section className="compare-panel">
              <div className="compare-section-heading"><div><span className="compare-kicker">THE WEEK AHEAD</span><h2>7-day forecast comparison</h2></div></div>
              <div className="compare-forecast-grid">
                {[{ city: cityOne, weather: weatherA }, { city: cityB, weather: weatherB }].map(({ city, weather }, cityIndex) => (
                  <div key={city?.name ?? cityIndex} className="compare-forecast-city">
                    <h3>{city?.name ?? "Select a city"}</h3>
                    {(Array.isArray(weather?.daily?.time) ? weather.daily.time : []).slice(0, 7).map((date, index) => {
                      if (typeof date !== "string" || !Number.isFinite(Date.parse(`${date}T12:00:00Z`))) return null;
                      const details = getWeatherDetails(weather?.daily?.weather_code?.[index]);
                      const DayIcon = details.Icon;
                      return <div key={date}><span>{new Date(`${date}T12:00:00Z`).toLocaleDateString("en", { weekday: "short", timeZone: "UTC" })}</span><DayIcon size={18} color={details.color} /><span>{formatValue(weather?.daily?.temperature_2m_min?.[index], `°${tempUnit}`)} / {formatValue(weather?.daily?.temperature_2m_max?.[index], `°${tempUnit}`)}</span><small><Droplets size={12} /> {formatValue(weather?.daily?.precipitation_probability_max?.[index], "%")}</small></div>;
                    })}
                  </div>
                ))}
              </div>
            </section>
      </div>
      )}
    </main>
  );
}
