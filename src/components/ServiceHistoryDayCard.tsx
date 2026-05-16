import Image from "next/image";
import { formatBusDate, formatBusTime, type BusDayRecord } from "@/lib/bus-history";

function hasAnyRideActivity(record: BusDayRecord): boolean {
  return Boolean(
    record.bus_start || record.bus_arrived_school || record.bus_departed_school,
  );
}

export default function ServiceHistoryDayCard({ day }: { day: BusDayRecord }) {
  const departed = Boolean(day.bus_departed_school);

  return (
    <article
      className="w-full rounded-[12px] border border-[#EAEAEA] bg-white p-4"
      style={{
        boxShadow:
          "0 3px 3px rgba(0,0,0,0.04), 0 11px 5.5px rgba(0,0,0,0.03), 0 25px 7.5px rgba(0,0,0,0.02)",
      }}
    >
      <p
        className="mb-3 text-[16px] font-medium text-black"
        style={{ fontFamily: "Satoshi, sans-serif" }}
      >
        {formatBusDate(day.date)}
      </p>

      {!hasAnyRideActivity(day) ? (
        <p
          className="text-[14px] text-[#5E5E5E]"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          No ride activity recorded for this day.
        </p>
      ) : (
        <>
          <div className="mb-2 flex items-center gap-2">
            <Image src="/assets/homeicon.svg" alt="" width={28} height={28} />
            <span
              className="text-base font-medium text-[#5E5E5E]"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Started
            </span>
            <span className="flex-1" />
            <span
              className="text-base font-medium text-black"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              {formatBusTime(day.bus_start)}
            </span>
          </div>
          <div className="mb-2 ml-[14px] h-4 border-l-2 border-dotted border-gray-300" />
          <div className="mb-2 flex items-center gap-2">
            <Image src="/assets/school.svg" alt="" width={28} height={28} />
            <span
              className="text-base font-medium text-[#5E5E5E]"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Arrived School
            </span>
            <span className="flex-1" />
            <span
              className="text-base font-medium text-black"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              {formatBusTime(day.bus_arrived_school)}
            </span>
          </div>
          <div className="mb-2 ml-[14px] h-4 border-l-2 border-dotted border-gray-300" />
          <div className="flex items-center gap-2">
            <Image src="/assets/homeicon.svg" alt="" width={28} height={28} />
            <span
              className={`text-base font-medium ${departed ? "text-[#E8B600]" : "text-[#5E5E5E]"}`}
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Departed School
            </span>
            <span className="flex-1" />
            <span
              className={`text-base font-medium ${departed ? "text-[#E8B600]" : "text-black"}`}
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              {formatBusTime(day.bus_departed_school)}
            </span>
          </div>
        </>
      )}
    </article>
  );
}
