"use client";

import { useState, useRef, useEffect } from "react";

interface SchoolDropdownProps {
  value?: string;
  onChange: (school: string) => void;
  error?: string;
}

export default function SchoolDropdown({
  value,
  onChange,
  error,
}: SchoolDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const schools = [
    "St. Mary's High School",
    "Delhi Public School",
    "Kendriya Vidyalaya",
    "Modern Public School",
    "Springdales School",
  ];

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
        className={`w-full border ${error ? "border-red-500" : "border-gray-300"} rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] cursor-pointer ${value ? "text-gray-900" : "text-gray-400"}`}
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
                  onChange(school);
                  setOpen(false);
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
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
}
