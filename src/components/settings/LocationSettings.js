"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Search } from "lucide-react";
import { setCurrentLocation, setSelectedLocation } from "../../app/store/preferencesSlice";
import { useLazySearchLocationsQuery } from "../../app/store/weatherApiSlice";
import { getCurrentLocation } from "../../app/utils/geolocation";

export default function LocationSettings() {
  const dispatch = useDispatch();
  const location = useSelector((state) => state.preferences.selectedLocation);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [search, { data: results = [] }] = useLazySearchLocationsQuery();
  const places = Array.isArray(results) ? results : [];

  const locate = async () => {
    setMessage("Getting your current location…");
    try {
      const currentLocation = await getCurrentLocation();
      dispatch(setCurrentLocation(currentLocation));
      setMessage("Current location is now your default city.");
    } catch (error) {
      console.warn("Unable to use the current location.", error);
      setMessage(error instanceof Error ? error.message : "Unable to access your current location.");
    }
  };

  return (
    <section className="settings-card">
      <div className="settings-card-heading"><MapPin size={19} /><div><h2>Location</h2><p>Manage the city used across the dashboard.</p></div></div>
      <div className="settings-location-current"><span>Default city</span><strong>{location ? `${location.name}${location.country ? `, ${location.country}` : ""}` : "No location selected"}</strong><button type="button" onClick={locate}>Use current location</button></div>
      <label className="settings-location-search"><Search size={16} /><input value={query} placeholder="Search and set a default city..." onChange={(event) => { setQuery(event.target.value); if (event.target.value.trim().length >= 2) search(event.target.value); }} /></label>
      {places.length > 0 && query.length >= 2 && <ul className="settings-location-results">{places.filter((place) =>
        Number.isFinite(place?.latitude) && place.latitude >= -90 && place.latitude <= 90 &&
        Number.isFinite(place.longitude) && place.longitude >= -180 && place.longitude <= 180,
      ).map((place) => <li key={`${place.latitude}-${place.longitude}`}><button type="button" onClick={() => { dispatch(setSelectedLocation(place)); setQuery(""); setMessage(`${place.name ?? "Selected location"} is now your default city.`); }}>{place.name ?? "Unknown location"}<small>{place.admin1 ? `${place.admin1}, ` : ""}{place.country ?? ""}</small></button></li>)}</ul>}
      {message && <p className="settings-note" role="status">{message}</p>}
    </section>
  );
}
