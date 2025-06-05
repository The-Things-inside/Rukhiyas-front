import { useEffect, useRef, useState } from "react";
import L from "leaflet";
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
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [mapCenter, setMapCenter] = useState(
    initialLatLng || { lat: 11.707, lng: 75.531 }
  );
  const [address, setAddress] = useState("Fetching address...");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!open) return;

    if (!mapRef.current) {
      const map = L.map("map", {
        center: [mapCenter.lat, mapCenter.lng],
        zoom: 16,
        dragging: true,
        touchZoom: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        zoomControl: true,
      });
      mapRef.current = map;

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
  }, [open, initialLatLng]);

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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-end bg-gray-100">
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
          className="mt-4 w-full py-3 rounded-full bg-yellow-400 text-white font-bold shadow"
          onClick={() => onConfirm(address, mapCenter)}
        >
          Confirm Address
        </button>
      </div>
    </div>
  );
}
