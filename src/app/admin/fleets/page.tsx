"use client";
import React from "react";
import AdminLayout from "@/components/AdminLayout";

const fleets = [
  {
    id: 1,
    name: "Bus 1",
    status: "On Duty",
    driver: {
      name: "Shane Philip",
      photo: "/assets/DP.svg",
      phone: "9789284587",
    },
    busNumber: "PY 03 A 4854",
    route: "Peringadi - Mahe",
    students: 25,
  },
  {
    id: 3,
    name: "Bus 3",
    status: "Off Duty",
    driver: {
      name: "Wade Warren",
      photo: "/assets/DP.svg",
      phone: "9789284587",
    },
    busNumber: "PY 03 A 6345",
    route: "Chalakkara - Mahe",
    students: 25,
  },
];

function FleetList() {
  return (
    <div className="p-4 bg-[#19191F] min-h-screen">
      <div className="text-white text-2xl font-bold mb-4 font-satoshi">Bus List</div>
      {fleets.map((bus) => (
        <div
          key={bus.id}
          className="bg-white rounded-2xl border border-[#E8B600] mb-6 p-4 shadow relative"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold text-[#19191F] font-satoshi">{bus.name}</span>
            <span className={`text-sm font-bold font-satoshi ${bus.status === "On Duty" ? "text-[#E8B600]" : "text-[#9B9B9B]"}`}>{bus.status}</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <img src={bus.driver.photo} alt="Driver" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="text-xs text-[#9B9B9B] font-satoshi">Driver</div>
              <div className="text-base font-bold text-[#19191F] font-satoshi">{bus.driver.name}</div>
            </div>
            <div className="ml-auto flex flex-col items-end">
              <div className="text-xs text-[#9B9B9B] font-satoshi">Phone Number</div>
              <div className="text-base text-[#19191F] font-satoshi">{bus.driver.phone}</div>
            </div>
            <button className="ml-4 border border-[#E8B600] text-[#E8B600] rounded-full px-5 py-1 font-satoshi font-bold text-base">Call</button>
          </div>
          <div className="flex justify-between text-[#19191F] text-sm font-satoshi border-t border-[#E0E0E0] pt-2 mb-2">
            <div>
              <div className="text-[#9B9B9B] text-xs">Bus Number</div>
              <div>{bus.busNumber}</div>
            </div>
            <div>
              <div className="text-[#9B9B9B] text-xs">Bus Route</div>
              <div>{bus.route}</div>
            </div>
            <div>
              <div className="text-[#9B9B9B] text-xs">Number of Students</div>
              <div>{bus.students}</div>
            </div>
          </div>
          <div className="flex gap-3 mt-2">
            <button className="flex-1 bg-[#E8B600] text-white font-bold rounded-full py-2 font-satoshi shadow active:scale-95 transition">Track Bus</button>
            <button className="flex-1 border border-[#E8B600] text-[#E8B600] font-bold rounded-full py-2 font-satoshi shadow active:scale-95 transition">Update Info</button>
          </div>
        </div>
      ))}
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