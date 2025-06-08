"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import emailjs from "@emailjs/browser";
import AuthCard from "@/components/auth/AuthCard";
import AuthInput from "@/components/auth/AuthInput";

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

  const sendVerificationEmail = async (
    email: string,
    name: string,
    verificationToken: string
  ) => {
    try {
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          email: email,
          name: name,
          to_name: name,
          verification_code: verificationToken,
          app_name: "Edutic",
          Edutic: "Edutic",
          time: new Date().toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
          email_type: "registration",
          subject: "Welcome to Edutic - Verify Your Account",
          greeting: `Welcome to Edutic, ${name}!`,
          main_message: "Thank you for creating an account with Edutic. To complete your registration and start your TOEIC learning journey, please verify your email address.",
          action_text: "verify your account",
          code_label: "Your verification code is:",
          footer_message: "If you didn't create an account with Edutic, please ignore this email.",
          additional_info: "This code will expire in 1 hour for security reasons."
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      console.log(" Email sent successfully:", result);
      return true;
    } catch (error) {
      console.error(" Failed to send verification email:", error);
      return false;
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
        setErrors({ submit: data.message });
        return;
      }

      if (data.verificationToken) {
        const emailSent = await sendVerificationEmail(
          formData.email,
          formData.name,
          data.verificationToken
        );

        if (emailSent) {
          console.log("Verification email sent successfully");
        } else {
          console.log(
            " Failed to send verification email, but registration was successful"
          );
        }
      } else {
        console.log("⚠️ No verification token received from server");
      }

      sessionStorage.setItem("registrationEmail", formData.email);
      sessionStorage.setItem("registrationName", formData.name);

      router.push("/verify-email");
    } catch (error) {
      console.error(" Registration error:", error);
      setErrors({ submit: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <AuthCard
      title="Create your account"
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
          <div className="text-red-600 text-sm">{errors.submit}</div>
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
      </form>
    </AuthCard>
  );
}
