"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import AuthInput from "@/components/auth/AuthInput";
import GoogleSignIn from "@/components/auth/GoogleSignIn";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoggedIn } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Redirect if already logged in
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     router.push("/");
  //   }
  // }, [isLoggedIn, router]);

  useEffect(() => {
    const message = searchParams?.get("message");
    if (message) {
      setSuccessMessage(message);
    }
  }, [searchParams]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Check if it's an email verification error
        if (data.data?.emailNotVerified) {
          setErrors({
            submit: `${data.data.message}. `,
            emailNotVerified: "true",
          });
          // Store email for potential resend
          localStorage.setItem("verifyEmail", data.data.email);
        } else {
          setErrors({
            submit: data.data?.message || data.message || "Login failed",
          });
        }
        return;
      }

      // Success - use the login function from context
      if (data.success && data.data.token && data.data.user) {
        login(data.data.token, data.data.user);
      } else {
        setErrors({ submit: "Login response is missing required data" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ submit: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleSuccess = (response: any) => {
    setSuccessMessage("Đăng nhập Google thành công!");
  };

  const handleGoogleError = (error: any) => {
    setErrors({ submit: error.data?.message || "Đăng nhập Google thất bại" });
  };

  // Show loading if already logged in (will redirect)
  if (isLoggedIn) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <AuthCard title="Sign in to your account">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {successMessage && (
          <div className="text-green-600 text-sm bg-green-50 border border-green-200 rounded-md px-3 py-2">
            {successMessage}
          </div>
        )}

        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email address"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <AuthInput
          id="password"
          name="password"
          type="password"
          label="Password"
          autoComplete="current-password"
          required
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link
              href="/forgot-password"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {errors.submit && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {errors.submit}
            {errors.emailNotVerified && (
              <Link
                href="/verify-email"
                className="ml-1 font-medium text-indigo-600 hover:text-indigo-500 underline"
              >
                Click here to verify your email
              </Link>
            )}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </div>

        <div className="text-sm text-center">
          <Link
            href="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Do not have an account? Sign up
          </Link>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign In */}
        <GoogleSignIn
          type="login"
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />
      </form>
    </AuthCard>
  );
}
