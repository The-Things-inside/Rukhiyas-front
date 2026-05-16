"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  AdminFormField,
  adminInputClass,
  adminTextareaClass,
} from "@/components/admin/AdminFormField";
import { updateParentDetails } from "@/lib/admin-profile-updates";

export type AdminParentEditSource = {
  id: number;
  full_name: string;
  mobile_no: string;
  email?: string;
  alternative_mobile?: string | null;
  address?: string | null;
  primary_address?: string | null;
};

type AdminEditParentSheetProps = {
  open: boolean;
  onClose: () => void;
  parent: AdminParentEditSource | null;
  onSuccess: () => void;
};

export default function AdminEditParentSheet({
  open,
  onClose,
  parent,
  onSuccess,
}: AdminEditParentSheetProps) {
  const [fullName, setFullName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [altMobile, setAltMobile] = useState("");
  const [primaryAddress, setPrimaryAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !parent) return;
    setFullName(parent.full_name ?? "");
    setMobileNo(parent.mobile_no ?? "");
    setEmail(parent.email ?? "");
    setAltMobile(parent.alternative_mobile ?? "");
    setPrimaryAddress(
      parent.primary_address ?? parent.address ?? "",
    );
  }, [open, parent]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !parent) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!parent) return;
    if (!fullName.trim()) {
      toast.error("Parent name is required");
      return;
    }
    if (!mobileNo.trim()) {
      toast.error("Primary number is required");
      return;
    }
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    const alt = altMobile.trim();
    if (alt.length > 0 && alt.length < 10) {
      toast.error("Alternate number must be at least 10 digits, or leave it empty");
      return;
    }
    if (mobileNo.trim().length < 10) {
      toast.error("Primary number must be at least 10 digits");
      return;
    }

    setSubmitting(true);
    try {
      await updateParentDetails(parent.id, {
        full_name: fullName.trim(),
        mobile_no: mobileNo.trim(),
        email: email.trim(),
        alternative_mobile: alt || undefined,
        primary_address: primaryAddress.trim() || undefined,
      });
      toast.success("Parent details updated");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update parent",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center md:items-center md:p-6">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-parent-title"
        className="relative flex max-h-[92vh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-[24px] bg-white md:rounded-[24px]"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#EAEAEA] px-6 py-5">
          <h2
            id="edit-parent-title"
            className="text-[20px] font-semibold text-black"
            style={{ fontFamily: "Spartan, sans-serif" }}
          >
            Edit Parent Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[22px] leading-none text-black"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-y-auto p-6"
        >
          <AdminFormField label="Full Name" className="mb-4">
            <input
              className={adminInputClass}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </AdminFormField>

          <AdminFormField label="Primary Number" className="mb-4">
            <input
              type="tel"
              className={adminInputClass}
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              required
            />
          </AdminFormField>

          <AdminFormField label="Alternate Number (optional)" className="mb-4">
            <input
              type="tel"
              className={adminInputClass}
              value={altMobile}
              onChange={(e) => setAltMobile(e.target.value)}
              placeholder="Leave empty if none"
            />
          </AdminFormField>

          <AdminFormField label="Email" className="mb-4">
            <input
              type="email"
              className={adminInputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </AdminFormField>

          <AdminFormField label="Primary Address" className="mb-6">
            <textarea
              className={adminTextareaClass}
              rows={3}
              value={primaryAddress}
              onChange={(e) => setPrimaryAddress(e.target.value)}
            />
          </AdminFormField>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-[22px] bg-[#E8B600] py-3 text-[18px] font-bold capitalize text-[#FAFAFA] disabled:opacity-60"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            {submitting ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
