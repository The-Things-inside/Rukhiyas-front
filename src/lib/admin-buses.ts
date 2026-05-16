export type AdminBus = {
  id: number;
  reg_no: string;
  model: string;
  capacity: number;
  driver_name: string;
  driver_phonenumber: string | null;
  route: string;
  driver_photo_url: string | null;
  on_duty: boolean;
  total_occupancy: number;
};

function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

function authHeaders(): HeadersInit {
  const token = getAdminToken();
  if (!token) throw new Error("No access token found");
  return {
    accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function parseError(res: Response): Promise<string> {
  const body = await res.json().catch(() => null);
  if (typeof body?.detail === "string") return body.detail;
  if (Array.isArray(body?.detail)) {
    return (
      body.detail
        .map((d: { msg?: string }) => d.msg)
        .filter(Boolean)
        .join(", ") || "Request failed"
    );
  }
  return "Request failed";
}

export type BusTodayHistory = {
  id: number;
  bus_id: number;
  date: string;
  bus_start: string | null;
  bus_arrived_school: string | null;
  bus_departed_school: string | null;
  created_at: string;
};

/** GET /admin/buses */
export async function fetchAdminBuses(): Promise<AdminBus[]> {
  const res = await fetch("/api/backend/admin/buses", {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

/** GET /buses/{bus_id}/today */
export async function fetchBusTodayHistory(
  busId: number,
): Promise<BusTodayHistory | null> {
  const res = await fetch(`/api/backend/buses/${busId}/today`, {
    headers: authHeaders(),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/** POST /buses/{bus_id}/start */
export async function recordBusStart(busId: number): Promise<BusTodayHistory> {
  const res = await fetch(`/api/backend/buses/${busId}/start`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/** POST /buses/{bus_id}/arrived-school */
export async function recordBusArrivedSchool(
  busId: number,
): Promise<BusTodayHistory> {
  const res = await fetch(`/api/backend/buses/${busId}/arrived-school`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/** POST /buses/{bus_id}/departed-school */
export async function recordBusDepartedSchool(
  busId: number,
): Promise<BusTodayHistory> {
  const res = await fetch(`/api/backend/buses/${busId}/departed-school`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export type CreateBusInput = {
  reg_no: string;
  model: string;
  capacity: number;
  driver_name?: string;
  driver_phonenumber?: string;
  route?: string;
  driver_photo?: File | null;
};

/** POST /buses/ */
export async function createBus(input: CreateBusInput): Promise<AdminBus> {
  const formData = new FormData();
  formData.append("reg_no", input.reg_no);
  formData.append("model", input.model);
  formData.append("capacity", String(input.capacity));
  if (input.driver_name?.trim()) {
    formData.append("driver_name", input.driver_name.trim());
  }
  if (input.driver_phonenumber?.trim()) {
    formData.append("driver_phonenumber", input.driver_phonenumber.trim());
  }
  if (input.route?.trim()) {
    formData.append("route", input.route.trim());
  }
  if (input.driver_photo) {
    formData.append("driver_photo", input.driver_photo);
  }

  const token = getAdminToken();
  if (!token) throw new Error("No access token found");

  const res = await fetch("/api/backend/buses/", {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/** DELETE /buses/bus/{bus_id} */
export async function deleteBus(busId: number): Promise<void> {
  const res = await fetch(`/api/backend/buses/bus/${busId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseError(res));
}

export function formatBusEventTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
