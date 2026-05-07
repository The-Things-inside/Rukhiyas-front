"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import SchoolDropdown from "@/components/SchoolDropdown";

type StudentDraft = {
  id: string;
  fullName: string;
  className: string;
  division: string;
  schoolId: string;
  addressLabel: string;
  location?: { lat: number; lng: number };
};

const MapAddressPicker = dynamic(() => import("@/components/MapAddressPicker"), {
  ssr: false,
});

function MobileTopBar({ title }: { title: string }) {
  return (
    <div className="w-full bg-[#14141B] h-[62px] flex items-center px-[24px] max-w-md mx-auto">
      <div
        className="text-white text-[20px] font-semibold"
        style={{ fontFamily: "Spartan, sans-serif" }}
      >
        {title}
      </div>
    </div>
  );
}

function MobileProgress({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center">
        <div className="w-[132px] flex items-center">
          <div
            className={`h-[24px] w-[24px] rounded-full grid place-items-center ${
              step >= 1 ? "bg-[#E8B600]" : "bg-white border border-[#D1D5DB]"
            }`}
          >
            {step > 1 ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 6L9 17L4 12"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <div className="h-[8px] w-[8px] rounded-full bg-white" />
            )}
          </div>
          <div className="flex-1 h-[2px] bg-[#D1D5DB]" />
        </div>
        <div className="w-[132px] flex items-center">
          <div
            className={`h-[24px] w-[24px] rounded-full grid place-items-center ${
              step >= 2 ? "bg-[#E8B600]" : "bg-white border border-[#D1D5DB]"
            }`}
          >
            {step > 2 ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 6L9 17L4 12"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : step === 2 ? (
              <div className="h-[8px] w-[8px] rounded-full bg-white" />
            ) : null}
          </div>
          <div className="flex-1 h-[2px] bg-[#D1D5DB]" />
        </div>
        <div className="flex items-center">
          <div
            className={`h-[24px] w-[24px] rounded-full grid place-items-center ${
              step >= 3 ? "bg-[#E8B600]" : "bg-white border border-[#D1D5DB]"
            }`}
          >
            {step === 3 ? <div className="h-[8px] w-[8px] rounded-full bg-white" /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="w-full flex flex-col gap-[4px]">
      <div
        className="text-[16px] text-black"
        style={{ fontFamily: "Satoshi, sans-serif", fontWeight: 500 }}
      >
        {label}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-[#AAA] rounded-[12px] px-[16px] py-[18px] text-[16px] text-black placeholder:text-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#E8B600]"
      />
    </div>
  );
}

function MobileStudentCard({
  index,
  draft,
  onChange,
  onRemove,
  removable,
  onPickLocation,
}: {
  index: number;
  draft: StudentDraft;
  onChange: (next: StudentDraft) => void;
  onRemove?: () => void;
  removable: boolean;
  onPickLocation: () => void;
}) {
  return (
    <div className="w-full border border-[#E8B600] rounded-[12px] px-[16px] py-[24px] flex flex-col gap-[16px]">
      <div
        className="w-full flex items-start justify-between text-[16px]"
        style={{ fontFamily: "Satoshi, sans-serif", fontWeight: 500 }}
      >
        <div className="text-[#E8B600]">{`Student ${index + 1}`}</div>
        {removable && (
          <button
            type="button"
            className="text-black underline"
            onClick={onRemove}
          >
            Remove
          </button>
        )}
      </div>

      <TextInput
        label="Full Name"
        value={draft.fullName}
        onChange={(v) => onChange({ ...draft, fullName: v })}
        placeholder="Enter student's full name"
      />

      <div className="w-full flex gap-[10px]">
        <div className="flex-1">
          <TextInput
            label="Class"
            value={draft.className}
            onChange={(v) => onChange({ ...draft, className: v })}
            placeholder="Enter class"
          />
        </div>
        <div className="flex-1">
          <TextInput
            label="Division"
            value={draft.division}
            onChange={(v) => onChange({ ...draft, division: v })}
            placeholder="Enter division"
          />
        </div>
      </div>

      <div className="w-full flex flex-col gap-[4px]">
        <div
          className="text-[16px] text-black"
          style={{ fontFamily: "Satoshi, sans-serif", fontWeight: 500 }}
        >
          School
        </div>
        <SchoolDropdown
          value={draft.schoolId}
          onChange={(schoolId) => onChange({ ...draft, schoolId })}
        />
      </div>

      <div className="w-full flex flex-col gap-[4px]">
        <div
          className="text-[16px] text-black"
          style={{ fontFamily: "Satoshi, sans-serif", fontWeight: 500 }}
        >
          Student Address
        </div>
        <button
          type="button"
          onClick={onPickLocation}
          className="w-full border border-[#AAA] rounded-[12px] px-[16px] py-[18px] text-left text-[16px] focus:outline-none focus:ring-2 focus:ring-[#E8B600] bg-white"
        >
          <span
            className={draft.addressLabel ? "text-black" : "text-[#B3B3B3]"}
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            {draft.addressLabel || "Select location on map"}
          </span>
        </button>
      </div>
    </div>
  );
}

