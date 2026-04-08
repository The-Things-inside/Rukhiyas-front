"use client";

import React, { useState } from "react";

interface Student {
  id: number;
  full_name: string;
  profile_picture_url: string | null;
  student_address: string;
  temp_address: string | null;
  temp_dates?: string[];
}

interface ManagePickupDropoffCardProps {
  selectedStudent: Student | null;
}

function formatSelectedDates(dates: Date[]): string {
  if (!dates.length) return "Select dates";
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  return dates
    .map((date) => date.toLocaleDateString("en-US", options))
    .join(", ");
}

function formatPauseDuration(dates: Date[]): string {
  if (!dates.length) return "";
  // Format as 'jul1 ,2' for July 1,2
  // Group by month, then join days with comma
  const months: { [key: string]: number[] } = {};
  dates.forEach((date) => {
    const month = date.toLocaleString("en-US", { month: "short" }).toLowerCase();
    if (!months[month]) months[month] = [];
    months[month].push(date.getDate());
  });
  return Object.entries(months)
    .map(([month, days]) => month + days.join(" ,"))
    .join(" ,");
}

function PauseServiceForm({ onCancel, studentId }: { onCancel: () => void; studentId: number }) {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple calendar for current month (reuse from previous code)
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

  function handleDateSelect(date: Date) {
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
  }

  async function handleSave() {
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) throw new Error("No access token found");
      const pause_duration = formatPauseDuration(selectedDates);
      const response = await fetch(`https://backend-rukhiyas-production.up.railway.app/pause-service/${studentId}`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ pause_duration }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail?.[0]?.msg || "Failed to pause service");
      }
      onCancel();
    } catch (err: any) {
      setError(err.message || "Failed to pause service");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 w-full max-w-sm mx-auto">
      <div className="font-bold text-black text-[20px] mb-2" style={{ fontFamily: "Satoshi, sans-serif" }}>Pause Service</div>
      <div className="text-[14px] text-black mb-3" style={{ fontFamily: "Satoshi, sans-serif" }}>
        For any changes within the next 2 days,<br className="sm:hidden" /> please <a href="#" className="underline text-black font-medium">call our agent</a>.
      </div>
      <div className="mb-2">
        <div className="text-black text-[15px] font-medium mb-1" style={{ fontFamily: "Satoshi, sans-serif" }}>Dates</div>
        <button
          type="button"
          className={`flex items-center bg-gray-100 rounded-xl px-3 py-2 text-[15px] font-medium border border-gray-200 w-full text-left ${selectedDates.length === 0 ? "text-gray-400" : "text-gray-500"}`}
          style={{ fontFamily: "Satoshi, sans-serif" }}
          onClick={() => setCalendarOpen((v) => !v)}
        >
          <span className="flex-1">{formatSelectedDates(selectedDates)}</span>
          <span className="ml-2">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="5" width="18" height="16" rx="3" stroke="#BDBDBD" strokeWidth="1.5" />
              <path d="M16 3v4M8 3v4" stroke="#BDBDBD" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M3 9h18" stroke="#BDBDBD" strokeWidth="1.5" />
            </svg>
          </span>
        </button>
        {calendarOpen && (
          <div className="absolute left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-4">
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-gray-400 text-base" style={{ fontFamily: "Satoshi, sans-serif" }}>
              {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
              {weeks.flat().map((day, i) =>
                day ? (
                  <button
                    key={i}
                    className={`rounded-full w-8 h-8 text-[16px] font-bold transition-colors ${isSelected(day) ? "bg-[#E8B600] text-white" : "text-gray-800 hover:bg-gray-100"}`}
                    style={{ fontFamily: "Satoshi, sans-serif" }}
                    onClick={() => handleDateSelect(new Date(year, month, day))}
                  >
                    {day}
                  </button>
                ) : (
                  <div key={i} />
                )
              )}
            </div>
          </div>
        )}
      </div>
      <div className="mb-2">
        <div className="text-black text-[15px] font-medium mb-1" style={{ fontFamily: "Satoshi, sans-serif" }}>Reason <span className="text-gray-400">(Optional)</span></div>
        <textarea
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400 text-black"
          placeholder="Reason"
          value={reason}
          onChange={e => setReason(e.target.value)}
          rows={2}
        />
      </div>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <div className="text-[13px] text-black mb-4 mt-2" style={{ fontFamily: "Satoshi, sans-serif" }}>
        Service will be paused only on selected dates, regular service will resumes on all other days.
      </div>
      <div className="flex gap-3 mt-2">
        <button
          className="flex-1 bg-[#E8B600] text-white font-bold text-[16px] rounded-full py-2 transition"
          style={{ fontFamily: "Satoshi, sans-serif" }}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          className="flex-1 border border-[#E8B600] text-[#E8B600] font-bold text-[16px] rounded-full py-2 bg-white transition"
          style={{ fontFamily: "Satoshi, sans-serif" }}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function ManagePickupDropoffCard({ selectedStudent }: ManagePickupDropoffCardProps) {
  const [pauseOpen, setPauseOpen] = useState(false);
  if (!selectedStudent) {
    return (
      <div className="bg-white rounded-[20px] shadow-lg p-4 w-full mx-auto border border-gray-200 text-center text-gray-500">
        No student selected.
      </div>
    );
  }

  // If temp_address and temp_dates are present, show them for those dates (not implemented here for brevity)
  // For now, just show student_address for both
  const pickupAddress = selectedStudent.student_address || "-";
  const dropoffAddress = selectedStudent.student_address || "-";

  if (pauseOpen) {
    return <PauseServiceForm onCancel={() => setPauseOpen(false)} studentId={selectedStudent.id} />;
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
          {pickupAddress}
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
          {dropoffAddress}
        </div>
      </div>
      <div className="flex gap-3">
        <button
          className="flex-1 bg-[#E8B600] text-white font-bold text-[16px] rounded-full py-2 transition"
          style={{ fontFamily: "Satoshi, sans-serif" }}
          // onClick={() => {}}
        >
          Edit Address
        </button>
        <button
          className="flex-1 border border-[#E8B600] text-[#E8B600] font-bold text-[16px] rounded-full py-2 bg-white transition"
          style={{ fontFamily: "Satoshi, sans-serif" }}
          onClick={() => setPauseOpen(true)}
        >
          Pause Service
        </button>
      </div>
    </div>
  );
}
