'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '../../lib/i18n';
import { useAuth } from '../../lib/auth';
import { useEffect } from 'react';

export default function TopNav() {
  const { t } = useI18n();
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { label: t('Dashboard'), href: '/dashboard' },
    { label: t('Farms'), href: '/farms' },
    { label: t('Weather'), href: '/weather' },
    { label: t('Market'), href: '/market' },
    { label: t('Advisories'), href: '/advisories' },
    { label: t('Crop Journey'), href: '/crop-journey' },
  ];

  // ensure pathname-driven active state works after client mount
  useEffect(() => {}, [pathname]);

  // Only show navigation if logged in
  if (!isLoggedIn) {
    return null;
  }

  return (
    <nav className="flex flex-wrap items-center gap-3">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
              isActive ? 'bg-green-600 text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
