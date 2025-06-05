"use client";

import Image from "next/image";
import useHydrated from "../../hooks/useHydrated";

export default function BottomFooter() {
  const hydrated = useHydrated();
  const scrollToTop = () => {
    if (hydrated) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      style={{
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        background: "#18181C",
        boxShadow: "0 -2px 16px rgba(0,0,0,0.12)",
        overflow: "hidden",
      }}
      className="md:mt-25 mt-15 h-[512px] md:h-[367px]"
    >
      <div className="hidden md:flex w-full justify-center py-4">
        <div className="text-gray-400 text-sm">
          <button
            onClick={scrollToTop}
            className="p-0 bg-transparent border-none outline-none md:mt-9"
          >
            <Image
              src="/Nav Buttons.svg"
              alt="Nav Button"
              width={52}
              height={52}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-col pt-3 md:flex-row md:items-start md:justify-between md:px-16 md:pt-8 md:pb-6">
        {/* Logo and Nav Button - Mobile */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2 md:hidden">
          <Image src="/assets/logo.svg" alt="RUKHIYAS" width={70} height={46} />
          <button
            onClick={scrollToTop}
            className="p-0 bg-transparent border-none outline-none"
          >
            <Image
              src="/Nav Buttons.svg"
              alt="Nav Button"
              width={52}
              height={52}
            />
          </button>
        </div>

        {/* Desktop Logo */}
        <div className="hidden md:block md:pl-15">
          <Image src="/assets/logo.png" alt="RUKHIYAS" width={70} height={44} />
        </div>

        {/* Navigation Links */}
        <ul className="w-full md:w-auto  text-white text-base mt-4 md:mt-4 md:flex md:flex-row md:gap-8">
          <li
            className="px-8 py-2 font-satoshi md:font-semibold text-[14px] md:text-[16px]"
            style={{
              lineHeight: "100%",
              letterSpacing: 0,
            }}
            onClick={scrollToTop}
          >
            About
          </li>
          <div
            className="mx-8 mt-2 md:hidden"
            style={{ borderBottom: "2px solid #585858" }}
          />
          <li
            className="px-8 py-2 mt-2 md:mt-0 font-satoshi md:font-semibold text-[14px] md:text-[16px]"
            style={{
              lineHeight: "100%",
              letterSpacing: 0,
            }}
          >
            School Transport
          </li>
          <div
            className="mx-8 mt-2 md:hidden"
            style={{ borderBottom: "2px solid #585858" }}
          />
          <li
            className="px-8 py-2 mt-2 md:mt-0 font-satoshi md:font-semibold text-[14px] md:text-[16px]"
            style={{
              lineHeight: "100%",
              letterSpacing: 0,
            }}
          >
            Bus Rentals/Hire
          </li>
          <div
            className="mx-8 mt-2 md:hidden"
            style={{ borderBottom: "2px solid #585858" }}
          />
          <li
            className="px-8 py-2 mt-2 md:mt-0 font-satoshi md:font-semibold text-[14px] md:text-[16px]"
            style={{
              lineHeight: "100%",
              letterSpacing: 0,
            }}
          >
            Contact Us
          </li>
          <div
            className="mx-8 mt-2 md:hidden"
            style={{ borderBottom: "2px solid #585858" }}
          />
          <li
            className="px-8 mt-2 md:mt-0 py-2 font-satoshi  md:font-semibold  text-[14px] md:text-[16px]"
            style={{
              lineHeight: "100%",
              letterSpacing: 0,
            }}
          >
            Terms & Policies
          </li>
        </ul>

        {/* Social Links */}
        <div className="flex flex-col items-center mt-6 md:mt-0 md:items-end md:mr-16">
          <div className="flex gap-5 mb-2">
            <Image src="/linkedin.svg" alt="LinkedIn" width={40} height={40} />
            <Image src="/facebook.svg" alt="Facebook" width={40} height={40} />
            <Image
              src="/instagram.svg"
              alt="Instagram"
              width={40}
              height={40}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center  py-4 md:pt-13  ]">
        <div className="text-gray-400 text-sm">© 2025. All Right Reserved</div>
      </div>
    </div>
  );
}
