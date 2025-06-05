"use client";
import AdminLayout from "@/components/AdminLayout";
import HomeContent from "./HomeContent";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decodeJWT } from "@/lib/utils";

export default function AdminDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    const payload = decodeJWT(token);
    if (payload && payload.is_admin) {
      setAuthorized(true);
    } else {
      localStorage.removeItem("access_token");
      router.replace("/admin/login");
    }
    setChecked(true);
  }, [router]);

  if (!checked) return null;
  if (!authorized) return null;

  return (
    <AdminLayout>
      <HomeContent />
    </AdminLayout>
  );
}
