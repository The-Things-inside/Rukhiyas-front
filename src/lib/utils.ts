import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Formats `fee_expiry` from `/students/me` as DD/MM/YYYY for payment due dates. */
export function formatFeeExpiry(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function earliestFeeExpiry(
  expires: (string | null | undefined)[],
): string | null {
  let best: { time: number; iso: string } | null = null;
  for (const iso of expires) {
    if (!iso) continue;
    const time = new Date(iso).getTime();
    if (Number.isNaN(time)) continue;
    if (!best || time < best.time) best = { time, iso };
  }
  return best?.iso ?? null;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

let idCounter = 0;

export function generateId(): string {
  if (typeof window !== 'undefined') {
    idCounter += 1;
    return 'cid-' + idCounter.toString(36) + '-' + Date.now().toString(36);
  } else {
    // SSR: fallback to a deterministic value (not random)
    return 'sid-ssr';
  }
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Decodes a JWT and returns the payload as an object
export function decodeJWT(token: string): any {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
} 