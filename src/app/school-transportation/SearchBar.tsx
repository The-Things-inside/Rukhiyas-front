import { useState, useRef, useEffect } from "react";
import type { LatLngExpression } from "leaflet";

// Sample school locations in Mahe, Kerala
const schoolLocations: Array<{
  name: string;
  position: LatLngExpression;
}> = [
  {
    name: "Al Falah College",
    position: [11.711084304588613, 75.5429556066623] as LatLngExpression,
  },
  {
    name: "MMUP SCHOOL NEW MAHE",
    position: [11.71065599999993, 75.53547406413618] as LatLngExpression,
  },
  {
    name: "MM HSS New Mahe",
    position: [11.71060252983104, 75.53505722621212] as LatLngExpression,
  },
  {
    name: "MM NURSERY SCHOOL",
    position: [11.711193045476325, 75.53431931640563] as LatLngExpression,
  },
];

interface SearchBarProps {
  onSchoolSelect: (school: string | null) => void;
}

export default function SearchBar({ onSchoolSelect }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<typeof schoolLocations>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (school: (typeof schoolLocations)[0]) => {
    setSearchTerm(school.name);
    setShowSuggestions(false);
    onSchoolSelect(school.name);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
    onSchoolSelect(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      const filtered = schoolLocations.filter((school) =>
        school.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      onSchoolSelect(null);
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search for your school..."
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6]"
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          {suggestions.map((school, idx) => (
            <div key={school.name}>
              <button
                className="w-full text-left px-4 py-3 text-gray-900 hover:bg-[#faf9f6] focus:bg-[#faf9f6] rounded-xl transition-colors duration-150"
                style={{
                  borderRadius:
                    idx === 0
                      ? "12px 12px 0 0"
                      : idx === suggestions.length - 1
                        ? "0 0 12px 12px"
                        : undefined,
                }}
                onClick={() => handleSuggestionClick(school)}
                type="button"
              >
                {school.name}
              </button>
              {idx < suggestions.length - 1 && (
                <div className="h-px bg-gray-200 mx-4" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
