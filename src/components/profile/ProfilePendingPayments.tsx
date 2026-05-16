"use client";

import { formatFeeExpiry } from "@/lib/utils";

export type ProfileUnpaidStudent = {
  id: number;
  full_name: string;
  fee_expiry: string | null;
  actual_fees: number | null;
  approximate_fees: number | null;
};

function studentAmount(student: ProfileUnpaidStudent): number | null {
  return student.actual_fees ?? student.approximate_fees ?? null;
}

function formatInr(amount: number | null): string {
  if (amount == null || !Number.isFinite(amount)) return "₹0";
  return `₹${amount}`;
}

type ProfilePendingPaymentsProps = {
  students: ProfileUnpaidStudent[];
  paying: boolean;
  onPayNow: (studentId: number) => void;
  compact?: boolean;
};

export default function ProfilePendingPayments({
  students,
  paying,
  onPayNow,
  compact = false,
}: ProfilePendingPaymentsProps) {
  if (students.length === 0) return null;

  const total = students.reduce(
    (sum, s) => sum + (studentAmount(s) ?? 0),
    0,
  );

  const titleClass = compact
    ? "text-xs text-red-600 font-semibold mb-2"
    : "text-[12px] font-bold text-red-600";
  const labelClass = compact
    ? "font-medium text-gray-500"
    : "text-[#9B9B9B]";
  const rowClass = compact
    ? "flex justify-between text-xs text-black"
    : "flex justify-between text-black text-[12px]";
  const nameClass = compact
    ? "font-semibold text-black text-right max-w-[55%] truncate"
    : "font-medium text-black text-right max-w-[60%] truncate";
  const btnClass = compact
    ? "w-full bg-red-600 text-white font-semibold rounded-full py-1 disabled:opacity-60"
    : "w-full h-[38px] rounded-[19px] bg-red-600 text-white font-bold text-[14px] disabled:opacity-60";
  const dividerClass = compact
    ? "border-t border-red-200 pt-2 mt-2 first:border-0 first:pt-0 first:mt-0"
    : "border-t border-red-200 pt-[10px] mt-[10px] first:border-0 first:pt-0 first:mt-0";

  return (
    <div style={{ fontFamily: "Satoshi, sans-serif" }}>
      <p className={titleClass}>Payment Pending</p>

      {students.map((student) => {
        const amount = studentAmount(student);
        return (
          <div key={student.id} className={dividerClass}>
            <div className={`${rowClass} gap-2`}>
              <span className={labelClass}>Student</span>
              <span className={nameClass} title={student.full_name}>
                {student.full_name}
              </span>
            </div>
            <div className={`${rowClass} mt-1`}>
              <span className={labelClass}>Due Date</span>
              <span>{formatFeeExpiry(student.fee_expiry)}</span>
            </div>
            <div className={`${rowClass} ${compact ? "mb-2" : "mt-[6px]"}`}>
              <span className={labelClass}>Amount</span>
              <span>{formatInr(amount)}</span>
            </div>
            <button
              type="button"
              disabled={paying}
              onClick={() => onPayNow(student.id)}
              className={btnClass}
            >
              {paying ? "Processing…" : "Pay Now"}
            </button>
          </div>
        );
      })}

      {students.length > 1 && (
        <div
          className={`${rowClass} font-semibold ${compact ? "mt-2 pt-2 border-t border-red-200" : "mt-[10px] pt-[10px] border-t border-red-200"}`}
        >
          <span className={labelClass}>Total pending</span>
          <span>{formatInr(total)}</span>
        </div>
      )}

      <p
        className={
          compact
            ? "text-[10px] text-gray-500 text-center mt-2"
            : "mt-[6px] text-[10px] text-[#9B9B9B] text-center"
        }
      >
        Pay now to avoid late fees*
      </p>
    </div>
  );
}
