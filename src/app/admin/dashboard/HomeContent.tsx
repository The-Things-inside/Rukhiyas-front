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

interface Bus {
  id: number;
  route: string;
  reg_no: string;
  model: string;
  capacity: number;
  driver_name: string;
  driver_phonenumber: string | null;
  driver_photo_url: string | null;
  on_duty: boolean;
  total_occupancy: number;
}

const dropdownItems = [
  { key: "new", label: "New Registrations", count: 0 },
  { key: "bus", label: "Bus Assignments", count: 0 },
  { key: "parent", label: "Parent Requests", count: 0 },
];

function BusSelect({
  value,
  onChange,
  open,
  setOpen,
  buses,
}: {
  value: string;
  onChange: (v: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  buses: Bus[];
}) {
  const [search, setSearch] = useState("");
  const formattedBuses = buses.map((b) => `bus ${b.id}, ${b.route}`);
  const filtered = formattedBuses.filter((b) =>
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
  const [unassignedStudents, setUnassignedStudents] = useState<Student[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busSelections, setBusSelections] = useState<string[]>([]);
  const [busDropdowns, setBusDropdowns] = useState<boolean[]>([]);
  const [editingFeeIdx, setEditingFeeIdx] = useState<number | null>(null);
  const [feeInput, setFeeInput] = useState<string>("");
  const [updatingFee, setUpdatingFee] = useState<number | null>(null);
  const [assigningBus, setAssigningBus] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [busAssignmentSelections, setBusAssignmentSelections] = useState<
    string[]
  >([]);
  const [busAssignmentDropdowns, setBusAssignmentDropdowns] = useState<
    boolean[]
  >([]);

  const [parentRequests, setParentRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await axios.get(
          "https://13.235.104.94/admin/buses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "application/json",
            },
          }
        );
        setBuses(response.data);
      } catch (err) {
        console.error("Failed to fetch buses:", err);
      }
    };
    fetchBuses();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      let url: string;
      const endpointKey = selected.key;

      if (endpointKey === "new") {
        url = "https://13.235.104.94/admin/students/no-fees";
      } else if (endpointKey === "bus") {
        url = "https://13.235.104.94/admin/students/unassigned";
      } else if (endpointKey === "parent") {
        const fetchParentRequests = async () => {
          setLoading(true);
          setError(null);
          try {
            const token = localStorage.getItem("access_token");
            if (!token) throw new Error("No access token found");
            const response = await axios.get(
              "https://13.235.104.94/admin/requests/pending",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  accept: "application/json",
                },
              }
            );
            setParentRequests(response.data);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch parent requests");
          } finally {
            setLoading(false);
          }
        };
        fetchParentRequests();
        return;
      } else {
        setStudents([]);
        setUnassignedStudents([]);
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        });

        const data = response.data;

        if (endpointKey === "new") {
          setStudents(data);
          setBusSelections(data.map(() => ""));
          setBusDropdowns(data.map(() => false));
        } else if (endpointKey === "bus") {
          setUnassignedStudents(data);
          setBusAssignmentSelections(data.map(() => ""));
          setBusAssignmentDropdowns(data.map(() => false));
        } else if (endpointKey === "parent") {
          setParentRequests(data);
        }
        
        setSelected(prev => ({...prev, count: data.length}));

      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selected.key, refreshKey]);

  const handleSelect = (item: (typeof dropdownItems)[0]) => {
    setSelected(item);
    setDropdownOpen(false);
  };

  const handleAssignBus = async (studentId: number, busSelection: string) => {
    if (!busSelection) {
      alert("Please select a bus to assign.");
      return;
    }

    const busIdString = busSelection.split(",")[0].replace("bus ", "").trim();
    const busId = parseInt(busIdString, 10);

    if (isNaN(busId)) {
      alert("Invalid bus selection.");
      return;
    }

    setAssigningBus(studentId);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No access token found");
      }

      await axios.put(
        `https://13.235.104.94/admin/students/${studentId}/assign-bus/${busId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        }
      );

      // Refresh the data by changing the key
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (err) {
      console.error("Failed to assign bus:", err);
      alert("Failed to assign bus. Please try again.");
    } finally {
      setAssigningBus(null);
    }
  };

  const handleUpdateFee = async (studentId: number, actualFees: number) => {
    setUpdatingFee(studentId);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.patch(
        `https://13.235.104.94/admin/students/${studentId}/update-fees`,
        {
          actual_fees: actualFees,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      // If successful, reload the page to get updated data
      window.location.reload();
    } catch (err) {
      console.error("Failed to update fee:", err);
      alert("Failed to update fee. Please try again.");
    } finally {
      setUpdatingFee(null);
    }
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
        ? unassignedStudents.map((student, idx) => (
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
              <div className="mb-3">
                <span className="text-[#9B9B9B] text-[15px] font-medium font-satoshi">
                  Assign Bus/Route
                </span>
                <div className="mt-1">
                  <div
                    className={
                      busAssignmentDropdowns[idx]
                        ? "bg-[#FFF8E1] border border-[#E8B600] rounded-xl shadow-lg transition-all"
                        : ""
                    }
                  >
                    <BusSelect
                      value={busAssignmentSelections[idx]}
                      onChange={(bus) => {
                        setBusAssignmentSelections((prev) => {
                          const copy = [...prev];
                          copy[idx] = bus;
                          return copy;
                        });
                      }}
                      open={busAssignmentDropdowns[idx]}
                      setOpen={(v) =>
                        setBusAssignmentDropdowns((prev) =>
                          prev.map((open, i) => (i === idx ? v : open))
                        )
                      }
                      buses={buses}
                    />
                  </div>
                </div>
              </div>
              <button
                className="w-full bg-[#E8B600] text-white font-bold rounded-full py-3 text-[18px] font-satoshi mt-2 disabled:opacity-50"
                onClick={() =>
                  handleAssignBus(student.id, busAssignmentSelections[idx])
                }
                disabled={assigningBus === student.id}
              >
                {assigningBus === student.id ? "Assigning..." : "Assign Bus"}
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
                      disabled={updatingFee === student.id}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex-1 bg-[#E8B600] text-white font-bold rounded-full py-2 text-[16px] font-satoshi disabled:opacity-50"
                      onClick={() => {
                        const feeAmount = parseFloat(feeInput);
                        if (isNaN(feeAmount) || feeAmount <= 0) {
                          alert("Please enter a valid fee amount");
                          return;
                        }
                        handleUpdateFee(student.id, feeAmount);
                      }}
                      disabled={updatingFee === student.id}
                    >
                      {updatingFee === student.id ? "Updating..." : "Confirm Fee"}
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
          : selected.key === "parent"
            ? parentRequests.filter(r => r.request_type === "temporary_address").map((req) => (
                <div
                  key={req.id}
                  className="border border-[#E8B600] rounded-xl px-4 py-3 mb-4 bg-white max-w-sm mx-auto shadow-sm"
                  style={{ boxShadow: '0 2px 8px 0 #E8B60022' }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#E8B600] text-[15px] font-medium font-satoshi">
                      Temp Address Change
                    </span>
                    <span className="text-[#9B9B9B] text-[15px] font-medium font-satoshi">
                      {req.created_at ? new Date(req.created_at).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#19191F] text-[16px] font-bold font-satoshi">
                      Name
                    </span>
                    <span className="text-[#19191F] text-[16px] font-bold font-satoshi">
                      ID No.
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#19191F] text-[15px] font-satoshi">
                      {req.student_name || "-"}
                    </span>
                    <span className="text-[#19191F] text-[15px] font-satoshi">
                      {req.student_id}
                    </span>
                  </div>
                  <div className="mb-1">
                    <span className="text-[#9B9B9B] text-[15px] font-medium font-satoshi">
                      School
                    </span>
                    <div className="text-[#19191F] text-[15px] font-bold font-satoshi">
                      {req.school_name || "-"}
                    </div>
                  </div>
                  <div className="mb-1">
                    <span className="text-[#9B9B9B] text-[15px] font-medium font-satoshi">
                      Address
                    </span>
                    <div className="text-[#19191F] text-[15px] font-bold font-satoshi">
                      {req.current_data}
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#E8B600] bg-[#FAFAFA] p-3 mt-3 mb-3">
                    <div className="mb-2">
                      <span className="text-[#9B9B9B] text-[15px] font-medium font-satoshi">
                        New Pick Up
                      </span>
                      <div className="bg-[#E0E0E0] rounded-lg px-3 py-2 text-[#19191F] text-[15px] font-satoshi mt-1">
                        {req.requested_data}
                      </div>
                    </div>
                    <div className="mb-2">
                      <span className="text-[#9B9B9B] text-[15px] font-medium font-satoshi">
                        New Drop Off
                      </span>
                      <div className="bg-[#E0E0E0] rounded-lg px-3 py-2 text-[#19191F] text-[15px] font-satoshi mt-1">
                        Same as pick up address
                      </div>
                    </div>
                    <div>
                      <span className="text-[#9B9B9B] text-[15px] font-medium font-satoshi">
                        Dates
                      </span>
                      <div className="bg-[#E0E0E0] rounded-lg px-3 py-2 text-[#19191F] text-[15px] font-satoshi mt-1">
                        {Array.isArray(req.temp_dates) ? req.temp_dates.map((d: string) => new Date(d).toLocaleDateString()).join(", ") : "-"}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <button className="flex-1 bg-[#E8B600] text-white font-bold rounded-full py-2 text-[16px] font-satoshi">
                      Confirm
                    </button>
                    <button className="flex-1 border border-[#E8B600] text-[#E8B600] font-bold rounded-full py-2 text-[16px] bg-white font-satoshi">
                      Deny
                    </button>
                  </div>
              </div>
            ))
          : null}
    </div>
  );
}
