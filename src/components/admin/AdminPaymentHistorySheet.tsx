"use client";

import { useEffect, useState } from "react";
import PaymentHistoryEntryCard from "@/components/PaymentHistoryEntryCard";
import { fetchParentPaymentHistory } from "@/lib/admin-payments";
import type { StudentPayment } from "@/lib/payments";

type AdminPaymentHistorySheetProps = {
  open: boolean;
  onClose: () => void;
  parentId: number | null;
  subtitle?: string;
};

export default function AdminPaymentHistorySheet({
  open,
  onClose,
  parentId,
  subtitle,
}: AdminPaymentHistorySheetProps) {
  const [payments, setPayments] = useState<StudentPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !parentId) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchParentPaymentHistory(parentId);
        if (!cancelled) setPayments(data);
      } catch (e) {
        if (!cancelled) {
          setPayments([]);
          setError(
            e instanceof Error ? e.message : "Failed to load payment history",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, parentId]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[85] flex items-end justify-center md:items-center md:p-6">
      <button
        type="button"
        aria-label="Close payment history"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-payment-history-title"
        className="relative flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-t-[24px] bg-white py-6 md:max-h-[85vh] md:rounded-[24px]"
      >
        <div className="flex shrink-0 items-center justify-between px-6">
          <h2
            id="admin-payment-history-title"
            className="text-[18px] font-semibold text-black"
            style={{ fontFamily: "Spartan, sans-serif" }}
          >
            Payment History
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid h-6 w-6 place-items-center text-[22px] leading-none text-black"
          >
            ×
          </button>
        </div>

        {subtitle ? (
          <p
            className="mt-1 px-6 text-[14px] text-[#5E5E5E]"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            {subtitle}
          </p>
        ) : null}

        <div className="mt-6 flex-1 overflow-y-auto px-6 pb-6">
          {loading ? (
            <p
              className="py-8 text-center text-[#5E5E5E]"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Loading payment history…
            </p>
          ) : null}

          {!loading && error ? (
            <p
              className="py-8 text-center text-red-600"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              {error}
            </p>
          ) : null}

          {!loading && !error && payments.length === 0 ? (
            <p
              className="py-8 text-center text-[#5E5E5E]"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              No payments found yet.
            </p>
          ) : null}

          {!loading && !error && payments.length > 0 ? (
            <div className="flex flex-col gap-4">
              {payments.map((payment) => (
                <PaymentHistoryEntryCard key={payment.id} payment={payment} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
