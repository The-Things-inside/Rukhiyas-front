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

  return (
    <div className="flex flex-col h-screen bg-[#FAFAFA]">
      <AdminPageHeader
        title={pageTitle}
        onMenuClick={() => setDrawerOpen(true)}
      />
      <AdminDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeTab={initialActiveTab}
        onTabChange={(tab) => {
          onTabChange(tab);
          setDrawerOpen(false);
        }}
      />
      <main className="flex-1 min-h-0 flex flex-col">{children}</main>
    </div>
  );
}
