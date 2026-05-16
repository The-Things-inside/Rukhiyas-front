"use client";

import type { AdminRequest } from "@/lib/admin-dashboard";

function requestTitle(type: string): string {
  switch (type) {
    case "temporary_address":
      return "Temp Address Change";
    case "pause_service":
      return "Pause Service";
    case "permanent_address":
      return "Perm Address Change";
    default:
      return type.replace(/_/g, " ");
  }
}

export default function AdminRequestCard({
  request,
  onApprove,
  onReject,
  approveLoading,
  denyLoading,
}: {
  request: AdminRequest;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  approveLoading: number | null;
  denyLoading: number | null;
}) {
  const date = request.created_at
    ? new Date(request.created_at).toLocaleDateString("en-GB")
    : "";

  return (
    <div
      className="border border-[#E8B600] rounded-xl bg-white p-4 shadow-sm"
      style={{ boxShadow: "0 2px 8px 0 #E8B60022" }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span
          className="text-[15px] font-medium text-[#E8B600]"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          {requestTitle(request.request_type)}
        </span>
        <span
          className="text-[15px] text-[#9B9B9B]"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          {date}
        </span>
      </div>

      <div className="mb-2 flex justify-between text-[15px]">
        <span style={{ fontFamily: "Satoshi, sans-serif" }}>
          Student ID: {request.student_id}
        </span>
        <span style={{ fontFamily: "Satoshi, sans-serif" }}>
          Parent ID: {request.parent_id}
        </span>
      </div>

      {request.request_type === "temporary_address" && (
        <div className="mb-3 space-y-2 rounded-xl border border-[#E8B600] bg-[#FAFAFA] p-3">
          <div>
            <span className="text-[13px] text-[#9B9B9B]">New Pick Up</span>
            <p className="mt-1 rounded-lg bg-[#E0E0E0] px-3 py-2 text-[15px] text-[#19191F]">
              {request.temp_pick_address || "—"}
            </p>
          </div>
          <div>
            <span className="text-[13px] text-[#9B9B9B]">New Drop Off</span>
            <p className="mt-1 rounded-lg bg-[#E0E0E0] px-3 py-2 text-[15px] text-[#19191F]">
              {request.temp_drop_address || "Same as pick up address"}
            </p>
          </div>
          <div>
            <span className="text-[13px] text-[#9B9B9B]">Dates</span>
            <p className="mt-1 rounded-lg bg-[#E0E0E0] px-3 py-2 text-[15px] text-[#19191F]">
              {request.temp_dates?.length
                ? request.temp_dates.join(", ")
                : "—"}
            </p>
          </div>
        </div>
      )}

      {request.request_type === "pause_service" && (
        <div className="mb-3 space-y-2">
          <div>
            <span className="text-[13px] text-[#9B9B9B]">Pause dates / reason</span>
            <p className="mt-1 text-[15px] font-medium text-[#19191F]">
              {request.requested_data || "—"}
            </p>
          </div>
        </div>
      )}

      {request.request_type === "permanent_address" && (
        <div className="mb-3">
          <span className="text-[13px] text-[#9B9B9B]">New Address</span>
          <p className="mt-1 text-[15px] font-medium text-[#19191F]">
            {request.requested_data || request.current_data || "—"}
          </p>
        </div>
      )}

      {request.current_data &&
        request.request_type !== "permanent_address" &&
        request.request_type !== "temporary_address" && (
          <div className="mb-3">
            <span className="text-[13px] text-[#9B9B9B]">Details</span>
            <p className="mt-1 text-[15px] text-[#19191F]">{request.current_data}</p>
          </div>
        )}

      <div className="flex gap-3">
        <button
          type="button"
          disabled={approveLoading === request.id || denyLoading === request.id}
          onClick={() => onApprove(request.id)}
          className="flex-1 rounded-full bg-[#E8B600] py-2.5 text-[16px] font-bold text-white disabled:opacity-60"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          {approveLoading === request.id ? "Approving…" : "Confirm"}
        </button>
        {request.request_type !== "pause_service" && (
          <button
            type="button"
            disabled={approveLoading === request.id || denyLoading === request.id}
            onClick={() => onReject(request.id)}
            className="flex-1 rounded-full border border-[#E8B600] bg-white py-2.5 text-[16px] font-bold text-[#E8B600] disabled:opacity-60"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            {denyLoading === request.id ? "Denying…" : "Deny"}
          </button>
        )}
      </div>
    </div>
  );
}
