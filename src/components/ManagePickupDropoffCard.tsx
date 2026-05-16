"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import DateRangePicker from "@/components/DateRangePicker";
import {
  datesToIsoStrings,
  formatDatesFromStrings,
  formatPauseDuration,
  formatSelectedDatesLabel,
  requestPauseService,
  requestTemporaryAddressChange,
  type ParentServiceRequest,
} from "@/lib/parent-requests";
import { isSessionExpiredError } from "@/lib/auth-token";
import { toast } from "react-toastify";

const MapAddressPicker = dynamic(() => import("@/components/MapAddressPicker"), {
  ssr: false,
});

export interface ManagePickupStudent {
  id: number;
  full_name: string;
  student_address: string;
  temp_pick_address?: string | null;
  temp_drop_address?: string | null;
  temp_dates?: string[] | null;
}

type Mode = "default" | "edit-address" | "pause-service";

interface ManagePickupDropoffCardProps {
  selectedStudent: ManagePickupStudent | null;
}

function AgentNote() {
  return (
    <p
      className="text-[16px] text-black"
      style={{ fontFamily: "Satoshi, sans-serif" }}
    >
      For any changes within the next 2 days, please{" "}
      <a href="tel:+919876543210" className="font-medium underline">
        call our agent
      </a>
      .
    </p>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[16px] font-medium text-black"
      style={{ fontFamily: "Satoshi, sans-serif" }}
    >
      {children}
    </p>
  );
}

function ReadonlyBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full rounded-[12px] bg-[#EBEBEB] p-4 text-[16px] font-medium text-[#5E5E5E] whitespace-pre-wrap">
      {children}
    </div>
  );
}

