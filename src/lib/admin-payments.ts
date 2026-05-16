import type { StudentPayment } from "@/lib/payments";

function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export async function fetchParentPaymentHistory(
  parentId: number,
): Promise<StudentPayment[]> {
  const token = getAdminToken();
  if (!token) throw new Error("No access token found");

  const res = await fetch(
    `/api/backend/admin/parents/${parentId}/payment-history`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const detail =
      typeof body?.detail === "string"
        ? body.detail
        : "Failed to load payment history";
    throw new Error(detail);
  }

  const data = body as StudentPayment[];
  return [...data].sort(
    (a, b) =>
      new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime(),
  );
}
