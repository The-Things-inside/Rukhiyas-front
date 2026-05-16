"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  AdminFormField,
  adminInputClass,
  adminTextareaClass,
} from "@/components/admin/AdminFormField";
import { updateStudentDetails } from "@/lib/admin-profile-updates";

export type AdminStudentEditSource = {
  id: number;
  full_name: string;
  school_id: number;
  class_name: string;
  division: string;
  student_address: string;
  location_latitude?: number;
  location_longitude?: number;
  profile_picture_url?: string | null;
};

type AdminEditStudentSheetProps = {
  open: boolean;
  onClose: () => void;
  student: AdminStudentEditSource | null;
  onSuccess: () => void;
};

export default function AdminEditStudentSheet({
  open,
  onClose,
  student,
  onSuccess,
}: AdminEditStudentSheetProps) {
  const [fullName, setFullName] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [className, setClassName] = useState("");
  const [division, setDivision] = useState("");
  const [address, setAddress] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !student) return;
    setFullName(student.full_name ?? "");
    setSchoolId(String(student.school_id ?? ""));
    setClassName(student.class_name ?? "");
    setDivision(student.division ?? "");
    setAddress(student.student_address ?? "");
    setPhotoFile(null);
    setPhotoPreview(student.profile_picture_url ?? null);
  }, [open, student]);

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

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  if (!open || !student) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedSchoolId = Number(schoolId);
    if (!fullName.trim()) {
      toast.error("Student name is required");
      return;
    }
    if (!Number.isFinite(parsedSchoolId) || parsedSchoolId <= 0) {
      toast.error("Enter a valid school ID");
      return;
    }
    if (!className.trim() || !division.trim()) {
      toast.error("Class and division are required");
      return;
    }
    if (!address.trim()) {
      toast.error("Address is required");
      return;
    }

    setSubmitting(true);
    try {
      await updateStudentDetails(
        student.id,
        {
          full_name: fullName.trim(),
          school_id: parsedSchoolId,
          class_name: className.trim(),
          division: division.trim(),
          student_address: address.trim(),
          location_latitude: student.location_latitude ?? 0,
          location_longitude: student.location_longitude ?? 0,
        },
        photoFile,
      );
      toast.success("Student details updated");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update student",
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
        aria-labelledby="edit-student-title"
        className="relative flex max-h-[92vh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-[24px] bg-white md:rounded-[24px]"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#EAEAEA] px-6 py-5">
          <h2
            id="edit-student-title"
            className="text-[20px] font-semibold text-black"
            style={{ fontFamily: "Spartan, sans-serif" }}
          >
            Edit Student Details
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
          <div className="mb-4 flex items-center gap-4">
            <img
              src={photoPreview || "/assets/DP.svg"}
              alt=""
              className="h-14 w-14 rounded-full border-2 border-[#EBEBEB] object-cover"
            />
            <label className="cursor-pointer text-[16px] font-medium text-[#E8B600]">
              Change photo
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handlePhotoChange}
              />
            </label>
          </div>

          <AdminFormField label="Full Name" className="mb-4">
            <input
              className={adminInputClass}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </AdminFormField>

          <AdminFormField label="School ID" className="mb-4">
            <input
              type="number"
              min={1}
              className={adminInputClass}
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              required
            />
          </AdminFormField>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <AdminFormField label="Class">
              <input
                className={adminInputClass}
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
              />
            </AdminFormField>
            <AdminFormField label="Division">
              <input
                className={adminInputClass}
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                required
              />
            </AdminFormField>
          </div>

          <AdminFormField label="Address" className="mb-6">
            <textarea
              className={adminTextareaClass}
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
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