export function NoStudentsMobile({
  onAddAnother,
}: {
  onAddAnother?: (drafts: StudentDraft[]) => void;
}) {
  const router = useRouter();
  const [step] = useState<2>(2);
  const [drafts, setDrafts] = useState<StudentDraft[]>([
    {
      id: "s1",
      fullName: "",
      className: "",
      division: "",
      schoolId: "",
      addressLabel: "",
      location: undefined,
    },
  ]);
  const [mapOpenFor, setMapOpenFor] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canAddAnother = drafts.length < 5;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#14141B]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <MobileTopBar title="Add Student" />
      </div>

      <div className="pt-[116px]">
        <div className="bg-white rounded-tl-[24px] rounded-tr-[24px] px-[24px] pt-[24px] pb-[40px]">
        <div className="w-full flex flex-col items-center gap-[24px]">
          <MobileProgress step={step} />
          <div
            className="text-[20px] text-black font-semibold"
            style={{ fontFamily: "Spartan, sans-serif" }}
          >
            Student Details
          </div>

          <div className="w-full flex flex-col gap-[24px]">
            {drafts.map((d, idx) => (
              <MobileStudentCard
                key={d.id}
                index={idx}
                draft={d}
                removable={drafts.length > 1}
                onRemove={() =>
                  setDrafts((prev) => prev.filter((x) => x.id !== d.id))
                }
                onChange={(next) =>
                  setDrafts((prev) => prev.map((x) => (x.id === d.id ? next : x)))
                }
                onPickLocation={() => setMapOpenFor(d.id)}
              />
            ))}
          </div>

          <div className="w-full flex flex-col gap-[16px]">
            <button
              type="button"
              onClick={() => {
                if (!canAddAnother) return;
                setDrafts((prev) => [
                  ...prev,
                  {
                    id: `s${prev.length + 1}`,
                    fullName: "",
                    className: "",
                    division: "",
                    schoolId: "",
                    addressLabel: "",
                    location: undefined,
                  },
                ]);
              }}
              className="w-full h-[52px] rounded-[26px] border border-[#E8B600] text-[#E8B600] text-[18px] font-bold"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Add Another Student
            </button>

            {submitError && (
              <div
                className="text-red-500 text-sm text-center"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                {submitError}
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                // Validate + submit to backend using:
                // 1) GET /parent-details -> parent_id
                // 2) POST /register-student (one per student draft)
                (async () => {
                  setSubmitting(true);
                  setSubmitError(null);
                  try {
                    const token = localStorage.getItem("access_token");
                    if (!token) throw new Error("Missing access token");

                    const parentRes = await fetch("/api/backend/parent-details", {
                      headers: { accept: "application/json", Authorization: `Bearer ${token}` },
                    });
                    if (!parentRes.ok) throw new Error("Failed to fetch parent details");
                    const parent = (await parentRes.json()) as { id: number };

                    const validDrafts = drafts.filter(
                      (d) =>
                        d.fullName.trim() &&
                        d.className.trim() &&
                        d.division.trim() &&
                        d.schoolId &&
                        d.location,
                    );
                    if (validDrafts.length === 0) {
                      throw new Error("Please fill all details and pick location on map.");
                    }

                    for (const d of validDrafts) {
                      const res = await fetch("/api/backend/register-student", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          accept: "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          parent_id: parent.id,
                          school_id: Number(d.schoolId),
                          full_name: d.fullName,
                          class_name: d.className,
                          division: d.division,
                          student_address: d.addressLabel || "Selected from map",
                          location_latitude: d.location!.lat,
                          location_longitude: d.location!.lng,
                        }),
                      });
                      if (!res.ok) {
                        const body = await res.json().catch(() => null);
                        throw new Error(body?.detail?.[0]?.msg || body?.detail || "Failed to register student");
                      }
                    }

                    onAddAnother?.(drafts);
                    // Reload `/app` so it re-checks `/students/me` and shows dashboard.
                    window.location.reload();
                  } catch (e) {
                    setSubmitError(e instanceof Error ? e.message : "Something went wrong");
                  } finally {
                    setSubmitting(false);
                  }
                })();
              }}
              disabled={submitting}
              className="w-full h-[52px] rounded-[26px] bg-[#E8B600] text-white text-[18px] font-bold disabled:opacity-60"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              {submitting ? "Submitting..." : "Continue"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/register")}
              className="w-full text-center text-[14px] text-[#5C5C5C] underline"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Go to full registration
            </button>
          </div>
        </div>
      </div>
      </div>

      <MapPickerModal
        openForId={mapOpenFor}
        drafts={drafts}
        onClose={() => setMapOpenFor(null)}
        onConfirm={(id, address, latlng) => {
          setDrafts((prev) =>
            prev.map((d) =>
              d.id === id
                ? { ...d, addressLabel: address, location: { lat: latlng.lat, lng: latlng.lng } }
                : d,
            ),
          );
          setMapOpenFor(null);
        }}
      />
    </div>
  );
}

