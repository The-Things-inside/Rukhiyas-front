"use client";
import LoginHeader from '../../components/LoginHeader';
import LoginForm from '../../components/LoginForm';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";

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
        // Store token if stay logged in is checked
        if (data.stayLoggedIn) {
          localStorage.setItem("access_token", result.access_token);
        }

        // Handle role-based routing
        if (result.user.role === "admin" || result.user.is_admin) {
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

  // Desktop modal layout
  return (
    <div className="min-h-screen bg-[#19191F] flex flex-col items-center justify-center md:bg-[#fff]">
      {/* Desktop Modal */}
      <div className="hidden md:flex w-[1100px] h-[700px] rounded-[32px] overflow-hidden shadow-2xl relative">
        {/* Left: Image, Logo, Text */}
        <div
          className="relative flex-1 bg-cover bg-center flex flex-col justify-between p-8"
          style={{ backgroundImage: "url(/assets/login-bg.jpg)" }}
        >
          {/* Logo */}
          <div className="flex justify-start">
            <Image
              src="/assets/logo.svg"
              alt="RUKHIYAS Logo"
              width={120}
              height={60}
            />
          </div>
          {/* Text */}
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
        {/* Right: Login Form */}
        <div className="flex-1 bg-white flex flex-col justify-center items-center relative p-16">
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 text-2xl text-gray-400 hover:text-black"
            aria-label="Close"
            onClick={() => router.back()}
          >
            &times;
          </button>
          <div className="w-full ">
            {/* Title and Register link */}
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
            <LoginForm
              onSubmit={handleLogin}
              loading={loading}
              error={error}
              showSocialLogin={true}
              headerText=""
              defaultEmail=""
              defaultPassword=""
            />
          </div>
        </div>
      </div>
      {/* Mobile Layout (unchanged) */}
      <div className="w-full max-w-md mx-auto md:hidden">
        <LoginHeader onBack={() => router.back()} />
        <div className="mt-2" />
        <LoginForm
          onSubmit={handleLogin}
          loading={loading}
          error={error}
          defaultEmail=""
          defaultPassword=""
        />
      </div>
    </div>
  );
} 