"use client";

import Image from "next/image";

export default function BottomSheetFooter() {
  return (
    <div
      style={{
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        background: "#18181C",
        boxShadow: "0 -2px 16px rgba(0,0,0,0.12)",
        overflow: "hidden",
      }}
      className="mt-8"
    >
      <div className="flex items-center justify-between px-6 pt-5 pb-2">
        <Image src="/assets/logo.png" alt="RUKHIYAS" width={70} height={46} />
        <button className="p-0 bg-transparent border-none outline-none">
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
          className="px-8 py-2"
          style={{
            fontFamily: "Satoshi",
            fontWeight: 500,
            fontSize: 14,
            lineHeight: "100%",
            letterSpacing: 0,
          }}
        >
          About Us
        </li>
        <div className="mx-8" style={{ borderBottom: "2px solid #585858" }} />
        <li
          className="px-8 py-2"
          style={{
            fontFamily: "Satoshi",
            fontWeight: 500,
            fontSize: 14,
            lineHeight: "100%",
            letterSpacing: 0,
          }}
        >
          Contact Us
        </li>
        <div className="mx-8" style={{ borderBottom: "2px solid #585858" }} />
        <li
          className="px-8 py-2"
          style={{
            fontFamily: "Satoshi",
            fontWeight: 500,
            fontSize: 14,
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
          width={24}
          height={24}
          className="h-6 mb-1"
        />
        <span className="text-white mb-2">Secure Payments</span>
        <div className="flex gap-2 mb-2">
          <Image
            src="/Mastercard.svg"
            alt="Mastercard"
            width={24}
            height={24}
            className="h-6"
          />
          <Image
            src="/Visa.svg"
            alt="Visa"
            width={24}
            height={24}
            className="h-6"
          />
          <Image
            src="/UPI.svg"
            alt="UPI"
            width={24}
            height={24}
            className="h-6"
          />
        </div>
        <div className="text-gray-400 text-sm mt-2 mb-2">
          © 2025. All Right Reserved
        </div>
      </div>
    </div>
  );
}
