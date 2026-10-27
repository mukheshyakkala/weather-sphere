"use client";

import { useSelector } from "react-redux";
import { useClientReady } from "../../app/utils/useClientReady";
import { useGetAirQualityQuery } from "../../app/store/weatherApiSlice";
import AirQualityOverview from "./AirQualityOverview";
import PollutantsPanel from "./PollutantsPanel";
import AirQualityAnalytics from "./AirQualityAnalytics";
import HealthRecommendations from "./HealthRecommendations";
import AqiCategories from "./AqiCategories";
import EnvironmentalInfo from "./EnvironmentalInfo";
import "./AirQualityPage.css";

export default function AirQualityPage() {
  const location = useSelector((state) => state.preferences.selectedLocation);
  const refreshInterval = useSelector((state) => state.preferences.refreshInterval);
  const preferencesHydrated = useSelector((state) => state.preferences.hydrated);
  const clientReady = useClientReady();
  const ready = clientReady && preferencesHydrated;
  const { currentData: data, isLoading, isError } = useGetAirQualityQuery({
    latitude: location?.latitude,
    longitude: location?.longitude,
  }, {
    skip: !Number.isFinite(location?.latitude) || !Number.isFinite(location?.longitude),
    pollingInterval: refreshInterval,
  });
  const aqi = data?.current?.us_aqi;

  return (
    <main className="dashboard-main air-page-main">
      <div className="air-page">
        {!ready && <p className="air-status" role="status">Preparing local air quality…</p>}
        {ready && <AirQualityOverview location={location} current={data?.current} timezone={data?.timezone} />}
        {ready && isLoading && <p className="air-status" role="status">Loading air quality readings…</p>}
        {ready && isError && <p className="air-status air-error" role="alert">Air quality data could not be loaded. Check your connection and try again.</p>}
        {ready && data && !isError && (
          <>
            <PollutantsPanel current={data.current} units={data.current_units} />
            <AirQualityAnalytics hourly={data.hourly} />
            <HealthRecommendations aqi={aqi} />
            <AqiCategories currentAqi={aqi} />
            <EnvironmentalInfo current={data.current} units={data.current_units} hourly={data.hourly} />
          </>
        )}
      </div>
    </main>
  );
}
