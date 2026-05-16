"use client";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AppLayout from "@/components/AppLayout";
import RideStatusCard from "@/components/RideStatusCard";
import BusDetailsCard from "@/components/BusDetailsCard";
import ManagePickupDropoffCard from "@/components/ManagePickupDropoffCard";
import PaymentsHistoryCard from "@/components/PaymentsHistoryCard";
import PaymentHistorySheet from "@/components/PaymentHistorySheet";
import PageHeader from "@/components/PageHeader";
import NoStudentsView from "@/components/app/NoStudentsView";
import { useRouter } from "next/navigation";
import { getAccessToken, parseJsonResponse } from "@/lib/auth-token";
import { useStudentDriver } from "@/hooks/useStudentDriver";
import { useStudentPayment } from "@/hooks/useStudentPayment";

interface Student {
  id: number;
  full_name: string;
  profile_picture_url: string | null;
  bus_id: number | null;
  student_address: string;
  temp_address: string | null;
  temp_dates?: string[];
  approximate_fees: number | null;
  actual_fees: number | null;
  fee_expiry: string | null;
  is_paid: boolean;
}

type ParentDetails = {
  id: number;
  full_name: string;
  email: string;
  mobile_no: string;
  profile_picture_url: string | null;
  alternative_mobile: string | null;
};

