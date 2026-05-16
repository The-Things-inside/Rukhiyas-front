export type StudentFeeDetails = {
  student_id: number;
  full_name: string;
  fee_expiry: string | null;
  amount: number;
  payment_status: string;
};

export type ManualPaymentPayload = {
  amount: number;
  frequency: string;
  payment_date: string;
  payment_method: string;
  notes: string;
};

function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function formatAdminFeeDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function isFeeExpiryInFuture(iso: string | null | undefined): boolean {
  if (!iso) return false;
  const expiry = new Date(iso);
  if (Number.isNaN(expiry.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  return expiry.getTime() > today.getTime();
}

export async function fetchStudentFeeDetails(
  studentId: number,
): Promise<StudentFeeDetails> {
  const token = getAdminToken();
  if (!token) throw new Error("No access token found");

  const res = await fetch(`/api/backend/admin/students/${studentId}/fee-details`, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const detail =
      typeof body?.detail === "string" ? body.detail : "Failed to load fee details";
    throw new Error(detail);
  }

  return body as StudentFeeDetails;
}

export async function recordManualPayment(
  studentId: number,
  payload: ManualPaymentPayload,
): Promise<void> {
  const token = getAdminToken();
  if (!token) throw new Error("No access token found");

  const res = await fetch(
    `/api/backend/admin/students/${studentId}/manual-payment`,
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail =
      typeof body?.detail === "string"
        ? body.detail
        : "Failed to record payment";
    throw new Error(detail);
  }
}
