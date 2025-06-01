import React, { useState } from "react";
import MapAddressPicker from "./MapAddressPicker";

// LatLng type for address picker
interface LatLng {
  lat: number;
  lng: number;
}

function formatSelectedDates(dates: Date[]): string {
  if (!dates.length) return "Select dates";
  // Example: June 26, 27
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  return dates
    .map((date) => date.toLocaleDateString("en-US", options))
    .join(", ");
}

function CalendarPopup({
  onSelect,
  onClose,
  selectedDates,
}: {
  onSelect: (date: Date) => void;
  onClose: () => void;
  selectedDates: Date[];
}) {
  // Simple calendar for current month
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const weeks: (number | null)[][] = [[]];
  let week = 0;
  for (let i = 0; i < firstDay; i++) weeks[week].push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    if (weeks[week].length === 7) {
      week++;
      weeks[week] = [];
    }
    weeks[week].push(d);
  }
  while (weeks[week].length < 7) weeks[week].push(null);

  function isSelected(day: number) {
    return selectedDates.some(
      (date) =>
        date.getDate() === day &&
        date.getMonth() === month &&
        date.getFullYear() === year
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8"
        style={{ width: 400, maxWidth: "90vw" }}
      >
        <div className="flex justify-between items-center mb-4">
          <span
            className="font-bold text-[20px]"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            {today.toLocaleString("default", { month: "long" })} {year}
          </span>
          <button className="text-gray-400 text-2xl" onClick={onClose}>
            &times;
          </button>
        </div>
        <div
          className="grid grid-cols-7 gap-2 mb-2 text-center text-gray-400 text-base"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {weeks.flat().map((day, i) =>
            day ? (
              <button
                key={i}
                className={`rounded-full w-12 h-12 text-[18px] font-bold transition-colors ${isSelected(day) ? "bg-[#E8B600] text-white" : "text-gray-800 hover:bg-gray-100"}`}
                style={{ fontFamily: "Satoshi, sans-serif" }}
                onClick={() => onSelect(new Date(year, month, day))}
              >
                {day}
              </button>
            ) : (
              <div key={i} />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default function ManagePickupDropoffCard() {
  const [editMode, setEditMode] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [pickupAddress, setPickupAddress] = useState("Address");
  const [dropoffAddress, setDropoffAddress] = useState(
    "Same as pick up address"
  );
  const [pickupPickerOpen, setPickupPickerOpen] = useState(false);
  const [dropoffPickerOpen, setDropoffPickerOpen] = useState(false);
  const [pickupLatLng, setPickupLatLng] = useState<LatLng | undefined>(
    undefined
  );
  const [dropoffLatLng, setDropoffLatLng] = useState<LatLng | undefined>(
    undefined
  );

  const handleDateSelect = (date: Date) => {
    setSelectedDates((prev) => {
      const exists = prev.some(
        (d) =>
          d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear()
      );
      if (exists) {
        return prev.filter(
          (d) =>
            !(
              d.getDate() === date.getDate() &&
              d.getMonth() === date.getMonth() &&
              d.getFullYear() === date.getFullYear()
            )
        );
      } else {
        return [...prev, date];
      }
    });
  };

  if (editMode) {
    return (
      <div
        className="bg-white rounded-[20px] shadow-lg p-4 w-full mx-auto border border-gray-200 relative"
        style={{ boxShadow: "0 8px 32px 0 rgba(0,0,0,0.12)" }}
      >
        <div
          className="text-black text-[18px] font-semibold pt-2 pb-1"
          style={{ fontFamily: "Spartan, sans-serif" }}
        >
          Edit Address
        </div>
        <div
          className="text-[14px] text-black mb-3"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          For any changes within the next 2 days,
          <br className="sm:hidden" /> please{" "}
          <a href="#" className="underline text-black font-medium">
            call our agent
          </a>
          .
        </div>
        <div className="mb-2 relative">
          <div
            className="text-black text-[15px] font-medium mb-1"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            Dates
          </div>
          <button
            type="button"
            className={`flex items-center bg-gray-100 rounded-xl px-3 py-2 text-[15px] font-medium border border-gray-200 w-full text-left ${selectedDates.length === 0 ? "text-gray-400" : "text-gray-500"}`}
            style={{ fontFamily: "Satoshi, sans-serif" }}
            onClick={() => setCalendarOpen((v) => !v)}
          >
            <span className="flex-1">{formatSelectedDates(selectedDates)}</span>
            <span className="ml-2">
              {/* Calendar SVG */}
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="16"
                  rx="3"
                  stroke="#BDBDBD"
                  strokeWidth="1.5"
                />
                <path
                  d="M16 3v4M8 3v4"
                  stroke="#BDBDBD"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path d="M3 9h18" stroke="#BDBDBD" strokeWidth="1.5" />
              </svg>
            </span>
          </button>
          {calendarOpen && (
            <CalendarPopup
              onSelect={handleDateSelect}
              onClose={() => setCalendarOpen(false)}
              selectedDates={selectedDates}
            />
          )}
        </div>
        <div className="mb-2">
          <div
            className="text-black text-[15px] font-medium mb-1"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            Pick Up
          </div>
          <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2 text-gray-500 text-[15px] font-medium border border-gray-200">
            <span
              className="flex-1"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              {pickupAddress}
            </span>
            <span
              className="ml-2 cursor-pointer"
              onClick={() => setPickupPickerOpen(true)}
            >
              {/* Pencil SVG */}
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path
                  d="M15.232 6.232l2.536 2.536M5 19h3.75a2 2 0 0 0 1.414-.586l8.25-8.25a2 2 0 0 0 0-2.828l-2.25-2.25a2 2 0 0 0-2.828 0l-8.25 8.25A2 2 0 0 0 5 15.25V19z"
                  stroke="#BDBDBD"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
        <div className="mb-2">
          <div
            className="text-black text-[15px] font-medium mb-1"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            Drop Off
          </div>
          <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2 text-gray-500 text-[15px] font-medium border border-gray-200">
            <span
              className="flex-1"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              {dropoffAddress}
            </span>
            <span
              className="ml-2 cursor-pointer"
              onClick={() => setDropoffPickerOpen(true)}
            >
              {/* Pencil SVG */}
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path
                  d="M15.232 6.232l2.536 2.536M5 19h3.75a2 2 0 0 0 1.414-.586l8.25-8.25a2 2 0 0 0 0-2.828l-2.25-2.25a2 2 0 0 0-2.828 0l-8.25 8.25A2 2 0 0 0 5 15.25V19z"
                  stroke="#BDBDBD"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
        <div
          className="text-[13px] text-black mb-4 mt-2"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          Your location will revert to{" "}
          <a href="#" className="underline text-black font-medium">
            primary address
          </a>{" "}
          on days not selected.
        </div>
        <div className="flex gap-3 mt-2">
          <button
            className="flex-1 bg-[#E8B600] text-white font-bold text-[16px] rounded-full py-2 transition"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            Save
          </button>
          <button
            className="flex-1 border border-[#E8B600] text-[#E8B600] font-bold text-[16px] rounded-full py-2 bg-white transition"
            style={{ fontFamily: "Satoshi, sans-serif" }}
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </div>
        <MapAddressPicker
          open={pickupPickerOpen}
          onClose={() => setPickupPickerOpen(false)}
          onConfirm={(address, latlng) => {
            setPickupAddress(address);
            setPickupLatLng(latlng);
            setPickupPickerOpen(false);
          }}
          initialLatLng={pickupLatLng}
        />
        <MapAddressPicker
          open={dropoffPickerOpen}
          onClose={() => setDropoffPickerOpen(false)}
          onConfirm={(address, latlng) => {
            setDropoffAddress(address);
            setDropoffLatLng(latlng);
            setDropoffPickerOpen(false);
          }}
          initialLatLng={dropoffLatLng}
        />
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-[20px] shadow-lg p-4 w-full mx-auto border border-gray-200"
      style={{ boxShadow: "0 8px 32px 0 rgba(0,0,0,0.12)" }}
    >
      <div
        className="text-black text-[18px] font-semibold pt-2 pb-2"
        style={{ fontFamily: "Spartan, sans-serif" }}
      >
        Manage Pickup & Drop Off
      </div>
      <div className="mb-2">
        <div
          className="text-black text-[15px] font-medium mb-1"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          Pick Up
        </div>
        <div
          className="bg-gray-100 rounded-xl px-3 py-2 text-gray-500 text-[15px] font-medium"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          32, AB Villa, 1st Cross, Mico Layout, Madiwala, Bangalore.
        </div>
      </div>
      <div className="mb-4">
        <div
          className="text-black text-[15px] font-medium mb-1"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          Drop Off
        </div>
        <div
          className="bg-gray-100 rounded-xl px-3 py-2 text-gray-500 text-[15px] font-medium"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          Same as pick up address
        </div>
      </div>
      <div className="flex gap-3">
        <button
          className="flex-1 bg-[#E8B600] text-white font-bold text-[16px] rounded-full py-2 transition"
          style={{ fontFamily: "Satoshi, sans-serif" }}
          onClick={() => setEditMode(true)}
        >
          Edit Address
        </button>
        <button
          className="flex-1 border border-[#E8B600] text-[#E8B600] font-bold text-[16px] rounded-full py-2 bg-white transition"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          Pause Service
        </button>
      </div>
    </div>
  );
}
