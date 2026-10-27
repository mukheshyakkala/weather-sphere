"use client";

import { useState, useSyncExternalStore } from "react";
import { Bell, CloudRain, ThermometerSun } from "lucide-react";

const STORAGE_KEY = "weather-sphere-notification-settings";
const defaultOptions = { alerts: true, rain: true, temperature: false };
const listeners = new Set();
let cachedOptions;

function getOptions() {
  if (cachedOptions) return cachedOptions;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    cachedOptions = parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? {
          alerts: typeof parsed.alerts === "boolean" ? parsed.alerts : defaultOptions.alerts,
          rain: typeof parsed.rain === "boolean" ? parsed.rain : defaultOptions.rain,
          temperature: typeof parsed.temperature === "boolean" ? parsed.temperature : defaultOptions.temperature,
        }
      : { ...defaultOptions };
  } catch (error) {
    console.error("Unable to read notification preferences.", error);
    cachedOptions = defaultOptions;
  }
  return cachedOptions;
}

function subscribe(listener) {
  listeners.add(listener);
  const handleStorage = (event) => {
    if (event.key !== STORAGE_KEY) return;
    cachedOptions = undefined;
    listener();
  };
  const resetOptions = () => {
    cachedOptions = defaultOptions;
    listener();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener("weather-sphere-notifications-reset", resetOptions);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("weather-sphere-notifications-reset", resetOptions);
  };
}

function saveOptions(nextOptions) {
  cachedOptions = {
    alerts: Boolean(nextOptions.alerts),
    rain: Boolean(nextOptions.rain),
    temperature: Boolean(nextOptions.temperature),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedOptions));
  } catch (error) {
    console.error("Unable to save notification preferences.", error);
  }
  listeners.forEach((listener) => listener());
}

export default function NotificationSettings() {
  const options = useSyncExternalStore(subscribe, getOptions, () => defaultOptions);
  const [permission, setPermission] = useState("Not requested");

  const toggle = async (key) => {
    if (!(key in defaultOptions)) return;
    if (typeof window !== "undefined" && "Notification" in window && !options[key] && Notification.permission === "default") {
      try {
        const granted = await Notification.requestPermission();
        setPermission(granted);
      } catch (error) {
        console.error("Unable to request notification permission.", error);
      }
    } else if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }

    saveOptions({ ...options, [key]: !options[key] });
  };

  const items = [
    [Bell, "Weather alerts", "Important changes to local conditions", "alerts"],
    [CloudRain, "Rain notifications", "Get notified about rain in your area", "rain"],
    [ThermometerSun, "Temperature alerts", "Unusually high or low temperatures", "temperature"],
  ];

  return (
    <section className="settings-card">
      <div className="settings-card-heading"><Bell size={19} /><div><h2>Notifications</h2><p>Choose the alerts you want to receive.</p></div></div>
      <div className="settings-toggle-list">
        {items.map(([Icon, label, description, key]) => (
          <div className="settings-toggle-row" key={key}>
            <Icon size={17} />
            <div><strong>{label}</strong><small>{description}</small></div>
            <button type="button" className={`settings-switch${options[key] ? " enabled" : ""}`} role="switch" aria-checked={Boolean(options[key])} aria-label={label} onClick={() => toggle(key)}><span /></button>
          </div>
        ))}
      </div>
      <p className="settings-note">Browser notification permission: {permission}</p>
    </section>
  );
}
