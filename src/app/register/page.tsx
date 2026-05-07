"use client";
import ParentRegistration from "../../components/ParentRegistration";
import { useRouter } from "next/navigation";
import RegisterPageView from "@/components/register/RegisterPageView";

export default function RegisterPage() {
  const router = useRouter();
  return (
    <>
      {/* Desktop (new design) */}
      <div className="hidden md:block">
        <RegisterPageView onBack={() => router.back()} />
      </div>

      {/* Mobile (unchanged existing flow) */}
      <div className="md:hidden">
        <ParentRegistration onBack={() => router.back()} />
      </div>
    </>
  );
}
