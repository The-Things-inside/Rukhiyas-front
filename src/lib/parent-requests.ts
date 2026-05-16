import { authFetch, parseJsonResponse } from "@/lib/auth-token";

export type ParentServiceRequest = {
  id: number;
  student_id: number;
  parent_id: number;
  request_type: string;
  status: string;
  current_data: string;
  requested_data: string;
  temp_pick_address: string | null;
  temp_drop_address: string | null;
  temp_dates: string[] | null;
  created_at: string;
  processed_at: string | null;
  processed_by: number | null;
  notes: string | null;
  student_name: string | null;
  parent_name: string | null;
};

export function formatSelectedDatesLabel(dates: Date[]): string {
  if (!dates.length) return "Select dates";
  const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
  const groups = new Map<string, number[]>();

  for (const date of sorted) {
    const month = date.toLocaleString("en-US", { month: "long" });
    const day = date.getDate();
    if (!groups.has(month)) groups.set(month, []);
    groups.get(month)!.push(day);
  }

  return [...groups.entries()]
    .map(([month, days]) => `${month} ${days.join(", ")}`)
    .join(" · ");
}

export function datesToIsoStrings(dates: Date[]): string[] {
  return [...dates]
    .sort((a, b) => a.getTime() - b.getTime())
    .map((d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    });
}

export function formatPauseDuration(dates: Date[]): string {
  if (!dates.length) return "";
  return datesToIsoStrings(dates).join(", ");
}

export function formatDatesFromStrings(dates: string[] | null | undefined): string {
  if (!dates?.length) return "—";
  return formatSelectedDatesLabel(
    dates.map((d) => new Date(d)).filter((d) => !Number.isNaN(d.getTime())),
  );
}

export type TemporaryAddressChangePayload = {
  temp_pick_address: string;
  temp_drop_address: string;
  temp_dates: string[];
};

export async function requestTemporaryAddressChange(
  studentId: number,
  payload: TemporaryAddressChangePayload,
): Promise<ParentServiceRequest> {
  const res = await authFetch(
    `/api/backend/temporary-address-change/${studentId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    const body = await parseJsonResponse<{ detail?: string }>(res).catch(
      () => null,
    );
    throw new Error(
      typeof body?.detail === "string"
        ? body.detail
        : "Failed to submit temporary address change",
    );
  }

  return parseJsonResponse<ParentServiceRequest>(res);
}

export async function requestPermanentAddressChange(
  studentId: number,
  newAddress: string,
): Promise<ParentServiceRequest> {
  const res = await authFetch(
    `/api/backend/permanent-address-change/${studentId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ new_address: newAddress }),
    },
  );

  if (!res.ok) {
    const body = await parseJsonResponse<{ detail?: string }>(res).catch(
      () => null,
    );
    throw new Error(
      typeof body?.detail === "string"
        ? body.detail
        : "Failed to submit permanent address change",
    );
  }

  return parseJsonResponse<ParentServiceRequest>(res);
}

export async function requestPauseService(
  studentId: number,
  pauseDuration: string,
): Promise<ParentServiceRequest> {
  const res = await authFetch(`/api/backend/pause-service/${studentId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pause_duration: pauseDuration }),
  });

  if (!res.ok) {
    const body = await parseJsonResponse<{ detail?: string }>(res).catch(
      () => null,
    );
    throw new Error(
      typeof body?.detail === "string"
        ? body.detail
        : "Failed to pause service",
    );
  }

  return parseJsonResponse<ParentServiceRequest>(res);
}
