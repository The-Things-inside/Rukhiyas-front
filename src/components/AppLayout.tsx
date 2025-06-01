import { ReactNode } from "react";
import BottomNavBar from "./BottomNavBar";
import PageHeader from "./PageHeader";

interface AppLayoutProps {
  children: ReactNode;
}

// ... existing code ...
export default function AppLayout({ children }: AppLayoutProps) {
  // Header: 64px, Navbar: 80px
  return (
    <div className="min-h-screen bg-[#19191F]">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <PageHeader />
      </div>
      {/* Fixed Main White Box */}
      <div
        className="fixed left-0 right-0 mx-auto bg-white rounded-t-[24px] max-w-md"
        style={{
          top: 64, // header height
          bottom: 80, // navbar height
          height: "calc(100vh - 64px - 80px)",
          overflowY: "auto",
        }}
      >
        {children}
      </div>
      {/* Fixed Bottom Navbar */}
      <BottomNavBar />
    </div>
  );
}