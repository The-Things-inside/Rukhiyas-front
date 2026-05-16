"use client";

import { useMemo, useState } from "react";

const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

type DateRangePickerProps = {
  open: boolean;
  onClose: () => void;
  selected: Date[];
  onChange: (dates: Date[]) => void;
};

export default function DateRangePicker({
  open,
  onClose,
  selected,
  onChange,
}: DateRangePickerProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [viewDate, setViewDate] = useState(() => new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = viewDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const weeks = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const rows: (number | null)[][] = [[]];
    let row = 0;
    for (let i = 0; i < firstDay; i++) rows[row].push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      if (rows[row].length === 7) {
        row += 1;
        rows[row] = [];
      }
      rows[row].push(day);
    }
    while (rows[row].length < 7) rows[row].push(null);
    return rows;
  }, [year, month]);

  if (!open) return null;

  function toggleDay(day: number) {
    const date = new Date(year, month, day);
    if (date < today) return;
    const exists = selected.some((d) => sameDay(d, date));
    if (exists) {
      onChange(selected.filter((d) => !sameDay(d, date)));
    } else {
      onChange([...selected, date]);
    }
  }

  function isSelected(day: number): boolean {
    return selected.some((d) => sameDay(d, new Date(year, month, day)));
  }

  function isDisabled(day: number): boolean {
    return new Date(year, month, day) < today;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close calendar"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-[370px] overflow-hidden rounded-[24px] border border-[#EAEAEA] bg-white shadow-lg"
        style={{
          boxShadow:
            "0 3px 3px rgba(0,0,0,0.04), 0 11px 5.5px rgba(0,0,0,0.03), 0 25px 7.5px rgba(0,0,0,0.02)",
        }}
      >
        <div className="px-6 pt-3">
          <div className="flex items-center justify-center gap-7 py-2">
            <button
              type="button"
              aria-label="Previous month"
              className="text-[20px] text-[#444444]"
              onClick={() =>
                setViewDate(new Date(year, month - 1, 1))
              }
            >
              ‹
            </button>
            <p
              className="text-[16px] font-medium text-black"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              {monthLabel}
            </p>
            <button
              type="button"
              aria-label="Next month"
              className="text-[20px] text-[#444444]"
              onClick={() =>
                setViewDate(new Date(year, month + 1, 1))
              }
            >
              ›
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0 px-1">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="py-1 text-center text-[13px] font-bold uppercase text-[#3C3C4399]"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                {d}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-[7px] pb-2 pt-1">
            {weeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 px-1">
                {week.map((day, di) =>
                  day ? (
                    <button
                      key={`${wi}-${di}`}
                      type="button"
                      disabled={isDisabled(day)}
                      onClick={() => toggleDay(day)}
                      className={`relative mx-auto flex h-11 w-11 items-center justify-center rounded-full text-[20px] transition ${
                        isSelected(day)
                          ? "bg-[#E8B600]/25 font-bold text-[#E8B600]"
                          : isDisabled(day)
                            ? "text-[#AAAAAA] cursor-not-allowed"
                            : "text-black hover:bg-gray-100"
                      }`}
                      style={{ fontFamily: "Satoshi, sans-serif" }}
                    >
                      <span className={isSelected(day) ? "text-[22px]" : ""}>
                        {day}
                      </span>
                    </button>
                  ) : (
                    <div key={`${wi}-${di}`} className="h-11 w-11" />
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-[#54545657] px-4 py-2">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[6px] bg-[#E8B600] px-[11px] py-[6px] text-[16px] font-medium text-white"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
