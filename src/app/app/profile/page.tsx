/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import BottomNavBar from "@/components/BottomNavBar";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import NoStudentsView from "@/components/app/NoStudentsView";
import SchoolDropdown from "@/components/SchoolDropdown";
import dynamic from "next/dynamic";

const MapAddressPicker = dynamic(() => import("@/components/MapAddressPicker"), {
  ssr: false,
});

type ParentDetails = {
  id: number;
  full_name: string;
  email: string;
  mobile_no: string;
  profile_picture_url: string | null;
  alternative_mobile: string | null;
};

type Student = {
  id: number;
  parent_id: number;
  school_id: number;
  bus_id: number | null;
  bus_route: string | null;
  full_name: string;
  class_name: string;
  division: string;
  student_address: string;
  location_latitude: number;
  location_longitude: number;
  assigned_pickup_location: string | null;
  pickup_latitude: number | null;
  pickup_longitude: number | null;
  distance_to_pickup: number | null;
  approximate_fees: number | null;
  actual_fees: number | null;
  profile_picture_url: string | null;
  temp_pick_address: string | null;
  temp_drop_address: string | null;
  temp_dates: string[] | null;
  is_submitted: boolean;
  is_paid: boolean;
  created_at: string;
  auto_renewal_enabled?: boolean;
  subscription_id?: string | null;
  subscription_status?: string | null;
};

