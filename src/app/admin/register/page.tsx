"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "../../../components/Loading";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation

    try {
      const response = await fetch("https://api.rukhiyastravels.com/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          full_name: formData.fullName,
          mobile_no: formData.phoneNumber,
          email: formData.email,
          password: formData.password,
          is_superadmin: false,
        }),
      });

      if (!response.ok) {
        // Try to parse error message from API
        let errorMsg = "Registration failed. Please try again.";
        try {
          const errorData = await response.json();
          if (errorData.detail && Array.isArray(errorData.detail)) {
            errorMsg = errorData.detail
              .map((d: { msg: string }) => d.msg)
              .join(", ");
          } else if (errorData.detail && typeof errorData.detail === "string") {
            errorMsg = errorData.detail;
          }
        } catch {
          // Ignore JSON parse errors
        }
        setError(errorMsg);
        setLoading(false);
        return;
      }

      // Success
      setLoading(false);
      setRegistrationSuccess(true);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
            Admin Registration
          </h1>
        </header>
        <div className="mt-2" />
        {registrationSuccess ? (
          <div className="bg-white rounded-t-3xl shadow-lg px-6 pt-8 pb-8 w-full max-w-md mx-auto flex flex-col gap-4 min-h-[calc(100vh-80px)] items-center justify-center">
            <h2
              className="text-[18px] text-black mb-2 leading-[28px] tracking-[0.02em] text-center font-medium"
              style={{
                fontFamily: "Spartan, sans-serif",
                letterSpacing: "0.02em",
              }}
            >
              Registration successful!
            </h2>
            <p className="text-gray-700 text-center mb-4">
              You can now log in with your credentials.
            </p>
            <button
              onClick={() => router.push("/admin/login")}
              className="w-full bg-[#f2c200] text-white font-semibold rounded-full py-3 text-lg shadow hover:bg-[#e6b800] transition flex items-center justify-center mb-1"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-t-3xl shadow-lg px-6 pt-8 pb-8 w-full max-w-md mx-auto flex flex-col gap-4 min-h-[calc(100vh-80px)]"
            autoComplete="off"
          >
            <div className="mb-2">
              <h2
                className="text-[18px] text-black mb-2 leading-[28px] tracking-[0.02em] text-left font-medium"
                style={{
                  fontFamily: "Spartan, sans-serif",
                  letterSpacing: "0.02em",
                }}
              >
                Create your admin account
              </h2>
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-900 mb-1"
              >
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="w-full border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400 text-[#000000] border-gray-300"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400 text-[#000000] border-gray-300"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-900 mb-1"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                className="w-full border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] bg-[#faf9f6] placeholder-gray-400 text-[#000000] border-gray-300"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
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
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f2c200] pr-12 bg-[#faf9f6] placeholder-gray-400 text-[#000000] border-gray-300"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
            </div>

            {error && <p className="text-[#E20020] text-sm mt-1">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#f2c200] text-white font-semibold rounded-full py-3 text-lg shadow hover:bg-[#e6b800] transition flex items-center justify-center mb-1"
              disabled={loading}
            >
              {loading ? <Loading size="sm" /> : "Register"}
            </button>

            <div className="text-center mt-4">
              <span className="inline-flex flex-nowrap items-baseline justify-center text-[#5C5C5C] text-[18px] leading-[22px] tracking-[0.02em] font-normal whitespace-nowrap">
                Already have an account?&nbsp;
                <button
                  onClick={() => router.push("/admin/login")}
                  className="text-[#f2c200] font-normal whitespace-nowrap leading-[22px] align-baseline"
                >
                  Log in
                </button>
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
