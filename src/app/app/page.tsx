"use client";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import RideStatusCard from "@/components/RideStatusCard";
import ManagePickupDropoffCard from "@/components/ManagePickupDropoffCard";
import PaymentsHistoryCard from "@/components/PaymentsHistoryCard";
import PageHeader from "@/components/PageHeader";

interface Student {
  id: number;
  full_name: string;
  profile_picture_url: string | null;
  bus_id: number | null;
  student_address: string;
  temp_address: string | null;
  temp_dates?: string[];
}

export default function AppHome() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) throw new Error("No access token found");
        const response = await fetch("https://api.rukhiyastravels.com/students/me", {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch students");
        const data = await response.json();
        setStudents(data);
        if (data.length > 0) {
          setSelectedStudent(data[0]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  return (
    <AppLayout
      header={
        <PageHeader
          students={students}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
        />
      }
    >
      <div className="p-4 flex flex-col items-center">
        <RideStatusCard selectedStudent={selectedStudent} />
        <div className="h-6" />
        <ManagePickupDropoffCard selectedStudent={selectedStudent} />
        <div className="h-6" />
        <PaymentsHistoryCard />
        <div className="mt-6" />
        <h1 className="text-2xl font-semibold mb-4">Welcome to Rukhiyas</h1>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-2">Today&apos;s Schedule</h2>
          <p className="text-gray-600">
            Your child&apos;s bus will arrive at 8:00 AM
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
