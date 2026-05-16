"use client";

import { useState } from "react";
import { History, Receipt } from "lucide-react";
import AdminStudentBilling from "@/components/admin/AdminStudentBilling";
import type { StudentFeeDetails } from "@/lib/admin-student-fees";

const CARD =
  "rounded-[24px] border border-[#EAEAEA] bg-white p-6 shadow-[0_3px_6px_rgba(0,0,0,0.04),0_11px_11px_rgba(0,0,0,0.03)]";

function Field({
  label,
  value,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="text-[16px] text-[#5E5E5E]" style={{ fontFamily: "Satoshi, sans-serif" }}>
        {label}
      </span>
      <span
        className="text-[16px] font-medium text-black"
        style={{ fontFamily: "Satoshi, sans-serif" }}
      >
        {value}
      </span>
    </div>
  );
}

function ProfileAvatar({ src, name }: { src?: string | null; name: string }) {
  return (
    <img
      src={src || "/assets/DP.svg"}
      alt={name}
      className="h-10 w-10 shrink-0 rounded-full border-2 border-[#EBEBEB] object-cover"
    />
  );
}

type AdminStudentProfileDesktopProps = {
  student: {
    id: number;
    full_name: string;
    profile_picture_url?: string | null;
    class_name?: string;
    division?: string;
    school_id?: string | number;
    student_address?: string;
    bus_id?: string | number;
    bus_route?: string;
  };
  parent: {
    full_name: string;
    profile_picture_url?: string | null;
    mobile_no: string;
    alternative_mobile?: string | null;
    email?: string;
    address?: string | null;
  };
  requestsCount: number;
  studentId: number;
  feeDetails: StudentFeeDetails | null;
  feeLoading: boolean;
  feeError: string | null;
  onPaymentRecorded: () => void;
  requestsPanel?: React.ReactNode;
  onPaymentHistoryClick?: () => void;
  onEditStudent?: () => void;
  onEditParent?: () => void;
};

