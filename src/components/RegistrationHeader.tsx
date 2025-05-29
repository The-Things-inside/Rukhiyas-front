"use client";
import { useState } from "react";
import MenuOverlay from "./MenuOverlay";

interface RegistrationHeaderProps {
  onBack?: () => void;
}

export default function RegistrationHeader({
  onBack,
}: RegistrationHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-20 bg-[#19191F] flex items-center justify-between px-4 h-14 max-w-md mx-auto">
        <div className="flex items-center" style={{ minWidth: 0 }}>
          <button
            aria-label="Back"
            onClick={onBack}
            className="text-white text-xl mr-2 flex-shrink-0"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span
            className="text-white font-semibold"
            style={{
              fontFamily: "Spartan, sans-serif",
              fontWeight: 600,
              fontSize: 20,
              lineHeight: "1",
              width: 210,
              height: 17,
              letterSpacing: 0,
              display: "inline-block",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Parent Registration
          </span>
        </div>
        <button
          aria-label="Menu"
          className="text-white text-xl"
          onClick={() => setMenuOpen(true)}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
