/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { LeafletEvent } from "leaflet";

const Map = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

interface LatLng {
  lat: number;
  lng: number;
}

interface MapAddressPickerProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (address: string, latlng: LatLng) => void;
  initialLatLng?: LatLng;
}

// Add this custom icon definition at the top of the file, after imports

export default function MapAddressPicker({
  open,
  onClose,
  onConfirm,
  initialLatLng,
}: MapAddressPickerProps) {
  const [center, setCenter] = useState<LatLng>(
    initialLatLng || { lat: 11.7111, lng: 75.5371 }
  );
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  // Reverse geocode to get address from lat/lng
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${center.lat}&lon=${center.lng}`
    )
      .then((res) => res.json())
      .then((data) => {
        setAddress(data.display_name || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [center, open]);

  // Get current location
  const handleCurrentLocation = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocating(false);
        },
        () => setLocating(false)
      );
    } else {
      setLocating(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md mx-auto overflow-hidden flex flex-col">
        <div className="relative w-full h-80">
          {/* Map with fixed pointer */}
          <Map
            center={center}
            zoom={17}
            style={{ width: "100%", height: "100%" }}
            scrollWheelZoom={true}
            dragging={true}
            doubleClickZoom={true}
            whenReady={(event: LeafletEvent) => {
              const map = event.target;
              map.on("moveend", () => {
                const c = map.getCenter();
                setCenter({ lat: c.lat, lng: c.lng });
              });
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </Map>
          {/* Fixed pointer */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full"
            style={{ zIndex: 9999 }}
          >
            <img
              src="/images/marker-icon-red.png"
              alt="Location marker"
              width={25}
              height={41}
            />
          </div>
        </div>
        <div className="p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-lg">Set Your Address</span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          <div className="text-sm text-gray-500 mb-2">
            Drag the map to move the pin
          </div>
          <button
            type="button"
            className="mb-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 flex items-center gap-2 w-fit"
            onClick={handleCurrentLocation}
            disabled={locating}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3"
              />
            </svg>
            {locating ? "Locating..." : "Show Current Location"}
          </button>
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 text-gray-700">
            <svg
              className="w-4 h-4 mr-2 text-[#EAB308]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z"
              />
            </svg>
            <input
              className="bg-transparent border-none outline-none flex-1 text-sm"
              value={loading ? "Loading address..." : address}
              readOnly
            />
          </div>
          <button
            className="w-full bg-[#eab308] text-white font-semibold rounded-full py-3 text-lg shadow hover:bg-[#c49c00] transition mt-2"
            onClick={() => onConfirm(address, center)}
            disabled={loading || !address}
          >
            Confirm Address
          </button>
        </div>
      </div>
    </div>
  );
}
