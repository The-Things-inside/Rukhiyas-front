"use client";

import React, { useState } from "react";
import AdminPageHeader from "@/components/AdminPageHeader";
import AdminDrawer from "@/components/AdminDrawer";

export default function AdminLayout({
  children,
  pageTitle,
  activeTab: initialActiveTab,
  onTabChange,
}: {
  children: React.ReactNode;
  pageTitle: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setDrawerOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FAFAFA]">
      <div className="fixed top-0 left-0 w-full z-30">
        <AdminPageHeader
          title={pageTitle}
          onMenuClick={() => setDrawerOpen(true)}
        />
      </div>
      <AdminDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeTab={initialActiveTab}
        onTabChange={handleTabChange}
      />
      <main className="flex min-h-0 w-full flex-1 flex-col overflow-hidden pt-16">
        {children}
      </main>
    </div>
  );
}
