"use client";

import React from 'react';
import { useI18n } from '../../lib/i18n';

export default function QuickActions() {
  const { locale, setLocale, theme, toggleTheme } = useI18n();

  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-2">
        <label htmlFor="quick-lang" className="sr-only">
          Language
        </label>
        <select
          id="quick-lang"
          value={locale}
          onChange={(e) => setLocale(e.target.value as any)}
          className="rounded-md border px-2 py-1 text-sm"
        >
          <option value="en">EN</option>
          <option value="hi">HI</option>
          <option value="ta">TA</option>
          <option value="te">TE</option>
          <option value="ml">ML</option>
        </select>
      </div>

      <div>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="rounded-md border px-3 py-1 text-sm"
        >
          {theme === 'dark' ? 'Dark' : 'Light'}
        </button>
      </div>
    </div>
  );
}
