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
              <button className="flex-1 border border-[#E8B600] text-[#E8B600] font-bold rounded-full py-2 font-satoshi shadow active:scale-95 transition">Update Info</button>
            </div>
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