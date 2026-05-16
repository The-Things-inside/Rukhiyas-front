"use client";

import { useCallback, useState } from "react";
import { payForStudent } from "@/lib/razorpay";
import { toast } from "react-toastify";

type PayTarget = {
  id: number;
  name: string;
};

type ParentContact = {
  full_name?: string;
  email?: string;
  mobile_no?: string;
};

export function useStudentPayment(
  onPaymentSuccess?: () => void | Promise<void>,
) {
  const [paying, setPaying] = useState(false);

  const startPayment = useCallback(
    async (student: PayTarget, parent?: ParentContact | null) => {
      if (paying) return;
      setPaying(true);
      try {
        await payForStudent({
          studentId: student.id,
          studentName: student.name,
          parentName: parent?.full_name,
          parentEmail: parent?.email,
          parentPhone: parent?.mobile_no,
          onSuccess: async () => {
            toast.success(`Payment successful for ${student.name}`);
            await onPaymentSuccess?.();
          },
          onDismiss: () => {
            toast.info("Payment cancelled");
          },
        });
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Payment could not be completed";
        if (message !== "Payment cancelled") {
          toast.error(message);
        }
      } finally {
        setPaying(false);
      }
    },
    [paying, onPaymentSuccess],
  );

  return { paying, startPayment };
}
