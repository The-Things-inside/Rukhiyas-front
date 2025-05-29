"use client";
import ParentRegistration from "../../components/ParentRegistration";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  return <ParentRegistration onBack={() => router.back()} />;
}
