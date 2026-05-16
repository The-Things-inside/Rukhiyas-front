"use client";

import type { AdminStudent } from "@/lib/admin-dashboard";

type AdminNewRegistrationCardProps = {
  student: AdminStudent;
  editing: boolean;
  feeInput: string;
  updating: boolean;
  onFeeInputChange: (value: string) => void;
  onEditFee: () => void;
  onCancelEdit: () => void;
  onConfirmFee: () => void;
};

export default function AdminNewRegistrationCard({
  student,
  editing,
  feeInput,
  updating,
  onFeeInputChange,
  onEditFee,
  onCancelEdit,
  onConfirmFee,
}: AdminNewRegistrationCardProps) {
  const date = student.created_at
    ? new Date(student.created_at).toLocaleDateString("en-GB")
    : "";

  return (
    <div className="flex w-full flex-col gap-4 rounded-[12px] border border-[#E8B600] p-4 md:max-w-[339px] md:flex-[1_1_calc(33.333%-11px)] md:min-w-[280px]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span
            className="text-[16px] text-[#5E5E5E]"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            Name
          </span>
          <span
            className="text-[16px] font-medium text-black"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            {student.full_name}
          </span>
        </div>
        <span
          className="shrink-0 text-[16px] font-medium text-[#5E5E5E]"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          {date}
        </span>
      </div>

      <div className="flex gap-8">
        <div className="flex flex-col gap-1">
          <span
            className="text-[16px] text-[#5E5E5E]"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            Class
          </span>
          <span
            className="text-[16px] font-medium text-black"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            {student.class_name} {student.division}
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span
            className="text-[16px] text-[#5E5E5E]"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            School
          </span>
          <span
            className="text-[16px] font-medium text-black"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            School ID: {student.school_id}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span
          className="text-[16px] text-[#5E5E5E]"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          Address
        </span>
        <span
          className="text-[16px] font-medium text-black"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          {student.student_address}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <span
          className="text-[16px] text-[#5E5E5E]"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          {editing ? "Exact Fee" : "Estimate Fee"}
        </span>
        {editing ? (
          <input
            className="mt-1 w-full rounded-lg border border-[#E8B600] px-3 py-2 text-[16px] text-black"
            style={{ fontFamily: "Satoshi, sans-serif" }}
            value={feeInput}
            onChange={(e) => onFeeInputChange(e.target.value)}
            autoFocus
          />
        ) : (
          <span
            className="text-[16px] font-medium text-black"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            ₹{student.approximate_fees}/month
          </span>
        )}
      </div>

      {editing ? (
        <div className="flex gap-2.5">
          <button
            type="button"
            className="flex h-11 flex-1 items-center justify-center rounded-[22px] border border-[#E8B600] bg-white text-[18px] font-bold capitalize text-[#E8B600] disabled:opacity-50"
            style={{ fontFamily: "Satoshi, sans-serif" }}
            onClick={onCancelEdit}
            disabled={updating}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex h-11 flex-1 items-center justify-center rounded-[22px] bg-[#E8B600] text-[18px] font-bold capitalize text-[#FAFAFA] disabled:opacity-50"
            style={{ fontFamily: "Satoshi, sans-serif" }}
            onClick={onConfirmFee}
            disabled={updating}
          >
            {updating ? "Updating…" : "Confirm Fee"}
          </button>
        </div>
      ) : (
        <div className="flex gap-2.5">
          <button
            type="button"
            className="flex h-11 flex-1 items-center justify-center rounded-[22px] bg-[#E8B600] text-[18px] font-bold capitalize text-[#FAFAFA]"
            style={{ fontFamily: "Satoshi, sans-serif" }}
            onClick={onEditFee}
          >
            Edit Fee
          </button>
          <button
            type="button"
            className="flex h-11 flex-1 items-center justify-center rounded-[22px] border border-[#E8B600] bg-white text-[18px] font-bold capitalize text-[#E8B600]"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            Confirm Fee
          </button>
        </div>
      )}
    </div>
  );
}
