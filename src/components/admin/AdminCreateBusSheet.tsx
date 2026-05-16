"use client";

import { useState } from "react";
import { createBus, type CreateBusInput } from "@/lib/admin-buses";
import { AdminFormField, adminInputClass } from "@/components/admin/AdminFormField";

const emptyForm = {
  reg_no: "",
  model: "",
  capacity: "",
  driver_name: "",
  driver_phonenumber: "",
  route: "",
};

export default function AdminCreateBusSheet({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState(emptyForm);
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const capacity = parseInt(form.capacity, 10);
    if (!form.reg_no.trim() || !form.model.trim()) {
      setError("Registration number and model are required.");
      return;
    }
    if (isNaN(capacity) || capacity <= 0) {
      setError("Enter a valid capacity greater than 0.");
      return;
    }

    const payload: CreateBusInput = {
      reg_no: form.reg_no.trim(),
      model: form.model.trim(),
      capacity,
      driver_name: form.driver_name.trim() || undefined,
      driver_phonenumber: form.driver_phonenumber.trim() || undefined,
      route: form.route.trim() || undefined,
      driver_photo: photo,
    };

    setSubmitting(true);
    try {
      await createBus(payload);
      setForm(emptyForm);
      setPhoto(null);
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create bus");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setForm(emptyForm);
    setPhoto(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center md:items-center md:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close"
        onClick={handleClose}
      />
      <div
        className="relative flex max-h-[92vh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-[24px] bg-white md:rounded-[24px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-bus-title"
      >
        <div className="border-b border-[#EAEAEA] px-6 py-4">
          <h2
            id="create-bus-title"
            className="text-[20px] font-semibold text-black"
            style={{ fontFamily: "Spartan, sans-serif" }}
          >
            Add New Bus
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-y-auto px-6 py-4"
        >
          {error && (
            <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-600">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-4">
            <AdminFormField label="Registration number *">
              <input
                name="reg_no"
                className={adminInputClass}
                value={form.reg_no}
                onChange={handleChange}
                required
              />
            </AdminFormField>
            <AdminFormField label="Model *">
              <input
                name="model"
                className={adminInputClass}
                value={form.model}
                onChange={handleChange}
                required
              />
            </AdminFormField>
            <AdminFormField label="Capacity *">
              <input
                name="capacity"
                type="number"
                min={1}
                className={adminInputClass}
                value={form.capacity}
                onChange={handleChange}
                required
              />
            </AdminFormField>
            <AdminFormField label="Driver name">
              <input
                name="driver_name"
                className={adminInputClass}
                value={form.driver_name}
                onChange={handleChange}
              />
            </AdminFormField>
            <AdminFormField label="Driver phone">
              <input
                name="driver_phonenumber"
                className={adminInputClass}
                value={form.driver_phonenumber}
                onChange={handleChange}
              />
            </AdminFormField>
            <AdminFormField label="Route">
              <input
                name="route"
                className={adminInputClass}
                value={form.route}
                onChange={handleChange}
              />
            </AdminFormField>
            <AdminFormField label="Driver photo">
              <input
                type="file"
                accept="image/*"
                className={adminInputClass}
                onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
              />
            </AdminFormField>
          </div>

          <div className="mt-6 flex gap-3 pb-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="flex h-11 flex-1 items-center justify-center rounded-[22px] border border-[#E8B600] bg-white text-[16px] font-bold text-[#E8B600] disabled:opacity-50"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex h-11 flex-1 items-center justify-center rounded-[22px] bg-[#E8B600] text-[16px] font-bold text-white disabled:opacity-50"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              {submitting ? "Creating…" : "Create Bus"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
