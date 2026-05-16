import Image from "next/image";
import { useEffect, useState } from "react";
import { getAccessToken, parseJsonResponse } from "@/lib/auth-token";

interface RideStatus {
  id: number;
  bus_id: number;
  date: string;
  bus_start: string;
  bus_arrived_school: string;
  bus_departed_school: string;
  created_at: string;
}

interface Student {
  id: number;
  full_name: string;
  profile_picture_url: string | null;
  bus_id: number | null;
}

interface RideStatusCardProps {
  selectedStudent: Student | null;
  /** Resolved bus id (from student record or driver API). */
  busId?: number | null;
}

export default function RideStatusCard({
  selectedStudent,
  busId: busIdProp,
}: RideStatusCardProps) {
  const [rideStatus, setRideStatus] = useState<RideStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resolvedBusId =
    busIdProp ?? selectedStudent?.bus_id ?? null;

  useEffect(() => {
    if (!selectedStudent || !resolvedBusId) {
      setRideStatus(null);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      setRideStatus(null);

      const busId = resolvedBusId;

      try {
        const token = getAccessToken();
        const res = await fetch(`/api/backend/buses/${busId}/today`, {
          headers: {
            accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error("Failed to fetch ride status");
        const data = await parseJsonResponse<RideStatus>(res);
        if (!cancelled) setRideStatus(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch ride status",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedStudent, resolvedBusId]);

  if (!selectedStudent) {
    return (
      <div className="bg-white rounded-[20px] shadow-lg p-4 w-full mx-auto border border-gray-200 text-center text-gray-500">
        No student selected.
      </div>
    );
  }
  if (!resolvedBusId) {
    return null;
  }
  if (loading) {
    return (
      <div className="bg-white rounded-[20px] shadow-lg p-4 w-full mx-auto border border-gray-200 text-center text-gray-500">
        Loading ride status...
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-white rounded-[20px] shadow-lg p-4 w-full mx-auto border border-gray-200 text-center text-red-500">
        {error}
      </div>
    );
  }
  if (!rideStatus) {
    return (
      <div className="bg-white rounded-[20px] shadow-lg p-4 w-full mx-auto border border-gray-200 text-center text-gray-500">
        No ride status available for today.
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-[20px] shadow-lg p-4 w-full mx-auto border border-gray-200"
      style={{ boxShadow: "0 8px 32px 0 rgba(0,0,0,0.12)" }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-black text-[18px] font-semibold pt-2 pb-2"
          style={{ fontFamily: "Spartan, sans-serif" }}
        >
          Ride Status
        </span>
      </div>
      {/* Started */}
      <div className="flex items-center mb-2 gap-2">
        <Image src="/assets/homeicon.svg" alt="Started" width={28} height={28} />
        <span
          className="text-gray-700 text-base font-medium"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          Started
        </span>
        <span className="flex-1" />
        <span
          className="text-gray-700 text-base font-medium"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          {rideStatus.bus_start ? new Date(rideStatus.bus_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
        </span>
      </div>
      <div className="h-4 border-l-2 border-dotted border-gray-300 ml-[14px] mb-2" />
      {/* Arrived School */}
      <div className="flex items-center mb-2 gap-2">
        <Image src="/assets/school.svg" alt="Arrived School" width={28} height={28} />
        <span
          className="text-gray-700 text-base font-medium"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          Arrived School
        </span>
        <span className="flex-1" />
        <span
          className="text-gray-700 text-base font-medium"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          {rideStatus.bus_arrived_school ? new Date(rideStatus.bus_arrived_school).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
        </span>
      </div>
      <div className="h-4 border-l-2 border-dotted border-gray-300 ml-[14px] mb-2" />
      {/* Departed School */}
      <div className="flex items-center mb-2 gap-2">
        <Image src="/assets/homeicon.svg" alt="Departed School" width={28} height={28} />
        <span
          className="text-[#E8B600] text-base font-medium"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          Departed School
        </span>
        <span className="flex-1" />
        <span
          className="text-[#E8B600] text-base font-medium"
          style={{ fontFamily: "Satoshi, sans-serif" }}
        >
          {rideStatus.bus_departed_school ? new Date(rideStatus.bus_departed_school).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
        </span>
      </div>
    </div>
  );
}
