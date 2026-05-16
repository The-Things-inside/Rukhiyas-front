import { authFetch, parseJsonResponse } from "@/lib/auth-token";

export type StudentDriver = {
  bus_id: number;
  reg_no: string;
  model: string;
  route: string;
  on_duty: boolean;
  driver_name: string;
  driver_phonenumber: string;
  driver_photo_url: string | null;
};

export type StudentDriverResult = {
  driver: StudentDriver | null;
  noBus: boolean;
};

type CacheEntry = StudentDriverResult & { ts: number };

const CACHE_TTL_MS = 30_000;
const cache = new Map<number, CacheEntry>();
const inflight = new Map<number, Promise<StudentDriverResult>>();

export async function fetchStudentDriver(
  studentId: number,
): Promise<StudentDriverResult> {
  const cached = cache.get(studentId);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return { driver: cached.driver, noBus: cached.noBus };
  }

  let request = inflight.get(studentId);
  if (!request) {
    request = (async () => {
      try {
        const res = await authFetch(`/api/backend/students/${studentId}/driver`);

        if (res.status === 404) {
          return { driver: null, noBus: true };
        }

        if (!res.ok) {
          return { driver: null, noBus: true };
        }

        const driver = await parseJsonResponse<StudentDriver>(res);
        return { driver, noBus: false };
      } catch {
        return { driver: null, noBus: true };
      }
    })().finally(() => {
      inflight.delete(studentId);
    });

    inflight.set(studentId, request);
  }

  const result = await request;
  cache.set(studentId, { ...result, ts: Date.now() });
  return result;
}

export function clearStudentDriverCache(studentId?: number) {
  if (studentId != null) {
    cache.delete(studentId);
    inflight.delete(studentId);
    return;
  }
  cache.clear();
  inflight.clear();
}
