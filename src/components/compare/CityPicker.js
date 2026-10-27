"use client";

import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { useLazySearchLocationsQuery } from "../../app/store/weatherApiSlice";

export default function CityPicker({ label, city, onChange }) {
  const [query, setQuery] = useState("");
  const [search, { currentData: results = [] }] = useLazySearchLocationsQuery();
  const selectedCity = city && typeof city === "object" ? city : {};
  const locations = Array.isArray(results) ? results : [];

  return (
    <div className="compare-picker">
      <span>{label}</span>
      <div className="compare-selected-city"><MapPin size={15} />{selectedCity.name ?? "Select a city"}{selectedCity.country ? `, ${selectedCity.country}` : ""}</div>
      <label className="compare-search">
        <Search size={15} />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            if (event.target.value.trim().length >= 2) search(event.target.value);
          }}
          placeholder="Change city..."
          aria-label={`Search city for ${label}`}
        />
      </label>
      {query.length >= 2 && locations.length > 0 && (
        <ul className="compare-results">
          {locations.filter((result) =>
            Number.isFinite(result?.latitude) && result.latitude >= -90 && result.latitude <= 90 &&
            Number.isFinite(result.longitude) && result.longitude >= -180 && result.longitude <= 180,
          ).map((result) => (
            <li key={`${result.latitude}-${result.longitude}`}>
              <button type="button" onClick={() => {
                onChange({
                  name: result.name,
                  country: result.country ?? "",
                  latitude: result.latitude,
                  longitude: result.longitude,
                });
                setQuery("");
              }}>
                {result.name}<small>{result.admin1 ? `${result.admin1}, ` : ""}{result.country}</small>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
