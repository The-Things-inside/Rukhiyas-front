"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";

interface StudentDetailsProps {
  studentId: number;
  onBack: () => void;
}

export default function StudentDetails({ studentId, onBack }: StudentDetailsProps) {
  // Dummy data for demonstration
  const student = {
    id: 456,
    name: "Aryan Sharma",
    class: "2 B",
    school: "Avila Primary School",
    address: "32, AB Villa, 1st Cross, Mico Layout, Madiwala, Bangalore.",
    bus: "Bus 2. Azhiyur - Mahe",
    emergency: "9988667755",
    profile: "/assets/DP.svg",
  };
  const parent = {
    name: "Priya Sharma",
    profile: "/assets/DP.svg",
    primary: "9988667755",
    alternate: "9768568754",
    email: "priyasharma@gmail.com",
    address: "32, AB Villa, 1st Cross, Mico Layout, Madiwala, Bangalore.",
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F8F8] py-8 flex-col gap-6">
      {/* Student Details Card */}
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[340px] relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[18px] font-bold text-[#19191F] font-satoshi">Student Details</span>
          <span className="text-[#9B9B9B] text-[14px] font-satoshi">ID No. {student.id}</span>
        </div>
        {/* Profile */}
        <div className="flex items-center gap-3 mb-2">
          <img src={student.profile} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
          <span className="text-[16px] font-bold text-[#19191F] font-satoshi">{student.name}</span>
        </div>
        {/* Class & School */}
        <div className="flex items-center gap-6 mb-2">
          <div>
            <div className="text-[#9B9B9B] text-[13px] font-satoshi">Class</div>
            <div className="text-[#19191F] text-[15px] font-satoshi">{student.class}</div>
          </div>
          <div>
            <div className="text-[#9B9B9B] text-[13px] font-satoshi">School</div>
            <div className="text-[#19191F] text-[15px] font-satoshi">{student.school}</div>
          </div>
        </div>
        {/* Address */}
        <div className="mb-2">
          <div className="text-[#9B9B9B] text-[13px] font-satoshi">Address</div>
          <div className="text-[#19191F] text-[15px] font-satoshi">{student.address}</div>
        </div>
        {/* Bus */}
        <div className="mb-2">
          <div className="text-[#9B9B9B] text-[13px] font-satoshi">Assign Bus/Route</div>
          <div className="text-[#19191F] text-[15px] font-satoshi">{student.bus}</div>
        </div>
        {/* Emergency Contact */}
        <div className="mb-6">
          <div className="text-[#9B9B9B] text-[13px] font-satoshi">Emergency Contact</div>
          <div className="text-[#19191F] text-[15px] font-satoshi">{student.emergency}</div>
        </div>
        {/* Edit Button */}
        <button className="w-full bg-[#E8B600] text-white font-bold rounded-full py-3 text-[17px] font-satoshi shadow-md active:scale-95 transition">
          Edit
        </button>
      </div>

      {/* Parent Details Card */}
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[340px] relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[18px] font-bold text-[#19191F] font-satoshi">Parent Details</span>
        </div>
        {/* Profile */}
        <div className="flex items-center gap-3 mb-2">
          <img src={parent.profile} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
          <span className="text-[16px] font-bold text-[#19191F] font-satoshi">{parent.name}</span>
        </div>
        {/* Numbers */}
        <div className="flex items-center gap-6 mb-2">
          <div>
            <div className="text-[#9B9B9B] text-[13px] font-satoshi">Primary Number</div>
            <div className="text-[#19191F] text-[15px] font-satoshi">{parent.primary}</div>
          </div>
          <div>
            <div className="text-[#9B9B9B] text-[13px] font-satoshi">Alternate Number</div>
            <div className="text-[#19191F] text-[15px] font-satoshi">{parent.alternate}</div>
          </div>
        </div>
        {/* Email */}
        <div className="mb-2">
          <div className="text-[#9B9B9B] text-[13px] font-satoshi">Email</div>
          <div className="text-[#19191F] text-[15px] font-satoshi">{parent.email}</div>
        </div>
        {/* Address */}
        <div className="mb-6">
          <div className="text-[#9B9B9B] text-[13px] font-satoshi">Primary Address</div>
          <div className="text-[#19191F] text-[15px] font-satoshi">{parent.address}</div>
        </div>
        {/* Edit Button */}
        <button className="w-full bg-[#E8B600] text-white font-bold rounded-full py-3 text-[17px] font-satoshi shadow-md active:scale-95 transition">
          Edit
        </button>
      </div>
    </div>
  );
} 