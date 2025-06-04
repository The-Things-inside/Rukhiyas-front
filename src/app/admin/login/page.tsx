"use client";
import LoginForm from "../../../components/LoginForm";
import { useState } from "react";

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);

  // Placeholder for actual admin login logic
  const handleLogin = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <div className="min-h-screen bg-[#19191F] flex flex-col items-center">
      <div className="w-full max-w-md mx-auto">
        <header className="w-full bg-[#14141B] px-4 py-3">
          <h1
            className="text-[20px] font-semibold text-white text-center"
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
        />
      </div>
    </div>
  );
}
