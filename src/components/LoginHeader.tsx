"use client";
import { FC, useState } from "react";
import MenuOverlay from "./MenuOverlay";

interface LoginHeaderProps {
  onBack?: () => void;
  title?: string;
}

const LoginHeader: FC<LoginHeaderProps> = ({ onBack, title = "Log In" }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="w-full flex items-center justify-between bg-[#14141B] px-4 py-3">
        <button
          aria-label="Go back"
          onClick={onBack}
          className="flex items-center text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span
            className="text-[20px] font-semibold leading-[100%] tracking-[0px]"
            style={{
              fontFamily: "Spartan, sans-serif",
              height: "17px",
              display: "inline-block",
              verticalAlign: "text-top",
            }}
          >
            {title}
          </span>
        </button>
        <button
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          <svg
            width="28"
            height="28"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
      </header>

      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default LoginHeader;
