'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface I18nContextType {
  locale: string;
  t: (key: string, fallback?: string, params?: Record<string, string | number>) => string;
  changeLanguage: (newLocale: string) => void;
  translations: Record<string, any>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: React.ReactNode;
  initialLocale?: string;
}

export function I18nProvider({ children, initialLocale = 'vi' }: I18nProviderProps) {
  const [locale, setLocale] = useState<string>('vi'); // Mặc định tiếng Việt
  const [translations, setTranslations] = useState<Record<string, any>>({});

  // Detect initial locale from localStorage or browser
  useEffect(() => {
    const detectInitialLocale = () => {
      // 1. Check localStorage first
      const savedLocale = localStorage.getItem('edutic-locale');
      if (savedLocale && ['en', 'vi'].includes(savedLocale)) {
        return savedLocale;
      }

      // 2. Check URL pathname
      const pathname = window.location.pathname;
      if (pathname.startsWith('/en')) {
        return 'en';
      }
      if (pathname.startsWith('/vi')) {
        return 'vi';
      }

      // 3. Check browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('vi')) {
        return 'vi';
      }

      // 4. Default to Vietnamese
      return 'vi';
    };

    const initialLang = detectInitialLocale();
    setLocale(initialLang);
  }, []);

  // Load translations for current locale
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${locale}/common.json`);
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback to empty object
        setTranslations({});
      }
    };

    if (locale) {
      loadTranslations();
    }
  }, [locale]);

  // Get nested translation value
  const getNestedValue = (obj: any, path: string): string => {
    return path.split('.').reduce((current, key) => current?.[key], obj) || path;
  };

  // Translation function with parameter substitution
  const t = (key: string, fallback?: string, params?: Record<string, string | number>): string => {
    let translation = getNestedValue(translations, key);
    
    // Use fallback if translation not found
    if (translation === key && fallback) {
      translation = fallback;
    }
    
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{{${param}}}`, String(params[param]));
      });
    }
    
    return translation;
  };

  const changeLanguage = (newLocale: string) => {
    if (['en', 'vi'].includes(newLocale)) {
      setLocale(newLocale);
      // Save to localStorage
      localStorage.setItem('edutic-locale', newLocale);
      
      // Don't change URL routing, just update the language context
      console.log(`Language changed to: ${newLocale}`);
    }
  };

  return (
    <I18nContext.Provider value={{ locale, t, changeLanguage, translations }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
} 