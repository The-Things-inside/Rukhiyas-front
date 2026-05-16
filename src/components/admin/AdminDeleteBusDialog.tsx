"use client";

import { deleteBus, type AdminBus } from "@/lib/admin-buses";

export default function AdminDeleteBusDialog({
  bus,
  open,
  deleting,
  onClose,
  onConfirm,
  onDeletingChange,
}: {
  bus: AdminBus | null;
  open: boolean;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onDeletingChange: (loading: boolean) => void;
}) {
  if (!open || !bus) return null;

  const handleDelete = async () => {
    onDeletingChange(true);
    try {
      await deleteBus(bus.id);
      onConfirm();
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete bus");
    } finally {
      onDeletingChange(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close"
        onClick={() => !deleting && onClose()}
      />
      <div
        className="relative w-full max-w-[400px] rounded-[24px] bg-white p-6 shadow-xl"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-bus-title"
        aria-describedby="delete-bus-desc"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#DC2626"
            strokeWidth="2"
          >
            <path d="M12 9v4M12 17h.01" />
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h2
          id="delete-bus-title"
          className="mb-2 text-[20px] font-semibold text-black"
          style={{ fontFamily: "Spartan, sans-serif" }}
        >
          Delete this bus?
        </h2>
        <p
          id="delete-bus-desc"
          className="mb-6 text-[16px] text-[#5E5E5E]"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          You are about to permanently delete bus{" "}
          <strong className="text-[#19191F]">{bus.reg_no}</strong>
          {bus.route ? (
            <>
              {" "}
              ({bus.route})
            </>
          ) : null}
          . This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="flex h-11 flex-1 items-center justify-center rounded-[22px] border border-[#EAEAEA] bg-white text-[16px] font-bold text-[#19191F] disabled:opacity-50"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex h-11 flex-1 items-center justify-center rounded-[22px] bg-red-600 text-[16px] font-bold text-white disabled:opacity-50"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            {deleting ? "Deleting…" : "Delete Bus"}
          </button>
        </div>
      </div>
    </div>
  );
}
