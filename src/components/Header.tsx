"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MenuOverlay from "./MenuOverlay";

const TABS = [
  { label: "About Us", route: "/about" },
  { label: "School Transportation", route: "/school-transportation" },
  { label: "Rentals/Hire", route: "/rentals-hire" },
  { label: "Contact Us", route: "/contact" },
];

export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    // Prefetch common routes to make navigation feel instant.
    for (const tab of TABS) router.prefetch(tab.route);
    router.prefetch("/login");
    router.prefetch("/register");
  }, [router]);

  const handleLogin = () => {
    router.push("/login");
  };
  const handleRegister = () => {
    router.push("/register");
  };
  const handleTabClick = (idx: number, route: string) => {
    setSelectedTab(idx);
    if (route) router.push(route);
  };

  return (
    <header className="relative flex items-center justify-between px-4 py-3 bg-[#13131a] md:bg-white md:py-0 md:h-[128px]">
      {/* Logo */}
      <button
        type="button"
        aria-label="Go to home"
        onClick={() => router.push("/")}
        className="flex items-center gap-2"
      >
        {/* Mobile logo */}
        <Image
          src="/assets/logo.svg"
          alt="RUKHIYAS Logo"
          width={70}
          height={46}
          className="block md:hidden"
        />
        {/* Desktop logo */}
        <Image
          src="/assets/Rukhiyas-desktop.svg"
          alt="RUKHIYAS Logo Desktop"
          width={98}
          height={64}
          className="hidden md:block ml-10"
        />
      </button>
      {/* Centered Tabs (Desktop only) */}
      <nav
        className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: 602, height: 24, gap: 10 }}
      >
        <ul className="flex items-center" style={{ gap: 53 }}>
          {TABS.map((tab, idx) => (
            <li key={tab.label}>
              <button
                onClick={() => handleTabClick(idx, tab.route)}
                className={
                  selectedTab === idx
                    ? "text-[#19191F] text-[18px] leading-[100%] tracking-[0%] font-medium underline decoration-solid underline-offset-0 decoration-2 [text-underline-position:from-font] whitespace-nowrap"
                    : "text-[#19191F] text-[18px] leading-[100%] tracking-[0%] font-light hover:underline hover:decoration-solid hover:underline-offset-2 whitespace-nowrap"
                }
                style={{
                  fontFamily: "Satoshi, sans-serif",
                  height: 24,
                  textDecorationSkipInk: "auto",
                  padding: 0,
                  background: "none",
                  border: "none",
                  outline: "none",
                  cursor: "pointer",
                  display: "inline-block",
                }}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {/* Desktop buttons */}
      <div className="hidden md:flex md:mr-10 items-center gap-4">
        <button
          onClick={handleLogin}
          className="px-8 py-2 font-family: 'Satoshi', sans-serif rounded-full border border-[#F2C100] text-[#F2C100] font-medium bg-white hover:bg-[#fffbe6] transition text-base"
        >
          Log In
        </button>
        <button
          onClick={handleRegister}
          className="px-8 py-2 font-family: 'Satoshi', sans-serif rounded-full bg-[#F2C100] text-white font-medium transition text-base"
        >
          Register
        </button>
      </div>
      {/* Mobile hamburger and login */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={handleLogin}
          className="bg-[#f2c200] text-black font-semibold rounded-full px-5 py-1.5 text-sm shadow hover:bg-[#e6b800] transition"
        >
          Log In
        </button>
        <button
          onClick={() => setMenuOpen(true)}
          className="flex flex-col justify-center items-center w-8 h-8"
        >
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
      </div>
      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
