"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import React from "react";

interface FormValues {
  fullName: string;
  mobile: string;
  email: string;
  password: string;
}

interface RegistrationFormProps {
  onContinue: () => void;
}

export default function RegistrationForm({
  onContinue,
}: RegistrationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setApiError("");
    try {
      const response = await fetch("https://13.235.104.94/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          full_name: data.fullName,
          mobile_no: data.mobile,
          email: data.email,
          password: data.password,
        }),
      });
      if (response.status === 201) {
        setLoading(false);
        onContinue();
      } else {
        const errorData = await response.json();
        setApiError(
          errorData?.detail?.[0]?.msg ||
            errorData?.detail ||
            "Registration failed. Please try again."
        );
        setLoading(false);
      }
    } catch (err) {
      setApiError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="px-6 pt-2 flex flex-col gap-3"
    >
      <h2
        className="text-xl font-bold text-black text-center mt-2 mb-1"
        style={{ fontFamily: "Spartan, sans-serif" }}
      >
        Create An Account
      </h2>
      <div className="text-center text-gray-500 text-base mb-2">
        Already have an account?{" "}
        <a href="/login" className="text-[#d4a200] font-medium hover:underline">
          Log In
        </a>
      </div>
      {apiError && (
        <div className="text-red-500 text-center text-sm mb-2">{apiError}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Full Name
        </label>
        <input
          {...register("fullName", { required: "Full name is required" })}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400 text-black"
          placeholder="Enter your full name"
        />
        {errors.fullName && (
          <span className="text-xs text-red-500">
            {errors.fullName.message}
          </span>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Mobile Number
        </label>
        <input
          {...register("mobile", { required: "Mobile number is required" })}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400 text-black"
          placeholder="Enter your mobile number"
        />
        {errors.mobile && (
          <span className="text-xs text-red-500">{errors.mobile.message}</span>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Email
        </label>
        <input
          {...register("email", { required: "Email is required" })}
          type="email"
          inputMode="email"
          autoCapitalize="none"
          autoComplete="email"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400 text-black"
          placeholder="Enter your email"
        />
        {errors.email && (
          <span className="text-xs text-red-500">{errors.email.message}</span>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            {...register("password", { required: "Password is required" })}
            type={showPassword ? "text" : "password"}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400 text-black"
            placeholder="Enter your password"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <span className="text-xs text-red-500">
            {errors.password.message}
          </span>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-[#d4a200] text-white font-semibold rounded-full py-3 text-lg shadow hover:bg-[#c49c00] transition mt-2 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Registering..." : "Continue"}
      </button>
    </form>
  );
}
