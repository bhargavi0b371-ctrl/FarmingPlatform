'use client'
import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function CreateCropJourneyForm({ onSuccess }: { onSuccess: () => void }) {
  const [cropName, setCropName] = useState('');
  const [farmId, setFarmId] = useState('');
  const [farms, setFarms] = useState<any[]>([]);
  const [farmLocation, setFarmLocation] = useState('');
  const [datePlanted, setDatePlanted] = useState('');
  const [estimatedHarvest, setEstimatedHarvest] = useState('');
  const [expectedYield, setExpectedYield] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFarms = async () => {
      const res = await api.farms.getAll();
      if (res.success && res.data) {
        const farmList = res.data as any[];
        setFarms(farmList);
        if (!farmId && farmList.length > 0) {
          setFarmId(farmList[0].id);
        }
      }
    };
    loadFarms();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        cropName,
        farmId: farmId || farms[0]?.id,
        notes: `Location: ${farmLocation}`,
        estimatedHarvest,
        expectedYieldKg: expectedYield ? parseFloat(expectedYield) : null,
        datePlanted,
      };
      const res = await api.cropJourney.create(payload);
      if (res.success) {
        setCropName('');
        setFarmId('');
        setFarmLocation('');
        setDatePlanted('');
        setEstimatedHarvest('');
        setExpectedYield('');
        onSuccess();
      } else {
        setError(res.error || 'Failed to create journey');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-lg border border-green-100 dark:border-slate-700 mb-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Start a New Crop Journey</h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Crop Name *</label>
          <input
            type="text"
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            placeholder="e.g., Wheat, Rice, Corn"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Farm *</label>
          <select
            value={farmId}
            onChange={(e) => setFarmId(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            required
          >
            <option value="" disabled={farms.length > 0}>
              {farms.length ? 'Choose a farm...' : 'No farms available. Add one first.'}
            </option>
            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name} — {farm.crop} ({farm.location})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Farm Location</label>
          <input
            type="text"
            value={farmLocation}
            onChange={(e) => setFarmLocation(e.target.value)}
            placeholder="e.g., Field A, North 40"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Date Planted *</label>
          <input
            type="date"
            value={datePlanted}
            onChange={(e) => setDatePlanted(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Estimated Harvest Date *</label>
          <input
            type="date"
            value={estimatedHarvest}
            onChange={(e) => setEstimatedHarvest(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Expected Yield (kg)</label>
          <input
            type="number"
            value={expectedYield}
            onChange={(e) => setExpectedYield(e.target.value)}
            placeholder="e.g., 500"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>
      </div>

      <button
        disabled={submitting || !cropName || !farmId || !datePlanted || !estimatedHarvest}
        type="submit"
        className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg disabled:opacity-50 transition-all"
      >
        {submitting ? 'Creating Journey...' : 'Start Journey'}
      </button>
    </form>
  );
}
