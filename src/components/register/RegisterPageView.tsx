"use client";

import { useState } from "react";
import RegistrationHeader from "../RegistrationHeader";
import RegistrationForm from "../RegistrationForm";
import StudentDetailsForm from "../StudentDetailsForm";
import type { StudentCard } from "../ReviewAndPay";
import { DesktopSiteFooter } from "../SiteFooter";
import { useRouter } from "next/navigation";

function DesktopProgress({ step }: { step: 1 | 2 }) {
  return (
    <div className="w-full flex items-center justify-center py-[8px]">
      <div className="relative w-full max-w-[357px] h-[24px]">
        <div className="absolute left-[12px] right-[12px] top-1/2 -translate-y-1/2 h-[2px] bg-[#D1D5DB]" />
        {[1, 2].map((s, idx) => {
          const active = step === s;
          const done = step > s;
          const left = idx === 0 ? 0 : "100%";
          return (
            <div
              key={s}
              className="absolute top-1/2 -translate-y-1/2"
              style={{
                left,
                transform:
                  idx === 0 ? "translateY(-50%)" : "translate(-100%, -50%)",
              }}
            >
              <div
                className={`h-[24px] w-[24px] rounded-full flex items-center justify-center ${
                  active || done ? "bg-[#E8B600]" : "bg-white border border-[#D1D5DB]"
                }`}
              >
                {done ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : active ? (
                  <div className="h-[8px] w-[8px] rounded-full bg-white" />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DesktopTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: "online" | "call";
  setActiveTab: (tab: "online" | "call") => void;
}) {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex items-end gap-[20px] w-[357px]">
        <button
          type="button"
          onClick={() => setActiveTab("online")}
          className="flex flex-col items-start gap-[2px]"
        >
          <span
            className={`text-[16px] leading-[22px] font-semibold ${
              activeTab === "online" ? "text-black" : "text-[#707070]"
            }`}
            style={{ fontFamily: "Spartan, sans-serif" }}
          >
            Register Online
          </span>
          <span
            className={`h-[3px] w-full rounded-tl-[3px] rounded-tr-[3px] ${
              activeTab === "online" ? "bg-[#E8B600]" : "bg-transparent"
            }`}
          />
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("call")}
          className="flex flex-col items-start gap-[2px]"
        >
          <span
            className={`text-[16px] leading-[22px] font-semibold ${
              activeTab === "call" ? "text-black" : "text-[#707070]"
            }`}
            style={{ fontFamily: "Spartan, sans-serif" }}
          >
            Register Via Call
          </span>
          <span
            className={`h-[3px] w-full rounded-tl-[3px] rounded-tr-[3px] ${
              activeTab === "call" ? "bg-[#E8B600]" : "bg-transparent"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

export default function RegisterPageView({ onBack }: { onBack?: () => void }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"online" | "call">("online");
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [students, setStudents] = useState<StudentCard[]>([]);

  const handleStudentsRegistered = (newStudents: StudentCard[]) => {
    setStudents(newStudents);
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Registration session expired. Please sign in.");
      router.push("/login");
      return;
    }
    router.push("/app");
  };

  return (
    <div className="min-h-screen bg-white">
      <RegistrationHeader onBack={onBack} />

      <main className="pt-[128px]">
        <div className="w-full flex flex-col items-center gap-[120px]">
          <section className="w-[546px] pt-[60px] pb-[24px] px-[24px]">
            <div className="w-[498px] mx-auto flex flex-col items-center gap-[24px]">
              <div className="w-full flex flex-col items-center gap-[16px]">
                <DesktopTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              </div>

              {activeTab === "online" ? (
                <>
                  <DesktopProgress step={currentStep} />
                  {currentStep === 1 ? (
                    <RegistrationForm
                      variant="desktop"
                      onContinue={() => setCurrentStep(2)}
                    />
                  ) : (
                    <StudentDetailsForm
                      onContinue={handleStudentsRegistered}
                      students={students}
                      setStudents={setStudents}
                      parentId={parseInt(localStorage.getItem("parent_id") || "0")}
                    />
                  )}
                </>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <div className="text-center mt-2">
                    <h2
                      className="text-[20px] text-black mb-2"
                      style={{
                        fontFamily: "Spartan, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      Register hassle-free
                    </h2>
                    <p
                      className="text-black text-[18px] mb-4"
                      style={{
                        fontFamily: "Satoshi, sans-serif",
                        fontWeight: 400,
                        lineHeight: "26px",
                      }}
                    >
                      Our friendly agent is ready to help you register. Simply tap
                      &apos;Call Now&apos; to get started.
                    </p>
                    <a
                      href="tel:+918113037647"
                      className="block w-full bg-[#E8B600] text-white font-bold rounded-full py-3 text-lg shadow hover:brightness-95 transition mt-2"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              )}
            </div>
          </section>

          <DesktopSiteFooter />
        </div>
      </main>
    </div>
  );
}

