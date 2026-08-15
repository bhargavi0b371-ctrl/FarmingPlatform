'use client';

import { FormEvent, useEffect, useState } from 'react';
import TopNav from '../components/TopNav';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import api from '../../lib/api';

type Farm = {
  id: string;
  name: string;
  location: string;
  crop: string;
  area: string;
};

export default function FarmsPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [crop, setCrop] = useState('Rice');
  const [area, setArea] = useState('1 acre');

  const loadFarms = async () => {
    setLoading(true);
    const response = await api.farms.getAll();
    if (response.success && Array.isArray(response.data)) {
      setFarms(response.data as Farm[]);
    } else {
      setError(response.error || 'Unable to load farms.');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFarms();
  }, []);

  async function handleCreateFarm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const response = await api.farms.create({ name, location, crop, area });
    if (response.success && response.data) {
      await loadFarms();
      setName('');
      setLocation('');
      setCrop('Rice');
      setArea('1 acre');
    } else {
      setError(response.error || 'Failed to create farm.');
      setLoading(false);
    }
  }

  async function handleDeleteFarm(farmId: string) {
    if (!window.confirm('Remove this farm? This cannot be undone.')) {
      return;
    }
    setLoading(true);
    setError('');
    const response = await api.farms.delete(farmId);
    if (response.success) {
      await loadFarms();
    } else {
      setError(response.error || 'Failed to remove farm.');
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Farms</h1>
              <p className="text-sm text-gray-600">Manage farm records and land details for your advisory network.</p>
            </div>
            <TopNav />
          </div>
        </header>

        <main className="p-6 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.6fr] gap-6">
            <section className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Farm Records</h2>
                <p className="text-sm text-gray-500">Overview of farms registered in the platform.</p>
              </div>
            </div>

            {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Farm</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Crop</th>
                    <th className="px-4 py-3">Area</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-500">Loading farms...</td>
                    </tr>
                  ) : farms.length ? (
                    farms.map((farm) => (
                      <tr key={farm.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4 font-medium text-gray-900">{farm.name}</td>
                        <td className="px-4 py-4 text-gray-600">{farm.location}</td>
                        <td className="px-4 py-4 text-gray-600">{farm.crop}</td>
                        <td className="px-4 py-4 text-gray-600">{farm.area}</td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => handleDeleteFarm(farm.id)}
                            className="text-sm font-medium text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-500">No farms found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Add New Farm</h2>
              <p className="text-sm text-gray-500">Create a farm entry for your advisory system.</p>
            </div>
            <form className="space-y-4" onSubmit={handleCreateFarm}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Farm Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Enter farm name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Village, District"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Crop</label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option>Rice</option>
                    <option>Wheat</option>
                    <option>Maize</option>
                    <option>Cotton</option>
                    <option>Soybean</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Area</label>
                  <input
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm shadow-sm focus:border-green-500 focus:ring-green-500"
                    placeholder="Example: 2 acres"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Saving...' : 'Create Farm'}
              </button>
            </form>
            </section>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
