"use client";

import dynamic from "next/dynamic";
import type { LatLngExpression } from "leaflet";
import { useState, useEffect } from "react";

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

interface MapMarkersProps {
  selectedSchool: string | null;
}

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

function MapMarkers({ selectedSchool }: MapMarkersProps) {
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    // Dynamically import leaflet only on client
    import("leaflet").then((leaflet) => {
      setL(leaflet);
      // Import CSS only on client
      import("leaflet/dist/leaflet.css");
    });
  }, []);

  if (!L) return null;

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

  return (
    <>
      {schoolLocations.map((school) => (
        <Marker
          key={school.name}
          position={school.position}
          icon={selectedSchool === school.name ? selectedIcon : defaultIcon}
        >
          <Popup>
            <div className="text-center">
              <h3 className="font-semibold">{school.name}</h3>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

interface MapComponentProps {
  selectedSchool: string | null;
}

export default function MapComponent({ selectedSchool }: MapComponentProps) {
  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={[11.711084304588613, 75.5429556066623]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapMarkers selectedSchool={selectedSchool} />
      </MapContainer>
    </div>
  );
}
