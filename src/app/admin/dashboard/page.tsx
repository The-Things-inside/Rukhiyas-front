"use client";
import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import HomeContent from "./HomeContent";

const PAGE_TITLES: Record<string, string> = {
  home: "Urgent Tasks",
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
