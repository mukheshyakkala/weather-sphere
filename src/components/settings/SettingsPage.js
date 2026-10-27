"use client";

import { Palette, SlidersHorizontal, Thermometer, Wind } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useClientReady } from "../../app/utils/useClientReady";
import {
  setDefaultForecastView,
  setPrecipitationUnit,
  setRefreshInterval,
  setTemperatureUnit,
  setTheme,
  setWindSpeedUnit,
} from "../../app/store/preferencesSlice";
import SettingsOptionGroup from "./SettingsOptionGroup";
import LocationSettings from "./LocationSettings";
import NotificationSettings from "./NotificationSettings";
import DataManagement from "./DataManagement";
import "./SettingsPage.css";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const preferences = useSelector((state) => state.preferences);
  const clientReady = useClientReady();

  return (
    <main className="dashboard-main settings-main">
      {!clientReady || !preferences.hydrated ? (
        <p className="settings-note" role="status">Loading your preferences…</p>
      ) : (
      <div className="settings-page">
            <section className="settings-hero">
              <span><SlidersHorizontal size={15} /> PERSONALIZE YOUR EXPERIENCE</span>
              <h1>Settings</h1>
              <p>Your preferences are saved on this device and used across your weather pages.</p>
            </section>
            <section className="settings-card">
              <div className="settings-card-heading"><Palette size={19} /><div><h2>Appearance</h2><p>Choose the look that feels right.</p></div></div>
              <SettingsOptionGroup title="Theme" description="System follows your device appearance." value={preferences.theme} options={[["light", "Light"], ["dark", "Dark"], ["system", "System"]]} onChange={(value) => dispatch(setTheme(value))} />
            </section>
            <section className="settings-card">
              <div className="settings-card-heading"><Thermometer size={19} /><div><h2>Measurement units</h2><p>Units update weather readings across the app.</p></div></div>
              <SettingsOptionGroup title="Temperature" description="Used for current conditions and forecast charts." value={preferences.temperatureUnit} options={[["C", "Celsius · °C"], ["F", "Fahrenheit · °F"]]} onChange={(value) => dispatch(setTemperatureUnit(value))} />
              <SettingsOptionGroup title="Wind speed" description="Used for forecast and location weather details." value={preferences.windSpeedUnit} options={[["kmh", "km/h"], ["mph", "mph"], ["ms", "m/s"]]} onChange={(value) => dispatch(setWindSpeedUnit(value))} />
              <SettingsOptionGroup title="Precipitation" description="Used for expected rainfall totals." value={preferences.precipitationUnit} options={[["mm", "Millimeters · mm"], ["inch", "Inches · in"]]} onChange={(value) => dispatch(setPrecipitationUnit(value))} />
            </section>
            <LocationSettings />
            <NotificationSettings />
            <section className="settings-card">
              <div className="settings-card-heading"><Wind size={19} /><div><h2>Application preferences</h2><p>Choose the forecast view to open by default.</p></div></div>
              <SettingsOptionGroup title="Default forecast view" description="You can switch views anytime on the Forecast page." value={preferences.defaultForecastView} options={[["hourly", "Hourly"], ["daily", "Daily"]]} onChange={(value) => dispatch(setDefaultForecastView(value))} />
              <SettingsOptionGroup
                title="Weather refresh"
                description="Choose how often open weather panels refresh automatically."
                value={preferences.refreshInterval}
                options={[[0, "Manual"], [300000, "5 min"], [900000, "15 min"], [1800000, "30 min"]]}
                onChange={(value) => dispatch(setRefreshInterval(Number(value)))}
              />
              <div className="settings-language-row"><span>Language</span><strong>English</strong><small>English is currently the only available language.</small></div>
            </section>
            <DataManagement />
      </div>
      )}
    </main>
  );
}
