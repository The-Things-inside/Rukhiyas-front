"use client";

import type { StudentDriver } from "@/lib/student-driver";

export type { StudentDriver };

type BusDetailsCardProps = {
  driver: StudentDriver | null;
  loading?: boolean;
  noBus?: boolean;
  studentSelected?: boolean;
  className?: string;
};

export default function BusDetailsCard({
  driver,
  loading = false,
  noBus = false,
  studentSelected = true,
  className = "",
}: BusDetailsCardProps) {
  if (!studentSelected) {
    return (
      <div className={`bg-white rounded-[24px] border border-[#EAEAEA] shadow-sm px-4 py-6 text-center text-[#9B9B9B] ${className}`}>
        No student selected.
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={`bg-white rounded-[24px] border border-[#EAEAEA] shadow-sm px-4 py-6 text-center text-[#9B9B9B] ${className}`}
        style={{ fontFamily: "Satoshi, sans-serif" }}
      >
        Loading bus details…
      </div>
    );
  }

  if (noBus || !driver) {
    return (
      <div
        className={`bg-white rounded-[24px] border border-[#EAEAEA] shadow-sm px-4 py-6 text-center text-[#9B9B9B] ${className}`}
        style={{ fontFamily: "Satoshi, sans-serif" }}
      >
        No bus assigned for this student.
      </div>
    );
  }

  return (
    <div
      className={`bg-white border border-[#EAEAEA] rounded-[24px] px-4 py-6 flex flex-col gap-4 shadow-sm ${className}`}
      style={{
        boxShadow:
          "0px 3px 3px rgba(0,0,0,0.04), 0px 11px 5.5px rgba(0,0,0,0.03), 0px 25px 7.5px rgba(0,0,0,0.02)",
      }}
    >
      <h3
        className="text-[18px] font-semibold text-black"
        style={{ fontFamily: "Spartan, sans-serif" }}
      >
        Bus Details
      </h3>

      <div className="flex items-center justify-between gap-3 w-full">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="h-11 w-11 shrink-0 rounded-[22px] border-2 border-[#DEDEDE] p-0.5 overflow-hidden bg-white">
            <img
              src={driver.driver_photo_url || "/assets/DP.svg"}
              alt={driver.driver_name}
              className="h-full w-full rounded-[20px] object-cover"
            />
          </div>
          <div className="min-w-0">
            <p
              className="text-[16px] text-[#5E5E5E]"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Driver
            </p>
            <p
              className="text-[18px] font-bold text-black truncate"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              {driver.driver_name || "—"}
            </p>
          </div>
        </div>
        {driver.driver_phonenumber ? (
          <a
            href={`tel:${driver.driver_phonenumber}`}
            className="shrink-0 border border-[#E8B600] text-[#E8B600] font-bold rounded-[22px] px-6 py-2.5 text-[18px] hover:bg-[#fffbe6] transition"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            Call
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="shrink-0 border border-[#E8B600] text-[#E8B600] font-bold rounded-[22px] px-6 py-2.5 text-[18px] opacity-50 cursor-not-allowed"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            Call
          </button>
        )}
      </div>

      <div className="h-px w-full bg-[#EAEAEA]" />

      <div className="flex flex-col gap-2 w-full">
        <div className="flex gap-8 flex-wrap">
          <div>
            <p
              className="text-[16px] text-[#5E5E5E]"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Bus Number
            </p>
            <p
              className="text-[16px] font-medium text-black"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              {driver.reg_no || "—"}
            </p>
          </div>
          <div>
            <p
              className="text-[16px] text-[#5E5E5E]"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Bus Route
            </p>
            <p
              className="text-[16px] font-medium text-black"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              {driver.route || "—"}
            </p>
          </div>
        </div>
        <div>
          <p
            className="text-[16px] text-[#5E5E5E]"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            Vehicle Model
          </p>
          <p
            className="text-[16px] font-medium text-black"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            {driver.model || "—"}
            {driver.on_duty !== undefined && (
              <span
                className={`ml-2 text-[14px] font-bold ${
                  driver.on_duty ? "text-[#E8B600]" : "text-[#9B9B9B]"
                }`}
              >
                · {driver.on_duty ? "On duty" : "Off duty"}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
