'use client';

import { useI18n } from '../../lib/i18n';
import { useAuth } from '../../lib/auth';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SettingsMenu() {
  const { t, locale, setLocale, theme, toggleTheme } = useI18n();
  const { isLoggedIn, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Don't show settings menu if not logged in
  if (!isLoggedIn) {
    return null;
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleLanguageChange = (lang: 'en' | 'hi' | 'ta' | 'te' | 'ml') => {
    setLocale(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Settings Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('Settings')}
        className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-slate-700 dark:text-slate-300"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6"></path>
          <path d="M4.22 4.22l4.24 4.24m1.08 1.08l4.24 4.24"></path>
          <path d="M1 12h6m6 0h6"></path>
          <path d="M4.22 19.78l4.24-4.24m1.08-1.08l4.24-4.24"></path>
          <path d="M12 17v6"></path>
          <path d="M19.78 19.78l-4.24-4.24m-1.08-1.08l-4.24-4.24"></path>
          <path d="M23 12h-6"></path>
          <path d="M19.78 4.22l-4.24 4.24m-1.08 1.08l-4.24 4.24"></path>
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-lg z-50 py-2">
          {/* Language Section */}
          <div className="px-4 py-2 border-b dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              {t('Language')}
            </p>
            <div className="flex flex-wrap gap-2">
              {(['en', 'hi', 'ta', 'te', 'ml'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    locale === lang
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Section */}
          <div className="px-4 py-2 border-b dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              {t('Theme')}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (theme === 'dark') toggleTheme();
                }}
                className={`flex-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
                  theme === 'light'
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                ☀️ {t('Light')}
              </button>
              <button
                onClick={() => {
                  if (theme === 'light') toggleTheme();
                }}
                className={`flex-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                🌙 {t('Dark')}
              </button>
            </div>
          </div>

          {/* Account Section */}
          <Link
            href="/account"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            👤 {t('Account')}
          </Link>

          {/* Help & Support Section */}
          <Link
            href="/help"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            ❓ {t('Help & Support')}
          </Link>

          {/* Logout Section */}
          <div className="border-t dark:border-slate-700 pt-2">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              🚪 {t('Logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
