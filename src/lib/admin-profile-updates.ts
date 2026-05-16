export type UpdateStudentDetailsPayload = {
  full_name: string;
  school_id: number;
  class_name: string;
  division: string;
  student_address: string;
  location_latitude: number;
  location_longitude: number;
};

export type UpdateParentDetailsInput = {
  full_name: string;
  mobile_no: string;
  email: string;
  alternative_mobile?: string;
  primary_address?: string;
};

/** API rejects empty strings for optional fields (e.g. alternative_mobile min 10 chars). */
export function buildParentUpdateBody(
  input: UpdateParentDetailsInput,
): Record<string, string> {
  const body: Record<string, string> = {
    full_name: input.full_name.trim(),
    mobile_no: input.mobile_no.trim(),
    email: input.email.trim(),
  };

  const alt = input.alternative_mobile?.trim();
  if (alt && alt.length >= 10) {
    body.alternative_mobile = alt;
  }

  const address = input.primary_address?.trim();
  if (address) {
    body.primary_address = address;
  }

  return body;
}

function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

async function parseError(res: Response): Promise<string> {
  const body = await res.json().catch(() => null);
  if (typeof body?.detail === "string") return body.detail;
  if (Array.isArray(body?.detail)) {
    return (
      body.detail
        .map((d: { msg?: string; loc?: (string | number)[] }) => {
          const field = d.loc?.filter((x) => typeof x === "string" && x !== "body").join(".");
          return field ? `${field}: ${d.msg}` : d.msg;
        })
        .filter(Boolean)
        .join(", ") || "Request failed"
    );
  }
  return "Request failed";
}

export async function updateStudentDetails(
  studentId: number,
  payload: UpdateStudentDetailsPayload,
  profilePictureFile?: File | null,
): Promise<unknown> {
  const token = getAdminToken();
  if (!token) throw new Error("No access token found");

  let res: Response;

  if (profilePictureFile) {
    const formData = new FormData();
    formData.append("full_name", payload.full_name);
    formData.append("school_id", String(payload.school_id));
    formData.append("class_name", payload.class_name);
    formData.append("division", payload.division);
    formData.append("student_address", payload.student_address);
    formData.append("location_latitude", String(payload.location_latitude));
    formData.append("location_longitude", String(payload.location_longitude));
    formData.append("profile_picture", profilePictureFile);

    res = await fetch(
      `/api/backend/admin/students/${studentId}/update-details`,
      {
        method: "PATCH",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );
  } else {
    res = await fetch(
      `/api/backend/admin/students/${studentId}/update-details`,
      {
        method: "PATCH",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );
  }

  if (!res.ok) throw new Error(await parseError(res));
  return res.json().catch(() => null);
}

export async function updateParentDetails(
  parentId: number,
  input: UpdateParentDetailsInput,
): Promise<unknown> {
  const token = getAdminToken();
  if (!token) throw new Error("No access token found");

  const body = buildParentUpdateBody(input);

  const res = await fetch(
    `/api/backend/admin/parents/${parentId}/update-details`,
    {
      method: "PATCH",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) throw new Error(await parseError(res));
  return res.json().catch(() => null);
}
