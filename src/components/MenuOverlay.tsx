/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const [contactOpen, setContactOpen] = useState(false);
  const router = useRouter();

  const handleAboutUs = () => {
    onClose();
    router.push("/about");
  };

  const handleSchoolTransportation = () => {
    onClose();
    router.push("/school-transportation");
  };

  const handleRentalsHire = () => {
    onClose();
    router.push("/rentals-hire");
  };

  const handleRegister = () => {
    onClose();
    router.push("/register");
  };

  const handleLogin = () => {
    onClose();
    router.push("/login");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-30 bg-[#19191F] flex flex-col">
      {/* Menu Header */}
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <button
          type="button"
          aria-label="Go to home"
          onClick={() => {
            onClose();
            router.push("/");
          }}
        >
          <img
            src="/assets/logo.svg"
            alt="Logo"
            className="h-8"
            style={{ objectFit: "contain" }}
          />
        </button>
        {/* Close Button */}
        <button
          aria-label="Close"
          onClick={onClose}
          className="text-white text-3xl"
        >
          <img src="/close.svg" alt="Close" className="h-8 w-8" />
        </button>
      </div>
      {/* Menu Content */}
      <div className="flex-1 flex flex-col px-6 pt-8">
        {/* Menu Items */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleAboutUs}
            className="text-white text-lg font-medium text-left py-3 border-b border-[#3A3A3A]"
          >
            About Us
          </button>
          <button
            onClick={handleSchoolTransportation}
            className="text-white text-lg font-medium text-left py-3 border-b border-[#3A3A3A]"
          >
            School Transportation
          </button>
          <button
            onClick={handleRentalsHire}
            className="text-white text-lg font-medium text-left py-3 border-b border-[#3A3A3A]"
          >
            Bus Rentals/Hire
          </button>
          {/* Contact Us Dropdown */}
          <div>
            <button
              className="w-full text-white text-lg font-medium text-left py-3 border-b border-[#3A3A3A] flex items-center justify-between"
              onClick={() => setContactOpen((prev) => !prev)}
            >
              Contact Us
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                className="ml-2"
              >
                <path d={contactOpen ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} />
              </svg>
            </button>
            {contactOpen && (
              <div className="pl-2 pt-2 pb-4 border-b border-[#3A3A3A]">
                <a
                  href="mailto:Rukhiyastransports@gmail.com"
                  className="block text-white font-semibold underline mb-3"
                >
                  Rukhiyastransports@gmail.com
                </a>
                <a
                  href="tel:+919979645635"
                  className="block text-white font-semibold underline mb-3"
                >
                  +91 9979645635
                </a>
                <a
                  href="tel:+919979645635"
                  className="block text-white font-semibold underline"
                >
                  +91 9979645635
                </a>
              </div>
            )}
          </div>
        </div>
        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-4">
          <button
            onClick={handleRegister}
            className="bg-[#F2C100] text-white font-semibold rounded-full py-3 text-lg w-full"
          >
            Register
          </button>
          <button
            onClick={handleLogin}
            className="border-2 border-[#F2C100] text-[#F2C100] font-semibold rounded-full py-3 text-lg w-full bg-transparent"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
