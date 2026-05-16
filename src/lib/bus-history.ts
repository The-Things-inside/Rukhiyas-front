import { authFetch, parseJsonResponse } from "@/lib/auth-token";

export type BusDayRecord = {
  id: number | null;
  bus_id: number;
  date: string;
  bus_start: string | null;
  bus_arrived_school: string | null;
  bus_departed_school: string | null;
  created_at: string | null;
};

export type BusHistoryResponse = {
  today: BusDayRecord;
  history: BusDayRecord[];
};

export function formatBusTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatBusDate(date: string): string {
  const parts = date.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function mergeBusHistoryDays(data: BusHistoryResponse): BusDayRecord[] {
  const byDate = new Map<string, BusDayRecord>();

  const add = (record: BusDayRecord | null | undefined) => {
    if (!record?.date) return;
    byDate.set(record.date, record);
  };

  add(data.today);
  for (const row of data.history) add(row);

  return [...byDate.values()].sort((a, b) => b.date.localeCompare(a.date));
}

export async function fetchBusHistory(busId: number): Promise<BusDayRecord[]> {
  const res = await authFetch(`/api/backend/buses/${busId}/history`);
  if (!res.ok) {
    const body = await parseJsonResponse<{ detail?: string }>(res).catch(
      () => null,
    );
    throw new Error(
      typeof body?.detail === "string"
        ? body.detail
        : "Failed to load service history",
    );
  }
  const data = await parseJsonResponse<BusHistoryResponse>(res);
  return mergeBusHistoryDays(data);
}

export async function fetchBusHistoryByDate(
  busId: number,
  targetDate: string,
): Promise<BusDayRecord | null> {
  const res = await authFetch(
    `/api/backend/buses/${busId}/date/${encodeURIComponent(targetDate)}`,
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error("Failed to load service history for selected date");
  }
  return parseJsonResponse<BusDayRecord>(res);
}
