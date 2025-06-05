/* eslint-disable @next/next/no-img-element */
"use client";

import RegistrationHeader from "./RegistrationHeader";
import RegistrationStepper from "./RegistrationStepper";
import RegistrationForm from "./RegistrationForm";
import StudentDetailsForm from "./StudentDetailsForm";
import BottomSheetFooter from "./BottomSheetFooter";
import ReviewAndPay, { StudentCard } from "./ReviewAndPay";
import { useState } from "react";

interface ParentRegistrationProps {
  onBack?: () => void;
}

export default function ParentRegistration({
  onBack,
}: ParentRegistrationProps) {
  const [activeTab, setActiveTab] = useState<"online" | "call">("online");
  const [currentStep, setCurrentStep] = useState(1);
  const [students, setStudents] = useState<StudentCard[]>([]);

  const handleContinue = (newStudents: StudentCard[]) => {
    setStudents(newStudents);
    setCurrentStep(3);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <RegistrationHeader onBack={onBack} />
      <main className="flex-1 flex flex-col items-center justify-start md:pt-10 pt-0">
        {/* Card with top curve, edge-to-edge, always below header */}
        <section
          className="relative w-full max-w-md mx-auto bg-white rounded-t-[2.5rem] shadow-lg px-0 pb-8 flex flex-col min-h-[calc(100vh-56px)]"
          style={{ marginTop: "56px" }} // header height
        >
          <RegistrationStepper
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          {/* Progress stripe with steps - only here, between tabs and form heading */}
          {activeTab === "online" && (
            <div className="w-full flex flex-col items-center pt-2 pb-4">
              <div className="relative w-11/12 max-w-xs h-2 flex items-center justify-center">
                {/* Stripe */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 w-full z-0" />
                {/* Steps */}
                <div className="flex justify-between items-center w-full z-10">
                  {/* Step 1 */}
                  <div
                    className={`w-6 h-6 rounded-full ${currentStep >= 1 ? "bg-[#E8B600] border-2 border-[#E8B600]" : "bg-white border-2 border-gray-200"} flex items-center justify-center`}
                  >
                    {currentStep > 1 ? (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                    )}
                  </div>
                  {/* Step 2 */}
                  <div
                    className={`w-6 h-6 rounded-full ${currentStep >= 2 ? "bg-[#E8B600] border-2 border-[#E8B600]" : "bg-white border-2 border-gray-200"} flex items-center justify-center`}
                  >
                    {currentStep > 2 ? (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                    )}
                  </div>
                  {/* Step 3 */}
                  <div
                    className={`w-6 h-6 rounded-full ${currentStep >= 3 ? "bg-[#E8B600] border-2 border-[#E8B600]" : "bg-white border-2 border-gray-200"} flex items-center justify-center`}
                  >
                    {currentStep > 3 ? (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "online" ? (
            currentStep === 1 ? (
              <RegistrationForm onContinue={() => setCurrentStep(2)} />
            ) : currentStep === 2 ? (
              <StudentDetailsForm
                onContinue={handleContinue}
                students={students}
                setStudents={setStudents}
              />
            ) : (
              <ReviewAndPay students={students} />
            )
          ) : (
            <div className="flex flex-col items-center justify-center w-full px-6 pt-4">
              <img
                src="/assets/viacall.svg"
                alt="Register via call"
                className="w-full max-w-xs mx-auto"
              />
              <div className="text-center mt-6">
                <h2
                  className="text-[20px] text-black mb-2"
                  style={{ fontFamily: "Spartan, sans-serif", fontWeight: 600 }}
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
                  Our friendly agent is ready to help you
                  <br />
                  register. Simply tap &apos;Call Now&apos; to get started.
                </p>
                <a
                  href="tel:+918113037647"
                  className="block w-full bg-[#f2c200] text-white font-semibold rounded-full py-3 text-lg shadow hover:bg-[#e6b800] transition mt-2"
                >
                  Call Now
                </a>
                <p className="text-gray-400 text-sm mt-2 text-center">
                  Alternative number:{" "}
                  <a
                    href="tel:+919895931658"
                    className="underline hover:text-gray-600"
                  >
                    +91 9895931658
                  </a>
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
      <BottomSheetFooter />
    </div>
  );
}
