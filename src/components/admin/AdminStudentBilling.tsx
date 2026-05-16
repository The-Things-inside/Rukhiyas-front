"use client";

import { useState } from "react";
import {
  formatAdminFeeDate,
  isFeeExpiryInFuture,
  type StudentFeeDetails,
} from "@/lib/admin-student-fees";
import AdminRecordPaymentSheet from "@/components/admin/AdminRecordPaymentSheet";

function PaymentCard({
  variant,
  dueDate,
  amount,
  onRecord,
  layout = "mobile",
}: {
  variant: "pending" | "upcoming";
  dueDate: string;
  amount: number;
  onRecord: () => void;
  layout?: "mobile" | "desktop";
}) {
  const isPending = variant === "pending";
  const isDesktop = layout === "desktop";

  const border = isPending
    ? isDesktop
      ? "border-[#E20020]"
      : "border-[#F44336]"
    : "border-[#E8B600]";
  const titleColor = isPending
    ? isDesktop
      ? "text-[#E20020]"
      : "text-[#F44336]"
    : "text-[#E8B600]";
  const dateColor = isPending
    ? isDesktop
      ? "text-[#E20020]"
      : "text-[#F44336]"
    : "text-black";
  const btnClass = isPending
    ? isDesktop
      ? "bg-[#E20020] text-[#FAFAFA]"
      : "bg-[#F44336] text-white"
    : "bg-[#E8B600] text-[#FAFAFA]";

  if (isDesktop) {
    return (
      <div className={`flex flex-1 flex-col rounded-xl border p-4 ${border}`}>
        <p
          className={`mb-4 text-[16px] font-medium ${titleColor}`}
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          {isPending ? "Pending Payments" : "Upcoming Payment"}
        </p>
        <div className="mb-4 flex w-full items-start justify-between">
          <div className="flex flex-col gap-4">
            <span
              className="text-[16px] text-[#5E5E5E]"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Due Date
            </span>
            <span
              className={`text-[16px] font-medium ${dateColor}`}
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              {dueDate}
            </span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <span
              className="text-[16px] text-[#5E5E5E]"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Amount
            </span>
            <span
              className="text-[16px] font-medium text-black"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              ₹{amount}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onRecord}
          className={`mt-auto h-11 w-full rounded-[22px] text-[18px] font-bold capitalize ${btnClass}`}
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          Record Payment
        </button>
      </div>
    );
  }

  return (
    <div className={`flex-1 rounded-xl border p-4 ${border}`}>
      <div
        className={`mb-2 text-[15px] font-bold ${titleColor}`}
        style={{ fontFamily: "Satoshi, sans-serif" }}
      >
        {isPending ? "Pending Payments" : "Upcoming Payment"}
      </div>
      <div className="mb-1 flex justify-between text-[13px] text-[#9B9B9B]">
        <span style={{ fontFamily: "Satoshi, sans-serif" }}>Due Date</span>
        <span style={{ fontFamily: "Satoshi, sans-serif" }}>Amount</span>
      </div>
      <div className="mb-4 flex justify-between">
        <span
          className={`text-[15px] font-bold ${dateColor}`}
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          {dueDate}
        </span>
        <span
          className="text-[17px] font-bold text-[#19191F]"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          ₹{amount}
        </span>
      </div>
      <button
        type="button"
        onClick={onRecord}
        className={`w-full rounded-full py-3 text-[17px] font-bold shadow-md transition active:scale-95 ${btnClass}`}
        style={{ fontFamily: "Satoshi, sans-serif" }}
      >
        Record Payment
      </button>
    </div>
  );
}

type AdminStudentBillingProps = {
  studentId: number;
  feeDetails: StudentFeeDetails | null;
  feeLoading: boolean;
  feeError: string | null;
  onPaymentRecorded: () => void;
  className?: string;
  variant?: "mobile" | "desktop";
};

export default function AdminStudentBilling({
  studentId,
  feeDetails,
  feeLoading,
  feeError,
  onPaymentRecorded,
  className = "",
  variant = "mobile",
}: AdminStudentBillingProps) {
  const [recordOpen, setRecordOpen] = useState(false);
  const isDesktop = variant === "desktop";
  const layout = isDesktop ? "desktop" : "mobile";

  const showPending =
    feeDetails && !isFeeExpiryInFuture(feeDetails.fee_expiry);
  const showUpcoming =
    feeDetails && isFeeExpiryInFuture(feeDetails.fee_expiry);

  const dueDate = formatAdminFeeDate(feeDetails?.fee_expiry);
  const amount = feeDetails?.amount ?? 0;

  return (
    <>
      <AdminRecordPaymentSheet
        open={recordOpen}
        onClose={() => setRecordOpen(false)}
        studentId={studentId}
        feeDetails={feeDetails}
        onSuccess={onPaymentRecorded}
      />

      <div className={className}>
        <h3
          className={`font-semibold text-black ${
            isDesktop ? "mb-4 text-[18px]" : "mb-4 text-[18px] font-bold text-[#19191F]"
          }`}
          style={{ fontFamily: isDesktop ? "Spartan, sans-serif" : "Satoshi, sans-serif" }}
        >
          Billing & Payment
        </h3>

        {feeLoading && (
          <p
            className="text-[#9B9B9B]"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            Loading fee details…
          </p>
        )}

        {feeError && (
          <p
            className="text-red-500"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            {feeError}
          </p>
        )}

        {!feeLoading && !feeError && feeDetails && (
          <div
            className={`flex gap-4 ${
              isDesktop ? "flex-row" : "flex-col"
            }`}
          >
            {showPending && (
              <PaymentCard
                variant="pending"
                dueDate={dueDate}
                amount={amount}
                onRecord={() => setRecordOpen(true)}
                layout={layout}
              />
            )}
            {showUpcoming && (
              <PaymentCard
                variant="upcoming"
                dueDate={dueDate}
                amount={amount}
                onRecord={() => setRecordOpen(true)}
                layout={layout}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}
