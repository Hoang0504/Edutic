'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface GoogleSignInProps {
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  type?: 'login' | 'register';
}

export default function GoogleSignIn({ onSuccess, onError, type = 'login' }: GoogleSignInProps) {
  const { login } = useAuth();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const initializeGoogleSignIn = () => {
      if (typeof window !== 'undefined' && window.google && googleButtonRef.current) {
        // Initialize Google One Tap
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Render the button
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: type === 'login' ? 'signin_with' : 'signup_with',
          }
        );

        initialized.current = true;
      }
    };

    const handleCredentialResponse = async (response: any) => {
      try {
        // Send the token to our backend
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: response.credential,
          }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          // Use the login function from AuthContext
          login(data.data.token, data.data.user);
          onSuccess?.(data);
        } else {
          onError?.(data);
        }
      } catch (error) {
        console.error('Google Sign In error:', error);
        onError?.(error);
      }
    };

    // Load Google script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.head.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }

    return () => {
      // Cleanup
      if (window.google && window.google.accounts) {
        try {
          window.google.accounts.id.cancel();
        } catch (error) {
          // Ignore errors during cleanup
        }
      }
    };
  }, [login, onSuccess, onError, type]);

  return (
    <div className="w-full">
      <div ref={googleButtonRef} className="w-full"></div>
    </div>
  );
}

// Add Google types
declare global {
  interface Window {
    google: any;
  }
} 