export default function AdminStudentProfileDesktop({
  student,
  parent,
  requestsCount,
  studentId,
  feeDetails,
  feeLoading,
  feeError,
  onPaymentRecorded,
  requestsPanel,
  onPaymentHistoryClick,
  onEditStudent,
  onEditParent,
}: AdminStudentProfileDesktopProps) {
  const [requestsOpen, setRequestsOpen] = useState(false);

  const classLabel = [student.class_name, student.division]
    .filter(Boolean)
    .join(" ");
  const busLabel = `Bus ${student.bus_id ?? "—"}${student.bus_route ? ` - ${student.bus_route}` : ""}`;

  return (
    <div className="h-full min-h-0 w-full min-w-0 flex-1 overflow-y-auto bg-[#FAFAFA]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-6 py-8 lg:px-8">
        {/* Row: Student | Parent | Quick actions */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr_minmax(200px,280px)]">
          {/* Student Details */}
          <section className={CARD}>
            <div className="mb-4 flex items-center justify-between">
              <h2
                className="text-[18px] font-semibold text-black"
                style={{ fontFamily: "Spartan, sans-serif" }}
              >
                Student Details
              </h2>
              <span
                className="text-[16px] text-[#5E5E5E]"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                ID No.{" "}
                <span className="font-medium text-black">{student.id}</span>
              </span>
            </div>

            <div className="mb-4 flex items-center gap-2.5">
              <ProfileAvatar src={student.profile_picture_url} name={student.full_name} />
              <span
                className="text-[18px] font-bold text-black"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                {student.full_name}
              </span>
            </div>

            <div className="mb-4 flex gap-8">
              <Field label="Class" value={classLabel || "—"} />
              <Field label="School" value={String(student.school_id ?? "—")} />
            </div>

            <Field
              label="Address"
              value={student.student_address || "—"}
              className="mb-4"
            />
            <Field
              label="Emergency Contact"
              value={parent.mobile_no}
              className="mb-4"
            />
            <Field label="Bus/Route" value={busLabel} className="mb-6" />

            <button
              type="button"
              onClick={onEditStudent}
              className="h-11 w-full rounded-[22px] bg-[#E8B600] text-[18px] font-bold capitalize text-[#FAFAFA]"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Edit
            </button>
          </section>

          {/* Parent Details */}
          <section className={CARD}>
            <h2
              className="mb-4 text-[18px] font-semibold text-black"
              style={{ fontFamily: "Spartan, sans-serif" }}
            >
              Parent Details
            </h2>

            <div className="mb-4 flex items-center gap-2.5">
              <ProfileAvatar src={parent.profile_picture_url} name={parent.full_name} />
              <span
                className="text-[18px] font-bold text-black"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                {parent.full_name}
              </span>
            </div>

            <div className="mb-4 flex flex-col gap-4">
              <Field label="Primary Number" value={parent.mobile_no} />
              <Field
                label="Alternate Number"
                value={parent.alternative_mobile || "—"}
              />
            </div>
            <Field label="Email" value={parent.email || "—"} className="mb-4" />
            <Field
              label="Primary Address"
              value={parent.address || "—"}
              className="mb-6"
            />

            <div className="flex gap-2.5">
              <a
                href={`tel:${parent.mobile_no}`}
                className="flex h-11 flex-1 items-center justify-center rounded-[22px] bg-[#E8B600] text-[18px] font-bold capitalize text-[#FAFAFA]"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                Call
              </a>
              <button
                type="button"
                onClick={onEditParent}
                className="flex h-11 flex-1 items-center justify-center rounded-[22px] border border-[#E8B600] text-[18px] font-bold capitalize text-[#E8B600]"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                Edit
              </button>
            </div>
          </section>

          {/* Quick actions */}
          <div className="flex flex-col gap-2.5 xl:min-h-full">
            <button
              type="button"
              onClick={() => setRequestsOpen((v) => !v)}
              className={`${CARD} flex flex-1 flex-col items-center justify-center gap-3 py-8 transition hover:border-[#E8B600]/40`}
            >
              <span
                className="text-[18px] font-semibold text-black"
                style={{ fontFamily: "Spartan, sans-serif" }}
              >
                Parent Requests
              </span>
              <span
                className="text-[29px] font-bold leading-none text-[#E8B600]"
                style={{ fontFamily: "Spartan, sans-serif" }}
              >
                {requestsCount}
              </span>
            </button>
            <button
              type="button"
              className={`${CARD} flex flex-1 flex-col items-center justify-center gap-3 py-8 transition hover:border-[#E8B600]/40`}
            >
              <span
                className="text-[18px] font-semibold text-black"
                style={{ fontFamily: "Spartan, sans-serif" }}
              >
                Service History
              </span>
              <History className="h-6 w-6 text-[#19191F]" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={onPaymentHistoryClick}
              className={`${CARD} flex flex-1 flex-col items-center justify-center gap-3 py-8 transition hover:border-[#E8B600]/40`}
            >
              <span
                className="text-[18px] font-semibold text-black"
                style={{ fontFamily: "Spartan, sans-serif" }}
              >
                Payment History
              </span>
              <Receipt className="h-6 w-6 text-[#19191F]" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {requestsOpen && requestsPanel && (
          <section className={CARD}>
            <h3
              className="mb-4 text-[18px] font-semibold text-black"
              style={{ fontFamily: "Spartan, sans-serif" }}
            >
              Parent Requests
            </h3>
            {requestsPanel}
          </section>
        )}

        {/* Billing */}
        <section className={CARD}>
          <AdminStudentBilling
            variant="desktop"
            studentId={studentId}
            feeDetails={feeDetails}
            feeLoading={feeLoading}
            feeError={feeError}
            onPaymentRecorded={onPaymentRecorded}
          />
        </section>
      </div>
    </div>
  );
}
