import React from "react";
import AdminPageHeader from "./AdminPageHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#19191F] relative">
      <div className="fixed top-0 left-0 right-0 z-50 max-w-md mx-auto">
        <AdminPageHeader />
      </div>
      <div
        className="absolute left-0 right-0 mx-auto bg-white mt-3 rounded-t-[24px] max-w-md flex flex-col"
        style={{
          top: 67, // header height
          height: "calc(100vh - 67px)",
          bottom: 0,
        }}
      >
        <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
