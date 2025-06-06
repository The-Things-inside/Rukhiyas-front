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

    try {
      const formData = new URLSearchParams();
      formData.append("grant_type", "");
      formData.append("username", data.emailOrMobile);
      formData.append("password", data.password);
      formData.append("scope", "");
      formData.append("client_id", "");
      formData.append("client_secret", "");

      const response = await fetch("https://13.235.104.94/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accept: "application/json",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData?.detail?.[0]?.msg ||
            errorData?.detail ||
            "Invalid credentials or server error"
        );
        setLoading(false);
        return;
      }

      const result = await response.json();
      if (result.access_token) {
        if (data.stayLoggedIn) {
          localStorage.setItem("access_token", result.access_token);
        }
        setLoading(false);
        router.push("/admin/dashboard");
      } else {
        setError("Login failed: No access token returned");
        setLoading(false);
      }
    } catch {
      setError("Network or server error");
      setLoading(false);
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
          defaultEmail=""
          defaultPassword=""
          error={error}
          registerLink="/admin/register"
        />
      </div>
    </div>
  );
}
