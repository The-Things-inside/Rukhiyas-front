import React from "react";
import AdminPageHeader from "./AdminPageHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#19191F]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <AdminPageHeader />
      </div>
      <div
        className="fixed left-0 right-0 mx-auto bg-white mt-3 rounded-t-[24px] max-w-md"
        style={{
          top: 67, // header height
          bottom: 0,
          height: "calc(100vh - 67px)",
          overflowY: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}
