"use client";
import React, { useCallback, useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import AdminBusTrackPanel from "@/components/admin/AdminBusTrackPanel";
import AdminCreateBusSheet from "@/components/admin/AdminCreateBusSheet";
import {
  fetchAdminBuses,
  fetchBusTodayHistory,
  recordBusArrivedSchool,
  recordBusDepartedSchool,
  recordBusStart,
  type AdminBus,
  type BusTodayHistory,
} from "@/lib/admin-buses";

type Bus = AdminBus;

function FleetList() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editBusId, setEditBusId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [trackingBusId, setTrackingBusId] = useState<number | null>(null);
  const [todayHistory, setTodayHistory] = useState<
    Record<number, BusTodayHistory | null>
  >({});
  const [historyLoadingId, setHistoryLoadingId] = useState<number | null>(null);
  const [historyErrors, setHistoryErrors] = useState<Record<number, string>>(
    {},
  );
  const [startLoading, setStartLoading] = useState<number | null>(null);
  const [arrivedLoading, setArrivedLoading] = useState<number | null>(null);
  const [departedLoading, setDepartedLoading] = useState<number | null>(null);
  const [actionMsg, setActionMsg] = useState<Record<number, string>>({});
  const [createOpen, setCreateOpen] = useState(false);

  const loadBuses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminBuses();
      setBuses(data);
    } catch (err) {
      setBuses([]);
      setError(
        err instanceof Error ? err.message : "Failed to load bus list",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBuses();
  }, [loadBuses]);

  const handleEdit = (bus: Bus) => {
    setEditBusId(bus.id);
    setEditForm({
      driver_name: bus.driver_name || "",
      driver_phonenumber: bus.driver_phonenumber || "",
      reg_no: bus.reg_no || "",
      route: bus.route || "",
      total_occupancy: bus.total_occupancy || 0,
      on_duty: bus.on_duty ? "active" : "inactive",
      driver_photo_url: bus.driver_photo_url || "",
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm((prev: any) => ({ ...prev, on_duty: e.target.value }));
  };

  const handleCancel = () => {
    setEditBusId(null);
    setEditForm({});
  };

  const handleSave = async (busId: number) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");
      const formData = new FormData();
      formData.append("reg_no", editForm.reg_no);
      formData.append("capacity", "" + (editForm.capacity || ""));
      formData.append("driver_name", editForm.driver_name);
      formData.append("driver_phonenumber", editForm.driver_phonenumber);
      formData.append("route", editForm.route);
      formData.append("on_duty", editForm.on_duty === "active" ? "true" : "false");
      if (editForm.driver_photo_file) {
        formData.append("driver_photo", editForm.driver_photo_file);
      }
      const res = await fetch(`/api/backend/buses/bus/${busId}`, {
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to update bus");
      const updated = await res.json();
      setBuses((prev: Bus[]) =>
        prev.map((b: Bus) => (b.id === busId ? { ...b, ...updated.bus } : b)),
      );
      setEditBusId(null);
      setEditForm({});
      await loadBuses();
    } catch (err) {
      alert("Failed to update bus info. Please try again.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setEditForm((prev: any) => ({ ...prev, driver_photo_url: ev.target?.result }));
      };
      reader.readAsDataURL(file);
      setEditForm((prev: any) => ({ ...prev, driver_photo_file: file }));
    }
  };

  const loadTodayHistory = async (busId: number) => {
    setHistoryLoadingId(busId);
    setHistoryErrors((prev) => {
      const next = { ...prev };
      delete next[busId];
      return next;
    });
    try {
      const data = await fetchBusTodayHistory(busId);
      setTodayHistory((prev) => ({ ...prev, [busId]: data }));
    } catch (err) {
      setHistoryErrors((prev) => ({
        ...prev,
        [busId]:
          err instanceof Error ? err.message : "Failed to load trip history",
      }));
    } finally {
      setHistoryLoadingId(null);
    }
  };

  const handleTrackBus = async (busId: number) => {
    if (trackingBusId === busId) {
      setTrackingBusId(null);
      return;
    }
    setTrackingBusId(busId);
    if (todayHistory[busId] === undefined) {
      await loadTodayHistory(busId);
    }
  };

  const applyHistory = (busId: number, history: BusTodayHistory, message: string) => {
    setTodayHistory((prev) => ({ ...prev, [busId]: history }));
    setTrackingBusId(busId);
    setActionMsg((prev) => ({ ...prev, [busId]: message }));
  };

  const handleBusStart = async (busId: number) => {
    setStartLoading(busId);
    setActionMsg((prev) => {
      const next = { ...prev };
      delete next[busId];
      return next;
    });
    try {
      const history = await recordBusStart(busId);
      applyHistory(busId, history, "Bus start recorded.");
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Failed to record bus start.",
      );
    } finally {
      setStartLoading(null);
    }
  };

  const handleBusArrived = async (busId: number) => {
    setArrivedLoading(busId);
    setActionMsg((prev) => {
      const next = { ...prev };
      delete next[busId];
      return next;
    });
    try {
      const history = await recordBusArrivedSchool(busId);
      applyHistory(busId, history, "Arrived at school recorded.");
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Failed to record bus arrival.",
      );
    } finally {
      setArrivedLoading(null);
    }
  };

  const handleBusDeparted = async (busId: number) => {
    setDepartedLoading(busId);
    setActionMsg((prev) => {
      const next = { ...prev };
      delete next[busId];
      return next;
    });
    try {
      const history = await recordBusDepartedSchool(busId);
      applyHistory(busId, history, "Departed school recorded.");
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Failed to record bus departure.",
      );
    } finally {
      setDepartedLoading(null);
    }
  };

  if (loading) {
    return (
      <div
        className="py-10 text-center text-[#19191F]"
        style={{ fontFamily: "Satoshi, sans-serif" }}
      >
        Loading…
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] p-4 pb-[max(7rem,env(safe-area-inset-bottom,1.5rem))] md:pb-8 md:p-6">
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="rounded-full bg-[#E8B600] px-6 py-2.5 text-[16px] font-bold text-white shadow transition active:scale-95"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          + Add Bus
        </button>
      </div>

      <AdminCreateBusSheet
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={loadBuses}
      />

      {error && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          {error}
        </p>
      )}
      {!error && buses.length === 0 ? (
        <div
          className="text-center text-[#19191F]"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          No buses found.
        </div>
      ) : (
        buses.map((bus: Bus) => (
        <div
          key={bus.id}
            className="relative mb-6 rounded-2xl border border-[#E8B600] bg-white p-4 shadow"
          >
            {editBusId === bus.id ? (
              <>
                {/* Editable Card */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold text-[#19191F] font-satoshi">Bus {bus.id}</span>
                </div>
                <div className="flex flex-col items-center mb-4">
                  <div className="relative group">
                    <img src={editForm.driver_photo_url || "/assets/DP.svg"} alt="Driver" className="w-20 h-20 rounded-full object-cover mx-auto" />
                    <label className="absolute bottom-0 right-0 bg-[#E8B600] rounded-full p-1 cursor-pointer group-hover:scale-110 transition" title="Change photo">
                      <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M12 20h9" stroke="#fff" strokeWidth="2"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" stroke="#fff" strokeWidth="2"/></svg>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-[#9B9B9B] text-sm mb-1">Driver Name</div>
                  <div className="relative">
                    <input
                      className="w-full border rounded-xl px-4 py-2 text-[#19191F] font-satoshi font-medium pr-10"
                      name="driver_name"
                      value={editForm.driver_name}
                      onChange={handleEditChange}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E8B600]">
                      <svg width="18" height="18" fill="none" stroke="#E8B600" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
                    </span>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-[#9B9B9B] text-sm mb-1">Phone Number</div>
                  <div className="relative">
                    <input
                      className="w-full border rounded-xl px-4 py-2 text-[#19191F] font-satoshi font-medium pr-10"
                      name="driver_phonenumber"
                      value={editForm.driver_phonenumber}
                      onChange={handleEditChange}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E8B600]">
                      <svg width="18" height="18" fill="none" stroke="#E8B600" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
                    </span>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-[#9B9B9B] text-sm mb-1">Bus Number</div>
                  <div className="relative">
                    <input
                      className="w-full border rounded-xl px-4 py-2 text-[#19191F] font-satoshi font-medium pr-10"
                      name="reg_no"
                      value={editForm.reg_no}
                      onChange={handleEditChange}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E8B600]">
                      <svg width="18" height="18" fill="none" stroke="#E8B600" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
                    </span>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-[#9B9B9B] text-sm mb-1">Bus Route</div>
                  <div className="relative">
                    <input
                      className="w-full border rounded-xl px-4 py-2 text-[#19191F] font-satoshi font-medium pr-10"
                      name="route"
                      value={editForm.route}
                      onChange={handleEditChange}
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-[#9B9B9B] text-sm mb-1">Number of Students</div>
                  <div className="relative">
                    <input
                      className="w-full border rounded-xl px-4 py-2 text-[#19191F] font-satoshi font-medium pr-10"
                      name="total_occupancy"
                      type="number"
                      value={editForm.total_occupancy}
                      onChange={handleEditChange}
                    />
                  </div>
                </div>
                {/* Status Section */}
                <div className="mb-4">
                  <div className="text-[#9B9B9B] text-sm mb-1">Status</div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="on_duty"
                        value="active"
                        checked={editForm.on_duty === "active"}
                        onChange={handleStatusChange}
                      />
                      <span className="text-[#19191F] font-satoshi">Activate</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="on_duty"
                        value="inactive"
                        checked={editForm.on_duty === "inactive"}
                        onChange={handleStatusChange}
                      />
                      <span className="text-[#19191F] font-satoshi">Deactivate</span>
                    </label>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  <button onClick={() => handleSave(bus.id)} className="flex-1 bg-[#E8B600] text-white font-bold rounded-full py-2 font-satoshi shadow active:scale-95 transition">Save</button>
                  <button onClick={handleCancel} className="flex-1 border border-[#E8B600] text-[#E8B600] font-bold rounded-full py-2 font-satoshi shadow active:scale-95 transition bg-white">Cancel</button>
                </div>
              </>
            ) : (
              <>
                {/* View Card */}
                {/* Title and Status */}
          <div className="mb-2 flex items-center justify-between">
                  <span className="text-lg font-bold text-[#19191F] font-satoshi">Bus {bus.id}</span>
                  <span className={`text-sm font-bold font-satoshi ${bus.on_duty ? "text-[#E8B600]" : "text-[#9B9B9B]"}`}>
                    {bus.on_duty ? "On Duty" : "Off Duty"}
                  </span>
          </div>
                {/* Driver Image and Name */}
                <div className="flex items-center gap-3 mb-1">
                  <img src={bus.driver_photo_url || "/assets/DP.svg"} alt="Driver" className="w-16 h-16 rounded-full object-cover" />
            <div>
              <div className="text-xs text-[#9B9B9B] font-satoshi">Driver</div>
                    <div className="text-base font-bold text-[#19191F] font-satoshi">{bus.driver_name || "-"}</div>
                  </div>
            </div>
                {/* Phone and Call Button */}
                <div className="flex items-center justify-between mb-2">
                  <div>
              <div className="text-xs text-[#9B9B9B] font-satoshi">Phone Number</div>
                    <div className="text-base text-[#19191F] font-satoshi">{bus.driver_phonenumber || "-"}</div>
            </div>
                  {bus.driver_phonenumber ? (
                    <a href={`tel:${bus.driver_phonenumber}`} className="border border-[#E8B600] text-[#E8B600] rounded-full px-6 py-1 font-satoshi font-bold text-base">Call</a>
                  ) : (
                    <button className="border border-[#E8B600] text-[#E8B600] rounded-full px-6 py-1 font-satoshi font-bold text-base" disabled>Call</button>
                  )}
          </div>
                {/* Divider */}
                <div className="border-t border-[#E0E0E0] my-2" />
                {/* Bus Info */}
                <div className="flex flex-wrap gap-y-2 mb-2">
                  <div className="w-1/2">
              <div className="text-[#9B9B9B] text-xs">Bus Number</div>
                    <div className="font-medium text-[#19191F]">{bus.reg_no}</div>
            </div>
                  <div className="w-1/2">
              <div className="text-[#9B9B9B] text-xs">Bus Route</div>
                    <div className="font-medium text-[#19191F]">{bus.route}</div>
            </div>
                  <div className="w-full">
              <div className="text-[#9B9B9B] text-xs">Number of Students</div>
                    <div className="font-medium text-[#19191F]">{bus.total_occupancy}</div>
            </div>
          </div>
                {/* Action Buttons */}
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => handleTrackBus(bus.id)}
              className={`flex-1 rounded-full py-2 font-satoshi text-base font-bold shadow transition active:scale-95 ${
                trackingBusId === bus.id
                  ? "border-2 border-[#E8B600] bg-[#FFFAEA] text-[#E8B600]"
                  : "bg-[#E8B600] text-white"
              }`}
            >
              {trackingBusId === bus.id ? "Hide trip" : "Track Bus"}
            </button>
            <button
              type="button"
              onClick={() => handleEdit(bus)}
              className="flex-1 rounded-full border border-[#E8B600] bg-white py-2 font-satoshi text-base font-bold text-[#E8B600] shadow transition active:scale-95"
            >
              Update Info
            </button>
          </div>

          {trackingBusId === bus.id && (
            <AdminBusTrackPanel
              history={todayHistory[bus.id] ?? null}
              loading={historyLoadingId === bus.id}
              error={historyErrors[bus.id]}
            />
          )}

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="flex-1 rounded-full bg-green-500 py-2 font-satoshi text-base font-bold text-white shadow transition active:scale-95 disabled:opacity-60"
              disabled={startLoading === bus.id}
              onClick={() => handleBusStart(bus.id)}
            >
              {startLoading === bus.id ? "Starting…" : "Start"}
            </button>
            <button
              type="button"
              className="flex-1 rounded-full bg-blue-500 py-2 font-satoshi text-base font-bold text-white shadow transition active:scale-95 disabled:opacity-60"
              disabled={arrivedLoading === bus.id}
              onClick={() => handleBusArrived(bus.id)}
            >
              {arrivedLoading === bus.id ? "Arriving…" : "Arrived"}
            </button>
            <button
              type="button"
              className="flex-1 rounded-full bg-gray-500 py-2 font-satoshi text-base font-bold text-white shadow transition active:scale-95 disabled:opacity-60"
              disabled={departedLoading === bus.id}
              onClick={() => handleBusDeparted(bus.id)}
            >
              {departedLoading === bus.id ? "Departing…" : "Departed"}
            </button>
          </div>
          {actionMsg[bus.id] && (
            <p
              className="mt-2 text-center text-[14px] font-medium text-green-600"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              {actionMsg[bus.id]}
            </p>
          )}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default function FleetsPage() {
  return (
    <AdminLayout pageTitle="Bus List" activeTab="fleet" onTabChange={() => {}}>
      <FleetList />
    </AdminLayout>
  );
} 