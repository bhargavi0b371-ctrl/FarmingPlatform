'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../lib/api';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import CreateCropJourneyForm from '../components/CreateCropJourneyForm';
import CropJourneyCard from '../components/CropJourneyCard';

export default function CropJourneyPage() {
  const [journeys, setJourneys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadJourneys = async () => {
    setLoading(true);
    const res = await api.cropJourney.list();
    if (res.success && res.data) setJourneys(res.data as any[]);
    setLoading(false);
  };

  useEffect(() => {
    loadJourneys();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-6xl mx-auto">
        {/* Back to Dashboard */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg transition-colors border border-slate-200 dark:border-slate-700">
          <span>←</span>
          <span>Back to Dashboard</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">🌾 Crop Journey Tracker</h1>
          <p className="text-slate-600 dark:text-slate-400">Monitor your crops from seed to harvest with real-time tracking and AI insights</p>
        </div>

        {/* Create New Journey Form */}
        <CreateCropJourneyForm onSuccess={loadJourneys} />

        {/* Active Journeys */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Your Active Journeys</h2>
          
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-lg text-slate-600 dark:text-slate-400">Loading journeys...</div>
            </div>
          )}

          {!loading && journeys.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No Active Journeys Yet</h3>
              <p className="text-slate-600 dark:text-slate-400">Create your first crop journey above to get started!</p>
            </div>
          )}

          <div className="space-y-6">
            {journeys.map((journey) => (
              <CropJourneyCard key={journey.id} journey={journey} />
            ))}
          </div>
        </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
