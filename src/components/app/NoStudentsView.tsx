"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type StudentDraft = {
  id: string;
  fullName: string;
  className: string;
  division: string;
  school: string;
  address: string;
};

function MobileTopBar({ title }: { title: string }) {
  const router = useRouter();
  return (
    <div className="w-full bg-[#19191F] px-4 pt-4 pb-3 flex items-center gap-3 max-w-md mx-auto">
      <button
        type="button"
        aria-label="Go back"
        onClick={() => router.back()}
        className="text-white text-xl leading-none"
      >
        ‹
      </button>
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
}: {
  index: number;
  draft: StudentDraft;
  onChange: (next: StudentDraft) => void;
  onRemove?: () => void;
  removable: boolean;
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

      <TextInput
        label="School"
        value={draft.school}
        onChange={(v) => onChange({ ...draft, school: v })}
        placeholder="Select School"
      />

      <TextInput
        label="Student Address"
        value={draft.address}
        onChange={(v) => onChange({ ...draft, address: v })}
        placeholder="Enter student address"
      />
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
    { id: "s1", fullName: "", className: "", division: "", school: "", address: "" },
  ]);

  const canAddAnother = drafts.length < 5;

  return (
    <div className="max-w-md mx-auto">
      <MobileTopBar title="Add Student" />

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
                    school: "",
                    address: "",
                  },
                ]);
              }}
              className="w-full h-[52px] rounded-[26px] border border-[#E8B600] text-[#E8B600] text-[18px] font-bold"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Add Another Student
            </button>

            <button
              type="button"
              onClick={() => {
                onAddAnother?.(drafts);
                // until the add-student API is provided, keep user here
                // (we’ll wire the real submission next chat)
              }}
              className="w-full h-[52px] rounded-[26px] bg-[#E8B600] text-white text-[18px] font-bold"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Continue
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
  );
}

export function NoStudentsDesktop() {
  const router = useRouter();
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
              value=""
              onChange={() => {}}
              placeholder="Enter student's full name"
            />
            <div className="w-full flex gap-[10px]">
              <div className="flex-1">
                <TextInput
                  label="Class"
                  value=""
                  onChange={() => {}}
                  placeholder="Enter class"
                />
              </div>
              <div className="flex-1">
                <TextInput
                  label="Division"
                  value=""
                  onChange={() => {}}
                  placeholder="Enter division"
                />
              </div>
            </div>
            <TextInput
              label="School"
              value=""
              onChange={() => {}}
              placeholder="Select School"
            />
            <TextInput
              label="Student Address"
              value=""
              onChange={() => {}}
              placeholder="Enter student address"
            />
          </div>

          <button
            type="button"
            className="w-full h-[52px] rounded-[26px] bg-[#E8B600] text-white text-[18px] font-bold"
            style={{ fontFamily: "Satoshi, sans-serif" }}
            onClick={() => router.push("/register")}
          >
            Continue
          </button>
        </div>
      </div>
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

