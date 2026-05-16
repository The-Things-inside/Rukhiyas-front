"use client";

import { useEffect, useState } from "react";
import {
  fetchStudentDriver,
  type StudentDriver,
} from "@/lib/student-driver";

export function useStudentDriver(studentId: number | null | undefined) {
  const [driver, setDriver] = useState<StudentDriver | null>(null);
  const [loading, setLoading] = useState(false);
  const [noBus, setNoBus] = useState(false);

  useEffect(() => {
    if (!studentId) {
      setDriver(null);
      setNoBus(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setNoBus(false);
    setDriver(null);

    fetchStudentDriver(studentId)
      .then(({ driver: d, noBus: nb }) => {
        if (cancelled) return;
        setDriver(d);
        setNoBus(nb);
      })
      .catch(() => {
        if (!cancelled) {
          setDriver(null);
          setNoBus(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [studentId]);

  return {
    driver,
    loading,
    noBus,
    busId: driver?.bus_id ?? null,
  };
}
