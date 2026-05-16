import { authFetch, parseJsonResponse } from "@/lib/auth-token";

export type CreateOrderResponse = {
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
};

export type VerifyPaymentPayload = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

let scriptPromise: Promise<boolean> | null = null;

export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);

  if (!scriptPromise) {
    scriptPromise = new Promise((resolve) => {
      const existing = document.querySelector(
        `script[src="${RAZORPAY_SCRIPT}"]`,
      );
      if (existing) {
        existing.addEventListener("load", () => resolve(!!window.Razorpay));
        existing.addEventListener("error", () => resolve(false));
        return;
      }

      const script = document.createElement("script");
      script.src = RAZORPAY_SCRIPT;
      script.async = true;
      script.onload = () => resolve(!!window.Razorpay);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  return scriptPromise;
}

export async function createPaymentOrder(
  studentId: number,
): Promise<CreateOrderResponse> {
  const body = new URLSearchParams();
  body.append("student_id", String(studentId));

  const res = await authFetch("/api/backend/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const err = await parseJsonResponse<{ detail?: string | { msg?: string }[] }>(
      res,
    ).catch(() => null);
    const detail = err?.detail;
    const message = Array.isArray(detail) ? detail[0]?.msg : detail;
    throw new Error(message || "Failed to create payment order");
  }

  return parseJsonResponse<CreateOrderResponse>(res);
}

export async function verifyPayment(
  payload: VerifyPaymentPayload,
): Promise<void> {
  const body = new URLSearchParams();
  body.append("razorpay_order_id", payload.razorpay_order_id);
  body.append("razorpay_payment_id", payload.razorpay_payment_id);
  body.append("razorpay_signature", payload.razorpay_signature);

  const res = await authFetch("/api/backend/verify-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const err = await parseJsonResponse<{ detail?: string | { msg?: string }[] }>(
      res,
    ).catch(() => null);
    const detail = err?.detail;
    const message = Array.isArray(detail) ? detail[0]?.msg : detail;
    throw new Error(message || "Payment verification failed");
  }
}

/** Backend fee is in INR; Razorpay Checkout expects paise. */
export function toRazorpayAmount(amountInr: number): number {
  return Math.round(amountInr * 100);
}

export type OpenCheckoutParams = {
  order: CreateOrderResponse;
  studentName: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  onSuccess: () => void | Promise<void>;
  onDismiss?: () => void;
};

export async function openRazorpayCheckout({
  order,
  studentName,
  parentName,
  parentEmail,
  parentPhone,
  onSuccess,
  onDismiss,
}: OpenCheckoutParams): Promise<void> {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    throw new Error("Could not load payment gateway. Please try again.");
  }

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay!({
      key: order.key_id,
      amount: toRazorpayAmount(order.amount),
      currency: order.currency || "INR",
      name: "Rukhiyas Travels",
      description: `Subscription — ${studentName}`,
      order_id: order.order_id,
      prefill: {
        name: parentName,
        email: parentEmail,
        contact: parentPhone,
      },
      theme: { color: "#E8B600" },
      handler: async (response) => {
        try {
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          await onSuccess();
          resolve();
        } catch (e) {
          reject(e instanceof Error ? e : new Error("Payment verification failed"));
        }
      },
      modal: {
        ondismiss: () => {
          onDismiss?.();
          reject(new Error("Payment cancelled"));
        },
      },
    });

    rzp.on("payment.failed", (response) => {
      reject(
        new Error(
          response.error?.description || "Payment failed. Please try again.",
        ),
      );
    });

    rzp.open();
  });
}

export async function payForStudent(params: {
  studentId: number;
  studentName: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  onSuccess: () => void | Promise<void>;
  onDismiss?: () => void;
}): Promise<void> {
  const order = await createPaymentOrder(params.studentId);
  await openRazorpayCheckout({
    order,
    studentName: params.studentName,
    parentName: params.parentName,
    parentEmail: params.parentEmail,
    parentPhone: params.parentPhone,
    onSuccess: params.onSuccess,
    onDismiss: params.onDismiss,
  });
}
