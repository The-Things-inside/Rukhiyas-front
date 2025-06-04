"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Loading from "./Loading";

interface LoginFormProps {
  onSubmit?: (data: {
    emailOrMobile: string;
    password: string;
    stayLoggedIn: boolean;
  }) => void;
  loading?: boolean;
  headerText?: string;
  descriptionText?: string;
  showSocialLogin?: boolean;
}

export default function LoginForm({
  onSubmit,
  loading,
  headerText = "Log in to view your child's transport details and account info",
  showSocialLogin = true,
}: LoginFormProps) {
  const [emailOrMobile, setEmailOrMobile] = useState("test@test.com");
  const [password, setPassword] = useState("test");
  const [showPassword, setShowPassword] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(true);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [shakePassword, setShakePassword] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailOrMobile(value);
    if (value.includes("@")) {
      setEmailError(!validateEmail(value));
    } else {
      setEmailError(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Hardcoded credentials check
    if (emailOrMobile === "test@test.com" && password === "test") {
      if (onSubmit) {
        onSubmit({ emailOrMobile, password, stayLoggedIn });
      }
      // Navigate to app home
      router.push("/app");
    } else {
      setPasswordError(true);
      setShakePassword(true);
      setTimeout(() => setShakePassword(false), 500);
    }
  };

  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/register");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-t-3xl shadow-lg px-6 pt-8 pb-8 w-full max-w-md mx-auto flex flex-col gap-4 min-h-[calc(100vh-80px)]"
      autoComplete="off"
    >
      <div className="mb-2">
        <h2
          className="text-[18px] text-black mb-2 leading-[28px] tracking-[0.02em] text-left font-medium"
          style={{ fontFamily: "Spartan, sans-serif", letterSpacing: "0.02em" }}
        >
          {headerText}
          <br />
        </h2>
      </div>
      <div>
        <label
          htmlFor="emailOrMobile"
          className="block text-sm font-medium text-gray-900 mb-1"
        >
          Email or Mobile Number
        </label>
        <input
          id="emailOrMobile"
          type="text"
          inputMode="email"
          autoComplete="off"
          autoCapitalize="none"
          className={`w-full border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400 text-[#000000] ${
            emailError ? "border-[#E20020]" : "border-gray-300"
          }`}
          placeholder="Enter email or mobile number"
          value={emailOrMobile}
          onChange={handleEmailChange}
          required
        />
        {emailError && (
          <p
            className="mt-1 ml-3 text-[14px] leading-[22px] tracking-[0.02em] font-light"
            style={{
              fontFamily: "Satoshi, sans-serif",
              height: "22px",
              color: "#E20020",
            }}
          >
            Please provide a valid email
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-900 mb-1"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="off"
            className={`w-full border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] pr-12 bg-[#faf9f6] placeholder-gray-400 text-[#000000] ${
              passwordError ? "border-[#E20020]" : "border-gray-300"
            } ${shakePassword ? "animate-shake" : ""}`}
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(false);
            }}
            required
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            tabIndex={-1}
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
        {passwordError && (
          <p
            className="mt-1 ml-3 text-[14px] leading-[22px] tracking-[0.02em] font-light"
            style={{
              fontFamily: "Satoshi, sans-serif",
              height: "22px",
              color: "#E20020",
            }}
          >
            Incorrect password
          </p>
        )}
      </div>
      <div className="flex justify-start items-center text-sm mb-2 -mt-2">
        <a
          href="#"
          className="text-[#5E5E5E] text-sm leading-[100%] tracking-[0%] font-light underline  underline-offset-2"
          style={{
            fontFamily: "Satoshi, sans-serif",
            width: "165px",
            height: "19px",
            display: "inline-block",
          }}
        >
          Forgotten your password?
        </a>
      </div>
      <button
        type="submit"
        className="w-full bg-[#f2c200] text-white font-semibold rounded-full py-3 text-lg shadow hover:bg-[#e6b800] transition flex items-center justify-center mb-1"
        disabled={loading}
      >
        {loading ? <Loading size="sm" /> : "Continue"}
      </button>
      <div className="flex items-center justify-center gap-2 mb-2">
        <input
          id="stayLoggedIn"
          type="checkbox"
          checked={stayLoggedIn}
          onChange={(e) => setStayLoggedIn(e.target.checked)}
          className="accent-[#19191F] w-4 h-4 rounded focus:ring-[#f2c200]"
        />
        <label
          htmlFor="stayLoggedIn"
          className="text-sm text-gray-700 select-none cursor-pointer"
        >
          Stay logged in on this device
        </label>
      </div>
      {showSocialLogin && (
        <>
          <div className="flex items-center justify-center text-gray-400 text-sm my-1">
            <span className="border-t border-gray-200 flex-1" />
            <span className="px-3">or log in with</span>
            <span className="border-t border-gray-200 flex-1" />
          </div>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border-2 border-[#f2c200] rounded-full py-2.5 text-base font-medium text-gray-900 bg-white hover:bg-[#fffbe6] transition mb-2"
          >
            <Image src="/google-logo.svg" alt="Google" width={24} height={24} />
            <span
              className="text-[18px] leading-[100%] tracking-[0%] font-medium text-[#3C3C3C]"
              style={{
                fontFamily: "Satoshi, sans-serif",
                display: "inline-block",
              }}
            >
              Google
            </span>
          </button>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border-2 border-[#f2c200] rounded-full py-2.5 text-base font-medium text-gray-900 bg-white hover:bg-[#fffbe6] transition"
          >
            <Image src="/apple-logo.svg" alt="Apple" width={20} height={20} />
            <span
              className="text-[18px] leading-[100%] tracking-[0%] font-medium text-[#3C3C3C]"
              style={{
                fontFamily: "Satoshi, sans-serif",
                display: "inline-block",
              }}
            >
              Apple
            </span>
          </button>
        </>
      )}
      <div className="text-center mt-4">
        <span className="inline-flex flex-nowrap items-baseline justify-center text-[#5C5C5C] text-[18px] leading-[22px] tracking-[0.02em] font-normal whitespace-nowrap">
          Don&apos;t have an account?&nbsp;
          <a
            href="#"
            onClick={handleRegister}
            className="text-[#f2c200] font-normal whitespace-nowrap leading-[22px] align-baseline"
          >
            Register
          </a>
        </span>
      </div>
    </form>
  );
}
