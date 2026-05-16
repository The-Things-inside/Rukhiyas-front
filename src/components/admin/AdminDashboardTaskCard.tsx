"use client";

type AdminDashboardTaskCardProps = {
  label: string;
  count: number | string;
  selected: boolean;
  onClick: () => void;
};

export default function AdminDashboardTaskCard({
  label,
  count,
  selected,
  onClick,
}: AdminDashboardTaskCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-6 rounded-[24px] p-6 transition ${
        selected
          ? "bg-[#FFFAEA]"
          : "border border-[#EAEAEA] bg-white text-black shadow-[0_3px_6px_rgba(0,0,0,0.04),0_11px_11px_rgba(0,0,0,0.03)] hover:border-[#E8B600]/40"
      }`}
    >
      <span
        className="text-center text-[20px] font-medium text-black md:text-[24px]"
        style={{ fontFamily: "Spartan, sans-serif" }}
      >
        {label}
      </span>
      <span
        className={`text-[32px] font-bold leading-none md:text-[36px] ${
          selected ? "text-[#E8B600]" : "text-black"
        }`}
        style={{ fontFamily: "Spartan, sans-serif" }}
      >
        {count}
      </span>
    </button>
  );
}
