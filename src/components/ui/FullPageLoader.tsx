/** Neutral full-page loader — does not use mobile AppLayout shell. */
export default function FullPageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
      <p className="text-sm text-[#5E5E5E]" style={{ fontFamily: "Satoshi, sans-serif" }}>
        {label}
      </p>
    </div>
  );
}