function DatesTrigger({
  label,
  dates,
  onClick,
}: {
  label: string;
  dates: Date[];
  onClick: () => void;
}) {
  return (
    <div className="flex w-full flex-col gap-1">
      <FieldLabel>{label}</FieldLabel>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between rounded-[12px] border border-[#AAAAAA] bg-white p-4 text-left"
      >
        <span
          className={`text-[16px] font-medium ${dates.length ? "text-[#5E5E5E]" : "text-[#A4A4A4]"}`}
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          {formatSelectedDatesLabel(dates)}
        </span>
        <span className="flex items-center gap-1 text-[#5E5E5E]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="3" y="5" width="18" height="16" rx="3" stroke="#5E5E5E" strokeWidth="1.5" />
            <path d="M16 3v4M8 3v4M3 9h18" stroke="#5E5E5E" strokeWidth="1.5" />
          </svg>
          <span className="text-lg">›</span>
        </span>
      </button>
    </div>
  );
}

function PendingBox({
  title,
  datesLabel,
  detailLabel,
  detailValue,
  dropOffLabel,
  dropOffValue,
  footer,
}: {
  title: string;
  datesLabel: string;
  detailLabel: string;
  detailValue: string;
  dropOffLabel?: string;
  dropOffValue?: string;
  footer?: string;
}) {
  return (
    <div className="w-full rounded-[16px] border border-[#E8B600] p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span
          className="text-[16px] font-medium text-[#E8B600]"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          {title}
        </span>
        <span
          className="text-[16px] text-[#5E5E5E]"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          Pending Approval
        </span>
      </div>
      <p
        className="text-[16px] text-black"
        style={{ fontFamily: "Satoshi, sans-serif" }}
      >
        Changes saved! Our agents will verify and approve your updated locations
        within 24 hours.
      </p>
      <div className="flex flex-col gap-1">
        <FieldLabel>Dates</FieldLabel>
        <ReadonlyBox>{datesLabel}</ReadonlyBox>
      </div>
      <div className="flex flex-col gap-1">
        <FieldLabel>{detailLabel}</FieldLabel>
        <ReadonlyBox>{detailValue}</ReadonlyBox>
      </div>
      {dropOffLabel && dropOffValue ? (
        <div className="flex flex-col gap-1">
          <FieldLabel>{dropOffLabel}</FieldLabel>
          <ReadonlyBox>{dropOffValue}</ReadonlyBox>
        </div>
      ) : null}
      {footer ? (
        <p
          className="text-[16px] text-black"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          {footer}
        </p>
      ) : null}
    </div>
  );
}

export default function ManagePickupDropoffCard({
  selectedStudent,
}: ManagePickupDropoffCardProps) {
  const [mode, setMode] = useState<Mode>("default");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [pickUp, setPickUp] = useState("");
  const [dropOff, setDropOff] = useState("");
  const [sameAsPickup, setSameAsPickup] = useState(true);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingAddress, setPendingAddress] =
    useState<ParentServiceRequest | null>(null);
  const [pendingPause, setPendingPause] = useState<ParentServiceRequest | null>(
    null,
  );
  const [mapOpen, setMapOpen] = useState(false);
  const [mapTarget, setMapTarget] = useState<"pickup" | "dropoff">("pickup");

  const primaryAddress = selectedStudent?.student_address ?? "—";

  const hasStudentPendingAddress = Boolean(
    selectedStudent?.temp_pick_address ||
      (selectedStudent?.temp_dates && selectedStudent.temp_dates.length > 0),
  );

  useEffect(() => {
    if (!selectedStudent) return;
    setMode("default");
    setSelectedDates([]);
    setPickUp(selectedStudent.student_address);
    setDropOff(selectedStudent.student_address);
    setSameAsPickup(true);
    setReason("");
    setPendingAddress(null);
    setPendingPause(null);
  }, [selectedStudent?.id, selectedStudent?.student_address]);

  const dropoffDisplay = useMemo(() => {
    if (sameAsPickup) return "Same as pick up address";
    return dropOff || "—";
  }, [sameAsPickup, dropOff]);

  const resetForms = useCallback(() => {
    setMode("default");
    setSelectedDates([]);
    if (selectedStudent) {
      setPickUp(selectedStudent.student_address);
      setDropOff(selectedStudent.student_address);
    }
    setSameAsPickup(true);
    setReason("");
  }, [selectedStudent]);

  const openMap = (target: "pickup" | "dropoff") => {
    setMapTarget(target);
    setMapOpen(true);
  };

  const handleMapConfirm = (address: string) => {
    if (mapTarget === "pickup") {
      setPickUp(address);
      if (sameAsPickup) setDropOff(address);
    } else {
      setDropOff(address);
      setSameAsPickup(false);
    }
    setMapOpen(false);
  };

  const handleSaveAddress = async () => {
    if (!selectedStudent) return;
    const pickUpAddress = pickUp.trim();
    if (!pickUpAddress) {
      toast.error("Please enter a pick up address");
      return;
    }
    if (selectedDates.length === 0) {
      toast.error("Please select at least one date");
      return;
    }
    const dropOffAddress = sameAsPickup
      ? pickUpAddress
      : dropOff.trim() || pickUpAddress;
    setLoading(true);
    try {
      const res = await requestTemporaryAddressChange(selectedStudent.id, {
        temp_pick_address: pickUpAddress,
        temp_drop_address: dropOffAddress,
        temp_dates: datesToIsoStrings(selectedDates),
      });
      setPendingAddress(res);
      resetForms();
      toast.success("Temporary address change submitted");
    } catch (e) {
      if (isSessionExpiredError(e)) return;
      toast.error(
        e instanceof Error ? e.message : "Failed to submit address change",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSavePause = async () => {
    if (!selectedStudent) return;
    if (selectedDates.length === 0) {
      toast.error("Please select at least one date");
      return;
    }
    setLoading(true);
    try {
      const res = await requestPauseService(
        selectedStudent.id,
        formatPauseDuration(selectedDates),
      );
      setPendingPause(res);
      resetForms();
      toast.success("Pause service request submitted");
    } catch (e) {
      if (isSessionExpiredError(e)) return;
      toast.error(
        e instanceof Error ? e.message : "Failed to submit pause request",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!selectedStudent) {
    return (
      <div className="w-full rounded-[24px] border border-[#EAEAEA] bg-white p-6 text-center text-[#5E5E5E] shadow-sm">
        No student selected.
      </div>
    );
  }

  const cardClass =
    "w-full rounded-[24px] border border-[#EAEAEA] bg-white px-4 py-6 shadow-sm md:px-6 flex flex-col gap-4";

  const title =
    mode === "edit-address"
      ? "Edit Address"
      : mode === "pause-service"
        ? "Pause Service"
        : "Manage Pickup & Drop Off";

  return (
    <>
      <DateRangePicker
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        selected={selectedDates}
        onChange={setSelectedDates}
      />
      <MapAddressPicker
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        onConfirm={(address) => handleMapConfirm(address)}
      />

      <div className={cardClass}>
        <h2
          className="text-[18px] font-semibold text-black"
          style={{ fontFamily: "Spartan, sans-serif" }}
        >
          {title}
        </h2>

        {mode !== "default" && <AgentNote />}

        {mode === "default" && (
          <>
            <div className="flex flex-col gap-1">
              <FieldLabel>Pick Up</FieldLabel>
              <ReadonlyBox>{primaryAddress}</ReadonlyBox>
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel>Drop Off</FieldLabel>
              <ReadonlyBox>Same as pick up address</ReadonlyBox>
            </div>
            <div className="flex flex-col gap-2.5 md:flex-row md:gap-2.5">
              <button
                type="button"
                onClick={() => setMode("edit-address")}
                className="flex-1 rounded-[22px] bg-[#E8B600] py-2.5 text-[18px] font-bold capitalize text-[#FAFAFA]"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                Edit Address
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedDates([]);
                  setMode("pause-service");
                }}
                className="flex-1 rounded-[22px] border border-[#E8B600] bg-white py-2.5 text-[18px] font-bold capitalize text-[#E8B600]"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                Pause Service
              </button>
            </div>

            {(pendingAddress || hasStudentPendingAddress) && (
              <PendingBox
                title="Temporary Change"
                datesLabel={
                  pendingAddress?.temp_dates
                    ? formatDatesFromStrings(pendingAddress.temp_dates)
                    : formatDatesFromStrings(selectedStudent.temp_dates)
                }
                detailLabel="New Pick Up"
                detailValue={
                  pendingAddress?.temp_pick_address ??
                  selectedStudent.temp_pick_address ??
                  "—"
                }
                dropOffLabel="New Drop Off"
                dropOffValue={
                  pendingAddress?.temp_drop_address ??
                  selectedStudent.temp_drop_address ??
                  "Same as pick up address"
                }
                footer="Your location will revert to primary address on days not selected."
              />
            )}

            {pendingPause && (
              <PendingBox
                title="Service Paused"
                datesLabel={formatDatesFromStrings(pendingPause.temp_dates)}
                detailLabel="Reason"
                detailValue={
                  pendingPause.notes ??
                  pendingPause.requested_data ??
                  (reason || "—")
                }
                footer="Service will be paused only on selected dates, regular service will resumes on all other days."
              />
            )}
          </>
        )}

        {mode === "edit-address" && (
          <>
            <DatesTrigger
              label="Dates"
              dates={selectedDates}
              onClick={() => setCalendarOpen(true)}
            />
            <div className="flex flex-col gap-1">
              <FieldLabel>Pick Up</FieldLabel>
              <button
                type="button"
                onClick={() => openMap("pickup")}
                className="flex w-full items-center justify-between rounded-[12px] border border-[#AAAAAA] bg-white p-4 text-left"
              >
                <span
                  className="line-clamp-2 flex-1 text-[16px] font-medium text-[#5E5E5E] pr-2"
                  style={{ fontFamily: "Satoshi, sans-serif" }}
                >
                  {pickUp || "Address"}
                </span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M4 20h4l10-10-4-4L4 16v4z" stroke="#5E5E5E" strokeWidth="1.5" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel>Drop Off</FieldLabel>
              <button
                type="button"
                onClick={() => {
                  if (sameAsPickup) {
                    setSameAsPickup(false);
                    setDropOff(pickUp);
                  }
                  openMap("dropoff");
                }}
                className="flex w-full items-center justify-between rounded-[12px] border border-[#AAAAAA] bg-white p-4 text-left"
              >
                <span
                  className="line-clamp-2 flex-1 text-[16px] font-medium text-[#5E5E5E] pr-2"
                  style={{ fontFamily: "Satoshi, sans-serif" }}
                >
                  {dropoffDisplay}
                </span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M4 20h4l10-10-4-4L4 16v4z" stroke="#5E5E5E" strokeWidth="1.5" />
                </svg>
              </button>
            </div>
            <p
              className="text-[16px] text-black"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Your location will revert to{" "}
              <span className="font-medium underline">primary address</span> on
              days not selected.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                disabled={loading}
                onClick={handleSaveAddress}
                className="flex-1 rounded-[22px] bg-[#E8B600] py-2.5 text-[18px] font-bold text-[#FAFAFA] disabled:opacity-60"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                {loading ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={resetForms}
                className="flex-1 rounded-[22px] border border-[#E8B600] bg-white py-2.5 text-[18px] font-bold text-[#E8B600]"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {mode === "pause-service" && (
          <>
            <DatesTrigger
              label="Dates"
              dates={selectedDates}
              onClick={() => setCalendarOpen(true)}
            />
            <div className="flex flex-col gap-1">
              <FieldLabel>
                Reason <span className="font-light text-[#5E5E5E]">(Optional)</span>
              </FieldLabel>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason"
                rows={2}
                className="w-full resize-none rounded-[12px] border border-[#AAAAAA] bg-white p-4 text-[16px] text-[#5E5E5E] outline-none focus:ring-2 focus:ring-[#E8B600]/40"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              />
            </div>
            <p
              className="text-[16px] text-black"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Service will be paused only on selected dates, regular service will
              resumes on all other days.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                disabled={loading}
                onClick={handleSavePause}
                className="flex-1 rounded-[22px] bg-[#E8B600] py-2.5 text-[18px] font-bold text-[#FAFAFA] disabled:opacity-60"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                {loading ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={resetForms}
                className="flex-1 rounded-[22px] border border-[#E8B600] bg-white py-2.5 text-[18px] font-bold text-[#E8B600]"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
