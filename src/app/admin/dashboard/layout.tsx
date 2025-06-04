"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AdminPageHeader from "@/components/AdminPageHeader";

const tabs = [
  { name: "Home", path: "/admin/dashboard" },
  { name: "Students", path: "/admin/dashboard/students" },
  { name: "Fleet", path: "/admin/dashboard/fleet" },
  { name: "Track Bus", path: "/admin/dashboard/track-bus" },
  { name: "Settings", path: "/admin/dashboard/settings" },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#19191F]">
      {/* Admin Page Header */}
      <AdminPageHeader />

      {/* Tab Navigation */}
      <div className="bg-[#1E1E24] border-b border-[#2A2A32]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const isActive = pathname === tab.path;
              return (
                <Link
                  key={tab.path}
                  href={tab.path}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    isActive
                      ? "border-[#f2c200] text-[#f2c200]"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
