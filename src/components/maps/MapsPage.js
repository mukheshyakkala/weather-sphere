"use client";

import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Compass, Layers3, MapPin, Maximize2, Minus, Plus, Search, Wind } from "lucide-react";
import { useClientReady } from "../../app/utils/useClientReady";
import { useGetWeatherDataQuery, useLazySearchLocationsQuery } from "../../app/store/weatherApiSlice";
import MapCanvas from "./MapCanvas";
import { getWeatherDetails, formatValue } from "../forecast/forecastUtils";
import { getCurrentLocation } from "../../app/utils/geolocation";
import "./MapsPage.css";

export default function MapsPage() {
  const selectedLocation = useSelector((state) => state.preferences.selectedLocation);
  const preferencesHydrated = useSelector((state) => state.preferences.hydrated);
  const tempUnit = useSelector((state) => state.preferences.temperatureUnit);
  const windSpeedUnit = useSelector((state) => state.preferences.windSpeedUnit);
  const precipitationUnit = useSelector((state) => state.preferences.precipitationUnit);
  const refreshInterval = useSelector((state) => state.preferences.refreshInterval);
  const clientReady = useClientReady();
  const ready = clientReady && preferencesHydrated;
  const mapRef = useRef(null);
  const [layerStyle, setLayerStyle] = useState("standard");
  const [searchText, setSearchText] = useState("");
  const [pickedLocation, setPickedLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [triggerSearch, { data: results = [] }] = useLazySearchLocationsQuery();
  const mapLocation = pickedLocation || selectedLocation;
  const { data: weather } = useGetWeatherDataQuery({
    latitude: mapLocation?.latitude,
    longitude: mapLocation?.longitude,
    unit: tempUnit,
    windSpeedUnit,
    precipitationUnit,
  }, {
    skip: !Number.isFinite(mapLocation?.latitude) || mapLocation.latitude < -90 || mapLocation.latitude > 90 ||
      !Number.isFinite(mapLocation?.longitude) || mapLocation.longitude < -180 || mapLocation.longitude > 180,
    pollingInterval: refreshInterval,
  });
  const details = getWeatherDetails(weather?.current?.weather_code);
  const WeatherIcon = details.Icon;
  const nextRain = weather?.hourly?.precipitation_probability?.[0];

  const chooseLocation = (location) => {
    if (!Number.isFinite(location?.latitude) || location.latitude < -90 || location.latitude > 90 ||
        !Number.isFinite(location.longitude) || location.longitude < -180 || location.longitude > 180) return;
    const selected = {
      name: location.name || "Selected location",
      country: location.country ?? "",
      latitude: location.latitude,
      longitude: location.longitude,
    };
    setPickedLocation(selected);
    setSearchText("");
    mapRef.current?.flyTo(selected);
  };

  const pickCoordinates = (coords) => {
    if (!Number.isFinite(coords?.latitude) || coords.latitude < -90 || coords.latitude > 90 ||
        !Number.isFinite(coords.longitude) || coords.longitude < -180 || coords.longitude > 180) return;
    setPickedLocation({ ...coords, name: `${coords.latitude.toFixed(2)}°, ${coords.longitude.toFixed(2)}°`, country: "" });
  };

  const locateCurrentPosition = async () => {
    setLocationError("");
    try {
      const currentLocation = await getCurrentLocation();
      chooseLocation(currentLocation);
    } catch (error) {
      console.warn("Unable to locate the current position.", error);
      setLocationError(error instanceof Error ? error.message : "Unable to access your current location.");
    }
  };

  return (
    <main className="dashboard-main maps-main">
      {!ready ? (
        <div className="map-layer-note" role="status">Preparing your local weather map…</div>
      ) : (
      <div className="maps-page">
            <section className="maps-hero">
              <span className="maps-eyebrow"><Compass size={15} /> WEATHER EXPLORER</span>
              <h1>Explore the world&apos;s weather</h1>
              <p>Search a city or select any point on the map to inspect local conditions.</p>
            </section>

            <section className="maps-workspace">
              <div className="map-frame">
                <MapCanvas ref={mapRef} center={mapLocation} style={layerStyle} onPick={pickCoordinates} />
                <div className="map-search">
                  <Search size={16} />
                  <input
                    value={searchText}
                    onChange={(event) => {
                      setSearchText(event.target.value);
                      if (event.target.value.trim().length >= 2) triggerSearch(event.target.value);
                    }}
                    placeholder="Search a city..."
                    aria-label="Search a city to locate on the map"
                  />
                  {Array.isArray(results) && results.length > 0 && searchText.length >= 2 && (
                    <ul className="map-search-results">
                      {results.filter((place) => Number.isFinite(place?.latitude) && place.latitude >= -90 && place.latitude <= 90 &&
                        Number.isFinite(place.longitude) && place.longitude >= -180 && place.longitude <= 180).map((place) => (
                        <li key={`${place.latitude}-${place.longitude}`}>
                          <button type="button" onClick={() => chooseLocation(place)}>
                            <strong>{place.name}</strong><span>{place.admin1 ? `${place.admin1}, ` : ""}{place.country}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="map-controls" aria-label="Map controls">
                  <button type="button" aria-label="Zoom in" onClick={() => mapRef.current?.zoomIn()}><Plus size={18} /></button>
                  <button type="button" aria-label="Zoom out" onClick={() => mapRef.current?.zoomOut()}><Minus size={18} /></button>
                  <button type="button" aria-label="Use current location" onClick={locateCurrentPosition}><MapPin size={17} /></button>
                  <button type="button" aria-label="Toggle fullscreen map" onClick={() => mapRef.current?.fullscreen()}><Maximize2 size={17} /></button>
                </div>
                <span className="map-attribution-note">Map data © OpenStreetMap contributors</span>
              </div>

              <aside className="map-details">
                <div className="map-details-heading">
                  <span className="maps-eyebrow"><MapPin size={14} /> SELECTED LOCATION</span>
                  <h2>{mapLocation?.name}{mapLocation?.country ? `, ${mapLocation.country}` : ""}</h2>
                </div>
                {locationError && <p className="map-layer-note" role="alert">{locationError}</p>}
                <div className="map-weather-current">
                  <WeatherIcon size={34} color={details.color} />
                  <strong>{formatValue(weather?.current?.temperature_2m, `°${tempUnit}`)}</strong>
                  <span>{details.label}</span>
                </div>
                <div className="map-weather-stats">
                  <div><span>Humidity</span><strong>{formatValue(weather?.current?.relative_humidity_2m, "%")}</strong></div>
                  <div><span>Wind speed</span><strong>{formatValue(weather?.current?.wind_speed_10m, ` ${weather?.current_units?.wind_speed_10m || windSpeedUnit}`)}</strong></div>
                  <div><span>Rain chance</span><strong>{formatValue(nextRain, "%")}</strong></div>
                </div>
                <label className="map-style-select">
                  <span><Layers3 size={15} /> Map style</span>
                  <select value={layerStyle} onChange={(event) => setLayerStyle(event.target.value)}>
                    <option value="standard">OpenStreetMap</option>
                    <option value="humanitarian">Humanitarian</option>
                  </select>
                </label>
                <div className="map-layer-note">
                  <Wind size={16} />
                  <p>Open-Meteo currently provides forecast data but no map-tile overlays. Weather, radar and AQI layers are not available for this map provider.</p>
                </div>
              </aside>
            </section>
            <section className="maps-legend">
              <h2>Map legend</h2>
              <div><span className="legend-marker" /> Selected location <small>Live conditions shown at right</small></div>
              <div><span className="legend-tile" /> OpenStreetMap base layer <small>Pan, zoom, search and select locations</small></div>
            </section>
      </div>
      )}
    </main>
  );
}
