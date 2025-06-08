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
        to_name: userName,
        verification_code: resetToken,
        app_name: 'Edutic',
        Edutic: 'Edutic',
        time: new Date().toLocaleString('vi-VN', {
          timeZone: 'Asia/Ho_Chi_Minh',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
        email_type: "password_reset",
        subject: "Reset Your Edutic Password",
        greeting: `Hello ${userName},`,
        main_message: "We received a request to reset your password for your Edutic account. Use the verification code below to reset your password.",
        action_text: "reset your password",
        code_label: "Your password reset code is:",
        footer_message: "If you didn't request a password reset, please ignore this email. Your password will remain unchanged.",
        additional_info: "This code will expire in 1 hour for security reasons."
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

      // If we have a reset token, send the email
      if (data.resetToken) {
        try {
          await sendResetEmail(data.resetToken, data.email, data.name);
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

    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'reset',
          email,
          token: formData.token,
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
        router.push('/login');
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

            <button
              type="button"
              onClick={() => {
                setStep('email');
                setFormData({ token: '', password: '', confirmPassword: '' });
                setErrors({});
                setMessage('');
              }}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Email Entry
            </button>
          </div>
        </form>
      )}
    </AuthCard>
  );
} 