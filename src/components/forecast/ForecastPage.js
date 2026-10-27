"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTemperatureUnit } from "../../app/store/preferencesSlice";
import { useGetWeatherDataQuery } from "../../app/store/weatherApiSlice";
import { useClientReady } from "../../app/utils/useClientReady";
import ForecastOverview from "./ForecastOverview";
import ForecastFilters from "./ForecastFilters";
import ForecastChartSection from "./ForecastChartSection";
import HourlyForecastSection from "./HourlyForecastSection";
import DailyForecastSection from "./DailyForecastSection";
import { useForecastData } from "./useForecastData";
import "./ForecastPage.css";

export default function ForecastPage() {
  const dispatch = useDispatch();
  const selectedLocation = useSelector((state) => state.preferences.selectedLocation);
  const tempUnit = useSelector((state) => state.preferences.temperatureUnit);
  const windSpeedUnit = useSelector((state) => state.preferences.windSpeedUnit);
  const precipitationUnit = useSelector((state) => state.preferences.precipitationUnit);
  const defaultForecastView = useSelector((state) => state.preferences.defaultForecastView);
  const refreshInterval = useSelector((state) => state.preferences.refreshInterval);
  const preferencesHydrated = useSelector((state) => state.preferences.hydrated);
  const clientReady = useClientReady();
  const [view, setView] = useState(null);
  const [metric, setMetric] = useState("temperature");
  const [selectedDate, setSelectedDate] = useState("all");
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
  const { hourlyData, dailyData, chartData } = useForecastData(
    weather,
    view ?? defaultForecastView,
    selectedDate,
  );
  const activeView = view ?? defaultForecastView;
  const ready = clientReady && preferencesHydrated;

  return (
    <main className="dashboard-main forecast-main">
      {!ready && (
        <div className="forecast-state" role="status">Preparing your forecast…</div>
      )}
      {ready && isLoading && (
        <div className="forecast-state" role="status">Loading your forecast…</div>
      )}
      {ready && isError && (
        <div className="forecast-state forecast-error" role="alert">
          Forecast data could not be loaded. Please check your connection and try again.
        </div>
      )}
      {ready && weather && !isError && (
        <div className="forecast-page">
          <ForecastOverview
            weather={weather}
            location={selectedLocation}
            dailyData={dailyData}
            tempUnit={tempUnit}
          />
          <ForecastFilters
            view={activeView}
            metric={metric}
            selectedDate={selectedDate}
            dailyData={dailyData}
            tempUnit={tempUnit}
            onViewChange={setView}
            onMetricChange={setMetric}
            onDateChange={setSelectedDate}
            onUnitChange={(unit) => dispatch(setTemperatureUnit(unit))}
          />
          <ForecastChartSection
            data={chartData}
            metric={metric}
            view={activeView}
            tempUnit={tempUnit}
            windUnit={activeView === "hourly"
              ? weather.hourly_units?.wind_speed_10m
              : weather.daily_units?.wind_speed_10m_max}
            precipitationUnit={activeView === "hourly"
              ? weather.hourly_units?.precipitation
              : weather.daily_units?.precipitation_sum}
          />
          <HourlyForecastSection
            data={hourlyData}
            tempUnit={tempUnit}
            windUnit={weather.hourly_units?.wind_speed_10m}
          />
          <DailyForecastSection
            data={dailyData}
            tempUnit={tempUnit}
            windUnit={weather.daily_units?.wind_speed_10m_max}
            precipitationUnit={weather.daily_units?.precipitation_sum}
          />
        </div>
      )}
    </main>
  );
}
