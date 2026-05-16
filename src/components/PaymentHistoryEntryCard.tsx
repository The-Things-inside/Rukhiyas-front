import { getPaymentModeDisplay, type StudentPayment } from "@/lib/payments";
import { formatFeeExpiry } from "@/lib/utils";

function formatInr(amount: number): string {
  return `₹${amount}`;
}

function PaymentModeBadge({ brand }: { brand: "card" | "upi" | "wallet" | "online" }) {
  const styles: Record<typeof brand, string> = {
    card: "bg-[#1A1F71] text-white",
    upi: "bg-[#5F259F] text-white",
    wallet: "bg-[#4285F4] text-white",
    online: "bg-[#19191F] text-white",
  };
  const labels: Record<typeof brand, string> = {
    card: "Card",
    upi: "UPI",
    wallet: "Pay",
    online: "Pay",
  };

  return (
    <span
      className={`inline-flex h-6 min-w-[38px] items-center justify-center rounded px-2 text-[10px] font-bold ${styles[brand]}`}
      style={{ fontFamily: "Satoshi, sans-serif" }}
    >
      {labels[brand]}
    </span>
  );
}

export default function PaymentHistoryEntryCard({
  payment,
}: {
  payment: StudentPayment;
}) {
  const mode = getPaymentModeDisplay(payment);
  const dueDate = formatFeeExpiry(payment.fee_expiry);
  const paidOn = formatFeeExpiry(payment.payment_date);
  const isSuccess = payment.status === "success";

  return (
    <article
      className="w-full rounded-[12px] border border-[#EAEAEA] bg-white p-4"
      style={{
        boxShadow:
          "0 3px 3px rgba(0,0,0,0.04), 0 11px 5.5px rgba(0,0,0,0.03), 0 25px 7.5px rgba(0,0,0,0.02)",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <span
            className="text-[16px] text-[#5E5E5E]"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            Due Date
          </span>
          <span
            className="text-[16px] text-black"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            {dueDate}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span
            className="text-[16px] text-[#5E5E5E]"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            Amount
          </span>
          <span
            className="text-[16px] text-black"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            {formatInr(payment.amount)}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span
            className="text-[16px] text-[#5E5E5E]"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            Paid On
          </span>
          <span
            className="text-[16px] text-black"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            {paidOn}
          </span>
        </div>
      </div>

      {!isSuccess && (
        <p
          className="mt-2 text-[12px] capitalize text-amber-700"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          Status: {payment.status}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-2">
        <span
          className="text-[16px] text-[#5E5E5E]"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          Payment Mode
        </span>
        <div className="flex items-center gap-2">
          <PaymentModeBadge brand={mode.brand} />
          <span
            className="text-[16px] text-black opacity-90"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            {mode.detail}
          </span>
        </div>
      </div>
    </article>
  );
}
