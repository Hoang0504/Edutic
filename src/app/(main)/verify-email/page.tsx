
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthCard from '@/components/auth/AuthCard';
import AuthInput from '@/components/auth/AuthInput';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: verificationCode })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      setIsVerified(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
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
      subtitle="Enter the verification code sent to your email"
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
          error={error}
          placeholder="Enter 6-digit code"
          maxLength={6}
        />

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

        <div className="text-sm text-center">
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Back to login
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}