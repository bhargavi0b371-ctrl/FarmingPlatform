'use client';

import { useEffect, useState } from 'react';
import TopNav from '../components/TopNav';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import api from '../../lib/api';
import { CloudSnow, Sun, CloudRain, AlertTriangle } from 'lucide-react';

type WeatherState = {
  temperature?: number;
  condition?: string;
  humidity?: number;
  wind?: number;
  rain?: number;
};

type WeatherAlert = {
  title: string;
  description: string;
  severity: string;
};

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherState>({});
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadWeather() {
      try {
        const [currentResponse, alertsResponse] = await Promise.all([
          api.weather.getCurrent(12.97, 77.59),
          api.weather.getAlerts(12.97, 77.59),
        ]);

        if (currentResponse.success && currentResponse.data) {
          const current = currentResponse.data as any;
          setWeather({
            temperature: current.temperature_c,
            condition: current.weather_condition,
            humidity: current.humidity_percent,
            wind: current.wind_speed_kmh,
            rain: current.rainfall_mm,
          });
        } else {
          setError(currentResponse.error || 'Unable to load weather');
        }

        if (alertsResponse.success && Array.isArray(alertsResponse.data)) {
          setAlerts(alertsResponse.data as WeatherAlert[]);
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }

    loadWeather();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Weather</h1>
              <p className="text-sm text-gray-600">Real-time weather conditions and field alerts.</p>
            </div>
            <TopNav />
          </div>
        </header>

        <main className="p-6 space-y-6">
        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.7fr] gap-6">
          <section className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Current Conditions</h2>
                <p className="text-sm text-gray-500">Updated from the weather service.</p>
              </div>
              <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-700">Bengaluru, India</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-3xl bg-slate-50 p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-green-100 p-3 text-green-700">
                    <Sun className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Temperature</p>
                    <p className="mt-1 text-4xl font-semibold text-gray-900">{weather.temperature !== undefined ? `${weather.temperature.toFixed(0)}°C` : '--'}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                    <CloudRain className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rain / Humidity</p>
                    <p className="mt-1 text-xl font-semibold text-gray-900">{weather.rain !== undefined ? `${weather.rain} mm` : '--'} / {weather.humidity ?? '--'}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-xs uppercase text-slate-400">Condition</p>
                <p className="mt-3 text-lg font-semibold text-gray-900">{weather.condition || 'Unknown'}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-xs uppercase text-slate-400">Wind</p>
                <p className="mt-3 text-lg font-semibold text-gray-900">{weather.wind ? `${weather.wind.toFixed(0)} km/h` : '--'}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-xs uppercase text-slate-400">Sunrise</p>
                <p className="mt-3 text-lg font-semibold text-gray-900">6:02 AM</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Weather Alerts</h2>
                <p className="text-sm text-gray-500">Stay ahead of field risks.</p>
              </div>
              <div className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">{alerts.length} alerts</div>
            </div>

            {loading ? (
              <div className="text-sm text-gray-500">Loading alerts...</div>
            ) : alerts.length ? (
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div key={index} className="rounded-3xl bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-orange-100 p-2 text-orange-700">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{alert.title}</p>
                        <p className="text-sm text-gray-500">{alert.severity}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-600">{alert.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-500">No alerts for your current region.</div>
            )}
          </section>
        </div>
      </main>
      </div>
    </ProtectedRoute>
  );
}
