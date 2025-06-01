"use client";
import AppLayout from "@/components/AppLayout";
import RideStatusCard from "@/components/RideStatusCard";
import ManagePickupDropoffCard from "@/components/ManagePickupDropoffCard";

export default function AppHome() {
  return (
    <AppLayout>
      <div className="p-4 flex flex-col items-center">
        <RideStatusCard />
        <div className="h-6" />
        <ManagePickupDropoffCard />
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
