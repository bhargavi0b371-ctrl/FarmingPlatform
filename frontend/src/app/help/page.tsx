'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function HelpPage() {
  const { t } = useI18n();

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
            <h1 className="text-2xl font-bold text-gray-900">{t('Help & Support')}</h1>
            <p className="text-sm text-gray-600">Get help and support for using EcoFarm.</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        {/* FAQ Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <details className="border border-slate-200 dark:border-slate-700 rounded-lg">
              <summary className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
                How do I add a farm?
              </summary>
              <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                You can add a new farm by clicking on the "Farms" menu and then the "Add Farm" button. Fill in the required details and click save.
              </div>
            </details>

            <details className="border border-slate-200 dark:border-slate-700 rounded-lg">
              <summary className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
                How do I get crop advisories?
              </summary>
              <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                Crop advisories are generated based on your farm location, crop type, and current weather conditions. Visit the "Advisories" section to view personalized recommendations.
              </div>
            </details>

            <details className="border border-slate-200 dark:border-slate-700 rounded-lg">
              <summary className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
                What is pest detection?
              </summary>
              <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                Our AI-powered pest detection system analyzes images of your crops to identify potential pest infestations early, helping you take preventive measures.
              </div>
            </details>
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">Contact Support</h2>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Email Support:</p>
              <a href="mailto:support@ecofarm.com" className="text-green-600 dark:text-green-400 hover:underline">
                support@ecofarm.com
              </a>
            </div>
            
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Phone Support:</p>
              <a href="tel:+919876543210" className="text-green-600 dark:text-green-400 hover:underline">
                +91-9876-543-210
              </a>
            </div>

            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Available Hours:</p>
              <p className="text-slate-700 dark:text-slate-300">Monday - Friday: 9:00 AM - 6:00 PM (IST)</p>
            </div>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}
