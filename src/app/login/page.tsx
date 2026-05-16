"use client";

import LoginHeader from "../../components/LoginHeader";
import LoginForm from "../../components/LoginForm";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { parseJsonResponse } from "@/lib/auth-token";

type LoginResponse = {
  access_token?: string;
  user?: {
    user_id?: number;
    role?: string;
    is_admin?: boolean;
  };
};

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

    const username = data.emailOrMobile.trim().replace(/\s+/g, "");
    if (!username || !data.password) {
      setError("Please enter your email or mobile number and password.");
      setLoading(false);
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("grant_type", "");
      formData.append("username", username);
      formData.append("password", data.password);
      formData.append("scope", "");
      formData.append("client_id", "");
      formData.append("client_secret", "");

      const response = await fetch("/api/backend/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accept: "application/json",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await parseJsonResponse<{
          detail?: string | { msg?: string }[];
        }>(response).catch(() => null);
        const detail = errorData?.detail;
        const message = Array.isArray(detail) ? detail[0]?.msg : detail;
        setError(
          message === "Invalid Credentials"
            ? "Invalid email/mobile or password."
            : message || "Invalid email/mobile or password.",
        );
        setLoading(false);
        return;
      }

      const result = await parseJsonResponse<LoginResponse>(response);

      if (result.access_token) {
        localStorage.setItem("access_token", result.access_token);
        if (result.user?.user_id != null) {
          localStorage.setItem("parent_id", String(result.user.user_id));
        }

        if (result.user?.role === "admin" || result.user?.is_admin) {
          router.push("/admin/dashboard");
        } else {
          router.push("/app");
        }
      } else {
        setError("Login failed: No access token returned");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loginFormProps = {
    onSubmit: handleLogin,
    loading,
    error,
    showSocialLogin: true as const,
    defaultEmail: "",
    defaultPassword: "",
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex min-h-screen bg-white flex-col items-center justify-center">
        <div className="flex w-[1100px] h-[700px] rounded-[32px] overflow-hidden shadow-2xl relative">
          <div
            className="relative flex-1 bg-cover bg-center flex flex-col justify-between p-8"
            style={{ backgroundImage: "url(/assets/login-bg.jpg)" }}
          >
            <div className="flex justify-start">
              <Image
                src="/assets/logo.svg"
                alt="RUKHIYAS Logo"
                width={120}
                height={60}
              />
            </div>
            <div className="mb-8">
              <span
                className="text-[#F2C100] text-3xl font-bold"
                style={{ fontFamily: "Spartan, sans-serif" }}
              >
                Log in to view your child&apos;s
                <br />
                transport details and account info
              </span>
            </div>
          </div>
          <div className="flex-1 bg-white flex flex-col justify-center items-center relative p-16">
            <button
              type="button"
              className="absolute top-6 right-6 text-2xl text-gray-400 hover:text-black"
              aria-label="Close"
              onClick={() => router.back()}
            >
              &times;
            </button>
            <div className="w-full">
              <h2
                className="text-[40px] font-bold text-center mb-2 mt-2"
                style={{ fontFamily: "Spartan, sans-serif", lineHeight: "1.1" }}
              >
                Log in
              </h2>
              <div
                className="text-center text-[#A0A0A0] mb-8 text-lg font-normal"
                style={{ fontFamily: "Spartan, sans-serif" }}
              >
                Don&apos;t have an account?{" "}
                <span
                  className="text-[#F2C100] font-semibold cursor-pointer hover:underline"
                  onClick={() => router.push("/register")}
                >
                  Register
                </span>
              </div>
              <LoginForm {...loginFormProps} headerText="" variant="desktop" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden min-h-screen bg-[#19191F] flex flex-col items-center justify-center">
        <div className="w-full max-w-md mx-auto">
          <LoginHeader onBack={() => router.back()} />
          <div className="mt-2" />
          <LoginForm {...loginFormProps} variant="mobile" />
        </div>
      </div>
    </>
  );
}
