import React, { useState, useEffect, useCallback, useMemo } from "react";
import api from "@/lib/api";
import AdminRequestCard from "@/components/admin/AdminRequestCard";
import AdminDashboardTaskCard from "@/components/admin/AdminDashboardTaskCard";
import AdminNewRegistrationCard from "@/components/admin/AdminNewRegistrationCard";
import { fetchAdminBuses, type AdminBus } from "@/lib/admin-buses";
import {
  approveRequest,
  fetchDashboardCounts,
  fetchNewRegistrations,
  fetchPendingRequests,
  fetchUnassignedStudents,
  rejectRequest,
  type AdminRequest,
  type AdminStudent,
  type DashboardCounts,
} from "@/lib/admin-dashboard";

type Student = AdminStudent;

type Bus = AdminBus;

type CategoryKey = "new" | "bus" | "parent";

const CATEGORY_META: { key: CategoryKey; label: string }[] = [
  { key: "new", label: "New Registrations" },
  { key: "bus", label: "Bus Assignments" },
  { key: "parent", label: "Parent Requests" },
];

const SECTION_TITLE: Record<CategoryKey, string> = {
  new: "Student Details",
  bus: "Bus Assignments",
  parent: "Parent Requests",
};

const CONTENT_PANEL =
  "rounded-[24px] border border-[#EAEAEA] bg-white px-4 py-6 shadow-[0_3px_6px_rgba(0,0,0,0.04),0_11px_11px_rgba(0,0,0,0.03)] md:px-6 md:py-6";

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
  const [selectedKey, setSelectedKey] = useState<CategoryKey>("new");
  const [counts, setCounts] = useState<DashboardCounts>({
    newRegistrations: 0,
    busAssignments: 0,
    parentRequests: 0,
  });
  const [countsLoading, setCountsLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [unassignedStudents, setUnassignedStudents] = useState<Student[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
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

  const [parentRequests, setParentRequests] = useState<AdminRequest[]>([]);
  const [approveLoading, setApproveLoading] = useState<number | null>(null);
  const [denyLoading, setDenyLoading] = useState<number | null>(null);

  const categories = useMemo(
    () =>
      CATEGORY_META.map((c) => ({
        ...c,
        count:
          c.key === "new"
            ? counts.newRegistrations
            : c.key === "bus"
              ? counts.busAssignments
              : counts.parentRequests,
      })),
    [counts],
  );

  const selectedCategory = categories.find((c) => c.key === selectedKey);

  const loadCounts = useCallback(async () => {
    setCountsLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardCounts();
      setCounts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard counts",
      );
    } finally {
      setCountsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminBuses()
      .then(setBuses)
      .catch((err) => console.error("Failed to fetch buses:", err));
  }, []);

  useEffect(() => {
    loadCounts();
  }, [loadCounts, refreshKey]);

  useEffect(() => {
    const fetchList = async () => {
      setListLoading(true);
      setError(null);
      try {
        if (selectedKey === "new") {
          const data = await fetchNewRegistrations();
          setStudents(data);
          setBusSelections(data.map(() => ""));
          setBusDropdowns(data.map(() => false));
          setCounts((prev) => ({ ...prev, newRegistrations: data.length }));
        } else if (selectedKey === "bus") {
          const data = await fetchUnassignedStudents();
          setUnassignedStudents(data);
          setBusAssignmentSelections(data.map(() => ""));
          setBusAssignmentDropdowns(data.map(() => false));
          setCounts((prev) => ({ ...prev, busAssignments: data.length }));
        } else if (selectedKey === "parent") {
          const data = await fetchPendingRequests();
          setParentRequests(data);
          setCounts((prev) => ({ ...prev, parentRequests: data.length }));
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch data",
        );
      } finally {
        setListLoading(false);
      }
    };

    fetchList();
  }, [selectedKey, refreshKey]);

  const handleSelect = (key: CategoryKey) => {
    setSelectedKey(key);
    setDropdownOpen(false);
  };

  const handleApproveRequest = async (requestId: number) => {
    setApproveLoading(requestId);
    try {
      await approveRequest(requestId);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve request");
    } finally {
      setApproveLoading(null);
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    setDenyLoading(requestId);
    try {
      await rejectRequest(requestId);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject request");
    } finally {
      setDenyLoading(null);
    }
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

      await api.put(`/admin/students/${studentId}/assign-bus/${busId}`, {}, {
        headers: { Authorization: `Bearer ${token}`, accept: "application/json" },
      });

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

      await api.patch(
        `/admin/students/${studentId}/update-fees`,
        { actual_fees: actualFees },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
            "Content-Type": "application/json",
          },
        },
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

  const displayCount = (count: number) => (countsLoading ? "…" : count);

  const renderListContent = () => {
    if (listLoading) {
      return (
        <p
          className="py-12 text-center text-[#5E5E5E]"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          Loading…
        </p>
      );
    }

    if (selectedKey === "new") {
      return (
        <div className="flex flex-wrap gap-4">
          {students.map((student, idx) => (
            <AdminNewRegistrationCard
              key={student.id}
              student={student}
              editing={editingFeeIdx === idx}
              feeInput={feeInput}
              updating={updatingFee === student.id}
              onFeeInputChange={setFeeInput}
              onEditFee={() => {
                setEditingFeeIdx(idx);
                setFeeInput(student.approximate_fees.toString());
              }}
              onCancelEdit={() => setEditingFeeIdx(null)}
              onConfirmFee={() => {
                const feeAmount = parseFloat(feeInput);
                if (isNaN(feeAmount) || feeAmount <= 0) {
                  alert("Please enter a valid fee amount");
                  return;
                }
                handleUpdateFee(student.id, feeAmount);
              }}
            />
          ))}
          {students.length === 0 && (
            <p
              className="w-full py-8 text-center text-[#5E5E5E]"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              No new registrations
            </p>
          )}
        </div>
      );
    }

    if (selectedKey === "bus") {
      return (
        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
          {unassignedStudents.map((student, idx) => (
            <div
              key={student.id}
              className="w-full rounded-[12px] border border-[#E8B600] bg-white p-4 md:max-w-[339px] md:flex-[1_1_calc(33.333%-11px)] md:min-w-[280px]"
            >
              <div className="mb-1 flex items-center justify-between">
                <span
                  className="text-[16px] text-[#5E5E5E]"
                  style={{ fontFamily: "Satoshi, sans-serif" }}
                >
                  Name
                </span>
                <span
                  className="text-[16px] font-medium text-[#5E5E5E]"
                  style={{ fontFamily: "Satoshi, sans-serif" }}
                >
                  {new Date(student.created_at).toLocaleDateString("en-GB")}
                </span>
              </div>
              <p
                className="mb-3 text-[16px] font-medium text-black"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                {student.full_name}
              </p>
              <div className="mb-3 flex gap-8">
                <div>
                  <span
                    className="text-[16px] text-[#5E5E5E]"
                    style={{ fontFamily: "Satoshi, sans-serif" }}
                  >
                    Class
                  </span>
                  <p
                    className="text-[16px] font-medium text-black"
                    style={{ fontFamily: "Satoshi, sans-serif" }}
                  >
                    {student.class_name} {student.division}
                  </p>
                </div>
                <div>
                  <span
                    className="text-[16px] text-[#5E5E5E]"
                    style={{ fontFamily: "Satoshi, sans-serif" }}
                  >
                    School
                  </span>
                  <p
                    className="text-[16px] font-medium text-black"
                    style={{ fontFamily: "Satoshi, sans-serif" }}
                  >
                    School ID: {student.school_id}
                  </p>
                </div>
              </div>
              <div className="mb-3">
                <span
                  className="text-[16px] text-[#5E5E5E]"
                  style={{ fontFamily: "Satoshi, sans-serif" }}
                >
                  Address
                </span>
                <p
                  className="text-[16px] font-medium text-black"
                  style={{ fontFamily: "Satoshi, sans-serif" }}
                >
                  {student.student_address}
                </p>
              </div>
              <div className="mb-3">
                <span
                  className="mb-1 block text-[16px] text-[#5E5E5E]"
                  style={{ fontFamily: "Satoshi, sans-serif" }}
                >
                  Assign Bus/Route
                </span>
                <div
                  className={
                    busAssignmentDropdowns[idx]
                      ? "rounded-xl border border-[#E8B600] bg-[#FFF8E1] shadow-lg"
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
                        prev.map((open, i) => (i === idx ? v : open)),
                      )
                    }
                    buses={buses}
                  />
                </div>
              </div>
              <button
                type="button"
                className="flex h-11 w-full items-center justify-center rounded-[22px] bg-[#E8B600] text-[18px] font-bold capitalize text-[#FAFAFA] disabled:opacity-50"
                style={{ fontFamily: "Satoshi, sans-serif" }}
                onClick={() =>
                  handleAssignBus(student.id, busAssignmentSelections[idx])
                }
                disabled={assigningBus === student.id}
              >
                {assigningBus === student.id ? "Assigning…" : "Assign Bus"}
              </button>
            </div>
          ))}
          {unassignedStudents.length === 0 && (
            <p
              className="w-full py-8 text-center text-[#5E5E5E]"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              No bus assignments pending
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {parentRequests.map((req) => (
          <AdminRequestCard
            key={req.id}
            request={req}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
            approveLoading={approveLoading}
            denyLoading={denyLoading}
          />
        ))}
        {parentRequests.length === 0 && (
          <p
            className="col-span-full py-8 text-center text-[#5E5E5E]"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            No parent requests
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-[#FAFAFA]">
      <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-4 px-4 py-6 md:gap-4 md:px-0 md:py-6">
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
            {error}
          </p>
        )}

        <div className="hidden gap-4 md:flex">
          {categories.map((cat) => (
            <AdminDashboardTaskCard
              key={cat.key}
              label={cat.label}
              count={displayCount(cat.count)}
              selected={selectedKey === cat.key}
              onClick={() => handleSelect(cat.key)}
            />
          ))}
        </div>

        <div className="mb-2 md:hidden">
          <button
            type="button"
            className={`flex w-full items-center justify-between border border-[#E8B600] bg-[#FFF8E1] px-4 py-3 ${dropdownOpen ? "rounded-t-xl rounded-b-none" : "rounded-xl"}`}
            onClick={() => setDropdownOpen((open) => !open)}
          >
            <div
              className="flex items-center gap-2 text-[18px] font-medium text-[#19191F]"
              style={{ fontFamily: "Spartan, sans-serif" }}
            >
              {selectedCategory?.label}
              <span className="text-[22px] font-bold text-[#E8B600]">
                {displayCount(selectedCategory?.count ?? 0)}
              </span>
            </div>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#19191F"
              strokeWidth="2"
              className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="divide-y divide-[#F3F3F3] rounded-b-xl border border-t-0 border-[#E8B600] bg-white px-4">
              {categories
                .filter((item) => item.key !== selectedKey)
                .map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    className="flex w-full items-center justify-between py-3 text-left hover:bg-[#FFF8E1]"
                    onClick={() => handleSelect(item.key)}
                  >
                    <span
                      className="text-[18px] font-medium text-[#19191F]"
                      style={{ fontFamily: "Spartan, sans-serif" }}
                    >
                      {item.label}
                    </span>
                    <span className="text-[22px] font-bold text-[#E8B600]">
                      {displayCount(item.count)}
                    </span>
                  </button>
                ))}
            </div>
          )}
        </div>

        <div className={CONTENT_PANEL}>
          <h3
            className="mb-4 text-[18px] font-semibold text-black"
            style={{ fontFamily: "Spartan, sans-serif" }}
          >
            {SECTION_TITLE[selectedKey]}
          </h3>
          {renderListContent()}
        </div>
      </div>
    </div>
  );
}
