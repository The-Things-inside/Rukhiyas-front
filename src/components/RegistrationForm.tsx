"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";

interface FormValues {
  fullName: string;
  mobile: string;
  email: string;
  password: string;
}

export default function RegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: FormValues) => {
    // Handle registration logic
    console.log(data);
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
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Full Name
        </label>
        <input
          {...register("fullName", { required: "Full name is required" })}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400"
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
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400"
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
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400"
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
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400 pr-10"
            placeholder="Create a password"
          />
          <button
            type="button"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
          >
            {showPassword ? (
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M1 1l22 22M17.94 17.94A10.94 10.94 0 0 1 12 19C7 19 2.73 15.11 1 12c.74-1.32 2.1-3.36 4.06-5.06M9.53 9.53A3 3 0 0 1 12 9c1.66 0 3 1.34 3 3 0 .47-.11.91-.29 1.29" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M2.05 12C3.81 7.61 7.86 5 12 5c4.14 0 8.19 2.61 9.95 7-1.76 4.39-5.81 7-9.95 7-4.14 0-8.19-2.61-9.95-7z" />
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
        className="w-full bg-[#d4a200] text-white font-semibold rounded-full py-3 text-lg shadow hover:bg-[#c49c00] transition mt-2"
      >
        Continue
      </button>
    </form>
  );
}
