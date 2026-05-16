"use client";

export function AdminFormField({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label
        className="text-[16px] text-[#5E5E5E]"
        style={{ fontFamily: "Satoshi, sans-serif" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export const adminInputClass =
  "w-full rounded-[12px] border border-[#AAAAAA] bg-white px-4 py-3 text-[16px] text-black outline-none focus:ring-2 focus:ring-[#E8B600]/30";

export const adminTextareaClass =
  "w-full resize-none rounded-[12px] border border-[#AAAAAA] bg-white px-4 py-3 text-[16px] text-black outline-none focus:ring-2 focus:ring-[#E8B600]/30";
