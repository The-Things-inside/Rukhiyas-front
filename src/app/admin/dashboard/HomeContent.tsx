import React from "react";

const registrations = [
  {
    name: "Aryan Sharma",
    date: "08/06/2025",
    class: "2 B",
    school: "Avila Primary School",
    address: "32, AB Villa, 1st Cross, Mico Layout, Madiwala, Bangalore.",
    fee: "₹1300/month",
  },
  {
    name: "Aryan Sharma",
    date: "08/06/2025",
    class: "2 B",
    school: "Avila Primary School",
    address: "32, AB Villa, 1st Cross, Mico Layout, Madiwala, Bangalore.",
    fee: "₹1300/month",
  },
];

export default function HomeContent() {
  return (
    <div className="flex-1 min-h-0 flex flex-col gap-6 px-2 py-4 overflow-y-auto">
      {/* New Registrations Card */}
      <div className="bg-[#FFF8E1] border border-[#E8B600] rounded-xl px-4 py-3 flex items-center justify-between mb-2">
        <div className="text-[18px] font-medium font-spartan font-satoshi text-[#19191F] flex items-center gap-2">
          New Registrations
          <span className="text-[#E8B600] font-bold text-[22px] font-satoshi">
            3
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
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      {/* Registration Cards */}
      {registrations.map((reg, idx) => (
        <div
          key={idx}
          className="border border-[#E8B600] rounded-xl px-4 py-3 mb-2 bg-white"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[#9B9B9B] text-[15px] font-medium font-satoshi">
              Name
            </span>
            <span className="text-[#9B9B9B] text-[15px] font-medium font-satoshi">
              {reg.date}
            </span>
          </div>
          <div className="text-[#19191F] text-[16px] font-bold mb-2 font-satoshi">
            {reg.name}
          </div>
          <div className="flex gap-8 mb-1">
            <div>
              <span className="text-[#9B9B9B] text-[15px] font-medium font-satoshi">
                Class
              </span>
              <div className="text-[#19191F] text-[15px] font-bold font-satoshi">
                {reg.class}
              </div>
            </div>
            <div>
              <span className="text-[#9B9B9B] text-[15px] font-medium font-satoshi">
                School
              </span>
              <div className="text-[#19191F] text-[15px] font-bold font-satoshi">
                {reg.school}
              </div>
            </div>
          </div>
          <div className="mb-1">
            <span className="text-[#9B9B9B] text-[15px] font-medium font-satoshi">
              Address
            </span>
            <div className="text-[#19191F] text-[15px] font-bold font-satoshi">
              {reg.address}
            </div>
          </div>
          <div className="mb-2">
            <span className="text-[#9B9B9B] text-[15px] font-medium font-satoshi">
              Estimate Fee
            </span>
            <div className="text-[#19191F] text-[15px] font-bold font-satoshi">
              {reg.fee}
            </div>
          </div>
          <div className="flex gap-4 mt-2">
            <button className="flex-1 bg-[#E8B600] text-white font-bold rounded-full py-2 text-[16px] font-satoshi">
              Edit Fee
            </button>
            <button className="flex-1 border border-[#E8B600] text-[#E8B600] font-bold rounded-full py-2 text-[16px] bg-white font-satoshi">
              Confirm Fee
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
