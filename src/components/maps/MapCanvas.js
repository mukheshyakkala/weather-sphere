"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import "leaflet/dist/leaflet.css";

const MapCanvas = forwardRef(function MapCanvas({ center, style, onPick }, ref) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const onPickRef = useRef(onPick);
  const centerRef = useRef(center);
  const hasCenter = Number.isFinite(center?.latitude) && center.latitude >= -90 && center.latitude <= 90 &&
    Number.isFinite(center?.longitude) && center.longitude >= -180 && center.longitude <= 180;
  centerRef.current = center;

  useEffect(() => {
    onPickRef.current = onPick;
  }, [onPick]);

  useImperativeHandle(ref, () => ({
    zoomIn: () => mapRef.current?.zoomIn(),
    zoomOut: () => mapRef.current?.zoomOut(),
    fullscreen: async () => {
      const container = containerRef.current;
      if (!container || typeof document === "undefined") return;
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await container.requestFullscreen();
        mapRef.current?.invalidateSize();
      }
    },
    flyTo: (coords) => {
      if (!Number.isFinite(coords?.latitude) || coords.latitude < -90 || coords.latitude > 90 ||
          !Number.isFinite(coords.longitude) || coords.longitude < -180 || coords.longitude > 180) return;
      mapRef.current?.flyTo([coords.latitude, coords.longitude], 8);
    },
  }), []);

  useEffect(() => {
    if (!hasCenter) return undefined;
    let disposed = false;
    let map;

    import("leaflet").then((L) => {
      if (disposed || !containerRef.current) return;
      const initialCenter = centerRef.current;
      map = L.map(containerRef.current, {
        center: [initialCenter.latitude, initialCenter.longitude],
        zoom: 4,
        zoomControl: false,
        scrollWheelZoom: true,
      });
      mapRef.current = map;
      const tiles = style === "humanitarian"
        ? "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

      L.tileLayer(tiles, {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      markerRef.current = L.circleMarker([initialCenter.latitude, initialCenter.longitude], {
        radius: 9,
        color: "#ffffff",
        weight: 3,
        fillColor: "#0284c7",
        fillOpacity: 1,
      }).addTo(map);
      map.on("click", (event) => {
        const coords = {
          latitude: Number(event.latlng.lat.toFixed(4)),
          longitude: Number(event.latlng.lng.toFixed(4)),
        };
        markerRef.current?.setLatLng([coords.latitude, coords.longitude]);
        onPickRef.current(coords);
      });
      window.setTimeout(() => map.invalidateSize(), 100);
    }).catch((error) => {
      console.error("Unable to initialize the interactive map.", error);
    });

    return () => {
      disposed = true;
      map?.remove();
      if (mapRef.current === map) mapRef.current = null;
    };
  }, [hasCenter, style]);

  useEffect(() => {
    if (!mapRef.current || !Number.isFinite(center?.latitude) || center.latitude < -90 || center.latitude > 90 ||
        !Number.isFinite(center?.longitude) || center.longitude < -180 || center.longitude > 180) return;
    markerRef.current?.setLatLng([center.latitude, center.longitude]);
    mapRef.current.flyTo([center.latitude, center.longitude], 8);
  }, [center?.latitude, center?.longitude]);

  return <div className="map-canvas" ref={containerRef} aria-label="Interactive OpenStreetMap" />;
});

export default MapCanvas;
