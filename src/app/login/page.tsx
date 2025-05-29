"use client";
import LoginHeader from '../../components/LoginHeader';
import LoginForm from '../../components/LoginForm';
import { useState } from 'react';
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Placeholder for actual login logic
  const handleLogin = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <div className="min-h-screen bg-[#19191F] flex flex-col items-center">
      <div className="w-full max-w-md mx-auto">
        <LoginHeader onBack={() => router.back()} />
        <div className="mt-2" />
        <LoginForm onSubmit={handleLogin} loading={loading} />
      </div>
    </div>
  );
} 