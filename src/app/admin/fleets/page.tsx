"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";

type Bus = {
  reg_no: string;
  model: string;
  capacity: number;
  driver_name: string;
  driver_phonenumber: string | null;
  route: string;
  id: number;
  driver_photo_url: string | null;
  on_duty: boolean;
  total_occupancy: number;
};

function FleetList() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [editBusId, setEditBusId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");
        const res = await fetch("https://api.rukhiyastravels.com/admin/buses", {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch buses");
        const data = await res.json();
        setBuses(data);
      } catch (err) {
        setBuses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

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
      const res = await fetch(`https://api.rukhiyastravels.com/buses/bus/${busId}`, {
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to update bus");
      const updated = await res.json();
      setBuses((prev) => prev.map((b) => (b.id === busId ? { ...b, ...updated.bus } : b)));
      setEditBusId(null);
      setEditForm({});
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

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-4 bg-white min-h-screen">
      {buses.length === 0 ? (
        <div className="text-center text-[#19191F] font-satoshi">No buses found.</div>
      ) : (
        buses.map((bus) => (
          <div
            key={bus.id}
            className="bg-white rounded-2xl border border-[#E8B600] mb-6 p-4 shadow relative"
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
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold text-[#19191F] font-satoshi">Bus {bus.id}</span>
                  <span className={`text-sm font-bold font-satoshi ${bus.on_duty ? "text-[#E8B600]" : "text-[#9B9B9B]"}`}>{bus.on_duty ? "On Duty" : "Off Duty"}</span>
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
                  <button className="border border-[#E8B600] text-[#E8B600] rounded-full px-6 py-1 font-satoshi font-bold text-base">Call</button>
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
                <div className="flex gap-3 mt-2">
                  <button className="flex-1 bg-[#E8B600] text-white font-bold rounded-full py-2 font-satoshi shadow active:scale-95 transition">Track Bus</button>
                  <button onClick={() => handleEdit(bus)} className="flex-1 border border-[#E8B600] text-[#E8B600] font-bold rounded-full py-2 font-satoshi shadow active:scale-95 transition">Update Info</button>
                </div>
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