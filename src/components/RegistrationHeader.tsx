"use client";
import { useState } from "react";
import MenuOverlay from "./MenuOverlay";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface RegistrationHeaderProps {
  onBack?: () => void;
}

export default function RegistrationHeader({
  onBack,
}: RegistrationHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 w-full z-20 bg-[#19191F] flex items-center justify-between px-4 h-14 max-w-md mx-auto md:hidden">
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

      {/* Desktop Header */}
      <header
        className="hidden md:flex fixed top-0 left-0 w-full z-20 bg-[#14141B] h-[128px] items-center px-[60px] justify-between shadow-[0px_43px_6px_rgba(0,0,0,0),0px_27px_5.5px_rgba(0,0,0,0),0px_15px_4.5px_rgba(0,0,0,0.01),0px_7px_3.5px_rgba(0,0,0,0.01),0px_2px_2px_rgba(0,0,0,0.01)]"
      >
        {/* Left: Logo */}
        <button
          type="button"
          aria-label="Go to home"
          onClick={() => router.push("/")}
          className="flex items-center min-w-[200px]"
        >
          <Image
            src="/assets/Rukhiyas-desktop.svg"
            alt="RUKHIYAS Logo"
            width={98}
            height={64}
            className="h-16 w-auto"
          />
        </button>
        {/* Center: Registration */}
        <div className="flex-1 flex justify-center">
          <span
            className="text-white font-semibold text-[32px]"
            style={{ fontFamily: "Spartan, sans-serif" }}
          >
            Registration
          </span>
        </div>
        {/* Right: Save & Exit and Need Help? */}
        <div className="flex items-center gap-[10px] min-w-[320px] justify-end">
          <button
            type="button"
            className="h-[44px] px-[24px] rounded-[22px] text-white text-[18px] font-bold"
            style={{ fontFamily: "Satoshi, sans-serif" }}
            onClick={() => router.push("/")}
          >
            Save & Exit
          </button>
          <button
            type="button"
            className="h-[44px] px-[24px] rounded-[22px] text-[#E8B600] text-[18px] font-bold"
            style={{ fontFamily: "Satoshi, sans-serif" }}
            onClick={() => router.push("/contact")}
          >
            Need Help?
          </button>
        </div>
      </header>

      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
