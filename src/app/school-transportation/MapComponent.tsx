"use client";

import type { LatLngExpression } from "leaflet";
import { useEffect, useMemo, useRef, useState } from "react";
import type * as Leaflet from "leaflet";

// Sample school locations in Mahe, Kerala
const schoolLocations: Array<{
  name: string;
  position: LatLngExpression;
}> = [
  {
    name: "Al Falah College",
    position: [11.711084304588613, 75.5429556066623],
  },
  {
    name: "MMUP SCHOOL NEW MAHE",
    position: [11.71065599999993, 75.53547406413618],
  },
  {
    name: "MM HSS New Mahe",
    position: [11.71060252983104, 75.53505722621212],
  },
  {
    name: "MM NURSERY SCHOOL",
    position: [11.711193045476325, 75.53431931640563],
  },
];

// (react-leaflet MapMarkers removed; markers are rendered via Leaflet LayerGroup)

interface MapComponentProps {
  selectedSchool: string | null;
  containerClassName?: string;
  mapClassName?: string;
}

export default function MapComponent({
  selectedSchool,
  containerClassName,
  mapClassName,
}: MapComponentProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const layerGroupRef = useRef<Leaflet.LayerGroup | null>(null);
  const leafletRef = useRef<typeof Leaflet | null>(null);

  const schools = useMemo(() => schoolLocations, []);

  // Initialize map once
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const container = wrapperRef.current;
      if (!container) return;

      // If Fast Refresh/StrictMode left a stale Leaflet id on this node, clear it
      if ((container as any)._leaflet_id) {
        delete (container as any)._leaflet_id;
      }

      const L = await import("leaflet");
      if (cancelled) return;

      leafletRef.current = L;

      const map = L.map(container, {
        zoomControl: false,
        attributionControl: false,
      }).setView([11.711084304588613, 75.5429556066623], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const group = L.layerGroup().addTo(map);
      mapRef.current = map;
      layerGroupRef.current = group;
    };

    init();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      layerGroupRef.current = null;
    };
  }, []);

  // Update markers when selection changes
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const group = layerGroupRef.current;
    if (!L || !map || !group) return;

    group.clearLayers();

    const defaultIcon = L.icon({
      iconUrl: "/images/marker-icon.png",
      iconRetinaUrl: "/images/marker-icon-2x.png",
      shadowUrl: "/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const selectedIcon = L.icon({
      iconUrl: "/images/marker-icon-red.png",
      iconRetinaUrl: "/images/marker-icon-red-2x.png",
      shadowUrl: "/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    schools.forEach((school) => {
      const marker = L.marker(school.position, {
        icon: selectedSchool === school.name ? selectedIcon : defaultIcon,
      }).addTo(group);
      marker.bindPopup(
        `<div style="text-align:center;font-weight:600">${school.name}</div>`,
      );
    });
  }, [schools, selectedSchool]);

  return (
    <div
      className={
        containerClassName ??
        "w-full h-[400px] rounded-xl overflow-hidden shadow-lg"
      }
    >
      <div ref={wrapperRef} className={mapClassName ?? "h-full w-full"} />
    </div>
  );
}
