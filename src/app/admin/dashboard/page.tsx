"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is admin
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
              <h2 className="text-xl font-semibold mb-4">
                Welcome to Admin Dashboard
              </h2>
              <p className="text-gray-600">
                This is the admin dashboard where you can manage the
                application.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