function MapPickerModal({
  openForId,
  drafts,
  onClose,
  onConfirm,
}: {
  openForId: string | null;
  drafts: StudentDraft[];
  onClose: () => void;
  onConfirm: (id: string, address: string, latlng: { lat: number; lng: number }) => void;
}) {
  const draft = drafts.find((d) => d.id === openForId) || null;
  if (!draft || !openForId) return null;
  return (
    <MapAddressPicker
      open={true}
      onClose={onClose}
      initialLatLng={draft.location}
      onConfirm={(address, latlng) => onConfirm(openForId, address, latlng)}
    />
  );
}

export function NoStudentsDesktop() {
  const router = useRouter();
  const [draft, setDraft] = useState<StudentDraft>({
    id: "d1",
    fullName: "",
    className: "",
    division: "",
    schoolId: "",
    addressLabel: "",
    location: undefined,
  });
  const [mapOpen, setMapOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  return (
    <div className="hidden md:block min-h-screen bg-white">
      <div className="h-[128px] bg-[#14141B] px-[60px] flex items-center justify-between">
        <button type="button" onClick={() => router.push("/")} aria-label="Go home">
          <Image
            src="/assets/Rukhiyas-desktop.svg"
            alt="RUKHIYAS"
            width={98}
            height={64}
          />
        </button>
        <div
          className="text-white text-[32px] font-semibold"
          style={{ fontFamily: "Spartan, sans-serif" }}
        >
          Add Student
        </div>
        <div className="flex items-center gap-[10px]">
          <button
            type="button"
            className="h-[44px] w-[147px] rounded-[22px] text-white text-[18px] font-bold"
            style={{ fontFamily: "Satoshi, sans-serif" }}
            onClick={() => router.back()}
          >
            Go Back
          </button>
          <button
            type="button"
            className="h-[44px] w-[147px] rounded-[22px] text-[#E8B600] text-[18px] font-bold"
            style={{ fontFamily: "Satoshi, sans-serif" }}
            onClick={() => router.push("/contact")}
          >
            Need Help?
          </button>
        </div>
      </div>

      <div className="py-[48px] flex flex-col items-center gap-[24px]">
        <div className="w-[732px] flex flex-col items-center gap-[24px]">
          <div className="w-full flex items-center justify-center">
            <div className="w-[240px] flex items-center">
              <div className="w-[132px] flex items-center">
                <div className="h-[24px] w-[24px] rounded-full bg-[#E8B600]" />
                <div className="flex-1 h-[2px] bg-[#D1D5DB]" />
              </div>
              <div className="flex items-center">
                <div className="h-[24px] w-[24px] rounded-full bg-white border border-[#D1D5DB]" />
              </div>
            </div>
          </div>

          <div
            className="text-[24px] font-semibold text-black text-center"
            style={{ fontFamily: "Spartan, sans-serif" }}
          >
            Student Details
          </div>

          <div className="w-full flex flex-col gap-[16px]">
            <TextInput
              label="Full Name"
              value={draft.fullName}
              onChange={(v) => setDraft((p) => ({ ...p, fullName: v }))}
              placeholder="Enter student's full name"
            />
            <div className="w-full flex gap-[10px]">
              <div className="flex-1">
                <TextInput
                  label="Class"
                  value={draft.className}
                  onChange={(v) => setDraft((p) => ({ ...p, className: v }))}
                  placeholder="Enter class"
                />
              </div>
              <div className="flex-1">
                <TextInput
                  label="Division"
                  value={draft.division}
                  onChange={(v) => setDraft((p) => ({ ...p, division: v }))}
                  placeholder="Enter division"
                />
              </div>
            </div>
            <div className="w-full flex flex-col gap-[4px]">
              <div
                className="text-[16px] text-black"
                style={{ fontFamily: "Satoshi, sans-serif", fontWeight: 500 }}
              >
                School
              </div>
              <SchoolDropdown
                value={draft.schoolId}
                onChange={(schoolId) => setDraft((p) => ({ ...p, schoolId }))}
              />
            </div>

            <div className="w-full flex flex-col gap-[4px]">
              <div
                className="text-[16px] text-black"
                style={{ fontFamily: "Satoshi, sans-serif", fontWeight: 500 }}
              >
                Student Address
              </div>
              <button
                type="button"
                onClick={() => setMapOpen(true)}
                className="w-full border border-[#AAA] rounded-[12px] px-[16px] py-[18px] text-left text-[16px] focus:outline-none focus:ring-2 focus:ring-[#E8B600] bg-white"
              >
                <span
                  className={draft.addressLabel ? "text-black" : "text-[#B3B3B3]"}
                  style={{ fontFamily: "Satoshi, sans-serif" }}
                >
                  {draft.addressLabel || "Select location on map"}
                </span>
              </button>
            </div>
          </div>

          {submitError && (
            <div
              className="text-red-500 text-sm text-center"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              {submitError}
            </div>
          )}

          <button
            type="button"
            className="w-full h-[52px] rounded-[26px] bg-[#E8B600] text-white text-[18px] font-bold"
            style={{ fontFamily: "Satoshi, sans-serif" }}
            disabled={submitting}
            onClick={() => {
              (async () => {
                setSubmitting(true);
                setSubmitError(null);
                try {
                  const token = localStorage.getItem("access_token");
                  if (!token) throw new Error("Missing access token");

                  const parentRes = await fetch("/api/backend/parent-details", {
                    headers: {
                      accept: "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  });
                  if (!parentRes.ok) throw new Error("Failed to fetch parent details");
                  const parent = (await parentRes.json()) as { id: number };

                  if (
                    !draft.fullName.trim() ||
                    !draft.className.trim() ||
                    !draft.division.trim() ||
                    !draft.schoolId ||
                    !draft.location
                  ) {
                    throw new Error("Please fill all details and pick location on map.");
                  }

                  const res = await fetch("/api/backend/register-student", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      accept: "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      parent_id: parent.id,
                      school_id: Number(draft.schoolId),
                      full_name: draft.fullName,
                      class_name: draft.className,
                      division: draft.division,
                      student_address: draft.addressLabel || "Selected from map",
                      location_latitude: draft.location.lat,
                      location_longitude: draft.location.lng,
                    }),
                  });

                  if (!res.ok) {
                    const body = await res.json().catch(() => null);
                    throw new Error(
                      body?.detail?.[0]?.msg || body?.detail || "Failed to register student",
                    );
                  }

                  window.location.reload();
                } catch (e) {
                  setSubmitError(e instanceof Error ? e.message : "Something went wrong");
                } finally {
                  setSubmitting(false);
                }
              })();
            }}
          >
            {submitting ? "Submitting..." : "Continue"}
          </button>
        </div>
      </div>

      <MapAddressPicker
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        initialLatLng={draft.location}
        onConfirm={(address, latlng) => {
          setDraft((p) => ({
            ...p,
            addressLabel: address,
            location: { lat: latlng.lat, lng: latlng.lng },
          }));
          setMapOpen(false);
        }}
      />
    </div>
  );
}

export default function NoStudentsView() {
  return (
    <>
      <div className="md:hidden">
        <NoStudentsMobile />
      </div>
      <NoStudentsDesktop />
    </>
  );
}

