"use client";

import {
  formatBusEventTime,
  type BusTodayHistory,
} from "@/lib/admin-buses";

function HistoryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span
        className="text-[14px] text-[#5E5E5E]"
        style={{ fontFamily: "Satoshi, sans-serif" }}
      >
        {label}
      </span>
      <span
        className="text-right text-[14px] font-medium text-[#19191F]"
        style={{ fontFamily: "Satoshi, sans-serif" }}
      >
        {value}
      </span>
    </div>
  );
}

export default function AdminBusTrackPanel({
  history,
  loading,
  error,
}: {
  history: BusTodayHistory | null;
  loading?: boolean;
  error?: string | null;
}) {
  if (loading) {
    return (
      <p
        className="mt-3 rounded-xl border border-[#EAEAEA] bg-[#FAFAFA] px-4 py-3 text-center text-[14px] text-[#5E5E5E]"
        style={{ fontFamily: "Satoshi, sans-serif" }}
      >
        Loading today&apos;s trip…
      </p>
    );
  }

  if (error) {
    return (
      <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-600">
        {error}
      </p>
    );
  }

  if (!history) {
    return (
      <p
        className="mt-3 rounded-xl border border-[#EAEAEA] bg-[#FAFAFA] px-4 py-3 text-center text-[14px] text-[#5E5E5E]"
        style={{ fontFamily: "Satoshi, sans-serif" }}
      >
        No trip recorded for today yet.
      </p>
    );
  }

  return (
    <div className="mt-3 rounded-xl border border-[#E8B600] bg-[#FFFAEA] px-4 py-2">
      <p
        className="mb-1 border-b border-[#E8B600]/30 pb-2 text-[15px] font-semibold text-[#19191F]"
        style={{ fontFamily: "Spartan, sans-serif" }}
      >
        Today&apos;s trip · {history.date}
      </p>
      <HistoryRow label="Started" value={formatBusEventTime(history.bus_start)} />
      <HistoryRow
        label="Arrived at school"
        value={formatBusEventTime(history.bus_arrived_school)}
      />
      <HistoryRow
        label="Departed school"
        value={formatBusEventTime(history.bus_departed_school)}
      />
    </div>
  );
}
