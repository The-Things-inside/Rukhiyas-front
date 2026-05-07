import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

interface MapAddressPickerProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (address: string, latlng: { lat: number; lng: number }) => void;
  initialLatLng?: { lat: number; lng: number };
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

export default function MapAddressPicker({
  open,
  onClose,
  onConfirm,
  initialLatLng,
}: MapAddressPickerProps) {
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    initialLatLng || { lat: 11.707, lng: 75.531 }
  );
  const [address, setAddress] = useState<string>("Fetching address...");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    // Dynamically import leaflet only on client side
    import("leaflet").then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  useEffect(() => {
    if (!open || !L) return;

    if (!mapRef.current) {
      const map = L.map("map", {
        center: [mapCenter.lat, mapCenter.lng],
        zoom: 16,
        dragging: true,
        touchZoom: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        zoomControl: false, // Disable default zoom control
      });
      mapRef.current = map;

      // Add custom positioned zoom control
      L.control
        .zoom({
          position: "bottomright",
        })
        .addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      markerRef.current = L.marker([mapCenter.lat, mapCenter.lng], {
        icon: L.icon({
          iconUrl:
            "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        }),
        draggable: true,
      }).addTo(map);

      map.on("move", () => {
        const center = map.getCenter();
        markerRef.current?.setLatLng(center);
        setMapCenter({ lat: center.lat, lng: center.lng });
      });

      map.on("moveend", () => {
        const center = map.getCenter();
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${center.lat}&lon=${center.lng}&format=json`
        )
          .then((res) => res.json())
          .then((data) => {
            setAddress(data.display_name || "Address not found");
          });
      });

      markerRef.current.on("dragend", () => {
        const position = markerRef.current?.getLatLng();
        if (position) {
          map.setView(position);
          fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.lat}&lon=${position.lng}&format=json`
          )
            .then((res) => res.json())
            .then((data) => {
              setAddress(data.display_name || "Address not found");
            });
        }
      });
    } else {
      mapRef.current.setView([mapCenter.lat, mapCenter.lng]);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [open, initialLatLng, L]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      if (query.trim()) {
        fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&limit=5`
        )
          .then((res) => res.json())
          .then((data: SearchResult[]) => {
            setSuggestions(data);
            setIsSearching(false);
          })
          .catch(() => {
            setSuggestions([]);
            setIsSearching(false);
          });
      } else {
        setSuggestions([]);
        setIsSearching(false);
      }
    }, 500); // Debounce for 500ms
  };

  const handleSuggestionClick = (suggestion: SearchResult) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);

    if (mapRef.current && markerRef.current) {
      mapRef.current.setView([lat, lng], 16);
      markerRef.current.setLatLng([lat, lng]);
      setMapCenter({ lat, lng });
      setAddress(suggestion.display_name);
      setSearchQuery(suggestion.display_name);
      setSuggestions([]);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (mapRef.current && markerRef.current) {
          mapRef.current.setView([latitude, longitude], 16);
          markerRef.current.setLatLng([latitude, longitude]);
          setMapCenter({ lat: latitude, lng: longitude });

          // Fetch address for the current location
          fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
            .then((res) => res.json())
            .then((data) => {
              setAddress(data.display_name || "Address not found");
              setSearchQuery(data.display_name || "");
            });
        }
        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location");
        setIsLocating(false);
      }
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-end bg-gray-100">
      {/* Top bar (close) */}
      <div className="absolute top-0 left-0 right-0 z-20 h-14 bg-[#14141B]/80 backdrop-blur flex items-center justify-between px-4">
        <div className="text-white font-semibold" style={{ fontFamily: "Spartan, sans-serif" }}>
          Set Location
        </div>
        <button
          type="button"
          aria-label="Close map"
          onClick={onClose}
          className="h-9 w-9 rounded-full bg-white/10 text-white grid place-items-center"
        >
          <span className="text-2xl leading-none">&times;</span>
        </button>
      </div>

      <div
        id="map"
        className="absolute top-0 left-0 right-0 bottom-40 z-0"
      ></div>

      <div className="absolute bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-2xl p-4 z-10">
        <div className="text-center mb-2">
          <p className="font-semibold text-gray-800 text-lg">
            Set Your Address
          </p>
          <p className="text-sm text-gray-500">Drag the map to move the pin</p>
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
            <span className="text-red-500">📍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search for an address"
              className="flex-1 text-black text-sm outline-none bg-transparent"
            />
            <span className="text-gray-500">🔍</span>
          </div>
          {isSearching && (
            <div className="absolute left-0 right-0 mt-1 bg-white rounded-md shadow-lg p-2">
              <p className="text-gray-500 text-sm">Searching...</p>
            </div>
          )}
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-white rounded-md shadow-lg max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.display_name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="mt-2 p-2 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">Selected Address:</p>
          <p className="text-sm text-gray-800">{address}</p>
        </div>
        <button
          className="mt-4 w-full py-3 rounded-full bg-yellow-400 text-white font-bold shadow flex items-center justify-center gap-2"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
        >
          {isLocating ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Locating...</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Use My Current Location</span>
            </>
          )}
        </button>
        <button
          className="mt-4 w-full py-3 rounded-full bg-yellow-400 text-white font-bold shadow"
          onClick={() => onConfirm(address, mapCenter)}
        >
          Confirm Address
        </button>

        <button
          type="button"
          className="mt-3 w-full py-3 rounded-full border border-gray-300 text-gray-700 font-semibold"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