export default function AppHome() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [parent, setParent] = useState<ParentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noStudents, setNoStudents] = useState(false);
  const [desktopStudentMenuOpen, setDesktopStudentMenuOpen] = useState(false);
  const [paymentHistoryOpen, setPaymentHistoryOpen] = useState(false);
  const studentMenuRef = useRef<HTMLDivElement | null>(null);

  const reloadStudents = useCallback(async () => {
    const accessToken = getAccessToken();
    if (!accessToken) return;
    const response = await fetch("/api/backend/students/me", {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) return;
    const data = await parseJsonResponse<Student[]>(response);
    setStudents(data);
    setSelectedStudent((prev) => {
      if (!prev) return data[0] ?? null;
      return data.find((s) => s.id === prev.id) ?? data[0] ?? null;
    });
  }, []);

  const { paying, startPayment } = useStudentPayment(reloadStudents);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      setNoStudents(false);
      try {
        const accessToken = getAccessToken();
        if (!accessToken) throw new Error("No access token found. Please sign in again.");

        // Parent details (for desktop greeting/sidebar)
        const parentRes = await fetch("/api/backend/parent-details", {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (parentRes.ok) {
          setParent(await parseJsonResponse<ParentDetails>(parentRes));
        }

        const response = await fetch("/api/backend/students/me", {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.status === 404) {
          const body = await parseJsonResponse<{ detail?: string }>(response).catch(
            () => null,
          );
          if (body?.detail === "No students found for this parent") {
            setStudents([]);
            setSelectedStudent(null);
            setNoStudents(true);
            return;
          }
        }
        if (!response.ok) throw new Error("Failed to fetch students");
        const data = await parseJsonResponse<Student[]>(response);
        setStudents(data);
        if (data.length > 0) {
          setSelectedStudent(data[0]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const helloName = useMemo(() => {
    const name = parent?.full_name?.trim();
    return name ? name.split(" ")[0] : "there";
  }, [parent?.full_name]);

  const otherStudents = useMemo(() => {
    return students.filter((s) => s.id !== selectedStudent?.id);
  }, [students, selectedStudent?.id]);

  const {
    driver,
    loading: driverLoading,
    noBus: driverNoBus,
    busId: driverBusId,
  } = useStudentDriver(selectedStudent?.id);

  const resolvedBusId = selectedStudent?.bus_id ?? driverBusId ?? null;

  const selectedPaymentAmount = useMemo(() => {
    if (!selectedStudent) return null;
    return selectedStudent.actual_fees ?? selectedStudent.approximate_fees ?? null;
  }, [selectedStudent]);

  const selectedIsPaid = selectedStudent?.is_paid ?? true;

  const handlePayNow = useCallback(() => {
    if (!selectedStudent) return;
    startPayment(
      { id: selectedStudent.id, name: selectedStudent.full_name },
      parent,
    );
  }, [selectedStudent, parent, startPayment]);

  const paymentCardProps = {
    amount: selectedPaymentAmount,
    isPaid: selectedIsPaid,
    feeExpiry: selectedStudent?.fee_expiry ?? null,
    paying,
    onPayNow: handlePayNow,
    onViewHistory: () => setPaymentHistoryOpen(true),
    canViewHistory: !!selectedStudent,
  };

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!desktopStudentMenuOpen) return;
      const el = studentMenuRef.current;
      if (el && e.target instanceof Node && !el.contains(e.target)) {
        setDesktopStudentMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [desktopStudentMenuOpen]);

  if (loading) {
    return (
      <AppLayout header={null}>
        <div className="p-6 text-center text-[#19191F]">Loading...</div>
      </AppLayout>
    );
  }

  if (noStudents) {
    // Render outside AppLayout so we don't reserve the fixed header space
    // (prevents the extra black strip + avoids scroll issues on mobile).
    return <NoStudentsView />;
  }

  return (
    <>
      <PaymentHistorySheet
        open={paymentHistoryOpen}
        onClose={() => setPaymentHistoryOpen(false)}
        studentId={selectedStudent?.id ?? null}
        studentName={selectedStudent?.full_name}
      />
      {/* Desktop dashboard (Figma: 1:2798) */}
      <div className="hidden md:flex min-h-screen bg-[#FAFAFA]">
        <aside className="w-[320px] bg-[#14141B] text-white flex flex-col justify-between rounded-[32px] m-[24px] h-[calc(100vh-48px)] sticky top-[24px] overflow-hidden">
          <div className="px-[28px] pt-[28px]">
            <div className="flex flex-col items-center py-[20px] rounded-[16px] bg-gradient-to-b from-white/10 to-white/0">
              <div className="h-[72px] w-[72px] rounded-full overflow-hidden border-2 border-white/30">
                <img
                  src={parent?.profile_picture_url || "/assets/DP.svg"}
                  alt={parent?.full_name || "Parent"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-[10px] text-[16px]" style={{ fontFamily: "Satoshi, sans-serif" }}>
                {parent?.full_name || "Nil"}
              </div>
              <div className="mt-[10px] relative w-full" ref={studentMenuRef}>
                <button
                  type="button"
                  onClick={() => {
                    if (otherStudents.length === 0) return;
                    setDesktopStudentMenuOpen((v) => !v);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-[12px] ${
                    otherStudents.length > 0 ? "hover:bg-white/5" : ""
                  }`}
                >
                  <div className="h-[28px] w-[28px] rounded-full overflow-hidden border border-white/20">
                    <img
                      src={selectedStudent?.profile_picture_url || "/assets/DP.svg"}
                      alt={selectedStudent?.full_name || "Student"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div
                    className="flex-1 text-left truncate"
                    style={{ fontFamily: "Satoshi, sans-serif" }}
                  >
                    {selectedStudent?.full_name || "Nil"}
                  </div>
                  {otherStudents.length > 0 && (
                    <span className={`opacity-60 transition-transform ${desktopStudentMenuOpen ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  )}
                </button>

                {desktopStudentMenuOpen && otherStudents.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 bg-[#19191F] rounded-[12px] border border-white/10 overflow-hidden shadow-xl z-50">
                    {otherStudents.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className="w-full px-3 py-2 flex items-center gap-2 hover:bg-white/5 text-left"
                        onClick={() => {
                          setSelectedStudent(s);
                          setDesktopStudentMenuOpen(false);
                        }}
                      >
                        <div className="h-[24px] w-[24px] rounded-full overflow-hidden border border-white/10">
                          <img
                            src={s.profile_picture_url || "/assets/DP.svg"}
                            alt={s.full_name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="truncate" style={{ fontFamily: "Satoshi, sans-serif" }}>
                          {s.full_name}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <nav className="mt-[26px] flex flex-col gap-[12px]">
              {[
                { label: "Home", href: "/app", icon: "/assets/home.svg", active: true },
                { label: "Track Bus", href: "/app/track", icon: "/assets/trackbus.svg" },
                { label: "Profile", href: "/app/profile", icon: "/assets/profile.svg" },
                { label: "Settings & History", href: "/app/profile", icon: "/assets/profile.svg" },
              ].map((x) => (
                <button
                  key={x.label}
                  type="button"
                  onClick={() => router.push(x.href)}
                  className={`w-full flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] ${
                    x.active ? "bg-[#E8B600]/15" : "hover:bg-white/5"
                  }`}
                >
                  <Image src={x.icon} alt="" width={20} height={20} />
                  <span style={{ fontFamily: "Satoshi, sans-serif" }}>{x.label}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("access_token");
                  localStorage.removeItem("parent_id");
                  router.push("/login");
                }}
                className="w-full flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] hover:bg-white/5 mt-[8px]"
              >
                <span style={{ fontFamily: "Satoshi, sans-serif" }}>Logout</span>
              </button>
            </nav>
          </div>

          <div className="p-[24px] flex items-center justify-center">
            <Image src="/assets/Rukhiyas-desktop.svg" alt="RUKHIYAS" width={98} height={64} />
          </div>
        </aside>

        <main className="flex-1 pr-[32px] pt-[32px]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[40px] font-bold text-black" style={{ fontFamily: "Spartan, sans-serif" }}>
                {`Hello ${helloName}!`}
              </div>
              <div className="mt-[12px] h-px bg-[#EAEAEA]" />
            </div>
            <div className="flex items-center gap-[16px]">
              <div className="h-[56px] w-[420px] rounded-[50px] bg-white border border-[#EAEAEA] shadow-sm flex items-center px-[20px]">
                <input
                  placeholder="Search anything"
                  className="flex-1 outline-none text-[16px] text-black placeholder:text-[#9B9B9B]"
                  style={{ fontFamily: "Satoshi, sans-serif" }}
                />
                <div className="h-[40px] w-[64px] rounded-[40px] bg-[#19191F] grid place-items-center">
                  <span className="text-white">⌕</span>
                </div>
              </div>
              <button className="h-[56px] w-[56px] rounded-[30px] bg-white border border-[#EAEAEA] shadow-sm grid place-items-center">
                <span>🔔</span>
              </button>
            </div>
          </div>

          <div className="mt-[24px] grid grid-cols-[1fr_420px] gap-[20px]">
            {/* Map card (blurred + not available) */}
            <section className="bg-white rounded-[24px] border border-[#EAEAEA] shadow-sm overflow-hidden">
              <div className="px-[20px] pt-[16px] text-center">
                <div className="text-[18px] font-bold text-black" style={{ fontFamily: "Satoshi, sans-serif" }}>
                  {selectedStudent ? `${selectedStudent.full_name}'s bus` : "Bus"} tracking
                </div>
                <div className="text-[#9B9B9B] text-[14px]" style={{ fontFamily: "Satoshi, sans-serif" }}>
                  Not available
                </div>
              </div>

              <div className="relative mt-[8px] mx-[20px] mb-[16px] h-[220px] rounded-[16px] bg-[#E9F7FF] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,0,0,0.08),transparent_50%),radial-gradient(circle_at_80%_60%,rgba(0,0,0,0.08),transparent_50%)]" />
                <div className="absolute inset-0 backdrop-blur-[6px] bg-white/20" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="px-[18px] py-[10px] rounded-[14px] bg-[#14141B]/80 text-white text-[14px]" style={{ fontFamily: "Satoshi, sans-serif" }}>
                    Bus tracking not available
                  </div>
                </div>
              </div>

              <div className="px-[20px] pb-[16px]">
                <button
                  type="button"
                  disabled
                  className="w-full h-[44px] rounded-[22px] border border-[#E8B600] text-[#E8B600] font-bold opacity-60 cursor-not-allowed"
                  style={{ fontFamily: "Satoshi, sans-serif" }}
                >
                  Track Bus
                </button>
              </div>
            </section>

            {/* Bus details + ride status */}
            <div className="flex flex-col gap-[20px]">
              <BusDetailsCard
                driver={driver}
                loading={driverLoading}
                noBus={driverNoBus}
                studentSelected={!!selectedStudent}
                className="w-full"
              />
              <section className="bg-white rounded-[24px] border border-[#EAEAEA] shadow-sm p-[20px]">
                <div className="flex items-center justify-between">
                  <div className="text-[18px] font-bold text-black" style={{ fontFamily: "Satoshi, sans-serif" }}>
                    Ride Status
                  </div>
                  <div className="text-[14px] text-[#9B9B9B]" style={{ fontFamily: "Satoshi, sans-serif" }}>
                    On Time
                  </div>
                </div>
                <div className="mt-[12px]">
                  <RideStatusCard
                    selectedStudent={selectedStudent}
                    busId={resolvedBusId}
                  />
                </div>
              </section>
            </div>
          </div>

          <div className="mt-[20px] grid grid-cols-[1fr_420px] gap-[20px]">
            <section className="bg-white rounded-[24px] border border-[#EAEAEA] shadow-sm p-[20px]">
              <div className="text-[18px] font-bold text-black" style={{ fontFamily: "Satoshi, sans-serif" }}>
                Manage Pickup &amp; Drop Off
              </div>
              <div className="mt-[12px]">
                <ManagePickupDropoffCard selectedStudent={selectedStudent} />
              </div>
            </section>

            <section className="bg-white rounded-[24px] border border-[#EAEAEA] shadow-sm p-[20px]">
              <div className="text-[18px] font-bold text-black" style={{ fontFamily: "Satoshi, sans-serif" }}>
                Payments &amp; History
              </div>
              <div className="mt-[12px]">
                <PaymentsHistoryCard {...paymentCardProps} />
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Mobile (existing) */}
      <div className="md:hidden">
        <AppLayout
          header={
            <PageHeader
              students={students}
              selectedStudent={selectedStudent}
              setSelectedStudent={setSelectedStudent}
            />
          }
        >
          <div className="p-4 pb-10 flex flex-col items-center w-full max-w-md mx-auto">
            <BusDetailsCard
              driver={driver}
              loading={driverLoading}
              noBus={driverNoBus}
              studentSelected={!!selectedStudent}
              className="w-full"
            />
            <div className="h-6" />
            <RideStatusCard
              selectedStudent={selectedStudent}
              busId={resolvedBusId}
            />
            <div className="h-6" />
            <ManagePickupDropoffCard selectedStudent={selectedStudent} />
            <div className="h-6" />
            <PaymentsHistoryCard {...paymentCardProps} />
          </div>
        </AppLayout>
      </div>
    </>
  );
}
