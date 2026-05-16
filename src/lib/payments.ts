import { authFetch, parseJsonResponse } from "@/lib/auth-token";

export type StudentPayment = {
  id: number;
  student_id: number;
  transaction_id: string;
  amount: number;
  payment_date: string;
  status: string;
  payment_method: string | null;
  notes: string | null;
  fee_expiry: string | null;
  payment_type: string;
  subscription_id: string | null;
};

export async function fetchStudentPayments(
  studentId: number,
): Promise<StudentPayment[]> {
  const res = await authFetch(`/api/backend/payments/${studentId}`);

  if (!res.ok) {
    const body = await parseJsonResponse<{ detail?: string }>(res).catch(
      () => null,
    );
    throw new Error(
      typeof body?.detail === "string"
        ? body.detail
        : "Failed to load payment history",
    );
  }

  const data = await parseJsonResponse<StudentPayment[]>(res);
  return [...data].sort(
    (a, b) =>
      new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime(),
  );
}

export function maskPaymentReference(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length <= 10) return trimmed;
  return `${trimmed.slice(0, 6)}···${trimmed.slice(-4)}`;
}

export function getPaymentModeDisplay(payment: StudentPayment): {
  brand: "card" | "upi" | "wallet" | "online";
  label: string;
  detail: string;
} {
  const method = payment.payment_method?.toLowerCase() ?? "";

  if (method.includes("visa")) {
    return {
      brand: "card",
      label: "Visa",
      detail: maskPaymentReference(payment.notes ?? payment.transaction_id),
    };
  }
  if (method.includes("master") || method.includes("card")) {
    return {
      brand: "card",
      label: "Card",
      detail: maskPaymentReference(payment.notes ?? "**** **** **** 2130"),
    };
  }
  if (method.includes("gpay") || method.includes("google")) {
    return {
      brand: "wallet",
      label: "Google Pay",
      detail: maskPaymentReference(payment.notes ?? payment.transaction_id),
    };
  }
  if (method.includes("phonepe")) {
    return {
      brand: "wallet",
      label: "PhonePe",
      detail: maskPaymentReference(payment.notes ?? payment.transaction_id),
    };
  }
  if (method.includes("upi")) {
    return {
      brand: "upi",
      label: "UPI",
      detail: maskPaymentReference(payment.notes ?? payment.transaction_id),
    };
  }

  if (payment.notes?.startsWith("pay_")) {
    return {
      brand: "upi",
      label: "Razorpay",
      detail: maskPaymentReference(payment.notes),
    };
  }

  return {
    brand: "online",
    label: "Online payment",
    detail: maskPaymentReference(payment.transaction_id),
  };
}
