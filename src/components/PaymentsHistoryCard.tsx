import React from "react";
import { formatFeeExpiry } from "@/lib/utils";

export interface PaymentsHistoryCardProps {
  amount: number | null;
  isPaid: boolean;
  feeExpiry?: string | null;
  paying?: boolean;
  onPayNow?: () => void;
  onViewHistory?: () => void;
  canViewHistory?: boolean;
}

function formatInr(amount: number | null): string {
  if (amount == null || !Number.isFinite(amount)) return "—";
  return `₹${amount}`;
}

export default function PaymentsHistoryCard({
  amount,
  isPaid,
  feeExpiry = null,
  paying = false,
  onPayNow,
  onViewHistory,
  canViewHistory = true,
}: PaymentsHistoryCardProps) {
  const sectionTitle = isPaid ? "Next Payment" : "Payment Pending";
  const dueDateLabel = formatFeeExpiry(feeExpiry);

  return (
    <div
      className="bg-white rounded-[20px] shadow-lg p-4 w-full mx-auto border border-gray-200"
      style={{ boxShadow: "0 8px 32px 0 rgba(0,0,0,0.12)" }}
    >
      <h2
        className="mb-2"
        style={{
          fontFamily: "Spartan, sans-serif",
          fontWeight: 600,
          fontSize: 18,
          color: "#000",
        }}
      >
        Payments & History
      </h2>
      <div className="mb-4">
        <div
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 500,
            fontSize: 16,
            color: isPaid ? "#000" : "#DC2626",
          }}
          className="mb-2"
        >
          {sectionTitle}
        </div>
        <div className="flex justify-between items-center mb-1">
          <span
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 500,
              fontSize: 16,
              color: "#5e5e5e",
            }}
          >
            Due Date
          </span>
          <span
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 500,
              fontSize: 16,
              color: "#5e5e5e",
            }}
          >
            Amount
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 500,
              fontSize: 16,
              color: "#000",
            }}
          >
            {dueDateLabel}
          </span>
          <span
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 500,
              fontSize: 16,
              color: "#000",
            }}
          >
            {formatInr(amount)}
          </span>
        </div>
        {!isPaid && onPayNow && (
          <button
            type="button"
            disabled={paying}
            onClick={onPayNow}
            className="w-full bg-[#E8B600] text-white font-bold rounded-full py-2 text-base mb-2 hover:bg-[#d4a900] transition disabled:opacity-60"
          >
            {paying ? "Processing…" : "Pay Now"}
          </button>
        )}
        <button
          type="button"
          disabled={!canViewHistory || !onViewHistory}
          onClick={onViewHistory}
          className="w-full border border-[#E8B600] text-[#E8B600] font-bold rounded-full py-2 text-base bg-white hover:bg-[#fffbe6] transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          View Payment History
        </button>
      </div>
      <div
        style={{
          fontFamily: "Satoshi, sans-serif",
          fontWeight: 500,
          fontSize: 16,
          color: "#000",
        }}
        className="mb-2"
      >
        Offers
      </div>
      <div className="border border-[#E8B600] rounded-xl p-3 mt-2">
        <div
          className="text-center text-black text-sm font-semibold mb-2"
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 500,
            fontSize: 16,
            color: "#000",
          }}
        >
          Pay annually and save more
        </div>
        <div className="flex justify-between text-xs mb-2">
          <div className="flex flex-col items-center">
            <span className="text-gray-500">Annual Total</span>
            <span className="text-black font-bold text-base">
              {amount != null ? formatInr(amount * 12) : "—"}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-500">Offer Price</span>
            <span className="text-black font-bold text-base">
              {amount != null ? formatInr(Math.round(amount * 12 * 0.88)) : "—"}
            </span>
          </div>
        </div>
        {!isPaid && onPayNow && (
          <button
            type="button"
            disabled={paying}
            onClick={onPayNow}
            className="w-full bg-[#E8B600] text-white font-bold rounded-full py-2 text-base mt-2 hover:bg-[#d4a900] transition disabled:opacity-60"
          >
            {paying ? "Processing…" : "Pay Now"}
          </button>
        )}
        <div className="text-xs text-center text-gray-500 mt-2 italic">
          {feeExpiry
            ? `Offer expires on ${formatFeeExpiry(feeExpiry)}*`
            : "Offer expiry date not available*"}
        </div>
      </div>
    </div>
  );
}
