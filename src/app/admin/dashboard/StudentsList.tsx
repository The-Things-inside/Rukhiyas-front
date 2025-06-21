"use client";
import React from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";

const dummyStudents = [
  { id: 456, name: "Aryan Sharma", tasks: 0, feesPaid: true },
  { id: 457, name: "Aryan Sharma", tasks: 1, feesPaid: true },
  { id: 458, name: "Aryan Sharma", tasks: 0, feesPaid: false },
  { id: 459, name: "Aryan Sharma", tasks: 0, feesPaid: true },
  { id: 460, name: "Aryan Sharma", tasks: 0, feesPaid: true },
  { id: 461, name: "Aryan Sharma", tasks: 1, feesPaid: true },
  { id: 462, name: "Aryan Sharma", tasks: 0, feesPaid: true },
  { id: 463, name: "Aryan Sharma", tasks: 1, feesPaid: false },
  { id: 464, name: "Aryan Sharma", tasks: 0, feesPaid: true },
  { id: 465, name: "Aryan Sharma", tasks: 0, feesPaid: false },
  { id: 466, name: "Aryan Sharma", tasks: 1, feesPaid: true },
  { id: 467, name: "Aryan Sharma", tasks: 0, feesPaid: true },
];

const CheckIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="10" r="10" fill="#4CAF50" />
    <path
      d="M14.6668 6.5L8.25016 12.9167L5.3335 10"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CrossIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="10" r="10" fill="#F44336" />
    <path
      d="M12.5 7.5L7.5 12.5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 7.5L12.5 12.5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function StudentsList() {
  const handleAddStudent = () => {
    window.open("https://192.168.29.198:3000/register", "_blank");
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-4 p-4 bg-white">
      {/* Search and filter bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center border border-[#E0E0E0] rounded-full px-4 py-2">
          <Search className="h-5 w-5 text-[#9B9B9B]" />
          <input
            type="text"
            placeholder="Search by name or id"
            className="flex-1 ml-2 bg-transparent focus:outline-none text-[#19191F] placeholder:text-[#9B9B9B]"
          />
        </div>
        <button className="p-2" onClick={handleAddStudent}>
          <Plus className="h-6 w-6 text-[#19191F]" />
        </button>
        <button className="p-2">
          <SlidersHorizontal className="h-6 w-6 text-[#19191F]" />
        </button>
      </div>

      {/* Students Table */}
      <div className="flex-1 overflow-y-auto border border-[#E8B600] rounded-lg">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b border-[#E8B600]">
              <th className="p-3 text-sm font-medium text-[#9B9B9B]">ID</th>
              <th className="p-3 text-sm font-medium text-[#9B9B9B]">Name</th>
              <th className="p-3 text-sm font-medium text-[#9B9B9B]">Tasks</th>
              <th className="p-3 text-sm font-medium text-[#9B9B9B]">Fees</th>
            </tr>
          </thead>
          <tbody>
            {dummyStudents.map((student, index) => (
              <tr
                key={student.id}
                className="border-b border-[#E8B600] last:border-b-0"
              >
                <td className="p-3 text-base font-medium text-[#19191F]">
                  {student.id}
                </td>
                <td className="p-3 text-base font-medium text-[#19191F]">
                  {student.name}
                </td>
                <td className="p-3 text-base font-medium text-[#19191F]">
                  {student.tasks}
                </td>
                <td className="p-3">
                  {student.feesPaid ? <CheckIcon /> : <CrossIcon />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 