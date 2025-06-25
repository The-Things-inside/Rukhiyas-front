"use client";
import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import HomeContent from "./HomeContent";
import StudentsList from "./StudentsList";

const PAGE_TITLES: Record<string, string> = {
  home: "Urgent Tasks",
  students: "Students List",
  fleet: "Fleet",
  "track-bus": "Track Bus",
  settings: "Settings & Logs",
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("home");
  const [studentDetailsId, setStudentDetailsId] = useState<number | null>(null);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeContent />;
      case "students":
        return (
          <StudentsList 
            onStudentSelect={(studentId: number) => setStudentDetailsId(studentId)}
            selectedStudentId={studentDetailsId}
            onBackToList={() => setStudentDetailsId(null)}
          />
        );
      default:
        return <HomeContent />;
    }
  };

  // Determine the page title based on active tab and student details view
  const getPageTitle = () => {
    if (activeTab === "students" && studentDetailsId) {
      return "Student Details";
    }
    return PAGE_TITLES[activeTab] || "Dashboard";
  };

  return (
    <AdminLayout
      pageTitle={getPageTitle()}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </AdminLayout>
  );
}
