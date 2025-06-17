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
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeGenerationTime, setCodeGenerationTime] = useState<Date | null>(null);

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
          additional_info: "This code will expire in 30 minutes for security reasons."
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      console.log("Email sent successfully:", result);
      return true;
    } catch (error) {
      console.error("Failed to send verification email:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // First, create user in database
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

      // Generate verification code and send email
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setCodeGenerationTime(new Date());

      const emailSent = await sendVerificationEmail(
        formData.email,
        formData.name,
        code
      );

      if (emailSent) {
        console.log("Verification email sent successfully");
        setStep('verify');
      } else {
        setErrors({ submit: "Failed to send verification email. Please try again." });
      }

    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ submit: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!codeGenerationTime) {
      setErrors({ verify: "No verification code generated" });
      return;
    }

    const now = new Date();
    const expirationTime = new Date(codeGenerationTime.getTime() + 30 * 60000); // Add 30 minutes

    if (verificationCode !== generatedCode) {
      setErrors({ verify: "Verification code is incorrect!" });
      return;
    }

    if (now > expirationTime) {
      setErrors({ verify: "Verification code has expired!" });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Verify email in database
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ verify: data.message });
        return;
      }

      console.log("Email verified successfully");
      router.push("/login?message=Registration successful! Please sign in.");
    } catch (error) {
      console.error("Verification error:", error);
      setErrors({ verify: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResendCode = async () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setCodeGenerationTime(new Date());
    setVerificationCode('');
    setErrors({});

    const emailSent = await sendVerificationEmail(
      formData.email,
      formData.name,
      code
    );

    if (!emailSent) {
      setErrors({ verify: "Failed to send verification email. Please try again." });
    }
  };

  if (step === 'verify') {
    return (
      <AuthCard
        title="Verify your email"
        subtitle={`We've sent a verification code to ${formData.email}`}
      >
        <div className="mb-6 p-4 bg-blue-50 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Check your email
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  We've sent a 6-digit verification code to <strong>{formData.email}</strong>. 
                  Please enter the code below to verify your account.
                </p>
                <p className="mt-1 text-xs">
                  The code will expire in 30 minutes.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <AuthInput
            id="verificationCode"
            name="verificationCode"
            type="text"
            label="Verification code"
            required
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            error={errors.verify}
            placeholder="Enter 6-digit code"
            maxLength={6}
          />

          <div>
            <button
              type="button"
              onClick={handleVerify}
              disabled={isLoading || verificationCode.length !== 6}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                ${(isLoading || verificationCode.length !== 6) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          </div>

          <div className="text-sm text-center space-y-2">
            <div>
              <button
                type="button"
                onClick={handleResendCode}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Resend verification code
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => setStep('register')}
                className="font-medium text-gray-600 hover:text-gray-500"
              >
                Back to registration
              </button>
            </div>
          </div>
        </div>
      </AuthCard>
    );
  }

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
