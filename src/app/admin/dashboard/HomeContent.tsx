import React, { useState, useEffect } from "react";
import axios from "axios";

interface Student {
  id: number;
  parent_id: number;
  school_id: number;
  bus_id: number | null;
  full_name: string;
  class_name: string;
  division: string;
  student_address: string;
  location_latitude: number;
  location_longitude: number;
  approximate_fees: number;
  actual_fees: number | null;
  profile_picture_url: string | null;
  is_submitted: boolean;
  is_paid: boolean;
  created_at: string;
}

const dropdownItems = [
  { key: "new", label: "New Registrations", count: 0 },
  { key: "bus", label: "Bus Assignments", count: 0 },
  { key: "parent", label: "Parent Requests", count: 0 },
];

const busOptions = [
  "Bus 1. Peringadi - Mahe",
  "Bus 2. Azhiyur - Mahe",
  "Bus 3. Manjakkal - Mahe",
];

function BusSelect({
  value,
  onChange,
  open,
  setOpen,
}: {
  value: string;
  onChange: (v: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = busOptions.filter((b) =>
    b.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <button
        type="button"
        className={`w-full border border-[#D9D9D9] rounded-xl px-4 py-3 text-[#19191F] text-[15px] font-satoshi bg-[#FAFAFA] flex items-center justify-between focus:outline-none ${open ? "rounded-b-none" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span className={value ? "text-[#19191F]" : "text-[#9B9B9B]"}>
          {value || "Select bus/route"}
        </span>
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="#19191F]"
          strokeWidth="2"
          viewBox="0 0 24 24"
          className={`transition-transform duration-200 ml-2 ${open ? "rotate-180" : "rotate-0"}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="bg-white border border-t-0 border-[#D9D9D9] rounded-b-xl shadow-lg">
          <input
            className="w-full px-4 py-3 border-b border-[#F3F3F3] rounded-t-xl text-[15px] font-satoshi focus:outline-none text-[#19191F]"
            placeholder="Start typing to search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          {filtered.length === 0 && (
            <div className="px-4 py-3 text-[#9B9B9B] text-[15px] font-satoshi">
              No buses found
            </div>
          )}
          {filtered.map((bus) => (
            <div
              key={bus}
              className="px-4 py-3 cursor-pointer hover:bg-[#FAFAFA] text-[15px] font-satoshi text-[#19191F]"
              onClick={() => {
                onChange(bus);
                setOpen(false);
                setSearch("");
              }}
            >
              {bus}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomeContent() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setSelected] = useState(dropdownItems[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busSelections, setBusSelections] = useState<string[]>([]);
  const [busDropdowns, setBusDropdowns] = useState<boolean[]>([]);
  const [editingFeeIdx, setEditingFeeIdx] = useState<number | null>(null);
  const [feeInput, setFeeInput] = useState<string>("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await axios.get(
          "https://13.235.104.94/admin/students/no-fees",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "application/json",
            },
          }
        );

        setStudents(response.data);
        setBusSelections(response.data.map(() => ""));
        setBusDropdowns(response.data.map(() => false));

        // Update dropdown counts
        const newDropdownItems = dropdownItems.map((item) => ({
          ...item,
          count: response.data.length,
        }));
        setSelected(newDropdownItems[0]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch students"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleSelect = (item: (typeof dropdownItems)[0]) => {
    setSelected(item);
    setDropdownOpen(false);
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="text-[#19191F] text-[18px] font-satoshi">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="text-red-500 text-[18px] font-satoshi">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-6 px-2 py-4 overflow-y-auto">
      {/* Dynamic Dropdown Card */}
      <div className="mb-2">
        <button
          className={`w-full bg-[#FFF8E1] border border-[#E8B600] rounded-t-xl px-4 py-3 flex items-center justify-between ${dropdownOpen ? "rounded-b-none" : "rounded-b-xl"}`}
          onClick={() => setDropdownOpen((open) => !open)}
        >
          <div className="text-[18px] font-medium font-spartan font-satoshi text-[#19191F] flex items-center gap-2">
            {selected.label}
            <span className="text-[#E8B600] font-bold text-[22px] font-satoshi">
              {selected.count}
            </span>
          </div>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#19191F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : "rotate-0"}`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        {dropdownOpen && (
          <div className="bg-white border-x border-b border-[#E8B600] rounded-b-xl px-4 divide-y divide-[#F3F3F3]">
            {dropdownItems
              .filter((item) => item.key !== selected.key)
              .map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-3 cursor-pointer hover:bg-[#FFF8E1]"
                  onClick={() => handleSelect(item)}
                >
                  <span className="text-[18px] font-medium font-spartan font-satoshi text-[#19191F] flex items-center gap-2">
                    {item.label}
                  </span>
                  <span className="text-[#E8B600] font-bold text-[22px] font-satoshi">
                    {item.count}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
      {/* Conditional Content */}
      {selected.key === "bus"
        ? students.map((student, idx) => (
            <div
              key={student.id}
              className="border border-[#E8B600] rounded-xl px-4 py-3 mb-4 bg-white"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#9B9B9B] text-[15px] font-medium font-satoshi">
                  Name
                </span>
                <span className="text-[#9B9B9B] text-[15px] font-medium font-satoshi">
                  {new Date(student.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="text-[#19191F] text-[16px] font-bold mb-2 font-satoshi">
                {student.full_name}
              </div>
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="text-[#9B9B9B] text-[15px] font-medium font-satoshi">
                    School
                  </span>
                  <div className="text-[#19191F] text-[15px] font-bold font-satoshi">
                    School ID: {student.school_id}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[#9B9B9B] text-[15px] font-medium font-satoshi">
                    ID No.
                  </span>
                  <div className="text-[#19191F] text-[15px] font-bold font-satoshi">
                    {student.id}
                  </div>
                </div>
              </div>
              <div className="mb-1">
                <span className="text-[#9B9B9B] text-[15px] font-medium font-satoshi">
                  Address
                </span>
                <div className="text-[#19191F] text-[15px] font-bold font-satoshi">
                  {student.student_address}
                </div>
              </div>
              <div className="mb-3">
                <span className="text-[#9B9B9B] text-[15px] font-medium font-satoshi">
                  Assign Bus/Route
                </span>
                <div className="mt-1">
                  <div
                    className={
                      busDropdowns[idx]
                        ? "bg-[#FFF8E1] border border-[#E8B600] rounded-xl shadow-lg transition-all"
                        : ""
                    }
                  >
                    <BusSelect
                      value={busSelections[idx]}
                      onChange={(bus) => {
                        setBusSelections((prev) => {
                          const copy = [...prev];
                          copy[idx] = bus;
                          return copy;
                        });
                      }}
                      open={busDropdowns[idx]}
                      setOpen={(v) =>
                        setBusDropdowns((prev) =>
                          prev.map((open, i) => (i === idx ? v : open))
                        )
                      }
                    />
                  </div>
                </div>
              </div>
              <button className="w-full bg-[#E8B600] text-white font-bold rounded-full py-3 text-[18px] font-satoshi mt-2">
                Assign Bus
              </button>
            </div>
          ))
        : selected.key === "new"
          ? students.map((student, idx) => (
              <div
                key={student.id}
                className="border border-[#E8B600] rounded-xl px-4 py-3 mb-2 bg-white"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#9B9B9B] text-[15px] font-medium font-satoshi">
                    Name
                  </span>
                  <span className="text-[#9B9B9B] text-[15px] font-medium font-satoshi">
                    {new Date(student.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-[#19191F] text-[16px] font-bold mb-2 font-satoshi">
                  {student.full_name}
                </div>
                <div className="flex gap-8 mb-1">
                  <div>
                    <span className="text-[#9B9B9B] text-[15px] font-medium font-satoshi">
                      Class
                    </span>
                    <div className="text-[#19191F] text-[15px] font-bold font-satoshi">
                      {student.class_name} {student.division}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#9B9B9B] text-[15px] font-medium font-satoshi">
                      School
                    </span>
                    <div className="text-[#19191F] text-[15px] font-bold font-satoshi">
                      School ID: {student.school_id}
                    </div>
                  </div>
                </div>
                <div className="mb-1">
                  <span className="text-[#9B9B9B] text-[15px] font-medium font-satoshi">
                    Address
                  </span>
                  <div className="text-[#19191F] text-[15px] font-bold font-satoshi">
                    {student.student_address}
                  </div>
                </div>
                <div className="mb-2">
                  <span className="text-[#9B9B9B] text-[15px] font-medium font-satoshi">
                    Exact Fee
                  </span>
                  {editingFeeIdx === idx ? (
                    <input
                      className="w-full px-3 py-2 border border-[#E8B600] rounded-lg text-[15px] font-satoshi mt-1 text-[#19191F]"
                      value={feeInput}
                      onChange={(e) => setFeeInput(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <div className="text-[#19191F] text-[15px] font-bold font-satoshi">
                      ₹{student.approximate_fees}/month
                    </div>
                  )}
                </div>
                {editingFeeIdx === idx ? (
                  <div className="flex gap-4 mt-2">
                    <button
                      className="flex-1 border border-[#E8B600] text-[#E8B600] font-bold rounded-full py-2 text-[16px] bg-white font-satoshi"
                      onClick={() => setEditingFeeIdx(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex-1 bg-[#E8B600] text-white font-bold rounded-full py-2 text-[16px] font-satoshi"
                      onClick={() => {
                        // Save logic can be added here
                        setEditingFeeIdx(null);
                        // Optionally update the student's fee in state
                      }}
                    >
                      Confirm Fee
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-4 mt-2">
                    <button
                      className="flex-1 bg-[#E8B600] text-white font-bold rounded-full py-2 text-[16px] font-satoshi"
                      onClick={() => {
                        setEditingFeeIdx(idx);
                        setFeeInput(student.approximate_fees.toString());
                      }}
                    >
                      Edit Fee
                    </button>
                    <button className="flex-1 border border-[#E8B600] text-[#E8B600] font-bold rounded-full py-2 text-[16px] bg-white font-satoshi">
                      Confirm Fee
                    </button>
                  </div>
                )}
              </div>
            ))
          : null}
    </div>
  );
}