export default function ProfilePage() {
  const router = useRouter();
  const [parent, setParent] = useState<ParentDetails | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<{
    full_name: string;
    class_name: string;
    division: string;
    school_id: string;
    student_address: string;
    location?: { lat: number; lng: number };
  } | null>(null);
  const [editMapOpen, setEditMapOpen] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [mobileEditingId, setMobileEditingId] = useState<number | null>(null);
  const [mobileEditDraft, setMobileEditDraft] = useState<{
    full_name: string;
    class_name: string;
    division: string;
    school_id: string;
    student_address: string;
    location?: { lat: number; lng: number };
  } | null>(null);
  const [mobileEditMapOpen, setMobileEditMapOpen] = useState(false);
  const [mobileSaving, setMobileSaving] = useState(false);
  const [mobileAddOpen, setMobileAddOpen] = useState(false);
  const [mobileAddDrafts, setMobileAddDrafts] = useState<
    {
      id: string;
      full_name: string;
      class_name: string;
      division: string;
      school_id: string;
      addressLabel: string;
      location?: { lat: number; lng: number };
    }[]
  >([]);
  const [mobileAddMapFor, setMobileAddMapFor] = useState<string | null>(null);
  const [mobileAdding, setMobileAdding] = useState(false);

  const schoolNameById = useMemo(() => {
    // Keep in sync with `SchoolDropdown` list.
    return new Map<number, string>([
      [1, "St. Mary's High School"],
      [2, "Delhi Public School"],
      [3, "Kendriya Vidyalaya"],
      [4, "Modern Public School"],
      [5, "Springdales School"],
    ]);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");

        const parentRes = await fetch("/api/backend/parent-details", {
          headers: { accept: "application/json", Authorization: `Bearer ${token}` },
        });
        if (!parentRes.ok) {
          toast.error("Failed to fetch parent details");
          throw new Error("Failed to fetch parent details");
        }
        const parentJson = (await parentRes.json()) as ParentDetails;
        setParent(parentJson);
        toast.success("Parent details loaded");

        const studentsRes = await fetch(
          `/api/backend/students?parent_id=${encodeURIComponent(parentJson.id)}`,
          {
            headers: { accept: "application/json", Authorization: `Bearer ${token}` },
          },
        );
        if (!studentsRes.ok) {
          toast.error("Failed to fetch students");
          throw new Error("Failed to fetch students");
        }
        const studentsJson = (await studentsRes.json()) as Student[];
        setStudents(studentsJson);
        toast.success("Student details loaded");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const helloName = parent?.full_name
    ? parent.full_name.split(" ")[0]
    : "there";

  const subscriptions = useMemo(() => {
    return students.map((s) => ({
      id: s.id,
      name: s.full_name,
      amount: s.actual_fees ?? s.approximate_fees ?? null,
      isPaid: s.is_paid,
    }));
  }, [students]);

  const pendingAmount = useMemo(() => {
    return subscriptions
      .filter((x) => x.isPaid === false)
      .reduce((sum, x) => sum + (x.amount || 0), 0);
  }, [subscriptions]);

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("parent_id");
    toast.info("Logged out");
    router.push("/login");
  }

  function startEditStudent(s: Student) {
    setEditingStudentId(s.id);
    setEditDraft({
      full_name: s.full_name ?? "",
      class_name: s.class_name ?? "",
      division: s.division ?? "",
      school_id: String(s.school_id ?? ""),
      student_address: s.student_address ?? "",
      location: { lat: s.location_latitude, lng: s.location_longitude },
    });
  }

  async function saveEditStudent(studentId: number) {
    if (!parent || !editDraft) return;
    try {
      setSavingEdit(true);
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");
      if (!editDraft.location) throw new Error("Please set location on map");

      const res = await fetch(`/api/backend/students/${studentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          parent_id: parent.id,
          school_id: Number(editDraft.school_id),
          full_name: editDraft.full_name,
          class_name: editDraft.class_name,
          division: editDraft.division,
          student_address: editDraft.student_address || "Selected from map",
          location_latitude: editDraft.location.lat,
          location_longitude: editDraft.location.lng,
        }),
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(body?.detail?.[0]?.msg || body?.detail || "Failed to update student");
        return;
      }
      toast.success("Student updated");
      setStudents((prev) => prev.map((x) => (x.id === studentId ? (body as Student) : x)));
      setEditingStudentId(null);
      setEditDraft(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update student");
    } finally {
      setSavingEdit(false);
    }
  }

  function startMobileEdit(s: Student) {
    setMobileEditingId(s.id);
    setMobileEditDraft({
      full_name: s.full_name ?? "",
      class_name: s.class_name ?? "",
      division: s.division ?? "",
      school_id: String(s.school_id ?? ""),
      student_address: s.student_address ?? "",
      location: { lat: s.location_latitude, lng: s.location_longitude },
    });
  }

  async function saveMobileEdit(studentId: number) {
    if (!parent || !mobileEditDraft) return;
    try {
      setMobileSaving(true);
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");
      if (!mobileEditDraft.location) throw new Error("Please set location on map");

      const res = await fetch(`/api/backend/students/${studentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          parent_id: parent.id,
          school_id: Number(mobileEditDraft.school_id),
          full_name: mobileEditDraft.full_name,
          class_name: mobileEditDraft.class_name,
          division: mobileEditDraft.division,
          student_address: mobileEditDraft.student_address || "Selected from map",
          location_latitude: mobileEditDraft.location.lat,
          location_longitude: mobileEditDraft.location.lng,
        }),
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(body?.detail?.[0]?.msg || body?.detail || "Failed to update student");
        return;
      }
      toast.success("Student updated");
      setStudents((prev) => prev.map((x) => (x.id === studentId ? (body as Student) : x)));
      setMobileEditingId(null);
      setMobileEditDraft(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update student");
    } finally {
      setMobileSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center text-[#19191F]">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  // Desktop add-student overlay only. Mobile add is inline in the Profile section.
  if (showAddStudent) {
    return (
      <div className="min-h-screen bg-white hidden md:block">
        <button
          type="button"
          onClick={() => setShowAddStudent(false)}
          className="fixed top-4 right-4 z-[60] h-10 w-10 rounded-full bg-black/70 text-white grid place-items-center"
          aria-label="Close"
        >
          ×
        </button>
        <NoStudentsView />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Desktop */}
      <div className="hidden md:flex min-h-screen">
        {/* Sidebar */}
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
                {parent?.full_name || "-"}
              </div>
            </div>

            <nav className="mt-[26px] flex flex-col gap-[12px]">
              {[
                { label: "Home", href: "/app", icon: "/assets/home.svg" },
                { label: "Track Bus", href: "/app/track", icon: "/assets/trackbus.svg" },
                { label: "Profile", href: "/app/profile", icon: "/assets/profile.svg", active: true },
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
                onClick={handleLogout}
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

        {/* Main */}
        <main className="flex-1 pr-[32px] pt-[32px]">
          <div className="flex items-center justify-between">
            <div>
              <div
                className="text-[40px] font-bold text-black"
                style={{ fontFamily: "Spartan, sans-serif" }}
              >
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

          <div className="mt-[24px] grid grid-cols-[420px_1fr] gap-[20px]">
            {/* Parent Details */}
            <section className="bg-white rounded-[24px] border border-[#EAEAEA] shadow-sm p-[20px]">
              <div className="text-[18px] font-bold text-black" style={{ fontFamily: "Satoshi, sans-serif" }}>
                Parent Details
              </div>
              <div className="mt-[14px] flex items-center gap-[10px]">
                <div className="h-[40px] w-[40px] rounded-full overflow-hidden border border-[#EBEBEB]">
                  <img
                    src={parent?.profile_picture_url || "/assets/DP.svg"}
                    alt={parent?.full_name || "Parent"}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-[16px] font-bold text-black" style={{ fontFamily: "Satoshi, sans-serif" }}>
                  {parent?.full_name || "-"}
                </div>
              </div>

              <div className="mt-[16px] grid grid-cols-2 gap-[14px] text-[14px]" style={{ fontFamily: "Satoshi, sans-serif" }}>
                <div>
                  <div className="text-[#9B9B9B]">Primary Number</div>
                  <div className="text-black">{parent?.mobile_no || "Nil"}</div>
                </div>
                <div>
                  <div className="text-[#9B9B9B]">Alternate Number</div>
                  <div className="text-black">{parent?.alternative_mobile || "Nil"}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-[#9B9B9B]">Email</div>
                  <div className="text-black">{parent?.email || "Nil"}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-[#9B9B9B]">Primary Address</div>
                  <div className="text-black">Nil</div>
                </div>
              </div>

              <button className="mt-[18px] w-full h-[52px] rounded-[26px] bg-[#E8B600] text-white font-bold" style={{ fontFamily: "Satoshi, sans-serif" }}>
                Edit
              </button>
            </section>

            {/* Student Details */}
            <section className="bg-white rounded-[24px] border border-[#EAEAEA] shadow-sm p-[20px]">
              <div className="text-[18px] font-bold text-black" style={{ fontFamily: "Satoshi, sans-serif" }}>
                Student Details
              </div>

              <div className="mt-[14px] grid grid-cols-2 gap-[16px]">
                {students.slice(0, 2).map((s) => {
                  const isEditing = editingStudentId === s.id && !!editDraft;
                  return (
                    <div key={s.id} className="border border-[#E8B600] rounded-[16px] p-[16px]">
                      <div className="flex items-center gap-[10px]">
                        <div className="h-[40px] w-[40px] rounded-full overflow-hidden border border-[#EBEBEB]">
                          <img
                            src={s.profile_picture_url || "/assets/DP.svg"}
                            alt={s.full_name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="text-[16px] font-bold text-black" style={{ fontFamily: "Satoshi, sans-serif" }}>
                          {s.full_name || "Nil"}
                        </div>
                      </div>

                      {!isEditing ? (
                        <>
                          <div className="mt-[12px] grid grid-cols-2 gap-[10px] text-[12px]" style={{ fontFamily: "Satoshi, sans-serif" }}>
                            <div>
                              <div className="text-[#9B9B9B]">Class</div>
                              <div className="text-black">
                                {`${s.class_name || "Nil"} ${s.division || ""}`.trim()}
                              </div>
                            </div>
                            <div>
                              <div className="text-[#9B9B9B]">School</div>
                              <div className="text-black">
                                {schoolNameById.get(s.school_id) || `School ${s.school_id}`}
                              </div>
                            </div>
                            <div className="col-span-2">
                              <div className="text-[#9B9B9B]">Address</div>
                              <div className="text-black">{s.student_address || "Nil"}</div>
                            </div>
                            <div>
                              <div className="text-[#9B9B9B]">Emergency Contact</div>
                              <div className="text-black">{parent?.mobile_no || "Nil"}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-[#9B9B9B]">ID No.</div>
                              <div className="text-black">{s.id}</div>
                            </div>
                          </div>

                          <button
                            className="mt-[14px] w-full h-[44px] rounded-[22px] bg-[#E8B600] text-white font-bold"
                            style={{ fontFamily: "Satoshi, sans-serif" }}
                            onClick={() => startEditStudent(s)}
                          >
                            Edit
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="mt-[12px] flex flex-col gap-[10px]" style={{ fontFamily: "Satoshi, sans-serif" }}>
                            <div className="text-[12px] text-[#5E5E5E]">Full Name</div>
                            <input
                              className="w-full border border-[#AAA] rounded-[12px] px-[16px] py-[12px] text-black"
                              value={editDraft!.full_name}
                              onChange={(e) => setEditDraft((p) => (p ? { ...p, full_name: e.target.value } : p))}
                            />

                            <div className="grid grid-cols-2 gap-[10px]">
                              <div>
                                <div className="text-[12px] text-[#5E5E5E]">Class</div>
                                <input
                                  className="w-full border border-[#AAA] rounded-[12px] px-[16px] py-[12px] text-black"
                                  value={editDraft!.class_name}
                                  onChange={(e) => setEditDraft((p) => (p ? { ...p, class_name: e.target.value } : p))}
                                />
                              </div>
                              <div>
                                <div className="text-[12px] text-[#5E5E5E]">Division</div>
                                <input
                                  className="w-full border border-[#AAA] rounded-[12px] px-[16px] py-[12px] text-black"
                                  value={editDraft!.division}
                                  onChange={(e) => setEditDraft((p) => (p ? { ...p, division: e.target.value } : p))}
                                />
                              </div>
                            </div>

                            <div>
                              <div className="text-[12px] text-[#5E5E5E]">School</div>
                              <SchoolDropdown
                                value={editDraft!.school_id}
                                onChange={(v) => setEditDraft((p) => (p ? { ...p, school_id: v } : p))}
                              />
                            </div>

                            <div>
                              <div className="text-[12px] text-[#5E5E5E]">Address</div>
                              <button
                                type="button"
                                className="w-full border border-[#AAA] rounded-[12px] px-[16px] py-[12px] text-left text-black"
                                onClick={() => setEditMapOpen(true)}
                              >
                                {editDraft!.student_address || "Select location on map"}
                              </button>
                            </div>
                          </div>

                          <div className="mt-[14px] flex gap-[10px]">
                            <button
                              className="flex-1 h-[44px] rounded-[22px] bg-[#E8B600] text-white font-bold disabled:opacity-60"
                              style={{ fontFamily: "Satoshi, sans-serif" }}
                              onClick={() => saveEditStudent(s.id)}
                              disabled={savingEdit}
                            >
                              {savingEdit ? "Saving..." : "Save"}
                            </button>
                            <button
                              className="flex-1 h-[44px] rounded-[22px] border border-[#E8B600] text-[#E8B600] font-bold"
                              style={{ fontFamily: "Satoshi, sans-serif" }}
                              onClick={() => {
                                setEditingStudentId(null);
                                setEditDraft(null);
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                className="mt-[16px] w-full h-[52px] rounded-[26px] bg-[#E8B600] text-white font-bold"
                style={{ fontFamily: "Satoshi, sans-serif" }}
                onClick={() => setShowAddStudent(true)}
              >
                Add Another Student
              </button>
            </section>
          </div>

          {/* Billing & Payment + Account Settings */}
          <div className="mt-[20px] bg-white rounded-[24px] border border-[#EAEAEA] shadow-sm p-[20px]">
            <div className="text-[18px] font-bold text-black" style={{ fontFamily: "Satoshi, sans-serif" }}>
              Billing &amp; Payment
            </div>

            <div className="mt-[14px] grid grid-cols-3 gap-[16px]">
              <div className="border border-[#EAEAEA] rounded-[16px] p-[14px]">
                <div className="text-[12px] font-bold text-black" style={{ fontFamily: "Satoshi, sans-serif" }}>
                  Current Subscriptions
                </div>
                <div className="mt-[10px] border border-[#EAEAEA] rounded-[12px] p-[10px] text-[12px]" style={{ fontFamily: "Satoshi, sans-serif" }}>
                  <div className="flex justify-between text-[#9B9B9B] mb-[8px]">
                    <span>Name</span>
                    <span>Amount</span>
                  </div>
                  {subscriptions.slice(0, 2).map((x) => (
                    <div key={x.id} className="flex justify-between text-black mb-[6px]">
                      <span className="truncate pr-2">{x.name}</span>
                      <span>{x.amount ? `₹${x.amount}/month` : "-"}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-[10px] w-full h-[38px] rounded-[19px] bg-[#E8B600] text-white font-bold text-[14px]" style={{ fontFamily: "Satoshi, sans-serif" }}>
                  Manage Subscriptions
                </button>
              </div>

              <div className="border border-red-300 rounded-[16px] p-[14px]">
                <div className="text-[12px] font-bold text-red-600" style={{ fontFamily: "Satoshi, sans-serif" }}>
                  Payment Pending
                </div>
                <div className="mt-[10px] text-[12px]" style={{ fontFamily: "Satoshi, sans-serif" }}>
                  <div className="flex justify-between text-black">
                    <span className="text-[#9B9B9B]">Due Date</span>
                    <span>--/--/----</span>
                  </div>
                  <div className="flex justify-between text-black mt-[6px]">
                    <span className="text-[#9B9B9B]">Amount</span>
                    <span>{pendingAmount ? `₹${pendingAmount}` : "₹0"}</span>
                  </div>
                </div>
                <button className="mt-[10px] w-full h-[38px] rounded-[19px] bg-red-600 text-white font-bold text-[14px]" style={{ fontFamily: "Satoshi, sans-serif" }}>
                  Pay Now
                </button>
                <div className="mt-[6px] text-[10px] text-[#9B9B9B] text-center" style={{ fontFamily: "Satoshi, sans-serif" }}>
                  Pay now to avoid late fees*
                </div>
              </div>

              <div className="border border-[#EAEAEA] rounded-[16px] p-[14px]">
                <div className="text-[12px] font-bold text-black" style={{ fontFamily: "Satoshi, sans-serif" }}>
                  Next Payment
                </div>
                <div className="mt-[10px] text-[12px]" style={{ fontFamily: "Satoshi, sans-serif" }}>
                  <div className="flex justify-between text-black">
                    <span className="text-[#9B9B9B]">Due Date</span>
                    <span>--/--/----</span>
                  </div>
                  <div className="flex justify-between text-black mt-[6px]">
                    <span className="text-[#9B9B9B]">Amount</span>
                    <span>{pendingAmount ? `₹${pendingAmount}` : "₹0"}</span>
                  </div>
                </div>
                <button className="mt-[10px] w-full h-[38px] rounded-[19px] bg-[#E8B600] text-white font-bold text-[14px]" style={{ fontFamily: "Satoshi, sans-serif" }}>
                  Pay Now
                </button>
              </div>
            </div>

            <div className="mt-[22px] bg-white rounded-[16px] border border-[#EAEAEA] p-[16px]">
              <div className="text-[18px] font-bold text-black" style={{ fontFamily: "Satoshi, sans-serif" }}>
                Account Settings
              </div>
              <div className="mt-[10px] divide-y">
                {[
                  "Notification Preferences",
                  "Change Password",
                  "Service History",
                  "Payment History",
                  "Get Help",
                  "Policies & Terms",
                ].map((x) => (
                  <button
                    key={x}
                    type="button"
                    className="w-full py-[12px] flex items-center justify-between text-black"
                    style={{ fontFamily: "Satoshi, sans-serif" }}
                  >
                    <span>{x}</span>
                    <span className="text-[#9B9B9B]">{">"}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-[18px] w-full h-[56px] rounded-[28px] bg-[#19191F] text-white font-bold text-[18px]"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Log Out
            </button>
          </div>
        </main>
      </div>

      {/* Mobile */}
      <div className="md:hidden bg-[#FAFAFA] min-h-screen flex flex-col items-center pb-20">
        <header
          className="w-full flex items-center justify-between px-5 py-4 bg-[#19191F]"
          style={{ maxWidth: 400 }}
        >
          <div className="flex items-center gap-2">
            <Image
              src={parent?.profile_picture_url || "/assets/DP.svg"}
              alt={helloName}
              width={36}
              height={36}
              className="rounded-full"
            />
            <span
              className="text-white text-base font-medium"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              {`Hello, ${helloName}`}
            </span>
          </div>
          <span
            className="text-white text-lg font-bold"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            Profile
          </span>
        </header>

        <div className="flex flex-col items-center w-full" style={{ maxWidth: 400 }}>
          {/* Parent Details */}
          <section className="bg-white rounded-2xl shadow p-5 w-[340px] mb-4 mt-2">
            <h2 className="font-bold text-lg mb-3 text-black">Parent Details</h2>
            <div className="flex items-center mb-2">
              <Image
                src={parent?.profile_picture_url || "/assets/DP.svg"}
                alt={parent?.full_name || "Parent"}
                width={40}
                height={40}
                className="rounded-full mr-3"
              />
              <span className="font-semibold text-base text-black">
                {parent?.full_name || "-"}
              </span>
            </div>
            <div className="text-sm mb-1 text-black">
              <span className="font-medium text-gray-500">Primary Number</span>
              <br />
              {parent?.mobile_no || "-"}
            </div>
            <div className="text-sm mb-1 text-black">
              <span className="font-medium text-gray-500">Alternate Number</span>
              <br />
              {parent?.alternative_mobile || "-"}
            </div>
            <div className="text-sm mb-4 text-black">
              <span className="font-medium text-gray-500">Email</span>
              <br />
              {parent?.email || "-"}
            </div>
            <button className="w-full bg-[#e8b600] text-white font-semibold rounded-full py-2 text-base">
              Edit
            </button>
          </section>

          {/* Student Details */}
          <section className="bg-white rounded-2xl shadow p-5 w-[340px] mb-4">
            <h2 className="font-bold text-lg mb-3 text-black">Student Details</h2>
            {students.map((s) => {
              const isEditing = mobileEditingId === s.id && !!mobileEditDraft;
              return (
                <div key={s.id} className="border rounded-xl p-3 mb-3 border-[#e8b600]">
                  <div className="flex items-center mb-2">
                    <Image
                      src={s.profile_picture_url || "/assets/DP.svg"}
                      alt={s.full_name}
                      width={32}
                      height={32}
                      className="rounded-full mr-2"
                    />
                    <span className="font-semibold text-black">
                      {s.full_name || "Nil"}
                    </span>
                  </div>

                  {!isEditing ? (
                    <>
                      <div className="text-xs mb-1 text-black">
                        <span className="font-medium text-gray-500">Class</span>{" "}
                        {`${s.class_name || "Nil"} ${s.division || ""}`.trim()}{" "}
                        &nbsp; <span className="font-medium text-gray-500">School</span>{" "}
                        {schoolNameById.get(s.school_id) || `School ${s.school_id}`}
                      </div>
                      <div className="text-xs mb-1 text-black">
                        <span className="font-medium text-gray-500">Address</span>{" "}
                        {s.student_address || "Nil"}
                      </div>
                      <div className="text-xs mb-1 text-black">
                        <span className="font-medium text-gray-500">
                          Emergency Contact
                        </span>{" "}
                        {parent?.mobile_no || "Nil"} &nbsp;{" "}
                        <span className="font-medium text-gray-500">ID No.</span>{" "}
                        {s.id}
                      </div>
                      <button
                        className="w-full bg-[#e8b600] text-white font-semibold rounded-full py-1 mt-2"
                        onClick={() => startMobileEdit(s)}
                      >
                        Edit
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col gap-2">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Full Name</div>
                          <input
                            className="w-full border border-[#AAA] rounded-xl px-3 py-2 text-black"
                            value={mobileEditDraft!.full_name}
                            onChange={(e) =>
                              setMobileEditDraft((p) =>
                                p ? { ...p, full_name: e.target.value } : p,
                              )
                            }
                          />
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <div className="text-xs text-gray-500 mb-1">Class</div>
                            <input
                              className="w-full border border-[#AAA] rounded-xl px-3 py-2 text-black"
                              value={mobileEditDraft!.class_name}
                              onChange={(e) =>
                                setMobileEditDraft((p) =>
                                  p ? { ...p, class_name: e.target.value } : p,
                                )
                              }
                            />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-500 mb-1">Division</div>
                            <input
                              className="w-full border border-[#AAA] rounded-xl px-3 py-2 text-black"
                              value={mobileEditDraft!.division}
                              onChange={(e) =>
                                setMobileEditDraft((p) =>
                                  p ? { ...p, division: e.target.value } : p,
                                )
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">School</div>
                          <SchoolDropdown
                            value={mobileEditDraft!.school_id}
                            onChange={(v) =>
                              setMobileEditDraft((p) =>
                                p ? { ...p, school_id: v } : p,
                              )
                            }
                          />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Address</div>
                          <button
                            type="button"
                            className="w-full border border-[#AAA] rounded-xl px-3 py-2 text-left text-black"
                            onClick={() => setMobileEditMapOpen(true)}
                          >
                            {mobileEditDraft!.student_address || "Select location on map"}
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-2">
                        <button
                          className="flex-1 bg-[#e8b600] text-white font-semibold rounded-full py-2 disabled:opacity-60"
                          disabled={mobileSaving}
                          onClick={() => saveMobileEdit(s.id)}
                        >
                          {mobileSaving ? "Saving..." : "Save"}
                        </button>
                        <button
                          className="flex-1 border border-[#e8b600] text-[#e8b600] font-semibold rounded-full py-2"
                          onClick={() => {
                            setMobileEditingId(null);
                            setMobileEditDraft(null);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            {/* Inline add student forms (below existing students) */}
            {mobileAddOpen && (
              <div className="mt-2 flex flex-col gap-3">
                {mobileAddDrafts.map((d) => (
                  <div key={d.id} className="border rounded-xl p-3 border-[#e8b600]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-[#e8b600]">{`Student ${mobileAddDrafts.indexOf(d) + 1}`}</div>
                      {mobileAddDrafts.length > 1 && (
                        <button
                          type="button"
                          className="text-black underline text-sm"
                          onClick={() =>
                            setMobileAddDrafts((prev) => prev.filter((x) => x.id !== d.id))
                          }
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <input
                        className="w-full border border-[#AAA] rounded-xl px-3 py-2 text-black"
                        placeholder="Full Name"
                        value={d.full_name}
                        onChange={(e) =>
                          setMobileAddDrafts((prev) =>
                            prev.map((x) =>
                              x.id === d.id ? { ...x, full_name: e.target.value } : x,
                            ),
                          )
                        }
                      />
                      <div className="flex gap-2 w-full">
                        <input
                          className="flex-1 min-w-0 border border-[#AAA] rounded-xl px-3 py-2 text-black"
                          placeholder="Class"
                          value={d.class_name}
                          onChange={(e) =>
                            setMobileAddDrafts((prev) =>
                              prev.map((x) =>
                                x.id === d.id ? { ...x, class_name: e.target.value } : x,
                              ),
                            )
                          }
                        />
                        <input
                          className="flex-1 min-w-0 border border-[#AAA] rounded-xl px-3 py-2 text-black"
                          placeholder="Division"
                          value={d.division}
                          onChange={(e) =>
                            setMobileAddDrafts((prev) =>
                              prev.map((x) =>
                                x.id === d.id ? { ...x, division: e.target.value } : x,
                              ),
                            )
                          }
                        />
                      </div>
                      <SchoolDropdown
                        value={d.school_id}
                        onChange={(v) =>
                          setMobileAddDrafts((prev) =>
                            prev.map((x) => (x.id === d.id ? { ...x, school_id: v } : x)),
                          )
                        }
                      />
                      <button
                        type="button"
                        className="w-full border border-[#AAA] rounded-xl px-3 py-2 text-left text-black"
                        onClick={() => setMobileAddMapFor(d.id)}
                      >
                        {d.addressLabel || "Select location on map"}
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="w-full border border-[#e8b600] text-[#e8b600] font-semibold rounded-full py-2"
                  onClick={() =>
                    setMobileAddDrafts((prev) => [
                      ...prev,
                      {
                        id: `a${Date.now()}`,
                        full_name: "",
                        class_name: "",
                        division: "",
                        school_id: "",
                        addressLabel: "",
                        location: undefined,
                      },
                    ])
                  }
                >
                  Add Another Student
                </button>

                <button
                  type="button"
                  className="w-full bg-[#e8b600] text-white font-semibold rounded-full py-2 disabled:opacity-60"
                  disabled={mobileAdding}
                  onClick={() => {
                    (async () => {
                      if (!parent) return;
                      setMobileAdding(true);
                      try {
                        const token = localStorage.getItem("access_token");
                        if (!token) throw new Error("No access token found");

                        const valid = mobileAddDrafts.filter(
                          (x) =>
                            x.full_name.trim() &&
                            x.class_name.trim() &&
                            x.division.trim() &&
                            x.school_id &&
                            x.location,
                        );
                        if (valid.length === 0) throw new Error("Fill all fields and pick location");

                        for (const x of valid) {
                          const res = await fetch("/api/backend/register-student", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              accept: "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                              parent_id: parent.id,
                              school_id: Number(x.school_id),
                              full_name: x.full_name,
                              class_name: x.class_name,
                              division: x.division,
                              student_address: x.addressLabel || "Selected from map",
                              location_latitude: x.location!.lat,
                              location_longitude: x.location!.lng,
                            }),
                          });
                          const body = await res.json().catch(() => null);
                          if (!res.ok) {
                            toast.error(body?.detail?.[0]?.msg || body?.detail || "Failed to add student");
                            return;
                          }
                        }

                        toast.success("Student added");
                        // Refresh list
                        const token2 = localStorage.getItem("access_token");
                        const studentsRes = await fetch(
                          `/api/backend/students?parent_id=${encodeURIComponent(parent.id)}`,
                          {
                            headers: { accept: "application/json", Authorization: `Bearer ${token2}` },
                          },
                        );
                        const studentsJson = (await studentsRes.json()) as Student[];
                        setStudents(studentsJson);
                        setMobileAddOpen(false);
                        setMobileAddDrafts([]);
                      } catch (e) {
                        toast.error(e instanceof Error ? e.message : "Failed to add student");
                      } finally {
                        setMobileAdding(false);
                      }
                    })();
                  }}
                >
                  {mobileAdding ? "Submitting..." : "Continue"}
                </button>

                <button
                  type="button"
                  className="w-full border border-[#e8b600] text-[#e8b600] font-semibold rounded-full py-2"
                  onClick={() => {
                    setMobileAddOpen(false);
                    setMobileAddDrafts([]);
                    setMobileAddMapFor(null);
                    toast.info("Cancelled");
                  }}
                >
                  Cancel
                </button>
              </div>
            )}

            <button
              className="w-full bg-[#e8b600] text-white font-semibold rounded-full py-2"
              onClick={() => {
                setMobileAddOpen(true);
                if (mobileAddDrafts.length === 0) {
                  setMobileAddDrafts([
                    {
                      id: `a${Date.now()}`,
                      full_name: "",
                      class_name: "",
                      division: "",
                      school_id: "",
                      addressLabel: "",
                      location: undefined,
                    },
                  ]);
                }
              }}
            >
              Add Another Student
            </button>
          </section>

          {/* Billing & Payment */}
          <section className="bg-white rounded-2xl shadow p-5 w-[340px] mb-4">
            <h2 className="font-bold text-lg mb-3 text-black">Billing &amp; Payment</h2>
            <div className="mb-3">
              <div className="text-xs font-semibold mb-1 text-black">Current Subscriptions</div>
              <div className="border rounded-xl p-2 mb-2 flex flex-col gap-1">
                {subscriptions.slice(0, 2).map((x) => (
                  <div key={x.id} className="flex justify-between text-xs text-black">
                    <span className="truncate pr-2">{x.name}</span>
                    <span>{x.amount ? `₹${x.amount}/month` : "-"}</span>
                  </div>
                ))}
              </div>
              <button className="w-full bg-[#e8b600] text-white font-semibold rounded-full py-1 mb-2">
                Manage Subscriptions
              </button>
            </div>
            <div className="mb-3">
              <div className="border border-red-400 rounded-xl p-3 mb-2">
                <div className="text-xs text-red-600 font-semibold mb-1">Payment Pending</div>
                <div className="flex justify-between text-xs mb-1 text-black">
                  <span className="font-medium text-gray-500">Due Date</span>
                  <span>--/--/----</span>
                </div>
                <div className="flex justify-between text-xs mb-2 text-black">
                  <span className="font-medium text-gray-500">Amount</span>
                  <span>{pendingAmount ? `₹${pendingAmount}` : "₹0"}</span>
                </div>
                <button className="w-full bg-red-600 text-white font-semibold rounded-full py-1">
                  Pay Now
                </button>
                <div className="text-[10px] text-gray-500 text-center mt-1">Pay now to avoid late fees*</div>
              </div>
            </div>
          </section>

          {/* Account Settings */}
          <section className="bg-white rounded-2xl shadow p-5 w-[340px] mb-4">
            <h2 className="font-bold text-lg mb-3 text-black">Account Settings</h2>
            <ul className="text-sm divide-y">
              {[
                "Notification Preferences",
                "Change Password",
                "Service History",
                "Payment History",
                "Get Help",
                "Policies & Terms",
              ].map((x) => (
                <li key={x} className="flex items-center justify-between py-2 cursor-pointer text-black">
                  <span className="flex items-center gap-2">{x}</span>
                  <span>&gt;</span>
                </li>
              ))}
            </ul>
          </section>

          <button
            onClick={handleLogout}
            className="w-[340px] bg-[#19191F] text-white font-semibold rounded-full py-3 text-lg mb-4"
          >
            Log Out
          </button>
        </div>

        <BottomNavBar />
      </div>

      {/* Edit address map picker (desktop edit) */}
      <MapAddressPicker
        open={editMapOpen}
        onClose={() => setEditMapOpen(false)}
        initialLatLng={editDraft?.location}
        onConfirm={(address: string, latlng: { lat: number; lng: number }) => {
          setEditDraft((p) =>
            p
              ? {
                  ...p,
                  student_address: address,
                  location: { lat: latlng.lat, lng: latlng.lng },
                }
              : p,
          );
          setEditMapOpen(false);
        }}
      />

      {/* Mobile edit map picker */}
      <MapAddressPicker
        open={mobileEditMapOpen}
        onClose={() => setMobileEditMapOpen(false)}
        initialLatLng={mobileEditDraft?.location}
        onConfirm={(address: string, latlng: { lat: number; lng: number }) => {
          setMobileEditDraft((p) =>
            p
              ? {
                  ...p,
                  student_address: address,
                  location: { lat: latlng.lat, lng: latlng.lng },
                }
              : p,
          );
          setMobileEditMapOpen(false);
        }}
      />

      {/* Mobile add map picker */}
      <MapAddressPicker
        open={!!mobileAddMapFor}
        onClose={() => setMobileAddMapFor(null)}
        initialLatLng={
          mobileAddDrafts.find((d) => d.id === mobileAddMapFor)?.location
        }
        onConfirm={(address: string, latlng: { lat: number; lng: number }) => {
          if (!mobileAddMapFor) return;
          setMobileAddDrafts((prev) =>
            prev.map((d) =>
              d.id === mobileAddMapFor
                ? {
                    ...d,
                    addressLabel: address,
                    location: { lat: latlng.lat, lng: latlng.lng },
                  }
                : d,
            ),
          );
          setMobileAddMapFor(null);
        }}
      />
    </div>
  );
} 