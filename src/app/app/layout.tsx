"use client";

import { useEffect } from "react";
import { getAccessToken, handleSessionExpired } from "@/lib/auth-token";

export default function AppSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!getAccessToken()) {
      handleSessionExpired();
    }
  }, []);

  return children;
}
