"use client";

import Image from "next/image";
import useHydrated from "../hooks/useHydrated";

export default function BottomSheetFooter() {
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
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        background: "#18181C",
        boxShadow: "0 -2px 16px rgba(0,0,0,0.12)",
        overflow: "hidden",
      }}
    >
      <div className="flex items-center justify-between px-6 pt-5 pb-2">
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
      <ul className="w-full text-white text-base mt-2">
        <li
          className="px-8 py-2 font-satoshi md:font-semibold text-[14px] md:text-[16px]"
          style={{
            lineHeight: "100%",
            letterSpacing: 0,
          }}
        >
          About Us
        </li>
        <div
          className="mx-8 mt-2"
          style={{ borderBottom: "2px solid #585858" }}
        />
        <li
          className="px-8 mt-2 py-2 font-satoshi md:font-semibold text-[14px] md:text-[16px]"
          style={{
            lineHeight: "100%",
            letterSpacing: 0,
          }}
        >
          Contact Us
        </li>
        <div
          className="mx-8 mt-2"
          style={{ borderBottom: "2px solid #585858" }}
        />
        <li
          className="px-8 mt-2 py-2 font-satoshi md:font-semibold text-[14px] md:text-[16px]"
          style={{
            lineHeight: "100%",
            letterSpacing: 0,
          }}
        >
          Terms & Policies
        </li>
      </ul>
      <div className="flex flex-col items-center mt-6">
        <Image
          src="/security 1.svg"
          alt="Secure"
          width={30}
          height={30}
          className="h-6 mb-1"
        />
        <span className="text-white mb-2">Secure Payments</span>
        <div className="flex justify-center gap-4 mb-2">
          <Image
            src="/Mastercard.svg"
            alt="Mastercard"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <Image
            src="/Visa.svg"
            alt="Visa"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <Image
            src="/UPI.svg"
            alt="UPI"
            width={40}
            height={40}
            className="h-10 w-10"
          />
        </div>
        <div className="text-gray-400 text-sm mt-2 mb-10">
          © 2025. All Right Reserved
        </div>
      </div>
    </div>
  );
}
