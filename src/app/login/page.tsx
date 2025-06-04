"use client";
import LoginHeader from '../../components/LoginHeader';
import LoginForm from '../../components/LoginForm';
import { useState } from 'react';
import { useRouter } from "next/navigation";

export default function LoginPage() {
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

    // Check for parent credentials
    if (data.emailOrMobile === "test@test.com" && data.password === "test") {
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        router.push("/app");
      }, 1200);
    } else {
      setLoading(false);
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#19191F] flex flex-col items-center">
      <div className="w-full max-w-md mx-auto">
        <LoginHeader onBack={() => router.back()} />
        <div className="mt-2" />
        <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
      </div>
    </div>
  );
} 