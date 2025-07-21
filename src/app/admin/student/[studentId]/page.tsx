"use client";
import React from "react";
import AdminLayout from "@/components/AdminLayout";
import StudentDetails from "../../dashboard/StudentDetails";
import { useRouter } from "next/navigation";

export default function StudentProfilePage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const router = useRouter();
  const { studentId } = React.use(params);
  const studentIdNumber = parseInt(studentId);

  // Handle invalid student ID
  if (isNaN(studentIdNumber) || studentIdNumber <= 0) {
    return (
      <AdminLayout
        pageTitle="Student Not Found"
        activeTab="students"
        onTabChange={() => {}}
      >
        <div className="flex-1 flex items-center justify-center bg-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#19191F] mb-4">Student Not Found</h2>
            <p className="text-[#9B9B9B] mb-6">The student ID you're looking for doesn't exist.</p>
            <button 
              onClick={() => router.push('/admin/studentslist')}
              className="bg-[#E8B600] text-white font-bold rounded-full px-6 py-3 text-[17px] font-satoshi shadow-md active:scale-95 transition"
            >
              Back to Students List
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const handleBack = () => {
    router.push('/admin/studentslist');
  };

  return (
    <AdminLayout
      pageTitle="Student Details"
      activeTab="students"
      onTabChange={() => {}}
    >
      <StudentDetails studentId={studentIdNumber} onBack={handleBack} />
    </AdminLayout>
  );
} 