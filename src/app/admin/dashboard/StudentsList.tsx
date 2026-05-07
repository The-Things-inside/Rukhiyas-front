"use client";
import React, { useEffect, useState } from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import StudentDetails from "./StudentDetails";

interface Student {
  id: number;
  full_name: string;
  is_paid: boolean;
}

interface StudentWithPending {
  student: Student;
  pending_request_count: number;
}

interface StudentsListProps {
  onStudentSelect?: (studentId: number) => void;
  selectedStudentId?: number | null;
  onBackToList?: () => void;
}

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

export default function StudentsList({ onStudentSelect, selectedStudentId, onBackToList }: StudentsListProps) {
  const [students, setStudents] = useState<StudentWithPending[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");
        const res = await api.get("/admin/students-with-pending-requests", {
          headers: { Authorization: `Bearer ${token}`, accept: "application/json" },
        });
        setStudents(res.data as any);
      } catch (err) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddStudent = () => {
    window.open("/register", "_blank");
  };

  const handleStudentClick = (studentId: number) => {
    // Navigate to the student profile route
    router.push(`/admin/student/${studentId}`);
  };

  // Show student details if a student is selected (for backward compatibility)
  if (selectedStudentId && onStudentSelect && onBackToList) {
    return <StudentDetails studentId={selectedStudentId} onBack={onBackToList} />;
  }

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
        {loading ? (
          <div className="p-6 text-center text-[#19191F]">Loading...</div>
        ) : (
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
              {students.map((item) => (
                <tr
                  key={item.student.id}
                  className="border-b border-[#E8B600] last:border-b-0 cursor-pointer hover:bg-[#FFF8E1] transition-colors"
                  onClick={() => handleStudentClick(item.student.id)}
                >
                  <td className="p-3 text-base font-medium text-[#19191F]">
                    {item.student.id}
                  </td>
                  <td className="p-3 text-base font-medium text-[#19191F]">
                    {item.student.full_name}
                  </td>
                  <td className="p-3 text-base font-medium text-[#19191F]">
                    {item.pending_request_count}
                  </td>
                  <td className="p-3">
                    {item.student.is_paid ? <CheckIcon /> : <CrossIcon />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 