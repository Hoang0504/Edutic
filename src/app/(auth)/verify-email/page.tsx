'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthCard from '@/components/auth/AuthCard';
import AuthInput from '@/components/auth/AuthInput';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [storedCode, setStoredCode] = useState('');
  const [codeGenerationTime, setCodeGenerationTime] = useState<Date | null>(null);

  useEffect(() => {
    // Get verification data from localStorage
    const storedEmail = localStorage.getItem('verifyEmail');
    const storedVerificationCode = localStorage.getItem('verificationCode');
    const storedTime = localStorage.getItem('codeGenerationTime');
    
    if (storedEmail && storedVerificationCode && storedTime) {
      setEmail(storedEmail);
      setStoredCode(storedVerificationCode);
      setCodeGenerationTime(new Date(storedTime));
    } else {
      // If no verification data, redirect to register
      router.push('/register');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Verify code on frontend first
      if (!codeGenerationTime) {
        setError("No verification code generated");
        return;
      }

      const now = new Date();
      const expirationTime = new Date(codeGenerationTime.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours

      if (verificationCode !== storedCode) {
        setError("Verification code is incorrect!");
        return;
      }

      if (now > expirationTime) {
        setError("Verification code has expired!");
        return;
      }

      // If code is valid, call API to update user status
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      setIsVerified(true);
      
      // Clear stored verification data
      localStorage.removeItem('verifyEmail');
      localStorage.removeItem('verifyName');
      localStorage.removeItem('verificationCode');
      localStorage.removeItem('codeGenerationTime');
      
      setTimeout(() => {
        router.push('/login?message=Email verified successfully! Please sign in.');
      }, 2000);
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      // Generate new code
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      const newCodeGenerationTime = new Date();
      
      setStoredCode(newCode);
      setCodeGenerationTime(newCodeGenerationTime);
      setVerificationCode('');
      setError('');
      
      // Update localStorage
      localStorage.setItem('verificationCode', newCode);
      localStorage.setItem('codeGenerationTime', newCodeGenerationTime.toISOString());
      
      // Get user name from localStorage
      const userName = localStorage.getItem('verifyName') || 'User';
      
      // Send new verification email
      const templateParams = {
        email: email,
        name: userName,
        app_name: "Edutic",
        greeting: `Xin chào ${userName},`,
        main_message: "Đây là mã xác thực mới cho tài khoản Edutic của bạn.",
        code_label: "Mã xác thực của bạn là:",
        verification_code: newCode,
        additional_info: "Mã này sẽ hết hạn sau 24 giờ vì lý do bảo mật.",
        button_text: "Xác thực tài khoản",
        footer_message: "Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.",
        time: new Date().getFullYear()
      };

      const emailjs = (await import('@emailjs/browser')).default;
      
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      
      setError('');
      // Show success message temporarily
      setError('New verification code has been sent to your email.');
      setTimeout(() => setError(''), 3000);
      
    } catch (error) {
      setError('Failed to resend verification code. Please try again.');
    }
  };

  if (isVerified) {
    return (
      <AuthCard
        title="Email Verified!"
        subtitle="Your email has been verified successfully. Redirecting to login..."
      >
        <div className="text-center">
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Click here if you are not redirected
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Verify your email"
      subtitle={`Enter the verification code sent to ${email}`}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <AuthInput
          id="verificationCode"
          name="verificationCode"
          type="text"
          label="Verification code"
          required
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          error={error.includes('incorrect') || error.includes('expired') ? error : ''}
          placeholder="Enter 6-digit code"
          maxLength={6}
        />

        {error && !error.includes('incorrect') && !error.includes('expired') && (
          <div className={`text-sm ${error.includes('sent') ? 'text-green-600' : 'text-red-600'}`}>
            {error}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading || verificationCode.length !== 6}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              ${(isLoading || verificationCode.length !== 6) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>
        </div>

        <div className="text-sm text-center space-y-2">
          <button
            type="button"
            onClick={handleResendCode}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Resend verification code
          </button>
          <div>
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Back to register
            </Link>
          </div>
        </div>
      </form>
    </AuthCard>
  );
}