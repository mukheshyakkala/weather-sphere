// src/app/page.js
"use client";

import { useSelector } from "react-redux";
import { useGetWeatherDataQuery } from "../app/store/weatherApiSlice";
import { useClientReady } from "./utils/useClientReady";

// Dashboard Feature Components
import CurrentWeather from "../components/dashboard/currentWeather/CurrentWeather";
import Highlights from "../components/dashboard/highlights/Highlights";
import HourlyForecast from "../components/dashboard/hourlyForecast/HourlyForecast";
import WeeklyForecast from "../components/dashboard/weeklyForecast/WeeklyForecast";
import TempAnalytics from "../components/dashboard/tempAnalytics/TempAnalytics";
import SunSchedule from "../components/dashboard/sunSchedule/SunSchedule";
import AirQualitySummary from "../components/dashboard/airQualitySummary/AirQualitySummary";
import WeatherInsights from "../components/dashboard/weatherInsights/WeatherInsights";

export default function DashboardPage() {
  const selectedLocation = useSelector((state) => state.preferences.selectedLocation);
  const preferencesHydrated = useSelector((state) => state.preferences.hydrated);
  const tempUnit = useSelector((state) => state.preferences.temperatureUnit);
  const windSpeedUnit = useSelector((state) => state.preferences.windSpeedUnit);
  const precipitationUnit = useSelector((state) => state.preferences.precipitationUnit);
  const refreshInterval = useSelector((state) => state.preferences.refreshInterval);
  const clientReady = useClientReady();

  const { currentData: weather, isLoading, isError } = useGetWeatherDataQuery({
    latitude: selectedLocation?.latitude,
    longitude: selectedLocation?.longitude,
    unit: tempUnit,
    windSpeedUnit,
    precipitationUnit,
  }, {
    skip: !Number.isFinite(selectedLocation?.latitude) || !Number.isFinite(selectedLocation?.longitude),
    pollingInterval: refreshInterval,
  });

  return (
    <main className="dashboard-main">
      {!clientReady && (
        <div style={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }} role="status">
          <p>Loading WeatherSphere…</p>
        </div>
      )}

      {clientReady && preferencesHydrated && isLoading && (
        <div style={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p>Loading WeatherSphere Intelligence Data...</p>
        </div>
      )}

      {clientReady && preferencesHydrated && isError && (
        <div style={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center", color: "#f87171" }}>
          <p>Failed to load weather data. Please check your network connection.</p>
        </div>
      )}

      {clientReady && preferencesHydrated && !isLoading && !isError && weather && (
        <div className="dashboard-grid">
          {/* 1. Current Weather */}
          <div className="col-4">
            <CurrentWeather weather={weather} location={selectedLocation} />
          </div>

          {/* 2. Today's Highlights */}
          <div className="col-8">
            <Highlights weather={weather} />
          </div>

          {/* 3. Hourly Forecast */}
          <div className="col-12">
            <HourlyForecast
              hourly={weather.hourly}
              tempUnit={tempUnit}
              windUnit={weather.hourly_units?.wind_speed_10m}
            />
          </div>

          {/* 4. Weekly Forecast & 5. Temperature Analytics */}
          <div className="col-6">
            <WeeklyForecast daily={weather.daily} />
          </div>
          <div className="col-6">
            <TempAnalytics hourly={weather.hourly} tempUnit={tempUnit} />
          </div>

          {/* 6. Sunrise & Sunset & 7. Air Quality Summary */}
          <div className="col-6">
            <SunSchedule daily={weather.daily} />
          </div>
          <div className="col-6">
            <AirQualitySummary />
          </div>

          {/* 8. Weather Insights */}
          <div className="col-12">
            <WeatherInsights weather={weather} />
          </div>
        </div>
      )}
    </main>
  );
}