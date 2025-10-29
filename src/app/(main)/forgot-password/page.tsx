'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthCard from '@/components/auth/AuthCard';
import AuthInput from '@/components/auth/AuthInput';
import emailjs from '@emailjs/browser';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    token: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeGenerationTime, setCodeGenerationTime] = useState<Date | null>(null);

  const validateEmailForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateResetForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.token) newErrors.token = 'Verification token is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Password confirmation is required';
    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendResetEmail = async (resetToken: string, userEmail: string, userName: string) => {
    try {
      const templateParams = {
        email: userEmail,
        name: userName,
        app_name: "Edutic",
        greeting: `Xin chào ${userName},`,
        main_message: "Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản Edutic của bạn. Vui lòng sử dụng mã xác thực dưới đây để đặt lại mật khẩu.",
        code_label: "Mã đặt lại mật khẩu của bạn là:",
        verification_code: resetToken,
        additional_info: "Mã này sẽ hết hạn sau 30 phút vì lý do bảo mật.",
        button_text: "Đặt lại mật khẩu",
        footer_message: "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.",
        time: new Date().getFullYear()
      };

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      console.log('Reset email sent successfully');
    } catch (error) {
      console.error('Failed to send reset email:', error);
      throw error;
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmailForm()) return;

    setIsLoading(true);
    setErrors({});
    setMessage('');

    try {
      // Request reset token from server
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request', email })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ submit: data.message || 'Failed to send reset email' });
        return;
      }

      // If we have a reset token, send the email and store it
      if (data.resetToken) {
        try {
          // Generate our own code for frontend verification
          const code = Math.floor(100000 + Math.random() * 900000).toString();
          setGeneratedCode(code);
          setCodeGenerationTime(new Date());
          
          await sendResetEmail(code, data.email, data.name);
          setMessage('Reset code has been sent to your email. Please check your inbox.');
          setStep('reset');
        } catch (emailError) {
          setErrors({ submit: 'Reset code generated but failed to send email. Please try again.' });
        }
      } else {
        setMessage(data.message);
      }

    } catch (error) {
      console.error('Email reset error:', error);
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateResetForm()) return;

    // Verify code on frontend first
    if (!codeGenerationTime) {
      setErrors({ submit: "No verification code generated" });
      return;
    }

    const now = new Date();
    const expirationTime = new Date(codeGenerationTime.getTime() + 30 * 60000); // Add 30 minutes

    if (formData.token !== generatedCode) {
      setErrors({ submit: "Verification code is incorrect!" });
      return;
    }

    if (now > expirationTime) {
      setErrors({ submit: "Verification code has expired!" });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'reset',
          email,
          newPassword: formData.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ submit: data.message || 'Failed to reset password' });
        return;
      }

      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login?message=Password reset successfully! Please sign in with your new password.');
      }, 2000);

    } catch (error) {
      console.error('Password reset error:', error);
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleResendCode = async () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setCodeGenerationTime(new Date());
    setFormData(prev => ({ ...prev, token: '' }));
    setErrors({});

    try {
      // Get user info again for sending email
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request', email })
      });

      const data = await res.json();

      if (res.ok && data.resetToken) {
        await sendResetEmail(code, data.email, data.name);
        setMessage('New reset code has been sent to your email.');
      } else {
        setErrors({ submit: 'Failed to resend code. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'Failed to resend verification code. Please try again.' });
    }
  };

  return (
    <AuthCard
      title={step === 'email' ? 'Reset your password' : 'Enter new password'}
    >
      {step === 'email' ? (
        <form className="space-y-6" onSubmit={handleEmailSubmit}>
          <div className="text-sm text-gray-600 mb-4">
            Enter your email address and we'll send you a verification code to reset your password.
          </div>

          <AuthInput
            id="email"
            name="email"
            type="email"
            label="Email address"
            autoComplete="email"
            required
            value={email}
            onChange={handleChange}
            error={errors.email}
          />

          {message && (
            <div className="text-green-600 text-sm bg-green-50 border border-green-200 rounded-md px-3 py-2">
              {message}
            </div>
          )}

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
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Back to Sign in
            </Link>
          </div>
        </form>
      ) : (
        <form className="space-y-6" onSubmit={handleResetSubmit}>
          <div className="text-sm text-gray-600 mb-4">
            Enter the 6-digit verification code sent to <span className="font-medium">{email}</span> and your new password.
            <p className="mt-1 text-xs">
              The code will expire in 30 minutes.
            </p>
          </div>

          <AuthInput
            id="token"
            name="token"
            type="text"
            label="Verification Code"
            placeholder="Enter 6-digit code"
            required
            value={formData.token}
            onChange={handleChange}
            error={errors.token}
            maxLength={6}
          />

          <AuthInput
            id="password"
            name="password"
            type="password"
            label="New Password"
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
            label="Confirm New Password"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />

          {message && (
            <div className="text-green-600 text-sm bg-green-50 border border-green-200 rounded-md px-3 py-2">
              {message}
            </div>
          )}

          {errors.submit && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {errors.submit}
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </button>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleResendCode}
                className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Resend Code
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setFormData({ token: '', password: '', confirmPassword: '' });
                  setErrors({});
                  setMessage('');
                  setGeneratedCode('');
                  setCodeGenerationTime(null);
                }}
                className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Email
              </button>
            </div>
          </div>
        </form>
      )}
    </AuthCard>
  );
} 