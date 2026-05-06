"use client";
import Header from "./Header";
import SchoolTransportation from "./school-transportation";

export default function AboutPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#FFFCF1" }}
    >
      {/* Fixed Header */}
      <div className="fixed top-0  md:bg-amber-50 left-0 w-full z-50">
        <Header />
      </div>
      {/* Scrollable AboutSection below the header */}
      <main className="flex-1 flex flex-col justify-top pt-[72px] md:pt-[128px] ">
        <SchoolTransportation />
      </main>
    </div>
  );
}
