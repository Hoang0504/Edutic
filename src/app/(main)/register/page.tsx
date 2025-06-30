"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import AuthInput from "@/components/auth/AuthInput";
import GoogleSignIn from "@/components/auth/GoogleSignIn";
import emailjs from '@emailjs/browser';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendVerificationEmail = async (verificationCode: string, userEmail: string, userName: string) => {
    try {
      const templateParams = {
        email: userEmail,
        name: userName,
        app_name: "Edutic",
        greeting: `Xin chào ${userName},`,
        main_message: "Chào mừng bạn đến với Edutic! Vui lòng sử dụng mã xác thực dưới đây để hoàn tất việc đăng ký tài khoản của bạn.",
        code_label: "Mã xác thực của bạn là:",
        verification_code: verificationCode,
        additional_info: "Mã này sẽ hết hạn sau 24 giờ vì lý do bảo mật.",
        button_text: "Xác thực tài khoản",
        footer_message: "Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.",
        time: new Date().getFullYear()
      };

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      console.log('Verification email sent successfully');
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ submit: data.data?.message || data.message });
        return;
      }

      // Generate verification code and store it with timestamp
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const codeGenerationTime = new Date();
      
      // Store verification data in localStorage
      localStorage.setItem('verifyEmail', formData.email);
      localStorage.setItem('verifyName', formData.name);
      localStorage.setItem('verificationCode', verificationCode);
      localStorage.setItem('codeGenerationTime', codeGenerationTime.toISOString());

      // Send verification email
      try {
        await sendVerificationEmail(
          verificationCode,
          formData.email,
          formData.name
        );
        
        setVerificationSent(true);
        
        // Redirect to verify email page after 2 seconds
        setTimeout(() => {
          router.push('/verify-email');
        }, 2000);
      } catch (emailError) {
        setErrors({ submit: "Account created but failed to send verification email. Please contact support." });
      }

    } catch (error) {
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
    // Google signup success - user is already logged in via AuthContext
    console.log("Google signup successful:", response);
  };

  const handleGoogleError = (error: any) => {
    setErrors({ submit: error.data?.message || "Đăng ký Google thất bại" });
  };

  if (verificationSent) {
    return (
      <AuthCard
        title="Check your email"
        subtitle="We've sent you a verification code. Please check your email to verify your account."
      >
        <div className="text-center">
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Return to login
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Already have an account? Sign in"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <AuthInput
          id="name"
          name="name"
          type="text"
          label="Full name"
          autoComplete="name"
          required
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />

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
          autoComplete="new-password"
          required
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <AuthInput
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm password"
          autoComplete="new-password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        {errors.submit && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {errors.submit}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </div>

        <div className="text-sm text-center">
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Already have an account? Sign in
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
          type="register"
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />
      </form>
    </AuthCard>
  );
}
