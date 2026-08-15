"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import ta from '../locales/ta.json';
import te from '../locales/te.json';
import ml from '../locales/ml.json';
import { AuthProvider } from './auth';

type Locale = 'en' | 'hi' | 'ta' | 'te' | 'ml';

type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

const translations: Record<Locale, Record<string, string>> = {
  en,
  hi,
  ta,
  te,
  ml,
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function Providers({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => (typeof window !== 'undefined' ? (localStorage.getItem('locale') as Locale) || 'en' : 'en'));
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (typeof window !== 'undefined' ? ((localStorage.getItem('theme') as 'light' | 'dark') || 'light') : 'light'));

  useEffect(() => {
    try {
      localStorage.setItem('locale', locale);
    } catch (e) {}
  }, [locale]);

  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {}
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  const value = useMemo(() => {
    return {
      locale,
      setLocale: (l: Locale) => setLocale(l),
      t: (key: string) => translations[locale][key] || key,
      theme,
      toggleTheme: () => setTheme((s) => (s === 'light' ? 'dark' : 'light')),
    };
  }, [locale, theme]);

  return <AuthProvider><I18nContext.Provider value={value}>{children}</I18nContext.Provider></AuthProvider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within Providers');
  return ctx;
}

export default Providers;
