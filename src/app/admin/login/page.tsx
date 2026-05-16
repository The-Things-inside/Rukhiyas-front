"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Legacy route — unified login at /login handles admin and parent roles. */
export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return null;
}
