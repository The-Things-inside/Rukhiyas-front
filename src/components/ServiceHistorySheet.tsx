"use client";

import { useEffect, useState } from "react";
import ServiceHistoryDayCard from "@/components/ServiceHistoryDayCard";
import {
  fetchBusHistory,
  type BusDayRecord,
} from "@/lib/bus-history";
import { isSessionExpiredError } from "@/lib/auth-token";

type ServiceHistorySheetProps = {
  open: boolean;
  onClose: () => void;
  busId: number | null;
  studentName?: string;
};

export default function ServiceHistorySheet({
  open,
  onClose,
  busId,
  studentName,
}: ServiceHistorySheetProps) {
  const [days, setDays] = useState<BusDayRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !busId) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBusHistory(busId);
        if (!cancelled) setDays(data);
      } catch (e) {
        if (isSessionExpiredError(e)) return;
        if (!cancelled) {
          setDays([]);
          setError(
            e instanceof Error ? e.message : "Failed to load service history",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, busId]);

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
    <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-6">
      <button
        type="button"
        aria-label="Close service history"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-history-title"
        className="relative flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-t-[24px] bg-white py-6 md:rounded-[24px]"
      >
        <div className="flex shrink-0 items-center justify-between px-6">
          <h2
            id="service-history-title"
            className="text-[18px] font-semibold text-black"
            style={{ fontFamily: "Spartan, sans-serif" }}
          >
            Service History
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

        {studentName ? (
          <p
            className="mt-1 px-6 text-[14px] text-[#5E5E5E]"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            {studentName}
          </p>
        ) : null}

        <div className="mt-6 flex-1 overflow-y-auto px-6 pb-6">
          {loading ? (
            <p
              className="py-8 text-center text-[#5E5E5E]"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Loading service history…
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

          {!loading && !error && days.length === 0 ? (
            <p
              className="py-8 text-center text-[#5E5E5E]"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              No service history found yet.
            </p>
          ) : null}

          {!loading && !error && days.length > 0 ? (
            <div className="flex flex-col gap-4">
              {days.map((day) => (
                <ServiceHistoryDayCard
                  key={`${day.bus_id}-${day.date}`}
                  day={day}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
