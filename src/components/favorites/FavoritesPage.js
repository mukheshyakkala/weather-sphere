"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Clock3, Heart, Search, Trash2 } from "lucide-react";
import { useClientReady } from "../../app/utils/useClientReady";
import { useLazySearchLocationsQuery } from "../../app/store/weatherApiSlice";
import { clearRecentSearches, removeRecentSearch, setSelectedLocation } from "../../app/store/preferencesSlice";
import FavoriteCityCard from "./FavoriteCityCard";
import { useFavorites } from "./useFavorites";
import "./FavoritesPage.css";

export default function FavoritesPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const selectedLocation = useSelector((state) => state.preferences.selectedLocation);
  const preferencesHydrated = useSelector((state) => state.preferences.hydrated);
  const recentSearches = useSelector((state) => state.preferences.recentSearches);
  const { favorites, hydrated, addFavorite, removeFavorite } = useFavorites();
  const clientReady = useClientReady();
  const [query, setQuery] = useState("");
  const [search, { currentData: results = [] }] = useLazySearchLocationsQuery();
  const places = Array.isArray(results) ? results : [];
  const favoritesList = Array.isArray(favorites) ? favorites : [];
  const recentList = clientReady && preferencesHydrated && Array.isArray(recentSearches)
    ? recentSearches.filter((city) => city && Number.isFinite(city.latitude) && Number.isFinite(city.longitude))
    : [];

  const selectDefault = (city) => dispatch(setSelectedLocation(city));
  const navigate = (city, path = "/") => {
    dispatch(setSelectedLocation(city));
    router.push(path);
  };
  const isFavorite = (location) => favoritesList.some(
    (favorite) => favorite.latitude === location.latitude && favorite.longitude === location.longitude,
  );
  const addLocation = (location) => {
    if (isFavorite(location)) return;
    addFavorite({
      name: location.name,
      country: location.country || "",
      admin1: location.admin1 || "",
      latitude: location.latitude,
      longitude: location.longitude,
    });
    setQuery("");
  };

  return (
    <main className="dashboard-main favorites-main">
      <div className="favorites-page">
            <section className="favorites-hero">
              <span><Heart size={15} /> YOUR PLACES</span>
              <h1>Favorite locations</h1>
              <p>Keep your go-to cities close and check their weather in a glance.</p>
              <label className="favorites-search">
                <Search size={17} />
                <input value={query} placeholder="Find a city to save..." onChange={(event) => {
                  setQuery(event.target.value);
                  if (event.target.value.trim().length >= 2) search(event.target.value);
                }} />
                {places.length > 0 && query.length >= 2 && (
                  <ul className="favorites-results">
                    {places.filter((place) => Number.isFinite(place?.latitude) && Number.isFinite(place?.longitude)).map((place) => {
                      const saved = isFavorite(place);
                      return <li key={`${place.latitude}-${place.longitude}`}><button type="button" onClick={() => addLocation(place)} disabled={saved}><strong>{place.name ?? "Unknown location"}</strong><small>{place.admin1 ? `${place.admin1}, ` : ""}{place.country ?? ""}</small><span>{saved ? "Saved" : "Add"}</span></button></li>;
                    })}
                  </ul>
                )}
              </label>
            </section>
            <section className="favorites-section">
              <div className="favorites-heading"><div><span className="favorites-kicker">SAVED PLACES</span><h2>Your favorites <small>{favoritesList.length}</small></h2></div><button type="button" className="favorites-compare" onClick={() => router.push("/compare")}>Compare cities</button></div>
              {!hydrated ? <p className="favorites-empty">Loading saved locations…</p> : favoritesList.length ? (
                <div className="favorite-grid">
                  {favoritesList.map((city) => <FavoriteCityCard key={`${city.latitude}-${city.longitude}`} city={city} isDefault={selectedLocation?.latitude === city.latitude && selectedLocation?.longitude === city.longitude} onRemove={removeFavorite} onDefault={selectDefault} onNavigate={navigate} />)}
                </div>
              ) : <div className="favorites-empty"><Heart size={22} /><strong>No saved locations yet</strong><span>Search for a city above to add your first favorite.</span></div>}
            </section>
            <section className="favorites-section recent-section">
              <div className="favorites-heading"><div><span className="favorites-kicker">QUICK ACCESS</span><h2><Clock3 size={19} /> Recent searches</h2></div>{recentList.length > 0 && <button type="button" className="clear-recent" onClick={() => dispatch(clearRecentSearches())}><Trash2 size={14} /> Clear history</button>}</div>
              {recentList.length ? <div className="recent-list">{recentList.map((city) => {
                const saved = isFavorite(city);
                const isCurrentLocation = selectedLocation?.source === "browser" &&
                  selectedLocation.latitude === city.latitude &&
                  selectedLocation.longitude === city.longitude;
                return <div key={`${city.latitude}-${city.longitude}`}><button type="button" className="recent-name" onClick={() => navigate(city)}>{city.name ?? "Unknown location"}<small>{city.country ?? ""}</small></button><div className="recent-actions"><button type="button" className="recent-add" onClick={() => addLocation(city)} disabled={saved} aria-label={saved ? `${city.name ?? "Location"} is already a favorite` : `Add ${city.name ?? "location"} to favorites`}><Heart size={16} /></button>{!isCurrentLocation && <button type="button" className="recent-remove" onClick={() => dispatch(removeRecentSearch(city))} aria-label={`Remove ${city.name ?? "location"} from recent searches`}><Trash2 size={15} /></button>}</div></div>;
              })}</div> : <p className="recent-empty">Recently selected cities will show here.</p>}
            </section>
      </div>
    </main>
  );
}
