import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomFooter from "./BottumFooter";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import SimpleStepsToJoin from "./SimpleStepsToJoin";

// Fix for default marker icons in Leaflet with Next.js

// Add these custom icons after the existing icon definition
const defaultIcon = L.icon({
  iconUrl: "/images/marker-icon.png",
  iconRetinaUrl: "/images/marker-icon-2x.png",
  shadowUrl: "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
}) as L.Icon;

const selectedIcon = L.icon({
  iconUrl: "/images/marker-icon-red.png", // You'll need to add this red marker image
  iconRetinaUrl: "/images/marker-icon-red-2x.png", // And this one
  shadowUrl: "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
}) as L.Icon;

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

  // Add more schools as needed
];

// Custom dropdown for school selection
function SchoolDropdown({
  schools,
  onSelect,
}: {
  schools: string[];
  onSelect: (school: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <input
        className={`w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] cursor-pointer ${value ? "text-gray-900" : "text-gray-400"}`}
        placeholder="Select School"
        value={value}
        readOnly
        onClick={() => setOpen((o) => !o)}
        onFocus={() => setOpen(true)}
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <img
          src="/down.svg"
          alt="dropdown"
          className={`w-5 h-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </div>
      {open && (
        <div className="absolute left-0 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          {schools.map((school, idx) => (
            <div key={school}>
              <button
                className="w-full text-left px-4 py-3 text-gray-900 hover:bg-[#faf9f6] focus:bg-[#faf9f6] rounded-xl transition-colors duration-150"
                style={{
                  borderRadius:
                    idx === 0
                      ? "12px 12px 0 0"
                      : idx === schools.length - 1
                        ? "0 0 12px 12px"
                        : undefined,
                }}
                onClick={() => {
                  setValue(school);
                  setOpen(false);
                  onSelect(school);
                }}
                type="button"
              >
                {school}
              </button>
              {idx < schools.length - 1 && (
                <div className="h-px bg-gray-200 mx-4" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SchoolTransportation() {
  const router = useRouter();

  const statsRef = useRef(null);
  const isInView = useInView(statsRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const titleVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const boxVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const handleRegister = () => {
    router.push("/register");
  };

  const handleAboutUs = () => {
    router.push("/about");
  };

  return (
    <>
      <section className="bg-white rounded-t-3xl pt-8  px-5 md:min-h-screen flex flex-col items-center shadow-lg w-full max-w-md mx-auto md:max-w-full md:rounded-6xl md:pt-0 md:pb-0 md:px-0 md:flex-row md:items-stretch md:shadow-none">
        {/* Desktop layout: two columns */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center  md:items-start md:pl-64 md:pr-8 md:pt-0.5 md:py-0 py-8">
          {/* Heading */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-spartan text-center md:text-left mb-10 md:mb-20 mt-2 heading-styles  "
          >
            <span
              className="block md:hidden leading-10
             "
            >
              <p>Smart & Secure</p>
              <p>School Commute</p>
            </span>
            <span className="hidden md:block">
              <p>Smart & Secure</p>
              <p>School Commute</p>
            </span>
          </motion.div>
          {/* Paragraph */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="font-satoshi mt-2 md:mt-6 md:mb-8 paragraph-styles"
          >
            {/* Mobile text */}
            <div className="block ">
              <p>
                At Rukhiyas, our student transportation service is engineered
                for your child&apos;s daily journey. Using cutting-edge GPS
                tracking, dedicated drivers, and flexible route management, we
                ensure every ride is punctual, secure, and stress-free.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-4 mt-6 md:mt-0 mb:0"
          >
            <button
              className="bg-[#EAB308] font-satoshi text-white font-semibold rounded-full px-8 py-2 text-base shadow-none hover:bg-[#d1a106] transition-colors duration-200"
              onClick={handleRegister}
            >
              Register Now
            </button>
            <button
              className="border font-satoshi border-[#EAB308] text-[#EAB308] font-semibold rounded-full px-8 py-2 text-base bg-transparent shadow-none hover:bg-[#fffbe6] transition-colors duration-200"
              onClick={handleAboutUs}
            >
              About Us
            </button>
          </motion.div>
        </div>
        {/* Desktop image column */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="hidden md:flex w-1/2 items-center justify-center pr-24 md:mt-0"
        >
          <Image
            src="/assets/schooltrans.webp"
            alt="About Rukhiyas"
            width={674}
            height={450}
            className="rounded-3xl object-cover"
          />
        </motion.div>
      </section>
      {/* Stats Section Inline */}
      <div className="bg-white " ref={statsRef}>
        <motion.section
          className="w-full flex flex-col items-center md:mt-0 mt-[38px] mb-0"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div
            className="w-[288px] h-[38px] md:w-[487px] md:h-[64px] font-spartan font-semibold text-[28px] md:text-[48px] leading-[38px] md:leading-[64px] tracking-[1px] md:tracking-[1px] text-black text-center mb-10 mx-auto"
            variants={titleVariants}
          >
            <p>All-In-One</p>
            <p>Control Center</p>
          </motion.div>

          <motion.div className="p-2" variants={boxVariants}>
            <div>
              <Image
                src="/assets/Dashboard Anim.png"
                alt="admin dashboard"
                width={230}
                height={0}
              />
            </div>
          </motion.div>
          <div className="font-satoshi  mt-2 md:mt-6 paragraph-styles">
            <p>
              Track your child&apos;s bus live, manage pickups and drop-offs,
              stay updated with real-time ride statuses, and handle payments,
              all in one place.
            </p>
          </div>
          <motion.button
            className=" w-[288px] -mt-9 md:w-[224px] h-[44px] bg-[#EAB308] font-satoshi font-bold text-[18px] text-[#fafafa] rounded-full   text-lg shadow-md hover:bg-[#d1a106] transition-colors duration-200 flex  items-center justify-center"
            variants={buttonVariants}
            onClick={handleRegister}
          >
            Register Now
          </motion.button>
        </motion.section>
      </div>
      {/* Why Choose Us Section */}
      <WhyChooseUs />
    </>
  );
}

function WhyChooseUs() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };
  const router = useRouter();

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <>
      <motion.section
        ref={sectionRef}
        className="w-full md:pt-40 flex flex-col items-center bg-white md:min-h-[400px] py-8 px-2 md:px-0 pb-0"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.h2
          className="font-spartan font-bold text-[28px] md:text-[48px] leading-[38px] md:leading-[64px] tracking-[1px] md:tracking-[1px] text-black text-center mb-6"
          variants={itemVariants}
        >
          <div>
            <p>Area & Schools </p>
            <p>We Cover</p>
          </div>
        </motion.h2>
        <div className="font-satoshi text-black text-[16px] text-center  mt-2 md:mt-6 ">
          <div>
            <p>Search for your school or area to see if our </p>
            <p>service is available to you.</p>
          </div>
        </div>

        <section className="w-full px-4 md:px-8 mt-6">
          <SearchBar onSchoolSelect={setSelectedSchool} />
          <div
            className="w-full h-[405px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg"
            style={{ zIndex: 1 }}
          >
            <MapContainer
              center={
                [11.711123056659488, 75.53716054175986] as LatLngExpression
              }
              zoom={15}
              style={{ height: "100%", width: "100%", zIndex: 1 }}
              scrollWheelZoom={true}
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapMarkers selectedSchool={selectedSchool} />
            </MapContainer>
          </div>

          {/* School List */}
        </section>
        <motion.div
          className="flex pl-4 mt-6 justify-center "
          variants={itemVariants}
          style={{ width: "354px", height: "44px" }}
        >
          <button
            className="bg-[#EAB308] font-satoshi text-white font-bold rounded-full px-8 py-2 text-[18px] shadow-none w-full hover:bg-[#d1a106] transition-colors duration-200"
            onClick={handleRegister}
          >
            Register Now
          </button>
        </motion.div>
      </motion.section>
      <motion.div className="w-full max-w-md mx-auto px-4 md:px-8 mt-15">
        <p className="font-spartan font-semibold text-[28px] md:text-[40px] leading-[38px] md:leading-[64px] tracking-[1px] md:tracking-[1px] text-black text-center mb-10">
          Get Your Fee Estimate
        </p>
        <div className="font-satoshi text-black-100 mt-2 md:mt-6 leading-tight paragraph-styles -mb-19">
          <p>
            Simply select your school and enter your home address to instantly
            reveal your personalized fee estimate.
          </p>
        </div>
        <div className=" max-w-sm mx-auto">
          <label className="block text-sm font-medium text-gray-900 mb-1">
            School
          </label>
          <SchoolDropdown
            schools={[
              "St. Mary's High School",
              "Delhi Public School",
              "Kendriya Vidyalaya",
              "Modern Public School",
              "Springdales School",
            ]}
            onSelect={() => {}}
          />
        </div>
        <div className=" max-w-sm mx-auto">
          <label className="block text-sm font-medium text-gray-900 mb-1 mt-3">
            Sudent Address
          </label>
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400"
            placeholder="Enter student address"
          />
        </div>
        <button className="bg-[#EAB308] font-satoshi text-white font-bold rounded-full px-8 py-2 text-[18px] shadow-none w-full hover:bg-[#d1a106] transition-colors duration-200 mt-6">
          Get Quote
        </button>
        <SimpleStepsToJoin />
      </motion.div>

      <BottomFooter />
    </>
  );
}

// --- SearchBar Component ---
function SearchBar({
  onSchoolSelect,
}: {
  onSchoolSelect: (school: string | null) => void;
}) {
  const [active, setActive] = useState<null | "school" | "area">(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof schoolLocations>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter schools based on query
  useEffect(() => {
    if (query && active === "school") {
      const filtered = schoolLocations.filter((school) =>
        school.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, active]);

  // Close suggestions when clicking outside
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
    setQuery(school.name);
    setShowSuggestions(false);
    onSchoolSelect(school.name);
  };

  const handleClearSearch = () => {
    setActive(null);
    setQuery("");
    setShowSuggestions(false);
    onSchoolSelect(null); // This will trigger the zoom out in MapMarkers
  };

  return (
    <div
      className="flex items-center justify-center gap-2 mb-6 relative"
      ref={searchRef}
    >
      {active === null ? (
        <>
          <button
            className="w-[137px] h-12 px-2 border border-[#EAB308] rounded-l-full rounded-r-full bg-white text-gray-600 font-inter text-[14px] focus:outline-none transition-colors duration-150 hover:bg-[#fffbe6] whitespace-nowrap border-r-0 mr-1 sm:mr-0"
            style={{ zIndex: 1 }}
            onClick={() => setActive("school")}
          >
            Search school
          </button>
          <button
            className="w-[139px] h-12 px-2 border border-[#EAB308] rounded-l-full rounded-r-full bg-white text-gray-600 font-inter focus:outline-none transition-colors duration-150 hover:bg-[#fffbe6] whitespace-nowrap -ml-px sm:ml-0 text-[14px]"
            style={{ zIndex: 1 }}
            onClick={() => setActive("area")}
          >
            Search area
          </button>
        </>
      ) : (
        <div className="relative w-[278px]">
          <input
            autoFocus
            type="text"
            className="w-full h-12 pl-4 pr-14 border border-[#EAB308] rounded-l-full rounded-r-full focus:outline-none focus:ring-0 focus:ring-[#EAB308] text-gray-700 font-satoshi text-base bg-[#FFF8E1] transition-all duration-200 placeholder-gray-500"
            placeholder={
              active === "school"
                ? "Enter your school name"
                : "Enter your area name"
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ zIndex: 20 }}
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#EAB308] hover:text-yellow-700 focus:outline-none"
            onClick={handleClearSearch}
            aria-label="Close search"
            tabIndex={0}
            style={{ zIndex: 21 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 sm:h-5 sm:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              className="absolute w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto"
              style={{
                zIndex: 9999,
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
              }}
            >
              {suggestions.map((school, index) => (
                <div key={index} className="w-full">
                  <div
                    className="px-4 py-2 hover:bg-[#FFF8E1] cursor-pointer text-gray-700 font-satoshi w-full"
                    onClick={() => handleSuggestionClick(school)}
                  >
                    {school.name}
                  </div>
                  {/* Updated divider with full width */}
                  {index < suggestions.length - 1 && (
                    <div className="h-[1px] bg-gray-200 w-full" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Search icon */}
      <button
        className="w-15 h-12 flex items-center justify-center rounded-full bg-[#EAB308] border border-[#EAB308] text-white focus:outline-none"
        aria-label="Search"
        tabIndex={-1}
        style={{ pointerEvents: "none", zIndex: 20 }}
      >
        <svg
          className="h-10 w-10 sm:h-8 sm:w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  );
}

// Create a new component for the map markers
function MapMarkers({ selectedSchool }: { selectedSchool: string | null }) {
  const map = useMap();
  const [previousView, setPreviousView] = useState<{
    center: LatLngExpression;
    zoom: number;
  }>({
    center: [11.711123056659488, 75.53716054175986],
    zoom: 15,
  });

  useEffect(() => {
    if (selectedSchool) {
      // Store current view before zooming in
      setPreviousView({
        center: map.getCenter(),
        zoom: map.getZoom(),
      });

      // Find the selected school's position
      const school = schoolLocations.find((s) => s.name === selectedSchool);
      if (school) {
        // Zoom to the selected school
        map.setView(school.position, 17);

        // Find and open the popup for the selected marker
        const markers = document.querySelectorAll(".leaflet-marker-icon");
        markers.forEach((marker, index) => {
          if (schoolLocations[index].name === selectedSchool) {
            const markerElement = marker as HTMLElement;
            const popup = markerElement.nextElementSibling as HTMLElement;
            if (popup && popup.classList.contains("leaflet-popup")) {
              popup.style.display = "block";
            }
          }
        });
      }
    } else {
      // When no school is selected (cross pressed), restore previous view
      map.setView(previousView.center, previousView.zoom);
    }
  }, [selectedSchool, map]);

  return (
    <>
      {schoolLocations.map((school, index) => (
        <Marker
          key={index}
          position={school.position}
          icon={selectedSchool === school.name ? selectedIcon : defaultIcon}
        >
          <Popup>{school.name}</Popup>
        </Marker>
      ))}
    </>
  );
}
