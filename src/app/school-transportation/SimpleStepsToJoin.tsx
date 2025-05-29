import React, { useState } from "react";
import Image from "next/image";

const stepsOnline = [
  {
    number: 1,
    title: "Sign Up",
    description: 'Click "Register now" and create an account.',
    image: "/assets/step1.svg", // Placeholder path
  },
  {
    number: 2,
    title: "Enroll Student",
    description: "Fill all the required details of the student.",
    image: "/assets/step2.svg",
  },
  {
    number: 3,
    title: "Review & Pay",
    description: "Confirm details and make a payment online.",
    image: "/assets/step3.svg",
  },
  {
    number: 4,
    title: "Booking Confirmation",
    description: "Receive confirmation via SMS or WhatsApp after payment.",
    image: "/assets/step4.svg",
  },
];

export default function SimpleStepsToJoin() {
  const [tab, setTab] = useState<"online" | "call">("online");

  return (
    <div>
      <section className="w-full max-w-md mx-auto mt-12 mb-8  p-6">
        <h2 className="font-spartan text-black font-semibold text-[28px] text-center mb-6">
          Simple Steps to Join
        </h2>
        <div className="flex justify-center mb-6">
          <button
            className={` font-semibold  border-b-2 text-[16px] transition-colors duration-200 ${tab === "online" ? "text-[#EAB308] border-[#EAB308] " : "text-gray-400 border-transparent "}`}
            onClick={() => setTab("online")}
          >
            Register Online
          </button>
          <button
            className={`px-6 py-2 font-semibold  border-b-2 transition-colors duration-200 ${tab === "call" ? "text-[#EAB308] border-[#EAB308] " : "text-gray-400 border-transparent "}`}
            onClick={() => setTab("call")}
          >
            Register Via Call
          </button>
        </div>
        {tab === "online" && (
          <div className="flex flex-col gap-10">
            {stepsOnline.map((step) => (
              <div key={step.number} className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={160}
                    height={156}
                    className="object-contain w-40 h-36"
                  />
                </div>
                <div className="flex flex-col items-center justify-center flex-1 pt-1 text-center">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#EAB308] text-[#EAB308] font-bold text-lg mb-2">
                    {step.number}
                  </span>
                  <span className="font-bold text-gray-900 text-lg leading-tight mb-1">
                    {step.title}
                  </span>
                  <span className="text-gray-600 text-base leading-snug mt-1">
                    {step.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === "call" && (
          <div className="text-center py-8 text-gray-700">
            <p className="text-lg font-semibold mb-2">Register by Call</p>
            <p>
              Call our support team and we&apos;ll guide you through the
              registration process step by step.
            </p>
            <p className="mt-3 font-bold text-[#EAB308]">+91-XXXXXXXXXX</p>
          </div>
        )}
      </section>
    </div>
  );
}
