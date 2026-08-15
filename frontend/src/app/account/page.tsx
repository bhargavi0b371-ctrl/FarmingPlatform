'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import api from '../../lib/api';

export default function AccountPage() {
  const { t } = useI18n();
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      const response = await api.auth.getProfile();
      if (response.success && response.data) {
        const user = response.data as any;
        setProfile({
          name: user.name || '',
          email: user.email || user.contact || '',
          phone: user.phone || user.contact || '',
        });
      } else {
        setError(response.error || 'Unable to load profile.');
      }
      setLoading(false);
    };
    loadProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            {t('Dashboard')}
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('Account')}</h1>
            <p className="text-sm text-gray-600">Manage your account information and preferences.</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-200">{error}</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input 
              type="email" 
              value={loading ? 'Loading...' : profile.email}
              className="mt-2 w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Phone</label>
            <input 
              type="tel" 
              value={loading ? 'Loading...' : profile.phone}
              className="mt-2 w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
            <input 
              type="text" 
              value={loading ? 'Loading...' : profile.name}
              className="mt-2 w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
              disabled
            />
          </div>

          <div className="pt-4">
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              {loading ? 'Loading...' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}
