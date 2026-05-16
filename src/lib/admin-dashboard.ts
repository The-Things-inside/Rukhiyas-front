export type AdminRequest = {
  id: number;
  student_id: number;
  parent_id: number;
  request_type: string;
  status: string;
  current_data: string | null;
  requested_data: string | null;
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

export type AdminStudent = {
  id: number;
  parent_id: number;
  school_id: number;
  bus_id: number | null;
  bus_route: string | null;
  full_name: string;
  class_name: string;
  division: string;
  student_address: string;
  location_latitude: number;
  location_longitude: number;
  approximate_fees: number;
  actual_fees: number | null;
  profile_picture_url: string | null;
  is_submitted: boolean;
  is_paid: boolean;
  created_at: string;
};

export type DashboardCounts = {
  newRegistrations: number;
  busAssignments: number;
  parentRequests: number;
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

export async function fetchDashboardCounts(): Promise<DashboardCounts> {
  const headers = authHeaders();
  const [newRes, busRes, parentRes] = await Promise.all([
    fetch("/api/backend/admin/students/no-fees", { headers }),
    fetch("/api/backend/admin/students/unassigned", { headers }),
    fetch("/api/backend/admin/requests/pending", { headers }),
  ]);

  if (!newRes.ok) throw new Error(await parseError(newRes));
  if (!busRes.ok) throw new Error(await parseError(busRes));
  if (!parentRes.ok) throw new Error(await parseError(parentRes));

  const [newData, busData, parentData] = await Promise.all([
    newRes.json(),
    busRes.json(),
    parentRes.json(),
  ]);

  return {
    newRegistrations: Array.isArray(newData) ? newData.length : 0,
    busAssignments: Array.isArray(busData) ? busData.length : 0,
    parentRequests: Array.isArray(parentData) ? parentData.length : 0,
  };
}

export async function fetchNewRegistrations(): Promise<AdminStudent[]> {
  const res = await fetch("/api/backend/admin/students/no-fees", {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function fetchUnassignedStudents(): Promise<AdminStudent[]> {
  const res = await fetch("/api/backend/admin/students/unassigned", {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function fetchPendingRequests(): Promise<AdminRequest[]> {
  const res = await fetch("/api/backend/admin/requests/pending", {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function approveRequest(
  requestId: number,
  notes = "Approved",
): Promise<void> {
  const res = await fetch(`/api/backend/admin/requests/${requestId}/approve`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notes }),
  });
  if (!res.ok) throw new Error(await parseError(res));
}

export async function rejectRequest(
  requestId: number,
  notes = "Rejected",
): Promise<void> {
  const res = await fetch(`/api/backend/admin/requests/${requestId}/reject`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notes }),
  });
  if (!res.ok) throw new Error(await parseError(res));
}
