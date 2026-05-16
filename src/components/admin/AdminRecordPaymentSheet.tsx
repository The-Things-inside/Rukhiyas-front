"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  formatAdminFeeDate,
  recordManualPayment,
  type StudentFeeDetails,
} from "@/lib/admin-student-fees";

const PAYMENT_METHODS = [
  { id: "GPay", label: "GPay" },
  { id: "PhonePe", label: "PhonePe" },
  { id: "Cash", label: "Cash" },
] as const;

type AdminRecordPaymentSheetProps = {
  open: boolean;
  onClose: () => void;
  studentId: number;
  feeDetails: StudentFeeDetails | null;
  onSuccess: () => void;
};

function toDateInputValue(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDisplayDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-");
  if (y && m && d) return `${d}/${m}/${y}`;
  return formatAdminFeeDate(isoDate);
}

export default function AdminRecordPaymentSheet({
  open,
  onClose,
  studentId,
  feeDetails,
  onSuccess,
}: AdminRecordPaymentSheetProps) {
  const [paymentDate, setPaymentDate] = useState(() =>
    toDateInputValue(new Date()),
  );
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [notes, setNotes] = useState("Collected by driver");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setPaymentDate(toDateInputValue(new Date()));
    setAmount(feeDetails?.amount != null ? String(feeDetails.amount) : "");
    setPaymentMethod("Cash");
    setNotes("Collected by driver");
  }, [open, feeDetails]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit() {
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    setSubmitting(true);
    try {
      await recordManualPayment(studentId, {
        amount: parsedAmount,
        frequency: "monthly",
        payment_date: new Date(paymentDate).toISOString(),
        payment_method: paymentMethod,
        notes: notes.trim() || "Manual payment recorded",
      });
      toast.success("Payment recorded successfully");
      onSuccess();
      onClose();
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Failed to record payment",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center md:items-center md:p-6">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="record-payment-title"
        className="relative flex max-h-[92vh] w-full max-w-[480px] flex-col overflow-hidden rounded-t-[24px] bg-white md:rounded-[24px]"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#EAEAEA] px-6 py-5">
          <h2
            id="record-payment-title"
            className="text-[20px] font-semibold text-black"
            style={{ fontFamily: "Spartan, sans-serif" }}
          >
            Record Payment
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[22px] leading-none text-black"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-4">
            <div className="flex flex-col gap-1">
              <label
                className="text-[16px] text-[#5E5E5E]"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                Date of Payment
              </label>
              <button
                type="button"
                onClick={() =>
                  (
                    document.getElementById(
                      "admin-payment-date",
                    ) as HTMLInputElement | null
                  )?.showPicker?.()
                }
                className="flex items-center justify-between rounded-[12px] border border-[#AAAAAA] bg-white p-4 text-left"
              >
                <span
                  className="text-[16px] font-medium text-[#5E5E5E]"
                  style={{ fontFamily: "Satoshi, sans-serif" }}
                >
                  {formatDisplayDate(paymentDate)}
                </span>
                <span className="flex items-center gap-1 text-[#5E5E5E]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <rect x="3" y="5" width="18" height="16" rx="3" stroke="#5E5E5E" strokeWidth="1.5" />
                    <path d="M16 3v4M8 3v4M3 9h18" stroke="#5E5E5E" strokeWidth="1.5" />
                  </svg>
                  <span className="text-lg">›</span>
                </span>
                <input
                  id="admin-payment-date"
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="sr-only"
                />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="text-[16px] text-[#5E5E5E]"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                Amount
              </label>
              <div className="flex items-center rounded-[12px] border border-[#AAAAAA] bg-white px-4 py-3">
                <span className="text-[16px] text-black">₹</span>
                <input
                  type="number"
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="ml-1 flex-1 bg-transparent text-[16px] text-black outline-none"
                  style={{ fontFamily: "Satoshi, sans-serif" }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-1">
            <span
              className="text-[16px] text-[#5E5E5E]"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Method of Payment
            </span>
            <div className="overflow-hidden rounded-[12px] border border-[#AAAAAA]">
              {PAYMENT_METHODS.map((method, index) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`flex w-full items-center justify-between p-4 text-left ${
                    index > 0 ? "border-t border-[#EBEBEB]" : ""
                  } ${paymentMethod === method.id ? "bg-white" : "bg-white"}`}
                >
                  <span
                    className="text-[16px] text-black"
                    style={{ fontFamily: "Satoshi, sans-serif" }}
                  >
                    {method.label}
                  </span>
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      paymentMethod === method.id
                        ? "border-[#E8B600] bg-[#E8B600]"
                        : "border-[#CCCCCC]"
                    }`}
                  >
                    {paymentMethod === method.id && (
                      <span className="h-2.5 w-2.5 rounded-full bg-white" />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-1">
            <label
              className="text-[16px] text-[#5E5E5E]"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Notes"
              className="w-full resize-none rounded-[12px] border border-[#AAAAAA] bg-white p-4 text-[16px] text-black outline-none focus:ring-2 focus:ring-[#E8B600]/30"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            />
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            className="mt-6 w-full rounded-[22px] bg-[#E8B600] py-3 text-[18px] font-bold capitalize text-[#FAFAFA] disabled:opacity-60"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            {submitting ? "Recording…" : "Record Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
