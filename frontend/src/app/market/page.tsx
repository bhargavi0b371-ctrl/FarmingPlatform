'use client';

import { useEffect, useState } from 'react';
import TopNav from '../components/TopNav';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import api from '../../lib/api';
import { ArrowUpRight, ArrowDownRight, BarChart3 } from 'lucide-react';

type MarketPrice = {
  crop: string;
  mandi: string;
  price: number;
  change: number;
};

export default function MarketPage() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPrices() {
      const response = await api.market.getPrices();
      if (response.success && Array.isArray(response.data)) {
        setPrices(response.data as MarketPrice[]);
      } else {
        setError(response.error || 'Unable to load market data.');
      }
      setLoading(false);
    }

    loadPrices();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Market</h1>
              <p className="text-sm text-gray-600">Live price data and commodity trends for farmers.</p>
            </div>
            <TopNav />
          </div>
        </header>

        <main className="p-6 space-y-6">
        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <section className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.75fr] gap-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Commodity Prices</h2>
                <p className="text-sm text-gray-500">Review latest mandi rates across key crops.</p>
              </div>
              <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">Updated daily</div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Crop</th>
                    <th className="px-4 py-3">Mandi</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-gray-500">Loading market prices...</td>
                    </tr>
                  ) : prices.length ? (
                    prices.map((item) => (
                      <tr key={`${item.crop}-${item.mandi}`} className="hover:bg-slate-50">
                        <td className="px-4 py-4 font-medium text-gray-900">{item.crop}</td>
                        <td className="px-4 py-4 text-gray-600">{item.mandi}</td>
                        <td className="px-4 py-4 text-gray-900">₹{item.price.toLocaleString()}</td>
                        <td className={`px-4 py-4 font-medium ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.change >= 0 ? <ArrowUpRight className="inline h-4 w-4" /> : <ArrowDownRight className="inline h-4 w-4" />}
                          {item.change}%
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-gray-500">No market prices available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4 text-slate-700">
              <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Price summary</p>
                <p className="text-xs text-gray-500">Compare changes over key crops.</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase text-slate-400">Highest price</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">₹6,200</p>
                <p className="text-sm text-gray-500">Cotton in Nagpur</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase text-slate-400">Average change</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">+1.9%</p>
                <p className="text-sm text-gray-500">Across monitored crops</p>
              </div>
            </div>
            </aside>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
