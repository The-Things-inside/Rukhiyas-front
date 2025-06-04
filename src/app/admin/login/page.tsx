"use client";
import LoginForm from "../../../components/LoginForm";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (data: {
    emailOrMobile: string;
    password: string;
    stayLoggedIn: boolean;
  }) => {
    setLoading(true);
    setError("");

    // Check for admin credentials
    if (data.emailOrMobile === "admin@test.com" && data.password === "test") {
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        router.push("/admin/dashboard");
      }, 1200);
    } else {
      setLoading(false);
      setError("Invalid admin credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#19191F] flex flex-col items-center">
      <div className="w-full max-w-md mx-auto">
        <header className="w-full bg-[#14141B] px-4 py-3">
          <h1
            className="text-[20px] font-semibold text-white text-left"
            style={{
              fontFamily: "Spartan, sans-serif",
            }}
          >
            Admin Login
          </h1>
        </header>
        <div className="mt-2" />
        <LoginForm
          onSubmit={handleLogin}
          loading={loading}
          headerText="Log in to your admin panel"
          showSocialLogin={false}
          defaultEmail="admin@test.com"
          defaultPassword="test"
          error={error}
        />
      </div>
    </div>
  );
}
