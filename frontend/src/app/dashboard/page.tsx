'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopNav from '../components/TopNav';
import SettingsMenu from '../components/SettingsMenu';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import api from '../../lib/api';
import { Users, User, Sprout, Camera, Bell, TrendingUp, Cloud, AlertTriangle, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type WeatherState = {
  temperature?: number;
  condition?: string;
  humidity?: number;
  wind?: number;
  rain?: number;
};

type TopCrop = {
  crop: string;
  count: number;
  avgPrice: number;
};

const priceData = [
  { name: 'Jan', price: 2500 },
  { name: 'Feb', price: 2800 },
  { name: 'Mar', price: 2600 },
  { name: 'Apr', price: 3100 },
  { name: 'May', price: 3400 },
  { name: 'Jun', price: 3200 },
];

const defaultAdvisories = [
  { id: 1, title: 'Irrigation Alert', message: 'Reduce irrigation due to expected rainfall', priority: 'high', time: '2h ago' },
  { id: 2, title: 'Fertilizer Application', message: 'Apply 2nd dose of urea for wheat crop', priority: 'normal', time: '4h ago' },
  { id: 3, title: 'Pest Warning', message: 'Armyworm detected nearby. Monitor crops.', priority: 'urgent', time: '1d ago' },
];

const fallbackMarketPrices = [
  { crop: 'Rice', mandi: 'Pune', price: 3250, change: 2.5 },
  { crop: 'Wheat', mandi: 'Indore', price: 2400, change: -1.2 },
  { crop: 'Cotton', mandi: 'Nagpur', price: 6200, change: 3.8 },
  { crop: 'Maize', mandi: 'Bangalore', price: 2000, change: 1.5 },
];

export default function DashboardPage() {
  const router = useRouter();
  const [backendStatus, setBackendStatus] = useState('Checking connection...');
  const [backendError, setBackendError] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherState>({ condition: 'Loading', humidity: 0, wind: 0, rain: 0 });
  const [topCropsData, setTopCropsData] = useState<TopCrop[]>([]);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(0);
  const [showPestUpload, setShowPestUpload] = useState(false);
  const [pestImage, setPestImage] = useState<string>('');
  const [pestDetecting, setPestDetecting] = useState(false);
  const [pestResult, setPestResult] = useState('');
  const [showCropForm, setShowCropForm] = useState(false);
  const [cropName, setCropName] = useState('');
  const [cropArea, setCropArea] = useState('');

  const stats = [
    { label: 'Total Farmers', value: '1,250', icon: Users, change: '+12%', color: 'bg-green-50 text-green-600' },
    { label: 'Active Farms', value: '1,850', icon: Sprout, change: '+8%', color: 'bg-blue-50 text-blue-600' },
    { label: 'Pest Reports', value: '320', icon: Camera, change: '-5%', color: 'bg-orange-50 text-orange-600' },
    { label: 'Unread Alerts', value: unreadAlertsCount.toString(), icon: Bell, change: '', color: 'bg-red-50 text-red-600' },
  ];

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [healthResponse, weatherResponse, topCropsResponse, notificationsResponse] = await Promise.all([
          api.health.getStatus(),
          api.weather.getCurrent(12.97, 77.59),
          api.market.getTopCrops(),
          api.notifications.getUnreadCount(),
        ]);

        if (healthResponse.success && healthResponse.data) {
          setBackendStatus((healthResponse.data as any).status || 'Healthy');
        } else {
          setBackendStatus('Backend unreachable');
          setBackendError(healthResponse.error || 'Unable to fetch backend status');
        }

        if (weatherResponse.success && weatherResponse.data) {
          const weather = weatherResponse.data as any;
          setWeatherData({
            temperature: weather.temperature_c,
            condition: weather.weather_condition || 'Clear',
            humidity: weather.humidity_percent,
            wind: weather.wind_speed_kmh,
            rain: weather.rainfall_mm,
          });
        }

        if (topCropsResponse.success && Array.isArray(topCropsResponse.data)) {
          setTopCropsData(topCropsResponse.data as TopCrop[]);
        }

        if (notificationsResponse.success && notificationsResponse.data) {
          setUnreadAlertsCount((notificationsResponse.data as any).count || 0);
        }
      } catch (error) {
        setBackendStatus('Backend error');
        setBackendError((error as Error).message);
      }
    }

    loadDashboardData();
  }, []);

  async function handleDetectPest() {
    if (!pestImage) return;
    setPestDetecting(true);
    const response = await api.pestDetection.detect(pestImage);
    if (response.success && response.data) {
      const detection = response.data as any;
      setPestResult(`Detected: ${detection.pest_name || 'Unknown'} (${(detection.confidence * 100).toFixed(1)}% confidence)`);
    } else {
      setPestResult('Unable to detect pest. Please try again.');
    }
    setPestDetecting(false);
  }

  async function handleAddCrop() {
    if (!cropName || !cropArea) return;
    await api.farms.create({ name: cropName, crop: cropName, area: cropArea, location: 'Field' });
    setCropName('');
    setCropArea('');
    setShowCropForm(false);
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 relative">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">EcoFarm Dashboard</h1>
              <span className="inline-flex mt-1 items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {backendStatus}
              </span>
            </div>
          </div>

          <TopNav />

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Link href="/account" className="rounded-full p-2 text-gray-600 hover:bg-gray-100 transition-colors">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Link>
            <SettingsMenu />
          </div>
        </div>
      </header>

      <main className="p-6">
        {backendError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {backendError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  {stat.change && (
                    <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} from last month
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Market Price Trend - Rice</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Cloud className="h-8 w-8" />
              <div>
                <p className="text-sm text-sky-100">Current Weather</p>
                <p className="text-3xl font-bold">{weatherData.temperature !== undefined ? `${weatherData.temperature.toFixed(0)}°C` : '--'}</p>
              </div>
            </div>
            <p className="text-sky-100 mb-4">{weatherData.condition || 'Loading weather...'}</p>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-sky-400">
              <div className="text-center">
                <p className="text-xs text-sky-200">Humidity</p>
                <p className="font-semibold">{weatherData.humidity ?? '--'}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-sky-200">Wind</p>
                <p className="font-semibold">{weatherData.wind ? `${weatherData.wind.toFixed(0)} km/h` : '--'}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-sky-200">Rain</p>
                <p className="font-semibold">{weatherData.rain !== undefined ? `${weatherData.rain} mm` : '--'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Advisories</h2>
              <a href="/advisories" className="text-sm text-green-600 hover:underline">View all</a>
            </div>
            <div className="space-y-3">
              {defaultAdvisories.map((advisory) => (
                <div key={advisory.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-lg ${
                    advisory.priority === 'urgent' ? 'bg-red-100 text-red-600' :
                    advisory.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {advisory.priority === 'urgent' ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{advisory.title}</p>
                    <p className="text-sm text-gray-500">{advisory.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{advisory.time}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    advisory.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                    advisory.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {advisory.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Top Market Prices</h2>
              <a href="/market" className="text-sm text-green-600 hover:underline">View all</a>
            </div>
            <div className="space-y-3">
              {(topCropsData.length ? topCropsData : fallbackMarketPrices).map((item, i) => {
                const displayPrice = 'avgPrice' in item ? item.avgPrice : (item as any).price;
                const displayCount = 'count' in item ? item.count : undefined;
                return (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.crop}</p>
                      <p className="text-sm text-gray-500">Top demand</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">INR {displayPrice?.toLocaleString?.() ?? '--'}</p>
                      <p className="text-sm flex items-center gap-1 text-green-600">
                        <TrendingUp className="h-3 w-3" />
                        {displayCount ? `${displayCount} records` : 'Market data'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setShowPestUpload(true)}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="bg-orange-500 p-3 rounded-lg">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Detect Pest</span>
            </button>
            <button
              onClick={() => setShowCropForm(true)}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="bg-green-500 p-3 rounded-lg">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Add Crop</span>
            </button>
            <button
              onClick={() => router.push('/weather')}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="bg-sky-500 p-3 rounded-lg">
                <Cloud className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Weather</span>
            </button>
            <button
              onClick={() => router.push('/market')}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="bg-indigo-500 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Prices</span>
            </button>
          </div>
        </div>

        {/* Pest Detection Modal */}
        {showPestUpload && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Detect Pest</h3>
                <button onClick={() => setShowPestUpload(false)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL or Upload</label>
                  <input
                    type="text"
                    placeholder="Enter image URL"
                    value={pestImage}
                    onChange={(e) => setPestImage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                {pestResult && (
                  <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                    {pestResult}
                  </div>
                )}
                <button
                  onClick={handleDetectPest}
                  disabled={!pestImage || pestDetecting}
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pestDetecting ? 'Detecting...' : 'Detect'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Crop Modal */}
        {showCropForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add Crop</h3>
                <button onClick={() => setShowCropForm(false)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Crop Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Rice, Wheat"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Area (acres)</label>
                  <input
                    type="text"
                    placeholder="e.g., 2 acres"
                    value={cropArea}
                    onChange={(e) => setCropArea(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <button
                  onClick={handleAddCrop}
                  disabled={!cropName || !cropArea}
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Crop
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
    </ProtectedRoute>
  );
}
