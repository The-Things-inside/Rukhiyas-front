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

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeContent />;
      case "students":
        return <StudentsList />;
      default:
        return <HomeContent />;
    }
  };

  return (
    <AdminLayout
      pageTitle={PAGE_TITLES[activeTab] || "Dashboard"}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </AdminLayout>
  );
}
