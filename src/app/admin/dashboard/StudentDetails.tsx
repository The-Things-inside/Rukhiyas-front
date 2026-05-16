"use client";
import React, { useEffect, useState, useCallback } from "react";
import AdminStudentBilling from "@/components/admin/AdminStudentBilling";
import AdminStudentProfileDesktop from "@/components/admin/AdminStudentProfileDesktop";
import AdminPaymentHistorySheet from "@/components/admin/AdminPaymentHistorySheet";
import AdminEditStudentSheet from "@/components/admin/AdminEditStudentSheet";
import AdminEditParentSheet from "@/components/admin/AdminEditParentSheet";
import {
  fetchStudentFeeDetails,
  type StudentFeeDetails,
} from "@/lib/admin-student-fees";

export default function StudentDetails({ studentId, onBack }: { studentId: number; onBack: () => void }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [approveLoading, setApproveLoading] = useState<number | null>(null);
  const [denyLoading, setDenyLoading] = useState<number | null>(null);
  const [feeDetails, setFeeDetails] = useState<StudentFeeDetails | null>(null);
  const [feeLoading, setFeeLoading] = useState(true);
  const [feeError, setFeeError] = useState<string | null>(null);
  const [paymentHistoryOpen, setPaymentHistoryOpen] = useState(false);
  const [editStudentOpen, setEditStudentOpen] = useState(false);
  const [editParentOpen, setEditParentOpen] = useState(false);

  const loadFeeDetails = useCallback(async () => {
    setFeeLoading(true);
    setFeeError(null);
    try {
      const fee = await fetchStudentFeeDetails(studentId);
      setFeeDetails(fee);
    } catch (err) {
      setFeeError(
        err instanceof Error ? err.message : "Failed to load fee details",
      );
    } finally {
      setFeeLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    loadFeeDetails();
  }, [loadFeeDetails]);

  const loadDetails = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");
      const res = await fetch(`/api/backend/admin/students/${studentId}/details`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch student details");
      const json = await res.json();
      setData(json);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch student details",
      );
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  async function handleApproveRequest(requestId: number) {
    setApproveLoading(requestId);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");
      const res = await fetch(`/api/backend/admin/requests/${requestId}/approve`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes: "set" }),
      });
      if (!res.ok) throw new Error("Failed to approve request");
      // Optionally show a success message
      // Refresh data
      const detailsRes = await fetch(`/api/backend/admin/students/${studentId}/details`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (detailsRes.ok) {
        const json = await detailsRes.json();
        setData(json);
      }
    } catch (err) {
      alert("Failed to approve request. Please try again.");
    } finally {
      setApproveLoading(null);
    }
  }

  async function handleRejectRequest(requestId: number) {
    setDenyLoading(requestId);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");
      const res = await fetch(`/api/backend/admin/requests/${requestId}/reject`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes: "set" }),
      });
      if (!res.ok) throw new Error("Failed to reject request");
      // Refresh data
      const detailsRes = await fetch(`/api/backend/admin/students/${studentId}/details`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (detailsRes.ok) {
        const json = await detailsRes.json();
        setData(json);
      }
    } catch (err) {
      alert("Failed to reject request. Please try again.");
    } finally {
      setDenyLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#FAFAFA] text-lg text-[#19191F]">
        Loading…
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#FAFAFA] text-lg text-red-500">
        {error}
      </div>
    );
  }
  if (!data) return null;

  const student = data.student;
  const parent = data.parent;
  const requests = parent.requests || [];
  const parentId: number | null =
    parent?.id ?? parent?.parent_id ?? student?.parent_id ?? null;

  const openPaymentHistory = () => {
    if (!parentId) {
      alert("Parent ID not available for this student.");
      return;
    }
    setPaymentHistoryOpen(true);
  };

  const openEditParent = () => {
    if (!parentId) {
      alert("Parent ID not available for this student.");
      return;
    }
    setEditParentOpen(true);
  };

  function renderRequestCard(req: any) {
    const date = req.created_at ? new Date(req.created_at).toLocaleDateString() : "";
    let title = "";
    let content = null;
    if (req.request_type === "temporary_address") {
      title = "Temp Address Change";
      let pick = req.temp_pick_address || (req.requested_data && typeof req.requested_data === "string" && req.requested_data.startsWith("{") ? (() => { try { return JSON.parse(req.requested_data).pick; } catch { return null; } })() : null);
      let drop = req.temp_drop_address || (req.requested_data && typeof req.requested_data === "string" && req.requested_data.startsWith("{") ? (() => { try { return JSON.parse(req.requested_data).drop; } catch { return null; } })() : null);
      content = (
        <>
          <div className="mb-2">
            <div className="bg-[#F8F8F8] border border-[#E0E0E0] rounded-xl p-3 mb-2">
              <div className="text-[#9B9B9B] text-xs mb-1">New Pick Up</div>
              <div className="text-[#19191F] text-sm font-satoshi font-medium">{pick || req.current_data || "-"}</div>
            </div>
            <div className="bg-[#F8F8F8] border border-[#E0E0E0] rounded-xl p-3 mb-2">
              <div className="text-[#9B9B9B] text-xs mb-1">New Drop Off</div>
              <div className="text-[#19191F] text-sm font-satoshi font-medium">{drop || req.current_data || "Same as pick up address"}</div>
            </div>
            <div className="bg-[#F8F8F8] border border-[#E0E0E0] rounded-xl p-3">
              <div className="text-[#9B9B9B] text-xs mb-1">Dates</div>
              <div className="text-[#19191F] text-sm font-satoshi font-medium">{req.temp_dates ? req.temp_dates.join(", ") : "-"}</div>
            </div>
          </div>
        </>
      );
    } else if (req.request_type === "pause_service") {
      title = "Pause Service";
      content = (
        <>
          <div className="mb-2">
            <div className="bg-[#F8F8F8] border border-[#E0E0E0] rounded-xl p-3 mb-2">
              <div className="text-[#9B9B9B] text-xs mb-1">Dates</div>
              <div className="text-[#19191F] text-sm font-satoshi font-medium">{req.temp_dates ? req.temp_dates.join(", ") : "-"}</div>
            </div>
            <div className="bg-[#F8F8F8] border border-[#E0E0E0] rounded-xl p-3">
              <div className="text-[#9B9B9B] text-xs mb-1">Reason</div>
              <div className="text-[#19191F] text-sm font-satoshi font-medium">{req.notes || req.requested_data || "-"}</div>
            </div>
          </div>
        </>
      );
    } else if (req.request_type === "permanent_address") {
      title = "Perm Address Change";
      content = (
        <>
          <div className="mb-2">
            <div className="bg-[#F8F8F8] border border-[#E0E0E0] rounded-xl p-3">
              <div className="text-[#9B9B9B] text-xs mb-1">New Address</div>
              <div className="text-[#19191F] text-sm font-satoshi font-medium">{req.requested_data || "-"}</div>
            </div>
          </div>
        </>
      );
    }
    return (
      <div key={req.id} className="rounded-2xl border border-[#E8B600] bg-white shadow p-4 min-w-[320px] max-w-[340px] flex flex-col mb-4" style={{ borderWidth: 1 }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#E8B600] text-[15px] font-bold font-satoshi">{title}</span>
          <span className="text-[#9B9B9B] text-xs font-satoshi">{date}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#19191F] text-[14px] font-satoshi">Name</span>
          <span className="text-[#9B9B9B] text-[14px] font-satoshi">ID No. {student.id}</span>
        </div>
        <div className="mb-1">
          <div className="text-[#9B9B9B] text-xs font-satoshi">School</div>
          <div className="text-[#19191F] text-[14px] font-satoshi">{student.school_id}</div>
        </div>
        <div className="mb-1">
          <div className="text-[#9B9B9B] text-xs font-satoshi">Address</div>
          <div className="text-[#19191F] text-[14px] font-satoshi">{student.student_address}</div>
        </div>
        {content}
        <div className="flex gap-3 mt-2">
          <button
            className="flex-1 bg-[#E8B600] text-white font-bold rounded-full py-2 font-satoshi shadow active:scale-95 transition disabled:opacity-60"
            disabled={approveLoading === req.id || denyLoading === req.id}
            onClick={() => handleApproveRequest(req.id)}
          >
            {approveLoading === req.id ? "Approving..." : "Confirm"}
          </button>
          {req.request_type !== "pause_service" && (
            <button
              className="flex-1 border border-[#E8B600] text-[#E8B600] font-bold rounded-full py-2 font-satoshi shadow active:scale-95 transition bg-white disabled:opacity-60"
              disabled={approveLoading === req.id || denyLoading === req.id}
              onClick={() => handleRejectRequest(req.id)}
            >
              {denyLoading === req.id ? "Denying..." : "Deny"}
            </button>
          )}
        </div>
      </div>
    );
  }

  const requestsPanel =
    requests.length === 0 ? (
      <p className="text-center text-[#9B9B9B]">No requests found.</p>
    ) : (
      <div className="flex flex-wrap gap-4">{requests.map(renderRequestCard)}</div>
    );

  return (
    <>
      <AdminPaymentHistorySheet
        open={paymentHistoryOpen}
        onClose={() => setPaymentHistoryOpen(false)}
        parentId={parentId}
        subtitle={student.full_name}
      />

      <AdminEditStudentSheet
        open={editStudentOpen}
        onClose={() => setEditStudentOpen(false)}
        student={student}
        onSuccess={() => loadDetails({ silent: true })}
      />

      {parentId ? (
        <AdminEditParentSheet
          open={editParentOpen}
          onClose={() => setEditParentOpen(false)}
          parent={{ ...parent, id: parentId }}
          onSuccess={() => loadDetails({ silent: true })}
        />
      ) : null}

      {/* Desktop — Figma 1-71422 */}
      <div className="hidden h-full min-h-0 md:flex md:flex-1">
        <AdminStudentProfileDesktop
          student={student}
          parent={parent}
          requestsCount={requests.length}
          studentId={studentId}
          feeDetails={feeDetails}
          feeLoading={feeLoading}
          feeError={feeError}
          onPaymentRecorded={loadFeeDetails}
          requestsPanel={requestsPanel}
          onPaymentHistoryClick={openPaymentHistory}
          onEditStudent={() => setEditStudentOpen(true)}
          onEditParent={openEditParent}
        />
      </div>

      {/* Mobile */}
      <div className="flex min-h-screen flex-col bg-[#19191F] md:hidden">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-30">
        <div className="bg-[#19191F] pt-6 pb-2 px-4 flex items-center justify-between  shadow-lg" style={{ minHeight: 72 }}>
          <div className="flex items-center gap-2">
            <button className="text-white" onClick={onBack}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <span className="text-white text-[20px] font-bold font-satoshi">Student Profile</span>
          </div>
          <div className="flex items-center gap-4">
            <button>
              <svg width="28" height="28" fill="none" viewBox="0 0 36 36"><path d="M16.0176 7.25279C17.0155 6.30885 18.5475 6.32092 19.6553 7.04674C19.7222 7.09787 19.787 7.15179 19.8506 7.20689C19.5074 7.71587 19.2575 8.29229 19.1201 8.91099C18.9718 8.6886 18.7855 8.4964 18.5391 8.34849C17.9466 8.08132 17.3683 8.2434 16.9326 8.71568C16.727 8.98807 16.5985 9.30327 16.4619 9.61412C16.1704 10.2465 15.7732 10.4863 15.1592 10.7655C13.9978 11.2958 13.1061 12.2173 12.6562 13.4169C12.3247 14.3629 12.2726 15.3173 12.25 16.3104C12.1906 18.9173 11.8073 21.0341 10.1094 23.0663C10.0722 23.111 10.0353 23.1559 9.99707 23.202C9.96427 23.2405 9.93124 23.2795 9.89746 23.3192C9.80908 23.4332 9.80852 23.4337 9.82715 23.6307C9.95715 23.6957 10.0478 23.6892 10.1934 23.6893H10.75C10.9328 23.6896 11.116 23.6904 11.2988 23.6903C11.4958 23.6903 11.6927 23.69 11.8896 23.6903C12.2757 23.6907 12.6618 23.6912 13.0479 23.6913C13.3613 23.6913 13.6748 23.6911 13.9883 23.6913C14.8765 23.6917 15.7651 23.6923 16.6533 23.6922H16.9443C17.7223 23.6922 18.5003 23.6925 19.2783 23.6932C20.0764 23.694 20.8747 23.6942 21.6729 23.6942C22.1213 23.6942 22.5701 23.6946 23.0186 23.6952H25.3809C25.4739 23.6956 25.4743 23.6957 25.5693 23.6961C25.6254 23.6959 25.6815 23.6954 25.7393 23.6952C25.8122 23.6952 25.8122 23.6952 25.8867 23.6952C26.0126 23.6935 26.0125 23.6933 26.1045 23.5799C26.0869 23.4123 26.0187 23.3172 25.9102 23.1922C25.8658 23.1403 25.8655 23.1398 25.8203 23.0868C25.7886 23.05 25.7563 23.0134 25.7236 22.9754C24.1061 21.0508 23.7296 18.8766 23.6846 16.4208C23.6755 15.9313 23.651 15.45 23.5947 14.9813C23.7285 14.992 23.8635 14.9999 24 14.9999C24.4437 14.9999 24.8736 14.9404 25.2832 14.8319C25.3251 15.222 25.3485 15.6168 25.3564 16.0184C25.4005 18.1503 25.5451 20.0582 26.9463 21.7596C27.5371 22.4774 27.8807 22.9288 27.7939 23.8876C27.6992 24.3815 27.4119 24.7366 27.0234 25.0458C26.48 25.4097 25.9223 25.3923 25.2949 25.3866C25.2016 25.3863 25.108 25.3858 25.0146 25.3856C24.7702 25.385 24.5257 25.3834 24.2812 25.3817C24.0311 25.3801 23.7804 25.3795 23.5303 25.3788C23.0405 25.3771 22.5503 25.3752 22.0605 25.3719C22.0612 25.4288 22.0618 25.4289 22.0625 25.4872C22.0628 25.5374 22.0631 25.5877 22.0635 25.6395C22.0641 25.714 22.0638 25.7142 22.0645 25.7899C22.0394 26.7764 21.4867 27.6954 20.8057 28.371C19.9397 29.189 18.8811 29.4928 17.7158 29.4774C16.6093 29.4443 15.6287 28.9264 14.873 28.1356C14.2846 27.4468 13.8628 26.5808 13.8691 25.6629C13.8694 25.6083 13.8698 25.5533 13.8701 25.4969C13.8707 25.4352 13.8705 25.4349 13.8711 25.3719C13.8192 25.3725 13.7673 25.3723 13.7139 25.3729C13.223 25.3781 12.7321 25.3821 12.2412 25.3846C11.989 25.386 11.7366 25.3876 11.4844 25.3905C11.2404 25.3933 10.9959 25.3947 10.752 25.3954C10.6595 25.3958 10.5671 25.3969 10.4746 25.3983C9.78915 25.4082 9.20904 25.3534 8.68848 24.8534C8.29525 24.4294 8.08785 24.0129 8.08691 23.4266C8.13836 22.8261 8.42718 22.4073 8.81348 21.9686C10.3076 20.2694 10.5175 18.3583 10.5635 16.1629C10.6099 13.9816 11.0715 11.9185 12.6943 10.3553C13.2069 9.90044 13.7615 9.56137 14.3721 9.25279C14.4091 9.23408 14.4463 9.21543 14.4844 9.19615C14.5754 9.15181 14.6684 9.11145 14.7617 9.07213C14.9305 8.97037 14.959 8.8912 15.0225 8.70689C15.2271 8.16866 15.5158 7.76342 15.9189 7.35338C15.9515 7.32018 15.9841 7.287 16.0176 7.25279ZM15.5605 25.3719C15.5606 26.0996 15.7801 26.6057 16.2822 27.12C16.7974 27.6086 17.3605 27.7981 18.0615 27.7967C18.6746 27.7796 19.2454 27.5159 19.6934 27.0995C20.1471 26.6116 20.372 26.0326 20.3721 25.3719H15.5605Z" fill="#fff"/><circle cx="24" cy="10" r="4" fill="#E8B600"/></svg>
            </button>
            <button>
              <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><rect x="6" y="8" width="16" height="2" rx="1" fill="#fff"/><rect x="6" y="13" width="16" height="2" rx="1" fill="#fff"/><rect x="6" y="18" width="16" height="2" rx="1" fill="#fff"/></svg>
            </button>
          </div>
        </div>
        {/* Dropdown */}
          
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center bg-[#F8F8F8] pt-0 pb-8 overflow-y-auto">
        {/* Parent Requests Accordion */}
        <div className="bg-white rounded-xl shadow px-6 py-3 w-[340px] flex items-center justify-between mb-6 border border-[#E0E0E0] mt-8 cursor-pointer select-none" onClick={() => setRequestsOpen((v) => !v)}>
          <span className="text-[#19191F] text-[17px] font-satoshi font-medium">Parent Requests <span className="text-[#E8B600] font-bold ml-1">{requests.length}</span></span>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" style={{ transform: requestsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><path d="M6 9l6 6 6-6" stroke="#19191F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        {requestsOpen && (
          <div className="flex flex-wrap gap-4 mb-6 w-full justify-center">
            {requests.length === 0 ? (
              <div className="text-[#9B9B9B] text-center w-full">No requests found.</div>
            ) : (
              requests.map(renderRequestCard)
            )}
          </div>
        )}
        {/* Student Details Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 w-[340px] relative mb-6">
          {/* Header */}
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-[18px] font-bold text-[#19191F] font-satoshi">Student Details</span>
            <span className="text-[#9B9B9B] text-[14px] font-satoshi">ID No. {student.id}</span>
          </div>
          
          {/* Profile */}
          
          <div className="flex items-center gap-3 mb-2">
            <img src={student.profile_picture_url || "/assets/DP.svg"} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
            <span className="text-[16px] font-bold text-[#19191F] font-satoshi">{student.full_name}</span>
          </div>
          {/* Class & School */}
          <div className="flex items-center gap-6 mb-2">
            <div>
              <div className="text-[#9B9B9B] text-[13px] font-satoshi">Class</div>
              <div className="text-[#19191F] text-[15px] font-satoshi">{student.class_name}{student.division ? ` ${student.division}` : ""}</div>
            </div>
            <div>
              <div className="text-[#9B9B9B] text-[13px] font-satoshi">School</div>
              <div className="text-[#19191F] text-[15px] font-satoshi">{student.school_id}</div>
            </div>
          </div>
          {/* Address */}
          <div className="mb-2">
            <div className="text-[#9B9B9B] text-[13px] font-satoshi">Address</div>
            <div className="text-[#19191F] text-[15px] font-satoshi">{student.student_address}</div>
          </div>
          {/* Bus */}
          <div className="mb-2">
            <div className="text-[#9B9B9B] text-[13px] font-satoshi">Assign Bus/Route</div>
            <div className="text-[#19191F] text-[15px] font-satoshi">Bus {student.bus_id}{student.bus_route ? ` - ${student.bus_route}` : ""}</div>
          </div>
          {/* Emergency Contact */}
          <div className="mb-6">
            <div className="text-[#9B9B9B] text-[13px] font-satoshi">Emergency Contact</div>
            <div className="text-[#19191F] text-[15px] font-satoshi">{parent.mobile_no}</div>
          </div>
          {/* Edit Button */}
          <button
            type="button"
            onClick={() => setEditStudentOpen(true)}
            className="w-full bg-[#E8B600] text-white font-bold rounded-full py-3 text-[17px] font-satoshi shadow-md active:scale-95 transition"
          >
            Edit
          </button>
        </div>

        {/* Parent Details Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 w-[340px] relative mb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[18px] font-bold text-[#19191F] font-satoshi">Parent Details</span>
          </div>
          {/* Profile */}
          <div className="flex items-center gap-3 mb-2">
            <img src={parent.profile_picture_url || "/assets/DP.svg"} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
            <span className="text-[16px] font-bold text-[#19191F] font-satoshi">{parent.full_name}</span>
          </div>
          {/* Numbers */}
          <div className="flex items-center gap-6 mb-2">
            <div>
              <div className="text-[#9B9B9B] text-[13px] font-satoshi">Primary Number</div>
              <div className="text-[#19191F] text-[15px] font-satoshi">{parent.mobile_no}</div>
            </div>
            <div>
              <div className="text-[#9B9B9B] text-[13px] font-satoshi">Alternate Number</div>
              <div className="text-[#19191F] text-[15px] font-satoshi">{parent.alternative_mobile || "-"}</div>
            </div>
          </div>
          {/* Email */}
          <div className="mb-2">
            <div className="text-[#9B9B9B] text-[13px] font-satoshi">Email</div>
            <div className="text-[#19191F] text-[15px] font-satoshi">{parent.email}</div>
          </div>
          {/* Address */}
          <div className="mb-6">
            <div className="text-[#9B9B9B] text-[13px] font-satoshi">Primary Address</div>
            <div className="text-[#19191F] text-[15px] font-satoshi">{parent.address || "-"}</div>
          </div>
          {/* Edit Button */}
          <button
            type="button"
            onClick={openEditParent}
            className="w-full bg-[#E8B600] text-white font-bold rounded-full py-3 text-[17px] font-satoshi shadow-md active:scale-95 transition"
          >
            Edit
          </button>
        </div>

        {/* Billing & Payment Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 w-[340px] relative mb-6">
          <AdminStudentBilling
            studentId={studentId}
            feeDetails={feeDetails}
            feeLoading={feeLoading}
            feeError={feeError}
            onPaymentRecorded={loadFeeDetails}
          />
        </div>

        {/* History/Actions Card */}
        <div className="w-[340px] flex flex-col gap-2 mt-6">
          <button className="flex items-center justify-between w-full bg-white rounded-xl shadow-sm px-6 py-4 text-[#19191F] font-satoshi text-[17px] font-medium border border-[#E0E0E0]">
            <span>Parent Requests</span>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M17 8.5A2.5 2.5 0 0 0 14.5 6h-5A2.5 2.5 0 0 0 7 8.5v3A2.5 2.5 0 0 0 9.5 14h.75v2.25a.75.75 0 0 0 1.28.53l2.28-2.28H14.5A2.5 2.5 0 0 0 17 11.5v-3Z" stroke="#19191F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="17" cy="17" r="1" fill="#19191F"/></svg>
          </button>
          <button className="flex items-center justify-between w-full bg-white rounded-xl shadow-sm px-6 py-4 text-[#19191F] font-satoshi text-[17px] font-medium border border-[#E0E0E0]">
            <span>Service History</span>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 7v5l3 3" stroke="#19191F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="9" stroke="#19191F" strokeWidth="1.5"/></svg>
          </button>
          <button
            type="button"
            onClick={openPaymentHistory}
            className="flex items-center justify-between w-full bg-white rounded-xl shadow-sm px-6 py-4 text-[#19191F] font-satoshi text-[17px] font-medium border border-[#E0E0E0]"
          >
            <span>Payment History</span>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2" stroke="#19191F" strokeWidth="1.5"/><path d="M9 7h6M9 11h6M9 15h2" stroke="#19191F" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>
    </div>
    </>
  );
} 
